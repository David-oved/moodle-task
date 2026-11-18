/* MoodlePro – community management. Downloaded ONLY after the community server says this account is an admin (social.js → admLoad); nobody else's app
   ever fetches it, and there is no button for anyone else. Everything here is only a view: every call is checked on the server – the admin account AND a
   passkey session (Face ID / fingerprint) – so reading this file gives nothing. */
window.SOC_ADMIN = K => {
"use strict";
delete window.SOC_ADMIN;
const { api, ST, sheet, xbtn, overview, msgTime, linkify, rankTag, degLabel, close } = K;
Object.assign(I18N.he, {
  adCancel: "ביטול",
  adOv: "סקירה",
  adChats: "צ׳אטים",
  adUsers: "משתמשים",
  adLog: "יומן פעולות",
  adOk: "🛡 מעכשיו את/ה מנהל/ת הקהילה",
  adBad: "הקוד לא נכון או שכבר השתמשו בו",
  adTries: "יותר מדי ניסיונות היום. נסו מחר",
  adNo: "אין הרשאת ניהול",
  adOpenTh: "לשיחה ←",
  adBack: "→ חזרה",
  adNMsgs: n => n + " הודעות",
  adRecent: "ההודעות האחרונות מכל הקורסים",
  adUsersN: "בקהילה",
  adAct7: "פעילים בשבוע",
  adAct1: "פעילים היום",
  adMsgs7: "הודעות בשבוע",
  adPost7: "כותבים בשבוע",
  adFiles: "קבצים",
  adTimes: "דיווחי זמן",
  adStars: "סימוני ⭐",
  adDays: "הודעות ב-14 הימים האחרונים",
  adCourses: "צ׳אטים לפי קורס",
  adCrsLine: (n, w, p) => n + " הודעות · " + w + " השבוע · " + p + " כותבים",
  adTop: "הכי הרבה נקודות",
  adSearch: "חיפוש לפי שם",
  adSeen: x => "נראה " + x,
  adGive: "＋ נקודות",
  adAmount: "כמה",
  adWhyBeta: "בודק/ת בטא",
  adWhyFb: "פידבק טוב וקבוע",
  adWhyHelp: "עזרה מיוחדת",
  adWhyPh: "סיבה (תופיע ביומן הנקודות שלו/ה)",
  adGiveTo: n => "לתת ל" + n,
  adBadAmt: "בין 500- ל-500",
  adNeedWhy: "צריך סיבה קצרה",
  adGiven: (p, tot) => p + " נקודות ניתנו ✓ עכשיו יש " + tot,
  adNone: "אין כאן כלום",
  adLogGrant: (p, n) => p + " נקודות ל" + n,
  adLogClaim: "הפך/ה למנהל/ת",
  adPkAsk: "כדי לפתוח את הניהול צריך לאמת שזה אתה: \u2068Face\u00a0ID\u2069, טביעת אצבע או קוד הנעילה של המכשיר. השרת בודק את האימות, ובלעדיו הוא לא מחזיר כלום.", adPkNew: "פעם ראשונה: יוצרים מפתח גישה (Passkey) במכשיר הזה. מעכשיו הניהול נפתח רק אחרי \u2068Face\u00a0ID\u2069 / טביעת אצבע שלך – גם אם מישהו יקבל איכשהו את החשבון שלך בקהילה.", adPkAdd: "מפתח גישה למכשיר נוסף: אחרי זה גם המכשיר הזה יוכל לפתוח את הניהול בלי הטלפון.", adPkBtn: "🔐 אימות", adPkBtnNew: "🔐 יצירת מפתח גישה", adPkCancel: "האימות בוטל או לא הצליח. אפשר לנסות שוב.", adPkNoSup: "המכשיר או הדפדפן הזה לא תומכים במפתחות גישה", adPkBad: "השרת לא קיבל את האימות", adPkEnd: "עברה חצי שעה – צריך לאמת שוב", adPkMore: "＋ מפתח גישה למכשיר נוסף", adPkOk: "מפתח הגישה נשמר ✓", adLogPkAdd: "נוסף מפתח גישה", adLogPkIn: "כניסה לניהול (מפתח גישה)",
});
Object.assign(I18N.en, {
  adCancel: "Cancel",
  adOv: "Overview",
  adChats: "Chats",
  adUsers: "People",
  adLog: "Action log",
  adOk: "🛡 You are now the community admin",
  adBad: "Wrong or already used code",
  adTries: "Too many tries today. Try tomorrow",
  adNo: "No admin access",
  adOpenTh: "Open →",
  adBack: "← Back",
  adNMsgs: n => n + " messages",
  adRecent: "Latest messages from all courses",
  adUsersN: "In the community",
  adAct7: "Active this week",
  adAct1: "Active today",
  adMsgs7: "Messages this week",
  adPost7: "Writers this week",
  adFiles: "Files",
  adTimes: "Time reports",
  adStars: "⭐ marks",
  adDays: "Messages, last 14 days",
  adCourses: "Chats by course",
  adCrsLine: (n, w, p) => n + " messages · " + w + " this week · " + p + " writers",
  adTop: "Most points",
  adSearch: "Search by name",
  adSeen: x => "Seen " + x,
  adGive: "＋ Points",
  adAmount: "Amount",
  adWhyBeta: "Beta tester",
  adWhyFb: "Great, steady feedback",
  adWhyHelp: "Special help",
  adWhyPh: "Reason (shown in their points log)",
  adGiveTo: n => "Give to " + n,
  adBadAmt: "Between -500 and 500",
  adNeedWhy: "Add a short reason",
  adGiven: (p, tot) => p + " points given ✓ now " + tot,
  adNone: "Nothing here",
  adLogGrant: (p, n) => p + " points to " + n,
  adLogClaim: "Became admin",
  adPkAsk: "To open admin, confirm it’s you: Face ID, fingerprint or the device’s lock code. The server checks it and returns nothing without it.", adPkNew: "First time: create a passkey on this device. From now on admin opens only after your Face ID / fingerprint – even if someone somehow got your community account.", adPkAdd: "A passkey for another device: afterwards this device can open admin without the phone.", adPkBtn: "🔐 Verify", adPkBtnNew: "🔐 Create a passkey", adPkCancel: "Verification was cancelled or failed. You can try again.", adPkNoSup: "This device or browser doesn’t support passkeys", adPkBad: "The server didn’t accept the verification", adPkEnd: "Half an hour passed – verify again", adPkMore: "＋ Passkey for another device", adPkOk: "Passkey saved ✓", adLogPkAdd: "Passkey added", adLogPkIn: "Opened admin (passkey)",
});
Object.assign(I18N.fr, {
  adCancel: "Annuler",
  adOv: "Aperçu",
  adChats: "Chats",
  adUsers: "Membres",
  adLog: "Journal",
  adOk: "🛡 Vous gérez maintenant la communauté",
  adBad: "Code faux ou déjà utilisé",
  adTries: "Trop d’essais aujourd’hui",
  adNo: "Pas d’accès",
  adOpenTh: "Ouvrir →",
  adBack: "← Retour",
  adNMsgs: n => n + " messages",
  adRecent: "Derniers messages de tous les cours",
  adUsersN: "Membres",
  adAct7: "Actifs cette semaine",
  adAct1: "Actifs aujourd’hui",
  adMsgs7: "Messages cette semaine",
  adPost7: "Auteurs cette semaine",
  adFiles: "Fichiers",
  adTimes: "Durées",
  adStars: "⭐",
  adDays: "Messages, 14 derniers jours",
  adCourses: "Chats par cours",
  adCrsLine: (n, w, p) => n + " messages · " + w + " cette semaine · " + p + " auteurs",
  adTop: "Le plus de points",
  adSearch: "Chercher un nom",
  adSeen: x => "Vu " + x,
  adGive: "＋ Points",
  adAmount: "Montant",
  adWhyBeta: "Testeur bêta",
  adWhyFb: "Retours réguliers",
  adWhyHelp: "Aide spéciale",
  adWhyPh: "Raison (dans son journal de points)",
  adGiveTo: n => "Donner à " + n,
  adBadAmt: "Entre -500 et 500",
  adNeedWhy: "Ajoutez une raison",
  adGiven: (p, tot) => p + " points donnés ✓ total " + tot,
  adNone: "Rien ici",
  adLogGrant: (p, n) => p + " points à " + n,
  adLogClaim: "Devenu admin",
  adPkAsk: "Pour ouvrir la gestion, confirmez que c’est vous : Face ID, empreinte ou code de l’appareil. Le serveur le vérifie et ne renvoie rien sans lui.", adPkNew: "Première fois : créez une clé d’accès (passkey) sur cet appareil. Ensuite la gestion s’ouvre seulement après votre Face ID / empreinte – même si quelqu’un obtenait votre compte.", adPkAdd: "Une clé d’accès pour un autre appareil : ensuite cet appareil pourra ouvrir la gestion sans le téléphone.", adPkBtn: "🔐 Vérifier", adPkBtnNew: "🔐 Créer une clé d’accès", adPkCancel: "Vérification annulée ou échouée. Vous pouvez réessayer.", adPkNoSup: "Cet appareil ou ce navigateur ne gère pas les clés d’accès", adPkBad: "Le serveur n’a pas accepté la vérification", adPkEnd: "Une demi-heure est passée – vérifiez à nouveau", adPkMore: "＋ Clé d’accès pour un autre appareil", adPkOk: "Clé d’accès enregistrée ✓", adLogPkAdd: "Clé d’accès ajoutée", adLogPkIn: "Gestion ouverte (clé d’accès)",
});
const css = document.createElement("style");
css.textContent = `
.adtabs{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px}
.adtiles{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px}@media (max-width:520px){.adtiles{grid-template-columns:repeat(2,minmax(0,1fr))}}
.adtile{background:var(--row);border-radius:12px;padding:8px;text-align:center}.adtile b{display:block;font-size:20px;font-variant-numeric:tabular-nums}.adtile span{font-size:12px;color:var(--muted)}
.addays{display:flex;align-items:flex-end;gap:4px;height:64px;padding:2px 0;border-bottom:1px solid var(--line)}.addays i{flex:1;background:var(--accent);border-radius:4px 4px 0 0;min-width:4px}
.adrow{display:flex;align-items:center;gap:10px;width:100%;text-align:start;padding:9px 10px;border:1px solid var(--line);border-radius:12px;background:var(--card);color:inherit;font:inherit;margin-bottom:6px;cursor:pointer}
.adrow.st{cursor:default}.adrow .sw{flex:1;min-width:0;display:flex;flex-direction:column}.adrow small{color:var(--muted);font-size:12.5px}.adrow .dot{width:10px;height:10px;border-radius:50%;background:var(--c,var(--accent));flex:none}.adrow>.i{width:16px;height:16px;color:var(--muted);flex:none}
.adm{border:1px solid var(--line);border-radius:12px;padding:8px 10px;margin-bottom:6px;background:var(--card)}.adm.del{opacity:.55}.admh{font-size:13px;display:flex;gap:6px;flex-wrap:wrap;align-items:baseline}.admh small{color:var(--muted);margin-inline-start:auto}
.admb{white-space:pre-wrap;overflow-wrap:anywhere;margin:3px 0}
#adQ,#adWhy,#adPts{font:inherit;border:1px solid var(--line);border-radius:10px;padding:7px 10px;background:var(--row);color:inherit}#adQ{width:100%;margin-bottom:8px;box-sizing:border-box}#adWhy{width:100%;box-sizing:border-box}#adPts{width:90px}
.adgf{display:grid;gap:8px;padding:10px;margin:-2px 0 8px;border:1px dashed var(--line);border-radius:12px}.adchips{display:flex;gap:6px;flex-wrap:wrap;align-items:center}
.adlock{display:grid;justify-items:center;gap:12px;text-align:center;padding:18px 6px 8px}.adlock>.i{width:44px;height:44px;color:var(--accent-t)}.adlock p{margin:0;max-width:36ch;line-height:1.5}.adlock .primary{min-width:200px}
`;
document.head.appendChild(css);

/* ---------- the lock: a passkey (WebAuthn) made on Meir's device. The server keeps only its PUBLIC key and checks every signature;
   a session is good for 30 minutes and lives only in this page's memory (never saved), so every new launch asks again ---------- */
const b64u = u => btoa(String.fromCharCode(...new Uint8Array(u))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
const unb64u = s => Uint8Array.from(atob(String(s).replace(/-/g, "+").replace(/_/g, "/") + "===".slice((String(s).length + 3) % 4)), c => c.charCodeAt(0));
async function adApi(op, body) {
  try { return await api(op, Object.assign({}, body, { at: AD.at })); }
  catch (e) { if (e.status === 401) { AD.at = ""; AD.exp = 0; adBegin(t("adPkEnd")); } throw e; }
}
const adHead = () => "<h3><span>" + ic("shield") + " " + esc(t("adT")) + "</span>" + xbtn() + "</h3>";
function adLock(msg) {
  const c = AD.pk, mk = !!c && (!c.has || AD.adding);
  sheet("socAdmin", adHead() + '<div class="adlock">' + ic("shield") + "<p>" + esc(t(AD.adding ? "adPkAdd" : mk ? "adPkNew" : "adPkAsk")) + "</p>" + (msg ? '<p class="hint">' + esc(msg) + "</p>" : "") +
    '<button class="primary" data-adpk' + (c ? "" : " disabled") + ">" + esc(t(mk ? "adPkBtnNew" : "adPkBtn")) + "</button>" + (AD.adding ? '<button class="link" data-adpkno>' + esc(t("adCancel")) + "</button>" : "") + "</div>");
}
async function adBegin(msg) {          // a fresh challenge from the server first, so the button can call the passkey straight from the tap (iPhone needs that)
  AD.pk = null; adLock(msg || t("socLoading"));
  try { AD.pk = await api("admin/pk/begin", AD.adding ? { at: AD.at } : {}); adLock(msg); }
  catch (e) { adLock(e.status === 403 ? t("adNo") : e.status === 429 ? t("adTries") : t("socNet")); }
}
async function adPk() {
  const c = AD.pk; if (!c) return;
  if (!window.PublicKeyCredential || !navigator.credentials) return adLock(t("adPkNoSup"));
  const mk = !c.has || AD.adding, ids = (c.ids || []).map(id => ({ type: "public-key", id: unb64u(id) })); AD.pk = null; let cr;
  try {
    cr = mk ? await navigator.credentials.create({ publicKey: { challenge: unb64u(c.ch), rp: { id: c.rp, name: "MoodlePro" }, user: { id: unb64u(c.uh), name: "MoodlePro admin", displayName: "MoodlePro · " + t("adT") },
        pubKeyCredParams: [{ type: "public-key", alg: -7 }, { type: "public-key", alg: -257 }], authenticatorSelection: { userVerification: "required", residentKey: "preferred" }, attestation: "none", timeout: 120000, excludeCredentials: ids } })
      : await navigator.credentials.get({ publicKey: { challenge: unb64u(c.ch), rpId: c.rp, allowCredentials: ids, userVerification: "required", timeout: 120000 } });
  } catch (e) { return adBegin(t("adPkCancel")); }
  if (!cr) return adBegin(t("adPkCancel"));
  const r = cr.response;
  try {
    const s = mk ? await api("admin/pk/reg", { cd: b64u(r.clientDataJSON), ao: b64u(r.attestationObject), at: AD.at })
      : await api("admin/pk/auth", { id: b64u(cr.rawId), cd: b64u(r.clientDataJSON), ad: b64u(r.authenticatorData), sig: b64u(r.signature) });
    AD.at = s.at; AD.exp = Date.now() + s.ttl; if (mk) { toast(t("adPkOk")); useHit("adPkAdd"); } AD.adding = false; openAdmin(mk ? "log" : undefined);
  } catch (e) { adBegin(e.status === 429 ? t("adTries") : t("adPkBad")); }
}
async function adminClaim(code) {
  try { await api("admin/claim", { code }); toast(t("adOk"), 6000); useHit("adClaim"); AD.at = ""; AD.adding = false; await overview(true); openAdmin(); }
  catch (e) { toast(e.status === 429 ? t("adTries") : t("adBad"), 6000); }
}

const AD = { tab: "ov", ov: null, users: null, q: "", log: null, th: null, crs: null, grantTo: null, at: "", exp: 0, pk: null, adding: false };
async function adLoad(op, body, key) { try { AD[key] = await adApi(op, body); } catch (e) { AD[key] = { err: e.status === 403 ? t("adNo") : t("socNet") }; } adDraw(); }
function openAdmin(tab) {
  if (tab) AD.tab = tab; useHit("adOpen");
  if (!AD.at || Date.now() > AD.exp - 5000) return adBegin();      // no passkey session (or it ran out): the lock first
  sheet("socAdmin", "<h3><span>" + ic("shield") + " " + esc(t("adT")) + "</span>" + xbtn() + '</h3><div class="adtabs">' +
    [["ov", "adOv"], ["chats", "adChats"], ["users", "adUsers"], ["log", "adLog"]].map(([k, l]) => '<button class="chf" data-adtab="' + k + '">' + esc(t(l)) + "</button>").join("") + '</div><div id="adBody"><div class="hint">' + esc(t("socLoading")) + "</div></div>");
  adGo(AD.tab);
}
function adGo(tab) {
  AD.tab = tab; AD.th = null; AD.crs = null;
  $$("#socAdmin [data-adtab]").forEach(b => b.classList.toggle("on", b.dataset.adtab === tab));
  if (tab === "ov" || tab === "chats") adLoad("admin/ov", {}, "ov"); else if (tab === "users") adLoad("admin/users", { q: AD.q }, "users"); else adLoad("admin/log", {}, "log");
}
const adMsg = m => '<div class="adm' + (m.del ? " del" : "") + '"><div class="admh"><b><bdi>' + esc(m.name || "?") + "</bdi></b> · <bdi>" + esc(shortName(m.cn || "")) + "</bdi>" + (m.tn ? " · <bdi>" + esc(m.tn) + "</bdi>" : "") +
  '<small>' + esc(msgTime(m.at)) + (m.stars ? " · ⭐" + m.stars : "") + '</small></div><div class="admb">' + (m.del ? esc(t("chatDel")) : linkify(esc(m.body || ""))) + '</div><button class="link" data-adth="' + esc(m.cid) + "|" + esc(m.tk) + '">' + esc(t("adOpenTh")) + "</button></div>";
function adDraw() {
  const el = $("#adBody"); if (!el) return;
  if (AD.th) {                                  // one conversation, read only
    const x = AD.th; if (x.err) { el.innerHTML = '<p class="hint">' + esc(x.err) + "</p>"; return; }
    el.innerHTML = '<button class="link" data-adback>' + esc(t("adBack")) + '</button><div class="stitle"><bdi>' + esc(shortName(x.name || "")) + "</bdi>" + (x.tn ? " · <bdi>" + esc(x.tn) + "</bdi>" : " · " + esc(t("chatCourse"))) + "</div>" +
      (x.msgs.length ? x.msgs.map(m => '<div class="adm' + (m.del ? " del" : "") + '"><div class="admh"><b><bdi>' + esc(m.name || "?") + '</bdi></b><small>' + esc(msgTime(m.at)) + (m.stars ? " · ⭐" + m.stars : "") + '</small></div><div class="admb">' + (m.del ? esc(t("chatDel")) : linkify(esc(m.body || ""))) + "</div></div>").join("") : '<p class="hint">' + esc(t("chatEmpty")) + "</p>");
    return;
  }
  if (AD.crs) {
    const x = AD.crs; if (x.err) { el.innerHTML = '<p class="hint">' + esc(x.err) + "</p>"; return; }
    el.innerHTML = '<button class="link" data-adback>' + esc(t("adBack")) + '</button><div class="stitle"><bdi>' + esc(shortName(x.name || "")) + "</bdi></div>" +
      x.thr.map(r => '<button class="adrow" data-adth="' + esc(x.cid) + "|" + esc(r.tk) + '"><span class="sw"><b><bdi>' + esc(r.tk === "c" ? t("chatCourse") : r.ref || r.tk) + "</bdi></b><small>" + esc(t("adNMsgs", r.n) + " · " + msgTime(r.last)) + "</small></span>" + ic("chevron-left") + "</button>").join("");
    return;
  }
  if (AD.tab === "ov" || AD.tab === "chats") {
    const o = AD.ov; if (!o) { el.innerHTML = '<div class="hint">' + esc(t("socLoading")) + "</div>"; return; } if (o.err) { el.innerHTML = '<p class="hint">' + esc(o.err) + "</p>"; return; }
    if (AD.tab === "chats") { el.innerHTML = '<div class="stitle">' + esc(t("adRecent")) + "</div>" + (o.recent.length ? o.recent.map(adMsg).join("") : '<p class="hint">' + esc(t("chatEmpty")) + "</p>"); return; }
    const s = o.stats, tile = (n, l) => '<div class="adtile"><b>' + esc(String(n)) + "</b><span>" + esc(l) + "</span></div>", mx = Math.max(1, ...o.days.map(d => d.n));
    el.innerHTML = '<div class="adtiles">' + tile(s.users, t("adUsersN")) + tile(s.active7, t("adAct7")) + tile(s.active1, t("adAct1")) + tile(s.msgs7, t("adMsgs7")) + tile(s.posters7, t("adPost7")) + tile(s.files, t("adFiles")) + tile(s.times, t("adTimes")) + tile(s.stars, t("adStars")) + "</div>" +
      '<div class="stitle">' + esc(t("adDays")) + '</div><div class="addays">' + o.days.map(d => '<i title="' + esc(d.d + ": " + d.n) + '" style="height:' + Math.max(2, Math.round(60 * d.n / mx)) + 'px"></i>').join("") + "</div>" +
      '<div class="stitle">' + esc(t("adCourses")) + "</div>" + (o.courses.length ? o.courses.map(c => '<button class="adrow" data-adcrs="' + esc(c.cid) + '" style="--c:' + colorOf(Number(c.cid)) + '"><i class="dot"></i><span class="sw"><b><bdi>' + esc(shortName(c.name || c.cid)) + "</bdi></b><small>" +
        esc(t("adCrsLine", c.msgs, c.week, c.people) + " · " + msgTime(c.last)) + "</small></span>" + ic("chevron-left") + "</button>").join("") : '<p class="hint">' + esc(t("chatEmpty")) + "</p>") +
      '<div class="stitle">' + esc(t("adTop")) + "</div>" + o.top.map((u, i) => '<div class="adrow st"><span class="sw"><b>' + (i + 1) + ". <bdi>" + esc(u.name) + "</bdi></b><small>" + esc(t("socPts", u.pts)) + "</small></span>" + rankTag(u.pts) + "</div>").join("");
    return;
  }
  if (AD.tab === "users") {
    const o = AD.users;
    el.innerHTML = '<input type="search" id="adQ" placeholder="' + esc(t("adSearch")) + '" value="' + esc(AD.q) + '">' + (!o ? '<div class="hint">' + esc(t("socLoading")) + "</div>" : o.err ? '<p class="hint">' + esc(o.err) + "</p>" :
      o.users.map(u => '<div class="aduser"><div class="adrow st"><span class="sw"><b><bdi>' + esc(u.name) + "</bdi>" + (u.admin ? " 🛡" : "") + "</b><small>" + esc([t("socPts", u.pts), u.deg ? degLabel(u.deg) : "", u.yr ? yrTxt(u.yr) : "", t("adNMsgs", u.msgs), u.seen ? t("adSeen", msgTime(u.seen)) : ""].filter(Boolean).join(" · ")) + "</small></span>" +
        rankTag(u.pts) + '<button class="btn sm" data-adgive="' + esc(u.uid) + '">' + esc(t("adGive")) + "</button></div>" + (AD.grantTo === u.uid ? adGrantForm(u) : "") + "</div>").join("") || '<p class="hint">' + esc(t("adNone")) + "</p>");
    const q = $("#adQ"); if (q) { q.oninput = () => { AD.q = q.value; clearTimeout(AD.qt); AD.qt = setTimeout(() => adLoad("admin/users", { q: AD.q }, "users"), 350); }; if (document.activeElement !== q && AD.qFocus) { q.focus(); q.setSelectionRange(q.value.length, q.value.length); } }
    return;
  }
  const o = AD.log; if (!o) { el.innerHTML = '<div class="hint">' + esc(t("socLoading")) + "</div>"; return; } if (o.err) { el.innerHTML = '<p class="hint">' + esc(o.err) + "</p>"; return; }
  el.innerHTML = '<button class="btn sm" data-adpkadd style="margin-bottom:10px">' + esc(t("adPkMore")) + "</button>" + (o.log.length ? o.log.map(l => { let d = {}; try { d = JSON.parse(l.d || "{}"); } catch (e) {}
    return '<div class="adrow st"><span class="sw"><b>' + esc(l.act === "grant" ? t("adLogGrant", d.pts > 0 ? "+" + d.pts : String(d.pts), d.name || "?") : l.act === "claim" ? t("adLogClaim") : l.act === "pkadd" ? t("adLogPkAdd") : l.act === "pkin" ? t("adLogPkIn") : l.act) + "</b><small><bdi>" + esc((d.why ? d.why + " · " : "") + (l.name || "") + " · " + msgTime(l.at)) + "</bdi></small></span></div>"; }).join("") : '<p class="hint">' + esc(t("adNone")) + "</p>");
}
const yrTxt = y => /^\d$/.test(String(y)) ? ({ he: "שנה ", en: "Year ", fr: "Année " }[LANG] || "") + y : String(y || "");
const adGrantForm = u => '<div class="adgf"><div class="adchips">' + [10, 25, 50, 100].map(n => '<button class="chf" data-adpts="' + n + '">+' + n + "</button>").join("") +
  '<input type="number" id="adPts" value="25" min="-500" max="500" step="1" aria-label="' + esc(t("adAmount")) + '"></div><div class="adchips">' + ["adWhyBeta", "adWhyFb", "adWhyHelp"].map(k => '<button class="chf" data-adwhy="' + esc(t(k)) + '">' + esc(t(k)) + "</button>").join("") + "</div>" +
  '<input type="text" id="adWhy" maxlength="80" placeholder="' + esc(t("adWhyPh")) + '" value="' + esc(t("adWhyBeta")) + '"><div class="adchips"><button class="primary" data-adsend="' + esc(u.uid) + '">' + esc(t("adGiveTo", u.name)) + '</button><button class="link" data-adcancel>' + esc(t("adCancel")) + "</button></div></div>";
async function adGrant(uid) {
  const pts = Math.trunc(Number(($("#adPts") || {}).value)), why = (($("#adWhy") || {}).value || "").trim();
  if (!pts || Math.abs(pts) > 500) return toast(t("adBadAmt")); if (why.length < 2) return toast(t("adNeedWhy"));
  try { const r = await adApi("admin/grant", { to: uid, pts, why }); toast(t("adGiven", pts > 0 ? "+" + pts : String(pts), r.total.all), 5000); useHit("adGrant"); AD.grantTo = null; adLoad("admin/users", { q: AD.q }, "users"); }
  catch (e) { toast(e.status === 403 ? t("adNo") : t("socNet")); }
}
document.addEventListener("click", e => {
  const g = s => e.target.closest(s); if (!g("#socAdmin")) return; let b;
  if ((b = g("[data-adtab]"))) return adGo(b.dataset.adtab);
  if (g("[data-adback]")) { if (AD.th && AD.crs) { AD.th = null; return adDraw(); } AD.th = null; AD.crs = null; return adDraw(); }
  if ((b = g("[data-adcrs]"))) { AD.crs = { name: "", thr: [] }; adApi("admin/course", { cid: b.dataset.adcrs }).then(r => { AD.crs = r; adDraw(); }).catch(() => { AD.crs = { err: t("socNet") }; adDraw(); }); return adDraw(); }
  if ((b = g("[data-adth]"))) { const [cid, tk] = b.dataset.adth.split("|"); AD.th = { name: "", msgs: [] }; adApi("admin/thread", { cid, tk }).then(r => { AD.th = r; adDraw(); const bx = $("#socAdmin .box"); if (bx) bx.scrollTop = bx.scrollHeight; }).catch(() => { AD.th = { err: t("socNet") }; adDraw(); }); return adDraw(); }
  if ((b = g("[data-adgive]"))) { AD.grantTo = AD.grantTo === b.dataset.adgive ? null : b.dataset.adgive; AD.qFocus = false; return adDraw(); }
  if ((b = g("[data-adpts]"))) { const i = $("#adPts"); if (i) i.value = b.dataset.adpts; return; }
  if ((b = g("[data-adwhy]"))) { const i = $("#adWhy"); if (i) i.value = b.dataset.adwhy; return; }
  if (g("[data-adcancel]")) { AD.grantTo = null; return adDraw(); }
  if ((b = g("[data-adsend]"))) return adGrant(b.dataset.adsend);
  if (g("[data-adpk]")) return adPk();
  if (g("[data-adpkadd]")) { AD.adding = true; return adBegin(); }
  if (g("[data-adpkno]")) { AD.adding = false; return openAdmin(); }
});
document.addEventListener("focusin", e => { if (e.target.id === "adQ") AD.qFocus = true; });
document.addEventListener("focusout", e => { if (e.target.id === "adQ") AD.qFocus = false; });

return { open: openAdmin, claim: adminClaim };
};
