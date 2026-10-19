import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const configPath = path.join(here, "festival-config.json");

let cachedConfig = null;
let lastMtime = 0;

export function loadFestivalConfig() {
  try {
    const stats = fs.statSync(configPath);
    if (!cachedConfig || stats.mtimeMs > lastMtime) {
      const raw = fs.readFileSync(configPath, "utf-8");
      const parsed = JSON.parse(raw);
      cachedConfig = Array.isArray(parsed) ? parsed : parsed.festivals || [];
      lastMtime = stats.mtimeMs;
    }
  } catch (err) {
    if (!cachedConfig) {
      cachedConfig = [];
    }
  }
  return cachedConfig;
}

export function getLondonDateString(dateInput) {
  if (!dateInput) return "";
  if (typeof dateInput === "string") {
    const trimmed = dateInput.trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
      return trimmed;
    }
    // If format like "2026-12-25T14:00:00"
    if (trimmed.length >= 10 && /^\d{4}-\d{2}-\d{2}/.test(trimmed)) {
      const match = trimmed.match(/^(\d{4}-\d{2}-\d{2})/);
      if (match) return match[1];
    }
  }
  const d = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  if (!d || isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/London",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
}

export function getFestivalRate(dateInput) {
  const dateStr = getLondonDateString(dateInput);
  if (!dateStr) {
    return { isFestival: false, percentIncrease: 0, eventName: null, matchedEvents: [] };
  }

  const festivals = loadFestivalConfig();
  const matched = [];

  for (const festival of festivals) {
    if (!festival.enabled) continue;
    if (dateStr >= festival.startDate && dateStr <= festival.endDate) {
      matched.push(festival);
    }
  }

  if (matched.length === 0) {
    return { isFestival: false, percentIncrease: 0, eventName: null, matchedEvents: [] };
  }

  // Non-stacking rule: take the maximum percentage increase (defaults to 65%)
  let maxPercent = 0;
  let primaryName = matched[0].name;

  for (const m of matched) {
    const pct = typeof m.percentIncrease === "number" ? m.percentIncrease : 65;
    if (pct > maxPercent) {
      maxPercent = pct;
      primaryName = m.name;
    }
  }

  return {
    isFestival: true,
    percentIncrease: maxPercent || 65,
    eventName: primaryName,
    matchedEvents: matched.map((m) => m.name),
  };
}
