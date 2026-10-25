import {
  addDays,
  addMonthsClamped,
  dayHeading,
  dayOf,
  daysBetween,
  dueLabel,
  formatISO,
  initials,
  monoDate,
  monthDay,
  nextWeekday,
  parseTask,
  queryTokens,
  readDate,
  sameDay,
  weekStartOf
} from "../chunk-DM62TMMD.js";
import {
  describeViolations,
  scanIn
} from "../chunk-J5DWL4FT.js";

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
import { createContext as createContext2, forwardRef, useContext as useContext2 } from "react";

// src/components/Tooltip/Tooltip.tsx
import { cloneElement, isValidElement, useEffect as useEffect3, useId, useRef as useRef3, useState as useState3 } from "react";

// src/components/floating/floating.tsx
import { useEffect as useEffect2, useLayoutEffect, useRef as useRef2, useState as useState2 } from "react";
import { createPortal } from "react-dom";
var useIsoLayoutEffect = typeof window === "undefined" ? useEffect2 : useLayoutEffect;
function Portal({ children }) {
  const [ready, setReady] = useState2(() => typeof document !== "undefined");
  useEffect2(() => setReady(true), []);
  return ready ? createPortal(children, document.body) : null;
}
function tokenPx(name, fallback) {
  if (typeof window === "undefined") return fallback;
  const v = parseFloat(getComputedStyle(document.documentElement).getPropertyValue(name));
  return Number.isFinite(v) ? v : fallback;
}
function usePlacement(open, anchor, floating, placement) {
  const [pos, setPos] = useState2(null);
  const place = useRef2(() => {
  });
  place.current = () => {
    const f = floating.current;
    if (!f) return;
    const gap = tokenPx("--space-1", 4);
    const edge = tokenPx("--space-2", 8);
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const fw = f.offsetWidth;
    const fh = f.offsetHeight;
    const a = anchor?.current?.getBoundingClientRect();
    let top;
    let left;
    if (placement === "top-centre" || !a) {
      top = Math.round(vh * 0.12);
      left = (vw - fw) / 2;
    } else if (placement === "side") {
      left = vw - fw - edge;
      top = Math.min(a.top, vh - fh - edge);
    } else {
      left = a.left;
      top = a.bottom + gap;
      if (left + fw > vw - edge) left = a.right - fw;
      if (top + fh > vh - edge && a.top - gap - fh >= edge) top = a.top - gap - fh;
    }
    const next = { top: Math.max(edge, top), left: Math.max(edge, left) };
    setPos((p) => p && p.top === next.top && p.left === next.left ? p : next);
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
    window.addEventListener("resize", run);
    window.addEventListener("scroll", run, true);
    return () => {
      ro?.disconnect();
      window.removeEventListener("resize", run);
      window.removeEventListener("scroll", run, true);
    };
  }, [open]);
  return pos ? { position: "fixed", top: pos.top, left: pos.left } : { position: "fixed", top: 0, left: 0, visibility: "hidden" };
}
var layers = [];
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
  const base = level === "dialog" ? tokenPx("--z-dialog", 500) : tokenPx("--z-popover", 300);
  const [z, setZ] = useState2(base);
  useIsoLayoutEffect(() => {
    if (!open) return;
    const layer = { boxes: () => refs.map((r) => r?.current), close: () => latest.current?.(), base, z: -1, setZ };
    if (!layers.length) {
      document.addEventListener("pointerdown", onPointerDown, true);
      document.addEventListener("keydown", onKeyDown);
    }
    const own = layer.boxes()[0];
    const child = own ? layers.findIndex((l) => l.boxes().slice(1).some((a) => a && own.contains(a))) : -1;
    if (child >= 0) layers.splice(child, 0, layer);
    else layers.push(layer);
    restack();
    return () => {
      const i = layers.indexOf(layer);
      if (i >= 0) layers.splice(i, 1);
      layer.z = -1;
      if (!layers.length) {
        document.removeEventListener("pointerdown", onPointerDown, true);
        document.removeEventListener("keydown", onKeyDown);
      }
    };
  }, [open]);
  return z;
}
var FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';
function useFocusReturn(open, box, start = "first") {
  useEffect2(() => {
    if (!open) return;
    const before = document.activeElement;
    const id = requestAnimationFrame(() => {
      const el = box.current;
      if (!el) return;
      const target = el.querySelector("[data-autofocus]") ?? (start === "first" ? el.querySelector(FOCUSABLE) : null) ?? el;
      target.focus({ preventScroll: true });
    });
    return () => {
      cancelAnimationFrame(id);
      const now = document.activeElement;
      const inside = !now || now === document.body || !!box.current?.contains(now);
      if (inside && before && document.contains(before)) before.focus({ preventScroll: true });
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
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
function useTooltip(text, { describes = true } = {}) {
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
      setPlaced(null);
      setAt({ top: r.bottom + tokenPx("--space-2", 8), left: r.left + r.width / 2 });
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
    const edge = tokenPx("--space-2", 8);
    setPlaced(Math.min(Math.max(at.left, edge + w / 2), window.innerWidth - edge - w / 2));
  }, [at]);
  useEffect3(() => {
    if (!at) return;
    const onKey = (e) => {
      if (e.key === "Escape") hide();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
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
  const node = at && text ? /* @__PURE__ */ jsx(Portal, { children: /* @__PURE__ */ jsx("div", { ref: tip, id, role: "tooltip", className: "ad-tooltip", style: { top: at.top, left: placed ?? at.left, visibility: placed == null ? "hidden" : void 0 }, children: text }) }) : null;
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

// src/components/Button/Button.tsx
import { Fragment as Fragment2, jsx as jsx2, jsxs as jsxs2 } from "react/jsx-runtime";
var Place = createContext2("md");
function ButtonSizeScope({ size, children }) {
  return /* @__PURE__ */ jsx2(Place.Provider, { value: size, children });
}
var Button = forwardRef(function Button2({ variant = "quiet", icon, danger, active, block, className, type = "button", children, ...rest }, ref) {
  const size = useContext2(Place);
  delete rest.size;
  return /* @__PURE__ */ jsxs2(
    "button",
    {
      ref,
      type,
      ...rest,
      className: cx("ad-button", `ad-button--${variant}`, `ad-button--${size}`, danger && variant !== "main" && "ad-button--danger", active && "ad-button--active", block && "ad-button--block", className),
      children: [
        icon,
        children
      ]
    }
  );
});
var IconButton = forwardRef(function IconButton2({ label, active, danger, className, type = "button", children, onPointerEnter, onPointerLeave, onFocus, onBlur, ...rest }, ref) {
  const size = useContext2(Place);
  delete rest.size;
  const { triggerProps: tip, node } = useTooltip(label, { describes: false });
  return /* @__PURE__ */ jsxs2(Fragment2, { children: [
    /* @__PURE__ */ jsx2(
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
import { forwardRef as forwardRef2, useEffect as useEffect4, useId as useId3, useRef as useRef4, useState as useState4 } from "react";

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
  "everything": "circle",
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
  "template": "copy-simple",
  "time-off": "sun-horizon",
  "timeline": "align-left",
  "today": "dot",
  "todos": "todo-dots",
  "trash": "trash",
  "unlock": "lock-open",
  "user": "user",
  "x": "x"
};

// src/components/Icon/Icon.tsx
import { jsx as jsx3 } from "react/jsx-runtime";
function Icon({ name, job, size = "md", fill, label, className }) {
  const glyph = job ? JOBS[job] : name;
  const paths = fill && FILL[glyph] || REGULAR[glyph];
  if (!paths) throw new Error(`Icon: "${String(job ?? name)}" is not a glyph or a job in the icon map (assets/icons/README.md). One set: nothing outside it is drawn.`);
  return /* @__PURE__ */ jsx3("svg", { viewBox: "0 0 256 256", className: cx("ad-icon", `ad-icon--${size}`, className), role: label ? "img" : void 0, "aria-label": label, "aria-hidden": label ? void 0 : true, focusable: "false", children: paths.map((d, i) => /* @__PURE__ */ jsx3("path", { fill: "currentColor", d }, i)) });
}

// src/components/GroupHeading/GroupHeading.tsx
import { useId as useId2 } from "react";
import { Fragment as Fragment3, jsx as jsx4, jsxs as jsxs3 } from "react/jsx-runtime";
function GroupHeading({ children, number, rule = "above", needsYou, lead, end, collapsible, collapsed = false, onToggle, controls, level = 3, className }) {
  const id = useId2();
  const Tag2 = `h${level}`;
  const num = number == null ? null : typeof number === "number" ? String(number).padStart(2, "0") : number;
  const inner = /* @__PURE__ */ jsxs3(Fragment3, { children: [
    collapsible && /* @__PURE__ */ jsx4(Icon, { name: "caret-down", className: "ad-group-heading__chevron" }),
    num != null && /* @__PURE__ */ jsx4("span", { className: "ad-group-heading__numeral", children: num }),
    lead && /* @__PURE__ */ jsx4("span", { className: "ad-group-heading__lead", children: lead }),
    /* @__PURE__ */ jsx4("span", { className: "ad-group-heading__name", id, children })
  ] });
  return /* @__PURE__ */ jsxs3("div", { className: cx("ad-group-heading", `ad-group-heading--rule-${rule}`, className), "data-needs-you": needsYou || void 0, "data-collapsed": collapsible ? String(collapsed) : void 0, children: [
    /* @__PURE__ */ jsx4(Tag2, { className: "ad-group-heading__title", children: collapsible ? /* @__PURE__ */ jsx4("button", { type: "button", className: "ad-group-heading__button", "aria-expanded": !collapsed, "aria-controls": controls, onClick: onToggle, children: inner }) : inner }),
    end && /* @__PURE__ */ jsx4("span", { className: "ad-group-heading__end", children: end })
  ] });
}

// src/components/Field/Field.tsx
import { Fragment as Fragment4, jsx as jsx5, jsxs as jsxs4 } from "react/jsx-runtime";
var TextField = forwardRef2(function TextField2({ icon, end, parsed, error, mono, className, style, ...rest }, ref) {
  const parsedId = useId3();
  const errorId = useId3();
  const describedBy = [parsed != null ? parsedId : null, error != null ? errorId : null, rest["aria-describedby"]].filter(Boolean).join(" ") || void 0;
  return /* @__PURE__ */ jsxs4("span", { className: cx("ad-field-wrap", className), style, children: [
    /* @__PURE__ */ jsxs4("span", { className: cx("ad-field", rest.disabled && "ad-field--disabled"), children: [
      icon && /* @__PURE__ */ jsx5("span", { className: "ad-field__icon", "aria-hidden": "true", children: icon }),
      /* @__PURE__ */ jsx5("input", { ref, ...rest, "aria-invalid": error != null || void 0, "aria-describedby": describedBy, className: cx("ad-field__input", mono && "ad-field__input--mono") }),
      end && /* @__PURE__ */ jsx5("span", { className: "ad-field__end", children: end })
    ] }),
    parsed != null && /* @__PURE__ */ jsxs4("span", { id: parsedId, className: "ad-field__parsed", "aria-live": "polite", children: [
      "[ ",
      parsed,
      " ]"
    ] }),
    error != null && /* @__PURE__ */ jsx5("span", { id: errorId, className: "ad-field__error", role: "alert", children: error })
  ] });
});
var TextArea = forwardRef2(function TextArea2({ className, ...rest }, ref) {
  return /* @__PURE__ */ jsx5("textarea", { ref, ...rest, className: cx("ad-field", "ad-textarea", className) });
});
var InlineEdit = forwardRef2(function InlineEdit2({ value, onCommit, ariaLabel, placeholder, size = "body", disabled, className }, ref) {
  const [draft, setDraft] = useState4(value);
  const editing = useRef4(false);
  const cancelled = useRef4(false);
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
  return /* @__PURE__ */ jsx5(
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
      onChange: (e) => setDraft(e.target.value),
      onBlur: commit,
      onKeyDown: (e) => {
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
  return /* @__PURE__ */ jsxs4("span", { className: cx("ad-field", "ad-select", rest.disabled && "ad-field--disabled", className), children: [
    /* @__PURE__ */ jsxs4("select", { ref, ...rest, value, defaultValue: value === void 0 ? defaultValue ?? (placeholder ? "" : void 0) : void 0, className: cx("ad-select__native", quiet && "ad-select__native--quiet"), children: [
      placeholder != null && /* @__PURE__ */ jsx5("option", { value: "", disabled: true, children: placeholder }),
      options.map((o) => /* @__PURE__ */ jsx5("option", { value: o.value, disabled: o.disabled, children: o.label }, o.value))
    ] }),
    /* @__PURE__ */ jsx5(Icon, { name: "caret-down", className: "ad-select__caret" })
  ] });
});
function Help({ text }) {
  const { triggerProps, node } = useTooltip(text, { describes: false });
  return /* @__PURE__ */ jsxs4(Fragment4, { children: [
    /* @__PURE__ */ jsx5("button", { type: "button", className: "ad-field-row__help", "aria-label": text, ...triggerProps, onPointerLeave: triggerProps.onPointerLeave, onBlur: triggerProps.onBlur, children: /* @__PURE__ */ jsx5(Icon, { name: "question", size: "sm" }) }),
    node
  ] });
}
function FieldRow({ label, children, help, beside, htmlFor, className }) {
  return /* @__PURE__ */ jsxs4("div", { className: cx("ad-field-row", beside && "ad-field-row--beside", className), children: [
    /* @__PURE__ */ jsxs4("span", { className: "ad-field-row__label", children: [
      /* @__PURE__ */ jsx5("label", { htmlFor, children: label }),
      help && /* @__PURE__ */ jsx5(Help, { text: help })
    ] }),
    /* @__PURE__ */ jsx5("div", { className: "ad-field-row__control", children })
  ] });
}
function FormSection({ number, title, children, error, className }) {
  const errorId = useId3();
  const num = String(number).padStart(2, "0");
  return /* @__PURE__ */ jsxs4("section", { role: "group", "aria-label": `${num} ${title}`, "aria-describedby": error != null ? errorId : void 0, className: cx("ad-form-section", className), children: [
    /* @__PURE__ */ jsx5(GroupHeading, { number, children: title }),
    /* @__PURE__ */ jsx5("div", { className: "ad-form-section__body", children }),
    error != null && /* @__PURE__ */ jsx5("p", { id: errorId, className: "ad-field__error ad-form-section__error", children: error })
  ] });
}
function FormActions({ main, onCancel, cancelLabel = "Cancel" }) {
  return /* @__PURE__ */ jsxs4("div", { className: "ad-form-actions", children: [
    /* @__PURE__ */ jsx5(Button, { onClick: onCancel, children: cancelLabel }),
    /* @__PURE__ */ jsx5(Button, { variant: "main", type: main.onSelect ? "button" : "submit", onClick: main.onSelect, children: String(main.label) })
  ] });
}

// src/components/Checkbox/Checkbox.tsx
import { forwardRef as forwardRef3 } from "react";
import { jsx as jsx6, jsxs as jsxs5 } from "react/jsx-runtime";
var Checkbox = forwardRef3(function Checkbox2({ checked, onChange, label, className, style, disabled, ...rest }, ref) {
  const state = checked ? "on" : "off";
  return /* @__PURE__ */ jsxs5("label", { className: cx("ad-checkbox", disabled && "ad-checkbox--disabled", className), style, children: [
    /* @__PURE__ */ jsx6(
      "input",
      {
        ...rest,
        ref,
        type: "checkbox",
        checked,
        disabled,
        onChange: (e) => onChange?.(e.target.checked),
        className: "ad-checkbox__input"
      }
    ),
    /* @__PURE__ */ jsx6("span", { className: "ad-checkbox__box", "data-state": state, "aria-hidden": "true", children: state === "on" && /* @__PURE__ */ jsx6(Icon, { name: "check" }) }),
    label != null && /* @__PURE__ */ jsx6("span", { className: "ad-checkbox__label", children: label })
  ] });
});

// src/components/Switch/Switch.tsx
import { forwardRef as forwardRef4 } from "react";
import { jsx as jsx7, jsxs as jsxs6 } from "react/jsx-runtime";
var Switch = forwardRef4(function Switch2({ checked, onChange, label, className, disabled, onClick, ...rest }, ref) {
  const button = /* @__PURE__ */ jsx7(
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
  return /* @__PURE__ */ jsxs6("label", { className: cx("ad-switch-label", disabled && "ad-switch-label--disabled", className), children: [
    button,
    /* @__PURE__ */ jsx7("span", { children: label })
  ] });
});

// src/components/Segmented/Segmented.tsx
import { useRef as useRef5 } from "react";
import { jsx as jsx8 } from "react/jsx-runtime";
function Segmented({ options, value, onChange, ariaLabel, disabled, className }) {
  const group = useRef5(null);
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
  return /* @__PURE__ */ jsx8("div", { ref: group, role: "radiogroup", "aria-label": ariaLabel, "aria-disabled": disabled || void 0, onKeyDown: onKeyDown2, className: cx("ad-segmented", disabled && "ad-segmented--disabled", className), children: options.map((o) => {
    const on = o.value === value;
    return /* @__PURE__ */ jsx8(
      "button",
      {
        type: "button",
        role: "radio",
        "aria-checked": on,
        "aria-label": o.ariaLabel,
        "data-value": o.value,
        tabIndex: on ? 0 : -1,
        disabled: disabled || o.disabled,
        onClick: () => onChange(o.value),
        className: "ad-segmented__option",
        children: o.label
      },
      o.value
    );
  }) });
}

// src/components/TextScramble/TextScramble.tsx
import { useCallback as useCallback2, useEffect as useEffect5, useLayoutEffect as useLayoutEffect2, useRef as useRef6, useState as useState5 } from "react";
import { jsx as jsx9, jsxs as jsxs7 } from "react/jsx-runtime";
var useIsoLayoutEffect2 = typeof window === "undefined" ? useEffect5 : useLayoutEffect2;
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
  const elRef = useRef6(null);
  const innerRef = useRef6(null);
  const frameRef = useRef6();
  const timeoutRef = useRef6();
  const startedRef = useRef6(false);
  const [inView, setInView] = useState5(false);
  const [display, setDisplay] = useState5(text);
  const [minWidth, setMinWidth] = useState5();
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
  useEffect5(() => {
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
  useEffect5(() => {
    setDisplay((d) => startedRef.current ? scrambled(text, chars) : d);
    startedRef.current = false;
    return stop;
  }, [text]);
  useEffect5(() => {
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
    };
  }, [inView, run, delay, text]);
  return /* @__PURE__ */ jsxs7(Tag2, { ref: elRef, className, style, children: [
    /* @__PURE__ */ jsx9("span", { className: "ad-sr", children: text }),
    /* @__PURE__ */ jsx9("span", { ref: innerRef, "aria-hidden": "true", style: minWidth != null ? { display: "inline-block", minWidth } : void 0, children: display })
  ] });
}

// src/components/Status/Status.tsx
import { jsx as jsx10, jsxs as jsxs8 } from "react/jsx-runtime";
function Dot({ tone = "neutral", className, ...rest }) {
  return /* @__PURE__ */ jsx10("span", { "aria-hidden": "true", ...rest, className: cx("ad-dot", `ad-dot--${tone}`, className) });
}
function Status({ label, tone = "neutral", className, ...rest }) {
  return /* @__PURE__ */ jsxs8("span", { ...rest, className: cx("ad-status", className), children: [
    /* @__PURE__ */ jsx10(Dot, { tone }),
    /* @__PURE__ */ jsx10("span", { className: "ad-status__word", children: label })
  ] });
}
function Health({ state, reason, labels: l = {} }) {
  if (state !== "at-risk" && state !== "off-track") return null;
  const word = state === "at-risk" ? l.atRisk ?? "At risk" : l.offTrack ?? "Off track";
  const said = reason ? `${word}: ${String(reason)}` : word;
  return /* @__PURE__ */ jsx10("span", { role: "img", "aria-label": said, title: said, className: "ad-health", children: /* @__PURE__ */ jsx10(Dot, { tone: state === "at-risk" ? "waiting" : "problem" }) });
}

// src/components/Department/Department.tsx
import { jsx as jsx11, jsxs as jsxs9 } from "react/jsx-runtime";
var KNOWN2 = /* @__PURE__ */ new Set(["lighting", "video", "eng", "sfx", "content", "scenic", "direction", "admin", "pm", "lasers"]);
var FOLDED = { pyro: "sfx" };
function Department({ dept: given, name, glyphOnly }) {
  const dept = FOLDED[given] ?? given;
  const known = KNOWN2.has(dept);
  const colour = useHue(`dept-${known ? dept : "lighting"}`);
  const tint = known ? colour : null;
  return /* @__PURE__ */ jsxs9("span", { className: cx("ad-dept", tint && "ad-dept--coloured"), style: tint ? { ["--ad-dept"]: tint } : void 0, children: [
    /* @__PURE__ */ jsx11(Icon, { job: known ? `dept-${dept}` : "tag", size: "sm" }),
    glyphOnly ? /* @__PURE__ */ jsx11("span", { className: "ad-sr", children: String(name) }) : /* @__PURE__ */ jsx11("span", { className: "ad-dept__name", children: String(name) })
  ] });
}

// src/components/Tag/Tag.tsx
import { jsx as jsx12, jsxs as jsxs10 } from "react/jsx-runtime";
function Tag({ children, current, className, ...rest }) {
  return /* @__PURE__ */ jsx12("span", { ...rest, className: cx("ad-tag", current && "ad-tag--current", className), children });
}
function FilterTag({ axis, value, icon, onRemove, removeLabel = "Remove filter", size = "bar", className }) {
  return /* @__PURE__ */ jsxs10("span", { className: cx("ad-filter-tag", size === "row" && "ad-filter-tag--row", className), children: [
    icon != null && /* @__PURE__ */ jsx12("span", { className: "ad-filter-tag__icon", "aria-hidden": "true", children: icon }),
    axis != null && /* @__PURE__ */ jsx12("span", { className: "ad-filter-tag__axis", children: axis }),
    /* @__PURE__ */ jsx12("span", { className: "ad-filter-tag__value", children: value }),
    /* @__PURE__ */ jsx12("button", { type: "button", className: "ad-filter-tag__remove", "aria-label": removeLabel, title: removeLabel, onClick: onRemove, children: /* @__PURE__ */ jsx12(Icon, { name: "x" }) })
  ] });
}
function ActiveFilters({ filters, onRemove, onClear, clearLabel = "Clear", label = "Active filters" }) {
  if (!filters.length) return null;
  return /* @__PURE__ */ jsxs10("div", { className: "ad-active-filters", role: "group", "aria-label": label, children: [
    filters.map((f) => /* @__PURE__ */ jsx12(FilterTag, { icon: f.icon, axis: f.axis, value: f.value, onRemove: () => onRemove(f.id), removeLabel: `Remove filter ${f.axis}: ${f.value}` }, f.id)),
    onClear && /* @__PURE__ */ jsx12(ButtonSizeScope, { size: "bar", children: /* @__PURE__ */ jsx12(Button, { onClick: onClear, children: clearLabel }) })
  ] });
}
function TokenPill({ children }) {
  return /* @__PURE__ */ jsx12("span", { className: "ad-token", children: String(children) });
}
function UnreadDot({ label = "unread", className }) {
  return /* @__PURE__ */ jsx12("span", { role: "img", "aria-label": label, className: cx("ad-unread", className) });
}

// src/components/Avatar/Avatar.tsx
import { useState as useState6 } from "react";
import { jsx as jsx13, jsxs as jsxs11 } from "react/jsx-runtime";
function Avatar({ name, initials: initials2, src, size = "sm", decorative, className, style }) {
  const [failed, setFailed] = useState6();
  const broken = !!src && failed === src;
  return /* @__PURE__ */ jsx13("span", { role: decorative ? void 0 : "img", "aria-label": decorative ? void 0 : name, "aria-hidden": decorative || void 0, title: name, className: cx("ad-avatar", `ad-avatar--${size}`, className), style, children: src && !broken ? /* @__PURE__ */ jsx13("img", { src, alt: "", onError: () => setFailed(src) }) : /* @__PURE__ */ jsx13("span", { "aria-hidden": "true", children: initials2 ?? initials(name) }) });
}
function AvatarStack({ people, max = 3, size = "sm", plane = "base", className }) {
  if (!people.length) return null;
  const shown = people.slice(0, max);
  const rest = people.length - shown.length;
  return /* @__PURE__ */ jsxs11("span", { className: cx("ad-avatar-stack", `ad-plane--${plane}`, className), role: "group", "aria-label": people.map((p) => p.name).join(", "), children: [
    shown.map((p, i) => /* @__PURE__ */ jsx13(Avatar, { ...p, initials: (p.initials ?? initials(p.name)).slice(0, 1), size, decorative: true, style: { zIndex: shown.length - i } }, p.id ?? `${p.name}-${i}`)),
    rest > 0 && /* @__PURE__ */ jsxs11("span", { className: "ad-avatar-stack__more", "aria-hidden": "true", children: [
      "+",
      rest
    ] })
  ] });
}
function Person({ name, initials: initials2, src, className }) {
  return /* @__PURE__ */ jsxs11("span", { className: cx("ad-person", className), children: [
    /* @__PURE__ */ jsx13(Avatar, { name, initials: initials2, src, decorative: true }),
    /* @__PURE__ */ jsx13("span", { className: "ad-person__name", children: name })
  ] });
}

// src/components/List/List.tsx
import { createContext as createContext3, useContext as useContext3, useEffect as useEffect6, useId as useId4, useState as useState8 } from "react";

// src/components/Row/Row.tsx
import { forwardRef as forwardRef5 } from "react";

// src/components/Navigation/Navigation.tsx
import { useState as useState7 } from "react";
import { jsx as jsx14, jsxs as jsxs12 } from "react/jsx-runtime";
var X = () => /* @__PURE__ */ jsx14("span", { className: "ad-rail__x", "aria-hidden": "true" });
function ProjectPill({ code, current, color }) {
  const hue = useHue(color);
  const shown = hue && !current ? hue : void 0;
  return /* @__PURE__ */ jsx14("span", { className: cx("ad-project-pill", current && "ad-project-pill--current"), style: shown ? { ["--ad-pill"]: shown } : void 0, "data-coloured": shown ? true : void 0, children: code });
}
function Rail({ screens, projects, current, onSelect, onHome, onSettings, onToggle, labels: l = {} }) {
  const L = { home: "Home", settings: "Settings", expand: "Open the menu", menu: "Main", ...l };
  return /* @__PURE__ */ jsxs12("nav", { className: "ad-rail", "aria-label": L.menu, children: [
    /* @__PURE__ */ jsx14("button", { type: "button", className: "ad-rail__item ad-rail__home", "aria-label": L.home, title: L.home, onClick: onHome, children: /* @__PURE__ */ jsx14(X, {}) }),
    /* @__PURE__ */ jsx14("div", { className: "ad-rail__group", children: screens.map((s) => /* @__PURE__ */ jsx14("button", { type: "button", className: "ad-rail__item", "aria-label": s.label, title: s.label, "aria-current": current === s.id ? "page" : void 0, onClick: () => onSelect(s.id), children: s.icon }, s.id)) }),
    /* @__PURE__ */ jsx14("div", { className: "ad-rail__group", children: projects.map((p) => /* @__PURE__ */ jsx14("button", { type: "button", className: "ad-rail__project", "aria-label": `${p.code} ${p.name}`, title: p.name, "aria-current": current === p.id ? "page" : void 0, onClick: () => onSelect(p.id), children: /* @__PURE__ */ jsx14(ProjectPill, { code: p.code, current: current === p.id, color: p.color }) }, p.id)) }),
    /* @__PURE__ */ jsxs12("div", { className: "ad-rail__foot", children: [
      /* @__PURE__ */ jsx14("span", { className: "ad-rail__vertical", "aria-hidden": "true", children: L.settings.toLowerCase() }),
      /* @__PURE__ */ jsx14("button", { type: "button", className: "ad-rail__item", "aria-label": L.settings, title: L.settings, "aria-current": current === "settings" ? "page" : void 0, onClick: onSettings, children: /* @__PURE__ */ jsx14(Icon, { name: "gear", size: "lg" }) }),
      /* @__PURE__ */ jsx14("button", { type: "button", className: "ad-rail__item ad-rail__fold", "aria-label": L.expand, title: L.expand, "aria-expanded": "false", onClick: onToggle, children: /* @__PURE__ */ jsx14(Icon, { name: "caret-right" }) })
    ] })
  ] });
}
function SideMenu({ screens, projects, views = [], current, onSelect, onHome, onSettings, onToggle, onReorder, labels: l = {} }) {
  const L = { home: "Home", menu: "Main", settings: "Settings", fold: "Fold the menu", ...l };
  const [drag, setDrag] = useState7(null);
  const [over, setOver] = useState7(null);
  const movable = (group, id, ids) => onReorder ? {
    draggable: true,
    "data-drop": over === id && drag?.group === group && drag.id !== id ? "" : void 0,
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
  return /* @__PURE__ */ jsxs12("nav", { className: "ad-side", "aria-label": L.menu, children: [
    /* @__PURE__ */ jsxs12("ul", { className: "ad-side__list", children: [
      /* @__PURE__ */ jsx14("li", { children: /* @__PURE__ */ jsxs12("button", { type: "button", className: "ad-side__item", onClick: onHome, children: [
        /* @__PURE__ */ jsx14("span", { className: "ad-side__icon", "aria-hidden": "true", children: /* @__PURE__ */ jsx14(X, {}) }),
        L.home
      ] }) }),
      screens.map((s) => /* @__PURE__ */ jsx14("li", { ...movable("screens", s.id, screens.map((x) => x.id)), children: /* @__PURE__ */ jsxs12("button", { type: "button", className: "ad-side__item", "aria-current": current === s.id ? "page" : void 0, onClick: () => onSelect(s.id), children: [
        /* @__PURE__ */ jsx14("span", { className: "ad-side__icon", "aria-hidden": "true", children: s.icon }),
        s.label
      ] }) }, s.id))
    ] }),
    projects.length > 0 && /* @__PURE__ */ jsx14("ul", { className: "ad-side__list", children: projects.map((p) => /* @__PURE__ */ jsx14("li", { ...movable("projects", p.id, projects.map((x) => x.id)), children: /* @__PURE__ */ jsxs12("button", { type: "button", className: "ad-side__item", "aria-current": current === p.id ? "page" : void 0, onClick: () => onSelect(p.id), children: [
      /* @__PURE__ */ jsx14(ProjectPill, { code: p.code, current: current === p.id, color: p.color }),
      p.name
    ] }) }, p.id)) }),
    views.length > 0 && /* @__PURE__ */ jsx14("ul", { className: "ad-side__list", children: views.map((v) => /* @__PURE__ */ jsx14("li", { children: /* @__PURE__ */ jsxs12("button", { type: "button", className: "ad-side__item", "aria-current": current === v.id ? "page" : void 0, onClick: () => onSelect(v.id), children: [
      /* @__PURE__ */ jsx14(Icon, { name: "star", className: "ad-side__star" }),
      v.label
    ] }) }, v.id)) }),
    (onSettings || onToggle) && /* @__PURE__ */ jsxs12("div", { className: "ad-side__foot", children: [
      onSettings && /* @__PURE__ */ jsxs12("button", { type: "button", className: "ad-side__item", "aria-current": current === "settings" ? "page" : void 0, onClick: onSettings, children: [
        /* @__PURE__ */ jsx14("span", { className: "ad-side__icon", "aria-hidden": "true", children: /* @__PURE__ */ jsx14(Icon, { name: "gear" }) }),
        L.settings
      ] }),
      onToggle && /* @__PURE__ */ jsx14("button", { type: "button", className: "ad-side__fold", "aria-label": L.fold, title: L.fold, "aria-expanded": "true", onClick: onToggle, children: /* @__PURE__ */ jsx14(Icon, { name: "caret-left" }) })
    ] })
  ] });
}

// src/components/Row/Row.tsx
import { Fragment as Fragment5, jsx as jsx15, jsxs as jsxs13 } from "react/jsx-runtime";
var Row = forwardRef5(function Row2({ name, meta, lead, status, dates, tags, people, trail, selected, picked, dragging, heading, onOpen, onRename, renameLabel, className, onClick, ...rest }, ref) {
  const inList = useInList();
  const { compactRows } = useShow();
  return /* @__PURE__ */ jsxs13(
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
        lead != null && /* @__PURE__ */ jsx15("span", { className: "ad-row__lead", children: lead }),
        /* @__PURE__ */ jsxs13("span", { className: "ad-row__body", children: [
          onRename ? /* @__PURE__ */ jsx15(InlineEdit, { value: String(name), onCommit: onRename, ariaLabel: renameLabel ?? "Name", className: "ad-row__name" }) : onOpen ? /* @__PURE__ */ jsx15("button", { type: "button", className: "ad-row__name ad-open", "aria-current": selected || void 0, onClick: (e) => {
            e.stopPropagation();
            onOpen();
          }, children: name }) : /* @__PURE__ */ jsx15("span", { className: "ad-row__name", children: name }),
          meta != null && /* @__PURE__ */ jsx15("span", { className: "ad-row__meta", children: meta })
        ] }),
        status != null && typeof status === "object" && "label" in status && /* @__PURE__ */ jsx15("span", { className: "ad-row__status", children: /* @__PURE__ */ jsx15(Status, { tone: status.tone, label: String(status.label) }) }),
        dates != null && /* @__PURE__ */ jsx15("span", { className: "ad-row__dates", children: dates }),
        tags != null && /* @__PURE__ */ jsx15("span", { className: "ad-row__tags", children: tags }),
        people != null && /* @__PURE__ */ jsx15("span", { className: "ad-row__people", children: people }),
        trail != null && /* @__PURE__ */ jsx15("span", { className: "ad-row__trail", children: /* @__PURE__ */ jsx15(ButtonSizeScope, { size: "row", children: trail }) })
      ]
    }
  );
});
function RowPress({ label, onPress, children }) {
  return /* @__PURE__ */ jsx15("button", { type: "button", "aria-label": label, onClick: (e) => {
    e.stopPropagation();
    onPress(e.currentTarget);
  }, className: "ad-row__press", children });
}
function RowDate({ due, today, until, done, what, icon }) {
  const first = dueLabel(due, today);
  if (!first.label) return null;
  const last = until ? dueLabel(until, today) : null;
  const late = !done && (last ? last.late : first.late);
  const words = last ? `${first.label} \u2013 ${last.label}` : first.label;
  const title = last ? `${first.title} \u2013 ${last.title}` : first.title;
  return /* @__PURE__ */ jsxs13("span", { className: cx("ad-row-date", late && "ad-row-date--late"), title, children: [
    icon && /* @__PURE__ */ jsx15("span", { "aria-hidden": "true", className: "ad-row-date__icon", children: icon }),
    what && /* @__PURE__ */ jsxs13("span", { className: "ad-sr", children: [
      what,
      ": "
    ] }),
    words
  ] });
}
function RowFigure({ children, icon }) {
  return /* @__PURE__ */ jsxs13("span", { className: "ad-row-date", children: [
    icon && /* @__PURE__ */ jsx15("span", { "aria-hidden": "true", className: "ad-row-date__icon", children: icon }),
    children
  ] });
}
function TodoCheck({ checked, onChange, priority = 4, ariaLabel, disabled, unacknowledged, onAcknowledge, acknowledgeLabel }) {
  if (unacknowledged && !checked) {
    return /* @__PURE__ */ jsx15("button", { type: "button", "aria-label": acknowledgeLabel ?? ariaLabel, disabled, onClick: () => onAcknowledge?.(), className: cx("ad-todo-check", `ad-todo-check--p${priority}`, "ad-todo-check--asked") });
  }
  return /* @__PURE__ */ jsx15(
    "button",
    {
      type: "button",
      role: "checkbox",
      "aria-checked": checked,
      "aria-label": ariaLabel,
      disabled,
      onClick: () => onChange(!checked),
      className: cx("ad-todo-check", `ad-todo-check--p${priority}`),
      children: /* @__PURE__ */ jsx15(Icon, { name: "check" })
    }
  );
}
function TodoRow({ name, priority, done, onTick, due, today, dept, who, selected, onOpen, completeLabel = "Complete", unacknowledged, onAcknowledge, acknowledgeLabel = "Acknowledge", repeat, pastDeadline, pastDeadlineLabel = "Deadline passed", role, deliverable, project, picking, onPressDate, onPressWho, onPressDeliverable, pressLabels, onRename }) {
  const plain = due ? /* @__PURE__ */ jsx15(RowDate, { due, today, done }) : null;
  const date = plain && onPressDate ? /* @__PURE__ */ jsx15(RowPress, { label: pressLabels?.date ?? "Change the date", onPress: onPressDate, children: plain }) : plain;
  const extras = repeat || pastDeadline || role || deliverable;
  const meta = date || dept || extras ? /* @__PURE__ */ jsxs13(Fragment5, { children: [
    date,
    dept && /* @__PURE__ */ jsx15(Department, { dept: dept.dept, name: dept.name }),
    repeat && /* @__PURE__ */ jsxs13("span", { className: "ad-row__fact", children: [
      /* @__PURE__ */ jsx15(Icon, { job: "repeat", size: "sm" }),
      String(repeat)
    ] }),
    pastDeadline && /* @__PURE__ */ jsx15("span", { className: "ad-row__fact ad-row__fact--late", role: "img", "aria-label": pastDeadlineLabel, children: /* @__PURE__ */ jsx15(Icon, { job: "flag", size: "sm" }) }),
    role && /* @__PURE__ */ jsx15("span", { className: "ad-row__fact", children: String(role) }),
    deliverable && (onPressDeliverable ? /* @__PURE__ */ jsx15(RowPress, { label: pressLabels?.deliverable ?? `Open ${deliverable}`, onPress: onPressDeliverable, children: /* @__PURE__ */ jsxs13("span", { className: "ad-row__fact", children: [
      /* @__PURE__ */ jsx15(Icon, { job: "kind-deliverable", size: "sm" }),
      String(deliverable)
    ] }) }) : /* @__PURE__ */ jsxs13("span", { className: "ad-row__fact", children: [
      /* @__PURE__ */ jsx15(Icon, { job: "kind-deliverable", size: "sm" }),
      String(deliverable)
    ] }))
  ] }) : void 0;
  return /* @__PURE__ */ jsx15(
    Row,
    {
      picked: picking?.picked,
      onRename,
      renameLabel: onRename ? String(name) : void 0,
      lead: /* @__PURE__ */ jsxs13(Fragment5, { children: [
        picking && /* @__PURE__ */ jsx15(Checkbox, { "aria-label": picking.label ?? `Pick: ${name}`, checked: picking.picked, onChange: picking.onChange }),
        /* @__PURE__ */ jsx15(TodoCheck, { checked: done, onChange: onTick, priority, ariaLabel: `${completeLabel}: ${name}`, unacknowledged, onAcknowledge, acknowledgeLabel: `${acknowledgeLabel}: ${name}` })
      ] }),
      name: String(name),
      meta,
      people: who || project ? /* @__PURE__ */ jsxs13("span", { className: "ad-row__who", children: [
        who && (() => {
          const list = Array.isArray(who) ? who : [who];
          const faces = list.length > 1 ? /* @__PURE__ */ jsx15(AvatarStack, { people: list }) : list[0] ? /* @__PURE__ */ jsx15(Avatar, { name: list[0].name, src: list[0].src }) : null;
          return onPressWho && faces ? /* @__PURE__ */ jsx15(RowPress, { label: pressLabels?.who ?? "Change who", onPress: onPressWho, children: faces }) : faces;
        })(),
        project && /* @__PURE__ */ jsx15(ProjectPill, { code: project.code, color: project.color })
      ] }) : void 0,
      selected,
      onOpen
    }
  );
}

// src/components/List/List.tsx
import { jsx as jsx16, jsxs as jsxs14 } from "react/jsx-runtime";
var InList = createContext3(false);
function List({ children, ariaLabel, className }) {
  return /* @__PURE__ */ jsx16("div", { className: cx("ad-list", className), role: "list", "aria-label": ariaLabel, children: /* @__PURE__ */ jsx16(InList.Provider, { value: true, children }) });
}
function useInList() {
  return useContext3(InList);
}
function ListSection({ title, children, collapsible, collapsed, onCollapsedChange, day, bar, className, ...heading }) {
  const [own, setOwn] = useState8(!!collapsible && !heading.needsYou);
  useEffect6(() => {
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
  return /* @__PURE__ */ jsxs14("section", { role: inList ? "listitem" : void 0, className: cx("ad-list-section", className), children: [
    day ? /* @__PURE__ */ jsx16(DayHeading, { day: day.day, today: day.today }) : bar ? /* @__PURE__ */ jsxs14("div", { className: "ad-list-section__bar", children: [
      collapsible && /* @__PURE__ */ jsx16("button", { type: "button", className: "ad-list-section__fold", "aria-expanded": !shut, "aria-controls": bodyId, "aria-label": bar.foldLabel ?? String(title), onClick: toggle, children: /* @__PURE__ */ jsx16(Icon, { job: shut ? "chevron-right" : "chevron-down", size: "sm" }) }),
      /* @__PURE__ */ jsx16(Row, { heading: true, name: title, status: bar.status, dates: bar.dates, onOpen: bar.onOpen })
    ] }) : /* @__PURE__ */ jsx16(GroupHeading, { ...heading, collapsible, collapsed: shut, onToggle: toggle, controls: bodyId, children: title }),
    /* @__PURE__ */ jsx16("div", { id: bodyId, role: "list", hidden: collapsible ? shut : void 0, className: cx("ad-list-section__body", bar && "ad-list-section__body--nested"), children: /* @__PURE__ */ jsx16(InList.Provider, { value: true, children }) })
  ] });
}
function DayHeading({ day, today, level = 3 }) {
  const H = `h${level}`;
  const { name, date } = dayHeading(day, today);
  return /* @__PURE__ */ jsxs14(H, { className: "ad-day-heading", children: [
    /* @__PURE__ */ jsx16("span", { className: "ad-day-heading__name", children: name }),
    /* @__PURE__ */ jsx16("span", { className: "ad-day-heading__date", children: date })
  ] });
}
function AddRow({ label, onAdd, icon }) {
  const inList = useInList();
  const button = /* @__PURE__ */ jsxs14("button", { type: "button", className: "ad-add-row", onClick: onAdd, children: [
    /* @__PURE__ */ jsx16("span", { "aria-hidden": "true", className: "ad-add-row__icon", children: icon ?? /* @__PURE__ */ jsx16(Icon, { name: "plus" }) }),
    label
  ] });
  return inList ? /* @__PURE__ */ jsx16("div", { role: "listitem", children: button }) : button;
}
var NAME_NOISE = [22, 17, 26];
var META_NOISE = [14, 10, 12];
var noise = (n, row, tick) => Array.from({ length: n }, (_, i) => {
  if (i % 6 === 5) return " ";
  const h = Math.imul((i + 1) * 2654435761 + (row + 1) * 40503 + tick * 97, 2246822519) >>> 0;
  return h >>> 13 & 1 ? "1" : "0";
}).join("");
function LoadingRows({ label, rows = 3, oneLine, delay }) {
  const [shown, setShown] = useState8(delay === 0);
  const [tick, setTick] = useState8(0);
  useEffect6(() => {
    if (shown) return;
    const t = setTimeout(() => setShown(true), delay ?? tokenMs("--delay-loading", 1e3));
    return () => clearTimeout(t);
  }, [shown, delay]);
  useEffect6(() => {
    if (!shown || window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setTick((n) => n + 1), tokenMs("--tick-scramble", 30) * 3);
    return () => clearInterval(t);
  }, [shown]);
  const inList = useInList();
  const box = /* @__PURE__ */ jsxs14("div", { className: "ad-loading", role: "status", "aria-busy": "true", "aria-label": label, children: [
    shown && /* @__PURE__ */ jsx16("span", { className: "ad-sr", children: label }),
    /* @__PURE__ */ jsx16(InList.Provider, { value: false, children: shown && Array.from({ length: rows }, (_, i) => /* @__PURE__ */ jsx16(Row, { "aria-hidden": "true", className: "ad-loading-row", name: noise(NAME_NOISE[i % 3], i, tick), meta: oneLine ? void 0 : noise(META_NOISE[i % 3], i + rows, tick) }, i)) })
  ] });
  return inList ? /* @__PURE__ */ jsx16("div", { role: "listitem", children: box }) : box;
}
function LoadError({ sentence, onRetry, retryLabel = "Try again" }) {
  const inList = useInList();
  const box = /* @__PURE__ */ jsxs14("div", { className: "ad-empty ad-load-error", role: "alert", children: [
    /* @__PURE__ */ jsx16("p", { className: "ad-empty__sentence", children: sentence }),
    /* @__PURE__ */ jsx16(Button, { onClick: onRetry, children: retryLabel })
  ] });
  return inList ? /* @__PURE__ */ jsx16("div", { role: "listitem", children: box }) : box;
}

// src/components/EmptyState/EmptyState.tsx
import { Fragment as Fragment6, jsx as jsx17, jsxs as jsxs15 } from "react/jsx-runtime";
function EmptyState({ sentence, add, clear, className }) {
  const children = /* @__PURE__ */ jsxs15(Fragment6, { children: [
    add && /* @__PURE__ */ jsx17(AddRow, { label: add.label, onAdd: add.onAdd }),
    clear && /* @__PURE__ */ jsx17("div", { children: /* @__PURE__ */ jsx17(Button, { onClick: clear.onClear, children: clear.label ?? "Clear" }) })
  ] });
  const inList = useInList();
  const box = /* @__PURE__ */ jsxs15("div", { className: cx("ad-empty", className), role: "status", children: [
    /* @__PURE__ */ jsx17("p", { className: "ad-empty__sentence", children: String(sentence) }),
    /* @__PURE__ */ jsx17(InList.Provider, { value: false, children })
  ] });
  return inList ? /* @__PURE__ */ jsx17("div", { role: "listitem", children: box }) : box;
}

// src/components/Popover/Popover.tsx
import { createContext as createContext4, useContext as useContext4, useId as useId5, useRef as useRef7 } from "react";
import { jsx as jsx18, jsxs as jsxs16 } from "react/jsx-runtime";
var TitleId = createContext4(void 0);
function CloseButton({ onClose, label = "Close" }) {
  return /* @__PURE__ */ jsx18("button", { type: "button", className: "ad-close", "aria-label": label, title: label, onClick: onClose });
}
function Popover({ open, onClose, anchor, placement = "drop", width = "card", ariaLabel, noClose, closeLabel, keepFocus, id, children, foot, className }) {
  const box = useRef7(null);
  const titleId = useId5();
  const style = usePlacement(open, anchor, box, placement);
  const z = useLayer(open, onClose, [box, anchor]);
  useFocusReturn(open && !keepFocus, box, "box");
  if (!open) return null;
  return /* @__PURE__ */ jsx18(Portal, { children: /* @__PURE__ */ jsxs16("div", { ref: box, id, role: "dialog", "aria-label": ariaLabel, "aria-labelledby": ariaLabel ? void 0 : titleId, tabIndex: -1, style: { ...style, zIndex: z }, className: cx("ad-float", "ad-popover", `ad-popover--${width}`, foot != null && "ad-popover--with-foot", className), children: [
    !noClose && /* @__PURE__ */ jsx18(CloseButton, { onClose, label: closeLabel }),
    /* @__PURE__ */ jsx18(TitleId.Provider, { value: titleId, children: foot == null ? children : /* @__PURE__ */ jsx18("div", { className: "ad-popover__body", children }) }),
    foot != null && /* @__PURE__ */ jsx18("div", { className: "ad-popover__foot", children: /* @__PURE__ */ jsx18(ButtonSizeScope, { size: "row", children: foot }) })
  ] }) });
}
function PopoverHeader({ eyebrow, title, lead, description, onRename, renameLabel, action }) {
  const own = useId5();
  const id = useContext4(TitleId) ?? own;
  return /* @__PURE__ */ jsxs16("header", { className: "ad-popover__header", children: [
    eyebrow && /* @__PURE__ */ jsx18("div", { className: "ad-popover__eyebrow", children: eyebrow }),
    /* @__PURE__ */ jsxs16("div", { className: "ad-popover__title-row", children: [
      lead,
      /* @__PURE__ */ jsx18("h2", { id, className: "ad-popover__title", children: onRename ? /* @__PURE__ */ jsx18(InlineEdit, { size: "title", value: String(title), onCommit: onRename, ariaLabel: renameLabel ?? "Name" }) : title }),
      action && /* @__PURE__ */ jsx18("span", { className: "ad-popover__action", children: /* @__PURE__ */ jsx18(ButtonSizeScope, { size: "row", children: action }) })
    ] }),
    description && /* @__PURE__ */ jsx18("p", { className: "ad-popover__description", children: description })
  ] });
}
function Facts({ children }) {
  return /* @__PURE__ */ jsx18("div", { className: "ad-facts", role: "list", children });
}
function Fact({ icon, label, children, full }) {
  return /* @__PURE__ */ jsxs16("div", { role: "listitem", className: cx("ad-facts__cell", full && "ad-facts__cell--full"), title: label, children: [
    icon && /* @__PURE__ */ jsx18("span", { className: "ad-facts__icon", "aria-hidden": "true", children: icon }),
    label && /* @__PURE__ */ jsxs16("span", { className: "ad-sr", children: [
      label,
      ": "
    ] }),
    /* @__PURE__ */ jsx18(ButtonSizeScope, { size: "row", children })
  ] });
}
function PopoverSection({ label, children, end }) {
  return /* @__PURE__ */ jsxs16("section", { className: "ad-popover__section", children: [
    /* @__PURE__ */ jsxs16("div", { className: "ad-popover__section-head", children: [
      /* @__PURE__ */ jsx18("h3", { className: "ad-popover__section-label", children: label }),
      end
    ] }),
    children
  ] });
}

// src/components/Dialog/Dialog.tsx
import { useId as useId6, useRef as useRef8 } from "react";
import { jsx as jsx19, jsxs as jsxs17 } from "react/jsx-runtime";
function Dialog({ open, onClose, title, children, actions, role = "dialog", width = "dialog", closeLabel, className }) {
  const box = useRef8(null);
  const titleId = useId6();
  const bodyId = useId6();
  const z = useLayer(open, onClose, [box], "dialog");
  usePageInert(open, [box]);
  useFocusReturn(open, box, "box");
  if (!open) return null;
  return /* @__PURE__ */ jsxs17(Portal, { children: [
    /* @__PURE__ */ jsx19("div", { className: "ad-scrim", "aria-hidden": "true", style: { zIndex: z - 1 } }),
    /* @__PURE__ */ jsxs17(
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
        className: cx("ad-float", "ad-dialog", `ad-dialog--${width}`, className),
        children: [
          /* @__PURE__ */ jsx19(CloseButton, { onClose, label: closeLabel }),
          /* @__PURE__ */ jsx19("h2", { id: titleId, className: "ad-dialog__title", children: String(title) }),
          children && /* @__PURE__ */ jsx19("div", { id: bodyId, className: "ad-dialog__body", children: String(children) }),
          Array.isArray(actions) && actions.length > 0 && /* @__PURE__ */ jsx19("div", { className: "ad-dialog__actions", children: [...actions.filter((a) => !a.main), ...actions.filter((a) => a.main).slice(0, 1)].map((a) => /* @__PURE__ */ jsx19(Button, { block: true, variant: a.main ? "main" : "quiet", onClick: a.onSelect, children: a.label }, a.label)) })
        ]
      }
    )
  ] });
}
function ConfirmDialog({ open, act, thing, detail, onConfirm, onKeep, labels: l = {} }) {
  return /* @__PURE__ */ jsx19(
    Dialog,
    {
      open,
      onClose: onKeep,
      role: "alertdialog",
      title: `${act} ${thing}?`,
      actions: [{ label: `${l.keep ?? "Keep"} ${thing}`, onSelect: onKeep }, { label: `${act} ${thing}`, onSelect: onConfirm, main: true }],
      children: `${detail} ${l.cannotUndo ?? "This can\u2019t be undone."}`
    }
  );
}

// src/components/Menu/Menu.tsx
import { useEffect as useEffect7, useRef as useRef9, useState as useState9 } from "react";
import { jsx as jsx20, jsxs as jsxs18 } from "react/jsx-runtime";
function ordered(items) {
  const danger = items.filter((i) => i.kind !== "separator" && i.danger);
  const rest = items.filter((i) => i.kind === "separator" || !i.danger);
  const all = danger.length ? [...rest, { kind: "separator", id: "__danger" }, ...danger] : rest;
  return all.filter((i, n) => i.kind !== "separator" || n > 0 && n < all.length - 1 && all[n - 1].kind !== "separator");
}
function Menu({ open, onClose, anchor, items: given, ariaLabel, placement = "drop", className }) {
  const items = ordered(given);
  const box = useRef9(null);
  const style = usePlacement(open, anchor, box, placement);
  const z = useLayer(open, onClose, [box, anchor]);
  const live = items.filter((i) => i.kind !== "separator" && !i.disabled);
  const [at, setAt] = useState9(0);
  useEffect7(() => {
    if (!open) return;
    setAt(0);
    const before = document.activeElement;
    return () => {
      if (before && document.contains(before)) before.focus({ preventScroll: true });
    };
  }, [open]);
  useEffect7(() => {
    if (!open) return;
    const id = requestAnimationFrame(() => box.current?.querySelector(`[data-index="${at}"]`)?.focus({ preventScroll: true }));
    return () => cancelAnimationFrame(id);
  }, [open, at]);
  if (!open) return null;
  const choose = (i) => {
    const item = live[i];
    if (!item) return;
    onClose();
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
      for (let s = 1; s <= live.length; s++) {
        const j = (at + s) % live.length;
        if (live[j].label.toLowerCase().startsWith(k)) {
          setAt(j);
          break;
        }
      }
    }
  };
  let index = -1;
  return /* @__PURE__ */ jsx20(Portal, { children: /* @__PURE__ */ jsx20("div", { ref: box, role: "menu", "aria-label": ariaLabel, style: { ...style, zIndex: z }, onKeyDown: onKeyDown2, className: cx("ad-float", "ad-menu", className), children: items.map((item) => {
    if (item.kind === "separator") return /* @__PURE__ */ jsx20("div", { role: "separator", className: "ad-menu__separator" }, item.id);
    const i = item.disabled ? -1 : ++index;
    return /* @__PURE__ */ jsxs18(
      "button",
      {
        type: "button",
        role: item.checked != null ? "menuitemcheckbox" : "menuitem",
        "aria-checked": item.checked,
        "aria-description": item.sub,
        "aria-disabled": item.disabled || void 0,
        tabIndex: i === at ? 0 : -1,
        "data-index": i,
        "data-active": i === at || void 0,
        onMouseEnter: () => i >= 0 && setAt(i),
        onClick: () => i >= 0 && choose(i),
        className: cx("ad-menu__item", item.danger && "ad-menu__item--danger", item.sub && "ad-menu__item--two"),
        children: [
          item.icon && /* @__PURE__ */ jsx20("span", { className: "ad-menu__icon", "aria-hidden": "true", children: item.icon }),
          item.sub ? /* @__PURE__ */ jsxs18("span", { className: "ad-menu__words", children: [
            /* @__PURE__ */ jsx20("span", { className: "ad-menu__label", children: item.label }),
            /* @__PURE__ */ jsx20("span", { className: "ad-menu__sub", children: item.sub })
          ] }) : /* @__PURE__ */ jsx20("span", { className: "ad-menu__label", children: item.label }),
          item.shortcut && /* @__PURE__ */ jsx20("kbd", { className: "ad-menu__shortcut", children: item.shortcut }),
          item.checked && /* @__PURE__ */ jsx20("span", { className: "ad-menu__check", "aria-hidden": "true", children: /* @__PURE__ */ jsx20(Icon, { job: "check", size: "sm" }) })
        ]
      },
      item.id
    );
  }) }) });
}

// src/components/UndoNote/UndoNote.tsx
import { useEffect as useEffect8, useRef as useRef10, useState as useState10 } from "react";
import { jsx as jsx21, jsxs as jsxs19 } from "react/jsx-runtime";
function UndoNote({ open, noteId, message, actionLabel = "Undo", onAction, onClose, className }) {
  const [held, setHeld] = useState10(false);
  const latest = useRef10(onClose);
  latest.current = onClose;
  useEffect8(() => {
    if (!open) setHeld(false);
  }, [open]);
  useEffect8(() => {
    if (!open || held) return;
    const t = setTimeout(() => latest.current(), tokenMs("--dur-undo", 4e3));
    return () => clearTimeout(t);
  }, [open, held, noteId]);
  return /* @__PURE__ */ jsx21(Portal, { children: /* @__PURE__ */ jsx21("div", { className: "ad-undo-region", role: "status", "aria-live": "polite", children: open && /* @__PURE__ */ jsxs19(
    "div",
    {
      className: cx("ad-float", "ad-undo", className),
      onPointerEnter: () => setHeld(true),
      onPointerLeave: () => setHeld(false),
      onFocus: () => setHeld(true),
      onBlur: () => setHeld(false),
      children: [
        /* @__PURE__ */ jsx21("span", { className: "ad-undo__message", children: message }),
        onAction && /* @__PURE__ */ jsx21(ButtonSizeScope, { size: "bar", children: /* @__PURE__ */ jsx21(Button, { onClick: () => {
          onAction();
          onClose();
        }, children: actionLabel }) })
      ]
    }
  ) }) });
}

// src/components/Pickers/PickList.tsx
import { useId as useId7, useMemo, useRef as useRef11, useState as useState11 } from "react";
import { jsx as jsx22, jsxs as jsxs20 } from "react/jsx-runtime";
function PickList({ options, value, onPick, searchLabel, noMatch = "Nothing matches", noSearch, query, onQuery, className }) {
  const [own, setOwn] = useState11("");
  const q = query ?? own;
  const setQ = (v) => {
    setOwn(v);
    onQuery?.(v);
  };
  const listId = useId7();
  const picked = new Set(value == null ? [] : Array.isArray(value) ? value : [value]);
  const many = Array.isArray(value);
  const shown = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (onQuery) return options;
    return options.filter((o) => !s || `${o.label} ${o.keywords ?? ""}`.toLowerCase().includes(s));
  }, [options, q, onQuery]);
  const live = shown.filter((o) => !o.disabled);
  const start = Math.max(0, live.findIndex((o) => picked.has(o.id)));
  const [at, setAt] = useState11(start);
  const cur = live[Math.min(at, live.length - 1)];
  const listRef = useRef11(null);
  const optId = (o) => `${listId}-${o.id}`;
  const move = (i) => {
    setAt(i);
    requestAnimationFrame(() => listRef.current?.querySelector(`[data-active]`)?.scrollIntoView({ block: "nearest" }));
  };
  const onKeyDown2 = (e) => {
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
  let lastGroup;
  return /* @__PURE__ */ jsxs20("div", { className: cx("ad-picklist", className), onKeyDown: onKeyDown2, children: [
    !noSearch && /* @__PURE__ */ jsxs20("div", { className: "ad-picklist__search", children: [
      /* @__PURE__ */ jsx22(Icon, { name: "magnifying-glass" }),
      /* @__PURE__ */ jsx22(
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
    /* @__PURE__ */ jsxs20("div", { ref: listRef, id: listId, role: "listbox", "aria-label": searchLabel, tabIndex: noSearch ? 0 : -1, "data-autofocus": noSearch || void 0, "aria-activedescendant": noSearch && cur ? optId(cur) : void 0, "aria-multiselectable": Array.isArray(value) || void 0, className: "ad-picklist__list", children: [
      shown.length === 0 && /* @__PURE__ */ jsx22("div", { className: "ad-picklist__empty", children: noMatch }),
      shown.map((o) => {
        const head = o.group && o.group !== lastGroup ? o.group : null;
        lastGroup = o.group;
        const active = o === cur;
        return /* @__PURE__ */ jsxs20("div", { role: "presentation", children: [
          head && /* @__PURE__ */ jsx22("div", { className: "ad-picklist__group", role: "presentation", children: head }),
          /* @__PURE__ */ jsxs20(
            "div",
            {
              id: optId(o),
              role: "option",
              "aria-selected": picked.has(o.id),
              "aria-disabled": o.disabled || void 0,
              "data-active": active || void 0,
              onPointerMove: () => {
                const i = live.indexOf(o);
                if (i >= 0 && i !== at) setAt(i);
              },
              onClick: () => !o.disabled && onPick(o.id),
              className: "ad-picklist__option",
              children: [
                many && /* @__PURE__ */ jsx22("span", { className: "ad-checkbox__box", "data-state": picked.has(o.id) ? "on" : "off", "aria-hidden": "true", children: picked.has(o.id) && /* @__PURE__ */ jsx22(Icon, { name: "check" }) }),
                o.lead != null && /* @__PURE__ */ jsx22("span", { className: "ad-picklist__lead", children: o.lead }),
                /* @__PURE__ */ jsx22("span", { className: "ad-picklist__label", children: o.label }),
                o.hint != null && /* @__PURE__ */ jsx22("span", { className: "ad-picklist__hint", children: o.hint }),
                !many && picked.has(o.id) && /* @__PURE__ */ jsx22("span", { className: "ad-picklist__check", "aria-hidden": "true", children: /* @__PURE__ */ jsx22(Icon, { name: "check", size: "sm" }) })
              ]
            }
          )
        ] }, o.id);
      })
    ] })
  ] });
}

// src/components/Pickers/Pickers.tsx
import { useRef as useRef12, useState as useState12 } from "react";
import { Fragment as Fragment7, jsx as jsx23, jsxs as jsxs21 } from "react/jsx-runtime";
function PersonPicker({ people, ...rest }) {
  return /* @__PURE__ */ jsx23(PickList, { ...rest, options: people.map((p) => ({ id: p.id, label: p.name, keywords: p.email, lead: /* @__PURE__ */ jsx23(Avatar, { name: p.name, initials: p.initials, src: p.src }) })) });
}
function ProjectPicker({ projects, ...rest }) {
  return /* @__PURE__ */ jsx23(PickList, { ...rest, options: projects.map((p) => ({ id: p.id, label: p.name, keywords: p.code, lead: /* @__PURE__ */ jsx23(Tag, { children: p.code }) })) });
}
function StatusPicker({ statuses, noSearch = true, ...rest }) {
  return /* @__PURE__ */ jsx23(PickList, { ...rest, noSearch, options: statuses.map((s) => ({ id: s.id, label: s.label, lead: /* @__PURE__ */ jsx23(Dot, { tone: s.tone }) })) });
}
function PickField({ options, value, onPick, label, placeholder, search, disabled, className }) {
  const [open, setOpen] = useState12(false);
  const anchor = useRef12(null);
  const box = useRef12(null);
  const style = usePlacement(open, anchor, box, "drop");
  const close = () => {
    setOpen(false);
    anchor.current?.focus({ preventScroll: true });
  };
  const z = useLayer(open, close, [box, anchor]);
  const many = Array.isArray(value);
  const picked = options.filter((o) => many ? value.includes(o.id) : o.id === value);
  const face = picked.length === 1 ? picked[0] : null;
  return /* @__PURE__ */ jsxs21(Fragment7, { children: [
    /* @__PURE__ */ jsxs21(
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
          face?.lead != null && /* @__PURE__ */ jsx23("span", { className: "ad-pick-field__lead", "aria-hidden": "true", children: face.lead }),
          /* @__PURE__ */ jsx23("span", { className: cx("ad-pick-field__words", picked.length === 0 && "ad-pick-field__words--empty"), children: picked.length ? picked.map((o) => o.label).join(", ") : placeholder ?? label }),
          /* @__PURE__ */ jsx23(Icon, { name: "caret-down", className: "ad-pick-field__caret" })
        ]
      }
    ),
    open && /* @__PURE__ */ jsx23(Portal, { children: /* @__PURE__ */ jsx23("div", { ref: box, style: { ...style, zIndex: z }, className: "ad-float ad-pick-field__list", children: /* @__PURE__ */ jsx23(
      PickList,
      {
        options,
        value,
        searchLabel: label,
        noSearch: !(search ?? options.length > 8),
        onPick: (id) => {
          onPick(id);
          if (!many) close();
        }
      }
    ) }) })
  ] });
}

// src/components/Pickers/DatePicker.tsx
import { useEffect as useEffect9, useId as useId8, useMemo as useMemo2, useRef as useRef13, useState as useState13 } from "react";
import { jsx as jsx24, jsxs as jsxs22 } from "react/jsx-runtime";
var EN = { today: "Today", tomorrow: "Tomorrow", nextWeek: "Next week", inTwoWeeks: "In two weeks", previousMonth: "Previous month", nextMonth: "Next month" };
function DatePicker({ value, onChange, today: todayIn, weekStart = 1, locale = "en-US", labels: l, quickPicks, shadeWeekends = true, className }) {
  const labels = { ...EN, ...l };
  const today = dayOf(todayIn);
  const [focus, setFocus] = useState13(dayOf(value ?? today));
  const grid = useRef13(null);
  const moved = useRef13(false);
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
  useEffect9(() => {
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
  return /* @__PURE__ */ jsxs22("div", { className: cx("ad-datepicker", className), children: [
    /* @__PURE__ */ jsx24("div", { className: "ad-datepicker__quick", children: picks.map((p) => /* @__PURE__ */ jsxs22("button", { type: "button", className: "ad-datepicker__pick", "aria-pressed": sameDay(value, p.date), onClick: () => onChange(dayOf(p.date)), children: [
      /* @__PURE__ */ jsx24("span", { children: p.label }),
      /* @__PURE__ */ jsx24("span", { className: "ad-datepicker__pick-date", children: pickDate(p.date) })
    ] }, p.id)) }),
    /* @__PURE__ */ jsxs22("div", { className: "ad-datepicker__month", children: [
      /* @__PURE__ */ jsx24("span", { className: "ad-datepicker__month-name", "aria-live": "polite", children: monthName }),
      /* @__PURE__ */ jsxs22("span", { className: "ad-datepicker__navs", children: [
        /* @__PURE__ */ jsx24("button", { type: "button", className: "ad-datepicker__nav", "aria-label": labels.previousMonth, onClick: () => go(addMonthsClamped(focus, -1)), children: /* @__PURE__ */ jsx24(Icon, { name: "caret-left" }) }),
        /* @__PURE__ */ jsx24("button", { type: "button", className: "ad-datepicker__nav", "aria-label": labels.nextMonth, onClick: () => go(addMonthsClamped(focus, 1)), children: /* @__PURE__ */ jsx24(Icon, { name: "caret-right" }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxs22("div", { ref: grid, role: "grid", "aria-label": monthName, className: "ad-datepicker__grid", onKeyDown: onGridKey, children: [
      /* @__PURE__ */ jsx24("div", { role: "row", className: "ad-datepicker__week", children: weekdays.map((w, i) => /* @__PURE__ */ jsx24("span", { role: "columnheader", "aria-label": w.long, className: "ad-datepicker__dow", children: w.short }, i)) }),
      Array.from({ length: weeks }, (_, r) => r).map((r) => /* @__PURE__ */ jsx24("div", { role: "row", className: "ad-datepicker__week", children: days.slice(r * 7, r * 7 + 7).map((d) => {
        const wk = d.getDay() === 0 || d.getDay() === 6;
        return /* @__PURE__ */ jsx24("span", { role: "gridcell", "aria-selected": sameDay(d, value), children: /* @__PURE__ */ jsx24(
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
            children: d.getDate()
          }
        ) }, formatISO(d));
      }) }, r))
    ] })
  ] });
}
function DateField({ onParsed, label, text: given, onText, format, icon, className, value, onChange, ...picker }) {
  const fmt = format ?? ((d) => monoDate(d));
  const read2 = (t) => {
    const r = readDate(t, picker.today, { weekStart: picker.weekStart });
    return r && { date: r.date, readback: r.readback, extra: r.recurrence };
  };
  const [own, setOwn] = useState13(value ? fmt(value) : "");
  const text = given ?? own;
  const setText = (t) => {
    if (given === void 0) setOwn(t);
    onText?.(t);
  };
  const [open, setOpen] = useState13(false);
  const dropId = useId8();
  const anchor = useRef13(null);
  const drop = useRef13(null);
  const input = useRef13(null);
  const say = (d) => {
    setText(d ? fmt(d) : "");
    onChange(d);
  };
  useEffect9(() => {
    if (given === void 0) setOwn(value ? fmt(value) : "");
  }, [value?.getTime()]);
  const result = text && (!value || text !== fmt(value)) ? read2(text) : null;
  return /* @__PURE__ */ jsxs22("span", { ref: anchor, className: cx("ad-datefield", className), children: [
    /* @__PURE__ */ jsx24(
      TextField,
      {
        ref: input,
        className: value && text === fmt(value) ? "ad-datefield__field--date" : void 0,
        icon,
        "aria-label": label,
        placeholder: label,
        value: text,
        role: "combobox",
        "aria-haspopup": "dialog",
        "aria-expanded": open,
        "aria-controls": open ? dropId : void 0,
        parsed: result ? result.readback : void 0,
        onChange: (e) => setText(e.target.value),
        onClick: () => setOpen(true),
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
    /* @__PURE__ */ jsx24(Popover, { open, onClose: () => {
      const a = document.activeElement;
      if (!a || a === document.body || drop.current?.contains(a)) input.current?.focus({ preventScroll: true });
      setOpen(false);
    }, anchor, noClose: true, keepFocus: true, ariaLabel: label, id: dropId, className: "ad-datefield__drop", children: /* @__PURE__ */ jsx24("div", { ref: drop, children: /* @__PURE__ */ jsx24(DatePicker, { ...picker, value, onChange: (d) => {
      say(d);
      setOpen(false);
      input.current?.focus({ preventScroll: true });
    } }) }) })
  ] });
}

// src/components/Card/Card.tsx
import { createContext as createContext5, forwardRef as forwardRef6, useContext as useContext5 } from "react";
import { jsx as jsx25, jsxs as jsxs23 } from "react/jsx-runtime";
var OpenCard = createContext5(void 0);
var Card = forwardRef6(function Card2({ title, onMore, moreLabel = "More", children, onOpen, selected, dragging, picking, size = "tile", className, onClick, ...rest }, ref) {
  return /* @__PURE__ */ jsxs23(
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
        (title != null || onMore != null) && /* @__PURE__ */ jsxs23("div", { className: "ad-card__head", children: [
          title != null && /* @__PURE__ */ jsx25("h3", { className: "ad-card__title", children: onOpen ? /* @__PURE__ */ jsx25("button", { type: "button", className: "ad-card__title-open", onClick: (e) => {
            e.stopPropagation();
            onOpen();
          }, children: title }) : title }),
          onMore != null && /* @__PURE__ */ jsx25("button", { type: "button", className: "ad-card__more", onClick: (e) => {
            e.stopPropagation();
            onMore();
          }, children: moreLabel })
        ] }),
        picking && /* @__PURE__ */ jsx25("span", { className: "ad-card__pick", children: /* @__PURE__ */ jsx25(Checkbox, { "aria-label": picking.label, checked: picking.picked, onChange: picking.onChange }) }),
        /* @__PURE__ */ jsx25(OpenCard.Provider, { value: onOpen, children })
      ]
    }
  );
});
function CardName({ children, lead, onRename, renameLabel }) {
  const open = useContext5(OpenCard);
  const name = onRename ? /* @__PURE__ */ jsx25(InlineEdit, { value: String(children), onCommit: onRename, ariaLabel: renameLabel ?? "Name", className: "ad-card__name" }) : open ? /* @__PURE__ */ jsx25("button", { type: "button", className: "ad-card__name ad-open", onClick: (e) => {
    e.stopPropagation();
    open();
  }, children }) : /* @__PURE__ */ jsx25("div", { className: "ad-card__name", children });
  return lead != null ? /* @__PURE__ */ jsxs23("div", { className: "ad-card__name-row", children: [
    /* @__PURE__ */ jsx25("span", { className: "ad-card__lead", children: lead }),
    name
  ] }) : name;
}
function Dials({ children }) {
  return /* @__PURE__ */ jsx25("div", { className: "ad-card__dials", children });
}

// src/components/PageHeader/PageHeader.tsx
import { useId as useId9, useRef as useRef15, useState as useState15 } from "react";

// src/components/ShowOptions/ShowOptions.tsx
import { useRef as useRef14, useState as useState14 } from "react";

// src/components/Settings/Settings.tsx
import { jsx as jsx26, jsxs as jsxs24 } from "react/jsx-runtime";
function SettingsLayout({ nav, children, className }) {
  return /* @__PURE__ */ jsxs24("div", { className: cx("ad-settings", className), children: [
    nav,
    /* @__PURE__ */ jsx26("div", { className: "ad-settings__pane", children })
  ] });
}
function SettingsNav({ children, ariaLabel }) {
  return /* @__PURE__ */ jsx26("nav", { className: "ad-settings__nav", "aria-label": ariaLabel, children });
}
function SettingsNavItem({ icon, label, current, onSelect }) {
  return /* @__PURE__ */ jsxs24("button", { type: "button", className: "ad-settings__nav-item", "aria-current": current ? "page" : void 0, onClick: onSelect, children: [
    icon && /* @__PURE__ */ jsx26("span", { "aria-hidden": "true", className: "ad-settings__nav-icon", children: icon }),
    label
  ] });
}
function SettingsSection({ title, children }) {
  return /* @__PURE__ */ jsxs24("section", { className: "ad-settings__section", children: [
    /* @__PURE__ */ jsx26("h2", { className: "ad-settings__title", children: title }),
    /* @__PURE__ */ jsx26("div", { className: "ad-settings__rows", children })
  ] });
}
function SettingRow(props) {
  return /* @__PURE__ */ jsx26(FieldRow, { ...props, className: cx("ad-setting", props.className) });
}
function AccessRow({ face, name, className, ...rest }) {
  return /* @__PURE__ */ jsx26(FieldRow, { ...rest, label: /* @__PURE__ */ jsxs24("span", { className: "ad-setting__name", children: [
    face,
    name
  ] }), className: cx("ad-setting", className) });
}

// src/components/ShowOptions/ShowOptions.tsx
import { Fragment as Fragment8, jsx as jsx27, jsxs as jsxs25 } from "react/jsx-runtime";
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
  const [open, setOpen] = useState14(false);
  const gear = useRef14(null);
  const now = { ...SHOW_DEFAULTS, ...value };
  const shown = showOrder.filter((o) => options.includes(o));
  const gearLabel = l.gear ?? "Show options";
  return /* @__PURE__ */ jsxs25(Fragment8, { children: [
    /* @__PURE__ */ jsx27(IconButton, { ref: gear, label: gearLabel, active: open, "aria-expanded": open, "aria-haspopup": "dialog", onClick: () => setOpen(!open), children: /* @__PURE__ */ jsx27(Icon, { job: "settings" }) }),
    /* @__PURE__ */ jsx27(Popover, { open, onClose: () => setOpen(false), anchor: gear, ariaLabel: gearLabel, children: /* @__PURE__ */ jsx27(PopoverSection, { label: gearLabel, children: shown.map((o) => /* @__PURE__ */ jsx27(SettingRow, { label: l[o] ?? WORDS[o], children: /* @__PURE__ */ jsx27(Switch, { checked: now[o], "aria-label": l[o] ?? WORDS[o], onChange: (on) => onChange({ ...now, [o]: on }) }) }, o)) }) })
  ] });
}

// src/components/PageHeader/PageHeader.tsx
import { jsx as jsx28, jsxs as jsxs26 } from "react/jsx-runtime";
var STATES = /* @__PURE__ */ new Set(["Pencilled", "Deal", "Active", "Close out", "Cancelled", "Archived"]);
function countdownWords(c) {
  const n = daysBetween(c.today, c.to);
  if (!(n >= 0)) return null;
  const days = n === 0 ? "Today" : `${n} ${n === 1 ? "day" : "days"} to`;
  return `${days} ${c.what} \xB7 ${monthDay(c.to, c.today)} ${c.place}`;
}
function PageHeader({ title, icon, stamp, tabs, back, description, countdown: given, gear, onSearch, onPopOut, onHelp, menu, headerLabels, scramble = true, className }) {
  const anyEnd = gear || onSearch || onPopOut || onHelp || menu;
  const [menuOpen, setMenuOpen] = useState15(false);
  const menuAt = useRef15(null);
  const countdown = given && typeof given === "object" && given.to instanceof Date ? countdownWords(given) : null;
  return /* @__PURE__ */ jsxs26("header", { className: cx("ad-page-header", className), children: [
    typeof stamp === "string" && STATES.has(stamp) && /* @__PURE__ */ jsx28("div", { className: "ad-type-stamp ad-page-header__stamp", children: stamp }),
    back && /* @__PURE__ */ jsx28(ButtonSizeScope, { size: "bar", children: /* @__PURE__ */ jsxs26("button", { type: "button", className: "ad-page-header__back", onClick: back.onBack, children: [
      /* @__PURE__ */ jsx28(Icon, { job: "chevron-left", size: "sm" }),
      back.label
    ] }) }),
    tabs && /* @__PURE__ */ jsx28("div", { className: "ad-page-header__tabs", children: tabs }),
    /* @__PURE__ */ jsxs26("div", { className: "ad-page-header__row", children: [
      /* @__PURE__ */ jsxs26("h1", { className: "ad-page-header__title", children: [
        icon && /* @__PURE__ */ jsx28("span", { className: "ad-page-header__icon", "aria-hidden": "true", children: icon }),
        scramble ? /* @__PURE__ */ jsx28(TextScramble, { text: title }) : title
      ] }),
      (description || countdown) && /* @__PURE__ */ jsxs26("div", { className: "ad-page-header__aside", children: [
        description && /* @__PURE__ */ jsx28("p", { className: "ad-page-header__description", children: String(description) }),
        countdown && /* @__PURE__ */ jsx28("p", { className: "ad-page-header__countdown", children: countdown })
      ] }),
      anyEnd && /* @__PURE__ */ jsxs26("div", { className: "ad-page-header__end", children: [
        /* @__PURE__ */ jsxs26(ButtonSizeScope, { size: "bar", children: [
          onSearch && /* @__PURE__ */ jsx28(IconButton, { label: headerLabels?.search ?? "Search", onClick: onSearch, children: /* @__PURE__ */ jsx28(Icon, { job: "search", size: "md" }) }),
          onPopOut && /* @__PURE__ */ jsx28(IconButton, { label: headerLabels?.popOut ?? "Pop out", onClick: onPopOut, children: /* @__PURE__ */ jsx28(Icon, { job: "external", size: "md" }) }),
          onHelp && /* @__PURE__ */ jsx28(IconButton, { label: headerLabels?.help ?? "Help", onClick: onHelp, children: /* @__PURE__ */ jsx28(Icon, { job: "help", size: "md" }) }),
          menu && /* @__PURE__ */ jsxs26("span", { className: "ad-page-header__menu", children: [
            /* @__PURE__ */ jsx28(IconButton, { ref: menuAt, label: menu.label ?? "More", active: menuOpen, "aria-haspopup": "menu", "aria-expanded": menuOpen, onClick: () => setMenuOpen((o) => !o), children: /* @__PURE__ */ jsx28(Icon, { job: "more", size: "md" }) }),
            menu.marked && /* @__PURE__ */ jsx28("span", { className: "ad-page-header__mark", "aria-hidden": "true" }),
            /* @__PURE__ */ jsx28(Menu, { open: menuOpen, onClose: () => setMenuOpen(false), anchor: menuAt, ariaLabel: menu.label ?? "More", items: menu.items })
          ] })
        ] }),
        gear && /* @__PURE__ */ jsx28(ShowOptionsGear, { ...gear })
      ] })
    ] })
  ] });
}
function Tabs({ tabs, value, onChange, ariaLabel, numbered = true, panelId, className }) {
  const list = useRef15(null);
  const base = useId9();
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
  return /* @__PURE__ */ jsx28("div", { ref: list, role: "tablist", "aria-label": ariaLabel, onKeyDown: onKeyDown2, className: cx("ad-tabs", className), children: tabs.map((t, i) => /* @__PURE__ */ jsxs26("button", { type: "button", role: "tab", id: `${base}-${t.id}`, "aria-selected": t.id === value, "aria-controls": panelId?.(t.id), tabIndex: t.id === value ? 0 : -1, onClick: () => onChange(t.id), className: "ad-tab", children: [
    numbered && /* @__PURE__ */ jsx28("span", { className: "ad-tab__numeral", children: String(i + 1).padStart(2, "0") }),
    t.label
  ] }, t.id)) });
}

// src/components/Toolbar/Toolbar.tsx
import { forwardRef as forwardRef8, useRef as useRef18, useState as useState17 } from "react";

// src/components/Writing/TokenInput.tsx
import { useEffect as useEffect10, useLayoutEffect as useLayoutEffect3, useRef as useRef16, useState as useState16 } from "react";
import { jsx as jsx29, jsxs as jsxs27 } from "react/jsx-runtime";
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
      if (DEPTS.has(dept)) icon = /* @__PURE__ */ jsx29(Icon, { job: `dept-${dept}` });
    } else if (CHIP[t.kind]) icon = /* @__PURE__ */ jsx29(Icon, { job: CHIP[t.kind] });
    return { start: t.start, end: t.end, label: t.label, resolved, icon };
  });
}
var useIso = typeof window === "undefined" ? useEffect10 : useLayoutEffect3;
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
  const box = useRef16(null);
  const caret = useRef16(null);
  const blurred = useRef16(false);
  const composing = useRef16(false);
  const justComposed = useRef16(false);
  const [moved, setMoved] = useState16(0);
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
      const live = at != null && at >= t.start && at <= t.end;
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
  return /* @__PURE__ */ jsxs27("div", { className: cx("ad-token-input", `ad-token-input--${kind}`, className), children: [
    /* @__PURE__ */ jsxs27("div", { className: "ad-token-input__field", onClick: (e) => {
      if (e.target === e.currentTarget) box.current?.focus();
    }, children: [
      lead && /* @__PURE__ */ jsx29("span", { className: "ad-token-input__lead", children: lead }),
      /* @__PURE__ */ jsx29(
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
    showResolved && tokens.length > 0 && /* @__PURE__ */ jsx29("div", { className: "ad-token-input__resolved", role: "group", "aria-label": resolvedLabel, children: tokens.map((t, i) => /* @__PURE__ */ jsx29(
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

// src/components/Writing/Writing.tsx
import { forwardRef as forwardRef7, useEffect as useEffect11, useRef as useRef17 } from "react";
import { jsx as jsx30, jsxs as jsxs28 } from "react/jsx-runtime";
function NoteBox({ heading = "Notes", className, value, ...rest }) {
  const ref = useRef17(null);
  useEffect11(() => {
    const el = ref.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = `${el.scrollHeight}px`;
    }
  }, [value]);
  return /* @__PURE__ */ jsxs28("div", { className: cx("ad-note", className), children: [
    /* @__PURE__ */ jsx30("h3", { className: "ad-note-label", children: heading }),
    /* @__PURE__ */ jsx30("textarea", { ref, rows: 2, ...rest, value, "aria-label": typeof heading === "string" ? heading : rest["aria-label"], className: "ad-note-box" })
  ] });
}
function ActivityThread({ events, ariaLabel = "Activity" }) {
  return /* @__PURE__ */ jsx30("ol", { className: "ad-thread", "aria-label": ariaLabel, children: events.map((e) => /* @__PURE__ */ jsxs28("li", { className: "ad-thread__event", children: [
    /* @__PURE__ */ jsx30("span", { className: "ad-thread__date", children: e.date }),
    /* @__PURE__ */ jsx30("span", { className: "ad-thread__sentence", children: e.sentence }),
    /* @__PURE__ */ jsx30("span", { className: "ad-thread__time", children: e.time })
  ] }, e.id)) });
}
function RuleBuilder({ match, onMatch, rules, onChange, fields, operators, renderValue, newRule, labels: l = {} }) {
  const L = { match: "Match", matchAll: "all", matchAny: "any", ofTheseRules: "of these rules", addRule: "Add rule", removeRule: "Remove rule", field: "Field", operator: "Condition", ...l };
  const set = (id, patch) => onChange(rules.map((r) => r.id === id ? { ...r, ...patch } : r));
  return /* @__PURE__ */ jsxs28("div", { className: "ad-rules", children: [
    /* @__PURE__ */ jsxs28("div", { className: "ad-rules__match", children: [
      L.match,
      /* @__PURE__ */ jsx30(Select, { "aria-label": L.match, value: match, onChange: (e) => onMatch(e.target.value), options: [{ value: "all", label: L.matchAll }, { value: "any", label: L.matchAny }] }),
      L.ofTheseRules
    ] }),
    rules.map((r) => /* @__PURE__ */ jsxs28("div", { className: "ad-rules__row", children: [
      /* @__PURE__ */ jsx30(Select, { "aria-label": L.field, value: r.field, onChange: (e) => set(r.id, { field: e.target.value }), options: fields }),
      /* @__PURE__ */ jsx30(Select, { "aria-label": L.operator, value: r.operator, onChange: (e) => set(r.id, { operator: e.target.value }), options: operators(r.field) }),
      /* @__PURE__ */ jsx30("span", { className: "ad-rules__value", children: renderValue(r, (value) => set(r.id, { value })) }),
      /* @__PURE__ */ jsx30(ButtonSizeScope, { size: "row", children: /* @__PURE__ */ jsx30(IconButton, { label: L.removeRule, className: "ad-rules__remove", onClick: () => onChange(rules.filter((x) => x.id !== r.id)), children: /* @__PURE__ */ jsx30(Icon, { name: "x", size: "sm" }) }) })
    ] }, r.id)),
    /* @__PURE__ */ jsx30("div", { children: /* @__PURE__ */ jsx30(ButtonSizeScope, { size: "bar", children: /* @__PURE__ */ jsx30(Button, { icon: /* @__PURE__ */ jsx30(Icon, { name: "plus", size: "sm" }), onClick: () => onChange([...rules, newRule()]), children: L.addRule }) }) })
  ] });
}
var RuleValue = forwardRef7(function RuleValue2({ icon, end, mono, className, type = "button", children, ...rest }, ref) {
  return /* @__PURE__ */ jsxs28("button", { ref, type, ...rest, className: cx("ad-rule-value", mono && "ad-rule-value--mono", className), children: [
    icon != null && /* @__PURE__ */ jsx30("span", { className: "ad-rule-value__icon", "aria-hidden": "true", children: icon }),
    /* @__PURE__ */ jsx30("span", { className: "ad-rule-value__words", children }),
    /* @__PURE__ */ jsx30("span", { className: "ad-rule-value__end", "aria-hidden": "true", children: end ?? /* @__PURE__ */ jsx30(Icon, { name: "caret-down", size: "sm" }) })
  ] });
});

// src/components/Toolbar/Toolbar.tsx
import { jsx as jsx31, jsxs as jsxs29 } from "react/jsx-runtime";
function Toolbar({ children, end, ariaLabel, className }) {
  return /* @__PURE__ */ jsx31("div", { className: cx("ad-toolbar", className), role: "group", "aria-label": ariaLabel, children: /* @__PURE__ */ jsxs29(ButtonSizeScope, { size: "bar", children: [
    children,
    end && /* @__PURE__ */ jsx31("div", { className: "ad-toolbar__end", children: end })
  ] }) });
}
var ViewButton = forwardRef8(function ViewButton2({ label = "View", open, opens, onClick }, ref) {
  return /* @__PURE__ */ jsxs29(
    Button,
    {
      ref,
      icon: /* @__PURE__ */ jsx31(Icon, { name: "binoculars" }),
      active: open,
      "aria-expanded": onClick ? !!open : void 0,
      "aria-haspopup": onClick ? opens ?? "dialog" : void 0,
      onClick,
      children: [
        label,
        /* @__PURE__ */ jsx31(Icon, { name: "caret-down", size: "sm" })
      ]
    }
  );
});
function ToolbarSeparator() {
  return /* @__PURE__ */ jsx31("span", { className: "ad-toolbar__separator", role: "separator", "aria-orientation": "vertical" });
}
function ViewPopover({ open, onClose, anchor, builtInViews = [], savedViews, currentView, onPickView, onStarView, viewActions, onSaveView, saveScopes, query, rules, groupBy, sortBy, show, labels: l = {} }) {
  const L = { show: "Show", view: "View", builtInViews: "Views", savedViews: "Saved views", saveView: "Save this view\u2026", viewName: "View name", save: "Save", cancel: "Cancel", star: "Star", unstar: "Unstar", more: "More", filter: "Filter", groupBy: "Group by", sortBy: "Sort by", ascending: "Ascending", descending: "Descending", ...l };
  const SAVE = "__save";
  const [naming, setNaming] = useState17(false);
  const [name, setName] = useState17("");
  const [scope, setScope] = useState17(saveScopes?.[0]?.value);
  const [menuFor, setMenuFor] = useState17(null);
  const menuAnchor = useRef18(null);
  const viewsShown = builtInViews.length > 0 || savedViews != null;
  const views = [
    ...builtInViews.map((v) => ({ id: v.id, label: String(v.label), group: savedViews ? L.builtInViews : void 0 })),
    ...(savedViews ?? []).map((v) => ({
      id: v.id,
      label: String(v.label),
      group: builtInViews.length ? L.savedViews : void 0,
      lead: onStarView ? /* @__PURE__ */ jsx31(IconButton, { label: v.starred === false ? L.star : L.unstar, "aria-pressed": v.starred !== false, onClick: (e) => {
        e.stopPropagation();
        onStarView(v.id, v.starred === false);
      }, children: /* @__PURE__ */ jsx31(Icon, { job: "star", fill: v.starred !== false }) }) : /* @__PURE__ */ jsx31(Icon, { job: "star", fill: v.starred !== false }),
      hint: viewActions ? /* @__PURE__ */ jsx31(IconButton, { label: `${L.more}: ${v.label}`, onClick: (e) => {
        e.stopPropagation();
        menuAnchor.current = e.currentTarget;
        setMenuFor(v);
      }, children: /* @__PURE__ */ jsx31(Icon, { job: "more" }) }) : void 0
    })),
    ...savedViews && onSaveView ? [{ id: SAVE, label: L.saveView, lead: /* @__PURE__ */ jsx31(Icon, { job: "plus" }) }] : []
  ];
  const finishSave = () => {
    if (!name.trim() || !onSaveView) return;
    onSaveView(name.trim(), scope);
    setNaming(false);
    setName("");
  };
  return /* @__PURE__ */ jsxs29(Popover, { open, onClose, anchor, ariaLabel: L.view, children: [
    viewsShown && /* @__PURE__ */ jsxs29(PopoverSection, { label: savedViews && !builtInViews.length ? L.savedViews : L.builtInViews, children: [
      /* @__PURE__ */ jsx31(
        PickList,
        {
          noSearch: true,
          searchLabel: L.savedViews,
          value: currentView ?? null,
          options: views,
          onPick: (id) => id === SAVE ? setNaming(true) : onPickView?.(id)
        }
      ),
      naming && /* @__PURE__ */ jsxs29("div", { className: "ad-view-save", children: [
        /* @__PURE__ */ jsx31(TextField, { autoFocus: true, "aria-label": L.viewName, placeholder: L.viewName, value: name, onChange: (e) => setName(e.target.value), onKeyDown: (e) => {
          if (e.key === "Enter") finishSave();
          if (e.key === "Escape") {
            e.stopPropagation();
            setNaming(false);
          }
        } }),
        saveScopes && /* @__PURE__ */ jsx31(Select, { "aria-label": L.view, value: scope, onChange: (e) => setScope(e.target.value), options: saveScopes }),
        /* @__PURE__ */ jsxs29(ButtonSizeScope, { size: "row", children: [
          /* @__PURE__ */ jsx31(Button, { onClick: () => setNaming(false), children: L.cancel }),
          /* @__PURE__ */ jsx31(Button, { variant: "main", disabled: !name.trim(), onClick: finishSave, children: L.save })
        ] })
      ] }),
      menuFor && viewActions && /* @__PURE__ */ jsx31(Menu, { open: true, onClose: () => setMenuFor(null), anchor: menuAnchor, ariaLabel: String(menuFor.label), items: viewActions(menuFor) })
    ] }),
    query && /* @__PURE__ */ jsxs29(PopoverSection, { label: L.filter, children: [
      /* @__PURE__ */ jsx31(TokenInput, { read: { kind: "query", vocabulary: query.vocabulary }, label: L.filter, value: query.value, onChange: query.onChange, showResolved: false }),
      rules && /* @__PURE__ */ jsx31(RuleBuilder, { ...rules })
    ] }),
    groupBy && /* @__PURE__ */ jsx31(PopoverSection, { label: L.groupBy, children: /* @__PURE__ */ jsx31(Select, { "aria-label": L.groupBy, value: groupBy.value, onChange: (e) => groupBy.onChange(e.target.value), options: groupBy.options }) }),
    sortBy && /* @__PURE__ */ jsx31(PopoverSection, { label: L.sortBy, children: /* @__PURE__ */ jsxs29("div", { className: "ad-view-sort", children: [
      /* @__PURE__ */ jsx31(Select, { "aria-label": L.sortBy, value: sortBy.value, onChange: (e) => sortBy.onChange(e.target.value), options: sortBy.options }),
      sortBy.direction && /* @__PURE__ */ jsx31(ButtonSizeScope, { size: "row", children: /* @__PURE__ */ jsx31(
        IconButton,
        {
          label: sortBy.direction.value === "ascending" ? L.ascending : L.descending,
          onClick: () => sortBy.direction.onChange(sortBy.direction.value === "ascending" ? "descending" : "ascending"),
          children: /* @__PURE__ */ jsx31(Icon, { job: sortBy.direction.value === "ascending" ? "arrow-up" : "arrow-down" })
        }
      ) })
    ] }) }),
    show && show.length > 0 && /* @__PURE__ */ jsx31(PopoverSection, { label: L.show, children: show.map((s) => /* @__PURE__ */ jsx31(FieldRow, { label: s.label, children: s.kind === "switch" ? /* @__PURE__ */ jsx31(Switch, { checked: s.on, onChange: s.onChange, "aria-label": s.label }) : /* @__PURE__ */ jsx31(Select, { "aria-label": s.label, value: s.value, onChange: (e) => s.onChange(e.target.value), options: s.options }) }, s.id)) })
  ] });
}

// src/components/ViewSwitch/ViewSwitch.tsx
import { useRef as useRef19 } from "react";
import { jsx as jsx32 } from "react/jsx-runtime";
function ViewSwitch({ options, value, onChange, ariaLabel, className }) {
  const box = useRef19(null);
  const at = options.findIndex((o) => o.value === value);
  const onKeyDown2 = (e) => {
    const n = e.key === "ArrowRight" || e.key === "ArrowDown" ? (at + 1) % options.length : e.key === "ArrowLeft" || e.key === "ArrowUp" ? (at - 1 + options.length) % options.length : e.key === "Home" ? 0 : e.key === "End" ? options.length - 1 : null;
    if (n == null) return;
    e.preventDefault();
    onChange(options[n].value);
    requestAnimationFrame(() => box.current?.querySelectorAll('[role="radio"]')[n]?.focus());
  };
  return /* @__PURE__ */ jsx32("div", { ref: box, role: "radiogroup", "aria-label": ariaLabel, onKeyDown: onKeyDown2, className: cx("ad-view-switch", className), children: options.map((o) => /* @__PURE__ */ jsx32("button", { type: "button", role: "radio", "aria-checked": o.value === value, "aria-label": o.label, title: o.label, tabIndex: o.value === value ? 0 : -1, onClick: () => onChange(o.value), className: "ad-view-switch__option", children: o.icon }, o.value)) });
}

// src/components/Warnings/Warnings.tsx
import { forwardRef as forwardRef9, useId as useId10, useState as useState18 } from "react";
import { Fragment as Fragment9, jsx as jsx33, jsxs as jsxs30 } from "react/jsx-runtime";
function AlertBar({ alerts, label = "Alerts", snoozeLabel = "Snooze", pillLabel = (p, n) => `${n} priority ${p}`, priorityLabel = (p) => `Priority ${p}`, defaultOpen = false, open, onOpenChange, className }) {
  const [own, setOwn] = useState18(defaultOpen);
  const isOpen = open ?? own;
  const listId = useId10();
  if (!alerts.length) return null;
  const counts = [1, 2, 3, 4].map((p) => [p, alerts.filter((a) => a.priority === p).length]).filter(([, n]) => n > 0);
  const toggle = () => {
    setOwn(!isOpen);
    onOpenChange?.(!isOpen);
  };
  return /* @__PURE__ */ jsxs30("section", { className: cx("ad-alert-bar", className), "aria-label": label, children: [
    /* @__PURE__ */ jsxs30("button", { type: "button", className: "ad-alert-bar__head", "aria-expanded": isOpen, "aria-controls": listId, onClick: toggle, children: [
      /* @__PURE__ */ jsx33(Icon, { name: isOpen ? "caret-down" : "caret-right", size: "sm", className: "ad-alert-bar__caret" }),
      /* @__PURE__ */ jsx33("span", { className: "ad-alert-bar__word", children: label }),
      counts.map(([p, n]) => /* @__PURE__ */ jsx33(CountPill, { priority: p, count: n, label: pillLabel(p, n) }, p))
    ] }),
    /* @__PURE__ */ jsx33("div", { id: listId, hidden: !isOpen, role: "list", children: alerts.map((a) => /* @__PURE__ */ jsxs30("div", { role: "listitem", className: "ad-alert", children: [
      /* @__PURE__ */ jsx33("span", { className: cx("ad-alert__ring", `ad-alert__ring--p${a.priority}`), role: "img", "aria-label": priorityLabel(a.priority) }),
      /* @__PURE__ */ jsx33("span", { className: "ad-alert__sentence", children: a.sentence }),
      a.number && /* @__PURE__ */ jsx33("span", { className: "ad-alert__number", children: a.number }),
      /* @__PURE__ */ jsx33("span", { className: "ad-alert__actions", children: /* @__PURE__ */ jsxs30(ButtonSizeScope, { size: "row", children: [
        a.action && /* @__PURE__ */ jsx33(Button, { onClick: a.action.onSelect, children: a.action.label }),
        a.onSnooze && /* @__PURE__ */ jsx33(Button, { onClick: a.onSnooze, children: snoozeLabel })
      ] }) })
    ] }, a.id)) })
  ] });
}
function CountPill({ priority, count, label }) {
  return /* @__PURE__ */ jsxs30("span", { className: cx("ad-count-pill", `ad-count-pill--p${priority}`), children: [
    /* @__PURE__ */ jsxs30("span", { "aria-hidden": label ? true : void 0, children: [
      "P",
      priority,
      " ",
      count
    ] }),
    label && /* @__PURE__ */ jsx33("span", { className: "ad-sr", children: label })
  ] });
}
var Bell = forwardRef9(function Bell2({ unread, label = "Notifications", unreadLabel = "unread", className, ...rest }, ref) {
  return /* @__PURE__ */ jsx33("button", { ref, type: "button", ...rest, "aria-label": unread ? `${label}, ${unreadLabel}` : label, title: label, className: cx("ad-icon-button", "ad-icon-button--md", "ad-bell", className), "data-unread": unread || void 0, children: /* @__PURE__ */ jsx33(Icon, { name: "bell" }) });
});
function NotificationList({ days, unreadLabel = "Unread" }) {
  return /* @__PURE__ */ jsx33("div", { className: "ad-notifications", children: days.map((d) => /* @__PURE__ */ jsxs30("section", { className: "ad-notifications__day", children: [
    /* @__PURE__ */ jsxs30("h3", { className: "ad-notifications__heading", children: [
      /* @__PURE__ */ jsx33("span", { className: "ad-notifications__name", children: d.name }),
      /* @__PURE__ */ jsx33("span", { className: "ad-notifications__date", children: d.date })
    ] }),
    d.items.map((n) => {
      const body = /* @__PURE__ */ jsxs30(Fragment9, { children: [
        n.unread ? /* @__PURE__ */ jsx33("span", { className: "ad-notification__unread", role: "img", "aria-label": unreadLabel }) : /* @__PURE__ */ jsx33("span", { className: "ad-notification__read" }),
        n.face && /* @__PURE__ */ jsx33("span", { className: "ad-notification__face", children: n.face }),
        /* @__PURE__ */ jsx33("span", { className: "ad-notification__sentence", children: n.sentence }),
        /* @__PURE__ */ jsx33("span", { className: "ad-notification__time", children: n.time })
      ] });
      return n.onOpen ? /* @__PURE__ */ jsx33("button", { type: "button", className: "ad-notification", onClick: n.onOpen, children: body }, n.id) : /* @__PURE__ */ jsx33("div", { className: "ad-notification", children: body }, n.id);
    })
  ] }, d.id)) });
}

// src/components/Board/Board.tsx
import { jsx as jsx34, jsxs as jsxs31 } from "react/jsx-runtime";
function Board({ children, ariaLabel, className }) {
  return /* @__PURE__ */ jsx34("div", { className: cx("ad-board", className), role: "region", "aria-label": ariaLabel, children });
}
function BoardLane({ title, mark, onTitle, titleLabel, children, className }) {
  return /* @__PURE__ */ jsxs31("section", { className: cx("ad-lane", className), children: [
    /* @__PURE__ */ jsxs31("h3", { className: "ad-lane__heading", children: [
      mark,
      onTitle ? /* @__PURE__ */ jsx34("button", { type: "button", className: "ad-lane__name ad-lane__name--press", "aria-label": titleLabel, onClick: onTitle, children: title }) : /* @__PURE__ */ jsx34("span", { className: "ad-lane__name", children: title })
    ] }),
    /* @__PURE__ */ jsx34("div", { className: "ad-lane__cards", children })
  ] });
}
function BoardCardMeta({ date, icon, face, code, marks }) {
  return /* @__PURE__ */ jsxs31("div", { className: "ad-lane__card-meta", children: [
    date,
    icon && /* @__PURE__ */ jsx34("span", { "aria-hidden": "true", className: "ad-lane__card-icon", children: icon }),
    marks && /* @__PURE__ */ jsx34("span", { className: "ad-lane__card-marks", children: marks }),
    code && /* @__PURE__ */ jsx34("span", { className: "ad-lane__card-code", children: code }),
    face && /* @__PURE__ */ jsx34("span", { className: "ad-lane__card-face", children: face })
  ] });
}
function DropLine() {
  return /* @__PURE__ */ jsx34("div", { className: "ad-drop-line", "aria-hidden": "true" });
}

// src/components/Table/Table.tsx
import { jsx as jsx35, jsxs as jsxs32 } from "react/jsx-runtime";
var Arrow = ({ up }) => /* @__PURE__ */ jsx35(Icon, { name: up ? "arrow-up" : "arrow-down", size: "sm", className: "ad-table__arrow" });
function Table({ columns, rows, rowId, caption, sort, onSort, picked, onPickedChange, onPickAllChange, pickLabel, pickAllLabel = "Pick all", onOpen, rowProps, group, depth, className }) {
  const span = columns.length + (onPickedChange ? 1 : 0);
  let lastGroup;
  const all = rows.length > 0 && rows.every((r) => picked?.has(rowId(r)));
  return /* @__PURE__ */ jsx35("div", { className: cx("ad-table-wrap", className), children: /* @__PURE__ */ jsxs32("table", { className: "ad-table", children: [
    /* @__PURE__ */ jsx35("caption", { className: "ad-sr", children: caption }),
    /* @__PURE__ */ jsx35("thead", { children: /* @__PURE__ */ jsxs32("tr", { children: [
      onPickedChange && /* @__PURE__ */ jsx35("th", { scope: "col", className: "ad-table__pick", children: /* @__PURE__ */ jsx35(Checkbox, { "aria-label": pickAllLabel, checked: all, onChange: (on) => onPickAllChange?.(on) }) }),
      columns.map((c) => {
        const sorted = sort?.id === c.id ? sort.direction : void 0;
        return /* @__PURE__ */ jsx35("th", { scope: "col", "aria-sort": sorted ?? (c.sortable ? "none" : void 0), className: cx(c.numeric && "ad-num", c.frozen && `ad-table__frozen--${c.frozen}`), style: c.width ? { width: c.width } : void 0, children: c.sortable && onSort ? /* @__PURE__ */ jsxs32("button", { type: "button", className: "ad-table__sort", onClick: () => onSort(c.id), children: [
          c.label,
          sorted && /* @__PURE__ */ jsx35(Arrow, { up: sorted === "ascending" })
        ] }) : c.label }, c.id);
      })
    ] }) }),
    /* @__PURE__ */ jsx35("tbody", { children: rows.map((r) => {
      const id = rowId(r);
      const on = picked?.has(id);
      const g = group?.(r);
      const head = g != null && g !== lastGroup ? g : null;
      lastGroup = g;
      const d = depth?.(r) ?? 0;
      const { className: _c, style: _s, ...hooks } = rowProps?.(r) ?? {};
      const tr = /* @__PURE__ */ jsxs32("tr", { ...hooks, "data-picked": on || void 0, "data-depth": d || void 0, className: cx(onOpen && "ad-table__row--opens"), onClick: (e) => {
        hooks.onClick?.(e);
        if (onOpen && !e.target.closest("input,button,a")) onOpen(r);
      }, children: [
        onPickedChange && /* @__PURE__ */ jsx35("td", { className: "ad-table__pick", children: /* @__PURE__ */ jsx35(Checkbox, { "aria-label": pickLabel?.(r) ?? id, checked: !!on, onChange: (v) => onPickedChange(id, v) }) }),
        columns.map((c, i) => {
          const frozen = c.frozen && `ad-table__frozen--${c.frozen}`;
          if (i > 0) return /* @__PURE__ */ jsx35("td", { className: cx(c.numeric && "ad-num", c.mono && "ad-mono", frozen), children: c.cell(r) }, c.id);
          const words = onOpen ? /* @__PURE__ */ jsx35("button", { type: "button", className: "ad-table__open", onClick: () => onOpen(r), children: c.cell(r) }) : c.cell(r);
          const meta = c.meta?.(r);
          return /* @__PURE__ */ jsxs32("th", { scope: "row", className: cx("ad-table__name", frozen, meta != null && "ad-table__name--two"), style: d ? { ["--ad-depth"]: d } : void 0, children: [
            d > 0 && /* @__PURE__ */ jsx35("span", { className: "ad-table__elbow", "aria-hidden": "true" }),
            meta != null ? /* @__PURE__ */ jsxs32("span", { className: "ad-table__words", children: [
              words,
              /* @__PURE__ */ jsx35("span", { className: "ad-table__meta", children: meta })
            ] }) : words
          ] }, c.id);
        })
      ] }, id);
      return head != null ? [/* @__PURE__ */ jsx35("tr", { className: "ad-table__group", children: /* @__PURE__ */ jsx35("th", { scope: "colgroup", colSpan: span, children: head }) }, `group-${id}`), tr] : tr;
    }) })
  ] }) });
}
function SelectionBar({ count, countLabel = (n) => `${n} selected`, actions, className }) {
  const ordered2 = [...actions.filter((a) => !a.danger), ...actions.filter((a) => a.danger)];
  const children = ordered2.map((a) => /* @__PURE__ */ jsx35(Button, { icon: a.icon, danger: a.danger, onClick: (e) => a.onSelect(e.currentTarget), children: a.label }, a.id));
  if (count <= 0) return null;
  return /* @__PURE__ */ jsx35(Portal, { children: /* @__PURE__ */ jsxs32("div", { className: cx("ad-float", "ad-selection-bar", className), role: "toolbar", "aria-label": countLabel(count), children: [
    /* @__PURE__ */ jsx35("span", { className: "ad-selection-bar__count", "aria-live": "polite", children: countLabel(count) }),
    /* @__PURE__ */ jsx35(ButtonSizeScope, { size: "bar", children })
  ] }) });
}

// src/components/Timeline/Timeline.tsx
import { jsx as jsx36, jsxs as jsxs33 } from "react/jsx-runtime";
function Bar({ label, unconfirmed, deal, backup, color, selected, startLabel, endLabel, lead, children, thin, labelOutside, onOpen, className, style }) {
  const Tag2 = onOpen ? "button" : "div";
  const hue = useHue(color);
  const name = /* @__PURE__ */ jsx36("span", { className: "ad-bar__name", children: label });
  return /* @__PURE__ */ jsxs33(
    Tag2,
    {
      type: onOpen ? "button" : void 0,
      onClick: onOpen,
      "aria-current": selected || void 0,
      className: cx("ad-bar", unconfirmed && "ad-bar--unconfirmed", deal && "ad-bar--deal", backup && "ad-bar--backup", thin && "ad-bar--thin", labelOutside && "ad-bar--label-outside", selected && "ad-bar--selected", className),
      style: { ...style, ["--ad-bar"]: hue },
      children: [
        startLabel && /* @__PURE__ */ jsx36("span", { className: "ad-bar__end ad-bar__end--start", children: startLabel }),
        /* @__PURE__ */ jsxs33("span", { className: "ad-bar__label", children: [
          lead,
          !labelOutside && name
        ] }),
        children,
        labelOutside && /* @__PURE__ */ jsx36("span", { className: "ad-bar__outside", children: name }),
        endLabel && /* @__PURE__ */ jsx36("span", { className: "ad-bar__end ad-bar__end--end", children: endLabel })
      ]
    }
  );
}
function BarMarker({ kind, at, due, today, done, labels: l = {} }) {
  const late = kind === "review" && !done && due instanceof Date && today instanceof Date && daysBetween(today, due) < 0;
  const word = kind === "review" ? l.review ?? "Review date" : l.deadline ?? "Deadline";
  const label = late ? `${word} ${l.passed ?? "passed"}` : word;
  return /* @__PURE__ */ jsx36("span", { className: cx("ad-bar-marker", late && "ad-bar-marker--late"), style: { left: `${Math.max(0, Math.min(1, at)) * 100}%` }, role: "img", "aria-label": label, title: label, children: /* @__PURE__ */ jsx36(Icon, { name: kind === "review" ? "eye" : "paper-plane-tilt", fill: true }) });
}
function DeliverableBar({ parts, ...props }) {
  if (!parts) return /* @__PURE__ */ jsx36(DeliverableRow, { ...props });
  const { expanded, label } = props;
  const clamp = (n) => Math.max(0, Math.min(1, Number.isFinite(n) ? n : 0));
  return /* @__PURE__ */ jsxs33("div", { className: "ad-deliverable-group", children: [
    /* @__PURE__ */ jsx36(DeliverableRow, { ...props, expandable: true }),
    expanded && /* @__PURE__ */ jsx36("div", { className: "ad-deliverable__parts", role: "list", "aria-label": typeof label === "string" ? label : void 0, children: parts.map((p) => {
      const from = clamp(p.start);
      const to = Math.max(from, clamp(p.end));
      return /* @__PURE__ */ jsx36("div", { role: "listitem", className: "ad-deliverable__part", children: /* @__PURE__ */ jsx36("div", { className: "ad-deliverable__part-span", style: { marginLeft: `${from * 100}%`, width: `${(to - from) * 100}%` }, children: /* @__PURE__ */ jsx36(Bar, { thin: true, label: String(p.label), children: p.markers.map((m, i) => /* @__PURE__ */ jsx36(BarMarker, { ...m }, i)) }) }) }, p.id);
    }) })
  ] });
}
function DeliverableRow({ status, statusLabel, markers, expandable, expanded, onToggle, toggleLabel = "Show parts", className, ...bar }) {
  return /* @__PURE__ */ jsxs33("div", { className: cx("ad-deliverable", expandable && "ad-deliverable--expandable", className), children: [
    expandable && /* @__PURE__ */ jsx36("button", { type: "button", className: "ad-deliverable__caret", "aria-expanded": !!expanded, "aria-label": toggleLabel, onClick: onToggle, children: /* @__PURE__ */ jsx36(Icon, { name: "caret-right", size: "sm", className: cx("ad-deliverable__chevron", expanded && "ad-is-open") }) }),
    /* @__PURE__ */ jsx36(Bar, { ...bar, lead: /* @__PURE__ */ jsx36("span", { role: "img", "aria-label": statusLabel, className: "ad-deliverable__status", children: /* @__PURE__ */ jsx36(Dot, { tone: status }) }), children: markers.map((m, i) => /* @__PURE__ */ jsx36(BarMarker, { ...m }, i)) })
  ] });
}
function MarkerKey({ review = "review date \xB7 internal", deadline = "deadline \xB7 sent out" }) {
  return /* @__PURE__ */ jsxs33("p", { className: "ad-marker-key", children: [
    /* @__PURE__ */ jsxs33("span", { className: "ad-marker-key__item", children: [
      /* @__PURE__ */ jsx36(Icon, { name: "eye", fill: true }),
      " ",
      review
    ] }),
    /* @__PURE__ */ jsxs33("span", { className: "ad-marker-key__item", children: [
      /* @__PURE__ */ jsx36(Icon, { name: "paper-plane-tilt", fill: true }),
      " ",
      deadline
    ] })
  ] });
}
function Milestone({ label, past, unconfirmed, opening, ariaLabel, onOpen }) {
  const Tag2 = onOpen ? "button" : "span";
  return /* @__PURE__ */ jsxs33(Tag2, { type: onOpen ? "button" : void 0, onClick: onOpen, "aria-label": ariaLabel, className: cx("ad-milestone", past && "ad-milestone--past", unconfirmed && "ad-milestone--unconfirmed"), children: [
    opening ? /* @__PURE__ */ jsx36("span", { className: "ad-milestone__burst", "aria-hidden": "true", children: "\u2733" }) : /* @__PURE__ */ jsx36("span", { className: "ad-milestone__diamond", "aria-hidden": "true" }),
    /* @__PURE__ */ jsx36("span", { className: "ad-milestone__label", children: label })
  ] });
}
function TodayLine({ cap = true, word, style, label = "Today" }) {
  return /* @__PURE__ */ jsxs33("div", { className: "ad-today", style, role: "img", "aria-label": label, children: [
    word && /* @__PURE__ */ jsx36("span", { className: "ad-today__word", "aria-hidden": "true", children: word }),
    cap && /* @__PURE__ */ jsx36(RegMark, {})
  ] });
}
function RegMark() {
  return /* @__PURE__ */ jsxs33("svg", { className: "ad-regmark", viewBox: "0 0 16 16", "aria-hidden": "true", children: [
    /* @__PURE__ */ jsx36("circle", { cx: "8", cy: "8", r: "5", fill: "none", stroke: "currentColor", strokeWidth: "1" }),
    /* @__PURE__ */ jsx36("path", { d: "M8 0v16M0 8h16", stroke: "currentColor", strokeWidth: "1" })
  ] });
}
function PastHatch({ style }) {
  return /* @__PURE__ */ jsx36("div", { className: "ad-past", style, "aria-hidden": "true" });
}
function Clash({ children, className }) {
  return /* @__PURE__ */ jsx36("div", { className: cx("ad-clash", className), children });
}
function OffscreenStart({ date }) {
  return /* @__PURE__ */ jsxs33("span", { className: "ad-offscreen", children: [
    /* @__PURE__ */ jsx36("span", { "aria-hidden": "true", children: "<" }),
    " ",
    date
  ] });
}
function Legend({ items }) {
  return /* @__PURE__ */ jsxs33("p", { className: "ad-legend", children: [
    "[ ",
    items.join(" \xB7 "),
    " ]"
  ] });
}

// src/components/Timeline/Ruler.tsx
import { jsx as jsx37, jsxs as jsxs34 } from "react/jsx-runtime";
function Ruler({ start, days, dayWidth, locale = "en-US", end, className }) {
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
  return /* @__PURE__ */ jsxs34("div", { className: cx("ad-ruler", className), style: { width: days * dayWidth }, children: [
    /* @__PURE__ */ jsx37("div", { className: "ad-ruler__months", "aria-hidden": "true", children: months.map((m) => /* @__PURE__ */ jsx37("span", { className: "ad-ruler__month", style: { left: m.x }, children: m.label }, m.x)) }),
    /* @__PURE__ */ jsx37("div", { className: "ad-ruler__ticks", "aria-hidden": "true", children: ticks.map((t) => /* @__PURE__ */ jsx37("span", { className: cx("ad-ruler__tick", t.major && "ad-ruler__tick--major"), style: { left: t.x }, children: t.label && /* @__PURE__ */ jsx37("span", { className: "ad-ruler__day", children: t.label }) }, t.x)) }),
    end && /* @__PURE__ */ jsx37("div", { className: "ad-ruler__end", children: end })
  ] });
}
var ORDER = ["days", "weeks", "months", "quarters"];
var NAMES = { days: "Days", weeks: "Weeks", months: "Months", quarters: "Quarters", zoomIn: "Zoom in", zoomOut: "Zoom out", previous: "Earlier", today: "Today", next: "Later" };
function ZoomCluster({ zoom, onZoom, onPrevious, onToday, onNext, labels }) {
  const L = { ...NAMES, ...labels };
  const i = ORDER.indexOf(zoom);
  const btn = (label, glyph, on, disabled, today) => /* @__PURE__ */ jsx37("button", { type: "button", "aria-label": label, title: label, disabled, onClick: on, className: cx("ad-zoom__btn", today && "ad-zoom__btn--today"), children: /* @__PURE__ */ jsx37("span", { "aria-hidden": "true", children: glyph }) }, glyph);
  return /* @__PURE__ */ jsxs34("div", { className: "ad-zoom", role: "group", "aria-label": L[zoom], children: [
    /* @__PURE__ */ jsx37("span", { className: "ad-zoom__name", "aria-hidden": "true", children: L[zoom].toLowerCase() }),
    btn(`${L.zoomOut} (${L[ORDER[Math.min(i + 1, 3)]]})`, "\u2212", () => onZoom(ORDER[Math.min(i + 1, 3)]), i === 3),
    btn(L.previous, "\u2039", onPrevious),
    btn(L.today, "\u2022", onToday, false, true),
    btn(L.next, "\u203A", onNext),
    btn(`${L.zoomIn} (${L[ORDER[Math.max(i - 1, 0)]]})`, "+", () => onZoom(ORDER[Math.max(i - 1, 0)]), i === 0)
  ] });
}

// src/components/Calendar/Calendar.tsx
import { jsx as jsx38, jsxs as jsxs35 } from "react/jsx-runtime";
var diff = (a, b) => daysBetween(b, a);
function MonthCalendar({ month, items, today: todayIn, weekStart = 1, locale = "en-US", onOpen, className }) {
  const today = dayOf(todayIn);
  const hueOf = useHueOf();
  const shadeWeekends = useShow().weekendShading;
  const first = new Date(month.getFullYear(), month.getMonth(), 1);
  const start = weekStartOf(first, weekStart);
  const last = new Date(month.getFullYear(), month.getMonth() + 1, 0);
  const weeks = Math.ceil((diff(last, start) + 1) / 7);
  const dows = Array.from({ length: 7 }, (_, i) => addDays(start, i).toLocaleDateString(locale, { weekday: "short" }));
  const sorted = [...items].sort((a, b) => a.start.getTime() - b.start.getTime() || diff(b.end, b.start) - diff(a.end, a.start));
  return /* @__PURE__ */ jsxs35("section", { className: cx("ad-month", className), "aria-label": first.toLocaleDateString(locale, { month: "long", year: "numeric" }), children: [
    /* @__PURE__ */ jsx38("div", { className: "ad-month__dows", "aria-hidden": "true", children: dows.map((d, i) => /* @__PURE__ */ jsx38("span", { className: "ad-month__dow", children: d }, i)) }),
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
      return /* @__PURE__ */ jsxs35("div", { className: "ad-month__week", role: "group", style: { ["--ad-lanes"]: Math.max(1, lanes.length) }, "aria-label": `${ws.toLocaleDateString(locale, { month: "short", day: "numeric" })} \u2013 ${we.toLocaleDateString(locale, { month: "short", day: "numeric" })}`, children: [
        Array.from({ length: 7 }, (_2, i) => {
          const d = addDays(ws, i);
          const wk = d.getDay() === 0 || d.getDay() === 6;
          return /* @__PURE__ */ jsx38("div", { style: { gridColumn: i + 1 }, "aria-hidden": "true", className: "ad-month__cell", "data-outside": d.getMonth() !== first.getMonth() || void 0, "data-weekend": shadeWeekends && wk || void 0, children: /* @__PURE__ */ jsx38("span", { className: "ad-month__num", "data-today": diff(d, today) === 0 || void 0, children: d.getDate() }) }, i);
        }),
        placed.map(({ item, lane, from, to, cutStart, cutEnd }) => {
          const style = { gridColumn: `${from + 1} / ${to + 2}`, ["--ad-lane"]: lane, ["--ad-bar"]: hueOf(item.color) };
          const cls = cx("ad-month__bar", item.unconfirmed && "ad-month__bar--unconfirmed", cutStart && "ad-month__bar--cut-start", cutEnd && "ad-month__bar--cut-end");
          return onOpen ? /* @__PURE__ */ jsx38("button", { type: "button", className: cls, style, onClick: () => onOpen(item), children: /* @__PURE__ */ jsx38("span", { children: item.label }) }, item.id) : /* @__PURE__ */ jsx38("span", { className: cls, style, children: /* @__PURE__ */ jsx38("span", { children: item.label }) }, item.id);
        })
      ] }, w);
    })
  ] });
}
function Booking({ name, time, unconfirmed, color, style, onOpen }) {
  const Tag2 = onOpen ? "button" : "div";
  const hue = useHue(color);
  return /* @__PURE__ */ jsxs35(Tag2, { type: onOpen ? "button" : void 0, onClick: onOpen, className: cx("ad-booking", unconfirmed && "ad-booking--unconfirmed"), style: { ...style, ["--ad-bar"]: hue }, children: [
    /* @__PURE__ */ jsx38("span", { className: "ad-booking__name", children: name }),
    /* @__PURE__ */ jsx38("span", { className: "ad-booking__time", children: time })
  ] });
}
function NowMarker({ time, style }) {
  return /* @__PURE__ */ jsxs35("span", { className: "ad-now", style, children: [
    /* @__PURE__ */ jsx38("span", { className: "ad-now__time", children: time }),
    /* @__PURE__ */ jsx38("span", { className: "ad-now__dot", "aria-hidden": "true" })
  ] });
}
function WeekendShade({ children, className }) {
  const on = useShow().weekendShading;
  return /* @__PURE__ */ jsx38("div", { className: cx(on && "ad-weekend", className), children });
}
var clockHour = (h) => String((h + 11) % 12 + 1);
function TimeGrid({ startHour, endHour, bookings = [], columns, now, hourLabel = clockHour, ariaLabel, className }) {
  const hours = Math.max(1, endHour - startHour);
  const at = (h) => `calc(var(--ad-hour) * ${Math.max(0, Math.min(hours, h - startHour))})`;
  const cols = columns ?? [{ id: "day", label: "", bookings }];
  return /* @__PURE__ */ jsxs35("div", { className: cx("ad-time-grid", className), role: "group", "aria-label": ariaLabel, style: { ["--ad-hours"]: hours }, children: [
    /* @__PURE__ */ jsxs35("div", { className: "ad-time-grid__gutter", "aria-hidden": "true", children: [
      Array.from({ length: hours }, (_, i) => /* @__PURE__ */ jsx38("span", { className: "ad-time-grid__hour-label", style: { top: at(startHour + i) }, children: hourLabel(startHour + i) }, i)),
      now && /* @__PURE__ */ jsx38(NowMarker, { time: now.time, style: { position: "absolute", top: at(now.at), right: 0, transform: "translateY(-50%)" } })
    ] }),
    cols.map((c) => /* @__PURE__ */ jsxs35("div", { className: "ad-time-grid__column", role: "group", "aria-label": c.label || void 0, children: [
      c.label && /* @__PURE__ */ jsx38("span", { className: "ad-time-grid__day", children: c.label }),
      /* @__PURE__ */ jsxs35("div", { className: "ad-time-grid__body", children: [
        Array.from({ length: hours }, (_, i) => /* @__PURE__ */ jsx38("div", { className: "ad-time-grid__hour", "aria-hidden": "true" }, i)),
        c.bookings.map(({ id, start, end, ...b }) => /* @__PURE__ */ jsx38("div", { className: "ad-time-grid__slot", style: { top: at(start), height: `calc(${at(end)} - ${at(start)})` }, children: /* @__PURE__ */ jsx38(Booking, { ...b, style: { height: "100%" } }) }, id))
      ] })
    ] }, c.id))
  ] });
}

// src/components/Charts/Charts.tsx
import { Fragment as Fragment10, jsx as jsx39, jsxs as jsxs36 } from "react/jsx-runtime";
function AmountBars({ items, max, ariaLabel, className }) {
  const top = max ?? Math.max(1, ...items.map((i) => i.value));
  return /* @__PURE__ */ jsx39("div", { className: cx("ad-amounts", className), role: "list", "aria-label": ariaLabel, children: items.map((i) => /* @__PURE__ */ jsxs36("div", { className: "ad-amounts__row", role: "listitem", children: [
    /* @__PURE__ */ jsx39("span", { className: "ad-amounts__label", children: i.label }),
    /* @__PURE__ */ jsxs36("span", { className: "ad-amounts__track", children: [
      /* @__PURE__ */ jsx39("span", { className: "ad-amounts__bar", style: { width: `${Math.max(0, i.value / top) * 100}%` } }),
      /* @__PURE__ */ jsx39("span", { className: "ad-amounts__value", children: i.display })
    ] })
  ] }, i.id)) });
}
function BudgetBar({ fraction, figure, note = "worked", remainder, end, ariaLabel, className }) {
  const done = Math.max(0, Math.min(1, fraction));
  return /* @__PURE__ */ jsxs36("div", { className: cx("ad-budget", className), children: [
    /* @__PURE__ */ jsx39("div", { className: "ad-budget__figure", children: figure }),
    /* @__PURE__ */ jsx39("div", { className: "ad-progress", role: "meter", "aria-label": ariaLabel, "aria-valuemin": 0, "aria-valuemax": Math.max(100, Math.round(fraction * 100)), "aria-valuenow": Math.round(fraction * 100), children: /* @__PURE__ */ jsx39("span", { className: "ad-progress__done", style: { width: `${done * 100}%` } }) }),
    /* @__PURE__ */ jsxs36("div", { className: "ad-budget__foot", children: [
      /* @__PURE__ */ jsx39("span", { children: note }),
      /* @__PURE__ */ jsxs36("span", { children: [
        remainder,
        end && /* @__PURE__ */ jsxs36(Fragment10, { children: [
          " \xB7 ",
          end
        ] })
      ] })
    ] })
  ] });
}
function ProgressBar({ fraction, ariaLabel, thin }) {
  return /* @__PURE__ */ jsx39("div", { className: cx("ad-progress", thin && "ad-progress--thin"), role: "progressbar", "aria-label": ariaLabel, "aria-valuemin": 0, "aria-valuemax": 100, "aria-valuenow": Math.round(fraction * 100), children: /* @__PURE__ */ jsx39("span", { className: "ad-progress__done", style: { width: `${Math.max(0, Math.min(1, fraction)) * 100}%` } }) });
}
function OverTime({ periods, currentId, grid = [], ariaLabel, className }) {
  const top = Math.max(1, ...periods.map((p) => p.value), ...grid.map((g) => g.value));
  return /* @__PURE__ */ jsxs36("figure", { className: cx("ad-overtime", className), "aria-label": ariaLabel, children: [
    /* @__PURE__ */ jsxs36("div", { className: "ad-overtime__plot", children: [
      grid.map((g) => /* @__PURE__ */ jsx39("div", { className: "ad-overtime__grid", style: { bottom: `${g.value / top * 100}%` }, children: /* @__PURE__ */ jsx39("span", { children: g.display }) }, g.value)),
      /* @__PURE__ */ jsx39("div", { className: "ad-overtime__columns", role: "list", children: periods.map((p) => {
        const cur = p.id === currentId;
        return /* @__PURE__ */ jsx39("div", { className: "ad-overtime__slot", role: "listitem", "aria-label": `${p.label}: ${p.display}`, children: /* @__PURE__ */ jsx39("div", { className: cx("ad-overtime__column", cur && "ad-overtime__column--current"), style: { height: `${p.value / top * 100}%` }, children: cur && /* @__PURE__ */ jsx39("span", { className: "ad-overtime__cap", children: p.display }) }) }, p.id);
      }) })
    ] }),
    /* @__PURE__ */ jsxs36("div", { className: "ad-overtime__labels", "aria-hidden": "true", children: [
      /* @__PURE__ */ jsx39("span", { children: periods[0]?.label }),
      periods.length > 1 && /* @__PURE__ */ jsx39("span", { children: periods[periods.length - 1].label })
    ] })
  ] });
}
function Dial({ fraction, label, className }) {
  const r = 26;
  const c = 2 * Math.PI * r;
  const f = Math.max(0, Math.min(1, Number.isFinite(fraction) ? fraction : 0));
  const display = `${Math.round(f * 100)}%`;
  return /* @__PURE__ */ jsxs36("figure", { className: cx("ad-dial", className), children: [
    /* @__PURE__ */ jsxs36("div", { className: "ad-dial__face", role: "meter", "aria-valuemin": 0, "aria-valuemax": 100, "aria-valuenow": Math.round(f * 100), "aria-label": String(label), children: [
      /* @__PURE__ */ jsxs36("svg", { viewBox: "0 0 70 70", "aria-hidden": "true", children: [
        /* @__PURE__ */ jsx39("circle", { className: "ad-dial__track", cx: "35", cy: "35", r }),
        /* @__PURE__ */ jsx39("circle", { className: "ad-dial__arc", cx: "35", cy: "35", r, strokeDasharray: `${c * f} ${c}`, transform: "rotate(-90 35 35)" })
      ] }),
      /* @__PURE__ */ jsx39("span", { className: "ad-dial__value", children: display })
    ] }),
    /* @__PURE__ */ jsx39("figcaption", { className: "ad-dial__label", children: label })
  ] });
}
function Verdict({ word, sentence }) {
  return /* @__PURE__ */ jsxs36("div", { className: "ad-verdict", children: [
    /* @__PURE__ */ jsx39("p", { className: "ad-verdict__word", children: String(word).split(/\s+/)[0] }),
    /* @__PURE__ */ jsx39("p", { className: "ad-verdict__sentence", children: String(sentence) })
  ] });
}

// src/components/Search/Search.tsx
import { useRef as useRef20 } from "react";
import { jsx as jsx40 } from "react/jsx-runtime";
function CommandSearch({ open, onClose, query, onQuery, results, onPick, label = "Search everything", noMatch = "Nothing by that name" }) {
  const box = useRef20(null);
  const z = useLayer(open, onClose, [box], "dialog");
  usePageInert(open, [box]);
  useFocusReturn(open, box);
  if (!open) return null;
  return /* @__PURE__ */ jsx40(Portal, { children: /* @__PURE__ */ jsx40("div", { ref: box, role: "dialog", "aria-modal": "true", "aria-label": label, onKeyDown: (e) => trapTab(e, box.current), style: { zIndex: z }, className: "ad-float ad-search", children: /* @__PURE__ */ jsx40(
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
      options: results.map((r) => ({ id: r.id, label: r.label, group: r.group, lead: r.icon, hint: r.code ? /* @__PURE__ */ jsx40(Tag, { children: r.code }) : void 0 })),
      className: "ad-search__list"
    }
  ) }) });
}

// src/components/Guidance/Guidance.tsx
import { useEffect as useEffect12, useLayoutEffect as useLayoutEffect4, useRef as useRef21, useState as useState19 } from "react";
import { jsx as jsx41, jsxs as jsxs37 } from "react/jsx-runtime";
var useIsoLayoutEffect3 = typeof window === "undefined" ? useEffect12 : useLayoutEffect4;
function TourStep({ open, anchor, step, total, title, children, onBack, onNext, onExit, backLabel = "Back", nextLabel = "Next", progressLabel = (s, t) => `${s} of ${t}`, side = "below" }) {
  const card = useRef21(null);
  const [rect, setRect] = useState19(null);
  useFocusReturn(open, card);
  useIsoLayoutEffect3(() => {
    if (!open) return;
    const place = () => {
      const r = anchor.current?.getBoundingClientRect();
      if (r) setRect(r);
    };
    place();
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, true);
    const onKey = (e) => {
      if (e.key === "Escape") onExit?.();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", place, true);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, anchor, onExit]);
  if (!open || !rect) return null;
  const gap = tokenPx("--notch-size", 12);
  const pad = tokenPx("--space-1", 4);
  const notchMax = tokenPx("--space-8", 32);
  const cardStyle = side === "below" ? { top: rect.bottom + pad + gap, left: Math.max(pad * 4, rect.left), ["--ad-notch-x"]: `${Math.round(Math.min(rect.width / 2, notchMax) - gap / 2)}px` } : { top: Math.max(pad * 4, rect.top), left: rect.right + pad + gap, ["--ad-notch-y"]: `${Math.round(Math.min(rect.height / 2, notchMax) - gap / 2)}px` };
  return /* @__PURE__ */ jsxs37(Portal, { children: [
    /* @__PURE__ */ jsx41("div", { className: "ad-spotlight", "aria-hidden": "true", style: { top: rect.top - pad, left: rect.left - pad, width: rect.width + pad * 2, height: rect.height + pad * 2 } }),
    /* @__PURE__ */ jsxs37("div", { ref: card, role: "dialog", "aria-label": typeof title === "string" ? title : void 0, tabIndex: -1, className: cx("ad-tour-card", `ad-tour-card--${side}`), style: cardStyle, children: [
      /* @__PURE__ */ jsx41("div", { className: "ad-tour-card__ticks", "aria-label": progressLabel(step, total), role: "img", children: Array.from({ length: total }, (_, i) => /* @__PURE__ */ jsx41("i", { "data-done": i < step || void 0 }, i)) }),
      /* @__PURE__ */ jsx41("h2", { className: "ad-tour-card__title", children: title }),
      /* @__PURE__ */ jsx41("div", { className: "ad-tour-card__text", children }),
      /* @__PURE__ */ jsx41("div", { className: "ad-tour-card__foot", children: /* @__PURE__ */ jsxs37(ButtonSizeScope, { size: "bar", children: [
        onBack && step > 1 && /* @__PURE__ */ jsx41(Button, { onClick: onBack, children: backLabel }),
        /* @__PURE__ */ jsx41(Button, { variant: "main", onClick: onNext, "data-autofocus": true, children: nextLabel })
      ] }) })
    ] })
  ] });
}
function PixxBrief({ open, face, greeting, children, onSnooze, onGotIt, snoozeLabel = "Snooze", gotItLabel = "Got it" }) {
  if (!open) return null;
  return /* @__PURE__ */ jsx41(Portal, { children: /* @__PURE__ */ jsxs37("section", { className: "ad-float ad-brief", "aria-label": typeof greeting === "string" ? greeting : "Pixx", role: "complementary", children: [
    /* @__PURE__ */ jsxs37("div", { className: "ad-brief__head", children: [
      /* @__PURE__ */ jsx41("img", { className: "ad-brief__face", src: face, alt: "" }),
      /* @__PURE__ */ jsx41("h2", { className: "ad-brief__greeting", children: greeting })
    ] }),
    /* @__PURE__ */ jsx41("div", { className: "ad-brief__text", children }),
    /* @__PURE__ */ jsxs37("div", { className: "ad-brief__foot", children: [
      /* @__PURE__ */ jsx41(Button, { onClick: onSnooze, children: snoozeLabel }),
      /* @__PURE__ */ jsx41(Button, { onClick: onGotIt, children: gotItLabel })
    ] })
  ] }) });
}

// src/components/Furniture/Furniture.tsx
import { Fragment as Fragment11, jsx as jsx42, jsxs as jsxs38 } from "react/jsx-runtime";
function TitleBlock({ code, number, venue, pageNumber, page }) {
  return /* @__PURE__ */ jsxs38("footer", { className: "ad-title-block", children: [
    /* @__PURE__ */ jsxs38("span", { className: "ad-title-block__cell ad-title-block__code", children: [
      code,
      number && /* @__PURE__ */ jsx42("span", { className: "ad-title-block__number", children: number })
    ] }),
    /* @__PURE__ */ jsx42("span", { className: "ad-title-block__cell ad-title-block__venue", children: venue }),
    /* @__PURE__ */ jsx42("span", { className: "ad-title-block__cell ad-title-block__run", "aria-hidden": "true" }),
    /* @__PURE__ */ jsxs38("span", { className: "ad-title-block__cell ad-title-block__page", children: [
      /* @__PURE__ */ jsx42("span", { className: "ad-title-block__page-number", children: pageNumber }),
      page
    ] })
  ] });
}
function Contents({ entries, ariaLabel = "Contents" }) {
  return /* @__PURE__ */ jsx42("ol", { className: "ad-contents", "aria-label": ariaLabel, children: entries.map((e, i) => {
    const inner = /* @__PURE__ */ jsxs38(Fragment11, { children: [
      /* @__PURE__ */ jsx42("span", { className: "ad-contents__numeral", children: String(i + 1).padStart(2, "0") }),
      /* @__PURE__ */ jsxs38("span", { className: "ad-contents__body", children: [
        /* @__PURE__ */ jsx42("span", { className: "ad-contents__name", children: e.name }),
        e.summary && /* @__PURE__ */ jsx42("span", { className: "ad-contents__summary", children: e.summary })
      ] })
    ] });
    return /* @__PURE__ */ jsx42("li", { className: "ad-contents__entry", "data-needs-you": e.needsYou || void 0, children: e.onOpen ? /* @__PURE__ */ jsx42("button", { type: "button", className: "ad-contents__button", onClick: e.onOpen, children: inner }) : /* @__PURE__ */ jsx42("div", { className: "ad-contents__button", children: inner }) }, e.id);
  }) });
}
function Caption({ children, bracket = "none", className }) {
  return /* @__PURE__ */ jsxs38("span", { className: cx("ad-caption", className), children: [
    bracket !== "none" && "[ ",
    children,
    bracket === "closed" && " ]"
  ] });
}
function DualUnit({ primary, secondary }) {
  return /* @__PURE__ */ jsxs38("span", { className: "ad-dual", children: [
    primary,
    " ",
    /* @__PURE__ */ jsxs38("span", { className: "ad-caption", children: [
      "[ ",
      secondary,
      " ]"
    ] })
  ] });
}
function Frame({ rail, children, className }) {
  return /* @__PURE__ */ jsxs38("div", { className: cx("ad-frame", className), children: [
    rail,
    /* @__PURE__ */ jsx42("div", { className: "ad-frame__page", children })
  ] });
}
function Ground({ children, className, style }) {
  return /* @__PURE__ */ jsx42("div", { className: cx("ad-ground", className), style, children });
}

// src/runtime/AdsProvider.tsx
import { useContext as useContext6, useEffect as useEffect13, useMemo as useMemo3 } from "react";
import { jsx as jsx43 } from "react/jsx-runtime";
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
  useEffect13(() => {
    if (!on) return;
    report(scanIn(document.body), true);
  });
  useEffect13(() => {
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
  const outer = useContext6(HueSwitches);
  const o = { ...SHOW_DEFAULTS, ...show ?? {} };
  const project = o.projectColours === true;
  const item = o.itemColours === true;
  const department = o.departmentColours === true;
  const value = useMemo3(() => ({ project, item, department, inProject: outer.inProject }), [project, item, department, outer.inProject]);
  const key = JSON.stringify(o);
  const options = useMemo3(() => o, [key]);
  return /* @__PURE__ */ jsx43(HueSwitches.Provider, { value, children: /* @__PURE__ */ jsx43(Show.Provider, { value: options, children }) });
}
function AdsScope({ project, children }) {
  const outer = useContext6(HueSwitches);
  const value = useMemo3(() => ({ ...outer, inProject: true }), [outer]);
  return /* @__PURE__ */ jsx43(HueSwitches.Provider, { value, children: /* @__PURE__ */ jsx43("div", { "data-ads-project": project, style: { display: "contents" }, children }) });
}
export {
  AccessRow,
  ActiveFilters,
  ActivityThread,
  AddRow,
  AdsProvider,
  AdsScope,
  AlertBar,
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
  CardName,
  Checkbox,
  Clash,
  CloseButton,
  CommandSearch,
  ConfirmDialog,
  Contents,
  DateField,
  DatePicker,
  DayHeading,
  DeliverableBar,
  Department,
  Dial,
  Dialog,
  Dials,
  Dot,
  DropLine,
  DualUnit,
  EmptyState,
  Fact,
  Facts,
  FieldRow,
  FilterTag,
  FormActions,
  FormSection,
  Frame,
  Ground,
  GroupHeading,
  Health,
  Icon,
  IconButton,
  InlineEdit,
  Legend,
  List,
  ListSection,
  LoadError,
  LoadingRows,
  MarkerKey,
  Menu,
  Milestone,
  MonthCalendar,
  NoteBox,
  NotificationList,
  NowMarker,
  OffscreenStart,
  OverTime,
  PageHeader,
  PastHatch,
  Person,
  PersonPicker,
  PickField,
  PickList,
  PixxBrief,
  Popover,
  PopoverHeader,
  PopoverSection,
  Portal,
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
  Segmented,
  Select,
  SelectionBar,
  SettingRow,
  SettingsLayout,
  SettingsNav,
  SettingsNavItem,
  SettingsSection,
  ShowOptionsGear,
  SideMenu,
  Status,
  StatusPicker,
  Switch,
  Table,
  Tabs,
  Tag,
  TextArea,
  TextField,
  TextScramble,
  TimeGrid,
  TitleBlock,
  TodayLine,
  TodoCheck,
  TodoRow,
  TokenInput,
  TokenPill,
  Toolbar,
  ToolbarSeparator,
  Tooltip,
  TourStep,
  UndoNote,
  UnreadDot,
  Verdict,
  ViewButton,
  ViewPopover,
  ViewSwitch,
  WeekendShade,
  ZoomCluster,
  cx,
  describeViolations,
  hueNames,
  projectHue,
  resetDesignViolations,
  scanIn,
  showOrder,
  useLayer,
  usePlacement,
  useSaveAsYouGo,
  useTooltip,
  useViewInAddress
};
//# sourceMappingURL=index.js.map