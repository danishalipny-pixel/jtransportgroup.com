export const VEHICLES = [
  {
    code: "saloon",
    name: "Saloon Car",
    maxPassengers: 4,
    luggage: "Up to 2 large suitcases and 2 small bags",
    examples: "Toyota Corolla, VW Golf, Prius or similar",
    basePence: 4500, // £45.00 Minimum Fare (PDF Page 2 Section 1.1)
    localBasePence: 4500,
    localPerMilePence: 250,
    perMilePence: 150, // £1.50 / mile (PDF Page 11 Section 7.1)
    image: "assets/images/saloon.png",
  },
  {
    code: "estate",
    name: "Executive Estate",
    maxPassengers: 4,
    luggage: "Up to 3 large suitcases and 2 small bags",
    examples: "VW Passat Estate, Skoda Superb Estate",
    basePence: 5500, // £55.00 Minimum Fare (PDF Page 3 Section 2.1)
    localBasePence: 5500,
    localPerMilePence: 280,
    perMilePence: 160, // £1.60 / mile (PDF Page 11 Section 7.1)
    image: "assets/images/estate.png",
  },
  {
    code: "executive",
    name: "Business Class / Executive Saloon",
    maxPassengers: 4,
    luggage: "Up to 2 large suitcases and 2 small bags",
    examples: "Mercedes-Benz E-Class, BMW 5 Series",
    basePence: 6500, // £65.00 Minimum Fare (PDF Page 4 Section 3.1)
    localBasePence: 6500,
    localPerMilePence: 350,
    perMilePence: 180, // £1.80 / mile (PDF Page 11 Section 7.1)
    image: "assets/images/executive-saloon.png",
  },
  {
    code: "mpv5",
    name: "MPV (5 Seater)",
    maxPassengers: 5,
    luggage: "Up to 4 large suitcases and 3 small bags",
    examples: "VW Multivan, Ford Tourneo or similar",
    basePence: 6500, // £65.00 Minimum Fare (PDF Page 6 Section 5.2)
    localBasePence: 6500,
    localPerMilePence: 320,
    perMilePence: 180, // £1.80 / mile (PDF Page 11 Section 7.1)
    image: "assets/images/mpv.png",
  },
  {
    code: "exec-mpv",
    name: "Executive MPV (6 Seater)",
    maxPassengers: 6,
    luggage: "Up to 5 large suitcases and 4 small bags",
    examples: "Mercedes-Benz V-Class",
    basePence: 10000, // £100.00 Minimum Fare (PDF Page 5 Section 4.1)
    localBasePence: 10000,
    localPerMilePence: 380,
    perMilePence: 230, // £2.30 / mile (PDF Page 11 Section 7.1)
    image: "assets/images/mpv-plus.png",
  },
  {
    code: "minivan8",
    name: "Minivan 8-Seater (MPV8)",
    maxPassengers: 8,
    luggage: "Up to 8 large suitcases",
    examples: "Mercedes-Benz Vito 8 Seater",
    basePence: 7500, // £75.00 Minimum Fare (PDF Page 6 Section 5.2)
    localBasePence: 7500,
    localPerMilePence: 350,
    perMilePence: 210, // £2.10 / mile (PDF Page 11 Section 7.1)
    image: "assets/images/minivan.png",
  },
  {
    code: "sprinter",
    name: "Mercedes Sprinter (14–16 Seater)",
    maxPassengers: 16,
    luggage: "Up to 16 luggage pieces",
    examples: "Luxury Minibus for Group Travel",
    basePence: 15000, // £150.00 Minimum Fare (PDF Page 6 Section 5.2)
    localBasePence: 15000,
    localPerMilePence: 600,
    perMilePence: 330, // £3.30 / mile (PDF Page 11 Section 7.1)
    image: "assets/images/14-seater.png",
  },
];

