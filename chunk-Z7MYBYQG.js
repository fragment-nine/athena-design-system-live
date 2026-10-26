// src/language/text.ts
var APOSTROPHES = /[‘’‚‛′ʼ`´]/g;
var QUOTES = /[“”„‟″]/g;
function fold(s) {
  return (s ?? "").toLowerCase().replace(APOSTROPHES, "'").replace(QUOTES, '"');
}
function textHas(hay, needle) {
  return fold(hay).includes(fold(needle));
}
function textIs(a, b) {
  return fold(a) === fold(b);
}
function initials(name) {
  return name.trim().split(/\s+/).slice(0, 2).map((w) => w[0] ?? "").join("").toUpperCase();
}

// src/language/calendar.ts
var SECOND_MS = 1e3;
var MINUTE_MS = 60 * SECOND_MS;
var HOUR_MS = 60 * MINUTE_MS;
var DAY_MS = 24 * HOUR_MS;
function dayOf(d) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}
function localToday(now = /* @__PURE__ */ new Date()) {
  return dayOf(now);
}
function addDays(d, n) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
}
function addMonths(d, n) {
  return new Date(d.getFullYear(), d.getMonth() + n, d.getDate());
}
function addMonthsClamped(d, n) {
  const first = new Date(d.getFullYear(), d.getMonth() + n, 1);
  const last = new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate();
  return new Date(first.getFullYear(), first.getMonth(), Math.min(d.getDate(), last));
}
function endOfMonth(d) {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0);
}
function daysBetween(a, b) {
  return Math.round((dayOf(b).getTime() - dayOf(a).getTime()) / DAY_MS);
}
function sameDay(a, b) {
  return !!a && !!b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}
function weekColumn(d, weekStart = 1) {
  return (d.getDay() - weekStart + 7) % 7;
}
function weekStartOf(d, weekStart = 1) {
  return addDays(dayOf(d), -weekColumn(d, weekStart));
}
function inWeekOrder(sunToSat, weekStart = 1) {
  return Array.from({ length: 7 }, (_, i) => sunToSat[(i + weekStart) % 7]);
}
var isWeekday = (d) => d.getDay() !== 0 && d.getDay() !== 6;
function nextWeekday(from, dow, opts = {}) {
  let delta = (dow - from.getDay() + 7) % 7;
  if (opts.forceNext) delta += 7;
  return addDays(dayOf(from), delta);
}
function nextWorkingDay(from, isWorking = isWeekday) {
  let d = dayOf(from);
  for (let i = 0; i < 14 && !isWorking(d); i++) d = addDays(d, 1);
  return d;
}
function countWorkingDays(a, b, isWorking = isWeekday) {
  let n = 0;
  for (let d = dayOf(a); d.getTime() <= dayOf(b).getTime(); d = addDays(d, 1)) if (isWorking(d)) n++;
  return n;
}
var WEEKDAY_INDEX = {
  sunday: 0,
  sun: 0,
  monday: 1,
  mon: 1,
  tuesday: 2,
  tue: 2,
  tues: 2,
  wednesday: 3,
  wed: 3,
  weds: 3,
  thursday: 4,
  thu: 4,
  thur: 4,
  thurs: 4,
  friday: 5,
  fri: 5,
  saturday: 6,
  sat: 6
};
var MONTH_INDEX = (() => {
  const full = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
  const map = {};
  full.forEach((name, i) => {
    map[name] = i;
    map[name.slice(0, 3)] = i;
  });
  map.sept = 8;
  return map;
})();
function inferYear(today, month, day, year) {
  if (year != null) return new Date(year, month, day);
  let y = today.getFullYear();
  const diff = (new Date(y, month, day).getTime() - dayOf(today).getTime()) / DAY_MS;
  if (diff < -92) y += 1;
  else if (diff > 273) y -= 1;
  return new Date(y, month, day);
}
function inferYearAhead(today, month, day, year) {
  if (year != null) return new Date(year, month, day);
  let y = today.getFullYear();
  if ((new Date(y, month, day).getTime() - dayOf(today).getTime()) / DAY_MS < -92) y += 1;
  return new Date(y, month, day);
}
function formatISO(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function parseISO(s) {
  const m = s?.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!m) return null;
  const y = +m[1], mo = +m[2] - 1, d = +m[3];
  const out = new Date(y, mo, d);
  return out.getFullYear() === y && out.getMonth() === mo && out.getDate() === d ? out : null;
}
function parseLooseDate(s, today) {
  if (!s) return null;
  const t = s.trim();
  const lower = t.toLowerCase();
  if (lower === "today") return dayOf(today);
  if (lower === "tomorrow") return addDays(dayOf(today), 1);
  if (/^\d{4}-\d{2}-\d{2}/.test(t)) return parseISO(t);
  const m = t.match(/^([A-Za-z]{3,9})\.?\s*(\d{1,4})?(?:\s*,?\s*(\d{4}))?$/);
  if (!m) return null;
  const mo = MONTH_INDEX[m[1].toLowerCase()];
  if (mo == null) return null;
  const bareYear = !!m[2] && m[2].length === 4 && !m[3];
  const day = bareYear ? 1 : parseInt(m[2] || "1", 10);
  if (day < 1 || day > 31) return null;
  const year = m[3] ? +m[3] : bareYear ? +m[2] : void 0;
  const d = inferYear(today, mo, day, year);
  return d.getMonth() === mo ? d : null;
}
function windowRange(w, today, weekStart = 1) {
  const back = w.startsWith("last") ? 1 : 0;
  const base = back ? w.slice(4) : w;
  const a = dayOf(today);
  if (base === "week") {
    const start = addDays(weekStartOf(a, weekStart), -7 * back);
    return { start, end: addDays(start, 6) };
  }
  if (base === "month") {
    const m = a.getMonth() - back;
    return { start: new Date(a.getFullYear(), m, 1), end: new Date(a.getFullYear(), m + 1, 0) };
  }
  if (base === "year") return { start: new Date(a.getFullYear(), 0, 1), end: new Date(a.getFullYear(), 11, 31) };
  const q = Math.floor(a.getMonth() / 3) - back;
  return { start: new Date(a.getFullYear(), q * 3, 1), end: new Date(a.getFullYear(), q * 3 + 3, 0) };
}
function inWindow(d, w, today, weekStart = 1) {
  if (!d) return false;
  const { start, end } = windowRange(w, today, weekStart);
  const t = dayOf(d).getTime();
  return t >= start.getTime() && t <= end.getTime();
}
function spanTouchesWindow(from, to, w, today, weekStart = 1) {
  const { start, end } = windowRange(w, today, weekStart);
  const t = to ?? from;
  return dayOf(from).getTime() <= end.getTime() && dayOf(t).getTime() >= start.getTime();
}
function spanCoversDay(from, to, day, padBefore = 0, padAfter = 0) {
  const t = dayOf(day).getTime();
  return t >= addDays(dayOf(from), -padBefore).getTime() && t <= addDays(dayOf(to), padAfter).getTime();
}
function msUntilMidnight(now = /* @__PURE__ */ new Date()) {
  return new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).getTime() - now.getTime();
}
function watchForNewDay(onNewDay) {
  let current = localToday();
  let timer;
  const check = () => {
    const t = localToday();
    if (t.getTime() !== current.getTime()) {
      current = t;
      onNewDay(t);
    }
  };
  const arm = () => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      check();
      arm();
    }, Math.min(msUntilMidnight() + 250, HOUR_MS));
  };
  const wake = () => {
    if (typeof document === "undefined" || document.visibilityState !== "hidden") {
      check();
      arm();
    }
  };
  arm();
  if (typeof window !== "undefined") window.addEventListener("focus", wake);
  if (typeof document !== "undefined") document.addEventListener("visibilitychange", wake);
  return () => {
    if (timer) clearTimeout(timer);
    if (typeof window !== "undefined") window.removeEventListener("focus", wake);
    if (typeof document !== "undefined") document.removeEventListener("visibilitychange", wake);
  };
}
function isValidZone(zone) {
  if (!zone) return false;
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: zone });
    return true;
  } catch {
    return false;
  }
}
function zoneAbbr(zone, at = /* @__PURE__ */ new Date()) {
  if (!isValidZone(zone)) return "";
  return new Intl.DateTimeFormat("en-US", { timeZoneName: "short", timeZone: zone }).formatToParts(at).find((p) => p.type === "timeZoneName")?.value ?? "";
}

// src/language/numbers.ts
function stripZeros(s) {
  return s.replace(/\.0+$/, "").replace(/(\.\d*?)0+$/, "$1");
}
function compactNum(n) {
  if (n == null || !Number.isFinite(n)) return "0";
  const a = Math.abs(n);
  const step = (v, unit) => stripZeros(v < 100 ? v.toFixed(1) : String(Math.round(v))) + unit;
  const out = a < 1e3 ? String(Math.round(a)) : a < 1e6 ? step(a / 1e3, "k") : a < 1e9 ? step(a / 1e6, "M") : step(a / 1e9, "B");
  return (n < 0 ? "-" : "") + out;
}
function preciseNum(n, opts = {}) {
  if (n == null || !Number.isFinite(n)) return "0";
  const { decimals, maxDecimals = 2 } = opts;
  return decimals != null ? n.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) : n.toLocaleString("en-US", { maximumFractionDigits: maxDecimals });
}
function fmtHours(n, opts = {}) {
  const v = n == null || !Number.isFinite(n) ? 0 : n;
  return (opts.precise || Math.abs(v) < 1e3 ? preciseNum(v) : compactNum(v)) + "h";
}
function fmtHoursHalf(n) {
  const v = n == null || !Number.isFinite(n) ? 0 : n;
  return preciseNum(Math.round(v * 2) / 2) + "h";
}
function fmtHoursMinutes(h) {
  const total = Math.max(0, Math.round(h * 60));
  const hh = Math.floor(total / 60);
  const mm = total % 60;
  return mm ? `${hh}h${String(mm).padStart(2, "0")}m` : `${hh}h`;
}
function fmtPct(n, opts = {}) {
  const v = n == null || !Number.isFinite(n) ? 0 : n;
  return opts.precise || opts.decimals != null ? preciseNum(v, { decimals: opts.decimals ?? 1 }) + "%" : Math.round(v) + "%";
}
function fmtRatio(ratio, opts = {}) {
  return fmtPct(ratio == null ? ratio : ratio * 100, opts);
}
function fmtBytes(n) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${Math.max(1, Math.round(n / 1024))} KB`;
  return `${(n / 1024 / 1024).toFixed(1)} MB`;
}
function roundTo(n, decimals = 2) {
  const f = 10 ** decimals;
  return Math.round(n * f) / f;
}
function plural(n, one, many = `${one}s`) {
  return Math.abs(n) === 1 ? one : many;
}
function countLabel(n, one, many = `${one}s`) {
  return `${n} ${plural(n, one, many)}`;
}
function dayLoad(day, words2 = {}) {
  const w = { free: "Free", full: "Full", off: "Off", over: "over", left: "free", ...words2 };
  if (day.off) return w.off;
  const booked = Math.round((Number.isFinite(day.booked) ? day.booked : 0) * 2) / 2;
  const cap = Math.round((Number.isFinite(day.capacity) ? day.capacity : 0) * 2) / 2;
  if (booked <= 0) return w.free;
  if (booked === cap) return w.full;
  if (booked > cap) return `${fmtHoursHalf(booked - cap)} ${w.over}`;
  return `${fmtHoursHalf(cap - booked)} ${w.left}`;
}

