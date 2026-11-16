/* MoodlePro · AI chat (beta).
   Loaded by index.html (aiEnsure) once the student is connected. It draws the floating AI circle and, on tap, the chat window.
   Server: our own server (API_DEFAULT below). The Moodle token is NEVER stored by us: it stays in this phone (the app's own
   storage), is sent over HTTPS only to that server, with each message, and the server verifies it against Moodle on every use.
   Colours come only from the app's theme variables, so every colour pack works.
   Rules of the chat: it opens on the last conversation if the student left it up to an hour ago, otherwise on a new one;
   earlier conversations are under the history button. */
(function () {
  if (window.AI) return;

  const API_DEFAULT = "https://college-chat-lwdu.onrender.com";
  const HOUR = 3600 * 1000;

  /* ------------------------------------------------------------ texts (he / en / fr) */
  const TX = {
    he: {
      title: "עוזר AI", sub: "מבוסס בינה מלאכותית", hello: n => "שלום " + n + " 👋", helloNo: "שלום 👋",
      intro: "אני עוזר AI. אפשר לשאול אותי על המטלות, הציונים, המועדים והקורסים שלך.",
      s1: "מה המטלות הפתוחות שלי?", s2: "מה המועדים הקרובים שלי?", s3: "איך הציונים שלי בקורסים?",
      ph: "כתוב שאלה…", send: "שלח", stop: "עצור", close: "סגור", hist: "שיחות קודמות", newc: "שיחה חדשה", back: "חזרה לשיחה",
      note: "AI עלול לטעות. כדאי לוודא פרטים חשובים ב-Moodle.", histEmpty: "עדיין אין שיחות קודמות", histNone: "שיחה ללא כותרת",
      connecting: "מתחבר…", wake: "השרת מתעורר, זה יכול לקחת עד דקה…", retry: "נסה שוב", cut: "(התשובה נקטעה)",
      errNet: "אין חיבור לשרת כרגע. נסה שוב בעוד רגע.", errMoodle: "החיבור ל-Moodle פג. התחבר מחדש בהגדרות ונסה שוב.",
      errRate: "יותר מדי הודעות בזמן קצר. נסה שוב בעוד רגע.", errGen: "משהו השתבש. נסה שוב.", errLoad: "לא הצלחתי לטעון את השיחה.",
    },
    en: {
      title: "AI assistant", sub: "Powered by artificial intelligence", hello: n => "Hello " + n + " 👋", helloNo: "Hello 👋",
      intro: "I’m an AI assistant. Ask me about your assignments, grades, deadlines and courses.",
      s1: "What are my open assignments?", s2: "What are my upcoming deadlines?", s3: "How are my grades in my courses?",
      ph: "Type a question…", send: "Send", stop: "Stop", close: "Close", hist: "Earlier chats", newc: "New chat", back: "Back to the chat",
      note: "AI can make mistakes. Check important details in Moodle.", histEmpty: "No earlier chats yet", histNone: "Untitled chat",
      connecting: "Connecting…", wake: "The server is waking up, this can take up to a minute…", retry: "Try again", cut: "(the answer was cut off)",
      errNet: "Can’t reach the server right now. Try again in a moment.", errMoodle: "The Moodle connection expired. Reconnect in Settings and try again.",
      errRate: "Too many messages in a short time. Try again in a moment.", errGen: "Something went wrong. Try again.", errLoad: "Couldn’t load the chat.",
    },
    fr: {
      title: "Assistant IA", sub: "Propulsé par l’intelligence artificielle", hello: n => "Bonjour " + n + " 👋", helloNo: "Bonjour 👋",
      intro: "Je suis un assistant IA. Posez-moi des questions sur vos devoirs, notes, échéances et cours.",
      s1: "Quels sont mes devoirs en cours ?", s2: "Quelles sont mes prochaines échéances ?", s3: "Comment sont mes notes dans mes cours ?",
      ph: "Écrivez une question…", send: "Envoyer", stop: "Arrêter", close: "Fermer", hist: "Conversations précédentes", newc: "Nouvelle conversation", back: "Retour à la conversation",
      note: "L’IA peut se tromper. Vérifiez les détails importants dans Moodle.", histEmpty: "Aucune conversation précédente", histNone: "Conversation sans titre",
      connecting: "Connexion…", wake: "Le serveur se réveille, cela peut prendre jusqu’à une minute…", retry: "Réessayer", cut: "(la réponse a été coupée)",
      errNet: "Impossible de joindre le serveur pour le moment. Réessayez dans un instant.", errMoodle: "La connexion à Moodle a expiré. Reconnectez-vous dans les réglages et réessayez.",
      errRate: "Trop de messages en peu de temps. Réessayez dans un instant.", errGen: "Une erreur s’est produite. Réessayez.", errLoad: "Impossible de charger la conversation.",
    },
  };
  const lang = () => (typeof LANG === "string" && TX[LANG] ? LANG : "he");
  const tx = (k, ...a) => { const v = TX[lang()][k] !== undefined ? TX[lang()][k] : TX.he[k]; return typeof v === "function" ? v(...a) : v; };

  /* ------------------------------------------------------------ styles */
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
.aiFace .aiBub{fill:#fff;fill-opacity:.97}
.aiFace .aiEye{fill:color-mix(in srgb,var(--accent) 78%,#000)}
.aiFace .aiSmile{fill:none;stroke:color-mix(in srgb,var(--accent) 78%,#000);stroke-width:2.1;stroke-linecap:round}
.aiFace .aiSpark{fill:#ffd166;transform-box:fill-box;transform-origin:center}
#aiFab .aiTag{position:absolute;inset-block-end:-4px;inset-inline-start:-4px;padding:1px 6px;border-radius:99px;border:1px solid var(--line);
  background:var(--card);color:var(--accent-t,var(--accent));font-size:10px;font-weight:800;letter-spacing:.05em;line-height:14px}
@media (min-width:600px) and (max-width:999px){ #aiFab{bottom:calc(104px + env(safe-area-inset-bottom))} }
@media (min-width:1000px){ #aiFab{bottom:28px;inset-inline-end:28px;width:62px;height:62px} }
@media (prefers-reduced-motion:no-preference){
  body:not(.calm) #aiFab{animation:aiFloat 3.8s ease-in-out infinite}
  body:not(.calm) .aiFace .aiSpark{animation:aiTwinkle 2.6s ease-in-out infinite}
  body:not(.calm) .aiDots i{animation:aiDot 1.2s ease-in-out infinite}
}
@keyframes aiFloat{0%,100%{translate:0 0}50%{translate:0 -5px}}
@keyframes aiTwinkle{0%,100%{scale:1;opacity:1}50%{scale:.7;opacity:.75}}
@keyframes aiDot{0%,80%,100%{opacity:.25;translate:0 0}40%{opacity:1;translate:0 -3px}}

/* the chat window: a full screen on a phone (sized to the visible area, so the keyboard never covers the input), a floating window on a computer */
.aiP{position:fixed;z-index:35;left:0;right:0;top:var(--aivt,0px);height:var(--aivh,100dvh);display:flex;flex-direction:column;background:var(--bg);color:var(--text);
  opacity:0;translate:0 14px;transition:opacity .2s ease,translate .22s ease}
.aiP[hidden]{display:none}
.aiP.on{opacity:1;translate:0 0}
body.calm .aiP{transition:none}
@media (min-width:760px){
  .aiP{left:auto;right:auto;inset-inline-end:24px;top:auto;bottom:24px;width:min(430px,calc(100vw - 48px));height:min(700px,calc(100dvh - 48px));
    border-radius:22px;border:1px solid var(--line);box-shadow:0 24px 60px #0006,0 2px 10px #0003;overflow:hidden}
}
.aiHd{flex:none;display:flex;align-items:center;gap:6px;padding:max(10px,env(safe-area-inset-top)) 10px 10px;color:var(--on-accent,#fff);
  background:linear-gradient(135deg,var(--accent),color-mix(in srgb,var(--accent) 50%,#7b5cff))}
.aiHb{flex:none;width:40px;height:40px;padding:0;border:0;border-radius:12px;background:transparent;color:inherit;display:grid;place-items:center;cursor:pointer}
.aiHb:hover{background:#ffffff29}.aiHb:focus-visible{outline:2px solid #fff;outline-offset:1px}
.aiHb svg{width:22px;height:22px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.aiTt{flex:1;min-width:0;display:flex;align-items:center;gap:10px}
.aiTt b{display:block;font-size:16.5px;line-height:1.2}.aiTt small{display:block;font-size:12px;opacity:.85;line-height:1.3}
.aiTt .aiTl{min-width:0}
.aiAv{flex:none;width:38px;height:38px;border-radius:50%;background:#ffffff33;display:grid;place-items:center;position:relative}
.aiAv svg{width:27px;height:27px;display:block;overflow:visible}
.aiAv .aiTag{position:absolute;inset-block-end:-3px;inset-inline-end:-5px;padding:0 5px;border-radius:99px;background:var(--card);color:var(--accent-t,var(--accent));font-size:9px;font-weight:800;line-height:13px;border:1px solid var(--line)}
.aiMs{flex:1;min-height:0;overflow-y:auto;overscroll-behavior:contain;-webkit-overflow-scrolling:touch;padding:14px 12px 8px;display:flex;flex-direction:column;gap:10px}
.aiM{display:flex;gap:8px;align-items:flex-end;max-width:100%}
.aiM.me{align-self:flex-end}.aiM.ai{align-self:flex-start}
.aiM .aiAv{width:30px;height:30px;background:linear-gradient(145deg,var(--accent),color-mix(in srgb,var(--accent) 45%,#7b5cff))}
.aiM .aiAv svg{width:21px;height:21px}.aiM .aiAv .aiTag{display:none}
.aiB{max-width:min(88%,560px);padding:9px 13px;border-radius:16px;line-height:1.5;font-size:15px;overflow-wrap:anywhere}
.aiM.ai .aiB{background:var(--card);border:1px solid var(--line);border-end-start-radius:4px}
.aiM.me .aiB{background:var(--accent);color:var(--on-accent,#fff);border-end-end-radius:4px;white-space:pre-wrap}
.aiB p{margin:0 0 .55em}.aiB p:last-child,.aiB ul:last-child,.aiB ol:last-child,.aiB pre:last-child{margin-bottom:0}
.aiB ul,.aiB ol{margin:0 0 .55em;padding-inline-start:1.3em}.aiB li{margin:.12em 0}
.aiB code{font-family:ui-monospace,Menlo,Consolas,monospace;font-size:.92em;padding:1px 5px;border-radius:6px;background:color-mix(in srgb,var(--text) 9%,transparent)}
.aiB pre{margin:0 0 .55em;padding:9px 11px;border-radius:10px;overflow-x:auto;background:color-mix(in srgb,var(--text) 8%,transparent);direction:ltr;text-align:left}
.aiB pre code{padding:0;background:none}
.aiB .aiH{font-weight:800}
.aiB a{color:var(--accent-t,var(--accent));text-decoration:underline;word-break:break-all}
.aiDots{display:inline-flex;gap:4px;padding:5px 2px}.aiDots i{width:7px;height:7px;border-radius:50%;background:var(--muted);opacity:.6}
.aiDots i:nth-child(2){animation-delay:.18s}.aiDots i:nth-child(3){animation-delay:.36s}
.aiErr{color:var(--err);font-size:14px;margin-top:6px}
.aiErr button{margin-inline-start:6px;padding:3px 10px;border-radius:99px;border:1px solid currentColor;background:none;color:inherit;font:inherit;font-size:13px;font-weight:700;cursor:pointer}
.aiHi{margin:auto;text-align:center;padding:18px 12px;display:flex;flex-direction:column;align-items:center;gap:10px;width:100%}
.aiHi .aiBig{width:78px;height:78px;border-radius:50%;display:grid;place-items:center;
  background:linear-gradient(145deg,var(--accent),color-mix(in srgb,var(--accent) 45%,#7b5cff));box-shadow:0 10px 26px color-mix(in srgb,var(--accent) 40%,transparent)}
.aiHi .aiBig svg{width:52px;height:52px;overflow:visible}
.aiHi h2{margin:6px 0 0;font-size:23px}
.aiHi p{margin:0;color:var(--muted);max-width:32ch;line-height:1.5}
.aiSug{display:flex;flex-direction:column;gap:8px;width:100%;max-width:330px;margin-top:8px}
.aiSug button{padding:11px 14px;border-radius:14px;border:1px solid var(--line);background:var(--card);color:var(--text);text-align:start;font:inherit;font-size:14.5px;cursor:pointer}
.aiSug button:hover{border-color:var(--accent)}
.aiHs{flex:1;min-height:0;overflow-y:auto;overscroll-behavior:contain;padding:6px 10px}
.aiHr{display:flex;flex-direction:column;gap:2px;width:100%;text-align:start;padding:11px 12px;border:0;border-bottom:1px solid var(--line);border-radius:0;background:none;color:var(--text);font:inherit;cursor:pointer}
.aiHr b{font-weight:650;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.aiHr small{color:var(--muted);font-size:12.5px}
.aiHr.on{background:var(--accent-soft)}
.aiHe{margin:auto;color:var(--muted);text-align:center;padding:24px}
.aiFt{flex:none;padding:8px 10px calc(8px + env(safe-area-inset-bottom));border-top:1px solid var(--line);background:color-mix(in srgb,var(--card) 92%,var(--bg))}
.aiSt{font-size:12.5px;color:var(--muted);text-align:center;padding:0 0 6px}
.aiIn{display:flex;gap:8px;align-items:flex-end}
.aiIn textarea{flex:1;min-width:0;resize:none;min-height:44px;max-height:132px;padding:11px 14px;border-radius:22px;border:1px solid var(--line);background:var(--bg);color:var(--text);font:inherit;font-size:16px;line-height:1.35}
.aiIn textarea:focus{outline:2px solid var(--accent);outline-offset:0;border-color:transparent}
.aiSd{flex:none;width:44px;height:44px;padding:0;border:0;border-radius:50%;background:var(--accent);color:var(--on-accent,#fff);display:grid;place-items:center;cursor:pointer}
.aiSd:disabled{opacity:.45;cursor:default}
.aiSd svg{width:21px;height:21px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.aiSd .aiStopI{fill:currentColor;stroke:none}
html[dir=rtl] .aiSd .aiSendI{transform:scaleX(-1)}
.aiNt{font-size:11.5px;color:var(--muted);text-align:center;padding-top:6px;line-height:1.4}
`;

  /* ------------------------------------------------------------ small pieces */
  const FACE = '<svg class="aiFace" viewBox="0 0 40 40" aria-hidden="true" focusable="false">' +
    '<path class="aiBub" d="M10 9h20a6 6 0 0 1 6 6v10a6 6 0 0 1-6 6H21l-6.2 5.1a.8.8 0 0 1-1.3-.6V31H10a6 6 0 0 1-6-6V15a6 6 0 0 1 6-6z"/>' +
    '<ellipse class="aiEye" cx="14.8" cy="19" rx="2.1" ry="2.7"/><ellipse class="aiEye" cx="25.2" cy="19" rx="2.1" ry="2.7"/>' +
    '<path class="aiSmile" d="M15.3 24.4q4.7 3.8 9.4 0"/>' +
    '<path class="aiSpark" d="M33.5 1.5l1.5 3.9 3.9 1.5-3.9 1.5-1.5 3.9-1.5-3.9-3.9-1.5 3.9-1.5z"/></svg>';
  const I_X = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>';
  const I_HIST = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l3 2"/></svg>';
  const I_NEW = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/></svg>';
  const I_BACK = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
  const I_SEND = '<svg class="aiSendI" viewBox="0 0 24 24" aria-hidden="true"><path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4z"/></svg>';
  const I_STOP = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect class="aiStopI" x="6" y="6" width="12" height="12" rx="2.5"/></svg>';

  const esc2 = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  /* a small, safe markdown: everything is escaped first, then **bold**, `code`, lists, headings, http(s) links */
  function inline(s) {
    return esc2(s)
      .replace(/`([^`]+)`/g, "<code>$1</code>")
      .replace(/\*\*([^*]+)\*\*/g, "<b>$1</b>")
      .replace(/(^|[\s(])\*([^*\s][^*]*?)\*(?=[\s).,!?:;]|$)/g, "$1<i>$2</i>")
      .replace(/https?:\/\/[^\s<]*[^\s<.,;:!?)\]]/g, u => '<a href="' + u + '" target="_blank" rel="noopener noreferrer">' + u + "</a>");
  }
  function md(src) {
    const lines = String(src).replace(/\r/g, "").split("\n");
    const out = []; let para = [], list = null, code = null;
    const flushP = () => { if (para.length) { out.push("<p>" + para.map(inline).join("<br>") + "</p>"); para = []; } };
    const flushL = () => { if (list) { out.push("</" + list + ">"); list = null; } };
    for (const ln of lines) {
      if (code !== null) { if (/^\s*```/.test(ln)) { out.push("<pre><code>" + esc2(code.join("\n")) + "</code></pre>"); code = null; } else code.push(ln); continue; }
      if (/^\s*```/.test(ln)) { flushP(); flushL(); code = []; continue; }
      let m;
      if ((m = /^#{1,4}\s+(.*)$/.exec(ln))) { flushP(); flushL(); out.push('<p class="aiH">' + inline(m[1]) + "</p>"); continue; }
      if ((m = /^\s*[-*•]\s+(.*)$/.exec(ln))) { flushP(); if (list !== "ul") { flushL(); out.push("<ul>"); list = "ul"; } out.push("<li>" + inline(m[1]) + "</li>"); continue; }
      if ((m = /^\s*\d+[.)]\s+(.*)$/.exec(ln))) { flushP(); if (list !== "ol") { flushL(); out.push("<ol>"); list = "ol"; } out.push("<li>" + inline(m[1]) + "</li>"); continue; }
      if (!ln.trim()) { flushP(); flushL(); continue; }
      flushL(); para.push(ln);
    }
    if (code !== null) out.push("<pre><code>" + esc2(code.join("\n")) + "</code></pre>");
    flushP(); flushL();
    return out.join("");
  }

  /* ------------------------------------------------------------ server access */
  class AiErr extends Error { constructor(kind) { super(kind); this.kind = kind; } }

  const api = () => String(LS.get("aiApi", API_DEFAULT) || API_DEFAULT).replace(/\/+$/, "");
  // the token only ever goes to https (or to a local test server) - never to any other address
  const okApi = b => { try { const u = new URL(b); return u.protocol === "https:" || (u.protocol === "http:" && /^(localhost|127\.0\.0\.1)$/.test(u.hostname)); } catch (e) { return false; } };
  const firstWord = s => String(s || "").trim().split(/\s+/)[0] || "";

  async function moodleId() {
    const u = LS.get("uid", 0); if (u) return u;
    try { return typeof myUserId === "function" ? await myUserId() : 0; } catch (e) { return 0; }
  }

  async function timedFetch(url, init, ms) {
    const ctl = init.ctl || new AbortController(); let timedOut = false;
    const to = setTimeout(() => { timedOut = true; ctl.abort(); }, ms || 95000);
    try { return await fetch(url, { ...init, ctl: undefined, signal: ctl.signal, cache: "no-store", credentials: "omit", referrerPolicy: "no-referrer" }); }
    catch (e) { if (e.name === "AbortError" && !timedOut) throw e; throw new AiErr("net"); }
    finally { clearTimeout(to); }
  }

  // an account for this student on our server (created on the first time), and a session for it. Re-done silently when the server forgot it.
  async function ensureSession(force) {
    if (ensureSession.p) return ensureSession.p;
    const run = async () => {
      const cur = await moodleId();
      const s0 = LS.get("aiSess", null);
      if (!force && s0 && s0.token && (!cur || String(s0.mid) === String(cur))) return s0;
      if (!M.token) throw new AiErr("moodle");
      const base = api(); if (!okApi(base)) throw new AiErr("gen");
      const res = await timedFetch(base + "/api/moodle/connect", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token: M.token }) });
      if (res.status === 401) throw new AiErr("moodle");
      if (res.status === 429) throw new AiErr("rate");
      if (!res.ok) throw new AiErr(res.status >= 500 ? "net" : "gen");
      const j = await res.json();
      const mid = j.moodle && j.moodle.userid != null ? String(j.moodle.userid) : "";
      const s = { token: j.token, mid, name: j.display_name || firstWord(j.moodle && j.moodle.fullname) };
      if (s0 && String(s0.mid) !== mid) { LS.del("aiConv"); LS.del("aiLeft"); }   // a different student on this phone
      LS.set("aiSess", s);
      return s;
    };
    ensureSession.p = run().finally(() => { ensureSession.p = null; });
    return ensureSession.p;
  }

  async function call(path, opt, retried) {
    opt = opt || {};
    const s = await ensureSession(false);
    const base = api(); if (!okApi(base)) throw new AiErr("gen");
    const res = await timedFetch(base + path, {
      method: opt.method || "GET", ctl: opt.ctl,
      headers: { "Content-Type": "application/json", Authorization: "Bearer " + s.token },
      body: opt.body ? JSON.stringify(opt.body) : undefined,
    }, opt.timeout);
    if (res.status === 401 && !retried) { await ensureSession(true); return call(path, opt, true); }   // the server restarted and forgot the session
    return res;
  }

  const errKind = res => res.status === 403 ? "moodle" : res.status === 429 ? "rate" : res.status >= 500 || res.status === 401 ? "net" : "gen";
  const errText = e => tx(e && e.kind === "moodle" ? "errMoodle" : e && e.kind === "rate" ? "errRate" : e && e.kind === "net" ? "errNet" : "errGen");

  /* ------------------------------------------------------------ state */
  let fab = null, panel = null, ms = null, input = null, sendBtn = null, statusEl = null, titleEl = null, histBtn = null, histMode = false;
  let msgs = [], conv = null, busy = false, ctl = null, gen = 0, curBub = null, pushed = false, skipPop = 0, lastPending = "";

  const left = () => LS.set("aiLeft", Date.now());
  const sessName = () => { const s = LS.get("aiSess", null); return s && s.name ? s.name : ""; };

  /* ------------------------------------------------------------ rendering */
  function bubble(role, content, opts) {
    const row = document.createElement("div"); row.className = "aiM " + (role === "user" ? "me" : "ai");
    if (role !== "user") { const av = document.createElement("div"); av.className = "aiAv"; av.innerHTML = FACE; row.appendChild(av); }
    const b = document.createElement("div"); b.className = "aiB"; b.dir = "auto";
    if (role === "user") b.textContent = content;
    else if (opts && opts.pending && !content) b.innerHTML = '<span class="aiDots" aria-label="…"><i></i><i></i><i></i></span>';
    else b.innerHTML = md(content);
    row.appendChild(b);
    return { row, b };
  }

  function greeting() {
    const n = sessName();
    const sug = ["s1", "s2", "s3"].map(k => '<button type="button" data-q="' + esc2(tx(k)) + '">' + esc2(tx(k)) + "</button>").join("");
    return '<div class="aiHi"><div class="aiBig">' + FACE + "</div><h2>" + esc2(n ? tx("hello", n) : tx("helloNo")) + "</h2><p>" + esc2(tx("intro")) +
      '</p><div class="aiSug">' + sug + "</div></div>";
  }

  function renderMsgs() {
    histMode = false; setMode();
    ms.innerHTML = ""; curBub = null;
    if (!msgs.length) { ms.innerHTML = greeting(); return; }
    msgs.forEach((m, i) => {
      const { row, b } = bubble(m.role, m.content, { pending: m.pending });
      if (m.err) addErr(b, m, i === msgs.length - 1);
      if (busy && i === msgs.length - 1 && m.role !== "user") curBub = b;
      ms.appendChild(row);
    });
    scrollEnd(true);
  }

  function addErr(b, m, isLast) {
    const d = document.createElement("div"); d.className = "aiErr"; d.setAttribute("role", "alert");
    d.append(document.createTextNode(m.err + " "));
    // "try again" only on the latest question, so it never re-sends a different one
    if (m.retry && isLast) { const r = document.createElement("button"); r.type = "button"; r.textContent = tx("retry"); r.onclick = () => retry(); d.appendChild(r); }
    b.appendChild(d);
  }

  const atEnd = () => ms.scrollHeight - ms.scrollTop - ms.clientHeight < 90;
  function scrollEnd(force) { if (force || atEnd()) ms.scrollTop = ms.scrollHeight; }

  function setMode() {
    titleEl.querySelector("b").textContent = histMode ? tx("hist") : tx("title");
    titleEl.querySelector("small").textContent = histMode ? "" : tx("sub");
    histBtn.innerHTML = histMode ? I_BACK : I_HIST; histBtn.setAttribute("aria-label", histMode ? tx("back") : tx("hist")); histBtn.title = histMode ? tx("back") : tx("hist");
    panel.querySelector(".aiFt").hidden = histMode;
  }

  function setBusy(b) {
    busy = b;
    sendBtn.innerHTML = b ? I_STOP : I_SEND; sendBtn.setAttribute("aria-label", b ? tx("stop") : tx("send")); sendBtn.title = b ? tx("stop") : tx("send");
    sendBtn.disabled = !b && !input.value.trim();
  }
  function setStatus(txt) { statusEl.textContent = txt || ""; statusEl.hidden = !txt; }

  /* ------------------------------------------------------------ conversations */
  async function loadConv(id) {
    const my = ++gen;
    ms.innerHTML = '<div class="aiHe">' + esc2(tx("connecting")) + "</div>"; histMode = false; setMode();
    const wake = setTimeout(() => { if (my === gen) ms.innerHTML = '<div class="aiHe">' + esc2(tx("wake")) + "</div>"; }, 6000);
    try {
      const res = await call("/api/conversations/" + encodeURIComponent(id) + "/messages");
      if (my !== gen) return;
      if (res.status === 404) { startNew(); return; }
      if (!res.ok) throw new AiErr(errKind(res));
      const j = await res.json();
      msgs = (j.messages || []).map(m => ({ role: m.role === "user" ? "user" : "assistant", content: String(m.content || "") }));
      conv = id; LS.set("aiConv", id);
      renderMsgs();
    } catch (e) {
      if (my !== gen) return;
      ms.innerHTML = ""; const d = document.createElement("div"); d.className = "aiHe";
      d.append(document.createTextNode((e instanceof AiErr ? errText(e) : tx("errLoad")) + " "));
      const r = document.createElement("button"); r.type = "button"; r.className = "aiHr"; r.style.width = "auto"; r.textContent = tx("retry"); r.onclick = () => loadConv(id); d.appendChild(r);
      ms.appendChild(d);
    } finally { clearTimeout(wake); }
  }

  function startNew() {
    gen++; if (ctl) { ctl.abort(); } msgs = []; conv = null; LS.del("aiConv"); setBusy(false); setStatus("");
    renderMsgs();
  }

  async function openHistory() {
    const my = ++gen; histMode = true; setMode();
    ms.innerHTML = '<div class="aiHe">' + esc2(tx("connecting")) + "</div>";
    try {
      const res = await call("/api/conversations");
      if (my !== gen) return;
      if (!res.ok) throw new AiErr(errKind(res));
      const list = ((await res.json()).conversations || []).filter(c => c && c.id);
      ms.innerHTML = "";
      if (!list.length) { ms.innerHTML = '<div class="aiHe">' + esc2(tx("histEmpty")) + "</div>"; return; }
      const wrap = document.createElement("div"); wrap.className = "aiHs"; wrap.style.padding = "0";
      const loc = lang() === "he" ? "he-IL" : lang() === "fr" ? "fr-FR" : "en-GB";
      for (const c of list) {
        const r = document.createElement("button"); r.type = "button"; r.className = "aiHr" + (c.id === conv ? " on" : "");
        const title = c.title && c.title !== "שיחה חדשה" ? c.title : tx("histNone");
        const when = new Date(c.updated_at || c.created_at);
        const b = document.createElement("b"); b.textContent = title; b.dir = "auto";
        const sm = document.createElement("small"); sm.textContent = isNaN(when) ? "" : when.toLocaleString(loc, { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
        r.append(b, sm); r.onclick = () => { if (c.id === conv && msgs.length) { renderMsgs(); } else loadConv(c.id); };
        wrap.appendChild(r);
      }
      ms.appendChild(wrap);
    } catch (e) {
      if (my !== gen) return;
      ms.innerHTML = '<div class="aiHe">' + esc2(errText(e)) + "</div>";
    }
  }

  /* ------------------------------------------------------------ sending */
  async function send(text) {
    text = String(text || "").trim().slice(0, 2000);
    if (!text || busy) return;
    gen++;                                    // a pending history/load result must not overwrite the chat now
    histMode = false; setMode();
    lastPending = text;
    input.value = ""; input.style.height = "auto";
    msgs.push({ role: "user", content: text });
    const ai = { role: "assistant", content: "", pending: true }; msgs.push(ai);
    setBusy(true); renderMsgs(); busy = true; curBub = ms.lastElementChild.querySelector(".aiB");
    const wake = setTimeout(() => setStatus(tx("wake")), 6000);
    ctl = new AbortController(); const myCtl = ctl;
    try {
      await ensureSession(false);
      if (!conv) {
        const r = await call("/api/conversations", { method: "POST" });
        if (!r.ok) throw new AiErr(errKind(r));
        conv = (await r.json()).id; LS.set("aiConv", conv);
      }
      let res = await call("/api/chat/stream/v2", { method: "POST", ctl: myCtl, timeout: 95000, body: { conversation_id: conv, question: text, moodle_token: M.token || null } });
      if (res.status === 404) {                // the conversation is gone on the server: start a new one and send again
        const r = await call("/api/conversations", { method: "POST" });
        if (!r.ok) throw new AiErr(errKind(r));
        conv = (await r.json()).id; LS.set("aiConv", conv);
        res = await call("/api/chat/stream/v2", { method: "POST", ctl: myCtl, timeout: 95000, body: { conversation_id: conv, question: text, moodle_token: M.token || null } });
      }
      if (!res.ok) throw new AiErr(errKind(res));
      clearTimeout(wake); setStatus("");
      const upd = () => { ai.pending = false; if (curBub) { curBub.innerHTML = md(ai.content) || curBub.innerHTML; scrollEnd(false); } };
      if (!res.body || !res.body.getReader) { ai.content = await res.text(); upd(); }
      else {
        const rd = res.body.getReader(), dec = new TextDecoder("utf-8"); let raf = 0;
        for (;;) {
          const { done, value } = await rd.read(); if (done) break;
          ai.content += dec.decode(value, { stream: true });
          if (!raf) raf = requestAnimationFrame(() => { raf = 0; upd(); });
        }
        ai.content += dec.decode(); if (raf) cancelAnimationFrame(raf); upd();
      }
      if (!ai.content.trim()) throw new AiErr("gen");
    } catch (e) {
      clearTimeout(wake); setStatus("");
      ai.pending = false;
      if (e && e.name === "AbortError") { const ix = msgs.indexOf(ai); if (!ai.content.trim() && ix >= 0) msgs.splice(ix, 1); }   // stopped by the student: keep what arrived
      else {
        const partial = ai.content.trim();
        ai.err = partial ? tx("cut") : errText(e); ai.retry = !partial && !(e && e.kind === "moodle");
        if (!partial) ai.content = "";
      }
    } finally {
      clearTimeout(wake); if (ctl === myCtl) ctl = null;
      setBusy(false); left();
      if (panel && !panel.hidden && !histMode && msgs.includes(ai)) renderMsgs();
    }
  }

  function retry() {
    if (busy) return;
    const i = msgs.length - 1;
    if (i >= 1 && msgs[i].role !== "user" && msgs[i].err) { msgs.splice(i - 1, 2); }   // drop the failed pair, then send the same question again
    send(lastPending);
  }

  /* ------------------------------------------------------------ the window */
  function fit() {
    if (!panel) return;
    const vv = window.visualViewport;
    if (!vv || matchMedia("(min-width:760px)").matches) { panel.style.removeProperty("--aivh"); panel.style.removeProperty("--aivt"); return; }
    const was = atEnd();
    panel.style.setProperty("--aivh", Math.round(vv.height) + "px"); panel.style.setProperty("--aivt", Math.round(vv.offsetTop) + "px");
    if (was) scrollEnd(true);
  }

  function build() {
    if (panel) return;
    const st = document.createElement("style"); st.textContent = CSS; document.head.appendChild(st);

    fab = document.createElement("button"); fab.id = "aiFab"; fab.type = "button"; fab.hidden = true;
    fab.innerHTML = FACE + '<span class="aiTag">AI</span>';
    fab.onclick = () => open();
    document.body.appendChild(fab);

    panel = document.createElement("div"); panel.className = "aiP"; panel.hidden = true; panel.setAttribute("role", "dialog"); panel.setAttribute("aria-modal", "true");
    panel.innerHTML =
      '<div class="aiHd"><button type="button" class="aiHb" data-a="close"></button>' +
      '<div class="aiTt"><div class="aiAv">' + FACE + '<span class="aiTag">AI</span></div><div class="aiTl"><b></b><small></small></div></div>' +
      '<button type="button" class="aiHb" data-a="hist"></button><button type="button" class="aiHb" data-a="new"></button></div>' +
      '<div class="aiMs" role="log" aria-live="polite"></div>' +
      '<div class="aiFt"><div class="aiSt" hidden></div><div class="aiIn"><textarea rows="1" maxlength="2000" enterkeyhint="send"></textarea>' +
      '<button type="button" class="aiSd"></button></div><div class="aiNt"></div></div>';
    document.body.appendChild(panel);
    ms = panel.querySelector(".aiMs"); input = panel.querySelector("textarea"); sendBtn = panel.querySelector(".aiSd");
    statusEl = panel.querySelector(".aiSt"); titleEl = panel.querySelector(".aiTt .aiTl"); histBtn = panel.querySelector('[data-a="hist"]');

    panel.querySelector('[data-a="close"]').onclick = () => close();
    histBtn.onclick = () => (histMode ? renderMsgs() : openHistory());
    panel.querySelector('[data-a="new"]').onclick = () => { startNew(); if (matchMedia("(hover:hover)").matches) input.focus(); };
    sendBtn.onclick = () => (busy ? ctl && ctl.abort() : send(input.value));
    input.oninput = () => { input.style.height = "auto"; input.style.height = Math.min(input.scrollHeight, 132) + "px"; if (!busy) sendBtn.disabled = !input.value.trim(); };
    input.onkeydown = e => { if (e.key === "Enter" && !e.shiftKey && !e.isComposing && matchMedia("(hover:hover)").matches) { e.preventDefault(); if (!busy) send(input.value); } };
    ms.addEventListener("click", e => { const q = e.target.closest("[data-q]"); if (q) send(q.dataset.q); });
    panel.addEventListener("keydown", e => { if (e.key === "Escape") { e.stopPropagation(); close(); } });
    if (window.visualViewport) { visualViewport.addEventListener("resize", fit); visualViewport.addEventListener("scroll", fit); }
    addEventListener("resize", fit);
    // leaving the page counts as leaving the chat: the one-hour rule runs from the last time the student was in it
    document.addEventListener("visibilitychange", () => { if (document.hidden && panel && !panel.hidden) left(); });
    addEventListener("pagehide", () => { if (panel && !panel.hidden) left(); });
    // the phone's back button closes the chat instead of leaving the app
    addEventListener("popstate", e => {
      if (skipPop > 0) { skipPop--; e.stopImmediatePropagation(); return; }
      if (pushed && panel && !panel.hidden) { pushed = false; e.stopImmediatePropagation(); close(true); }
    }, true);
    applyTexts();
  }

  function applyTexts() {
    panel.querySelector('[data-a="close"]').innerHTML = I_X; panel.querySelector('[data-a="close"]').setAttribute("aria-label", tx("close")); panel.querySelector('[data-a="close"]').title = tx("close");
    const nb = panel.querySelector('[data-a="new"]'); nb.innerHTML = I_NEW; nb.setAttribute("aria-label", tx("newc")); nb.title = tx("newc");
    input.placeholder = tx("ph"); input.setAttribute("aria-label", tx("ph"));
    panel.querySelector(".aiNt").textContent = tx("note");
    panel.setAttribute("aria-label", tx("title"));
    setMode(); setBusy(busy);
  }

  async function open() {
    build();
    if (!M.token) { if (typeof toast === "function") toast(tx("errMoodle"), 3500); return; }
    applyTexts();
    panel.hidden = false; fab.hidden = true;
    fit();
    document.documentElement.style.overflow = "hidden";
    requestAnimationFrame(() => panel.classList.add("on"));
    if (!pushed) { try { history.pushState({ v: typeof V !== "undefined" ? V.view : "", ai: 1 }, ""); pushed = true; } catch (e) {} }

    const sid = LS.get("aiConv", null), lf = LS.get("aiLeft", 0);
    const recent = sid && lf && Date.now() - lf <= HOUR;
    if (busy || (recent && conv === sid && msgs.length)) { renderMsgs(); }                 // still in memory: no waiting
    else {
      ms.innerHTML = '<div class="aiHe">' + esc2(tx("connecting")) + "</div>";
      try { await ensureSession(false); }
      catch (e) { ms.innerHTML = '<div class="aiHe">' + esc2(errText(e)) + "</div>"; return; }
      if (recent) await loadConv(sid); else startNew();                                   // an hour or more away: a new conversation
    }
    if (matchMedia("(hover:hover)").matches) input.focus();
  }

  function close(fromPop) {
    if (!panel || panel.hidden) return;
    left();
    panel.classList.remove("on"); panel.hidden = true;
    document.documentElement.style.overflow = "";
    if (fab) { fab.hidden = false; }
    if (pushed && !fromPop) { pushed = false; skipPop++; try { history.back(); } catch (e) { skipPop = 0; } }
    pushed = false;
    if (fab && !fab.hidden) try { fab.focus({ preventScroll: true }); } catch (e) {}
  }

  window.AI = {
    show() { build(); const l = tx("title"); fab.setAttribute("aria-label", l); fab.title = l; if (panel.hidden) fab.hidden = false; },
    hide() { if (fab) fab.hidden = true; if (panel && !panel.hidden) close(); },
    open,
  };
})();