// PDF Fixed Long-Distance Airport -> City Pricing Guide (Pages 11-13)
const PDF_LONG_DISTANCE_MATRIX = {
  gatwick: {
    manchester: { saloon: 338, estate: 360, executive: 405, mpv5: 405, mpv8: 473, exec_mpv: 518, sprinter: 743 },
    liverpool: { saloon: 368, estate: 392, executive: 441, mpv5: 441, mpv8: 515, exec_mpv: 564, sprinter: 809 },
    birmingham: { saloon: 240, estate: 256, executive: 288, mpv5: 288, mpv8: 336, exec_mpv: 368, sprinter: 528 },
    bristol: { saloon: 218, estate: 232, executive: 261, mpv5: 261, mpv8: 305, exec_mpv: 334, sprinter: 479 },
    leeds: { saloon: 338, estate: 360, executive: 405, mpv5: 405, mpv8: 473, exec_mpv: 518, sprinter: 743 },
    sheffield: { saloon: 308, estate: 328, executive: 369, mpv5: 369, mpv8: 431, exec_mpv: 472, sprinter: 677 },
    nottingham: { saloon: 263, estate: 280, executive: 315, mpv5: 315, mpv8: 368, exec_mpv: 403, sprinter: 578 },
    leicester: { saloon: 233, estate: 248, executive: 279, mpv5: 279, mpv8: 326, exec_mpv: 357, sprinter: 512 },
    coventry: { saloon: 233, estate: 248, executive: 279, mpv5: 279, mpv8: 326, exec_mpv: 357, sprinter: 512 },
    derby: { saloon: 278, estate: 296, executive: 333, mpv5: 333, mpv8: 389, exec_mpv: 426, sprinter: 611 },
    newcastle: { saloon: 450, estate: 480, executive: 540, mpv5: 540, mpv8: 630, exec_mpv: 690, sprinter: 990 },
    southampton: { saloon: 143, estate: 152, executive: 171, mpv5: 171, mpv8: 200, exec_mpv: 219, sprinter: 314 },
    oxford: { saloon: 158, estate: 168, executive: 189, mpv5: 189, mpv8: 221, exec_mpv: 242, sprinter: 347 },
    cambridge: { saloon: 188, estate: 200, executive: 225, mpv5: 225, mpv8: 263, exec_mpv: 288, sprinter: 413 },
    bournemouth: { saloon: 173, estate: 184, executive: 207, mpv5: 207, mpv8: 242, exec_mpv: 265, sprinter: 380 },
    plymouth: { saloon: 375, estate: 400, executive: 450, mpv5: 450, mpv8: 525, exec_mpv: 575, sprinter: 825 },
    exeter: { saloon: 323, estate: 344, executive: 387, mpv5: 387, mpv8: 452, exec_mpv: 495, sprinter: 710 },
    norwich: { saloon: 218, estate: 232, executive: 261, mpv5: 261, mpv8: 305, exec_mpv: 334, sprinter: 479 },
    york: { saloon: 360, estate: 384, executive: 432, mpv5: 432, mpv8: 504, exec_mpv: 552, sprinter: 792 },
    "milton keynes": { saloon: 188, estate: 200, executive: 225, mpv5: 225, mpv8: 263, exec_mpv: 288, sprinter: 413 },
  },
  heathrow: {
    manchester: { saloon: 308, estate: 328, executive: 369, mpv5: 369, mpv8: 431, exec_mpv: 472, sprinter: 677 },
    liverpool: { saloon: 323, estate: 344, executive: 387, mpv5: 387, mpv8: 452, exec_mpv: 495, sprinter: 710 },
    birmingham: { saloon: 180, estate: 192, executive: 216, mpv5: 216, mpv8: 252, exec_mpv: 276, sprinter: 396 },
    bristol: { saloon: 158, estate: 168, executive: 189, mpv5: 189, mpv8: 221, exec_mpv: 242, sprinter: 347 },
    leeds: { saloon: 293, estate: 312, executive: 351, mpv5: 351, mpv8: 410, exec_mpv: 449, sprinter: 644 },
    sheffield: { saloon: 255, estate: 272, executive: 306, mpv5: 306, mpv8: 357, exec_mpv: 391, sprinter: 561 },
    nottingham: { saloon: 218, estate: 232, executive: 261, mpv5: 261, mpv8: 305, exec_mpv: 334, sprinter: 479 },
    leicester: { saloon: 188, estate: 200, executive: 225, mpv5: 225, mpv8: 263, exec_mpv: 288, sprinter: 413 },
    coventry: { saloon: 180, estate: 192, executive: 216, mpv5: 216, mpv8: 252, exec_mpv: 276, sprinter: 396 },
    derby: { saloon: 233, estate: 248, executive: 279, mpv5: 279, mpv8: 326, exec_mpv: 357, sprinter: 512 },
    newcastle: { saloon: 420, estate: 448, executive: 504, mpv5: 504, mpv8: 588, exec_mpv: 644, sprinter: 924 },
    bournemouth: { saloon: 158, estate: 168, executive: 189, mpv5: 189, mpv8: 221, exec_mpv: 242, sprinter: 347 },
    plymouth: { saloon: 315, estate: 336, executive: 378, mpv5: 378, mpv8: 441, exec_mpv: 483, sprinter: 693 },
    exeter: { saloon: 263, estate: 280, executive: 315, mpv5: 315, mpv8: 368, exec_mpv: 403, sprinter: 578 },
    norwich: { saloon: 188, estate: 200, executive: 225, mpv5: 225, mpv8: 263, exec_mpv: 288, sprinter: 413 },
    york: { saloon: 315, estate: 336, executive: 378, mpv5: 378, mpv8: 441, exec_mpv: 483, sprinter: 693 },
  },
  stansted: {
    manchester: { saloon: 308, estate: 328, executive: 369, mpv5: 369, mpv8: 431, exec_mpv: 472, sprinter: 677 },
    liverpool: { saloon: 338, estate: 360, executive: 405, mpv5: 405, mpv8: 473, exec_mpv: 518, sprinter: 743 },
    birmingham: { saloon: 218, estate: 232, executive: 261, mpv5: 261, mpv8: 305, exec_mpv: 334, sprinter: 479 },
    bristol: { saloon: 263, estate: 280, executive: 315, mpv5: 315, mpv8: 368, exec_mpv: 403, sprinter: 578 },
    leeds: { saloon: 300, estate: 320, executive: 360, mpv5: 360, mpv8: 420, exec_mpv: 460, sprinter: 660 },
    sheffield: { saloon: 270, estate: 288, executive: 324, mpv5: 324, mpv8: 378, exec_mpv: 414, sprinter: 594 },
    nottingham: { saloon: 225, estate: 240, executive: 270, mpv5: 270, mpv8: 315, exec_mpv: 345, sprinter: 495 },
    leicester: { saloon: 202, estate: 216, executive: 243, mpv5: 243, mpv8: 284, exec_mpv: 311, sprinter: 446 },
    coventry: { saloon: 210, estate: 224, executive: 252, mpv5: 252, mpv8: 294, exec_mpv: 322, sprinter: 462 },
    derby: { saloon: 247, estate: 264, executive: 297, mpv5: 297, mpv8: 347, exec_mpv: 380, sprinter: 545 },
    newcastle: { saloon: 405, estate: 432, executive: 486, mpv5: 486, mpv8: 567, exec_mpv: 621, sprinter: 891 },
    brighton: { saloon: 158, estate: 168, executive: 189, mpv5: 189, mpv8: 221, exec_mpv: 242, sprinter: 347 },
    southampton: { saloon: 188, estate: 200, executive: 225, mpv5: 225, mpv8: 263, exec_mpv: 288, sprinter: 413 },
    plymouth: { saloon: 375, estate: 400, executive: 450, mpv5: 450, mpv8: 525, exec_mpv: 575, sprinter: 825 },
  },
  luton: {
    manchester: { saloon: 255, estate: 272, executive: 306, mpv5: 306, mpv8: 357, exec_mpv: 391, sprinter: 561 },
    liverpool: { saloon: 293, estate: 312, executive: 351, mpv5: 351, mpv8: 410, exec_mpv: 449, sprinter: 644 },
    birmingham: { saloon: 173, estate: 184, executive: 207, mpv5: 207, mpv8: 242, exec_mpv: 265, sprinter: 380 },
    bristol: { saloon: 195, estate: 208, executive: 234, mpv5: 234, mpv8: 273, exec_mpv: 299, sprinter: 429 },
    leeds: { saloon: 270, estate: 288, executive: 324, mpv5: 324, mpv8: 378, exec_mpv: 414, sprinter: 594 },
    sheffield: { saloon: 233, estate: 248, executive: 279, mpv5: 279, mpv8: 326, exec_mpv: 357, sprinter: 512 },
    newcastle: { saloon: 375, estate: 400, executive: 450, mpv5: 450, mpv8: 525, exec_mpv: 575, sprinter: 825 },
    brighton: { saloon: 158, estate: 168, executive: 189, mpv5: 189, mpv8: 221, exec_mpv: 242, sprinter: 347 },
    southampton: { saloon: 143, estate: 152, executive: 171, mpv5: 171, mpv8: 200, exec_mpv: 219, sprinter: 314 },
    plymouth: { saloon: 315, estate: 336, executive: 378, mpv5: 378, mpv8: 441, exec_mpv: 483, sprinter: 693 },
  },
};

