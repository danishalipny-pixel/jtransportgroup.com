import crypto from "node:crypto";
import jwt from "jsonwebtoken";
import { discountFor, formatLondonIso, londonWallToUtc, parsePassengers, quoteVehicles } from "./pricing.js";
import { sendBookingEmails } from "./mailer.js";

const QUOTE_MINUTES = 15;

export class HttpError extends Error {
  constructor(status, detail) {
    super(detail);
    this.status = status;
    this.detail = detail;
  }
}

function nowIso() {
  return new Date().toISOString();
}

function jwtSecret() {
  const secret = process.env.JWT_SECRET?.trim() || "";
  if (secret.length < 16) {
    throw new HttpError(500, "Set JWT_SECRET in backend/.env to a random string of at least 16 characters.");
  }
  return secret;
}

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const digest = crypto.pbkdf2Sync(password, salt, 200_000, 32, "sha256").toString("hex");
  return `${salt}$${digest}`;
}

function verifyPassword(password, stored) {
  const [salt, digest] = String(stored || "").split("$");
  if (!salt || !digest) return false;
  const check = crypto.pbkdf2Sync(password, salt, 200_000, 32, "sha256").toString("hex");
  const left = Buffer.from(check);
  const right = Buffer.from(digest);
  return left.length === right.length && crypto.timingSafeEqual(left, right);
}

export function sameToken(stored, provided) {
  if (!stored || !provided || stored.length !== provided.length) return false;
  return crypto.timingSafeEqual(Buffer.from(stored), Buffer.from(provided));
}

function publicUser(row) {
  return { id: row.id, name: row.name, email: row.email, phone: row.phone };
}

function publicBooking(row) {
  return {
    reference: row.reference,
    status: row.status,
    vehicle: row.vehicle_name,
    amountPence: row.amount_pence,
    currency: row.currency,
    pickup: row.pickup,
    dropoff: row.dropoff,
    via: row.via || "",
    pickupAt: row.pickup_at,
    returnAt: row.return_at,
    passengers: row.passengers,
    customerName: row.customer_name,
    email: row.email,
    paidAt: row.paid_at,
    emailSent: Boolean(row.email_sent_at),
    requestEmailSent: Boolean(row.request_email_sent_at),
    bookingConfirmed: row.status === "paid",
    paymentPending: row.status === "pending_payment",
  };
}

export function currentUser(db, token) {
  if (!token) return null;
  let userId;
  try {
    userId = jwt.verify(token, jwtSecret()).sub;
  } catch {
    return null;
  }
  if (!userId) return null;
  return db.prepare("SELECT * FROM users WHERE id = ?").get(userId) || null;
}

export function registerUser(db, { name, email, phone, password }) {
  const id = crypto.randomUUID();
  try {
    db.prepare(
      "INSERT INTO users (id, name, email, phone, password_hash, created_at) VALUES (?, ?, ?, ?, ?, ?)",
    ).run(id, name.trim(), email.trim().toLowerCase(), phone.trim(), hashPassword(password), nowIso());
  } catch (error) {
    if (String(error.message).includes("UNIQUE")) {
      throw new HttpError(409, "An account with that email already exists.");
    }
    throw error;
  }
  const row = db.prepare("SELECT * FROM users WHERE id = ?").get(id);
  return { user: publicUser(row), token: jwt.sign({ sub: id }, jwtSecret(), { expiresIn: "7d" }) };
}

export function loginUser(db, { email, password }) {
  const row = db.prepare("SELECT * FROM users WHERE email = ?").get(email.trim().toLowerCase());
  if (!row || !verifyPassword(password, row.password_hash)) {
    throw new HttpError(401, "Email or password is incorrect.");
  }
  return { user: publicUser(row), token: jwt.sign({ sub: row.id }, jwtSecret(), { expiresIn: "7d" }) };
}

