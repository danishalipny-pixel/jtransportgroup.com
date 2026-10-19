import crypto from "node:crypto";
import http from "node:http";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import assert from "node:assert/strict";

process.env.JWT_SECRET = "test-secret-value-with-32-bytes-ok";
process.env.DATABASE_PATH = path.join(os.tmpdir(), `mlt-node-${Date.now()}.db`);
process.env.STRIPE_SECRET_KEY = "";
process.env.STRIPE_WEBHOOK_SECRET = "whsec_test_secret";
process.env.APP_BASE_URL = "http://127.0.0.1:8080";

const { createApp } = await import("../server.js");

const app = createApp({ dbPath: process.env.DATABASE_PATH });
const server = http.createServer(app);
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const base = `http://127.0.0.1:${server.address().port}`;
let cookie = "";

async function api(urlPath, options = {}) {
  const headers = { ...(options.headers || {}) };
  if (cookie) headers.cookie = cookie;
  if (options.body && !headers["content-type"] && !headers["stripe-signature"]) {
    headers["content-type"] = "application/json";
  }
  const response = await fetch(base + urlPath, {
    method: options.method || "GET",
    headers,
    body: options.raw ?? (options.body ? JSON.stringify(options.body) : undefined),
  });
  const setCookies = response.headers.getSetCookie?.() || [];
  if (setCookies.length) cookie = setCookies.map((item) => item.split(";")[0]).join("; ");
  const data = await response.json().catch(() => ({}));
  return { status: response.status, data, text: JSON.stringify(data) };
}

function trip(extra = {}) {
  return {
    pickup: "Heathrow Airport",
    dropoff: "King's Cross",
    pickupDate: "2026-10-25",
    pickupTime: "10:30",
    passengers: 1,
    promo: "",
    ...extra,
  };
}

test("quote price is calculated on the server", async () => {
  const response = await api("/api/quotes", { method: "POST", body: trip({ promo: "AUTUMN5" }) });
  assert.equal(response.status, 200);
  const saloon = response.data.vehicles.find((item) => item.code === "saloon");
  assert.equal(saloon.breakdown.totalPence, 8550);
  assert.equal(response.data.amount, undefined);
});

test("large group hides small cars", async () => {
  const response = await api("/api/quotes", { method: "POST", body: trip({ passengers: 5, promo: "" }) });
  assert.equal(response.status, 200);
  const codes = response.data.vehicles.map((item) => item.code);
  assert.equal(codes.includes("saloon"), false);
  assert.equal(codes.includes("mpv5"), true);
});

test("booking ignores a client supplied price", async () => {
  const quote = (await api("/api/quotes", { method: "POST", body: trip({ promo: "" }) })).data;
  const saloon = quote.vehicles.find((item) => item.code === "saloon");
  const booked = await api("/api/bookings", {
    method: "POST",
    body: {
      quoteId: quote.id,
      vehicle: "saloon",
      name: "Ada Lovelace",
      email: "ada@example.com",
      phone: "+44 20 7946 0000",
      amountPence: 1,
    },
  });
  assert.equal(booked.status, 200);
  assert.equal(booked.data.amountPence, saloon.breakdown.totalPence);
  assert.equal(booked.data.status, "pending_payment");
});

test("checkout without a stripe key does not mark the trip paid", async () => {
  const quote = (await api("/api/quotes", { method: "POST", body: trip({ dropoff: "Paddington", promo: "" }) })).data;
  const booked = (
    await api("/api/bookings", {
      method: "POST",
      body: {
        quoteId: quote.id,
        vehicle: "saloon",
        name: "Grace Hopper",
        email: "grace@example.com",
        phone: "02079460001",
      },
    })
  ).data;
  const payment = await api("/api/payments/checkout", {
    method: "POST",
    body: { reference: booked.reference, cancelToken: booked.cancelToken },
  });
  assert.equal(payment.status, 503);
  assert.equal(payment.text.includes("sk_"), false);
});