// PDF Airport Transfer Postcode Pricing Matrix (in GBP)
const AIRPORT_PRICING = {
  heathrow: {
    inner: { saloon: 90, estate: 100, executive: 110, 'executive-saloon': 110, mpv: 110, mpv5: 110, 'exec-mpv': 150, exec_mpv: 150, minivan8: 130, mpv8: 130, sprinter: 230 },
    outer: { saloon: 85, estate: 90, executive: 110, 'executive-saloon': 110, mpv: 105, mpv5: 105, 'exec-mpv': 140, exec_mpv: 140, minivan8: 120, mpv8: 120, sprinter: 230 },
  },
  gatwick: {
    inner: { saloon: 110, estate: 120, executive: 130, 'executive-saloon': 130, mpv: 130, mpv5: 130, 'exec-mpv': 170, exec_mpv: 170, minivan8: 150, mpv8: 150, sprinter: 270 },
    outer: { saloon: 100, estate: 110, executive: 120, 'executive-saloon': 120, mpv: 120, mpv5: 120, 'exec-mpv': 150, exec_mpv: 150, minivan8: 140, mpv8: 140, sprinter: 250 },
  },
  stansted: {
    inner: { saloon: 95, estate: 100, executive: 120, 'executive-saloon': 120, mpv: 120, mpv5: 120, 'exec-mpv': 150, exec_mpv: 150, minivan8: 130, mpv8: 130, sprinter: 240 },
    outer: { saloon: 95, estate: 100, executive: 120, 'executive-saloon': 120, mpv: 120, mpv5: 120, 'exec-mpv': 150, exec_mpv: 150, minivan8: 130, mpv8: 130, sprinter: 240 },
  },
  luton: {
    inner: { saloon: 95, estate: 100, executive: 120, 'executive-saloon': 120, mpv: 120, mpv5: 120, 'exec-mpv': 150, exec_mpv: 150, minivan8: 130, mpv8: 130, sprinter: 240 },
    outer: { saloon: 95, estate: 100, executive: 120, 'executive-saloon': 120, mpv: 120, mpv5: 120, 'exec-mpv': 150, exec_mpv: 150, minivan8: 130, mpv8: 130, sprinter: 240 },
  },
  "london city": {
    inner: { saloon: 50, estate: 60, executive: 70, 'executive-saloon': 70, mpv: 70, mpv5: 70, 'exec-mpv': 100, exec_mpv: 100, minivan8: 90, mpv8: 90, sprinter: 120 },
    outer: { saloon: 50, estate: 60, executive: 70, 'executive-saloon': 70, mpv: 70, mpv5: 70, 'exec-mpv': 100, exec_mpv: 100, minivan8: 90, mpv8: 90, sprinter: 120 },
  },
};

// PDF Official Distance-Based Fixed Pricing (30-90 Miles)
// Exact fare levels per PDF: Minimum Fare (30-50 Miles), High Fare (50-80 Miles), Maximum Fare (80-90 Miles)
export const PDF_DISTANCE_FIXED_PRICING = {
  // Minimum Fare level: 30-50 Miles
  minimum: {
    saloon: 110,
    estate: 120,
    executive: 125,
    'executive-saloon': 125,
    mpv: 120,
    mpv5: 120,
    mpv8: 140,
    minivan8: 140,
    minivan: 140,
    exec_mpv: 160,
    'exec-mpv': 160,
    'mpv-plus': 160,
    sprinter: 250,
  },
  // High Fare level: 50-80 Miles
  high: {
    saloon: 130,
    estate: 140,
    executive: 150,
    'executive-saloon': 150,
    mpv: 150,
    mpv5: 150,
    mpv8: 180,
    minivan8: 180,
    minivan: 180,
    exec_mpv: 220,
    'exec-mpv': 220,
    'mpv-plus': 220,
    sprinter: 340,
  },
  // Maximum Fare level: 80-90 Miles
  maximum: {
    saloon: 150,
    estate: 160,
    executive: 175,
    'executive-saloon': 175,
    mpv: 175,
    mpv5: 175,
    mpv8: 220,
    minivan8: 220,
    minivan: 220,
    exec_mpv: 280,
    'exec-mpv': 280,
    'mpv-plus': 280,
    sprinter: 500,
  },
};

