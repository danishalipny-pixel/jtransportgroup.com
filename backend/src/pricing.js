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

const UK_CITIES_DISTANCE = [
  { name: "manchester", miles: 200 },
  { name: "liverpool", miles: 210 },
  { name: "birmingham", miles: 115 },
  { name: "bristol", miles: 105 },
  { name: "salisbury", miles: 75 },
  { name: "wiltshire", miles: 75 },
  { name: "stonehenge", miles: 80 },
  { name: "oxford", miles: 50 },
  { name: "cambridge", miles: 65 },
  { name: "reading", miles: 38 },
  { name: "leeds", miles: 195 },
  { name: "cardiff", miles: 150 },
  { name: "brighton", miles: 60 },
  { name: "southampton", miles: 75 },
  { name: "portsmouth", miles: 75 },
  { name: "nottingham", miles: 130 },
  { name: "sheffield", miles: 165 },
  { name: "newcastle", miles: 280 },
  { name: "edinburgh", miles: 400 },
  { name: "glasgow", miles: 400 },
  { name: "slough", miles: 14 },
  { name: "windsor", miles: 16 },
  { name: "maidenhead", miles: 22 },
  { name: "staines", miles: 12 },
  { name: "watford", miles: 20 },
  { name: "high wycombe", miles: 26 },
];

function isLongDistanceCityTrip(place1, place2) {
  const combined = (String(place1 || "") + " " + String(place2 || "")).toLowerCase();
  return UK_CITIES_DISTANCE.find((c) => combined.includes(c.name));
}