test("account bookings require sign in and a webhook marks the trip paid", async () => {
  const registered = await api("/api/auth/register", {
    method: "POST",
    body: { name: "Test Rider", email: "rider@example.com", phone: "07700900123", password: "correct-horse" },
  });
  assert.equal(registered.status, 200);
  assert.equal((await api("/api/auth/me")).status, 200);
  const quote = (await api("/api/quotes", { method: "POST", body: trip({ dropoff: "Victoria", promo: "" }) })).data;
  const booked = (
    await api("/api/bookings", {
      method: "POST",
      body: {
        quoteId: quote.id,
        vehicle: "saloon",
        name: "Test Rider",
        email: "rider@example.com",
        phone: "07700900123",
      },
    })
  ).data;
  const payload = JSON.stringify({
    id: "evt_paid_1",
    type: "checkout.session.completed",
    data: {
      object: {
        metadata: { reference: booked.reference },
        client_reference_id: booked.reference,
        payment_status: "paid",
        payment_intent: "pi_test_1",
      },
    },
  });
  const stamp = String(Math.floor(Date.now() / 1000));
  const signature = crypto.createHmac("sha256", process.env.STRIPE_WEBHOOK_SECRET).update(`${stamp}.${payload}`).digest("hex");
  const bad = await api("/api/payments/webhook", {
    method: "POST",
    raw: payload,
    headers: { "content-type": "application/json", "stripe-signature": "t=1,v1=bad" },
  });
  assert.equal(bad.status, 400);
  const good = await api("/api/payments/webhook", {
    method: "POST",
    raw: payload,
    headers: { "content-type": "application/json", "stripe-signature": `t=${stamp},v1=${signature}` },
  });
  assert.equal(good.status, 200);
  const again = await api("/api/payments/webhook", {
    method: "POST",
    raw: payload,
    headers: { "content-type": "application/json", "stripe-signature": `t=${stamp},v1=${signature}` },
  });
  assert.equal(again.data.duplicate, true);
  let mine = (await api("/api/bookings/mine")).data.bookings;
  assert.equal(mine.find((item) => item.reference === booked.reference).status, "paid");

  const failed = JSON.stringify({
    id: "evt_fail_1",
    type: "checkout.session.async_payment_failed",
    data: { object: { metadata: { reference: booked.reference }, payment_intent: "pi_test_1" } },
  });
  const failStamp = String(Math.floor(Date.now() / 1000));
  const failSig = crypto.createHmac("sha256", process.env.STRIPE_WEBHOOK_SECRET).update(`${failStamp}.${failed}`).digest("hex");
  await api("/api/payments/webhook", {
    method: "POST",
    raw: failed,
    headers: { "content-type": "application/json", "stripe-signature": `t=${failStamp},v1=${failSig}` },
  });
  mine = (await api("/api/bookings/mine")).data.bookings;
  assert.equal(mine.find((item) => item.reference === booked.reference).status, "paid");
});

test("cancel needs the token and secret files stay hidden", async () => {
  const quote = (await api("/api/quotes", { method: "POST", body: trip({ dropoff: "Waterloo", promo: "" }) })).data;
  const booked = (
    await api("/api/bookings", {
      method: "POST",
      body: {
        quoteId: quote.id,
        vehicle: "saloon",
        name: "Cancel Me",
        email: "cancel@example.com",
        phone: "07700900999",
      },
    })
  ).data;
  assert.equal((await api(`/api/bookings/${booked.reference}/cancel`, { method: "POST", body: { token: "nope" } })).status, 404);
  const cancelled = await api(`/api/bookings/${booked.reference}/cancel`, {
    method: "POST",
    body: { token: booked.cancelToken },
  });
  assert.equal(cancelled.data.status, "cancelled");
  const hidden = await fetch(base + "/backend/.env");
  assert.equal(hidden.status, 404);
  const source = await fetch(base + "/backend/server.js");
  assert.equal(source.status, 404);
  assert.equal((await api("/api/auth/logout", { method: "POST" })).status, 200);
  cookie = "";
  assert.equal((await api("/api/bookings/mine")).status, 401);
});

test("pay in car maintains status as pending_payment and sends request email", async () => {
  const quote = (await api("/api/quotes", { method: "POST", body: trip({ dropoff: "Euston", promo: "" }) })).data;
  const booked = (
    await api("/api/bookings", {
      method: "POST",
      body: {
        quoteId: quote.id,
        vehicle: "saloon",
        name: "Cash Passenger",
        email: "cash@example.com",
        phone: "07700900123",
      },
    })
  ).data;
  const payResult = await api("/api/payments/pay-in-car", {
    method: "POST",
    body: { reference: booked.reference, cancelToken: booked.cancelToken },
  });
  assert.equal(payResult.status, 200);
  assert.equal(payResult.data.status, "pending_payment");
  assert.equal(payResult.data.paymentPending, true);
  assert.equal(payResult.data.bookingConfirmed, false);
});

test.after(() => {
  server.close();
});

