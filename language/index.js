import {
  AGO,
  COUNT_ALT,
  COUNT_SRC,
  COUNT_WORDS,
  DAY_MS,
  ENGLISH,
  HOUR_MS,
  MINUTE_MS,
  MONTH_INDEX,
  NTH_ALT,
  PRIORITY_LEVELS,
  QUERY_WORDS,
  QUICK_ADD_HINTS,
  SECOND_MS,
  WEEKDAY_ALT,
  WEEKDAY_INDEX,
  WORKDAYS,
  addDays,
  addMonths,
  addMonthsClamped,
  clockCompact,
  clockHM,
  clockTime,
  compactNum,
  compileNode,
  compileQuery,
  compileSections,
  countFromWord,
  countLabel,
  countWorkingDays,
  dayHeading,
  dayLoad,
  dayOf,
  daysBetween,
  describeRecurrence,
  describeRecurrenceText,
  dueLabel,
  endOfMonth,
  exactDate,
  expandOccurrences,
  firstOccurrence,
  fmtBytes,
  fmtHours,
  fmtHoursHalf,
  fmtHoursMinutes,
  fmtPct,
  fmtRatio,
  fold,
  formatISO,
  hoursToClock,
  inWeekOrder,
  inWindow,
  inferYear,
  inferYearAhead,
  initials,
  isQueryKeyword,
  isToday,
  isValidZone,
  isWeekday,
  laterAt,
  localToday,
  matchesRule,
  minToClock,
  monoDate,
  monthDay,
  msUntilMidnight,
  nextInSeries,
  nextRepeat,
  nextWeekday,
  nextWorkingDay,
  normalizeQuery,
  nthFromWord,
  nthWeekdayOfMonth,
  parseISO,
  parseLooseDate,
  parseQuery,
  parseRecurrence,
  parseTask,
  plural,
  preciseNum,
  priorityFromLabel,
  priorityLabel,
  queryAsksForCompleted,
  queryConstrains,
  querySplitter,
  queryTokens,
  queryWords,
  readDate,
  relative,
  renderPhrase,
  roundQuarter,
  roundTo,
  ruleDateWords,
  sameDay,
  serializeRecurrence,
  spanCoversDay,
  spanTouchesWindow,
  stepOccurrence,
  textHas,
  textIs,
  timeAgo,
  tokenizeQuery,
  watchForNewDay,
  weekColumn,
  weekStartOf,
  weekdayDate,
  windowRange,
  words,
  zoneAbbr,
  zoneHint,
  zonedWeekdayHour
} from "../chunk-DM62TMMD.js";

// src/language/queryAssist.ts
function recognizeQuery(text, vocab = {}) {
  return queryTokens(text, vocab).map(({ start, end }) => ({ start, end }));
}
function termStart(before, vocab) {
  let last = 0;
  for (const m of before.matchAll(querySplitter(vocab.words))) last = (m.index ?? 0) + m[0].length;
  while (last < before.length && /\s/.test(before[last])) last++;
  return last;
}
function matchingChoices(choices, v) {
  return choices.filter((c) => {
    if (c.hidden) return false;
    const label = fold(c.label);
    if (label === v) return false;
    const name = fold(c.name ?? "");
    return !v || label.startsWith(v) || name.startsWith(v) || name.split(/\s+/).some((w) => w.startsWith(v));
  });
}
function suggestQuery(text, caret, vocab = {}) {
  const w = vocab.words ?? ENGLISH;
  const before = text.slice(0, caret);
  const start = termStart(before, vocab);
  const frag = before.slice(start);
  const q = fold(frag);
  const at = { start, end: caret };
  if (frag[0] === "#" || frag[0] === "/") {
    const project = frag[0] === "#";
    const choices = (project ? vocab.projects : vocab.sections) ?? [];
    return matchingChoices(choices, q.slice(1)).slice(0, 8).map((c) => ({
      key: (project ? "p:" : "s:") + c.id,
      insert: frag[0] + c.label + " ",
      label: project ? c.label : frag[0] + c.label,
      sub: project ? c.name : void 0,
      kind: project ? "project" : "section",
      id: c.id,
      ...at
    }));
  }
  const END = "\uFFFF";
  const who = normalizeQuery(frag + END, w).trim().match(/^(?:assigned|created):(.*)￿$/u);
  const v = who ? who[1].trim() : "";
  if (who && vocab.people && (v || /[:\s]$/.test(frag))) {
    const typed = frag.trimEnd().slice(0, frag.trimEnd().length - v.length).trimEnd() + " ";
    return matchingChoices(vocab.people, v).slice(0, 8).map((p) => ({
      key: "u:" + p.id,
      insert: typed + p.label + " ",
      label: p.label,
      sub: p.name,
      kind: "person",
      id: p.id,
      ...at
    }));
  }
  if (q.length < 2 || !/^\p{L}/u.test(q)) return [];
  const filler = new Set(w.query.filler.map(fold));
  const oneWord = !/\s/.test(q);
  const prefix = [];
  const inner = [];
  for (const word of queryWords(vocab)) {
    const f = fold(word);
    if (f === q) continue;
    if (f.startsWith(q)) prefix.push(word);
    else if (oneWord && f.split(/[\s:]+/).some((x) => !filler.has(x) && x.startsWith(q))) inner.push(word);
  }
  return [...prefix, ...inner].slice(0, 8).map((word) => ({ key: "w:" + word, insert: renderPhrase(word) + " ", label: word, kind: "word", ...at }));
}

