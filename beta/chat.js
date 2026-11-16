/* MoodlePro · AI chat (beta) – step 1: only the floating button.
   Loaded by index.html (aiEnsure) once the student is connected. It draws a small floating circle with a custom face;
   for now a tap only says "in preparation". The chat itself, and the connection to the server, come in the next steps.
   Colours come only from the app's theme variables (--accent, --card, --line, ...), so every colour pack works. */
(function () {
  if (window.AI) return;

  const CSS = `
#aiFab{position:fixed;z-index:13;inset-inline-end:16px;bottom:calc(86px + env(safe-area-inset-bottom));width:58px;height:58px;padding:0;border:0;border-radius:50%;
  display:grid;place-items:center;cursor:pointer;color:var(--on-accent,#fff);-webkit-tap-highlight-color:transparent;
  background:linear-gradient(145deg,var(--accent),color-mix(in srgb,var(--accent) 45%,#7b5cff));
  box-shadow:0 8px 22px color-mix(in srgb,var(--accent) 42%,transparent),0 0 0 3px color-mix(in srgb,var(--card) 85%,transparent);
  transition:transform .18s ease,box-shadow .18s ease}
#aiFab[hidden]{display:none}
#aiFab:hover{box-shadow:0 10px 26px color-mix(in srgb,var(--accent) 55%,transparent),0 0 0 3px color-mix(in srgb,var(--card) 85%,transparent)}
#aiFab:active{transform:scale(.92)}
#aiFab:focus-visible{outline:3px solid var(--accent-t,var(--accent));outline-offset:3px}
#aiFab svg{width:38px;height:38px;display:block;overflow:visible}
#aiFab .aiBub{fill:#fff;fill-opacity:.97}
#aiFab .aiEye{fill:color-mix(in srgb,var(--accent) 78%,#000)}
#aiFab .aiSmile{fill:none;stroke:color-mix(in srgb,var(--accent) 78%,#000);stroke-width:2.1;stroke-linecap:round}
#aiFab .aiSpark{fill:#ffd166;transform-box:fill-box;transform-origin:center}
#aiFab .aiTag{position:absolute;inset-block-end:-4px;inset-inline-start:-4px;padding:1px 6px;border-radius:99px;border:1px solid var(--line);
  background:var(--card);color:var(--accent-t,var(--accent));font-size:10px;font-weight:800;letter-spacing:.05em;line-height:14px}
@media (min-width:600px) and (max-width:999px){ #aiFab{bottom:calc(104px + env(safe-area-inset-bottom))} }
@media (min-width:1000px){ #aiFab{bottom:28px;inset-inline-end:28px;width:62px;height:62px} }
@media (prefers-reduced-motion:no-preference){
  body:not(.calm) #aiFab{animation:aiFloat 3.8s ease-in-out infinite}
  body:not(.calm) #aiFab .aiSpark{animation:aiTwinkle 2.6s ease-in-out infinite}
}
@keyframes aiFloat{0%,100%{translate:0 0}50%{translate:0 -5px}}
@keyframes aiTwinkle{0%,100%{scale:1;opacity:1}50%{scale:.7;opacity:.75}}
`;

  /* the face: a friendly chat bubble with eyes and a smile, and a small gold spark */
  const SVG = '<svg viewBox="0 0 40 40" aria-hidden="true" focusable="false">' +
    '<path class="aiBub" d="M10 9h20a6 6 0 0 1 6 6v10a6 6 0 0 1-6 6H21l-6.2 5.1a.8.8 0 0 1-1.3-.6V31H10a6 6 0 0 1-6-6V15a6 6 0 0 1 6-6z"/>' +
    '<ellipse class="aiEye" cx="14.8" cy="19" rx="2.1" ry="2.7"/><ellipse class="aiEye" cx="25.2" cy="19" rx="2.1" ry="2.7"/>' +
    '<path class="aiSmile" d="M15.3 24.4q4.7 3.8 9.4 0"/>' +
    '<path class="aiSpark" d="M33.5 1.5l1.5 3.9 3.9 1.5-3.9 1.5-1.5 3.9-1.5-3.9-3.9-1.5 3.9-1.5z"/></svg>';

  let btn = null;

  const label = () => (typeof t === "function" ? t("aiBtn") : "AI");

  function build() {
    if (btn) return;
    const st = document.createElement("style"); st.textContent = CSS; document.head.appendChild(st);
    btn = document.createElement("button");
    btn.id = "aiFab"; btn.type = "button"; btn.hidden = true;
    btn.innerHTML = SVG + '<span class="aiTag">AI</span>';
    btn.onclick = () => { if (typeof toast === "function") toast(t("aiSoon"), 2600); };
    document.body.appendChild(btn);
  }

  window.AI = {
    show() { build(); const l = label(); btn.setAttribute("aria-label", l); btn.title = l; btn.hidden = false; },
    hide() { if (btn) btn.hidden = true; },
  };
})();
