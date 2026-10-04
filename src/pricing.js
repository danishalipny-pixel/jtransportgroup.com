export const VEHICLES = [
  {
    code: "saloon",
    name: "Saloon Car",
    maxPassengers: 4,
    luggage: "Up to 2 large suitcases and 2 small bags",
    examples: "Toyota Corolla, VW Golf, Prius or similar",
    basePence: 5500,
    perMilePence: 250,
    image: "assets/images/saloon.png",
  },
  {
    code: "estate",
    name: "Estate Car",
    maxPassengers: 4,
    luggage: "Up to 3 large suitcases and 2 small bags",
    examples: "VW Passat Estate, Skoda Superb Estate",
    basePence: 6500,
    perMilePence: 280,
    image: "assets/images/estate.png",
  },
  {
    code: "executive",
    name: "Executive Saloon",
    maxPassengers: 4,
    luggage: "Up to 2 large suitcases and 2 small bags",
    examples: "Mercedes-Benz E-Class, BMW 5 Series",
    basePence: 9000,
    perMilePence: 350,
    image: "assets/images/executive-saloon.png",
  },
  {
    code: "mpv5",
    name: "MPV 5",
    maxPassengers: 5,
    luggage: "Up to 4 large suitcases and 3 small bags",
    examples: "VW Multivan, Ford Tourneo or similar",
    basePence: 7500,
    perMilePence: 320,
    image: "assets/images/mpv.png",
  },
  {
    code: "exec_mpv",
    name: "Executive MPV",
    maxPassengers: 6,
    luggage: "Up to 5 large suitcases and 4 small bags",
    examples: "Mercedes-Benz V-Class",
    basePence: 12000,
    perMilePence: 420,
    image: "assets/images/mpv-plus.png",
  },
  {
    code: "mpv8",
    name: "Minivan 8 Seater",
    maxPassengers: 8,
    luggage: "Up to 8 large suitcases",
    examples: "Mercedes-Benz Vito 8 Seater",
    basePence: 11000,
    perMilePence: 400,
    image: "assets/images/minivan.png",
  },
  {
    code: "sprinter",
    name: "Mercedes Sprinter",
    maxPassengers: 16,
    luggage: "Up to 16 luggage pieces",
    examples: "Mercedes-Benz Sprinter Minibus",
    basePence: 18000,
    perMilePence: 600,
    image: "assets/images/14-seater.png",
  },
];

// PDF Airport Transfer Postcode Pricing Matrix (in GBP)
const AIRPORT_PRICING = {
  heathrow: {
    inner: { saloon: 90, estate: 100, executive: 110, mpv5: 110, exec_mpv: 150, mpv8: 130, sprinter: 230 },
    outer: { saloon: 85, estate: 90, executive: 110, mpv5: 105, exec_mpv: 140, mpv8: 120, sprinter: 230 },
  },
  gatwick: {
    inner: { saloon: 110, estate: 120, executive: 130, mpv5: 130, exec_mpv: 170, mpv8: 150, sprinter: 270 },
    outer: { saloon: 100, estate: 110, executive: 120, mpv5: 120, exec_mpv: 150, mpv8: 140, sprinter: 250 },
  },
  stansted: {
    inner: { saloon: 95, estate: 100, executive: 120, mpv5: 120, exec_mpv: 150, mpv8: 130, sprinter: 240 },
    outer: { saloon: 95, estate: 100, executive: 120, mpv5: 120, exec_mpv: 150, mpv8: 130, sprinter: 240 },
  },
  luton: {
    inner: { saloon: 95, estate: 100, executive: 120, mpv5: 120, exec_mpv: 150, mpv8: 130, sprinter: 240 },
    outer: { saloon: 95, estate: 100, executive: 120, mpv5: 120, exec_mpv: 150, mpv8: 130, sprinter: 240 },
  },
  "london city": {
    inner: { saloon: 50, estate: 60, executive: 70, mpv5: 70, exec_mpv: 100, mpv8: 90, sprinter: 120 },
    outer: { saloon: 50, estate: 60, executive: 70, mpv5: 70, exec_mpv: 100, mpv8: 90, sprinter: 120 },
  },
};

function londonParts(date) {
  const formatted = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/London",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const parts = Object.fromEntries(formatted.map((part) => [part.type, part.value]));
  if (parts.hour === "24") parts.hour = "00";
  return parts;
}

export function londonWallToUtc(dateText, timeText) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateText) || !/^\d{2}:\d{2}$/.test(timeText)) return null;
  const [year, month, day] = dateText.split("-").map(Number);
  const [hour, minute] = timeText.split(":").map(Number);
  if (month < 1 || month > 12 || hour > 23 || minute > 59) return null;
  const guess = new Date(Date.UTC(year, month - 1, day, hour, minute, 0));
  const parts = londonParts(guess);
  const zoned = Date.UTC(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
    Number(parts.hour),
    Number(parts.minute),
    Number(parts.second),
  );
  return new Date(guess.getTime() - (zoned - guess.getTime()));
}

export function formatLondonIso(date) {
  const parts = londonParts(date);
  const wall = `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}:${parts.second}`;
  const offsetMinutes = Math.round((Date.parse(`${wall}Z`) - date.getTime()) / 60000);
  const sign = offsetMinutes >= 0 ? "+" : "-";
  const absolute = Math.abs(offsetMinutes);
  const hours = String(Math.floor(absolute / 60)).padStart(2, "0");
  const minutes = String(absolute % 60).padStart(2, "0");
  return `${wall}${sign}${hours}:${minutes}`;
}