// Aliases for backwards compatibility
PDF_DISTANCE_FIXED_PRICING.low = PDF_DISTANCE_FIXED_PRICING.minimum;
PDF_DISTANCE_FIXED_PRICING.medium = PDF_DISTANCE_FIXED_PRICING.high;
export const MEDIUM_DISTANCE_FIXED_PRICING = PDF_DISTANCE_FIXED_PRICING;

// Official J TRANSPORT GROUP LTD – SHORT DISTANCE PRICE LIST (0-30 Miles)
export const SHORT_DISTANCE_FIXED_PRICING = {
  "0-5": {
    saloon: 45,
    estate: 55,
    executive: 65,
    "executive-saloon": 65,
    mpv: 65,
    mpv5: 65,
    minivan: 75,
    minivan8: 75,
    mpv8: 75,
    exec_mpv: 100,
    "exec-mpv": 100,
    "mpv-plus": 100,
    sprinter: 150,
  },
  "6-10": {
    saloon: 55,
    estate: 70,
    executive: 75,
    "executive-saloon": 75,
    mpv: 75,
    mpv5: 75,
    minivan: 85,
    minivan8: 85,
    mpv8: 85,
    exec_mpv: 130,
    "exec-mpv": 130,
    "mpv-plus": 130,
    sprinter: 170,
  },
  "11-20": {
    saloon: 70,
    estate: 85,
    executive: 85,
    "executive-saloon": 85,
    mpv: 85,
    mpv5: 85,
    minivan: 95,
    minivan8: 95,
    mpv8: 95,
    exec_mpv: 145,
    "exec-mpv": 145,
    "mpv-plus": 145,
    sprinter: 190,
  },
  "21-30": {
    saloon: 85,
    estate: 95,
    executive: 105,
    "executive-saloon": 105,
    mpv: 105,
    mpv5: 105,
    minivan: 120,
    minivan8: 120,
    mpv8: 120,
    exec_mpv: 150,
    "exec-mpv": 150,
    "mpv-plus": 150,
    sprinter: 220,
  },
};

export function getShortDistanceTier(miles) {
  if (miles <= 5) return "0-5";
  if (miles <= 10) return "6-10";
  if (miles <= 20) return "11-20";
  if (miles <= 30) return "21-30";
  return null;
}

export function getDistanceFareTier(miles) {
  if (miles > 30 && miles <= 50) return "minimum";
  if (miles > 50 && miles <= 80) return "high";
  if (miles > 80 && miles <= 90) return "maximum";
  return null;
}

export function getMediumDistanceBracket(miles) {
  return getDistanceFareTier(miles);
}

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

