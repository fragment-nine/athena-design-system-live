import {
  ENGLISH,
  addDays,
  addMonthsClamped,
  countdown,
  dayHeading,
  dayOf,
  daysBetween,
  dueLabel,
  formatISO,
  formatTimeOfDay,
  initials,
  isLate,
  monoDate,
  nextWeekday,
  parseTask,
  parseTimeOfDay,
  queryTokens,
  readDate,
  sameDay,
  weekStartOf
} from "../chunk-6L6A5VUJ.js";
import {
  describeViolations,
  scanIn
} from "../chunk-5DPRZLB3.js";

// src/components/cx.ts
function fromControl(e) {
  const hit = e.target.closest('button,a,input,select,textarea,label,[role="checkbox"],[role="switch"],[role="menuitem"],[contenteditable="true"]');
  return !!hit && hit !== e.currentTarget && !hit.classList.contains("ad-open");
}
function cx(...parts) {
  return parts.filter(Boolean).join(" ");
}

// src/components/State/State.tsx
import { useCallback, useEffect, useRef, useState } from "react";
var read = (defaults) => {
  const out = { ...defaults };
  if (typeof window === "undefined") return out;
  const q = new URLSearchParams(window.location.search);
  for (const k of Object.keys(defaults)) {
    const v = q.get(k);
    if (v != null) out[k] = v;
  }
  return out;
};
function useViewInAddress(defaults) {
  const first = useRef(defaults);
  const [view, setState] = useState(() => read(first.current));
  useEffect(() => {
    const back = () => setState(read(first.current));
    window.addEventListener("popstate", back);
    return () => window.removeEventListener("popstate", back);
  }, []);
  const set = useCallback((patch) => {
    setState((now) => {
      const next = { ...now, ...patch };
      const q = new URLSearchParams(window.location.search);
      for (const k of Object.keys(first.current)) {
        if (next[k] === first.current[k] || next[k] === "") q.delete(k);
        else q.set(k, next[k]);
      }
      const search = q.toString();
      window.history.pushState(window.history.state, "", `${window.location.pathname}${search ? `?${search}` : ""}${window.location.hash}`);
      return next;
    });
  }, []);
  return [view, set];
}
var SAVE_FAILED = "Couldn't save, so it's back to what it was. Try again.";
function useSaveAsYouGo(saved, save, words = {}) {
  const [value, setValue] = useState(saved);
  const [failed, setFailed] = useState(null);
  const sentence = words.failed ?? SAVE_FAILED;
  const last = useRef(saved);
  const turn = useRef(0);
  useEffect(() => {
    last.current = saved;
    setValue(saved);
  }, [saved]);
  const set = useCallback((next) => {
    const mine = ++turn.current;
    setValue(next);
    setFailed(null);
    save(next).then(
      () => {
        if (mine === turn.current) last.current = next;
      },
      () => {
        if (mine === turn.current) {
          setValue(last.current);
          setFailed(sentence);
        }
      }
    );
  }, [save, sentence]);
  return { value, set, failed };
}

// src/components/hue.tsx
import { createContext, useContext } from "react";
var TWELVE = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
var hueNames = [
  ...TWELVE.map((n) => `project-${n}`),
  "item-phase",
  "item-milestone",
  "item-deliverable",
  "item-todo",
  "item-travel",
  "phase-early",
  "phase-design",
  "phase-build",
  "phase-rehearsal",
  "phase-show",
  "dept-lighting",
  "dept-video",
  "dept-eng",
  "dept-sfx",
  "dept-content",
  "dept-scenic",
  "dept-direction",
  "dept-admin",
  "dept-lasers",
  "dept-pm"
];
var KNOWN = new Set(hueNames);
function projectHue(index) {
  const n = (Math.trunc(index) % 12 + 12) % 12;
  return `project-${TWELVE[n]}`;
}
var OFF = { project: false, item: false, department: false, inProject: false };
var HueSwitches = createContext(OFF);
function resolve(on, hue) {
  if (!hue || !KNOWN.has(hue)) return void 0;
  if (hue.startsWith("project-")) return on.project && !on.inProject ? `var(--${hue})` : void 0;
  if (hue.startsWith("dept-")) return on.department ? `var(--${hue})` : void 0;
  return on.item ? `var(--${hue})` : void 0;
}
function useHue(hue) {
  return resolve(useContext(HueSwitches), hue);
}
function barColour(name, shown) {
  const stripe = !!shown && !!name && (name.startsWith("item-") || name.startsWith("phase-"));
  const glyph = !!name && name.startsWith("dept-");
  return { "--ad-bar": stripe || glyph ? void 0 : shown, "--ad-stripe": stripe ? shown : void 0 };
}
function useHueOf() {
  const on = useContext(HueSwitches);
  return (hue) => resolve(on, hue);
}
var SHOW_DEFAULTS = { compactRows: false, projectColours: false, itemColours: false, departmentColours: false, weekendShading: true, people: false, archive: false };
var Show = createContext(SHOW_DEFAULTS);
function useShow() {
  return useContext(Show);
}

// src/components/Button/Button.tsx
import { createContext as createContext3, forwardRef, useContext as useContext3, useRef as useRef4 } from "react";

// src/components/Tooltip/Tooltip.tsx
import { cloneElement, isValidElement, useEffect as useEffect3, useId, useRef as useRef3, useState as useState3 } from "react";

// src/components/floating/floating.tsx
import { createContext as createContext2, useContext as useContext2, useEffect as useEffect2, useLayoutEffect, useRef as useRef2, useState as useState2 } from "react";
import { createPortal } from "react-dom";
import { jsx } from "react/jsx-runtime";
var useIsoLayoutEffect = typeof window === "undefined" ? useEffect2 : useLayoutEffect;
var FloatDoc = createContext2(null);
function FloatingWindow({ doc, children }) {
  return /* @__PURE__ */ jsx(FloatDoc.Provider, { value: doc, children });
}
function useFloatingDocument() {
  const d = useContext2(FloatDoc);
  return d ?? (typeof document !== "undefined" ? document : void 0);
}
function Portal({ children }) {
  const doc = useFloatingDocument();
  const [ready, setReady] = useState2(() => !!doc);
  useEffect2(() => setReady(true), []);
  return ready && doc ? createPortal(children, doc.body) : null;
}
function tokenPx(name, fallback, doc = typeof document !== "undefined" ? document : void 0) {
  const win = doc?.defaultView;
  if (!doc || !win) return fallback;
  const v = parseFloat(win.getComputedStyle(doc.documentElement).getPropertyValue(name));
  return Number.isFinite(v) ? v : fallback;
}
function useIsPhone() {
  const win = typeof window !== "undefined" ? window : void 0;
  const [phone, setPhone] = useState2(() => !!win && win.innerWidth <= tokenPx("--bp-phone", 640));
  useIsoLayoutEffect(() => {
    if (!win) return;
    const run = () => setPhone(win.innerWidth <= tokenPx("--bp-phone", 640));
    win.addEventListener("resize", run);
    return () => win.removeEventListener("resize", run);
  }, []);
  return phone;
}
function useCoarsePointer() {
  const win = typeof window !== "undefined" ? window : void 0;
  const [coarse] = useState2(() => !!win?.matchMedia?.("(pointer: coarse)").matches);
  return coarse;
}
function usePlacement(open, anchor, floating, placement, within) {
  const [pos, setPos] = useState2(null);
  const doc = useFloatingDocument();
  const place = useRef2(() => {
  });
  place.current = () => {
    const f = floating.current;
    if (!f) return;
    const win = doc?.defaultView ?? window;
    const gap = tokenPx("--space-1", 4, doc);
    const edge = tokenPx("--space-2", 8, doc);
    const vw = win.innerWidth;
    const vh = win.innerHeight;
    const fw = f.offsetWidth;
    const fh = f.offsetHeight;
    const a = anchor?.current?.getBoundingClientRect();
    const room = within?.current?.getBoundingClientRect();
    let top;
    let left;
    if (placement === "foot" && room) {
      left = room.left;
      top = Math.min(room.bottom, vh - edge) - fh;
    } else if (placement === "top-centre" || !a) {
      top = Math.round(vh * 0.12);
      left = (vw - fw) / 2;
    } else if (placement === "side") {
      left = vw - fw - edge;
      top = Math.min(a.top, vh - fh - edge);
    } else if (placement === "over") {
      left = Math.min(a.left, vw - fw - edge);
      top = Math.min(a.top, (room ? Math.min(room.bottom, vh - edge) : vh - edge) - fh);
    } else {
      left = a.left;
      top = a.bottom + gap;
      if (left + fw > vw - edge) left = a.right - fw;
      if (top + fh > vh - edge && a.top - gap - fh >= edge) top = a.top - gap - fh;
    }
    const placedTop = Math.round(Math.max(edge, top));
    const next = { top: placedTop, left: Math.round(Math.max(edge, left)), maxHeight: Math.max(0, Math.round(vh - placedTop - edge)) };
    setPos((p) => p && p.top === next.top && p.left === next.left && p.maxHeight === next.maxHeight ? p : next);
  };
  useIsoLayoutEffect(() => {
    if (open) place.current();
  });
  useIsoLayoutEffect(() => {
    if (!open) {
      setPos(null);
      return;
    }
    const run = () => place.current();
    const ro = typeof ResizeObserver !== "undefined" && floating.current ? new ResizeObserver(run) : null;
    if (ro && floating.current) ro.observe(floating.current);
    const win = doc?.defaultView ?? window;
    win.addEventListener("resize", run);
    win.addEventListener("scroll", run, true);
    return () => {
      ro?.disconnect();
      win.removeEventListener("resize", run);
      win.removeEventListener("scroll", run, true);
    };
  }, [open]);
  return pos ? { position: "fixed", top: pos.top, left: pos.left, maxHeight: pos.maxHeight } : { position: "fixed", top: 0, left: 0, visibility: "hidden" };
}
var layers = [];
var listening = /* @__PURE__ */ new Map();
function restack() {
  let under = 0;
  for (const l of layers) {
    const z = Math.max(l.base, under + 2);
    if (z !== l.z) {
      l.z = z;
      l.setZ(z);
    }
    under = z;
  }
}
function onPointerDown(e) {
  const t = e.target;
  if (t.closest?.("[data-ad-layer]") || t.parentElement?.closest("[data-ad-layer]")) return;
  let keep = -1;
  for (let i = layers.length - 1; i >= 0; i--) if (layers[i].boxes().some((b) => b?.contains(t))) {
    keep = i;
    break;
  }
  layers.slice(keep + 1).reverse().forEach((l) => l.close());
}
function onKeyDown(e) {
  if (e.key !== "Escape" || !layers.length) return;
  e.preventDefault();
  layers[layers.length - 1].close();
}
function useLayer(open, onClose, refs, level = "popover") {
  const latest = useRef2(onClose);
  latest.current = onClose;
  const doc = useFloatingDocument() ?? document;
  const base = level === "dialog" ? tokenPx("--z-dialog", 500, doc) : tokenPx("--z-popover", 300, doc);
  const [z, setZ] = useState2(base);
  useIsoLayoutEffect(() => {
    if (!open) return;
    const layer = { boxes: () => refs.map((r) => r?.current), close: () => latest.current?.(), base, z: -1, setZ, doc };
    const n = listening.get(doc) ?? 0;
    if (!n) {
      doc.addEventListener("pointerdown", onPointerDown, true);
      doc.addEventListener("keydown", onKeyDown);
    }
    listening.set(doc, n + 1);
    const own = layer.boxes()[0];
    const child = own ? layers.findIndex((l) => l.boxes().slice(1).some((a) => a && own.contains(a))) : -1;
    if (child >= 0) layers.splice(child, 0, layer);
    else layers.push(layer);
    restack();
    return () => {
      const i = layers.indexOf(layer);
      if (i >= 0) layers.splice(i, 1);
      layer.z = -1;
      const left = (listening.get(doc) ?? 1) - 1;
      listening.set(doc, left);
      if (!left) {
        doc.removeEventListener("pointerdown", onPointerDown, true);
        doc.removeEventListener("keydown", onKeyDown);
      }
    };
  }, [open]);
  return z;
}
var FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';
function useFocusReturn(open, box, start = "first") {
  const doc = useFloatingDocument() ?? document;
  useEffect2(() => {
    if (!open) return;
    const before = doc.activeElement;
    const id = requestAnimationFrame(() => {
      const el = box.current;
      if (!el) return;
      const target = el.querySelector("[data-autofocus]") ?? (start === "first" ? el.querySelector(FOCUSABLE) : null) ?? el;
      target.focus({ preventScroll: true });
    });
    return () => {
      cancelAnimationFrame(id);
      const now = doc.activeElement;
      const inside = !now || now === doc.body || !!box.current?.contains(now);
      if (inside && before && doc.contains(before)) before.focus({ preventScroll: true });
    };
  }, [open]);
}
function trapTab(e, box) {
  if (e.key !== "Tab" || !box) return;
  const items = Array.from(box.querySelectorAll(FOCUSABLE));
  if (!items.length) {
    e.preventDefault();
    return;
  }
  const first = items[0];
  const last = items[items.length - 1];
  const at = document.activeElement;
  const back = e.shiftKey;
  if (!at || !box.contains(at)) {
    e.preventDefault();
    (back ? last : first).focus();
    return;
  }
  const i = items.indexOf(at);
  if (i === -1) {
    const after = items.find((el) => at.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_FOLLOWING);
    const before = [...items].reverse().find((el) => at.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_PRECEDING);
    e.preventDefault();
    (back ? before ?? last : after ?? first).focus();
    return;
  }
  if (back && at === first) {
    e.preventDefault();
    last.focus();
  } else if (!back && at === last) {
    e.preventDefault();
    first.focus();
  }
}
function usePageInert(open, boxes) {
  useEffect2(() => {
    if (!open || typeof document === "undefined") return;
    const mine = boxes.map((b) => b?.current).filter(Boolean);
    const hidden = [];
    for (const el of Array.from(document.body.children)) {
      if (mine.some((m) => el === m || el.contains(m))) continue;
      if (el.hasAttribute("inert") || el.getAttribute("aria-hidden") === "true") continue;
      if (el.hasAttribute("data-ad-layer")) continue;
      el.setAttribute("inert", "");
      el.setAttribute("aria-hidden", "true");
      hidden.push(el);
    }
    return () => {
      for (const el of hidden) {
        el.removeAttribute("inert");
        el.removeAttribute("aria-hidden");
      }
    };
  }, [open]);
}
function nextIndex(key, at, count) {
  if (!count) return null;
  if (key === "ArrowDown") return (at + 1 + count) % count;
  if (key === "ArrowUp") return (at - 1 + count) % count;
  if (key === "Home") return 0;
  if (key === "End") return count - 1;
  return null;
}
function tokenMs(name, fallback) {
  if (typeof window === "undefined") return fallback;
  const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  const n = parseFloat(raw);
  if (!Number.isFinite(n)) return fallback;
  return raw.endsWith("ms") ? n : n * 1e3;
}

// src/components/Tooltip/Tooltip.tsx
import { Fragment, jsx as jsx2, jsxs } from "react/jsx-runtime";
function useTooltip(text, { describes = true } = {}) {
  const doc = useFloatingDocument();
  const id = useId();
  const timer = useRef3();
  const tip = useRef3(null);
  const [at, setAt] = useState3(null);
  const [placed, setPlaced] = useState3(null);
  const showFor = (el, now) => {
    if (!text) return;
    clearTimeout(timer.current);
    const go = () => {
      const r = el.getBoundingClientRect();
      const gap = tokenPx("--space-2", 8, doc);
      setPlaced(null);
      setAt({ top: r.bottom + gap, left: r.left + r.width / 2, above: r.top - gap });
    };
    if (now) go();
    else timer.current = setTimeout(go, tokenMs("--delay-tip", 500));
  };
  const hide = () => {
    clearTimeout(timer.current);
    setAt(null);
  };
  useEffect3(() => {
    if (!at || !tip.current) return;
    const w = tip.current.offsetWidth;
    const h = tip.current.offsetHeight;
    const edge = tokenPx("--space-2", 8, doc);
    const win = doc?.defaultView ?? window;
    const left = Math.min(Math.max(at.left, edge + w / 2), win.innerWidth - edge - w / 2);
    const top = at.top + h > win.innerHeight - edge && at.above - h >= edge ? at.above - h : at.top;
    setPlaced({ left, top });
  }, [at]);
  useEffect3(() => {
    if (!at) return;
    const onKey = (e) => {
      if (e.key === "Escape") hide();
    };
    const d = doc ?? document;
    d.addEventListener("keydown", onKey);
    return () => d.removeEventListener("keydown", onKey);
  }, [at]);
  useEffect3(() => () => clearTimeout(timer.current), []);
  const triggerProps = {
    "aria-describedby": at && describes ? id : void 0,
    onPointerEnter: (e) => showFor(e.currentTarget, false),
    onPointerLeave: hide,
    onFocus: (e) => {
      if (e.currentTarget.matches(":focus-visible")) showFor(e.currentTarget, true);
    },
    onBlur: hide,
    /** Touch has no hover: a tap shows it. */
    onClick: (e) => showFor(e.currentTarget, true)
  };
  const node = at && text ? /* @__PURE__ */ jsx2(Portal, { children: /* @__PURE__ */ jsx2("div", { ref: tip, id, role: "tooltip", className: "ad-tooltip", style: { top: placed?.top ?? at.top, left: placed?.left ?? at.left, visibility: placed == null ? "hidden" : void 0 }, children: text }) }) : null;
  return { triggerProps, node };
}
function Tooltip({ text, children }) {
  const { triggerProps, node } = useTooltip(text);
  if (!isValidElement(children)) return children;
  const own = children.props;
  const chain = (name) => (e) => {
    own[name]?.(e);
    triggerProps[name](e);
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    cloneElement(children, {
      "aria-describedby": [children.props["aria-describedby"], triggerProps["aria-describedby"]].filter(Boolean).join(" ") || void 0,
      onPointerEnter: chain("onPointerEnter"),
      onPointerLeave: chain("onPointerLeave"),
      onFocus: chain("onFocus"),
      onBlur: chain("onBlur")
    }),
    node
  ] });
}

// src/components/Icon/glyphs.ts
var REGULAR = {
  "airplane": [
    "M235.58,128.84,160,91.06V48a32,32,0,0,0-64,0V91.06L20.42,128.84A8,8,0,0,0,16,136v32a8,8,0,0,0,9.57,7.84L96,161.76v18.93L82.34,194.34A8,8,0,0,0,80,200v32a8,8,0,0,0,11,7.43l37-14.81,37,14.81A8,8,0,0,0,176,232V200a8,8,0,0,0-2.34-5.66L160,180.69V161.76l70.43,14.08A8,8,0,0,0,240,168V136A8,8,0,0,0,235.58,128.84ZM224,158.24l-70.43-14.08A8,8,0,0,0,144,152v32a8,8,0,0,0,2.34,5.66L160,203.31v16.87l-29-11.61a8,8,0,0,0-5.94,0L96,220.18V203.31l13.66-13.65A8,8,0,0,0,112,184V152a8,8,0,0,0-9.57-7.84L32,158.24v-17.3l75.58-37.78A8,8,0,0,0,112,96V48a16,16,0,0,1,32,0V96a8,8,0,0,0,4.42,7.16L224,140.94Z"
  ],
  "align-left": [
    "M48,40V216a8,8,0,0,1-16,0V40a8,8,0,0,1,16,0Zm16,64V64A16,16,0,0,1,80,48h96a16,16,0,0,1,16,16v40a16,16,0,0,1-16,16H80A16,16,0,0,1,64,104Zm16,0h96V64H80Zm152,48v40a16,16,0,0,1-16,16H80a16,16,0,0,1-16-16V152a16,16,0,0,1,16-16H216A16,16,0,0,1,232,152Zm-16,40V152H80v40H216Z"
  ],
  "archive": [
    "M224,48H32A16,16,0,0,0,16,64V88a16,16,0,0,0,16,16v88a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V104a16,16,0,0,0,16-16V64A16,16,0,0,0,224,48ZM208,192H48V104H208ZM224,88H32V64H224V88ZM96,136a8,8,0,0,1,8-8h48a8,8,0,0,1,0,16H104A8,8,0,0,1,96,136Z"
  ],
  "arrow-counter-clockwise": [
    "M224,128a96,96,0,0,1-94.71,96H128A95.38,95.38,0,0,1,62.1,197.8a8,8,0,0,1,11-11.63A80,80,0,1,0,71.43,71.39a3.07,3.07,0,0,1-.26.25L44.59,96H72a8,8,0,0,1,0,16H24a8,8,0,0,1-8-8V56a8,8,0,0,1,16,0V85.8L60.25,60A96,96,0,0,1,224,128Z"
  ],
  "arrow-down": [
    "M205.66,149.66l-72,72a8,8,0,0,1-11.32,0l-72-72a8,8,0,0,1,11.32-11.32L120,196.69V40a8,8,0,0,1,16,0V196.69l58.34-58.35a8,8,0,0,1,11.32,11.32Z"
  ],
  "arrow-square-out": [
    "M224,104a8,8,0,0,1-16,0V59.32l-66.33,66.34a8,8,0,0,1-11.32-11.32L196.68,48H152a8,8,0,0,1,0-16h64a8,8,0,0,1,8,8Zm-40,24a8,8,0,0,0-8,8v72H48V80h72a8,8,0,0,0,0-16H48A16,16,0,0,0,32,80V208a16,16,0,0,0,16,16H176a16,16,0,0,0,16-16V136A8,8,0,0,0,184,128Z"
  ],
  "arrow-up": [
    "M205.66,117.66a8,8,0,0,1-11.32,0L136,59.31V216a8,8,0,0,1-16,0V59.31L61.66,117.66a8,8,0,0,1-11.32-11.32l72-72a8,8,0,0,1,11.32,0l72,72A8,8,0,0,1,205.66,117.66Z"
  ],
  "arrows-clockwise": [
    "M224,48V96a8,8,0,0,1-8,8H168a8,8,0,0,1,0-16h28.69L182.06,73.37a79.56,79.56,0,0,0-56.13-23.43h-.45A79.52,79.52,0,0,0,69.59,72.71,8,8,0,0,1,58.41,61.27a96,96,0,0,1,135,.79L208,76.69V48a8,8,0,0,1,16,0ZM186.41,183.29a80,80,0,0,1-112.47-.66L59.31,168H88a8,8,0,0,0,0-16H40a8,8,0,0,0-8,8v48a8,8,0,0,0,16,0V179.31l14.63,14.63A95.43,95.43,0,0,0,130,222.06h.53a95.36,95.36,0,0,0,67.07-27.33,8,8,0,0,0-11.18-11.44Z"
  ],
  "arrows-down-up": [
    "M117.66,170.34a8,8,0,0,1,0,11.32l-32,32a8,8,0,0,1-11.32,0l-32-32a8,8,0,0,1,11.32-11.32L72,188.69V48a8,8,0,0,1,16,0V188.69l18.34-18.35A8,8,0,0,1,117.66,170.34Zm96-96-32-32a8,8,0,0,0-11.32,0l-32,32a8,8,0,0,0,11.32,11.32L168,67.31V208a8,8,0,0,0,16,0V67.31l18.34,18.35a8,8,0,0,0,11.32-11.32Z"
  ],
  "arrows-left-right": [
    "M213.66,181.66l-32,32a8,8,0,0,1-11.32-11.32L188.69,184H48a8,8,0,0,1,0-16H188.69l-18.35-18.34a8,8,0,0,1,11.32-11.32l32,32A8,8,0,0,1,213.66,181.66Zm-139.32-64a8,8,0,0,0,11.32-11.32L67.31,88H208a8,8,0,0,0,0-16H67.31L85.66,53.66A8,8,0,0,0,74.34,42.34l-32,32a8,8,0,0,0,0,11.32Z"
  ],
  "bell": [
    "M221.8,175.94C216.25,166.38,208,139.33,208,104a80,80,0,1,0-160,0c0,35.34-8.26,62.38-13.81,71.94A16,16,0,0,0,48,200H88.81a40,40,0,0,0,78.38,0H208a16,16,0,0,0,13.8-24.06ZM128,216a24,24,0,0,1-22.62-16h45.24A24,24,0,0,1,128,216ZM48,184c7.7-13.24,16-43.92,16-80a64,64,0,1,1,128,0c0,36.05,8.28,66.73,16,80Z"
  ],
  "binoculars": [
    "M237.2,151.87v0a47.1,47.1,0,0,0-2.35-5.45L193.26,51.8a7.82,7.82,0,0,0-1.66-2.44,32,32,0,0,0-45.26,0A8,8,0,0,0,144,55V80H112V55a8,8,0,0,0-2.34-5.66,32,32,0,0,0-45.26,0,7.82,7.82,0,0,0-1.66,2.44L21.15,146.4a47.1,47.1,0,0,0-2.35,5.45v0A48,48,0,1,0,112,168V96h32v72a48,48,0,1,0,93.2-16.13ZM76.71,59.75a16,16,0,0,1,19.29-1v73.51a47.9,47.9,0,0,0-46.79-9.92ZM64,200a32,32,0,1,1,32-32A32,32,0,0,1,64,200ZM160,58.74a16,16,0,0,1,19.29,1l27.5,62.58A47.9,47.9,0,0,0,160,132.25ZM192,200a32,32,0,1,1,32-32A32,32,0,0,1,192,200Z"
  ],
  "buildings": [
    "M240,208H224V96a16,16,0,0,0-16-16H144V32a16,16,0,0,0-24.88-13.32L39.12,72A16,16,0,0,0,32,85.34V208H16a8,8,0,0,0,0,16H240a8,8,0,0,0,0-16ZM208,96V208H144V96ZM48,85.34,128,32V208H48ZM112,112v16a8,8,0,0,1-16,0V112a8,8,0,1,1,16,0Zm-32,0v16a8,8,0,0,1-16,0V112a8,8,0,1,1,16,0Zm0,56v16a8,8,0,0,1-16,0V168a8,8,0,0,1,16,0Zm32,0v16a8,8,0,0,1-16,0V168a8,8,0,0,1,16,0Z"
  ],
  "calendar-blank": [
    "M208,32H184V24a8,8,0,0,0-16,0v8H88V24a8,8,0,0,0-16,0v8H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM72,48v8a8,8,0,0,0,16,0V48h80v8a8,8,0,0,0,16,0V48h24V80H48V48ZM208,208H48V96H208V208Z"
  ],
  "calendar-slash": [
    "M208,32H184V24a8,8,0,0,0-16,0v8H88V24a8,8,0,0,0-16,0v8H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM72,48v8a8,8,0,0,0,16,0V48h80v8a8,8,0,0,0,16,0V48h24V80H48V48ZM208,208H48V96H208V208Z",
    "M34.1,37.41L210.1,229.41A8,8,0,0,0,221.9,218.59L45.9,26.59A8,8,0,0,0,34.1,37.41Z"
  ],
  "caret-down": [
    "M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"
  ],
  "caret-left": [
    "M165.66,202.34a8,8,0,0,1-11.32,11.32l-80-80a8,8,0,0,1,0-11.32l80-80a8,8,0,0,1,11.32,11.32L91.31,128Z"
  ],
  "caret-right": [
    "M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z"
  ],
  "caret-up": [
    "M213.66,165.66a8,8,0,0,1-11.32,0L128,91.31,53.66,165.66a8,8,0,0,1-11.32-11.32l80-80a8,8,0,0,1,11.32,0l80,80A8,8,0,0,1,213.66,165.66Z"
  ],
  "chart-bar-horizontal": [
    "M224,96H184V56a8,8,0,0,0-8-8H56V40a8,8,0,0,0-16,0V216a8,8,0,0,0,16,0v-8h88a8,8,0,0,0,8-8V160h72a8,8,0,0,0,8-8V104A8,8,0,0,0,224,96ZM168,64V96H56V64ZM136,192H56V160h80Zm80-48H56V112H216Z"
  ],
  "chart-line": [
    "M232,208a8,8,0,0,1-8,8H32a8,8,0,0,1-8-8V48a8,8,0,0,1,16,0v94.37L90.73,98a8,8,0,0,1,10.07-.38l58.81,44.11L218.73,90a8,8,0,1,1,10.54,12l-64,56a8,8,0,0,1-10.07.38L96.39,114.29,40,163.63V200H224A8,8,0,0,1,232,208Z"
  ],
  "check": [
    "M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z"
  ],
  "circle": [
    "M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Z"
  ],
  "clipboard-text": [
    "M168,152a8,8,0,0,1-8,8H96a8,8,0,0,1,0-16h64A8,8,0,0,1,168,152Zm-8-40H96a8,8,0,0,0,0,16h64a8,8,0,0,0,0-16Zm56-64V216a16,16,0,0,1-16,16H56a16,16,0,0,1-16-16V48A16,16,0,0,1,56,32H92.26a47.92,47.92,0,0,1,71.48,0H200A16,16,0,0,1,216,48ZM96,64h64a32,32,0,0,0-64,0ZM200,48H173.25A47.93,47.93,0,0,1,176,64v8a8,8,0,0,1-8,8H88a8,8,0,0,1-8-8V64a47.93,47.93,0,0,1,2.75-16H56V216H200Z"
  ],
  "clock-afternoon": [
    "M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm64-88a8,8,0,0,1-8,8H147.31l26.35,26.34a8,8,0,0,1-11.32,11.32l-40-40A8,8,0,0,1,128,120h56A8,8,0,0,1,192,128Z"
  ],
  "clock": [
    "M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm64-88a8,8,0,0,1-8,8H128a8,8,0,0,1-8-8V72a8,8,0,0,1,16,0v48h48A8,8,0,0,1,192,128Z"
  ],
  "cloud-arrow-up": [
    "M178.34,165.66,160,147.31V208a8,8,0,0,1-16,0V147.31l-18.34,18.35a8,8,0,0,1-11.32-11.32l32-32a8,8,0,0,1,11.32,0l32,32a8,8,0,0,1-11.32,11.32ZM160,40A88.08,88.08,0,0,0,81.29,88.68,64,64,0,1,0,72,216h40a8,8,0,0,0,0-16H72a48,48,0,0,1,0-96c1.1,0,2.2,0,3.29.12A88,88,0,0,0,72,128a8,8,0,0,0,16,0,72,72,0,1,1,100.8,66,8,8,0,0,0,3.2,15.34,7.9,7.9,0,0,0,3.2-.68A88,88,0,0,0,160,40Z"
  ],
  "copy-simple": [
    "M184,64H40a8,8,0,0,0-8,8V216a8,8,0,0,0,8,8H184a8,8,0,0,0,8-8V72A8,8,0,0,0,184,64Zm-8,144H48V80H176ZM224,40V184a8,8,0,0,1-16,0V48H72a8,8,0,0,1,0-16H216A8,8,0,0,1,224,40Z"
  ],
  "copy": [
    "M216,32H88a8,8,0,0,0-8,8V80H40a8,8,0,0,0-8,8V216a8,8,0,0,0,8,8H168a8,8,0,0,0,8-8V176h40a8,8,0,0,0,8-8V40A8,8,0,0,0,216,32ZM160,208H48V96H160Zm48-48H176V88a8,8,0,0,0-8-8H96V48H208Z"
  ],
  "cube": [
    "M223.68,66.15,135.68,18h0a15.88,15.88,0,0,0-15.36,0l-88,48.17a16,16,0,0,0-8.32,14v95.64a16,16,0,0,0,8.32,14l88,48.17a15.88,15.88,0,0,0,15.36,0l88-48.17a16,16,0,0,0,8.32-14V80.18A16,16,0,0,0,223.68,66.15ZM128,32h0l80.34,44L128,120,47.66,76ZM40,90l80,43.78v85.79L40,175.82Zm96,129.57V133.82L216,90v85.78Z"
  ],
  "currency-dollar": [
    "M152,120H136V56h8a32,32,0,0,1,32,32,8,8,0,0,0,16,0,48.05,48.05,0,0,0-48-48h-8V24a8,8,0,0,0-16,0V40h-8a48,48,0,0,0,0,96h8v64H104a32,32,0,0,1-32-32,8,8,0,0,0-16,0,48.05,48.05,0,0,0,48,48h16v16a8,8,0,0,0,16,0V216h16a48,48,0,0,0,0-96Zm-40,0a32,32,0,0,1,0-64h8v64Zm40,80H136V136h16a32,32,0,0,1,0,64Z"
  ],
  "device-mobile": [
    "M176,16H80A24,24,0,0,0,56,40V216a24,24,0,0,0,24,24h96a24,24,0,0,0,24-24V40A24,24,0,0,0,176,16ZM72,64H184V192H72Zm8-32h96a8,8,0,0,1,8,8v8H72V40A8,8,0,0,1,80,32Zm96,192H80a8,8,0,0,1-8-8v-8H184v8A8,8,0,0,1,176,224Z"
  ],
  "diamond": [
    "M235.33,116.72,139.28,20.66a16,16,0,0,0-22.56,0l-96,96.06a16,16,0,0,0,0,22.56l96.05,96.06h0a16,16,0,0,0,22.56,0l96.05-96.06a16,16,0,0,0,0-22.56ZM128,224h0L32,128,128,32,224,128Z"
  ],
  "dot": [
    "M140,128a12,12,0,1,1-12-12A12,12,0,0,1,140,128Z"
  ],
  "dots-six-vertical": [
    "M104,60A12,12,0,1,1,92,48,12,12,0,0,1,104,60Zm60,12a12,12,0,1,0-12-12A12,12,0,0,0,164,72ZM92,116a12,12,0,1,0,12,12A12,12,0,0,0,92,116Zm72,0a12,12,0,1,0,12,12A12,12,0,0,0,164,116ZM92,184a12,12,0,1,0,12,12A12,12,0,0,0,92,184Zm72,0a12,12,0,1,0,12,12A12,12,0,0,0,164,184Z"
  ],
  "dots-three": [
    "M140,128a12,12,0,1,1-12-12A12,12,0,0,1,140,128Zm56-12a12,12,0,1,0,12,12A12,12,0,0,0,196,116ZM60,116a12,12,0,1,0,12,12A12,12,0,0,0,60,116Z"
  ],
  "eye": [
    "M247.31,124.76c-.35-.79-8.82-19.58-27.65-38.41C194.57,61.26,162.88,48,128,48S61.43,61.26,36.34,86.35C17.51,105.18,9,124,8.69,124.76a8,8,0,0,0,0,6.5c.35.79,8.82,19.57,27.65,38.4C61.43,194.74,93.12,208,128,208s66.57-13.26,91.66-38.34c18.83-18.83,27.3-37.61,27.65-38.4A8,8,0,0,0,247.31,124.76ZM128,192c-30.78,0-57.67-11.19-79.93-33.25A133.47,133.47,0,0,1,25,128,133.33,133.33,0,0,1,48.07,97.25C70.33,75.19,97.22,64,128,64s57.67,11.19,79.93,33.25A133.46,133.46,0,0,1,231.05,128C223.84,141.46,192.43,192,128,192Zm0-112a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Z"
  ],
  "fire": [
    "M183.89,153.34a57.6,57.6,0,0,1-46.56,46.55A8.75,8.75,0,0,1,136,200a8,8,0,0,1-1.32-15.89c16.57-2.79,30.63-16.85,33.44-33.45a8,8,0,0,1,15.78,2.68ZM216,144a88,88,0,0,1-176,0c0-27.92,11-56.47,32.66-84.85a8,8,0,0,1,11.93-.89l24.12,23.41,22-60.41a8,8,0,0,1,12.63-3.41C165.21,36,216,84.55,216,144Zm-16,0c0-46.09-35.79-85.92-58.21-106.33L119.52,98.74a8,8,0,0,1-13.09,3L80.06,76.16C64.09,99.21,56,122,56,144a72,72,0,0,0,144,0Z"
  ],
  "flag": [
    "M42.76,50A8,8,0,0,0,40,56V224a8,8,0,0,0,16,0V179.77c26.79-21.16,49.87-9.75,76.45,3.41,16.4,8.11,34.06,16.85,53,16.85,13.93,0,28.54-4.75,43.82-18a8,8,0,0,0,2.76-6V56A8,8,0,0,0,218.76,50c-28,24.23-51.72,12.49-79.21-1.12C111.07,34.76,78.78,18.79,42.76,50ZM216,172.25c-26.79,21.16-49.87,9.74-76.45-3.41-25-12.35-52.81-26.13-83.55-8.4V59.79c26.79-21.16,49.87-9.75,76.45,3.4,25,12.35,52.82,26.13,83.55,8.4Z"
  ],
  "floppy-disk": [
    "M219.31,72,184,36.69A15.86,15.86,0,0,0,172.69,32H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V83.31A15.86,15.86,0,0,0,219.31,72ZM168,208H88V152h80Zm40,0H184V152a16,16,0,0,0-16-16H88a16,16,0,0,0-16,16v56H48V48H172.69L208,83.31ZM160,72a8,8,0,0,1-8,8H96a8,8,0,0,1,0-16h56A8,8,0,0,1,160,72Z"
  ],
  "funnel": [
    "M230.6,49.53A15.81,15.81,0,0,0,216,40H40A16,16,0,0,0,28.19,66.76l.08.09L96,139.17V216a16,16,0,0,0,24.87,13.32l32-21.34A16,16,0,0,0,160,194.66V139.17l67.74-72.32.08-.09A15.8,15.8,0,0,0,230.6,49.53ZM40,56h0Zm106.18,74.58A8,8,0,0,0,144,136v58.66L112,216V136a8,8,0,0,0-2.16-5.47L40,56H216Z"
  ],
  "gear": [
    "M128,80a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Zm88-29.84q.06-2.16,0-4.32l14.92-18.64a8,8,0,0,0,1.48-7.06,107.21,107.21,0,0,0-10.88-26.25,8,8,0,0,0-6-3.93l-23.72-2.64q-1.48-1.56-3-3L186,40.54a8,8,0,0,0-3.94-6,107.71,107.71,0,0,0-26.25-10.87,8,8,0,0,0-7.06,1.49L130.16,40Q128,40,125.84,40L107.2,25.11a8,8,0,0,0-7.06-1.48A107.6,107.6,0,0,0,73.89,34.51a8,8,0,0,0-3.93,6L67.32,64.27q-1.56,1.49-3,3L40.54,70a8,8,0,0,0-6,3.94,107.71,107.71,0,0,0-10.87,26.25,8,8,0,0,0,1.49,7.06L40,125.84Q40,128,40,130.16L25.11,148.8a8,8,0,0,0-1.48,7.06,107.21,107.21,0,0,0,10.88,26.25,8,8,0,0,0,6,3.93l23.72,2.64q1.49,1.56,3,3L70,215.46a8,8,0,0,0,3.94,6,107.71,107.71,0,0,0,26.25,10.87,8,8,0,0,0,7.06-1.49L125.84,216q2.16.06,4.32,0l18.64,14.92a8,8,0,0,0,7.06,1.48,107.21,107.21,0,0,0,26.25-10.88,8,8,0,0,0,3.93-6l2.64-23.72q1.56-1.48,3-3L215.46,186a8,8,0,0,0,6-3.94,107.71,107.71,0,0,0,10.87-26.25,8,8,0,0,0-1.49-7.06Zm-16.1-6.5a73.93,73.93,0,0,1,0,8.68,8,8,0,0,0,1.74,5.48l14.19,17.73a91.57,91.57,0,0,1-6.23,15L187,173.11a8,8,0,0,0-5.1,2.64,74.11,74.11,0,0,1-6.14,6.14,8,8,0,0,0-2.64,5.1l-2.51,22.58a91.32,91.32,0,0,1-15,6.23l-17.74-14.19a8,8,0,0,0-5-1.75h-.48a73.93,73.93,0,0,1-8.68,0,8,8,0,0,0-5.48,1.74L100.45,215.8a91.57,91.57,0,0,1-15-6.23L82.89,187a8,8,0,0,0-2.64-5.1,74.11,74.11,0,0,1-6.14-6.14,8,8,0,0,0-5.1-2.64L46.43,170.6a91.32,91.32,0,0,1-6.23-15l14.19-17.74a8,8,0,0,0,1.74-5.48,73.93,73.93,0,0,1,0-8.68,8,8,0,0,0-1.74-5.48L40.2,100.45a91.57,91.57,0,0,1,6.23-15L69,82.89a8,8,0,0,0,5.1-2.64,74.11,74.11,0,0,1,6.14-6.14A8,8,0,0,0,82.89,69L85.4,46.43a91.32,91.32,0,0,1,15-6.23l17.74,14.19a8,8,0,0,0,5.48,1.74,73.93,73.93,0,0,1,8.68,0,8,8,0,0,0,5.48-1.74L155.55,40.2a91.57,91.57,0,0,1,15,6.23L173.11,69a8,8,0,0,0,2.64,5.1,74.11,74.11,0,0,1,6.14,6.14,8,8,0,0,0,5.1,2.64l22.58,2.51a91.32,91.32,0,0,1,6.23,15l-14.19,17.74A8,8,0,0,0,199.87,123.66Z"
  ],
  "globe": [
    "M128,24h0A104,104,0,1,0,232,128,104.12,104.12,0,0,0,128,24Zm88,104a87.61,87.61,0,0,1-3.33,24H174.16a157.44,157.44,0,0,0,0-48h38.51A87.61,87.61,0,0,1,216,128ZM102,168H154a115.11,115.11,0,0,1-26,45A115.27,115.27,0,0,1,102,168Zm-3.9-16a140.84,140.84,0,0,1,0-48h59.88a140.84,140.84,0,0,1,0,48ZM40,128a87.61,87.61,0,0,1,3.33-24H81.84a157.44,157.44,0,0,0,0,48H43.33A87.61,87.61,0,0,1,40,128ZM154,88H102a115.11,115.11,0,0,1,26-45A115.27,115.27,0,0,1,154,88Zm52.33,0H170.71a135.28,135.28,0,0,0-22.3-45.6A88.29,88.29,0,0,1,206.37,88ZM107.59,42.4A135.28,135.28,0,0,0,85.29,88H49.63A88.29,88.29,0,0,1,107.59,42.4ZM49.63,168H85.29a135.28,135.28,0,0,0,22.3,45.6A88.29,88.29,0,0,1,49.63,168Zm98.78,45.6a135.28,135.28,0,0,0,22.3-45.6h35.66A88.29,88.29,0,0,1,148.41,213.6Z"
  ],
  "handshake": [
    "M254.3,107.91,228.78,56.85a16,16,0,0,0-21.47-7.15L182.44,62.13,130.05,48.27a8.14,8.14,0,0,0-4.1,0L73.56,62.13,48.69,49.7a16,16,0,0,0-21.47,7.15L1.7,107.9a16,16,0,0,0,7.15,21.47l27,13.51,55.49,39.63a8.06,8.06,0,0,0,2.71,1.25l64,16a8,8,0,0,0,7.6-2.1l55.07-55.08,26.42-13.21a16,16,0,0,0,7.15-21.46Zm-54.89,33.37L165,113.72a8,8,0,0,0-10.68.61C136.51,132.27,116.66,130,104,122L147.24,80h31.81l27.21,54.41ZM41.53,64,62,74.22,36.43,125.27,16,115.06Zm116,119.13L99.42,168.61l-49.2-35.14,28-56L128,64.28l9.8,2.59-45,43.68-.08.09a16,16,0,0,0,2.72,24.81c20.56,13.13,45.37,11,64.91-5L188,152.66Zm62-57.87-25.52-51L214.47,64,240,115.06Zm-87.75,92.67a8,8,0,0,1-7.75,6.06,8.13,8.13,0,0,1-1.95-.24L80.41,213.33a7.89,7.89,0,0,1-2.71-1.25L51.35,193.26a8,8,0,0,1,9.3-13l25.11,17.94L126,208.24A8,8,0,0,1,131.82,217.94Z"
  ],
  "hash": [
    "M224,88H175.4l8.47-46.57a8,8,0,0,0-15.74-2.86l-9,49.43H111.4l8.47-46.57a8,8,0,0,0-15.74-2.86L95.14,88H48a8,8,0,0,0,0,16H92.23L83.5,152H32a8,8,0,0,0,0,16H80.6l-8.47,46.57a8,8,0,0,0,6.44,9.3A7.79,7.79,0,0,0,80,224a8,8,0,0,0,7.86-6.57l9-49.43H144.6l-8.47,46.57a8,8,0,0,0,6.44,9.3A7.79,7.79,0,0,0,144,224a8,8,0,0,0,7.86-6.57l9-49.43H208a8,8,0,0,0,0-16H163.77l8.73-48H224a8,8,0,0,0,0-16Zm-76.5,64H99.77l8.73-48h47.73Z"
  ],
  "info": [
    "M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm16-40a8,8,0,0,1-8,8,16,16,0,0,1-16-16V128a8,8,0,0,1,0-16,16,16,0,0,1,16,16v40A8,8,0,0,1,144,176ZM112,84a12,12,0,1,1,12,12A12,12,0,0,1,112,84Z"
  ],
  "kanban": [
    "M216,48H40a8,8,0,0,0-8,8V208a16,16,0,0,0,16,16H88a16,16,0,0,0,16-16V160h48v16a16,16,0,0,0,16,16h40a16,16,0,0,0,16-16V56A8,8,0,0,0,216,48ZM88,208H48V128H88Zm0-96H48V64H88Zm64,32H104V64h48Zm56,32H168V128h40Zm0-64H168V64h40Z"
  ],
  "layout": [
    "M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40Zm0,16V96H40V56ZM40,112H96v88H40Zm176,88H112V112H216v88Z"
  ],
  "lightbulb-filament": [
    "M176,232a8,8,0,0,1-8,8H88a8,8,0,0,1,0-16h80A8,8,0,0,1,176,232Zm40-128a87.55,87.55,0,0,1-33.64,69.21A16.24,16.24,0,0,0,176,186v6a16,16,0,0,1-16,16H96a16,16,0,0,1-16-16v-6a16,16,0,0,0-6.23-12.66A87.59,87.59,0,0,1,40,104.5C39.74,56.83,78.26,17.15,125.88,16A88,88,0,0,1,216,104Zm-16,0a72,72,0,0,0-73.74-72c-39,.92-70.47,33.39-70.26,72.39a71.64,71.64,0,0,0,27.64,56.3h0A32,32,0,0,1,96,186v6h24V147.31L90.34,117.66a8,8,0,0,1,11.32-11.32L128,132.69l26.34-26.35a8,8,0,0,1,11.32,11.32L136,147.31V192h24v-6a32.12,32.12,0,0,1,12.47-25.35A71.65,71.65,0,0,0,200,104Z"
  ],
  "lightning": [
    "M215.79,118.17a8,8,0,0,0-5-5.66L153.18,90.9l14.66-73.33a8,8,0,0,0-13.69-7l-112,120a8,8,0,0,0,3,13l57.63,21.61L88.16,238.43a8,8,0,0,0,13.69,7l112-120A8,8,0,0,0,215.79,118.17ZM109.37,214l10.47-52.38a8,8,0,0,0-5-9.06L62,132.71l84.62-90.66L136.16,94.43a8,8,0,0,0,5,9.06l52.8,19.8Z"
  ],
  "list-checks": [
    "M224,128a8,8,0,0,1-8,8H128a8,8,0,0,1,0-16h88A8,8,0,0,1,224,128ZM128,72h88a8,8,0,0,0,0-16H128a8,8,0,0,0,0,16Zm88,112H128a8,8,0,0,0,0,16h88a8,8,0,0,0,0-16ZM82.34,42.34,56,68.69,45.66,58.34A8,8,0,0,0,34.34,69.66l16,16a8,8,0,0,0,11.32,0l32-32A8,8,0,0,0,82.34,42.34Zm0,64L56,132.69,45.66,122.34a8,8,0,0,0-11.32,11.32l16,16a8,8,0,0,0,11.32,0l32-32a8,8,0,0,0-11.32-11.32Zm0,64L56,196.69,45.66,186.34a8,8,0,0,0-11.32,11.32l16,16a8,8,0,0,0,11.32,0l32-32a8,8,0,0,0-11.32-11.32Z"
  ],
  "list": [
    "M224,128a8,8,0,0,1-8,8H40a8,8,0,0,1,0-16H216A8,8,0,0,1,224,128ZM40,72H216a8,8,0,0,0,0-16H40a8,8,0,0,0,0,16ZM216,184H40a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16Z"
  ],
  "lock-open": [
    "M208,80H96V56a32,32,0,0,1,32-32c15.37,0,29.2,11,32.16,25.59a8,8,0,0,0,15.68-3.18C171.32,24.15,151.2,8,128,8A48.05,48.05,0,0,0,80,56V80H48A16,16,0,0,0,32,96V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V96A16,16,0,0,0,208,80Zm0,128H48V96H208V208Zm-68-56a12,12,0,1,1-12-12A12,12,0,0,1,140,152Z"
  ],
  "lock": [
    "M208,80H176V56a48,48,0,0,0-96,0V80H48A16,16,0,0,0,32,96V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V96A16,16,0,0,0,208,80ZM96,56a32,32,0,0,1,64,0V80H96ZM208,208H48V96H208V208Zm-68-56a12,12,0,1,1-12-12A12,12,0,0,1,140,152Z"
  ],
  "magnifying-glass": [
    "M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"
  ],
  "megaphone": [
    "M248,120a48.05,48.05,0,0,0-48-48H160.2c-2.91-.17-53.62-3.74-101.91-44.24A16,16,0,0,0,32,40V200a16,16,0,0,0,26.29,12.25c37.77-31.68,77-40.76,93.71-43.3v31.72A16,16,0,0,0,159.12,214l11,7.33A16,16,0,0,0,194.5,212l11.77-44.36A48.07,48.07,0,0,0,248,120ZM48,199.93V40h0c42.81,35.91,86.63,45,104,47.24v65.48C134.65,155,90.84,164.07,48,199.93Zm131,8,0,.11-11-7.33V168h21.6ZM200,152H168V88h32a32,32,0,1,1,0,64Z"
  ],
  "minus": [
    "M224,128a8,8,0,0,1-8,8H40a8,8,0,0,1,0-16H216A8,8,0,0,1,224,128Z"
  ],
  "monitor-play": [
    "M208,40H48A24,24,0,0,0,24,64V176a24,24,0,0,0,24,24H208a24,24,0,0,0,24-24V64A24,24,0,0,0,208,40Zm8,136a8,8,0,0,1-8,8H48a8,8,0,0,1-8-8V64a8,8,0,0,1,8-8H208a8,8,0,0,1,8,8Zm-48,48a8,8,0,0,1-8,8H96a8,8,0,0,1,0-16h64A8,8,0,0,1,168,224Zm-3.56-110.66-48-32A8,8,0,0,0,104,88v64a8,8,0,0,0,12.44,6.66l48-32a8,8,0,0,0,0-13.32ZM120,137.05V103l25.58,17Z"
  ],
  "monitor": [
    "M208,40H48A24,24,0,0,0,24,64V176a24,24,0,0,0,24,24H208a24,24,0,0,0,24-24V64A24,24,0,0,0,208,40Zm8,136a8,8,0,0,1-8,8H48a8,8,0,0,1-8-8V64a8,8,0,0,1,8-8H208a8,8,0,0,1,8,8Zm-48,48a8,8,0,0,1-8,8H96a8,8,0,0,1,0-16h64A8,8,0,0,1,168,224Z"
  ],
  "moon": [
    "M233.54,142.23a8,8,0,0,0-8-2,88.08,88.08,0,0,1-109.8-109.8,8,8,0,0,0-10-10,104.84,104.84,0,0,0-52.91,37A104,104,0,0,0,136,224a103.09,103.09,0,0,0,62.52-20.88,104.84,104.84,0,0,0,37-52.91A8,8,0,0,0,233.54,142.23ZM188.9,190.34A88,88,0,0,1,65.66,67.11a89,89,0,0,1,31.4-26A106,106,0,0,0,96,56,104.11,104.11,0,0,0,200,160a106,106,0,0,0,14.92-1.06A89,89,0,0,1,188.9,190.34Z"
  ],
  "music-notes": [
    "M212.92,17.69a8,8,0,0,0-6.86-1.45l-128,32A8,8,0,0,0,72,56V166.08A36,36,0,1,0,88,196V110.25l112-28v51.83A36,36,0,1,0,216,164V24A8,8,0,0,0,212.92,17.69ZM52,216a20,20,0,1,1,20-20A20,20,0,0,1,52,216ZM88,93.75V62.25l112-28v31.5ZM180,184a20,20,0,1,1,20-20A20,20,0,0,1,180,184Z"
  ],
  "note": [
    "M88,96a8,8,0,0,1,8-8h64a8,8,0,0,1,0,16H96A8,8,0,0,1,88,96Zm8,40h64a8,8,0,0,0,0-16H96a8,8,0,0,0,0,16Zm32,16H96a8,8,0,0,0,0,16h32a8,8,0,0,0,0-16ZM224,48V156.69A15.86,15.86,0,0,1,219.31,168L168,219.31A15.86,15.86,0,0,1,156.69,224H48a16,16,0,0,1-16-16V48A16,16,0,0,1,48,32H208A16,16,0,0,1,224,48ZM48,208H152V160a8,8,0,0,1,8-8h48V48H48Zm120-40v28.7L196.69,168Z"
  ],
  "notebook": [
    "M184,112a8,8,0,0,1-8,8H112a8,8,0,0,1,0-16h64A8,8,0,0,1,184,112Zm-8,24H112a8,8,0,0,0,0,16h64a8,8,0,0,0,0-16Zm48-88V208a16,16,0,0,1-16,16H48a16,16,0,0,1-16-16V48A16,16,0,0,1,48,32H208A16,16,0,0,1,224,48ZM48,208H72V48H48Zm160,0V48H88V208H208Z"
  ],
  "package": [
    "M223.68,66.15,135.68,18a15.88,15.88,0,0,0-15.36,0l-88,48.17a16,16,0,0,0-8.32,14v95.64a16,16,0,0,0,8.32,14l88,48.17a15.88,15.88,0,0,0,15.36,0l88-48.17a16,16,0,0,0,8.32-14V80.18A16,16,0,0,0,223.68,66.15ZM128,32l80.34,44-29.77,16.3-80.35-44ZM128,120,47.66,76l33.9-18.56,80.34,44ZM40,90l80,43.78v85.79L40,175.82Zm176,85.78h0l-80,43.79V133.82l32-17.51V152a8,8,0,0,0,16,0V107.55L216,90v85.77Z"
  ],
  "paint-brush": [
    "M232,32a8,8,0,0,0-8-8c-44.08,0-89.31,49.71-114.43,82.63A60,60,0,0,0,32,164c0,30.88-19.54,44.73-20.47,45.37A8,8,0,0,0,16,224H92a60,60,0,0,0,57.37-77.57C182.3,121.31,232,76.08,232,32ZM92,208H34.63C41.38,198.41,48,183.92,48,164a44,44,0,1,1,44,44Zm32.42-94.45q5.14-6.66,10.09-12.55A76.23,76.23,0,0,1,155,121.49q-5.9,4.94-12.55,10.09A60.54,60.54,0,0,0,124.42,113.55Zm42.7-2.68a92.57,92.57,0,0,0-22-22c31.78-34.53,55.75-45,69.9-47.91C212.17,55.12,201.65,79.09,167.12,110.87Z"
  ],
  "paper-plane-tilt": [
    "M227.32,28.68a16,16,0,0,0-15.66-4.08l-.15,0L19.57,82.84a16,16,0,0,0-2.49,29.8L102,154l41.3,84.87A15.86,15.86,0,0,0,157.74,248q.69,0,1.38-.06a15.88,15.88,0,0,0,14-11.51l58.2-191.94c0-.05,0-.1,0-.15A16,16,0,0,0,227.32,28.68ZM157.83,231.85l-.05.14,0-.07-40.06-82.3,48-48a8,8,0,0,0-11.31-11.31l-48,48L24.08,98.25l-.07,0,.14,0L216,40Z"
  ],
  "path": [
    "M200,168a32.06,32.06,0,0,0-31,24H72a32,32,0,0,1,0-64h96a40,40,0,0,0,0-80H72a8,8,0,0,0,0,16h96a24,24,0,0,1,0,48H72a48,48,0,0,0,0,96h97a32,32,0,1,0,31-40Zm0,48a16,16,0,1,1,16-16A16,16,0,0,1,200,216Z"
  ],
  "pencil-simple": [
    "M227.31,73.37,182.63,28.68a16,16,0,0,0-22.63,0L36.69,152A15.86,15.86,0,0,0,32,163.31V208a16,16,0,0,0,16,16H92.69A15.86,15.86,0,0,0,104,219.31L227.31,96a16,16,0,0,0,0-22.63ZM92.69,208H48V163.31l88-88L180.69,120ZM192,108.68,147.31,64l24-24L216,84.68Z"
  ],
  "plus": [
    "M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z"
  ],
  "printer": [
    "M214.67,72H200V40a8,8,0,0,0-8-8H64a8,8,0,0,0-8,8V72H41.33C27.36,72,16,82.77,16,96v80a8,8,0,0,0,8,8H56v32a8,8,0,0,0,8,8H192a8,8,0,0,0,8-8V184h32a8,8,0,0,0,8-8V96C240,82.77,228.64,72,214.67,72ZM72,48H184V72H72ZM184,208H72V160H184Zm40-40H200V152a8,8,0,0,0-8-8H64a8,8,0,0,0-8,8v16H32V96c0-4.41,4.19-8,9.33-8H214.67c5.14,0,9.33,3.59,9.33,8Zm-24-52a12,12,0,1,1-12-12A12,12,0,0,1,200,116Z"
  ],
  "push-pin": [
    "M235.32,81.37,174.63,20.69a16,16,0,0,0-22.63,0L98.37,74.49c-10.66-3.34-35-7.37-60.4,13.14a16,16,0,0,0-1.29,23.78L85,159.71,42.34,202.34a8,8,0,0,0,11.32,11.32L96.29,171l48.29,48.29A16,16,0,0,0,155.9,224c.38,0,.75,0,1.13,0a15.93,15.93,0,0,0,11.64-6.33c19.64-26.1,17.75-47.32,13.19-60L235.33,104A16,16,0,0,0,235.32,81.37ZM224,92.69h0l-57.27,57.46a8,8,0,0,0-1.49,9.22c9.46,18.93-1.8,38.59-9.34,48.62L48,100.08c12.08-9.74,23.64-12.31,32.48-12.31A40.13,40.13,0,0,1,96.81,91a8,8,0,0,0,9.25-1.51L163.32,32,224,92.68Z"
  ],
  "question": [
    "M140,180a12,12,0,1,1-12-12A12,12,0,0,1,140,180ZM128,72c-22.06,0-40,16.15-40,36v4a8,8,0,0,0,16,0v-4c0-11,10.77-20,24-20s24,9,24,20-10.77,20-24,20a8,8,0,0,0-8,8v8a8,8,0,0,0,16,0v-.72c18.24-3.35,32-17.9,32-35.28C168,88.15,150.06,72,128,72Zm104,56A104,104,0,1,1,128,24,104.11,104.11,0,0,1,232,128Zm-16,0a88,88,0,1,0-88,88A88.1,88.1,0,0,0,216,128Z"
  ],
  "rectangle": [
    "M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40Zm0,160H40V56H216V200Z"
  ],
  "repeat": [
    "M24,128A72.08,72.08,0,0,1,96,56H204.69L194.34,45.66a8,8,0,0,1,11.32-11.32l24,24a8,8,0,0,1,0,11.32l-24,24a8,8,0,0,1-11.32-11.32L204.69,72H96a56.06,56.06,0,0,0-56,56,8,8,0,0,1-16,0Zm200-8a8,8,0,0,0-8,8,56.06,56.06,0,0,1-56,56H51.31l10.35-10.34a8,8,0,0,0-11.32-11.32l-24,24a8,8,0,0,0,0,11.32l24,24a8,8,0,0,0,11.32-11.32L51.31,200H160a72.08,72.08,0,0,0,72-72A8,8,0,0,0,224,120Z"
  ],
  "seal-check": [
    "M225.86,102.82c-3.77-3.94-7.67-8-9.14-11.57-1.36-3.27-1.44-8.69-1.52-13.94-.15-9.76-.31-20.82-8-28.51s-18.75-7.85-28.51-8c-5.25-.08-10.67-.16-13.94-1.52-3.56-1.47-7.63-5.37-11.57-9.14C146.28,23.51,138.44,16,128,16s-18.27,7.51-25.18,14.14c-3.94,3.77-8,7.67-11.57,9.14C88,40.64,82.56,40.72,77.31,40.8c-9.76.15-20.82.31-28.51,8S41,67.55,40.8,77.31c-.08,5.25-.16,10.67-1.52,13.94-1.47,3.56-5.37,7.63-9.14,11.57C23.51,109.72,16,117.56,16,128s7.51,18.27,14.14,25.18c3.77,3.94,7.67,8,9.14,11.57,1.36,3.27,1.44,8.69,1.52,13.94.15,9.76.31,20.82,8,28.51s18.75,7.85,28.51,8c5.25.08,10.67.16,13.94,1.52,3.56,1.47,7.63,5.37,11.57,9.14C109.72,232.49,117.56,240,128,240s18.27-7.51,25.18-14.14c3.94-3.77,8-7.67,11.57-9.14,3.27-1.36,8.69-1.44,13.94-1.52,9.76-.15,20.82-.31,28.51-8s7.85-18.75,8-28.51c.08-5.25.16-10.67,1.52-13.94,1.47-3.56,5.37-7.63,9.14-11.57C232.49,146.28,240,138.44,240,128S232.49,109.73,225.86,102.82Zm-11.55,39.29c-4.79,5-9.75,10.17-12.38,16.52-2.52,6.1-2.63,13.07-2.73,19.82-.1,7-.21,14.33-3.32,17.43s-10.39,3.22-17.43,3.32c-6.75.1-13.72.21-19.82,2.73-6.35,2.63-11.52,7.59-16.52,12.38S132,224,128,224s-9.15-4.92-14.11-9.69-10.17-9.75-16.52-12.38c-6.1-2.52-13.07-2.63-19.82-2.73-7-.1-14.33-.21-17.43-3.32s-3.22-10.39-3.32-17.43c-.1-6.75-.21-13.72-2.73-19.82-2.63-6.35-7.59-11.52-12.38-16.52S32,132,32,128s4.92-9.15,9.69-14.11,9.75-10.17,12.38-16.52c2.52-6.1,2.63-13.07,2.73-19.82.1-7,.21-14.33,3.32-17.43S70.51,56.9,77.55,56.8c6.75-.1,13.72-.21,19.82-2.73,6.35-2.63,11.52-7.59,16.52-12.38S124,32,128,32s9.15,4.92,14.11,9.69,10.17,9.75,16.52,12.38c6.1,2.52,13.07,2.63,19.82,2.73,7,.1,14.33.21,17.43,3.32s3.22,10.39,3.32,17.43c.1,6.75.21,13.72,2.73,19.82,2.63,6.35,7.59,11.52,12.38,16.52S224,124,224,128,219.08,137.15,214.31,142.11ZM173.66,98.34a8,8,0,0,1,0,11.32l-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35A8,8,0,0,1,173.66,98.34Z"
  ],
  "sidebar-simple": [
    "M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40ZM40,56H80V200H40ZM216,200H96V56H216V200Z"
  ],
  "sparkle": [
    "M197.58,129.06,146,110l-19-51.62a15.92,15.92,0,0,0-29.88,0L78,110l-51.62,19a15.92,15.92,0,0,0,0,29.88L78,178l19,51.62a15.92,15.92,0,0,0,29.88,0L146,178l51.62-19a15.92,15.92,0,0,0,0-29.88ZM137,164.22a8,8,0,0,0-4.74,4.74L112,223.85,91.78,169A8,8,0,0,0,87,164.22L32.15,144,87,123.78A8,8,0,0,0,91.78,119L112,64.15,132.22,119a8,8,0,0,0,4.74,4.74L191.85,144ZM144,40a8,8,0,0,1,8-8h16V16a8,8,0,0,1,16,0V32h16a8,8,0,0,1,0,16H184V64a8,8,0,0,1-16,0V48H152A8,8,0,0,1,144,40ZM248,88a8,8,0,0,1-8,8h-8v8a8,8,0,0,1-16,0V96h-8a8,8,0,0,1,0-16h8V72a8,8,0,0,1,16,0v8h8A8,8,0,0,1,248,88Z"
  ],
  "squares-four": [
    "M104,40H56A16,16,0,0,0,40,56v48a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V56A16,16,0,0,0,104,40Zm0,64H56V56h48v48Zm96-64H152a16,16,0,0,0-16,16v48a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V56A16,16,0,0,0,200,40Zm0,64H152V56h48v48Zm-96,32H56a16,16,0,0,0-16,16v48a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V152A16,16,0,0,0,104,136Zm0,64H56V152h48v48Zm96-64H152a16,16,0,0,0-16,16v48a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V152A16,16,0,0,0,200,136Zm0,64H152V152h48v48Z"
  ],
  "star": [
    "M239.18,97.26A16.38,16.38,0,0,0,224.92,86l-59-4.76L143.14,26.15a16.36,16.36,0,0,0-30.27,0L90.11,81.23,31.08,86a16.46,16.46,0,0,0-9.37,28.86l45,38.83L53,211.75a16.38,16.38,0,0,0,24.5,17.82L128,198.49l50.53,31.08A16.4,16.4,0,0,0,203,211.75l-13.76-58.07,45-38.83A16.43,16.43,0,0,0,239.18,97.26Zm-15.34,5.47-48.7,42a8,8,0,0,0-2.56,7.91l14.88,62.8a.37.37,0,0,1-.17.48c-.18.14-.23.11-.38,0l-54.72-33.65a8,8,0,0,0-8.38,0L69.09,215.94c-.15.09-.19.12-.38,0a.37.37,0,0,1-.17-.48l14.88-62.8a8,8,0,0,0-2.56-7.91l-48.7-42c-.12-.1-.23-.19-.13-.5s.18-.27.33-.29l63.92-5.16A8,8,0,0,0,103,91.86l24.62-59.61c.08-.17.11-.25.35-.25s.27.08.35.25L153,91.86a8,8,0,0,0,6.75,4.92l63.92,5.16c.15,0,.24,0,.33.29S224,102.63,223.84,102.73Z"
  ],
  "sun-horizon": [
    "M240,152H199.55a73.54,73.54,0,0,0,.45-8,72,72,0,0,0-144,0,73.54,73.54,0,0,0,.45,8H16a8,8,0,0,0,0,16H240a8,8,0,0,0,0-16ZM72,144a56,56,0,1,1,111.41,8H72.59A56.13,56.13,0,0,1,72,144Zm144,56a8,8,0,0,1-8,8H48a8,8,0,0,1,0-16H208A8,8,0,0,1,216,200ZM72.84,43.58a8,8,0,0,1,14.32-7.16l8,16a8,8,0,0,1-14.32,7.16Zm-56,48.84a8,8,0,0,1,10.74-3.57l16,8a8,8,0,0,1-7.16,14.31l-16-8A8,8,0,0,1,16.84,92.42Zm192,15.16a8,8,0,0,1,3.58-10.73l16-8a8,8,0,1,1,7.16,14.31l-16,8a8,8,0,0,1-10.74-3.58Zm-48-55.16,8-16a8,8,0,0,1,14.32,7.16l-8,16a8,8,0,1,1-14.32-7.16Z"
  ],
  "tag": [
    "M243.31,136,144,36.69A15.86,15.86,0,0,0,132.69,32H40a8,8,0,0,0-8,8v92.69A15.86,15.86,0,0,0,36.69,144L136,243.31a16,16,0,0,0,22.63,0l84.68-84.68a16,16,0,0,0,0-22.63Zm-96,96L48,132.69V48h84.69L232,147.31ZM96,84A12,12,0,1,1,84,72,12,12,0,0,1,96,84Z"
  ],
  "todo-dots": [
    "M98,40a30,30 0 1,0 60,0a30,30 0 1,0 -60,0ZM112,40a16,16 0 1,1 32,0a16,16 0 1,1 -32,0ZM98,128a30,30 0 1,0 60,0a30,30 0 1,0 -60,0ZM112,128a16,16 0 1,1 32,0a16,16 0 1,1 -32,0ZM98,216a30,30 0 1,0 60,0a30,30 0 1,0 -60,0ZM112,216a16,16 0 1,1 32,0a16,16 0 1,1 -32,0Z"
  ],
  "trash": [
    "M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM96,40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96Zm96,168H64V64H192ZM112,104v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Z"
  ],
  "tray": [
    "M208,32H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32Zm0,16V152h-28.7A15.86,15.86,0,0,0,168,156.69L148.69,176H107.31L88,156.69A15.86,15.86,0,0,0,76.69,152H48V48Zm0,160H48V168H76.69L96,187.31A15.86,15.86,0,0,0,107.31,192h41.38A15.86,15.86,0,0,0,160,187.31L179.31,168H208v40Z"
  ],
  "user-focus": [
    "M224,40V76a8,8,0,0,1-16,0V48H180a8,8,0,0,1,0-16h36A8,8,0,0,1,224,40Zm-8,132a8,8,0,0,0-8,8v28H180a8,8,0,0,0,0,16h36a8,8,0,0,0,8-8V180A8,8,0,0,0,216,172ZM76,208H48V180a8,8,0,0,0-16,0v36a8,8,0,0,0,8,8H76a8,8,0,0,0,0-16ZM40,84a8,8,0,0,0,8-8V48H76a8,8,0,0,0,0-16H40a8,8,0,0,0-8,8V76A8,8,0,0,0,40,84Zm136,92a8,8,0,0,1-6.41-3.19,52,52,0,0,0-83.2,0,8,8,0,1,1-12.8-9.62A67.94,67.94,0,0,1,101,141.51a40,40,0,1,1,53.94,0,67.94,67.94,0,0,1,27.43,21.68A8,8,0,0,1,176,176Zm-48-40a24,24,0,1,0-24-24A24,24,0,0,0,128,136Z"
  ],
  "user": [
    "M230.92,212c-15.23-26.33-38.7-45.21-66.09-54.16a72,72,0,1,0-73.66,0C63.78,166.78,40.31,185.66,25.08,212a8,8,0,1,0,13.85,8c18.84-32.56,52.14-52,89.07-52s70.23,19.44,89.07,52a8,8,0,1,0,13.85-8ZM72,96a56,56,0,1,1,56,56A56.06,56.06,0,0,1,72,96Z"
  ],
  "video-camera": [
    "M251.77,73a8,8,0,0,0-8.21.39L208,97.05V72a16,16,0,0,0-16-16H32A16,16,0,0,0,16,72V184a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V159l35.56,23.71A8,8,0,0,0,248,184a8,8,0,0,0,8-8V80A8,8,0,0,0,251.77,73ZM192,184H32V72H192V184Zm48-22.95-32-21.33V116.28L240,95Z"
  ],
  "wrench": [
    "M226.76,69a8,8,0,0,0-12.84-2.88l-40.3,37.19-17.23-3.7-3.7-17.23,37.19-40.3A8,8,0,0,0,187,29.24,72,72,0,0,0,88,96,72.34,72.34,0,0,0,94,124.94L33.79,177c-.15.12-.29.26-.43.39a32,32,0,0,0,45.26,45.26c.13-.13.27-.28.39-.42L131.06,162A72,72,0,0,0,232,96,71.56,71.56,0,0,0,226.76,69ZM160,152a56.14,56.14,0,0,1-27.07-7,8,8,0,0,0-9.92,1.77L67.11,211.51a16,16,0,0,1-22.62-22.62L109.18,133a8,8,0,0,0,1.77-9.93,56,56,0,0,1,58.36-82.31l-31.2,33.81a8,8,0,0,0-1.94,7.1L141.83,108a8,8,0,0,0,6.14,6.14l26.35,5.66a8,8,0,0,0,7.1-1.94l33.81-31.2A56.06,56.06,0,0,1,160,152Z"
  ],
  "x": [
    "M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"
  ],
  "zzz": [
    "M32,136L120,136A8,8,0,0,0,120,120L32,120A8,8,0,0,0,32,136ZM114.34,122.34L26.34,210.34A8,8,0,0,0,37.66,221.66L125.66,133.66A8,8,0,0,0,114.34,122.34ZM32,224L120,224A8,8,0,0,0,120,208L32,208A8,8,0,0,0,32,224ZM136,80L196,80A8,8,0,0,0,196,64L136,64A8,8,0,0,0,136,80ZM190.34,66.34L130.34,126.34A8,8,0,0,0,141.66,137.66L201.66,77.66A8,8,0,0,0,190.34,66.34ZM136,140L196,140A8,8,0,0,0,196,124L136,124A8,8,0,0,0,136,140ZM204,39L236,39A7,7,0,0,0,236,25L204,25A7,7,0,0,0,204,39ZM231.05,27.05L199.05,59.05A7,7,0,0,0,208.95,68.95L240.95,36.95A7,7,0,0,0,231.05,27.05ZM204,71L236,71A7,7,0,0,0,236,57L204,57A7,7,0,0,0,204,71Z"
  ]
};
var FILL = {
  "airplane": [
    "M240,136v32a8,8,0,0,1-8,8,7.61,7.61,0,0,1-1.57-.16L156,161v23.73l17.66,17.65A8,8,0,0,1,176,208v24a8,8,0,0,1-11,7.43l-37-14.81L91,239.43A8,8,0,0,1,80,232V208a8,8,0,0,1,2.34-5.66L100,184.69V161L25.57,175.84A7.61,7.61,0,0,1,24,176a8,8,0,0,1-8-8V136a8,8,0,0,1,4.42-7.16L100,89.06V44a28,28,0,0,1,56,0V89.06l79.58,39.78A8,8,0,0,1,240,136Z"
  ],
  "align-left": [
    "M232,152v40a16,16,0,0,1-16,16H80a16,16,0,0,1-16-16V152a16,16,0,0,1,16-16H216A16,16,0,0,1,232,152ZM40,32a8,8,0,0,0-8,8V216a8,8,0,0,0,16,0V40A8,8,0,0,0,40,32Zm40,88h96a16,16,0,0,0,16-16V64a16,16,0,0,0-16-16H80A16,16,0,0,0,64,64v40A16,16,0,0,0,80,120Z"
  ],
  "archive": [
    "M224,48H32A16,16,0,0,0,16,64V88a16,16,0,0,0,16,16v88a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V104a16,16,0,0,0,16-16V64A16,16,0,0,0,224,48Zm-72,96H104a8,8,0,0,1,0-16h48a8,8,0,0,1,0,16Zm72-56H32V64H224V88Z"
  ],
  "arrow-counter-clockwise": [
    "M224,128a96,96,0,0,1-94.71,96H128A95.38,95.38,0,0,1,62.1,197.8a8,8,0,0,1,11-11.63A80,80,0,1,0,71.43,71.39a3.07,3.07,0,0,1-.26.25L60.63,81.29l17,17A8,8,0,0,1,72,112H24a8,8,0,0,1-8-8V56A8,8,0,0,1,29.66,50.3L49.31,70,60.25,60A96,96,0,0,1,224,128Z"
  ],
  "arrow-down": [
    "M205.66,149.66l-72,72a8,8,0,0,1-11.32,0l-72-72A8,8,0,0,1,56,136h64V40a8,8,0,0,1,16,0v96h64a8,8,0,0,1,5.66,13.66Z"
  ],
  "arrow-square-out": [
    "M192,136v72a16,16,0,0,1-16,16H48a16,16,0,0,1-16-16V80A16,16,0,0,1,48,64h72a8,8,0,0,1,0,16H48V208H176V136a8,8,0,0,1,16,0Zm32-96a8,8,0,0,0-8-8H152a8,8,0,0,0-5.66,13.66L172.69,72l-42.35,42.34a8,8,0,0,0,11.32,11.32L184,83.31l26.34,26.35A8,8,0,0,0,224,104Z"
  ],
  "arrow-up": [
    "M207.39,115.06A8,8,0,0,1,200,120H136v96a8,8,0,0,1-16,0V120H56a8,8,0,0,1-5.66-13.66l72-72a8,8,0,0,1,11.32,0l72,72A8,8,0,0,1,207.39,115.06Z"
  ],
  "arrows-clockwise": [
    "M224,48V96a8,8,0,0,1-8,8H168a8,8,0,0,1-5.66-13.66L180.65,72a79.48,79.48,0,0,0-54.72-22.09h-.45A79.52,79.52,0,0,0,69.59,72.71,8,8,0,0,1,58.41,61.27,96,96,0,0,1,192,60.7l18.36-18.36A8,8,0,0,1,224,48ZM186.41,183.29A80,80,0,0,1,75.35,184l18.31-18.31A8,8,0,0,0,88,152H40a8,8,0,0,0-8,8v48a8,8,0,0,0,13.66,5.66L64,195.3a95.42,95.42,0,0,0,66,26.76h.53a95.36,95.36,0,0,0,67.07-27.33,8,8,0,0,0-11.18-11.44Z"
  ],
  "arrows-down-up": [
    "M119.39,172.94a8,8,0,0,1-1.73,8.72l-32,32a8,8,0,0,1-11.32,0l-32-32A8,8,0,0,1,48,168H72V48a8,8,0,0,1,16,0V168h24A8,8,0,0,1,119.39,172.94Zm94.27-98.6-32-32a8,8,0,0,0-11.32,0l-32,32A8,8,0,0,0,144,88h24V208a8,8,0,0,0,16,0V88h24a8,8,0,0,0,5.66-13.66Z"
  ],
  "arrows-left-right": [
    "M42.34,85.66a8,8,0,0,1,0-11.32l32-32A8,8,0,0,1,88,48V72H208a8,8,0,0,1,0,16H88v24a8,8,0,0,1-13.66,5.66Zm171.32,84.68-32-32A8,8,0,0,0,168,144v24H48a8,8,0,0,0,0,16H168v24a8,8,0,0,0,13.66,5.66l32-32A8,8,0,0,0,213.66,170.34Z"
  ],
  "bell": [
    "M221.8,175.94C216.25,166.38,208,139.33,208,104a80,80,0,1,0-160,0c0,35.34-8.26,62.38-13.81,71.94A16,16,0,0,0,48,200H88.81a40,40,0,0,0,78.38,0H208a16,16,0,0,0,13.8-24.06ZM128,216a24,24,0,0,1-22.62-16h45.24A24,24,0,0,1,128,216Z"
  ],
  "binoculars": [
    "M237.22,151.9l0-.1a1.42,1.42,0,0,0-.07-.22,48.46,48.46,0,0,0-2.31-5.3L193.27,51.8a8,8,0,0,0-1.67-2.44,32,32,0,0,0-45.26,0A8,8,0,0,0,144,55V80H112V55a8,8,0,0,0-2.34-5.66,32,32,0,0,0-45.26,0,8,8,0,0,0-1.67,2.44L21.2,146.28a48.46,48.46,0,0,0-2.31,5.3,1.72,1.72,0,0,0-.07.21s0,.08,0,.11a48,48,0,0,0,90.32,32.51,47.49,47.49,0,0,0,2.9-16.59V96h32v71.83a47.49,47.49,0,0,0,2.9,16.59,48,48,0,0,0,90.32-32.51Zm-143.15,27a32,32,0,0,1-60.2-21.71l1.81-4.13A32,32,0,0,1,96,167.88V168h0A32,32,0,0,1,94.07,178.94ZM203,198.07A32,32,0,0,1,160,168h0v-.11a32,32,0,0,1,60.32-14.78l1.81,4.13A32,32,0,0,1,203,198.07Z"
  ],
  "buildings": [
    "M239.73,208H224V96a16,16,0,0,0-16-16H164a4,4,0,0,0-4,4V208H144V32.41a16.43,16.43,0,0,0-6.16-13,16,16,0,0,0-18.72-.69L39.12,72A16,16,0,0,0,32,85.34V208H16.27A8.18,8.18,0,0,0,8,215.47,8,8,0,0,0,16,224H240a8,8,0,0,0,8-8.53A8.18,8.18,0,0,0,239.73,208ZM76,184a8,8,0,0,1-8.53,8A8.18,8.18,0,0,1,60,183.72V168.27A8.19,8.19,0,0,1,67.47,160,8,8,0,0,1,76,168Zm0-56a8,8,0,0,1-8.53,8A8.19,8.19,0,0,1,60,127.72V112.27A8.19,8.19,0,0,1,67.47,104,8,8,0,0,1,76,112Zm40,56a8,8,0,0,1-8.53,8,8.18,8.18,0,0,1-7.47-8.26V168.27a8.19,8.19,0,0,1,7.47-8.26,8,8,0,0,1,8.53,8Zm0-56a8,8,0,0,1-8.53,8,8.19,8.19,0,0,1-7.47-8.26V112.27a8.19,8.19,0,0,1,7.47-8.26,8,8,0,0,1,8.53,8Z"
  ],
  "calendar-blank": [
    "M208,32H184V24a8,8,0,0,0-16,0v8H88V24a8,8,0,0,0-16,0v8H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32Zm0,48H48V48H72v8a8,8,0,0,0,16,0V48h80v8a8,8,0,0,0,16,0V48h24Z"
  ],
  "caret-down": [
    "M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,48,88H208a8,8,0,0,1,5.66,13.66Z"
  ],
  "caret-left": [
    "M168,48V208a8,8,0,0,1-13.66,5.66l-80-80a8,8,0,0,1,0-11.32l80-80A8,8,0,0,1,168,48Z"
  ],
  "caret-right": [
    "M181.66,133.66l-80,80A8,8,0,0,1,88,208V48a8,8,0,0,1,13.66-5.66l80,80A8,8,0,0,1,181.66,133.66Z"
  ],
  "caret-up": [
    "M215.39,163.06A8,8,0,0,1,208,168H48a8,8,0,0,1-5.66-13.66l80-80a8,8,0,0,1,11.32,0l80,80A8,8,0,0,1,215.39,163.06Z"
  ],
  "chart-bar-horizontal": [
    "M232,112v32a8,8,0,0,1-8,8H56v16h88a8,8,0,0,1,8,8v24a8,8,0,0,1-8,8H56v8a8,8,0,0,1-16,0V40a8,8,0,0,1,16,0v8H176a8,8,0,0,1,8,8V80a8,8,0,0,1-8,8H56v16H224A8,8,0,0,1,232,112Z"
  ],
  "chart-line": [
    "M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40ZM200,176a8,8,0,0,1,0,16H56a8,8,0,0,1-8-8V72a8,8,0,0,1,16,0v62.92l34.88-29.07a8,8,0,0,1,9.56-.51l43,28.69,43.41-36.18a8,8,0,0,1,10.24,12.3l-48,40a8,8,0,0,1-9.56.51l-43-28.69L64,155.75V176Z"
  ],
  "check": [
    "M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40ZM205.66,85.66l-96,96a8,8,0,0,1-11.32,0l-40-40a8,8,0,0,1,11.32-11.32L104,164.69l90.34-90.35a8,8,0,0,1,11.32,11.32Z"
  ],
  "circle": [
    "M232,128A104,104,0,1,1,128,24,104.13,104.13,0,0,1,232,128Z"
  ],
  "clipboard-text": [
    "M200,32H163.74a47.92,47.92,0,0,0-71.48,0H56A16,16,0,0,0,40,48V216a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V48A16,16,0,0,0,200,32Zm-72,0a32,32,0,0,1,32,32H96A32,32,0,0,1,128,32Zm32,128H96a8,8,0,0,1,0-16h64a8,8,0,0,1,0,16Zm0-32H96a8,8,0,0,1,0-16h64a8,8,0,0,1,0,16Z"
  ],
  "clock-afternoon": [
    "M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm56,112H147.31l26.35,26.34a8,8,0,0,1-11.32,11.32l-40-40A8,8,0,0,1,128,120h56a8,8,0,0,1,0,16Z"
  ],
  "clock": [
    "M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm56,112H128a8,8,0,0,1-8-8V72a8,8,0,0,1,16,0v48h48a8,8,0,0,1,0,16Z"
  ],
  "cloud-arrow-up": [
    "M247.93,124.52C246.11,77.54,207.07,40,160.06,40A88.1,88.1,0,0,0,81.29,88.67h0A87.48,87.48,0,0,0,72,127.73,8.18,8.18,0,0,1,64.57,136,8,8,0,0,1,56,128a103.66,103.66,0,0,1,5.34-32.92,4,4,0,0,0-4.75-5.18A64.09,64.09,0,0,0,8,152c0,35.19,29.75,64,65,64H160A88.09,88.09,0,0,0,247.93,124.52Zm-50.27,9.14a8,8,0,0,1-11.32,0L168,115.31V176a8,8,0,0,1-16,0V115.31l-18.34,18.35a8,8,0,0,1-11.32-11.32l32-32a8,8,0,0,1,11.32,0l32,32A8,8,0,0,1,197.66,133.66Z"
  ],
  "copy-simple": [
    "M192,72V216a8,8,0,0,1-8,8H40a8,8,0,0,1-8-8V72a8,8,0,0,1,8-8H184A8,8,0,0,1,192,72Zm24-40H72a8,8,0,0,0,0,16H208V184a8,8,0,0,0,16,0V40A8,8,0,0,0,216,32Z"
  ],
  "copy": [
    "M216,32H88a8,8,0,0,0-8,8V80H40a8,8,0,0,0-8,8V216a8,8,0,0,0,8,8H168a8,8,0,0,0,8-8V176h40a8,8,0,0,0,8-8V40A8,8,0,0,0,216,32Zm-8,128H176V88a8,8,0,0,0-8-8H96V48H208Z"
  ],
  "cube": [
    "M223.68,66.15,135.68,18a15.88,15.88,0,0,0-15.36,0l-88,48.17a16,16,0,0,0-8.32,14v95.64a16,16,0,0,0,8.32,14l88,48.17a15.88,15.88,0,0,0,15.36,0l88-48.17a16,16,0,0,0,8.32-14V80.18A16,16,0,0,0,223.68,66.15ZM128,120,47.65,76,128,32l80.35,44Zm8,99.64V133.83l80-43.78v85.76Z"
  ],
  "device-mobile": [
    "M176,16H80A24,24,0,0,0,56,40V216a24,24,0,0,0,24,24h96a24,24,0,0,0,24-24V40A24,24,0,0,0,176,16ZM80,32h96a8,8,0,0,1,8,8v8H72V40A8,8,0,0,1,80,32Zm96,192H80a8,8,0,0,1-8-8v-8H184v8A8,8,0,0,1,176,224Z"
  ],
  "diamond": [
    "M240,128a15.85,15.85,0,0,1-4.67,11.28l-96.05,96.06a16,16,0,0,1-22.56,0h0l-96-96.06a16,16,0,0,1,0-22.56l96.05-96.06a16,16,0,0,1,22.56,0l96.05,96.06A15.85,15.85,0,0,1,240,128Z"
  ],
  "dot": [
    "M128,80a48,48,0,1,0,48,48A48,48,0,0,0,128,80Zm0,60a12,12,0,1,1,12-12A12,12,0,0,1,128,140Z"
  ],
  "dots-six-vertical": [
    "M192,16H64A16,16,0,0,0,48,32V224a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V32A16,16,0,0,0,192,16ZM100,200a12,12,0,1,1,12-12A12,12,0,0,1,100,200Zm0-60a12,12,0,1,1,12-12A12,12,0,0,1,100,140Zm0-60a12,12,0,1,1,12-12A12,12,0,0,1,100,80Zm56,120a12,12,0,1,1,12-12A12,12,0,0,1,156,200Zm0-60a12,12,0,1,1,12-12A12,12,0,0,1,156,140Zm0-60a12,12,0,1,1,12-12A12,12,0,0,1,156,80Z"
  ],
  "dots-three": [
    "M224,80H32A16,16,0,0,0,16,96v64a16,16,0,0,0,16,16H224a16,16,0,0,0,16-16V96A16,16,0,0,0,224,80ZM60,140a12,12,0,1,1,12-12A12,12,0,0,1,60,140Zm68,0a12,12,0,1,1,12-12A12,12,0,0,1,128,140Zm68,0a12,12,0,1,1,12-12A12,12,0,0,1,196,140Z"
  ],
  "eye": [
    "M247.31,124.76c-.35-.79-8.82-19.58-27.65-38.41C194.57,61.26,162.88,48,128,48S61.43,61.26,36.34,86.35C17.51,105.18,9,124,8.69,124.76a8,8,0,0,0,0,6.5c.35.79,8.82,19.57,27.65,38.4C61.43,194.74,93.12,208,128,208s66.57-13.26,91.66-38.34c18.83-18.83,27.3-37.61,27.65-38.4A8,8,0,0,0,247.31,124.76ZM128,168a40,40,0,1,1,40-40A40,40,0,0,1,128,168Z"
  ],
  "fire": [
    "M143.38,17.85a8,8,0,0,0-12.63,3.41l-22,60.41L84.59,58.26a8,8,0,0,0-11.93.89C51,87.53,40,116.08,40,144a88,88,0,0,0,176,0C216,84.55,165.21,36,143.38,17.85Zm40.51,135.49a57.6,57.6,0,0,1-46.56,46.55A7.65,7.65,0,0,1,136,200a8,8,0,0,1-1.32-15.89c16.57-2.79,30.63-16.85,33.44-33.45a8,8,0,0,1,15.78,2.68Z"
  ],
  "flag": [
    "M232,56V176a8,8,0,0,1-2.76,6c-15.28,13.23-29.89,18-43.82,18-18.91,0-36.57-8.74-53-16.85C105.87,170,82.79,158.61,56,179.77V224a8,8,0,0,1-16,0V56a8,8,0,0,1,2.77-6h0c36-31.18,68.31-15.21,96.79-1.12C167,62.46,190.79,74.2,218.76,50A8,8,0,0,1,232,56Z"
  ],
  "floppy-disk": [
    "M219.31,72,184,36.69A15.86,15.86,0,0,0,172.69,32H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V83.31A15.86,15.86,0,0,0,219.31,72ZM208,208H184V152a16,16,0,0,0-16-16H88a16,16,0,0,0-16,16v56H48V48H172.69L208,83.31ZM160,72a8,8,0,0,1-8,8H96a8,8,0,0,1,0-16h56A8,8,0,0,1,160,72Z"
  ],
  "funnel": [
    "M227.81,66.76l-.08.09L160,139.17v55.49A16,16,0,0,1,152.87,208l-32,21.34A16,16,0,0,1,96,216V139.17L28.27,66.85l-.08-.09A16,16,0,0,1,40,40H216a16,16,0,0,1,11.84,26.76Z"
  ],
  "gear": [
    "M216,130.16q.06-2.16,0-4.32l14.92-18.64a8,8,0,0,0,1.48-7.06,107.6,107.6,0,0,0-10.88-26.25,8,8,0,0,0-6-3.93l-23.72-2.64q-1.48-1.56-3-3L186,40.54a8,8,0,0,0-3.94-6,107.29,107.29,0,0,0-26.25-10.86,8,8,0,0,0-7.06,1.48L130.16,40Q128,40,125.84,40L107.2,25.11a8,8,0,0,0-7.06-1.48A107.6,107.6,0,0,0,73.89,34.51a8,8,0,0,0-3.93,6L67.32,64.27q-1.56,1.49-3,3L40.54,70a8,8,0,0,0-6,3.94,107.71,107.71,0,0,0-10.87,26.25,8,8,0,0,0,1.49,7.06L40,125.84Q40,128,40,130.16L25.11,148.8a8,8,0,0,0-1.48,7.06,107.6,107.6,0,0,0,10.88,26.25,8,8,0,0,0,6,3.93l23.72,2.64q1.49,1.56,3,3L70,215.46a8,8,0,0,0,3.94,6,107.71,107.71,0,0,0,26.25,10.87,8,8,0,0,0,7.06-1.49L125.84,216q2.16.06,4.32,0l18.64,14.92a8,8,0,0,0,7.06,1.48,107.21,107.21,0,0,0,26.25-10.88,8,8,0,0,0,3.93-6l2.64-23.72q1.56-1.48,3-3L215.46,186a8,8,0,0,0,6-3.94,107.71,107.71,0,0,0,10.87-26.25,8,8,0,0,0-1.49-7.06ZM128,168a40,40,0,1,1,40-40A40,40,0,0,1,128,168Z"
  ],
  "handshake": [
    "M254.3,107.91,228.78,56.85a16,16,0,0,0-21.47-7.15L182.44,62.13,130.05,48.27a8.14,8.14,0,0,0-4.1,0L73.56,62.13,48.69,49.7a16,16,0,0,0-21.47,7.15L1.7,107.9a16,16,0,0,0,7.15,21.47l27,13.51,55.49,39.63a8.06,8.06,0,0,0,2.71,1.25l64,16a8,8,0,0,0,7.6-2.1l40-40,15.08-15.08,26.42-13.21a16,16,0,0,0,7.15-21.46Zm-54.89,33.37L165,113.72a8,8,0,0,0-10.68.61C136.51,132.27,116.66,130,104,122L147.24,80h31.81l27.21,54.41Zm-41.87,41.86L99.42,168.61l-49.2-35.14,28-56L128,64.28l9.8,2.59-45,43.68-.08.09a16,16,0,0,0,2.72,24.81c20.56,13.13,45.37,11,64.91-5L188,152.66Zm-25.72,34.8a8,8,0,0,1-7.75,6.06,8.13,8.13,0,0,1-1.95-.24L80.41,213.33a7.89,7.89,0,0,1-2.71-1.25L51.35,193.26a8,8,0,0,1,9.3-13l25.11,17.94L126,208.24A8,8,0,0,1,131.82,217.94Z"
  ],
  "hash": [
    "M116.25,112h31.5l-8,32h-31.5ZM224,48V208a16,16,0,0,1-16,16H48a16,16,0,0,1-16-16V48A16,16,0,0,1,48,32H208A16,16,0,0,1,224,48Zm-16,56a8,8,0,0,0-8-8H168.25l7.51-30.06a8,8,0,0,0-15.52-3.88L151.75,96h-31.5l7.51-30.06a8,8,0,0,0-15.52-3.88L103.75,96H64a8,8,0,0,0,0,16H99.75l-8,32H56a8,8,0,0,0,0,16H87.75l-7.51,30.06a8,8,0,0,0,5.82,9.7,8.13,8.13,0,0,0,2,.24,8,8,0,0,0,7.75-6.06L104.25,160h31.5l-7.51,30.06a8,8,0,0,0,5.82,9.7A8.13,8.13,0,0,0,136,200a8,8,0,0,0,7.75-6.06L152.25,160H192a8,8,0,0,0,0-16H156.25l8-32H200A8,8,0,0,0,208,104Z"
  ],
  "info": [
    "M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm-4,48a12,12,0,1,1-12,12A12,12,0,0,1,124,72Zm12,112a16,16,0,0,1-16-16V128a8,8,0,0,1,0-16,16,16,0,0,1,16,16v40a8,8,0,0,1,0,16Z"
  ],
  "kanban": [
    "M160,56v96a8,8,0,0,1-8,8H112a8,8,0,0,1-8-8V56a8,8,0,0,1,8-8h40A8,8,0,0,1,160,56Zm64-8H184a8,8,0,0,0-8,8v52a4,4,0,0,0,4,4h48a4,4,0,0,0,4-4V56A8,8,0,0,0,224,48Zm4,80H180a4,4,0,0,0-4,4v44a16,16,0,0,0,16,16h24a16,16,0,0,0,16-16V132A4,4,0,0,0,228,128ZM80,48H40a8,8,0,0,0-8,8v52a4,4,0,0,0,4,4H84a4,4,0,0,0,4-4V56A8,8,0,0,0,80,48Zm4,80H36a4,4,0,0,0-4,4v76a16,16,0,0,0,16,16H72a16,16,0,0,0,16-16V132A4,4,0,0,0,84,128Z"
  ],
  "layout": [
    "M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40ZM40,56H216V96H40ZM216,200H112V112H216v88Z"
  ],
  "lightbulb-filament": [
    "M176,232a8,8,0,0,1-8,8H88a8,8,0,0,1,0-16h80A8,8,0,0,1,176,232Zm40-128a87.55,87.55,0,0,1-33.64,69.21A16.24,16.24,0,0,0,176,186v6a16,16,0,0,1-16,16H96a16,16,0,0,1-16-16v-6a16,16,0,0,0-6.23-12.66A87.59,87.59,0,0,1,40,104.49C39.74,56.83,78.26,17.14,125.88,16A88,88,0,0,1,216,104Zm-50.34,2.34a8,8,0,0,0-11.32,0L128,132.69l-26.34-26.35a8,8,0,0,0-11.32,11.32L120,147.31V184a8,8,0,0,0,16,0V147.31l29.66-29.65A8,8,0,0,0,165.66,106.34Z"
  ],
  "lightning": [
    "M213.85,125.46l-112,120a8,8,0,0,1-13.69-7l14.66-73.33L45.19,143.49a8,8,0,0,1-3-13l112-120a8,8,0,0,1,13.69,7L153.18,90.9l57.63,21.61a8,8,0,0,1,3,12.95Z"
  ],
  "list-checks": [
    "M208,32H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM117.66,149.66l-32,32a8,8,0,0,1-11.32,0l-16-16a8,8,0,0,1,11.32-11.32L80,164.69l26.34-26.35a8,8,0,0,1,11.32,11.32Zm0-64-32,32a8,8,0,0,1-11.32,0l-16-16A8,8,0,0,1,69.66,90.34L80,100.69l26.34-26.35a8,8,0,0,1,11.32,11.32ZM192,168H144a8,8,0,0,1,0-16h48a8,8,0,0,1,0,16Zm0-64H144a8,8,0,0,1,0-16h48a8,8,0,0,1,0,16Z"
  ],
  "list": [
    "M208,32H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM192,184H64a8,8,0,0,1,0-16H192a8,8,0,0,1,0,16Zm0-48H64a8,8,0,0,1,0-16H192a8,8,0,0,1,0,16Zm0-48H64a8,8,0,0,1,0-16H192a8,8,0,0,1,0,16Z"
  ],
  "lock-open": [
    "M208,80H96V56a32,32,0,0,1,32-32c15.37,0,29.2,11,32.16,25.59a8,8,0,0,0,15.68-3.18C171.32,24.15,151.2,8,128,8A48.05,48.05,0,0,0,80,56V80H48A16,16,0,0,0,32,96V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V96A16,16,0,0,0,208,80Zm-80,84a12,12,0,1,1,12-12A12,12,0,0,1,128,164Z"
  ],
  "lock": [
    "M208,80H176V56a48,48,0,0,0-96,0V80H48A16,16,0,0,0,32,96V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V96A16,16,0,0,0,208,80Zm-80,84a12,12,0,1,1,12-12A12,12,0,0,1,128,164Zm32-84H96V56a32,32,0,0,1,64,0Z"
  ],
  "magnifying-glass": [
    "M168,112a56,56,0,1,1-56-56A56,56,0,0,1,168,112Zm61.66,117.66a8,8,0,0,1-11.32,0l-50.06-50.07a88,88,0,1,1,11.32-11.31l50.06,50.06A8,8,0,0,1,229.66,229.66ZM112,184a72,72,0,1,0-72-72A72.08,72.08,0,0,0,112,184Z"
  ],
  "megaphone": [
    "M200,72H160.2c-2.91-.17-53.62-3.74-101.91-44.24A16,16,0,0,0,32,40V200a16,16,0,0,0,26.29,12.25c37.77-31.68,77-40.76,93.71-43.3v31.72A16,16,0,0,0,159.12,214l11,7.33A16,16,0,0,0,194.5,212l11.77-44.36A48,48,0,0,0,200,72ZM179,207.89l0,.11-11-7.33V168h21.6ZM200,152H168V88h32a32,32,0,1,1,0,64Z"
  ],
  "minus": [
    "M208,32H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM184,136H72a8,8,0,0,1,0-16H184a8,8,0,0,1,0,16Z"
  ],
  "monitor-play": [
    "M168,224a8,8,0,0,1-8,8H96a8,8,0,0,1,0-16h64A8,8,0,0,1,168,224ZM232,64V176a24,24,0,0,1-24,24H48a24,24,0,0,1-24-24V64A24,24,0,0,1,48,40H208A24,24,0,0,1,232,64Zm-68,56a8,8,0,0,0-3.41-6.55l-40-28A8,8,0,0,0,108,92v56a8,8,0,0,0,12.59,6.55l40-28A8,8,0,0,0,164,120Z"
  ],
  "monitor": [
    "M232,64V176a24,24,0,0,1-24,24H48a24,24,0,0,1-24-24V64A24,24,0,0,1,48,40H208A24,24,0,0,1,232,64ZM160,216H96a8,8,0,0,0,0,16h64a8,8,0,0,0,0-16Z"
  ],
  "moon": [
    "M235.54,150.21a104.84,104.84,0,0,1-37,52.91A104,104,0,0,1,32,120,103.09,103.09,0,0,1,52.88,57.48a104.84,104.84,0,0,1,52.91-37,8,8,0,0,1,10,10,88.08,88.08,0,0,0,109.8,109.8,8,8,0,0,1,10,10Z"
  ],
  "music-notes": [
    "M212.92,17.71a7.89,7.89,0,0,0-6.86-1.46l-128,32A8,8,0,0,0,72,56V166.1A36,36,0,1,0,88,196V102.25l112-28V134.1A36,36,0,1,0,216,164V24A8,8,0,0,0,212.92,17.71Z"
  ],
  "note": [
    "M208,32H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H156.69A15.92,15.92,0,0,0,168,219.31L219.31,168A15.92,15.92,0,0,0,224,156.69V48A16,16,0,0,0,208,32ZM96,88h64a8,8,0,0,1,0,16H96a8,8,0,0,1,0-16Zm32,80H96a8,8,0,0,1,0-16h32a8,8,0,0,1,0,16ZM96,136a8,8,0,0,1,0-16h64a8,8,0,0,1,0,16Zm64,68.69V160h44.7Z"
  ],
  "notebook": [
    "M208,32H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM80,208H48V48H80Zm96-56H112a8,8,0,0,1,0-16h64a8,8,0,0,1,0,16Zm0-32H112a8,8,0,0,1,0-16h64a8,8,0,0,1,0,16Z"
  ],
  "package": [
    "M223.68,66.15,135.68,18a15.88,15.88,0,0,0-15.36,0l-88,48.17a16,16,0,0,0-8.32,14v95.64a16,16,0,0,0,8.32,14l88,48.17a15.88,15.88,0,0,0,15.36,0l88-48.17a16,16,0,0,0,8.32-14V80.18A16,16,0,0,0,223.68,66.15ZM128,32l80.35,44L178.57,92.29l-80.35-44Zm0,88L47.65,76,81.56,57.43l80.35,44Zm88,55.85h0l-80,43.79V133.83l32-17.51V152a8,8,0,0,0,16,0V107.56l32-17.51v85.76Z"
  ],
  "paint-brush": [
    "M232,32a8,8,0,0,0-8-8c-44.08,0-89.31,49.71-114.43,82.63A60,60,0,0,0,32,164c0,30.88-19.54,44.73-20.47,45.37A8,8,0,0,0,16,224H92a60,60,0,0,0,57.37-77.57C182.3,121.31,232,76.08,232,32ZM124.42,113.55q5.14-6.66,10.09-12.55A76.23,76.23,0,0,1,155,121.49q-5.9,4.94-12.55,10.09A60.54,60.54,0,0,0,124.42,113.55Zm42.7-2.68a92.57,92.57,0,0,0-22-22c31.78-34.53,55.75-45,69.9-47.91C212.17,55.12,201.65,79.09,167.12,110.87Z"
  ],
  "paper-plane-tilt": [
    "M231.4,44.34s0,.1,0,.15l-58.2,191.94a15.88,15.88,0,0,1-14,11.51q-.69.06-1.38.06a15.86,15.86,0,0,1-14.42-9.15L107,164.15a4,4,0,0,1,.77-4.58l57.92-57.92a8,8,0,0,0-11.31-11.31L96.43,148.26a4,4,0,0,1-4.58.77L17.08,112.64a16,16,0,0,1,2.49-29.8l191.94-58.2.15,0A16,16,0,0,1,231.4,44.34Z"
  ],
  "path": [
    "M228,200a28,28,0,0,1-54.83,8H72a48,48,0,0,1,0-96h96a24,24,0,0,0,0-48H72a8,8,0,0,1,0-16h96a40,40,0,0,1,0,80H72a32,32,0,0,0,0,64H173.17A28,28,0,0,1,228,200Z"
  ],
  "pencil-simple": [
    "M227.31,73.37,182.63,28.68a16,16,0,0,0-22.63,0L36.69,152A15.86,15.86,0,0,0,32,163.31V208a16,16,0,0,0,16,16H92.69A15.86,15.86,0,0,0,104,219.31L227.31,96a16,16,0,0,0,0-22.63ZM192,108.68,147.31,64l24-24L216,84.68Z"
  ],
  "plus": [
    "M208,32H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM184,136H136v48a8,8,0,0,1-16,0V136H72a8,8,0,0,1,0-16h48V72a8,8,0,0,1,16,0v48h48a8,8,0,0,1,0,16Z"
  ],
  "printer": [
    "M240,96v80a8,8,0,0,1-8,8H200v32a8,8,0,0,1-8,8H64a8,8,0,0,1-8-8V184H24a8,8,0,0,1-8-8V96c0-13.23,11.36-24,25.33-24H56V40a8,8,0,0,1,8-8H192a8,8,0,0,1,8,8V72h14.67C228.64,72,240,82.77,240,96ZM72,72H184V48H72Zm112,88H72v48H184Zm16-44a12,12,0,1,0-12,12A12,12,0,0,0,200,116Z"
  ],
  "push-pin": [
    "M235.33,104l-53.47,53.65c4.56,12.67,6.45,33.89-13.19,60A15.93,15.93,0,0,1,157,224c-.38,0-.75,0-1.13,0a16,16,0,0,1-11.32-4.69L96.29,171,53.66,213.66a8,8,0,0,1-11.32-11.32L85,159.71l-48.3-48.3A16,16,0,0,1,38,87.63c25.42-20.51,49.75-16.48,60.4-13.14L152,20.7a16,16,0,0,1,22.63,0l60.69,60.68A16,16,0,0,1,235.33,104Z"
  ],
  "question": [
    "M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,168a12,12,0,1,1,12-12A12,12,0,0,1,128,192Zm8-48.72V144a8,8,0,0,1-16,0v-8a8,8,0,0,1,8-8c13.23,0,24-9,24-20s-10.77-20-24-20-24,9-24,20v4a8,8,0,0,1-16,0v-4c0-19.85,17.94-36,40-36s40,16.15,40,36C168,125.38,154.24,139.93,136,143.28Z"
  ],
  "rectangle": [
    "M232,56V200a16,16,0,0,1-16,16H40a16,16,0,0,1-16-16V56A16,16,0,0,1,40,40H216A16,16,0,0,1,232,56Z"
  ],
  "repeat": [
    "M24,128A72.08,72.08,0,0,1,96,56h96V40a8,8,0,0,1,13.66-5.66l24,24a8,8,0,0,1,0,11.32l-24,24A8,8,0,0,1,192,88V72H96a56.06,56.06,0,0,0-56,56,8,8,0,0,1-16,0Zm200-8a8,8,0,0,0-8,8,56.06,56.06,0,0,1-56,56H64V168a8,8,0,0,0-13.66-5.66l-24,24a8,8,0,0,0,0,11.32l24,24A8,8,0,0,0,64,216V200h96a72.08,72.08,0,0,0,72-72A8,8,0,0,0,224,120Z"
  ],
  "seal-check": [
    "M225.86,102.82c-3.77-3.94-7.67-8-9.14-11.57-1.36-3.27-1.44-8.69-1.52-13.94-.15-9.76-.31-20.82-8-28.51s-18.75-7.85-28.51-8c-5.25-.08-10.67-.16-13.94-1.52-3.56-1.47-7.63-5.37-11.57-9.14C146.28,23.51,138.44,16,128,16s-18.27,7.51-25.18,14.14c-3.94,3.77-8,7.67-11.57,9.14C88,40.64,82.56,40.72,77.31,40.8c-9.76.15-20.82.31-28.51,8S41,67.55,40.8,77.31c-.08,5.25-.16,10.67-1.52,13.94-1.47,3.56-5.37,7.63-9.14,11.57C23.51,109.72,16,117.56,16,128s7.51,18.27,14.14,25.18c3.77,3.94,7.67,8,9.14,11.57,1.36,3.27,1.44,8.69,1.52,13.94.15,9.76.31,20.82,8,28.51s18.75,7.85,28.51,8c5.25.08,10.67.16,13.94,1.52,3.56,1.47,7.63,5.37,11.57,9.14C109.72,232.49,117.56,240,128,240s18.27-7.51,25.18-14.14c3.94-3.77,8-7.67,11.57-9.14,3.27-1.36,8.69-1.44,13.94-1.52,9.76-.15,20.82-.31,28.51-8s7.85-18.75,8-28.51c.08-5.25.16-10.67,1.52-13.94,1.47-3.56,5.37-7.63,9.14-11.57C232.49,146.28,240,138.44,240,128S232.49,109.73,225.86,102.82Zm-52.2,6.84-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35a8,8,0,0,1,11.32,11.32Z"
  ],
  "sidebar-simple": [
    "M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40Zm0,160H88V56H216V200Z"
  ],
  "sparkle": [
    "M208,144a15.78,15.78,0,0,1-10.42,14.94L146,178l-19,51.62a15.92,15.92,0,0,1-29.88,0L78,178l-51.62-19a15.92,15.92,0,0,1,0-29.88L78,110l19-51.62a15.92,15.92,0,0,1,29.88,0L146,110l51.62,19A15.78,15.78,0,0,1,208,144ZM152,48h16V64a8,8,0,0,0,16,0V48h16a8,8,0,0,0,0-16H184V16a8,8,0,0,0-16,0V32H152a8,8,0,0,0,0,16Zm88,32h-8V72a8,8,0,0,0-16,0v8h-8a8,8,0,0,0,0,16h8v8a8,8,0,0,0,16,0V96h8a8,8,0,0,0,0-16Z"
  ],
  "squares-four": [
    "M120,56v48a16,16,0,0,1-16,16H56a16,16,0,0,1-16-16V56A16,16,0,0,1,56,40h48A16,16,0,0,1,120,56Zm80-16H152a16,16,0,0,0-16,16v48a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V56A16,16,0,0,0,200,40Zm-96,96H56a16,16,0,0,0-16,16v48a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V152A16,16,0,0,0,104,136Zm96,0H152a16,16,0,0,0-16,16v48a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V152A16,16,0,0,0,200,136Z"
  ],
  "star": [
    "M234.29,114.85l-45,38.83L203,211.75a16.4,16.4,0,0,1-24.5,17.82L128,198.49,77.47,229.57A16.4,16.4,0,0,1,53,211.75l13.76-58.07-45-38.83A16.46,16.46,0,0,1,31.08,86l59-4.76,22.76-55.08a16.36,16.36,0,0,1,30.27,0l22.75,55.08,59,4.76a16.46,16.46,0,0,1,9.37,28.86Z"
  ],
  "sun-horizon": [
    "M248,160a8,8,0,0,1-8,8H16a8,8,0,0,1,0-16H56.45a73.54,73.54,0,0,1-.45-8,72,72,0,0,1,144,0,73.54,73.54,0,0,1-.45,8H240A8,8,0,0,1,248,160Zm-40,32H48a8,8,0,0,0,0,16H208a8,8,0,0,0,0-16ZM80.84,59.58a8,8,0,0,0,14.32-7.16l-8-16a8,8,0,0,0-14.32,7.16ZM20.42,103.16l16,8a8,8,0,1,0,7.16-14.31l-16-8a8,8,0,1,0-7.16,14.31ZM216,112a8,8,0,0,0,3.57-.84l16-8a8,8,0,1,0-7.16-14.31l-16,8A8,8,0,0,0,216,112ZM164.42,63.16a8,8,0,0,0,10.74-3.58l8-16a8,8,0,0,0-14.32-7.16l-8,16A8,8,0,0,0,164.42,63.16Z"
  ],
  "tag": [
    "M243.31,136,144,36.69A15.86,15.86,0,0,0,132.69,32H40a8,8,0,0,0-8,8v92.69A15.86,15.86,0,0,0,36.69,144L136,243.31a16,16,0,0,0,22.63,0l84.68-84.68a16,16,0,0,0,0-22.63ZM84,96A12,12,0,1,1,96,84,12,12,0,0,1,84,96Z"
  ],
  "todo-dots": [
    "M98,40a30,30 0 1,0 60,0a30,30 0 1,0 -60,0ZM98,128a30,30 0 1,0 60,0a30,30 0 1,0 -60,0ZM98,216a30,30 0 1,0 60,0a30,30 0 1,0 -60,0Z"
  ],
  "trash": [
    "M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM112,168a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm0-120H96V40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8Z"
  ],
  "tray": [
    "M208,32H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32Zm0,176H48V168H76.69L96,187.32A15.89,15.89,0,0,0,107.31,192h41.38A15.86,15.86,0,0,0,160,187.31L179.31,168H208v40Z"
  ],
  "user-focus": [
    "M224,40V76a8,8,0,0,1-16,0V48H180a8,8,0,0,1,0-16h36A8,8,0,0,1,224,40Zm-8,132a8,8,0,0,0-8,8v28H180a8,8,0,0,0,0,16h36a8,8,0,0,0,8-8V180A8,8,0,0,0,216,172ZM76,208H48V180a8,8,0,0,0-16,0v36a8,8,0,0,0,8,8H76a8,8,0,0,0,0-16ZM40,84a8,8,0,0,0,8-8V48H76a8,8,0,0,0,0-16H40a8,8,0,0,0-8,8V76A8,8,0,0,0,40,84Zm61,57.51A67.94,67.94,0,0,0,73.6,163.19,8,8,0,0,0,80,176h96a8,8,0,0,0,6.4-12.81A67.94,67.94,0,0,0,155,141.51a40,40,0,1,0-53.94,0Z"
  ],
  "user": [
    "M230.93,220a8,8,0,0,1-6.93,4H32a8,8,0,0,1-6.92-12c15.23-26.33,38.7-45.21,66.09-54.16a72,72,0,1,1,73.66,0c27.39,8.95,50.86,27.83,66.09,54.16A8,8,0,0,1,230.93,220Z"
  ],
  "video-camera": [
    "M192,72V184a16,16,0,0,1-16,16H32a16,16,0,0,1-16-16V72A16,16,0,0,1,32,56H176A16,16,0,0,1,192,72Zm58,.25a8.23,8.23,0,0,0-6.63,1.22L209.78,95.86A4,4,0,0,0,208,99.19v57.62a4,4,0,0,0,1.78,3.33l33.78,22.52a8,8,0,0,0,8.58.19,8.33,8.33,0,0,0,3.86-7.17V80A8,8,0,0,0,250,72.25Z"
  ],
  "wrench": [
    "M232,96a72,72,0,0,1-100.94,66L79,222.22c-.12.14-.26.29-.39.42a32,32,0,0,1-45.26-45.26c.14-.13.28-.27.43-.39L94,124.94a72.07,72.07,0,0,1,83.54-98.78,8,8,0,0,1,3.93,13.19L144,80l5.66,26.35L176,112l40.65-37.52a8,8,0,0,1,13.19,3.93A72.6,72.6,0,0,1,232,96Z"
  ],
  "x": [
    "M208,32H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM181.66,170.34a8,8,0,0,1-11.32,11.32L128,139.31,85.66,181.66a8,8,0,0,1-11.32-11.32L116.69,128,74.34,85.66A8,8,0,0,1,85.66,74.34L128,116.69l42.34-42.35a8,8,0,0,1,11.32,11.32L139.31,128Z"
  ]
};
var LIGHT = {
  "airplane": [
    "M234.68,130.63,158,92.29V48a30,30,0,0,0-60,0V92.29L21.32,130.63A6,6,0,0,0,18,136v32a6,6,0,0,0,7.18,5.88L98,159.32v22.19L83.76,195.76A6,6,0,0,0,82,200v32a6,6,0,0,0,8.23,5.57L128,222.46l37.77,15.11A6,6,0,0,0,174,232V200a6,6,0,0,0-1.76-4.24L158,181.51V159.32l72.82,14.56A6,6,0,0,0,238,168V136A6,6,0,0,0,234.68,130.63ZM226,160.68l-72.82-14.56A6,6,0,0,0,146,152v32a6,6,0,0,0,1.76,4.24L162,202.49v20.65l-31.77-12.71a6,6,0,0,0-4.46,0L94,223.14V202.49l14.24-14.25A6,6,0,0,0,110,184V152a6,6,0,0,0-7.18-5.88L30,160.68v-21l76.68-38.34A6,6,0,0,0,110,96V48a18,18,0,0,1,36,0V96a6,6,0,0,0,3.32,5.37L226,139.71Z"
  ],
  "align-left": [
    "M46,40V216a6,6,0,0,1-12,0V40a6,6,0,0,1,12,0Zm20,64V64A14,14,0,0,1,80,50h96a14,14,0,0,1,14,14v40a14,14,0,0,1-14,14H80A14,14,0,0,1,66,104Zm12,0a2,2,0,0,0,2,2h96a2,2,0,0,0,2-2V64a2,2,0,0,0-2-2H80a2,2,0,0,0-2,2Zm152,48v40a14,14,0,0,1-14,14H80a14,14,0,0,1-14-14V152a14,14,0,0,1,14-14H216A14,14,0,0,1,230,152Zm-12,0a2,2,0,0,0-2-2H80a2,2,0,0,0-2,2v40a2,2,0,0,0,2,2H216a2,2,0,0,0,2-2Z"
  ],
  "archive": [
    "M224,50H32A14,14,0,0,0,18,64V88a14,14,0,0,0,14,14h2v90a14,14,0,0,0,14,14H208a14,14,0,0,0,14-14V102h2a14,14,0,0,0,14-14V64A14,14,0,0,0,224,50ZM210,192a2,2,0,0,1-2,2H48a2,2,0,0,1-2-2V102H210ZM226,88a2,2,0,0,1-2,2H32a2,2,0,0,1-2-2V64a2,2,0,0,1,2-2H224a2,2,0,0,1,2,2ZM98,136a6,6,0,0,1,6-6h48a6,6,0,0,1,0,12H104A6,6,0,0,1,98,136Z"
  ],
  "arrow-counter-clockwise": [
    "M222,128a94,94,0,0,1-92.74,94H128a93.43,93.43,0,0,1-64.5-25.65,6,6,0,1,1,8.24-8.72A82,82,0,1,0,70,70l-.19.19L39.44,98H72a6,6,0,0,1,0,12H24a6,6,0,0,1-6-6V56a6,6,0,0,1,12,0V90.34L61.63,61.4A94,94,0,0,1,222,128Z"
  ],
  "arrow-down": [
    "M204.24,148.24l-72,72a6,6,0,0,1-8.48,0l-72-72a6,6,0,0,1,8.48-8.48L122,201.51V40a6,6,0,0,1,12,0V201.51l61.76-61.75a6,6,0,0,1,8.48,8.48Z"
  ],
  "arrow-square-out": [
    "M222,104a6,6,0,0,1-12,0V54.49l-69.75,69.75a6,6,0,0,1-8.48-8.48L201.51,46H152a6,6,0,0,1,0-12h64a6,6,0,0,1,6,6Zm-38,26a6,6,0,0,0-6,6v72a2,2,0,0,1-2,2H48a2,2,0,0,1-2-2V80a2,2,0,0,1,2-2h72a6,6,0,0,0,0-12H48A14,14,0,0,0,34,80V208a14,14,0,0,0,14,14H176a14,14,0,0,0,14-14V136A6,6,0,0,0,184,130Z"
  ],
  "arrow-up": [
    "M204.24,116.24a6,6,0,0,1-8.48,0L134,54.49V216a6,6,0,0,1-12,0V54.49L60.24,116.24a6,6,0,0,1-8.48-8.48l72-72a6,6,0,0,1,8.48,0l72,72A6,6,0,0,1,204.24,116.24Z"
  ],
  "arrows-clockwise": [
    "M222,48V96a6,6,0,0,1-6,6H168a6,6,0,0,1,0-12h33.52L183.47,72a81.51,81.51,0,0,0-57.53-24h-.46A81.5,81.5,0,0,0,68.19,71.28a6,6,0,1,1-8.38-8.58,93.38,93.38,0,0,1,65.67-26.76H126a93.45,93.45,0,0,1,66,27.53l18,18V48a6,6,0,0,1,12,0ZM187.81,184.72a81.5,81.5,0,0,1-57.29,23.34h-.46a81.51,81.51,0,0,1-57.53-24L54.48,166H88a6,6,0,0,0,0-12H40a6,6,0,0,0-6,6v48a6,6,0,0,0,12,0V174.48l18,18.05a93.45,93.45,0,0,0,66,27.53h.52a93.38,93.38,0,0,0,65.67-26.76,6,6,0,1,0-8.38-8.58Z"
  ],
  "arrows-down-up": [
    "M116.24,171.76a6,6,0,0,1,0,8.48l-32,32a6,6,0,0,1-8.48,0l-32-32a6,6,0,0,1,8.48-8.48L74,193.51V48a6,6,0,0,1,12,0V193.51l21.76-21.75A6,6,0,0,1,116.24,171.76Zm96-96-32-32a6,6,0,0,0-8.48,0l-32,32a6,6,0,0,0,8.48,8.48L170,62.49V208a6,6,0,0,0,12,0V62.49l21.76,21.75a6,6,0,0,0,8.48-8.48Z"
  ],
  "arrows-left-right": [
    "M212.24,171.76a6,6,0,0,1,0,8.48l-32,32a6,6,0,0,1-8.48-8.48L193.51,182H48a6,6,0,0,1,0-12H193.51l-21.75-21.76a6,6,0,0,1,8.48-8.48ZM75.76,116.24a6,6,0,0,0,8.48-8.48L62.49,86H208a6,6,0,0,0,0-12H62.49L84.24,52.24a6,6,0,0,0-8.48-8.48l-32,32a6,6,0,0,0,0,8.48Z"
  ],
  "bell": [
    "M220.07,176.94C214.41,167.2,206,139.73,206,104a78,78,0,1,0-156,0c0,35.74-8.42,63.2-14.08,72.94A14,14,0,0,0,48,198H90.48a38,38,0,0,0,75,0H208a14,14,0,0,0,12.06-21.06ZM128,218a26,26,0,0,1-25.29-20h50.58A26,26,0,0,1,128,218Zm81.71-33a1.9,1.9,0,0,1-1.7,1H48a1.9,1.9,0,0,1-1.7-1,2,2,0,0,1,0-2C53.87,170,62,139.69,62,104a66,66,0,1,1,132,0c0,35.68,8.14,65.95,15.71,79A2,2,0,0,1,209.71,185Z"
  ],
  "binoculars": [
    "M233,147.24,191.43,52.6a6,6,0,0,0-1.25-1.83,30,30,0,0,0-42.42,0A6,6,0,0,0,146,55V82H110V55a6,6,0,0,0-1.76-4.25,30,30,0,0,0-42.42,0,6,6,0,0,0-1.25,1.83L23,147.24A46,46,0,1,0,110,168V94h36v74a46,46,0,1,0,87-20.76ZM64,202a34,34,0,1,1,34-34A34,34,0,0,1,64,202Zm0-80a45.77,45.77,0,0,0-18.55,3.92L75.06,58.54A18,18,0,0,1,98,57.71V137A45.89,45.89,0,0,0,64,122Zm94-64.28a18,18,0,0,1,22.94.83l29.61,67.37A45.9,45.9,0,0,0,158,137ZM192,202a34,34,0,1,1,34-34A34,34,0,0,1,192,202Z"
  ],
  "buildings": [
    "M240,210H222V96a14,14,0,0,0-14-14H142V32a14,14,0,0,0-21.77-11.64l-80,53.33A14,14,0,0,0,34,85.34V210H16a6,6,0,0,0,0,12H240a6,6,0,0,0,0-12ZM208,94a2,2,0,0,1,2,2V210H142V94ZM46,85.34a2,2,0,0,1,.89-1.66l80-53.34A2,2,0,0,1,130,32V210H46ZM110,112v16a6,6,0,0,1-12,0V112a6,6,0,0,1,12,0Zm-32,0v16a6,6,0,0,1-12,0V112a6,6,0,0,1,12,0Zm0,56v16a6,6,0,0,1-12,0V168a6,6,0,0,1,12,0Zm32,0v16a6,6,0,0,1-12,0V168a6,6,0,0,1,12,0Z"
  ],
  "calendar-blank": [
    "M208,34H182V24a6,6,0,0,0-12,0V34H86V24a6,6,0,0,0-12,0V34H48A14,14,0,0,0,34,48V208a14,14,0,0,0,14,14H208a14,14,0,0,0,14-14V48A14,14,0,0,0,208,34ZM48,46H74V56a6,6,0,0,0,12,0V46h84V56a6,6,0,0,0,12,0V46h26a2,2,0,0,1,2,2V82H46V48A2,2,0,0,1,48,46ZM208,210H48a2,2,0,0,1-2-2V94H210V208A2,2,0,0,1,208,210Z"
  ],
  "caret-down": [
    "M212.24,100.24l-80,80a6,6,0,0,1-8.48,0l-80-80a6,6,0,0,1,8.48-8.48L128,167.51l75.76-75.75a6,6,0,0,1,8.48,8.48Z"
  ],
  "caret-left": [
    "M164.24,203.76a6,6,0,1,1-8.48,8.48l-80-80a6,6,0,0,1,0-8.48l80-80a6,6,0,0,1,8.48,8.48L88.49,128Z"
  ],
  "caret-right": [
    "M180.24,132.24l-80,80a6,6,0,0,1-8.48-8.48L167.51,128,91.76,52.24a6,6,0,0,1,8.48-8.48l80,80A6,6,0,0,1,180.24,132.24Z"
  ],
  "caret-up": [
    "M212.24,164.24a6,6,0,0,1-8.48,0L128,88.49,52.24,164.24a6,6,0,0,1-8.48-8.48l80-80a6,6,0,0,1,8.48,0l80,80A6,6,0,0,1,212.24,164.24Z"
  ],
  "chart-bar-horizontal": [
    "M224,98H182V56a6,6,0,0,0-6-6H54V40a6,6,0,0,0-12,0V216a6,6,0,0,0,12,0V206h90a6,6,0,0,0,6-6V158h74a6,6,0,0,0,6-6V104A6,6,0,0,0,224,98ZM170,62V98H54V62ZM138,194H54V158h84Zm80-48H54V110H218Z"
  ],
  "chart-line": [
    "M230,208a6,6,0,0,1-6,6H32a6,6,0,0,1-6-6V48a6,6,0,0,1,12,0v98.78l54.05-47.3a6,6,0,0,1,7.55-.28l60.11,45.08,60.34-52.8a6,6,0,0,1,7.9,9l-64,56a6,6,0,0,1-7.55.28L96.29,111.72,38,162.72V202H224A6,6,0,0,1,230,208Z"
  ],
  "check": [
    "M228.24,76.24l-128,128a6,6,0,0,1-8.48,0l-56-56a6,6,0,0,1,8.48-8.48L96,191.51,219.76,67.76a6,6,0,0,1,8.48,8.48Z"
  ],
  "circle": [
    "M128,26A102,102,0,1,0,230,128,102.12,102.12,0,0,0,128,26Zm0,192a90,90,0,1,1,90-90A90.1,90.1,0,0,1,128,218Z"
  ],
  "clipboard-text": [
    "M166,152a6,6,0,0,1-6,6H96a6,6,0,0,1,0-12h64A6,6,0,0,1,166,152Zm-6-38H96a6,6,0,0,0,0,12h64a6,6,0,0,0,0-12Zm54-66V216a14,14,0,0,1-14,14H56a14,14,0,0,1-14-14V48A14,14,0,0,1,56,34H93.17a45.91,45.91,0,0,1,69.66,0H200A14,14,0,0,1,214,48ZM94,64v2h68V64a34,34,0,0,0-68,0ZM202,48a2,2,0,0,0-2-2H170.33A45.77,45.77,0,0,1,174,64v8a6,6,0,0,1-6,6H88a6,6,0,0,1-6-6V64a45.77,45.77,0,0,1,3.67-18H56a2,2,0,0,0-2,2V216a2,2,0,0,0,2,2H200a2,2,0,0,0,2-2Z"
  ],
  "clock-afternoon": [
    "M128,26A102,102,0,1,0,230,128,102.12,102.12,0,0,0,128,26Zm0,192a90,90,0,1,1,90-90A90.1,90.1,0,0,1,128,218Zm62-90a6,6,0,0,1-6,6H142.49l29.75,29.76a6,6,0,1,1-8.48,8.48l-40-40A6,6,0,0,1,128,122h56A6,6,0,0,1,190,128Z"
  ],
  "clock": [
    "M128,26A102,102,0,1,0,230,128,102.12,102.12,0,0,0,128,26Zm0,192a90,90,0,1,1,90-90A90.1,90.1,0,0,1,128,218Zm62-90a6,6,0,0,1-6,6H128a6,6,0,0,1-6-6V72a6,6,0,0,1,12,0v50h50A6,6,0,0,1,190,128Z"
  ],
  "cloud-arrow-up": [
    "M188.24,164.24a6,6,0,0,1-8.48,0L158,142.49V208a6,6,0,0,1-12,0V142.49l-21.76,21.75a6,6,0,0,1-8.48-8.48l32-32a6,6,0,0,1,8.48,0l32,32A6,6,0,0,1,188.24,164.24ZM160,42A86.1,86.1,0,0,0,82.43,90.88,62,62,0,1,0,72,214h40a6,6,0,0,0,0-12H72a50,50,0,0,1,0-100,50.68,50.68,0,0,1,5.91.36A85.54,85.54,0,0,0,74,128a6,6,0,0,0,12,0,74,74,0,1,1,103.6,67.85,6,6,0,0,0,4.8,11A86,86,0,0,0,160,42Z"
  ],
  "copy-simple": [
    "M184,66H40a6,6,0,0,0-6,6V216a6,6,0,0,0,6,6H184a6,6,0,0,0,6-6V72A6,6,0,0,0,184,66Zm-6,144H46V78H178ZM222,40V184a6,6,0,0,1-12,0V46H72a6,6,0,0,1,0-12H216A6,6,0,0,1,222,40Z"
  ],
  "copy": [
    "M216,34H88a6,6,0,0,0-6,6V82H40a6,6,0,0,0-6,6V216a6,6,0,0,0,6,6H168a6,6,0,0,0,6-6V174h42a6,6,0,0,0,6-6V40A6,6,0,0,0,216,34ZM162,210H46V94H162Zm48-48H174V88a6,6,0,0,0-6-6H94V46H210Z"
  ],
  "cube": [
    "M222.72,67.9l-88-48.17a13.9,13.9,0,0,0-13.44,0l-88,48.18A14,14,0,0,0,26,80.18v95.64a14,14,0,0,0,7.28,12.27l88,48.18a13.92,13.92,0,0,0,13.44,0l88-48.18A14,14,0,0,0,230,175.82V80.18A14,14,0,0,0,222.72,67.9ZM127,30.25a2,2,0,0,1,1.92,0L212.51,76,128,122.24,43.49,76ZM39,177.57a2,2,0,0,1-1-1.75V86.66l84,46V223Zm177.92,0L134,223V132.64l84-46v89.16A2,2,0,0,1,217,177.57Z"
  ],
  "device-mobile": [
    "M176,18H80A22,22,0,0,0,58,40V216a22,22,0,0,0,22,22h96a22,22,0,0,0,22-22V40A22,22,0,0,0,176,18ZM70,62H186V194H70ZM80,30h96a10,10,0,0,1,10,10V50H70V40A10,10,0,0,1,80,30Zm96,196H80a10,10,0,0,1-10-10V206H186v10A10,10,0,0,1,176,226Z"
  ],
  "diamond": [
    "M233.92,118.14,137.86,22.08a14,14,0,0,0-19.72,0L22.08,118.14a14,14,0,0,0,0,19.72l96.06,96.06h0a14,14,0,0,0,19.72,0l96-96.06a13.94,13.94,0,0,0,0-19.72Zm-8.49,11.24-96.05,96.06a2,2,0,0,1-2.76,0L30.57,129.38a2,2,0,0,1,0-2.76l96.05-96.06a2,2,0,0,1,2.76,0l96.05,96.06a2,2,0,0,1,0,2.76Z"
  ],
  "dot": [
    "M138,128a10,10,0,1,1-10-10A10,10,0,0,1,138,128Z"
  ],
  "dots-six-vertical": [
    "M102,60A10,10,0,1,1,92,50,10,10,0,0,1,102,60Zm62,10a10,10,0,1,0-10-10A10,10,0,0,0,164,70ZM92,118a10,10,0,1,0,10,10A10,10,0,0,0,92,118Zm72,0a10,10,0,1,0,10,10A10,10,0,0,0,164,118ZM92,186a10,10,0,1,0,10,10A10,10,0,0,0,92,186Zm72,0a10,10,0,1,0,10,10A10,10,0,0,0,164,186Z"
  ],
  "dots-three": [
    "M138,128a10,10,0,1,1-10-10A10,10,0,0,1,138,128ZM60,118a10,10,0,1,0,10,10A10,10,0,0,0,60,118Zm136,0a10,10,0,1,0,10,10A10,10,0,0,0,196,118Z"
  ],
  "eye": [
    "M245.48,125.57c-.34-.78-8.66-19.23-27.24-37.81C201,70.54,171.38,50,128,50S55,70.54,37.76,87.76c-18.58,18.58-26.9,37-27.24,37.81a6,6,0,0,0,0,4.88c.34.77,8.66,19.22,27.24,37.8C55,185.47,84.62,206,128,206s73-20.53,90.24-37.75c18.58-18.58,26.9-37,27.24-37.8A6,6,0,0,0,245.48,125.57ZM128,194c-31.38,0-58.78-11.42-81.45-33.93A134.77,134.77,0,0,1,22.69,128,134.56,134.56,0,0,1,46.55,95.94C69.22,73.42,96.62,62,128,62s58.78,11.42,81.45,33.94A134.56,134.56,0,0,1,233.31,128C226.94,140.21,195,194,128,194Zm0-112a46,46,0,1,0,46,46A46.06,46.06,0,0,0,128,82Zm0,80a34,34,0,1,1,34-34A34,34,0,0,1,128,162Z"
  ],
  "fire": [
    "M181.92,153A55.58,55.58,0,0,1,137,197.92a7,7,0,0,1-1,.08,6,6,0,0,1-1-11.92c17.38-2.92,32.13-17.68,35.08-35.08a6,6,0,1,1,11.84,2ZM214,144a86,86,0,0,1-172,0c0-27.47,10.85-55.61,32.25-83.64a6,6,0,0,1,9-.67l26.34,25.56,23.09-63.31a6,6,0,0,1,9.47-2.56C163.72,37.33,214,85.4,214,144Zm-12,0c0-48.4-38.65-89.84-61.07-109.8L117.64,98.06a6,6,0,0,1-9.82,2.25l-28-27.22C62.67,97.13,54,121,54,144a74,74,0,0,0,148,0Z"
  ],
  "flag": [
    "M44.08,51.37A6,6,0,0,0,42,55.9V224a6,6,0,0,0,12,0V178.78c28.08-22.79,51.88-11,79.34,2.57,16.12,8,33.49,16.58,52,16.58,13.57,0,27.76-4.6,42.56-17.42A6,6,0,0,0,230,176V55.9a6,6,0,0,0-9.93-4.54c-29,25.12-53.28,13.09-81.41-.84C110.77,36.71,79,21.16,44.08,51.37ZM218,173.17c-28.08,22.8-51.88,11-79.34-2.58C113.4,158.08,85.09,144.07,54,164V58.72c28.08-22.8,51.88-11,79.34,2.56C158.6,73.79,186.91,87.8,218,67.91Z"
  ],
  "floppy-disk": [
    "M217.9,73.42,182.58,38.1a13.9,13.9,0,0,0-9.89-4.1H48A14,14,0,0,0,34,48V208a14,14,0,0,0,14,14H208a14,14,0,0,0,14-14V83.31A13.9,13.9,0,0,0,217.9,73.42ZM170,210H86V152a2,2,0,0,1,2-2h80a2,2,0,0,1,2,2Zm40-2a2,2,0,0,1-2,2H182V152a14,14,0,0,0-14-14H88a14,14,0,0,0-14,14v58H48a2,2,0,0,1-2-2V48a2,2,0,0,1,2-2H172.69a2,2,0,0,1,1.41.58L209.42,81.9a2,2,0,0,1,.58,1.41ZM158,72a6,6,0,0,1-6,6H96a6,6,0,0,1,0-12h56A6,6,0,0,1,158,72Z"
  ],
  "funnel": [
    "M228.77,50.34A13.8,13.8,0,0,0,216,42H40A14,14,0,0,0,29.67,65.42l.06.07L98,138.38V216a14,14,0,0,0,21.77,11.64l32-21.33A14,14,0,0,0,158,194.66V138.38l68.33-73A13.82,13.82,0,0,0,228.77,50.34Zm-11.26,6.94L147.62,131.9A6,6,0,0,0,146,136v58.66a2,2,0,0,1-.89,1.67l-32,21.33A2,2,0,0,1,110,216V136a6,6,0,0,0-1.62-4.1L38.53,57.32A2,2,0,0,1,40,54H216a1.9,1.9,0,0,1,1.83,1.19A1.86,1.86,0,0,1,217.51,57.28Z"
  ],
  "gear": [
    "M128,82a46,46,0,1,0,46,46A46.06,46.06,0,0,0,128,82Zm0,80a34,34,0,1,1,34-34A34,34,0,0,1,128,162ZM214,130.84c.06-1.89.06-3.79,0-5.68L229.33,106a6,6,0,0,0,1.11-5.29A105.34,105.34,0,0,0,219.76,74.9a6,6,0,0,0-4.53-3l-24.45-2.71q-1.93-2.07-4-4l-2.72-24.46a6,6,0,0,0-3-4.53,105.65,105.65,0,0,0-25.77-10.66A6,6,0,0,0,150,26.68l-19.2,15.37c-1.89-.06-3.79-.06-5.68,0L106,26.67a6,6,0,0,0-5.29-1.11A105.34,105.34,0,0,0,74.9,36.24a6,6,0,0,0-3,4.53L69.23,65.22q-2.07,1.94-4,4L40.76,72a6,6,0,0,0-4.53,3,105.65,105.65,0,0,0-10.66,25.77A6,6,0,0,0,26.68,106l15.37,19.2c-.06,1.89-.06,3.79,0,5.68L26.67,150.05a6,6,0,0,0-1.11,5.29A105.34,105.34,0,0,0,36.24,181.1a6,6,0,0,0,4.53,3l24.45,2.71q1.94,2.07,4,4L72,215.24a6,6,0,0,0,3,4.53,105.65,105.65,0,0,0,25.77,10.66,6,6,0,0,0,5.29-1.11L125.16,214c1.89.06,3.79.06,5.68,0l19.21,15.38a6,6,0,0,0,3.75,1.31,6.2,6.2,0,0,0,1.54-.2,105.34,105.34,0,0,0,25.76-10.68,6,6,0,0,0,3-4.53l2.71-24.45q2.07-1.93,4-4l24.46-2.72a6,6,0,0,0,4.53-3,105.49,105.49,0,0,0,10.66-25.77,6,6,0,0,0-1.11-5.29Zm-3.1,41.63-23.64,2.63a6,6,0,0,0-3.82,2,75.14,75.14,0,0,1-6.31,6.31,6,6,0,0,0-2,3.82l-2.63,23.63A94.28,94.28,0,0,1,155.14,218l-18.57-14.86a6,6,0,0,0-3.75-1.31h-.36a78.07,78.07,0,0,1-8.92,0,6,6,0,0,0-4.11,1.3L100.87,218a94.13,94.13,0,0,1-17.34-7.17L80.9,187.21a6,6,0,0,0-2-3.82,75.14,75.14,0,0,1-6.31-6.31,6,6,0,0,0-3.82-2l-23.63-2.63A94.28,94.28,0,0,1,38,155.14l14.86-18.57a6,6,0,0,0,1.3-4.11,78.07,78.07,0,0,1,0-8.92,6,6,0,0,0-1.3-4.11L38,100.87a94.13,94.13,0,0,1,7.17-17.34L68.79,80.9a6,6,0,0,0,3.82-2,75.14,75.14,0,0,1,6.31-6.31,6,6,0,0,0,2-3.82l2.63-23.63A94.28,94.28,0,0,1,100.86,38l18.57,14.86a6,6,0,0,0,4.11,1.3,78.07,78.07,0,0,1,8.92,0,6,6,0,0,0,4.11-1.3L155.13,38a94.13,94.13,0,0,1,17.34,7.17l2.63,23.64a6,6,0,0,0,2,3.82,75.14,75.14,0,0,1,6.31,6.31,6,6,0,0,0,3.82,2l23.63,2.63A94.28,94.28,0,0,1,218,100.86l-14.86,18.57a6,6,0,0,0-1.3,4.11,78.07,78.07,0,0,1,0,8.92,6,6,0,0,0,1.3,4.11L218,155.13A94.13,94.13,0,0,1,210.85,172.47Z"
  ],
  "globe": [
    "M128,26A102,102,0,1,0,230,128,102.12,102.12,0,0,0,128,26Zm81.57,64H169.19a132.58,132.58,0,0,0-25.73-50.67A90.29,90.29,0,0,1,209.57,90ZM218,128a89.7,89.7,0,0,1-3.83,26H171.81a155.43,155.43,0,0,0,0-52h42.36A89.7,89.7,0,0,1,218,128Zm-90,87.83a110,110,0,0,1-15.19-19.45A124.24,124.24,0,0,1,99.35,166h57.3a124.24,124.24,0,0,1-13.46,30.38A110,110,0,0,1,128,215.83ZM96.45,154a139.18,139.18,0,0,1,0-52h63.1a139.18,139.18,0,0,1,0,52ZM38,128a89.7,89.7,0,0,1,3.83-26H84.19a155.43,155.43,0,0,0,0,52H41.83A89.7,89.7,0,0,1,38,128Zm90-87.83a110,110,0,0,1,15.19,19.45A124.24,124.24,0,0,1,156.65,90H99.35a124.24,124.24,0,0,1,13.46-30.38A110,110,0,0,1,128,40.17Zm-15.46-.84A132.58,132.58,0,0,0,86.81,90H46.43A90.29,90.29,0,0,1,112.54,39.33ZM46.43,166H86.81a132.58,132.58,0,0,0,25.73,50.67A90.29,90.29,0,0,1,46.43,166Zm97,50.67A132.58,132.58,0,0,0,169.19,166h40.38A90.29,90.29,0,0,1,143.46,216.67Z"
  ],
  "handshake": [
    "M252.51,108.8,227,57.75a14,14,0,0,0-18.78-6.27L182.66,64.26,129.53,50.2a6.1,6.1,0,0,0-3.06,0L73.34,64.26,47.79,51.48A14,14,0,0,0,29,57.75L3.49,108.8a14,14,0,0,0,6.26,18.78L36.9,141.16l55.61,39.72a6,6,0,0,0,2,.94l64,16A6.08,6.08,0,0,0,160,198a6,6,0,0,0,4.24-1.76l55.31-55.31,26.7-13.35a14,14,0,0,0,6.26-18.78Zm-53,35.16-35.8-28.68a6,6,0,0,0-8,.45c-18.65,18.79-39.5,16.42-52.79,7.92a2,2,0,0,1-.94-1.5,1.9,1.9,0,0,1,.51-1.55L146.43,78h33.86l28.41,56.82ZM14.11,115.69a2,2,0,0,1,.11-1.52L39.74,63.11a2,2,0,0,1,1.8-1.1,2,2,0,0,1,.89.21l22.21,11.1L37.32,128l-22.21-11.1A2,2,0,0,1,14.11,115.69Zm144.05,69.67-59.6-14.9L47.66,134.1,76.84,75.75,128,62.21l14.8,3.92a5.92,5.92,0,0,0-3,1.57L94.1,112.05a14,14,0,0,0,2.39,21.72c20.22,12.92,44.75,10.49,63.8-5.89L191,152.5Zm83.73-69.67a2,2,0,0,1-1,1.16L218.68,128,191.36,73.32l22.21-11.1a2,2,0,0,1,1.53-.11,2,2,0,0,1,1.16,1l25.52,51.06A2,2,0,0,1,241.89,115.69Zm-112,101.76a6,6,0,0,1-7.27,4.37L80.89,211.39a5.88,5.88,0,0,1-2-.94L52.52,191.64a6,6,0,1,1,7-9.77L84.91,200l40.61,10.15A6,6,0,0,1,129.88,217.45Z"
  ],
  "hash": [
    "M224,90H173l8.89-48.93a6,6,0,1,0-11.8-2.14L160.81,90H109l8.89-48.93a6,6,0,0,0-11.8-2.14L96.81,90H48a6,6,0,0,0,0,12H94.63l-9.46,52H32a6,6,0,0,0,0,12H83L74.1,214.93a6,6,0,0,0,4.83,7A5.64,5.64,0,0,0,80,222a6,6,0,0,0,5.89-4.93L95.19,166H147l-8.89,48.93a6,6,0,0,0,4.83,7,5.64,5.64,0,0,0,1.08.1,6,6,0,0,0,5.89-4.93L159.19,166H208a6,6,0,0,0,0-12H161.37l9.46-52H224a6,6,0,0,0,0-12Zm-74.83,64H97.37l9.46-52h51.8Z"
  ],
  "info": [
    "M142,176a6,6,0,0,1-6,6,14,14,0,0,1-14-14V128a2,2,0,0,0-2-2,6,6,0,0,1,0-12,14,14,0,0,1,14,14v40a2,2,0,0,0,2,2A6,6,0,0,1,142,176ZM124,94a10,10,0,1,0-10-10A10,10,0,0,0,124,94Zm106,34A102,102,0,1,1,128,26,102.12,102.12,0,0,1,230,128Zm-12,0a90,90,0,1,0-90,90A90.1,90.1,0,0,0,218,128Z"
  ],
  "kanban": [
    "M216,50H40a6,6,0,0,0-6,6V208a14,14,0,0,0,14,14H88a14,14,0,0,0,14-14V158h52v18a14,14,0,0,0,14,14h40a14,14,0,0,0,14-14V56A6,6,0,0,0,216,50Zm-6,64H166V62h44ZM90,62v52H46V62Zm0,146a2,2,0,0,1-2,2H48a2,2,0,0,1-2-2V126H90Zm12-62V62h52v84Zm106,32H168a2,2,0,0,1-2-2V126h44v50A2,2,0,0,1,208,178Z"
  ],
  "layout": [
    "M216,42H40A14,14,0,0,0,26,56V200a14,14,0,0,0,14,14H216a14,14,0,0,0,14-14V56A14,14,0,0,0,216,42ZM40,54H216a2,2,0,0,1,2,2V98H38V56A2,2,0,0,1,40,54ZM38,200V110H98v92H40A2,2,0,0,1,38,200Zm178,2H110V110H218v90A2,2,0,0,1,216,202Z"
  ],
  "lightbulb-filament": [
    "M174,232a6,6,0,0,1-6,6H88a6,6,0,0,1,0-12h80A6,6,0,0,1,174,232Zm40-128a85.56,85.56,0,0,1-32.88,67.64A18.23,18.23,0,0,0,174,186v6a14,14,0,0,1-14,14H96a14,14,0,0,1-14-14v-6a18,18,0,0,0-7-14.23h0a85.59,85.59,0,0,1-33-67.25C41.74,57.91,79.39,19.12,125.93,18A86,86,0,0,1,214,104Zm-12,0a74,74,0,0,0-75.79-74C86.17,31,53.78,64.34,54,104.42a73.67,73.67,0,0,0,28.4,57.87A29.92,29.92,0,0,1,94,186v6a2,2,0,0,0,2,2h26V146.49L91.76,116.24a6,6,0,0,1,8.48-8.48L128,135.52l27.76-27.76a6,6,0,0,1,8.48,8.48L134,146.49V194h26a2,2,0,0,0,2-2v-6a30.18,30.18,0,0,1,11.7-23.78A73.59,73.59,0,0,0,202,104Z"
  ],
  "lightning": [
    "M213.84,118.63a6,6,0,0,0-3.73-4.25L150.88,92.17l15-75a6,6,0,0,0-10.27-5.27l-112,120a6,6,0,0,0,2.28,9.71l59.23,22.21-15,75a6,6,0,0,0,3.14,6.52A6.07,6.07,0,0,0,96,246a6,6,0,0,0,4.39-1.91l112-120A6,6,0,0,0,213.84,118.63ZM106,220.46l11.85-59.28a6,6,0,0,0-3.77-6.8l-55.6-20.85,91.46-98L138.12,94.82a6,6,0,0,0,3.77,6.8l55.6,20.85Z"
  ],
  "list-checks": [
    "M222,128a6,6,0,0,1-6,6H128a6,6,0,0,1,0-12h88A6,6,0,0,1,222,128ZM128,70h88a6,6,0,0,0,0-12H128a6,6,0,0,0,0,12Zm88,116H128a6,6,0,0,0,0,12h88a6,6,0,0,0,0-12ZM83.76,43.76,56,71.51,44.24,59.76a6,6,0,0,0-8.48,8.48l16,16a6,6,0,0,0,8.48,0l32-32a6,6,0,0,0-8.48-8.48Zm0,64L56,135.51,44.24,123.76a6,6,0,1,0-8.48,8.48l16,16a6,6,0,0,0,8.48,0l32-32a6,6,0,0,0-8.48-8.48Zm0,64L56,199.51,44.24,187.76a6,6,0,0,0-8.48,8.48l16,16a6,6,0,0,0,8.48,0l32-32a6,6,0,0,0-8.48-8.48Z"
  ],
  "list": [
    "M222,128a6,6,0,0,1-6,6H40a6,6,0,0,1,0-12H216A6,6,0,0,1,222,128ZM40,70H216a6,6,0,0,0,0-12H40a6,6,0,0,0,0,12ZM216,186H40a6,6,0,0,0,0,12H216a6,6,0,0,0,0-12Z"
  ],
  "lock-open": [
    "M208,82H94V56a34,34,0,0,1,34-34c16.3,0,31,11.69,34.12,27.19a6,6,0,0,0,11.76-2.38C169.55,25.48,150.26,10,128,10A46.06,46.06,0,0,0,82,56V82H48A14,14,0,0,0,34,96V208a14,14,0,0,0,14,14H208a14,14,0,0,0,14-14V96A14,14,0,0,0,208,82Zm2,126a2,2,0,0,1-2,2H48a2,2,0,0,1-2-2V96a2,2,0,0,1,2-2H208a2,2,0,0,1,2,2Zm-72-56a10,10,0,1,1-10-10A10,10,0,0,1,138,152Z"
  ],
  "lock": [
    "M208,82H174V56a46,46,0,0,0-92,0V82H48A14,14,0,0,0,34,96V208a14,14,0,0,0,14,14H208a14,14,0,0,0,14-14V96A14,14,0,0,0,208,82ZM94,56a34,34,0,0,1,68,0V82H94ZM210,208a2,2,0,0,1-2,2H48a2,2,0,0,1-2-2V96a2,2,0,0,1,2-2H208a2,2,0,0,1,2,2Zm-72-56a10,10,0,1,1-10-10A10,10,0,0,1,138,152Z"
  ],
  "magnifying-glass": [
    "M228.24,219.76l-51.38-51.38a86.15,86.15,0,1,0-8.48,8.48l51.38,51.38a6,6,0,0,0,8.48-8.48ZM38,112a74,74,0,1,1,74,74A74.09,74.09,0,0,1,38,112Z"
  ],
  "megaphone": [
    "M246,120a46.05,46.05,0,0,0-46-46H160.15c-2.58-.15-54.1-3.57-103.15-44.71A14,14,0,0,0,34,40V200a13.85,13.85,0,0,0,8.07,12.68A14.16,14.16,0,0,0,48,214a13.9,13.9,0,0,0,9-3.3c40-33.52,81.57-42,97-44.07v34a14,14,0,0,0,6.23,11.65l11,7.33a14,14,0,0,0,21.32-8.17l12.13-45.71A46.07,46.07,0,0,0,246,120ZM49.29,201.52A2,2,0,0,1,46,200V40a1.9,1.9,0,0,1,1.15-1.8A2.08,2.08,0,0,1,48,38a1.91,1.91,0,0,1,1.26.48c44,36.92,89,45.19,104.71,47v69C138.29,156.33,93.3,164.61,49.29,201.52Zm131.64,7a2,2,0,0,1-3.05,1.18l-11-7.33a2,2,0,0,1-.89-1.67V166h26.2ZM200,154H166V86h34a34,34,0,1,1,0,68Z"
  ],
  "minus": [
    "M222,128a6,6,0,0,1-6,6H40a6,6,0,0,1,0-12H216A6,6,0,0,1,222,128Z"
  ],
  "monitor-play": [
    "M163.33,115l-48-32A6,6,0,0,0,106,88v64a6,6,0,0,0,9.33,5l48-32a6,6,0,0,0,0-10ZM118,140.79V99.21L149.18,120ZM208,42H48A22,22,0,0,0,26,64V176a22,22,0,0,0,22,22H208a22,22,0,0,0,22-22V64A22,22,0,0,0,208,42Zm10,134a10,10,0,0,1-10,10H48a10,10,0,0,1-10-10V64A10,10,0,0,1,48,54H208a10,10,0,0,1,10,10Zm-52,48a6,6,0,0,1-6,6H96a6,6,0,0,1,0-12h64A6,6,0,0,1,166,224Z"
  ],
  "monitor": [
    "M208,42H48A22,22,0,0,0,26,64V176a22,22,0,0,0,22,22H208a22,22,0,0,0,22-22V64A22,22,0,0,0,208,42Zm10,134a10,10,0,0,1-10,10H48a10,10,0,0,1-10-10V64A10,10,0,0,1,48,54H208a10,10,0,0,1,10,10Zm-52,48a6,6,0,0,1-6,6H96a6,6,0,0,1,0-12h64A6,6,0,0,1,166,224Z"
  ],
  "moon": [
    "M232.13,143.64a6,6,0,0,0-6-1.49A90.07,90.07,0,0,1,113.86,29.85a6,6,0,0,0-7.49-7.48A102.88,102.88,0,0,0,54.48,58.68,102,102,0,0,0,197.32,201.52a102.88,102.88,0,0,0,36.31-51.89A6,6,0,0,0,232.13,143.64Zm-42,48.29a90,90,0,0,1-126-126A90.9,90.9,0,0,1,99.65,37.66,102.06,102.06,0,0,0,218.34,156.35,90.9,90.9,0,0,1,190.1,191.93Z"
  ],
  "music-notes": [
    "M211.69,19.27a6,6,0,0,0-5.15-1.09l-128,32A6,6,0,0,0,74,56V170.11A34,34,0,1,0,86,196V108.68l116-29v58.43A34,34,0,1,0,214,164V24A6,6,0,0,0,211.69,19.27ZM52,218a22,22,0,1,1,22-22A22,22,0,0,1,52,218ZM86,96.32V60.68l116-29V67.32ZM180,186a22,22,0,1,1,22-22A22,22,0,0,1,180,186Z"
  ],
  "note": [
    "M90,96a6,6,0,0,1,6-6h64a6,6,0,0,1,0,12H96A6,6,0,0,1,90,96Zm6,38h64a6,6,0,0,0,0-12H96a6,6,0,0,0,0,12Zm32,20H96a6,6,0,0,0,0,12h32a6,6,0,0,0,0-12ZM222,48V156.69a13.94,13.94,0,0,1-4.1,9.9L166.59,217.9a13.94,13.94,0,0,1-9.9,4.1H48a14,14,0,0,1-14-14V48A14,14,0,0,1,48,34H208A14,14,0,0,1,222,48ZM48,210H154V160a6,6,0,0,1,6-6h50V48a2,2,0,0,0-2-2H48a2,2,0,0,0-2,2V208A2,2,0,0,0,48,210Zm153.52-44H166v35.52Z"
  ],
  "notebook": [
    "M182,112a6,6,0,0,1-6,6H112a6,6,0,0,1,0-12h64A6,6,0,0,1,182,112Zm-6,26H112a6,6,0,0,0,0,12h64a6,6,0,0,0,0-12Zm46-90V208a14,14,0,0,1-14,14H48a14,14,0,0,1-14-14V48A14,14,0,0,1,48,34H208A14,14,0,0,1,222,48ZM48,210H74V46H48a2,2,0,0,0-2,2V208A2,2,0,0,0,48,210ZM210,48a2,2,0,0,0-2-2H86V210H208a2,2,0,0,0,2-2Z"
  ],
  "package": [
    "M222.72,67.91l-88-48.18a13.9,13.9,0,0,0-13.44,0l-88,48.18A14,14,0,0,0,26,80.18v95.64a14,14,0,0,0,7.28,12.27l88,48.18a13.92,13.92,0,0,0,13.44,0l88-48.18A14,14,0,0,0,230,175.82V80.18A14,14,0,0,0,222.72,67.91ZM127,30.25a2,2,0,0,1,1.92,0L212.51,76,178.57,94.57,94.05,48.31ZM122,223,39,177.57a2,2,0,0,1-1-1.75V86.66l84,46ZM43.49,76,81.56,55.15l84.51,46.26L128,122.24ZM218,175.82a2,2,0,0,1-1,1.75h0L134,223V132.64l36-19.71V152a6,6,0,0,0,12,0V106.37l36-19.71Z"
  ],
  "paint-brush": [
    "M224,26c-20.8,0-44.11,11.41-69.3,33.9C136.62,76.06,121,94.9,110.3,109A58,58,0,0,0,34,164c0,32.07-20.43,46.39-21.35,47A6,6,0,0,0,16,222H92a58,58,0,0,0,55-76.3c14.08-10.67,32.92-26.32,49.08-44.4C218.59,76.11,230,52.8,230,32A6,6,0,0,0,224,26ZM92,210H30.65C37.92,200.85,46,185.78,46,164a46,46,0,1,1,46,46Zm29.49-95.91c3.6-4.67,7.88-10,12.71-15.69a78.17,78.17,0,0,1,23.4,23.4c-5.67,4.83-11,9.11-15.69,12.71A58.38,58.38,0,0,0,121.49,114.09Zm45.2-.3a90.24,90.24,0,0,0-24.48-24.48C163.05,66.46,191,42,217.56,38.44,214,65,189.54,93,166.69,113.79Z"
  ],
  "paper-plane-tilt": [
    "M225.88,30.12a13.83,13.83,0,0,0-13.7-3.58l-.11,0L20.14,84.77A14,14,0,0,0,18,110.85l85.56,41.64L145.12,238a13.87,13.87,0,0,0,12.61,8c.4,0,.81,0,1.21-.05a13.9,13.9,0,0,0,12.29-10.09l58.2-191.93,0-.11A13.83,13.83,0,0,0,225.88,30.12Zm-8,10.4L159.73,232.43l0,.11a2,2,0,0,1-3.76.26l-40.68-83.58,49-49a6,6,0,1,0-8.49-8.49l-49,49L23.15,100a2,2,0,0,1,.31-3.74l.11,0L215.48,38.08a1.94,1.94,0,0,1,1.92.52A2,2,0,0,1,217.92,40.52Z"
  ],
  "path": [
    "M200,170a30.05,30.05,0,0,0-29.4,24H72a34,34,0,0,1,0-68h96a38,38,0,0,0,0-76H72a6,6,0,0,0,0,12h96a26,26,0,0,1,0,52H72a46,46,0,0,0,0,92h98.6A30,30,0,1,0,200,170Zm0,48a18,18,0,1,1,18-18A18,18,0,0,1,200,218Z"
  ],
  "pencil-simple": [
    "M225.9,74.78,181.21,30.09a14,14,0,0,0-19.8,0L38.1,153.41a13.94,13.94,0,0,0-4.1,9.9V208a14,14,0,0,0,14,14H92.69a13.94,13.94,0,0,0,9.9-4.1L225.9,94.58a14,14,0,0,0,0-19.8ZM94.1,209.41a2,2,0,0,1-1.41.59H48a2,2,0,0,1-2-2V163.31a2,2,0,0,1,.59-1.41L136,72.48,183.51,120ZM217.41,86.1,192,111.51,144.49,64,169.9,38.58a2,2,0,0,1,2.83,0l44.68,44.69a2,2,0,0,1,0,2.83Z"
  ],
  "plus": [
    "M222,128a6,6,0,0,1-6,6H134v82a6,6,0,0,1-12,0V134H40a6,6,0,0,1,0-12h82V40a6,6,0,0,1,12,0v82h82A6,6,0,0,1,222,128Z"
  ],
  "printer": [
    "M214.67,74H198V40a6,6,0,0,0-6-6H64a6,6,0,0,0-6,6V74H41.33C28.47,74,18,83.87,18,96v80a6,6,0,0,0,6,6H58v34a6,6,0,0,0,6,6H192a6,6,0,0,0,6-6V182h34a6,6,0,0,0,6-6V96C238,83.87,227.53,74,214.67,74ZM70,46H186V74H70ZM186,210H70V158H186Zm40-40H198V152a6,6,0,0,0-6-6H64a6,6,0,0,0-6,6v18H30V96c0-5.51,5.08-10,11.33-10H214.67C220.92,86,226,90.49,226,96Zm-28-54a10,10,0,1,1-10-10A10,10,0,0,1,198,116Z"
  ],
  "push-pin": [
    "M233.91,82.79,173.22,22.1a14,14,0,0,0-19.81,0L98.93,76.77c-9.52-3.25-34-8.34-59.71,12.41A14,14,0,0,0,38.1,110l49.71,49.71-44.05,44a6,6,0,1,0,8.48,8.48l44.05-44.05L146,217.89a14,14,0,0,0,9.9,4.11q.49,0,1,0a14,14,0,0,0,10.19-5.54c19.72-26.21,17.15-47.23,12.46-59.3l54.37-54.55A14,14,0,0,0,233.91,82.79ZM225.42,94.1h0l-57.27,57.46a6,6,0,0,0-1.11,6.92c9.94,19.88-1.71,40.32-9.54,50.72a2,2,0,0,1-3,.2L46.58,101.51a2,2,0,0,1,.18-3c12.5-10.09,24.5-12.76,33.7-12.76a42.13,42.13,0,0,1,17.25,3.41A6,6,0,0,0,104.64,88L161.9,30.59a2,2,0,0,1,2.83,0l60.69,60.68A2,2,0,0,1,225.42,94.1Z"
  ],
  "question": [
    "M138,180a10,10,0,1,1-10-10A10,10,0,0,1,138,180ZM128,74c-21,0-38,15.25-38,34v4a6,6,0,0,0,12,0v-4c0-12.13,11.66-22,26-22s26,9.87,26,22-11.66,22-26,22a6,6,0,0,0-6,6v8a6,6,0,0,0,12,0v-2.42c18.11-2.58,32-16.66,32-33.58C166,89.25,149,74,128,74Zm102,54A102,102,0,1,1,128,26,102.12,102.12,0,0,1,230,128Zm-12,0a90,90,0,1,0-90,90A90.1,90.1,0,0,0,218,128Z"
  ],
  "rectangle": [
    "M216,42H40A14,14,0,0,0,26,56V200a14,14,0,0,0,14,14H216a14,14,0,0,0,14-14V56A14,14,0,0,0,216,42Zm2,158a2,2,0,0,1-2,2H40a2,2,0,0,1-2-2V56a2,2,0,0,1,2-2H216a2,2,0,0,1,2,2Z"
  ],
  "repeat": [
    "M26,128A70.08,70.08,0,0,1,96,58H209.51L195.76,44.24a6,6,0,0,1,8.48-8.48l24,24a6,6,0,0,1,0,8.48l-24,24a6,6,0,0,1-8.48-8.48L209.51,70H96a58.07,58.07,0,0,0-58,58,6,6,0,0,1-12,0Zm198-6a6,6,0,0,0-6,6,58.07,58.07,0,0,1-58,58H46.49l13.75-13.76a6,6,0,0,0-8.48-8.48l-24,24a6,6,0,0,0,0,8.48l24,24a6,6,0,0,0,8.48-8.48L46.49,198H160a70.08,70.08,0,0,0,70-70A6,6,0,0,0,224,122Z"
  ],
  "seal-check": [
    "M224.42,104.2c-3.9-4.07-7.93-8.27-9.55-12.18-1.5-3.63-1.58-9-1.67-14.68-.14-9.38-.3-20-7.42-27.12S188,42.94,178.66,42.8c-5.68-.09-11-.17-14.68-1.67-3.91-1.62-8.11-5.65-12.18-9.55C145.16,25.22,137.64,18,128,18s-17.16,7.22-23.8,13.58c-4.07,3.9-8.27,7.93-12.18,9.55-3.63,1.5-9,1.58-14.68,1.67-9.38.14-20,.3-27.12,7.42S42.94,68,42.8,77.34c-.09,5.68-.17,11-1.67,14.68-1.62,3.91-5.65,8.11-9.55,12.18C25.22,110.84,18,118.36,18,128s7.22,17.16,13.58,23.8c3.9,4.07,7.93,8.27,9.55,12.18,1.5,3.63,1.58,9,1.67,14.68.14,9.38.3,20,7.42,27.12S68,213.06,77.34,213.2c5.68.09,11,.17,14.68,1.67,3.91,1.62,8.11,5.65,12.18,9.55C110.84,230.78,118.36,238,128,238s17.16-7.22,23.8-13.58c4.07-3.9,8.27-7.93,12.18-9.55,3.63-1.5,9-1.58,14.68-1.67,9.38-.14,20-.3,27.12-7.42s7.28-17.74,7.42-27.12c.09-5.68.17-11,1.67-14.68,1.62-3.91,5.65-8.11,9.55-12.18C230.78,145.16,238,137.64,238,128S230.78,110.84,224.42,104.2Zm-8.66,39.3c-4.67,4.86-9.5,9.9-12,15.9-2.38,5.74-2.48,12.52-2.58,19.08-.11,7.44-.23,15.14-3.9,18.82s-11.38,3.79-18.82,3.9c-6.56.1-13.34.2-19.08,2.58-6,2.48-11,7.31-15.91,12-5.25,5-10.68,10.24-15.49,10.24s-10.24-5.21-15.5-10.24c-4.86-4.67-9.9-9.5-15.9-12-5.74-2.38-12.52-2.48-19.08-2.58-7.44-.11-15.14-.23-18.82-3.9s-3.79-11.38-3.9-18.82c-.1-6.56-.2-13.34-2.58-19.08-2.48-6-7.31-11-12-15.91C35.21,138.24,30,132.81,30,128s5.21-10.24,10.24-15.5c4.67-4.86,9.5-9.9,12-15.9,2.38-5.74,2.48-12.52,2.58-19.08.11-7.44.23-15.14,3.9-18.82s11.38-3.79,18.82-3.9c6.56-.1,13.34-.2,19.08-2.58,6-2.48,11-7.31,15.91-12C117.76,35.21,123.19,30,128,30s10.24,5.21,15.5,10.24c4.86,4.67,9.9,9.5,15.9,12,5.74,2.38,12.52,2.48,19.08,2.58,7.44.11,15.14.23,18.82,3.9s3.79,11.38,3.9,18.82c.1,6.56.2,13.34,2.58,19.08,2.48,6,7.31,11,12,15.91,5,5.25,10.24,10.68,10.24,15.49S220.79,138.24,215.76,143.5ZM172.24,99.76a6,6,0,0,1,0,8.48l-56,56a6,6,0,0,1-8.48,0l-24-24a6,6,0,0,1,8.48-8.48L112,151.51l51.76-51.75A6,6,0,0,1,172.24,99.76Z"
  ],
  "sidebar-simple": [
    "M216,42H40A14,14,0,0,0,26,56V200a14,14,0,0,0,14,14H216a14,14,0,0,0,14-14V56A14,14,0,0,0,216,42ZM38,200V56a2,2,0,0,1,2-2H82V202H40A2,2,0,0,1,38,200Zm180,0a2,2,0,0,1-2,2H94V54H216a2,2,0,0,1,2,2Z"
  ],
  "sparkle": [
    "M196.89,130.94,144.4,111.6,125.06,59.11a13.92,13.92,0,0,0-26.12,0L79.6,111.6,27.11,130.94a13.92,13.92,0,0,0,0,26.12L79.6,176.4l19.34,52.49a13.92,13.92,0,0,0,26.12,0L144.4,176.4l52.49-19.34a13.92,13.92,0,0,0,0-26.12Zm-4.15,14.86-55.08,20.3a6,6,0,0,0-3.56,3.56l-20.3,55.08a1.92,1.92,0,0,1-3.6,0L89.9,169.66a6,6,0,0,0-3.56-3.56L31.26,145.8a1.92,1.92,0,0,1,0-3.6l55.08-20.3a6,6,0,0,0,3.56-3.56l20.3-55.08a1.92,1.92,0,0,1,3.6,0l20.3,55.08a6,6,0,0,0,3.56,3.56l55.08,20.3a1.92,1.92,0,0,1,0,3.6ZM146,40a6,6,0,0,1,6-6h18V16a6,6,0,0,1,12,0V34h18a6,6,0,0,1,0,12H182V64a6,6,0,0,1-12,0V46H152A6,6,0,0,1,146,40ZM246,88a6,6,0,0,1-6,6H230v10a6,6,0,0,1-12,0V94H208a6,6,0,0,1,0-12h10V72a6,6,0,0,1,12,0V82h10A6,6,0,0,1,246,88Z"
  ],
  "squares-four": [
    "M104,42H56A14,14,0,0,0,42,56v48a14,14,0,0,0,14,14h48a14,14,0,0,0,14-14V56A14,14,0,0,0,104,42Zm2,62a2,2,0,0,1-2,2H56a2,2,0,0,1-2-2V56a2,2,0,0,1,2-2h48a2,2,0,0,1,2,2Zm94-62H152a14,14,0,0,0-14,14v48a14,14,0,0,0,14,14h48a14,14,0,0,0,14-14V56A14,14,0,0,0,200,42Zm2,62a2,2,0,0,1-2,2H152a2,2,0,0,1-2-2V56a2,2,0,0,1,2-2h48a2,2,0,0,1,2,2Zm-98,34H56a14,14,0,0,0-14,14v48a14,14,0,0,0,14,14h48a14,14,0,0,0,14-14V152A14,14,0,0,0,104,138Zm2,62a2,2,0,0,1-2,2H56a2,2,0,0,1-2-2V152a2,2,0,0,1,2-2h48a2,2,0,0,1,2,2Zm94-62H152a14,14,0,0,0-14,14v48a14,14,0,0,0,14,14h48a14,14,0,0,0,14-14V152A14,14,0,0,0,200,138Zm2,62a2,2,0,0,1-2,2H152a2,2,0,0,1-2-2V152a2,2,0,0,1,2-2h48a2,2,0,0,1,2,2Z"
  ],
  "star": [
    "M237.28,97.87A14.18,14.18,0,0,0,224.76,88l-60.25-4.87-23.22-56.2a14.37,14.37,0,0,0-26.58,0L91.49,83.11,31.24,88a14.18,14.18,0,0,0-12.52,9.89A14.43,14.43,0,0,0,23,113.32L69,152.93l-14,59.25a14.4,14.4,0,0,0,5.59,15,14.1,14.1,0,0,0,15.91.6L128,196.12l51.58,31.71a14.1,14.1,0,0,0,15.91-.6,14.4,14.4,0,0,0,5.59-15l-14-59.25L233,113.32A14.43,14.43,0,0,0,237.28,97.87Zm-12.14,6.37-48.69,42a6,6,0,0,0-1.92,5.92l14.88,62.79a2.35,2.35,0,0,1-.95,2.57,2.24,2.24,0,0,1-2.6.1L131.14,184a6,6,0,0,0-6.28,0L70.14,217.61a2.24,2.24,0,0,1-2.6-.1,2.35,2.35,0,0,1-1-2.57l14.88-62.79a6,6,0,0,0-1.92-5.92l-48.69-42a2.37,2.37,0,0,1-.73-2.65,2.28,2.28,0,0,1,2.07-1.65l63.92-5.16a6,6,0,0,0,5.06-3.69l24.63-59.6a2.35,2.35,0,0,1,4.38,0l24.63,59.6a6,6,0,0,0,5.06,3.69l63.92,5.16a2.28,2.28,0,0,1,2.07,1.65A2.37,2.37,0,0,1,225.14,104.24Z"
  ],
  "sun-horizon": [
    "M240,154H197.28a70.91,70.91,0,0,0,.72-10,70,70,0,0,0-140,0,70.91,70.91,0,0,0,.72,10H16a6,6,0,0,0,0,12H240a6,6,0,0,0,0-12ZM70,144a58,58,0,1,1,115.13,10H70.87A58.63,58.63,0,0,1,70,144Zm144,56a6,6,0,0,1-6,6H48a6,6,0,0,1,0-12H208A6,6,0,0,1,214,200ZM74.63,42.69a6,6,0,0,1,10.74-5.37l8,16a6,6,0,0,1-10.74,5.36Zm-56,50.63a6,6,0,0,1,8.05-2.69l16,8a6,6,0,0,1-5.36,10.74l-16-8A6,6,0,0,1,18.63,93.32Zm192,13.36a6,6,0,0,1,2.69-8.05l16-8a6,6,0,1,1,5.36,10.74l-16,8a6,6,0,0,1-8.05-2.69Zm-48-53.36,8-16a6,6,0,0,1,10.74,5.37l-8,16a6,6,0,1,1-10.74-5.36Z"
  ],
  "tag": [
    "M241.91,137.42,142.59,38.1a13.94,13.94,0,0,0-9.9-4.1H40a6,6,0,0,0-6,6v92.69a13.94,13.94,0,0,0,4.1,9.9l99.32,99.32a14,14,0,0,0,19.8,0l84.69-84.69A14,14,0,0,0,241.91,137.42Zm-8.49,11.31-84.69,84.69a2,2,0,0,1-2.83,0L46.59,134.1a2,2,0,0,1-.59-1.41V46h86.69a2,2,0,0,1,1.41.59l99.32,99.31A2,2,0,0,1,233.42,148.73ZM94,84A10,10,0,1,1,84,74,10,10,0,0,1,94,84Z"
  ],
  "todo-dots": [
    "M102,40a26,26 0 1,0 52,0a26,26 0 1,0 -52,0ZM114,40a14,14 0 1,1 28,0a14,14 0 1,1 -28,0ZM102,128a26,26 0 1,0 52,0a26,26 0 1,0 -52,0ZM114,128a14,14 0 1,1 28,0a14,14 0 1,1 -28,0ZM102,216a26,26 0 1,0 52,0a26,26 0 1,0 -52,0ZM114,216a14,14 0 1,1 28,0a14,14 0 1,1 -28,0Z"
  ],
  "trash": [
    "M216,50H174V40a22,22,0,0,0-22-22H104A22,22,0,0,0,82,40V50H40a6,6,0,0,0,0,12H50V208a14,14,0,0,0,14,14H192a14,14,0,0,0,14-14V62h10a6,6,0,0,0,0-12ZM94,40a10,10,0,0,1,10-10h48a10,10,0,0,1,10,10V50H94ZM194,208a2,2,0,0,1-2,2H64a2,2,0,0,1-2-2V62H194ZM110,104v64a6,6,0,0,1-12,0V104a6,6,0,0,1,12,0Zm48,0v64a6,6,0,0,1-12,0V104a6,6,0,0,1,12,0Z"
  ],
  "tray": [
    "M208,34H48A14,14,0,0,0,34,48V208a14,14,0,0,0,14,14H208a14,14,0,0,0,14-14V48A14,14,0,0,0,208,34ZM48,46H208a2,2,0,0,1,2,2V154H179.31a13.94,13.94,0,0,0-9.9,4.1L150.1,177.41a2,2,0,0,1-1.41.59H107.31a2,2,0,0,1-1.41-.58L86.59,158.1a13.94,13.94,0,0,0-9.9-4.1H46V48A2,2,0,0,1,48,46ZM208,210H48a2,2,0,0,1-2-2V166H76.69a2,2,0,0,1,1.41.58L97.41,185.9a13.94,13.94,0,0,0,9.9,4.1h41.38a13.94,13.94,0,0,0,9.9-4.1l19.31-19.31a2,2,0,0,1,1.41-.59H210v42A2,2,0,0,1,208,210Z"
  ],
  "user-focus": [
    "M222,40V76a6,6,0,0,1-12,0V46H180a6,6,0,0,1,0-12h36A6,6,0,0,1,222,40Zm-6,134a6,6,0,0,0-6,6v30H180a6,6,0,0,0,0,12h36a6,6,0,0,0,6-6V180A6,6,0,0,0,216,174ZM76,210H46V180a6,6,0,0,0-12,0v36a6,6,0,0,0,6,6H76a6,6,0,0,0,0-12ZM40,82a6,6,0,0,0,6-6V46H76a6,6,0,0,0,0-12H40a6,6,0,0,0-6,6V76A6,6,0,0,0,40,82Zm136,92a6,6,0,0,1-4.8-2.4,54,54,0,0,0-86.4,0,6,6,0,1,1-9.6-7.2,65.65,65.65,0,0,1,29.69-22.26,38,38,0,1,1,46.22,0A65.65,65.65,0,0,1,180.8,164.4,6,6,0,0,1,176,174Zm-48-36a26,26,0,1,0-26-26A26,26,0,0,0,128,138Z"
  ],
  "user": [
    "M229.19,213c-15.81-27.32-40.63-46.49-69.47-54.62a70,70,0,1,0-63.44,0C67.44,166.5,42.62,185.67,26.81,213a6,6,0,1,0,10.38,6C56.4,185.81,90.34,166,128,166s71.6,19.81,90.81,53a6,6,0,1,0,10.38-6ZM70,96a58,58,0,1,1,58,58A58.07,58.07,0,0,1,70,96Z"
  ],
  "video-camera": [
    "M250.83,74.71a6,6,0,0,0-6.16.3L206,100.79V72a14,14,0,0,0-14-14H32A14,14,0,0,0,18,72V184a14,14,0,0,0,14,14H192a14,14,0,0,0,14-14V155.21L244.67,181a6,6,0,0,0,9.33-5V80A6,6,0,0,0,250.83,74.71ZM194,184a2,2,0,0,1-2,2H32a2,2,0,0,1-2-2V72a2,2,0,0,1,2-2H192a2,2,0,0,1,2,2Zm48-19.21-36-24V115.21l36-24Z"
  ],
  "wrench": [
    "M224.91,69.75a6,6,0,0,0-9.63-2.16l-41.07,37.9L154.7,101.3l-4.19-19.51,37.9-41.07a6,6,0,0,0-2.16-9.63,70,70,0,0,0-89.77,94.39l-61.39,53c-.11.09-.21.19-.32.3A30,30,0,0,0,77.2,221.23c.11-.11.21-.21.3-.32l53-61.39a70,70,0,0,0,94.39-89.77ZM160,154a58,58,0,0,1-28-7.22,6,6,0,0,0-7.45,1.33L68.57,212.88a18,18,0,0,1-25.45-25.45l64.76-55.94A6,6,0,0,0,109.2,124a58,58,0,0,1,64-84.53L139.58,75.93a6,6,0,0,0-1.45,5.33l5.65,26.35a6,6,0,0,0,4.61,4.61l26.35,5.65a6,6,0,0,0,5.33-1.45L216.49,82.8A58.06,58.06,0,0,1,160,154Z"
  ],
  "x": [
    "M204.24,195.76a6,6,0,1,1-8.48,8.48L128,136.49,60.24,204.24a6,6,0,0,1-8.48-8.48L119.51,128,51.76,60.24a6,6,0,0,1,8.48-8.48L128,119.51l67.76-67.75a6,6,0,0,1,8.48,8.48L136.49,128Z"
  ]
};
var JOBS = {
  "approve": "seal-check",
  "archive": "archive",
  "arrow-down": "arrow-down",
  "arrow-up": "arrow-up",
  "bell": "bell",
  "binoculars": "binoculars",
  "board": "kanban",
  "building": "buildings",
  "calendar": "calendar-blank",
  "canvases": "note",
  "check": "check",
  "chevron-down": "caret-down",
  "chevron-left": "caret-left",
  "chevron-right": "caret-right",
  "chevron-up": "caret-up",
  "clients": "handshake",
  "clock": "clock",
  "cloud-art": "paint-brush",
  "copy": "copy",
  "dashboard": "layout",
  "deadline": "paper-plane-tilt",
  "day-planner": "clock-afternoon",
  "dept-admin": "clipboard-text",
  "dept-content": "monitor-play",
  "dept-direction": "megaphone",
  "dept-eng": "wrench",
  "dept-lasers": "lightning",
  "dept-lighting": "lightbulb-filament",
  "dept-pm": "notebook",
  "dept-scenic": "cube",
  "dept-sfx": "fire",
  "dept-video": "video-camera",
  "drag": "dots-six-vertical",
  "edit": "pencil-simple",
  "everything": "globe",
  "external": "arrow-square-out",
  "filter": "funnel",
  "flag": "flag",
  "group": "squares-four",
  "hash": "hash",
  "help": "question",
  "inbox": "tray",
  "info": "info",
  "kind-deliverable": "package",
  "kind-milestone": "diamond",
  "kind-phase": "rectangle",
  "kind-task": "circle",
  "kind-track": "music-notes",
  "list": "list",
  "lock": "lock",
  "menu": "sidebar-simple",
  "minus": "minus",
  "moon": "moon",
  "more": "dots-three",
  "my-plate": "user-focus",
  "phone": "device-mobile",
  "pin": "push-pin",
  "plane": "airplane",
  "plus": "plus",
  "print": "printer",
  "project": "hash",
  "refresh": "arrows-clockwise",
  "repeat": "repeat",
  "reports": "chart-line",
  "restore": "arrow-counter-clockwise",
  "review date": "eye",
  "resourcing": "chart-bar-horizontal",
  "roadmap": "path",
  "save": "floppy-disk",
  "screen": "monitor",
  "search": "magnifying-glass",
  "settings": "gear",
  "snag-list": "list-checks",
  "sort": "arrows-down-up",
  "sparkle": "sparkle",
  "star": "star",
  "swap": "arrows-left-right",
  "sync": "cloud-arrow-up",
  "tag": "tag",
  "service": "currency-dollar",
  "template": "copy-simple",
  "time-off": "sun-horizon",
  "timeline": "align-left",
  "today": "dot",
  "todos": "todo-dots",
  "trash": "trash",
  "unlock": "lock-open",
  "user": "user",
  "snooze": "zzz",
  "no date": "calendar-slash",
  "x": "x"
};

// src/components/Icon/Icon.tsx
import { jsx as jsx3 } from "react/jsx-runtime";
var isJob = (s) => Object.prototype.hasOwnProperty.call(JOBS, s);
function slotIcon(icon, props = {}) {
  if (icon == null || icon === false || icon === "") return null;
  if (typeof icon === "string") return isJob(icon) ? /* @__PURE__ */ jsx3(Icon, { job: icon, ...props }) : /* @__PURE__ */ jsx3(Icon, { name: icon, ...props });
  return /* @__PURE__ */ jsx3("span", { className: "ad-icon-slot--own", "data-ad-own-drawing": "", children: icon });
}
var ITEM_TYPES = /* @__PURE__ */ new Set(["phase", "milestone", "deliverable", "todo", "travel"]);
function Icon(props) {
  const { name, job, size = "md", fill, weight, label, tint, className, resolved } = props;
  if (tint && ITEM_TYPES.has(tint) && resolved === void 0) return /* @__PURE__ */ jsx3(TintedIcon, { ...props });
  const glyph = job ? JOBS[job] : name;
  const paths = fill && FILL[glyph] || weight === "light" && LIGHT[glyph] || REGULAR[glyph];
  if (!paths) throw new Error(`Icon: "${String(job ?? name)}" is not a glyph or a job in the icon map (assets/icons/README.md). One set: nothing outside it is drawn.`);
  return /* @__PURE__ */ jsx3("svg", { viewBox: "0 0 256 256", className: cx("ad-icon", `ad-icon--${size}`, className), role: label ? "img" : void 0, "aria-label": label, "aria-hidden": label ? void 0 : true, focusable: "false", "data-tint": resolved ? tint : void 0, style: resolved ? { color: resolved } : void 0, children: paths.map((d, i) => /* @__PURE__ */ jsx3("path", { fill: "currentColor", d }, i)) });
}
function TintedIcon(props) {
  const resolved = useHue(`item-${props.tint}`) ?? null;
  return Icon({ ...props, resolved });
}

// src/components/Avatar/Avatar.tsx
import { useState as useState4 } from "react";

// src/components/Status/Status.tsx
import { jsx as jsx4, jsxs as jsxs2 } from "react/jsx-runtime";
var pickColours = ["grey", "blue", "teal", "green", "amber", "orange", "red", "purple", "white"];
var PICKABLE = new Set(pickColours);
function useNamedColour(name) {
  const isPick = !!name && PICKABLE.has(name);
  const shown = useHue(isPick ? void 0 : name);
  return isPick ? `var(--pick-${name})` : shown;
}
function Dot({ tone = "neutral", hue, priority, colour: picked, className, ...rest }) {
  const colour = useNamedColour(picked && PICKABLE.has(picked) ? picked : hue);
  return /* @__PURE__ */ jsx4("span", { "aria-hidden": "true", ...rest, "data-coloured": colour ? true : void 0, style: colour ? { ["--ad-dot"]: colour } : void 0, className: cx("ad-dot", `ad-dot--${tone}`, priority && `ad-dot--p${priority}`, className) });
}
function Status({ label, tone = "neutral", colour, className, ...rest }) {
  return /* @__PURE__ */ jsxs2("span", { ...rest, className: cx("ad-status", className), children: [
    /* @__PURE__ */ jsx4(Dot, { tone, colour }),
    /* @__PURE__ */ jsx4("span", { className: "ad-status__word", children: label })
  ] });
}
function Health({ state, reason, labels: l = {} }) {
  if (state !== "at-risk" && state !== "off-track") return null;
  const word = state === "at-risk" ? l.atRisk ?? "At risk" : l.offTrack ?? "Off track";
  const said = reason ? `${word}: ${String(reason)}` : word;
  return /* @__PURE__ */ jsx4("span", { role: "img", "aria-label": said, title: said, className: "ad-health", children: /* @__PURE__ */ jsx4(Dot, { tone: state === "at-risk" ? "waiting" : "problem" }) });
}
function SideStripe({ colour, priority, side = "left", inline, children }) {
  const named = useNamedColour(colour);
  const drawn = priority ? priority < 4 ? `var(--priority-p${priority})` : null : named;
  return /* @__PURE__ */ jsx4(
    "span",
    {
      "data-coloured": drawn ? true : void 0,
      "data-priority": priority,
      style: drawn ? { ["--ad-stripe"]: drawn } : void 0,
      className: cx("ad-side-stripe", `ad-side-stripe--${side}`, inline && "ad-side-stripe--inline"),
      children
    }
  );
}

// src/components/Avatar/Avatar.tsx
import { jsx as jsx5, jsxs as jsxs3 } from "react/jsx-runtime";
function Avatar({ name, initials: initials2, src, size = "sm", decorative, presence, className, style }) {
  const [failed, setFailed] = useState4();
  const broken = !!src && failed === src;
  return /* @__PURE__ */ jsxs3("span", { role: decorative ? void 0 : "img", "aria-label": decorative ? void 0 : presence ? `${name}, ${presence.label}` : name, "aria-hidden": decorative || void 0, title: presence ? `${name}, ${presence.label}` : name, className: cx("ad-avatar", `ad-avatar--${size}`, className), style, children: [
    src && !broken ? /* @__PURE__ */ jsx5("img", { src, alt: "", onError: () => setFailed(src) }) : /* @__PURE__ */ jsx5("span", { "aria-hidden": "true", children: initials2 ?? initials(name) }),
    presence && /* @__PURE__ */ jsx5(Dot, { colour: presence.colour, className: "ad-avatar__presence" })
  ] });
}
function AvatarStack({ people, max = 3, size = "sm", plane = "base", className }) {
  if (!people.length) return null;
  const shown = people.slice(0, max);
  const rest = people.length - shown.length;
  return /* @__PURE__ */ jsxs3("span", { className: cx("ad-avatar-stack", `ad-plane--${plane}`, className), role: "group", "aria-label": people.map((p) => p.name).join(", "), children: [
    shown.map((p, i) => /* @__PURE__ */ jsx5(Avatar, { ...p, initials: (p.initials ?? initials(p.name)).slice(0, 1), size, decorative: true, style: { zIndex: shown.length - i } }, p.id ?? `${p.name}-${i}`)),
    rest > 0 && /* @__PURE__ */ jsx5("span", { className: cx("ad-avatar", `ad-avatar--${size}`, "ad-avatar-stack__more"), "aria-hidden": "true", children: "\u2026" })
  ] });
}
function Person({ name, initials: initials2, src, className }) {
  return /* @__PURE__ */ jsxs3("span", { className: cx("ad-person", className), children: [
    /* @__PURE__ */ jsx5(Avatar, { name, initials: initials2, src, decorative: true }),
    /* @__PURE__ */ jsx5("span", { className: "ad-person__name ad-clamp-line", children: name })
  ] });
}

// src/components/Button/Button.tsx
import { Fragment as Fragment2, jsx as jsx6, jsxs as jsxs4 } from "react/jsx-runtime";
var Place = createContext3("md");
function ButtonSizeScope({ size, children }) {
  return /* @__PURE__ */ jsx6(Place.Provider, { value: size, children });
}
var Button = forwardRef(function Button2({ variant = "quiet", icon, face, dot, danger, active, block, unavailable, className, type = "button", children, ...rest }, ref) {
  const size = useContext3(Place);
  const why = useTooltip(unavailable);
  delete rest.size;
  return /* @__PURE__ */ jsxs4(Fragment2, { children: [
    /* @__PURE__ */ jsxs4(
      "button",
      {
        ref,
        type,
        ...rest,
        ...unavailable ? why.triggerProps : {},
        disabled: rest.disabled || !!unavailable,
        "data-unavailable": unavailable ? true : void 0,
        className: cx("ad-button", `ad-button--${variant}`, `ad-button--${size}`, danger && variant !== "main" && "ad-button--danger", active && "ad-button--active", block && "ad-button--block", className),
        children: [
          face ? /* @__PURE__ */ jsx6(Avatar, { name: face.name, src: face.src, size: "sm", decorative: true }) : dot ? /* @__PURE__ */ jsx6(Dot, { tone: dot }) : slotIcon(icon),
          children
        ]
      }
    ),
    unavailable ? why.node : null
  ] });
});
function FileButton({ accept, multiple, onFiles, ...button }) {
  const input = useRef4(null);
  return /* @__PURE__ */ jsxs4(Fragment2, { children: [
    /* @__PURE__ */ jsx6(Button, { ...button, onClick: () => input.current?.click() }),
    /* @__PURE__ */ jsx6(
      "input",
      {
        ref: input,
        type: "file",
        accept,
        multiple,
        hidden: true,
        "aria-hidden": "true",
        tabIndex: -1,
        onChange: (e) => {
          const files = [...e.target.files ?? []];
          if (files.length) onFiles(files);
          e.target.value = "";
        }
      }
    )
  ] });
}
var IconButton = forwardRef(function IconButton2({ label, active, danger, className, type = "button", children, onPointerEnter, onPointerLeave, onFocus, onBlur, ...rest }, ref) {
  const size = useContext3(Place);
  delete rest.size;
  const { triggerProps: tip, node } = useTooltip(label, { describes: false });
  return /* @__PURE__ */ jsxs4(Fragment2, { children: [
    /* @__PURE__ */ jsx6(
      "button",
      {
        ref,
        type,
        ...rest,
        "aria-label": label,
        onPointerEnter: (e) => {
          onPointerEnter?.(e);
          tip.onPointerEnter(e);
        },
        onPointerLeave: (e) => {
          onPointerLeave?.(e);
          tip.onPointerLeave();
        },
        onFocus: (e) => {
          onFocus?.(e);
          tip.onFocus(e);
        },
        onBlur: (e) => {
          onBlur?.(e);
          tip.onBlur();
        },
        className: cx("ad-icon-button", `ad-icon-button--${size}`, active && "ad-icon-button--active", danger && "ad-button--danger", className),
        children
      }
    ),
    node
  ] });
});

// src/components/Field/Field.tsx
import { forwardRef as forwardRef2, useEffect as useEffect4, useId as useId3, useRef as useRef5, useState as useState5 } from "react";

// src/components/GroupHeading/GroupHeading.tsx
import { useId as useId2 } from "react";

// src/components/Field/Help.tsx
import { Fragment as Fragment3, jsx as jsx7, jsxs as jsxs5 } from "react/jsx-runtime";
function Help({ text }) {
  const { triggerProps, node } = useTooltip(text, { describes: false });
  return /* @__PURE__ */ jsxs5(Fragment3, { children: [
    /* @__PURE__ */ jsx7("button", { type: "button", className: "ad-field-row__help", "aria-label": text, ...triggerProps, onPointerLeave: triggerProps.onPointerLeave, onBlur: triggerProps.onBlur, children: /* @__PURE__ */ jsx7(Icon, { name: "question", size: "sm" }) }),
    node
  ] });
}

// src/components/GroupHeading/GroupHeading.tsx
import { Fragment as Fragment4, jsx as jsx8, jsxs as jsxs6 } from "react/jsx-runtime";
function GroupHeading({ children, number, rule = "above", needsYou, lead, end, collapsible, collapsed = false, onToggle, controls, level = 3, help, className }) {
  const id = useId2();
  const Tag2 = `h${level}`;
  const num = number == null ? null : typeof number === "number" ? String(number).padStart(2, "0") : number;
  const inner = /* @__PURE__ */ jsxs6(Fragment4, { children: [
    collapsible && /* @__PURE__ */ jsx8(Icon, { name: "caret-down", className: "ad-group-heading__chevron" }),
    num != null && /* @__PURE__ */ jsx8("span", { className: "ad-group-heading__numeral", children: num }),
    lead && /* @__PURE__ */ jsx8("span", { className: "ad-group-heading__lead", children: lead }),
    /* @__PURE__ */ jsx8("span", { className: "ad-group-heading__name", id, children })
  ] });
  return /* @__PURE__ */ jsxs6("div", { className: cx("ad-group-heading", `ad-group-heading--rule-${rule}`, className), "data-needs-you": needsYou || void 0, "data-collapsed": collapsible ? String(collapsed) : void 0, children: [
    /* @__PURE__ */ jsx8(Tag2, { className: "ad-group-heading__title", children: collapsible ? /* @__PURE__ */ jsx8("button", { type: "button", className: "ad-group-heading__button", "aria-expanded": !collapsed, "aria-controls": controls, onClick: onToggle, children: inner }) : inner }),
    help && /* @__PURE__ */ jsx8(Help, { text: help }),
    end && /* @__PURE__ */ jsx8("span", { className: "ad-group-heading__end", children: end })
  ] });
}

// src/components/Field/Field.tsx
import { jsx as jsx9, jsxs as jsxs7 } from "react/jsx-runtime";
var TextField = forwardRef2(function TextField2({ icon, end, parsed, error, mono, className, style, ...rest }, ref) {
  const parsedId = useId3();
  const errorId = useId3();
  const describedBy = [parsed != null ? parsedId : null, error != null ? errorId : null, rest["aria-describedby"]].filter(Boolean).join(" ") || void 0;
  return /* @__PURE__ */ jsxs7("span", { className: cx("ad-field-wrap", className), style, children: [
    /* @__PURE__ */ jsxs7("span", { className: cx("ad-field", rest.disabled && "ad-field--disabled"), children: [
      icon && /* @__PURE__ */ jsx9("span", { className: "ad-field__icon", "aria-hidden": "true", children: slotIcon(icon) }),
      /* @__PURE__ */ jsx9("input", { ref, ...rest, "aria-invalid": error != null || void 0, "aria-describedby": describedBy, className: cx("ad-field__input", mono && "ad-field__input--mono") }),
      end && /* @__PURE__ */ jsx9("span", { className: "ad-field__end", children: end })
    ] }),
    parsed != null && /* @__PURE__ */ jsxs7("span", { id: parsedId, className: "ad-field__parsed", "aria-live": "polite", children: [
      "[ ",
      parsed,
      " ]"
    ] }),
    error != null && /* @__PURE__ */ jsx9("span", { id: errorId, className: "ad-field__error", role: "alert", children: error })
  ] });
});
var TextArea = forwardRef2(function TextArea2({ className, ...rest }, ref) {
  return /* @__PURE__ */ jsx9("textarea", { ref, ...rest, className: cx("ad-field", "ad-textarea", className) });
});
var InlineEdit = forwardRef2(function InlineEdit2({ value, onCommit, ariaLabel, placeholder, size = "body", onType, onLeaveDown, disabled, className }, ref) {
  const [draft, setDraft] = useState5(value);
  const editing = useRef5(false);
  const cancelled = useRef5(false);
  useEffect4(() => {
    if (!editing.current) setDraft(value);
  }, [value]);
  const commit = () => {
    editing.current = false;
    if (cancelled.current) {
      cancelled.current = false;
      setDraft(value);
      return;
    }
    const next = draft.trim();
    if (next !== value) onCommit(next);
    setDraft(value);
  };
  return /* @__PURE__ */ jsx9(
    "input",
    {
      ref,
      value: draft,
      "aria-label": ariaLabel,
      placeholder,
      disabled,
      onFocus: () => {
        editing.current = true;
      },
      onChange: (e) => {
        setDraft(e.target.value);
        onType?.(e.target.value);
      },
      onBlur: commit,
      onKeyDown: (e) => {
        if (onLeaveDown && (e.key === "Enter" || e.key === "ArrowDown")) {
          e.preventDefault();
          onLeaveDown(e.key);
          return;
        }
        if (e.key === "Enter") e.currentTarget.blur();
        if (e.key === "Escape") {
          e.stopPropagation();
          cancelled.current = true;
          e.currentTarget.blur();
        }
      },
      className: cx("ad-inline-edit", `ad-inline-edit--${size}`, className)
    }
  );
});
var Select = forwardRef2(function Select2({ options, placeholder, quiet, className, value, defaultValue, ...rest }, ref) {
  return /* @__PURE__ */ jsxs7("span", { className: cx("ad-field", "ad-select", rest.disabled && "ad-field--disabled", className), children: [
    /* @__PURE__ */ jsxs7("select", { ref, ...rest, value, defaultValue: value === void 0 ? defaultValue ?? (placeholder ? "" : void 0) : void 0, className: cx("ad-select__native", quiet && "ad-select__native--quiet"), children: [
      placeholder != null && /* @__PURE__ */ jsx9("option", { value: "", disabled: true, children: placeholder }),
      options.map((o) => /* @__PURE__ */ jsx9("option", { value: o.value, disabled: o.disabled, children: o.label }, o.value))
    ] }),
    /* @__PURE__ */ jsx9(Icon, { name: "caret-down", size: "sm", className: "ad-select__caret" })
  ] });
});
function FieldRow({ label, children, help, beside, htmlFor, className }) {
  return /* @__PURE__ */ jsxs7("div", { className: cx("ad-field-row", beside && "ad-field-row--beside", className), children: [
    /* @__PURE__ */ jsxs7("span", { className: "ad-field-row__label", children: [
      /* @__PURE__ */ jsx9("label", { htmlFor, children: label }),
      help && /* @__PURE__ */ jsx9(Help, { text: help })
    ] }),
    /* @__PURE__ */ jsx9("div", { className: "ad-field-row__control", children })
  ] });
}
function FormSection({ number, title, children, error, className }) {
  const errorId = useId3();
  const num = String(number).padStart(2, "0");
  return /* @__PURE__ */ jsxs7("section", { role: "group", "aria-label": `${num} ${title}`, "aria-describedby": error != null ? errorId : void 0, className: cx("ad-section ad-form-section", className), children: [
    /* @__PURE__ */ jsx9(GroupHeading, { number, children: title }),
    /* @__PURE__ */ jsx9("div", { className: "ad-form-section__body", children }),
    error != null && /* @__PURE__ */ jsx9("p", { id: errorId, className: "ad-field__error ad-form-section__error", children: error })
  ] });
}
function FormActions({ main, onCancel, cancelLabel = "Cancel", destroy, extras }) {
  return /* @__PURE__ */ jsxs7("div", { className: "ad-form-actions", children: [
    destroy && /* @__PURE__ */ jsx9("span", { className: "ad-form-actions__destroy", children: /* @__PURE__ */ jsx9(Button, { onClick: destroy.onSelect, children: destroy.label }) }),
    extras != null && /* @__PURE__ */ jsx9("span", { className: "ad-form-actions__extras", children: extras }),
    onCancel && /* @__PURE__ */ jsx9(Button, { onClick: onCancel, children: cancelLabel }),
    main && /* @__PURE__ */ jsx9(Button, { variant: "main", type: main.onSelect ? "button" : "submit", onClick: main.onSelect, children: String(main.label) })
  ] });
}
var OverlayTextArea = forwardRef2(function OverlayTextArea2({ value, onChange, mirror, placeholder, ...rest }, ref) {
  return /* @__PURE__ */ jsxs7("span", { className: "ad-overlay-text", children: [
    /* @__PURE__ */ jsxs7("span", { "aria-hidden": "true", className: "ad-overlay-text__mirror", children: [
      value ? mirror : /* @__PURE__ */ jsx9("span", { className: "ad-overlay-text__placeholder", children: placeholder }),
      "\u200B"
    ] }),
    /* @__PURE__ */ jsx9("textarea", { ref, rows: 1, ...rest, value, onChange: (e) => onChange(e.target.value, e), className: "ad-overlay-text__field" })
  ] });
});

// src/components/Checkbox/Checkbox.tsx
import { forwardRef as forwardRef3, useEffect as useEffect5, useImperativeHandle, useRef as useRef6 } from "react";
import { jsx as jsx10, jsxs as jsxs8 } from "react/jsx-runtime";
var Checkbox = forwardRef3(function Checkbox2({ checked, onChange, label, partly, className, style, disabled, ...rest }, ref) {
  const box = useRef6(null);
  useImperativeHandle(ref, () => box.current);
  const mixed = !!partly && !checked;
  useEffect5(() => {
    if (box.current) box.current.indeterminate = mixed;
  }, [mixed]);
  const state = checked ? "on" : mixed ? "mixed" : "off";
  return /* @__PURE__ */ jsxs8("label", { className: cx("ad-checkbox", disabled && "ad-checkbox--disabled", className), style, children: [
    /* @__PURE__ */ jsx10(
      "input",
      {
        ...rest,
        ref: box,
        type: "checkbox",
        checked,
        disabled,
        onChange: (e) => onChange?.(e.target.checked),
        className: "ad-checkbox__input"
      }
    ),
    /* @__PURE__ */ jsxs8("span", { className: "ad-checkbox__box", "data-state": state, "aria-hidden": "true", children: [
      state === "on" && /* @__PURE__ */ jsx10(Icon, { name: "check" }),
      state === "mixed" && /* @__PURE__ */ jsx10(Icon, { name: "minus" })
    ] }),
    label != null && /* @__PURE__ */ jsx10("span", { className: "ad-checkbox__label", children: label })
  ] });
});

// src/components/Switch/Switch.tsx
import { forwardRef as forwardRef4 } from "react";
import { jsx as jsx11, jsxs as jsxs9 } from "react/jsx-runtime";
var Switch = forwardRef4(function Switch2({ checked, onChange, label, className, disabled, onClick, ...rest }, ref) {
  const button = /* @__PURE__ */ jsx11(
    "button",
    {
      ref,
      type: "button",
      role: "switch",
      ...rest,
      "aria-checked": checked,
      disabled,
      onClick: (e) => {
        onClick?.(e);
        if (!e.defaultPrevented) onChange?.(!checked);
      },
      className: cx("ad-switch", label == null && className)
    }
  );
  if (label == null) return button;
  return /* @__PURE__ */ jsxs9("label", { className: cx("ad-switch-label", disabled && "ad-switch-label--disabled", className), children: [
    button,
    /* @__PURE__ */ jsx11("span", { children: label })
  ] });
});

// src/components/Segmented/Segmented.tsx
import { useRef as useRef7 } from "react";
import { jsx as jsx12 } from "react/jsx-runtime";
function Segmented({ options, value, onChange, ariaLabel, disabled, icons, className }) {
  const group = useRef7(null);
  const live = options.filter((o) => !o.disabled);
  const choose = (o) => {
    onChange(o.value);
    requestAnimationFrame(() => group.current?.querySelector(`[data-value="${CSS.escape(o.value)}"]`)?.focus());
  };
  const onKeyDown2 = (e) => {
    if (disabled || !live.length) return;
    const at = live.findIndex((o) => o.value === value);
    const go = (i) => {
      e.preventDefault();
      choose(live[(i + live.length) % live.length]);
    };
    if (e.key === "ArrowRight" || e.key === "ArrowDown") go(at + 1);
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") go(at - 1);
    else if (e.key === "Home") go(0);
    else if (e.key === "End") go(live.length - 1);
  };
  return /* @__PURE__ */ jsx12("div", { ref: group, role: "radiogroup", "aria-label": ariaLabel, "aria-disabled": disabled || void 0, onKeyDown: onKeyDown2, className: cx("ad-segmented", disabled && "ad-segmented--disabled", className), children: options.map((o) => {
    const on = o.value === value;
    return /* @__PURE__ */ jsx12(
      "button",
      {
        type: "button",
        role: "radio",
        "aria-checked": on,
        "aria-label": icons ? o.ariaLabel ?? (typeof o.label === "string" ? o.label : void 0) : o.ariaLabel,
        title: typeof o.label === "string" ? o.label : void 0,
        "data-value": o.value,
        tabIndex: on ? 0 : -1,
        disabled: disabled || o.disabled,
        onClick: () => choose(o),
        className: cx("ad-segmented__option", icons && "ad-segmented__option--icon"),
        children: icons ? slotIcon(o.icon) : /* @__PURE__ */ jsx12("span", { className: "ad-clamp-line", children: o.label })
      },
      o.value
    );
  }) });
}

// src/components/TextScramble/TextScramble.tsx
import { useCallback as useCallback2, useEffect as useEffect6, useLayoutEffect as useLayoutEffect2, useRef as useRef8, useState as useState6 } from "react";
import { jsx as jsx13, jsxs as jsxs10 } from "react/jsx-runtime";
var useIsoLayoutEffect2 = typeof window === "undefined" ? useEffect6 : useLayoutEffect2;
var scrambled = (text, chars) => text.split("").map((ch) => ch === " " ? " " : chars[Math.floor(Math.random() * chars.length)]).join("");
function TextScramble({
  text,
  as: Tag2 = "span",
  className,
  style,
  delay = 0,
  speed,
  chars = "01",
  threshold = 0.1,
  rootMargin = "0px 0px -60px 0px",
  // token-guard: browser api (from the handoff)
  holdWidth = true
}) {
  const elRef = useRef8(null);
  const innerRef = useRef8(null);
  const frameRef = useRef8();
  const timeoutRef = useRef8();
  const startedRef = useRef8(false);
  const [inView, setInView] = useState6(false);
  const [display, setDisplay] = useState6(text);
  const [minWidth, setMinWidth] = useState6();
  const randomChar = useCallback2(() => chars[Math.floor(Math.random() * chars.length)], [chars]);
  useIsoLayoutEffect2(() => {
    const still = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (!startedRef.current && !still) setDisplay(scrambled(text, chars));
    const el = innerRef.current;
    if (!holdWidth || !el) return;
    const shown = el.textContent;
    el.textContent = text;
    setMinWidth(el.getBoundingClientRect().width);
    el.textContent = shown;
  }, [text, holdWidth]);
  useEffect6(() => {
    const el = elRef.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        observer.disconnect();
      }
    }, { threshold, rootMargin });
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);
  const stop = () => {
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };
  const run = useCallback2(() => {
    const words = [];
    const wordAt = [];
    for (let i = 0; i < text.length; ) {
      if (text[i] === " ") {
        i++;
        continue;
      }
      const start = i;
      while (i < text.length && text[i] !== " ") {
        wordAt[i] = words.length;
        i++;
      }
      words.push({ start, end: i });
    }
    let wordIndex = 0;
    let progress = 0;
    const step = () => {
      if (wordIndex >= words.length) {
        setDisplay(text);
        setMinWidth(void 0);
        return;
      }
      setDisplay(text.split("").map((ch, pos) => {
        if (ch === " ") return " ";
        const w = wordAt[pos];
        const resolved = w < wordIndex || w === wordIndex && pos - words[w].start < Math.floor(progress);
        return resolved ? ch : randomChar();
      }).join(""));
      progress += 0.5;
      if (progress >= words[wordIndex].end - words[wordIndex].start) {
        wordIndex++;
        progress = 0;
      }
      frameRef.current = requestAnimationFrame(() => {
        timeoutRef.current = setTimeout(step, speed ?? tokenMs("--tick-scramble", 30));
      });
    };
    step();
  }, [text, speed, randomChar]);
  useEffect6(() => {
    setDisplay((d) => startedRef.current ? scrambled(text, chars) : d);
    startedRef.current = false;
    return stop;
  }, [text]);
  useEffect6(() => {
    if (!inView || startedRef.current) return;
    startedRef.current = true;
    const reduce = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setDisplay(text);
      setMinWidth(void 0);
      return;
    }
    const t = setTimeout(run, delay);
    return () => {
      clearTimeout(t);
      stop();
      startedRef.current = false;
      setDisplay(text);
    };
  }, [inView, run, delay, text]);
  useEffect6(() => {
    const t = setTimeout(() => {
      if (!startedRef.current) {
        setDisplay(text);
        setMinWidth(void 0);
      }
    }, delay + tokenMs("--tick-scramble", 30) * 40);
    return () => clearTimeout(t);
  }, [text, delay]);
  return /* @__PURE__ */ jsxs10(Tag2, { ref: elRef, className, style, children: [
    /* @__PURE__ */ jsx13("span", { className: "ad-sr", children: text }),
    /* @__PURE__ */ jsx13("span", { ref: innerRef, "aria-hidden": "true", style: minWidth != null ? { display: "inline-block", minWidth } : void 0, children: display })
  ] });
}

// src/components/Department/Department.tsx
import { jsx as jsx14, jsxs as jsxs11 } from "react/jsx-runtime";
var KNOWN2 = /* @__PURE__ */ new Set(["lighting", "video", "eng", "sfx", "content", "scenic", "direction", "admin", "pm", "lasers"]);
function DeptGlyph({ hue }) {
  const colour = useHue(hue);
  if (!hue?.startsWith("dept-") || !colour) return null;
  return /* @__PURE__ */ jsx14("span", { className: "ad-dept ad-dept--coloured", "aria-hidden": "true", style: { ["--ad-dept"]: colour }, children: /* @__PURE__ */ jsx14(Icon, { job: hue, size: "sm" }) });
}
var FOLDED = { pyro: "sfx" };
function Department({ dept: given, name, glyphOnly, onPress, pressLabel }) {
  const dept = FOLDED[given] ?? given;
  const known = KNOWN2.has(dept);
  const colour = useHue(`dept-${known ? dept : "lighting"}`);
  const tint = known ? colour : null;
  const Tag2 = onPress ? "button" : "span";
  return /* @__PURE__ */ jsxs11(Tag2, { type: onPress ? "button" : void 0, "aria-label": onPress ? pressLabel ?? String(name) : void 0, onClick: onPress ? (e) => {
    e.stopPropagation();
    onPress();
  } : void 0, className: cx("ad-dept", tint && "ad-dept--coloured", onPress && "ad-dept--press"), style: tint ? { ["--ad-dept"]: tint } : void 0, children: [
    /* @__PURE__ */ jsx14(Icon, { job: known ? `dept-${dept}` : "tag", size: "sm" }),
    glyphOnly ? /* @__PURE__ */ jsx14("span", { className: "ad-sr", children: String(name) }) : /* @__PURE__ */ jsx14("span", { className: "ad-dept__name", children: String(name) })
  ] });
}

// src/components/Tag/Tag.tsx
import { jsx as jsx15, jsxs as jsxs12 } from "react/jsx-runtime";
function Tag({ children, current, tone, className, ...rest }) {
  return /* @__PURE__ */ jsx15("span", { ...rest, className: cx("ad-tag", current && "ad-tag--current", tone && `ad-tag--${tone}`, className), children });
}
function FilterTag({ axis, value, icon, face, onRemove, removeLabel = "Remove filter", size = "bar", className }) {
  return /* @__PURE__ */ jsxs12("span", { className: cx("ad-filter-tag", size === "row" && "ad-filter-tag--row", className), children: [
    (face || icon != null) && /* @__PURE__ */ jsx15("span", { className: "ad-filter-tag__icon", "aria-hidden": "true", children: face ? /* @__PURE__ */ jsx15(Avatar, { name: face.name, src: face.src, size: "sm", decorative: true }) : slotIcon(icon, { size: "sm" }) }),
    axis != null && /* @__PURE__ */ jsx15("span", { className: "ad-filter-tag__axis", children: axis }),
    /* @__PURE__ */ jsx15("span", { className: "ad-filter-tag__value", children: value }),
    /* @__PURE__ */ jsx15("button", { type: "button", className: "ad-filter-tag__remove ad-glyph-button", "aria-label": removeLabel, title: removeLabel, onClick: onRemove, children: /* @__PURE__ */ jsx15(Icon, { name: "x" }) })
  ] });
}
function ActiveFilters({ filters, onRemove, onClear, clearLabel = "Clear", label = "Active filters" }) {
  if (!filters.length) return null;
  return /* @__PURE__ */ jsxs12("div", { className: "ad-active-filters", role: "group", "aria-label": label, children: [
    filters.map((f) => /* @__PURE__ */ jsx15(FilterTag, { icon: f.icon, axis: f.axis, value: f.value, onRemove: () => onRemove(f.id), removeLabel: `Remove filter ${f.axis}: ${f.value}` }, f.id)),
    onClear && /* @__PURE__ */ jsx15(ButtonSizeScope, { size: "bar", children: /* @__PURE__ */ jsx15(Button, { onClick: onClear, children: clearLabel }) })
  ] });
}
function TokenPill({ children }) {
  return /* @__PURE__ */ jsx15("span", { className: "ad-token", children: String(children) });
}
function UnreadDot({ label = "unread", className }) {
  return /* @__PURE__ */ jsx15("span", { role: "img", "aria-label": label, className: cx("ad-unread", className) });
}

// src/components/List/List.tsx
import React, { createContext as createContext5, useContext as useContext6, useEffect as useEffect7, useId as useId4, useState as useState9 } from "react";

// src/components/Row/Row.tsx
import { forwardRef as forwardRef5, useContext as useContext5, useState as useState8 } from "react";

// src/components/Navigation/Navigation.tsx
import { useState as useState7 } from "react";

// src/components/dropLine.ts
function dropLineProps(at, axis = "y") {
  if (!at) return {};
  return { "data-ad-drop": axis === "x" ? `${at}-x` : at };
}

// src/components/Navigation/MenuPieces.tsx
import { createContext as createContext4, useContext as useContext4 } from "react";
import { jsx as jsx16, jsxs as jsxs13 } from "react/jsx-runtime";
var strip = (h) => {
  if (!h) return {};
  const { className: _c, style: _s, ...rest } = h;
  return rest;
};
var Folded = createContext4(false);
var InList = createContext4(false);
function MenuFrame({ rail = false, ariaLabel, children, frameProps }) {
  return /* @__PURE__ */ jsx16(Folded.Provider, { value: rail, children: /* @__PURE__ */ jsx16("nav", { ...strip(frameProps), "aria-label": ariaLabel, className: cx(rail ? "ad-rail" : "ad-side", "ad-menu-frame"), children }) });
}
function MenuList({ children, listProps, form }) {
  const rail = useContext4(Folded);
  const cls = rail ? cx(form === "nested" ? "ad-rail__pinned" : "ad-rail__group", form === "projects" && "ad-rail__group--projects") : cx("ad-side__list", form === "nested" && "ad-side__list--nested");
  return /* @__PURE__ */ jsx16("ul", { ...strip(listProps), className: cx(cls, "ad-menu__list"), children: /* @__PURE__ */ jsx16(InList.Provider, { value: true, children }) });
}
function MenuItem({ icon, home, pill, label, current, onPress, trail, children, itemProps, ariaLabel, codeSlot }) {
  const rail = useContext4(Folded);
  const Row3 = useContext4(InList) ? "li" : "div";
  const name = ariaLabel ?? (typeof label === "string" ? label : void 0);
  return /* @__PURE__ */ jsxs13(Row3, { ...strip(itemProps), className: "ad-menu__row", children: [
    /* @__PURE__ */ jsxs13("div", { className: "ad-menu__line", children: [
      /* @__PURE__ */ jsxs13("button", { type: "button", className: cx(rail ? pill ? "ad-rail__project" : "ad-rail__item" : "ad-side__item", home && (rail ? "ad-rail__home" : "ad-side__home")), "aria-current": current ? "page" : void 0, "aria-label": rail || home ? name : void 0, title: rail || home ? name : void 0, onClick: onPress, children: [
        home ? rail ? /* @__PURE__ */ jsx16("span", { className: "ad-rail__x", "aria-hidden": "true" }) : /* @__PURE__ */ jsx16("span", { className: "ad-side__icon", "aria-hidden": "true", children: /* @__PURE__ */ jsx16("span", { className: "ad-rail__x" }) }) : pill ? !rail && codeSlot ? /* @__PURE__ */ jsx16("span", { className: "ad-side__icon ad-menu__code", "aria-hidden": "true", children: /* @__PURE__ */ jsx16(ProjectPill, { code: pill.code, current: pill.current, color: pill.color }) }) : /* @__PURE__ */ jsx16(ProjectPill, { code: pill.code, current: pill.current, color: pill.color }) : icon != null && /* @__PURE__ */ jsx16("span", { className: rail ? void 0 : cx("ad-side__icon", codeSlot && "ad-menu__code"), "aria-hidden": typeof label === "string" ? true : void 0, children: typeof icon === "string" ? slotIcon(icon, { size: "lg" }) : icon }),
        !rail && !home && /* @__PURE__ */ jsx16("span", { className: "ad-menu__label ad-clamp-line", children: label })
      ] }),
      !rail && trail != null && /* @__PURE__ */ jsx16("span", { className: "ad-menu__trail", children: /* @__PURE__ */ jsx16(ButtonSizeScope, { size: "row", children: trail }) })
    ] }),
    children
  ] });
}
function MenuFoot({ children }) {
  const rail = useContext4(Folded);
  return /* @__PURE__ */ jsx16("div", { className: cx(rail ? "ad-rail__foot" : "ad-side__foot", "ad-menu__foot"), children });
}

// src/components/Navigation/Navigation.tsx
import { jsx as jsx17, jsxs as jsxs14 } from "react/jsx-runtime";
var dataOnly = (hooks) => hooks ? Object.fromEntries(Object.entries(hooks).filter(([k]) => k.startsWith("data-"))) : {};
function useMenuDrag(onReorder) {
  const [drag, setDrag] = useState7(null);
  const [over, setOver] = useState7(null);
  return (group, id, ids) => onReorder ? {
    draggable: true,
    ...dropLineProps(over === id && drag?.group === group && drag.id !== id ? "before" : null),
    onDragStart: (e) => {
      e.dataTransfer.effectAllowed = "move";
      setDrag({ group, id });
    },
    onDragOver: (e) => {
      if (drag?.group === group) {
        e.preventDefault();
        setOver(id);
      }
    },
    onDragEnd: () => {
      setDrag(null);
      setOver(null);
    },
    onDrop: (e) => {
      e.preventDefault();
      if (drag?.group === group && drag.id !== id) {
        const n = ids.filter((x) => x !== drag.id);
        n.splice(n.indexOf(id), 0, drag.id);
        onReorder(group, n);
      }
      setDrag(null);
      setOver(null);
    }
  } : {};
}
function ProjectPill({ code: code2, current, color, onPress, pressLabel }) {
  const hue = useHue(color);
  const shown = hue && !current ? hue : void 0;
  if (onPress) return /* @__PURE__ */ jsx17("button", { type: "button", "aria-label": pressLabel ?? code2, onClick: (e) => {
    e.stopPropagation();
    onPress();
  }, className: cx("ad-project-pill", "ad-project-pill--press", current && "ad-project-pill--current"), style: shown ? { ["--ad-pill"]: shown } : void 0, "data-coloured": shown ? true : void 0, children: code2 });
  return /* @__PURE__ */ jsx17("span", { className: cx("ad-project-pill", current && "ad-project-pill--current"), style: shown ? { ["--ad-pill"]: shown } : void 0, "data-coloured": shown ? true : void 0, children: code2 });
}
function Rail({ foot = [], screens, projects, projectsScreen, current, onSelect, onHome, onSettings, onToggle, onReorder, labels: l = {} }) {
  const L = { home: "Home", settings: "Settings", expand: "Open the menu", menu: "Main", ...l };
  const movable = useMenuDrag(onReorder);
  const projectIds = projects.map((x) => x.id);
  const nested = !!projectsScreen && screens.some((x) => x.id === projectsScreen);
  const pills = projects.map((p) => /* @__PURE__ */ jsx17(MenuItem, { pill: { code: p.code, current: current === p.id, color: p.color }, label: p.name, ariaLabel: `${p.code} ${p.name}`, current: current === p.id, onPress: () => onSelect(p.id), itemProps: { ...dataOnly(p.hooks), ...movable("projects", p.id, projectIds) } }, p.id));
  return /* @__PURE__ */ jsxs14(MenuFrame, { rail: true, ariaLabel: L.menu, children: [
    /* @__PURE__ */ jsx17(MenuItem, { home: true, label: L.home, onPress: onHome }),
    /* @__PURE__ */ jsx17(MenuList, { children: screens.map((s) => /* @__PURE__ */ jsx17(MenuItem, { icon: s.icon, label: s.label, current: current === s.id, onPress: () => onSelect(s.id), itemProps: { ...dataOnly(s.hooks), ...movable("screens", s.id, screens.map((x) => x.id)) }, children: nested && projectsScreen === s.id && projects.length > 0 && /* @__PURE__ */ jsx17(MenuList, { form: "nested", children: pills }) }, s.id)) }),
    !nested && projects.length > 0 && /* @__PURE__ */ jsx17(MenuList, { form: "projects", children: pills }),
    /* @__PURE__ */ jsxs14(MenuFoot, { children: [
      foot.map((s) => /* @__PURE__ */ jsx17(MenuItem, { icon: s.icon, label: s.label, current: current === s.id, onPress: () => onSelect(s.id), itemProps: dataOnly(s.hooks) }, s.id)),
      /* @__PURE__ */ jsx17(MenuItem, { icon: "gear", label: L.settings, current: current === "settings", onPress: onSettings }),
      /* @__PURE__ */ jsx17("button", { type: "button", className: "ad-rail__item ad-rail__fold", "aria-label": L.expand, title: L.expand, "aria-expanded": "false", onClick: onToggle, children: /* @__PURE__ */ jsx17(Icon, { name: "caret-right" }) })
    ] })
  ] });
}
function SideMenu({ foot = [], screens, projects, views = [], current, onSelect, onHome, onSettings, onToggle, onReorder, projectsScreen, labels: l = {} }) {
  const L = { home: "Home", menu: "Main", settings: "Settings", fold: "Fold the menu", ...l };
  const movable = useMenuDrag(onReorder);
  const nested = !!projectsScreen && screens.some((x) => x.id === projectsScreen);
  const projectIds = projects.map((x) => x.id);
  const projectRows = projects.map((p) => /* @__PURE__ */ jsx17(MenuItem, { pill: { code: p.code, current: current === p.id, color: p.color }, label: p.name, current: current === p.id, onPress: () => onSelect(p.id), itemProps: { ...dataOnly(p.hooks), ...movable("projects", p.id, projectIds) } }, p.id));
  return /* @__PURE__ */ jsxs14(MenuFrame, { ariaLabel: L.menu, children: [
    /* @__PURE__ */ jsxs14(MenuList, { children: [
      /* @__PURE__ */ jsx17(MenuItem, { home: true, label: L.home, onPress: onHome }),
      screens.map((s) => /* @__PURE__ */ jsx17(MenuItem, { icon: s.icon, label: s.label, current: current === s.id, onPress: () => onSelect(s.id), itemProps: { ...dataOnly(s.hooks), ...movable("screens", s.id, screens.map((x) => x.id)) }, children: projectsScreen === s.id && projects.length > 0 && /* @__PURE__ */ jsx17(MenuList, { form: "nested", children: projectRows }) }, s.id))
    ] }),
    !nested && projects.length > 0 && /* @__PURE__ */ jsx17(MenuList, { children: projectRows }),
    views.length > 0 && /* @__PURE__ */ jsx17(MenuList, { children: views.map((v) => /* @__PURE__ */ jsx17(MenuItem, { icon: "star", label: v.label, current: current === v.id, onPress: () => onSelect(v.id), itemProps: dataOnly(v.hooks) }, v.id)) }),
    (foot.length > 0 || onSettings || onToggle) && /* @__PURE__ */ jsxs14(MenuFoot, { children: [
      foot.map((s) => /* @__PURE__ */ jsx17(MenuItem, { icon: s.icon, label: s.label, current: current === s.id, onPress: () => onSelect(s.id), itemProps: dataOnly(s.hooks) }, s.id)),
      onSettings && /* @__PURE__ */ jsx17(MenuItem, { icon: "gear", label: L.settings, current: current === "settings", onPress: onSettings }),
      onToggle && /* @__PURE__ */ jsx17("button", { type: "button", className: "ad-side__fold", "aria-label": L.fold, title: L.fold, "aria-expanded": "true", onClick: onToggle, children: /* @__PURE__ */ jsx17(Icon, { name: "caret-left" }) })
    ] })
  ] });
}

// src/components/Row/Row.tsx
import { Fragment as Fragment5, jsx as jsx18, jsxs as jsxs15 } from "react/jsx-runtime";
var Row = forwardRef5(function Row2({ name, meta, lead, status, dates, tags, people, trail, selected, picked, dragging, heading, onOpen, onRename, renameLabel, cells, className, onClick, ...rest }, ref) {
  const inList = useInList();
  const { compactRows } = useShow();
  const columns = useContext5(ListColumns);
  return /* @__PURE__ */ jsxs15(
    "div",
    {
      ref,
      role: inList ? "listitem" : void 0,
      ...rest,
      "data-selected": selected || void 0,
      "data-picked": picked || void 0,
      "data-dragging": dragging || void 0,
      onClick: (e) => {
        onClick?.(e);
        if (onOpen && !e.defaultPrevented && !fromControl(e)) onOpen();
      },
      className: cx("ad-row", meta != null && "ad-row--two", compactRows && "ad-row--compact", heading && "ad-row--heading", onOpen && "ad-row--opens", className),
      children: [
        lead != null && /* @__PURE__ */ jsx18("span", { className: "ad-row__lead", children: /* @__PURE__ */ jsx18(ButtonSizeScope, { size: "row", children: lead }) }),
        /* @__PURE__ */ jsxs15("span", { className: "ad-row__body", children: [
          onRename ? /* @__PURE__ */ jsx18(InlineEdit, { value: String(name), onCommit: onRename, ariaLabel: renameLabel ?? "Name", className: "ad-row__name" }) : onOpen ? /* @__PURE__ */ jsx18("button", { type: "button", className: "ad-row__name ad-open", "aria-current": selected || void 0, onClick: (e) => {
            e.stopPropagation();
            onOpen();
          }, children: name }) : /* @__PURE__ */ jsx18("span", { className: "ad-row__name", children: name }),
          meta != null && /* @__PURE__ */ jsx18("span", { className: "ad-row__meta", children: meta })
        ] }),
        status != null && typeof status === "object" && "label" in status && /* @__PURE__ */ jsx18("span", { className: "ad-row__status", children: /* @__PURE__ */ jsx18(Status, { tone: status.tone, label: String(status.label) }) }),
        dates != null && /* @__PURE__ */ jsx18("span", { className: "ad-row__dates", children: dates }),
        tags != null && /* @__PURE__ */ jsx18("span", { className: "ad-row__tags", children: tags }),
        people != null && /* @__PURE__ */ jsx18("span", { className: "ad-row__people", children: people }),
        trail != null && /* @__PURE__ */ jsx18("span", { className: "ad-row__trail", children: /* @__PURE__ */ jsx18(ButtonSizeScope, { size: "row", children: trail }) }),
        columns && /* @__PURE__ */ jsx18("span", { className: "ad-row__cells", children: columns.map((c) => /* @__PURE__ */ jsx18("span", { className: "ad-row__cell", style: { ["--ad-col"]: `${c.width}px` }, children: cells?.[c.id] }, c.id)) })
      ]
    }
  );
});
function RowPress({ label, onPress, children }) {
  return /* @__PURE__ */ jsx18("button", { type: "button", "aria-label": label, onClick: (e) => {
    e.stopPropagation();
    onPress(e.currentTarget);
  }, className: "ad-row__press", children });
}
function ItemDates({ review, deadline, today, done, repeat, labels }) {
  if (!review && !deadline) return null;
  return /* @__PURE__ */ jsxs15("span", { className: "ad-item-dates", children: [
    review && /* @__PURE__ */ jsx18(RowDate, { due: review, today, done, icon: "review date", what: labels?.review ?? "Review date", repeat }),
    deadline && /* @__PURE__ */ jsx18(RowDate, { due: deadline, today, done, icon: "deadline", what: labels?.deadline ?? "Due date", repeat: review ? void 0 : repeat })
  ] });
}
function RowDate({ due, today, until, done, milestone, what, icon, countdown: countdown2, repeat }) {
  if (countdown2) {
    const c = countdown(due, today, { done });
    if (!c.label) return null;
    return /* @__PURE__ */ jsxs15("span", { className: cx("ad-row-date", "ad-row-date--countdown", `ad-row-date--countdown-${countdown2}`, c.late && !milestone && "ad-row-date--late"), title: c.title, children: [
      icon && /* @__PURE__ */ jsx18("span", { "aria-hidden": "true", className: "ad-row-date__icon", children: slotIcon(icon, { size: "sm" }) }),
      what && /* @__PURE__ */ jsxs15("span", { className: "ad-sr", children: [
        what,
        ": "
      ] }),
      c.label
    ] });
  }
  const first = dueLabel(due, today);
  if (!first.label) return null;
  const last = until ? dueLabel(until, today) : null;
  const late = !milestone && isLate(due, today, { until, done });
  const isDueToday = !late && !done && !until && !!due && daysBetween(today, due) === 0;
  const words = last ? `${first.label} \u2013 ${last.label}` : first.label;
  const title = last ? `${first.title} \u2013 ${last.title}` : first.title;
  return /* @__PURE__ */ jsxs15("span", { className: cx("ad-row-date", late && "ad-row-date--late", isDueToday && "ad-row-date--today"), title: repeat ? `${title} \xB7 ${repeat}` : title, children: [
    icon && /* @__PURE__ */ jsx18("span", { "aria-hidden": "true", className: "ad-row-date__icon", children: slotIcon(icon, { size: "sm" }) }),
    what && /* @__PURE__ */ jsxs15("span", { className: "ad-sr", children: [
      what,
      ": "
    ] }),
    words,
    repeat && /* @__PURE__ */ jsx18("span", { className: "ad-row-date__icon ad-row-date__repeat", role: "img", "aria-label": repeat, children: slotIcon("repeat", { size: "sm" }) })
  ] });
}
var bareNumber = (text) => {
  const words = text.trim().split(/\s+/).filter(Boolean);
  return words.some((w) => /\d/.test(w)) && words.every((w) => /\d/.test(w) || /^[A-Z]{2,4}$/.test(w));
};
function RowFigure({ children, icon }) {
  const text = String(children);
  return /* @__PURE__ */ jsxs15("span", { className: cx("ad-row-date", bareNumber(text) && "ad-row-figure--number"), children: [
    icon && /* @__PURE__ */ jsx18("span", { "aria-hidden": "true", className: "ad-row-date__icon", children: slotIcon(icon, { size: "sm" }) }),
    text
  ] });
}
function TodoCheck({ hooks, checked, onChange, priority = 4, ariaLabel, disabled, unacknowledged, onAcknowledge, acknowledgeLabel }) {
  const data = hooks ? Object.fromEntries(Object.entries(hooks).filter(([n]) => n.startsWith("data-"))) : {};
  const [pop, setPop] = useState8(false);
  if (unacknowledged && !checked) {
    return /* @__PURE__ */ jsx18("button", { type: "button", ...data, "aria-label": acknowledgeLabel ?? ariaLabel, disabled, onClick: () => onAcknowledge?.(), className: cx("ad-todo-check", `ad-todo-check--p${priority}`, "ad-todo-check--asked") });
  }
  return /* @__PURE__ */ jsx18(
    "button",
    {
      type: "button",
      ...data,
      role: "checkbox",
      "aria-checked": checked,
      "aria-label": ariaLabel,
      disabled,
      onClick: () => {
        setPop(!checked);
        onChange(!checked);
      },
      onAnimationEnd: () => setPop(false),
      "data-pop": pop && checked || void 0,
      className: cx("ad-todo-check", `ad-todo-check--p${priority}`),
      children: /* @__PURE__ */ jsx18(Icon, { name: "check" })
    }
  );
}
function TodoRow({ ringProps, factProps, dragging, name, priority, done, onTick, due, review, deadline, today, dept, who, selected, onOpen, completeLabel = "Complete", unacknowledged, onAcknowledge, acknowledgeLabel = "Acknowledge", repeat, pastDeadline, pastDeadlineLabel = "Due date passed", role, deliverable, project, picking, onPressDate, onPressWho, onPressDeliverable, pressLabels, onRename, onPressProject, onPressDept, rowProps, cells, ring = true, whoMax }) {
  const d = (k) => factProps?.[k] ? Object.fromEntries(Object.entries(factProps[k]).filter(([n]) => n.startsWith("data-"))) : {};
  const roleWords = Array.isArray(role) ? role.join(" \xB7 ") : role;
  const dated = !!(review || deadline);
  const plain = dated ? /* @__PURE__ */ jsx18("span", { ...d("date"), className: "ad-row__fact-hook", children: /* @__PURE__ */ jsx18(ItemDates, { review, deadline, today, done, repeat }) }) : due ? /* @__PURE__ */ jsx18("span", { ...d("date"), className: "ad-row__fact-hook", children: /* @__PURE__ */ jsx18(RowDate, { due, today, done, icon: "calendar", repeat }) }) : null;
  const date = plain && onPressDate ? /* @__PURE__ */ jsx18(RowPress, { label: pressLabels?.date ?? "Change the date", onPress: onPressDate, children: plain }) : plain;
  const loneRepeat = repeat && !due && !dated ? /* @__PURE__ */ jsx18("span", { ...d("repeat"), className: "ad-row__fact", role: "img", "aria-label": String(repeat), title: String(repeat), children: /* @__PURE__ */ jsx18(Icon, { job: "repeat", size: "sm" }) }) : null;
  const extras = loneRepeat || pastDeadline || roleWords || deliverable;
  const meta = date || dept || extras ? /* @__PURE__ */ jsxs15(Fragment5, { children: [
    date,
    dept && /* @__PURE__ */ jsx18(Department, { dept: dept.dept, name: dept.name, onPress: onPressDept, pressLabel: pressLabels?.dept }),
    loneRepeat,
    pastDeadline && /* @__PURE__ */ jsx18("span", { ...d("pastDeadline"), className: "ad-row__fact ad-row__fact--late", role: "img", "aria-label": pastDeadlineLabel, children: /* @__PURE__ */ jsx18(Icon, { job: "flag", size: "sm" }) }),
    roleWords && /* @__PURE__ */ jsx18("span", { className: "ad-row__fact ad-row__fact--cut", title: roleWords, children: /* @__PURE__ */ jsx18("span", { className: "ad-row__fact-word", children: roleWords }) }),
    deliverable && (onPressDeliverable ? /* @__PURE__ */ jsx18(RowPress, { label: pressLabels?.deliverable ?? `Open ${deliverable}`, onPress: onPressDeliverable, children: /* @__PURE__ */ jsxs15("span", { className: "ad-row__fact ad-row__fact--cut", title: String(deliverable), children: [
      /* @__PURE__ */ jsx18(Icon, { job: "kind-deliverable", size: "sm" }),
      /* @__PURE__ */ jsx18("span", { className: "ad-row__fact-word", children: String(deliverable) })
    ] }) }) : /* @__PURE__ */ jsxs15("span", { ...d("deliverable"), className: "ad-row__fact ad-row__fact--cut", title: String(deliverable), children: [
      /* @__PURE__ */ jsx18(Icon, { job: "kind-deliverable", size: "sm" }),
      /* @__PURE__ */ jsx18("span", { className: "ad-row__fact-word", children: String(deliverable) })
    ] }))
  ] }) : void 0;
  return /* @__PURE__ */ jsx18(
    Row,
    {
      ...(() => {
        const { className: _c, style: _s, ...hooks } = rowProps ?? {};
        return hooks;
      })(),
      picked: picking?.picked,
      cells,
      onRename,
      renameLabel: onRename ? String(name) : void 0,
      dragging,
      lead: /* @__PURE__ */ jsxs15(Fragment5, { children: [
        picking && /* @__PURE__ */ jsx18(Checkbox, { "aria-label": picking.label ?? `Pick: ${name}`, checked: picking.picked, onChange: picking.onChange }),
        ring && /* @__PURE__ */ jsx18(TodoCheck, { hooks: ringProps, checked: done, onChange: onTick, priority, ariaLabel: `${completeLabel}: ${name}`, unacknowledged, onAcknowledge, acknowledgeLabel: `${acknowledgeLabel}: ${name}` })
      ] }),
      name: String(name),
      meta,
      people: who || project ? /* @__PURE__ */ jsxs15("span", { className: "ad-row__who", children: [
        who && (() => {
          const list = Array.isArray(who) ? who : [who];
          const faces = list.length > 1 ? /* @__PURE__ */ jsx18(AvatarStack, { people: list, max: whoMax }) : list[0] ? /* @__PURE__ */ jsx18(Avatar, { name: list[0].name, src: list[0].src }) : null;
          const hooked = /* @__PURE__ */ jsx18("span", { ...d("who"), className: "ad-row__fact-hook", children: faces });
          return onPressWho && faces ? /* @__PURE__ */ jsx18(RowPress, { label: pressLabels?.who ?? "Change who", onPress: onPressWho, children: hooked }) : hooked;
        })(),
        project && /* @__PURE__ */ jsx18("span", { ...d("project"), className: "ad-row__fact-hook", children: /* @__PURE__ */ jsx18(ProjectPill, { code: project.code, color: project.color, onPress: onPressProject, pressLabel: pressLabels?.project }) })
      ] }) : void 0,
      selected,
      onOpen
    }
  );
}

// src/components/List/List.tsx
import { Fragment as Fragment6, jsx as jsx19, jsxs as jsxs16 } from "react/jsx-runtime";
var InList2 = createContext5(false);
var ListColumns = createContext5(null);
function List({ children, ariaLabel, columns, className }) {
  const body = /* @__PURE__ */ jsx19("div", { className: cx("ad-list", className), role: "list", "aria-label": ariaLabel, children: /* @__PURE__ */ jsx19(InList2.Provider, { value: true, children }) });
  if (!columns || columns.columns.length === 0) return body;
  return /* @__PURE__ */ jsxs16("div", { className: "ad-list-columns", children: [
    /* @__PURE__ */ jsx19(ColumnHeadings, { ...columns }),
    /* @__PURE__ */ jsx19(ListColumns.Provider, { value: columns.columns, children: body })
  ] });
}
function ColumnHeadings({ columns, sort, onSort, onResize }) {
  const drag = (id, start, from) => (e) => {
    const el = e.currentTarget;
    el.setPointerCapture(e.pointerId);
    const move = (m) => onResize?.(id, Math.max(tokenPxList("--h-btn", 32) * 2, Math.round(start + m.clientX - from)));
    const up = () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", up);
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up);
  };
  return /* @__PURE__ */ jsxs16("div", { className: "ad-list-columns__head", role: "presentation", children: [
    /* @__PURE__ */ jsx19("span", { className: "ad-list-columns__spacer" }),
    columns.map((c) => {
      const sorted = sort?.id === c.id ? sort.direction : void 0;
      return /* @__PURE__ */ jsxs16("span", { className: "ad-list-columns__heading", style: { ["--ad-col"]: `${c.width}px` }, "aria-sort": sorted, children: [
        c.sortable && onSort ? /* @__PURE__ */ jsxs16("button", { type: "button", className: "ad-list-columns__sort ad-sort-button", onClick: () => onSort(c.id), children: [
          c.label,
          sorted && /* @__PURE__ */ jsx19(Icon, { name: sorted === "ascending" ? "arrow-up" : "arrow-down", size: "sm" })
        ] }) : /* @__PURE__ */ jsx19("span", { children: c.label }),
        onResize && /* @__PURE__ */ jsx19("span", { role: "separator", "aria-orientation": "vertical", "aria-label": `Resize ${c.label}`, className: "ad-list-columns__edge", onPointerDown: (e) => drag(c.id, c.width, e.clientX)(e) })
      ] }, c.id);
    })
  ] });
}
var tokenPxList = (name, fallback) => {
  if (typeof document === "undefined") return fallback;
  const v = parseFloat(getComputedStyle(document.documentElement).getPropertyValue(name));
  return Number.isFinite(v) ? v : fallback;
};
function useInList() {
  return useContext6(InList2);
}
function ListSection({ title, children, collapsible, collapsed, onCollapsedChange, day, bar, dropTarget, emptySentence, look, className, ...heading }) {
  const none = React.Children.count(children) === 0;
  const [own, setOwn] = useState9(!!collapsible && !heading.needsYou);
  useEffect7(() => {
    if (heading.needsYou) setOwn(false);
  }, [heading.needsYou]);
  const shut = collapsed ?? own;
  const bodyId = useId4();
  const toggle = () => {
    const next = !shut;
    setOwn(next);
    onCollapsedChange?.(next);
  };
  const inList = useInList();
  const bare = !day && !bar && (title == null || title === "");
  return /* @__PURE__ */ jsxs16("section", { role: inList ? "listitem" : void 0, className: cx("ad-section ad-list-section", look === "rule" && "ad-section--rule", dropTarget?.over && "ad-list-section--over", className), children: [
    day ? /* @__PURE__ */ jsx19(DayHeading, { day: day.day, today: day.today }) : bar ? /* @__PURE__ */ jsxs16("div", { className: "ad-list-section__bar", children: [
      collapsible && /* @__PURE__ */ jsx19("button", { type: "button", className: "ad-list-section__fold", "aria-expanded": !shut, "aria-controls": bodyId, "aria-label": bar.foldLabel ?? String(title), onClick: toggle, children: /* @__PURE__ */ jsx19(Icon, { job: shut ? "chevron-right" : "chevron-down", size: "sm" }) }),
      /* @__PURE__ */ jsx19(InList2.Provider, { value: false, children: /* @__PURE__ */ jsx19(Row, { heading: true, name: title, status: bar.status, dates: bar.dates, onOpen: bar.onOpen }) })
    ] }) : !bare && /* @__PURE__ */ jsx19(GroupHeading, { ...heading, collapsible, collapsed: shut, onToggle: toggle, controls: bodyId, children: title }),
    /* @__PURE__ */ jsxs16("div", { id: bodyId, role: "list", hidden: collapsible && !bare ? shut : void 0, className: cx("ad-list-section__body", bar && "ad-list-section__body--nested", (dropTarget?.empty || none) && "ad-list-section__body--empty"), children: [
      /* @__PURE__ */ jsx19(InList2.Provider, { value: true, children }),
      none && emptySentence && /* @__PURE__ */ jsx19("p", { className: "ad-list-section__empty", children: emptySentence })
    ] })
  ] });
}
function DayHeading({ day, today, level = 3, caption }) {
  const H = `h${level}`;
  const { name, date } = dayHeading(day, today);
  return /* @__PURE__ */ jsxs16(Fragment6, { children: [
    /* @__PURE__ */ jsxs16(H, { className: "ad-day-heading", children: [
      /* @__PURE__ */ jsx19("span", { className: "ad-day-heading__name", children: name }),
      /* @__PURE__ */ jsx19("span", { className: "ad-day-heading__date", children: date })
    ] }),
    caption != null && /* @__PURE__ */ jsx19("p", { className: "ad-day-heading__caption", children: caption })
  ] });
}
function AddRow({ label, onAdd, icon }) {
  const inList = useInList();
  const button = /* @__PURE__ */ jsxs16("button", { type: "button", className: "ad-add-row", onClick: onAdd, children: [
    /* @__PURE__ */ jsx19("span", { "aria-hidden": "true", className: "ad-add-row__icon", children: slotIcon(icon ?? "plus") }),
    label
  ] });
  return inList ? /* @__PURE__ */ jsx19("div", { role: "listitem", children: button }) : button;
}
var NAME_NOISE = [22, 17, 26];
var META_NOISE = [14, 10, 12];
var noise = (n, row, tick) => Array.from({ length: n }, (_, i) => {
  if (i % 6 === 5) return " ";
  const h = Math.imul((i + 1) * 2654435761 + (row + 1) * 40503 + tick * 97, 2246822519) >>> 0;
  return h >>> 13 & 1 ? "1" : "0";
}).join("");
function LoadingRows({ label, rows = 3, oneLine, delay }) {
  const [shown, setShown] = useState9(delay === 0);
  const [tick, setTick] = useState9(0);
  useEffect7(() => {
    if (shown) return;
    const t = setTimeout(() => setShown(true), delay ?? tokenMs("--delay-loading", 1e3));
    return () => clearTimeout(t);
  }, [shown, delay]);
  useEffect7(() => {
    if (!shown || window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setTick((n) => n + 1), tokenMs("--tick-scramble", 30) * 3);
    return () => clearInterval(t);
  }, [shown]);
  const inList = useInList();
  const box = /* @__PURE__ */ jsxs16("div", { className: "ad-loading", role: "status", "aria-busy": "true", "aria-label": label, children: [
    shown && /* @__PURE__ */ jsx19("span", { className: "ad-sr", children: label }),
    /* @__PURE__ */ jsx19(InList2.Provider, { value: false, children: shown && Array.from({ length: rows }, (_, i) => /* @__PURE__ */ jsx19(Row, { "aria-hidden": "true", className: "ad-loading-row", name: noise(NAME_NOISE[i % 3], i, tick), meta: oneLine ? void 0 : noise(META_NOISE[i % 3], i + rows, tick) }, i)) })
  ] });
  return inList ? /* @__PURE__ */ jsx19("div", { role: "listitem", children: box }) : box;
}
function LoadError({ sentence, onRetry, retryLabel = "Try again" }) {
  const inList = useInList();
  const box = /* @__PURE__ */ jsxs16("div", { className: "ad-empty ad-load-error", role: "alert", children: [
    /* @__PURE__ */ jsx19("p", { className: "ad-empty__sentence", children: sentence }),
    /* @__PURE__ */ jsx19(Button, { onClick: onRetry, children: retryLabel })
  ] });
  return inList ? /* @__PURE__ */ jsx19("div", { role: "listitem", children: box }) : box;
}

// src/components/EmptyState/EmptyState.tsx
import { Fragment as Fragment7, jsx as jsx20, jsxs as jsxs17 } from "react/jsx-runtime";
function EmptyState({ sentence, add, clear, also, className }) {
  const children = /* @__PURE__ */ jsxs17(Fragment7, { children: [
    add && /* @__PURE__ */ jsx20(AddRow, { label: add.label, onAdd: add.onAdd }),
    (clear || also) && /* @__PURE__ */ jsxs17("div", { className: "ad-empty__actions", children: [
      clear && /* @__PURE__ */ jsx20(Button, { onClick: clear.onClear, children: clear.label ?? "Clear" }),
      also && /* @__PURE__ */ jsx20(Button, { onClick: also.onPress, children: also.label })
    ] })
  ] });
  const inList = useInList();
  const box = /* @__PURE__ */ jsxs17("div", { className: cx("ad-empty", className), role: "status", children: [
    /* @__PURE__ */ jsx20("p", { className: "ad-empty__sentence", children: String(sentence) }),
    /* @__PURE__ */ jsx20(InList2.Provider, { value: false, children })
  ] });
  return inList ? /* @__PURE__ */ jsx20("div", { role: "listitem", children: box }) : box;
}

// src/components/Section/Section.tsx
import { createContext as createContext6, forwardRef as forwardRef6, useContext as useContext7, useId as useId5, useLayoutEffect as useLayoutEffect3, useRef as useRef9, useState as useState10 } from "react";
import { Fragment as Fragment8, jsx as jsx21, jsxs as jsxs18 } from "react/jsx-runtime";
var Ctx = createContext6(null);
function useSectionFrame() {
  const f = useContext7(Ctx);
  return f ? { level: f.level, numbering: f.numbering } : null;
}
function SectionFrame({ children, level, numbering, className, ...rest }) {
  const parent = useContext7(Ctx);
  const frameId = useId5();
  const value = {
    level: level ?? (parent ? Math.min(6, parent.level + 1) : 3),
    numbering: numbering ?? (parent ? "letters" : "numbers"),
    frameId
  };
  return /* @__PURE__ */ jsx21(Ctx.Provider, { value, children: /* @__PURE__ */ jsx21("div", { ...rest, "data-section-frame": frameId, className: cx("ad-section-frame", className), children }) });
}
var Section = forwardRef6(function Section2({ title, day, beside, children, className, bodyId, rule, needsYou, lead, end, help, collapsible, collapsed, onToggle, look, onMore, moreLabel = "More", ...rest }, ref) {
  const frame = useContext7(Ctx);
  if (!frame) throw new Error("Section: a section sits inside a SectionFrame; a heading on its own is a GroupHeading used as a label.");
  const own = useRef9(null);
  const [index, setIndex] = useState10(0);
  const madeId = useId5();
  const body = bodyId ?? madeId;
  const [shutOwn, setShutOwn] = useState10(!!collapsible && !needsYou);
  const shut = collapsed ?? shutOwn;
  const toggle = () => {
    setShutOwn(!shut);
    onToggle?.();
  };
  useLayoutEffect3(() => {
    const el = own.current;
    if (!el) return;
    const wrap = el.closest("[data-section-frame]");
    if (!wrap || wrap.getAttribute("data-section-frame") !== frame.frameId) return;
    const all = Array.from(wrap.querySelectorAll("[data-section]")).filter((s) => s.closest("[data-section-frame]") === wrap && s.getAttribute("data-section") !== "day");
    const next = all.indexOf(el);
    if (next !== index) setIndex(next);
  });
  const number = day ? void 0 : frame.numbering === "numbers" ? index + 1 : frame.numbering === "letters" ? String.fromCharCode(65 + index) : void 0;
  return /* @__PURE__ */ jsxs18(
    "section",
    {
      ...rest,
      ref: (el) => {
        own.current = el;
        if (typeof ref === "function") ref(el);
        else if (ref) ref.current = el;
      },
      "data-section": day ? "day" : "",
      "data-collapsed": collapsible ? String(shut) : void 0,
      className: cx("ad-section", look === "rule" && "ad-section--rule", className),
      children: [
        day ? /* @__PURE__ */ jsxs18("div", { className: "ad-section__day", children: [
          /* @__PURE__ */ jsx21(DayHeading, { day: day.day, today: day.today, level: frame.level === 2 ? 2 : frame.level === 3 ? 3 : 4 }),
          beside,
          end != null && /* @__PURE__ */ jsx21("span", { className: "ad-section__day-end", children: end })
        ] }) : /* @__PURE__ */ jsx21(GroupHeading, { number, level: frame.level, controls: collapsible ? body : void 0, rule, needsYou, lead, end: onMore ? /* @__PURE__ */ jsxs18(Fragment8, { children: [
          end,
          /* @__PURE__ */ jsx21("button", { type: "button", className: "ad-card__more", onClick: onMore, children: moreLabel })
        ] }) : end, help, collapsible, collapsed: shut, onToggle: toggle, children: title }),
        /* @__PURE__ */ jsx21("div", { id: body, className: "ad-section__body", hidden: collapsible ? shut : void 0, children })
      ]
    }
  );
});

// src/components/Popover/Popover.tsx
import { createContext as createContext7, useContext as useContext8, useId as useId6, useRef as useRef11, useState as useState12 } from "react";

// src/components/Writing/TokenInput.tsx
import { useEffect as useEffect8, useLayoutEffect as useLayoutEffect4, useRef as useRef10, useState as useState11 } from "react";
import { jsx as jsx22, jsxs as jsxs19 } from "react/jsx-runtime";
var CHIP = { project: "project", date: "calendar", deadline: "calendar", priority: "flag", person: "user", recurrence: "repeat", reminder: "bell" };
var DEPTS = /* @__PURE__ */ new Set(["lighting", "video", "eng", "sfx", "content", "scenic", "direction", "admin", "pm", "lasers"]);
function readTokens(value, read2) {
  if (read2.kind === "query") return queryTokens(value, read2.vocabulary);
  const { projects, sections } = read2.vocabulary;
  return parseTask(value, { today: read2.today, vocabulary: read2.vocabulary }).tokens.map((t) => {
    let icon;
    let resolved = t.meaning;
    if (t.kind === "project") resolved = projects.find((p) => p.id === t.id)?.name ?? t.meaning;
    if (t.kind === "section") {
      const name = sections.find((x) => x.id === t.id)?.name ?? t.meaning;
      resolved = name.charAt(0).toUpperCase() + name.slice(1);
      const dept = name.toLowerCase();
      if (DEPTS.has(dept)) icon = `dept-${dept}`;
    } else if (CHIP[t.kind]) icon = CHIP[t.kind];
    return { start: t.start, end: t.end, label: t.label, resolved, icon };
  });
}
var useIso = typeof window === "undefined" ? useEffect8 : useLayoutEffect4;
function readRaw(root) {
  let s = "";
  root.childNodes.forEach((n) => {
    if (n.nodeType === Node.TEXT_NODE) s += n.textContent ?? "";
    else if (n instanceof HTMLElement) s += n.dataset.raw ?? n.textContent ?? "";
  });
  return s.replace(/\u00a0/g, " ");
}
function caretOffset(root) {
  const sel = window.getSelection();
  if (!sel || !sel.rangeCount || !root.contains(sel.anchorNode)) return null;
  let off = 0;
  for (const n of Array.from(root.childNodes)) {
    if (n === sel.anchorNode || n.contains(sel.anchorNode)) {
      if (n.nodeType === Node.TEXT_NODE) return off + sel.anchorOffset;
      return off + (n.dataset.raw ?? "").length;
    }
    off += n.nodeType === Node.TEXT_NODE ? (n.textContent ?? "").length : (n.dataset.raw ?? n.textContent ?? "").length;
  }
  if (sel.anchorNode === root) {
    let o = 0;
    Array.from(root.childNodes).slice(0, sel.anchorOffset).forEach((n) => {
      o += n.nodeType === Node.TEXT_NODE ? (n.textContent ?? "").length : (n.dataset.raw ?? "").length;
    });
    return o;
  }
  return off;
}
function placeCaret(root, at) {
  const sel = window.getSelection();
  if (!sel) return;
  const range = document.createRange();
  let off = 0;
  for (const n of Array.from(root.childNodes)) {
    const len = n.nodeType === Node.TEXT_NODE ? (n.textContent ?? "").length : (n.dataset.raw ?? "").length;
    if (at <= off + len) {
      if (n.nodeType === Node.TEXT_NODE) range.setStart(n, at - off);
      else range.setStartAfter(n);
      range.collapse(true);
      sel.removeAllRanges();
      sel.addRange(range);
      return;
    }
    off += len;
  }
  range.selectNodeContents(root);
  range.collapse(false);
  sel.removeAllRanges();
  sel.addRange(range);
}
function TokenInput({ value, onChange, read: read2, onSubmit, label, placeholder, suggestions, lead, showResolved = true, onRemoveToken, removeLabel = "Remove", resolvedLabel = "Understood", onKeyDown: onKeys, className }) {
  const kind = read2.kind;
  const box = useRef10(null);
  const caret = useRef10(null);
  const blurred = useRef10(false);
  const composing = useRef10(false);
  const justComposed = useRef10(false);
  const [moved, setMoved] = useState11(0);
  const tokens = readTokens(value, read2);
  const refresh = (leaving = false) => {
    const el = box.current;
    if (!el) return;
    blurred.current = leaving;
    caret.current = leaving ? null : caretOffset(el);
    setMoved((n) => n + 1);
  };
  useIso(() => {
    const el = box.current;
    if (!el || composing.current) return;
    const at = blurred.current || document.activeElement !== el ? null : caret.current ?? caretOffset(el);
    const frag = document.createDocumentFragment();
    let i = 0;
    for (const t of tokens) {
      const live = at != null && at > t.start && at < t.end;
      if (live) continue;
      if (t.start > i) frag.append(document.createTextNode(value.slice(i, t.start)));
      const pill = document.createElement("span");
      pill.className = "ad-token";
      pill.contentEditable = "false";
      pill.dataset.raw = value.slice(t.start, t.end);
      pill.textContent = t.label;
      frag.append(pill);
      i = t.end;
    }
    if (i < value.length) frag.append(document.createTextNode(value.slice(i)));
    el.replaceChildren(frag);
    if (at != null) placeCaret(el, at);
    caret.current = null;
  }, [value, moved]);
  const onInput = () => {
    const el = box.current;
    if (!el || composing.current) return;
    caret.current = caretOffset(el);
    onChange(readRaw(el));
  };
  const onKeyDown2 = (e) => {
    if (e.nativeEvent.isComposing || composing.current || e.keyCode === 229 || justComposed.current) return;
    onKeys?.(e);
    if (e.defaultPrevented) return;
    if (e.key === "Enter") {
      e.preventDefault();
      onSubmit?.(value);
    }
  };
  return /* @__PURE__ */ jsxs19("div", { className: cx("ad-token-input", `ad-token-input--${kind}`, className), children: [
    /* @__PURE__ */ jsxs19("div", { className: "ad-token-input__field", onClick: (e) => {
      if (e.target === e.currentTarget) box.current?.focus();
    }, children: [
      lead && /* @__PURE__ */ jsx22("span", { className: "ad-token-input__lead", children: lead }),
      /* @__PURE__ */ jsx22(
        "div",
        {
          ref: box,
          role: "textbox",
          "aria-label": label,
          "aria-multiline": "false",
          contentEditable: true,
          suppressContentEditableWarning: true,
          "data-empty": value ? void 0 : "",
          "data-placeholder": placeholder ?? label,
          spellCheck: kind === "todo",
          className: "ad-token-input__box",
          onInput,
          onCompositionStart: () => {
            composing.current = true;
          },
          onCompositionEnd: () => {
            composing.current = false;
            justComposed.current = true;
            setTimeout(() => {
              justComposed.current = false;
            }, 0);
            onInput();
          },
          onKeyDown: onKeyDown2,
          onKeyUp: (e) => {
            if (e.key.startsWith("Arrow") || e.key === "Home" || e.key === "End") refresh();
          },
          onMouseUp: () => refresh(),
          onFocus: () => {
            blurred.current = false;
          },
          onBlur: () => refresh(true),
          onPaste: (e) => {
            e.preventDefault();
            document.execCommand("insertText", false, e.clipboardData.getData("text/plain").replace(/\n/g, " "));
          }
        }
      )
    ] }),
    suggestions,
    showResolved && tokens.length > 0 && /* @__PURE__ */ jsx22("div", { className: "ad-token-input__resolved", role: "group", "aria-label": resolvedLabel, children: tokens.map((t, i) => /* @__PURE__ */ jsx22(
      FilterTag,
      {
        size: "row",
        icon: t.icon,
        value: t.resolved ?? t.label,
        removeLabel: `${removeLabel} ${t.resolved ?? t.label}`,
        onRemove: () => {
          if (onRemoveToken) return onRemoveToken(t, i);
          const before = value.slice(0, t.start).replace(/\s+$/, "");
          const after = value.slice(t.end).replace(/^\s+/, "");
          onChange(before && after ? `${before} ${after}` : before + after);
        }
      },
      i
    )) })
  ] });
}

// src/components/keyScroll.ts
import { useLayoutEffect as useLayoutEffect5 } from "react";
var REACHABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]), [contenteditable="true"]';
function useKeyScroll(ref) {
  useLayoutEffect5(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => {
      const over = el.scrollHeight > el.clientHeight + 1 || el.scrollWidth > el.clientWidth + 1;
      if (over && !el.querySelector(REACHABLE)) el.tabIndex = 0;
      else el.removeAttribute("tabindex");
    };
    update();
    const ro = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(update);
    ro?.observe(el);
    for (const c of Array.from(el.children)) ro?.observe(c);
    const mo = typeof MutationObserver === "undefined" ? null : new MutationObserver(update);
    mo?.observe(el, { childList: true, subtree: true });
    return () => {
      ro?.disconnect();
      mo?.disconnect();
    };
  }, [ref]);
}

// src/components/Popover/Popover.tsx
import { Fragment as Fragment9, jsx as jsx23, jsxs as jsxs20 } from "react/jsx-runtime";
var TitleId = createContext7(void 0);
function CloseButton({ onClose, label = "Close" }) {
  return /* @__PURE__ */ jsx23("button", { type: "button", className: "ad-close", "aria-label": label, title: label, onClick: onClose });
}
function Popover({ open, onClose, anchor: given, at, within, placement = "drop", width = "card", ariaLabel, noClose, closeLabel, keepFocus, id, children, foot, className }) {
  const box = useRef11(null);
  const mark = useRef11(null);
  const anchor = at ? mark : given;
  const coarse = useCoarsePointer();
  const style = usePlacement(open, anchor, box, within && coarse ? "foot" : placement, within);
  const z = useLayer(open, onClose, [box, anchor]);
  useFocusReturn(open && !keepFocus, box, "box");
  if (!open) return null;
  return /* @__PURE__ */ jsxs20(Portal, { children: [
    at && /* @__PURE__ */ jsx23("span", { ref: mark, "aria-hidden": "true", className: "ad-menu__at", style: { left: at.x, top: at.y } }),
    /* @__PURE__ */ jsx23(PopoverCard, { cardRef: box, id, onClose, width, ariaLabel, noClose, closeLabel, foot, className: cx("ad-popover--placed", className), style: { ...style, zIndex: z }, children })
  ] });
}
function PopoverCard({ onClose, width = "card", ariaLabel, noClose, closeLabel, id, header, children, rail, foot, sheet, style, cardRef, cardProps, className }) {
  const titleId = useId6();
  const { className: _c, style: _s, ...hooks } = cardProps ?? {};
  const framed = header != null || rail != null || foot != null;
  const pos = {};
  if (style) {
    for (const k of ["position", "top", "left", "right", "bottom", "inset", "maxHeight", "zIndex", "visibility"]) if (style[k] !== void 0) pos[k] = style[k];
  }
  return /* @__PURE__ */ jsxs20(
    "div",
    {
      ...hooks,
      ref: cardRef,
      id,
      role: "dialog",
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabel ? void 0 : titleId,
      tabIndex: -1,
      style: pos,
      className: cx("ad-float", "ad-popover", `ad-popover--${width}`, framed && "ad-popover--with-foot", rail != null && "ad-popover--rail", sheet && "ad-popover--sheet", className),
      children: [
        !noClose && /* @__PURE__ */ jsx23(CloseButton, { onClose, label: closeLabel }),
        /* @__PURE__ */ jsx23(TitleId.Provider, { value: titleId, children: !framed ? children : /* @__PURE__ */ jsxs20(Fragment9, { children: [
          header != null && /* @__PURE__ */ jsx23("div", { className: "ad-popover__head", children: header }),
          rail != null ? /* @__PURE__ */ jsxs20("div", { className: "ad-popover__cols", children: [
            /* @__PURE__ */ jsx23(Body, { children }),
            /* @__PURE__ */ jsx23(Body, { rail: true, children: rail })
          ] }) : /* @__PURE__ */ jsx23(Body, { children })
        ] }) }),
        foot != null && /* @__PURE__ */ jsx23("div", { className: "ad-popover__foot", children: /* @__PURE__ */ jsx23(ButtonSizeScope, { size: "row", children: foot }) })
      ]
    }
  );
}
function Body({ rail, children }) {
  const ref = useRef11(null);
  useKeyScroll(ref);
  return /* @__PURE__ */ jsx23("div", { ref, className: cx("ad-popover__body", rail && "ad-popover__rail"), children });
}
function PopoverHeader({ eyebrow, title, chip, lead, description, onRename, renameLabel, action, read: read2, suggestions }) {
  const own = useId6();
  const [draft, setDraft] = useState12(null);
  const id = useContext8(TitleId) ?? own;
  return /* @__PURE__ */ jsxs20("header", { className: "ad-popover__header", children: [
    eyebrow && /* @__PURE__ */ jsx23("div", { id: title == null ? id : void 0, className: "ad-popover__eyebrow ad-type-heading", children: eyebrow }),
    chip != null && /* @__PURE__ */ jsx23("div", { className: "ad-popover__chip", children: chip }),
    (title != null || lead != null || action != null) && /* @__PURE__ */ jsxs20("div", { className: "ad-popover__title-row", children: [
      lead,
      title != null && /* @__PURE__ */ jsx23("h2", { id, className: "ad-popover__title ad-type-title", children: onRename && read2 ? /* @__PURE__ */ jsx23("span", { className: "ad-popover__title-read", onBlur: () => {
        if (draft != null && draft !== String(title)) onRename(draft);
        setDraft(null);
      }, children: /* @__PURE__ */ jsx23(TokenInput, { value: draft ?? String(title), onChange: setDraft, read: read2, onSubmit: (v) => {
        if (v !== String(title)) onRename(v);
        setDraft(null);
      }, label: renameLabel ?? "Name", suggestions }) }) : onRename ? /* @__PURE__ */ jsx23(InlineEdit, { size: "title", value: String(title), onCommit: onRename, ariaLabel: renameLabel ?? "Name" }) : title }),
      action && /* @__PURE__ */ jsx23("span", { className: "ad-popover__action", children: /* @__PURE__ */ jsx23(ButtonSizeScope, { size: "row", children: action }) })
    ] }),
    description && /* @__PURE__ */ jsx23("p", { className: "ad-popover__description", children: description })
  ] });
}
function Facts({ children }) {
  return /* @__PURE__ */ jsx23("div", { className: "ad-facts", role: "list", children });
}
function Fact({ icon, label, children, full }) {
  return /* @__PURE__ */ jsxs20("div", { role: "listitem", className: cx("ad-facts__cell", full && "ad-facts__cell--full"), title: label, children: [
    icon && /* @__PURE__ */ jsx23("span", { className: "ad-facts__icon", "aria-hidden": "true", children: slotIcon(icon, { size: "sm" }) }),
    label && /* @__PURE__ */ jsxs20("span", { className: "ad-sr", children: [
      label,
      ": "
    ] }),
    /* @__PURE__ */ jsx23(ButtonSizeScope, { size: "row", children })
  ] });
}
function PopoverSection({ label, children, end, collapsible, collapsed, onToggle }) {
  const [own, setOwn] = useState12(false);
  const shut = collapsed ?? own;
  const bodyId = useId6();
  const toggle = () => {
    const next = !shut;
    setOwn(next);
    onToggle?.(next);
  };
  const headed = label != null || end != null || collapsible;
  return /* @__PURE__ */ jsxs20("section", { className: "ad-popover__section", children: [
    headed && /* @__PURE__ */ jsxs20("div", { className: "ad-popover__section-head", children: [
      collapsible && /* @__PURE__ */ jsx23("button", { type: "button", className: "ad-popover__section-fold", "aria-expanded": !shut, "aria-controls": bodyId, "aria-label": label != null ? String(label) : "Section", onClick: toggle, children: /* @__PURE__ */ jsx23(Icon, { job: shut ? "chevron-right" : "chevron-down", size: "sm" }) }),
      label != null && /* @__PURE__ */ jsx23("h3", { className: "ad-popover__section-label ad-type-heading", children: label }),
      end != null && /* @__PURE__ */ jsx23("div", { className: "ad-popover__section-end", children: end })
    ] }),
    /* @__PURE__ */ jsx23("div", { id: bodyId, className: "ad-popover__section-body", hidden: collapsible ? shut : void 0, children })
  ] });
}
function PressCard({ label, trigger, width, foot, children }) {
  const from = useRef11(null);
  const [open, setOpen] = useState12(false);
  const close = () => setOpen(false);
  return /* @__PURE__ */ jsxs20(Fragment9, { children: [
    /* @__PURE__ */ jsx23(RowPress, { label, onPress: (b) => {
      from.current = b;
      setOpen((o) => !o);
    }, children: trigger }),
    /* @__PURE__ */ jsx23(Popover, { open, onClose: close, anchor: from, width, ariaLabel: label, foot, children: typeof children === "function" ? children(close) : children })
  ] });
}
function EditorCard({ open, onClose, anchor: given, at, kind, title, lead, chip, sub, action, onRename, renameLabel, read: read2, suggestions, head, rail, foot, noClose, closeLabel, cardProps, children }) {
  const box = useRef11(null);
  const mark = useRef11(null);
  const anchor = at ? mark : given;
  const phone = useIsPhone();
  const style = usePlacement(open && !phone, anchor, box, "side");
  const z = useLayer(open, onClose, [box, anchor]);
  useFocusReturn(open, box, "box");
  if (!open) return null;
  const words = onRename && typeof title === "string" ? { title, onRename, renameLabel, read: read2, suggestions } : { title };
  return /* @__PURE__ */ jsxs20(Portal, { children: [
    at && /* @__PURE__ */ jsx23("span", { ref: mark, "aria-hidden": "true", className: "ad-menu__at", style: { left: at.x, top: at.y } }),
    /* @__PURE__ */ jsxs20(
      PopoverCard,
      {
        cardRef: box,
        onClose,
        noClose,
        closeLabel,
        ariaLabel: title == null ? kind : void 0,
        width: rail != null ? "wide" : "card",
        sheet: phone,
        style: phone ? { position: "fixed", inset: 0, zIndex: z } : { ...style, zIndex: z },
        cardProps,
        foot,
        rail: phone ? void 0 : rail,
        header: /* @__PURE__ */ jsx23(PopoverHeader, { eyebrow: kind, chip, lead, description: sub, action, ...words }),
        children: [
          head,
          phone && rail,
          children
        ]
      }
    )
  ] });
}

// src/components/Dialog/Dialog.tsx
import { useId as useId7, useRef as useRef12 } from "react";
import { Fragment as Fragment10, jsx as jsx24, jsxs as jsxs21 } from "react/jsx-runtime";
var hooksOf = (a) => Object.fromEntries(Object.entries(a).filter(([k]) => k.startsWith("data-")));
function Dialog({ open, onClose, title, children, body, actions, role = "dialog", width = "dialog", closeLabel, blur, className }) {
  const box = useRef12(null);
  const titleId = useId7();
  const bodyId = useId7();
  const z = useLayer(open, onClose, [box], "dialog");
  usePageInert(open, [box]);
  useFocusReturn(open, box, "box");
  if (!open) return null;
  return /* @__PURE__ */ jsxs21(Portal, { children: [
    /* @__PURE__ */ jsx24("div", { className: cx("ad-scrim", blur && "ad-scrim--blur"), "aria-hidden": "true", style: { zIndex: z - 1 } }),
    /* @__PURE__ */ jsxs21(
      "div",
      {
        ref: box,
        role,
        "aria-modal": "true",
        "aria-labelledby": titleId,
        "aria-describedby": children ? bodyId : void 0,
        tabIndex: -1,
        style: { zIndex: z },
        onKeyDown: (e) => trapTab(e, box.current),
        className: cx("ad-float", "ad-dialog", `ad-dialog--${width}`, body != null && "ad-dialog--rich", className),
        children: [
          /* @__PURE__ */ jsx24(CloseButton, { onClose, label: closeLabel }),
          /* @__PURE__ */ jsx24("h2", { id: titleId, className: "ad-dialog__title", children: String(title) }),
          children && /* @__PURE__ */ jsx24("div", { id: bodyId, className: "ad-dialog__body", children: String(children) }),
          body != null && /* @__PURE__ */ jsx24("div", { className: "ad-dialog__rich", children: body }),
          Array.isArray(actions) && actions.length > 0 && (() => {
            const shown = [...actions.filter((a) => !a.main), ...actions.filter((a) => a.main).slice(0, 1)];
            const reasons = shown.filter((a) => a.disabled && a.disabledReason).map((a) => a.disabledReason);
            return /* @__PURE__ */ jsxs21(Fragment10, { children: [
              reasons.length > 0 && /* @__PURE__ */ jsx24("p", { className: "ad-dialog__reason", children: reasons.join(" ") }),
              /* @__PURE__ */ jsx24("div", { className: "ad-dialog__actions", children: shown.map((a) => {
                const b = /* @__PURE__ */ jsx24(Button, { ...hooksOf(a), block: true, variant: a.main ? "main" : "quiet", danger: a.tone === "danger", disabled: a.disabled, onClick: a.onSelect, children: a.label }, a.label);
                return a.tip ? /* @__PURE__ */ jsx24(Tooltip, { text: a.tip, children: b }, a.label) : b;
              }) })
            ] });
          })()
        ]
      }
    )
  ] });
}
function ConfirmDialog({ open, act, thing, detail, onConfirm, onKeep, labels: l = {}, confirmDisabled, disabledReason, confirmHooks, keepHooks }) {
  return /* @__PURE__ */ jsx24(
    Dialog,
    {
      open,
      onClose: onKeep,
      role: "alertdialog",
      title: `${act} ${thing}?`,
      actions: [{ ...keepHooks, label: `${l.keep ?? "Keep"} ${thing}`, onSelect: onKeep }, { ...confirmHooks, label: `${act} ${thing}`, onSelect: onConfirm, main: true, disabled: confirmDisabled, disabledReason }],
      children: `${detail} ${l.cannotUndo ?? "This can\u2019t be undone."}`
    }
  );
}

// src/components/Menu/Menu.tsx
import { useEffect as useEffect9, useId as useId8, useRef as useRef13, useState as useState13 } from "react";
import { Fragment as Fragment11, jsx as jsx25, jsxs as jsxs22 } from "react/jsx-runtime";
var TYPE_GAP = 700;
var isItem = (i) => i.kind !== "separator" && i.kind !== "heading";
function ordered(items) {
  const danger = items.filter((i) => isItem(i) && i.danger);
  const rest = items.filter((i) => !isItem(i) || !i.danger);
  const all = danger.length ? [...rest, { kind: "separator", id: "__danger" }, ...danger] : rest;
  return all.filter((i, n) => i.kind !== "separator" || n > 0 && n < all.length - 1 && all[n - 1].kind !== "separator" && all[n - 1].kind !== "heading");
}
function MenuRow({ item, i, lit, keepCursor, focusable, onEnter, onChoose }) {
  const { triggerProps, node } = useTooltip(item.tip);
  return /* @__PURE__ */ jsxs22(Fragment11, { children: [
    /* @__PURE__ */ jsxs22(
      "button",
      {
        ...Object.fromEntries(Object.entries(item.hooks ?? {}).filter(([k]) => k.startsWith("data-"))),
        type: "button",
        role: item.checked != null ? "menuitemcheckbox" : "menuitem",
        "aria-checked": item.checked,
        "aria-description": item.sub,
        "aria-disabled": item.disabled || void 0,
        "aria-describedby": triggerProps["aria-describedby"],
        tabIndex: !keepCursor && focusable ? 0 : -1,
        "data-index": i,
        "data-active": lit || void 0,
        onPointerEnter: (e) => {
          triggerProps.onPointerEnter(e);
          onEnter();
        },
        onPointerLeave: triggerProps.onPointerLeave,
        onFocus: triggerProps.onFocus,
        onBlur: triggerProps.onBlur,
        onMouseEnter: onEnter,
        onClick: (e) => {
          if (item.disabled && item.tip) triggerProps.onClick(e);
          onChoose();
        },
        className: cx("ad-menu__item", item.danger && "ad-menu__item--danger", item.sub && "ad-menu__item--two"),
        children: [
          (item.icon || item.face || item.pill || item.dot) && /* @__PURE__ */ jsx25("span", { className: "ad-menu__icon", "aria-hidden": "true", children: item.face ? /* @__PURE__ */ jsx25(Avatar, { name: item.face.name, src: item.face.src, size: "sm", decorative: true }) : item.pill ? /* @__PURE__ */ jsx25(ProjectPill, { code: item.pill.code, color: item.pill.color }) : item.dot ? /* @__PURE__ */ jsx25(Dot, { tone: item.dot }) : slotIcon(item.icon) }),
          item.sub ? /* @__PURE__ */ jsxs22("span", { className: "ad-menu__words", children: [
            /* @__PURE__ */ jsx25("span", { className: "ad-menu__label ad-clamp-line", children: item.label }),
            /* @__PURE__ */ jsx25("span", { className: "ad-menu__sub", children: item.sub })
          ] }) : /* @__PURE__ */ jsx25("span", { className: "ad-menu__label ad-clamp-line", children: item.label }),
          item.shortcut && /* @__PURE__ */ jsx25("kbd", { className: "ad-menu__shortcut", children: item.shortcut }),
          item.checked && /* @__PURE__ */ jsx25("span", { className: "ad-menu__check", "aria-hidden": "true", children: /* @__PURE__ */ jsx25(Icon, { job: "check", size: "sm" }) })
        ]
      }
    ),
    node
  ] });
}
function Menu({ open, onClose, anchor: given_anchor, at: point, items: given, ariaLabel, placement = "drop", keepCursor, active, onActiveChange, className }) {
  const items = ordered(given);
  const box = useRef13(null);
  const mark = useRef13(null);
  const anchor = point ? mark : given_anchor;
  const headId = useId8();
  const style = usePlacement(open, anchor, box, placement);
  const z = useLayer(open, onClose, [box, anchor]);
  const live = items.filter((i) => isItem(i) && !i.disabled);
  const [at, setAt] = useState13(0);
  const typed = useRef13({ word: "", at: 0 });
  const doc = useFloatingDocument() ?? document;
  useEffect9(() => {
    if (!open || keepCursor) return;
    setAt(0);
    const before = doc.activeElement;
    return () => {
      if (before && doc.contains(before)) before.focus({ preventScroll: true });
    };
  }, [open]);
  useEffect9(() => {
    if (!open || keepCursor) return;
    const id = requestAnimationFrame(() => box.current?.querySelector(`[data-index="${at}"]`)?.focus({ preventScroll: true }));
    return () => cancelAnimationFrame(id);
  }, [open, at]);
  if (!open) return null;
  const lit = keepCursor ? active ?? 0 : at;
  const choose = (i) => {
    const item = live[i];
    if (!item) return;
    if (!item.keepOpen) onClose();
    item.onSelect();
  };
  const onKeyDown2 = (e) => {
    const n = nextIndex(e.key, at, live.length);
    if (n != null) {
      e.preventDefault();
      setAt(n);
      return;
    }
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      choose(at);
      return;
    }
    if (e.key === "Tab") {
      onClose();
      return;
    }
    if (e.key.length === 1 && /\S/.test(e.key)) {
      const k = e.key.toLowerCase();
      const now = Date.now();
      const word = now - typed.current.at < TYPE_GAP ? typed.current.word + k : k;
      typed.current = { word, at: now };
      const same = [...word].every((c) => c === k);
      const from = word.length > 1 && !same ? 0 : 1;
      const seek = same ? k : word;
      for (let s = from; s <= live.length; s++) {
        const j = (at + s) % live.length;
        if (live[j].label.toLowerCase().startsWith(seek)) {
          setAt(j);
          break;
        }
      }
    }
  };
  let index = -1;
  const row = (item) => {
    const i = item.disabled ? -1 : ++index;
    return /* @__PURE__ */ jsx25(
      MenuRow,
      {
        item,
        i,
        lit: i >= 0 && i === lit,
        keepCursor,
        focusable: i === at,
        onEnter: () => {
          if (i < 0) return;
          if (keepCursor) onActiveChange?.(i);
          else setAt(i);
        },
        onChoose: () => {
          if (i >= 0) choose(i);
        }
      },
      item.id
    );
  };
  const body = [];
  for (let n = 0; n < items.length; n++) {
    const e = items[n];
    if (e.kind === "separator") {
      body.push(/* @__PURE__ */ jsx25("div", { role: "separator", className: "ad-menu__separator" }, e.id));
      continue;
    }
    if (e.kind === "heading") {
      const members = [];
      while (n + 1 < items.length && isItem(items[n + 1])) members.push(items[++n]);
      const hid = `${headId}-${e.id}`;
      body.push(
        /* @__PURE__ */ jsxs22("div", { role: "group", "aria-labelledby": hid, className: "ad-menu__group", children: [
          /* @__PURE__ */ jsx25("div", { id: hid, className: "ad-group-heading ad-menu__heading", children: /* @__PURE__ */ jsx25("span", { className: "ad-group-heading__title", children: e.label }) }),
          members.map(row)
        ] }, e.id)
      );
      continue;
    }
    body.push(row(e));
  }
  return /* @__PURE__ */ jsxs22(Portal, { children: [
    point && /* @__PURE__ */ jsx25("span", { ref: mark, "aria-hidden": "true", className: "ad-menu__at", style: { left: point.x, top: point.y } }),
    /* @__PURE__ */ jsx25(
      "div",
      {
        ref: box,
        role: "menu",
        "aria-label": ariaLabel,
        style: { ...style, zIndex: z },
        onKeyDown: keepCursor ? void 0 : onKeyDown2,
        onMouseDown: keepCursor ? (e) => e.preventDefault() : void 0,
        className: cx("ad-float", "ad-menu", className),
        children: body
      }
    )
  ] });
}

// src/components/Pickers/PickList.tsx
import { useId as useId9, useLayoutEffect as useLayoutEffect6, useMemo, useRef as useRef14, useState as useState14 } from "react";
import { Fragment as Fragment12, jsx as jsx26, jsxs as jsxs23 } from "react/jsx-runtime";
function PickList({ options, value, onPick, searchLabel, noMatch = "Nothing matches", noSearch, query, onQuery, footer, className }) {
  const [own, setOwn] = useState14("");
  const q = query ?? own;
  const setQ = (v) => {
    setOwn(v);
    onQuery?.(v);
  };
  const listId = useId9();
  const picked = new Set(value == null ? [] : Array.isArray(value) ? value : [value]);
  const many = Array.isArray(value);
  const shown = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (onQuery) return options;
    return options.filter((o) => !s || `${o.label} ${o.keywords ?? ""}`.toLowerCase().includes(s));
  }, [options, q, onQuery]);
  const live = shown.filter((o) => !o.disabled);
  const start = Math.max(0, live.findIndex((o) => picked.has(o.id)));
  const [at, setAt] = useState14(start);
  const cur = live[Math.min(at, live.length - 1)];
  const listRef = useRef14(null);
  const layerRef = useRef14(null);
  const [hover, setHover] = useState14(null);
  const optId = (o) => `${listId}-${o.id}`;
  useLayoutEffect6(() => {
    const frame = listRef.current, layer = layerRef.current;
    if (!frame || !layer) return;
    const place = () => {
      const items = Array.from(layer.children);
      const at2 = (el) => frame.querySelector(`[data-ad-anchor="${CSS.escape(el.dataset.adFor ?? "")}"]`);
      for (const el of items) {
        const a = at2(el);
        if (a && el.dataset.adGrow) a.style.height = `${el.offsetHeight}px`;
      }
      for (const el of items) {
        const a = at2(el);
        if (a) el.style.top = `${a.offsetTop}px`;
      }
    };
    place();
    if (typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(place);
    ro.observe(frame);
    for (const c of Array.from(layer.children)) ro.observe(c);
    return () => ro.disconnect();
  });
  const move = (i) => {
    setAt(i);
    requestAnimationFrame(() => listRef.current?.querySelector(`[data-active]`)?.scrollIntoView({ block: "nearest" }));
  };
  const onKeyDown2 = (e) => {
    if (e.target.closest?.(".ad-picklist__layer, .ad-picklist__footer")) return;
    const n = nextIndex(e.key, Math.min(at, live.length - 1), live.length);
    if (n != null && (e.key === "ArrowDown" || e.key === "ArrowUp" || noSearch)) {
      e.preventDefault();
      move(n);
      return;
    }
    if (e.key === "Enter" && cur) {
      e.preventDefault();
      onPick(cur.id);
    }
  };
  const row = (o, layer) => {
    const control = (node, cls) => /* @__PURE__ */ jsx26("span", { className: cx(cls, layer ? "ad-picklist__control" : "ad-picklist__place"), children: node });
    return /* @__PURE__ */ jsxs23(Fragment12, { children: [
      many && /* @__PURE__ */ jsx26("span", { className: "ad-checkbox__box", "data-state": picked.has(o.id) ? "on" : "off", "aria-hidden": "true", children: picked.has(o.id) && /* @__PURE__ */ jsx26(Icon, { name: "check" }) }),
      o.leadControl != null ? control(o.leadControl, "ad-picklist__lead") : o.lead != null && /* @__PURE__ */ jsx26("span", { className: "ad-picklist__lead", children: o.lead }),
      /* @__PURE__ */ jsx26("span", { className: "ad-picklist__label ad-clamp-line", children: o.label }),
      o.hintControl != null ? control(o.hintControl, "ad-picklist__hint") : o.hint != null && /* @__PURE__ */ jsx26("span", { className: "ad-picklist__hint", children: o.hint }),
      !many && picked.has(o.id) && /* @__PURE__ */ jsx26("span", { className: "ad-picklist__check", "aria-hidden": "true", children: /* @__PURE__ */ jsx26(Icon, { name: "check", size: "sm" }) })
    ] });
  };
  let lastGroup;
  return /* @__PURE__ */ jsxs23("div", { className: cx("ad-picklist", className), onKeyDown: onKeyDown2, children: [
    !noSearch && /* @__PURE__ */ jsxs23("div", { className: "ad-picklist__search", children: [
      /* @__PURE__ */ jsx26(Icon, { name: "magnifying-glass" }),
      /* @__PURE__ */ jsx26(
        "input",
        {
          "data-autofocus": true,
          role: "combobox",
          "aria-expanded": "true",
          "aria-controls": listId,
          "aria-activedescendant": cur ? optId(cur) : void 0,
          "aria-autocomplete": "list",
          "aria-label": searchLabel,
          placeholder: searchLabel,
          value: q,
          onChange: (e) => {
            setQ(e.target.value);
            setAt(0);
          }
        }
      )
    ] }),
    /* @__PURE__ */ jsxs23("div", { ref: listRef, className: "ad-picklist__list", children: [
      /* @__PURE__ */ jsxs23("div", { id: listId, role: "listbox", "aria-label": searchLabel, tabIndex: noSearch ? 0 : -1, "data-autofocus": noSearch || void 0, "aria-activedescendant": noSearch && cur ? optId(cur) : void 0, "aria-multiselectable": Array.isArray(value) || void 0, className: "ad-picklist__box", children: [
        shown.length === 0 && /* @__PURE__ */ jsx26("div", { className: "ad-picklist__empty", children: noMatch }),
        shown.map((o) => {
          const head = o.group && o.group !== lastGroup ? o.group : null;
          lastGroup = o.group;
          const active = o === cur;
          return /* @__PURE__ */ jsxs23("div", { role: "presentation", children: [
            head && /* @__PURE__ */ jsx26("div", { className: "ad-picklist__group", role: "presentation", children: head }),
            /* @__PURE__ */ jsx26(
              "div",
              {
                ...o.rowProps,
                id: optId(o),
                role: "option",
                "aria-selected": picked.has(o.id),
                "aria-disabled": o.disabled || void 0,
                "data-active": active || void 0,
                "data-hover": hover === o.id || void 0,
                "data-ad-anchor": `${o.id}:row`,
                onPointerMove: () => {
                  const i = live.indexOf(o);
                  if (i >= 0 && i !== at) setAt(i);
                },
                onClick: () => !o.disabled && onPick(o.id),
                className: "ad-picklist__option",
                children: row(o, false)
              }
            ),
            o.actions != null && picked.has(o.id) && /* @__PURE__ */ jsx26("div", { "aria-hidden": "true", "data-ad-anchor": `${o.id}:actions` })
          ] }, o.id);
        })
      ] }),
      /* @__PURE__ */ jsx26("div", { ref: layerRef, className: "ad-picklist__layer", children: shown.map((o) => [
        (o.leadControl != null || o.hintControl != null) && /* @__PURE__ */ jsx26(
          "div",
          {
            "data-ad-for": `${o.id}:row`,
            "data-hover": hover === o.id || void 0,
            className: "ad-picklist__over",
            onPointerEnter: () => setHover(o.id),
            onPointerLeave: () => setHover((h) => h === o.id ? null : h),
            children: row(o, true)
          },
          `${o.id}:row`
        ),
        o.actions != null && picked.has(o.id) && /* @__PURE__ */ jsx26("div", { "data-ad-for": `${o.id}:actions`, "data-ad-grow": "true", role: "group", "aria-label": o.label, className: "ad-picklist__actions", children: /* @__PURE__ */ jsx26(ButtonSizeScope, { size: "row", children: o.actions }) }, `${o.id}:actions`)
      ]) })
    ] }),
    footer != null && /* @__PURE__ */ jsx26("div", { className: "ad-picklist__footer", children: footer })
  ] });
}

// src/components/Pickers/Pickers.tsx
import { cloneElement as cloneElement2, isValidElement as isValidElement2, useRef as useRef15, useState as useState15 } from "react";
import { Fragment as Fragment13, jsx as jsx27, jsxs as jsxs24 } from "react/jsx-runtime";
function PersonPicker({ people, open, anchor, onClose, header, ...rest }) {
  const list = /* @__PURE__ */ jsx27(PickList, { ...rest, options: people.map((p) => ({ id: p.id, label: p.name, keywords: p.email, lead: /* @__PURE__ */ jsx27(Avatar, { name: p.name, initials: p.initials, src: p.src }) })) });
  ;
  if (!anchor) return list;
  return /* @__PURE__ */ jsxs24(Popover, { open: open ?? true, onClose: onClose ?? (() => {
  }), anchor, placement: "drop", noClose: true, ariaLabel: rest.searchLabel, children: [
    header && /* @__PURE__ */ jsx27(PopoverHeader, { title: header.title, description: header.description }),
    list
  ] });
}
function ProjectPicker({ projects, ...rest }) {
  return /* @__PURE__ */ jsx27(PickList, { ...rest, options: projects.map((p) => ({ id: p.id, label: p.name, keywords: p.code, lead: /* @__PURE__ */ jsx27(ProjectPill, { code: p.code }) })) });
}
function StatusPicker({ statuses, noSearch = true, open, anchor, onClose, header: _h, ...rest }) {
  if (anchor) return /* @__PURE__ */ jsx27(Menu, { open: open ?? true, onClose: onClose ?? (() => {
  }), anchor, ariaLabel: rest.searchLabel, items: statuses.map((s) => ({ id: s.id, label: s.label, dot: s.tone ?? "neutral", checked: s.id === rest.value, onSelect: () => rest.onPick(s.id) })) });
  return /* @__PURE__ */ jsx27(PickList, { ...rest, noSearch, options: statuses.map((s) => ({ id: s.id, label: s.label, lead: /* @__PURE__ */ jsx27(Dot, { tone: s.tone }), hint: s.hint })) });
}
function PickField({ options, value, onPick, label, placeholder, header, icon, search, disabled, className, trigger, marks, footer, typed, onTyped }) {
  const [open, setOpen] = useState15(false);
  const [draft, setDraft] = useState15(null);
  const anchor = useRef15(null);
  const box = useRef15(null);
  const style = usePlacement(open, anchor, box, "drop");
  const opener = () => (anchor.current?.matches("button, [tabindex]") ? anchor.current : anchor.current?.querySelector("button, [tabindex], input")) ?? null;
  const close = () => {
    setOpen(false);
    opener()?.focus({ preventScroll: true });
  };
  const z = useLayer(open, close, [box, anchor]);
  const many = Array.isArray(value);
  const picked = options.filter((o) => many ? value.includes(o.id) : o.id === value);
  const face = picked.length === 1 ? picked[0] : null;
  const cap = marks === true ? 3 : typeof marks === "number" && marks > 0 ? Math.floor(marks) : 0;
  const asMarks = cap > 0 && picked.length > 1;
  const words = picked.map((o) => o.label).join(", ");
  const foot = typeof footer === "function" ? footer(close) : footer;
  const list = open && /* @__PURE__ */ jsx27(Portal, { children: /* @__PURE__ */ jsxs24("div", { ref: box, style: { ...style, zIndex: z }, className: "ad-float ad-pick-field__list", children: [
    header && /* @__PURE__ */ jsx27("div", { className: "ad-pick-field__head", children: /* @__PURE__ */ jsx27(PopoverHeader, { title: header.title, description: header.description }) }),
    /* @__PURE__ */ jsx27(
      PickList,
      {
        options,
        value,
        searchLabel: label,
        noSearch: !(search ?? options.length > 8),
        footer: foot,
        onPick: (id) => {
          onPick(id);
          if (!many) close();
        }
      }
    )
  ] }) });
  if (typed) {
    const words2 = draft ?? words;
    const narrowed = draft ? options.filter((o) => String(o.label).toLowerCase().includes(draft.trim().toLowerCase())) : options;
    return /* @__PURE__ */ jsxs24(Fragment13, { children: [
      /* @__PURE__ */ jsxs24("span", { ref: anchor, className: cx("ad-field", "ad-pick-field", "ad-pick-field--typed", disabled && "ad-field--disabled", className), children: [
        icon && /* @__PURE__ */ jsx27(Icon, { job: icon, size: "md", className: "ad-pick-field__icon" }),
        /* @__PURE__ */ jsx27(
          "input",
          {
            className: "ad-field__input",
            role: "combobox",
            "aria-label": label,
            "aria-haspopup": "listbox",
            "aria-expanded": open,
            disabled,
            placeholder: placeholder ?? label,
            value: words2,
            onChange: (e) => {
              setDraft(e.target.value);
              setOpen(true);
            },
            onClick: () => setOpen(true),
            onKeyDown: (e) => {
              if (e.key === "Enter" && draft?.trim()) {
                e.preventDefault();
                onTyped?.(draft.trim());
                setDraft(null);
                setOpen(false);
              }
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setOpen(true);
                requestAnimationFrame(() => box.current?.querySelector('[role="listbox"]')?.focus());
              }
            }
          }
        ),
        /* @__PURE__ */ jsx27(Icon, { name: "caret-down", className: "ad-pick-field__caret ad-glyph-quiet" })
      ] }),
      open && narrowed.length > 0 && /* @__PURE__ */ jsx27(Portal, { children: /* @__PURE__ */ jsx27("div", { ref: box, style: { ...style, zIndex: z }, className: "ad-float ad-pick-field__list", children: /* @__PURE__ */ jsx27(PickList, { options: narrowed, value, searchLabel: label, noSearch: true, footer: foot, onPick: (id) => {
        onPick(id);
        setDraft(null);
        close();
      } }) }) })
    ] });
  }
  if (trigger && isValidElement2(trigger)) {
    const own = trigger;
    return /* @__PURE__ */ jsxs24(Fragment13, { children: [
      /* @__PURE__ */ jsx27(
        "span",
        {
          ref: anchor,
          className: "ad-pick-field__trigger",
          onClickCapture: (e) => {
            if (!disabled && e.target.closest?.(".ad-row__press")) setOpen((o) => !o);
          },
          onClick: (e) => {
            if (!disabled && !e.defaultPrevented) setOpen((o) => !o);
          },
          children: cloneElement2(own, { "aria-haspopup": "listbox", "aria-expanded": open })
        }
      ),
      list
    ] });
  }
  return /* @__PURE__ */ jsxs24(Fragment13, { children: [
    /* @__PURE__ */ jsxs24(
      "button",
      {
        ref: anchor,
        type: "button",
        "aria-label": label,
        "aria-haspopup": "listbox",
        "aria-expanded": open,
        disabled,
        onClick: () => setOpen((o) => !o),
        className: cx("ad-field", "ad-pick-field", disabled && "ad-field--disabled", className),
        children: [
          icon && /* @__PURE__ */ jsx27(Icon, { job: icon, size: "md", className: "ad-pick-field__icon" }),
          face?.lead != null && /* @__PURE__ */ jsx27("span", { className: "ad-pick-field__lead", "aria-hidden": "true", children: face.lead }),
          asMarks ? /* @__PURE__ */ jsx27("span", { className: "ad-pick-field__words ad-clamp-line", title: words, children: /* @__PURE__ */ jsxs24("span", { className: "ad-pick-field__marks", "aria-hidden": "true", children: [
            picked.slice(0, cap).map((o) => /* @__PURE__ */ jsx27("span", { className: "ad-pick-field__mark", children: o.lead ?? /* @__PURE__ */ jsx27(Dot, {}) }, o.id)),
            picked.length > cap && /* @__PURE__ */ jsx27("span", { className: "ad-pick-field__more", children: "\u2026" })
          ] }) }) : /* @__PURE__ */ jsx27("span", { className: cx("ad-pick-field__words", "ad-clamp-line", picked.length === 0 && "ad-pick-field__words--empty"), children: picked.length ? words : placeholder ?? label }),
          /* @__PURE__ */ jsx27(Icon, { name: "caret-down", className: "ad-pick-field__caret ad-glyph-quiet" })
        ]
      }
    ),
    list
  ] });
}

// src/components/Pickers/DatePicker.tsx
import { useEffect as useEffect10, useId as useId10, useMemo as useMemo2, useRef as useRef16, useState as useState16 } from "react";
import { jsx as jsx28, jsxs as jsxs25 } from "react/jsx-runtime";
var EN = { today: "Today", tomorrow: "Tomorrow", nextWeek: "Next week", inTwoWeeks: "In two weeks", previousMonth: "Previous month", nextMonth: "Next month", noDate: "No date", repeat: "Repeat" };
function DroppedDatePicker({ open, anchor, onClose, repeatEditor, backLabel, ...picker }) {
  const [repeating, setRepeating] = useState16(false);
  const stay = repeating && repeatEditor != null;
  return /* @__PURE__ */ jsx28(
    Popover,
    {
      open: open ?? true,
      onClose: onClose ?? (() => {
      }),
      anchor,
      placement: "drop",
      width: "fit",
      noClose: true,
      ariaLabel: stay ? picker.labels?.repeat ?? EN.repeat : backLabel ?? "Date",
      foot: stay ? /* @__PURE__ */ jsx28(Button, { onClick: () => setRepeating(false), children: backLabel ?? "Back" }) : void 0,
      children: stay ? repeatEditor : /* @__PURE__ */ jsx28(DatePickerBody, { ...picker, repeat: picker.repeat && (repeatEditor != null ? { ...picker.repeat, onPress: () => setRepeating(true) } : picker.repeat) })
    }
  );
}
function DatePicker(props) {
  return props.anchor ? /* @__PURE__ */ jsx28(DroppedDatePicker, { ...props }) : /* @__PURE__ */ jsx28(DatePickerBody, { ...props });
}
function DatePickerBody({ value, onChange, today: todayIn, weekStart = 1, locale = "en-US", labels: l, quickPicks, shadeWeekends = true, onClear, repeat, openOn, dayMarks, marksKey, className }) {
  const labels = { ...EN, ...l };
  const today = dayOf(todayIn);
  const [focus, setFocus] = useState16(dayOf(value ?? openOn ?? today));
  const grid = useRef16(null);
  const moved = useRef16(false);
  const said = (words, fallback) => readDate(words, today, { weekStart })?.date ?? fallback;
  const nextWeekStart = said("next week", nextWeekday(today, weekStart, { forceNext: true }));
  const picks = quickPicks ?? [
    { id: "today", label: labels.today, date: today },
    { id: "tomorrow", label: labels.tomorrow, date: addDays(today, 1) },
    { id: "next-week", label: labels.nextWeek, date: nextWeekStart },
    { id: "two-weeks", label: labels.inTwoWeeks, date: said("in 2 weeks", addDays(today, 14)) }
  ];
  const pickDate = (d) => {
    const wd = d.toLocaleDateString(locale, { weekday: "short" });
    return sameDay(d, today) ? wd : `${wd} ${d.getDate()}`;
  };
  const first = new Date(focus.getFullYear(), focus.getMonth(), 1);
  const lead = (first.getDay() - weekStart + 7) % 7;
  const start = addDays(first, -lead);
  const weeks = Math.ceil((lead + new Date(focus.getFullYear(), focus.getMonth() + 1, 0).getDate()) / 7);
  const days = useMemo2(() => Array.from({ length: weeks * 7 }, (_, i) => addDays(start, i)), [formatISO(start), weeks]);
  const weekdays = days.slice(0, 7).map((d) => ({ short: d.toLocaleDateString(locale, { weekday: "narrow" }), long: d.toLocaleDateString(locale, { weekday: "long" }) }));
  const monthName = first.toLocaleDateString(locale, { month: "long", year: "numeric" });
  useEffect10(() => {
    if (!moved.current) return;
    grid.current?.querySelector(`[data-key="${formatISO(focus)}"]`)?.focus({ preventScroll: true });
  }, [focus]);
  const go = (d) => {
    moved.current = true;
    setFocus(dayOf(d));
  };
  const onGridKey = (e) => {
    const map = {
      ArrowLeft: () => addDays(focus, -1),
      ArrowRight: () => addDays(focus, 1),
      ArrowUp: () => addDays(focus, -7),
      ArrowDown: () => addDays(focus, 7),
      PageUp: () => addMonthsClamped(focus, -1),
      PageDown: () => addMonthsClamped(focus, 1),
      Home: () => addDays(focus, -((focus.getDay() - weekStart + 7) % 7)),
      End: () => addDays(focus, 6 - (focus.getDay() - weekStart + 7) % 7)
    };
    if (map[e.key]) {
      e.preventDefault();
      go(map[e.key]());
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onChange(focus);
    }
  };
  return /* @__PURE__ */ jsxs25("div", { className: cx("ad-datepicker", className), children: [
    /* @__PURE__ */ jsxs25("div", { className: "ad-datepicker__quick", children: [
      picks.map((p) => /* @__PURE__ */ jsxs25("button", { type: "button", className: "ad-datepicker__pick", "aria-pressed": sameDay(value, p.date), onClick: () => onChange(dayOf(p.date)), children: [
        /* @__PURE__ */ jsx28("span", { children: p.label }),
        /* @__PURE__ */ jsx28("span", { className: "ad-datepicker__pick-date", children: pickDate(p.date) })
      ] }, p.id)),
      onClear && /* @__PURE__ */ jsx28("button", { type: "button", className: "ad-datepicker__pick", "aria-pressed": value == null, onClick: onClear, children: /* @__PURE__ */ jsx28("span", { children: labels.noDate }) })
    ] }),
    /* @__PURE__ */ jsxs25("div", { className: "ad-datepicker__month", children: [
      /* @__PURE__ */ jsx28("span", { className: "ad-datepicker__month-name", "aria-live": "polite", children: monthName }),
      /* @__PURE__ */ jsxs25("span", { className: "ad-datepicker__navs", children: [
        /* @__PURE__ */ jsx28("button", { type: "button", className: "ad-datepicker__nav ad-glyph-button", "aria-label": labels.previousMonth, onClick: () => go(addMonthsClamped(focus, -1)), children: /* @__PURE__ */ jsx28(Icon, { name: "caret-left" }) }),
        /* @__PURE__ */ jsx28("button", { type: "button", className: "ad-datepicker__nav ad-glyph-button", "aria-label": labels.nextMonth, onClick: () => go(addMonthsClamped(focus, 1)), children: /* @__PURE__ */ jsx28(Icon, { name: "caret-right" }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxs25("div", { ref: grid, role: "grid", "aria-label": monthName, className: "ad-datepicker__grid", onKeyDown: onGridKey, children: [
      /* @__PURE__ */ jsx28("div", { role: "row", className: "ad-datepicker__week", children: weekdays.map((w, i) => /* @__PURE__ */ jsx28("span", { role: "columnheader", "aria-label": w.long, className: "ad-datepicker__dow", children: w.short }, i)) }),
      Array.from({ length: weeks }, (_, r) => r).map((r) => /* @__PURE__ */ jsx28("div", { role: "row", className: "ad-datepicker__week", children: days.slice(r * 7, r * 7 + 7).map((d) => {
        const wk = d.getDay() === 0 || d.getDay() === 6;
        return /* @__PURE__ */ jsx28("span", { role: "gridcell", "aria-selected": sameDay(d, value), children: /* @__PURE__ */ jsxs25(
          "button",
          {
            type: "button",
            "data-key": formatISO(d),
            tabIndex: sameDay(d, focus) ? 0 : -1,
            "aria-label": d.toLocaleDateString(locale, { weekday: "long", month: "long", day: "numeric", year: "numeric" }),
            "aria-current": sameDay(d, today) ? "date" : void 0,
            "data-outside": d.getMonth() !== focus.getMonth() || void 0,
            "data-weekend": shadeWeekends && wk || void 0,
            "data-picked": sameDay(d, value) || void 0,
            onClick: () => {
              setFocus(d);
              onChange(d);
            },
            className: "ad-datepicker__day",
            children: [
              d.getDate(),
              dayMarks && (() => {
                const m = dayMarks(d);
                return m != null ? /* @__PURE__ */ jsx28("span", { className: "ad-datepicker__mark", "aria-hidden": "true", children: m }) : null;
              })()
            ]
          }
        ) }, formatISO(d));
      }) }, r))
    ] }),
    marksKey != null && /* @__PURE__ */ jsx28("div", { className: "ad-datepicker__key", children: marksKey }),
    repeat && /* @__PURE__ */ jsxs25("button", { type: "button", className: "ad-datepicker__repeat", onClick: (e) => repeat.onPress(e.currentTarget), children: [
      /* @__PURE__ */ jsx28(Icon, { name: "repeat", size: "sm" }),
      /* @__PURE__ */ jsx28("span", { children: labels.repeat }),
      /* @__PURE__ */ jsx28("span", { className: "ad-datepicker__pick-date", children: repeat.words })
    ] })
  ] });
}
function DateField({ onParsed, label, text: given, onText, format, icon, disabled, due, done, className, value, onChange, ...picker }) {
  const fmt = format ?? ((d) => monoDate(d));
  const read2 = (t) => {
    const r = readDate(t, picker.today, { weekStart: picker.weekStart });
    return r && { date: r.date, readback: r.readback, extra: r.recurrence };
  };
  const [own, setOwn] = useState16(value ? fmt(value) : "");
  const text = given ?? own;
  const setText = (t) => {
    if (given === void 0) setOwn(t);
    onText?.(t);
  };
  const [open, setOpen] = useState16(false);
  const dropId = useId10();
  const anchor = useRef16(null);
  const drop = useRef16(null);
  const input = useRef16(null);
  const say = (d) => {
    setText(d ? fmt(d) : "");
    onChange(d);
  };
  useEffect10(() => {
    if (given === void 0) setOwn(value ? fmt(value) : "");
  }, [value?.getTime()]);
  const result = text && (!value || text !== fmt(value)) ? read2(text) : null;
  return /* @__PURE__ */ jsxs25("span", { ref: anchor, className: cx("ad-datefield", className), children: [
    /* @__PURE__ */ jsx28(
      TextField,
      {
        ref: input,
        className: value && text === fmt(value) ? cx("ad-datefield__field--date", due && isLate(value, picker.today, { done }) && "ad-datefield__field--late") : void 0,
        icon,
        "aria-label": label,
        placeholder: label,
        value: text,
        role: "combobox",
        "aria-haspopup": "dialog",
        "aria-expanded": open,
        "aria-controls": open ? dropId : void 0,
        parsed: result ? result.readback : void 0,
        disabled,
        onChange: (e) => setText(e.target.value),
        onClick: () => {
          if (!disabled) setOpen(true);
        },
        onKeyDown: (e) => {
          if (e.key === "ArrowDown") {
            e.preventDefault();
            setOpen(true);
            requestAnimationFrame(() => requestAnimationFrame(() => drop.current?.querySelector(".ad-datepicker__pick")?.focus()));
          }
          if (e.key === "Enter" && result) {
            e.preventDefault();
            onParsed?.(result);
            if (result.date) say(result.date);
            setOpen(false);
          }
        }
      }
    ),
    /* @__PURE__ */ jsx28(Popover, { open: open && !disabled, onClose: () => {
      const d = input.current?.ownerDocument ?? document;
      const a = d.activeElement;
      if (!a || a === d.body || drop.current?.contains(a)) input.current?.focus({ preventScroll: true });
      setOpen(false);
    }, anchor, noClose: true, keepFocus: true, ariaLabel: label, id: dropId, className: "ad-datefield__drop", children: /* @__PURE__ */ jsx28("div", { ref: drop, children: /* @__PURE__ */ jsx28(DatePicker, { ...picker, repeat: picker.repeat && { ...picker.repeat, onPress: () => {
      setOpen(false);
      picker.repeat.onPress(input.current);
    } }, value, onChange: (d) => {
      say(d);
      setOpen(false);
      input.current?.focus({ preventScroll: true });
    } }) }) })
  ] });
}

// src/components/Pickers/TimeField.tsx
import { useEffect as useEffect11, useRef as useRef17, useState as useState17 } from "react";
import { jsx as jsx29, jsxs as jsxs26 } from "react/jsx-runtime";
function TimeField({ value, onChange, label, step = 30, bareHoursArePm, className }) {
  const shown = value == null ? "" : formatTimeOfDay(value);
  const [text, setText] = useState17(shown);
  const [open, setOpen] = useState17(false);
  const anchor = useRef17(null);
  useEffect11(() => setText(shown), [shown]);
  const read2 = text.trim() && text !== shown ? parseTimeOfDay(text, void 0, { bareHoursArePm }) : null;
  const commit = () => {
    if (read2 != null) onChange(read2);
    else if (!text.trim()) onChange(null);
    else setText(shown);
  };
  const times = Array.from({ length: Math.floor(24 * 60 / step) }, (_, i) => i * step);
  return /* @__PURE__ */ jsxs26("span", { ref: anchor, className: cx("ad-timefield", className), children: [
    /* @__PURE__ */ jsx29(
      TextField,
      {
        mono: true,
        icon: "clock",
        "aria-label": label,
        placeholder: label,
        value: text,
        role: "combobox",
        "aria-haspopup": "listbox",
        "aria-expanded": open,
        parsed: read2 != null ? formatTimeOfDay(read2).toLowerCase() : void 0,
        onChange: (e) => setText(e.target.value),
        onFocus: () => setOpen(true),
        onClick: () => setOpen(true),
        onBlur: commit,
        onKeyDown: (e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            commit();
            setOpen(false);
          }
        }
      }
    ),
    /* @__PURE__ */ jsx29(Popover, { open, onClose: () => setOpen(false), anchor, noClose: true, keepFocus: true, ariaLabel: label, className: "ad-timefield__drop", children: /* @__PURE__ */ jsx29(
      PickList,
      {
        noSearch: true,
        searchLabel: label,
        value: value == null ? null : String(value),
        options: times.map((m) => ({ id: String(m), label: formatTimeOfDay(m) })),
        onPick: (id) => {
          onChange(Number(id));
          setOpen(false);
        }
      }
    ) })
  ] });
}

// src/components/Card/Card.tsx
import { createContext as createContext8, forwardRef as forwardRef7, useContext as useContext9, useState as useState18 } from "react";
import { jsx as jsx30, jsxs as jsxs27 } from "react/jsx-runtime";
var OpenCard = createContext8(void 0);
var Card = forwardRef7(function Card2({ title, onMore, moreLabel = "More", children, onOpen, selected, dragging, picking, size = "tile", className, onClick, ...rest }, ref) {
  return /* @__PURE__ */ jsxs27(
    "div",
    {
      ref,
      ...rest,
      "data-selected": selected || void 0,
      "data-dragging": dragging || void 0,
      "data-picked": picking?.picked || void 0,
      onClick: (e) => {
        onClick?.(e);
        if (onOpen && !e.defaultPrevented && !fromControl(e)) onOpen();
      },
      className: cx("ad-card", `ad-card--${size}`, onOpen && "ad-card--opens", className),
      children: [
        (title != null || onMore != null) && /* @__PURE__ */ jsxs27("div", { className: "ad-card__head", children: [
          title != null && /* @__PURE__ */ jsx30("h3", { className: "ad-card__title ad-type-heading", children: onOpen ? /* @__PURE__ */ jsx30("button", { type: "button", className: "ad-card__title-open", onClick: (e) => {
            e.stopPropagation();
            onOpen();
          }, children: title }) : title }),
          onMore != null && /* @__PURE__ */ jsx30("button", { type: "button", className: "ad-card__more", onClick: (e) => {
            e.stopPropagation();
            onMore();
          }, children: moreLabel })
        ] }),
        picking && /* @__PURE__ */ jsx30("span", { className: "ad-card__pick", children: /* @__PURE__ */ jsx30(Checkbox, { "aria-label": picking.label, checked: picking.picked, onChange: picking.onChange }) }),
        /* @__PURE__ */ jsx30(OpenCard.Provider, { value: onOpen, children })
      ]
    }
  );
});
function CardName({ children, lead, onRename, renameLabel }) {
  const open = useContext9(OpenCard);
  const name = onRename ? /* @__PURE__ */ jsx30(InlineEdit, { value: String(children), onCommit: onRename, ariaLabel: renameLabel ?? "Name", className: "ad-card__name" }) : open ? /* @__PURE__ */ jsx30("button", { type: "button", className: "ad-card__name ad-open", onClick: (e) => {
    e.stopPropagation();
    open();
  }, children }) : /* @__PURE__ */ jsx30("div", { className: "ad-card__name", children });
  return lead != null ? /* @__PURE__ */ jsxs27("div", { className: "ad-card__name-row", children: [
    /* @__PURE__ */ jsx30("span", { className: "ad-card__lead", children: lead }),
    name
  ] }) : name;
}
function Dials({ children }) {
  return /* @__PURE__ */ jsx30("div", { className: "ad-card__dials", children });
}
function CardGrid({ children, columns = 3, className, style, ...rest }) {
  return /* @__PURE__ */ jsx30("div", { ...rest, style: { ...style, "--ad-cols": columns }, className: cx("ad-card-grid", className), children });
}
function Picture({ src, alt, ...rest }) {
  const [failed, setFailed] = useState18(null);
  const said = typeof alt === "string" ? alt.trim() : "";
  const shown = !!src && !!said && failed !== src;
  return /* @__PURE__ */ jsx30("span", { ...rest, className: "ad-picture", children: shown && /* @__PURE__ */ jsx30("img", { className: "ad-picture__img", src, alt: said, onError: () => setFailed(src) }) });
}

// src/components/PageHeader/PageHeader.tsx
import { useId as useId12, useRef as useRef19, useState as useState20 } from "react";

// src/components/ShowOptions/ShowOptions.tsx
import { useRef as useRef18, useState as useState19 } from "react";

// src/components/Settings/Settings.tsx
import { useId as useId11 } from "react";
import { jsx as jsx31, jsxs as jsxs28 } from "react/jsx-runtime";
function SettingsLayout({ nav, title, children, className }) {
  return /* @__PURE__ */ jsxs28("div", { className: cx("ad-settings", className), children: [
    nav,
    /* @__PURE__ */ jsxs28("div", { className: "ad-settings__pane", children: [
      title != null && /* @__PURE__ */ jsx31("h2", { className: "ad-settings__title ad-type-title", children: title }),
      children
    ] })
  ] });
}
function SettingsNav({ children, ariaLabel }) {
  return /* @__PURE__ */ jsx31("nav", { className: "ad-settings__nav", "aria-label": ariaLabel, children });
}
function SettingsNavItem({ icon, face, label, current, onSelect }) {
  return /* @__PURE__ */ jsxs28("button", { type: "button", className: "ad-settings__nav-item", "aria-current": current ? "page" : void 0, onClick: onSelect, children: [
    (face || icon) && /* @__PURE__ */ jsx31("span", { "aria-hidden": "true", className: "ad-settings__nav-icon", children: face ? /* @__PURE__ */ jsx31(Avatar, { name: face.name, src: face.src, decorative: true }) : slotIcon(icon) }),
    label
  ] });
}
function SettingsSection({ title, help, number, fold, children }) {
  const rows = useId11();
  return /* @__PURE__ */ jsxs28("section", { className: "ad-section ad-settings__section", "data-collapsed": fold ? String(fold.collapsed) : void 0, children: [
    /* @__PURE__ */ jsx31(GroupHeading, { number, help, collapsible: !!fold, collapsed: fold?.collapsed, onToggle: fold?.onToggle, controls: rows, children: title }),
    /* @__PURE__ */ jsx31("div", { className: "ad-settings__rows", id: rows, hidden: fold?.collapsed || void 0, children })
  ] });
}
function SettingRow(props) {
  return /* @__PURE__ */ jsx31(FieldRow, { ...props, className: cx("ad-setting", props.className) });
}
function SettingParams({ children, className, ...rest }) {
  return /* @__PURE__ */ jsx31("div", { ...rest, className: cx("ad-setting-params", className), children });
}
function AccessRow({ face, name, className, ...rest }) {
  return /* @__PURE__ */ jsx31(FieldRow, { ...rest, label: /* @__PURE__ */ jsxs28("span", { className: "ad-setting__name", children: [
    face,
    name
  ] }), className: cx("ad-setting", className) });
}

// src/components/ShowOptions/ShowOptions.tsx
import { Fragment as Fragment14, jsx as jsx32, jsxs as jsxs29 } from "react/jsx-runtime";
var showOrder = ["compactRows", "projectColours", "itemColours", "departmentColours", "weekendShading", "people", "archive"];
var WORDS = {
  compactRows: "Compact rows",
  projectColours: "Project colours",
  itemColours: "Item colours",
  departmentColours: "Department colours",
  weekendShading: "Weekend shading",
  people: "People",
  archive: "Show archive"
};
function ShowOptionsGear({ value, onChange, options = [...showOrder], labels: l = {} }) {
  const [open, setOpen] = useState19(false);
  const gear = useRef18(null);
  const now = { ...SHOW_DEFAULTS, ...value };
  const shown = showOrder.filter((o) => options.includes(o));
  const gearLabel = l.gear ?? "Show options";
  return /* @__PURE__ */ jsxs29(Fragment14, { children: [
    /* @__PURE__ */ jsx32(IconButton, { ref: gear, label: gearLabel, active: open, "aria-expanded": open, "aria-haspopup": "dialog", onClick: () => setOpen(!open), children: /* @__PURE__ */ jsx32(Icon, { job: "settings" }) }),
    /* @__PURE__ */ jsx32(Popover, { open, onClose: () => setOpen(false), anchor: gear, ariaLabel: gearLabel, children: /* @__PURE__ */ jsx32(PopoverSection, { label: gearLabel, children: shown.map((o) => /* @__PURE__ */ jsx32(SettingRow, { label: l[o] ?? WORDS[o], children: /* @__PURE__ */ jsx32(Switch, { checked: now[o], "aria-label": l[o] ?? WORDS[o], onChange: (on) => onChange({ ...now, [o]: on }) }) }, o)) }) })
  ] });
}

// src/components/PageHeader/PageHeader.tsx
import { jsx as jsx33, jsxs as jsxs30 } from "react/jsx-runtime";
var STATES = /* @__PURE__ */ new Set(["Deal", "Active", "Close out", "Cancelled", "Archived"]);
function countdownWords(c) {
  const n = daysBetween(c.today, c.to);
  if (!(n >= 0)) return null;
  const days = n === 0 ? "Today" : `${n} ${n === 1 ? "day" : "days"} to`;
  return `${days} ${c.what}`;
}
function PageHeader({ title, icon, stamp, tabs, back, description, countdown: given, alerts, gear, onSearch, onPopOut, onHelp, menu, headerLabels, scramble = true, className }) {
  const anyEnd = gear || onSearch || onPopOut || onHelp || menu;
  const [menuOpen, setMenuOpen] = useState20(false);
  const menuAt = useRef19(null);
  const shownStamp = typeof stamp === "string" && STATES.has(stamp);
  const countdown2 = given && typeof given === "object" && given.to instanceof Date ? countdownWords(given) : null;
  return /* @__PURE__ */ jsxs30("header", { className: cx("ad-page-header", className), children: [
    /* @__PURE__ */ jsxs30("div", { className: "ad-page-header__row", children: [
      /* @__PURE__ */ jsxs30("div", { className: "ad-page-header__lead", children: [
        /* @__PURE__ */ jsxs30("div", { className: "ad-page-header__titled", children: [
          back && /* @__PURE__ */ jsx33("button", { type: "button", className: "ad-page-header__back", "aria-label": back.label, title: back.label, onClick: back.onBack, children: /* @__PURE__ */ jsx33(Icon, { job: "chevron-left", size: "lg" }) }),
          /* @__PURE__ */ jsxs30("h1", { className: "ad-page-header__title", children: [
            icon && /* @__PURE__ */ jsx33("span", { className: "ad-page-header__icon", "aria-hidden": "true", children: slotIcon(icon, { weight: "light" }) }),
            scramble ? /* @__PURE__ */ jsx33(TextScramble, { text: title }) : title
          ] })
        ] }),
        (description || countdown2) && /* @__PURE__ */ jsxs30("div", { className: "ad-page-header__aside", children: [
          description && /* @__PURE__ */ jsx33("p", { className: "ad-page-header__description", children: String(description) }),
          countdown2 && /* @__PURE__ */ jsx33("p", { className: "ad-page-header__countdown", children: countdown2 })
        ] })
      ] }),
      alerts && /* @__PURE__ */ jsx33("div", { className: "ad-page-header__alerts", children: alerts }),
      shownStamp && /* @__PURE__ */ jsx33("div", { className: "ad-page-header__stamp", children: stamp }),
      anyEnd && /* @__PURE__ */ jsxs30(HeaderActions, { groupProps: { "aria-label": headerLabels?.group ?? "Screen actions" }, children: [
        gear && /* @__PURE__ */ jsx33(ShowOptionsGear, { ...gear }),
        onSearch && /* @__PURE__ */ jsx33(IconButton, { label: headerLabels?.search ?? "Search", onClick: onSearch, children: /* @__PURE__ */ jsx33(Icon, { job: "search", size: "md" }) }),
        onPopOut && /* @__PURE__ */ jsx33(IconButton, { label: headerLabels?.popOut ?? "Pop out", onClick: onPopOut, children: /* @__PURE__ */ jsx33(Icon, { job: "external", size: "md" }) }),
        onHelp && /* @__PURE__ */ jsx33(IconButton, { label: headerLabels?.help ?? "Help", onClick: onHelp, children: /* @__PURE__ */ jsx33(Icon, { job: "help", size: "md" }) }),
        menu && /* @__PURE__ */ jsxs30("span", { className: "ad-page-header__menu", children: [
          /* @__PURE__ */ jsx33(IconButton, { ref: menuAt, label: menu.label ?? "More", active: menuOpen, "aria-haspopup": "menu", "aria-expanded": menuOpen, onClick: () => setMenuOpen((o) => !o), children: /* @__PURE__ */ jsx33(Icon, { job: "more", size: "md" }) }),
          menu.marked && /* @__PURE__ */ jsx33("span", { className: "ad-page-header__mark", "aria-hidden": "true" }),
          /* @__PURE__ */ jsx33(Menu, { open: menuOpen, onClose: () => setMenuOpen(false), anchor: menuAt, ariaLabel: menu.label ?? "More", items: menu.items })
        ] })
      ] })
    ] }),
    tabs && /* @__PURE__ */ jsx33("div", { className: "ad-page-header__tabs", children: tabs })
  ] });
}
var strip2 = (h) => {
  if (!h) return {};
  const { className: _c, style: _s, ...rest } = h;
  return rest;
};
function HeaderActions({ children, groupProps }) {
  return /* @__PURE__ */ jsx33("div", { role: "group", ...strip2(groupProps), className: "ad-header-actions", children: /* @__PURE__ */ jsx33(ButtonSizeScope, { size: "bar", children }) });
}
function Tabs({ tabs, value, onChange, ariaLabel, numbered = true, panelId, className }) {
  const list = useRef19(null);
  const base = useId12();
  const at = tabs.findIndex((t) => t.id === value);
  const onKeyDown2 = (e) => {
    let n = null;
    if (e.key === "ArrowRight") n = (at + 1) % tabs.length;
    else if (e.key === "ArrowLeft") n = (at - 1 + tabs.length) % tabs.length;
    else if (e.key === "Home") n = 0;
    else if (e.key === "End") n = tabs.length - 1;
    if (n == null) return;
    e.preventDefault();
    onChange(tabs[n].id);
    requestAnimationFrame(() => list.current?.querySelectorAll('[role="tab"]')[n]?.focus());
  };
  return /* @__PURE__ */ jsx33("div", { ref: list, role: "tablist", "aria-label": ariaLabel, onKeyDown: onKeyDown2, className: cx("ad-tabs", className), children: tabs.map((t, i) => /* @__PURE__ */ jsxs30("button", { type: "button", role: "tab", id: `${base}-${t.id}`, "aria-selected": t.id === value, "aria-controls": panelId?.(t.id), tabIndex: t.id === value ? 0 : -1, onClick: () => onChange(t.id), className: "ad-tab", children: [
    numbered && /* @__PURE__ */ jsx33("span", { className: "ad-tab__numeral", children: String(i + 1).padStart(2, "0") }),
    t.label
  ] }, t.id)) });
}

// src/components/Toolbar/Toolbar.tsx
import { forwardRef as forwardRef9, useEffect as useEffect13, useRef as useRef21, useState as useState21 } from "react";

// src/components/Writing/Writing.tsx
import { forwardRef as forwardRef8, useEffect as useEffect12, useRef as useRef20 } from "react";
import { jsx as jsx34, jsxs as jsxs31 } from "react/jsx-runtime";
function NoteBox({ heading = "Notes", className, value, ...rest }) {
  const ref = useRef20(null);
  useEffect12(() => {
    const el = ref.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = `${el.scrollHeight}px`;
    }
  }, [value]);
  return /* @__PURE__ */ jsxs31("div", { className: cx("ad-note", className), children: [
    /* @__PURE__ */ jsx34("h3", { className: "ad-note-label", children: heading }),
    /* @__PURE__ */ jsx34("textarea", { ref, rows: 2, ...rest, value, "aria-label": typeof heading === "string" ? heading : rest["aria-label"], className: "ad-note-box" })
  ] });
}
function ActivityThread({ events, ariaLabel = "Activity" }) {
  return /* @__PURE__ */ jsx34("ol", { className: "ad-thread", "aria-label": ariaLabel, children: events.map((e) => /* @__PURE__ */ jsxs31("li", { className: "ad-thread__event", children: [
    /* @__PURE__ */ jsx34("span", { className: "ad-thread__date", children: e.date }),
    /* @__PURE__ */ jsx34("span", { className: "ad-thread__sentence", children: e.sentence }),
    /* @__PURE__ */ jsx34("span", { className: "ad-thread__time ad-note-data", children: e.time })
  ] }, e.id)) });
}
function RuleBuilder({ match, onMatch, rules, onChange, fields, operators, renderValue, newRule, addRowEnd, note, labels: l = {} }) {
  const L = { match: "Match", matchAll: "all", matchAny: "any", ofTheseRules: "of these rules", addRule: "Add rule", removeRule: "Remove rule", field: "Field", operator: "Condition", ...l };
  const set = (id, patch) => onChange(rules.map((r) => r.id === id ? { ...r, ...patch } : r));
  return /* @__PURE__ */ jsxs31("div", { className: "ad-rules", children: [
    /* @__PURE__ */ jsxs31("div", { className: "ad-rules__match", children: [
      L.match,
      /* @__PURE__ */ jsx34(Select, { "aria-label": L.match, value: match, onChange: (e) => onMatch(e.target.value), options: [{ value: "all", label: L.matchAll }, { value: "any", label: L.matchAny }] }),
      L.ofTheseRules
    ] }),
    note != null && /* @__PURE__ */ jsx34("p", { className: "ad-rules__note", children: note }),
    rules.map((r) => /* @__PURE__ */ jsxs31("div", { className: "ad-rules__row", children: [
      /* @__PURE__ */ jsx34(Select, { "aria-label": L.field, value: r.field, onChange: (e) => set(r.id, { field: e.target.value }), options: fields }),
      /* @__PURE__ */ jsx34(Select, { "aria-label": L.operator, value: r.operator, onChange: (e) => set(r.id, { operator: e.target.value }), options: operators(r.field) }),
      /* @__PURE__ */ jsx34("span", { className: "ad-rules__value", children: renderValue(r, (value) => set(r.id, { value })) }),
      /* @__PURE__ */ jsx34(ButtonSizeScope, { size: "row", children: /* @__PURE__ */ jsx34(IconButton, { label: L.removeRule, className: "ad-rules__remove", onClick: () => onChange(rules.filter((x) => x.id !== r.id)), children: /* @__PURE__ */ jsx34(Icon, { name: "x", size: "sm" }) }) })
    ] }, r.id)),
    /* @__PURE__ */ jsx34("div", { className: "ad-rules__add", children: /* @__PURE__ */ jsxs31(ButtonSizeScope, { size: "bar", children: [
      /* @__PURE__ */ jsx34(Button, { icon: "plus", onClick: () => onChange([...rules, newRule()]), children: L.addRule }),
      addRowEnd != null && /* @__PURE__ */ jsx34("span", { className: "ad-rules__add-end", children: addRowEnd })
    ] }) })
  ] });
}
var RuleValue = forwardRef8(function RuleValue2({ icon, end, mono, className, type = "button", children, ...rest }, ref) {
  return /* @__PURE__ */ jsxs31("button", { ref, type, ...rest, className: cx("ad-rule-value", mono && "ad-rule-value--mono", className), children: [
    icon != null && /* @__PURE__ */ jsx34("span", { className: "ad-rule-value__icon", "aria-hidden": "true", children: slotIcon(icon, { size: "sm" }) }),
    /* @__PURE__ */ jsx34("span", { className: "ad-rule-value__words", children }),
    /* @__PURE__ */ jsx34("span", { className: "ad-rule-value__end", "aria-hidden": "true", children: end ?? /* @__PURE__ */ jsx34(Icon, { name: "caret-down", size: "sm" }) })
  ] });
});

// src/components/Toolbar/Toolbar.tsx
import { Fragment as Fragment15, jsx as jsx35, jsxs as jsxs32 } from "react/jsx-runtime";
function Toolbar({ children, end, ariaLabel, className }) {
  return /* @__PURE__ */ jsx35("div", { className: cx("ad-toolbar", className), role: "group", "aria-label": ariaLabel, children: /* @__PURE__ */ jsxs32(ButtonSizeScope, { size: "bar", children: [
    children,
    end && /* @__PURE__ */ jsx35("div", { className: "ad-toolbar__end", children: end })
  ] }) });
}
var ViewButton = forwardRef9(function ViewButton2({ label = "No view", open, opens, narrowed, onClick }, ref) {
  return /* @__PURE__ */ jsxs32(
    Button,
    {
      ref,
      className: narrowed ? "ad-button--view ad-button--view-narrowed" : "ad-button--view",
      icon: "binoculars",
      "data-narrowed": narrowed ? true : void 0,
      active: open,
      "aria-expanded": onClick ? !!open : void 0,
      "aria-haspopup": onClick ? opens ?? "dialog" : void 0,
      onClick,
      children: [
        label,
        /* @__PURE__ */ jsx35(Icon, { name: "caret-down", size: "sm" })
      ]
    }
  );
});
function ToolbarSeparator() {
  return /* @__PURE__ */ jsx35("span", { className: "ad-toolbar__separator", role: "separator", "aria-orientation": "vertical" });
}
function ViewPopover({ open, onClose, anchor, builtInViews = [], savedViews, currentView, onPickView, onStarView, viewActions, builtInViewActions, onSaveView, saveScopes, renaming, onRenameView, onCancelRename, onReorderViews, saveOff, query, rules, groupBy, sortBy, show, labels: l = {} }) {
  const L = { noSaved: "No saved views yet", noMatch: "No view by that name", or: "or", default: "Default", rename: "Rename", show: "Show", view: "View", builtInViews: "Views", savedViews: "Saved views", saveView: "Save this view\u2026", viewName: "View name", save: "Save", cancel: "Cancel", star: "Star", unstar: "Unstar", more: "More", filter: "Filter", groupBy: "Group by", sortBy: "Sort by", ascending: "Ascending", descending: "Descending", ...l };
  const SAVE = "__save";
  const [naming, setNaming] = useState21(false);
  const [name, setName] = useState21("");
  const [scope, setScope] = useState21(saveScopes?.[0]?.value);
  const [menuFor, setMenuFor] = useState21(null);
  const menuAnchor = useRef21(null);
  const [drag, setDrag] = useState21(null);
  const [over, setOver] = useState21(null);
  const savedIds = (savedViews ?? []).map((v) => v.id);
  const movable = (id) => onReorderViews ? {
    draggable: true,
    ...dropLineProps(over === id && drag != null && drag !== id ? "before" : null),
    onDragStart: (e) => {
      e.dataTransfer.effectAllowed = "move";
      setDrag(id);
    },
    onDragOver: (e) => {
      if (drag) {
        e.preventDefault();
        setOver(id);
      }
    },
    onDragEnd: () => {
      setDrag(null);
      setOver(null);
    },
    onDrop: (e) => {
      e.preventDefault();
      if (drag && drag !== id) {
        const n = savedIds.filter((x) => x !== drag);
        n.splice(n.indexOf(id), 0, drag);
        onReorderViews(n);
      }
      setDrag(null);
      setOver(null);
    }
  } : {};
  const [newName, setNewName] = useState21("");
  const viewsShown = builtInViews.length > 0 || savedViews != null;
  const views = [
    ...(savedViews ?? []).map((v) => ({
      id: v.id,
      label: String(v.label),
      group: builtInViews.length ? L.savedViews : void 0,
      hint: v.hint ?? (v.isDefault ? L.default : void 0),
      rowProps: movable(v.id),
      ...onStarView ? { leadControl: /* @__PURE__ */ jsx35(IconButton, { label: v.starred === false ? L.star : L.unstar, "aria-pressed": v.starred !== false, onClick: (e) => {
        e.stopPropagation();
        onStarView(v.id, v.starred === false);
      }, children: /* @__PURE__ */ jsx35(Icon, { job: "star", fill: v.starred !== false }) }) } : {},
      hintControl: viewActions ? /* @__PURE__ */ jsx35(IconButton, { label: `${L.more}: ${v.label}`, onClick: (e) => {
        e.stopPropagation();
        menuAnchor.current = e.currentTarget;
        setMenuFor(v);
      }, children: /* @__PURE__ */ jsx35(Icon, { job: "more" }) }) : void 0
    })),
    ...builtInViews.map((v) => ({
      id: v.id,
      label: String(v.label),
      group: savedViews ? L.builtInViews : void 0,
      hint: v.hint ?? (v.isDefault ? L.default : void 0),
      lead: /* @__PURE__ */ jsx35(Icon, { job: "lock", size: "sm", className: "ad-view-lock" }),
      hintControl: builtInViewActions ? /* @__PURE__ */ jsx35(IconButton, { label: `${L.more}: ${v.label}`, onClick: (e) => {
        e.stopPropagation();
        menuAnchor.current = e.currentTarget;
        setMenuFor(v);
      }, children: /* @__PURE__ */ jsx35(Icon, { job: "more" }) }) : void 0
    }))
  ];
  const finishSave = () => {
    if (!name.trim() || !onSaveView) return;
    onSaveView(name.trim(), scope);
    setNaming(false);
    setName("");
  };
  return /* @__PURE__ */ jsxs32(Popover, { open, onClose, anchor, ariaLabel: L.view, children: [
    viewsShown && /* @__PURE__ */ jsxs32(PopoverSection, { label: savedViews && !builtInViews.length ? L.savedViews : L.builtInViews, children: [
      savedViews && savedViews.length === 0 && !builtInViews.length && /* @__PURE__ */ jsx35("p", { className: "ad-view-none", children: L.noSaved }),
      /* @__PURE__ */ jsx35(
        PickList,
        {
          noSearch: true,
          noMatch: L.noMatch,
          searchLabel: L.savedViews,
          value: currentView ?? null,
          options: views,
          onPick: (id) => onPickView?.(id)
        }
      ),
      renaming && onRenameView && (() => {
        const v = (savedViews ?? []).find((x) => x.id === renaming);
        if (!v) return null;
        const done = () => {
          if (newName.trim()) onRenameView(v.id, newName.trim());
          setNewName("");
        };
        return /* @__PURE__ */ jsxs32("div", { className: "ad-view-save", children: [
          /* @__PURE__ */ jsx35(TextField, { autoFocus: true, "aria-label": L.rename, placeholder: String(v.label), value: newName, onChange: (e) => setNewName(e.target.value), onKeyDown: (e) => {
            if (e.key === "Enter") done();
            if (e.key === "Escape") {
              e.stopPropagation();
              setNewName("");
              onCancelRename?.();
            }
          } }),
          /* @__PURE__ */ jsxs32(ButtonSizeScope, { size: "row", children: [
            /* @__PURE__ */ jsx35(Button, { onClick: () => {
              setNewName("");
              onCancelRename?.();
            }, children: L.cancel }),
            /* @__PURE__ */ jsx35(Button, { variant: "main", disabled: !newName.trim(), onClick: done, children: L.rename })
          ] })
        ] });
      })(),
      menuFor && (() => {
        const fn = builtInViews.some((b) => b.id === menuFor.id) ? builtInViewActions : viewActions;
        return fn ? /* @__PURE__ */ jsx35(Menu, { open: true, onClose: () => setMenuFor(null), anchor: menuAnchor, ariaLabel: String(menuFor.label), items: fn(menuFor) }) : null;
      })()
    ] }),
    query && /* @__PURE__ */ jsxs32(PopoverSection, { label: L.filter, children: [
      query.vocabulary ? /* @__PURE__ */ jsx35(TokenInput, { read: { kind: "query", vocabulary: query.vocabulary }, label: L.filter, value: query.value, onChange: query.onChange, showResolved: false, suggestions: query.suggestions }) : /* @__PURE__ */ jsx35(TextField, { "aria-label": L.filter, placeholder: L.filter, value: query.value, onChange: (e) => query.onChange(e.target.value) }),
      rules && /* @__PURE__ */ jsx35("div", { className: "ad-view-or", "aria-hidden": "true", children: /* @__PURE__ */ jsx35("span", { children: L.or }) }),
      rules && /* @__PURE__ */ jsx35(RuleBuilder, { ...rules })
    ] }),
    (groupBy || sortBy) && /* @__PURE__ */ jsxs32("div", { className: "ad-view-halves", children: [
      groupBy && /* @__PURE__ */ jsx35(PopoverSection, { label: L.groupBy, children: /* @__PURE__ */ jsx35(Select, { "aria-label": L.groupBy, value: groupBy.value, onChange: (e) => groupBy.onChange(e.target.value), options: groupBy.options }) }),
      sortBy && /* @__PURE__ */ jsx35(PopoverSection, { label: L.sortBy, children: /* @__PURE__ */ jsxs32("div", { className: "ad-view-sort", children: [
        /* @__PURE__ */ jsx35(Select, { "aria-label": L.sortBy, value: sortBy.value, onChange: (e) => sortBy.onChange(e.target.value), options: sortBy.options }),
        sortBy.direction && /* @__PURE__ */ jsx35(ButtonSizeScope, { size: "row", children: /* @__PURE__ */ jsx35(
          IconButton,
          {
            label: sortBy.direction.off ? `${sortBy.direction.value === "ascending" ? L.ascending : L.descending} \u2014 ${sortBy.direction.off}` : sortBy.direction.value === "ascending" ? L.ascending : L.descending,
            disabled: !!sortBy.direction.off,
            onClick: () => sortBy.direction.onChange(sortBy.direction.value === "ascending" ? "descending" : "ascending"),
            children: /* @__PURE__ */ jsx35(Icon, { job: sortBy.direction.value === "ascending" ? "arrow-up" : "arrow-down" })
          }
        ) })
      ] }) })
    ] }),
    show && show.length > 0 && /* @__PURE__ */ jsx35(PopoverSection, { label: L.show, children: show.map((s) => s.kind === "order" ? /* @__PURE__ */ jsx35(OrderList, { label: s.label, items: s.items, onReorder: s.onReorder }, s.id) : s.kind === "switch" ? /* @__PURE__ */ jsx35(ShowSwitch, { setting: s }, s.id) : /* @__PURE__ */ jsx35(FieldRow, { label: s.label, children: /* @__PURE__ */ jsx35(Select, { "aria-label": s.label, value: s.value, onChange: (e) => s.onChange(e.target.value), options: s.options }) }, s.id)) }),
    savedViews && onSaveView && /* @__PURE__ */ jsx35("div", { className: "ad-view-save-row", children: !naming ? /* @__PURE__ */ jsx35(ButtonSizeScope, { size: "row", children: /* @__PURE__ */ jsx35(Button, { icon: "plus", unavailable: saveOff, onClick: () => setNaming(true), children: L.saveView }) }) : /* @__PURE__ */ jsxs32("div", { className: "ad-view-save", children: [
      /* @__PURE__ */ jsx35(TextField, { autoFocus: true, "aria-label": L.viewName, placeholder: L.viewName, value: name, onChange: (e) => setName(e.target.value), onKeyDown: (e) => {
        if (e.key === "Enter") finishSave();
        if (e.key === "Escape") {
          e.stopPropagation();
          setNaming(false);
        }
      } }),
      saveScopes && /* @__PURE__ */ jsx35(Select, { "aria-label": L.view, value: scope, onChange: (e) => setScope(e.target.value), options: saveScopes }),
      /* @__PURE__ */ jsxs32(ButtonSizeScope, { size: "row", children: [
        /* @__PURE__ */ jsx35(Button, { onClick: () => setNaming(false), children: L.cancel }),
        /* @__PURE__ */ jsx35(Button, { variant: "main", disabled: !name.trim(), onClick: finishSave, children: L.save })
      ] })
    ] }) })
  ] });
}
function OrderList({ label, items, onReorder }) {
  const [drag, setDrag] = useState21(null);
  const [over, setOver] = useState21(null);
  const ids = items.map((i) => i.id);
  return /* @__PURE__ */ jsxs32("div", { className: "ad-view-order", role: "group", "aria-label": label, children: [
    /* @__PURE__ */ jsx35("div", { className: "ad-view-order__label", children: label }),
    /* @__PURE__ */ jsx35("ul", { className: "ad-view-order__list", children: items.map((it) => /* @__PURE__ */ jsx35(
      "li",
      {
        className: "ad-view-order__row",
        draggable: true,
        ...dropLineProps(over === it.id && drag != null && drag !== it.id ? "before" : null),
        onDragStart: (e) => {
          e.dataTransfer.effectAllowed = "move";
          setDrag(it.id);
        },
        onDragOver: (e) => {
          if (drag) {
            e.preventDefault();
            setOver(it.id);
          }
        },
        onDragEnd: () => {
          setDrag(null);
          setOver(null);
        },
        onDrop: (e) => {
          e.preventDefault();
          if (drag && drag !== it.id) {
            const n = ids.filter((x) => x !== drag);
            n.splice(n.indexOf(it.id), 0, drag);
            onReorder(n);
          }
          setDrag(null);
          setOver(null);
        },
        children: /* @__PURE__ */ jsx35("span", { className: "ad-view-order__words", children: it.label })
      },
      it.id
    )) })
  ] });
}
function ShowSwitch({ setting: s }) {
  const [said, setSaid] = useState21(false);
  const locked = s.on && !!s.reason;
  useEffect13(() => {
    if (!locked) setSaid(false);
  }, [locked]);
  return /* @__PURE__ */ jsxs32(Fragment15, { children: [
    /* @__PURE__ */ jsx35(FieldRow, { label: s.label, children: /* @__PURE__ */ jsx35(Switch, { checked: s.on, "aria-label": s.label, onChange: (on) => {
      if (locked && !on) {
        setSaid(true);
        return;
      }
      s.onChange(on);
    } }) }),
    locked && said && /* @__PURE__ */ jsx35("p", { className: "ad-hint ad-view__reason", role: "status", children: s.reason })
  ] });
}

// src/components/Warnings/Warnings.tsx
import { forwardRef as forwardRef10, useId as useId13, useRef as useRef22, useState as useState22 } from "react";
import { Fragment as Fragment16, jsx as jsx36, jsxs as jsxs33 } from "react/jsx-runtime";
function AlertsFloat({ open, onClose, anchor, ariaLabel = "Alerts", id, children }) {
  return /* @__PURE__ */ jsx36(Popover, { open, onClose, anchor, placement: "drop", width: "wide", ariaLabel, noClose: true, id, className: "ad-alerts-float", children: /* @__PURE__ */ jsx36("div", { role: "list", "aria-label": ariaLabel, children }) });
}
function AlertsLine({ alerts, label = "Alerts", snoozeLabel = "Snooze", pillLabel = (p, n) => `${n} priority ${p}`, priorityLabel = (p) => `Priority ${p}`, defaultOpen = false, open, onOpenChange, className }) {
  const [own, setOwn] = useState22(defaultOpen);
  const isOpen = open ?? own;
  const box = useRef22(null);
  const listId = useId13();
  if (!alerts.length) return null;
  const counts = [1, 2, 3, 4].map((p) => [p, alerts.filter((a) => a.priority === p).length]);
  const set = (next) => {
    setOwn(next);
    onOpenChange?.(next);
  };
  return /* @__PURE__ */ jsxs33("div", { ref: box, className: cx("ad-alerts-line", className), children: [
    /* @__PURE__ */ jsx36(AlertBarHead, { open: isOpen, onToggle: () => set(!isOpen), label, counts, pillLabel, controls: listId }),
    /* @__PURE__ */ jsx36(AlertsFloat, { open: isOpen, onClose: () => set(false), anchor: box, ariaLabel: label, id: listId, children: alerts.map((a) => /* @__PURE__ */ jsx36(
      AlertRow,
      {
        priority: a.priority,
        priorityLabel: priorityLabel(a.priority),
        sentence: a.sentence,
        number: a.number,
        actions: a.action && /* @__PURE__ */ jsx36(Button, { onClick: a.action.onSelect, children: a.action.label }),
        onSnooze: a.onSnooze,
        snoozeLabel
      },
      a.id
    )) })
  ] });
}
var strip3 = (h) => {
  if (!h) return {};
  const { className: _c, style: _s, ...rest } = h;
  return rest;
};
function AlertBarHead({ open, onToggle, label = "Alerts", counts, pillLabel = (p, n) => `${n} priority ${p}`, controls, headProps }) {
  const shown = [...counts].filter(([, n]) => n > 0).sort(([a], [b]) => a - b);
  return /* @__PURE__ */ jsxs33("button", { ...strip3(headProps), type: "button", className: "ad-alert-bar__head", "aria-expanded": open, "aria-controls": controls, onClick: onToggle, children: [
    /* @__PURE__ */ jsx36(Icon, { name: open ? "caret-down" : "caret-right", size: "sm", className: "ad-alert-bar__caret" }),
    /* @__PURE__ */ jsx36("span", { className: "ad-alert-bar__word", children: label }),
    shown.map(([p, n]) => /* @__PURE__ */ jsx36(CountPill, { priority: p, count: n, label: pillLabel(p, n) }, p))
  ] });
}
function AlertList({ children, id, hidden, ariaLabel, listProps }) {
  return /* @__PURE__ */ jsx36("div", { ...strip3(listProps), id, hidden, role: "list", "aria-label": ariaLabel, children });
}
function AlertRow({ priority, priorityLabel = `Priority ${priority}`, sentence, number, actions, onSnooze, snoozeLabel = "Snooze", onDismiss, dismissLabel = "Dismiss", end, children, rowProps, muted }) {
  const line = /* @__PURE__ */ jsxs33(Fragment16, { children: [
    /* @__PURE__ */ jsx36(CountPill, { priority, label: priorityLabel }),
    /* @__PURE__ */ jsx36("span", { className: "ad-alert__sentence", children: sentence }),
    number != null && number !== "" && /* @__PURE__ */ jsx36("span", { className: "ad-alert__number ad-note-data", children: number }),
    /* @__PURE__ */ jsx36("span", { className: "ad-alert__actions", children: /* @__PURE__ */ jsxs33(ButtonSizeScope, { size: "row", children: [
      actions,
      onSnooze && /* @__PURE__ */ jsx36(IconButton, { label: snoozeLabel, onClick: onSnooze, children: /* @__PURE__ */ jsx36(Icon, { job: "snooze" }) }),
      onDismiss && /* @__PURE__ */ jsx36(IconButton, { label: dismissLabel, onClick: onDismiss, children: /* @__PURE__ */ jsx36(Icon, { job: "x" }) }),
      end != null && /* @__PURE__ */ jsx36("span", { className: "ad-alert__end", children: end })
    ] }) })
  ] });
  const look = cx("ad-alert", muted && "ad-alert--muted");
  if (children == null || children === false) return /* @__PURE__ */ jsx36("div", { ...strip3(rowProps), role: "listitem", className: look, children: line });
  return /* @__PURE__ */ jsxs33("div", { ...strip3(rowProps), role: "listitem", className: "ad-alert-item", children: [
    /* @__PURE__ */ jsx36("div", { className: look, children: line }),
    /* @__PURE__ */ jsx36("div", { className: "ad-alert__under", children })
  ] });
}
function CountPill({ priority, count, label }) {
  return /* @__PURE__ */ jsxs33("span", { className: cx("ad-count-pill", `ad-count-pill--p${priority}`), children: [
    /* @__PURE__ */ jsxs33("span", { "aria-hidden": label ? true : void 0, children: [
      "P",
      priority,
      count != null && ` ${count}`
    ] }),
    label && /* @__PURE__ */ jsx36("span", { className: "ad-sr", children: label })
  ] });
}
var Bell = forwardRef10(function Bell2({ unread, label = "Notifications", unreadLabel = "unread", className, ...rest }, ref) {
  return /* @__PURE__ */ jsx36("button", { ref, type: "button", ...rest, "aria-label": unread ? `${label}, ${unreadLabel}` : label, title: label, className: cx("ad-icon-button", "ad-icon-button--md", "ad-bell", className), "data-unread": unread || void 0, children: /* @__PURE__ */ jsx36(Icon, { name: "bell" }) });
});
function NotificationList({ days, unreadLabel = "Unread" }) {
  return /* @__PURE__ */ jsx36("div", { className: "ad-notifications", children: days.map((d) => /* @__PURE__ */ jsxs33("section", { className: "ad-notifications__day", children: [
    /* @__PURE__ */ jsxs33("h3", { className: "ad-notifications__heading", children: [
      /* @__PURE__ */ jsx36("span", { className: "ad-notifications__name", children: d.name }),
      /* @__PURE__ */ jsx36("span", { className: "ad-notifications__date", children: d.date })
    ] }),
    d.items.map((n) => {
      const body = /* @__PURE__ */ jsxs33(Fragment16, { children: [
        n.unread ? /* @__PURE__ */ jsx36(UnreadDot, { className: "ad-notification__unread", label: unreadLabel }) : /* @__PURE__ */ jsx36("span", { className: "ad-notification__read" }),
        n.face && /* @__PURE__ */ jsx36("span", { className: "ad-notification__face", children: n.face }),
        /* @__PURE__ */ jsx36("span", { className: "ad-notification__sentence", children: n.sentence }),
        /* @__PURE__ */ jsx36("span", { className: "ad-notification__time ad-note-data", children: n.time })
      ] });
      return n.onOpen ? /* @__PURE__ */ jsx36("button", { type: "button", className: "ad-notification", onClick: n.onOpen, children: body }, n.id) : /* @__PURE__ */ jsx36("div", { className: "ad-notification", children: body }, n.id);
    })
  ] }, d.id)) });
}

// src/components/Board/Board.tsx
import { jsx as jsx37, jsxs as jsxs34 } from "react/jsx-runtime";
function Board({ children, ariaLabel, className }) {
  return /* @__PURE__ */ jsx37("div", { className: cx("ad-board", className), role: "region", "aria-label": ariaLabel, children });
}
function BoardLane({ title, mark, onTitle, titleLabel, children, className }) {
  return /* @__PURE__ */ jsxs34("section", { className: cx("ad-board-lane", className), children: [
    /* @__PURE__ */ jsxs34("h3", { className: "ad-board-lane__heading", children: [
      mark,
      onTitle ? /* @__PURE__ */ jsx37("button", { type: "button", className: "ad-board-lane__name ad-board-lane__name--press", "aria-label": titleLabel, onClick: onTitle, children: title }) : /* @__PURE__ */ jsx37("span", { className: "ad-board-lane__name", children: title })
    ] }),
    /* @__PURE__ */ jsx37("div", { className: "ad-board-lane__cards", children })
  ] });
}
function BoardCardMeta({ date, icon, face, code: code2, marks, role, deliverable }) {
  return /* @__PURE__ */ jsxs34("div", { className: "ad-board-lane__card-meta", children: [
    date,
    icon && /* @__PURE__ */ jsx37("span", { "aria-hidden": "true", className: "ad-board-lane__card-icon", children: slotIcon(icon, { size: "sm" }) }),
    marks && /* @__PURE__ */ jsx37("span", { className: "ad-board-lane__card-marks", children: marks }),
    role && /* @__PURE__ */ jsx37("span", { className: "ad-row__fact ad-board-lane__card-fact", title: String(role), children: /* @__PURE__ */ jsx37("span", { className: "ad-board-lane__card-fact-word", children: String(role) }) }),
    deliverable && /* @__PURE__ */ jsxs34("span", { className: "ad-row__fact ad-board-lane__card-fact ad-board-lane__card-fact--cut", title: String(deliverable), children: [
      /* @__PURE__ */ jsx37(Icon, { job: "kind-deliverable", size: "sm" }),
      /* @__PURE__ */ jsx37("span", { className: "ad-board-lane__card-fact-word", children: String(deliverable) })
    ] }),
    code2 && /* @__PURE__ */ jsx37("span", { className: "ad-board-lane__card-code", children: code2 }),
    face && /* @__PURE__ */ jsx37("span", { className: "ad-board-lane__card-face", children: face })
  ] });
}
function DropLine() {
  return /* @__PURE__ */ jsx37("div", { className: "ad-drop-line", "aria-hidden": "true" });
}

// src/components/Splitter/Splitter.tsx
import { useRef as useRef23 } from "react";
import { Fragment as Fragment17, jsx as jsx38, jsxs as jsxs35 } from "react/jsx-runtime";
function Splitter({ main, side, size, onResize, min = 0, max = Number.POSITIVE_INFINITY, at = "end", label, className }) {
  const box = useRef23(null);
  const clamp = (n) => Math.max(min, Math.min(max, Math.round(n)));
  const onPointerDown2 = (e) => {
    const el = e.currentTarget;
    el.setPointerCapture(e.pointerId);
    const startX = e.clientX;
    const startSize = size;
    const move = (ev) => onResize(clamp(startSize + (at === "end" ? startX - ev.clientX : ev.clientX - startX)));
    const up = () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("pointercancel", up);
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", up);
  };
  const onKeyDown2 = (e) => {
    const step = e.shiftKey ? 40 : 8;
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      onResize(clamp(size + (at === "end" ? step : -step)));
    }
    if (e.key === "ArrowRight") {
      e.preventDefault();
      onResize(clamp(size + (at === "end" ? -step : step)));
    }
    if (e.key === "Home") {
      e.preventDefault();
      onResize(clamp(min));
    }
    if (e.key === "End" && Number.isFinite(max)) {
      e.preventDefault();
      onResize(clamp(max));
    }
  };
  const divider = /* @__PURE__ */ jsx38(
    "div",
    {
      role: "separator",
      tabIndex: 0,
      "aria-label": label,
      "aria-orientation": "vertical",
      "aria-valuenow": size,
      "aria-valuemin": min,
      "aria-valuemax": Number.isFinite(max) ? max : void 0,
      className: "ad-splitter__divider",
      onPointerDown: onPointerDown2,
      onKeyDown: onKeyDown2
    }
  );
  return /* @__PURE__ */ jsxs35("div", { ref: box, className: cx("ad-splitter", `ad-splitter--${at}`, className), style: { ["--ad-split"]: `${size}px` }, children: [
    at === "start" && /* @__PURE__ */ jsxs35(Fragment17, { children: [
      /* @__PURE__ */ jsx38("div", { className: "ad-splitter__side", children: side }),
      divider
    ] }),
    /* @__PURE__ */ jsx38("div", { className: "ad-splitter__main", children: main }),
    at === "end" && /* @__PURE__ */ jsxs35(Fragment17, { children: [
      divider,
      /* @__PURE__ */ jsx38("div", { className: "ad-splitter__side", children: side })
    ] })
  ] });
}

// src/components/Text/Text.tsx
import { jsx as jsx39, jsxs as jsxs36 } from "react/jsx-runtime";
function DataText({ children, dim, small, className }) {
  return /* @__PURE__ */ jsx39("span", { className: cx("ad-type-data", "ad-data-text", small && "ad-data-text--small", dim && "ad-data-text--dim", className), children });
}
function Hint({ children, className }) {
  return /* @__PURE__ */ jsx39("span", { className: cx("ad-hint", className), children });
}
function Figures({ items, ariaLabel, className }) {
  return /* @__PURE__ */ jsx39("dl", { className: cx("ad-figures", className), "aria-label": ariaLabel, children: items.slice(0, 4).map((f) => /* @__PURE__ */ jsxs36("div", { className: "ad-figures__item", children: [
    /* @__PURE__ */ jsx39("dt", { className: "ad-figures__label ad-type-heading", children: f.label }),
    /* @__PURE__ */ jsx39("dd", { className: "ad-figures__value", children: f.value })
  ] }, f.label)) });
}

// src/components/Columns/Columns.tsx
import { jsx as jsx40, jsxs as jsxs37 } from "react/jsx-runtime";
function Columns({ main, side, sideWidth = "card", className }) {
  return /* @__PURE__ */ jsxs37("div", { className: cx("ad-columns", `ad-columns--${sideWidth}`, className), children: [
    /* @__PURE__ */ jsx40("div", { className: "ad-columns__main", children: main }),
    /* @__PURE__ */ jsx40("div", { className: "ad-columns__side", children: side })
  ] });
}

// src/components/Table/Table.tsx
import { useLayoutEffect as useLayoutEffect7, useRef as useRef24, useState as useState23 } from "react";
import { jsx as jsx41, jsxs as jsxs38 } from "react/jsx-runtime";
var Arrow = ({ up }) => /* @__PURE__ */ jsx41(Icon, { name: up ? "arrow-up" : "arrow-down", size: "sm", className: "ad-table__arrow" });
function Table({ columns, rows, rowId, caption, sort, onSort, picked, onPickedChange, onPickAllChange, pickLabel, pickAllLabel = "Pick all", onOpen, rowProps, group, depth, nameColumn, fixed, className }) {
  const span = columns.length + (onPickedChange ? 1 : 0);
  let lastGroup;
  const all = rows.length > 0 && rows.every((r) => picked?.has(rowId(r)));
  const nameAt = Math.max(0, nameColumn ? columns.findIndex((c) => c.id === nameColumn) : 0);
  const headRow = useRef24(null);
  const [held, setHeld] = useState23({});
  const heldKey = columns.filter((c) => c.frozen === "start").map((c) => c.id).join(" ");
  useLayoutEffect7(() => {
    const tr = headRow.current;
    if (!tr || heldKey.split(" ").length < 2) return;
    const measure = () => {
      const next = {};
      let x = 0;
      tr.querySelectorAll("th[data-held]").forEach((th) => {
        next[th.dataset.held] = x;
        x += th.getBoundingClientRect().width;
      });
      setHeld((was) => Object.keys(next).every((k) => was[k] === next[k]) ? was : next);
    };
    measure();
    if (typeof ResizeObserver === "undefined") return;
    const seen = new ResizeObserver(measure);
    tr.querySelectorAll("th").forEach((th) => seen.observe(th));
    return () => seen.disconnect();
  }, [heldKey, onPickedChange]);
  const wrap = useRef24(null);
  useKeyScroll(wrap);
  const at = (c) => c.frozen === "start" && held[c.id] ? { ["--ad-held"]: `${held[c.id]}px` } : {};
  return /* @__PURE__ */ jsx41("div", { ref: wrap, className: cx("ad-table-wrap", className), children: /* @__PURE__ */ jsxs38("table", { className: cx("ad-table", fixed && "ad-table--fixed"), children: [
    /* @__PURE__ */ jsx41("caption", { className: "ad-sr", children: caption }),
    /* @__PURE__ */ jsx41("thead", { children: /* @__PURE__ */ jsxs38("tr", { ref: headRow, children: [
      onPickedChange && /* @__PURE__ */ jsx41("th", { scope: "col", className: "ad-table__pick", children: /* @__PURE__ */ jsx41(Checkbox, { "aria-label": pickAllLabel, checked: all, onChange: (on) => onPickAllChange?.(on) }) }),
      columns.map((c) => {
        const sorted = sort?.id === c.id ? sort.direction : void 0;
        return /* @__PURE__ */ jsx41("th", { scope: "col", "data-held": c.frozen === "start" ? c.id : void 0, "aria-sort": sorted ?? (c.sortable ? "none" : void 0), className: cx(c.numeric && "ad-num", c.frozen && `ad-table__frozen--${c.frozen}`), style: { ...c.width ? { width: c.width } : {}, ...at(c) }, children: c.labelHidden ? /* @__PURE__ */ jsx41("span", { className: "ad-sr", children: c.label }) : c.sortable && onSort ? /* @__PURE__ */ jsxs38("button", { type: "button", className: "ad-table__sort ad-sort-button", onClick: () => onSort(c.id), children: [
          c.label,
          sorted && /* @__PURE__ */ jsx41(Arrow, { up: sorted === "ascending" })
        ] }) : c.label }, c.id);
      })
    ] }) }),
    /* @__PURE__ */ jsx41("tbody", { children: rows.map((r) => {
      const id = rowId(r);
      const on = picked?.has(id);
      const g = group?.(r);
      const head = g != null && g !== lastGroup ? g : null;
      lastGroup = g;
      const d = depth?.(r) ?? 0;
      const { className: _c, style: _s, ...hooks } = rowProps?.(r) ?? {};
      const tr = /* @__PURE__ */ jsxs38("tr", { ...hooks, "data-picked": on || void 0, "data-depth": d || void 0, className: cx(onOpen && "ad-table__row--opens"), onClick: (e) => {
        hooks.onClick?.(e);
        if (onOpen && !e.target.closest("input,button,a")) onOpen(r);
      }, children: [
        onPickedChange && /* @__PURE__ */ jsx41("td", { className: "ad-table__pick", children: /* @__PURE__ */ jsx41(Checkbox, { "aria-label": pickLabel?.(r) ?? id, checked: !!on, onChange: (v) => onPickedChange(id, v) }) }),
        columns.map((c, i) => {
          const frozen = c.frozen && `ad-table__frozen--${c.frozen}`;
          if (i !== nameAt) return /* @__PURE__ */ jsx41("td", { className: cx(c.numeric && "ad-num", c.mono && "ad-mono", frozen), style: c.frozen === "start" ? at(c) : void 0, children: c.cell(r) }, c.id);
          const words = onOpen ? /* @__PURE__ */ jsx41("button", { type: "button", className: "ad-table__open", onClick: () => onOpen(r), children: c.cell(r) }) : c.cell(r);
          const meta = c.meta?.(r);
          return /* @__PURE__ */ jsxs38("th", { scope: "row", className: cx("ad-table__name", frozen, meta != null && "ad-table__name--two"), style: d || c.frozen === "start" ? { ...d ? { ["--ad-depth"]: d } : {}, ...at(c) } : void 0, children: [
            d > 0 && /* @__PURE__ */ jsx41("span", { className: "ad-table__elbow", "aria-hidden": "true" }),
            meta != null ? /* @__PURE__ */ jsxs38("span", { className: "ad-table__words", children: [
              words,
              /* @__PURE__ */ jsx41("span", { className: "ad-table__meta", children: meta })
            ] }) : words
          ] }, c.id);
        })
      ] }, id);
      return head != null ? [/* @__PURE__ */ jsx41("tr", { className: "ad-table__group", children: /* @__PURE__ */ jsx41("th", { scope: "colgroup", colSpan: span, children: head }) }, `group-${id}`), tr] : tr;
    }) })
  ] }) });
}
function SelectionBar({ count, countLabel = (n) => `${n} selected`, actions, lead, onClear, clearLabel = "Clear", showAtZero, emptyLabel = "Nothing selected", onExit, exitLabel = "Exit", className }) {
  const [open, setOpen] = useState23(null);
  const anchor = useRef24(null);
  const ordered2 = [...actions.filter((a) => !a.danger), ...actions.filter((a) => a.danger)];
  if (count <= 0 && !showAtZero) return null;
  const zero = count <= 0;
  const shown = ordered2.find((a) => a.id === open && a.picker);
  const close = () => setOpen(null);
  return /* @__PURE__ */ jsxs38(Portal, { children: [
    /* @__PURE__ */ jsxs38("div", { className: cx("ad-float", "ad-selection-bar", className), role: "toolbar", "aria-label": zero ? emptyLabel : countLabel(count), children: [
      /* @__PURE__ */ jsx41("span", { className: "ad-selection-bar__count", "aria-live": "polite", children: zero ? emptyLabel : countLabel(count) }),
      lead != null && /* @__PURE__ */ jsx41("span", { className: "ad-selection-bar__lead", children: lead }),
      /* @__PURE__ */ jsxs38(ButtonSizeScope, { size: "bar", children: [
        !zero && ordered2.map((a) => {
          const button = /* @__PURE__ */ jsxs38(
            Button,
            {
              icon: a.icon,
              dot: a.dot,
              danger: a.danger,
              active: !!a.picker && open === a.id,
              "aria-haspopup": a.picker ? "dialog" : void 0,
              "aria-expanded": a.picker ? open === a.id : void 0,
              onClick: (e) => {
                if (a.picker) {
                  anchor.current = e.currentTarget.parentElement;
                  setOpen((o) => o === a.id ? null : a.id);
                } else a.onSelect?.(e.currentTarget);
              },
              children: [
                a.label,
                a.picker && /* @__PURE__ */ jsx41(Icon, { name: "caret-down", size: "sm" })
              ]
            },
            a.id
          );
          return a.picker ? /* @__PURE__ */ jsx41("span", { className: "ad-selection-bar__slot", children: button }, a.id) : button;
        }),
        !zero && onClear && /* @__PURE__ */ jsx41(Button, { onClick: onClear, children: clearLabel }),
        onExit && /* @__PURE__ */ jsx41(Button, { onClick: onExit, children: exitLabel })
      ] })
    ] }),
    shown && /* @__PURE__ */ jsx41(Popover, { open: true, onClose: close, anchor, width: shown.pickerWidth ?? "menu", noClose: true, ariaLabel: shown.label, children: shown.picker(close) })
  ] });
}
function SelectionBarRoom() {
  return /* @__PURE__ */ jsx41("div", { className: "ad-selection-bar-room", "aria-hidden": "true" });
}

// src/components/Timeline/Timeline.tsx
import { useLayoutEffect as useLayoutEffect8, useRef as useRef25, useState as useState24 } from "react";
import { Fragment as Fragment18, jsx as jsx42, jsxs as jsxs39 } from "react/jsx-runtime";
var strip4 = (h) => {
  if (!h) return {};
  const { className: _c, style: _s, ...rest } = h;
  return rest;
};
function Envelope({ side }) {
  const curve = "M0 100 C 55 100, 45 0, 100 0";
  return /* @__PURE__ */ jsxs39("svg", { className: `ad-bar__envelope ad-bar__envelope--${side}`, "data-travel-ramp": side, viewBox: "0 0 100 100", preserveAspectRatio: "none", "aria-hidden": "true", children: [
    /* @__PURE__ */ jsx42("path", { className: "ad-bar__envelope-shade", d: `${curve} L0 0 Z` }),
    /* @__PURE__ */ jsx42("path", { d: curve, vectorEffect: "non-scaling-stroke" })
  ] });
}
function Bar({ code: code2, travel, dim, label, unconfirmed, deal, backup, color, selected, startLabel, endLabel, lead, children, thin, labelOutside, onOpen, ends, barProps, labelInset, labelHidden, late, dense, fade, fadeStart, fadeEnd, onCramped, detail, className, style }) {
  const asButton = !!onOpen && !ends;
  const Tag2 = asButton ? "button" : "div";
  const hue = useHue(color);
  const hooks = strip4(barProps);
  const paint = barColour(color, hue);
  const plain = !thin && !code2;
  const root = useRef25(null);
  const [cramped, setCramped] = useState24(false);
  const tell = useRef25(onCramped);
  tell.current = onCramped;
  useLayoutEffect8(() => {
    const el = root.current;
    if (!el) return;
    const measure = () => {
      const n = el.querySelector(".ad-bar__label > .ad-bar__name");
      if (n) {
        const c = n.scrollWidth > n.clientWidth + 1;
        setCramped(c);
        tell.current?.(c);
      }
    };
    measure();
    document.fonts?.ready.then(measure).catch(() => {
    });
    const ro = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(measure);
    ro?.observe(el);
    const lab = el.querySelector(".ad-bar__label");
    if (lab) ro?.observe(lab);
    return () => ro?.disconnect();
  }, [label]);
  const clip = labelOutside === "clip";
  const keepIn = !!code2 || labelOutside === "never" || clip;
  const outside = !keepIn && (labelOutside === true || labelOutside === "before" || labelOutside === "after" || cramped);
  const tip = clip && typeof label === "string" && !hooks.title ? [label, detail].filter((x) => typeof x === "string").join(" \xB7 ") : keepIn && cramped && typeof label === "string" && !hooks.title ? label : void 0;
  const name = /* @__PURE__ */ jsx42("span", { className: "ad-bar__name", children: label });
  const grip = (side, h) => h && /* @__PURE__ */ jsx42("span", { "aria-hidden": h["aria-label"] ? void 0 : true, ...strip4(h), className: `ad-bar__grip ad-bar__grip--${side}` });
  return /* @__PURE__ */ jsxs39(
    Tag2,
    {
      ref: root,
      ...hooks,
      type: asButton ? "button" : void 0,
      role: onOpen && !asButton ? "button" : hooks.role,
      tabIndex: onOpen && !asButton ? 0 : hooks.tabIndex,
      onClick: (e) => {
        hooks.onClick?.(e);
        if (e.target.closest(".ad-bar__grip")) return;
        onOpen?.();
      },
      onKeyDown: (e) => {
        hooks.onKeyDown?.(e);
        if (onOpen && !asButton && e.target === e.currentTarget && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onOpen();
        }
      },
      "aria-current": selected || void 0,
      title: tip ?? hooks.title,
      className: cx("ad-bar", "ad-striped", code2 && "ad-bar--code", code2 && travel && "ad-bar--travel", code2 && dim && "ad-bar--dim", labelOutside === "never" && "ad-bar--keep-in", clip && "ad-bar--clip", labelOutside === "never" && cramped && "ad-bar--name-gone", labelOutside === "before" && "ad-bar--label-before", plain && !!paint["--ad-bar"] && "ad-bar--hued", plain && !unconfirmed && !deal && !backup && "ad-bar--confirmed", unconfirmed && "ad-bar--unconfirmed", deal && "ad-bar--deal", backup && "ad-bar--backup", thin && "ad-bar--thin", outside && "ad-bar--label-outside", selected && "ad-bar--selected", late && "ad-bar--late", dense && "ad-bar--dense", fade && `ad-bar--fade-${fade}`, labelHidden && "ad-bar--label-hidden", className),
      style: { ...style, ...paint, ...labelInset ? { ["--ad-label-in"]: `${Math.max(0, labelInset)}px` } : {}, ...fade && fadeStart != null ? { ["--ad-fade-start"]: `${Math.max(0, fadeStart)}px` } : {}, ...fade && fadeEnd != null ? { ["--ad-fade-end"]: `${Math.max(0, fadeEnd)}px` } : {} },
      children: [
        fade && /* @__PURE__ */ jsx42("span", { className: "ad-bar__ground", "aria-hidden": "true" }),
        (fade === "start" || fade === "both") && /* @__PURE__ */ jsx42(Envelope, { side: "start" }),
        (fade === "end" || fade === "both") && /* @__PURE__ */ jsx42(Envelope, { side: "end" }),
        grip("start", ends?.start),
        startLabel && /* @__PURE__ */ jsx42("span", { className: "ad-bar__end ad-bar__end--start", children: startLabel }),
        /* @__PURE__ */ jsxs39("span", { className: "ad-bar__label", children: [
          /* @__PURE__ */ jsx42(DeptGlyph, { hue: color }),
          lead,
          clip ? /* @__PURE__ */ jsxs39("span", { className: "ad-bar__words", children: [
            name,
            detail != null && /* @__PURE__ */ jsx42("span", { className: "ad-bar__detail", children: detail })
          ] }) : name
        ] }),
        children,
        outside && /* @__PURE__ */ jsx42("span", { className: "ad-bar__outside", children: name }),
        endLabel && /* @__PURE__ */ jsx42("span", { className: "ad-bar__end ad-bar__end--end", children: endLabel }),
        grip("end", ends?.end)
      ]
    }
  );
}
function BarMarker({ kind, at, due, today, done, labels: l = {} }) {
  const late = kind === "review" && !done && due instanceof Date && today instanceof Date && daysBetween(today, due) < 0;
  const word = kind === "review" ? l.review ?? "Review date" : l.deadline ?? "Due date";
  const label = late ? `${word} ${l.passed ?? "passed"}` : word;
  return /* @__PURE__ */ jsx42("span", { className: cx("ad-bar-marker", late && "ad-bar-marker--late"), style: { left: `clamp(calc(var(--icon-md) / 2), ${Math.max(0, Math.min(1, at)) * 100}%, calc(100% - var(--icon-md) / 2))` }, role: "img", "aria-label": label, title: label, children: /* @__PURE__ */ jsx42(Icon, { name: kind === "review" ? "eye" : "paper-plane-tilt", fill: true }) });
}
function DeliverableBar({ parts, ...props }) {
  if (!parts) return /* @__PURE__ */ jsx42(DeliverableRow, { ...props });
  const { expanded, label } = props;
  const clamp = (n) => Math.max(0, Math.min(1, Number.isFinite(n) ? n : 0));
  return /* @__PURE__ */ jsxs39("div", { className: "ad-deliverable-group", children: [
    /* @__PURE__ */ jsx42(DeliverableRow, { ...props, expandable: true }),
    expanded && /* @__PURE__ */ jsx42("div", { className: "ad-deliverable__parts", role: "list", "aria-label": typeof label === "string" ? label : void 0, children: parts.map((p) => {
      const from = clamp(p.start);
      const to = Math.max(from, clamp(p.end));
      return /* @__PURE__ */ jsx42("div", { role: "listitem", className: "ad-deliverable__part", children: /* @__PURE__ */ jsx42("div", { className: "ad-deliverable__part-span", style: { marginLeft: `${from * 100}%`, width: `${(to - from) * 100}%` }, children: /* @__PURE__ */ jsx42(Bar, { thin: true, label: String(p.label), children: p.markers.map((m, i) => /* @__PURE__ */ jsx42(BarMarker, { ...m }, i)) }) }) }, p.id);
    }) })
  ] });
}
function DeliverableRow({ lead, status, showStatus, statusLabel, markers: given, expandable, expanded, onToggle, toggleLabel = "Show parts", className, ...bar }) {
  const done = status === "good";
  const row = useRef25(null);
  const [marksOff, setMarksOff] = useState24(null);
  const onCramped = (c) => {
    const width = row.current?.clientWidth ?? 0;
    if (c && marksOff === null && given.length) setMarksOff(width);
  };
  useLayoutEffect8(() => {
    const el = row.current;
    if (!el || marksOff === null || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => {
      if (el.clientWidth > marksOff + 1) setMarksOff(null);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [marksOff]);
  const markers = marksOff === null ? given : [];
  const ats = markers.map((m) => Math.max(0, Math.min(1, m.at))).sort((a, b) => a - b);
  const leading = ats.filter((a) => a < LEAD_AT).length;
  const cap = ats.find((a) => a >= LEAD_AT);
  const style = {
    ...bar.style,
    ...leading ? { ["--ad-label-in"]: `calc(var(--icon-md) * ${leading} + var(--space-2))` } : {},
    ...cap !== void 0 ? { ["--ad-label-max"]: `calc(${(cap * 100).toFixed(2)}% - var(--icon-md) - var(--space-2) - var(--space-2) * 2)` } : {}
  };
  return /* @__PURE__ */ jsxs39("div", { ref: row, className: cx("ad-deliverable", expandable && "ad-deliverable--expandable", marksOff !== null && "ad-deliverable--no-marks", className), style, children: [
    expandable && /* @__PURE__ */ jsx42("button", { type: "button", className: "ad-deliverable__caret", "aria-expanded": !!expanded, "aria-label": toggleLabel, onClick: onToggle, children: /* @__PURE__ */ jsx42(Icon, { name: "caret-right", size: "sm", className: cx("ad-deliverable__chevron", expanded && "ad-is-open") }) }),
    /* @__PURE__ */ jsx42(Bar, { ...bar, style: void 0, onCramped, lead: /* @__PURE__ */ jsxs39(Fragment18, { children: [
      showStatus ? /* @__PURE__ */ jsx42("span", { role: "img", "aria-label": statusLabel, className: "ad-deliverable__status", children: /* @__PURE__ */ jsx42(Dot, { tone: status }) }) : /* @__PURE__ */ jsx42("span", { className: "ad-sr", children: statusLabel }),
      lead
    ] }), children: markers.map((m, i) => /* @__PURE__ */ jsx42(BarMarker, { done, ...m }, i)) })
  ] });
}
var LEAD_AT = 0.12;
function Lanes({ children, marks, ariaLabel, nameWidth, className }) {
  const box = useRef25(null);
  const [fit, setFit] = useState24(null);
  useLayoutEffect8(() => {
    const el = box.current;
    if (!el || nameWidth !== "fit") return;
    const measure = () => {
      let w = 0;
      el.querySelectorAll(".ad-lane__name").forEach((n) => {
        const pad = parseFloat(getComputedStyle(n).paddingRight) || 0;
        const kid = n.firstElementChild;
        w = Math.max(w, (kid ? kid.scrollWidth : n.scrollWidth - pad) + pad);
      });
      setFit((was) => was === Math.ceil(w) ? was : Math.ceil(w));
    };
    measure();
    if (typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  });
  return /* @__PURE__ */ jsxs39("div", { ref: box, className: cx("ad-lanes", className), role: ariaLabel ? "group" : void 0, "aria-label": ariaLabel, style: fit != null ? { ["--ad-lane-name"]: `${fit}px` } : void 0, children: [
    children,
    marks && /* @__PURE__ */ jsx42("div", { className: "ad-lanes__marks", "aria-hidden": "true", children: marks })
  ] });
}
function Lane({ name, children, tall, laneProps }) {
  const { className: _c, style: _s, ...hooks } = laneProps ?? {};
  return /* @__PURE__ */ jsxs39("div", { ...hooks, className: cx("ad-lane", tall && "ad-lane--tall"), children: [
    /* @__PURE__ */ jsx42("div", { className: "ad-lane__name", children: name }),
    /* @__PURE__ */ jsx42("div", { className: "ad-lane__chart", children })
  ] });
}
function Milestone({ label, past, unconfirmed, opening, ariaLabel, onOpen }) {
  const Tag2 = onOpen ? "button" : "span";
  return /* @__PURE__ */ jsxs39(Tag2, { type: onOpen ? "button" : void 0, onClick: onOpen, "aria-label": ariaLabel, className: cx("ad-milestone", past && "ad-milestone--past", unconfirmed && "ad-milestone--unconfirmed"), children: [
    opening ? /* @__PURE__ */ jsx42("span", { className: "ad-milestone__burst", "aria-hidden": "true", children: "\u2733" }) : /* @__PURE__ */ jsx42("span", { className: "ad-milestone__diamond ad-diamond", "aria-hidden": "true" }),
    /* @__PURE__ */ jsx42("span", { className: "ad-milestone__label", children: label })
  ] });
}
function TodayLine({ cap = true, word, style, label = "Today" }) {
  return /* @__PURE__ */ jsxs39("div", { className: "ad-today", style, role: "img", "aria-label": label, children: [
    word && /* @__PURE__ */ jsx42("span", { className: "ad-today__word", "aria-hidden": "true", children: word }),
    cap && /* @__PURE__ */ jsx42(RegMark, {})
  ] });
}
function RegMark() {
  return /* @__PURE__ */ jsxs39("svg", { className: "ad-regmark", viewBox: "0 0 16 16", "aria-hidden": "true", children: [
    /* @__PURE__ */ jsx42("circle", { cx: "8", cy: "8", r: "5", fill: "none", stroke: "currentColor", strokeWidth: "1" }),
    /* @__PURE__ */ jsx42("path", { d: "M8 0v16M0 8h16", stroke: "currentColor", strokeWidth: "1" })
  ] });
}
function PastHatch({ style, away }) {
  return /* @__PURE__ */ jsx42("div", { className: away ? "ad-past ad-past--away" : "ad-past", style, "aria-hidden": "true" });
}
function Clash({ children, className }) {
  return /* @__PURE__ */ jsx42("div", { className: cx("ad-clash", className), children });
}
function OverMark({ left, width, amount, label, "aria-label": ariaLabel, markProps }) {
  const hooks = strip4(markProps);
  const read2 = ariaLabel ?? (typeof label === "string" ? label : void 0);
  const shade = Number.isFinite(amount) ? Math.min(1, Math.max(0, amount)) : void 0;
  return /* @__PURE__ */ jsx42(
    "span",
    {
      role: read2 ? "img" : void 0,
      "aria-hidden": read2 ? void 0 : true,
      title: typeof label === "string" && label ? label : read2,
      ...hooks,
      "aria-label": read2,
      className: "ad-over-mark",
      style: { left: `${Number.isFinite(left) ? left : 0}px`, width: `${Math.max(1, Number.isFinite(width) ? width : 1)}px`, ...shade != null ? { ["--ad-over"]: shade } : {} }
    }
  );
}
var px = (n, min = 0) => `${Math.max(min, Number.isFinite(n) ? n : min)}px`;
function DragBand({ left, width, inLane }) {
  return /* @__PURE__ */ jsx42("span", { "aria-hidden": "true", className: cx("ad-drag-band", inLane && "ad-drag-band--lane"), style: { left: px(left), width: px(width, 1) } });
}
function GroupBand({ children, bandProps }) {
  return /* @__PURE__ */ jsx42("div", { ...strip4(bandProps), className: "ad-group-band", children });
}
function LaneWash({ left, width, colour, edge, label, unconfirmed }) {
  const drawn = useNamedColour(colour);
  return /* @__PURE__ */ jsx42(
    "span",
    {
      "aria-hidden": "true",
      "data-coloured": drawn ? true : void 0,
      className: cx("ad-lane-wash", edge && "ad-lane-wash--edge", edge && unconfirmed && "ad-lane-wash--unconfirmed"),
      style: { left: px(left), width: px(width, 1), ...drawn ? { ["--ad-wash"]: drawn } : {} },
      children: edge && label && /* @__PURE__ */ jsx42("span", { className: "ad-lane-wash__label", children: label })
    }
  );
}
function PresenceSwatch({ colour, away }) {
  const c = useNamedColour(colour);
  return /* @__PURE__ */ jsx42("span", { "aria-hidden": "true", className: cx("ad-chart-key__presence", away && "ad-chart-key__presence--away"), style: c ? { ["--ad-where"]: c } : void 0 });
}
function OffscreenStart({ date, side = "start" }) {
  return side === "end" ? /* @__PURE__ */ jsxs39("span", { className: "ad-offscreen ad-note-data ad-offscreen--end", children: [
    date,
    " ",
    /* @__PURE__ */ jsx42("span", { "aria-hidden": "true", children: ">" })
  ] }) : /* @__PURE__ */ jsxs39("span", { className: "ad-offscreen ad-note-data", children: [
    /* @__PURE__ */ jsx42("span", { "aria-hidden": "true", children: "<" }),
    " ",
    date
  ] });
}
var KEY_MARKS = /* @__PURE__ */ new Set(["confirmed", "hatched", "deal", "backup", "clash"]);
function ChartKey({ items, ariaLabel = "Key" }) {
  return /* @__PURE__ */ jsx42("div", { className: "ad-chart-key", role: "group", "aria-label": ariaLabel, children: items.map((it, i) => {
    const swatch = typeof it.mark === "string" && KEY_MARKS.has(it.mark) ? /* @__PURE__ */ jsx42("span", { "aria-hidden": "true", className: `ad-chart-key__swatch ad-chart-key__swatch--${it.mark}` }) : it.mark === "away" ? /* @__PURE__ */ jsx42("span", { "aria-hidden": "true", className: "ad-chart-key__presence ad-chart-key__presence--away" }) : it.mark && typeof it.mark === "object" && "presence" in it.mark ? /* @__PURE__ */ jsx42(PresenceSwatch, { colour: it.mark.presence, away: it.mark.away }) : /* @__PURE__ */ jsx42("span", { "aria-hidden": "true", className: "ad-chart-key__mark", children: it.mark });
    const { className: _c, style: _s, ...hooks } = it.itemProps ?? {};
    return it.onPress ? /* @__PURE__ */ jsxs39("button", { type: "button", ...hooks, className: "ad-chart-key__item ad-chart-key__item--press", onClick: (e) => {
      hooks.onClick?.(e);
      it.onPress();
    }, children: [
      swatch,
      it.label
    ] }, i) : /* @__PURE__ */ jsxs39("span", { ...hooks, className: "ad-chart-key__item", children: [
      swatch,
      it.label
    ] }, i);
  }) });
}

// src/components/Timeline/Ruler.tsx
import { jsx as jsx43, jsxs as jsxs40 } from "react/jsx-runtime";
function Ruler({ start, days, dayWidth, locale = "en-US", pinned, className }) {
  const at = (i) => new Date(start.getFullYear(), start.getMonth(), start.getDate() + i);
  const months = [];
  const ticks = [];
  const numberRoom = tokenPx("--space-6", 24);
  const showDay = dayWidth >= tokenPx("--space-4", 16);
  const dayEvery = showDay ? [1, 2, 4].find((n) => n * dayWidth >= numberRoom) ?? 0 : 0;
  const weekEvery = showDay ? 0 : [1, 2].find((n) => n * 7 * dayWidth >= numberRoom) ?? 0;
  const monthRoom = tokenPx("--w-col-sm", 64);
  let weeks = 0;
  for (let i = 0; i < days; i++) {
    const d = at(i);
    if (d.getDate() === 1 || i === 0) {
      const last = months[months.length - 1];
      const room = last ? i * dayWidth - last.x : Infinity;
      if (room < monthRoom && last?.partial && d.getDate() === 1) months.pop();
      if (!months.length || i * dayWidth - months[months.length - 1].x >= monthRoom) {
        const first = !months.length;
        months.push({ x: i * dayWidth, partial: i === 0 && d.getDate() !== 1, label: d.toLocaleDateString(locale, { month: "short", year: d.getMonth() === 0 || first ? "numeric" : void 0 }).toUpperCase() });
      }
    }
    const monday = d.getDay() === 1;
    const monthStart = d.getDate() === 1;
    if (showDay) ticks.push({ x: i * dayWidth, major: monday || monthStart, label: dayEvery && i % dayEvery === 0 ? String(d.getDate()) : void 0 });
    else if (monday) ticks.push({ x: i * dayWidth, major: true, label: weekEvery && weeks++ % weekEvery === 0 ? String(d.getDate()) : void 0 });
    else if (monthStart) ticks.push({ x: i * dayWidth, major: true });
  }
  return /* @__PURE__ */ jsxs40("div", { className: cx("ad-ruler", pinned && "ad-ruler--pinned", className), style: { width: days * dayWidth }, children: [
    /* @__PURE__ */ jsx43("div", { className: "ad-ruler__months", "aria-hidden": "true", children: months.map((m) => /* @__PURE__ */ jsx43("span", { className: "ad-ruler__month", style: { left: m.x }, children: m.label }, m.x)) }),
    /* @__PURE__ */ jsx43("div", { className: "ad-ruler__ticks", "aria-hidden": "true", children: ticks.map((t) => /* @__PURE__ */ jsx43("span", { className: cx("ad-ruler__tick", t.major && "ad-ruler__tick--major"), style: { left: t.x }, children: t.label && /* @__PURE__ */ jsx43("span", { className: "ad-ruler__day", children: t.label }) }, t.x)) })
  ] });
}
var ORDER = ["days", "weeks", "months", "quarters"];
var NAMES = { days: "Days", weeks: "Weeks", months: "Months", quarters: "Quarters", zoomIn: "Zoom in", zoomOut: "Zoom out", previous: "Earlier", today: "Today", next: "Later" };
function ZoomCluster({ zoom, onZoom, onPrevious, onToday, onNext, labels }) {
  const L = { ...NAMES, ...labels };
  const i = ORDER.indexOf(zoom);
  const btn = (label, glyph, on, disabled, today) => /* @__PURE__ */ jsx43("button", { type: "button", "aria-label": label, title: label, disabled, onClick: on, className: cx("ad-zoom__btn", today && "ad-zoom__btn--today"), children: /* @__PURE__ */ jsx43(Icon, { job: glyph, size: "md" }) }, glyph);
  return /* @__PURE__ */ jsxs40("div", { className: "ad-zoom", role: "group", "aria-label": L[zoom], children: [
    btn(`${L.zoomOut} (${L[ORDER[Math.min(i + 1, 3)]]})`, "minus", () => onZoom(ORDER[Math.min(i + 1, 3)]), i === 3),
    btn(L.previous, "chevron-left", onPrevious),
    btn(L.today, "today", onToday, false, true),
    btn(L.next, "chevron-right", onNext),
    btn(`${L.zoomIn} (${L[ORDER[Math.max(i - 1, 0)]]})`, "plus", () => onZoom(ORDER[Math.max(i - 1, 0)]), i === 0)
  ] });
}
function PeriodCluster({ shown, periods, period, onPeriod, onPrevious, onNext, onToday, previousOff, nextOff, labels }) {
  const L = { previous: "Earlier", today: "Today", next: "Later", period: "Period", ...labels };
  const step = (label, glyph, on, off, today) => on && /* @__PURE__ */ jsx43("button", { type: "button", "aria-label": off ? `${label}: ${off}` : label, title: off ?? label, disabled: !!off, onClick: on, className: cx("ad-zoom__btn", today && "ad-zoom__btn--today"), children: /* @__PURE__ */ jsx43(Icon, { job: glyph, size: "md" }) });
  return /* @__PURE__ */ jsxs40("div", { className: "ad-zoom ad-period", role: "group", "aria-label": shown, children: [
    /* @__PURE__ */ jsx43("span", { className: "ad-zoom__name", children: shown }),
    step(L.previous, "chevron-left", onPrevious, previousOff),
    step(L.today, "today", onToday, void 0, true),
    step(L.next, "chevron-right", onNext, nextOff),
    periods && periods.length > 1 && onPeriod && /* @__PURE__ */ jsx43("span", { className: "ad-period__sizes", role: "radiogroup", "aria-label": L.period, children: periods.map((p) => /* @__PURE__ */ jsx43("button", { type: "button", role: "radio", "aria-checked": p.id === period, onClick: () => onPeriod(p.id), className: "ad-zoom__btn ad-period__size", children: p.label }, p.id)) })
  ] });
}

// src/components/Calendar/Calendar.tsx
import { useEffect as useEffect14, useLayoutEffect as useLayoutEffect9, useRef as useRef26, useState as useState25 } from "react";
import { Fragment as Fragment19, jsx as jsx44, jsxs as jsxs41 } from "react/jsx-runtime";
var code = (it) => it.code ? /* @__PURE__ */ jsx44(ProjectPill, { code: it.code, color: it.color?.startsWith("project-") ? it.color : void 0 }) : null;
var hooksOf2 = (h) => {
  if (!h) return {};
  const { className: _c, style: _s, ...rest } = h;
  return rest;
};
var diff = (a, b) => daysBetween(b, a);
function MonthCalendar({ month, items, today: todayIn, weekStart = 1, locale = "en-US", onOpen, dayProps, itemProps, marks, ringDay, className }) {
  const today = dayOf(todayIn);
  const hueOf = useHueOf();
  const shadeWeekends = useShow().weekendShading;
  const first = new Date(month.getFullYear(), month.getMonth(), 1);
  const start = weekStartOf(first, weekStart);
  const last = new Date(month.getFullYear(), month.getMonth() + 1, 0);
  const weeks = Math.ceil((diff(last, start) + 1) / 7);
  const dows = Array.from({ length: 7 }, (_, i) => addDays(start, i).toLocaleDateString(locale, { weekday: "short" }));
  const sorted = [...items].sort((a, b) => a.start.getTime() - b.start.getTime() || diff(b.end, b.start) - diff(a.end, a.start));
  return /* @__PURE__ */ jsxs41("section", { className: cx("ad-month", className), "aria-label": first.toLocaleDateString(locale, { month: "long", year: "numeric" }), children: [
    /* @__PURE__ */ jsx44("div", { className: "ad-month__dows", "aria-hidden": "true", children: dows.map((d, i) => /* @__PURE__ */ jsx44("span", { className: "ad-month__dow", children: d }, i)) }),
    Array.from({ length: weeks }, (_, w) => {
      const ws = addDays(start, w * 7);
      const we = addDays(ws, 6);
      const lanes = [];
      const placed = [];
      for (const it of sorted) {
        if (diff(it.end, ws) < 0 || diff(it.start, we) > 0) continue;
        const from = Math.max(0, diff(it.start, ws));
        const to = Math.min(6, diff(it.end, ws));
        let lane = lanes.findIndex((l) => l.slice(from, to + 1).every((x) => !x));
        if (lane < 0) {
          lanes.push(Array(7).fill(false));
          lane = lanes.length - 1;
        }
        for (let i = from; i <= to; i++) lanes[lane][i] = true;
        placed.push({ item: it, lane, from, to, cutStart: diff(it.start, ws) < 0, cutEnd: diff(it.end, we) > 0 });
      }
      return /* @__PURE__ */ jsxs41("div", { className: "ad-month__week", role: "group", style: { ["--ad-lanes"]: Math.max(1, lanes.length) }, "aria-label": `${ws.toLocaleDateString(locale, { month: "short", day: "numeric" })} \u2013 ${we.toLocaleDateString(locale, { month: "short", day: "numeric" })}`, children: [
        Array.from({ length: 7 }, (_2, i) => {
          const d = addDays(ws, i);
          const wk = d.getDay() === 0 || d.getDay() === 6;
          const mark = marks?.(d);
          return /* @__PURE__ */ jsx44("div", { "aria-hidden": dayProps ? void 0 : true, ...hooksOf2(dayProps?.(d)), style: { gridColumn: i + 1 }, className: "ad-month__cell", "data-outside": d.getMonth() !== first.getMonth() || void 0, "data-weekend": shadeWeekends && wk || void 0, "data-ring": diff(d, today) === 0 || ringDay?.(d) || void 0, children: /* @__PURE__ */ jsxs41("span", { className: "ad-month__day", children: [
            /* @__PURE__ */ jsx44("span", { className: "ad-month__num", "data-today": diff(d, today) === 0 || void 0, children: d.getDate() }),
            mark != null && /* @__PURE__ */ jsx44("span", { className: "ad-month__marks", children: mark })
          ] }) }, i);
        }),
        placed.map(({ item, lane, from, to, cutStart, cutEnd }) => {
          const style = { gridColumn: `${from + 1} / ${to + 2}`, ["--ad-lane"]: lane, ...barColour(item.color, hueOf(item.color)) };
          const ms = !!item.milestone;
          const cls = cx("ad-month__bar", "ad-striped", ms && "ad-month__bar--milestone", ms && diff(item.end, today) < 0 && "ad-month__bar--past", item.unconfirmed && "ad-month__bar--unconfirmed", cutStart && "ad-month__bar--cut-start", cutEnd && "ad-month__bar--cut-end");
          const hooks = hooksOf2(itemProps?.(item));
          const inner = /* @__PURE__ */ jsxs41(Fragment19, { children: [
            ms && /* @__PURE__ */ jsx44("span", { className: "ad-month__diamond ad-diamond", "aria-hidden": "true" }),
            code(item),
            /* @__PURE__ */ jsx44(DeptGlyph, { hue: item.color }),
            /* @__PURE__ */ jsx44("span", { children: item.label })
          ] });
          return onOpen ? /* @__PURE__ */ jsx44("button", { type: "button", ...hooks, className: cls, style, onClick: (e) => {
            hooks.onClick?.(e);
            onOpen(item);
          }, children: inner }, item.id) : /* @__PURE__ */ jsx44("span", { ...hooks, className: cls, style, children: inner }, item.id);
        })
      ] }, w);
    })
  ] });
}
function YearCalendar({ year, today: todayIn, busy, onPressDay, weekStart = 1, locale = "en-US", className }) {
  const today = dayOf(todayIn);
  const y = year.getFullYear();
  return /* @__PURE__ */ jsx44("section", { className: cx("ad-year", className), "aria-label": String(y), children: Array.from({ length: 12 }, (_, m) => {
    const first = new Date(y, m, 1);
    const start = weekStartOf(first, weekStart);
    const last = new Date(y, m + 1, 0);
    const cells = Math.ceil((diff(last, start) + 1) / 7) * 7;
    return /* @__PURE__ */ jsxs41("div", { className: "ad-year__month", role: "group", "aria-label": first.toLocaleDateString(locale, { month: "long", year: "numeric" }), children: [
      /* @__PURE__ */ jsx44("div", { className: "ad-year__name", "aria-hidden": "true", children: first.toLocaleDateString(locale, { month: "short" }).toUpperCase() }),
      /* @__PURE__ */ jsx44("div", { className: "ad-year__days", children: Array.from({ length: cells }, (_2, i) => {
        const d = addDays(start, i);
        if (d.getMonth() !== m) return /* @__PURE__ */ jsx44("span", { className: "ad-year__day ad-year__day--outside", "aria-hidden": "true" }, i);
        const holds = !!busy?.(d);
        const attrs = { "data-busy": holds || void 0, "data-today": diff(d, today) === 0 || void 0 };
        const name = d.toLocaleDateString(locale, { weekday: "long", month: "long", day: "numeric" });
        return onPressDay ? /* @__PURE__ */ jsx44("button", { type: "button", ...attrs, className: "ad-year__day", "aria-label": name, onClick: () => onPressDay(d), children: d.getDate() }, i) : /* @__PURE__ */ jsx44("span", { ...attrs, className: "ad-year__day", children: d.getDate() }, i);
      }) })
    ] }, m);
  }) });
}
function Booking({ name, time, unconfirmed, color, style, onOpen, bookingProps, ends, actions, labelOutside, meta, fit, narrow, dragging }) {
  const asButton = !!onOpen && !ends && actions == null;
  const Tag2 = asButton ? "button" : "div";
  const hue = useHue(color);
  const hooks = hooksOf2(bookingProps);
  const grip = (side, h) => h && /* @__PURE__ */ jsx44("span", { role: h["aria-label"] ? "button" : void 0, "aria-hidden": h["aria-label"] ? void 0 : true, ...hooksOf2(h), className: `ad-booking__grip ad-booking__grip--${side}` });
  const inControl = (t) => !!t.closest(".ad-booking__grip, .ad-booking__actions");
  const beside = !!onOpen && !asButton;
  const controls = /* @__PURE__ */ jsxs41(Fragment19, { children: [
    grip("start", ends?.start),
    actions != null && /* @__PURE__ */ jsx44("span", { className: "ad-booking__actions", children: /* @__PURE__ */ jsx44(ButtonSizeScope, { size: "row", children: actions }) }),
    grip("end", ends?.end)
  ] });
  const block = /* @__PURE__ */ jsxs41(
    Tag2,
    {
      ...hooks,
      type: asButton ? "button" : void 0,
      role: onOpen && !asButton ? "button" : hooks.role,
      tabIndex: onOpen && !asButton ? 0 : hooks.tabIndex,
      onClick: (e) => {
        hooks.onClick?.(e);
        if (!inControl(e.target)) onOpen?.();
      },
      onKeyDown: (e) => {
        hooks.onKeyDown?.(e);
        if (onOpen && !asButton && e.target === e.currentTarget && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onOpen();
        }
      },
      className: cx("ad-booking", "ad-striped", unconfirmed && "ad-booking--unconfirmed", !asButton && onOpen && "ad-booking--press", labelOutside && "ad-booking--outside", fit && "ad-booking--fit", narrow && "ad-booking--narrow", dragging && "ad-booking--dragging"),
      "data-dragging": dragging || void 0,
      style: beside ? { ...barColour(color, hue) } : { ...style, ...barColour(color, hue) },
      children: [
        !beside && grip("start", ends?.start),
        /* @__PURE__ */ jsxs41("span", { className: "ad-booking__name", children: [
          /* @__PURE__ */ jsx44(DeptGlyph, { hue: color }),
          name
        ] }),
        !labelOutside && !fit && /* @__PURE__ */ jsx44("span", { className: "ad-booking__time", children: time }),
        meta != null && !fit && !narrow && /* @__PURE__ */ jsx44("span", { className: "ad-booking__meta", children: meta }),
        !beside && actions != null && /* @__PURE__ */ jsx44("span", { className: "ad-booking__actions", children: /* @__PURE__ */ jsx44(ButtonSizeScope, { size: "row", children: actions }) }),
        !beside && grip("end", ends?.end)
      ]
    }
  );
  return beside ? /* @__PURE__ */ jsxs41("div", { className: "ad-booking-hold", style, children: [
    block,
    controls
  ] }) : block;
}
function NowMarker({ time, style }) {
  return /* @__PURE__ */ jsxs41("span", { className: "ad-now", style, children: [
    /* @__PURE__ */ jsx44("span", { className: "ad-now__time", children: time }),
    /* @__PURE__ */ jsx44("span", { className: "ad-now__dot", "aria-hidden": "true" })
  ] });
}
function WeekendShade({ children, className }) {
  const on = useShow().weekendShading;
  return /* @__PURE__ */ jsx44("div", { className: cx(on && "ad-weekend", className), children });
}
var clockHour = (h) => String((h + 11) % 12 + 1);
function TimeGrid({ startHour, endHour, bookings = [], columns, now, hourLabel = clockHour, onOpen, itemProps, columnProps, ariaLabel, bandHours, onPressAt, over, visibleHours, scrollTo, asideWidth = "narrow", hourHeight = "compact", bandHeading, className }) {
  const hours = Math.max(1, endHour - startHour);
  const frame = useRef26(null);
  const [headH, setHeadH] = useState25(0);
  useLayoutEffect9(() => {
    const el = frame.current;
    if (!el) return;
    const measure = () => {
      let h = 0;
      el.querySelectorAll(".ad-time-grid__head").forEach((n) => {
        h = Math.max(h, n.offsetHeight);
      });
      setHeadH((was) => was === h ? was : h);
      if (asideWidth === "narrow") return;
      el.querySelectorAll(".ad-time-grid__aside").forEach((a) => {
        let floor = -Infinity;
        a.querySelectorAll(":scope > .ad-time-grid__moment").forEach((m) => {
          m.style.marginTop = "";
          const top = m.offsetTop, push = Math.max(0, floor - top);
          m.style.marginTop = `${push}px`;
          floor = top + push + m.offsetHeight;
        });
      });
    };
    measure();
    if (typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(measure);
    el.querySelectorAll(".ad-time-grid__head").forEach((n) => ro.observe(n));
    return () => ro.disconnect();
  });
  useEffect14(() => {
    const el = frame.current;
    if (!el || scrollTo == null) return;
    const go = () => {
      const hour = el.querySelector(".ad-time-grid__hour");
      const hourPx = hour?.offsetHeight || el.scrollHeight / Math.max(1, hours + (el.querySelector(".ad-time-grid__allday") ? 1 : 0));
      if (!hourPx) return false;
      el.scrollTop = Math.max(0, (scrollTo - startHour) * hourPx);
      return true;
    };
    if (go() || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => {
      if (go()) ro.disconnect();
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [scrollTo, startHour, hours]);
  const pressAt = (colId) => (e) => {
    if (!onPressAt) return;
    const t = e.target;
    if (t !== e.currentTarget && !t.classList.contains("ad-time-grid__hour")) return;
    const r = e.currentTarget.getBoundingClientRect();
    const h = startHour + (r.height > 0 ? (e.clientY - r.top) / r.height * hours : 0);
    onPressAt(colId, Math.round(h * 12) / 12);
  };
  const at = (h) => `calc(var(--ad-hour) * ${Math.max(0, Math.min(hours, h - startHour))})`;
  const cols = columns ?? [{ id: "day", label: "", bookings }];
  const hueOf = useHueOf();
  const allDayRows = cols.some((c) => c.allDay) ? Math.max(1, ...cols.map((c) => c.allDay?.length ?? 0)) : 0;
  const anyBand = cols.some((c) => c.band);
  const headBand = !!bandHeading && anyBand;
  return /* @__PURE__ */ jsxs41("div", { ref: frame, className: cx("ad-time-grid", !!visibleHours && "ad-time-grid--scrolls", `ad-time-grid--aside-${asideWidth}`, hourHeight === "roomy" && "ad-time-grid--roomy", className), role: "group", "aria-label": ariaLabel, style: { ["--ad-hours"]: hours, ["--ad-allday-rows"]: allDayRows, ...visibleHours ? { ["--ad-visible-hours"]: visibleHours } : {}, ...headH ? { ["--ad-head-h"]: `${headH}px` } : {} }, children: [
    /* @__PURE__ */ jsxs41("div", { className: "ad-time-grid__gutter", "aria-hidden": "true", children: [
      anyBand && !headBand && /* @__PURE__ */ jsx44("div", { className: "ad-time-grid__band-space" }),
      allDayRows > 0 && /* @__PURE__ */ jsx44("div", { className: "ad-time-grid__allday-space" }),
      /* @__PURE__ */ jsxs41("div", { className: "ad-time-grid__hours", children: [
        Array.from({ length: hours }, (_, i) => /* @__PURE__ */ jsx44("span", { className: "ad-time-grid__hour-label", style: { top: at(startHour + i) }, children: hourLabel(startHour + i) }, i)),
        now && /* @__PURE__ */ jsx44(NowMarker, { time: now.time, style: { position: "absolute", top: at(now.at), right: 0, transform: "translateY(-50%)" } })
      ] })
    ] }),
    cols.map((c) => /* @__PURE__ */ jsxs41("div", { className: cx("ad-time-grid__column", over === c.id && "ad-time-grid__column--over"), role: "group", "aria-label": c.label || void 0, children: [
      c.head != null || headBand ? /* @__PURE__ */ jsxs41("div", { className: "ad-time-grid__head", children: [
        headBand && /* @__PURE__ */ jsx44(BandHeading, { band: c.band }),
        c.head
      ] }) : c.label && /* @__PURE__ */ jsxs41("span", { className: "ad-time-grid__day", children: [
        c.label,
        c.marks != null && /* @__PURE__ */ jsx44("span", { className: "ad-time-grid__marks", children: c.marks }),
        c.figure != null && /* @__PURE__ */ jsx44("span", { className: "ad-time-grid__figure", children: c.figure })
      ] }),
      anyBand && !headBand && (c.band ? /* @__PURE__ */ jsx44(PhaseBand, { ...c.band }) : /* @__PURE__ */ jsx44("div", { className: "ad-time-grid__band-space" })),
      allDayRows > 0 && /* @__PURE__ */ jsx44("div", { role: "group", ...hooksOf2(columnProps?.(c.id)), className: "ad-time-grid__allday", children: (c.allDay ?? []).map((item) => {
        const hooks = hooksOf2(itemProps?.(item));
        const cls = cx("ad-month__bar", "ad-striped", "ad-time-grid__item", item.unconfirmed && "ad-month__bar--unconfirmed");
        const style = { ...barColour(item.color, hueOf(item.color)), ...item.span && item.span > 1 ? { ["--ad-span"]: item.span } : {} };
        const inner = /* @__PURE__ */ jsxs41(Fragment19, { children: [
          code(item),
          item.icon ? slotIcon(item.icon, { size: "sm" }) : /* @__PURE__ */ jsx44(DeptGlyph, { hue: item.color }),
          /* @__PURE__ */ jsx44("span", { children: item.label })
        ] });
        return onOpen ? /* @__PURE__ */ jsx44("button", { type: "button", ...hooks, "data-span": item.span && item.span > 1 ? item.span : void 0, className: cls, style, onClick: (e) => {
          hooks.onClick?.(e);
          onOpen(item);
        }, children: inner }, item.id) : /* @__PURE__ */ jsx44("span", { ...hooks, "data-span": item.span && item.span > 1 ? item.span : void 0, className: cls, style, children: inner }, item.id);
      }) }),
      /* @__PURE__ */ jsxs41("div", { className: cx("ad-time-grid__body", c.aside && "ad-time-grid__body--aside"), onClick: pressAt(c.id), children: [
        (c.blocks ?? []).map((b) => {
          const n = Math.max(1, b.lanes ?? 1), k = Math.min(n - 1, Math.max(0, b.lane ?? 0));
          return /* @__PURE__ */ jsx44("div", { className: "ad-time-grid__slot", "data-lane": n > 1 ? `${k + 1}/${n}` : void 0, style: { top: at(b.start), height: `calc(${at(b.end)} - ${at(b.start)})`, ...n > 1 ? { ["--ad-lane-k"]: k, ["--ad-lanes"]: n } : {} }, children: b.node }, b.id);
        }),
        c.aside && /* @__PURE__ */ jsx44("div", { className: "ad-time-grid__aside", children: [...c.aside].sort((x, y) => x.at - y.at).map((m, i) => {
          const words = [m.time, m.title].filter(Boolean).join(" ");
          const inner = m.node ?? (asideWidth === "narrow" ? /* @__PURE__ */ jsx44("span", { className: "ad-time-grid__moment-mark", "aria-label": m.onPress ? void 0 : words, role: m.onPress ? void 0 : "img" }) : /* @__PURE__ */ jsxs41(Fragment19, { children: [
            m.time && /* @__PURE__ */ jsx44("span", { className: "ad-time-grid__moment-time", children: m.time }),
            m.title && /* @__PURE__ */ jsx44("span", { className: "ad-time-grid__moment-title", title: m.title, children: m.title })
          ] }));
          const shown = m.hue ? hueOf(m.hue) : void 0;
          const style = { top: at(m.at), ...shown ? { ["--ad-stripe"]: shown } : {} };
          const cls = cx("ad-time-grid__moment", m.unconfirmed && "ad-time-grid__moment--unconfirmed", m.hue && "ad-time-grid__moment--hued");
          return m.onPress ? /* @__PURE__ */ jsx44("button", { type: "button", className: cx(cls, "ad-time-grid__moment--press"), style, "aria-label": words || void 0, title: asideWidth === "narrow" ? words : void 0, onClick: (e) => {
            e.stopPropagation();
            m.onPress();
          }, children: inner }, i) : /* @__PURE__ */ jsx44("span", { className: cls, style, title: asideWidth === "narrow" && words ? words : void 0, children: inner }, i);
        }) }),
        Array.from({ length: hours }, (_, i) => /* @__PURE__ */ jsx44("div", { className: cx("ad-time-grid__hour", bandHours && i % 2 === 1 && "ad-time-grid__hour--band"), "aria-hidden": "true" }, i)),
        c.bookings.map(({ id, start, end, ...b }) => /* @__PURE__ */ jsx44("div", { className: "ad-time-grid__slot", style: { top: at(start), height: `calc(${at(end)} - ${at(start)})` }, children: /* @__PURE__ */ jsx44(Booking, { ...b, style: { height: "100%" } }) }, id))
      ] })
    ] }, c.id))
  ] });
}
function DayCell({ day, today, where, whereLabel, away, travel, letter, dayProps }) {
  const colour = useNamedColour(where);
  const n = daysBetween(today, day);
  const weekend = day.getDay() === 0 || day.getDay() === 6;
  const hooks = hooksOf2(dayProps);
  return /* @__PURE__ */ jsxs41(
    "div",
    {
      ...hooks,
      role: "group",
      "aria-label": [day.toDateString(), whereLabel, away ? "away" : "", travel ? "travelling" : ""].filter(Boolean).join(", "),
      className: cx("ad-day-cell", n < 0 && "ad-day-cell--past", n === 0 && "ad-day-cell--today", weekend && "ad-day-cell--weekend", away && "ad-day-cell--away"),
      children: [
        /* @__PURE__ */ jsx44("span", { className: "ad-day-cell__letter", "aria-hidden": "true", children: letter ?? ENGLISH.weekdayLetters[day.getDay()] }),
        /* @__PURE__ */ jsx44("span", { className: "ad-day-cell__number", "aria-hidden": "true", children: day.getDate() }),
        /* @__PURE__ */ jsx44("span", { className: "ad-day-cell__where", "aria-hidden": "true", style: colour ? { ["--ad-where"]: colour } : void 0, "data-where": colour ? true : void 0 }),
        travel && /* @__PURE__ */ jsx44("span", { className: "ad-day-cell__travel", "aria-hidden": "true", children: /* @__PURE__ */ jsx44(Icon, { job: "plane", size: "sm" }) })
      ]
    }
  );
}
function BandHeading({ band }) {
  if (!band) return /* @__PURE__ */ jsx44("div", { className: "ad-time-grid__band-heading ad-time-grid__band-heading--none", "aria-hidden": "true" });
  return /* @__PURE__ */ jsx44("div", { className: cx("ad-group-heading", "ad-group-heading--rule-above", "ad-time-grid__band-heading", band.unconfirmed && "ad-time-grid__band-heading--unconfirmed"), children: band.label ? /* @__PURE__ */ jsx44("h2", { className: "ad-group-heading__title ad-time-grid__band-name", children: band.label }) : null });
}
function PhaseBand({ label, color, unconfirmed }) {
  const drawn = useNamedColour(color);
  return /* @__PURE__ */ jsx44("div", { className: cx("ad-time-grid__band", unconfirmed && "ad-time-grid__band--unconfirmed", label && "ad-time-grid__band--first"), style: drawn ? { ["--ad-wash"]: drawn } : void 0, children: label && /* @__PURE__ */ jsx44("span", { className: "ad-time-grid__band-label", children: label }) });
}

// src/components/Map/Map.tsx
import { useEffect as useEffect15, useMemo as useMemo3, useRef as useRef27, useState as useState26 } from "react";

// src/components/Map/worldGeo.ts
var GEO_LAT_MAX = 84;
var GEO_LAT_MIN = -56;
function decode(s) {
  return s.split(";").map((r) => r.split(" ").map((pt) => {
    const i = pt.indexOf(",");
    return [+pt.slice(0, i), +pt.slice(i + 1)];
  }));
}
var LAND_SRC = "-180,69 -177.5,68.2 -174.9,67.2 -175,66.6 -174.3,66.3 -174.6,67.1 -171.9,66.9 -169.9,66 -170.9,65.5 -172.5,65.4 -172.6,64.5 -173.9,64.3 -174.7,64.6 -176,64.9 -176.2,65.4 -177.2,65.5 -178.4,65.4 -178.9,65.7 -178.7,66.1 -179.9,65.9 -179.4,65.4 -180,65 -181.3,64.5 -182.6,64.6 -181.7,64.1 -180.6,63 -180.8,62.3 -182.6,62.5 -185.4,61.8 -186.3,61.7 -189.3,60.3 -189.7,59.9 -191.1,60.6 -193.7,59.8 -194.2,60.2 -195.1,59.7 -196.5,59.9 -196.8,59.2 -198,58.2 -197.9,57.8 -196.8,57.6 -196.9,56.2 -197.9,56.1 -198.3,55.3 -197.9,54.9 -199.6,54.3 -200,53.2 -201.5,53 -201.8,51.9 -203.2,51 -203.6,51.7 -204.6,55.4 -204.1,56.8 -203.2,57.4 -203.2,57.8 -201.6,58.1 -199.9,59.3 -198.1,60.3 -196.3,61.1 -195.5,62.6 -196.7,62.5 -197.3,61.6 -199.9,60.5 -200.7,61.8 -203.3,61.4 -205.8,59.8 -205,59.1 -208.7,58.8 -208.7,59.5 -210.2,59.7 -211.5,59.2 -214.5,59.3 -217.8,59 -224.9,54.7 -223.3,54.6 -222.8,54 -221.8,53.8 -221.2,54.3 -220.1,54.2 -218.7,53.1 -218.6,52.2 -219.4,51.2 -219.5,50 -219.9,48.4 -221.4,47 -221.8,46.3 -225.1,43.4 -226.5,42.8 -227.1,42.8 -227.7,43.3 -229.6,42.3 -230.3,41.6 -230.3,40.9 -231.4,40.2 -232.5,39.8 -232.6,39.2 -231.6,38.6 -230.8,37.4 -230.5,36.8 -230.5,35.6 -230.9,35.1 -232.6,34.5 -233.5,34.4 -233.4,35.7 -233.9,36.7 -233.1,36.9 -233.8,37.7 -235.3,38.1 -234.6,39.4 -235.7,39.9 -237.1,39.6 -237.9,39.2 -238.9,38.9 -238.4,39.4 -238.6,39.8 -237.8,40.4 -238.4,40.9 -240.4,39.9 -241,39.3 -242,39.2 -242.5,38.7 -241.9,38.1 -241.1,37.9 -241.1,37.4 -240.3,37.2 -239.2,37.9 -237.6,37.5 -237.5,36.9 -238.9,36.7 -239.4,36.1 -240.3,35.6 -240.8,34.9 -239.8,34.4 -239.4,33.4 -238.1,31.7 -238.1,30.9 -238.7,30.7 -238.5,30.1 -237.9,29.8 -238.3,28.2 -238.9,28.1 -240.4,25.7 -241.3,24.5 -244.1,22.8 -245.2,22.7 -245.8,22.2 -246.2,22.5 -246.8,22.1 -248.2,21.6 -249.2,21.4 -249.6,20.3 -250.1,20.3 -250.4,21 -250.1,21.4 -251.5,21.7 -253.3,20.7 -254.1,19.8 -254.3,19.1 -252.6,16.7 -251.7,16.1 -251.1,15.3 -250.7,13.4 -250.8,11.7 -252.8,10.4 -253.6,9.5 -254.8,8.6 -255.2,9.2 -254.9,9.9 -255.7,10.5 -256.5,10.6 -257.4,12.2 -258.3,12.6 -259.2,12.6 -259,13.4 -259.9,13.4 -260,12.3 -260.8,10 -260.8,9.2 -260.1,9.2 -259.5,7.4 -259,6.9 -258.4,6.7 -257,5.5 -256.6,4.9 -256.5,2.8 -256.1,2.5 -255.8,1.3 -256.5,1.2 -258.6,2.8 -259.3,3.9 -259.8,5.3 -259.7,6 -260.5,7.3 -261.5,8.4 -261.9,8.3 -261.4,9.9 -261.5,10.7 -261.2,11.4 -261.6,12 -261.5,13.1 -261.9,13.6 -262.4,16.1 -262.8,16.9 -264.6,15.7 -265.8,16 -265.5,17.3 -265.7,18.2 -266.5,19.4 -267.9,21.2 -268.2,22.2 -268.6,22.8 -269.5,22.8 -269.7,21.8 -271,22.1 -271.1,21.7 -273,21.5 -273,20.7 -273.5,20.2 -274.9,19.5 -276.1,18.3 -277.8,17 -277.8,16.6 -279.7,15.9 -280,15.1 -279.7,13 -280.1,12.1 -280.1,10.4 -280.7,10.3 -281.1,9.5 -280.8,9.2 -281.7,8.9 -282.5,8 -283.4,8.9 -284.3,11.3 -285.1,12.7 -285.6,14.6 -286.5,16 -287.2,19.2 -287.4,21.4 -288.8,20.8 -289.5,20.9 -290.8,22.1 -290.4,22.5 -291.8,23.7 -292.6,23.9 -292.9,24.7 -293.6,25.4 -295.5,25.2 -298.5,25.1 -302.6,25.7 -303,27 -303.5,27.1 -305.3,26.5 -306.5,26.8 -307.5,27.6 -308.5,27.9 -309.9,30.1 -310.4,30 -311.1,30.3 -311.4,29.9 -312,30 -311.9,29.3 -311.2,27.7 -309.8,26.7 -309.9,25.9 -309.2,24.8 -309.3,25.5 -308.7,26.1 -308.4,25.8 -308.6,24.6 -308.2,24 -307.4,24.2 -306,24.1 -303.6,26.4 -303.6,24.9 -302.6,23.9 -301.3,23.6 -300.2,22.3 -301.5,20.4 -302,20.5 -302.3,19.7 -302.2,19.1 -303.4,18.6 -303.7,17.9 -304.3,17.9 -304.7,17.2 -305.8,17 -307.6,16.4 -307.8,15.6 -310.4,14.7 -311.3,14 -312.1,14 -312.6,13.6 -314.4,13.3 -315,12.7 -316.5,12.6 -317.1,14.8 -317.3,16.8 -318.2,17.8 -319.1,19.5 -320.2,20.3 -320.9,21.3 -320.9,22.6 -321.5,23.7 -322.5,24.3 -322.8,25.1 -324.9,28.1 -325.4,28.1 -325,29.4 -326.1,27.6 -326.9,28.4 -327.6,29.9 -327.3,28.7 -325.9,26.1 -324.3,23.9 -324.5,23.1 -323.1,22 -322.8,21 -323,20.8 -322.5,18.6 -321.6,18 -320.7,15.9 -318.8,14.5 -316.7,12.4 -317.3,11.7 -316.5,11.3 -315.9,10.4 -313.4,10.8 -311.6,11.4 -310.7,11.4 -308.9,12 -309,10.6 -309.4,9.2 -310.5,6.8 -311.4,5.3 -313.4,2.9 -316.9,0.3 -318,-0.9 -318.4,-1.7 -319.7,-2.6 -320.4,-4.3 -320.8,-4.7 -321.3,-5.9 -321.2,-6.5 -320.6,-6.8 -320.8,-8.5 -320,-10.1 -319.5,-10.8 -319.6,-11.8 -319.4,-14.2 -319.2,-14.7 -319.9,-16.1 -320.5,-16.7 -322.6,-17.6 -323.7,-18.7 -325.2,-19.8 -325.3,-20.5 -324.4,-22.1 -324.4,-23.7 -325,-24.5 -327,-25.4 -327.4,-25.7 -327.1,-26.2 -327.5,-28.3 -328.7,-29.4 -329.9,-31.1 -331.8,-32.8 -334.2,-33.9 -335.3,-34 -336.4,-33.8 -337.4,-33.9 -340.4,-34.8 -341.8,-33.9 -342.1,-32.6 -341.8,-32.4 -341.8,-31.7 -342.4,-30.7 -343.7,-28.6 -344.4,-27.8 -344.8,-27.1 -345.6,-23.9 -345.7,-22.1 -346.6,-20.9 -347.4,-19 -348.2,-18.1 -348.4,-16.7 -347.8,-14.4 -347.3,-13.1 -346.4,-12 -346.3,-10.7 -347.1,-9.2 -346.8,-8.6 -347.3,-6.9 -348.1,-5 -348.9,-4 -350.6,-2.1 -351.2,-1.1 -350.5,1 -350.7,1.2 -350.2,3.1 -351.1,3.9 -351.5,4.8 -353.3,4.2 -354.1,4.3 -355,5.6 -355.7,6.3 -357.3,6.3 -358.9,5.9 -362,4.7 -364,5.2 -365.8,5 -367.5,4.3 -369,4.8 -370.8,6.1 -371.4,6.8 -372.4,7.3 -372.9,7.8 -373.2,8.9 -374.6,10.2 -374.8,10.9 -376.1,11.5 -376.6,12.2 -376.7,13.6 -377.6,14.7 -377.2,14.9 -376.5,16.1 -376.1,18.1 -376.4,19.6 -376.3,20.1 -377.1,21 -377,21.9 -376.3,22.7 -376,23.7 -375.1,24.5 -374.4,26.3 -373.8,26.6 -373.1,27.6 -372.6,28 -371.7,28.1 -370.4,29.1 -369.6,29.9 -369.8,31.2 -369.3,32.6 -368.7,33.2 -366.9,34.1 -365.9,35.8 -365.2,35.8 -364.6,35.3 -363.6,35.4 -362.2,35.2 -361.2,35.7 -360.1,35.9 -358.5,36.6 -355.2,36.9 -354.7,36.7 -353.7,37.1 -351.6,36.9 -350.5,37.4 -349.8,37.2 -349.8,36.7 -349,37.1 -349.4,36.4 -349.1,35.7 -349.2,34.8 -349.8,34.3 -349.7,33.8 -349.1,33.8 -348.9,33.3 -347.3,32.8 -346.1,32.7 -344.8,32.3 -344.3,31.4 -342,30.8 -340.9,30.3 -339.9,31 -340.2,31.8 -339.1,32.7 -338.5,32.8 -337.1,32.6 -336.8,32.2 -335.1,31.9 -334.8,31.6 -333.5,31.6 -331.1,30.9 -329.9,31.5 -328.3,31.4 -326.2,31 -325.7,31.2 -325,32.8 -324,34.6 -323.9,35.8 -324.4,36.6 -325.3,36.8 -326,36.2 -327.5,36.1 -328.3,36.6 -329.4,36.7 -329.6,36.3 -330.3,36.1 -331.3,36.7 -332.4,36.7 -333,37.7 -333.7,38.2 -333.2,39 -333.8,39.5 -332.7,40.4 -331.2,40.5 -330.8,41.2 -328.9,41.1 -327.7,41.7 -326.5,42 -324.8,42 -323.1,41.3 -321.7,40.9 -319.6,41 -318.4,41.5 -318.5,42.6 -319.7,43.1 -321.3,44.3 -322.5,44.7 -323.3,45.2 -322.6,45.4 -321.8,46.2 -322.3,46.6 -320.9,47 -320.9,47.3 -322.6,47 -323.2,46.7 -324.2,46.6 -325,46.3 -325,45.7 -324.5,45.4 -323.5,45.5 -323.7,45.1 -324.8,44.9 -326.1,44.4 -326.7,44.6 -326.5,45 -327.5,45.3 -326.4,45.9 -326.7,46.1 -328.3,46.3 -328.3,46.7 -329.3,46.6 -330.4,45.3 -331.2,44.9 -331.4,43.7 -332.3,42.6 -331.9,41.6 -331,41.3 -331.2,41.1 -332.4,41 -333.6,40.2 -333.9,40.8 -335.1,40.9 -336.3,40.7 -335.6,40.1 -336.7,40 -337.2,40.5 -337.1,39.7 -336.6,39.2 -337,39 -336,38.2 -336,37.7 -336.9,37.9 -336.6,37.4 -337.2,37.3 -336.8,36.4 -337.5,36.4 -338.3,36.8 -338.9,38.3 -340.6,40.3 -340.5,41.7 -341.1,42.3 -344,43.5 -344.8,44.2 -345.1,45.1 -345.7,45.2 -346,44.8 -346.1,45.6 -346.9,45.7 -347.7,45.4 -347.7,44.6 -347.4,44.1 -346.5,43.6 -346,42.8 -344.9,42 -344.1,42 -344.1,41.5 -342.5,40.9 -341.6,40.4 -341.7,39.8 -342.3,40.3 -343.1,40.4 -343.5,39.8 -342.8,39.4 -343.9,38 -344.3,37.9 -343.9,39 -344.6,40 -346.4,41.2 -347.1,41.3 -349.5,42.9 -349.8,43.9 -351.1,44.4 -353.5,43.1 -355.4,43.4 -356.9,43.1 -357,41.9 -357.9,41.2 -359.2,41 -360.3,39.3 -359.9,38.7 -360.5,38.3 -360.7,37.6 -361.4,37.4 -362.1,36.7 -364.4,36.7 -365.4,35.9 -365.9,36 -366.5,36.9 -367.5,37.1 -367.9,36.8 -368.9,36.9 -368.8,38.3 -369.5,38.7 -368.8,40.8 -369,42.6 -369.4,43 -368,43.7 -364.3,43.4 -361.9,43.4 -361.4,44 -361.2,46 -362.2,47.1 -363,47.6 -364.5,48 -364.6,48.7 -363.3,48.9 -361.6,48.6 -361.9,49.8 -361,49.3 -358.7,50.1 -358.4,50.9 -356.7,51.3 -356.2,51.6 -355.3,53.1 -353.9,53.5 -353.1,53.5 -352.1,53.7 -351.9,53.5 -351.2,54 -351.9,55.5 -351.9,56.5 -351.5,57.1 -350.6,57.2 -349.4,57.7 -349.6,56.6 -349.1,56.5 -350.4,55.5 -350.1,54.6 -349.1,54.4 -349.1,54 -347.5,54.5 -345.9,53.8 -345.2,54.1 -342.4,54.9 -341.3,54.4 -340.3,54.4 -340.1,54.9 -338.7,55.2 -338.9,56.8 -338.4,57.4 -337.5,57.8 -336.7,57 -335.9,57 -335.6,58.4 -336.6,58.6 -336.7,59.2 -334.1,59.6 -332,59.5 -330.9,60 -331.9,60.5 -333.7,60.4 -337.1,59.8 -337.7,60.4 -338.7,60.7 -338.5,61.7 -338.9,62.6 -337.6,63.8 -335.3,64.9 -334.6,65.1 -334.7,65.5 -336.1,66 -337.8,65.7 -338.8,65 -338.6,64.4 -342.2,62.7 -342.9,61.3 -342.2,60.6 -341.2,60.1 -342.1,59 -343.2,58.7 -343.6,57 -344.1,56.1 -345.3,56.2 -345.9,55.4 -347.1,55.4 -347.4,56.3 -348.2,57.4 -349,58.9 -349.6,59.5 -351.6,58.3 -352.9,58.1 -354.3,58.6 -354.7,59.7 -355,62 -354.1,62.6 -351.4,63.5 -349.5,64.5 -345.2,67.8 -340.8,69.8 -338.6,70.3 -337,70.2 -335.5,71 -333.6,71 -331.8,71.2 -328.7,70.5 -330,70.2 -328.9,69.6 -327.9,69.9 -326.2,69.3 -323.5,69.1 -319.7,67.9 -318.9,67.5 -318.9,66.8 -320,66.3 -321.6,66 -326.1,66.8 -326.8,66.6 -325.2,65.9 -325.1,64.4 -323,63.9 -322.9,64.3 -323.5,64.8 -322.8,65.1 -320.4,64.5 -319.6,64.8 -320.2,65.5 -317.9,66.5 -317,66.4 -316,66.1 -315.5,66.8 -316.3,67.4 -315.8,68 -316.5,68.6 -313.7,68.2 -313.2,67.7 -314.4,67.6 -314.4,67 -313.7,66.7 -312.1,66.9 -311.9,67.5 -306.3,68.9 -305.5,68.8 -306.5,68.2 -305.3,68.1 -304.6,68.4 -302.7,68.5 -301.2,68.9 -300.1,68.3 -298.9,68.9 -300,69.5 -299.4,69.9 -296.5,69.5 -295.1,69.2 -291.5,68.1 -290.8,68.6 -291.9,69.4 -293.1,69.5 -292.7,69.9 -293.3,71 -291.5,71.9 -290.8,72.8 -290.1,73 -287.4,72.8 -287.2,72.2 -288.2,71.4 -287.5,71.1 -287.2,70.4 -287.4,69 -286.3,68.4 -286.8,67.7 -288.7,66.3 -287.6,66.2 -287.2,66.5 -286.1,66.8 -285.8,67.3 -284.9,67.8 -285.5,68.3 -285.1,69 -286.2,69.1 -286.4,69.6 -285.6,70.6 -286.9,71.4 -285.1,72.1 -285.3,72.8 -284.8,72.9 -284.3,72.3 -284.7,71.3 -283.6,71.2 -284.1,71.9 -282.4,72.3 -280.3,72.3 -278.5,71.7 -279.4,72.6 -279.5,73.6 -277.7,73.9 -275.3,73.8 -273.2,73.9 -274,74.5 -272.8,75.1 -271.7,75.1 -269.7,75.6 -267.1,75.8 -266.8,76 -264.1,76.1 -263.3,75.9 -261.1,76.4 -259.2,76.4 -259,76.9 -258,77.3 -255.6,77.7 -253.9,77.4 -255.3,77.1 -253,77 -252.8,76.5 -251.8,76.7 -248.9,76.7 -246.7,76.2 -245.9,75.8 -246.1,75.3 -249.8,74.5 -250.6,74.2 -247.9,73.8 -247,74 -246.5,73.3 -246,73.6 -244.4,73.8 -241.2,73.6 -241,73.1 -236.8,73 -236.7,73.7 -234.6,73.6 -233,73.6 -231.4,73 -230.9,72.4 -231.5,72 -230.3,71.2 -228.7,70.8 -227.7,71.8 -226.1,71.4 -224.4,71.7 -222.5,71.3 -221.8,71.6 -220.1,71.5 -220.9,72.4 -219.5,72.8 -210.5,72.2 -209.6,71.6 -207,70.8 -203,71 -201,70.9 -200.2,70.5 -200.3,69.7 -199.1,69.4 -197.7,69.6 -195.9,69.7 -194.1,69.5 -192.2,69.6 -190.4,68.7 -189.2,69 -190,69.7 -189.5,70.1 -186.4,69.8 -184.3,69.9 -181.4,69.4 -180,69;-90.5,69.5 -90.5,68.5 -89.2,69.3 -88,68.6 -88.3,67.9 -87.3,67.2 -86.3,67.9 -85.6,68.8 -85.5,69.9 -82.6,69.7 -81.3,69.2 -81.2,68.7 -82,68.1 -81.3,67.6 -81.4,67.1 -83.3,66.4 -84.7,66.3 -85.8,66.6 -86.1,66.1 -87.3,64.8 -88.5,64.1 -89.9,64 -90.7,63.6 -90.8,63 -91.9,62.8 -93.2,62 -94.2,60.9 -94.6,60.1 -94.7,58.9 -93.2,58.8 -92.3,57.1 -90.9,57.3 -89,56.9 -87.3,56 -85,55.3 -82.3,55.1 -82.4,54.3 -82.1,53.3 -81.4,52.2 -79.9,51.2 -79.1,51.5 -78.6,52.6 -79.1,54.1 -79.8,54.7 -78.2,55.1 -77.1,55.8 -76.5,56.5 -76.6,57.2 -77.3,58.1 -78.5,58.8 -77.3,59.9 -77.8,60.8 -78.1,62.3 -77.4,62.6 -74.7,62.2 -73.8,62.4 -71.7,61.5 -71.4,61.1 -69.6,61.1 -69.6,60.2 -69.3,59 -68.4,58.8 -67.7,58.2 -66.2,58.8 -65.2,59.9 -64.6,60.3 -61.4,57 -61.8,56.3 -60.5,55.8 -59.6,55.2 -58,54.9 -57.3,54.6 -56.9,53.8 -56.2,53.6 -55.8,53.3 -55.7,52.1 -57.1,51.4 -58.8,51.1 -60,50.2 -61.7,50.1 -63.9,50.3 -66.4,50.2 -67.2,49.5 -68.5,49.1 -71.1,46.8 -70.3,47 -68.7,48.3 -66.6,49.1 -65.1,49.2 -64.2,48.7 -65.1,48.1 -64.5,46.2 -63.2,45.7 -61.5,45.9 -60.5,47 -60.5,46.3 -59.8,45.9 -61,45.3 -63.3,44.7 -64.2,44.3 -65.4,43.5 -66.1,43.6 -66.2,44.5 -64.4,45.3 -67.1,45.1 -67,44.8 -68,44.3 -70.1,43.7 -70.8,42.9 -70.5,41.8 -70,41.6 -72.9,41.2 -73.7,40.9 -72.2,41.1 -71.9,40.9 -74,40.6 -74.2,39.7 -74.9,38.9 -75.5,39.5 -75.1,38.4 -75.9,37.2 -75.7,37.9 -76.5,38.7 -76.3,37 -76,36.9 -75.7,35.6 -76.4,34.8 -77.4,34.5 -78.1,33.9 -78.6,33.9 -79.2,33.2 -80.3,32.5 -81.3,31.4 -81.5,30.7 -81,29.2 -80.1,26.9 -80.4,25.2 -81.2,25.2 -81.7,25.9 -82.9,27.9 -82.7,28.6 -83.7,29.9 -84.1,30.1 -85.1,29.6 -86.4,30.4 -88.4,30.4 -89.6,30.2 -89.4,29.2 -90.9,29.1 -91.6,29.7 -92.5,29.6 -93.2,29.8 -94.7,29.5 -95.6,28.7 -96.6,28.3 -97.4,27.4 -97.1,25.9 -97.7,24.3 -97.9,22.4 -97.2,20.6 -95.9,18.8 -94.8,18.6 -94.4,18.1 -91.4,18.9 -90.8,19.3 -90.3,21 -88.5,21.5 -87.1,21.5 -86.8,20.8 -87.4,20.3 -87.4,19.5 -87.8,18.3 -88.1,18.5 -88.4,16.5 -88.9,15.9 -86.4,15.8 -86,16 -84.4,15.8 -83.1,15 -83.6,13.1 -83.5,12.4 -83.9,11.4 -83.4,10.4 -82.2,9.2 -81.4,8.8 -79.9,9.3 -79.6,9.6 -78.1,9.2 -77.4,8.7 -76.8,8.6 -75.7,9.4 -75.5,10.6 -74.2,11.3 -73.4,11.2 -71.8,12.4 -71.1,12.1 -71.4,11.5 -71.9,11.4 -71.6,10.4 -72.1,9.9 -71.7,9.1 -71.3,9.1 -71,9.9 -71.4,11 -70.2,11.4 -69.9,12.2 -69.6,11.5 -68.9,11.4 -68.2,10.6 -66.2,10.6 -65.7,10.2 -64.9,10.1 -64.3,10.6 -61.9,10.7 -62.7,10.4 -62.4,9.9 -61.6,9.9 -60.8,9.4 -60.7,8.6 -60.2,8.6 -59.1,8 -58.1,6.8 -57.1,6 -55.9,5.8 -55,6 -52.9,5.4 -51.3,4.2 -50.5,1.9 -50,1.7 -49.9,1 -50.7,0.2 -50.4,-0.1 -48.6,-0.2 -48.6,-1.2 -47.8,-0.6 -44.9,-1.6 -44.4,-2.1 -44.6,-2.7 -43.4,-2.4 -41.5,-2.9 -40,-2.9 -38.5,-3.7 -37.2,-4.8 -35.6,-5.1 -35.2,-5.5 -34.7,-7.3 -35.1,-9 -37,-11 -37.7,-12.2 -39,-13.8 -38.9,-15.7 -39.3,-17.9 -39.6,-18.3 -39.8,-19.6 -40.8,-20.9 -40.9,-21.9 -41.8,-22.4 -42,-23 -43.1,-23 -44.6,-23.4 -45.4,-23.8 -46.5,-24.1 -47.6,-24.9 -48.5,-25.9 -48.5,-27.2 -48.9,-28.7 -49.6,-29.2 -50.7,-31 -52.3,-32.2 -52.7,-33.2 -53.8,-34.4 -54.9,-35 -56.2,-34.9 -57.1,-34.4 -57.8,-34.5 -58.4,-33.9 -58.5,-34.4 -57.2,-35.3 -57.4,-36 -56.7,-36.4 -56.8,-36.9 -57.7,-38.2 -59.2,-38.7 -61.2,-38.9 -62.3,-38.8 -62.1,-39.4 -62.3,-40.2 -62.1,-40.7 -62.7,-41 -63.8,-41.2 -64.7,-40.8 -65.1,-41.1 -65,-42.1 -64.3,-42.4 -63.8,-42 -63.5,-42.6 -64.4,-42.9 -65.2,-43.5 -65.6,-45 -66.5,-45 -67.3,-45.6 -67.6,-46.3 -66.6,-47 -65.6,-47.2 -66,-48.1 -67.2,-48.7 -67.8,-49.9 -68.7,-50.3 -69.1,-50.7 -68.8,-51.8 -68.2,-52.4 -69.5,-52.3 -70.8,-52.9 -71,-53.8 -72.6,-53.5 -74.9,-52.3 -75.3,-51.6 -75,-51 -75.5,-50.4 -75.6,-48.7 -75.2,-47.7 -74.1,-46.9 -75.6,-46.6 -74.7,-45.8 -74.4,-44.1 -73.2,-44.5 -72.7,-42.4 -73.4,-42.1 -73.7,-43.4 -74.3,-43.2 -73.7,-39.9 -73.2,-39.3 -73.6,-37.2 -73.2,-37.1 -71.9,-33.9 -71.4,-32.4 -71.7,-30.9 -71.4,-30.1 -71.5,-28.9 -70.9,-27.6 -70.7,-25.7 -70.1,-21.4 -70.2,-19.8 -70.4,-18.3 -71.4,-17.8 -71.5,-17.4 -73.4,-16.4 -75.2,-15.3 -76,-14.6 -76.4,-13.8 -76.3,-13.5 -77.1,-12.2 -79,-8.4 -79.8,-7.2 -81.3,-6.1 -80.9,-5.7 -81.4,-4.7 -81.1,-4 -80.3,-3.4 -79.8,-2.7 -80,-2.2 -80.4,-2.7 -81,-2.2 -80.9,-1.1 -80.6,-0.9 -80,0.4 -80.1,0.8 -78.9,1.4 -78.4,2.6 -77.9,2.7 -77.1,3.8 -77.5,4.1 -77.3,4.7 -77.5,5.6 -77.5,6.7 -78.2,7.5 -78.2,8.3 -79.1,9 -80.5,8.1 -80,7.5 -80.9,7.2 -81.1,7.8 -81.7,8.1 -83,8.2 -83.7,8.7 -83.6,9.1 -84.9,9.8 -85.1,9.6 -85.8,10.1 -85.7,11.1 -87.7,12.9 -87.8,13.4 -88.5,13.2 -91.2,13.9 -92.2,14.5 -93.4,15.6 -94.7,16.2 -96.6,15.7 -98,16.1 -98.9,16.6 -100.8,17.2 -101.9,17.9 -103.5,18.3 -103.9,18.7 -105,19.3 -105.7,20.4 -105.3,21.4 -106,22.8 -106.9,23.8 -107.9,24.5 -108.4,25.2 -109.4,25.8 -109.3,26.4 -110.4,27.2 -110.6,27.9 -111.2,27.9 -112.2,29 -113.2,30.8 -113.1,31.2 -114.8,31.8 -114.9,31.4 -114.7,30.2 -113,28.4 -112.8,27.8 -111.6,26.7 -110.7,24.8 -110.7,24.3 -110.2,24.3 -109.4,23.4 -110,22.8 -110.3,23.4 -112.2,24.7 -112.3,26 -113.5,26.8 -114.5,27.1 -115.1,27.7 -114.6,27.7 -114.2,28.6 -115.5,29.6 -116.7,31.6 -117.3,33 -118.5,34 -120.4,34.4 -120.7,35.2 -121.7,36.2 -122.5,37.6 -123.7,39 -123.9,39.8 -124.4,40.3 -124.2,42 -124.5,42.8 -124.1,43.7 -123.9,45.5 -124.1,46.9 -124.7,48.2 -124.6,48.4 -123.1,48 -122.6,47.1 -122.3,47.4 -122.5,48.2 -123,49 -125.6,50.4 -127.4,50.8 -128,51.7 -127.8,52.3 -129.1,52.8 -129.3,53.6 -130.5,54.3 -130.5,54.8 -132,55.5 -132.2,56.4 -133.5,57.2 -134.1,58.1 -136.6,58.2 -137.8,58.5 -139.9,59.5 -142.6,60.1 -144,60 -145.9,60.5 -147.1,60.9 -148.2,60.7 -148,60 -149.7,59.7 -151.7,59.2 -151.9,59.7 -151.4,60.7 -150.3,61 -150.6,61.3 -151.9,60.7 -152.6,60.1 -154,59.4 -153.3,58.9 -154.2,58.1 -156.3,57.4 -156.6,57 -158.1,56.5 -158.4,56 -159.6,55.6 -160.3,55.6 -163.1,54.7 -164.8,54.4 -164.9,54.6 -162.9,55.3 -161.8,55.9 -160.6,56 -160.1,56.4 -157.7,57.6 -157.6,58.3 -157,58.9 -159.1,58.4 -159.7,58.9 -160,58.6 -160.4,59.1 -161.4,58.7 -162,58.7 -161.9,59.6 -162.5,60 -163.8,59.8 -165.3,60.5 -165.4,61.1 -166.1,61.5 -165.7,62.1 -164.6,63.1 -163.1,63.1 -162.3,63.5 -161.5,63.5 -160.8,63.8 -161.5,64.4 -160.8,64.8 -162.5,64.6 -162.8,64.3 -163.5,64.6 -165,64.4 -166.4,64.7 -166.8,65.1 -168.1,65.7 -166.7,66.1 -164.5,66.6 -163.7,66.6 -163.8,66.1 -161.7,66.1 -162.5,66.7 -163.7,67.1 -165.4,68 -166.8,68.4 -166.2,68.9 -164.4,68.9 -163.2,69.4 -162.9,69.9 -161.9,70.3 -159,70.9 -158.1,70.8 -156.6,71.4 -155.1,71.1 -154.3,70.7 -153.9,70.9 -152.2,70.8 -152.3,70.6 -150.7,70.4 -149.7,70.5 -147.6,70.2 -144.9,70 -143.6,70.2 -142.1,69.9 -139.1,69.5 -137.5,69 -136.5,68.9 -134.4,69.6 -132.9,69.5 -131.4,69.9 -129.8,70.2 -129.1,69.8 -128.4,70 -128.1,70.5 -127.4,70.4 -125.8,69.5 -124.4,70.2 -124.3,69.4 -123.1,69.6 -122.7,69.9 -121.5,69.8 -119.9,69.4 -116.2,68.8 -115.2,68.9 -113.9,68.4 -115.3,67.9 -113.5,67.7 -110.8,67.8 -109.9,68 -108.9,67.4 -107.8,67.9 -108.8,68.3 -108.2,68.7 -106.1,68.8 -104.3,68 -103.2,68.1 -101.5,67.6 -99.9,67.8 -98.4,67.8 -98.6,68.4 -97.7,68.6 -96.1,68.2 -96.1,67.3 -95.5,68.1 -94.7,68.1 -94.2,69.1 -95.3,69.7 -96.5,70.1 -96.4,71.2 -95.2,71.9 -93.9,71.8 -92.9,71.3 -91.5,70.2 -92.4,69.7 -90.5,69.5;-27.1,83.5 -20.8,82.7 -22.7,82.3 -31.9,82.2 -31.4,82 -27.9,82.1 -24.8,81.8 -22.9,82.1 -22.1,81.7 -23.2,81.2 -20.6,81.5 -15.8,81.9 -12.8,81.7 -12.2,81.3 -16.3,80.6 -16.8,80.3 -20,80.2 -17.7,80.1 -19.7,78.8 -19.7,77.6 -18.5,77 -20,76.9 -21.7,76.6 -19.8,76.1 -19.6,75.2 -20.7,75.2 -19.4,74.3 -21.6,74.2 -20.4,73.8 -20.8,73.5 -23.6,73.3 -22.3,72.6 -22.3,72.2 -24.3,72.6 -24.8,72.3 -23.4,72.1 -22.1,71.5 -21.8,70.7 -23.5,70.5 -25.5,71.4 -25.2,70.8 -26.4,70.2 -22.3,70.1 -25,69.3 -27.7,68.5 -30.7,68.1 -31.8,68.1 -32.8,67.7 -34.2,66.7 -36.4,66 -39.8,65.5 -40.7,64.8 -40.7,64.1 -41.2,63.5 -42.8,62.7 -42.4,61.9 -43.4,60.1 -44.8,60 -46.3,60.9 -48.3,60.9 -49.2,61.4 -49.9,62.4 -51.6,63.6 -52.1,64.3 -52.3,65.2 -53.7,66.1 -53.3,66.8 -54,67.2 -53,68.4 -51.5,68.7 -50.9,69.9 -53.5,69.3 -54.7,69.6 -54.8,70.3 -54.4,70.8 -53.4,70.8 -51.4,70.6 -54,71.5 -55,71.4 -55.8,71.7 -54.7,72.6 -55.3,73 -57.3,74.7 -58.6,75.1 -58.6,75.5 -61.3,76.1 -63.4,76.2 -68.5,76.1 -71.4,77 -68.8,77.3 -66.8,77.4 -71,77.6 -73.3,78 -73.2,78.4 -65.7,79.4 -65.3,79.8 -68,80.1 -67.1,80.5 -63.7,81.2 -62.2,81.3 -62.6,81.8 -60.3,82 -57.2,82.2 -54.1,82.2 -53,81.9 -50.4,82.4 -48,82.1 -46.6,82 -44.5,81.7 -46.9,82.2 -46.8,82.6 -43.4,83.2 -39.9,83.2 -38.6,83.5 -35.1,83.6 -27.1,83.5;143.6,-13.8 143.9,-14.5 144.6,-14.2 145.4,-15 145.3,-15.4 145.6,-16.8 146.2,-17.8 146.4,-19 147.5,-19.5 148.8,-20.4 149.7,-22.3 150.1,-22.1 150.7,-22.4 150.9,-23.5 152.9,-25.3 153.1,-26.1 153.1,-27.3 153.6,-28.1 153.5,-29 153.1,-30.4 152.9,-31.6 152.4,-32.6 151.7,-33 151,-34.3 150.1,-36.4 150,-37.4 149.4,-37.8 148.3,-37.8 147.4,-38.2 146.3,-39 144.9,-38.4 145,-37.9 143.6,-38.8 140.6,-38 140,-37.4 139.6,-36.1 139.1,-35.7 138.1,-35.6 138.4,-35.1 138.2,-34.4 137.7,-35.1 136.8,-35.3 137.4,-34.7 137.9,-33.6 137.8,-32.9 137,-33.8 136.4,-34.1 136,-34.9 135.2,-34.5 135.2,-33.9 134.1,-32.8 134.3,-32.6 133,-32 132.3,-32 131.3,-31.5 129.5,-31.6 127.1,-32.3 126.1,-32.2 124.2,-33 123.7,-33.9 122.2,-34 121.3,-33.8 119.9,-34 118,-35.1 116.6,-35 115,-34.2 115,-33.6 115.5,-33.5 115.8,-32.2 115.2,-30.6 115,-29.5 114.6,-28.5 114.2,-28.1 114,-27.3 113.4,-25.6 114.2,-26.3 114.2,-25.8 113.4,-24.4 113.8,-23.1 113.7,-22.5 114.1,-21.8 114.2,-22.5 114.6,-21.8 116.7,-20.7 117.4,-20.7 120.9,-19.7 122.2,-18.2 122.3,-17.3 123,-16.4 123.4,-17.3 123.9,-17.1 123.5,-16.6 123.8,-16.1 124.3,-16.3 124.4,-15.6 125.7,-14.2 127.1,-13.8 128.4,-14.9 129.6,-15 129.4,-14.4 130.6,-12.5 131.2,-12.2 132.6,-12.1 132.6,-11.6 131.8,-11.3 132.4,-11.1 133.6,-11.8 135.3,-12.2 136.5,-11.9 137,-12.4 135.4,-14.7 135.5,-15 137.1,-15.9 139.3,-17.4 140.2,-17.7 140.9,-17.4 141.7,-15 141.5,-13.7 141.7,-12.4 142.1,-11 142.5,-10.7 142.9,-11.8 143.5,-12.8 143.6,-13.8;-180,-16.6 -180.6,-16.8 -181.3,-17 -181.4,-16.6 -180.6,-16.4 -180,-16.1 -180,-16.6;-86.6,73.2 -85.8,72.5 -84.9,73.3 -82.3,73.8 -80.6,72.7 -80.8,72.1 -78.8,72.4 -77.8,72.8 -75.6,72.2 -74.2,71.8 -74.1,71.3 -72.2,71.6 -71.2,70.9 -68.8,70.5 -67.9,70.1 -67,69.2 -68.8,68.7 -66.5,68.1 -64.9,67.8 -63.4,66.9 -61.9,66.9 -62.2,66.2 -63.9,65 -65.1,65.4 -66.7,66.4 -68,66.3 -68.1,65.7 -67.1,65.1 -65.3,64.4 -64.7,63.4 -65,62.7 -66.3,62.9 -68.8,63.7 -66.3,62.3 -66.2,61.9 -68.9,62.3 -71,62.9 -72.2,63.4 -71.9,63.7 -74.8,64.7 -74.8,64.4 -77.7,64.2 -78.6,64.6 -77.9,65.3 -74,65.5 -74.3,65.8 -73.9,66.3 -72.7,67.3 -73.3,68.1 -74.8,68.6 -76.9,68.9 -76.2,69.1 -77.3,69.8 -78.2,69.8 -79,70.2 -79.5,69.9 -81.3,69.7 -84.9,70 -88.7,70.4 -89.5,70.8 -88.5,71.2 -89.9,71.2 -90.2,72.2 -89.4,73.1 -88.4,73.5 -85.8,73.8 -86.6,73.2;-180,71.5 -180,70.8 -181.1,70.8 -181.3,71.1 -180,71.5;-68.5,83.1 -63.7,82.9 -61.9,82.6 -61.9,82.4 -64.3,81.9 -66.8,81.7 -67.7,81.5 -65.5,81.5 -67.8,80.9 -69.5,80.6 -71.2,79.8 -73.2,79.6 -73.9,79.4 -76.9,79.3 -75.5,79.2 -76.2,79 -75.4,78.5 -76.3,78.2 -77.9,77.9 -78.4,77.5 -79.8,77.2 -79.6,77 -77.9,77 -77.9,76.8 -80.6,76.2 -83.2,76.5 -86.1,76.3 -89.5,76.5 -89.6,77 -87.8,77.2 -88.3,77.9 -87.6,78 -85,77.5 -86.3,78.2 -88,78.4 -87.2,78.8 -85.4,79 -85.1,79.3 -86.5,79.7 -86.9,80.3 -84.2,80.2 -83.4,80.1 -81.8,80.5 -84.1,80.6 -87.6,80.5 -89.4,80.9 -91.4,81.6 -91.6,81.9 -90.1,82.1 -87,82.3 -85.5,82.7 -84.3,82.6 -83.2,82.3 -82.4,82.9 -79.3,83.1 -76.3,83.2 -75.7,83.1 -72.8,83.2 -68.5,83.1;134.1,-1.2 134.4,-2.8 135.5,-3.4 136.3,-2.3 137.4,-1.7 138.3,-1.7 139.9,-2.4 141,-2.6 142.7,-3.3 144.6,-3.9 145.8,-4.9 146,-5.5 147.6,-6.1 147.9,-6.6 147,-6.7 147.2,-7.4 148.1,-8 148.7,-9.1 149.3,-9.1 149.3,-9.5 150.8,-10.3 150,-10.7 149.8,-10.4 147.9,-10.1 146.6,-8.9 146,-8.1 144.7,-7.6 143.3,-8.2 143.4,-9 142.6,-9.3 141,-9.1 140.1,-8.3 139.1,-8.1 138.9,-8.4 137.6,-8.4 138,-7.6 138.7,-7.3 138.4,-6.2 137.9,-5.4 136,-4.5 135.2,-4.5 133.7,-3.5 133,-4.1 132.8,-3.3 132,-2.8 133.7,-2.2 132.2,-2.2 131.8,-1.6 130.9,-1.4 130.5,-0.9 131.9,-0.7 132.4,-0.4 134,-0.8 134.1,-1.2;141,37.1 140.6,36.3 140.8,35.8 140.3,35.1 139,34.7 137.2,34.6 135.8,33.5 135.1,33.8 135.1,34.6 133.3,34.4 132.2,33.9 131,33.9 132,33.1 131.3,31.5 130.7,31 130.2,31.4 130.4,32.3 129.8,32.6 129.4,33.3 130.4,33.6 130.9,34.2 131.9,34.8 132.6,35.4 134.6,35.7 135.7,35.5 136.7,37.3 137.4,36.8 139.4,38.2 140.1,39.4 139.9,40.6 140.3,41.2 141.4,41.4 141.9,40 141.9,39.2 141,38.2 141,37.1;105.8,-5.9 104.7,-5.9 103.9,-5 102.6,-4.2 101.4,-2.8 100.1,-0.7 99.3,0.2 98.6,1.8 97.7,2.5 97.2,3.3 96.4,3.9 95.4,5 95.3,5.5 97.5,5.2 98.4,4.3 99.7,3.2 100.6,2.1 101.7,2.1 102.5,1.4 103.1,0.6 103.8,0.1 103.4,-0.7 104.4,-1.1 104.9,-2.3 105.6,-2.4 106.1,-3.1 105.9,-4.3 105.8,-5.9;117.9,1.8 119,0.9 117.8,0.8 117.5,0.1 117.5,-0.8 116.6,-1.5 116.5,-2.5 116.1,-4 116,-3.7 114.9,-4.1 114.5,-3.5 113.3,-3.1 112.1,-3.5 111.7,-3 110.2,-2.9 110.1,-1.6 109.6,-1.3 109.1,-0.5 109.1,1.3 109.7,2 110.4,1.7 111.2,1.9 111.4,2.7 113,3.1 114.2,4.5 116.2,6.1 116.7,6.9 117.1,6.9 117.7,6 119.2,5.4 119.1,5 118.4,5 118.6,4.5 117.9,4.1 117.3,3.2 118,2.3 117.9,1.8;57.5,70.7 56.9,70.6 53.7,70.8 53.4,71.2 51.6,71.5 51.5,72 52.5,72.2 52.4,72.8 54.4,73.6 53.5,73.8 55.9,74.6 55.6,75.1 57.9,75.6 61.2,76.3 64.5,76.4 66.2,76.8 68.2,76.9 68.9,76.5 68.2,76.2 61.6,75.3 58.5,74.3 55.4,72.4 55.6,71.5 57.5,70.7;50.1,-13.6 50.5,-15.2 50.2,-16 49.9,-15.4 49.9,-16.5 49.5,-17.1 49.4,-18 47.1,-24.9 45.4,-25.6 44,-25 43.3,-22.1 43.4,-21.3 44.4,-20.1 44.5,-19.4 44,-18.3 44,-17.4 44.4,-16.2 46.3,-15.8 47.7,-14.6 48.8,-13.1 49.2,-12 50.1,-13.6;-114.2,73.1 -114.7,72.7 -112.4,73 -111.1,72.5 -109.9,73 -109,72.6 -108.2,71.7 -107.7,72.1 -108.4,73.1 -107.5,73.2 -105.4,72.7 -104.5,71 -101,70 -101.1,69.6 -102.7,69.5 -102.1,69.1 -102.4,68.8 -106,69.2 -107.1,69.1 -109,68.8 -113.3,68.5 -113.9,69 -115.2,69.3 -116.1,69.2 -117.3,70 -115.1,70.2 -113.7,70.2 -112.4,70.4 -114.3,70.6 -117.9,70.5 -118.4,70.9 -116.1,71.3 -117.7,71.3 -119.4,71.6 -117.9,72.7 -115.2,73.3 -114.2,73.1;-3,58.6 -4.1,57.6 -2,57.7 -2.2,56.9 -3.1,56 -2.1,55.9 -1.1,54.6 -0.4,54.5 0.5,52.9 1.7,52.7 1.6,52.1 1,51.8 1.4,51.3 0.5,50.8 -0.8,50.8 -2.5,50.5 -3,50.7 -3.6,50.2 -4.5,50.3 -5.2,50 -5.8,50.2 -4.3,51.2 -3.4,51.4 -5,51.6 -5.3,52 -4.2,52.3 -4.8,52.8 -4.6,53.5 -3.1,53.4 -2.9,54 -3.6,54.6 -4.8,54.8 -4.7,55.5 -5,55.8 -5.6,55.3 -5.6,56.3 -6.2,56.8 -5.8,57.8 -5,58.6 -3,58.6;-94.7,77.1 -93.6,76.8 -91.6,76.8 -90.7,76.5 -91,76.1 -89.2,75.6 -86.4,75.5 -84.8,75.7 -82.8,75.8 -81.1,75.7 -80.1,75.3 -79.8,74.9 -80.5,74.7 -81.9,74.4 -83.2,74.6 -86.1,74.4 -88.1,74.4 -92.4,74.8 -92.9,75.9 -93.9,76.3 -96,76.4 -97.1,76.8 -96.7,77.2 -94.7,77.1;173,-40.9 173.2,-41.3 174,-40.9 174.2,-41.8 172.7,-43.4 173.1,-43.9 172.3,-43.9 171.5,-44.2 170.6,-45.9 169.3,-46.6 168.4,-46.6 167.8,-46.3 166.7,-46.2 166.5,-45.9 167,-45.1 168.3,-44.1 168.9,-43.9 170.5,-43 172,-41.5 172.1,-41 172.8,-40.5 173,-40.9;125.2,1.4 124.4,0.4 123.7,0.2 122.7,0.4 120.2,0.2 120,-0.5 120.9,-1.4 121.5,-1 123.3,-0.6 122.4,-1.5 121.5,-1.9 122.5,-3.2 122.3,-3.5 123.2,-4.7 123.2,-5.3 122.6,-5.6 122.2,-5.3 122.7,-4.5 121.7,-4.9 121.6,-4.2 120.9,-3.6 121,-2.6 120.3,-2.9 120.4,-5.5 119.8,-5.7 119.4,-5.4 119.7,-4.5 119.5,-3.5 119.1,-3.5 118.8,-2.8 120,0.6 120.9,1.3 121.7,1 124.1,0.9 125.1,1.6 125.2,1.4;174.6,-36.2 175.3,-37.2 175.4,-36.5 175.8,-36.8 176,-37.6 177.4,-38 178,-37.6 178.5,-37.7 178,-39.2 177.2,-39.1 177,-39.9 176,-41.3 175.2,-41.7 174.7,-41.3 175.2,-40.5 174.9,-39.9 173.8,-39.5 173.9,-39.1 174.6,-38.8 174.7,-37.4 174.3,-36.5 173.1,-35.2 172.6,-34.5 173,-34.5 173.6,-35 174.3,-35.3 174.6,-36.2;-120.5,71.4 -123.1,70.9 -123.6,71.3 -125.9,71.9 -124.8,73 -123.9,73.7 -124.9,74.3 -121.5,74.4 -120.1,74.2 -117.6,74.2 -115.5,73.5 -116.8,73.2 -119.2,72.5 -120.5,71.8 -120.5,71.4;18.3,79.7 21.5,79 19,78.6 18.5,77.8 17.6,77.6 17.1,76.8 15.9,76.8 13.8,77.4 14.7,77.7 13.2,78 11.2,78.9 10.4,79.7 13.2,80 13.7,79.7 15.1,79.7 15.5,80 17,80.1 18.3,79.7;-79.7,22.8 -79.3,22.4 -78.3,22.5 -76.5,21.2 -75.6,21 -74.2,20.3 -74.3,20.1 -75.6,19.9 -77.8,19.9 -77.1,20.4 -78.1,20.7 -78.7,21.6 -79.3,21.6 -80.5,22 -81.8,22.2 -81.8,22.6 -82.8,22.7 -84.1,21.9 -85,21.9 -84.2,22.6 -82.3,23.2 -80.6,23.1 -79.7,22.8;-87,79.7 -85.8,79.3 -87.2,79 -89,78.3 -90.8,78.2 -92.9,78.3 -94,78.8 -93.9,79.1 -93.1,79.4 -95,79.4 -96.1,79.7 -96.7,80.2 -95.3,80.9 -94.3,81 -94.7,81.2 -92.4,81.3 -91.1,80.7 -87.8,80.3 -87,79.7;-56.1,50.7 -56.8,49.8 -56.1,50.1 -55.5,49.9 -55.8,49.6 -54.9,49.3 -54.5,49.6 -53.5,49.2 -53.8,48.5 -53.1,48.7 -52.6,47.5 -53.1,46.7 -54.2,46.8 -54,47.6 -54.2,47.8 -55.4,46.9 -56,46.9 -55.3,47.4 -56.3,47.6 -59.3,47.6 -58.8,48.3 -59.2,48.5 -58.4,49.1 -57.4,50.7 -56.7,51.3 -55.4,51.6 -56.1,50.7;-14.5,66.5 -14.7,65.8 -13.6,65.1 -14.9,64.4 -18.7,63.5 -22.8,64 -21.8,64.4 -24,64.9 -22.2,65.1 -22.2,65.4 -24.3,65.6 -23.7,66.3 -22.1,66.4 -20.6,65.7 -19.1,66.3 -17.8,66 -16.2,66.5 -14.5,66.5;-67.8,-53.8 -66.5,-54.5 -65.1,-54.7 -65.5,-55.2 -66.5,-55.2 -67,-54.9 -67.3,-55.3 -68.1,-55.6 -69.2,-55.5 -71,-55.1 -73.3,-54 -74.7,-52.8 -73.8,-53 -72.4,-53.7 -71.1,-54.1 -70.3,-52.9 -69.3,-52.5 -68.6,-52.6 -67.8,-53.8;108.6,-6.8 110.5,-6.9 110.8,-6.5 112.6,-6.9 113,-7.6 114.5,-7.8 115.7,-8.4 114.6,-8.8 113.5,-8.3 111.5,-8.3 109.4,-7.7 108.3,-7.8 106.5,-7.4 106.3,-6.9 105.4,-6.9 106.1,-5.9 107.3,-6 108.5,-6.4 108.6,-6.8;-108.2,76.2 -107.8,75.8 -105.9,76 -105.7,75.5 -106.3,75 -109.7,74.9 -112.2,74.4 -113.7,74.4 -113.9,74.7 -111.8,75.2 -116.3,75 -117.7,75.2 -116.3,76.2 -115.4,76.5 -112.6,76.1 -110.8,75.5 -109.1,75.5 -110.5,76.4 -109.6,76.8 -108.6,76.7 -108.2,76.2;143.6,50.7 144.7,49 143.2,49.3 142.6,47.9 143.5,46.8 143.5,46.1 142.7,46.7 142.1,46 141.9,46.8 141.9,48.9 142.1,49.6 142.2,51 141.6,51.9 141.7,53.3 142.6,53.8 142.2,54.2 142.7,54.4 143.3,52.7 143.2,51.8 143.6,50.7;121.3,18.5 121.9,18.2 122.5,17.1 122.3,16.3 121.7,15.9 121.5,15.1 121.7,14.3 122.7,14.3 124,13.8 124.1,12.5 122.9,13.6 122.7,13.2 122,13.8 121.1,13.6 120.6,13.9 120.1,15 119.9,16.4 120.3,16 120.4,17.6 120.7,18.5 121.3,18.5;143.9,44.2 144.6,44 145.3,44.4 145.5,43.3 144.1,43 143.2,42 141.6,42.7 141.1,41.6 140,41.6 139.8,42.6 140.3,43.3 141.4,43.4 142,45.6 143.1,44.5 143.9,44.2;99.9,78.9 97.8,78.8 95,79 93.3,79.4 92.5,80.1 91.2,80.3 93.8,81 95.9,81.3 97.9,80.7 100.2,79.8 99.9,78.9;126.4,8.4 126.5,7.2 126.2,6.3 125.8,7.3 125.4,6.8 125.7,6 125.4,5.6 124.2,6.2 123.9,6.9 124.2,7.4 123.6,7.8 122.1,6.9 121.9,7.2 122.3,8 123.5,8.7 123.8,8.2 124.6,8.5 124.8,9 125.5,9 125.4,9.8 126.2,9.3 126.4,8.4;-85.2,65.7 -85,65.2 -84.5,65.4 -81.6,64.5 -81.6,64 -80.8,64.1 -80.1,63.7 -81,63.4 -82.5,63.7 -83.1,64.1 -84.1,63.6 -85.5,63.1 -85.9,63.6 -87.2,63.5 -86.4,64 -85.9,65.7 -85.2,65.7;-100.4,73.8 -99.2,73.6 -97.4,73.8 -97.1,73.5 -98.1,73 -96.5,72.6 -96.7,71.7 -98.4,71.3 -99.3,71.4 -100,71.7 -102.5,72.5 -102.5,72.8 -100.4,72.7 -101.5,73.4 -100.4,73.8;-6.8,52.3 -8.6,51.7 -10,51.8 -9.2,52.9 -9.7,53.9 -7.6,55.1 -6.7,55.2 -5.7,54.6 -6.2,53.9 -6,53.2 -6.8,52.3;-72.6,19.9 -71.7,19.7 -70.8,19.9 -69.2,19.3 -68.3,18.6 -68.7,18.2 -70,18.4 -71,18.3 -71.4,17.6 -71.7,18 -73.5,18.2 -73.9,18 -74.4,18.7 -72.7,18.4 -72.3,18.7 -72.8,19.5 -73.4,19.6 -72.6,19.9;25.4,80.4 27.4,80.1 25.9,79.5 23,79.4 20.1,79.6 19.9,79.8 18.5,79.9 17.4,80.3 20.5,80.6 21.9,80.4 22.9,80.7 25.4,80.4;145.1,75.6 144.3,74.8 140.6,74.8 139,74.6 137,75.3 137.5,75.9 138.8,76.1 141.5,76.1 145.1,75.6;-93.2,72.8 -94.3,72 -95.4,72.1 -96,72.9 -96,73.4 -95.5,73.9 -94.5,74.1 -92.4,74.1 -90.5,73.9 -92,73 -93.2,72.8;-123.5,48.5 -124,48.4 -125.7,48.8 -127,49.8 -128.1,50 -128.4,50.8 -125.8,50.3 -124.9,49.5 -123.9,49.1 -123.5,48.5;-116.2,77.6 -116.3,76.9 -117.1,76.5 -118,76.5 -119.9,76.1 -121.5,75.9 -122.9,76.1 -121.2,76.9 -119.1,77.5 -117.6,77.5 -116.2,77.6;145.4,-40.8 146.4,-41.1 147.7,-40.8 148.3,-40.9 148.4,-42.1 147.9,-43.2 147.6,-42.9 146.9,-43.6 146,-43.5 145.4,-42.7 145.3,-42 144.7,-41.2 144.7,-40.7 145.4,-40.8;-98.5,76.7 -97.7,76.3 -97.7,75.7 -98.2,75 -99.8,74.9 -100.9,75.1 -100.9,75.6 -102.5,75.6 -102.6,76.3 -101.5,76.3 -100,76.6 -98.5,76.7;152,-5.5 150.2,-6.3 149.7,-6.3 148.3,-5.7 148.4,-5.4 150.8,-5.5 151.6,-4.8 151.5,-4.2 152.3,-4.3 152,-5.5;-100.1,78.3 -99.7,77.9 -101.3,78 -102.9,78.3 -105.2,78.4 -104.2,78.7 -105.4,78.9 -105.5,79.3 -103.5,79.2 -100.8,78.8 -100.1,78.3;105.1,78.3 99.4,77.9 101.3,79.2 102.8,79.3 105.4,78.7 105.1,78.3;81.2,6.2 80.3,6 79.9,6.8 79.7,8.2 80.1,9.8 80.8,9.3 81.8,7.5 81.6,6.5 81.2,6.2;118.5,9.3 117.2,8.4 117.7,9.1 119,10.4 119.5,11.4 119.7,10.6 118.5,9.3;167.1,-22.2 166.7,-22.4 165.5,-21.7 164.2,-20.4 164,-20.1 165,-20.5 167.1,-22.2;124.4,-10.1 123.6,-10.4 124,-9.3 125.1,-8.7 127,-8.3 127,-8.7 125.1,-9.4 124.4,-10.1;121.2,22.8 120.7,22 120.2,22.8 120.1,23.6 120.7,24.5 121.5,25.3 122,25 121.2,22.8;51.1,80.5 48.9,80.3 47.6,80 46.5,80.2 47.1,80.6 44.8,80.6 46.8,80.8 48.3,80.8 48.5,80.5 50,80.9 51.5,80.7 51.1,80.5;-95.6,69.1 -96.3,68.8 -97.6,69.1 -98.4,69 -99.8,69.4 -98.2,70.1 -96.6,69.7 -95.6,69.1;153.1,-4.5 152.8,-4.8 152.4,-3.8 151.4,-3 150.7,-2.7 150.9,-2.5 152.2,-3.2 153,-4 153.1,-4.5;15.5,38.2 15.2,37.4 15.1,36.6 14.3,37 12.4,37.6 12.6,38.1 13.7,38 15.5,38.2;-76.3,73.1 -76.3,72.8 -78.4,72.9 -79.5,72.7 -80.9,73.3 -80.4,73.8 -78.1,73.7 -76.3,73.1;110.3,18.7 109.5,18.2 108.7,18.5 108.6,19.4 109.1,19.8 110.8,20.1 111,19.7 110.3,18.7;-58.5,-51.1 -57.7,-51.5 -58,-51.9 -59.4,-52.2 -59.8,-51.8 -60.7,-52.3 -61.2,-51.8 -60,-51.3 -59.2,-51.5 -58.5,-51.1;24.7,77.9 22.5,77.4 20.7,77.7 21.4,77.9 20.8,78.3 22.9,78.5 23.3,78.1 24.7,77.9;134.6,34.1 134.8,33.8 134.2,33.2 133.8,33.5 133.3,33.3 133,32.7 132.4,33 132.4,33.5 132.9,34.1 133.5,33.9 133.9,34.4 134.6,34.1;128.7,1.1 128.6,0.3 128.1,0.4 128.1,-0.9 127.7,-0.3 127.4,1 127.9,2.2 128,1.6 128.7,1.1;9.2,41.2 9.8,40.5 9.7,39.2 8.8,38.9 8.4,39.2 8.4,40.4 8.2,41 9.2,41.2;124,10.3 123,9 122.4,9.7 122.9,10.9 123.5,10.9 123.3,10.3 124.1,11.2 124,10.3;150.7,75.1 149.6,74.7 148,74.8 146.1,75.2 146.4,75.5 150.7,75.1;125.5,12.2 125.8,11 125,11.3 125.3,10.4 124.8,10.1 124.8,10.8 124.3,11.5 124.9,11.4 124.3,12.6 125.2,12.5 125.5,12.2;-93.6,75 -94.2,74.6 -95.6,74.7 -96.8,74.9 -96.3,75.4 -94.9,75.6 -93.6,75;-95.8,78.1 -97.3,77.8 -98.1,78.1 -98.6,78.9 -96.8,78.8 -95.6,78.4 -95.8,78.1;-153,57.1 -154,56.7 -154.7,57.5 -153.2,58 -152.1,57.6 -153,57.1;130.5,-3.1 130.8,-3.9 130,-3.4 127.9,-3.4 128.1,-2.8 129.4,-2.8 130.5,-3.1;-110.2,77.7 -112.1,77.4 -113.5,77.7 -112.7,78.1 -111.3,78.2 -109.9,78 -110.2,77.7;34.6,35.7 34,35 33,34.6 32.3,35.1 34.6,35.7;122.9,-8.1 122.8,-8.7 121.3,-8.9 119.9,-8.8 119.9,-8.4 120.7,-8.2 121.3,-8.5 122.9,-8.1;-171.7,63.8 -170.5,63.7 -168.7,63.3 -169.5,63 -170.7,63.4 -171.8,63.4 -171.7,63.8;143.6,73.2 142.1,73.2 139.9,73.4 140.8,73.8 142.1,73.9 143.5,73.5 143.6,73.2;117.9,-8.1 118.9,-8.3 119.1,-8.7 116.7,-9 117.1,-8.5 117.9,-8.1;23.7,35.7 24.2,35.4 26.3,35.3 26.2,35 24.7,34.9 23.5,35.3 23.7,35.7;-104.5,73.4 -105.4,72.8 -106.9,73.5 -105.3,73.6 -104.5,73.4;-61.8,49.1 -63.6,49.4 -64.5,49.9 -62.9,49.7 -61.8,49.1;-180,71.5 -179,71.6 -177.6,71.3 -178.7,70.9 -180,70.8 -180,71.5;-109.7,78.6 -110.9,78.4 -112.5,78.4 -111.5,78.9 -109.7,78.6;-93.8,77.5 -96.2,77.6 -96.4,77.8 -94.4,77.8 -93.8,77.5";
var BORDER_SRC = "40.3,-10.3 39.5,-10.9 36.5,-11.7 34.6,-11.5 33.7,-9.4 32.8,-9.2 30.7,-8.3 29.6,-6.5 29.3,-4.5 30.8,-3.4 30.5,-2.4 30.4,-1.1 33.9,-1 37.7,-3.1 37.8,-3.7 39.2,-4.7;-17,21.4 -14.8,21.5 -13.9,23.7 -12.5,24.8 -11.4,26.9 -8.8,27.1 -8.7,27.7 -8.7,27.4 -8.7,25.9 -12,25.9 -11.9,23.4 -12.9,23.3 -12.9,21.3 -16.8,21.3 -17.1,21;-130.5,54.8 -130,55.9 -131.7,56.6 -133.4,58.4 -135.5,59.8 -137.5,58.9 -139,60 -141,60.3 -141,69.7;-67.1,45.1 -67.8,45.7 -67.8,47.1 -69.2,47.4 -70.7,45.5 -71.5,45 -74.9,45 -76.8,43.6 -79.2,43.5 -78.9,42.9 -82.4,41.7 -83.1,42.1 -82.1,43.6 -82.6,45.3 -84.9,46.9 -88.4,48.3 -89.6,48 -91.6,48.1 -95.2,49 -122.8,49;-97.1,25.9 -99,26.4 -99.5,27.5 -101,29.4 -102.5,29.8 -103.1,29 -104.5,29.6 -105,30.6 -106.5,31.8 -108.2,31.8 -108.2,31.3 -111,31.3 -114.8,32.5 -117.1,32.5;49.1,46.4 48.1,47.7 46.5,48.4 47.6,50.5 48.6,49.9 48.7,50.6 50.8,51.7 52.3,51.7 55.7,50.6 58.4,51.1 59.6,50.5 61.3,50.8 61.6,51.3 60,52 61.7,53 61.4,54 65.2,54.4 69.1,55.4 70.9,55.2 71.2,54.1 73.5,54 73.4,53.5 76.5,54.2 77.8,53.4 80,50.9 80.6,51.4 81.9,50.8 83.4,51.1 85.5,49.7 86.8,49.8 87.4,49.2 85.8,48.5 85.2,47 83.2,47.3 82.5,45.5 80,44.9 80.9,43.2 80.3,42.4 79.1,42.9 76,43 74.2,43.3 73.5,42.5 71.8,42.8 71,42.3 69.1,41.4 68.6,40.7 66.7,41.2 66,42 66.1,43 64.9,43.7 62,43.5 61.1,44.4 58.5,45.6 55.9,45 56,41.3 54.1,42.3 52.5,41.8;71,42.3 70.4,41.5 73.1,40.9 71,40.2 70.7,41 69.3,40.7 68.5,39.5 67.4,39.1 68.4,38.2 67.8,37.1 66.5,37.4 66.5,38 64.2,38.9 62.4,40.1 61.9,41.1 60.1,41.4 60,42.2 58.6,42.8 56,41.3;141,-9.1 141,-2.6;125,-8.9 125.1,-9.4;109.7,2 110.5,0.8 112.9,1.5 114.6,1.4 115.9,4.3 117.9,4.1;-67,-54.9 -68.6,-54.9 -68.6,-52.6;-68.6,-52.3 -71.9,-52 -72.3,-50.7 -73.3,-50.4 -73.4,-49.3 -72.6,-48.9 -71.2,-44.8 -71.8,-44.2 -72.2,-42.3 -71.4,-38.9 -70.8,-38.6 -71.1,-36.7 -70.4,-36 -69.8,-34.2 -70.5,-31.4 -69.9,-30.3 -69.7,-28.5 -68.3,-26.9 -68.4,-24.5 -67.3,-24 -67.1,-22.7 -66.3,-21.8 -65,-22.1 -64.4,-22.8 -64,-22 -62.7,-22.2 -60.8,-23.9 -57.8,-25.2 -58.6,-27.1 -56.5,-27.5 -54.8,-26.6 -54.6,-25.7 -53.6,-26.1 -53.6,-26.9 -55.2,-27.9 -57.6,-30.2 -58.4,-33.9;-70.4,-18.3 -69.6,-17.6 -68.4,-19.4 -68.8,-20.4 -67.8,-22.9 -67.1,-22.7;30.7,-8.3 28.7,-8.5 28.4,-11.8 29.7,-13.3 28.9,-13.2 27.2,-11.6 26.6,-11.9 23.9,-10.9 22.2,-11.1 21.7,-7.3 19.4,-7.2 19,-8 17.5,-8.1 16.3,-5.9 13.4,-5.9 12.3,-6.1;12.2,-5.8 13,-4.8 14.6,-5 16,-3.5 16.4,-1.7 17.5,-0.7 17.9,1.7 18.5,3.5 19.5,5 22.4,4 22.7,4.6 24.4,5.1 27.4,5.2 28,4.4 29.7,4.6 30.8,3.5 31.2,2.2 29.9,0.6 29.6,-1.3 29,-2.8 29.3,-4.5;41.6,-1.7 41,-0.9 41,2.8 41.9,3.9 43.7,5 45,5 47.8,8 48.9,9.5 48.9,11.4;33.9,-1 33.9,0.1 35,1.9 34,4.3 35.3,5.5 36.2,4.4 38.1,3.6 39.6,3.4 40.8,4.3 41.9,3.9;38.4,18 36.9,17 36.4,14.4 35.9,12.6 34.3,10.6 34,8.7 33.7,10.3 33.2,10.7 33.2,12.2 32.1,12 32.4,11.1 31.4,9.8 30,10.3 29,9.4 26.5,9.6 25.8,10.4 25.1,10.3 24.6,8.2 23.5,9 23.6,10.1 22.9,11.1 22.3,12.6 22.3,14.3 23,15.7 23.9,15.6 23.8,19.6 25,20 25,22 36.9,22;22.9,11.1 21.7,10.6 21,9.5 18.8,9 18,7.9 15.3,7.4 15,8.8 14,9.5 15.5,10 14.5,12.9 13.5,14.4 14,15.7 15.2,16.6 15.9,20.4 15.1,21.3 14.9,22.9 15.9,23.4 23.8,19.6;-71.7,19.7 -71.7,18;21.3,55.2 22.8,54.9 22.7,54.3 19.7,54.4;130.8,42.2 130.6,42.4 131.1,42.9 131,45 133.1,45.1 135,48.5 132.5,47.8 131,47.8 130.6,48.7 129.4,49.4 127.7,49.8 125.9,52.8 123.6,53.5 121,53.3 120.2,52.8 120.7,52 117.9,49.5 116.7,49.9 114.4,50.2 112.9,49.5 110.7,49.1 108.5,49.3 106.9,50.3 103.7,50.1 102.3,50.5 102.1,51.3 98.9,52 97.8,51 98.2,50.4 97.3,49.7 94.8,50 92.2,50.8 88.8,49.5 87.8,49.3 87.4,49.2;48.6,41.8 47.8,41.2 46.4,41.9 45.5,42.5 42.4,43.2 40,43.4;38.2,47.1 39.7,47.9 40.1,49.6 35.4,50.6 33.8,52.3 31.8,52.1 31.3,53.1 32.7,53.4 30.8,54.8 30.9,55.6 28.2,56.2 27.3,57.5 28,59.5;28.1,60.5 31.1,62.4 31.5,62.9 30,63.6 30.4,64.2 29.5,64.9 30.2,65.8 29.1,66.9 30,67.7 28.4,68.4 28.6,69.1 31.1,69.6;33.4,46 35,45.7;28.6,69.1 29,69.8 27.7,70.2 26.2,69.8 24.7,68.6 20.6,69.1 19.9,68.4 18,68.6 16.8,68 13.6,64.8 13.6,64 12.6,64.1 11.9,63.1 12,61.8 12.6,61.3 12.3,60.1 11,58.9;16.3,-28.6 16.8,-28.1 18.5,-29 19.9,-28.5 19.9,-24.8 20.9,-26.8 21.6,-26.7 23.3,-25.3 24.2,-25.7 25.7,-25.5 27.1,-23.6 29.4,-22.1 31.2,-22.3 31.9,-24.4 31.8,-25.8 31,-25.7 30.7,-26.7 31.3,-27.3 32.1,-26.7 32.8,-26.7;29,-29 28.5,-28.6 27,-29.9 27.8,-30.6 28.8,-30.1 29,-29;-88.3,18.5 -89.1,17.8 -91,17.8 -91.5,17.3 -90.5,16.1 -91.7,16.1 -92.2,14.5;-57.6,-30.2 -57,-30.1 -53.8,-32 -53.2,-32.7 -53.4,-33.8;-54.6,-25.7 -54.3,-24 -55.4,-24 -55.6,-22.7 -56.5,-22.1 -57.9,-22.1 -58.2,-20.2 -57.5,-18.2 -58.3,-17.3 -58.2,-16.3 -60.2,-16.3 -60.5,-13.8 -63.2,-12.6 -64.3,-12.5 -65.4,-11.6 -65.3,-9.8 -66.6,-9.9 -68.3,-11 -69.5,-11 -70.5,-11 -70.5,-9.5 -72.2,-10.1 -74,-7.5 -73.1,-6.6 -72.9,-5.3 -70.8,-4.3 -69.9,-4.3 -69.4,-1.6 -70,0.5 -69.8,1.7 -67.9,1.7 -66.9,1.3 -66.3,0.7 -64.2,1.5 -63.4,2.4 -64.3,2.5 -64.6,4.1 -63.1,3.8 -61,4.5 -60.7,5.2 -60,5 -59.5,4 -60,2.8 -59,1.3 -56.5,1.9 -56,2.5 -54.5,2.3 -53.4,2.1 -52.6,2.5 -51.7,4.2;-58.2,-20.2 -59.1,-19.4 -61.8,-19.6 -62.7,-22.2;-69.6,-17.6 -69,-16.5 -69.4,-15.7 -68.7,-12.6 -69.5,-11;-80.3,-3.4 -80.4,-4.4 -79.2,-5 -77.8,-3 -76.6,-2.6 -75.5,-1.6 -75.4,-0.2 -73.7,-1.3 -73.1,-2.3 -70.8,-2.3 -70,-2.7 -70.7,-3.7 -69.9,-4.3;-75.4,-0.2 -77.4,0.4 -78.9,1.4;-77.9,7.2 -77.4,8.7;-71.3,11.8 -72.9,10.5 -73.3,9.2 -72.8,9.1 -72,7 -70.1,7 -69.4,6.1 -67.3,6.1 -67.8,4.5 -67.3,3.3 -67.8,2.8 -66.9,1.3;-83,8.2 -82.5,9.6;-85.7,11.1 -83.7,10.9;-87.3,13 -84.9,14.8 -83.1,15;-87.8,13.4 -89.4,14.4 -88.2,15.7;-90.1,13.7 -89.4,14.4;-89.1,17.8 -88.9,15.9;-59.8,8.4 -60.6,7.8 -60.3,7 -61.4,6 -60.7,5.2;-57.1,6 -58,4.1 -56.5,1.9;-54,5.8 -54.5,4.9 -54,3.6 -54.5,2.3;2.5,51.1 4.3,49.9 5.7,49.5 6.2,49.5 8.1,49 7.5,47.6 6,46.7 6.8,46 6.7,45 7.4,43.7;3,42.5 1.8,42.3 -1.5,43 -1.9,43.4;29.4,-22.1 28,-21.5 27.7,-20.5 26.2,-19.3 25.3,-17.7 27,-17.9 29.5,-15.6 30.3,-15.5 32.8,-16.7 32.2,-21.1 31.2,-22.3;19.9,-24.8 19.9,-21.8 20.9,-21.8 20.9,-18.3 23.2,-17.9 23.6,-18.3 25.1,-17.7 25.3,-17.7;11.7,-17.3 12.8,-16.9 14.2,-17.4 18.3,-17.3 19,-17.8 21.4,-17.9 23.2,-17.5 25.1,-17.7;-16.5,16.1 -14.6,16.6 -13.4,16 -12.2,14.6 -11.5,12.4 -13.7,12.6 -16.7,12.4;-16.8,13.2 -14,13.8 -16.7,13.6;-12.2,14.6 -11.7,15.4 -5.5,15.5 -5.5,16.3 -6.5,25 -4.9,25 3.1,19.7 3.2,19.1 4.3,19.2 4.3,16.9 3.6,15.6 0.4,14.9 -0.5,15.1 -2,14.6 -3.5,13.3 -4,13.5 -5.2,11.7 -5.4,10.4 -8,10.2 -9.1,12.3 -10.2,11.8 -11.5,12.4;-8.7,27.4 -4.9,25;1.9,6.1 1.7,9.1 0.9,11 2.2,11.9 3.6,11.7 3.7,10.1 2.7,8.5 2.7,6.3;14.5,12.9 14.2,12.5 13.3,13.6 12.3,13 10.1,13.3 9,12.8 7.8,13.3 6.8,13.1 5.4,13.9 4.4,13.7 3.6,11.7;2.2,11.9 2.2,12.6 1,12.9 0.4,14.9;4.3,19.2 5.7,19.6 8.6,21.6 12,23.5 14.9,22.9;14.2,12.5 14.4,11.6 13.6,10.8 11.7,7 10.1,7 9.2,6.4 8.5,4.8;15.3,7.4 14.5,6.2 14.5,4.7 16,2.3 15.9,1.7 13.1,2.3 11.3,2.3 9.6,2.3;1.1,5.9 0.5,7.4 0.4,10.2 0,11 0.9,11;-2.9,5 -3.2,6.3 -2.6,8.2 -2.8,9.6 -2.9,11 0,11;-5.4,10.4 -4.3,9.6 -2.8,9.6;-7.7,4.4 -7.6,5.7 -8.6,6.5 -8.4,7.7 -7.8,8.6 -8,10.2;-8.4,7.7 -8.9,7.3 -10.2,8.4 -11.1,10 -12.4,9.8 -13.2,8.9;-15.1,11 -13.7,11.8 -13.7,12.6;-11.4,6.8 -10.2,8.4;18.5,3.5 17.1,3.7 16,2.3;24.6,8.2 27.4,5.2;13,-4.8 11.9,-5;11.1,-4 11.9,-3.4 11.5,-2.8 14,-2.5 14.4,-1.3 13.8,0 14.3,1.2 13.3,1.3 13.1,2.3;9.5,1 11.3,1.1 11.3,2.3;32.8,-9.2 33.5,-10.5 33.3,-12.4 32.7,-13.7 33.2,-14 30.2,-14.8 30.3,-15.5;23.2,-17.5 21.9,-16.1 21.9,-12.9 24,-12.9 23.9,-10.9;34.6,-11.5 34.6,-13.6 35.7,-14.6 35.8,-15.9 35,-16.8 34.4,-16.2 34.5,-14.6 33.2,-14;32.1,-26.7 31.8,-25.8;29,-2.8 30.5,-2.4;35.1,33.1 35.8,33.3 35.7,32.7 35.5,32.4 35.4,31.5 34.9,29.5 34.3,31.2;36,34.6 36.6,34.2 35.8,33.3;35.5,32.4 35.4,31.5;11.5,33.1 11.4,32.4 9.9,31.4 9.5,30.3 9.1,32.1 7.6,33.3 8.1,34.7 8.4,36.9;-8.7,27.7 -8.7,28.8 -5.2,30 -3.7,30.9 -3.6,31.6 -1.3,32.3 -2.2,35.2;9.5,30.3 9.9,29 9.7,26.5 9.3,26.1 10.3,24.4 10.8,24.6 12,23.5;35.7,32.7 36.8,32.3 38.8,33.4 39.2,32.2 37,31.5 38,30.5 36.1,29.2 35,29.4;56.1,26.1 56.3,25.7;56.4,24.9 55.9,24.9 55.2,22.7 55,22.5 52,23 51.6,24.2;51.4,24.6 50.8,24.8;48.4,28.6 46.6,29.1 47.3,30.1 48,30;38.8,33.4 41,34.4 41.3,36.4 42.3,37.2 44.8,37.2 46.2,35.1 45.4,34 46.1,33 47.3,32.5 47.7,31 48.6,29.9;46.6,29.1 44.7,29.2 41.9,31.2 39.2,32.2;53.1,16.7 52,19 55,20 55.7,22 55.2,22.7;102.6,12.2 102.3,13.4 103,14.2 105.2,14.3 106,13.9 106.5,14.6 107.4,14.2 107.5,12.3 105.8,11.6 106.2,11 104.3,10.5;102.1,6.2 101.2,5.7 100.1,6.5;98.6,9.9 99.6,11.9 99.1,13.8 98.2,15.1 98.9,16.2 97.4,18.4 98.3,19.7 100.1,20.4 101.3,19.5 101.1,17.5 102.1,18.1 104,18.2 104.8,16.4 105.6,15.6 105.2,14.3;100.1,20.4 101.2,21.4 101.8,21.2 102.2,22.5 103.2,20.8 104.4,20.8 104.8,19.9 103.9,19.3 105.1,18.7 107.6,15.2 107.4,14.2;92.4,20.7 92.7,22 93.2,22.3 93.3,24.1 94.1,23.9 95.1,26.6 96.4,27.3 97.1,27.1 97.3,28.3 98.7,27.5 98.7,25.9 97.7,25.1 97.6,23.9 98.7,24.1 99.5,22.9 99.2,22.1 101.2,21.4;102.2,22.5 104.5,22.8 105.3,23.4 106.7,22.8 106.6,22.2 108,21.6;128.4,38.6 126.2,37.7;124.3,39.9 126.9,41.8 130.6,42.4;116.7,49.9 115.5,48.1 115.7,47.7 118.1,48.1 119.8,47 119.7,46.7 117.4,46.7 116,45.7 113.5,44.8 111.9,45.1 111.8,43.7 109.2,42.5 106.1,42.1 105,41.6 101.8,42.5 96.3,42.7 95.3,44.2 93.5,45 90.9,45.3 91,46.9 90.3,47.7 88,48.6 87.8,49.3;92.7,22 92.1,23.6 91.2,23.5 92.4,25 89.9,25.3 89.8,26 88.6,26.4 88.9,25.2 88.1,24.5 89,22.1;68.2,23.7 68.8,24.4 71,24.4 70.2,26.5 69.5,26.9 70.6,28 71.8,27.9 74.4,31 75.3,32.3 74.5,32.8 73.7,34.3 74.2,34.7 76.9,34.7 77.8,35.5 78.9,34.3 79.2,32.5 78.5,32.6 78.7,31.5 81.1,30.2 80.1,28.8 83.3,27.4 85.3,26.7 88.1,26.4 88.1,27.9 88.8,27.3 89.7,26.7 92,26.8 91.7,27.8 92.5,27.9 94.6,29.3 96.1,29.5 96.2,28.4 97.3,28.3;88.8,27.3 90,28.3 91.7,27.8;81.1,30.2 81.5,30.4 84.2,28.8 85.8,28.2 88.1,27.9;61.5,25.1 61.9,26.2 63.3,26.8 62.7,28.3 60.9,29.8 62.5,29.3 65,29.5 66.3,29.9 66.9,31.3 68.9,31.6 69.9,34 70.9,34 71.6,35.2 71.8,36.5 75.2,37.1 76.2,35.9 77.8,35.5;67.8,37.1 70.1,37.6 70.8,38.5 71.8,36.7 73.3,37.5 75,37.4 75.2,37.1;60.9,29.8 61.8,30.7 60.9,31.5 60.5,33.7 61.2,35.6 62.2,35.3 64.5,36.3 65.7,37.7 66.5,37.4;71,40.2 69.6,40.1 69.5,39.5 71.8,39.3 73.7,39.4 73.9,38.5 74.9,38.4 75,37.4;80.3,42.4 78.2,41.2 76.9,41.1 76.5,40.4 75.5,40.6 73.7,39.4;61.2,35.6 61.1,36.5 57.3,38 55.5,38 53.9,37.2;44.8,37.2 44.2,38 44.1,39.4 44.8,39.7 46.1,38.7 46.5,38.8 47.7,39.5 48.9,38.3;36.1,35.8 37.1,36.6 39.5,36.7 42.3,37.2;46.1,38.7 44.8,39.7 43.7,40.3 43.6,41.1 45,41.2 46.5,39.5 46.5,38.8;20.6,69.1 23.5,67.9 23.9,66;31.8,52.1 30.6,51.3 26.3,51.8 23.5,51.6 23.5,53.9 25.5,54.3 26.5,55.6 28.2,56.2;29.6,45.3 28.2,45.5 28.9,46.4 30,46.4 29.1,47.8 27.5,48.5 26.6,48.2 24.9,47.7 22.7,47.9 22.1,48.4 22.6,49.1 24,50.7 23.5,51.6;22.6,49.1 21.6,49.5 19.8,49.2 18.9,49.5 17.6,50.4 16.7,50.2 15,51.1 14.1,53 14.1,53.8;22.7,54.3 23.5,53.9;22.7,47.9 21,46.3 20.2,46.1 18.8,45.9 16.6,46.5 16.2,46.9;17,48.1 16.2,46.9 13.8,46.5 12.2,47.1 10.4,46.9 9.6,47.5 13,47.6 13.6,48.9 15.3,49 17,48.6 17,48.1 17.9,47.8 20.8,48.6 22.1,48.4;28.2,45.5 28.1,46.8 26.6,48.2;28.6,43.7 27.2,44.2 25.6,43.7 22.9,43.8 22.7,44.2 21.6,44.8 20.2,46.1;21.1,56 22.2,56.3 24.9,56.4 26.5,55.6;24.3,57.8 25.2,58 27.3,57.5;15,51.1 12.2,50.3 13.6,48.9;9.6,47.5 7.5,47.6;6.2,49.5 6,50.1 6.2,50.8 6.9,53.5;8.5,55 9.9,55;28,42 26.1,41.8 26.1,41.3 24.5,41.6 23,41.3 22.4,42.3 23,43.2 22.7,44.2;26.1,41.8 26.1,40.8;20.2,39.6 21,40.8 23,41.3;41.6,41.5 43.6,41.1;19.4,41.9 20.1,42.6 20.6,41.9 21,40.8;18.8,45.9 19,44.9 17,45.2 15.7,44.8 17.7,43 18.6,42.6 18.4,42.5;13.7,45.5 15.3,45.5 16.6,46.5;10.4,46.9 7.8,45.8 6.8,46;5.7,49.5 6,50.1;3.3,51.3 5,51.5 6.2,50.8;-9,41.9 -6.7,41.9 -7.5,37.1;-7.6,55.1 -7.6,54.1 -6.2,53.9;13.8,46.5 13.9,45.6;45,41.2 46.6,41.2 46.4,41.9;114.2,4.5 115.3,4.3 115.5,5.4;17,48.6 18.9,49.5;43.1,12.7 42.4,12.5 40.9,14.1 37.9,15 37.6,14.2 36.4,14.4;42.8,16.3 43.4,17.6 47.5,17.1 49.1,18.6 52,19;34,35.1 32.7,35.1;25,22 25,29.2 24.7,30 25.2,31.6;35.3,5.5 33.6,7.7 34,8.7;42.4,12.5 41.8,11.1 42.8,10.9 42.6,10.6 43.7,9.2 46.9,8 47.8,8;43.1,11.5 42.8,10.9;30.4,-1.1 29.6,-1.3;30.8,3.5 33.4,3.8 34,4.3;19,44.9 19.2,43.5 18.6,42.6;20.6,41.9 21.6,42.2 22.4,42.3;21.6,42.2 20.8,43.3 20.3,42.8 19.2,43.5;20.3,42.8 20.1,42.6";
var LAND = decode(LAND_SRC);
var BORDERS = decode(BORDER_SRC);

// src/components/Map/Map.tsx
import { jsx as jsx45, jsxs as jsxs42 } from "react/jsx-runtime";
var DAY_MS = 864e5;
var millerY = (lat) => {
  const p = Math.max(-89.5, Math.min(89.5, lat)) * Math.PI / 180;
  return 1.25 * Math.log(Math.tan(Math.PI / 4 + 0.4 * p));
};
var Y_TOP = millerY(GEO_LAT_MAX);
var Y_BOT = millerY(GEO_LAT_MIN);
var VBW = 720;
var VBH = Math.round(VBW * (Y_TOP - Y_BOT) / (2 * Math.PI));
var px2 = (lng) => (lng + 180) / 360 * VBW;
var py = (lat) => (Y_TOP - millerY(lat)) / (Y_TOP - Y_BOT) * VBH;
function toPath(ring, off, close) {
  let d = "";
  for (let i = 0; i < ring.length; i++) d += `${i ? "L" : "M"}${px2(ring[i][0] + off).toFixed(1)},${py(ring[i][1]).toFixed(1)}`;
  return close ? `${d} Z` : d;
}
function offsetsFor(ring) {
  let mn = Infinity, mx = -Infinity;
  for (const [lng] of ring) {
    if (lng < mn) mn = lng;
    if (lng > mx) mx = lng;
  }
  const out = [0];
  if (mx > 180) out.push(-360);
  if (mn < -180) out.push(360);
  return out;
}
var LAND_PATHS = LAND.flatMap((r) => offsetsFor(r).map((o) => toPath(r, o, true)));
var BORDER_PATHS = BORDERS.flatMap((r) => offsetsFor(r).map((o) => toPath(r, o, false)));
function nightPath(at) {
  const start = Date.UTC(at.getUTCFullYear(), 0, 0);
  const doy = (Date.UTC(at.getUTCFullYear(), at.getUTCMonth(), at.getUTCDate()) - start) / DAY_MS;
  const dec = -23.44 * Math.cos(2 * Math.PI / 365 * (doy + 10));
  if (Math.abs(dec) < 0.6) return null;
  const utcH = at.getUTCHours() + at.getUTCMinutes() / 60;
  const subsolarLng = 15 * (12 - utcH);
  const tanDec = Math.tan(dec * Math.PI / 180);
  const pts = [];
  for (let lng = -180; lng <= 180; lng += 3) {
    const H = (lng - subsolarLng) * Math.PI / 180;
    let lat = Math.atan(-Math.cos(H) / tanDec) * 180 / Math.PI;
    if (!Number.isFinite(lat)) lat = 0;
    pts.push(`${px2(lng).toFixed(1)},${py(Math.max(GEO_LAT_MIN, Math.min(GEO_LAT_MAX, lat))).toFixed(1)}`);
  }
  const y = dec > 0 ? VBH : 0;
  return `M${pts.join("L")}L${VBW},${y}L0,${y}Z`;
}
var LABEL_ALL_FROM = 760;
var LABEL_SOME_FROM = 380;
var PICKS = new Set(pickColours);
function WorldMap({ pins, at, ariaLabel, onPin, hoverCard, pinProps }) {
  const [hover, setHover] = useState26(null);
  const night = useMemo3(() => nightPath(at), [at]);
  const wrap = useRef27(null);
  const [w, setW] = useState26(0);
  useEffect15(() => {
    const el = wrap.current;
    if (!el) return;
    setW(el.getBoundingClientRect().width);
    if (typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver((e) => setW(e[0].contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const labelEvery = w >= LABEL_ALL_FROM ? 1 : w >= LABEL_SOME_FROM ? 3 : 0;
  const seen = /* @__PURE__ */ new Map();
  const placed = pins.map((p) => {
    const bx = px2(p.lng), by = py(p.lat);
    const key = `${Math.round(bx / 6)},${Math.round(by / 6)}`;
    const n = seen.get(key) ?? 0;
    seen.set(key, n + 1);
    const ang = n * (Math.PI * 2 / 6) - Math.PI / 2;
    return { pin: p, cx: bx + (n ? Math.cos(ang) * 11 : 0), cy: by + (n ? Math.sin(ang) * 11 : 0), colour: p.colour && PICKS.has(p.colour) ? `var(--pick-${p.colour})` : "var(--status-neutral)" };
  });
  const hovered = placed.find((p) => p.pin.id === hover) ?? null;
  const meridians = Array.from({ length: 25 }, (_, i) => -180 + i * 15);
  const parallels = [60, 40, 20, 0, -20, -40];
  return /* @__PURE__ */ jsxs42("div", { ref: wrap, className: "ad-world-map", children: [
    /* @__PURE__ */ jsxs42("svg", { viewBox: `0 0 ${VBW} ${VBH}`, width: "100%", role: "group", "aria-label": ariaLabel, className: "ad-world-map__svg", children: [
      /* @__PURE__ */ jsx45("g", { children: LAND_PATHS.map((d, i) => /* @__PURE__ */ jsx45("path", { d, className: "ad-world-map__land" }, i)) }),
      /* @__PURE__ */ jsx45("g", { children: BORDER_PATHS.map((d, i) => /* @__PURE__ */ jsx45("path", { d, className: "ad-world-map__border" }, i)) }),
      night && /* @__PURE__ */ jsx45("path", { d: night, className: "ad-world-map__night", "data-night": "" }),
      /* @__PURE__ */ jsx45("g", { children: parallels.map((lat) => /* @__PURE__ */ jsx45("line", { x1: 0, y1: py(lat), x2: VBW, y2: py(lat), className: lat === 0 ? "ad-world-map__equator" : "ad-world-map__parallel" }, lat)) }),
      /* @__PURE__ */ jsx45("g", { children: meridians.map((lng, i) => {
        const hour = Math.round(lng / 15);
        const show = labelEvery > 0 && Math.abs(hour) < 12 && (hour === 0 || i % labelEvery === 0);
        return /* @__PURE__ */ jsxs42("g", { children: [
          /* @__PURE__ */ jsx45("line", { x1: px2(lng), y1: 0, x2: px2(lng), y2: VBH, className: hour === 0 ? "ad-world-map__utc" : "ad-world-map__meridian" }),
          show && /* @__PURE__ */ jsx45("text", { x: px2(lng), y: 11, textAnchor: "middle", className: "ad-world-map__tz", "data-tz": hour, children: hour === 0 ? "UTC" : `${hour > 0 ? "+" : "\u2212"}${Math.abs(hour)}` })
        ] }, lng);
      }) }),
      /* @__PURE__ */ jsx45("g", { children: placed.filter((p) => p.pin.route).map(({ pin, colour }) => /* @__PURE__ */ jsx45("line", { x1: px2(pin.route.from[0]), y1: py(pin.route.from[1]), x2: px2(pin.route.to[0]), y2: py(pin.route.to[1]), className: "ad-world-map__route", style: { stroke: colour } }, `route-${pin.id}`)) }),
      hovered && /* @__PURE__ */ jsx45("circle", { cx: hovered.cx, cy: hovered.cy, className: "ad-world-map__hover", style: { fill: hovered.colour } }),
      placed.map(({ pin, cx: x, cy: y, colour }) => {
        const on = hover === pin.id;
        const hooks = pinProps?.(pin) ?? {};
        return /* @__PURE__ */ jsxs42(
          "g",
          {
            ...hooks,
            role: onPin ? "button" : void 0,
            tabIndex: onPin ? 0 : void 0,
            "aria-label": pin.name,
            className: cx("ad-world-map__pin", onPin && "ad-world-map__pin--press", on && "ad-world-map__pin--on", pin.assumed && "ad-world-map__pin--assumed"),
            onMouseEnter: () => setHover(pin.id),
            onMouseLeave: () => setHover((h) => h === pin.id ? null : h),
            onFocus: () => setHover(pin.id),
            onBlur: () => setHover((h) => h === pin.id ? null : h),
            onClick: () => onPin?.(pin.id),
            onKeyDown: (e) => {
              if (onPin && (e.key === "Enter" || e.key === " ")) {
                e.preventDefault();
                onPin(pin.id);
              }
            },
            style: { ["--ad-pin"]: colour },
            children: [
              /* @__PURE__ */ jsx45("circle", { cx: x, cy: y, className: "ad-world-map__halo" }),
              /* @__PURE__ */ jsx45("circle", { cx: x, cy: y, className: "ad-world-map__dot" }),
              /* @__PURE__ */ jsx45("text", { x, y: y + 2.6, textAnchor: "middle", className: "ad-world-map__initials", "aria-hidden": "true", children: pin.initials })
            ]
          },
          pin.id
        );
      })
    ] }),
    hovered && hoverCard && /* @__PURE__ */ jsx45("div", { className: "ad-float ad-world-map__card", style: { left: `${Math.min(72, hovered.cx / VBW * 100)}%`, top: `${hovered.cy / VBH * 100}%` }, children: hoverCard(hovered.pin) })
  ] });
}
function MapNightDot() {
  return /* @__PURE__ */ jsx45(Dot, { className: "ad-world-map__night-dot" });
}

// src/components/Charts/Charts.tsx
import { Fragment as Fragment20, jsx as jsx46, jsxs as jsxs43 } from "react/jsx-runtime";
function AmountBars({ items, max, ariaLabel, className }) {
  const top = max ?? Math.max(1, ...items.map((i) => i.value));
  return /* @__PURE__ */ jsx46("div", { className: cx("ad-amounts", className), role: "list", "aria-label": ariaLabel, children: items.map((i) => /* @__PURE__ */ jsxs43("div", { className: "ad-amounts__row", role: "listitem", children: [
    /* @__PURE__ */ jsx46("span", { className: "ad-amounts__label", children: i.label }),
    /* @__PURE__ */ jsxs43("span", { className: "ad-amounts__track", children: [
      /* @__PURE__ */ jsx46("span", { className: "ad-amounts__bar", style: { width: `${Math.max(0, i.value / top) * 100}%` } }),
      /* @__PURE__ */ jsx46("span", { className: "ad-amounts__value", children: i.display })
    ] })
  ] }, i.id)) });
}
function BudgetBar({ fraction, figure, note = "worked", remainder, end, ariaLabel, planned, marks = [], className }) {
  return /* @__PURE__ */ jsxs43("div", { className: cx("ad-budget", className), children: [
    /* @__PURE__ */ jsx46("div", { className: "ad-budget__figure", children: figure }),
    /* @__PURE__ */ jsx46(ProgressBar, { meter: true, fraction, ariaLabel: ariaLabel ?? String(figure), planned, marks: marks.length ? marks : void 0 }),
    /* @__PURE__ */ jsxs43("div", { className: "ad-budget__foot", children: [
      /* @__PURE__ */ jsx46("span", { children: note }),
      /* @__PURE__ */ jsxs43("span", { children: [
        remainder,
        end && /* @__PURE__ */ jsxs43(Fragment20, { children: [
          " \xB7 ",
          end
        ] })
      ] })
    ] })
  ] });
}
function ProgressBar({ fraction, ariaLabel, thin, planned, marks = [], meter: asMeter }) {
  const meter = !!asMeter || planned != null || marks.length > 0;
  return /* @__PURE__ */ jsxs43("div", { className: cx("ad-progress", thin && "ad-progress--thin"), role: meter ? "meter" : "progressbar", "aria-label": ariaLabel, "aria-valuemin": 0, "aria-valuemax": meter ? Math.max(100, Math.round(fraction * 100)) : 100, "aria-valuenow": Math.round(fraction * 100), children: [
    planned != null && /* @__PURE__ */ jsx46("span", { className: "ad-progress__planned", style: { width: `${Math.max(0, Math.min(1, planned)) * 100}%` } }),
    /* @__PURE__ */ jsx46("span", { className: "ad-progress__done", style: { width: `${Math.max(0, Math.min(1, fraction)) * 100}%` } }),
    marks.map((m) => /* @__PURE__ */ jsx46("span", { className: "ad-progress__mark", role: "img", "aria-label": m.label, title: m.label, style: { left: `${Math.max(0, Math.min(1, m.at)) * 100}%` } }, m.label))
  ] });
}
function OverTime({ periods, currentId, grid = [], ariaLabel, className }) {
  const top = Math.max(1, ...periods.map((p) => p.value), ...grid.map((g) => g.value));
  return /* @__PURE__ */ jsxs43("figure", { className: cx("ad-overtime", className), "aria-label": ariaLabel, children: [
    /* @__PURE__ */ jsxs43("div", { className: "ad-overtime__plot", children: [
      grid.map((g) => /* @__PURE__ */ jsx46("div", { className: "ad-overtime__grid", style: { bottom: `${g.value / top * 100}%` }, children: /* @__PURE__ */ jsx46("span", { children: g.display }) }, g.value)),
      /* @__PURE__ */ jsx46("div", { className: "ad-overtime__columns", role: "list", children: periods.map((p) => {
        const cur = p.id === currentId;
        return /* @__PURE__ */ jsx46("div", { className: "ad-overtime__slot", role: "listitem", "aria-label": `${p.label}: ${p.display}`, children: /* @__PURE__ */ jsx46("div", { className: cx("ad-overtime__column", cur && "ad-overtime__column--current"), style: { height: `${p.value / top * 100}%` }, children: cur && /* @__PURE__ */ jsx46("span", { className: "ad-overtime__cap", children: p.display }) }) }, p.id);
      }) })
    ] }),
    /* @__PURE__ */ jsxs43("div", { className: "ad-overtime__labels", "aria-hidden": "true", children: [
      /* @__PURE__ */ jsx46("span", { children: periods[0]?.label }),
      periods.length > 1 && /* @__PURE__ */ jsx46("span", { children: periods[periods.length - 1].label })
    ] })
  ] });
}
function Dial({ fraction, label, className }) {
  const r = 26;
  const c = 2 * Math.PI * r;
  const f = Math.max(0, Math.min(1, Number.isFinite(fraction) ? fraction : 0));
  const display = `${Math.round(f * 100)}%`;
  return /* @__PURE__ */ jsxs43("figure", { className: cx("ad-dial", className), children: [
    /* @__PURE__ */ jsxs43("div", { className: "ad-dial__face", role: "meter", "aria-valuemin": 0, "aria-valuemax": 100, "aria-valuenow": Math.round(f * 100), "aria-label": String(label), children: [
      /* @__PURE__ */ jsxs43("svg", { viewBox: "0 0 70 70", "aria-hidden": "true", children: [
        /* @__PURE__ */ jsx46("circle", { className: "ad-dial__track", cx: "35", cy: "35", r }),
        /* @__PURE__ */ jsx46("circle", { className: "ad-dial__arc", cx: "35", cy: "35", r, strokeDasharray: `${c * f} ${c}`, transform: "rotate(-90 35 35)" })
      ] }),
      /* @__PURE__ */ jsx46("span", { className: "ad-dial__value", children: display })
    ] }),
    /* @__PURE__ */ jsx46("figcaption", { className: "ad-dial__label", children: label })
  ] });
}
function Verdict({ word, sentence }) {
  return /* @__PURE__ */ jsxs43("div", { className: word ? "ad-verdict" : "ad-verdict ad-verdict--headline", children: [
    word ? /* @__PURE__ */ jsx46("p", { className: "ad-verdict__word", children: String(word).split(/\s+/)[0] }) : null,
    /* @__PURE__ */ jsx46("p", { className: "ad-verdict__sentence", children: String(sentence) })
  ] });
}

// src/components/Search/Search.tsx
import { useRef as useRef28 } from "react";
import { jsx as jsx47 } from "react/jsx-runtime";
function CommandSearch({ open, onClose, query, onQuery, results, onPick, label = "Search everything", noMatch = "Nothing by that name" }) {
  const box = useRef28(null);
  const z = useLayer(open, onClose, [box], "dialog");
  usePageInert(open, [box]);
  useFocusReturn(open, box);
  if (!open) return null;
  return /* @__PURE__ */ jsx47(Portal, { children: /* @__PURE__ */ jsx47("div", { ref: box, role: "dialog", "aria-modal": "true", "aria-label": label, onKeyDown: (e) => trapTab(e, box.current), style: { zIndex: z }, className: "ad-float ad-search", children: /* @__PURE__ */ jsx47(
    PickList,
    {
      searchLabel: label,
      query,
      onQuery,
      noMatch,
      onPick: (id) => {
        onPick(id);
        onClose();
      },
      options: results.map((r) => ({ id: r.id, label: r.label, group: r.group, lead: slotIcon(r.icon), hint: r.code ? /* @__PURE__ */ jsx47(ProjectPill, { code: r.code }) : void 0 })),
      className: "ad-search__list"
    }
  ) }) });
}

// src/components/Guidance/Guidance.tsx
import { useEffect as useEffect16, useLayoutEffect as useLayoutEffect10, useRef as useRef29, useState as useState27 } from "react";
import { Fragment as Fragment21, jsx as jsx48, jsxs as jsxs44 } from "react/jsx-runtime";
var useIsoLayoutEffect3 = typeof window === "undefined" ? useEffect16 : useLayoutEffect10;
function TourStep({ open, anchor, step, total, title, children, onBack, onNext, onExit, backLabel = "Back", nextLabel = "Next", progressLabel = (s, t) => `${s} of ${t}`, placement, side: older, onClose, closeLabel }) {
  const card = useRef29(null);
  const [rect, setRect] = useState27(null);
  const [size, setSize] = useState27(null);
  const asked = placement ?? older ?? "below";
  const doc = useFloatingDocument() ?? document;
  useFocusReturn(open, card);
  useIsoLayoutEffect3(() => {
    if (!open) return;
    const place = () => {
      const r = anchor.current?.getBoundingClientRect();
      if (r) setRect(r);
    };
    place();
    const win2 = doc.defaultView ?? window;
    win2.addEventListener("resize", place);
    win2.addEventListener("scroll", place, true);
    const onKey = (e) => {
      if (e.key === "Escape") onExit?.();
    };
    doc.addEventListener("keydown", onKey);
    return () => {
      win2.removeEventListener("resize", place);
      win2.removeEventListener("scroll", place, true);
      doc.removeEventListener("keydown", onKey);
    };
  }, [open, anchor, onExit]);
  useIsoLayoutEffect3(() => {
    const el = card.current;
    if (!open || !el) return;
    const next = { w: el.offsetWidth, h: el.offsetHeight };
    setSize((o) => o && o.w === next.w && o.h === next.h ? o : next);
  });
  if (!open || !rect) return null;
  const gap = tokenPx("--notch-size", 12);
  const pad = tokenPx("--space-1", 4);
  const notchMax = tokenPx("--space-8", 32);
  const win = doc.defaultView ?? window;
  const vw = win.innerWidth;
  const vh = win.innerHeight;
  const edge = pad * 4;
  const w = size?.w ?? 0;
  const h = size?.h ?? 0;
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(v, Math.max(lo, hi)));
  let side = asked;
  if (size) {
    if (side === "below" && rect.bottom + pad + gap + h > vh - edge && rect.top - pad - gap - h >= edge) side = "above";
    else if (side === "above" && rect.top - pad - gap - h < edge && rect.bottom + pad + gap + h <= vh - edge) side = "below";
    else if (side === "right" && rect.right + pad + gap + w > vw - edge && rect.left - pad - gap - w >= edge) side = "left";
    else if (side === "left" && rect.left - pad - gap - w < edge && rect.right + pad + gap + w <= vw - edge) side = "right";
  }
  let cardStyle;
  if (side === "below" || side === "above") {
    const left = size ? clamp(rect.left, edge, vw - w - edge) : Math.max(edge, rect.left);
    const target = rect.left + Math.min(rect.width / 2, notchMax);
    const notch = size ? clamp(target - left - gap / 2, gap, w - gap * 2) : Math.min(rect.width / 2, notchMax) - gap / 2;
    cardStyle = { top: side === "below" ? rect.bottom + pad + gap : rect.top - pad - gap - h, left, ["--ad-notch-x"]: `${Math.round(notch)}px` };
  } else {
    const top = size ? clamp(rect.top, edge, vh - h - edge) : Math.max(edge, rect.top);
    const target = rect.top + Math.min(rect.height / 2, notchMax);
    const notch = size ? clamp(target - top - gap / 2, gap, h - gap * 2) : Math.min(rect.height / 2, notchMax) - gap / 2;
    cardStyle = { top, left: side === "right" ? rect.right + pad + gap : rect.left - pad - gap - w, ["--ad-notch-y"]: `${Math.round(notch)}px` };
  }
  if (!size) cardStyle.visibility = "hidden";
  return /* @__PURE__ */ jsxs44(Portal, { children: [
    /* @__PURE__ */ jsx48("div", { className: "ad-spotlight", "aria-hidden": "true", style: { top: rect.top - pad, left: rect.left - pad, width: rect.width + pad * 2, height: rect.height + pad * 2 } }),
    /* @__PURE__ */ jsxs44("div", { ref: card, role: "dialog", "aria-label": typeof title === "string" ? title : void 0, tabIndex: -1, className: cx("ad-tour-card", `ad-tour-card--${side}`, onClose && "ad-tour-card--closes"), style: cardStyle, children: [
      onClose && /* @__PURE__ */ jsx48(CloseButton, { onClose, label: closeLabel }),
      /* @__PURE__ */ jsx48("div", { className: "ad-tour-card__ticks", "aria-label": progressLabel(step, total), role: "img", children: Array.from({ length: total }, (_, i) => /* @__PURE__ */ jsx48("i", { "data-done": i < step || void 0 }, i)) }),
      /* @__PURE__ */ jsx48("h2", { className: "ad-tour-card__title", children: title }),
      /* @__PURE__ */ jsx48("div", { className: "ad-tour-card__text", children }),
      /* @__PURE__ */ jsx48("div", { className: "ad-tour-card__foot", children: /* @__PURE__ */ jsxs44(ButtonSizeScope, { size: "bar", children: [
        onBack && step > 1 && /* @__PURE__ */ jsx48(Button, { onClick: onBack, children: backLabel }),
        /* @__PURE__ */ jsx48(Button, { variant: "main", onClick: onNext, "data-autofocus": true, children: nextLabel })
      ] }) })
    ] })
  ] });
}
function PixxBrief({ open, face, greeting, children, onSnooze, onGotIt, snoozeLabel = "Snooze", gotItLabel = "Got it" }) {
  if (!open) return null;
  return /* @__PURE__ */ jsx48(Portal, { children: /* @__PURE__ */ jsxs44("section", { className: "ad-float ad-brief", "aria-label": typeof greeting === "string" ? greeting : "Pixx", role: "complementary", children: [
    /* @__PURE__ */ jsxs44("div", { className: "ad-brief__head", children: [
      /* @__PURE__ */ jsx48("img", { className: "ad-brief__face", src: face, alt: "" }),
      /* @__PURE__ */ jsx48("h2", { className: "ad-brief__greeting", children: greeting })
    ] }),
    /* @__PURE__ */ jsx48("div", { className: "ad-brief__text", children }),
    /* @__PURE__ */ jsxs44("div", { className: "ad-brief__foot", children: [
      /* @__PURE__ */ jsx48(Button, { onClick: onSnooze, children: snoozeLabel }),
      /* @__PURE__ */ jsx48(Button, { onClick: onGotIt, children: gotItLabel })
    ] })
  ] }) });
}
function PixxFigure({ onPress, open, unread = 0, tip = "Pixx", motion, body, tail, hooks, className }) {
  const { triggerProps, node } = useTooltip(tip, { describes: false });
  const data = hooks ? Object.fromEntries(Object.entries(hooks).filter(([k]) => k.startsWith("data-"))) : {};
  return /* @__PURE__ */ jsxs44(Fragment21, { children: [
    /* @__PURE__ */ jsxs44(
      "button",
      {
        type: "button",
        ...data,
        ...triggerProps,
        "aria-label": tip,
        "data-pixx": open ? "open" : "rest",
        className: cx("ad-pixx", open && "ad-pixx--open", unread > 0 && "ad-pixx--unread", motion && `ad-pixx--${motion}`, className),
        onClick: onPress,
        children: [
          /* @__PURE__ */ jsx48("img", { className: "ad-pixx__tail", src: tail, alt: "", draggable: false }),
          /* @__PURE__ */ jsx48("img", { className: "ad-pixx__body", src: body, alt: "", draggable: false }),
          unread > 0 && /* @__PURE__ */ jsx48(UnreadDot, { className: "ad-pixx__dot", label: `${unread} need you` })
        ]
      }
    ),
    node
  ] });
}

// src/components/Furniture/Furniture.tsx
import { Fragment as Fragment22, jsx as jsx49, jsxs as jsxs45 } from "react/jsx-runtime";
function Footer({ code: code2, number, venue, pageNumber, page, undo }) {
  return /* @__PURE__ */ jsxs45("footer", { className: "ad-footer", children: [
    /* @__PURE__ */ jsxs45("span", { className: "ad-footer__cell ad-footer__code", children: [
      code2 ?? "LOUDBOX",
      number && /* @__PURE__ */ jsx49("span", { className: "ad-footer__number", children: number })
    ] }),
    /* @__PURE__ */ jsx49("span", { className: "ad-footer__cell ad-footer__venue", children: venue }),
    /* @__PURE__ */ jsx49("span", { className: "ad-footer__cell ad-footer__run", "aria-hidden": "true" }),
    /* @__PURE__ */ jsx49("span", { className: "ad-footer__undo", role: "status", "aria-live": "polite", children: undo && /* @__PURE__ */ jsxs45(Fragment22, { children: [
      /* @__PURE__ */ jsx49("span", { className: "ad-footer__undo-words", children: undo.message }),
      undo.onUndo && /* @__PURE__ */ jsx49(ButtonSizeScope, { size: "row", children: /* @__PURE__ */ jsx49(Button, { onClick: undo.onUndo, children: undo.label ?? "Undo" }) })
    ] }) }),
    /* @__PURE__ */ jsxs45("span", { className: "ad-footer__cell ad-footer__page", children: [
      /* @__PURE__ */ jsx49("span", { className: "ad-footer__page-number", children: pageNumber }),
      page
    ] })
  ] });
}
function Contents({ entries, ariaLabel = "Contents" }) {
  return /* @__PURE__ */ jsx49("ol", { className: "ad-contents", "aria-label": ariaLabel, children: entries.map((e, i) => {
    const inner = /* @__PURE__ */ jsxs45(Fragment22, { children: [
      /* @__PURE__ */ jsx49("span", { className: "ad-contents__numeral", children: e.numeral ?? String(i + 1).padStart(2, "0") }),
      /* @__PURE__ */ jsxs45("span", { className: "ad-contents__body", children: [
        /* @__PURE__ */ jsx49("span", { className: "ad-contents__name", children: e.name }),
        e.summary && /* @__PURE__ */ jsx49("span", { className: "ad-contents__summary", children: e.summary })
      ] })
    ] });
    return /* @__PURE__ */ jsx49("li", { className: "ad-contents__entry", "data-needs-you": e.needsYou || void 0, children: e.onOpen ? /* @__PURE__ */ jsx49("button", { type: "button", className: "ad-contents__button", onClick: e.onOpen, children: inner }) : /* @__PURE__ */ jsx49("div", { className: "ad-contents__button", children: inner }) }, e.id);
  }) });
}
function Caption({ children, bracket = "none", className }) {
  return /* @__PURE__ */ jsxs45("span", { className: cx("ad-caption", className), children: [
    bracket !== "none" && "[ ",
    children,
    bracket === "closed" && " ]"
  ] });
}
function DualUnit({ primary, secondary }) {
  return /* @__PURE__ */ jsxs45("span", { className: "ad-dual", children: [
    primary,
    " ",
    /* @__PURE__ */ jsxs45("span", { className: "ad-caption", children: [
      "[ ",
      secondary,
      " ]"
    ] })
  ] });
}
function Frame({ rail, corner, header, toolbar, key, footer, children, className }) {
  const slots = header !== void 0 || toolbar !== void 0 || footer !== void 0;
  return /* @__PURE__ */ jsxs45("div", { className: cx("ad-frame", corner != null && "ad-frame--corner", className), children: [
    rail,
    /* @__PURE__ */ jsx49("div", { className: "ad-frame__page", children: slots ? /* @__PURE__ */ jsxs45(Fragment22, { children: [
      header,
      /* @__PURE__ */ jsx49(FrameToolbar, { children: toolbar }),
      key != null && /* @__PURE__ */ jsx49(FrameKey, { children: key }),
      /* @__PURE__ */ jsx49(FrameWork, { children }),
      footer
    ] }) : children }),
    corner != null && /* @__PURE__ */ jsx49("div", { className: "ad-frame__corner", children: corner })
  ] });
}
function FrameToolbar({ children }) {
  return /* @__PURE__ */ jsx49("div", { className: "ad-frame__toolbar", children });
}
function FrameKey({ children }) {
  return /* @__PURE__ */ jsx49("div", { className: "ad-frame__key", children });
}
function FrameWork({ children }) {
  return /* @__PURE__ */ jsx49("div", { className: "ad-frame__work", children });
}
function CloudGlow() {
  return /* @__PURE__ */ jsx49("div", { className: "ad-cloud-glow", "aria-hidden": "true", children: /* @__PURE__ */ jsx49("div", { className: "ad-cloud-glow__drift" }) });
}
function Ground({ children, className, style }) {
  return /* @__PURE__ */ jsx49("div", { className: cx("ad-ground", className), style, children });
}

// src/runtime/AdsProvider.tsx
import { useContext as useContext10, useEffect as useEffect17, useMemo as useMemo4 } from "react";
import { jsx as jsx50 } from "react/jsx-runtime";
var MODE = typeof process !== "undefined" && process.env && process.env.NODE_ENV || "development";
var pending = [];
var warned = /* @__PURE__ */ new Set();
function resetDesignViolations() {
  pending.length = 0;
  warned.clear();
}
function report(found, atCommit) {
  if (MODE === "test") {
    for (const v of found) if (!pending.some((p) => p.message === v.message)) pending.push(v);
    if (atCommit && pending.length) {
      const all = pending.splice(0, pending.length);
      throw new Error(`Athena design violations:
${describeViolations(all)}`);
    }
    return;
  }
  for (const v of found) {
    const key = `${v.kind}|${v.message}`;
    if (warned.has(key)) continue;
    warned.add(key);
    console.warn(`[athena] ${v.message}`);
  }
}
function AdsProvider({ strict = false, show, children }) {
  const on = strict && MODE !== "production";
  useEffect17(() => {
    if (!on) return;
    report(scanIn(document.body), true);
  });
  useEffect17(() => {
    if (!on) return;
    const look = () => report(scanIn(document.body), false);
    const watch = new MutationObserver(look);
    watch.observe(document.body, { childList: true, subtree: true, attributes: true });
    document.addEventListener("focusin", look, true);
    look();
    return () => {
      watch.disconnect();
      document.removeEventListener("focusin", look, true);
    };
  }, [on]);
  const outer = useContext10(HueSwitches);
  const o = { ...SHOW_DEFAULTS, ...show ?? {} };
  const project = o.projectColours === true;
  const item = o.itemColours === true;
  const department = o.departmentColours === true;
  const value = useMemo4(() => ({ project, item, department, inProject: outer.inProject }), [project, item, department, outer.inProject]);
  const key = JSON.stringify(o);
  const options = useMemo4(() => o, [key]);
  return /* @__PURE__ */ jsx50(HueSwitches.Provider, { value, children: /* @__PURE__ */ jsx50(Show.Provider, { value: options, children }) });
}
function AdsScope({ project, children }) {
  const outer = useContext10(HueSwitches);
  const value = useMemo4(() => ({ ...outer, inProject: true }), [outer]);
  return /* @__PURE__ */ jsx50(HueSwitches.Provider, { value, children: /* @__PURE__ */ jsx50("div", { "data-ads-project": project, style: { display: "contents" }, children }) });
}
export {
  AccessRow,
  ActiveFilters,
  ActivityThread,
  AddRow,
  AdsProvider,
  AdsScope,
  AlertBarHead,
  AlertList,
  AlertRow,
  AlertsFloat,
  AlertsLine,
  AmountBars,
  Avatar,
  AvatarStack,
  Bar,
  BarMarker,
  Bell,
  Board,
  BoardCardMeta,
  BoardLane,
  Booking,
  BudgetBar,
  Button,
  Caption,
  Card,
  CardGrid,
  CardName,
  ChartKey,
  Checkbox,
  Clash,
  CloseButton,
  CloudGlow,
  Columns,
  CommandSearch,
  ConfirmDialog,
  Contents,
  DataText,
  DateField,
  DatePicker,
  DayCell,
  DayHeading,
  DeliverableBar,
  Department,
  Dial,
  Dialog,
  Dials,
  Dot,
  DragBand,
  DropLine,
  DualUnit,
  EditorCard,
  EmptyState,
  Fact,
  Facts,
  FieldRow,
  Figures,
  FileButton,
  FilterTag,
  FloatingWindow,
  Footer,
  FormActions,
  FormSection,
  Frame,
  FrameKey,
  FrameToolbar,
  FrameWork,
  Ground,
  GroupBand,
  GroupHeading,
  HeaderActions,
  Health,
  Hint,
  Icon,
  IconButton,
  InlineEdit,
  ItemDates,
  Lane,
  LaneWash,
  Lanes,
  List,
  ListSection,
  LoadError,
  LoadingRows,
  MapNightDot,
  Menu,
  MenuFoot,
  MenuFrame,
  MenuItem,
  MenuList,
  Milestone,
  MonthCalendar,
  NoteBox,
  NotificationList,
  NowMarker,
  OffscreenStart,
  OverMark,
  OverTime,
  OverlayTextArea,
  PageHeader,
  PastHatch,
  PeriodCluster,
  Person,
  PersonPicker,
  PickField,
  PickList,
  Picture,
  PixxBrief,
  PixxFigure,
  Popover,
  PopoverCard,
  PopoverHeader,
  PopoverSection,
  Portal,
  PressCard,
  ProgressBar,
  ProjectPicker,
  ProjectPill,
  Rail,
  RegMark,
  Row,
  RowDate,
  RowFigure,
  RowPress,
  RuleBuilder,
  RuleValue,
  Ruler,
  Section,
  SectionFrame,
  Segmented,
  Select,
  SelectionBar,
  SelectionBarRoom,
  SettingParams,
  SettingRow,
  SettingsLayout,
  SettingsNav,
  SettingsNavItem,
  SettingsSection,
  ShowOptionsGear,
  SideMenu,
  SideStripe,
  Splitter,
  Status,
  StatusPicker,
  Switch,
  Table,
  Tabs,
  Tag,
  TextArea,
  TextField,
  TextScramble,
  TimeField,
  TimeGrid,
  TodayLine,
  TodoCheck,
  TodoRow,
  TokenInput,
  TokenPill,
  Toolbar,
  ToolbarSeparator,
  Tooltip,
  TourStep,
  UnreadDot,
  Verdict,
  ViewButton,
  ViewPopover,
  WeekendShade,
  WorldMap,
  YearCalendar,
  ZoomCluster,
  cx,
  describeViolations,
  dropLineProps,
  hueNames,
  pickColours,
  projectHue,
  resetDesignViolations,
  scanIn,
  showOrder,
  useFloatingDocument,
  useLayer,
  usePlacement,
  useSaveAsYouGo,
  useSectionFrame,
  useTooltip,
  useViewInAddress
};
//# sourceMappingURL=index.js.map