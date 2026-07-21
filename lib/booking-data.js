export const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
export const weekdayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export const today = startOfDay(new Date());

export const times = ["8:00 AM", "8:30 AM", "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM", "2:00 PM"];
export const timezoneOptions = ["GMT / UTC", "Western European (WET)", "Central European (CET)", "Eastern European (EET)", "West Africa Time (WAT)", "Eastern Time (ET)", "Central Time (CT)", "Mountain Time (MT)", "Pacific Time (PT)"];

const detectedTimezoneMap = {
  UTC: "GMT / UTC",
  "Etc/UTC": "GMT / UTC",
  "Etc/GMT": "GMT / UTC",
  "Europe/London": "Western European (WET)",
  "Europe/Dublin": "Western European (WET)",
  "Europe/Lisbon": "Western European (WET)",
  "Europe/Madrid": "Central European (CET)",
  "Europe/Paris": "Central European (CET)",
  "Europe/Berlin": "Central European (CET)",
  "Europe/Rome": "Central European (CET)",
  "Europe/Amsterdam": "Central European (CET)",
  "Europe/Brussels": "Central European (CET)",
  "Europe/Zurich": "Central European (CET)",
  "Europe/Stockholm": "Central European (CET)",
  "Europe/Warsaw": "Central European (CET)",
  "Europe/Athens": "Eastern European (EET)",
  "Europe/Bucharest": "Eastern European (EET)",
  "Europe/Helsinki": "Eastern European (EET)",
  "Europe/Kyiv": "Eastern European (EET)",
  "Africa/Lagos": "West Africa Time (WAT)",
  "Africa/Abidjan": "GMT / UTC",
  "Africa/Accra": "GMT / UTC",
  "America/New_York": "Eastern Time (ET)",
  "America/Detroit": "Eastern Time (ET)",
  "America/Toronto": "Eastern Time (ET)",
  "America/Chicago": "Central Time (CT)",
  "America/Winnipeg": "Central Time (CT)",
  "America/Denver": "Mountain Time (MT)",
  "America/Phoenix": "Mountain Time (MT)",
  "America/Los_Angeles": "Pacific Time (PT)",
  "America/Vancouver": "Pacific Time (PT)"
};

export function detectTimezoneOption() {
  if (typeof Intl === "undefined") return "GMT / UTC";

  const detectedTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return detectedTimezoneMap[detectedTimezone] || "GMT / UTC";
}

export function dateToKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function dateFromKey(key) {
  const [year, month, day] = key.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function buildMonth(year, month) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  return [
    ...Array.from({ length: firstDay }, () => null),
    ...Array.from({ length: daysInMonth }, (_, index) => new Date(year, month, index + 1))
  ];
}

export function isAvailableDate(date, availableDays) {
  const days = availableDays || [1, 2, 3, 4, 5];
  return date >= today && days.includes(date.getDay());
}

export function isDarkDate(date) {
  return false;
}

export function formatSelectedDate(date) {
  return `${weekdayNames[date.getDay()]}, ${monthNames[date.getMonth()]} ${date.getDate()}`;
}

function seededValue(seed) {
  let value = 0;
  for (let index = 0; index < seed.length; index += 1) {
    value = (value * 31 + seed.charCodeAt(index)) % 2147483647;
  }
  return value;
}

function parseTime(timeStr) {
  const match = timeStr.match(/^(\d+):(\d+)\s*(AM|PM)$/i);
  if (!match) return 0;
  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const period = match[3].toUpperCase();
  if (period === "PM" && hours !== 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;
  return hours * 60 + minutes;
}

function formatTime(totalMinutes) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const period = hours >= 12 ? "PM" : "AM";
  const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
  return `${displayHours}:${String(minutes).padStart(2, "0")} ${period}`;
}

export function generateTimeSlots(timeRange) {
  const start = parseTime(timeRange?.start || "8:00 AM");
  const end = parseTime(timeRange?.end || "2:00 PM");
  const slots = [];
  for (let m = start; m < end; m += 30) {
    slots.push(formatTime(m));
  }
  return slots;
}

const allTimes = times;

export function availableTimesForDate(dateKey, availableDays, timeRange) {
  const slots = generateTimeSlots(timeRange);
  const seed = seededValue(dateKey);
  const slotCount = 5 + (seed % Math.min(4, Math.max(1, slots.length - 5)));
  const rotated = slots.map((time, index) => ({
    time,
    score: (seed + index * 7919) % 9973
  }));

  return rotated
    .sort((a, b) => a.score - b.score)
    .slice(0, Math.min(slotCount, slots.length))
    .map((slot) => slot.time)
    .sort((a, b) => slots.indexOf(a) - slots.indexOf(b));
}

export function getInitialBookingSelection(startDate = new Date(), profile = {}) {
  const start = startOfDay(startDate);
  const availableDays = profile.availableDays;
  const timeRange = profile.timeRange;

  for (let offset = 0; offset < 366; offset += 1) {
    const candidate = new Date(start.getFullYear(), start.getMonth(), start.getDate() + offset);
    if (!isAvailableDate(candidate, availableDays)) continue;

    const dateKey = dateToKey(candidate);
    const available = availableTimesForDate(dateKey, availableDays, timeRange);
    if (!available.length) continue;

    return {
      date: candidate,
      dateKey,
      time: ""
    };
  }

  const fallbackKey = dateToKey(start);
  return {
    date: start,
    dateKey: fallbackKey,
    time: ""
  };
}