const UK_CITIES_DISTANCE = [
  { name: "manchester", postcodes: ["m1", "m2", "m3", "m4", "m5", "m6", "m7", "m8", "m9", "m10", "m11", "m12", "m13", "m14", "m15", "m16", "m17", "m18", "m19", "m20", "m21", "m22", "m23", "m24", "m25", "m26", "m27", "m28", "m29", "m30", "m31", "m32", "m33", "m34", "m35", "m38", "m40", "m41", "m43", "m44", "m45", "m46", "m50", "m60", "m90"], miles: 205 },
  { name: "liverpool", postcodes: ["l1", "l2", "l3", "l4", "l5", "l6", "l7", "l8", "l9", "l10", "l11", "l12", "l13", "l14", "l15", "l16", "l17", "l18", "l19", "l20", "l21", "l22", "l23", "l24", "l25", "l26", "l27", "l28", "l29", "l30", "l31", "l32", "l33", "l34", "l35", "l36", "l37", "l38", "l39", "l40"], miles: 220 },
  { name: "birmingham", postcodes: ["b1", "b2", "b3", "b4", "b5", "b6", "b7", "b8", "b9", "b10", "b11", "b12", "b13", "b14", "b15", "b16", "b17", "b18", "b19", "b20", "b21", "b23", "b24", "b25", "b26", "b27", "b28", "b29", "b30", "b31", "b32", "b33", "b34", "b35", "b36", "b37", "b38", "b40", "b42", "b43", "b44", "b45", "b46", "b47", "b48", "b49", "b50", "b60", "b61", "b62", "b63", "b64", "b65", "b66", "b67", "b68", "b69", "b70", "b71", "b72", "b73", "b74", "b75", "b76", "b77", "b78", "b79", "b80", "b90", "b91", "b92", "b93", "b94", "b95", "b96", "b97", "b98"], miles: 120 },
  { name: "bristol", postcodes: ["bs1", "bs2", "bs3", "bs4", "bs5", "bs6", "bs7", "bs8", "bs9", "bs10", "bs11", "bs13", "bs14", "bs15", "bs16", "bs20", "bs21", "bs22", "bs23", "bs24", "bs25", "bs26", "bs27", "bs28", "bs29", "bs30", "bs31", "bs32", "bs34", "bs35", "bs36", "bs37", "bs39", "bs40", "bs41", "bs48", "bs49"], miles: 115 },
  { name: "leeds", postcodes: ["ls1", "ls2", "ls3", "ls4", "ls5", "ls6", "ls7", "ls8", "ls9", "ls10", "ls11", "ls12", "ls13", "ls14", "ls15", "ls16", "ls17", "ls18", "ls19", "ls20", "ls21", "ls22", "ls23", "ls24", "ls25", "ls26", "ls27", "ls28", "ls29"], miles: 195 },
  { name: "sheffield", postcodes: ["s1", "s2", "s3", "s4", "s5", "s6", "s7", "s8", "s9", "s10", "s11", "s12", "s13", "s14", "s17", "s18", "s20", "s21", "s25", "s26", "s32", "s33", "s35", "s36", "s40", "s41", "s42", "s43", "s44", "s45", "s60", "s61", "s62", "s63", "s64", "s65", "s66", "s70", "s71", "s72", "s73", "s74", "s75", "s80", "s81"], miles: 170 },
  { name: "nottingham", postcodes: ["ng1", "ng2", "ng3", "ng4", "ng5", "ng6", "ng7", "ng8", "ng9", "ng10", "ng11", "ng12", "ng13", "ng14", "ng15", "ng16", "ng17", "ng18", "ng19", "ng20", "ng21", "ng22", "ng23", "ng24", "ng25", "ng31", "ng32", "ng33", "ng34"], miles: 130 },
  { name: "leicester", postcodes: ["le1", "le2", "le3", "le4", "le5", "le6", "le7", "le8", "le9", "le10", "le11", "le12", "le13", "le14", "le15", "le16", "le17", "le18", "le19", "le65", "le67"], miles: 105 },
  { name: "coventry", postcodes: ["cv1", "cv2", "cv3", "cv4", "cv5", "cv6", "cv7", "cv8", "cv9", "cv10", "cv11", "cv12", "cv13", "cv21", "cv22", "cv23", "cv31", "cv32", "cv33", "cv34", "cv35", "cv36", "cv37", "cv47"], miles: 105 },
  { name: "derby", postcodes: ["de1", "de3", "de4", "de5", "de6", "de7", "de11", "de12", "de13", "de14", "de15", "de21", "de22", "de23", "de24", "de55", "de56", "de65", "de72", "de73", "de74", "de75"], miles: 130 },
  { name: "newcastle", postcodes: ["ne1", "ne2", "ne3", "ne4", "ne5", "ne6", "ne7", "ne8", "ne9", "ne10", "ne11", "ne12", "ne13", "ne15", "ne16", "ne17", "ne18", "ne19", "ne20", "ne21", "ne22", "ne23", "ne24", "ne25", "ne26", "ne27", "ne28", "ne29", "ne30", "ne31", "ne32", "ne33", "ne34", "ne35", "ne36", "ne37", "ne38", "ne39", "ne40", "ne41", "ne42", "ne43", "ne44", "ne45", "ne46", "ne47", "ne48", "ne49", "ne61", "ne62", "ne63", "ne64", "ne65", "ne66", "ne67", "ne68", "ne69", "ne70", "ne71"], miles: 280 },
  { name: "brighton", postcodes: ["bn1", "bn2", "bn3", "bn7", "bn8", "bn9", "bn10", "bn11", "bn12", "bn13", "bn14", "bn15", "bn16", "bn17", "bn18", "bn20", "bn21", "bn22", "bn23", "bn24", "bn25", "bn26", "bn27", "bn41", "bn42", "bn43", "bn44", "bn45"], miles: 60 },
  { name: "southampton", postcodes: ["so14", "so15", "so16", "so17", "so18", "so19", "so20", "so21", "so22", "so23", "so24", "so30", "so31", "so32", "so40", "so41", "so42", "so43", "so45", "so50", "so51", "so52", "so53"], miles: 80 },
  { name: "portsmouth", postcodes: ["po1", "po2", "po3", "po4", "po5", "po6", "po7", "po8", "po9", "po10", "po11", "po12", "po13", "po14", "po15", "po16", "po17", "po18", "po19", "po20", "po21", "po22", "po30", "po31", "po32", "po33", "po34", "po35", "po36", "po37", "po38", "po39", "po40", "po41"], miles: 75 },
  { name: "oxford", postcodes: ["ox1", "ox2", "ox3", "ox4", "ox5", "ox7", "ox9", "ox10", "ox11", "ox12", "ox13", "ox14", "ox18", "ox20", "ox25", "ox26", "ox27", "ox28", "ox29", "ox33", "ox39", "ox44", "ox49"], miles: 55 },
  { name: "cambridge", postcodes: ["cb1", "cb2", "cb3", "cb4", "cb5", "cb6", "cb7", "cb8", "cb9", "cb10", "cb11", "cb21", "cb22", "cb23", "cb24", "cb25"], miles: 60 },
  { name: "reading", postcodes: ["rg1", "rg2", "rg4", "rg5", "rg6", "rg7", "rg8", "rg9", "rg10", "rg12", "rg14", "rg17", "rg18", "rg19", "rg20", "rg21", "rg22", "rg23", "rg24", "rg25", "rg26", "rg27", "rg28", "rg29", "rg30", "rg31", "rg40", "rg41", "rg42", "rg45"], miles: 40 },
  { name: "bournemouth", postcodes: ["bh1", "bh2", "bh3", "bh4", "bh5", "bh6", "bh7", "bh8", "bh9", "bh10", "bh11", "bh12", "bh13", "bh14", "bh15", "bh16", "bh17", "bh18", "bh19", "bh20", "bh21", "bh22", "bh23", "bh24", "bh25", "bh31"], miles: 110 },
  { name: "plymouth", postcodes: ["pl1", "pl2", "pl3", "pl4", "pl5", "pl6", "pl7", "pl8", "pl9", "pl10", "pl11", "pl12", "pl13", "pl14", "pl15", "pl16", "pl17", "pl18", "pl19", "pl20", "pl21", "pl22", "pl23", "pl24", "pl25", "pl26", "pl27", "pl28", "pl29", "pl30", "pl31", "pl32", "pl33", "pl34", "pl35"], miles: 220 },
  { name: "exeter", postcodes: ["ex1", "ex2", "ex3", "ex4", "ex5", "ex6", "ex7", "ex8", "ex9", "ex10", "ex11", "ex12", "ex13", "ex14", "ex15", "ex16", "ex17", "ex18", "ex19", "ex20", "ex21", "ex22", "ex23", "ex24", "ex31", "ex32", "ex33", "ex34", "ex35", "ex36", "ex37", "ex38", "ex39"], miles: 175 },
  { name: "norwich", postcodes: ["nr1", "nr2", "nr3", "nr4", "nr5", "nr6", "nr7", "nr8", "nr9", "nr10", "nr11", "nr12", "nr13", "nr14", "nr15", "nr16", "nr17", "nr18", "nr19", "nr20", "nr21", "nr22", "nr23", "nr24", "nr25", "nr26", "nr27", "nr28", "nr29", "nr30", "nr31", "nr32", "nr33", "nr34", "nr35"], miles: 115 },
  { name: "york", postcodes: ["yo1", "yo10", "yo19", "yo23", "yo24", "yo26", "yo30", "yo31", "yo32", "yo41", "yo42", "yo43", "yo51", "yo60", "yo61", "yo62"], miles: 200 },
  { name: "milton keynes", postcodes: ["mk1", "mk2", "mk3", "mk4", "mk5", "mk6", "mk7", "mk8", "mk9", "mk10", "mk11", "mk12", "mk13", "mk14", "mk15", "mk16", "mk17", "mk18", "mk19", "mk40", "mk41", "mk42", "mk43", "mk44", "mk45", "mk46"], miles: 55 },
  { name: "edinburgh", postcodes: ["eh1", "eh2", "eh3", "eh4", "eh5", "eh6", "eh7", "eh8", "eh9", "eh10", "eh11", "eh12", "eh13", "eh14", "eh15", "eh16", "eh17"], miles: 400 },
  { name: "glasgow", postcodes: ["g1", "g2", "g3", "g4", "g5", "g11", "g12", "g13", "g14", "g15", "g20", "g21", "g22", "g23", "g31", "g32", "g33", "g34", "g40", "g41", "g42", "g43", "g44", "g45", "g46", "g51", "g52", "g53"], miles: 400 },
  { name: "cardiff", postcodes: ["cf10", "cf11", "cf14", "cf15", "cf23", "cf24", "cf3", "cf5"], miles: 150 },
  { name: "hull", postcodes: ["hu1", "hu2", "hu3", "hu4", "hu5", "hu6", "hu7", "hu8", "hu9"], miles: 200 },
  { name: "blackpool", postcodes: ["fy1", "fy2", "fy3", "fy4"], miles: 235 },
  { name: "carlisle", postcodes: ["ca1", "ca2", "ca3", "ca4", "ca5"], miles: 310 },
  { name: "aberdeen", postcodes: ["ab10", "ab11", "ab12", "ab15", "ab24", "ab25"], miles: 500 },
  { name: "inverness", postcodes: ["iv1", "iv2", "iv3"], miles: 550 },
];