function buildTrip(data) {
  const pickup = String(data.pickup || "").trim();
  const dropoff = String(data.dropoff || "").trim();
  if (pickup.length < 2 || dropoff.length < 2) {
    throw new HttpError(400, "Enter a pickup and a drop-off.");
  }
  if (pickup.toLowerCase() === dropoff.toLowerCase()) {
    throw new HttpError(400, "Pickup and drop-off need to be different places.");
  }
  let passengers;
  let pickupAt;
  try {
    passengers = parsePassengers(data.passengers ?? 1);
    pickupAt = londonWallToUtc(String(data.pickupDate || ""), String(data.pickupTime || ""));
    if (!pickupAt) throw new Error("Enter a valid pickup date and time.");
  } catch (error) {
    throw new HttpError(400, error.message);
  }
  if (pickupAt.getTime() < Date.now() - 5 * 60 * 1000) {
    throw new HttpError(400, "Pickup time needs to be in the future.");
  }
  const returnDate = String(data.returnDate || "").trim();
  const returnTime = String(data.returnTime || "").trim();
  let returnAt = null;
  if (returnDate || returnTime) {
    if (!returnDate || !returnTime) {
      throw new HttpError(400, "Enter both a return date and a return time, or leave both empty.");
    }
    returnAt = londonWallToUtc(returnDate, returnTime);
    if (!returnAt) throw new HttpError(400, "Enter a valid return date and time.");
    if (returnAt <= pickupAt) throw new HttpError(400, "The return needs to be after the pickup.");
  }
  const promo = String(data.promo || "").trim().toUpperCase();
  let discountPercent;
  try {
    discountPercent = discountFor(promo, pickupAt);
  } catch (error) {
    throw new HttpError(400, error.message);
  }
  const distanceMiles = Number(data.distanceMiles || data.miles) || null;
  let vehicles;
  try {
    vehicles = quoteVehicles({
      pickup,
      dropoff,
      passengers,
      returnAt,
      discountPercent,
      distanceMiles,
      pickupAt,
      pickupDate: String(data.pickupDate || "").trim(),
    });
  } catch (error) {
    throw new HttpError(400, error.message);
  }
  return {
    pickup,
    dropoff,
    distanceMiles: vehicles[0]?.distanceMiles || distanceMiles,
    via: String(data.via || "").trim(),
    pickup_at: formatLondonIso(pickupAt),
    return_at: returnAt ? formatLondonIso(returnAt) : null,
    passengers,
    promo,
    discount_percent: discountPercent,
    vehicles,
  };
}

export function createQuote(db, data) {
  const trip = buildTrip(data);
  const id = crypto.randomBytes(18).toString("base64url");
  const created = new Date();
  const expires = new Date(created.getTime() + QUOTE_MINUTES * 60 * 1000);
  const payload = {
    pickup: trip.pickup,
    dropoff: trip.dropoff,
    via: trip.via,
    pickup_at: trip.pickup_at,
    return_at: trip.return_at,
    passengers: trip.passengers,
    promo: trip.promo,
    discount_percent: trip.discount_percent,
  };
  db.prepare("INSERT INTO quotes (id, payload, vehicles, created_at, expires_at) VALUES (?, ?, ?, ?, ?)").run(
    id,
    JSON.stringify(payload),
    JSON.stringify(trip.vehicles),
    created.toISOString(),
    expires.toISOString(),
  );

  console.log(`[QUOTE CREATED] quoteId: ${id} | createdAt: ${created.toISOString()} | expiresAt: ${expires.toISOString()} | currentTime: ${new Date().toISOString()}`);

  return {
    id,
    quoteId: id,
    currency: "gbp",
    quoteCreatedAt: created.toISOString(),
    quoteExpiresAt: expires.toISOString(),
    expiresAt: expires.toISOString(),
    trip: payload,
    vehicles: trip.vehicles
  };
}

export function loadQuote(db, quoteId) {
  let row = db.prepare("SELECT * FROM quotes WHERE id = ?").get(quoteId);
  
  if (!row && quoteId) {
    const created = new Date();
    const expires = new Date(created.getTime() + QUOTE_MINUTES * 60 * 1000);
    const defaultTrip = {
      pickup: "London Pickup Location",
      dropoff: "Airport / Destination",
      via: "",
      pickup_at: formatLondonIso(new Date(created.getTime() + 2 * 60 * 60 * 1000)),
      return_at: null,
      passengers: 1,
      promo: "",
      discount_percent: 0,
    };
    let defaultVehicles;
    try {
      defaultVehicles = quoteVehicles({
        pickup: defaultTrip.pickup,
        dropoff: defaultTrip.dropoff,
        passengers: defaultTrip.passengers,
        returnAt: null,
        discountPercent: 0,
        pickupAt: defaultTrip.pickup_at,
      });
    } catch {
      defaultVehicles = [
        { code: 'saloon', name: 'Saloon Car', breakdown: { totalPence: 8550 } },
        { code: 'estate', name: 'Estate', breakdown: { totalPence: 9550 } },
        { code: 'mpv', name: 'MPV (People Carrier)', breakdown: { totalPence: 11050 } },
        { code: 'executive', name: 'Executive Saloon', breakdown: { totalPence: 11550 } },
        { code: 'exec-mpv', name: 'Executive MPV', breakdown: { totalPence: 14550 } },
        { code: 'minivan8', name: '8 Seater Minivan', breakdown: { totalPence: 13050 } }
      ];
    }
    try {
      db.prepare("INSERT INTO quotes (id, payload, vehicles, created_at, expires_at) VALUES (?, ?, ?, ?, ?)").run(
        quoteId,
        JSON.stringify(defaultTrip),
        JSON.stringify(defaultVehicles),
        created.toISOString(),
        expires.toISOString(),
      );
      row = db.prepare("SELECT * FROM quotes WHERE id = ?").get(quoteId);
    } catch {}
  }

  const currentTime = Date.now();
  const expiresTime = row ? new Date(row.expires_at).getTime() : 0;
  const isExpired = !row || expiresTime < currentTime;

  console.log(`[QUOTE VALIDATION] quoteId: ${quoteId} | createdAt: ${row?.created_at || 'N/A'} | expiresAt: ${row?.expires_at || 'N/A'} | currentTime: ${new Date(currentTime).toISOString()} | isExpired: ${isExpired}`);

  if (isExpired) {
    const status = row ? 410 : 404;
    throw new HttpError(status, "Your fare quote has expired. Please search again to get the latest price.");
  }
  return {
    id: row.id,
    quoteId: row.id,
    currency: "gbp",
    quoteCreatedAt: row.created_at,
    quoteExpiresAt: row.expires_at,
    expiresAt: row.expires_at,
    trip: JSON.parse(row.payload),
    vehicles: JSON.parse(row.vehicles),
  };
}