// src/language/timeParse.ts
var escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\/-]/g, "\\$&");
var oneOf = (list) => list.map((x) => escapeRe(fold(x).trim()).replace(/\s+/g, " ")).sort((a, b) => b.length - a.length).join("|");
var has = (list, s) => list.some((x) => fold(x).trim().replace(/\s+/g, " ") === s);
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
export {
  AGO,
  COUNT_ALT,
  COUNT_SRC,
  COUNT_WORDS,
  DAY_MS,
  ENGLISH,
  HOUR_MS,
  MINUTE_MS,
  MONTH_INDEX,
  NTH_ALT,
  PRIORITY_LEVELS,
  QUERY_WORDS,
  QUICK_ADD_HINTS,
  SECOND_MS,
  WEEKDAY_ALT,
  WEEKDAY_INDEX,
  WORKDAYS,
  addDays,
  addMonths,
  addMonthsClamped,
  clockCompact,
  clockHM,
  clockTime,
  compactNum,
  compileNode,
  compileQuery,
  compileSections,
  countFromWord,
  countLabel,
  countWorkingDays,
  dayHeading,
  dayLoad,
  dayOf,
  daysBetween,
  describeRecurrence,
  describeRecurrenceText,
  dueLabel,
  endOfMonth,
  exactDate,
  expandOccurrences,
  firstOccurrence,
  fmtBytes,
  fmtHours,
  fmtHoursHalf,
  fmtHoursMinutes,
  fmtPct,
  fmtRatio,
  fold,
  formatDurationHours,
  formatISO,
  formatTimeOfDay,
  fromHHMM,
  hoursToClock,
  inWeekOrder,
  inWindow,
  inferYear,
  inferYearAhead,
  initials,
  isQueryKeyword,
  isToday,
  isValidZone,
  isWeekday,
  laterAt,
  localToday,
  matchesRule,
  minToClock,
  monoDate,
  monthDay,
  msUntilMidnight,
  nextInSeries,
  nextRepeat,
  nextWeekday,
  nextWorkingDay,
  normalizeQuery,
  nthFromWord,
  nthWeekdayOfMonth,
  parseDurationHours,
  parseISO,
  parseLooseDate,
  parseQuery,
  parseRecurrence,
  parseTask,
  parseTimeOfDay,
  plural,
  preciseNum,
  priorityFromLabel,
  priorityLabel,
  queryAsksForCompleted,
  queryConstrains,
  querySplitter,
  queryTokens,
  queryWords,
  readDate,
  recognizeQuery,
  relative,
  renderPhrase,
  roundQuarter,
  roundTo,
  ruleDateWords,
  sameDay,
  serializeRecurrence,
  spanCoversDay,
  spanTouchesWindow,
  stepOccurrence,
  suggestQuery,
  textHas,
  textIs,
  timeAgo,
  toHHMM,
  tokenizeQuery,
  watchForNewDay,
  weekColumn,
  weekStartOf,
  weekdayDate,
  windowRange,
  words,
  zoneAbbr,
  zoneHint,
  zonedWeekdayHour
};
//# sourceMappingURL=index.js.map