function detectAirportKey(place) {
  const lowered = String(place || "").toLowerCase();
  if (lowered.includes("heathrow")) return "heathrow";
  if (lowered.includes("gatwick")) return "gatwick";
  if (lowered.includes("stansted")) return "stansted";
  if (lowered.includes("luton")) return "luton";
  if (lowered.includes("london city") || lowered.includes("city airport")) return "london city";
  return null;
}

function detectPdfCityKey(place) {
  const lowered = String(place || "").toLowerCase();
  const cities = [
    "manchester", "liverpool", "birmingham", "bristol", "leeds", "sheffield",
    "nottingham", "leicester", "coventry", "derby", "newcastle", "brighton",
    "southampton", "portsmouth", "oxford", "cambridge", "reading", "bournemouth",
    "plymouth", "exeter", "norwich", "york", "milton keynes"
  ];
  return cities.find(c => lowered.includes(c)) || null;
}

function classifyPostcodeZone(place) {
  const text = String(place || "").toUpperCase();
  const match = text.match(/\b([A-Z]{1,2}[0-9]{1,2}[A-Z]?)\b/);
  const code = match ? match[1] : "";

  if (
    /^(EC[1-4]|WC[1-2]|W1|SW1|SE1|E1$|E[2-9]|E1[0-8]|N[1-9]|N1[0-9]|N2[0-2])$/.test(code) ||
    /^(EC1[A-Z]|EC2[A-Z]|EC3[A-Z]|EC4[A-Z]|WC1[A-Z]|WC2[A-Z]|W1[A-Z]|SW1[A-Z]|SE1[P]|E1[W]|N1[C])$/.test(code)
  ) {
    return "inner";
  }

  if (/^(W[2-9]|W1[0-4]|SW[2-9]|SW1[0-9]|SW20|SE[2-9]|SE1[0-9]|SE2[0-8]|NW[1-9]|NW1[0-1])$/.test(code)) {
    return "outer";
  }

  if (
    text.includes("STOCKLEY") || text.includes("CLAPHAM") || text.includes("BRIXTON") ||
    text.includes("WIMBLEDON") || text.includes("EALING") || text.includes("SLOUGH") ||
    text.includes("UXBRIDGE") || text.includes("CROYDON")
  ) {
    return "outer";
  }

  return "inner";
}