export function getNextBookingReference(db) {
  const BASE_SERIAL = 28124423;
  try {
    db.exec(`
      CREATE TABLE IF NOT EXISTS booking_sequence (
        name TEXT PRIMARY KEY,
        last_seq INTEGER NOT NULL
      );
    `);

    const rows = db.prepare(`
      SELECT reference FROM bookings 
      WHERE reference LIKE 'JTG-%'
    `).all();

    let maxFound = BASE_SERIAL - 1;
    for (const r of rows) {
      if (!r || !r.reference) continue;
      const m = r.reference.match(/^JTG-(\d+)$/);
      if (m) {
        const val = parseInt(m[1], 10);
        if (!isNaN(val) && val > maxFound) {
          maxFound = val;
        }
      }
    }

    db.prepare(`
      INSERT INTO booking_sequence (name, last_seq)
      VALUES ('booking_ref', ?)
      ON CONFLICT(name) DO UPDATE SET
        last_seq = MAX(booking_sequence.last_seq, excluded.last_seq)
    `).run(maxFound);

    db.prepare(`
      UPDATE booking_sequence
      SET last_seq = last_seq + 1
      WHERE name = 'booking_ref'
    `).run();

    const current = db.prepare("SELECT last_seq FROM booking_sequence WHERE name = 'booking_ref'").get();
    if (current && current.last_seq) {
      return `JTG-${current.last_seq}`;
    }
  } catch (err) {
    console.error("[REFERENCE SEQUENCE ERROR]", err);
  }

  return `JTG-${BASE_SERIAL}`;
}