// src/language/words.ts
var MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
var COUNT_WORDS = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
  ten: 10,
  eleven: 11,
  twelve: 12
};
var COUNT_ALT = Object.keys(COUNT_WORDS).sort((a, b) => b.length - a.length).join("|");
var COUNT_SRC = "\\d{1,3}|" + COUNT_ALT;
function countFromWord(word) {
  if (!word) return void 0;
  const w = word.trim().toLowerCase().replace(/(?:st|nd|rd|th)$/, "");
  if (/^\d{1,4}$/.test(w)) return parseInt(w, 10);
  return COUNT_WORDS[w];
}
var ENGLISH = {
  months: MONTHS,
  monthsShort: MONTHS.map((m) => m.slice(0, 3)),
  weekdays: WEEKDAYS,
  weekdaysShort: WEEKDAYS.map((d) => d.slice(0, 3)),
  weekdayLetters: WEEKDAYS.map((d) => d.slice(0, 1)),
  today: "Today",
  tomorrow: "Tomorrow",
  yesterday: "Yesterday",
  noDate: "No date",
  justNow: "just now",
  now: "now",
  ago: " ago",
  edited: "Edited ",
  inDays: (n) => `in ${n} days`,
  noPriority: "No priority",
  from: "from",
  me: "Me",
  every: "every",
  everyStrict: "every!",
  repeatUnit: (every, n, unit) => n > 1 ? `${every} ${n} ${unit}s` : `${every} ${unit}`,
  repeatWorkdays: (every) => `${every} weekday`,
  repeatDays: (every, n, days) => n > 1 ? `${every} ${n} weeks on ${days}` : `${every} ${days}`,
  repeatNth: (every, n, nth, day) => n > 1 ? `${every} ${n} months on the ${nth} ${day}` : `${every} ${nth} ${day}`,
  repeatTimes: (count, unit) => `${count} times a ${unit}`,
  repeatFor: (rule, count) => `${rule} for ${count} times`,
  repeatUntil: (rule, date) => `${rule} until ${date}`,
  ordinal: (n) => n < 0 ? "last" : `${n}${n % 100 >= 11 && n % 100 <= 13 ? "th" : ["th", "st", "nd", "rd"][n % 10] ?? "th"}`,
  query: {
    today: ["today", "due today"],
    tomorrow: ["tomorrow", "due tomorrow"],
    overdue: ["overdue", "due overdue"],
    noDate: ["no date", "no due date"],
    recurring: ["recurring"],
    unassigned: ["unassigned", "no assignee", "not assigned"],
    noPriority: ["no priority"],
    noSection: ["no section"],
    done: ["done", "completed"],
    doneWithin: ["done [in] [the] last {n} day[s]", "completed [in] [the] last {n} day[s]"],
    nextDays: ["next {n} day[s]", "{n} day[s]"],
    thisWeek: ["this week"],
    thisMonth: ["this month"],
    thisQuarter: ["this quarter"],
    thisYear: ["this year"],
    lastWeek: ["last week", "previous week", "prior week"],
    lastMonth: ["last month", "previous month", "prior month"],
    lastQuarter: ["last quarter", "previous quarter", "prior quarter"],
    assignedTo: ["assigned to[:]"],
    createdBy: ["created by[:]"],
    search: ["search:"],
    me: ["me"],
    others: ["others", "anyone", "someone", "else"],
    and: ["and"],
    or: ["or"],
    filler: ["to", "by", "in", "the"],
    all: "All"
  },
  time: {
    noon: ["noon", "midday"],
    midnight: ["midnight"],
    halfPast: ["half past", "half"],
    anHour: ["an hour", "a hour", "one hour"],
    halfAnHour: ["half an hour", "half hour"],
    hourAndAHalf: ["an hour and a half", "a hour and a half", "one hour and a half"],
    hourUnits: ["h", "hr", "hrs", "hour", "hours"],
    minuteUnits: ["m", "min", "mins", "minute", "minutes"]
  }
};
function words(over) {
  if (!over) return ENGLISH;
  return { ...ENGLISH, ...over, query: { ...ENGLISH.query, ...over.query }, time: { ...ENGLISH.time, ...over.time } };
}

// src/language/dateWords.ts
function monthDay(d, today, w = ENGLISH) {
  const base = `${w.monthsShort[d.getMonth()]} ${d.getDate()}`;
  const plain = d.getFullYear() === today.getFullYear() && sameDay(parseLooseDate(`${ENGLISH.monthsShort[d.getMonth()]} ${d.getDate()}`, today), d);
  return plain ? base : `${base} ${d.getFullYear()}`;
}
function exactDate(d, w = ENGLISH) {
  return `${w.monthsShort[d.getMonth()]} ${d.getDate()} ${d.getFullYear()}`;
}
function monoDate(d, w = ENGLISH) {
  return `${w.weekdaysShort[d.getDay()]} ${w.monthsShort[d.getMonth()]} ${d.getDate()}`.toLowerCase();
}
function weekdayDate(d, w = ENGLISH) {
  return `${w.weekdaysShort[d.getDay()]}, ${w.monthsShort[d.getMonth()]} ${d.getDate()}`;
}
function dueLabel(due, today, opts = {}) {
  const w = opts.words ?? ENGLISH;
  if (!due) return { label: "", tone: "none", title: "", late: false };
  const d = daysBetween(today, due);
  const title = exactDate(due, w);
  if (d === 0) return { label: w.today, tone: "today", title, late: false };
  if (d === 1) return { label: w.tomorrow, tone: "tomorrow", title, late: false };
  if (d === -1) return { label: w.yesterday, tone: "late", title, late: true };
  if (d >= 2 && d <= 6) return { label: (opts.long ? w.weekdays : w.weekdaysShort)[due.getDay()], tone: "soon", title, late: false };
  return { label: monthDay(due, today, w), tone: d < 0 ? "late" : "later", title, late: d < 0 };
}
function isLate(due, today, opts = {}) {
  if (opts.done || !due) return false;
  return dueLabel(opts.until ?? due, today).late;
}
function dayHeading(day, today, w = ENGLISH) {
  const d = daysBetween(today, day);
  const name = d === 0 ? w.today : d === 1 ? w.tomorrow : d === -1 ? w.yesterday : w.weekdays[day.getDay()];
  return { name: name.toUpperCase(), date: monoDate(day, w) };
}
function relative(d, today, w = ENGLISH) {
  if (!d) return { label: "", title: "", late: false };
  const n = daysBetween(today, d);
  const title = exactDate(d, w);
  if (n === 0) return { label: w.today.toLowerCase(), title, late: false };
  if (n === 1) return { label: w.tomorrow.toLowerCase(), title, late: false };
  if (n === -1) return { label: w.yesterday.toLowerCase(), title, late: true };
  if (n > 1 && n <= 30) return { label: w.inDays(n), title, late: false };
  return { label: monthDay(d, today, w), title, late: n < 0 };
}
var isToday = (d, today) => sameDay(d, today);
var UNIT_MS = { minute: MINUTE_MS, hour: HOUR_MS, day: DAY_MS, week: 7 * DAY_MS, month: 30 * DAY_MS, year: 365 * DAY_MS };
var UNIT_SHORT = { minute: "m", hour: "h", day: "d", week: "w", month: "mo", year: "y" };
function timeAgo(ts, now, s) {
  const diff = Math.max(0, now - ts);
  const pre = s.prefix ?? "";
  if (diff < s.nowBelowMs) return pre + s.now;
  const R = s.round === "round" ? Math.round : Math.floor;
  for (const { unit, below } of s.steps) {
    const n = R(diff / UNIT_MS[unit]);
    if (n >= below) continue;
    if (unit === "day" && n === 1 && s.yesterday) return pre + s.yesterday;
    return pre + (s.short ? `${n}${UNIT_SHORT[unit]}` : countLabel(n, unit)) + s.suffix;
  }
  if (s.beyond) return pre + s.beyond(ts);
  const d = new Date(ts);
  return `${ENGLISH.monthsShort[d.getMonth()]} ${d.getDate()} ${d.getFullYear()}`;
}
var AGO = {
  /** "3 hours ago", "yesterday", "2 weeks ago". */
  long: { round: "floor", nowBelowMs: MINUTE_MS, now: ENGLISH.justNow, short: false, suffix: ENGLISH.ago, yesterday: ENGLISH.yesterday.toLowerCase(), steps: [{ unit: "minute", below: 60 }, { unit: "hour", below: 24 }, { unit: "day", below: 7 }, { unit: "week", below: 5 }, { unit: "month", below: Infinity }] },
  /** "Edited 3 hours ago". */
  edited: { round: "floor", nowBelowMs: MINUTE_MS, now: ENGLISH.justNow, short: false, suffix: ENGLISH.ago, prefix: ENGLISH.edited, steps: [{ unit: "minute", below: 60 }, { unit: "hour", below: 24 }, { unit: "day", below: 30 }, { unit: "month", below: 12 }, { unit: "year", below: Infinity }] },
  /** "14m ago", "3h ago", "yesterday"; older is the caller's date. */
  activity: { round: "floor", nowBelowMs: MINUTE_MS, now: ENGLISH.justNow, short: true, suffix: ENGLISH.ago, yesterday: ENGLISH.yesterday.toLowerCase(), steps: [{ unit: "minute", below: 60 }, { unit: "hour", below: 24 }, { unit: "day", below: 7 }] },
  /** A notification's "now", "40m", "3h", "2d". */
  feed: { round: "round", nowBelowMs: MINUTE_MS, now: ENGLISH.now, short: true, suffix: "", steps: [{ unit: "minute", below: 60 }, { unit: "hour", below: 24 }, { unit: "day", below: Infinity }] }
};

// src/language/clock.ts
function clockTime(at, zone) {
  return new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit", ...zone ? { timeZone: zone } : {} }).format(at);
}
function clockHM(h, m = 0) {
  return `${(h + 11) % 12 + 1}:${String(m).padStart(2, "0")} ${h < 12 ? "AM" : "PM"}`;
}
function clockCompact(text) {
  return text.replace(/\s*([AP])M$/i, (_m, c) => `${c.toLowerCase()}m`);
}
function minToClock(min) {
  const h = Math.floor(min / 60);
  const m = Math.round(min % 60);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}
