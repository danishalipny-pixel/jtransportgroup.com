import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
import express from "express";
import Stripe from "stripe";
import { openDatabase } from "./src/db.js";
import {
  HttpError,
  applyStripeStatus,
  attachSession,
  bookingByReference,
  bookingBySession,
  cancelBooking,
  createBooking,
  createQuote,
  currentUser,
  loadQuote,
  loginUser,
  publicBooking,
  publicUser,
  registerUser,
  rememberEvent,
  sameToken,
  userBookings,
} from "./src/store.js";

const here = path.dirname(fileURLToPath(import.meta.url));
const siteRoot = path.resolve(here, "..");
dotenv.config({ path: path.join(here, ".env"), override: false });

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

function appBaseUrl() {
  return (process.env.APP_BASE_URL || "http://127.0.0.1:8080").replace(/\/$/, "");
}

function stripeSecret() {
  return (process.env.STRIPE_SECRET_KEY || "").trim();
}

function webhookSecret() {
  return (process.env.STRIPE_WEBHOOK_SECRET || "").trim();
}

function readCookie(req, name) {
  const header = req.headers.cookie || "";
  for (const part of header.split(";")) {
    const [key, ...rest] = part.trim().split("=");
    if (key === name) return decodeURIComponent(rest.join("="));
  }
  return "";
}

function setSession(res, token) {
  const secure = appBaseUrl().startsWith("https://") ? "; Secure" : "";
  res.setHeader(
    "Set-Cookie",
    `mlt_session=${encodeURIComponent(token)}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${7 * 24 * 60 * 60}${secure}`,
  );
}

function clearSession(res) {
  res.setHeader("Set-Cookie", "mlt_session=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0");
}

function emailOf(value) {
  const cleaned = String(value || "").trim().toLowerCase();
  if (!EMAIL_RE.test(cleaned)) throw new HttpError(422, "Enter a valid email address.");
  return cleaned;
}

function passwordOf(value) {
  const password = String(value || "");
  if (password.length < 8 || password.length > 128) {
    throw new HttpError(422, "Use a password between 8 and 128 characters.");
  }
  return password;
}

function phoneOf(value) {
  const phone = String(value || "").trim();
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 8 || digits.length > 15) throw new HttpError(422, "Enter a phone number with 8 to 15 digits.");
  return phone;
}

function blockedPath(urlPath) {
  const parts = urlPath.split("/").filter((part) => part && part !== ".");
  return (
    parts.some((part) => part.startsWith(".")) ||
    ["backend", ".git"].includes(parts[0]) ||
    /\.(py|db|sqlite)$/i.test(urlPath)
  );
}

const wrap = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