function isLondonPlace(place) {
  const text = String(place || "").toUpperCase();
  const match = text.match(/\b([A-Z]{1,2}[0-9]{1,2}[A-Z]?)\b/);
  const code = match ? match[1] : "";

  if (
    /^(EC[1-4]|WC[1-2]|W1|SW1|SE1|E1$|E[2-9]|E1[0-8]|N[1-9]|N1[0-9]|N2[0-2])$/.test(code) ||
    /^(EC1[A-Z]|EC2[A-Z]|EC3[A-Z]|EC4[A-Z]|WC1[A-Z]|WC2[A-Z]|W1[A-Z]|SW1[A-Z]|SE1[P]|E1[W]|N1[C])$/.test(code) ||
    /^(W[2-9]|W1[0-4]|SW[2-9]|SW1[0-9]|SW20|SE[2-9]|SE1[0-9]|SE2[0-8]|NW[1-9]|NW1[0-1])$/.test(code) ||
    /^(BR|CR|DA|EN|HA|IG|KT|RM|SM|TW|UB)[0-9]/.test(code)
  ) {
    return true;
  }

  if (
    text.includes("LONDON") || text.includes("STOCKLEY") || text.includes("CLAPHAM") || text.includes("BRIXTON") ||
    text.includes("WIMBLEDON") || text.includes("EALING") || text.includes("SLOUGH") ||
    text.includes("UXBRIDGE") || text.includes("CROYDON") || text.includes("KING'S CROSS") ||
    text.includes("PADDINGTON") || text.includes("VICTORIA") || text.includes("WATERLOO") ||
    text.includes("EUSTON") || text.includes("LIVERPOOL STREET") || text.includes("LONDON BRIDGE")
  ) {
    return true;
  }

  return false;
}

const UK_POSTCODE_AREA_MILES = {
  AB: 500, AL: 25, B: 120, BA: 115, BB: 210, BD: 200, BH: 110, BL: 205, BN: 60, BR: 12,
  BS: 115, BT: 350, CA: 310, CB: 60, CF: 150, CH: 190, CM: 35, CO: 60, CR: 12, CT: 65,
  CV: 105, CW: 170, DA: 18, DD: 450, DE: 130, DG: 330, DH: 260, DL: 240, DN: 165, DT: 130,
  DY: 125, E: 8, EC: 0, EH: 400, EN: 14, EX: 175, FK: 410, FY: 235, G: 400, GL: 105,
  GU: 32, HA: 14, HD: 185, HG: 210, HP: 30, HR: 135, HU: 200, HX: 190, IG: 12, IP: 80,
  IV: 550, KA: 390, KT: 14, KW: 650, KY: 420, L: 220, LA: 240, LD: 170, LE: 105, LL: 220,
  LN: 140, LS: 195, LU: 32, M: 205, ME: 35, MK: 55, ML: 385, N: 8, NE: 280, NG: 130,
  NN: 65, NP: 140, NR: 115, NW: 8, OL: 200, OX: 55, PA: 405, PE: 85, PH: 440, PL: 220,
  PO: 75, PR: 220, RG: 40, RH: 28, RM: 16, S: 170, SA: 185, SE: 8, SG: 35, SK: 195,
  SL: 22, SM: 12, SN: 80, SO: 80, SP: 85, SR: 270, SS: 42, ST: 160, SW: 5, SY: 160,
  TA: 150, TD: 360, TF: 145, TN: 40, TQ: 190, TR: 260, TS: 250, TW: 14, UB: 16, W: 5,
  WA: 190, WC: 0, WD: 18, WF: 185, WN: 200, WR: 120, WS: 125, WV: 130, YO: 200
};

function extractUkPostcodeMiles(text) {
  const str = String(text || "").toUpperCase();
  const matches = str.match(/\b([A-Z]{1,2}[0-9][0-9A-Z]?)\b/g);
  if (matches) {
    for (const outcode of matches) {
      const alphaPrefix = outcode.replace(/[^A-Z]/g, "");
      if (UK_POSTCODE_AREA_MILES[alphaPrefix] !== undefined) {
        return UK_POSTCODE_AREA_MILES[alphaPrefix];
      }
    }
  }
  return null;
}