function hoursToClock(hours) {
  return minToClock(Math.round(hours * 60));
}
function zonedWeekdayHour(at, zone) {
  const parts = new Intl.DateTimeFormat("en-US", { timeZone: zone, weekday: "short", hour: "numeric", hour12: false }).formatToParts(at);
  const wd = parts.find((p) => p.type === "weekday")?.value ?? "";
  let hour = parseInt(parts.find((p) => p.type === "hour")?.value ?? "NaN", 10);
  if (!Number.isFinite(hour)) return null;
  if (hour === 24) hour = 0;
  const dow = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(wd);
  return dow < 0 ? null : { dow, hour };
}
function zoneHint(zone, at = /* @__PURE__ */ new Date(), abbr) {
  if (!isValidZone(zone)) return "";
  const a = abbr || zoneAbbr(zone, at);
  const t = clockTime(at, zone);
  return a ? `${t} \xB7 ${a}` : t;
}
function roundQuarter(hours) {
  return Math.round(hours * 4) / 4;
}

// src/language/priority.ts
var PRIORITY_LEVELS = [1, 2, 3, 4];
function priorityLabel(p, w = ENGLISH) {
  return p && p >= 1 && p <= 4 ? `P${p}` : w.noPriority;
}
function priorityFromLabel(label, w = ENGLISH) {
  if (label === w.noPriority) return 0;
  const n = Number(label.replace(/^p/i, ""));
  return n >= 1 && n <= 4 ? n : 0;
}

// src/language/recurrence.ts
var WORKDAYS = [1, 2, 3, 4, 5];
var WEEKDAY_ALT = Object.keys(WEEKDAY_INDEX).sort((a, b) => b.length - a.length).join("|");
var NTH_WORDS = {
  "1st": 1,
  "2nd": 2,
  "3rd": 3,
  "4th": 4,
  "5th": 5,
  first: 1,
  second: 2,
  third: 3,
  fourth: 4,
  fifth: 5,
  last: -1
};
var NTH_ALT = Object.keys(NTH_WORDS).join("|");
function nthFromWord(word) {
  return NTH_WORDS[word.toLowerCase()];
}
var uniqSort = (xs) => [...new Set(xs)].sort((a, b) => a - b);
var sameSet = (a, b) => {
  const x = uniqSort(a), y = uniqSort(b);
  return x.length === y.length && x.every((v, i) => v === y[i]);
};
var unitFreq = (u) => u[0] === "d" ? "daily" : u[0] === "w" ? "weekly" : u[0] === "m" ? "monthly" : "yearly";
var freqUnit = (f) => f === "daily" ? "day" : f === "weekly" ? "week" : f === "monthly" ? "month" : "year";
function parseRecurrence(raw, today) {
  if (!raw || !raw.trim()) return null;
  let orig = " " + raw.trim() + " ";
  let low = orig.toLowerCase();
  const strict = /every!/.test(low);
  orig = orig.replace(/every!/gi, "every ");
  low = low.replace(/every!/g, "every ");
  let end = { kind: "never" };
  const until = orig.match(/\b(?:until|til|till|ending\s+on|end\s+on|thru|through)\s+(.+?)\s*$/i);
  if (until) {
    const d = parseLooseDate(until[1].trim(), today);
    if (d) {
      end = { kind: "until", date: formatISO(d) };
      low = low.slice(0, until.index + 1);
      orig = orig.slice(0, until.index + 1);
    }
  }
  if (end.kind === "never") {
    const after = low.match(new RegExp("\\b(?:for|after|ending\\s+after)\\s+(\\d{1,4}|" + COUNT_ALT + ")\\s*(?:times?|occurrences?|x|instances?|reps?)?\\b(?!\\s+(?:a|an|per|each)\\b)")) || low.match(new RegExp("\\b(\\d{1,4}|" + COUNT_ALT + ")\\s*(?:times|x)\\b(?!\\s+(?:a|an|per|each)\\b)"));
    if (after) {
      const n = countFromWord(after[1]) ?? 0;
      if (n > 0) {
        end = { kind: "after", count: n };
        const cut = (s) => s.slice(0, after.index + 1) + s.slice(after.index + 1 + after[0].length);
        low = cut(low);
        orig = cut(orig);
      }
    }
  }
  let interval = 1;
  let ivFreq = null;
  let count = 1;
  if (/\bevery\s+other\b/.test(low)) interval = 2;
  if (/\b(bi-?weekly|fortnightly|fortnight)\b/.test(low)) {
    interval = 2;
    ivFreq = "weekly";
  } else if (/\bbi-?monthly\b/.test(low)) {
    interval = 2;
    ivFreq = "monthly";
  }
  const timesM = low.match(new RegExp("\\b(once|twice|" + COUNT_SRC + ")\\s*(?:x|times)?\\s+(?:a|an|per|each)\\s+(day|week|month|year)s?\\b")) || low.match(new RegExp("\\b(once|twice|(?:" + COUNT_SRC + ")\\s*(?:x|times))\\s+(daily|weekly|monthly|yearly)\\b"));
  if (timesM) {
    const tok = timesM[1];
    count = /once/.test(tok) ? 1 : /twice/.test(tok) ? 2 : Math.max(1, countFromWord(tok.replace(/\s*(?:x|times)$/, "")) ?? 1);
    ivFreq = unitFreq(timesM[2]);
    interval = 1;
  }
  const iv = low.match(new RegExp("\\b(?:every\\s+)?(\\d{1,3}(?:st|nd|rd|th)?|" + COUNT_ALT + ")\\s+(day|days|week|weeks|month|months|year|years)\\b"));
  if (iv && !timesM) {
    interval = Math.max(1, countFromWord(iv[1]) ?? 1);
    ivFreq = unitFreq(iv[2]);
  }
  const base = (freq, weekdays, nth) => ({
    freq,
    interval,
    ...count > 1 ? { count } : {},
    ...weekdays && weekdays.length ? { weekdays: uniqSort(weekdays) } : {},
    ...nth != null ? { nth } : {},
    end,
    ...strict ? { strict: true } : {}
  });
  const nthM = low.match(new RegExp("\\b(" + NTH_ALT + ")\\s+(" + WEEKDAY_ALT + ")\\b"));
  if (nthM) return base("monthly", [WEEKDAY_INDEX[nthM[2]]], NTH_WORDS[nthM[1]]);
  const wdRe = new RegExp("\\b(" + WEEKDAY_ALT + ")\\b", "g");
  const wds = [];
  let m;
  while (m = wdRe.exec(low)) wds.push(WEEKDAY_INDEX[m[1]]);
  if (wds.length) return base("weekly", wds);
  if (/\b(weekday|workday|business\s+day|work\s+day)s?\b/.test(low)) return base("weekly", WORKDAYS);
  if (ivFreq) return base(ivFreq);
  const explicit = /\b(every|each)\b/.test(low) || low.trim().split(/\s+/).length === 1;
  if (explicit) {
    if (/\b(daily|days?)\b/.test(low)) return base("daily");
    if (/\b(weekly|weeks?)\b/.test(low)) return base("weekly");
    if (/\b(monthly|months?)\b/.test(low)) return base("monthly");
    if (/\b(yearly|annually|annual|years?)\b/.test(low)) return base("yearly");
  }
  return null;
}
function ruleDateWords(d, today, w = ENGLISH) {
  if (today) {
    const short = monthDay(d, today, w);
    if (sameDay(parseLooseDate(short, today), d)) return short;
  }
  return exactDate(d, w);
}
function serializeRecurrence(r, opts = {}) {
  const w = opts.words ?? ENGLISH;
  const every = r.strict ? w.everyStrict : w.every;
  let out;
  if (r.freq === "monthly" && r.nth != null && r.weekdays && r.weekdays.length) {
    out = w.repeatNth(every, r.interval, w.ordinal(r.nth), w.weekdaysShort[r.weekdays[0]]);
  } else if (r.freq === "weekly" && r.weekdays && r.weekdays.length) {
    out = sameSet(r.weekdays, WORKDAYS) && r.interval === 1 ? w.repeatWorkdays(every) : w.repeatDays(every, r.interval, uniqSort(r.weekdays).map((d) => w.weekdaysShort[d]).join(", "));
  } else if (r.count && r.count > 1) {
    out = w.repeatTimes(r.count, freqUnit(r.freq));
  } else {
    out = w.repeatUnit(every, r.interval, freqUnit(r.freq));
  }
  if (r.end.kind === "after") out = w.repeatFor(out, r.end.count);
  else if (r.end.kind === "until") {
    const d = parseISO(r.end.date);
    if (d) out = w.repeatUntil(out, ruleDateWords(d, opts.today, w));
  }
  return out;
}
function describeRecurrence(r, opts = {}) {
  const s = serializeRecurrence(r, opts);
  return s.charAt(0).toUpperCase() + s.slice(1);
}
function describeRecurrenceText(raw, today, w = ENGLISH) {
  if (!raw) return "";
  const r = parseRecurrence(raw, today);
  return r ? describeRecurrence(r, { today, words: w }) : raw.charAt(0).toUpperCase() + raw.slice(1);
}
function nthWeekdayOfMonth(year, month, dow, nth) {
  const first = new Date(year, month, 1);
  if (nth < 0) {
    const last = new Date(first.getFullYear(), first.getMonth() + 1, 0);
    return addDays(last, -((last.getDay() - dow + 7) % 7));
  }
  const d = addDays(first, (dow - first.getDay() + 7) % 7 + (nth - 1) * 7);
  return d.getMonth() === first.getMonth() ? d : null;
}
function matchesRule(r, date) {
  if (!r.weekdays || !r.weekdays.length) return true;
  if (r.freq === "weekly") return r.weekdays.includes(date.getDay());
  if (r.freq === "monthly" && r.nth != null) return sameDay(nthWeekdayOfMonth(date.getFullYear(), date.getMonth(), r.weekdays[0], r.nth), date);
  return true;
}
function stepOccurrence(r, date) {
  const d = dayOf(date);
  const n = Math.max(1, r.interval);
  if (r.freq === "weekly" && r.weekdays && r.weekdays.length) {
    const wds = uniqSort(r.weekdays);
    const cur = d.getDay();
    const later = wds.find((x) => x > cur);
    if (later != null) return addDays(d, later - cur);
    return addDays(d, 7 * n - cur + wds[0]);
  }
  if (r.freq === "monthly" && r.nth != null && r.weekdays && r.weekdays.length) {
    for (let k = 0; k <= 120; k += n) {
      const c = nthWeekdayOfMonth(d.getFullYear(), d.getMonth() + k, r.weekdays[0], r.nth);
      if (c && c.getTime() > d.getTime()) return c;
    }
    return addMonthsClamped(d, n);
  }
  const cnt = Math.max(1, r.count ?? 1);
  if (cnt > 1) {
    const period = r.freq === "daily" ? n : r.freq === "weekly" ? 7 * n : r.freq === "monthly" ? 30 * n : 365 * n;
    return addDays(d, Math.max(1, Math.floor(period / cnt)));
  }
  if (r.freq === "daily") return addDays(d, n);
  if (r.freq === "monthly") return addMonthsClamped(d, n);
  if (r.freq === "yearly") return addMonthsClamped(d, 12 * n);
  return addDays(d, 7 * n);
}
function firstOccurrence(r, from, opts = {}) {
  const d = dayOf(from);
  const bareWeekly = r.freq === "weekly" && !r.weekdays?.length && !(r.count && r.count > 1);
  if (opts.weekStart != null && bareWeekly) return addDays(d, (opts.weekStart - d.getDay() + 7) % 7);
  return matchesRule(r, d) ? d : stepOccurrence(r, d);
}
function expandOccurrences(r, start, rangeStart, rangeEnd, cap = 366) {
  const out = [];
  const until = r.end.kind === "until" ? parseISO(r.end.date) : null;
  const max = r.end.kind === "after" ? r.end.count : Infinity;
  let d = firstOccurrence(r, start);
  const rs = dayOf(rangeStart).getTime();
  const re = dayOf(rangeEnd).getTime();
  for (let i = 0; i < cap && i < max; i++) {
    const t = d.getTime();
    if (until && t > until.getTime()) break;
    if (t >= re) break;
    if (t >= rs) out.push(d);
    const next = stepOccurrence(r, d);
    if (next.getTime() <= t) break;
    d = next;
  }
  return out;
}
function nextInSeries(r, due) {
  if (r.end.kind === "after" && r.end.count <= 1) return null;
  const next = stepOccurrence(r, firstOccurrence(r, due));
  if (r.end.kind === "until") {
    const until = parseISO(r.end.date);
    if (until && next.getTime() > until.getTime()) return null;
  }
  const rule = r.end.kind === "after" ? { ...r, end: { kind: "after", count: r.end.count - 1 } } : r;
  return { due: next, rule };
}
function nextRepeat(raw, due, today, w = ENGLISH) {
  if (!raw) return null;
  const from = dayOf(due ?? today);
  const r = parseRecurrence(raw, today);
  if (!r) return { due: addDays(from, 7), text: raw };
  const next = nextInSeries(r, from);
  return next ? { due: next.due, text: serializeRecurrence(next.rule, { today, words: w }) } : null;
}

