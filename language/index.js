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
  countdown,
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
  isLate,
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
} from "../chunk-LWUGX7T6.js";

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
  countdown,
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
  isLate,
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