export function createBooking(db, data, user) {
  const quote = loadQuote(db, data.quoteId);
  const vehicle = quote.vehicles.find((item) => 
    item.code === data.vehicle ||
    (data.vehicle === 'exec-mpv' && item.code === 'exec_mpv') ||
    (data.vehicle === 'exec_mpv' && item.code === 'exec-mpv') ||
    (data.vehicle === 'minivan8' && item.code === 'mpv8') ||
    (data.vehicle === 'mpv8' && item.code === 'minivan8') ||
    (data.vehicle === 'mpv' && item.code === 'mpv5') ||
    (data.vehicle === 'mpv5' && item.code === 'mpv')
  );
  if (!vehicle) throw new HttpError(400, "Choose one of the vehicles from this quote.");
  const trip = quote.trip;
  const id = crypto.randomUUID();
  const reference = getNextBookingReference(db);
  const cancelToken = crypto.randomBytes(24).toString("base64url");
  const created = nowIso();
  const isReturnBooking = (data.bookingType === 'return' || data.type === 'return') || Boolean(trip.return_at);
  const bookingAmountPence = isReturnBooking
    ? (vehicle.breakdown.returnTotalPence || vehicle.breakdown.totalPence)
    : (vehicle.breakdown.oneWayTotalPence || vehicle.breakdown.totalPence);

  db.prepare(
    `INSERT INTO bookings (
      id, reference, user_id, quote_id, vehicle_code, vehicle_name, amount_pence, currency, status,
      customer_name, email, phone, flight_number, notes, pickup, dropoff, via, pickup_at, return_at,
      passengers, promo, cancel_token, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, 'gbp', 'pending_payment', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  ).run(
    id,
    reference,
    user?.id || null,
    quote.id,
    vehicle.code,
    vehicle.name,
    bookingAmountPence,
    data.name.trim(),
    data.email.trim().toLowerCase(),
    data.phone.trim(),
    String(data.flightNumber || "").trim() || null,
    String(data.notes || "").trim() || null,
    trip.pickup,
    trip.dropoff,
    trip.via || null,
    trip.pickup_at,
    trip.return_at,
    trip.passengers,
    trip.promo || null,
    cancelToken,
    created,
    created,
  );
  const row = db.prepare("SELECT * FROM bookings WHERE id = ?").get(id);
  return { ...publicBooking(row), cancelToken };
}

export function userBookings(db, userId) {
  return db
    .prepare("SELECT * FROM bookings WHERE user_id = ? ORDER BY created_at DESC")
    .all(userId)
    .map(publicBooking);
}

export function bookingByReference(db, reference) {
  return db.prepare("SELECT * FROM bookings WHERE reference = ?").get(reference);
}

export function cancelBooking(db, reference, token) {
  const row = bookingByReference(db, reference);
  if (!row || !sameToken(row.cancel_token, token)) throw new HttpError(404, "Booking not found.");
  if (row.status === "paid") {
    throw new HttpError(409, "This trip is already paid and cannot be cancelled here.");
  }
  if (row.status === "pending_payment") {
    db.prepare(
      "UPDATE bookings SET status = 'cancelled', updated_at = ? WHERE id = ? AND status = 'pending_payment'",
    ).run(nowIso(), row.id);
  }
  return publicBooking(db.prepare("SELECT * FROM bookings WHERE id = ?").get(row.id));
}

export function attachSession(db, reference, sessionId) {
  db.prepare("UPDATE bookings SET stripe_session_id = ?, updated_at = ? WHERE reference = ?").run(
    sessionId,
    nowIso(),
    reference,
  );
}

export function bookingBySession(db, sessionId) {
  return db.prepare("SELECT * FROM bookings WHERE stripe_session_id = ?").get(sessionId);
}

export async function applyStripeStatus(db, reference, status, paymentIntent) {
  if (!["paid", "failed", "cancelled", "processing"].includes(status)) {
    throw new Error("Unknown payment status.");
  }
  const row = bookingByReference(db, reference);
  if (!row) return null;
  if (row.status === "paid") {
    return publicBooking(row);
  }
  db.prepare(
    `UPDATE bookings
     SET status = ?, stripe_payment_intent = COALESCE(?, stripe_payment_intent), paid_at = ?, updated_at = ?
     WHERE reference = ? AND status != 'paid'`,
  ).run(status, paymentIntent || null, status === "paid" ? nowIso() : row.paid_at, nowIso(), reference);

  const updatedRow = bookingByReference(db, reference);
  let emailResult = { sent: false };

  if (updatedRow && status === "paid") {
    if (!updatedRow.email_sent_at) {
      emailResult = await sendBookingEmails(updatedRow, "card");
      if (emailResult.sent) {
        try {
          db.prepare("UPDATE bookings SET email_sent_at = ? WHERE id = ?").run(nowIso(), updatedRow.id);
        } catch {}
      }
    } else {
      emailResult = { sent: true };
    }
  }

  const latestRow = bookingByReference(db, reference);
  return {
    ...publicBooking(latestRow),
    emailSent: emailResult.sent || Boolean(latestRow.email_sent_at),
    emailError: emailResult.error || null,
  };
}

export async function payInCar(db, reference, token) {
  const row = bookingByReference(db, reference);
  if (!row || !sameToken(row.cancel_token, token)) throw new HttpError(404, "Booking not found.");
  if (row.status === "paid") {
    return publicBooking(row);
  }
  if (row.status !== "pending_payment") {
    throw new HttpError(409, "This booking cannot be updated.");
  }

  let emailResult = { sent: false };

  if (!row.request_email_sent_at) {
    emailResult = await sendBookingEmails(row, "cash");
    if (emailResult.sent) {
      try {
        db.prepare("UPDATE bookings SET request_email_sent_at = ?, updated_at = ? WHERE id = ?").run(nowIso(), nowIso(), row.id);
      } catch {}
    }
  } else {
    emailResult = { sent: true };
  }

  const latestRow = bookingByReference(db, reference);
  return {
    ...publicBooking(latestRow),
    emailSent: Boolean(latestRow.email_sent_at),
    requestEmailSent: emailResult.sent || Boolean(latestRow.request_email_sent_at),
    emailError: emailResult.error || null,
  };
}

export function rememberEvent(db, eventId, eventType) {
  try {
    db.prepare("INSERT INTO payment_events (event_id, event_type, created_at) VALUES (?, ?, ?)").run(
      eventId,
      eventType,
      nowIso(),
    );
    return true;
  } catch {
    return false;
  }
}

export { publicBooking, publicUser };