export function createApp(options = {}) {
  const dbFile = options.dbPath || process.env.DATABASE_PATH || path.join(here, "data", "mlt.db");
  const db = openDatabase(dbFile);
  const app = express();

  app.post(
    "/api/payments/webhook",
    express.raw({ type: "application/json" }),
    wrap(async (req, res) => {
      const secret = webhookSecret();
      if (!secret) throw new HttpError(503, "Stripe webhook secret is not configured.");
      const stripe = new Stripe(stripeSecret() || "sk_test_placeholder");
      let event;
      try {
        event = stripe.webhooks.constructEvent(req.body, req.headers["stripe-signature"] || "", secret);
      } catch {
        throw new HttpError(400, "Invalid Stripe signature.");
      }
      if (!rememberEvent(db, event.id, event.type)) {
        res.json({ received: true, duplicate: true });
        return;
      }
      const data = event.data.object;
      const reference = data.metadata?.reference || data.client_reference_id;
      const intent = typeof data.payment_intent === "string" ? data.payment_intent : null;
      if (reference && event.type === "checkout.session.completed") {
        applyStripeStatus(db, reference, data.payment_status === "paid" ? "paid" : "processing", intent);
      } else if (reference && event.type === "checkout.session.async_payment_succeeded") {
        applyStripeStatus(db, reference, "paid", intent);
      } else if (
        reference &&
        (event.type === "checkout.session.async_payment_failed" || event.type === "payment_intent.payment_failed")
      ) {
        applyStripeStatus(db, reference, "failed", intent);
      } else if (reference && event.type === "checkout.session.expired") {
        applyStripeStatus(db, reference, "cancelled", intent);
      }
      res.json({ received: true });
    }),
  );

  app.use(express.json());

  app.get("/api/health", (_req, res) => {
    res.json({ ok: true, payments: stripeSecret().startsWith("sk_") || stripeSecret().startsWith("rk_") });
  });

  app.post(
    "/api/auth/register",
    wrap((req, res) => {
      const name = String(req.body?.name || "").trim();
      if (name.length < 2) throw new HttpError(400, "Enter your name.");
      const phone = phoneOf(req.body?.phone);
      const result = registerUser(db, {
        name,
        email: emailOf(req.body?.email),
        phone,
        password: passwordOf(req.body?.password),
      });
      setSession(res, result.token);
      res.json(result.user);
    }),
  );

  app.post(
    "/api/auth/login",
    wrap((req, res) => {
      const result = loginUser(db, { email: emailOf(req.body?.email), password: passwordOf(req.body?.password) });
      setSession(res, result.token);
      res.json(result.user);
    }),
  );

  app.post("/api/auth/logout", (_req, res) => {
    clearSession(res);
    res.json({ ok: true });
  });

  app.get(
    "/api/auth/me",
    wrap((req, res) => {
      const user = currentUser(db, readCookie(req, "mlt_session"));
      if (!user) throw new HttpError(401, "Not signed in.");
      res.json(publicUser(user));
    }),
  );

  app.post(
    "/api/quotes",
    wrap((req, res) => {
      res.json(createQuote(db, req.body || {}));
    }),
  );

  app.get(
    "/api/quotes/:id",
    wrap((req, res) => {
      res.json(loadQuote(db, req.params.id));
    }),
  );

  app.post(
    "/api/bookings",
    wrap((req, res) => {
      const body = req.body || {};
      const name = String(body.name || "").trim();
      if (name.length < 2 || name.length > 80) throw new HttpError(422, "Enter your name.");
      res.json(
        createBooking(
          db,
          {
            ...body,
            name,
            email: emailOf(body.email),
            phone: phoneOf(body.phone),
          },
          currentUser(db, readCookie(req, "mlt_session")),
        ),
      );
    }),
  );

  app.get(
    "/api/bookings/mine",
    wrap((req, res) => {
      const user = currentUser(db, readCookie(req, "mlt_session"));
      if (!user) throw new HttpError(401, "Sign in to see your trips.");
      res.json({ bookings: userBookings(db, user.id) });
    }),
  );

  app.post(
    "/api/bookings/:reference/cancel",
    wrap((req, res) => {
      res.json(cancelBooking(db, req.params.reference, String(req.body?.token || "")));
    }),
  );

  app.post(
    "/api/payments/checkout",
    wrap(async (req, res) => {
      const secret = stripeSecret();
      if (!secret.startsWith("sk_") && !secret.startsWith("rk_")) {
        throw new HttpError(503, "Card payments are not switched on yet. Add the Stripe secret key to backend/.env.");
      }
      const row = bookingByReference(db, String(req.body?.reference || ""));
      if (!row || !sameToken(row.cancel_token, String(req.body?.cancelToken || ""))) {
        throw new HttpError(404, "Booking not found.");
      }
      if (row.status === "paid") throw new HttpError(409, "This trip is already paid.");
      if (row.status !== "pending_payment") throw new HttpError(409, "This booking can no longer be paid.");
      const stripe = new Stripe(secret);
      let session;
      try {
        session = await stripe.checkout.sessions.create({
          mode: "payment",
          customer_email: row.email,
          client_reference_id: row.reference,
          success_url: `${appBaseUrl()}/payment-success.html?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${appBaseUrl()}/payment-cancelled.html?booking=${row.reference}&token=${row.cancel_token}`,
          metadata: { reference: row.reference },
          payment_intent_data: { metadata: { reference: row.reference } },
          line_items: [
            {
              quantity: 1,
              price_data: {
                currency: row.currency,
                unit_amount: row.amount_pence,
                product_data: {
                  name: `J Transport Group LTD Transfer ${row.reference}`,
                  description: `${row.pickup} to ${row.dropoff} · ${row.vehicle_name}`,
                },
              },
            },
          ],
        });
      } catch {
        throw new HttpError(502, "Stripe could not start the payment. Try again in a moment.");
      }
      attachSession(db, row.reference, session.id);
      res.json({ url: session.url });
    }),
  );

  app.get(
    "/api/payments/confirm",
    wrap(async (req, res) => {
      const secret = stripeSecret();
      if (!secret.startsWith("sk_") && !secret.startsWith("rk_")) throw new HttpError(503, "Card payments are not switched on yet.");
      const row = bookingBySession(db, String(req.query.session_id || ""));
      if (!row) throw new HttpError(404, "Payment session not found.");
      const stripe = new Stripe(secret);
      const session = await stripe.checkout.sessions.retrieve(String(req.query.session_id));
      const reference = session.metadata?.reference || session.client_reference_id;
      if (reference !== row.reference) throw new HttpError(400, "This payment does not match the booking.");
      const intent = typeof session.payment_intent === "string" ? session.payment_intent : null;
      if (session.payment_status === "paid") {
        res.json(applyStripeStatus(db, reference, "paid", intent));
        return;
      }
      if (session.status === "expired") {
        res.json(applyStripeStatus(db, reference, "cancelled", intent));
        return;
      }
      res.json(publicBooking(bookingByReference(db, reference)));
    }),
  );

  app.use((req, res, next) => {
    if (blockedPath(req.path)) {
      res.status(404).type("text").send("Not found");
      return;
    }
    next();
  });
  app.use(express.static(siteRoot));

  app.use((error, _req, res, _next) => {
    if (error instanceof HttpError) {
      res.status(error.status).json({ detail: error.detail });
      return;
    }
    if (error.type === "entity.parse.failed") {
      res.status(400).json({ detail: "Please check the form and try again." });
      return;
    }
    console.error(error);
    res.status(500).json({ detail: "Something went wrong." });
  });

  return app;
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const port = Number(process.env.PORT || 8080);
  createApp().listen(port, "0.0.0.0", () => {
    console.log(`My London Transfer is running at ${appBaseUrl()}`);
  });
}
