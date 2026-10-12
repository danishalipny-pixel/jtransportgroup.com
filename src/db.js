import fs from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";

export function openDatabase(file) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const db = new DatabaseSync(file);
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      phone TEXT NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS quotes (
      id TEXT PRIMARY KEY,
      payload TEXT NOT NULL,
      vehicles TEXT NOT NULL,
      created_at TEXT NOT NULL,
      expires_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS bookings (
      id TEXT PRIMARY KEY,
      reference TEXT NOT NULL UNIQUE,
      user_id TEXT,
      quote_id TEXT NOT NULL,
      vehicle_code TEXT NOT NULL,
      vehicle_name TEXT NOT NULL,
      amount_pence INTEGER NOT NULL,
      currency TEXT NOT NULL,
      status TEXT NOT NULL,
      customer_name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      flight_number TEXT,
      notes TEXT,
      pickup TEXT NOT NULL,
      dropoff TEXT NOT NULL,
      via TEXT,
      pickup_at TEXT NOT NULL,
      return_at TEXT,
      passengers INTEGER NOT NULL,
      promo TEXT,
      cancel_token TEXT NOT NULL,
      stripe_session_id TEXT,
      stripe_payment_intent TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      paid_at TEXT,
      email_sent_at TEXT
    );
    CREATE TABLE IF NOT EXISTS payment_events (
      event_id TEXT PRIMARY KEY,
      event_type TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
  `);
  try {
    db.exec(`ALTER TABLE bookings ADD COLUMN email_sent_at TEXT;`);
  } catch {
    // Column already exists
  }
  try {
    db.exec(`ALTER TABLE bookings ADD COLUMN request_email_sent_at TEXT;`);
  } catch {
    // Column already exists
  }
  return db;
}
