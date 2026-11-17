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
      title: "עוזר AI", sub: "מבוסס בינה מלאכותית", hello: n => "שלום " + n, helloNo: "שלום",
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
      stSend: "שולח את הבקשה", stWait: "ממתין לתשובה מהשרת", stKb: "מחפש במאגר הידע של המכללה", stThink: "חושב מה צריך לעשות", stWrite: "כותב את התשובה",
      stMemAdd: "שומר בזיכרון", stMemDel: "מוחק מהזיכרון", tlGeneric: "פונה ל-Moodle",
      tl_get_my_courses: () => "מושך את רשימת הקורסים שלך מ-Moodle", tl_get_course_assignments: a => a ? "בודק מטלות ומועדי הגשה בקורס " + a : "בודק מטלות ומועדי הגשה",
      tl_get_course_grades: a => a ? "בודק את הציונים שלך בקורס " + a : "בודק את הציונים שלך", tl_get_calendar_events: () => "קורא את היומן שלך ב-Moodle",
      tl_get_course_content: a => a ? "קורא את התוכן של הקורס " + a : "קורא את תוכן הקורס", tl_get_course_files: (a, d) => (a ? "מחפש קבצים בקורס " + a : "מחפש קבצים") + (d ? " (" + d + ")" : ""),
      tl_get_assignment_submission_status: a => a ? "בודק סטטוס הגשה בקורס " + a : "בודק סטטוס הגשה", tl_get_upcoming_deadlines: () => "בודק מה דחוף בכל הקורסים",
      tl_get_overall_grades: () => "מושך סקירת ציונים כללית", tl_get_quiz_attempts: a => a ? "בודק ניסיונות במבחן מקוון בקורס " + a : "בודק ניסיונות במבחן מקוון",
      tl_get_completion_status: a => a ? "בודק מה כבר השלמת בקורס " + a : "בודק מה כבר השלמת", tl_remember_about_student: () => "שומר בזיכרון", tl_forget_about_student: () => "מוחק מהזיכרון",
      memBtn: "זיכרון", memTitle: "מה אני זוכר עליך", memIntro: "אלה דברים שסיפרת לי, כדי שאוכל לעזור לך יותר טוב. הם נשמרים רק אצלך ואפשר למחוק כל אחד.",
      memEmpty: "עדיין לא זכרתי שום דבר עליך. אפשר לספר לי, למשל ״עזבתי את הקורס אלגברה״.", memSaved: "נשמר בזיכרון", memGone: "נמחק מהזיכרון", memUndo: "בטל", memUndone: "בוטל",
      memDelAll: "מחק את כל הזיכרון", memDelAllQ: "למחוק את כל מה שאני זוכר עליך? אי אפשר לשחזר.", memLeft: "עזבת", memDelOne: "מחק", memCount: n => n === 1 ? "דבר אחד" : n + " דברים",
      fileHint: "הקש להורדה", dlDone: "הורד", dlProg: (p, a, b) => p + "% · " + a + " מתוך " + b,
    },
    en: {
      title: "AI assistant", sub: "Powered by artificial intelligence", hello: n => "Hello " + n, helloNo: "Hello",
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
      stSend: "Sending your request", stWait: "Waiting for the server", stKb: "Searching the college’s knowledge base", stThink: "Working out what to do", stWrite: "Writing the answer",
      stMemAdd: "Saving to memory", stMemDel: "Removing from memory", tlGeneric: "Asking Moodle",
      tl_get_my_courses: () => "Fetching your course list from Moodle", tl_get_course_assignments: a => a ? "Checking assignments and deadlines in " + a : "Checking assignments and deadlines",
      tl_get_course_grades: a => a ? "Checking your grades in " + a : "Checking your grades", tl_get_calendar_events: () => "Reading your Moodle calendar",
      tl_get_course_content: a => a ? "Reading the content of " + a : "Reading the course content", tl_get_course_files: (a, d) => (a ? "Searching files in " + a : "Searching files") + (d ? " (" + d + ")" : ""),
      tl_get_assignment_submission_status: a => a ? "Checking submission status in " + a : "Checking submission status", tl_get_upcoming_deadlines: () => "Checking what is urgent in all courses",
      tl_get_overall_grades: () => "Fetching an overall grades summary", tl_get_quiz_attempts: a => a ? "Checking quiz attempts in " + a : "Checking quiz attempts",
      tl_get_completion_status: a => a ? "Checking what you completed in " + a : "Checking what you completed", tl_remember_about_student: () => "Saving to memory", tl_forget_about_student: () => "Removing from memory",
      memBtn: "Memory", memTitle: "What I remember about you", memIntro: "These are things you told me, so I can help you better. They are kept only for you and you can delete any of them.",
      memEmpty: "I haven’t remembered anything about you yet. You can tell me, for example “I left the Algebra course”.", memSaved: "Saved to memory", memGone: "Removed from memory", memUndo: "Undo", memUndone: "Undone",
      memDelAll: "Delete all memory", memDelAllQ: "Delete everything I remember about you? This can’t be undone.", memLeft: "Left", memDelOne: "Delete", memCount: n => n === 1 ? "1 item" : n + " items",
      fileHint: "Tap to download", dlDone: "Downloaded", dlProg: (p, a, b) => p + "% · " + a + " of " + b,
    },
    fr: {
      title: "Assistant IA", sub: "Propulsé par l’intelligence artificielle", hello: n => "Bonjour " + n, helloNo: "Bonjour",
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
      stSend: "Envoi de la demande", stWait: "Attente du serveur", stKb: "Recherche dans la base de connaissances du collège", stThink: "Je réfléchis à ce qu’il faut faire", stWrite: "Rédaction de la réponse",
      stMemAdd: "Enregistrement en mémoire", stMemDel: "Suppression de la mémoire", tlGeneric: "Question à Moodle",
      tl_get_my_courses: () => "Récupération de vos cours sur Moodle", tl_get_course_assignments: a => a ? "Vérification des devoirs et échéances de " + a : "Vérification des devoirs et échéances",
      tl_get_course_grades: a => a ? "Vérification de vos notes en " + a : "Vérification de vos notes", tl_get_calendar_events: () => "Lecture de votre calendrier Moodle",
      tl_get_course_content: a => a ? "Lecture du contenu de " + a : "Lecture du contenu du cours", tl_get_course_files: (a, d) => (a ? "Recherche de fichiers dans " + a : "Recherche de fichiers") + (d ? " (" + d + ")" : ""),
      tl_get_assignment_submission_status: a => a ? "Vérification du statut de remise dans " + a : "Vérification du statut de remise", tl_get_upcoming_deadlines: () => "Vérification de ce qui est urgent dans tous les cours",
      tl_get_overall_grades: () => "Récupération d’un résumé général des notes", tl_get_quiz_attempts: a => a ? "Vérification des tentatives de quiz dans " + a : "Vérification des tentatives de quiz",
      tl_get_completion_status: a => a ? "Vérification de ce que vous avez terminé dans " + a : "Vérification de ce que vous avez terminé", tl_remember_about_student: () => "Enregistrement en mémoire", tl_forget_about_student: () => "Suppression de la mémoire",
      memBtn: "Mémoire", memTitle: "Ce dont je me souviens", memIntro: "Ce sont des choses que vous m’avez dites, pour mieux vous aider. Elles ne sont gardées que pour vous et vous pouvez en supprimer.",
      memEmpty: "Je ne me souviens encore de rien à votre sujet. Vous pouvez me dire, par exemple « j’ai quitté le cours d’algèbre ».", memSaved: "Enregistré en mémoire", memGone: "Supprimé de la mémoire", memUndo: "Annuler", memUndone: "Annulé",
      memDelAll: "Supprimer toute la mémoire", memDelAllQ: "Supprimer tout ce dont je me souviens ? Cette action est irréversible.", memLeft: "Quitté", memDelOne: "Supprimer", memCount: n => n === 1 ? "1 élément" : n + " éléments",
      fileHint: "Touchez pour télécharger", dlDone: "Téléchargé", dlProg: (p, a, b) => p + " % · " + a + " sur " + b,
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
.aiMs{overflow-anchor:none;flex:1;min-height:0;overflow-y:auto;overscroll-behavior:contain;-webkit-overflow-scrolling:touch;padding:14px 12px 8px;display:flex;flex-direction:column;gap:12px}
.aiM{display:flex;gap:8px;align-items:flex-end;max-width:100%}
.aiM.me{align-self:flex-end}.aiM.ai{align-self:flex-start}
html[dir=rtl] .aiM.me{align-self:flex-start}
html[dir=rtl] .aiM.ai{align-self:flex-end;flex-direction:row-reverse}
.aiM .aiAv{width:30px;height:30px;background:linear-gradient(145deg,var(--accent),color-mix(in srgb,var(--accent) 45%,#7b5cff));box-shadow:0 3px 10px -2px color-mix(in srgb,var(--accent) 55%,transparent)}
.aiM .aiAv svg{width:21px;height:21px}.aiM .aiAv .aiTag{display:none}
.aiB{max-width:min(88%,560px);padding:10px 14px;border-radius:19px;line-height:1.55;font-size:15px;overflow-wrap:anywhere;text-wrap:pretty;box-shadow:0 1px 2px #0000001a,0 6px 16px -8px #0000004d}
.aiM.ai .aiB{background:linear-gradient(180deg,color-mix(in srgb,var(--card) 94%,#fff),var(--card));border:1px solid var(--line);border-bottom-left-radius:5px}
.aiM.me .aiB{background:linear-gradient(145deg,var(--accent),color-mix(in srgb,var(--accent) 74%,#7b5cff));color:var(--on-accent,#fff);border-bottom-right-radius:5px;white-space:pre-wrap}
.aiB strong{font-weight:750}
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
.aiPoll{margin-top:12px;padding:12px;border-radius:16px;border:1px solid var(--line);background:color-mix(in srgb,var(--accent) 7%,var(--card))}
.aiPq{font-weight:700;font-size:14.5px;margin-bottom:10px}
.aiPo{display:flex;flex-direction:column;gap:7px}
.aiPb{display:flex;align-items:center;gap:10px;width:100%;padding:10px 12px;border-radius:12px;border:1.5px solid var(--line);background:var(--card);color:var(--text);font:inherit;font-size:14.5px;text-align:start;cursor:pointer;
  transition:border-color .2s,background .2s,transform .15s}
.aiPb:active{transform:scale(.97)}
.aiPb i{flex:none;width:18px;height:18px;border-radius:50%;border:2px solid var(--muted);display:grid;place-items:center;transition:all .2s}
.aiPoll[data-multi="1"] .aiPb i{border-radius:6px}
.aiPb.on{border-color:var(--accent);background:color-mix(in srgb,var(--accent) 14%,var(--card))}
.aiPb.on i{background:var(--accent);border-color:var(--accent)}
.aiPb.on i::after{content:"";width:5px;height:9px;border:solid var(--on-accent,#fff);border-width:0 2px 2px 0;transform:rotate(45deg) translate(-1px,-1px)}
.aiPt{display:flex;gap:6px;margin-top:10px}
.aiPt input{flex:1;min-width:0;padding:9px 13px;border-radius:99px;border:1.5px solid var(--line);background:var(--bg);color:var(--text);font:inherit;font-size:16px}
.aiPt input:focus{outline:none;border-color:var(--accent)}
.aiPt button{flex:none;width:40px;height:40px;border-radius:50%;border:0;background:var(--accent);color:var(--on-accent,#fff);display:grid;place-items:center;cursor:pointer}
.aiPt button svg{width:18px;height:18px;fill:currentColor}
.aiPgo{margin-top:10px;padding:9px 18px;border-radius:99px;border:0;background:var(--accent);color:var(--on-accent,#fff);font:inherit;font-weight:700;font-size:14px;cursor:pointer;transition:opacity .2s,transform .15s}
.aiPgo:disabled{opacity:.35;cursor:default}
.aiPgo:not(:disabled):active{transform:scale(.95)}
.aiQuick{display:flex;flex-wrap:wrap;gap:8px;margin-top:10px}
.aiQuick button{padding:8px 16px;border-radius:99px;border:1.5px solid var(--accent);background:transparent;color:var(--accent-t,var(--accent));font:inherit;font-size:14px;font-weight:600;cursor:pointer;transition:background .2s,transform .15s}
.aiQuick button:active{transform:scale(.94)}
.aiQuick button.on{background:var(--accent);color:var(--on-accent,#fff)}
.aiUi{display:flex;flex-direction:column;gap:9px;min-width:min(76vw,320px)}
.aiUiT{font-weight:800;font-size:15px;margin:2px 2px -2px}
.aiTk{display:flex;align-items:stretch;border-radius:16px;overflow:hidden;background:var(--card);border:1px solid var(--line);position:relative}
.aiTkS{flex:none;width:58px;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:8px 0;color:var(--dc);background:color-mix(in srgb,var(--dc) 13%,transparent);
  border-inline-end:2px dashed color-mix(in srgb,var(--dc) 40%,transparent);position:relative}
.aiTkS b{font-size:25px;line-height:1;font-weight:850}.aiTkS small{font-size:11px;font-weight:700;opacity:.85}
.aiTkS::before,.aiTkS::after{content:"";position:absolute;inset-inline-end:-7px;width:12px;height:12px;border-radius:50%;background:var(--card);border:1px solid var(--line)}
.aiTkS::before{top:-7px}.aiTkS::after{bottom:-7px}
.aiTkB{flex:1;min-width:0;padding:9px 12px;display:flex;flex-direction:column;gap:2px}
.aiTkB b{font-size:14.5px;line-height:1.3;font-weight:700;overflow-wrap:anywhere}.aiTkB em{font-style:normal;font-size:12px;color:var(--muted)}
.aiTkT{display:flex;align-items:center;gap:10px;margin-top:5px}
.aiTkT span{flex:none;font-size:12.5px;font-weight:800;color:var(--dc)}
.aiTkBar{flex:1;height:5px;border-radius:99px;background:color-mix(in srgb,var(--dc) 16%,transparent);overflow:hidden;display:block}
.aiTkBar u{display:block;height:100%;width:calc(var(--u) * 100%);border-radius:inherit;background:var(--dc);text-decoration:none}
.aiTk.hot{border-color:color-mix(in srgb,var(--dc) 55%,var(--line))}
.aiTk.hot .aiTkS{background:var(--dc);color:#fff;border-inline-end-color:#fff8}
.aiTl{position:relative;padding-inline-start:20px}
.aiTl::before{content:"";position:absolute;inset-inline-start:5px;top:8px;bottom:8px;width:2px;border-radius:2px;background:linear-gradient(var(--accent),color-mix(in srgb,var(--accent) 15%,transparent))}
.aiTlD{margin-bottom:10px}
.aiTlH{position:relative;font-size:12.5px;font-weight:800;color:var(--accent-t,var(--accent));margin-bottom:5px}
.aiTlH i{position:absolute;inset-inline-start:-20px;top:3px;width:12px;height:12px;border-radius:50%;background:var(--card);border:3px solid var(--accent)}
.aiTlR{display:grid;grid-template-columns:1fr auto;gap:0 10px;align-items:baseline;padding:7px 10px;margin-bottom:5px;border-radius:12px;background:color-mix(in srgb,var(--dc) 9%,var(--card));border-inline-start:3px solid var(--dc)}
.aiTlR b{font-size:14px;line-height:1.3;font-weight:650;overflow-wrap:anywhere}.aiTlR small{grid-column:1;font-size:11.5px;color:var(--muted)}
.aiTlR span{grid-row:1/3;grid-column:2;font-size:13px;font-weight:800;color:var(--dc)}
.aiFc{display:flex;align-items:center;gap:14px;padding:14px;border-radius:20px;color:var(--text);background:linear-gradient(135deg,color-mix(in srgb,var(--dc) 24%,var(--card)),var(--card));border:1px solid color-mix(in srgb,var(--dc) 50%,var(--line))}
.aiFcN{flex:none;min-width:64px;text-align:center;color:var(--dc)}.aiFcN b{display:block;font-size:44px;line-height:.95;font-weight:900;letter-spacing:-.02em}.aiFcN small{font-size:12px;font-weight:800}
.aiFcX{min-width:0;display:flex;flex-direction:column;gap:2px}.aiFcX b{font-size:16px;line-height:1.3;overflow-wrap:anywhere}.aiFcX em{font-style:normal;font-size:12px;color:var(--muted)}.aiFcX span{font-size:13px;font-weight:800;color:var(--dc)}
.aiGgs{display:grid;grid-template-columns:repeat(auto-fill,minmax(84px,1fr));gap:10px}
.aiGg{position:relative;display:flex;flex-direction:column;align-items:center;gap:4px;padding:8px 4px}
.aiGg svg{width:68px;height:68px;transform:rotate(-90deg)}.aiGg circle{fill:none;stroke-width:6;stroke-linecap:round}
.aiGg .bg{stroke:color-mix(in srgb,var(--gc) 18%,transparent)}.aiGg .fg{stroke:var(--gc)}
.aiGg b{position:absolute;top:calc(8px + 34px);left:50%;transform:translate(-50%,-50%);font-size:15px;font-weight:850;color:var(--gc)}
.aiGg small{font-size:11.5px;color:var(--muted);text-align:center;line-height:1.25;overflow-wrap:anywhere}
.aiCh{display:flex;flex-wrap:wrap;gap:7px}.aiCh span{display:inline-flex;align-items:center;gap:7px;padding:6px 12px;border-radius:99px;font-size:13.5px;font-weight:600;background:color-mix(in srgb,var(--dc) 12%,var(--card));border:1px solid color-mix(in srgb,var(--dc) 35%,var(--line))}
.aiCh i{width:9px;height:9px;border-radius:50%;background:var(--dc)}
.aiLs>div{display:flex;justify-content:space-between;gap:10px;padding:8px 2px;border-bottom:1px solid var(--line);font-size:14px}.aiLs>div:last-child{border-bottom:0}.aiLs b{color:var(--accent-t,var(--accent))}
.aiCo{display:flex;gap:10px;align-items:flex-start;padding:11px 13px;border-radius:14px;font-size:14px;line-height:1.45;background:color-mix(in srgb,var(--cc) 11%,var(--card));border:1px solid color-mix(in srgb,var(--cc) 40%,var(--line))}
.aiCo{--cc:var(--accent)}.aiCo.warn{--cc:#e8590c}.aiCo.success{--cc:#22a55e}.aiCo.tip{--cc:#a855f7}
.aiCo svg{flex:none;width:21px;height:21px;fill:none;stroke:var(--cc);stroke-width:2;stroke-linecap:round;stroke-linejoin:round;margin-top:1px}
.aiCo b{display:block;margin-bottom:1px}
.aiSt{display:grid;grid-template-columns:repeat(auto-fit,minmax(70px,1fr));gap:8px}
.aiSt>div{text-align:center;padding:10px 4px;border-radius:14px;background:color-mix(in srgb,var(--accent) 9%,var(--card));border:1px solid var(--line)}
.aiSt b{display:block;font-size:24px;font-weight:900;color:var(--accent-t,var(--accent));line-height:1.1}.aiSt small{font-size:11.5px;color:var(--muted)}
.aiPr{display:flex;flex-direction:column;gap:10px}
.aiPrT{display:flex;justify-content:space-between;gap:10px;font-size:13.5px;margin-bottom:4px}.aiPrT b{font-weight:800}
.aiPr i{display:block;height:8px;border-radius:99px;background:color-mix(in srgb,var(--text) 10%,transparent);overflow:hidden}
.aiPr u{display:block;height:100%;border-radius:inherit;text-decoration:none;transition:width .6s}
.aiSp{margin:0;padding:0;list-style:none;counter-reset:s;display:flex;flex-direction:column;gap:7px}
.aiSp li{counter-increment:s;display:flex;gap:10px;align-items:flex-start;font-size:14.5px;line-height:1.4}
.aiSp li::before{content:counter(s);flex:none;width:22px;height:22px;border-radius:50%;display:grid;place-items:center;font-size:12px;font-weight:800;background:var(--accent);color:var(--on-accent,#fff)}
.aiLocked{opacity:.6}
.aiLocked button{cursor:default}
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
@media (hover:none){ .aiP{-webkit-touch-callout:none;-webkit-user-select:none;user-select:none} .aiP textarea,.aiP input{-webkit-user-select:text;user-select:text;-webkit-touch-callout:default} .aiB{-webkit-touch-callout:none;-webkit-user-select:none;user-select:none} }
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
/* the answer is re-drawn many times while it streams: cards inside it must not replay their entrance each time (that was the rattling) */
.aiB.aiStream .aiFile,.aiB.aiStream .aiPoll,.aiB.aiStream .aiQuick,.aiB.aiStream .aiMemChip{animation:none}
@keyframes aiFill{from{opacity:.4}to{opacity:1}}
.aiCaret{display:inline-block;width:7px;height:7px;margin-inline-start:5px;border-radius:50%;background:var(--accent);vertical-align:middle;animation:aiPulse .9s ease-in-out infinite}
@keyframes aiPulse{0%,100%{opacity:.25;transform:scale(.7)}50%{opacity:1;transform:scale(1.15)}}
.aiM.aiDone .aiAv{animation:aiHappy .7s ease-out}
.aiM.aiDone .aiB{animation:aiGlowRing 1s ease-out}
@keyframes aiHappy{0%{transform:scale(1)}30%{transform:scale(1.3) rotate(-10deg)}60%{transform:scale(.94) rotate(6deg)}100%{transform:none}}
@keyframes aiGlowRing{0%{box-shadow:0 0 0 0 color-mix(in srgb,var(--accent) 32%,transparent)}100%{box-shadow:0 0 0 8px transparent}}
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
@keyframes aiSpin{to{transform:rotate(360deg)}}

/* ---- what the bot is doing: a small list of steps in the waiting bubble ---- */
.aiAct{display:flex;align-items:center;gap:10px;min-width:170px;font-size:14px;line-height:1.35;animation:aiActIn .28s ease-out}
.aiAct.out{animation:aiActOut .17s ease-in forwards}
.aiAct .aiSi{flex:none;width:16px;height:16px;border-radius:50%;border:2.5px solid color-mix(in srgb,var(--accent) 22%,transparent);border-top-color:var(--accent);animation:aiSpin .8s linear infinite}
.aiAct span{min-width:0;overflow-wrap:anywhere}
@keyframes aiActIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
@keyframes aiActOut{to{opacity:0;transform:translateY(-8px)}}
/* the greeting's waving hand (drawn here) */
.aiHand{display:inline-block}
.aiHand .aiWave{width:1.05em;height:1.05em;vertical-align:-.17em;overflow:visible}
.aiHand .aiWaveHand{transform-origin:16px 28px}
.aiP:not(.aiIntro) .aiHand .aiWaveHand{animation:aiWaveHand 1.7s ease-in-out .7s 2}
@keyframes aiWaveHand{0%,80%,100%{transform:rotate(0)}12%{transform:rotate(18deg)}26%{transform:rotate(-10deg)}40%{transform:rotate(16deg)}54%{transform:rotate(-6deg)}68%{transform:rotate(8deg)}}
.aiHb.on{background:#ffffff38}
/* what the bot remembered, under the answer */
.aiMemChip{display:flex;align-items:center;gap:8px;margin-top:9px;padding:7px 10px;border-radius:12px;font-size:13px;line-height:1.35;cursor:pointer;
  background:color-mix(in srgb,var(--accent) 10%,var(--card));border:1px solid color-mix(in srgb,var(--accent) 30%,var(--line));animation:aiUp .4s ease-out backwards}
.aiMemChip.del{background:color-mix(in srgb,var(--warn,#e8590c) 10%,var(--card));border-color:color-mix(in srgb,var(--warn,#e8590c) 35%,var(--line))}
.aiMemChip.undone{opacity:.55;text-decoration:line-through;cursor:default}
.aiMemChip .aiMemI{flex:none;width:20px;height:20px;display:grid;place-items:center}
.aiMemChip .aiMemI svg{width:18px;height:18px;fill:none;stroke:var(--accent-t,var(--accent));stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.aiMemChip .aiMemT{flex:1;min-width:0;overflow-wrap:anywhere}
.aiMemChip button{flex:none;border:0;background:none;color:var(--accent-t,var(--accent));font:inherit;font-weight:700;cursor:pointer;padding:2px 4px}
/* the memory screen */
.aiMemIntro{margin:6px 2px 10px;color:var(--muted);font-size:14px;line-height:1.5}
.aiMemRow{display:flex;align-items:center;gap:10px;padding:11px 4px;border-bottom:1px solid var(--line);max-height:120px;overflow:hidden}
.aiMemRow .aiMemB{flex:none;padding:2px 8px;border-radius:99px;font-size:11.5px;font-weight:800;background:color-mix(in srgb,var(--warn,#e8590c) 16%,transparent);color:var(--warn,#e8590c)}
.aiMemRow .aiMemX{flex:1;min-width:0;overflow-wrap:anywhere;line-height:1.45}
.aiP:not(.aiIntro) .aiMemRow{animation:aiUp .35s ease-out backwards;animation-delay:calc(var(--i,0) * 35ms)}
.aiP .aiMemRow.aiGone{animation:aiRowOut .3s ease-in forwards}

/* ---- a file the AI sends: a real file card with a progress bar ---- */
.aiFile{display:flex;align-items:center;gap:12px;width:100%;max-width:370px;margin:9px 0 2px;padding:10px 12px;border-radius:16px;border:1px solid var(--line);
  background:color-mix(in srgb,var(--text) 4%,var(--card));color:var(--text);font:inherit;text-align:start;cursor:pointer;position:relative;overflow:hidden;
  transition:border-color .2s,box-shadow .2s,background-color .2s,transform .12s}
.aiFile[data-t=pdf]{--ft:#e5484d}.aiFile[data-t=doc]{--ft:#3b82f6}.aiFile[data-t=ppt]{--ft:#f97316}.aiFile[data-t=xls]{--ft:#22a55e}
.aiFile[data-t=zip]{--ft:#64748b}.aiFile[data-t=img]{--ft:#a855f7}.aiFile[data-t=code]{--ft:#14b8a6}
.aiFile:hover,.aiFile:focus-visible{border-color:color-mix(in srgb,var(--ft,var(--accent)) 65%,var(--line));box-shadow:0 5px 18px color-mix(in srgb,var(--ft,var(--accent)) 20%,transparent);outline:none}
.aiFile .aiFi{flex:none;width:44px;height:52px;border-radius:9px 16px 9px 9px;position:relative;display:grid;place-items:end center;padding-bottom:7px;color:#fff;
  background:linear-gradient(160deg,color-mix(in srgb,var(--ft,var(--accent)) 78%,#fff),var(--ft,var(--accent)));box-shadow:0 3px 9px color-mix(in srgb,var(--ft,var(--accent)) 38%,transparent)}
.aiFile .aiFi::before{content:"";position:absolute;top:0;right:0;width:14px;height:14px;border-radius:0 16px 0 7px;background:linear-gradient(225deg,var(--card) 50%,#ffffff66 50%)}
.aiFile .aiFi b{font-size:11.5px;letter-spacing:.04em;font-weight:800}
.aiFile .aiFx{flex:1;min-width:0;display:flex;flex-direction:column;gap:3px}
.aiFile .aiFn{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;overflow-wrap:anywhere;font-weight:650;font-size:14.5px;line-height:1.3}
.aiFile .aiFm{font-size:12.5px;color:var(--muted);line-height:1.3}
.aiFile .aiFp{height:4px;border-radius:99px;overflow:hidden;max-height:0;opacity:0;background:color-mix(in srgb,var(--ft,var(--accent)) 16%,transparent);transition:opacity .2s,max-height .2s,margin .2s}
.aiFile .aiFp i{display:block;height:100%;width:0;border-radius:inherit;background:var(--ft,var(--accent));transition:width .18s ease-out}
.aiFile.busy .aiFp{max-height:4px;opacity:1;margin-top:4px}
.aiFile.busy .aiFp.ind i{width:38%;animation:aiIndet 1.1s ease-in-out infinite}
@keyframes aiIndet{0%{margin-inline-start:-40%}100%{margin-inline-start:105%}}
.aiFile .aiFd{flex:none;width:42px;height:42px;border-radius:50%;display:grid;place-items:center;position:relative;color:var(--ft,var(--accent));
  background:color-mix(in srgb,var(--ft,var(--accent)) 14%,transparent);transition:background .2s,color .2s}
.aiFile .aiFd svg{width:21px;height:21px;fill:none;stroke:currentColor;stroke-width:2.3;stroke-linecap:round;stroke-linejoin:round}
.aiFile:hover .aiFd{background:var(--ft,var(--accent));color:#fff}
.aiFile.busy{cursor:progress}
.aiFile.busy .aiFd::after{content:"";position:absolute;inset:-3px;border-radius:50%;border:3px solid transparent;border-top-color:var(--ft,var(--accent));animation:aiSpin .8s linear infinite}
.aiFile.ok{border-color:#22a55e;background:color-mix(in srgb,#22a55e 8%,var(--card))}
.aiFile.ok .aiFd{background:#22a55e;color:#fff;animation:aiIconPop .4s cubic-bezier(.34,1.56,.64,1)}
.aiFile.ok .aiFd svg path{stroke-dasharray:30;stroke-dashoffset:30;animation:aiDraw .45s .1s ease-out forwards}
.aiFile.ok .aiFm{color:#22a55e;font-weight:650}
.aiFile.err{border-color:var(--err);background:color-mix(in srgb,var(--err) 7%,var(--card));animation:aiShake .5s}
.aiFile.err .aiFd{background:var(--err);color:#fff}.aiFile.err .aiFm{color:var(--err)}
@keyframes aiDraw{to{stroke-dashoffset:0}}
.aiLink.acc{color:var(--accent-t,var(--accent))}
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
  const FILE_RE = /\[\[file:([A-Za-z0-9_-]{4,1700})\|([^\]\n|]{1,120})(?:\|(\d{1,10}))?\]\]/g;
  const FTYPES = { pdf: ["PDF", "pdf"], doc: ["DOC", "doc"], docx: ["DOCX", "doc"], txt: ["TXT", "doc"], ppt: ["PPT", "ppt"], pptx: ["PPTX", "ppt"], xls: ["XLS", "xls"], xlsx: ["XLSX", "xls"], csv: ["CSV", "xls"],
    zip: ["ZIP", "zip"], rar: ["RAR", "zip"], "7z": ["7Z", "zip"], png: ["PNG", "img"], jpg: ["JPG", "img"], jpeg: ["JPG", "img"], gif: ["GIF", "img"], py: ["PY", "code"], java: ["JAVA", "code"], c: ["C", "code"], cpp: ["C++", "code"] };
  const ftype = name => { const p = String(name).split("."); const e = p.length > 1 ? p.pop().toLowerCase() : ""; return FTYPES[e] || [e ? e.slice(0, 4).toUpperCase() : "FILE", "other"]; };
  const fmtSize = n => { n = +n || 0; return n < 1024 ? n + " B" : n < 1048576 ? Math.round(n / 1024) + " KB" : (n / 1048576).toFixed(n < 10485760 ? 1 : 0) + " MB"; };
  const I_DL = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v11M7.5 11.5L12 16l4.5-4.5M5 20h14"/></svg>';
  const I_CHK = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';
  const I_RETRY = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 11a8 8 0 1 0-2.3 5.6"/><path d="M20 4v7h-7"/></svg>';
  const I_BRAIN = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9.5 4A3 3 0 0 0 6.5 7a3 3 0 0 0-2 5 3 3 0 0 0 2 5 3 3 0 0 0 3 3 2.5 2.5 0 0 0 2.5-2.5v-11A2.5 2.5 0 0 0 9.5 4z"/><path d="M14.5 4A3 3 0 0 1 17.5 7a3 3 0 0 1 2 5 3 3 0 0 1-2 5 3 3 0 0 1-3 3 2.5 2.5 0 0 1-2.5-2.5"/></svg>';
  const fileCard = (ref, name, size) => {
    const [lab, t] = ftype(name), idle = lab + (size ? " · " + fmtSize(size) : "") + " · " + tx("fileHint");
    return '<button type="button" class="aiFile" data-t="' + t + '" data-ref="' + esc2(ref) + '" data-name="' + esc2(name) + '" data-size="' + (size || "") + '" data-idle="' + esc2(idle) + '" aria-label="' + esc2(tx("dl") + " " + name) + '">' +
      '<span class="aiFi"><b>' + esc2(lab) + '</b></span><span class="aiFx"><span class="aiFn" dir="auto">' + esc2(name) + '</span><span class="aiFm">' + esc2(idle) + '</span><span class="aiFp"><i></i></span></span>' +
      '<span class="aiFd">' + I_DL + "</span></button>";
  };
  // the bot is asked not to use emojis; if one slips through it is removed here (the chat has its own drawn icons)
  const EMOJI_RE = /[ \t]*[\p{Extended_Pictographic}\u{1F1E6}-\u{1F1FF}\uFE0F\u200D\u20E3]+[ \t]*/gu;     // (with the spaces around it, so no double space is left)
  // [[poll:multi|question|a|b|c]] / [[poll:single|...]] become a tappable poll, [[quick|a|b]] becomes quick-reply buttons. The answer goes back as a normal message.
  const POLL_RE = /\[\[(poll:(?:single|multi)|quick)\|([^\]\n]{1,700})\]\]/g;
  const PICKED = { he: "בחרתי: ", en: "I chose: ", fr: "J'ai choisi : " };
  const PSEND = { he: "שלח", en: "Send", fr: "Envoyer" };
  const PTXT = { he: "או כתוב משהו אחר…", en: "Or type something else…", fr: "Ou écris autre chose…" };
  function pollHTML(kind, body) {
    const parts = body.split("|").map(x => x.trim()).filter(Boolean);
    if (kind === "quick") {
      const o = parts.slice(0, 4); if (o.length < 1) return "";
      return '<div class="aiQuick">' + o.map(t => '<button type="button" data-qk="' + esc2(t) + '">' + esc2(t) + "</button>").join("") + "</div>";
    }
    const q = parts[0], o = parts.slice(1, 13); if (!q || o.length < 2) return "";
    const multi = kind === "poll:multi";
    return '<div class="aiPoll" data-multi="' + (multi ? 1 : 0) + '"><div class="aiPq">' + esc2(q) + '</div><div class="aiPo">' +
      o.map((t, i) => '<button type="button" class="aiPb" data-po="' + esc2(t) + '"><i></i><span>' + esc2(t) + "</span></button>").join("") + "</div>" +
      (multi ? '<button type="button" class="aiPgo" data-pgo disabled>' + esc2(PSEND[lang()] || PSEND.he) + "</button>" : "") +
      '<form class="aiPt"><input type="text" maxlength="200" enterkeyhint="send" autocomplete="off" placeholder="' + esc2(PTXT[lang()] || PTXT.he) + '"><button type="submit" aria-label="' + esc2(PSEND[lang()] || PSEND.he) + '"><svg viewBox="0 0 24 24"><path d="M4 12l16-8-6 16-3-7z"/></svg></button></form></div>';
  }
  // ---------------------------------------------------------------------------------------------
  // Deadline card: the server sends [[deadlines:BASE64]] (a list of [name, course, time]) and the app draws it: one headline, the most urgent item as a hero with a live
  // countdown ring, the rest grouped by urgency (today / this week / later), and a week strip. Much faster to read than a list of dates.
  // ---------------------------------------------------------------------------------------------
  const UI_RE = /\[\[ui:([A-Za-z0-9_-]{4,24000})\]\]/g;
  const DLT = {
    he: { n: (k) => k === 1 ? "מטלה אחת ממתינה" : k + " מטלות ממתינות", urgent: "הדחופה", today: "היום", week: "השבוע", later: "אחר כך", over: "עבר המועד", in: "בעוד ", min: " דק'", hr: " שעות", day: " ימים",
      tm: "מחר ", td: "היום ", days: ["א'", "ב'", "ג'", "ד'", "ה'", "ו'", "ש'"], all: "הכול", loc: "he-IL" },
    en: { n: (k) => k === 1 ? "1 task waiting" : k + " tasks waiting", urgent: "Most urgent", today: "Today", week: "This week", later: "Later", over: "Overdue", in: "in ", min: " min", hr: " h", day: " days",
      tm: "Tomorrow ", td: "Today ", days: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"], all: "All", loc: "en-GB" },
    fr: { n: (k) => k === 1 ? "1 tâche en attente" : k + " tâches en attente", urgent: "La plus urgente", today: "Aujourd'hui", week: "Cette semaine", later: "Plus tard", over: "En retard", in: "dans ", min: " min", hr: " h", day: " jours",
      tm: "Demain ", td: "Aujourd'hui ", days: ["Di", "Lu", "Ma", "Me", "Je", "Ve", "Sa"], all: "Tout", loc: "fr-FR" },
  };
  const dlt = () => DLT[lang()] || DLT.he;
  function dlDecode(b64) {
    try {
      let b = b64.replace(/-/g, "+").replace(/_/g, "/"); b += "=".repeat((4 - b.length % 4) % 4);
      const bin = atob(b), bytes = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
      const arr = JSON.parse(new TextDecoder("utf-8").decode(bytes));
      return Array.isArray(arr) ? arr.filter(x => x && x.t).slice(0, 20) : [];
    } catch (e) { return []; }
  }
  const dlHue = c => { let h = 0; for (const ch of String(c || "")) h = (h * 31 + ch.charCodeAt(0)) % 360; return h; };
  const dlTime = t => new Date(t * 1000).toLocaleTimeString(dlt().loc, { hour: "2-digit", minute: "2-digit", hour12: false });
  const dayStart = d => { const x = new Date(d); x.setHours(0, 0, 0, 0); return x.getTime(); };
  // "in 5 hours", "tomorrow 21:00", "Wed 21:00", "23/11" - always the shortest thing that tells the student when
  function dlRel(t, long) {
    const T = dlt(), now = Date.now(), ms = t * 1000 - now;
    if (ms < 0) return T.over;
    const mins = Math.round(ms / 60000);
    if (mins < 60) return T.in + Math.max(1, mins) + T.min;
    if (ms < 86400000 && dayStart(t * 1000) === dayStart(now)) return long ? T.in + Math.round(mins / 60) + T.hr : T.td + dlTime(t);
    const dd = Math.round((dayStart(t * 1000) - dayStart(now)) / 86400000);
    if (dd === 1) return T.tm + dlTime(t);
    if (dd < 7) return T.days[new Date(t * 1000).getDay()] + " " + dlTime(t);
    return new Date(t * 1000).toLocaleDateString(dlt().loc, { day: "2-digit", month: "2-digit" });
  }
  // ---------------------------------------------------------------------------------------------
  // The AI decides what to show and how: it calls the server's show_ui tool, the server validates it and sends [[ui:BASE64]] with ready blocks
  // (deadlines as tickets / timeline / focus, grades as gauges, courses as chips, callouts, big numbers, steps). The app only draws them.
  // ---------------------------------------------------------------------------------------------
  function uiDecode(b64) {
    try {
      let b = b64.replace(/-/g, "+").replace(/_/g, "/"); b += "=".repeat((4 - b.length % 4) % 4);
      const bin = atob(b), bytes = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
      const o = JSON.parse(new TextDecoder("utf-8").decode(bytes));
      return o && Array.isArray(o.b) ? o.b.slice(0, 6) : [];
    } catch (e) { return []; }
  }
  const UI_ICONS = {
    info: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8v.01"/></svg>',
    warn: '<svg viewBox="0 0 24 24"><path d="M12 4l9 16H3z"/><path d="M12 10v4M12 17v.01"/></svg>',
    success: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M8 12.5l2.7 2.7L16 9.8"/></svg>',
    tip: '<svg viewBox="0 0 24 24"><path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2V16h5v-.1c0-.8.4-1.5 1-2A6 6 0 0 0 12 3z"/></svg>',
  };
  const ordDay = (t) => { const d = new Date(t * 1000); return { wd: dlt().days[d.getDay()], day: d.getDate(), mon: d.toLocaleDateString(dlt().loc, { month: "short" }) }; };
  // how full the "time left" bar is: empty far away, full when it is due
  const uiUrgency = t => Math.max(0.05, Math.min(1, 1 - (t * 1000 - Date.now()) / (5 * 86400000)));
  const itAttr = (k, it) => ' data-it="' + esc2(JSON.stringify({ k, n: it.n || "", c: it.c || "", v: it.v || "" })) + '"';
  function uiTicket(it) {
    const o = ordDay(it.t), left = it.t * 1000 - Date.now(), hot = left < 86400000, col = "hsl(" + dlHue(it.c) + " 72% 58%)";
    return '<div class="aiTk' + (hot ? " hot" : "") + '"' + itAttr("d", it) + ' style="--dc:' + col + ';--u:' + uiUrgency(it.t).toFixed(2) + '"><div class="aiTkS"><small>' + esc2(o.wd) + "</small><b>" + o.day + "</b><small>" + esc2(o.mon) + '</small></div>' +
      '<div class="aiTkB"><b>' + esc2(it.n) + "</b><em>" + esc2(it.c) + '</em><div class="aiTkT"><span data-due="' + it.t + '">' + esc2(dlRel(it.t, false)) + '</span><i class="aiTkBar"><u></u></i></div></div></div>';
  }
  function uiTimeline(items) {
    const days = []; items.forEach(it => { const k = dayStart(it.t * 1000); let g = days.find(x => x.k === k); if (!g) days.push(g = { k, t: it.t, list: [] }); g.list.push(it); });
    const T = dlt(), today = dayStart(Date.now());
    return '<div class="aiTl">' + days.map(g => {
      const dd = Math.round((g.k - today) / 86400000), o = ordDay(g.t);
      const label = dd <= 0 ? T.today : dd === 1 ? T.tm.trim() : o.wd + " " + o.day + " " + o.mon;
      return '<div class="aiTlD"><div class="aiTlH"><i></i>' + esc2(label) + '</div>' + g.list.map(it => '<div class="aiTlR"' + itAttr("d", it) + ' style="--dc:hsl(' + dlHue(it.c) + ' 72% 58%)"><b>' + esc2(it.n) + "</b><small>" + esc2(it.c) + '</small><span>' + esc2(dlTime(it.t)) + "</span></div>").join("") + "</div>";
    }).join("") + "</div>";
  }
  function uiFocus(items) {
    const f = items[0], hrs = Math.max(0, Math.round((f.t * 1000 - Date.now()) / 3600000)), big = hrs < 48 ? hrs : Math.round(hrs / 24), unit = hrs < 48 ? dlt().hr.trim() : dlt().day.trim();
    const col = "hsl(" + dlHue(f.c) + " 72% 58%)";
    return '<div class="aiFc"' + itAttr("d", f) + ' style="--dc:' + col + '"><div class="aiFcN"><b data-focus="' + f.t + '">' + big + "</b><small>" + esc2(unit) + '</small></div><div class="aiFcX"><b>' + esc2(f.n) + "</b><em>" + esc2(f.c) + "</em><span data-due=\"" + f.t + "\">" + esc2(dlRel(f.t, false)) + "</span></div></div>" +
      items.slice(1).map(it => uiTicket(it)).join("");
  }
  const gaugeCol = v => v >= 85 ? "#22a55e" : v >= 65 ? "#e8a000" : "#e5484d";
  function uiGauge(it) {
    const num = parseFloat(String(it.v).replace(/[^0-9.]/g, "")), ok = isFinite(num), C = 2 * Math.PI * 22, col = ok ? gaugeCol(num) : "var(--muted)";
    return '<div class="aiGg"' + itAttr("g", it) + ' style="--gc:' + col + '"><svg viewBox="0 0 56 56"><circle cx="28" cy="28" r="22" class="bg"/><circle cx="28" cy="28" r="22" class="fg" stroke-dasharray="' + (ok ? (C * Math.min(1, num / 100)).toFixed(1) : 0) + " " + C.toFixed(1) + '"/></svg><b>' + esc2(it.v) + "</b><small>" + esc2(it.n) + "</small></div>";
  }
  function uiBlock(b) {
    const head = b.ti ? '<div class="aiUiT">' + esc2(b.ti) + "</div>" : "";
    if (b.k === "deadlines" && b.it && b.it.length) {
      const body = b.s === "timeline" ? uiTimeline(b.it) : b.s === "focus" ? uiFocus(b.it) : b.it.map(uiTicket).join("");
      return head + body;
    }
    if (b.k === "grades" && b.it && b.it.length) return head + (b.s === "list"
      ? '<div class="aiLs">' + b.it.map(it => "<div" + itAttr("g", it) + "><span>" + esc2(it.n) + "</span><b>" + esc2(it.v) + "</b></div>").join("") + "</div>"
      : '<div class="aiGgs">' + b.it.map(uiGauge).join("") + "</div>");
    if (b.k === "courses" && b.it && b.it.length) return head + (b.s === "list"
      ? '<div class="aiLs">' + b.it.map(it => "<div" + itAttr("c", it) + "><span>" + esc2(it.n) + "</span></div>").join("") + "</div>"
      : '<div class="aiCh">' + b.it.map(it => '<span' + itAttr("c", it) + ' style="--dc:hsl(' + dlHue(it.n) + ' 72% 58%)"><i></i>' + esc2(it.n) + "</span>").join("") + "</div>");
    if (b.k === "callout") return '<div class="aiCo ' + esc2(b.tone || "info") + '">' + (UI_ICONS[b.tone] || UI_ICONS.info) + "<div>" + (b.ti ? "<b>" + esc2(b.ti) + "</b>" : "") + "<span>" + esc2(b.tx) + "</span></div></div>";
    if (b.k === "stats" && b.it) return head + '<div class="aiSt">' + b.it.map(it => "<div><b>" + esc2(it.v) + "</b><small>" + esc2(it.l) + "</small></div>").join("") + "</div>";
    if (b.k === "steps" && b.it) return head + '<ol class="aiSp">' + b.it.map(it => "<li>" + esc2(it.l) + "</li>").join("") + "</ol>";
    if (b.k === "progress" && b.it) return head + '<div class="aiPr">' + b.it.map(it => { const v = Math.max(0, Math.min(100, parseFloat(it.v) || 0)); return '<div><div class="aiPrT"><span>' + esc2(it.l) + "</span><b>" + Math.round(v) + '%</b></div><i><u style="width:' + v + '%;background:' + gaugeCol(v) + '"></u></i></div>'; }).join("") + "</div>";
    if (b.k === "buttons" && b.it) return '<div class="aiQuick">' + b.it.map(it => '<button type="button" data-qk="' + esc2(it.v || it.l) + '">' + esc2(it.l) + "</button>").join("") + "</div>";
    return "";
  }
  const uiHTML = blocks => blocks.length ? '<div class="aiUi">' + blocks.map(uiBlock).join("") + "</div>" : "";
  const uiPlain = blocks => blocks.map(b => (b.ti ? b.ti + ":\n" : "") + (b.tx || "") + (b.it || []).map(it => "- " + (it.n || it.l || "") + (it.c ? " (" + it.c + ")" : "") + (it.t ? " " + new Date(it.t * 1000).toLocaleString(dlt().loc) : "") + (it.v ? ": " + it.v : "")).join("\n")).join("\n\n");
  // the countdowns tick by themselves
  setInterval(() => {
    try { document.querySelectorAll(".aiUi [data-due]").forEach(el => { const v = dlRel(+el.dataset.due, el.dataset.long === "1"); if (el.textContent !== v) el.textContent = v; }); } catch (e) {}
  }, 30000);
  const noEmoji = s => String(s).replace(EMOJI_RE, " ");
  const plain = s => noEmoji(String(s).replace(FILE_RE, (m, r, n) => n).replace(POLL_RE, (m, k, b) => b.split("|").map(x => x.trim()).filter(Boolean).join(" / ")).replace(UI_RE, (m, b) => uiPlain(uiDecode(b))));                       // for copy and share
  // a waving hand, drawn here (not an emoji of the system)
  const WAVE = '<svg class="aiWave" viewBox="0 0 32 32" aria-hidden="true"><g class="aiWaveHand" fill="#ffc83d"><rect x="7.5" y="13" width="15" height="14" rx="6.5"/><rect x="8" y="5" width="3.8" height="14" rx="1.9"/>' +
    '<rect x="12.1" y="3" width="3.8" height="15" rx="1.9"/><rect x="16.2" y="4" width="3.8" height="14.5" rx="1.9"/><rect x="20.3" y="7" width="3.6" height="12" rx="1.8"/>' +
    '<rect x="2.6" y="15.5" width="3.8" height="10" rx="1.9" transform="rotate(-32 4.5 20.5)"/><path d="M11 22q4.5 3 9 0" fill="none" stroke="#e8a000" stroke-width="1.4" stroke-linecap="round"/></g></svg>';

  function md(src) {
    const files = [];
    src = noEmoji(src).replace(/\[\[[^\]]*$/, "")                                                // a marker still being typed by the stream: not shown yet
      .replace(FILE_RE, (m, ref, name, size) => { files.push([ref, name, size]); return "\u0001" + (files.length - 1) + "\u0001"; })
      .replace(POLL_RE, (m, kind, body) => { files.push(["\u0000", pollHTML(kind, body)]); return "\u0001" + (files.length - 1) + "\u0001"; })
      .replace(UI_RE, (m, b) => { files.push(["\u0000", uiHTML(uiDecode(b))]); return "\u0001" + (files.length - 1) + "\u0001"; });
    const html = md1(src);
    return files.length ? html.replace(/\u0001(\d+)\u0001/g, (m, i) => files[i][0] === "\u0000" ? files[i][1] : fileCard(files[i][0], files[i][1], files[i][2])) : html;
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
      if (/^\s*\u0001\d+\u0001\s*$/.test(ln)) { flushP(); flushL(); out.push(ln.trim()); continue; }
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
  // השרת בחינם נרדם אחרי חוסר פעילות; פינג שקט כשהאפליקציה נפתחת מעיר אותו לפני שהסטודנט מקליד את השאלה הראשונה
  let warmed = 0;
  function warmUp() {
    const now = Date.now();
    if (now - warmed < 240000) return;
    warmed = now;
    try { fetch(api() + "/api/health", { mode: "no-cors", cache: "no-store" }).catch(() => {}); } catch (e) {}
  }
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
  let fab = null, panel = null, splash = null, intro = null, ms = null, input = null, sendBtn = null, statusEl = null, titleEl = null, histBtn = null, memBtn = null, histMode = false, memMode = false;
  let animFrom = Infinity, loadAnimN = 0, closing = false, loadFail = null;
  let msgs = [], conv = null, busy = false, ctl = null, gen = 0, curBub = null, pushed = false, skipPop = 0, lastPending = "";

  const left = () => LS.set("aiLeft", Date.now());
  const sessName = () => { const s = LS.get("aiSess", null); return s && s.name ? s.name : ""; };

  /* ------------------------------------------------------------ rendering */
  // what the bot is doing: only the real actions (Moodle, memory), as one line that spins; when it is done the line goes and the next one comes
  const DOTS = '<span class="aiDots" aria-label="…"><i></i><i></i><i></i></span>';
  const activityHTML = status => status ? '<div class="aiAct" role="status"><i class="aiSi"></i><span>' + esc2(status) + "…</span></div>" : DOTS;
  // what the bot remembered or forgot in this answer
  const chipsHTML = mem => (mem || []).map((e, i) => '<div class="aiMemChip' + (e.op === "del" ? " del" : "") + (e.undone ? " undone" : "") + '"><span class="aiMemI">' + I_BRAIN + '</span><span class="aiMemT">' +
    esc2((e.op === "del" ? tx("memGone") : tx("memSaved")) + ": " + (e.text || "")) + "</span>" + (e.op === "add" && !e.undone ? '<button type="button" data-undo="' + esc2(e.id || "") + '">' + esc2(tx("memUndo")) + "</button>" : e.undone ? "<span>" + esc2(tx("memUndone")) + "</span>" : "") + "</div>").join("");
  const toolLabel = e => { const k = "tl_" + e.name; return (TX[lang()][k] || TX.he[k]) ? tx(k, e.arg) : tx("tlGeneric"); };
  function setActivity(ai, label) {
    ai.status = label || "";
    if (!curBub || ai.content) return;
    const old = curBub.querySelector(".aiAct");
    const paint = () => { ai.swapT = 0; if (curBub && !ai.content) { curBub.innerHTML = activityHTML(ai.status); scrollEnd(false); } };
    if (old) { old.classList.add("out"); if (!ai.swapT) ai.swapT = setTimeout(paint, 170); }     // the old line fades away, then the next comes (the latest wins)
    else paint();
  }
  function onStreamEvent(ai, e) {
    if (!e) return;
    if (e.s === "mem") { (ai.mem = ai.mem || []).push(e); return; }                              // the note under the answer says it
    if (e.s === "tool") { if (!ai.status) setActivity(ai, toolLabel(e)); return; }                // the first real action of a round
    if (e.s === "write" && ai.status) setActivity(ai, "");                                       // done: the line goes, the dots come back
  }

  function bubble(role, content, opts) {
    const row = document.createElement("div"); row.className = "aiM " + (role === "user" ? "me" : "ai");
    if (opts && opts.bad) row.classList.add("aiBad");
    if (opts && opts.pending && !content) row.classList.add("aiPend");
    if (role !== "user") { const av = document.createElement("div"); av.className = "aiAv"; av.innerHTML = opts && opts.bad ? FACE_DEAD : FACE; row.appendChild(av); }
    const b = document.createElement("div"); b.className = "aiB"; b.dir = "auto";
    if (role === "user") b.textContent = content;
    else if (opts && opts.pending && !content) b.innerHTML = activityHTML(opts.status);
    else b.innerHTML = md(content) + chipsHTML(opts && opts.mem);
    if (!(opts && opts.pending && !content)) { b.tabIndex = 0; b.setAttribute("aria-haspopup", "menu"); }   // reachable from the keyboard (the Menu key opens the same menu)
    row.appendChild(b);
    return { row, b };
  }

  function greeting() {
    const n = sessName();
    const sug = ["s1", "s2", "s3"].map(k => '<button type="button" data-q="' + esc2(tx(k)) + '">' + esc2(tx(k)) + "</button>").join("");
    return '<div class="aiHi"><div class="aiBig">' + FACE + "</div><h2>" + esc2(n ? tx("hello", n) : tx("helloNo")) + ' <span class="aiHand">' + WAVE + "</span></h2><p>" + esc2(tx("intro")) +
      '</p><div class="aiSug">' + sug + "</div></div>";
  }

  const wait = d => new Promise(r => setTimeout(r, d));
  function swapAnim() { ms.classList.remove("aiSwap"); void ms.offsetWidth; ms.classList.add("aiSwap"); }   // a soft change of what the list shows

  // only the poll in the newest message can still be answered; older ones are shown as history
  const pollLive = el => !busy && !el.closest(".aiLocked") && el.closest(".aiM") === ms.lastElementChild;
  function lockPoll(card, chosen) {
    if (!card) return;
    card.classList.add("aiLocked");
    card.querySelectorAll("button,input").forEach(b => { b.disabled = true; });
    chosen.forEach(b => b.classList.add("on"));
  }
  function lockOldPolls() {
    const last = ms.lastElementChild;
    ms.querySelectorAll(".aiPoll,.aiQuick").forEach(c => { if (c.closest(".aiM") !== last) { c.classList.add("aiLocked"); c.querySelectorAll("button,input").forEach(b => { b.disabled = true; }); } });
  }

  function renderMsgs() {
    const fromHist = histMode || memMode;
    histMode = false; memMode = false; setMode();
    ms.innerHTML = ""; curBub = null;
    if (!msgs.length) { ms.innerHTML = greeting(); animFrom = Infinity; loadAnimN = 0; return; }
    const sent = animFrom !== Infinity;                                   // just sent: the new messages rise in
    const from = sent ? animFrom : (loadAnimN ? Math.max(0, msgs.length - loadAnimN) : Infinity);   // just opened: the last few come in one by one
    msgs.forEach((m, i) => {
      const { row, b } = bubble(m.role, m.content, { pending: m.pending, bad: !!m.err, status: m.status, mem: m.mem });
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
    lockOldPolls(); scrollEnd(true);
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
    const sub = histMode || memMode;
    titleEl.querySelector("b").textContent = memMode ? tx("memTitle") : histMode ? tx("hist") : tx("title");
    titleEl.querySelector("small").textContent = sub ? "" : tx("sub");
    histBtn.innerHTML = sub ? I_BACK : I_HIST; histBtn.setAttribute("aria-label", sub ? tx("back") : tx("hist")); histBtn.title = sub ? tx("back") : tx("hist");
    panel.querySelector(".aiFt").hidden = sub;
    if (memBtn) { memBtn.classList.toggle("on", memMode); memBtn.setAttribute("aria-pressed", memMode ? "true" : "false"); }
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
    ms.innerHTML = '<div class="aiHe">' + esc2(tx("connecting")) + "</div>"; histMode = false; memMode = false; setMode();
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
    const my = ++gen; histMode = true; memMode = false; setMode(); closeMenu();
    ms.innerHTML = '<div class="aiHe">' + esc2(tx("connecting")) + "</div>";
    try {
      const res = await call("/api/conversations");
      if (my !== gen) return;
      if (!res.ok) throw new AiErr(errKind(res));
      const list = ((await res.json()).conversations || []).filter(c => c && c.id);
      ms.innerHTML = "";
      if (!list.length) {
        ms.innerHTML = '<div class="aiHe">' + esc2(tx("histEmpty")) + "</div>"; return;
      }
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

  /* ------------------------------------------------------------ what the bot remembers about the student */
  async function openMemory() {
    const my = ++gen; histMode = false; memMode = true; setMode(); closeMenu();
    ms.innerHTML = '<div class="aiHe">' + esc2(tx("connecting")) + "</div>";
    try {
      const res = await call("/api/memory");
      if (my !== gen) return;
      if (!res.ok) throw new AiErr(errKind(res));
      const list = (await res.json()).memories || [];
      ms.innerHTML = "";
      const wrap = document.createElement("div"); wrap.className = "aiHs"; wrap.style.cssText = "padding-top:0;padding-bottom:0;flex:none";
      const intro = document.createElement("p"); intro.className = "aiMemIntro"; intro.textContent = tx("memIntro"); wrap.appendChild(intro);
      if (!list.length) { const e = document.createElement("div"); e.className = "aiHe"; e.textContent = tx("memEmpty"); wrap.appendChild(e); }
      else {
        const bar = document.createElement("div"); bar.className = "aiHt";
        const cnt = document.createElement("span"); cnt.textContent = tx("memCount", list.length);
        const delAll = document.createElement("button"); delAll.type = "button"; delAll.className = "aiLink"; delAll.textContent = tx("memDelAll"); delAll.onclick = () => deleteAllMem();
        bar.append(cnt, delAll); wrap.appendChild(bar);
        list.forEach((m, i) => {
          const row = document.createElement("div"); row.className = "aiMemRow"; row.dataset.id = m.id; row.style.setProperty("--i", Math.min(i, 9));
          if (m.kind === "left_course") { const b = document.createElement("span"); b.className = "aiMemB"; b.textContent = tx("memLeft"); row.appendChild(b); }
          const t = document.createElement("span"); t.className = "aiMemX"; t.textContent = m.content; t.dir = "auto"; row.appendChild(t);
          const d = document.createElement("button"); d.type = "button"; d.className = "aiHdel"; d.innerHTML = I_TRASH; d.setAttribute("aria-label", tx("memDelOne") + ": " + m.content); d.title = tx("memDelOne"); d.onclick = () => deleteMem(m.id, row);
          row.appendChild(d); wrap.appendChild(row);
        });
      }
      ms.appendChild(wrap); swapAnim();
    } catch (e) {
      if (my !== gen) return;
      ms.innerHTML = '<div class="aiHe">' + esc2(e instanceof AiErr ? errText(e) : tx("errLoad")) + "</div>";
    }
  }

  async function deleteMem(id, row) {
    try { const res = await call("/api/memory/" + encodeURIComponent(id), { method: "DELETE" }); if (!res.ok && res.status !== 404) throw new AiErr(errKind(res)); }
    catch (e) { toast(errText(e), 3500); return; }
    msgs.forEach(m => (m.mem || []).forEach(x => { if (x.id === id) x.undone = true; }));
    if (row && memMode) { row.classList.add("aiGone"); await wait(320); row.remove(); const n = ms.querySelectorAll(".aiMemRow").length; const c = ms.querySelector(".aiHt span");
      if (!n) openMemory(); else if (c) c.textContent = tx("memCount", n); }
    toast(tx("deleted"), 1500);
  }

  async function deleteAllMem() {
    if (!(await confirmDlg(tx("memDelAllQ"), tx("delOk")))) return;
    try { const res = await call("/api/memory", { method: "DELETE" }); if (!res.ok) throw new AiErr(errKind(res)); }
    catch (e) { toast(errText(e), 3500); return; }
    msgs.forEach(m => (m.mem || []).forEach(x => { x.undone = true; }));
    toast(tx("deleted"), 1500); openMemory();
  }

  async function undoMem(id) {                // "undo" on the chip under an answer
    try { const res = await call("/api/memory/" + encodeURIComponent(id), { method: "DELETE" }); if (!res.ok && res.status !== 404) throw new AiErr(errKind(res)); }
    catch (e) { toast(errText(e), 3500); return; }
    msgs.forEach(m => (m.mem || []).forEach(x => { if (x.id === id) x.undone = true; }));
    if (!histMode && !memMode) renderMsgs();
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

  function showMenu(b, items, x, y, byKey) {
    closeMenu();
    try { getSelection().removeAllRanges(); } catch (e) {}
    menuBg = document.createElement("div"); menuBg.className = "aiMnBg"; menuBg.onclick = closeMenu;
    menuEl = document.createElement("div"); menuEl.className = "aiMn"; menuEl.setAttribute("role", "menu"); menuEl.setAttribute("aria-label", tx("msgMenu"));
    for (const it of items) {
      const bt = document.createElement("button"); bt.type = "button"; bt.className = "aiMi"; bt.setAttribute("role", "menuitem"); bt.innerHTML = it.icon + "<span></span>";
      bt.lastChild.textContent = it.label;
      bt.onclick = async () => { closeMenu(); await it.run(); };
      menuEl.appendChild(bt);
    }
    menuEl.addEventListener("keydown", e => {
      const btns = [...menuEl.querySelectorAll(".aiMi")], i = btns.indexOf(document.activeElement);
      if (e.key === "Escape") { e.stopPropagation(); const back = b; closeMenu(); try { back.focus({ preventScroll: true }); } catch (er) {} }
      else if (e.key === "ArrowDown") { e.preventDefault(); btns[(i + 1) % btns.length].focus(); }
      else if (e.key === "ArrowUp") { e.preventDefault(); btns[(i - 1 + btns.length) % btns.length].focus(); }
    });
    panel.append(menuBg, menuEl); menuFor = b; b.classList.add("aiHold");

    // the menu sits next to the pressed thing: below it if there is room, else above it, else in the middle; always inside the screen
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

  function openMenu(b, x, y, byKey) {
    const row = b.closest(".aiM"), idx = row ? +row.dataset.i : -1, m = msgs[idx];
    if (!m || m.pending || !String(m.content || "").trim()) return;
    const text = plain(m.content);
    const items = [{ icon: I_COPY, label: tx("copy"), run: async () => toast((await copyText(text)) ? tx("copied") : tx("errGen"), 1600) }];
    if (navigator.share) items.push({ icon: I_SHARE, label: tx("share"), run: async () => { try { await navigator.share({ text }); } catch (e) {} } });
    items.push({ icon: I_SELECT, label: tx("selectTxt"), run: () => { b.classList.add("aiSel"); const r = document.createRange(); r.selectNodeContents(b); const s = getSelection(); s.removeAllRanges(); s.addRange(r); } });
    if (m.role === "user") items.push({ icon: I_NEW, label: tx("reuse"), run: () => { input.value = String(m.content); input.dispatchEvent(new Event("input")); try { input.focus(); input.setSelectionRange(input.value.length, input.value.length); } catch (e) {} } });
    showMenu(b, items, x, y, byKey);
  }

  // long press on a task, a course or a grade inside the AI's cards: ask about it, get its files, and so on
  const ITM = {
    he: { ask: "שאל על זה", files: "הקבצים של זה", tasks: "המטלות בקורס", grades: "הציונים בקורס", cfiles: "הקבצים של הקורס", copy: "העתק",
      q: { d: (n, c) => 'ספר לי על המטלה "' + n + '" בקורס ' + c, df: (n, c) => 'שלח לי קבצים שקשורים ל"' + n + '" בקורס ' + c, g: (n) => 'ספר לי על הציון "' + n + '" ואיך הוא מחושב', c: (n) => "ספר לי על הקורס " + n, ct: (n) => "מה המטלות שלי בקורס " + n + "?", cg: (n) => "מה הציונים שלי בקורס " + n + "?", cf: (n) => "אילו קבצים יש בקורס " + n + "?" } },
    en: { ask: "Ask about this", files: "Files for this", tasks: "Tasks in this course", grades: "Grades in this course", cfiles: "Course files", copy: "Copy",
      q: { d: (n, c) => 'Tell me about the task "' + n + '" in ' + c, df: (n, c) => 'Send me files related to "' + n + '" in ' + c, g: (n) => 'Tell me about the grade "' + n + '" and how it is calculated', c: (n) => "Tell me about the course " + n, ct: (n) => "What are my tasks in " + n + "?", cg: (n) => "What are my grades in " + n + "?", cf: (n) => "Which files are in " + n + "?" } },
    fr: { ask: "Poser une question", files: "Fichiers liés", tasks: "Devoirs du cours", grades: "Notes du cours", cfiles: "Fichiers du cours", copy: "Copier",
      q: { d: (n, c) => 'Parle-moi du devoir "' + n + '" dans ' + c, df: (n, c) => 'Envoie-moi les fichiers liés à "' + n + '" dans ' + c, g: (n) => 'Parle-moi de la note "' + n + '" et de son calcul', c: (n) => "Parle-moi du cours " + n, ct: (n) => "Quels sont mes devoirs en " + n + " ?", cg: (n) => "Quelles sont mes notes en " + n + " ?", cf: (n) => "Quels fichiers y a-t-il dans " + n + " ?" } },
  };
  function openItemMenu(el, x, y, byKey) {
    let d; try { d = JSON.parse(el.dataset.it); } catch (e) { return; }
    const T = ITM[lang()] || ITM.he, n = d.n || "", c = d.c || "";
    const go = q => () => { send(q); };
    const items = [];
    if (d.k === "d") { items.push({ icon: I_NEW, label: T.ask, run: go(T.q.d(n, c)) }, { icon: I_SELECT, label: T.files, run: go(T.q.df(n, c)) }); }
    else if (d.k === "c") { items.push({ icon: I_NEW, label: T.ask, run: go(T.q.c(n)) }, { icon: I_SELECT, label: T.tasks, run: go(T.q.ct(n)) }, { icon: I_SELECT, label: T.grades, run: go(T.q.cg(n)) }, { icon: I_SELECT, label: T.cfiles, run: go(T.q.cf(n)) }); }
    else if (d.k === "g") items.push({ icon: I_NEW, label: T.ask, run: go(T.q.g(n)) });
    items.push({ icon: I_COPY, label: T.copy, run: async () => toast((await copyText(n + (c ? " - " + c : "") + (d.v ? ": " + d.v : ""))) ? tx("copied") : tx("errGen"), 1600) });
    showMenu(el, items, x, y, byKey);
  }

  /* ------------------------------------------------------------ files the AI sends */
  const fileErrText = e => tx(e && e.kind === "moodle" ? "errMoodle" : e && e.kind === "rate" ? "errRate" : e && e.kind === "nofile" ? "fileGone" : e && e.kind === "big" ? "fileBig" : e && e.kind === "net" ? "errNet" : "fileErr");

  function fileState(btn, state, meta) {         // idle | busy | ok | err
    btn.classList.remove("busy", "ok", "err"); if (state !== "idle") btn.classList.add(state);
    const m = btn.querySelector(".aiFm"); if (m && meta != null) m.textContent = meta;
    btn.querySelector(".aiFd").innerHTML = state === "ok" ? I_CHK : state === "err" ? I_RETRY : I_DL;
    if (state === "idle") btn.querySelector(".aiFp i").style.width = "";
  }

  async function downloadFile(btn) {
    if (btn.classList.contains("busy")) return;
    const ref = btn.dataset.ref, name = (btn.dataset.name || "file").replace(/[\\/:*?"<>|\r\n]+/g, "_"), size = +btn.dataset.size || 0, idle = btn.dataset.idle || "";
    const bar = btn.querySelector(".aiFp"), fill = bar.querySelector("i"), meta = btn.querySelector(".aiFm");
    fileState(btn, "busy", tx("dling")); bar.classList.add("ind"); fill.style.width = "";
    try {
      if (!M.token) throw new AiErr("moodle");
      const res = await call("/api/moodle/file", { method: "POST", timeout: 120000, body: { ref, moodle_token: M.token } });   // the token goes in the body, never in an address
      if (!res.ok) throw new AiErr(res.status === 403 ? "moodle" : res.status === 429 ? "rate" : res.status === 404 ? "nofile" : res.status === 413 ? "big" : res.status >= 500 ? "net" : "gen");
      const total = +res.headers.get("Content-Length") || size || 0;
      let blob;
      if (res.body && res.body.getReader) {                          // read it piece by piece, so the bar can show how far it is
        const rd = res.body.getReader(), parts = []; let got = 0, last = 0;
        for (;;) {
          const { done, value } = await rd.read(); if (done) break;
          parts.push(value); got += value.length;
          const now = performance.now();
          if (now - last > 80) {
            last = now;
            if (total) { bar.classList.remove("ind"); const p = Math.min(99, Math.round(got / total * 100)); fill.style.width = p + "%"; meta.textContent = tx("dlProg", p, fmtSize(got), fmtSize(total)); }
            else meta.textContent = tx("dling") + " " + fmtSize(got);
          }
        }
        blob = new Blob(parts, { type: res.headers.get("Content-Type") || "" });
      } else blob = await res.blob();
      bar.classList.remove("ind"); fill.style.width = "100%";
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
      await wait(250);
      fileState(btn, "ok", tx("dlDone") + " · " + fmtSize(blob.size));
      setTimeout(() => { if (btn.classList.contains("ok")) fileState(btn, "idle", idle); }, 3600);
    } catch (e) {
      fileState(btn, "err", fileErrText(e));
      setTimeout(() => { if (btn.classList.contains("err")) fileState(btn, "idle", idle); }, 6000);
    }
  }

  /* ------------------------------------------------------------ sending */
  async function send(text) {
    text = String(text || "").trim().slice(0, 2000);
    if (!text || busy) return;
    gen++;                                    // a pending history/load result must not overwrite the chat now
    histMode = false; memMode = false; setMode();
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
      let res = await call("/api/chat/stream/v2", { method: "POST", ctl: myCtl, timeout: 95000, body: { conversation_id: conv, question: text, moodle_token: M.token || null, status: true } });
      if (res.status === 404) {                // the conversation is gone on the server: start a new one and send again
        const r = await call("/api/conversations", { method: "POST" });
        if (!r.ok) throw new AiErr(errKind(r));
        conv = (await r.json()).id; LS.set("aiConv", conv);
        res = await call("/api/chat/stream/v2", { method: "POST", ctl: myCtl, timeout: 95000, body: { conversation_id: conv, question: text, moodle_token: M.token || null, status: true } });
      }
      if (!res.ok) throw new AiErr(errKind(res));
      clearTimeout(wake); setStatus();
      const withCaret = h => /(<\/(?:p|li)>)((?:<\/(?:ul|ol)>)?)$/.test(h) ? h.replace(/(<\/(?:p|li)>)((?:<\/(?:ul|ol)>)?)$/, '<span class="aiCaret"></span>$1$2') : h + '<span class="aiCaret"></span>';
      let buf = "";                                // the stream carries small events (\u0001{json}\u0002) between the answer's text: steps, memory
      const feed = chunk => {
        buf += chunk;
        for (;;) {
          const i = buf.indexOf("\u0001");
          if (i < 0) { ai.content += buf; buf = ""; break; }
          ai.content += buf.slice(0, i);
          const j = buf.indexOf("\u0002", i);
          if (j < 0) { buf = buf.slice(i); break; }          // an event cut in the middle: wait for the rest
          let ev = null; try { ev = JSON.parse(buf.slice(i + 1, j)); } catch (e) {}
          buf = buf.slice(j + 1);
          onStreamEvent(ai, ev);
        }
      };
      const upd = () => {
        if (!ai.content) return;                   // only events so far: the steps stay
        const first = ai.pending; ai.pending = false; ai.status = ""; clearTimeout(ai.swapT); ai.swapT = 0;
        if (curBub) {
          const h = (withCaret(md(ai.content)) + chipsHTML(ai.mem)) || curBub.innerHTML;
          curBub.classList.add("aiStream");
          if (h !== ai.lastHtml) { ai.lastHtml = h; curBub.innerHTML = h; }                  // not re-drawn when nothing changed
          if (first) { const r = curBub.closest(".aiM"); if (r) r.classList.remove("aiPend"); curBub.classList.remove("aiFill"); void curBub.offsetWidth; curBub.classList.add("aiFill"); }   // the dots turn into the answer
          scrollEnd(false);
        }
      };
      if (!res.body || !res.body.getReader) { feed(await res.text()); upd(); }
      else {
        const rd = res.body.getReader(), dec = new TextDecoder("utf-8"); let raf = 0;
        for (;;) {
          const { done, value } = await rd.read(); if (done) break;
          feed(dec.decode(value, { stream: true }));
          if (!raf) raf = requestAnimationFrame(() => { raf = 0; upd(); });
        }
        feed(dec.decode()); if (raf) cancelAnimationFrame(raf); upd();
      }
      if (!ai.content.trim()) throw new AiErr("gen");
      if (curBub) curBub.classList.remove("aiStream");
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
      if (panel && !panel.hidden && !histMode && !memMode && msgs.includes(ai)) renderMsgs();
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
      '<button type="button" class="aiHb" data-a="hist"></button><button type="button" class="aiHb" data-a="mem"></button><button type="button" class="aiHb" data-a="new"></button></div>' +
      '<div class="aiMs" role="log" aria-live="polite"></div>' +
      '<div class="aiFt"><div class="aiSt" hidden></div><div class="aiIn"><textarea rows="1" maxlength="2000" enterkeyhint="send"></textarea>' +
      '<button type="button" class="aiSd"></button></div><div class="aiNt"></div></div>' +
      '<div class="aiDlg" hidden role="alertdialog" aria-modal="true"><div class="aiDlgBox"><p></p><div class="aiDlgBtns"><button type="button" data-no></button><button type="button" class="danger" data-ok></button></div></div></div>' +
      '<div class="aiSplash" hidden aria-hidden="true"><div class="aiGrow">' + FACE + '</div><div class="aiSpl"><div class="aiGlow"></div><div class="aiFaceBig">' + FACE + FACE_DEAD + '</div><div class="aiSplTx"></div></div></div>';
    document.body.appendChild(panel);
    ms = panel.querySelector(".aiMs"); input = panel.querySelector("textarea"); sendBtn = panel.querySelector(".aiSd");
    splash = panel.querySelector(".aiSplash"); statusEl = panel.querySelector(".aiSt"); titleEl = panel.querySelector(".aiTt .aiTl"); histBtn = panel.querySelector('[data-a="hist"]'); memBtn = panel.querySelector('[data-a="mem"]');

    panel.querySelector('[data-a="close"]').onclick = () => close();
    histBtn.onclick = () => (histMode || memMode ? renderMsgs() : openHistory());
    memBtn.onclick = () => (memMode ? renderMsgs() : openMemory());
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
    ms.addEventListener("submit", e => {
      const f = e.target.closest && e.target.closest(".aiPt"); if (!f) return;
      e.preventDefault();
      const card = f.closest(".aiPoll"), v = f.querySelector("input").value.trim();
      if (!v || !pollLive(f)) return;
      lockPoll(card, []); send(v);
    });
    ms.addEventListener("click", e => {
      const u = e.target.closest("[data-undo]"); if (u) { undoMem(u.dataset.undo); return; }
      const mc = e.target.closest(".aiMemChip"); if (mc && !mc.classList.contains("undone")) { openMemory(); return; }
      const f = e.target.closest(".aiFile"); if (f) { downloadFile(f); return; }
      const q = e.target.closest("[data-q]"); if (q) send(q.dataset.q);
      const qk = e.target.closest("[data-qk]"); if (qk) { if (pollLive(qk)) { lockPoll(qk.closest(".aiQuick"), [qk]); send(qk.dataset.qk); } return; }
      const pb = e.target.closest("[data-po]");
      if (pb) {
        const card = pb.closest(".aiPoll"); if (!pollLive(pb)) return;
        if (card.dataset.multi === "1") { pb.classList.toggle("on"); const go = card.querySelector("[data-pgo]"); if (go) go.disabled = !card.querySelector(".aiPb.on"); }
        else { lockPoll(card, [pb]); send((PICKED[lang()] || PICKED.he) + pb.dataset.po); }
        return;
      }
      const pg = e.target.closest("[data-pgo]");
      if (pg) {
        const card = pg.closest(".aiPoll"), on = [...card.querySelectorAll(".aiPb.on")]; if (!on.length || !pollLive(pg)) return;
        lockPoll(card, on); send((PICKED[lang()] || PICKED.he) + on.map(x => x.dataset.po).join(", "));
      }
    });
    // long press on a message (touch) or right click / the Menu key (computer) opens the message menu; moving the finger (scrolling) cancels it
    ms.addEventListener("pointerdown", e => {
      closeMenu();
      if (e.pointerType === "mouse" || e.button !== 0 || e.target.closest(".aiFile,a,.aiErr button")) return;
      const itEl = e.target.closest("[data-it]"), b = e.target.closest(".aiB"); if (!b) return;
      holdXY = [e.clientX, e.clientY];
      holdT = setTimeout(() => { holdT = 0; try { navigator.vibrate && navigator.vibrate(12); } catch (er) {} if (itEl && !busy) openItemMenu(itEl, holdXY[0], holdXY[1]); else openMenu(b, holdXY[0], holdXY[1]); }, 450);
    });
    ms.addEventListener("pointermove", e => { if (holdT && Math.hypot(e.clientX - holdXY[0], e.clientY - holdXY[1]) > 10) cancelHold(); });
    ["pointerup", "pointercancel", "pointerleave"].forEach(t => ms.addEventListener(t, cancelHold));
    ms.addEventListener("scroll", () => { cancelHold(); if (menuEl) closeMenu(); }, { passive: true });
    ms.addEventListener("contextmenu", e => {
      const b = e.target.closest(".aiB"); if (!b) return;
      e.preventDefault(); if (menuEl) return;
      const itEl = e.target.closest("[data-it]");
      if (itEl && !busy) openItemMenu(itEl, e.clientX, e.clientY, e.clientX === 0 && e.clientY === 0);
      else openMenu(b, e.clientX, e.clientY, e.clientX === 0 && e.clientY === 0);
    });
    document.addEventListener("pointerdown", e => { if (panel && !e.target.closest(".aiB")) document.querySelectorAll(".aiB.aiSel").forEach(x => x.classList.remove("aiSel")); }, true);
    // on a touch screen the browser must never start its own text selection from a long press (iPhone selected the whole screen): only what the student chose to select, and the text boxes
    panel.addEventListener("selectstart", e => {
      if (!matchMedia("(hover:none)").matches) return;
      const n = e.target.nodeType === 3 ? e.target.parentElement : e.target;
      if (n && n.closest && n.closest(".aiSel,textarea,input")) return;
      e.preventDefault();
    });
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
    memBtn.innerHTML = I_BRAIN; memBtn.setAttribute("aria-label", tx("memTitle")); memBtn.title = tx("memTitle");
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
    if (busy || msgs.length) { renderMsgs(); return null; }       // (typed and sent while it was connecting)
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

  // ---------------------------------------------------------------------------------------------
  // Welcome tour: a short animated "film" that introduces the AI helper. Plays on every app start for now
  // (TOUR_ONCE = true later makes it play only on the very first start). It can be skipped with the X button.
  // ---------------------------------------------------------------------------------------------
  const TOUR_ONCE = false;
  const TOUR = {
    he: [
      { t: "היי! אני העוזר החדש שלך", s: "חדש באפליקציה" },
      { t: "שואלים אותי הכול על הלימודים", s: "מטלות, ציונים, מועדים וקורסים", chips: ["מטלות", "ציונים", "מועדים"] },
      { t: "אני גם שולח לך קבצים", s: "תרגילים והרצאות מהקורסים, ישר לצ'אט", icon: "file" },
      { t: "זוכר מה שחשוב לך", s: "והשיחות שלך נשארות רק שלך", icon: "shield" },
      { t: "לפתיחה, לוחצים על העיגול הזה", s: "תמיד כאן בשבילך", last: true },
    ],
    en: [
      { t: "Hi! I'm your new assistant", s: "New in the app" },
      { t: "Ask me anything about your studies", s: "Tasks, grades, deadlines and courses", chips: ["Tasks", "Grades", "Deadlines"] },
      { t: "I can send you files too", s: "Exercises and lectures from your courses, right in the chat", icon: "file" },
      { t: "I remember what matters to you", s: "And your chats stay yours alone", icon: "shield" },
      { t: "To open me, tap this circle", s: "Always here for you", last: true },
    ],
    fr: [
      { t: "Salut ! Je suis ton nouvel assistant", s: "Nouveau dans l'appli" },
      { t: "Demande-moi tout sur tes études", s: "Devoirs, notes, échéances et cours", chips: ["Devoirs", "Notes", "Échéances"] },
      { t: "Je t'envoie aussi des fichiers", s: "Exercices et cours, directement dans le chat", icon: "file" },
      { t: "Je retiens ce qui compte pour toi", s: "Et tes conversations restent privées", icon: "shield" },
      { t: "Pour m'ouvrir, touche ce cercle", s: "Toujours là pour toi", last: true },
    ],
  };
  const TOUR_CSS = `
#aiTour{position:fixed;inset:0;z-index:99;display:flex;flex-direction:column;align-items:center;justify-content:center;touch-action:none;user-select:none;overflow:hidden;
  animation:atIn .6s ease-out both}
#aiTour.atOut{animation:atOut .7s ease-in both}
.atBg{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 40%,color-mix(in srgb,var(--accent) 22%,#05060d99) 0%,#05060d8c 75%);-webkit-backdrop-filter:blur(4px) saturate(1.1);backdrop-filter:blur(4px) saturate(1.1)}
.atStar{position:absolute;width:var(--sz);height:var(--sz);border-radius:50%;background:#fff;opacity:0;left:var(--x);top:var(--y);animation:atTw var(--d) var(--dl) ease-in-out infinite}
.atFace{position:absolute;left:50%;top:50%;width:132px;height:132px;margin:-66px 0 0 -66px;z-index:2;
  transform:translate(var(--fx),var(--fy)) scale(var(--fs)) rotate(var(--fr));transition:transform 1s cubic-bezier(.34,1.3,.5,1);
  filter:drop-shadow(0 0 28px color-mix(in srgb,var(--accent) 70%,transparent))}
.atIn{position:absolute;inset:0}
.atIn.w1{animation:atWander 5.2s ease-in-out infinite}
.atIn.w2{animation:atSpin 1.3s cubic-bezier(.3,1.2,.4,1) both,atWander 5.2s 1.3s ease-in-out infinite}
.atIn.w3{animation:atBob .9s ease-in-out infinite}
.atIn.w4{animation:atFlip 1.5s cubic-bezier(.3,1.1,.4,1) both,atWander 4.6s 1.5s ease-in-out infinite}
.atIn.w5{animation:atWander 3.4s ease-in-out infinite}
.atFace svg{width:100%;height:100%;display:block;overflow:visible}
.atOrb{position:absolute;inset:-26px;animation:atOrbit 5s linear infinite}
.atOrb.o2{inset:-40px;animation-duration:7.5s;animation-direction:reverse}
.atOrb i{position:absolute;left:50%;top:0;width:8px;height:8px;margin-left:-4px;border-radius:50%;background:color-mix(in srgb,var(--accent) 50%,#fff);box-shadow:0 0 12px var(--accent)}
.atOrb.o2 i{width:5px;height:5px;background:#fff}
.atSp{position:absolute;z-index:2;width:7px;height:7px;margin:-3px 0 0 -3px;border-radius:50%;background:#fff;box-shadow:0 0 10px var(--accent);pointer-events:none;opacity:0;animation:atSpark 1.15s ease-out forwards}
.atFace.atBreathe svg{animation:aiBreathe 2.6s ease-in-out infinite}
.atRing{position:absolute;inset:-14px;border-radius:50%;border:2px solid color-mix(in srgb,var(--accent) 80%,#fff);opacity:0;animation:atRing 2.4s ease-out infinite}
.atRing.r2{animation-delay:1.2s}
.atTx{position:absolute;left:0;right:0;top:calc(50% + 100px);z-index:3;padding:0 24px;text-align:center;color:#fff;pointer-events:none}
.atTx b{display:block;text-shadow:0 2px 14px #000c;font-size:clamp(22px,6.4vw,32px);line-height:1.25;font-weight:800;letter-spacing:.2px}
.atTx b span{display:inline-block;opacity:0;animation:atWord .7s var(--wd) cubic-bezier(.2,.9,.3,1) both}
.atTx small{display:block;margin-top:10px;font-size:clamp(14px,4vw,17px);color:#ffffffb8;opacity:0;animation:atSub .7s .55s ease-out both}
.atTx.atGone{animation:atGone .45s ease-in both}
.atChips{margin-top:16px;display:flex;gap:8px;justify-content:center;flex-wrap:wrap}
.atChips i{font-style:normal;padding:6px 14px;border-radius:99px;background:#ffffff1f;border:1px solid #ffffff3d;color:#fff;font-size:14px;opacity:0;animation:atChip .6s var(--cd) cubic-bezier(.2,.9,.3,1.4) both}
.atIcon{margin:16px auto 0;width:44px;height:44px;color:color-mix(in srgb,var(--accent) 55%,#fff);opacity:0;animation:atChip .7s .45s cubic-bezier(.2,.9,.3,1.4) both}
.atIcon svg{width:100%;height:100%;display:block}
.atSkip{position:absolute;z-index:5;top:calc(14px + env(safe-area-inset-top));inset-inline-end:14px;width:40px;height:40px;padding:0;border-radius:50%;border:1.5px solid #ffffff59;background:#ffffff1f;color:#fff;
  display:grid;place-items:center;cursor:pointer;pointer-events:auto;-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);opacity:0;animation:atChip .6s .8s cubic-bezier(.2,.9,.3,1.3) both;transition:background .2s,transform .15s}
.atSkip:hover{background:#ffffff40}
.atSkip:active{transform:scale(.9)}
.atSkip:focus-visible{outline:3px solid #fff;outline-offset:3px}
.atSkip svg{width:18px;height:18px;display:block}
.atDots{position:absolute;bottom:calc(34px + env(safe-area-inset-bottom));left:0;right:0;display:flex;gap:7px;justify-content:center;z-index:3}
.atDots i{width:7px;height:7px;border-radius:99px;background:#ffffff40;transition:width .4s,background .4s}
.atDots i.on{width:22px;background:#fff}
.atArrow{position:absolute;z-index:3;width:34px;height:34px;color:#fff;animation:atBounce 1s ease-in-out infinite}
.atArrow svg{width:100%;height:100%;display:block}
@keyframes atIn{from{opacity:0}to{opacity:1}}
@keyframes atWander{0%,100%{transform:translate(0,0) rotate(0)}20%{transform:translate(38px,-18px) rotate(7deg)}45%{transform:translate(-30px,-34px) rotate(-8deg)}70%{transform:translate(-42px,16px) rotate(5deg)}85%{transform:translate(22px,22px) rotate(-4deg)}}
@keyframes atSpin{0%{transform:rotate(0) scale(1)}60%{transform:rotate(380deg) scale(1.25)}100%{transform:rotate(360deg) scale(1)}}
@keyframes atBob{0%,100%{transform:translateY(0) scale(1,1)}30%{transform:translateY(-26px) scale(.94,1.08)}55%{transform:translateY(0) scale(1.1,.9)}75%{transform:translateY(-9px) scale(.98,1.03)}}
@keyframes atFlip{0%{transform:perspective(500px) rotateY(0)}100%{transform:perspective(500px) rotateY(360deg)}}
@keyframes atOrbit{to{transform:rotate(360deg)}}
@keyframes atSpark{0%{opacity:1;transform:translate(0,0) scale(1)}100%{opacity:0;transform:translate(var(--dx),var(--dy)) scale(.2)}}
@keyframes atOut{to{opacity:0}}
@keyframes atTw{0%,100%{opacity:0;transform:scale(.6)}50%{opacity:.85;transform:scale(1)}}
@keyframes atRing{0%{opacity:.7;transform:scale(.8)}100%{opacity:0;transform:scale(1.9)}}
@keyframes atWord{from{opacity:0;transform:translateY(18px) scale(.9);filter:blur(8px)}to{opacity:1;transform:none;filter:blur(0)}}
@keyframes atSub{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
@keyframes atGone{to{opacity:0;transform:translateY(-16px);filter:blur(6px)}}
@keyframes atChip{from{opacity:0;transform:translateY(14px) scale(.7)}to{opacity:1;transform:none}}
@keyframes atBounce{0%,100%{transform:translateY(0)}50%{transform:translateY(7px)}}
`;
  const TOUR_ICONS = {
    file: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/><path d="M9 13h6M9 17h4"/></svg>',
    shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6z"/><path d="M9 12l2 2 4-4"/></svg>',
    arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4v15M6 13l6 6 6-6"/></svg>',
  };
  const SKIP_LABEL = { he: "דלג על ההסבר", en: "Skip the intro", fr: "Passer l'introduction" };
  let tourState = 0;                                            // 0 = not yet, 1 = running, 2 = done (this page load)
  function runTour() {
    if (tourState || !fab || !panel || !panel.hidden) return;
    if (TOUR_ONCE) { try { if (LS.get("aiTourSeen", "")) return; LS.set("aiTourSeen", "1"); } catch (e) {} }
    tourState = 1;
    const scenes = TOUR[lang()] || TOUR.he;
    const st = document.createElement("style"); st.textContent = TOUR_CSS; document.head.appendChild(st);
    fab.style.visibility = "hidden"; fab.hidden = false;
    const fr = fab.getBoundingClientRect();
    const vw = innerWidth, vh = innerHeight;
    const fabX = fr.left + fr.width / 2 - vw / 2, fabY = fr.top + fr.height / 2 - vh / 2;
    const fabS = fr.width / 132;
    const root = document.createElement("div"); root.id = "aiTour"; root.setAttribute("role", "status"); root.setAttribute("aria-live", "polite");
    let stars = "";
    for (let i = 0; i < 26; i++) stars += '<span class="atStar" style="--x:' + (Math.random() * 100).toFixed(1) + '%;--y:' + (Math.random() * 100).toFixed(1) + '%;--sz:' + (1 + Math.random() * 2.4).toFixed(1) + 'px;--d:' + (2.4 + Math.random() * 3).toFixed(1) + 's;--dl:' + (Math.random() * 3).toFixed(1) + 's"></span>';
    root.innerHTML = '<div class="atBg"></div>' + stars + '<div class="atFace" style="--fx:' + fabX + 'px;--fy:' + fabY + 'px;--fs:' + fabS + ';--fr:0deg"><div class="atIn w1">' + FACE + '<i class="atRing"></i><i class="atRing r2"></i><div class="atOrb"><i></i></div><div class="atOrb o2"><i></i></div></div></div><div class="atTx"></div><div class="atDots">' + scenes.map(() => "<i></i>").join("") + '</div><button type="button" class="atSkip" aria-label="' + (SKIP_LABEL[lang()] || SKIP_LABEL.he) + '"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg></button>';
    document.body.appendChild(root);
    const face = root.querySelector(".atFace"), inner = root.querySelector(".atIn"), txEl = root.querySelector(".atTx"), dots = root.querySelectorAll(".atDots i");
    const setFace = (x, y, s, r) => { face.style.setProperty("--fx", x + "px"); face.style.setProperty("--fy", y + "px"); face.style.setProperty("--fs", s); face.style.setProperty("--fr", r + "deg"); };
    // where the face rests in each scene (a little drift and tilt, like it is alive); the last scene flies it onto the real button
    const hh = vh / 2, ww = vw / 2;
    const lay = [
      { f: [0, -hh * .26, 1, 0], top: "calc(50% + 100px)", dx: 0 },
      { f: [-ww * .42, hh * .5, .8, -10], top: "max(56px, calc(50% - 250px))", dx: 0 },
      { f: [ww * .4, -hh * .5, .84, 9], top: "calc(50% + 24px)", dx: -ww * .12 },
      { f: [-ww * .3, -hh * .08, .9, -6], top: "calc(50% + 70px)", dx: ww * .1 },
    ];
    const burst = () => {
      const r = face.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      for (let k = 0; k < 12; k++) {
        const sp = document.createElement("i"); sp.className = "atSp"; const a = Math.PI * 2 * k / 12 + Math.random() * .4, d = 70 + Math.random() * 70;
        sp.style.left = cx + "px"; sp.style.top = cy + "px"; sp.style.setProperty("--dx", Math.cos(a) * d + "px"); sp.style.setProperty("--dy", Math.sin(a) * d + "px");
        root.appendChild(sp); setTimeout(() => sp.remove(), 1250);
      }
    };
    const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
    let timers = [], finished = false;
    const later = (fn, ms) => { timers.push(setTimeout(fn, ms)); };
    function scene(i) {
      const sc = scenes[i]; if (!sc) return;
      dots.forEach((d, k) => d.classList.toggle("on", k === i));
      const words = sc.t.split(" ").map((w, k) => '<span style="--wd:' + (0.08 + k * 0.11).toFixed(2) + 's">' + esc(w) + "</span>").join(" ");
      let extra = "";
      if (sc.chips) extra += '<div class="atChips">' + sc.chips.map((c, k) => '<i style="--cd:' + (0.5 + k * 0.16).toFixed(2) + 's">' + esc(c) + "</i>").join("") + "</div>";
      if (sc.icon) extra += '<div class="atIcon">' + TOUR_ICONS[sc.icon] + "</div>";
      txEl.classList.remove("atGone"); void txEl.offsetWidth;
      txEl.innerHTML = "<b>" + words + "</b><small>" + esc(sc.s) + "</small>" + extra;
      if (sc.last) {
        face.classList.remove("atBreathe");
        setFace(fabX, fabY, fabS, 0);
        const ar = document.createElement("div"); ar.className = "atArrow";
        ar.style.left = Math.max(8, Math.min(vw - 42, fr.left + fr.width / 2 - 17)) + "px"; ar.style.top = Math.max(8, fr.top - 46) + "px";
        ar.innerHTML = TOUR_ICONS.arrow; root.appendChild(ar);
        txEl.style.top = "calc(50% - 70px)"; txEl.style.left = "0px"; txEl.style.right = "0px";
        inner.className = "atIn w5";
      } else {
        const L = lay[Math.min(i, lay.length - 1)]; setFace(L.f[0], L.f[1], L.f[2], L.f[3]);
        txEl.style.top = L.top; txEl.style.left = L.dx + "px"; txEl.style.right = -L.dx + "px";
        face.classList.add("atBreathe");
        inner.className = "atIn w" + (i + 1);
        setTimeout(burst, 650);
      }
    }
    function finish() {
      if (finished) return; finished = true;
      timers.forEach(clearTimeout);
      root.classList.add("atOut");
      setTimeout(() => {
        root.remove(); st.remove();
        fab.style.visibility = ""; fab.classList.remove("aiPop"); void fab.offsetWidth; fab.classList.add("aiPop"); setTimeout(() => fab.classList.remove("aiPop"), 800);
        tourState = 2;
      }, 720);
    }
    root.querySelector(".atSkip").addEventListener("click", e => { e.stopPropagation(); finish(); });
    // timeline: the face grows out of the circle into the middle of the screen, then the scenes follow one another
    later(() => { setFace(0, -vh / 2 * .26, 1, 0); face.classList.add("atBreathe"); }, 350);
    later(burst, 1000);
    const START = 1300, STEP = 2900;
    scenes.forEach((sc, i) => {
      later(() => scene(i), START + i * STEP);
      if (i < scenes.length - 1) later(() => txEl.classList.add("atGone"), START + (i + 1) * STEP - 420);
    });
    later(finish, START + (scenes.length - 1) * STEP + 3300);
    later(finish, 30000);                                      // safety net: whatever happens, the screen is never locked for good
  }

  window.AIChat = {
    show() { build(); warmUp(); const l = tx("title"); fab.setAttribute("aria-label", l); fab.title = l; if (panel.hidden) fab.hidden = false; try { runTour(); } catch (e) { tourState = 2; const t = document.getElementById("aiTour"); if (t) t.remove(); fab.style.visibility = ""; } },
    hide() { if (fab) fab.hidden = true; if (panel && !panel.hidden) close(false, true); },
    open,
    // for tests only: pretend the visible area is something else (a keyboard of a given size), then re-measure
    _vv(v) { vvOverride = v || null; baseH = 0; lastKey = ""; kbWas = false; fit(true); },
    _fit() { fit(true); },
  };
})();