// src/language/taskSyntax.ts
var QUICK_ADD_HINTS = {
  date: ["today", "tomorrow", "tonight", "next monday", "next friday", "next week", "in 3 days", "in 2 weeks", "end of month"],
  recurrence: ["every day", "every other day", "every weekday", "every week", "once a week", "twice a week", "every other week", "every 2 weeks", "every month", "every monday"]
};
var TIME_SRC = "(\\d{1,2}(?::\\d{2})?\\s*(?:am|pm)|\\d{1,2}:\\d{2})";
function parseTime(s) {
  const ap = s.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)/i);
  if (ap) {
    const h = parseInt(ap[1], 10) % 12 + (/pm/i.test(ap[3]) ? 12 : 0);
    const m = ap[2] ? parseInt(ap[2], 10) : 0;
    return m < 60 ? { hour: h, minute: m } : null;
  }
  const t = s.match(/(\d{1,2}):(\d{2})/);
  if (t) {
    const h = parseInt(t[1], 10), m = parseInt(t[2], 10);
    if (h < 24 && m < 60) return { hour: h, minute: m };
  }
  return null;
}
var TRAIL_TIME = new RegExp("^\\s+(?:at\\s+|@\\s*)?" + TIME_SRC + "\\b", "i");
var LEAD_TIME = new RegExp("(?:\\bat\\s+)?" + TIME_SRC + "\\s+$", "i");
var STANDALONE_TIME = new RegExp("\\b(?:at\\s+)?" + TIME_SRC + "\\b", "i");
var MONTH_ALT = Object.keys(MONTH_INDEX).sort((a, b) => b.length - a.length).join("|");
function realMonthDay(today, mo, day, year) {
  if (day < 1 || day > 31) return null;
  const d = inferYearAhead(today, mo, day, year);
  return d.getMonth() === mo && d.getDate() === day ? d : null;
}
function inUnits(count, unit, today) {
  const n = countFromWord(count);
  if (n == null) return null;
  const u = unit.toLowerCase();
  if (u.startsWith("day")) return { date: addDays(today, n) };
  if (u.startsWith("week")) return { date: addDays(today, n * 7) };
  return { date: addMonthsClamped(today, u.startsWith("month") ? n : n * 12) };
}
var DATE_RULES = [
  {
    re: /\b(today|tod|tonight|tomorrow|tmrw|tmr|tom)\b/gi,
    resolve: (m, today) => {
      const w = m[1].toLowerCase();
      if (w === "tonight") return { date: today, time: { hour: 20, minute: 0 } };
      return { date: w === "today" || w === "tod" ? today : addDays(today, 1) };
    }
  },
  {
    // "next week", "the following week": the next first day of the week, never today.
    re: /\b(?:next|(?:the\s+)?following)\s+week\b/gi,
    resolve: (_m, today, weekStart) => ({ date: addDays(today, (weekStart - today.getDay() + 7) % 7 || 7) })
  },
  {
    re: new RegExp("\\b(this|next)\\s+(" + WEEKDAY_ALT + ")\\b", "gi"),
    resolve: (m, today) => ({ date: nextWeekday(today, WEEKDAY_INDEX[m[2].toLowerCase()], { forceNext: m[1].toLowerCase() === "next" }) })
  },
  {
    re: new RegExp("\\b(" + WEEKDAY_ALT + ")\\b", "gi"),
    resolve: (m, today) => ({ date: nextWeekday(today, WEEKDAY_INDEX[m[1].toLowerCase()]) })
  },
  {
    // "in 3 days", "in two weeks", and the same count said the other way round: "two weeks from now".
    // The count is read in digits or in words; "in" or "from now" is what makes the words a date, so a bare
    // "two weeks" in a title stays text.
    re: new RegExp("\\bin\\s+(" + COUNT_SRC + ")\\s+(day|days|week|weeks|month|months|year|years)(?:\\s+from\\s+(?:now|today))?\\b", "gi"),
    resolve: (m, today) => inUnits(m[1], m[2], today)
  },
  {
    re: new RegExp("\\b(" + COUNT_SRC + ")\\s+(day|days|week|weeks|month|months|year|years)\\s+from\\s+(?:now|today)\\b", "gi"),
    resolve: (m, today) => inUnits(m[1], m[2], today)
  },
  {
    re: /\bend\s+of\s+(?:the\s+)?month\b|\beom\b/gi,
    resolve: (_m, today) => ({ date: endOfMonth(today) })
  },
  {
    re: /\b(\d{4})-(\d{2})-(\d{2})\b/g,
    resolve: (m) => {
      const y = parseInt(m[1], 10), mo = parseInt(m[2], 10) - 1, day = parseInt(m[3], 10);
      const d = new Date(y, mo, day);
      return d.getFullYear() === y && d.getMonth() === mo && d.getDate() === day ? { date: d } : null;
    }
  },
  {
    re: new RegExp("\\b(" + MONTH_ALT + ")\\.?\\s+(\\d{1,2})(?:st|nd|rd|th)?(?:,?\\s+(\\d{4}))?\\b", "gi"),
    resolve: (m, today) => {
      const d = realMonthDay(today, MONTH_INDEX[m[1].toLowerCase()], parseInt(m[2], 10), m[3] ? parseInt(m[3], 10) : void 0);
      return d ? { date: d } : null;
    }
  },
  {
    re: new RegExp("\\b(\\d{1,2})(?:st|nd|rd|th)?\\s+(" + MONTH_ALT + ")\\b", "gi"),
    resolve: (m, today) => {
      const d = realMonthDay(today, MONTH_INDEX[m[2].toLowerCase()], parseInt(m[1], 10));
      return d ? { date: d } : null;
    }
  },
  {
    // "the 15th": this month if it has not passed, else the next month that has that day.
    re: /\b(?:on\s+)?(?:the\s+)?(\d{1,2})(?:st|nd|rd|th)\b/gi,
    resolve: (m, today) => {
      const day = parseInt(m[1], 10);
      if (day < 1 || day > 31) return null;
      for (let k = day >= today.getDate() ? 0 : 1; k <= 12; k++) {
        const d = new Date(today.getFullYear(), today.getMonth() + k, day);
        if (d.getDate() === day) return { date: d };
      }
      return null;
    }
  }
];
function firstDateHit(text, today, weekStart, mustStartAt) {
  const cands = [];
  for (const rule of DATE_RULES) {
    rule.re.lastIndex = 0;
    let m;
    while (m = rule.re.exec(text)) {
      if (m[0].length === 0) {
        rule.re.lastIndex++;
        continue;
      }
      const res = rule.resolve(m, today, weekStart);
      if (res) cands.push({ start: m.index, end: m.index + m[0].length, res });
    }
  }
  const pool = mustStartAt != null ? cands.filter((c) => c.start === mustStartAt) : cands;
  const chosen = pool.sort((a, b) => a.start - b.start || b.end - a.end)[0];
  if (!chosen) return null;
  let { start, end } = chosen;
  let time = null;
  const after = text.slice(end).match(TRAIL_TIME);
  if (after) {
    time = parseTime(after[0]);
    end += after[0].length;
  }
  if (!time && mustStartAt == null) {
    const before = text.slice(0, start).match(LEAD_TIME);
    if (before) {
      time = parseTime(before[0]);
      start -= before[0].length;
    }
  }
  return { start, end, date: chosen.res.date, time: time ?? chosen.res.time };
}
function standaloneTime(text, today) {
  const m = STANDALONE_TIME.exec(text);
  const t = m ? parseTime(m[0]) : null;
  return m && t ? { start: m.index, end: m.index + m[0].length, date: today, time: t } : null;
}
function laterAt(now, hours = 3, capHour) {
  const t = new Date(now.getTime() + hours * 60 * MINUTE_MS);
  const at = new Date(t.getFullYear(), t.getMonth(), t.getDate(), t.getHours() + 1);
  if (capHour == null) return at;
  const cap = new Date(now.getFullYear(), now.getMonth(), now.getDate(), capHour);
  return at.getTime() > cap.getTime() && cap.getTime() > now.getTime() ? cap : at;
}
var REL_REMINDER = /^(?:in\s+)?(\d{1,4})\s*(minutes?|mins?|m|hours?|hrs?|h)\b/i;
function reminderAfterBang(text, bang, now, today, weekStart, hours) {
  const from = bang + 1;
  const rest = text.slice(from);
  const later = rest.match(/^later\b/i);
  if (later) return { end: from + later[0].length, at: laterAt(now, hours.later, hours.laterCap) };
  const rel = rest.match(REL_REMINDER);
  if (rel) {
    const n = parseInt(rel[1], 10);
    const t2 = new Date(now.getTime() + (/^h/i.test(rel[2]) ? n * 60 : n) * MINUTE_MS);
    return { end: from + rel[0].length, at: new Date(t2.getFullYear(), t2.getMonth(), t2.getDate(), t2.getHours(), t2.getMinutes()) };
  }
  const hit = firstDateHit(text, today, weekStart, from);
  if (hit) {
    const t2 = hit.time ?? { hour: hours.day, minute: 0 };
    return { end: hit.end, at: new Date(hit.date.getFullYear(), hit.date.getMonth(), hit.date.getDate(), t2.hour, t2.minute) };
  }
  const clock = rest.match(new RegExp("^(?:at\\s+)?" + TIME_SRC + "\\b", "i"));
  const t = clock ? parseTime(clock[0]) : null;
  if (clock && t) {
    let at = new Date(today.getFullYear(), today.getMonth(), today.getDate(), t.hour, t.minute);
    if (at.getTime() <= now.getTime()) at = new Date(at.getFullYear(), at.getMonth(), at.getDate() + 1, t.hour, t.minute);
    return { end: from + clock[0].length, at };
  }
  return null;
}
function reminderLabel(at, today, w) {
  const clock = clockHM(at.getHours(), at.getMinutes());
  const day = dayOf(at);
  if (day.getTime() === today.getTime()) return clock;
  if (day.getTime() === addDays(today, 1).getTime()) return `${w.tomorrow} ${clock}`;
  return `${monthDay(day, today, w)} ${clock}`;
}
var WD_SEP = "(?:\\s*(?:,|/|&|and|,\\s*and)\\s*)";
var RECUR_RULES = [
  {
    // A set of days; first, so the longer set wins over a single day at the same place.
    re: new RegExp("\\bevery(!)?\\s+((?:" + WEEKDAY_ALT + ")" + WD_SEP + "(?:" + WEEKDAY_ALT + ")(?:" + WD_SEP + "(?:" + WEEKDAY_ALT + "))*)\\b", "gi"),
    resolve: (m, today, w) => {
      const r = parseRecurrence("every " + m[2], today);
      if (!r || !r.weekdays || r.weekdays.length < 2) return null;
      return { text: serializeRecurrence(m[1] === "!" ? { ...r, strict: true } : r, { words: w }), seed: "pattern" };
    }
  },
  {
    re: new RegExp("\\bevery(!)?\\s+(workday|weekday|business\\s+day|other\\s+(?:day|week|month|year)|(?:" + NTH_ALT + ")\\s+(?:" + WEEKDAY_ALT + ")|(?:\\d{1,3}(?:st|nd|rd|th)?|" + COUNT_ALT + ")\\s+(?:days?|weeks?|months?|years?)|day|week|month|year|" + WEEKDAY_ALT + ")\\b", "gi"),
    resolve: (m, _today, w) => {
      const every = (m[1] === "!" ? w.everyStrict : w.every) + " ";
      const raw = m[2].toLowerCase().replace(/\s+/g, " ");
      if (raw === "workday" || raw === "weekday" || raw === "business day") return { text: every + "weekday", seed: "workday" };
      if (raw.startsWith("other ")) {
        const u = raw.slice(6);
        return { text: every + "2 " + u + "s", seed: u === "day" ? "today" : void 0 };
      }
      const nth = raw.match(new RegExp("^(" + NTH_ALT + ") (" + WEEKDAY_ALT + ")$"));
      if (nth && nthFromWord(nth[1]) != null) return { text: every + raw, seed: "pattern" };
      const mm = raw.match(new RegExp("^(\\d{1,3}(?:st|nd|rd|th)?|" + COUNT_ALT + ")\\s+(day|week|month|year)s?$"));
      if (mm) {
        const n = countFromWord(mm[1]);
        if (n == null) return null;
        return { text: every + n + " " + mm[2] + "s", seed: mm[2] === "day" ? "today" : void 0 };
      }
      if (/^\d/.test(raw)) return null;
      if (raw === "day") return { text: every + "day", seed: "today" };
      if (raw === "week" || raw === "month" || raw === "year") return { text: every + raw };
      if (WEEKDAY_INDEX[raw] != null) return { text: every + raw, seed: "pattern" };
      return null;
    }
  },
  {
    // "once a week", "twice a week", "3 times a month", "three times a month", "twice weekly".
    // A bare "3 a week" (or "three a week") is too weak to claim.
    re: new RegExp("\\b(once|twice|" + COUNT_SRC + ")\\s*(?:x|times)?\\s+(?:(?:a|an|per|each)\\s+(day|week|month|year)|(daily|weekly|monthly|yearly))\\b", "gi"),
    resolve: (m, _today, w) => {
      const tok = m[1].toLowerCase();
      const u = (m[2] || m[3] || "").toLowerCase();
      if (!u) return null;
      if (!/^(once|twice)$/.test(tok) && !/(?:x|times)/i.test(m[0])) return null;
      const unit = u[0] === "d" ? "day" : u[0] === "w" ? "week" : u[0] === "m" ? "month" : "year";
      const cnt = tok === "once" ? 1 : tok === "twice" ? 2 : Math.max(1, countFromWord(tok) ?? 1);
      return { text: cnt > 1 ? w.repeatTimes(cnt, unit) : w.repeatUnit(w.every, 1, unit), seed: unit === "day" ? "today" : void 0 };
    }
  },
  {
    re: /\b(daily|weekly|monthly|yearly|annually|bi-?weekly|fortnightly|bi-?monthly|weekdays)\b/gi,
    resolve: (m) => {
      const map = {
        daily: "every day",
        weekly: "every week",
        monthly: "every month",
        yearly: "every year",
        annually: "every year",
        biweekly: "every 2 weeks",
        fortnightly: "every 2 weeks",
        bimonthly: "every 2 months",
        weekdays: "every weekday"
      };
      const text = map[m[1].toLowerCase().replace(/-/g, "")];
      if (!text) return null;
      return { text, seed: text === "every day" ? "today" : text === "every weekday" ? "workday" : void 0 };
    }
  }
];
function firstRecurHit(text, today, w) {
  const cands = [];
  for (const rule of RECUR_RULES) {
    rule.re.lastIndex = 0;
    let m;
    while (m = rule.re.exec(text)) {
      if (m[0].length === 0) {
        rule.re.lastIndex++;
        continue;
      }
      const res = rule.resolve(m, today, w);
      if (res) cands.push({ start: m.index, end: m.index + m[0].length, res });
    }
  }
  return cands.sort((a, b) => a.start - b.start || b.end - a.end)[0] ?? null;
}
var TOKEN_WORD = "\\p{L}[\\p{L}\\p{N}'\u2019-]*";
function longestMatch(raw, nameStart, ends, resolve) {
  for (let i = ends.length - 1; i >= 0; i--) {
    const end = ends[i];
    if (/[\p{L}\p{N}]/u.test(raw[end] ?? "")) continue;
    const phrase = raw.slice(nameStart, end).replace(/\s+/g, " ");
    const value = resolve(phrase);
    if (value !== void 0) return { end, phrase, value };
  }
  return { end: ends[0], phrase: raw.slice(nameStart, ends[0]).replace(/\s+/g, " "), value: void 0 };
}
function wordEnds(run, runStart) {
  const re = new RegExp(TOKEN_WORD, "gu");
  const ends = [];
  let m;
  while (m = re.exec(run)) ends.push(runStart + m.index + m[0].length);
  return ends.length ? ends : [runStart + run.length];
}
var signRun = (sign, extraWords) => new RegExp("(^|\\s)(" + sign + ")(" + TOKEN_WORD + "(?:[ \\t]+" + TOKEN_WORD + "){0," + extraWords + "})", "gu");
function mask(raw, spans) {
  const arr = raw.split("");
  for (const s of spans) for (let i = Math.max(0, s.start); i < Math.min(arr.length, s.end); i++) arr[i] = " ";
  return arr.join("");
}
function parseTask(raw, ctx) {
  const w = ctx.words ?? ENGLISH;
  const today = dayOf(ctx.today);
  const now = ctx.now ?? ctx.today;
  const weekStart = ctx.weekStart ?? 1;
  const isWorking = ctx.isWorkingDay ?? isWeekday;
  const me = ctx.me ?? "me";
  const hours = { day: 9, later: 3, ...ctx.reminderHours };
  const { projects, sections, people } = ctx.vocabulary;
  const out = { title: "", assigneeIds: [], reminders: [], tokens: [] };
  const claimed = [];
  const tokens = [];
  const add = (t) => {
    const text = raw.slice(t.start, t.end);
    const typed = text.replace(/^[#/+@^!]/, "").trim().replace(/\s+/g, " ");
    claimed.push(t);
    tokens.push({ ...t, label: typed, meaning: t.label, text });
  };
  const dateLabel = (d, t) => dueLabel(d, today, { words: w }).label + (t ? " " + clockHM(t.hour, t.minute) : "");
  const dateMeaning = (d, t) => `${w.weekdaysShort[d.getDay()]} ${monthDay(d, today, w)}` + (t ? " " + clockHM(t.hour, t.minute) : "");
  const projectByName = (phrase) => {
    const l = fold(phrase);
    const exact = projects.find((p) => fold(p.name) === l);
    if (exact) return exact;
    const want = l.split(/\s+/).filter(Boolean);
    if (!want.length) return void 0;
    const hits = projects.filter((p) => {
      const nw = fold(p.name).split(/[^\p{L}\p{N}'’-]+/u).filter(Boolean);
      for (let i = 0; i + want.length <= nw.length; i++) if (want.every((x, j) => nw[i + j] === x)) return true;
      return false;
    });
    return hits.length === 1 ? hits[0] : void 0;
  };
  for (const m of raw.matchAll(signRun("#", 4))) {
    const start = m.index + m[1].length;
    const nameStart = start + 1;
    const codeRun = m[3].match(/^\p{L}[\p{L}\p{N}]*(?:-[\p{L}\p{N}]+)*/u)[0];
    const ends = [];
    for (let i = 0; i <= codeRun.length; i++) if (i === codeRun.length || codeRun[i] === "-") ends.push(nameStart + i);
    const byCode = longestMatch(raw, nameStart, ends, (phrase) => projects.find((p) => fold(p.code) === fold(phrase) || fold(p.id) === fold(phrase)));
    let end = byCode.value ? nameStart + codeRun.length : byCode.end;
    let project = byCode.value;
    if (!project) {
      const byName = longestMatch(raw, nameStart, wordEnds(m[3], nameStart), projectByName);
      if (byName.value) {
        project = byName.value;
        end = byName.end;
      }
    }
    if (project) {
      out.projectId = project.id;
      add({ start, end, kind: "project", label: project.code, id: project.id });
    } else claimed.push({ start, end });
  }
  const effProject = out.projectId ?? ctx.projectId;
  const own = effProject ? sections.filter((s) => s.projectId === effProject) : [];
  const pool = own.length ? own : sections.filter((s) => !s.projectId);
  for (const m of raw.matchAll(signRun("/", 3))) {
    const start = m.index + m[1].length;
    const hit = longestMatch(raw, start + 1, wordEnds(m[3], start + 1), (phrase) => pool.find((s) => fold(s.name) === fold(phrase)));
    if (hit.value) {
      out.sectionId = hit.value.id;
      add({ start, end: hit.end, kind: "section", label: hit.value.name, id: hit.value.id });
    } else claimed.push({ start, end: hit.end });
  }
  for (const m of raw.matchAll(/(^|\s)(p[1-4])(?=\s|$)/gi)) {
    const start = m.index + m[1].length;
    if (claimed.some((c) => start < c.end && start + 2 > c.start)) continue;
    const p = Number(m[2][1]);
    out.priority = p;
    add({ start, end: start + 2, kind: "priority", label: priorityLabel(p, w) });
  }
  const shortName = (p) => p.handle?.trim() || p.name.split(" ")[0];
  for (const m of raw.matchAll(signRun("[@+]", 3))) {
    const start = m.index + m[1].length;
    const hit = longestMatch(raw, start + 1, wordEnds(m[3], start + 1), (phrase) => {
      const l = fold(phrase);
      if (l === "me") return me;
      return (people.find((p) => fold(p.name) === l) ?? people.find((p) => p.handle != null && fold(p.handle.trim()) === l) ?? people.find((p) => p.aliases?.some((a) => fold(a.trim()) === l)) ?? people.find((p) => fold(p.name.split(" ")[0]) === l))?.id;
    });
    if (hit.value) {
      if (!out.assigneeIds.includes(hit.value)) out.assigneeIds.push(hit.value);
      const person = people.find((p) => p.id === hit.value);
      add({ start, end: hit.end, kind: "person", label: person ? shortName(person) : w.me, id: hit.value });
    } else claimed.push({ start, end: hit.end });
  }
  const forRecur = mask(raw, claimed);
  const recurHit = firstRecurHit(forRecur, today, w);
  let recurTime = null;
  if (recurHit) {
    let text = recurHit.res.text;
    let end = recurHit.end;
    const trail = forRecur.slice(end).match(TRAIL_TIME);
    if (trail) {
      recurTime = parseTime(trail[0]);
      end += trail[0].length;
    }
    let until;
    const afterM = forRecur.slice(end).match(new RegExp("^\\s+(?:for|after)\\s+(\\d{1,4}|" + COUNT_ALT + ")\\s*(?:times?|x|occurrences?|reps?)?\\b", "i"));
    const untilKw = forRecur.slice(end).match(/^\s+(?:until|til|till|through|thru|ending\s+on)\s+/i);
    if (afterM) {
      text = w.repeatFor(text, countFromWord(afterM[1]) ?? 1);
      end += afterM[0].length;
    } else if (untilKw) {
      const u = firstDateHit(forRecur, today, weekStart, end + untilKw[0].length);
      if (u) {
        until = u.date;
        text = w.repeatUntil(text, ruleDateWords(u.date, today, w));
        end = u.end;
      }
    }
    const rule = parseRecurrence(text, today);
    if (rule) {
      out.recurrence = until ? { ...rule, end: { kind: "until", date: formatISO(until) } } : rule;
      out.recurrenceText = text;
      if (recurTime) out.time = recurTime;
      add({ start: recurHit.start, end, kind: "recurrence", label: text + (recurTime ? " " + clockHM(recurTime.hour, recurTime.minute) : "") });
    }
  }
  const forDeadline = mask(raw, claimed);
  for (const m of forDeadline.matchAll(/(^|\s)\^(?=\S)/g)) {
    const caret = m.index + m[1].length;
    const hit = firstDateHit(forDeadline, today, weekStart, caret + 1);
    if (hit) {
      out.deadline = hit.date;
      add({ start: caret, end: hit.end, kind: "deadline", label: dateLabel(hit.date, hit.time) });
    }
  }
  const forKeyword = mask(raw, claimed);
  for (const m of forKeyword.matchAll(/(^|\s)deadline\s+(?=\S)/gi)) {
    const kw = m.index + m[1].length;
    const hit = firstDateHit(forKeyword, today, weekStart, m.index + m[0].length);
    if (hit && out.deadline === void 0) {
      out.deadline = hit.date;
      add({ start: kw, end: hit.end, kind: "deadline", label: dateLabel(hit.date, hit.time) });
    }
  }
  const forRemind = mask(raw, claimed);
  for (const m of forRemind.matchAll(/(^|\s)!(?=\S)/g)) {
    const bang = m.index + m[1].length;
    const hit = reminderAfterBang(forRemind, bang, now, today, weekStart, hours);
    if (!hit) continue;
    out.reminders.push(hit.at);
    add({ start: bang, end: hit.end, kind: "reminder", label: reminderLabel(hit.at, today, w) });
  }
  const forDue = mask(raw, claimed);
  const dueHit = firstDateHit(forDue, today, weekStart) ?? standaloneTime(forDue, today);
  if (dueHit) {
    let start = dueHit.start;
    const lead = forDue.slice(0, start).match(/(^|\s)every!?\s+$/i);
    if (lead) start = lead.index + lead[1].length;
    const dueKw = forDue.slice(0, start).match(/(^|\s)due\s+$/i);
    if (dueKw) start = dueKw.index + dueKw[1].length;
    out.dueDate = dueHit.date;
    if (dueHit.time) out.time = dueHit.time;
    add({ start, end: dueHit.end, kind: "date", label: dateMeaning(dueHit.date, dueHit.time) });
  }
  if (recurHit && out.recurrence && !out.dueDate) {
    const seed = recurHit.res.seed;
    if (seed === "pattern") out.dueDate = firstOccurrence(out.recurrence, today);
    else if (seed === "today") out.dueDate = today;
    else if (seed === "workday") out.dueDate = nextWorkingDay(today, isWorking);
  }
  tokens.sort((a, b) => a.start - b.start);
  let title = "";
  let cursor = 0;
  for (const t of tokens) {
    if (t.start < cursor) continue;
    title += raw.slice(cursor, t.start);
    cursor = t.end;
  }
  out.title = (title + raw.slice(cursor)).replace(/\s{2,}/g, " ").trim();
  let last = -1;
  out.tokens = tokens.filter((t) => t.start >= last ? (last = t.end, true) : false);
  return out;
}

// src/language/readDate.ts
function readDate(text, today, opts = {}) {
  const w = opts.words ?? ENGLISH;
  if (!text.trim()) return null;
  const r = parseTask(text, { today, vocabulary: { projects: [], sections: [], people: [] }, weekStart: opts.weekStart, isWorkingDay: opts.isWorkingDay, words: w });
  if (r.title.trim()) return null;
  if (r.recurrence) {
    const first = r.dueDate ?? firstOccurrence(r.recurrence, today, { weekStart: opts.weekStart ?? 1 });
    const typed = r.tokens.find((t) => t.kind === "recurrence");
    const said = (typed ? text.slice(typed.start, typed.end) : describeRecurrence(r.recurrence, { today, words: w })).trim().replace(/\s+/g, " ").toLowerCase();
    return { date: first, recurrence: r.recurrence, readback: `${said} ${w.from} ${monoDate(first, w)}` };
  }
  if (r.dueDate) return { date: r.dueDate, readback: monoDate(r.dueDate, w) };
  return null;
}

// src/language/timeParse.ts
var escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\/-]/g, "\\$&");
var oneOf = (list2) => list2.map((x) => escapeRe(fold(x).trim()).replace(/\s+/g, " ")).sort((a, b) => b.length - a.length).join("|");
var has = (list2, s) => list2.some((x) => fold(x).trim().replace(/\s+/g, " ") === s);
function parseTimeOfDay(input, words2 = ENGLISH, opts = {}) {
  const w = words2.time;
  const s = fold(input || "").trim().replace(/([ap])\.m\.?/g, "$1m").replace(/\s+/g, " ");
  if (!s) return null;
  if (has(w.noon, s)) return 720;
  if (has(w.midnight, s)) return 0;
  let rest = s;
  let half = false;
  const h = rest.match(new RegExp(`^(?:${oneOf(w.halfPast)}) (.+)$`));
  if (h) {
    half = true;
    rest = h[1];
  }
  const m = rest.match(/^(\d{1,4})(?:[: .](\d{1,2}))?\s*(a|p|am|pm)?$/);
  if (!m) return null;
  let digits = m[1];
  let minStr = m[2];
  if (minStr === void 0 && digits.length >= 3) {
    minStr = digits.slice(-2);
    digits = digits.slice(0, -2);
  } else if (minStr !== void 0 && (minStr.length < 2 || digits.length > 2)) return null;
  if (half && minStr !== void 0) return null;
  const mer = m[3] ? m[3][0] : null;
  const leadingZero = digits.length === 2 && digits[0] === "0";
  let hour = parseInt(digits, 10);
  const min = half ? 30 : minStr === void 0 ? 0 : parseInt(minStr, 10);
  if (min > 59) return null;
  if (mer) {
    if (hour < 1 || hour > 12) return null;
    hour = hour % 12 + (mer === "p" ? 12 : 0);
  } else if (hour === 24) {
    if (min !== 0) return null;
    hour = 0;
  } else if (hour > 24) {
    return null;
  } else if (hour >= 1 && hour <= 6 && !leadingZero && opts.bareHoursArePm !== false) {
    hour += 12;
  }
  return hour * 60 + min;
}
function formatTimeOfDay(minutes) {
  return clockHM(Math.floor(minutes / 60) % 24, minutes % 60);
}
function toHHMM(minutes) {
  return minToClock(minutes % (24 * 60));
}
function fromHHMM(v) {
  const m = (v || "").match(/^(\d{1,2}):(\d{2})/);
  if (!m) return null;
  const mins = parseInt(m[1], 10) * 60 + parseInt(m[2], 10);
  return mins < 1440 ? mins : null;
}
function parseDurationHours(input, words2 = ENGLISH) {
  const w = words2.time;
  const s = fold(input || "").trim().replace(/\s+/g, " ");
  if (!s) return null;
  if (has(w.anHour, s)) return 1;
  if (has(w.halfAnHour, s)) return 0.5;
  if (has(w.hourAndAHalf, s)) return 1.5;
  const hr = `(?:${oneOf(w.hourUnits)})`;
  const mn = `(?:${oneOf(w.minuteUnits)})`;
  const mixed = s.match(new RegExp(`^(\\d+) (\\d+)/(\\d+)\\s*${hr}?$`));
  if (mixed) return Number(mixed[3]) === 0 ? null : Number(mixed[1]) + Number(mixed[2]) / Number(mixed[3]);
  const colon = s.match(/^(\d+):([0-5]\d)$/);
  if (colon) return Number(colon[1]) + Number(colon[2]) / 60;
  const hours = s.match(new RegExp(`^(\\d+(?:\\.\\d+)?)\\s*${hr}\\s*(?:(\\d+)\\s*${mn}?)?$`));
  if (hours) {
    const mins = hours[2] === void 0 ? 0 : Number(hours[2]);
    return mins > 59 ? null : Number(hours[1]) + mins / 60;
  }
  const minutes = s.match(new RegExp(`^(\\d+(?:\\.\\d+)?)\\s*${mn}$`));
  if (minutes) return Number(minutes[1]) / 60;
  const bare = s.match(/^(\d+(?:\.\d+)?)$/);
  if (bare) {
    const n = Number(bare[1]);
    return bare[1].includes(".") || n <= 12 ? n : n / 60;
  }
  return null;
}
function formatDurationHours(hours) {
  const total = Math.round(hours * 60);
  const h = Math.floor(total / 60);
  const m = total % 60;
  return [h ? fmtHours(h) : "", m ? `${m}m` : ""].filter(Boolean).join(" ") || "0m";
}

// src/language/query.ts
var FIXED = [
  ["today", "today"],
  ["tomorrow", "tomorrow"],
  ["overdue", "overdue"],
  ["noDate", "nodate"],
  ["recurring", "recurring"],
  ["unassigned", "noassignee"],
  ["noPriority", "nopriority"],
  ["noSection", "nosection"],
  ["done", "done"],
  ["thisWeek", "thisweek"],
  ["thisMonth", "thismonth"],
  ["thisQuarter", "thisquarter"],
  ["thisYear", "thisyear"],
  ["lastWeek", "lastweek"],
  ["lastMonth", "lastmonth"],
  ["lastQuarter", "lastquarter"]
];
var WINDOWS = {
  thisweek: "week",
  thismonth: "month",
  thisquarter: "quarter",
  thisyear: "year",
  lastweek: "lastweek",
  lastmonth: "lastmonth",
  lastquarter: "lastquarter"
};
var escapeRe2 = (s) => s.replace(/[.*+?^${}()|[\]\\/-]/g, "\\$&");
var isWordChar = (c) => !!c && /[\p{L}\p{N}_]/u.test(c);
function phraseSource(phrase) {
  const t = fold(phrase).trim();
  let src = "";
  let groups = 0;
  for (let i = 0; i < t.length; i++) {
    if (t.startsWith("[:]", i)) {
      src += "(?:\\s*:|\\b)";
      i += 2;
      continue;
    }
    if (t.startsWith("{n}", i)) {
      src += "(\\d+)";
      groups++;
      i += 2;
      continue;
    }
    const c = t[i];
    if (c === "[") src += "(?:";
    else if (c === "]") src += ")?";
    else if (/\s/.test(c)) {
      while (/\s/.test(t[i + 1] ?? "")) i++;
      src += "\\s*";
    } else src += escapeRe2(c);
  }
  const bare = t.replace(/\[:\]/g, ":").replace(/[[\]]/g, "").replace(/\{n\}/g, "0");
  if (isWordChar(bare[0])) src = "\\b" + src;
  if (isWordChar(bare[bare.length - 1])) src += "\\b";
  return { src, groups };
}
function renderPhrase(phrase, n = 7) {
  return phrase.replace(/[[\]]/g, "").replace(/\{n\}/g, String(n));
}
var NORMALISERS = /* @__PURE__ */ new WeakMap();
function normaliser(q) {
  const hit = NORMALISERS.get(q);
  if (hit) return hit;
  const rules = [];
  const add = (phrases, out, tail = "") => {
    for (const p of phrases) {
      const { src, groups } = phraseSource(p);
      rules.push({ src: src + tail, groups, out, len: p.length });
    }
  };
  for (const [key, canon] of FIXED) add(q[key], () => ` ${canon} `, "(?!:)");
  add(q.nextDays, (c) => ` days:${c[0]} `);
  add(q.doneWithin, (c) => ` done:${c[0]} `);
  const follows = "\\s*(?=[^\\s&|!(),+])";
  add(q.assignedTo, () => " assigned:", follows);
  add(q.createdBy, () => " created:", follows);
  add(q.search, () => " search:", "\\s*");
  add(q.and, () => " & ");
  add(q.or, () => " | ");
  rules.sort((a, b) => b.len - a.len);
  const re = new RegExp(rules.map((r) => `(${r.src})`).join("|"), "gu");
  const made = { re, rules };
  NORMALISERS.set(q, made);
  return made;
}
function normalizeQuery(text, words2 = ENGLISH) {
  const { re, rules } = normaliser(words2.query);
  const s = fold(text || "").trim().replace(re, (...args) => {
    let at = 1;
    for (const r of rules) {
      if (args[at] !== void 0) return r.out(args.slice(at + 1, at + 1 + r.groups));
      at += 1 + r.groups;
    }
    return String(args[0]);
  });
  return " " + s.replace(/\+/g, " & ") + " ";
}
function list(v) {
  if (v == null || v === "") return [];
  return typeof v === "string" ? [v] : v.filter((x) => !!x);
}
function choiceIs(c, v, firstName = false) {
  if ([c.id, c.label, c.name ?? "", ...c.aliases ?? []].some((x) => !!x && fold(x).trim() === v)) return true;
  return firstName && !!c.name && fold(c.name).trim().split(/\s+/)[0] === v;
}
function idIs(id, v, choices, firstName = false) {
  return fold(id).trim() === v || !!choices?.some((c) => c.id === id && choiceIs(c, v, firstName));
}
function sectionIs(row, v, ctx) {
  return !!v && !!ctx.section && list(ctx.section(row)).some((id) => idIs(id, v, ctx.sections));
}
function personIs(id, v, ctx) {
  return idIs(id, v, ctx.people, true);
}
var isMeIn = (ctx, id) => !!id && !!ctx.isMe?.(id);
function dueIn(row, ctx) {
  const d = ctx.due?.(row);
  return d ? daysBetween(ctx.today, d) : null;
}
var is = (...ids) => (t) => ids.includes(t);
var prefixed = (p) => (t) => t.startsWith(p) && t.length > p.length;
var numberAfter = (t) => parseInt(t.slice(t.indexOf(":") + 1), 10);
function whoTest(value, ids, ctx) {
  const q = (ctx.words ?? ENGLISH).query;
  if (q.me.some((w) => fold(w) === value)) return ids.some((id) => isMeIn(ctx, id));
  if (q.others.some((w) => fold(w) === value)) return ids.length > 0 && !ids.some((id) => isMeIn(ctx, id));
  return ids.some((id) => personIs(id, value, ctx));
}
var ATOMS = [
  { fields: [], keyword: false, match: (t) => !t, test: () => true },
  { fields: ["date"], keyword: true, match: is("today"), test: (_t, row, ctx) => dueIn(row, ctx) === 0 },
  { fields: ["date"], keyword: true, match: is("tomorrow"), test: (_t, row, ctx) => dueIn(row, ctx) === 1 },
  { fields: ["date"], keyword: true, match: is("overdue"), test: (_t, row, ctx) => (dueIn(row, ctx) ?? 0) < 0 },
  { fields: ["date"], keyword: true, match: is("nodate"), test: (_t, row, ctx) => !!ctx.due && ctx.due(row) == null },
  {
    fields: ["date"],
    keyword: true,
    match: (t) => /^days:\d+$/.test(t),
    test: (t, row, ctx) => {
      const d = dueIn(row, ctx);
      return d != null && d >= 0 && d <= numberAfter(t);
    }
  },
  {
    fields: ["date"],
    keyword: true,
    match: (t) => t in WINDOWS,
    test: (t, row, ctx) => inWindow(ctx.due?.(row), WINDOWS[t], ctx.today, ctx.weekStart)
  },
  { fields: ["recurrence"], keyword: true, match: is("recurring"), test: (_t, row, ctx) => !!ctx.recurring?.(row) },
  {
    fields: ["assignee"],
    keyword: true,
    match: prefixed("assigned:"),
    test: (t, row, ctx) => !!ctx.assignees && whoTest(t.slice(9).trim(), ctx.assignees(row), ctx)
  },
  { fields: ["assignee"], keyword: true, match: is("noassignee"), test: (_t, row, ctx) => !!ctx.assignees && ctx.assignees(row).length === 0 },
  {
    fields: ["creator"],
    keyword: true,
    match: prefixed("created:"),
    test: (t, row, ctx) => !!ctx.createdBy && whoTest(t.slice(8).trim(), list(ctx.createdBy(row)), ctx)
  },
  { fields: ["priority"], keyword: true, match: (t) => /^p[1-4]$/.test(t), test: (t, row, ctx) => ctx.priority?.(row) === Number(t[1]) },
  { fields: ["priority"], keyword: true, match: is("nopriority"), test: (_t, row, ctx) => !!ctx.priority && !ctx.priority(row) },
  { fields: ["section"], keyword: true, match: is("nosection"), test: (_t, row, ctx) => !!ctx.section && list(ctx.section(row)).length === 0 },
  { fields: ["status"], keyword: true, match: is("done"), test: (_t, row, ctx) => !!ctx.done?.(row) },
  {
    fields: ["status"],
    keyword: true,
    match: (t) => /^done:\d+$/.test(t),
    test: (t, row, ctx) => {
      if (!ctx.done?.(row)) return false;
      const at = ctx.doneAt?.(row);
      return at == null || dayOf(new Date(at)).getTime() >= addDays(ctx.today, -numberAfter(t)).getTime();
    }
  },
  {
    fields: ["project"],
    keyword: true,
    match: (t) => t[0] === "#",
    test: (t, row, ctx) => {
      const id = ctx.project?.(row);
      const v = t.slice(1).trim();
      return !!id && !!v && idIs(id, v, ctx.projects);
    }
  },
  { fields: ["section"], keyword: true, match: (t) => t[0] === "/", test: (t, row, ctx) => sectionIs(row, t.slice(1).trim(), ctx) },
  { fields: ["title"], keyword: true, match: (t) => t.startsWith("search:"), test: (t, row, ctx) => textHas(ctx.title(row), t.slice(7).trim()) }
];
var TITLE_SEARCH = {
  fields: ["title"],
  keyword: false,
  match: () => true,
  test: (t, row, ctx) => textHas(ctx.title(row), t) || sectionIs(row, t, ctx)
};
var KEYWORD_TERMS = /* @__PURE__ */ new WeakMap();
function appKeyword(term, keywords, w) {
  return keywords?.find((k) => {
    let hit = KEYWORD_TERMS.get(k);
    if (!hit || hit.w !== w) {
      hit = { w, terms: k.words.map((x) => normalizeQuery(x, w).trim()) };
      KEYWORD_TERMS.set(k, hit);
    }
    return hit.terms.includes(term);
  });
}
function isQueryKeyword(term, vocab = {}) {
  const t = term.trim();
  if (!t) return false;
  return ATOMS.some((a) => a.keyword && a.match(t)) || !!appKeyword(t, vocab.keywords, vocab.words ?? ENGLISH);
}
function queryWords(vocab = {}) {
  const q = (vocab.words ?? ENGLISH).query;
  const first = (l) => renderPhrase(l[0] ?? "");
  const out = [
    first(q.today),
    first(q.overdue),
    first(q.tomorrow),
    first(q.noDate),
    first(q.recurring),
    `${first(q.assignedTo)} ${first(q.me)}`,
    `${first(q.assignedTo)} ${first(q.others)}`,
    first(q.unassigned),
    `${first(q.createdBy)} ${first(q.me)}`,
    `${first(q.createdBy)} ${first(q.others)}`,
    "p1",
    "p2",
    "p3",
    "p4",
    first(q.noPriority),
    first(q.noSection),
    first(q.nextDays),
    first(q.done),
    first(q.doneWithin),
    first(q.thisWeek),
    first(q.thisMonth),
    first(q.thisQuarter),
    first(q.thisYear),
    first(q.lastWeek),
    first(q.lastMonth),
    first(q.lastQuarter),
    ...(vocab.keywords ?? []).filter((k) => k.offer !== false && k.words.length).map((k) => k.words[0])
  ];
  return out.filter((w, i) => !!w && out.indexOf(w) === i);
}
var QUERY_WORDS = queryWords();
function termTest(term, ctx) {
  const atom = ATOMS.find((a) => a.match(term));
  const kw = atom ? void 0 : appKeyword(term, ctx.keywords, ctx.words ?? ENGLISH);
  if (kw) return (row) => kw.test(row);
  const def = atom ?? TITLE_SEARCH;
  const has2 = ctx.has;
  return (row) => (!has2 || def.fields.every((f) => has2(row, f))) && def.test(term, row, ctx);
}
function tokenizeQuery(section) {
  const toks = [];
  let buf = "";
  const flush = () => {
    const t = buf.trim();
    if (t) toks.push({ term: t });
    buf = "";
  };
  for (const ch of section) {
    if (ch === "(" || ch === ")" || ch === "&" || ch === "|" || ch === "!") {
      flush();
      toks.push({ op: ch });
    } else buf += ch;
  }
  flush();
  return toks;
}
var isOp = (t, op) => !!t && "op" in t && t.op === op;
var startsFactor = (t) => !!t && ("term" in t || t.op === "(" || t.op === "!");
function parseTokens(toks) {
  let i = 0;
  const primary = () => {
    const t = toks[i];
    if (isOp(t, "(")) {
      i++;
      const inner = or();
      if (isOp(toks[i], ")")) i++;
      return inner;
    }
    if (t && "term" in t) {
      i++;
      return { type: "term", term: t.term };
    }
    if (t) i++;
    return null;
  };
  const not = () => {
    if (isOp(toks[i], "!")) {
      i++;
      const inner = not();
      return inner && { type: "not", node: inner };
    }
    return primary();
  };
  const join = (type, next, more) => () => {
    let left = next();
    while (more()) {
      if (isOp(toks[i], type === "and" ? "&" : "|")) i++;
      const right = next();
      if (!right) continue;
      left = left ? { type, left, right } : right;
    }
    return left;
  };
  const and = join("and", not, () => isOp(toks[i], "&") || startsFactor(toks[i]));
  const or = join("or", and, () => isOp(toks[i], "|"));
  return or();
}
function parseSection(section, w) {
  const toks = tokenizeQuery(normalizeQuery(section, w).trim());
  if (!toks.length) return { type: "all" };
  return parseTokens(toks) ?? { type: "none" };
}
function splitSections(text) {
  const out = [];
  let buf = "";
  let depth = 0;
  for (const ch of text) {
    if (ch === "(") depth++;
    else if (ch === ")") depth = Math.max(0, depth - 1);
    if (ch === "," && depth === 0) {
      out.push(buf);
      buf = "";
    } else buf += ch;
  }
  out.push(buf);
  return out;
}
function parseQuery(text, vocab = {}) {
  const w = vocab.words ?? ENGLISH;
  const parts = splitSections(text || "").map((p) => p.trim()).filter((p) => p.length > 0);
  if (parts.length <= 1) return [{ label: parts[0] || w.query.all, node: parseSection(parts[0] ?? "", w) }];
  return parts.map((p) => ({ label: p, node: parseSection(p, w) }));
}
function compileNode(node, ctx) {
  switch (node.type) {
    case "all":
      return () => true;
    case "none":
      return () => false;
    case "term":
      return termTest(node.term, ctx);
    case "not": {
      const f = compileNode(node.node, ctx);
      return (row) => !f(row);
    }
    case "and": {
      const l = compileNode(node.left, ctx), r = compileNode(node.right, ctx);
      return (row) => l(row) && r(row);
    }
    case "or": {
      const l = compileNode(node.left, ctx), r = compileNode(node.right, ctx);
      return (row) => l(row) || r(row);
    }
  }
}
function compileSections(text, ctx) {
  return parseQuery(text, ctx).map((s) => ({ label: s.label, predicate: compileNode(s.node, ctx) }));
}
function compileQuery(text, ctx) {
  const sections = compileSections(text, ctx);
  if (sections.length === 1) return sections[0].predicate;
  return (row) => sections.some((s) => s.predicate(row));
}
function queryConstrains(text, vocab = {}) {
  return parseQuery(text, vocab).every((s) => s.node.type !== "all");
}
function queryAsksForCompleted(text, vocab = {}) {
  const walk = (n, negated) => {
    switch (n.type) {
      case "term":
        return !negated && (n.term === "done" || /^done:\d+$/.test(n.term));
      case "not":
        return walk(n.node, !negated);
      case "and":
      case "or":
        return walk(n.left, negated) || walk(n.right, negated);
      default:
        return false;
    }
  };
  return parseQuery(text, vocab).some((s) => walk(s.node, false));
}
var SPLITTERS = /* @__PURE__ */ new WeakMap();
function querySplitter(words2 = ENGLISH) {
  const q = words2.query;
  let re = SPLITTERS.get(q);
  if (!re) {
    const wordOps = [...q.and, ...q.or].map((x) => escapeRe2(fold(x).trim()).replace(/\s+/g, "\\s+")).filter(Boolean);
    re = new RegExp(`(${wordOps.length ? `\\s+(?:${wordOps.join("|")})\\s+|` : ""}[&|!(),+])`, "giu");
    SPLITTERS.set(q, re);
  }
  return new RegExp(re.source, re.flags);
}
function understood(norm, vocab) {
  const w = vocab.words ?? ENGLISH;
  if (norm[0] === "#" || norm[0] === "/") {
    const v = norm.slice(1).trim();
    const choices = norm[0] === "#" ? vocab.projects : vocab.sections;
    return !!v && (!choices || choices.some((c) => choiceIs(c, v)));
  }
  const who = norm.match(/^(?:assigned|created):(.+)$/);
  if (who) {
    const v = who[1].trim();
    if ([...w.query.me, ...w.query.others].some((x) => fold(x) === v)) return true;
    return !vocab.people || vocab.people.some((p) => choiceIs(p, v, true));
  }
  return isQueryKeyword(norm, vocab);
}
function queryTokens(text, vocab = {}) {
  const w = vocab.words ?? ENGLISH;
  const out = [];
  const check = (from, to) => {
    const seg = text.slice(from, to);
    const body = seg.trim();
    if (!body) return;
    const norm = normalizeQuery(body, w).trim();
    if (!understood(norm, vocab)) return;
    const start = from + (seg.length - seg.trimStart().length);
    const label = body[0] === "#" || body[0] === "/" ? body.slice(1).trim() : body;
    out.push({ start, end: start + body.length, label });
  };
  let last = 0;
  for (const m of text.matchAll(querySplitter(w))) {
    check(last, m.index ?? 0);
    last = (m.index ?? 0) + m[0].length;
  }
  check(last, text.length);
  return out;
}

export {
  fold,
  textHas,
  textIs,
  initials,
  SECOND_MS,
  MINUTE_MS,
  HOUR_MS,
  DAY_MS,
  dayOf,
  localToday,
  addDays,
  addMonths,
  addMonthsClamped,
  endOfMonth,
  daysBetween,
  sameDay,
  weekColumn,
  weekStartOf,
  inWeekOrder,
  isWeekday,
  nextWeekday,
  nextWorkingDay,
  countWorkingDays,
  WEEKDAY_INDEX,
  MONTH_INDEX,
  inferYear,
  inferYearAhead,
  formatISO,
  parseISO,
  parseLooseDate,
  windowRange,
  inWindow,
  spanTouchesWindow,
  spanCoversDay,
  msUntilMidnight,
  watchForNewDay,
  isValidZone,
  zoneAbbr,
  compactNum,
  preciseNum,
  fmtHours,
  fmtHoursHalf,
  fmtHoursMinutes,
  fmtPct,
  fmtRatio,
  fmtBytes,
  roundTo,
  plural,
  countLabel,
  dayLoad,
  COUNT_WORDS,
  COUNT_ALT,
  COUNT_SRC,
  countFromWord,
  ENGLISH,
  words,
  monthDay,
  exactDate,
  monoDate,
  weekdayDate,
  dueLabel,
  isLate,
  dayHeading,
  relative,
  isToday,
  timeAgo,
  AGO,
  clockTime,
  clockHM,
  clockCompact,
  minToClock,
  hoursToClock,
  zonedWeekdayHour,
  zoneHint,
  roundQuarter,
  PRIORITY_LEVELS,
  priorityLabel,
  priorityFromLabel,
  WORKDAYS,
  WEEKDAY_ALT,
  NTH_ALT,
  nthFromWord,
  parseRecurrence,
  ruleDateWords,
  serializeRecurrence,
  describeRecurrence,
  describeRecurrenceText,
  nthWeekdayOfMonth,
  matchesRule,
  stepOccurrence,
  firstOccurrence,
  expandOccurrences,
  nextInSeries,
  nextRepeat,
  QUICK_ADD_HINTS,
  laterAt,
  parseTask,
  readDate,
  parseTimeOfDay,
  formatTimeOfDay,
  toHHMM,
  fromHHMM,
  parseDurationHours,
  formatDurationHours,
  renderPhrase,
  normalizeQuery,
  isQueryKeyword,
  queryWords,
  QUERY_WORDS,
  tokenizeQuery,
  parseQuery,
  compileNode,
  compileSections,
  compileQuery,
  queryConstrains,
  queryAsksForCompleted,
  querySplitter,
  queryTokens
};
//# sourceMappingURL=chunk-Z7MYBYQG.js.map