export function parsePassengers(value) {
  const text = String(value ?? "").trim().toLowerCase();
  const digits = text.replace(/\D/g, "");
  if (!digits || text.includes("+")) {
    throw new Error("Choose an exact passenger count from 1 to 16.");
  }
  const count = Number(digits);
  if (count < 1 || count > 16) throw new Error("Choose an exact passenger count from 1 to 16.");
  return count;
}

function detectAirportKey(place) {
  const lowered = String(place || "").toLowerCase();
  if (lowered.includes("heathrow")) return "heathrow";
  if (lowered.includes("gatwick")) return "gatwick";
  if (lowered.includes("stansted")) return "stansted";
  if (lowered.includes("luton")) return "luton";
  if (lowered.includes("london city") || lowered.includes("city airport")) return "london city";
  return null;
}

function classifyPostcodeZone(place) {
  const text = String(place || "").toUpperCase();

  // Extract outward postcode (e.g., SW9, EC1A, W2, etc.)
  const match = text.match(/\b([A-Z]{1,2}[0-9]{1,2}[A-Z]?)\b/);
  const code = match ? match[1] : "";

  // Group 1: Central & Inner London (EC1-4, WC1-2, W1, SW1, SE1, E1-18, N1-22)
  if (
    /^(EC[1-4]|WC[1-2]|W1|SW1|SE1|E1$|E[2-9]|E1[0-8]|N[1-9]|N1[0-9]|N2[0-2])$/.test(code) ||
    /^(EC1[A-Z]|EC2[A-Z]|EC3[A-Z]|EC4[A-Z]|WC1[A-Z]|WC2[A-Z]|W1[A-Z]|SW1[A-Z]|SE1[P]|E1[W]|N1[C])$/.test(code)
  ) {
    return "inner";
  }

  // Group 2: Outer London (W2-14, SW2-20, SE2-28, NW1-11)
  if (/^(W[2-9]|W1[0-4]|SW[2-9]|SW1[0-9]|SW20|SE[2-9]|SE1[0-9]|SE2[0-8]|NW[1-9]|NW1[0-1])$/.test(code)) {
    return "outer";
  }

  // Text keyword fallbacks
  if (
    text.includes("STOCKLEY") ||
    text.includes("CLAPHAM") ||
    text.includes("BRIXTON") ||
    text.includes("WIMBLEDON") ||
    text.includes("EALING") ||
    text.includes("SLOUGH") ||
    text.includes("UXBRIDGE") ||
    text.includes("CROYDON")
  ) {
    return "outer";
  }

  return "inner";
}

function estimateDistanceMiles(pickup, dropoff) {
  const combined = (pickup + " " + dropoff).toLowerCase();
  if (combined.includes("gatwick")) return 28;
  if (combined.includes("stansted")) return 36;
  if (combined.includes("luton")) return 32;
  if (combined.includes("heathrow")) return 18;
  if (combined.includes("city airport")) return 10;
  return 14;
}

const BOOK_BY = londonWallToUtc("2026-10-31", "23:59");
const TRAVEL_THROUGH = londonWallToUtc("2026-11-30", "23:59");

export function discountFor(code, pickupAt) {
  const cleaned = String(code || "").trim().toUpperCase();
  if (!cleaned) return 0;
  if (cleaned !== "AUTUMN5") throw new Error("That promo code is not recognised.");
  if (Date.now() > BOOK_BY.getTime()) throw new Error("That promo code has expired.");
  if (pickupAt.getTime() > TRAVEL_THROUGH.getTime()) {
    throw new Error("That promo code does not cover this travel date.");
  }
  return 5;
}

export function quoteVehicles(trip) {
  const returnLeg = Boolean(trip.returnAt);
  const airportKey = detectAirportKey(trip.pickup) || detectAirportKey(trip.dropoff);
  const otherPlace = detectAirportKey(trip.pickup) ? trip.dropoff : trip.pickup;
  const zone = classifyPostcodeZone(otherPlace);
  const estimatedMiles = estimateDistanceMiles(trip.pickup, trip.dropoff);

  const options = [];
  for (const vehicle of VEHICLES) {
    if (vehicle.maxPassengers < trip.passengers) continue;

    let basePence;
    if (airportKey && AIRPORT_PRICING[airportKey]) {
      const gbpPrice = AIRPORT_PRICING[airportKey][zone]?.[vehicle.code] || AIRPORT_PRICING[airportKey]["inner"]?.[vehicle.code];
      if (gbpPrice) {
        basePence = gbpPrice * 100;
      } else {
        basePence = vehicle.basePence + estimatedMiles * vehicle.perMilePence;
      }
    } else {
      basePence = vehicle.basePence + estimatedMiles * vehicle.perMilePence;
    }

    const returnPence = returnLeg ? basePence : 0;
    const subtotal = basePence + returnPence;
    const discountPence = Math.floor((subtotal * trip.discountPercent) / 100);
    const totalPence = subtotal - discountPence;

    options.push({
      code: vehicle.code,
      name: vehicle.name,
      maxPassengers: vehicle.maxPassengers,
      luggage: vehicle.luggage,
      examples: vehicle.examples,
      image: vehicle.image,
      currency: "gbp",
      distanceMiles: estimatedMiles,
      breakdown: {
        basePence,
        returnPence,
        airportPence: 0,
        discountPercent: trip.discountPercent,
        discountPence,
        totalPence,
      },
    });
  }

  if (!options.length) throw new Error("No vehicle in the fleet fits this passenger count.");
  return options;
}
