/* MoodlePro · AI chat (beta).
   Loaded by index.html (aiEnsure) once the student is connected. It draws the floating AI circle and, on tap, the chat window.
   Server: our own server (API_DEFAULT below). The Moodle token is NEVER stored by us: it stays in this phone (the app's own
   storage), is sent over HTTPS only to that server, with each message, and the server verifies it against Moodle on every use.
   Colours come only from the app's theme variables, so every colour pack works.
   Rules of the chat: it opens on the last conversation if the student left it up to an hour ago, otherwise on a new one;
   earlier conversations are under the history button. */
(function () {
  if (window.AIChat) return;

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
      copy: "העתק", copied: "הועתק", share: "שתף", selectTxt: "בחר טקסט", reuse: "ערוך ושלח שוב", msgMenu: "אפשרויות להודעה",
      delAll: "מחק את כל השיחות", delOne: "מחק שיחה", delOk: "מחק", cancel: "ביטול", deleted: "נמחק", histCount: n => n === 1 ? "שיחה אחת" : n + " שיחות",
      delAllQ: "למחוק את כל השיחות הקודמות? אי אפשר לשחזר אותן.", delOneQ: "למחוק את השיחה הזו? אי אפשר לשחזר אותה.",
      dl: "הורד", dling: "מוריד…", fileGone: "הקובץ כבר לא זמין ב-Moodle.", fileBig: "הקובץ גדול מדי להורדה כאן (מעל 25MB). אפשר להוריד אותו ישירות ב-Moodle.", fileErr: "לא הצלחתי להוריד את הקובץ. נסה שוב.", errTitle: "משהו לא תקין",
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
      copy: "Copy", copied: "Copied", share: "Share", selectTxt: "Select text", reuse: "Edit and resend", msgMenu: "Message options",
      delAll: "Delete all chats", delOne: "Delete chat", delOk: "Delete", cancel: "Cancel", deleted: "Deleted", histCount: n => n + (n === 1 ? " chat" : " chats"),
      delAllQ: "Delete all earlier chats? This can’t be undone.", delOneQ: "Delete this chat? This can’t be undone.",
      dl: "Download", dling: "Downloading…", fileGone: "The file is no longer available in Moodle.", fileBig: "The file is too big to download here (over 25MB). You can download it directly in Moodle.", fileErr: "Couldn’t download the file. Try again.", errTitle: "Something’s not right",
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
      copy: "Copier", copied: "Copié", share: "Partager", selectTxt: "Sélectionner le texte", reuse: "Modifier et renvoyer", msgMenu: "Options du message",
      delAll: "Supprimer toutes les conversations", delOne: "Supprimer la conversation", delOk: "Supprimer", cancel: "Annuler", deleted: "Supprimé", histCount: n => n + (n === 1 ? " conversation" : " conversations"),
      delAllQ: "Supprimer toutes les conversations précédentes ? Cette action est irréversible.", delOneQ: "Supprimer cette conversation ? Cette action est irréversible.",
      dl: "Télécharger", dling: "Téléchargement…", fileGone: "Le fichier n’est plus disponible dans Moodle.", fileBig: "Le fichier est trop volumineux pour être téléchargé ici (plus de 25 Mo). Vous pouvez le télécharger directement dans Moodle.", fileErr: "Impossible de télécharger le fichier. Réessayez.", errTitle: "Quelque chose ne va pas",
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

/* the chat is a screen of its own, on every device: it replaces the app while it is open (the app is turned off behind it, so there is nothing to scroll or tap
   behind), and the app comes back when the chat is closed. Sized to the visible area, so the keyboard never covers the input. */
html.aiOn body > *:not(.aiP):not(#toast):not(script):not(style):not(link):not(meta){visibility:hidden}
/* --aivh / --aivt / --aikb are set by the script from the visual viewport (the part of the screen the keyboard leaves free): its height, how far it was
   scrolled down, and how much of the bottom the keyboard covers. The window is moved with transform (cheap, no layout) and never follows the document scroll. */
.aiP{position:fixed;z-index:35;left:0;right:0;top:0;height:var(--aivh,100dvh);transform:translate3d(0,var(--aivt,0px),0);display:flex;flex-direction:column;
  background:var(--bg);color:var(--text);overscroll-behavior:none;contain:layout paint;
  opacity:0;translate:0 14px;transition:opacity .2s ease,translate .22s ease}
.aiP[hidden]{display:none}
.aiP.on{opacity:1;translate:0 0}
body.calm .aiP{transition:none}
@media (min-width:900px){ .aiB{font-size:16px} }            /* big screens: the conversation stays in a centred column (the paddings below) */
.aiHd{flex:none;display:flex;align-items:center;gap:6px;padding:max(10px,env(safe-area-inset-top)) max(10px,env(safe-area-inset-right),calc((100% - 840px) / 2)) 10px max(10px,env(safe-area-inset-left),calc((100% - 840px) / 2));color:var(--on-accent,#fff);
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
.aiFt{flex:none;padding:8px max(10px,env(safe-area-inset-right),calc((100% - 840px) / 2)) calc(8px + env(safe-area-inset-bottom)) max(10px,env(safe-area-inset-left),calc((100% - 840px) / 2));border-top:1px solid var(--line);background:color-mix(in srgb,var(--card) 92%,var(--bg))}
.aiP.aiKb .aiFt{padding-bottom:8px}                      /* the keyboard covers the home-indicator area: no gap between the input and the keyboard */
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
.aiMs,.aiHs{padding-left:max(12px,env(safe-area-inset-left),calc((100% - 840px) / 2));padding-right:max(12px,env(safe-area-inset-right),calc((100% - 840px) / 2))}

/* long-press menu on a message */
.aiMnBg{position:absolute;inset:0;z-index:6;background:#0003}
.aiMn{position:absolute;z-index:7;min-width:200px;max-width:calc(100% - 16px);padding:6px;border-radius:16px;background:var(--card);border:1px solid var(--line);box-shadow:0 14px 40px #0006;display:flex;flex-direction:column}
.aiMi{display:flex;align-items:center;gap:12px;width:100%;padding:12px;border:0;border-radius:10px;background:none;color:var(--text);font:inherit;font-size:15px;text-align:start;cursor:pointer}
.aiMi:hover,.aiMi:focus-visible{background:var(--accent-soft);outline:none}
.aiMi svg{width:19px;height:19px;flex:none;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;color:var(--accent-t,var(--accent))}
.aiB.aiHold{outline:2px solid var(--accent);outline-offset:2px}
@media (hover:none){ .aiB{-webkit-touch-callout:none;-webkit-user-select:none;user-select:none} }
.aiB.aiSel{-webkit-user-select:text;user-select:text;-webkit-touch-callout:default}

/* confirm dialog (delete) */
.aiDlg{position:absolute;inset:0;z-index:8;display:grid;place-items:center;padding:20px;background:#0008}
.aiDlg[hidden]{display:none}
.aiDlgBox{width:min(340px,100%);padding:18px;border-radius:18px;background:var(--card);border:1px solid var(--line);box-shadow:0 20px 50px #0007}
.aiDlgBox p{margin:0 0 16px;line-height:1.5;font-size:15.5px}
.aiDlgBtns{display:flex;gap:8px;justify-content:flex-end}
.aiDlgBtns button{padding:10px 18px;border-radius:12px;border:1px solid var(--line);background:var(--bg);color:var(--text);font:inherit;font-weight:650;cursor:pointer}
.aiDlgBtns .danger{background:var(--err);border-color:var(--err);color:#fff}

/* history: a delete button on every row, and "delete all" */
.aiHt{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:8px 2px 4px;color:var(--muted);font-size:13.5px}
.aiLink{border:0;background:none;color:var(--err);font:inherit;font-weight:700;cursor:pointer;padding:6px 4px}
.aiHrow{display:flex;align-items:stretch;border-bottom:1px solid var(--line)}
.aiHrow .aiHr{border-bottom:0;flex:1;min-width:0}
.aiHdel{flex:none;width:46px;border:0;border-radius:10px;background:none;color:var(--muted);display:grid;place-items:center;cursor:pointer}
.aiHdel:hover,.aiHdel:focus-visible{color:var(--err);background:color-mix(in srgb,var(--err) 10%,transparent)}
.aiHdel svg{width:19px;height:19px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}

/* a file the AI sends: a card with a download button */
.aiFile{display:flex;align-items:center;gap:10px;width:100%;max-width:340px;margin:6px 0 2px;padding:10px 12px;border-radius:14px;border:1px solid var(--line);
  background:color-mix(in srgb,var(--accent) 8%,var(--card));color:var(--text);font:inherit;text-align:start;cursor:pointer}
.aiFile:hover,.aiFile:focus-visible{border-color:var(--accent)}
.aiFile .aiFi{flex:none;width:38px;height:38px;border-radius:10px;display:grid;place-items:center;background:var(--accent);color:var(--on-accent,#fff)}
.aiFile .aiFi svg{width:21px;height:21px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.aiFile .aiFn{flex:1;min-width:0;font-weight:650;font-size:14.5px;overflow-wrap:anywhere}
.aiFile .aiFd{flex:none;font-size:12.5px;font-weight:800;color:var(--accent-t,var(--accent))}
.aiFile.busy{opacity:.7;cursor:progress}.aiFile.err .aiFd{color:var(--err)}

/* little room left (a phone with the keyboard open, a phone on its side): the chrome gets smaller so the conversation keeps the space */
.aiP.aiKb .aiNt,.aiP.aiCompact .aiNt{display:none}
.aiP.aiCompact .aiHd{padding-top:max(6px,env(safe-area-inset-top));padding-bottom:6px}
.aiP.aiCompact .aiHb{width:36px;height:36px}.aiP.aiCompact .aiTt small{display:none}
.aiP.aiCompact .aiAv{width:32px;height:32px}.aiP.aiCompact .aiAv svg{width:23px;height:23px}
.aiP.aiCompact .aiMs{padding-top:8px;gap:8px}
.aiP.aiCompact .aiHi{padding:6px 10px;gap:6px}.aiP.aiCompact .aiHi .aiBig,.aiP.aiCompact .aiHi p{display:none}
.aiP.aiCompact .aiHi h2{font-size:19px;margin:0}.aiP.aiCompact .aiSug{margin-top:2px;gap:6px}.aiP.aiCompact .aiSug button{padding:8px 12px}
.aiP.aiCompact .aiFt{padding-top:6px}.aiP.aiCompact .aiIn textarea{min-height:40px;max-height:96px;padding:9px 13px}
.aiP.aiCompact .aiSd{width:40px;height:40px}
.aiP.aiTiny .aiTt .aiTl,.aiP.aiTiny .aiHi .aiSug,.aiP.aiTiny .aiSt{display:none}.aiP.aiTiny .aiHd{padding-top:max(4px,env(safe-area-inset-top));padding-bottom:4px}
.aiP.aiTiny .aiHi h2{font-size:17px}
@media (max-width:359px){                                  /* the narrowest phones (320, a folded foldable) */
  .aiHb{width:36px;height:36px}.aiHd{gap:2px}.aiTt{gap:6px}.aiTt b{font-size:15px}.aiB{max-width:92%;padding:8px 11px;font-size:14.5px}
  .aiM{gap:6px}.aiM .aiAv{width:26px;height:26px}.aiM .aiAv svg{width:18px;height:18px}.aiSug button{font-size:14px}
}
@media (pointer:coarse){ .aiHb{width:44px;height:44px} .aiP.aiCompact .aiHb{width:40px;height:40px} }


/* ---- opening animation: the circle grows out of the button to a black screen, the face grows into it, winks and smiles; it stays until the chat is ready ---- */
.aiP.aiIntro{opacity:1;translate:0 0;transition:none;background:transparent}
.aiP.aiIntro > :not(.aiSplash){visibility:hidden}
.aiSplash{position:absolute;inset:0;z-index:9;overflow:hidden}
.aiSplash[hidden]{display:none}
.aiSplash.aiCovered{background:#050507}
.aiGrow{position:absolute;left:calc(var(--aicx,50%) - var(--aigr,29px));top:calc(var(--aicy,90%) - var(--aigr,29px));width:calc(var(--aigr,29px) * 2);height:calc(var(--aigr,29px) * 2);border-radius:50%;
  background:linear-gradient(145deg,var(--accent),color-mix(in srgb,var(--accent) 45%,#7b5cff));animation:aiGrow .5s cubic-bezier(.55,0,.2,1) both;will-change:transform}
.aiGrow::after{content:"";position:absolute;inset:0;border-radius:50%;background:#050507;animation:aiDarken .5s ease-in both}
.aiGrow > svg{position:absolute;inset:16%;width:68%;height:68%;overflow:visible;animation:aiFadeQuick .22s ease-out both}
@keyframes aiGrow{from{transform:scale(1)}to{transform:scale(var(--ais,20))}}
@keyframes aiDarken{0%,22%{opacity:0}100%{opacity:1}}
@keyframes aiFadeQuick{to{opacity:0;transform:scale(.8)}}
.aiSpl{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:20px}
.aiGlow{position:absolute;width:min(78vw,380px);aspect-ratio:1;border-radius:50%;opacity:0;animation:aiGlowIn .9s .3s ease-out both;
  background:radial-gradient(circle,color-mix(in srgb,var(--accent) 50%,transparent) 0%,transparent 66%)}
.aiFaceBig{position:relative;width:clamp(120px,34vw,176px);aspect-ratio:1;opacity:0;animation:aiFaceIn .62s .32s ease-out both,aiBreathe 3.2s 1.1s ease-in-out infinite;
  filter:drop-shadow(0 0 26px color-mix(in srgb,var(--accent) 65%,transparent))}
.aiFaceBig svg{width:100%;height:100%;display:block;overflow:visible}
.aiSplTx{position:relative;min-height:1.4em;max-width:80%;text-align:center;color:#ffffffa6;font-size:14px;line-height:1.4;opacity:0;transition:opacity .35s}
.aiSplTx.on{opacity:1}
@keyframes aiFaceIn{0%{opacity:0;transform:scale(.25) rotate(-10deg)}55%{opacity:1;transform:scale(1.12) rotate(3deg)}100%{opacity:1;transform:scale(1) rotate(0)}}
@keyframes aiGlowIn{from{opacity:0;transform:scale(.5)}to{opacity:1;transform:scale(1)}}
@keyframes aiBreathe{0%,100%{scale:1}50%{scale:1.045}}
/* the face's life: both eyes blink now and then; the wink closes the right eye and lifts the smile, with a little tilt and a twinkle */
.aiSplash .aiEye,.aiSplash .aiSmile{transform-box:fill-box;transform-origin:center}
.aiSplash .aiEye{animation:aiBlink 3.6s 1.5s infinite}
.aiSplash.aiWink .aiEyeR{animation:aiWinkEye .66s ease-in-out both}
.aiSplash.aiWink .aiSmile{animation:aiWinkSmile .66s ease-in-out both}
.aiSplash.aiWink .aiFaceBig svg{transform-origin:50% 60%;animation:aiTilt .66s ease-in-out both}
html .aiSplash.aiWink .aiSpark{animation:aiPop .66s ease-out both}
@keyframes aiBlink{0%,92%,100%{transform:scaleY(1)}96%{transform:scaleY(.1)}}
@keyframes aiWinkEye{0%{transform:scaleY(1)}30%,72%{transform:scaleY(.1) translateY(.5px)}100%{transform:scaleY(1)}}
@keyframes aiWinkSmile{0%{transform:none}30%,72%{transform:scale(1.18,1.14) translateY(-.4px)}100%{transform:none}}
@keyframes aiTilt{0%,100%{transform:rotate(0)}32%,70%{transform:rotate(-5deg)}}
@keyframes aiPop{0%{transform:scale(1) rotate(0)}40%{transform:scale(1.9) rotate(25deg)}100%{transform:scale(1) rotate(0)}}
.aiSplash.aiOut{animation:aiSplOut .34s ease-in forwards}
.aiSplash.aiOut .aiSpl{animation:aiSplZoom .34s ease-in forwards}
@keyframes aiSplOut{to{opacity:0}}
@keyframes aiSplZoom{to{transform:scale(1.14)}}
@media (prefers-reduced-motion:reduce){ .aiSplash *{animation:none!important} }

/* ---- the dead face: when something is wrong ---- */
.aiDeadFace .aiBub{fill:#ffe4e4}
.aiDeadFace .aiX,.aiDeadFace .aiMouth{fill:none;stroke:#e03131;stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round}
.aiDeadFace .aiTongue{fill:#ff8787}
.aiFaceBig .aiDeadFace{position:absolute;inset:0;opacity:0;transition:opacity .2s}
.aiSpl::before{content:"";position:absolute;inset:0;background:radial-gradient(circle at 50% 46%,#4d0f15 0%,transparent 68%);opacity:0;transition:opacity .4s}
.aiSplash.aiBad .aiSpl::before{opacity:1}
.aiSplash.aiBad .aiFaceBig > svg:first-child{opacity:0;transition:opacity .15s}
.aiSplash.aiBad .aiFaceBig .aiDeadFace{opacity:1}
.aiSplash.aiBad .aiFaceBig{opacity:1;animation:aiDeadShake .75s both;filter:drop-shadow(0 0 28px #ff4d4d99)}
.aiSplash.aiBad .aiGlow{background:radial-gradient(circle,#ff4d4d66 0%,transparent 66%);animation:none;opacity:1}
.aiSplash.aiBad .aiSplTx{color:#ffffffb3}
.aiSplTx b{display:block;margin-bottom:4px;font-size:19px;color:#fff}
@keyframes aiDeadShake{0%{transform:scale(1) rotate(0)}15%{transform:translateX(-10px) rotate(-6deg)}30%{transform:translateX(9px) rotate(5deg)}45%{transform:translateX(-6px) rotate(-3deg)}60%{transform:translateX(4px)}100%{transform:scale(.96) rotate(7deg) translateY(4px)}}

/* ---- closing: the black circle shrinks back into the button, and the app comes back around it ---- */
.aiSplash.aiClosing{background:transparent}
.aiSplash.aiClosing .aiSpl{animation:aiFadeOutQ .16s ease-out forwards}
.aiSplash.aiClosing .aiGrow{transform:scale(var(--ais,20));animation:aiShrink .66s cubic-bezier(.5,0,.2,1) both}
.aiSplash.aiClosing .aiGrow::after{animation:aiLighten .66s ease-out both}
.aiSplash.aiClosing .aiGrow > svg{animation:aiFaceBack .66s ease-out both}
.aiSplash.aiClosing.aiFromBlack .aiGrow{animation-name:aiShrinkB}
@keyframes aiShrink{0%{transform:scale(var(--ais,20));opacity:0}20%{transform:scale(var(--ais,20));opacity:1}100%{transform:scale(1);opacity:1}}
@keyframes aiShrinkB{0%,10%{transform:scale(var(--ais,20));opacity:1}100%{transform:scale(1);opacity:1}}
@keyframes aiLighten{0%,35%{opacity:1}100%{opacity:0}}
@keyframes aiFaceBack{0%,55%{opacity:0;transform:scale(.6)}100%{opacity:1;transform:none}}
@keyframes aiFadeOutQ{to{opacity:0}}
body:not(.calm) #aiFab.aiPop{animation:aiFabPop .55s cubic-bezier(.34,1.56,.64,1) both,aiFloat 3.8s .55s ease-in-out infinite}
@keyframes aiFabPop{from{scale:.2;opacity:0}to{scale:1;opacity:1}}

/* ---- life: nearly everything in the chat moves a little ---- */
/* messages rise into place (the one you send rises out of the input bar), the answer fills in and settles with a little glow */
.aiP:not(.aiIntro) .aiM.aiIn{animation:aiMsgIn .45s cubic-bezier(.2,.9,.25,1.12) both;animation-delay:var(--ad,0ms)}
.aiP:not(.aiIntro) .aiM.aiIn .aiAv{animation:aiAvPop .5s calc(var(--ad,0ms) + 120ms) cubic-bezier(.34,1.56,.64,1) both}
.aiP:not(.aiIntro) .aiM.aiIn.aiPend .aiAv{animation:aiAvPop .5s calc(var(--ad,0ms) + 120ms) cubic-bezier(.34,1.56,.64,1) both,aiThink 1.1s calc(var(--ad,0ms) + 700ms) ease-in-out infinite}
@keyframes aiMsgIn{from{opacity:0;transform:translateY(var(--fy,18px)) scale(.72)}50%{opacity:1}to{opacity:1;transform:none}}
@keyframes aiAvPop{from{opacity:0;transform:scale(.2) rotate(-25deg)}to{opacity:1;transform:none}}
.aiM.aiPend .aiAv{animation:aiThink 1.1s ease-in-out infinite}
.aiP.aiBusy .aiHd .aiAv{animation:aiThink 1s ease-in-out infinite}
@keyframes aiThink{0%,100%{transform:translateY(0) rotate(0)}30%{transform:translateY(-3px) rotate(-6deg)}65%{transform:translateY(0) rotate(5deg)}}
.aiB.aiFill{animation:aiFill .3s ease-out}
@keyframes aiFill{from{opacity:.35;transform:scale(.95)}to{opacity:1;transform:none}}
.aiCaret{display:inline-block;width:7px;height:7px;margin-inline-start:5px;border-radius:50%;background:var(--accent);vertical-align:middle;animation:aiPulse .9s ease-in-out infinite}
@keyframes aiPulse{0%,100%{opacity:.25;transform:scale(.7)}50%{opacity:1;transform:scale(1.15)}}
.aiM.aiDone .aiAv{animation:aiHappy .7s ease-out}
.aiM.aiDone .aiB{animation:aiGlowRing 1s ease-out}
@keyframes aiHappy{0%{transform:scale(1)}30%{transform:scale(1.3) rotate(-10deg)}60%{transform:scale(.94) rotate(6deg)}100%{transform:none}}
@keyframes aiGlowRing{0%{box-shadow:0 0 0 0 color-mix(in srgb,var(--accent) 50%,transparent)}100%{box-shadow:0 0 0 14px transparent}}
.aiM.aiBad .aiAv{background:linear-gradient(145deg,#ff6b6b,#c92a2a);animation:aiDeadIn .6s ease-out both}
.aiM.aiBad .aiB{border-color:var(--err);background:color-mix(in srgb,var(--err) 9%,var(--card));animation:aiShake .55s}
@keyframes aiShake{0%,100%{translate:0}18%{translate:-7px}36%{translate:6px}54%{translate:-4px}72%{translate:3px}}
@keyframes aiDeadIn{0%{transform:scale(.6) rotate(-20deg)}50%{transform:scale(1.2) rotate(10deg)}100%{transform:none}}
/* the greeting comes in piece by piece; the faces blink now and then */
.aiP:not(.aiIntro) .aiHi .aiBig{animation:aiPopIn .65s cubic-bezier(.34,1.56,.64,1) both}
.aiP:not(.aiIntro) .aiHi h2{animation:aiUp .5s .12s ease-out both}
.aiP:not(.aiIntro) .aiHi p{animation:aiUp .5s .2s ease-out both}
.aiP:not(.aiIntro) .aiSug button{animation:aiUp .5s ease-out backwards}
.aiP:not(.aiIntro) .aiSug button:nth-child(1){animation-delay:.28s}
.aiP:not(.aiIntro) .aiSug button:nth-child(2){animation-delay:.35s}
.aiP:not(.aiIntro) .aiSug button:nth-child(3){animation-delay:.42s}
@keyframes aiUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
@keyframes aiPopIn{from{opacity:0;transform:scale(.4) rotate(-12deg)}to{opacity:1;transform:none}}
.aiHi .aiEye,.aiHd .aiEye{transform-box:fill-box;transform-origin:center;animation:aiBlink 4.4s 2s infinite}
/* buttons answer your finger */
.aiSug button,.aiHb,.aiSd,.aiMi,.aiFile,.aiHdel,.aiLink,.aiDlgBtns button,.aiErr button{transition:transform .12s ease,background-color .15s,border-color .15s,opacity .2s}
.aiSug button:active,.aiHb:active,.aiSd:active,.aiMi:active,.aiFile:active,.aiHdel:active,.aiDlgBtns button:active{transform:scale(.94)}
.aiSd.aiSwap svg{animation:aiIconPop .32s cubic-bezier(.34,1.56,.64,1)}
@keyframes aiIconPop{from{opacity:0;transform:scale(.3) rotate(-90deg)}to{opacity:1;transform:none}}
.aiIn textarea{transition:border-color .15s,box-shadow .15s}
/* menu, dialog */
.aiMnBg,.aiDlg{animation:aiFadeIn .17s ease-out}
.aiMn{animation:aiPop2 .2s cubic-bezier(.34,1.3,.64,1);transform-origin:var(--mo,50% 0)}
.aiDlgBox{animation:aiPop2 .24s cubic-bezier(.34,1.3,.64,1)}
@keyframes aiFadeIn{from{opacity:0}to{opacity:1}}
@keyframes aiPop2{from{opacity:0;transform:scale(.9) translateY(8px)}to{opacity:1;transform:none}}
/* history: rows come in one after the other and fold away when deleted */
.aiHrow{max-height:96px;overflow:hidden}
.aiP:not(.aiIntro) .aiHrow{animation:aiUp .35s ease-out backwards;animation-delay:calc(var(--i,0) * 40ms)}
.aiP .aiHrow.aiGone{animation:aiRowOut .3s ease-in forwards;animation-delay:calc(var(--i,0) * 40ms)}
@keyframes aiRowOut{to{opacity:0;transform:translateX(24px);max-height:0;border-bottom-width:0}}
.aiHe{animation:aiFadeUp .3s ease-out}
.aiP:not(.aiIntro) .aiMs.aiSwap{animation:aiFadeUp .24s ease-out}
@keyframes aiFadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
/* files */
.aiFile{animation:aiUp .4s ease-out backwards}
.aiFile.busy .aiFi svg{animation:aiSpin .9s linear infinite}
.aiFile.ok .aiFi{background:var(--ok,#2b8a3e);animation:aiIconPop .4s cubic-bezier(.34,1.56,.64,1)}
@keyframes aiSpin{to{transform:rotate(360deg)}}
@media (prefers-reduced-motion:reduce){ .aiP *,#aiFab{animation:none!important;transition:none!important} }
`;

  /* ------------------------------------------------------------ small pieces */
  const FACE = '<svg class="aiFace" viewBox="0 0 40 40" aria-hidden="true" focusable="false">' +
    '<path class="aiBub" d="M10 9h20a6 6 0 0 1 6 6v10a6 6 0 0 1-6 6H21l-6.2 5.1a.8.8 0 0 1-1.3-.6V31H10a6 6 0 0 1-6-6V15a6 6 0 0 1 6-6z"/>' +
    '<ellipse class="aiEye aiEyeL" cx="14.8" cy="19" rx="2.1" ry="2.7"/><ellipse class="aiEye aiEyeR" cx="25.2" cy="19" rx="2.1" ry="2.7"/>' +
    '<path class="aiSmile" d="M15.3 24.4q4.7 3.8 9.4 0"/>' +
    '<path class="aiSpark" d="M33.5 1.5l1.5 3.9 3.9 1.5-3.9 1.5-1.5 3.9-1.5-3.9-3.9-1.5 3.9-1.5z"/></svg>';
  // the "dead" face (X eyes, a wobbly mouth, the tongue out): shown when something is wrong
  const FACE_DEAD = '<svg class="aiFace aiDeadFace" viewBox="0 0 40 40" aria-hidden="true" focusable="false">' +
    '<path class="aiBub" d="M10 9h20a6 6 0 0 1 6 6v10a6 6 0 0 1-6 6H21l-6.2 5.1a.8.8 0 0 1-1.3-.6V31H10a6 6 0 0 1-6-6V15a6 6 0 0 1 6-6z"/>' +
    '<path class="aiX" d="M12.4 16.4l4.8 4.8M17.2 16.4l-4.8 4.8M22.8 16.4l4.8 4.8M27.6 16.4l-4.8 4.8"/>' +
    '<path class="aiMouth" d="M14.6 26.2q1.6-2.4 3.2 0t3.2 0 3.2 0"/><path class="aiTongue" d="M22.2 26.4v2.2a1.5 1.5 0 0 0 3 0v-2.2z"/></svg>';
  const I_X = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>';
  const I_HIST = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l3 2"/></svg>';
  const I_NEW = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/></svg>';
  const I_BACK = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
  const I_SEND = '<svg class="aiSendI" viewBox="0 0 24 24" aria-hidden="true"><path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4z"/></svg>';
  const I_STOP = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect class="aiStopI" x="6" y="6" width="12" height="12" rx="2.5"/></svg>';

  const I_TRASH = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M6 6l1 14h10l1-14"/><path d="M10 11v6M14 11v6"/></svg>';
  const I_COPY = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1"/></svg>';
  const I_SHARE = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.6 10.5l6.8-4M8.6 13.5l6.8 4"/></svg>';
  const I_SELECT = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7V5a1 1 0 0 1 1-1h2M17 4h2a1 1 0 0 1 1 1v2M20 17v2a1 1 0 0 1-1 1h-2M7 20H5a1 1 0 0 1-1-1v-2"/><path d="M8 12h8"/></svg>';
  const I_FILE = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/><path d="M12 11v6M9 14l3 3 3-3"/></svg>';

  const esc2 = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  /* a small, safe markdown: everything is escaped first, then **bold**, `code`, lists, headings, http(s) links */
  function inline(s) {
    return esc2(s)
      .replace(/`([^`]+)`/g, "<code>$1</code>")
      .replace(/\*\*([^*]+)\*\*/g, "<b>$1</b>")
      .replace(/(^|[\s(])\*([^*\s][^*]*?)\*(?=[\s).,!?:;]|$)/g, "$1<i>$2</i>")
      .replace(/https?:\/\/[^\s<]*[^\s<.,;:!?)\]]/g, u => '<a href="' + u + '" target="_blank" rel="noopener noreferrer">' + u + "</a>");
  }
  // [[file:REF|name]] is how the server's file tool lets the AI hand a file over; it becomes a download card. The REF is only a path inside Moodle - no token.
  const FILE_RE = /\[\[file:([A-Za-z0-9_-]{4,1700})\|([^\]\n]{1,120})\]\]/g;
  const fileCard = (ref, name) => '<button type="button" class="aiFile" data-ref="' + esc2(ref) + '" data-name="' + esc2(name) + '" aria-label="' + esc2(tx("dl") + " " + name) + '">' +
    '<span class="aiFi">' + I_FILE + '</span><span class="aiFn" dir="auto">' + esc2(name) + '</span><span class="aiFd">' + esc2(tx("dl")) + "</span></button>";
  const plain = s => String(s).replace(FILE_RE, (m, r, n) => "📎 " + n);                       // for copy and share

  function md(src) {
    const files = [];
    src = String(src).replace(/\[\[[^\]]*$/, "")                                                // a marker still being typed by the stream: not shown yet
      .replace(FILE_RE, (m, ref, name) => { files.push([ref, name]); return "\u0001" + (files.length - 1) + "\u0001"; });
    const html = md1(src);
    return files.length ? html.replace(/\u0001(\d+)\u0001/g, (m, i) => fileCard(files[i][0], files[i][1])) : html;
  }
  function md1(src) {
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
  let fab = null, panel = null, splash = null, intro = null, ms = null, input = null, sendBtn = null, statusEl = null, titleEl = null, histBtn = null, histMode = false;
  let animFrom = Infinity, loadAnimN = 0, closing = false, loadFail = null;
  let msgs = [], conv = null, busy = false, ctl = null, gen = 0, curBub = null, pushed = false, skipPop = 0, lastPending = "";

  const left = () => LS.set("aiLeft", Date.now());
  const sessName = () => { const s = LS.get("aiSess", null); return s && s.name ? s.name : ""; };

  /* ------------------------------------------------------------ rendering */
  function bubble(role, content, opts) {
    const row = document.createElement("div"); row.className = "aiM " + (role === "user" ? "me" : "ai");
    if (opts && opts.bad) row.classList.add("aiBad");
    if (opts && opts.pending && !content) row.classList.add("aiPend");
    if (role !== "user") { const av = document.createElement("div"); av.className = "aiAv"; av.innerHTML = opts && opts.bad ? FACE_DEAD : FACE; row.appendChild(av); }
    const b = document.createElement("div"); b.className = "aiB"; b.dir = "auto";
    if (role === "user") b.textContent = content;
    else if (opts && opts.pending && !content) b.innerHTML = '<span class="aiDots" aria-label="…"><i></i><i></i><i></i></span>';
    else b.innerHTML = md(content);
    if (!(opts && opts.pending && !content)) { b.tabIndex = 0; b.setAttribute("aria-haspopup", "menu"); }   // reachable from the keyboard (the Menu key opens the same menu)
    row.appendChild(b);
    return { row, b };
  }

  function greeting() {
    const n = sessName();
    const sug = ["s1", "s2", "s3"].map(k => '<button type="button" data-q="' + esc2(tx(k)) + '">' + esc2(tx(k)) + "</button>").join("");
    return '<div class="aiHi"><div class="aiBig">' + FACE + "</div><h2>" + esc2(n ? tx("hello", n) : tx("helloNo")) + "</h2><p>" + esc2(tx("intro")) +
      '</p><div class="aiSug">' + sug + "</div></div>";
  }

  const wait = d => new Promise(r => setTimeout(r, d));
  function swapAnim() { ms.classList.remove("aiSwap"); void ms.offsetWidth; ms.classList.add("aiSwap"); }   // a soft change of what the list shows

  function renderMsgs() {
    const fromHist = histMode;
    histMode = false; setMode();
    ms.innerHTML = ""; curBub = null;
    if (!msgs.length) { ms.innerHTML = greeting(); animFrom = Infinity; loadAnimN = 0; return; }
    const sent = animFrom !== Infinity;                                   // just sent: the new messages rise in
    const from = sent ? animFrom : (loadAnimN ? Math.max(0, msgs.length - loadAnimN) : Infinity);   // just opened: the last few come in one by one
    msgs.forEach((m, i) => {
      const { row, b } = bubble(m.role, m.content, { pending: m.pending, bad: !!m.err });
      row.dataset.i = i;
      if (i >= from && !(sent && m.role === "user")) {                    // (the sent message is started by send(), from the input bar)
        row.classList.add("aiIn"); row.style.setProperty("--ad", ((i - from) * (sent ? 170 : 45)) + "ms"); if (!sent) row.style.setProperty("--fy", "12px");
      }
      if (m.justDone) { row.classList.add("aiDone"); m.justDone = false; }  // the answer has just arrived
      if (m.err) addErr(b, m, i === msgs.length - 1);
      if (busy && i === msgs.length - 1 && m.role !== "user") curBub = b;
      ms.appendChild(row);
    });
    animFrom = Infinity; loadAnimN = 0;
    if (fromHist) swapAnim();
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
    const was = busy; busy = b;
    if (panel) panel.classList.toggle("aiBusy", b);
    if (sendBtn && was !== b) { sendBtn.classList.remove("aiSwap"); void sendBtn.offsetWidth; sendBtn.classList.add("aiSwap"); setTimeout(() => sendBtn.classList.remove("aiSwap"), 360); }
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
      loadAnimN = 8; renderMsgs();
    } catch (e) {
      if (my !== gen) return;
      loadFail = e instanceof AiErr ? e : new AiErr("net");
      ms.innerHTML = ""; const d = document.createElement("div"); d.className = "aiHe";
      d.append(document.createTextNode((e instanceof AiErr ? errText(e) : tx("errLoad")) + " "));
      const r = document.createElement("button"); r.type = "button"; r.className = "aiHr"; r.style.width = "auto"; r.textContent = tx("retry"); r.onclick = () => loadConv(id); d.appendChild(r);
      ms.appendChild(d);
    } finally { clearTimeout(wake); }
  }

  function startNew() {
    closeMenu();
    gen++; if (ctl) { ctl.abort(); } msgs = []; conv = null; LS.del("aiConv"); setBusy(false); setStatus("");
    renderMsgs();
  }

  async function openHistory() {
    const my = ++gen; histMode = true; setMode(); closeMenu();
    ms.innerHTML = '<div class="aiHe">' + esc2(tx("connecting")) + "</div>";
    try {
      const res = await call("/api/conversations");
      if (my !== gen) return;
      if (!res.ok) throw new AiErr(errKind(res));
      const list = ((await res.json()).conversations || []).filter(c => c && c.id);
      ms.innerHTML = "";
      if (!list.length) { ms.innerHTML = '<div class="aiHe">' + esc2(tx("histEmpty")) + "</div>"; return; }
      const wrap = document.createElement("div"); wrap.className = "aiHs"; wrap.style.cssText = "padding-top:0;padding-bottom:0;flex:none";
      const bar = document.createElement("div"); bar.className = "aiHt";
      const cnt = document.createElement("span"); cnt.textContent = tx("histCount", list.length);
      const all = document.createElement("button"); all.type = "button"; all.className = "aiLink"; all.textContent = tx("delAll"); all.onclick = () => deleteAll();
      bar.append(cnt, all); wrap.appendChild(bar);
      const loc = lang() === "he" ? "he-IL" : lang() === "fr" ? "fr-FR" : "en-GB";
      for (const c of list) {
        const row = document.createElement("div"); row.className = "aiHrow"; row.dataset.id = c.id; row.style.setProperty("--i", Math.min(list.indexOf(c), 9));
        const r = document.createElement("button"); r.type = "button"; r.className = "aiHr" + (c.id === conv ? " on" : "");
        const title = c.title && c.title !== "שיחה חדשה" ? c.title : tx("histNone");
        const when = new Date(c.updated_at || c.created_at);
        const b = document.createElement("b"); b.textContent = title; b.dir = "auto";
        const sm = document.createElement("small"); sm.textContent = isNaN(when) ? "" : when.toLocaleString(loc, { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
        r.append(b, sm); r.onclick = () => { if (c.id === conv && msgs.length) { renderMsgs(); } else loadConv(c.id); };
        const del = document.createElement("button"); del.type = "button"; del.className = "aiHdel"; del.innerHTML = I_TRASH;
        del.setAttribute("aria-label", tx("delOne") + ": " + title); del.title = tx("delOne"); del.onclick = () => deleteOne(c.id);
        row.append(r, del); wrap.appendChild(row);
      }
      ms.appendChild(wrap); swapAnim();
    } catch (e) {
      if (my !== gen) return;
      ms.innerHTML = '<div class="aiHe">' + esc2(errText(e)) + "</div>";
    }
  }

  /* ------------------------------------------------------------ deleting history */
  // our own confirm box (not window.confirm: it blocks the page and looks foreign); "cancel" has the focus, so a stray Enter deletes nothing
  function confirmDlg(message, okLabel) {
    return new Promise(res => {
      const d = panel.querySelector(".aiDlg"), ok = d.querySelector("[data-ok]"), no = d.querySelector("[data-no]");
      d.querySelector("p").textContent = message; ok.textContent = okLabel; no.textContent = tx("cancel");
      const done = v => { d.hidden = true; d.onkeydown = d.onclick = ok.onclick = no.onclick = null; res(v); try { histBtn.focus({ preventScroll: true }); } catch (e) {} };
      ok.onclick = () => done(true); no.onclick = () => done(false);
      d.onclick = e => { if (e.target === d) done(false); };
      d.onkeydown = e => { if (e.key === "Escape") { e.stopPropagation(); done(false); } };
      d.hidden = false; try { no.focus({ preventScroll: true }); } catch (e) {}
    });
  }

  function dropCurrent() {                    // the open conversation was deleted
    gen++; if (ctl) ctl.abort(); msgs = []; conv = null; LS.del("aiConv"); setBusy(false); setStatus("");
  }

  async function deleteOne(id) {
    if (!(await confirmDlg(tx("delOneQ"), tx("delOk")))) return;
    try {
      const res = await call("/api/conversations/" + encodeURIComponent(id), { method: "DELETE" });
      if (!res.ok && res.status !== 404) throw new AiErr(errKind(res));
    } catch (e) { toast(errText(e), 3500); return; }
    if (id === conv) dropCurrent();
    toast(tx("deleted"), 1800);
    const row = histMode ? ms.querySelector('.aiHrow[data-id="' + id + '"]') : null;
    if (!row) { openHistory(); return; }
    row.classList.add("aiGone"); await wait(340); row.remove(); afterHistChange();      // the row folds away, the count follows
  }

  function afterHistChange() {
    const n = ms.querySelectorAll(".aiHrow").length;
    if (!n) { ms.innerHTML = '<div class="aiHe">' + esc2(tx("histEmpty")) + "</div>"; return; }
    const c = ms.querySelector(".aiHt span"); if (c) c.textContent = tx("histCount", n);
  }

  async function deleteAll() {
    if (!(await confirmDlg(tx("delAllQ"), tx("delOk")))) return;
    try {
      const res = await call("/api/conversations", { method: "DELETE" });
      if (!res.ok) throw new AiErr(errKind(res));
    } catch (e) { toast(errText(e), 3500); return; }
    dropCurrent(); LS.del("aiLeft");
    toast(tx("deleted"), 1800);
    const rows = histMode ? [...ms.querySelectorAll(".aiHrow")] : [];
    if (!rows.length) { openHistory(); return; }
    rows.forEach((r, i) => { r.style.setProperty("--i", Math.min(i, 8)); r.classList.add("aiGone"); });
    await wait(340 + Math.min(rows.length, 9) * 40); ms.innerHTML = '<div class="aiHe">' + esc2(tx("histEmpty")) + "</div>";
  }

  /* ------------------------------------------------------------ long-press menu on a message (copy, share, select, edit and resend) */
  let menuEl = null, menuBg = null, menuFor = null, holdT = 0, holdXY = [0, 0];
  const cancelHold = () => { clearTimeout(holdT); holdT = 0; };

  function closeMenu() {
    cancelHold();
    if (menuEl) { menuEl.remove(); menuEl = null; }
    if (menuBg) { menuBg.remove(); menuBg = null; }
    if (menuFor) { menuFor.classList.remove("aiHold"); menuFor = null; }
  }

  async function copyText(t) {
    try { await navigator.clipboard.writeText(t); return true; } catch (e) {}
    try {                                      // older browsers / no permission: the classic way
      const ta = document.createElement("textarea"); ta.value = t; ta.readOnly = true; ta.style.cssText = "position:fixed;top:0;left:0;width:1px;height:1px;opacity:.01;font-size:16px";
      panel.appendChild(ta); ta.select(); ta.setSelectionRange(0, t.length); const ok = document.execCommand("copy"); ta.remove(); return ok;
    } catch (e) { return false; }
  }

  function openMenu(b, x, y, byKey) {
    const row = b.closest(".aiM"), idx = row ? +row.dataset.i : -1, m = msgs[idx];
    if (!m || m.pending || !String(m.content || "").trim()) return;
    closeMenu();
    const text = plain(m.content);
    const items = [{ id: "copy", icon: I_COPY, label: tx("copy") }];
    if (navigator.share) items.push({ id: "share", icon: I_SHARE, label: tx("share") });
    items.push({ id: "select", icon: I_SELECT, label: tx("selectTxt") });
    if (m.role === "user") items.push({ id: "reuse", icon: I_NEW, label: tx("reuse") });

    menuBg = document.createElement("div"); menuBg.className = "aiMnBg"; menuBg.onclick = closeMenu;
    menuEl = document.createElement("div"); menuEl.className = "aiMn"; menuEl.setAttribute("role", "menu"); menuEl.setAttribute("aria-label", tx("msgMenu"));
    for (const it of items) {
      const bt = document.createElement("button"); bt.type = "button"; bt.className = "aiMi"; bt.setAttribute("role", "menuitem"); bt.innerHTML = it.icon + "<span></span>";
      bt.lastChild.textContent = it.label;
      bt.onclick = async () => {
        closeMenu();
        if (it.id === "copy") toast((await copyText(text)) ? tx("copied") : tx("errGen"), 1600);
        else if (it.id === "share") { try { await navigator.share({ text }); } catch (e) {} }
        else if (it.id === "select") { b.classList.add("aiSel"); const r = document.createRange(); r.selectNodeContents(b); const s = getSelection(); s.removeAllRanges(); s.addRange(r); }
        else if (it.id === "reuse") { input.value = String(m.content); input.dispatchEvent(new Event("input")); try { input.focus(); input.setSelectionRange(input.value.length, input.value.length); } catch (e) {} }
      };
      menuEl.appendChild(bt);
    }
    menuEl.addEventListener("keydown", e => {
      const btns = [...menuEl.querySelectorAll(".aiMi")], i = btns.indexOf(document.activeElement);
      if (e.key === "Escape") { e.stopPropagation(); const back = b; closeMenu(); try { back.focus({ preventScroll: true }); } catch (er) {} }
      else if (e.key === "ArrowDown") { e.preventDefault(); btns[(i + 1) % btns.length].focus(); }
      else if (e.key === "ArrowUp") { e.preventDefault(); btns[(i - 1 + btns.length) % btns.length].focus(); }
    });
    panel.append(menuBg, menuEl); menuFor = b; b.classList.add("aiHold");

    // the menu sits next to the message: below it if there is room, else above it, else in the middle; always inside the screen
    const P = panel.getBoundingClientRect(), B = b.getBoundingClientRect(), mw = menuEl.offsetWidth, mh = menuEl.offsetHeight, gap = 8;
    const cx = byKey ? (B.left + B.right) / 2 : x;
    const left = Math.min(Math.max(cx - P.left - mw / 2, gap), Math.max(gap, P.width - mw - gap));
    let top;
    if (B.bottom + gap + mh <= P.bottom - gap) top = B.bottom + gap - P.top;
    else if (B.top - gap - mh >= P.top + gap) top = B.top - gap - mh - P.top;
    else top = Math.max(gap, (P.height - mh) / 2);
    menuEl.style.left = Math.round(left) + "px"; menuEl.style.top = Math.round(top) + "px"; menuEl.style.setProperty("--mo", top < B.top - P.top ? "50% 100%" : "50% 0");
    try { menuEl.querySelector(".aiMi").focus({ preventScroll: true }); } catch (e) {}
  }

  /* ------------------------------------------------------------ files the AI sends */
  const fileErrText = e => tx(e && e.kind === "moodle" ? "errMoodle" : e && e.kind === "rate" ? "errRate" : e && e.kind === "nofile" ? "fileGone" : e && e.kind === "big" ? "fileBig" : e && e.kind === "net" ? "errNet" : "fileErr");

  async function downloadFile(btn) {
    if (btn.classList.contains("busy")) return;
    const ref = btn.dataset.ref, name = (btn.dataset.name || "file").replace(/[\\/:*?"<>|\r\n]+/g, "_");
    const lab = btn.querySelector(".aiFd");
    btn.classList.add("busy"); btn.classList.remove("err"); lab.textContent = tx("dling");
    try {
      if (!M.token) throw new AiErr("moodle");
      const res = await call("/api/moodle/file", { method: "POST", timeout: 120000, body: { ref, moodle_token: M.token } });   // the token goes in the body, never in an address
      if (!res.ok) throw new AiErr(res.status === 403 ? "moodle" : res.status === 429 ? "rate" : res.status === 404 ? "nofile" : res.status === 413 ? "big" : res.status >= 500 ? "net" : "gen");
      const blob = await res.blob();
      const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
      let shared = false;
      if (ios && navigator.canShare && typeof File === "function") {            // iPhone/iPad: the share sheet is where "Save to Files" lives
        const f = new File([blob], name, { type: blob.type });
        if (navigator.canShare({ files: [f] })) { try { await navigator.share({ files: [f], title: name }); shared = true; } catch (e) { if (e && e.name === "AbortError") shared = true; } }
      }
      if (!shared) {
        const url = URL.createObjectURL(blob), a = document.createElement("a");
        a.href = url; a.download = name; a.rel = "noopener"; panel.appendChild(a); a.click(); a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 60000);
      }
      btn.classList.add("ok"); lab.textContent = "✓"; setTimeout(() => { btn.classList.remove("ok"); lab.textContent = tx("dl"); }, 1800);
    } catch (e) { btn.classList.add("err"); lab.textContent = tx("retry"); if (typeof toast === "function") toast(fileErrText(e), 4000); }
    finally { btn.classList.remove("busy"); }
  }

  /* ------------------------------------------------------------ sending */
  async function send(text) {
    text = String(text || "").trim().slice(0, 2000);
    if (!text || busy) return;
    gen++;                                    // a pending history/load result must not overwrite the chat now
    histMode = false; setMode();
    lastPending = text;
    const from = input.getBoundingClientRect();            // where the message starts its way up
    input.value = ""; input.style.height = "auto";
    animFrom = msgs.length;
    msgs.push({ role: "user", content: text });
    const ai = { role: "assistant", content: "", pending: true }; msgs.push(ai);
    setBusy(true); renderMsgs(); busy = true; curBub = ms.lastElementChild.querySelector(".aiB");
    const ur = ms.children[msgs.length - 2];
    // the rise starts at the input bar, but never more than 280px below the message (a short chat must not make it fly across the screen)
    if (ur) { ur.style.setProperty("--fy", Math.min(280, Math.max(0, Math.round(from.top - ur.getBoundingClientRect().top))) + "px"); void ur.offsetWidth; ur.classList.add("aiIn"); }
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
      const withCaret = h => /(<\/(?:p|li)>)((?:<\/(?:ul|ol)>)?)$/.test(h) ? h.replace(/(<\/(?:p|li)>)((?:<\/(?:ul|ol)>)?)$/, '<span class="aiCaret"></span>$1$2') : h + '<span class="aiCaret"></span>';
      const upd = () => {
        const first = ai.pending; ai.pending = false;
        if (curBub) {
          curBub.innerHTML = withCaret(md(ai.content)) || curBub.innerHTML;
          if (first) { const r = curBub.closest(".aiM"); if (r) r.classList.remove("aiPend"); curBub.classList.remove("aiFill"); void curBub.offsetWidth; curBub.classList.add("aiFill"); }   // the dots turn into the answer
          scrollEnd(false);
        }
      };
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
      if (!ai.err && ai.content && ai.content.trim()) ai.justDone = true;
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
  /* The keyboard. What the browsers do (researched): iOS Safari and Chrome on Android (since 108) leave the page's own size alone and shrink only the
     "visual viewport" (the part of the screen still visible), and iOS may also pan it; Firefox and some others resize the page itself. So the one
     reliable source is the visual viewport: the window takes its height and follows its offset (and, for a floating window, sits above the covered
     bottom). The page behind is locked so the browser never scrolls it to "reveal" the input, and the message list keeps the same messages next to
     the input while it shrinks, so the bubbles stay right above the keyboard and nothing jumps. */
  let baseH = 0, baseW = 0, lastKey = "", kbWas = false, vvOverride = null, fitRaf = 0, kbIntent = false, locked = false, lockY = 0, restoreY = null, bodyStyle = null;
  const vvp = () => vvOverride || window.visualViewport;
  const scheduleFit = () => { if (!fitRaf) fitRaf = requestAnimationFrame(() => { fitRaf = 0; fit(); }); };
  // browsers report the keyboard in several steps (and iOS late): look again a few times after it moves
  const fitSoon = () => { scheduleFit(); [120, 350, 800].forEach(d => setTimeout(scheduleFit, d)); };

  function keepBottom(fn) {              // run fn (which changes sizes) and keep the same messages next to the input
    const dist = ms.scrollHeight - ms.scrollTop - ms.clientHeight;
    fn();
    ms.scrollTop = Math.max(0, ms.scrollHeight - ms.clientHeight - dist);
  }

  function fit(force) {
    if (!panel || panel.hidden) return;
    const vv = vvp(), ih = innerHeight;
    const ok = vv && (vv.scale || 1) < 1.05;                   // pinch-zoomed in: that is not the keyboard, ignore it
    const vh = Math.round(ok ? vv.height : ih), off = Math.round(ok ? vv.offsetTop : 0), vw = Math.round(vv ? vv.width : innerWidth);
    const focused = document.activeElement === input;
    if (!baseH || Math.abs(vw - baseW) > 40) { baseH = Math.max(vh, ih); baseW = vw; }          // first time, or the phone was turned
    else if (vh > baseH || (!focused && !kbWas)) baseH = vh;                                      // the tallest the area was without the keyboard
    const inset = Math.max(0, Math.round(ih - (off + vh)));                                        // how much of the bottom is covered
    const kb = focused && (baseH - vh > 120 || inset > 120);
    kbWas = kb;
    const key = vh + "|" + off + "|" + inset + "|" + kb;
    if (key === lastKey && !force) return;
    lastKey = key;
    keepBottom(() => {
      const s = panel.style;
      s.setProperty("--aivh", vh + "px"); s.setProperty("--aivt", off + "px"); s.setProperty("--aikb", inset + "px");
      panel.classList.toggle("aiKb", kb); panel.classList.toggle("aiCompact", vh < 470); panel.classList.toggle("aiTiny", vh < 300);
    });
  }

  const needLock = () => true;               // the chat is a screen of its own on every device, so the page behind is always locked
  function lockPage() {
    if (locked || !needLock()) return;
    locked = true; lockY = window.scrollY || 0;
    const b = document.body; bodyStyle = b.getAttribute("style");
    b.style.position = "fixed"; b.style.top = -lockY + "px"; b.style.left = "0"; b.style.right = "0"; b.style.width = "100%";
    document.documentElement.style.overflow = "hidden";
  }
  function unlockPage() {
    if (!locked) return;
    locked = false; const b = document.body;
    if (bodyStyle === null) b.removeAttribute("style"); else b.setAttribute("style", bodyStyle);
    document.documentElement.style.overflow = "";
    restoreY = lockY; restoreScroll();
  }
  // the browser can put the page back to a scroll position it saved at the wrong moment (during "back"): say it again, after it is done
  function restoreScroll() {
    if (restoreY === null) return;
    const y = restoreY, go = () => { if (!locked) window.scrollTo({ top: y, left: 0, behavior: "instant" }); };
    go(); setTimeout(go, 60); setTimeout(() => { go(); if (!panel || panel.hidden) restoreY = null; }, 350);
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
      '<button type="button" class="aiSd"></button></div><div class="aiNt"></div></div>' +
      '<div class="aiDlg" hidden role="alertdialog" aria-modal="true"><div class="aiDlgBox"><p></p><div class="aiDlgBtns"><button type="button" data-no></button><button type="button" class="danger" data-ok></button></div></div></div>' +
      '<div class="aiSplash" hidden aria-hidden="true"><div class="aiGrow">' + FACE + '</div><div class="aiSpl"><div class="aiGlow"></div><div class="aiFaceBig">' + FACE + FACE_DEAD + '</div><div class="aiSplTx"></div></div></div>';
    document.body.appendChild(panel);
    ms = panel.querySelector(".aiMs"); input = panel.querySelector("textarea"); sendBtn = panel.querySelector(".aiSd");
    splash = panel.querySelector(".aiSplash"); statusEl = panel.querySelector(".aiSt"); titleEl = panel.querySelector(".aiTt .aiTl"); histBtn = panel.querySelector('[data-a="hist"]');

    panel.querySelector('[data-a="close"]').onclick = () => close();
    histBtn.onclick = () => (histMode ? renderMsgs() : openHistory());
    panel.querySelector('[data-a="new"]').onclick = () => { startNew(); if (matchMedia("(hover:hover)").matches) input.focus(); };
    // sending must not close the keyboard: remember if it was up, keep the focus where it is, and put it back after the send
    sendBtn.addEventListener("pointerdown", () => { kbIntent = document.activeElement === input; });
    sendBtn.addEventListener("mousedown", e => e.preventDefault());
    sendBtn.onclick = () => { const had = kbIntent; kbIntent = false; if (busy) { ctl && ctl.abort(); } else send(input.value); if (had) try { input.focus({ preventScroll: true }); } catch (e) {} };
    input.oninput = () => {
      keepBottom(() => { input.style.height = "auto"; input.style.height = Math.min(input.scrollHeight, panel.classList.contains("aiCompact") ? 96 : 132) + "px"; });
      if (!busy) sendBtn.disabled = !input.value.trim();
    };
    input.addEventListener("focus", fitSoon); input.addEventListener("blur", fitSoon);
    input.setAttribute("autocomplete", "off"); input.setAttribute("autocapitalize", "sentences");
    // dragging on the header or the input bar must not pan the page behind; the message list and the text box keep their own scrolling
    panel.addEventListener("touchmove", e => { if (!e.target.closest(".aiMs,.aiHs,textarea,pre")) e.preventDefault(); }, { passive: false });
    input.onkeydown = e => { if (e.key === "Enter" && !e.shiftKey && !e.isComposing && matchMedia("(hover:hover)").matches) { e.preventDefault(); if (!busy) send(input.value); } };
    ms.addEventListener("click", e => {
      const f = e.target.closest(".aiFile"); if (f) { downloadFile(f); return; }
      const q = e.target.closest("[data-q]"); if (q) send(q.dataset.q);
    });
    // long press on a message (touch) or right click / the Menu key (computer) opens the message menu; moving the finger (scrolling) cancels it
    ms.addEventListener("pointerdown", e => {
      closeMenu();
      if (e.pointerType === "mouse" || e.button !== 0 || e.target.closest(".aiFile,a,.aiErr button")) return;
      const b = e.target.closest(".aiB"); if (!b) return;
      holdXY = [e.clientX, e.clientY];
      holdT = setTimeout(() => { holdT = 0; try { navigator.vibrate && navigator.vibrate(12); } catch (er) {} openMenu(b, holdXY[0], holdXY[1]); }, 450);
    });
    ms.addEventListener("pointermove", e => { if (holdT && Math.hypot(e.clientX - holdXY[0], e.clientY - holdXY[1]) > 10) cancelHold(); });
    ["pointerup", "pointercancel", "pointerleave"].forEach(t => ms.addEventListener(t, cancelHold));
    ms.addEventListener("scroll", () => { cancelHold(); if (menuEl) closeMenu(); }, { passive: true });
    ms.addEventListener("contextmenu", e => {
      const b = e.target.closest(".aiB"); if (!b) return;
      e.preventDefault(); if (menuEl) return;
      openMenu(b, e.clientX, e.clientY, e.clientX === 0 && e.clientY === 0);
    });
    document.addEventListener("pointerdown", e => { if (panel && !e.target.closest(".aiB")) document.querySelectorAll(".aiB.aiSel").forEach(x => x.classList.remove("aiSel")); }, true);
    panel.addEventListener("keydown", e => { if (e.key === "Escape") { e.stopPropagation(); close(); } });
    if (window.visualViewport) { visualViewport.addEventListener("resize", scheduleFit); visualViewport.addEventListener("scroll", scheduleFit); }
    addEventListener("resize", scheduleFit); addEventListener("orientationchange", fitSoon);
    document.addEventListener("visibilitychange", () => { if (!document.hidden) fitSoon(); });
    // leaving the page counts as leaving the chat: the one-hour rule runs from the last time the student was in it
    document.addEventListener("visibilitychange", () => { if (document.hidden && panel && !panel.hidden) left(); });
    addEventListener("pagehide", () => { if (panel && !panel.hidden) left(); });
    // the phone's back button closes the chat instead of leaving the app
    addEventListener("popstate", e => {
      if (skipPop > 0) { skipPop--; e.stopImmediatePropagation(); restoreScroll(); return; }
      if (pushed && panel && !panel.hidden) { pushed = false; e.stopImmediatePropagation(); close(true); restoreScroll(); }
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

  /* ------------------------------------------------------------ the opening animation
     0 - 0.5s   the circle of the button grows over the screen, turning black (the app behind is still seen until it is covered)
     0.3s       the face grows into the middle, with a glow; it breathes and blinks
     ~1s        it winks and smiles; after that it waits (with a short line of text if it takes long) until the chat is ready, then fades into the chat
     At least 1.35s in all, so the wink is always seen. With "calm" or reduced motion there is no animation at all. */
  const INTRO_MIN = 1350;
  const introAllowed = () => !document.body.classList.contains("calm") && !matchMedia("(prefers-reduced-motion: reduce)").matches;
  const setSplText = t => { const e = splash && splash.querySelector(".aiSplTx"); if (e) { e.textContent = t || ""; e.classList.toggle("on", !!t); } };
  const setSplErr = (title, why) => { const e = splash && splash.querySelector(".aiSplTx"); if (e) { e.innerHTML = "<b>" + esc2(title) + "</b><span>" + esc2(why) + "</span>"; e.classList.add("on"); } };

  function startIntro(fr) {
    if (!introAllowed() || !splash) return null;
    panel.classList.add("aiIntro");                         // first (it removes the small slide-in offset), then measure
    const P = panel.getBoundingClientRect();
    const cx = fr && fr.width ? fr.left + fr.width / 2 - P.left : P.width - 44, cy = fr && fr.height ? fr.top + fr.height / 2 - P.top : P.height - 110;
    const gr = Math.max(20, fr && fr.width ? fr.width / 2 : 29);
    const R = Math.hypot(Math.max(cx, P.width - cx), Math.max(cy, P.height - cy)) + 8;
    const s = panel.style;
    s.setProperty("--aicx", Math.round(cx) + "px"); s.setProperty("--aicy", Math.round(cy) + "px"); s.setProperty("--aigr", gr + "px"); s.setProperty("--ais", (R / gr).toFixed(2));
    setSplText(""); splash.className = "aiSplash"; splash.hidden = false;
    const it = { t0: performance.now(), timers: [] };
    const at = (ms, fn) => it.timers.push(setTimeout(fn, ms));
    at(480, () => { splash.classList.add("aiCovered"); document.documentElement.classList.add("aiOn"); });     // covered: now the app behind can be turned off
    at(980, () => splash.classList.add("aiWink")); at(980 + 700, () => splash.classList.remove("aiWink"));
    at(2800, () => setSplText(tx("connecting"))); at(7000, () => setSplText(tx("wake")));
    return it;
  }

  function clearIntro() {
    if (intro) { intro.timers.forEach(clearTimeout); intro = null; }
    if (splash) { splash.hidden = true; splash.className = "aiSplash"; }
    if (panel) panel.classList.remove("aiIntro");
  }

  function failIntro(it, e) {                // no internet / a server error: a red dead face, "something is not right", then the screen shrinks away
    return new Promise(res => {
      setTimeout(() => {
        if (intro !== it) return res();       // closed in the meantime
        it.failed = true; it.timers.forEach(clearTimeout);
        document.documentElement.classList.add("aiOn"); splash.classList.add("aiCovered", "aiBad");
        const why = errText(e); setSplErr(tx("errTitle"), why);
        it.timers = [setTimeout(() => { if (intro === it) { close(false, false); setTimeout(() => { if (typeof toast === "function") toast(why, 4200); }, 700); } res(); }, 2600)];
      }, Math.max(0, 1000 - (performance.now() - it.t0)));     // the face is seen first, then it falls ill
    });
  }

  function finishIntro(it) {                  // resolves when the chat is on screen
    return new Promise(res => {
      if (!it) return res();
      setTimeout(() => {
        if (intro !== it) return res();       // closed in the meantime
        it.timers.forEach(clearTimeout); document.documentElement.classList.add("aiOn");
        splash.classList.add("aiOut"); panel.classList.add("on"); panel.classList.remove("aiIntro");
        setTimeout(() => { if (intro === it) { intro = null; splash.hidden = true; splash.className = "aiSplash"; } }, 360);
        res();
      }, Math.max(0, INTRO_MIN - (performance.now() - it.t0)));
    });
  }

  async function open() {
    build(); if (closing) return;
    if (!M.token) { if (typeof toast === "function") toast(tx("errMoodle"), 3500); return; }
    applyTexts();
    const fr = fab.getBoundingClientRect();                     // where the circle is, before it is hidden
    panel.hidden = false; fab.hidden = true;
    // the history entry first (the browser saves the page's scroll position for the old entry now), only then lock the page
    if (!pushed) { try { history.pushState({ v: typeof V !== "undefined" ? V.view : "", ai: 1 }, ""); pushed = true; } catch (e) {} }
    lockPage(); baseH = 0; lastKey = ""; kbWas = false; fit(true); fitSoon();
    intro = startIntro(fr);
    if (!intro) { document.documentElement.classList.add("aiOn"); void panel.offsetWidth; panel.classList.add("on"); }   // no animation: just there (not requestAnimationFrame, which is paused in some background states)
    const my = intro;
    let fail = null;
    try { fail = await openLoad(); } catch (e) { fail = e; }
    if (fail && my) { await failIntro(my, fail); return; }
    await finishIntro(my);
    if (matchMedia("(hover:hover)").matches) input.focus();
  }

  async function openLoad() {                 // what the chat needs before it can be shown; returns what went wrong, or null
    const sid = LS.get("aiConv", null), lf = LS.get("aiLeft", 0);
    const recent = sid && lf && Date.now() - lf <= HOUR;
    if (busy || (recent && conv === sid && msgs.length)) { renderMsgs(); return null; }    // still in memory: no waiting
    ms.innerHTML = '<div class="aiHe">' + esc2(tx("connecting")) + "</div>";
    try { await ensureSession(false); }
    catch (e) { ms.innerHTML = '<div class="aiHe">' + esc2(errText(e)) + "</div>"; return e; }
    if (recent) { loadFail = null; await loadConv(sid); if (loadFail) return loadFail; } else startNew();   // an hour or more away: a new conversation
    return null;
  }

  function teardown() {                       // the visual part of closing, all at once
    clearIntro(); panel.classList.remove("on", "aiIntro"); panel.hidden = true;
    document.documentElement.classList.remove("aiOn");        // the app is turned back on
    unlockPage();
    if (fab) { fab.style.visibility = ""; fab.hidden = false; }
  }

  // closing, with the animation: a black circle covers the chat (0.14s), the chat is turned off and the app comes back around it, and the circle shrinks into the button, which pops up
  function shrinkClose(fromBlack) {
    closing = true;
    if (intro) { intro.timers.forEach(clearTimeout); intro = null; }
    fab.style.visibility = "hidden"; fab.hidden = false;      // (to measure where it is)
    const fr = fab.getBoundingClientRect(), P = panel.getBoundingClientRect();
    const cx = fr.width ? fr.left + fr.width / 2 - P.left : P.width - 44, cy = fr.height ? fr.top + fr.height / 2 - P.top : P.height - 110, gr = Math.max(20, fr.width ? fr.width / 2 : 29);
    const R = Math.hypot(Math.max(cx, P.width - cx), Math.max(cy, P.height - cy)) + 8, st = panel.style;
    st.setProperty("--aicx", Math.round(cx) + "px"); st.setProperty("--aicy", Math.round(cy) + "px"); st.setProperty("--aigr", gr + "px"); st.setProperty("--ais", (R / gr).toFixed(2));
    splash.hidden = false; splash.className = "aiSplash aiClosing" + (fromBlack ? " aiFromBlack" : "");
    const cover = fromBlack ? 60 : 140;
    setTimeout(() => { panel.classList.add("aiIntro"); document.documentElement.classList.remove("aiOn"); unlockPage(); }, cover);
    setTimeout(() => {
      panel.classList.remove("on", "aiIntro"); panel.hidden = true; splash.hidden = true; splash.className = "aiSplash";
      fab.style.visibility = ""; fab.classList.remove("aiPop"); void fab.offsetWidth; fab.classList.add("aiPop"); setTimeout(() => fab.classList.remove("aiPop"), 800);
      try { fab.focus({ preventScroll: true }); } catch (e) {}
      closing = false;
    }, cover + 560);
  }

  function close(fromPop, instant) {
    if (!panel || panel.hidden || closing) return;
    left();
    try { if (document.activeElement === input) input.blur(); } catch (e) {}
    closeMenu(); const dlg = panel.querySelector(".aiDlg"); if (dlg) dlg.hidden = true;
    const failed = !!(intro && intro.failed), midIntro = !!(intro && !intro.failed);      // closed while the opening animation still plays: no fuss, just close
    const animate = !instant && !midIntro && introAllowed() && !!fab && !!splash;
    if (pushed && !fromPop) { pushed = false; skipPop++; try { history.back(); } catch (e) { skipPop = 0; } }
    pushed = false;
    if (animate) { shrinkClose(failed); return; }
    teardown();
    if (fab && !fab.hidden) try { fab.focus({ preventScroll: true }); } catch (e) {}
  }

  window.AIChat = {
    show() { build(); const l = tx("title"); fab.setAttribute("aria-label", l); fab.title = l; if (panel.hidden) fab.hidden = false; },
    hide() { if (fab) fab.hidden = true; if (panel && !panel.hidden) close(false, true); },
    open,
    // for tests only: pretend the visible area is something else (a keyboard of a given size), then re-measure
    _vv(v) { vvOverride = v || null; baseH = 0; lastKey = ""; kbWas = false; fit(true); },
    _fit() { fit(true); },
  };
})();
