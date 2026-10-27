// src/runtime/violations.ts
function scanIn(root) {
  if (typeof document === "undefined") return [];
  const scope = root || document.body;
  if (!scope) return [];
  const out = [];
  function shown(el, behind) {
    let n = el;
    while (n) {
      if (n.hasAttribute("hidden")) return false;
      if (!behind && (n.hasAttribute("inert") || n.getAttribute("aria-hidden") === "true")) return false;
      const s = typeof getComputedStyle === "function" ? getComputedStyle(n) : null;
      if (s && (s.display === "none" || s.visibility === "hidden")) return false;
      n = n.parentElement;
    }
    return true;
  }
  function name(el) {
    const words = (el.textContent || "").replace(/\s+/g, " ").trim().slice(0, 40);
    return words ? `<${el.tagName.toLowerCase()}> "${words}"` : `<${el.tagName.toLowerCase()}>`;
  }
  function all(sel) {
    const found = [];
    if (scope.matches && scope.matches(sel)) found.push(scope);
    const list = scope.querySelectorAll(sel);
    for (let i = 0; i < list.length; i++) found.push(list[i]);
    return found;
  }
  const own = all("[data-ad-own-drawing]");
  if (own.length) {
    out.push({
      kind: "own-icon",
      rule: "guard.no-own-icons",
      elements: own.map(name),
      message: `guard.no-own-icons: ${own.length} icon slot${own.length === 1 ? "" : "s"} hold${own.length === 1 ? "s" : ""} the app's own drawing. An icon slot takes a name or a job from the icon map (icon="todos"); the design system draws the glyph. Nothing of the app's own is drawn there.`
    });
  }
  const mains = all(".ad-button--main").filter((el) => shown(el));
  if (mains.length > 1) {
    out.push({
      kind: "main-button",
      rule: "controls.coral-main-button",
      elements: mains.map(name),
      message: `controls.coral-main-button: ${mains.length} coral main buttons are on the screen at once (${mains.map(name).join(", ")}). One coral main button per screen: leave variant="main" on the one main action and make every other button variant="quiet".`
    });
  }
  const modals = all('[role="dialog"], [role="alertdialog"]').filter((el) => el.classList.contains("ad-dialog") || el.classList.contains("ad-search") || el.getAttribute("aria-modal") === "true").filter((el) => shown(el, true));
  if (modals.length > 1) {
    out.push({
      kind: "dialog",
      rule: null,
      elements: modals.map(name),
      message: `One dialog at a time: ${modals.length} are open together (${modals.map(name).join(", ")}). Close the first before opening the second, or make the second a pop-over, menu or picker \u2014 those are layers and may stack. (No rule statement in rules/rules.json covers this; it is the Dialog and CommandSearch contract: the page behind a modal is out of reach while it is open.)`
    });
  }
  if (modals.length) {
    const top = modals[modals.length - 1];
    const active = document.activeElement;
    if (active && active !== document.body && active !== document.documentElement && active !== top && !top.contains(active)) {
      out.push({
        kind: "focus",
        rule: null,
        elements: [name(active), name(top)],
        message: `Focus escaped an open dialog: it is on ${name(active)}, outside ${name(top)}. Keep focus inside the dialog while it is open \u2014 let the Dialog hold it (trapTab and usePageInert) and do not move focus to the page behind it. (No rule statement in rules/rules.json covers this; it is the Dialog and CommandSearch contract.)`
      });
    }
  }
  const scopes = all("[data-ads-project]");
  for (let i = 0; i < scopes.length; i++) {
    const box = scopes[i];
    const code = (box.getAttribute("data-ads-project") || "").trim();
    if (!code) continue;
    const repeats = [];
    const tags = box.querySelectorAll(".ad-tag");
    for (let j = 0; j < tags.length; j++) {
      const tag = tags[j];
      if ((tag.textContent || "").trim() === code && shown(tag)) repeats.push(tag);
    }
    if (repeats.length) {
      out.push({
        kind: "same-fact-twice",
        rule: "athena.project-codes.project-codes-appear",
        elements: repeats.map(name),
        message: `athena.project-codes.project-codes-appear (and standing.never-the-same-fact-twice): the project code "${code}" is shown ${repeats.length} time(s) inside <AdsScope project="${code}">, which is already that one project. A single project's screen never repeats its own code on its items: drop the code tag and keep the code once, on the screen.`
      });
    }
  }
  const forms = all("form");
  for (let i = 0; i < forms.length; i++) {
    const form = forms[i];
    if (!shown(form)) continue;
    const fields = [];
    const list = form.querySelectorAll(".ad-field, .ad-facts__cell");
    for (let j = 0; j < list.length; j++) if (shown(list[j])) fields.push(list[j]);
    if (fields.length <= 6) continue;
    const loose = fields.filter((f) => !f.closest(".ad-form-section"));
    const boxes = loose.filter((f) => !(f.classList.contains("ad-field") && !f.closest(".ad-facts") && fields.indexOf(f) < 2));
    if (!boxes.length) continue;
    out.push({
      kind: "long-form",
      rule: "controls.field-height-32",
      elements: [name(form)],
      message: `controls.field-height-32: a form with ${fields.length} fields is a long form, and ${boxes.length} of them are not in a numbered section. More than 6 fields: split the boxes into FormSections (01 Dates, 02 People\u2026), with Cancel and the main button at the bottom right.`
    });
  }
  return out;
}
function describeViolations(found) {
  return found.map((v) => `- ${v.message}`).join("\n");
}

export {
  scanIn,
  describeViolations
};
//# sourceMappingURL=chunk-5DPRZLB3.js.map