function estimateDistanceMiles(pickup, dropoff) {
  const combined = (pickup + " " + dropoff).toLowerCase();
  const cityMatch = UK_CITIES_DISTANCE.find((c) => combined.includes(c.name));
  if (cityMatch) return cityMatch.miles;

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

function extractPostcodeArea(text) {
  const upper = String(text || "").toUpperCase();
  const match = upper.match(/\b([A-Z]{1,2}[0-9]{1,2}[A-Z]?)\b/);
  if (match) {
    const fullCode = match[1];
    const areaLetters = fullCode.match(/^[A-Z]+/)?.[0] || "";
    return { fullCode, areaLetters };
  }
  return { fullCode: "", areaLetters: "" };
}

function getExactPdfFare(airportKey, locationText, vehicleCode) {
  if (!airportKey) return null;
  const upper = String(locationText || "").toUpperCase();
  const { fullCode, areaLetters } = extractPostcodeArea(upper);

  const applyFormula = (saloonBase) => {
    switch (vehicleCode) {
      case "saloon": return saloonBase;
      case "estate": return saloonBase + 10;
      case "executive": return saloonBase + 30;
      case "mpv5": return saloonBase + 30;
      case "mpv8": return saloonBase + 50;
      case "exec_mpv": return saloonBase + 60;
      case "sprinter": return saloonBase + 150;
      default: return saloonBase;
    }
  };

  if (airportKey === "heathrow") {
    if (areaLetters === "CR" || upper.includes("CROYDON")) return applyFormula(90);
    if (areaLetters === "BR" || upper.includes("BROMLEY")) return applyFormula(95);
    if (areaLetters === "TN" || upper.includes("TUNBRIDGE")) return applyFormula(110);
    if (areaLetters === "BN" || upper.includes("BRIGHTON")) return applyFormula(130);
    if (areaLetters === "KT" || upper.includes("KINGSTON")) return applyFormula(85);
    if (areaLetters === "SM" || upper.includes("SUTTON")) return applyFormula(85);
    if (areaLetters === "DA" || upper.includes("DARTFORD")) return applyFormula(100);
    if (fullCode.startsWith("CT15") || fullCode.startsWith("CT16") || fullCode.startsWith("CT17") || upper.includes("DOVER")) return applyFormula(140);
    if (areaLetters === "CT" || upper.includes("CANTERBURY")) return applyFormula(125);
    if (areaLetters === "RH" || upper.includes("REDHILL") || upper.includes("REIGATE")) return applyFormula(95);
    if (areaLetters === "IG" || upper.includes("ILFORD")) return applyFormula(95);
    if (areaLetters === "RM" || upper.includes("ROMFORD")) return applyFormula(100);
    if (areaLetters === "CM" || upper.includes("CHELMSFORD")) return applyFormula(100);
    if (areaLetters === "SO" || upper.includes("SOUTHAMPTON")) return applyFormula(120);
    if (areaLetters === "CO" || upper.includes("COLCHESTER")) return applyFormula(130);
    if (areaLetters === "CB" || upper.includes("CAMBRIDGE")) return applyFormula(130);
    if (areaLetters === "GU" || upper.includes("GUILDFORD")) return applyFormula(90);
    if (areaLetters === "SL" || upper.includes("SLOUGH")) return applyFormula(80);
    if (areaLetters === "RG" || upper.includes("READING")) return applyFormula(90);
    if (areaLetters === "OX" || upper.includes("OXFORD")) return applyFormula(110);
    if (areaLetters === "MK" || upper.includes("MILTON KEYNES")) return applyFormula(110);
    if (areaLetters === "PO" || upper.includes("PORTSMOUTH")) return applyFormula(120);
  }

  if (airportKey === "gatwick") {
    if (upper.includes("SOUTHAMPTON")) return { saloon: 130, estate: 140, executive: 160, mpv5: 160, exec_mpv: 240, mpv8: 200, sprinter: 350 }[vehicleCode] || 130;
    if (upper.includes("PORTSMOUTH")) return { saloon: 130, estate: 140, executive: 160, mpv5: 160, exec_mpv: 240, mpv8: 200, sprinter: 350 }[vehicleCode] || 130;
    if (upper.includes("DOVER")) return { saloon: 130, estate: 140, executive: 160, mpv5: 160, exec_mpv: 250, mpv8: 200, sprinter: 400 }[vehicleCode] || 130;
    if (["CR", "BR", "TN", "BN", "KT", "SM"].includes(areaLetters) || upper.includes("CROYDON") || upper.includes("BROMLEY") || upper.includes("BRIGHTON") || upper.includes("KINGSTON") || upper.includes("SUTTON")) {
      return { saloon: 80, estate: 85, executive: 100, mpv5: 100, exec_mpv: 120, mpv8: 110, sprinter: 190 }[vehicleCode] || 80;
    }
    if (["DA", "CT"].includes(areaLetters) || upper.includes("DARTFORD") || upper.includes("CANTERBURY")) {
      return { saloon: 110, estate: 120, executive: 150, mpv5: 150, exec_mpv: 200, mpv8: 180, sprinter: 300 }[vehicleCode] || 110;
    }
    if (areaLetters === "RH" || upper.includes("REDHILL") || upper.includes("REIGATE")) {
      return { saloon: 55, estate: 60, executive: 80, mpv5: 80, exec_mpv: 110, mpv8: 95, sprinter: 170 }[vehicleCode] || 55;
    }
    if (areaLetters === "IG" || upper.includes("ILFORD")) {
      return { saloon: 110, estate: 120, executive: 140, mpv5: 140, exec_mpv: 170, mpv8: 160, sprinter: 260 }[vehicleCode] || 110;
    }
    if (areaLetters === "RM" || upper.includes("ROMFORD")) {
      return { saloon: 100, estate: 110, executive: 130, mpv5: 130, exec_mpv: 160, mpv8: 150, sprinter: 250 }[vehicleCode] || 100;
    }
    if (areaLetters === "CM" || upper.includes("CHELMSFORD")) {
      return { saloon: 120, estate: 130, executive: 150, mpv5: 150, exec_mpv: 180, mpv8: 170, sprinter: 270 }[vehicleCode] || 120;
    }
    if (areaLetters === "SS" || upper.includes("SOUTHEND")) {
      return { saloon: 110, estate: 120, executive: 140, mpv5: 140, exec_mpv: 170, mpv8: 160, sprinter: 260 }[vehicleCode] || 110;
    }
    if (areaLetters === "CO" || upper.includes("COLCHESTER")) {
      return { saloon: 140, estate: 150, executive: 170, mpv5: 170, exec_mpv: 200, mpv8: 190, sprinter: 290 }[vehicleCode] || 140;
    }
    if (areaLetters === "CB" || upper.includes("CAMBRIDGE")) {
      return { saloon: 130, estate: 140, executive: 160, mpv5: 160, exec_mpv: 190, mpv8: 180, sprinter: 280 }[vehicleCode] || 130;
    }
    if (areaLetters === "GU" || upper.includes("GUILDFORD")) {
      return { saloon: 90, estate: 100, executive: 115, mpv5: 120, exec_mpv: 150, mpv8: 140, sprinter: 240 }[vehicleCode] || 90;
    }
    if (areaLetters === "SL" || upper.includes("SLOUGH")) {
      return { saloon: 90, estate: 100, executive: 115, mpv5: 120, exec_mpv: 150, mpv8: 140, sprinter: 240 }[vehicleCode] || 90;
    }
    if (areaLetters === "RG" || upper.includes("READING")) {
      return { saloon: 110, estate: 120, executive: 135, mpv5: 140, exec_mpv: 170, mpv8: 160, sprinter: 260 }[vehicleCode] || 110;
    }
    if (areaLetters === "OX" || upper.includes("OXFORD")) {
      return { saloon: 150, estate: 160, executive: 175, mpv5: 180, exec_mpv: 210, mpv8: 200, sprinter: 300 }[vehicleCode] || 150;
    }
    if (areaLetters === "MK" || upper.includes("MILTON KEYNES")) {
      return { saloon: 150, estate: 160, executive: 175, mpv5: 180, exec_mpv: 210, mpv8: 200, sprinter: 300 }[vehicleCode] || 150;
    }
    if (areaLetters === "LU" || upper.includes("LUTON")) {
      return { saloon: 120, estate: 130, executive: 145, mpv5: 150, exec_mpv: 180, mpv8: 170, sprinter: 270 }[vehicleCode] || 120;
    }
    if (areaLetters === "WD" || upper.includes("WATFORD")) {
      return { saloon: 110, estate: 120, executive: 135, mpv5: 140, exec_mpv: 170, mpv8: 160, sprinter: 260 }[vehicleCode] || 110;
    }
  }

  if (airportKey === "stansted" || airportKey === "luton") {
    if (upper.includes("SOUTHAMPTON")) return applyFormula(180);
    if (upper.includes("PORTSMOUTH")) return applyFormula(180);
    if (areaLetters === "CR" || upper.includes("CROYDON")) return applyFormula(110);
    if (areaLetters === "BR" || upper.includes("BROMLEY")) return applyFormula(110);
    if (areaLetters === "TN" || upper.includes("TUNBRIDGE")) return applyFormula(120);
    if (areaLetters === "BN" || upper.includes("BRIGHTON")) return applyFormula(150);
    if (areaLetters === "KT" || upper.includes("KINGSTON")) return applyFormula(110);
    if (areaLetters === "SM" || upper.includes("SUTTON")) return applyFormula(110);
    if (areaLetters === "DA" || upper.includes("DARTFORD")) return applyFormula(100);
    if (areaLetters === "CT" || upper.includes("CANTERBURY")) return applyFormula(125);
    if (areaLetters === "RH" || upper.includes("REDHILL") || upper.includes("REIGATE")) return applyFormula(120);
    if (areaLetters === "IG" || upper.includes("ILFORD")) return applyFormula(80);
    if (areaLetters === "RM" || upper.includes("ROMFORD")) return applyFormula(95);
    if (areaLetters === "CM" || upper.includes("CHELMSFORD")) return applyFormula(60);
    if (areaLetters === "SS" || upper.includes("SOUTHEND")) return applyFormula(90);
    if (areaLetters === "CO" || upper.includes("COLCHESTER")) return applyFormula(90);
    if (areaLetters === "CB" || upper.includes("CAMBRIDGE")) return applyFormula(100);
    if (areaLetters === "GU" || upper.includes("GUILDFORD")) return applyFormula(130);
    if (areaLetters === "SL" || upper.includes("SLOUGH")) return applyFormula(130);
    if (areaLetters === "RG" || upper.includes("READING")) return applyFormula(145);
    if (areaLetters === "OX" || upper.includes("OXFORD")) return applyFormula(160);
    if (areaLetters === "MK" || upper.includes("MILTON KEYNES")) return applyFormula(160);
    if (areaLetters === "HP") return applyFormula(120);
    if (areaLetters === "WD" || upper.includes("WATFORD")) return applyFormula(120);
    if (areaLetters === "LU" || upper.includes("LUTON")) return applyFormula(110);
  }

  if (airportKey === "london city") {
    if (areaLetters === "CR" || upper.includes("CROYDON")) return applyFormula(80);
    if (areaLetters === "BR" || upper.includes("BROMLEY")) return applyFormula(90);
    if (areaLetters === "TN" || upper.includes("TUNBRIDGE")) return applyFormula(110);
    if (areaLetters === "BN" || upper.includes("BRIGHTON")) return applyFormula(130);
    if (areaLetters === "KT" || upper.includes("KINGSTON")) return applyFormula(85);
    if (areaLetters === "SM" || upper.includes("SUTTON")) return applyFormula(80);
    if (areaLetters === "DA" || upper.includes("DARTFORD")) return applyFormula(75);
    if (fullCode.startsWith("CT15") || fullCode.startsWith("CT16") || fullCode.startsWith("CT17") || upper.includes("DOVER")) return applyFormula(150);
    if (areaLetters === "CT" || upper.includes("CANTERBURY")) return applyFormula(120);
    if (areaLetters === "RH" || upper.includes("REDHILL") || upper.includes("REIGATE")) return applyFormula(95);
    if (areaLetters === "IG" || upper.includes("ILFORD")) return applyFormula(85);
    if (areaLetters === "RM" || upper.includes("ROMFORD")) return applyFormula(90);
    if (areaLetters === "CM" || upper.includes("CHELMSFORD")) return applyFormula(95);
    if (areaLetters === "SO" || upper.includes("SOUTHAMPTON")) return applyFormula(130);
    if (areaLetters === "CO" || upper.includes("COLCHESTER")) return applyFormula(120);
    if (areaLetters === "CB" || upper.includes("CAMBRIDGE")) return applyFormula(100);
    if (areaLetters === "SL" || upper.includes("SLOUGH")) return applyFormula(90);
    if (areaLetters === "RG" || upper.includes("READING")) return applyFormula(100);
    if (areaLetters === "OX" || upper.includes("OXFORD")) return applyFormula(140);
    if (areaLetters === "MK" || upper.includes("MILTON KEYNES")) return applyFormula(140);
    if (areaLetters === "PO" || upper.includes("PORTSMOUTH")) return applyFormula(170);
  }

  return null;
}

export function quoteVehicles(trip) {
  const returnLeg = Boolean(trip.returnAt);
  const airportKey = detectAirportKey(trip.pickup) || detectAirportKey(trip.dropoff);
  const cityMatch = airportKey ? null : isLongDistanceCityTrip(trip.pickup, trip.dropoff);
  const otherPlace = detectAirportKey(trip.pickup) ? trip.dropoff : trip.pickup;
  const zone = classifyPostcodeZone(otherPlace);
  const estimatedMiles = estimateDistanceMiles(trip.pickup, trip.dropoff);

  const options = [];
  for (const vehicle of VEHICLES) {
    if (vehicle.maxPassengers < trip.passengers) continue;

    let basePence;
    const exactPdfGbp = getExactPdfFare(airportKey, otherPlace, vehicle.code);
    if (exactPdfGbp) {
      basePence = exactPdfGbp * 100;
    } else if (airportKey && AIRPORT_PRICING[airportKey]) {
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
    const discPct = trip.discountPercent || 0;
    const discountPence = Math.floor((subtotal * discPct) / 100);
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
        discountPercent: discPct,
        discountPence,
        totalPence,
      },
    });
  }

  if (!options.length) throw new Error("No vehicle in the fleet fits this passenger count.");
  return options;
}