function estimateDistanceMiles(pickup, dropoff) {
  const combined = (String(pickup || "") + " " + String(dropoff || "")).toLowerCase();
  
  const milesMatch = combined.match(/\b(\d+(?:\.\d+)?)\s*(?:miles|mile|mi)\b/i);
  if (milesMatch) {
    return parseFloat(milesMatch[1]);
  }

  for (const city of UK_CITIES_DISTANCE) {
    if (combined.includes(city.name)) {
      return city.miles;
    }
    if (city.postcodes && city.postcodes.some(pc => new RegExp('\\b' + pc + '\\b', 'i').test(combined))) {
      return city.miles;
    }
  }

  const pcMilesPickup = extractUkPostcodeMiles(pickup);
  const pcMilesDropoff = extractUkPostcodeMiles(dropoff);
  const maxPcMiles = Math.max(pcMilesPickup || 0, pcMilesDropoff || 0);
  if (maxPcMiles > 0) {
    return maxPcMiles;
  }

  if (combined.includes("gatwick")) return 28;
  if (combined.includes("stansted")) return 36;
  if (combined.includes("luton")) return 32;
  if (combined.includes("heathrow")) return 18;
  if (combined.includes("city airport") || combined.includes("london city")) return 10;

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
  const pdfCityKey = airportKey ? detectPdfCityKey(otherPlace) : null;
  const zone = classifyPostcodeZone(otherPlace);
  const estimatedMiles = Number(trip.distanceMiles || trip.miles) || estimateDistanceMiles(trip.pickup, trip.dropoff);

  const options = [];
  const MINIMUM_FARE_PENCE = 4500; // £45.00 Minimum Fare per official Short Distance Price List (Saloon 0-5 miles)

  for (const vehicle of VEHICLES) {
    if (vehicle.maxPassengers < trip.passengers) continue;

    let basePence;

    // 1. Distance-Based Fixed Pricing (30-90 miles) - Minimum Fare, High Fare, Maximum Fare per PDF
    if (estimatedMiles > 30 && estimatedMiles <= 90) {
      const tier = getDistanceFareTier(estimatedMiles);
      if (tier && PDF_DISTANCE_FIXED_PRICING[tier]) {
        const fare = PDF_DISTANCE_FIXED_PRICING[tier][vehicle.code] 
          ?? (vehicle.code === "mpv" ? PDF_DISTANCE_FIXED_PRICING[tier].mpv5 : undefined)
          ?? (vehicle.code === "mpv5" ? PDF_DISTANCE_FIXED_PRICING[tier].mpv : undefined)
          ?? (vehicle.code === "exec-mpv" ? PDF_DISTANCE_FIXED_PRICING[tier].exec_mpv : undefined)
          ?? (vehicle.code === "minivan8" ? PDF_DISTANCE_FIXED_PRICING[tier].mpv8 : undefined);
        if (fare !== undefined) {
          basePence = fare * 100;
        }
      }
    }

    // 2. Exact PDF Airport-to-City Fixed Matrix (for long distance airport routes > 90 miles)
    if (!basePence && airportKey && pdfCityKey && PDF_LONG_DISTANCE_MATRIX[airportKey]?.[pdfCityKey]) {
      const matrixGbp = PDF_LONG_DISTANCE_MATRIX[airportKey][pdfCityKey][vehicle.code] ??
        (vehicle.code === "mpv" ? PDF_LONG_DISTANCE_MATRIX[airportKey][pdfCityKey].mpv5 : undefined) ??
        (vehicle.code === "mpv5" ? PDF_LONG_DISTANCE_MATRIX[airportKey][pdfCityKey].mpv : undefined) ??
        (vehicle.code === "minivan8" || vehicle.code === "minivan" ? PDF_LONG_DISTANCE_MATRIX[airportKey][pdfCityKey].mpv8 : undefined) ??
        (vehicle.code === "exec-mpv" ? PDF_LONG_DISTANCE_MATRIX[airportKey][pdfCityKey].exec_mpv : undefined) ??
        (vehicle.code === "executive-saloon" ? PDF_LONG_DISTANCE_MATRIX[airportKey][pdfCityKey].executive : undefined);
      if (matrixGbp) {
        basePence = matrixGbp * 100;
      }
    }

    // 3. Fixed airport postcode zone fares (for London local airport transfers)
    if (!basePence && airportKey && AIRPORT_PRICING[airportKey] && isLondonPlace(otherPlace)) {
      const gbpPrice = AIRPORT_PRICING[airportKey][zone]?.[vehicle.code] 
        || AIRPORT_PRICING[airportKey][zone]?.[vehicle.code === "mpv" ? "mpv5" : vehicle.code]
        || AIRPORT_PRICING[airportKey]["inner"]?.[vehicle.code];
      if (gbpPrice) {
        basePence = gbpPrice * 100;
      }
    }

    // 4. Short-distance vehicle pricing logic (0-30 miles) from official SHORT DISTANCE PRICE LIST
    if (!basePence && estimatedMiles <= 30) {
      const shortTier = getShortDistanceTier(estimatedMiles);
      if (shortTier && SHORT_DISTANCE_FIXED_PRICING[shortTier]) {
        const fare = SHORT_DISTANCE_FIXED_PRICING[shortTier][vehicle.code]
          ?? (vehicle.code === "mpv" ? SHORT_DISTANCE_FIXED_PRICING[shortTier].mpv5 : undefined)
          ?? (vehicle.code === "mpv5" ? SHORT_DISTANCE_FIXED_PRICING[shortTier].mpv : undefined)
          ?? (vehicle.code === "exec-mpv" ? SHORT_DISTANCE_FIXED_PRICING[shortTier].exec_mpv : undefined)
          ?? (vehicle.code === "minivan8" ? SHORT_DISTANCE_FIXED_PRICING[shortTier].mpv8 : undefined);
        if (fare !== undefined) {
          basePence = fare * 100;
        }
      }
    }

    // 5. Long distance mileage calculation (> 90 miles) using PDF per-mile rates (Note 2)
    if (!basePence && estimatedMiles > 90) {
      basePence = Math.round(estimatedMiles * vehicle.perMilePence);
    }

    // 6. Fallback if not matched above
    if (!basePence) {
      const rate = vehicle.localPerMilePence || 250;
      basePence = vehicle.basePence + Math.round(estimatedMiles * rate);
    }

    // Enforce Minimum Fare Rule (£45.00 / 4500 pence minimum)
    if (basePence < MINIMUM_FARE_PENCE) {
      basePence = MINIMUM_FARE_PENCE;
    }

    const returnPence = returnLeg ? basePence : 0;
    const subtotal = basePence + returnPence;
    const discPct = trip.discountPercent || 0;
    const discountPence = Math.floor((subtotal * discPct) / 100);
    const totalPence = subtotal - discountPence;

    // One-Way and Return option calculations
    const oneWayBasePence = basePence;
    const oneWayDiscountPence = Math.floor((oneWayBasePence * discPct) / 100);
    const oneWayTotalPence = oneWayBasePence - oneWayDiscountPence;

    const returnBasePence = basePence * 2;
    const returnDiscPct = Math.max(discPct, 5); // 5% return discount
    const returnDiscountPence = Math.floor((returnBasePence * returnDiscPct) / 100);
    const returnTotalPence = returnBasePence - returnDiscountPence;
    const returnSavingsPence = returnBasePence - returnTotalPence;

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
        oneWayTotalPence,
        returnOriginalPence: returnBasePence,
        returnTotalPence,
        returnSavingsPence,
        returnDiscountPercent: returnDiscPct,
      },
    });
  }

  if (!options.length) throw new Error("No vehicle in the fleet fits this passenger count.");
  return options;
}

