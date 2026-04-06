[engine_connected.html](https://github.com/user-attachments/files/26504330/engine_connected.html)
<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>מנוע החלטה — רישוי כלי ירייה</title>
<style>
@import url('https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;600;700;800;900&family=IBM+Plex+Mono:wght@400;500;600&display=swap');

:root {
  --bg: #080c14;
  --surface: #0e1520;
  --surface2: #131d2e;
  --border: rgba(255,255,255,0.07);
  --border2: rgba(255,255,255,0.12);
  --accent: #3b82f6;
  --accent2: #6366f1;
  --green: #10b981;
  --amber: #f59e0b;
  --red: #ef4444;
  --text: #e2e8f0;
  --muted: #64748b;
  --mono: 'IBM Plex Mono', monospace;
}

* { box-sizing: border-box; margin: 0; padding: 0; }

body {
  background: var(--bg);
  color: var(--text);
  font-family: 'Heebo', sans-serif;
  min-height: 100vh;
  direction: rtl;
}

/* ── LAYOUT ── */
.app { display: grid; grid-template-columns: 320px 1fr; min-height: 100vh; }
.sidebar { background: var(--surface); border-left: 1px solid var(--border); padding: 20px 16px; overflow-y: auto; position: sticky; top: 0; height: 100vh; }
.main { padding: 24px; overflow-y: auto; }

/* ── HEADER ── */
.topbar {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 24px; padding-bottom: 16px;
  border-bottom: 1px solid var(--border);
}
.topbar h1 { font-size: 18px; font-weight: 700; }
.badge-system {
  background: linear-gradient(135deg, var(--accent2), var(--accent));
  color: white; font-size: 10px; font-weight: 700;
  padding: 3px 10px; border-radius: 20px; letter-spacing: 1px;
}
.db-status {
  font-family: var(--mono); font-size: 11px;
  display: flex; align-items: center; gap: 6px;
}
.db-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--muted); }
.db-dot.ok { background: var(--green); }
.db-dot.err { background: var(--red); }

/* ── SECTIONS ── */
.section-title {
  font-family: var(--mono); font-size: 10px; color: var(--muted);
  letter-spacing: 2px; text-transform: uppercase;
  margin-bottom: 10px; margin-top: 20px;
}
.section-title:first-child { margin-top: 0; }

/* ── FORM ELEMENTS ── */
label { font-size: 13px; color: var(--muted); display: block; margin-bottom: 4px; }
select, input[type=text], input[type=number] {
  width: 100%; background: var(--bg);
  border: 1px solid var(--border2); border-radius: 6px;
  color: var(--text); padding: 8px 10px; font-family: 'Heebo', sans-serif;
  font-size: 13px; margin-bottom: 10px; transition: border-color .2s;
}
select:focus, input:focus { outline: none; border-color: var(--accent); }

.field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }

/* ── BUTTONS ── */
.btn-primary {
  width: 100%; background: linear-gradient(135deg, var(--accent2), var(--accent));
  color: white; border: none; border-radius: 8px; padding: 12px;
  font-family: 'Heebo', sans-serif; font-size: 15px; font-weight: 700;
  cursor: pointer; margin-top: 4px; transition: opacity .2s;
}
.btn-primary:hover { opacity: .9; }

.btn-sm {
  background: var(--surface2); border: 1px solid var(--border2);
  color: var(--text); border-radius: 6px; padding: 6px 12px;
  font-family: 'Heebo', sans-serif; font-size: 12px; cursor: pointer;
  transition: border-color .2s;
}
.btn-sm:hover { border-color: var(--accent); color: var(--accent); }

/* ── CARDS ── */
.card {
  background: var(--surface); border: 1px solid var(--border);
  border-radius: 12px; padding: 18px; margin-bottom: 16px;
}
.card.green-border { border-color: var(--green); }
.card.red-border { border-color: var(--red); }
.card.amber-border { border-color: var(--amber); }

/* ── GATE STATUS ── */
.gate-row {
  display: flex; align-items: center; gap: 10px;
  padding: 7px 10px; border-radius: 6px; margin-bottom: 4px;
  font-size: 13px;
}
.gate-row.pass { background: rgba(16,185,129,.08); }
.gate-row.fail { background: rgba(239,68,68,.08); }
.gate-row.warn { background: rgba(245,158,11,.08); }
.gate-row.pending { background: rgba(100,116,139,.08); }

.gate-icon { font-size: 14px; flex-shrink: 0; }

/* ── ROUTES ── */
.route-card {
  background: var(--surface2); border: 1px solid var(--border);
  border-radius: 10px; padding: 14px 16px; margin-bottom: 10px;
  cursor: pointer; transition: border-color .2s;
}
.route-card:hover { border-color: var(--accent); }
.route-card.selected { border-color: var(--green); background: rgba(16,185,129,.06); }
.route-card.blocked { border-color: var(--red); opacity: .6; cursor: not-allowed; }

.route-header { display: flex; align-items: center; justify-content: space-between; }
.route-name { font-size: 14px; font-weight: 600; }
.route-group { font-family: var(--mono); font-size: 10px; color: var(--muted); margin-top: 2px; }
.route-tag {
  font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 20px;
}
.route-tag.ok { background: rgba(16,185,129,.15); color: var(--green); }
.route-tag.blocked { background: rgba(239,68,68,.15); color: var(--red); }

/* ── DOCS LIST ── */
.doc-item {
  display: flex; align-items: center; gap: 8px;
  padding: 6px 8px; border-radius: 6px; font-size: 13px;
  margin-bottom: 3px;
}
.doc-item.required { background: rgba(59,130,246,.06); }
.doc-item.affidavit { background: rgba(99,102,241,.06); }
.doc-item.authority { background: rgba(245,158,11,.06); }

/* ── FLAGS ── */
.flag-item {
  display: flex; align-items: flex-start; gap: 8px;
  padding: 8px 10px; border-radius: 6px; font-size: 13px;
  margin-bottom: 6px;
}
.flag-item.hard { background: rgba(239,68,68,.1); border: 1px solid rgba(239,68,68,.2); }
.flag-item.review { background: rgba(245,158,11,.08); border: 1px solid rgba(245,158,11,.2); }

/* ── SCORE ── */
.score-display {
  text-align: center; padding: 20px;
}
.score-value {
  font-size: 52px; font-weight: 900; line-height: 1;
  font-family: var(--mono);
}
.score-value.high { color: var(--green); }
.score-value.medium { color: var(--amber); }
.score-value.low { color: var(--red); }
.score-label { font-size: 13px; color: var(--muted); margin-top: 6px; }

/* ── EMPTY STATE ── */
.empty-state {
  text-align: center; padding: 48px 24px; color: var(--muted);
}
.empty-state .icon { font-size: 40px; margin-bottom: 12px; }
.empty-state p { font-size: 14px; line-height: 1.6; }

/* ── GRID ── */
.two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }

/* ── CONFIG BANNER ── */
.config-banner {
  background: rgba(59,130,246,.08); border: 1px solid rgba(59,130,246,.2);
  border-radius: 10px; padding: 12px 16px; margin-bottom: 20px;
  display: flex; align-items: center; gap: 12px; font-size: 13px;
}
.config-banner input {
  flex: 1; margin-bottom: 0; background: var(--surface2);
}

/* ── DIVIDER ── */
hr { border: none; border-top: 1px solid var(--border); margin: 16px 0; }

/* ── TOOLTIP ── */
.tooltip-text { font-size: 11px; color: var(--muted); margin-top: -6px; margin-bottom: 10px; }

/* ── PRINT ── */
@media print {
  .sidebar { display: none; }
  .app { display: block; }
  .main { padding: 0; }
  .btn-primary, .btn-sm, .config-banner { display: none; }
}
</style>
</head>
<body>
<div class="app">

<!-- ════════════ SIDEBAR — INPUT ════════════ -->
<aside class="sidebar">
  <div class="section-title">זיהוי מבקש</div>

  <label>שם מלא</label>
  <input type="text" id="f_name" placeholder="ישראל ישראלי">

  <label>יישוב (לבדיקת זכאות)</label>
  <input type="text" id="f_settlement_name" placeholder="הקלד שם יישוב..." oninput="searchSettlement(this.value)">
  <div id="settlement_results" style="font-size:12px;color:var(--muted);margin-top:-6px;margin-bottom:8px"></div>
  <input type="hidden" id="f_settlement_id">

  <label>טלפון</label>
  <input type="text" id="f_phone" placeholder="05X-XXXXXXX">

  <div class="field-row">
    <div>
      <label>גיל</label>
      <input type="number" id="f_age" min="16" max="90" placeholder="35">
    </div>
    <div>
      <label>סטטוס</label>
      <select id="f_status">
        <option value="">בחר...</option>
        <option value="citizen">אזרח ישראלי</option>
        <option value="permanent_resident">תושב קבע</option>
        <option value="new_immigrant">עולה חדש</option>
      </select>
    </div>
  </div>

  <label>שהייה רציפה בישראל</label>
  <select id="f_residency_years">
    <option value="">בחר...</option>
    <option value="0">פחות משנה</option>
    <option value="1">1-2 שנים</option>
    <option value="3">3 שנים ומעלה</option>
  </select>

  <label>שליטה בעברית</label>
  <select id="f_hebrew">
    <option value="yes">כן</option>
    <option value="no">לא</option>
  </select>

  <hr>
  <div class="section-title">שירות צבאי / לאומי</div>

  <label>סוג שירות</label>
  <select id="f_service_type">
    <option value="none">לא שירת</option>
    <option value="regular_combat">סדיר — לוחם (שנה+)</option>
    <option value="regular_2y">סדיר — שנתיים+</option>
    <option value="regular_basic">סדיר — שירות בסיסי</option>
    <option value="civil_2y">שירות אזרחי/לאומי — שנתיים+</option>
    <option value="civil_1y">שירות אזרחי/לאומי — שנה</option>
    <option value="reserves">מילואים בלבד</option>
    <option value="amendment25_casualty">פצוע קרב (תיקון 25)</option>
    <option value="amendment25_medical">שוחרר מסיבות רפואיות (תיקון 25)</option>
  </select>

  <hr>
  <div class="section-title">תבחין עיקרי</div>

  <label>מסלול מבוקש</label>
  <select id="f_criterion">
    <option value="">בחר מסלול...</option>
    <optgroup label="מגורים / עיסוק">
      <option value="RESIDENT_ELIGIBLE_LOCALITY_STANDARD">מגורים ביישוב זכאי</option>
      <option value="RESIDENT_ELIGIBLE_LOCALITY_PROPERTY_TAX_ALTERNATIVE">מגורים — חלופת ארנונה</option>
      <option value="WORK_ELIGIBLE_LOCALITY_EMPLOYEE">עובד שכיר ביישוב זכאי</option>
      <option value="WORK_ELIGIBLE_LOCALITY_SELF_EMPLOYED_FIXED">עצמאי — בית עסק ביישוב</option>
      <option value="WORK_ELIGIBLE_LOCALITY_SELF_EMPLOYED_MOBILE">עצמאי — מגיע ליישובים</option>
      <option value="WORK_ELIGIBLE_LOCALITY_STUDENT">תלמיד/סטודנט ביישוב זכאי</option>
    </optgroup>
    <optgroup label="שירות ביטחוני">
      <option value="SECURITY_FORCES_OFFICER_NCO">קצין/נגד — סגן ומעלה / רב"ס ומעלה</option>
      <option value="SECURITY_FORCES_RIFLEMAN_07">לוחם רובאי 07+</option>
      <option value="SECURITY_FORCES_FIGHTER_CERT">בעל תעודת לוחם</option>
      <option value="SECURITY_FORCES_PRE1999_COMBAT">בוגר עד 1999 — מקצוע קרבי</option>
      <option value="SECURITY_FORCES_INSTRUCTOR_DEFINED">מדריך בתפקיד מוגדר</option>
      <option value="POLICE_CAREER_ACTIVE_2Y">שוטר קבע פעיל</option>
      <option value="POLICE_CAREER_COMPLETED_2Y">שוטר שסיים קבע</option>
      <option value="BORDER_POLICE_COMBAT_2Y">שוטר מג"ב לוחם מבצעי</option>
      <option value="POLICE_VOLUNTEER_ACTIVE">מתנדב משטרה פעיל</option>
      <option value="POLICE_VOLUNTEER_15Y_10Y_WINDOW">מתנדב משטרה — 15 שנה</option>
      <option value="POLICE_VOLUNTEER_ELIGIBLE_LOCALITY_HYBRID">מתנדב משטרה + יישוב זכאי</option>
      <option value="BORDER_POLICE_SCOUT_COURSE">בוגר קורס סייר מג"ב</option>
      <option value="SECURITY_OFFICER_APPOINTED">ממונה ביטחון / קב"ט</option>
    </optgroup>
    <optgroup label="מקצוע / עיסוק">
      <option value="FARMER_SELF_EMPLOYED">חקלאי עצמאי</option>
      <option value="FARMER_FAMILY_MEMBER">בן משפחה של חקלאי</option>
      <option value="FARMER_EMPLOYEE">שכיר בחקלאות</option>
      <option value="FARMER_COOPERATIVE_MEMBER">חבר אגודה שיתופית חקלאית</option>
      <option value="EXPLOSIVES_SELF_EMPLOYED">מוביל חומרי נפץ — עצמאי</option>
      <option value="EXPLOSIVES_EMPLOYEE">מוביל חומרי נפץ — שכיר</option>
      <option value="TOUR_GUIDE_LICENSED">מורה דרך מוסמך</option>
      <option value="VETERINARIAN">רופא וטרינר</option>
      <option value="VETERINARY_UNDER_SUPERVISION">עובד תחת פיקוח וטרינר</option>
      <option value="PEST_CONTROL_LEVEL2">מדביר מוסמך</option>
      <option value="HUNTING_LICENSED">ציד — בעל רישיון</option>
    </optgroup>
    <optgroup label="הכשרה / ספורט / הצלה">
      <option value="SPECIAL_TRAINING_AIRPORT">רשות שדות התעופה</option>
      <option value="SHABAK_TRAINED">שב"כ</option>
      <option value="MALMAB_UNIFORM_COURSE">מלמ"ב</option>
      <option value="KNESSET_OZ_UNIT_GRADUATE">יחידת עוז — כנסת</option>
      <option value="GUIDED_BODY_SECURITY_ADVANCED_A_B">מאבטח גוף מונחה — קורס מתקדם</option>
      <option value="RANGE_INSTRUCTOR_ACTIVE">מדריך ירי פעיל</option>
      <option value="SPORTS_OLYMPIC">ספורטאי ירי אולימפי</option>
      <option value="SPORTS_PRACTICAL">ספורטאי ירי מעשי</option>
      <option value="SPORTS_PARALYMPIC">ספורטאי פראולימפי</option>
      <option value="MEDA_WORKER_OR_VOLUNTEER">מד"א</option>
      <option value="ZAKA_WORKER_OR_VOLUNTEER">זק"א</option>
      <option value="IHUD_HATZALA_WORKER_OR_VOLUNTEER">איחוד הצלה</option>
      <option value="FIREFIGHTER_ACTIVE_2Y">כבאי פעיל</option>
      <option value="FIREFIGHTER_VOLUNTEER_2Y">מתנדב כבאות</option>
      <option value="FIREFIGHTER_FORMER_30D">כבאי לשעבר</option>
    </optgroup>
    <optgroup label="תיקון 25">
      <option value="AMENDMENT25_BATTLE_CASUALTY_INCOMPLETE_SERVICE">פצוע קרב — לא סיים שירות</option>
      <option value="AMENDMENT25_FIGHTER_MEDICAL_RELEASE">לוחם — שוחרר מסיבות רפואיות</option>
    </optgroup>
  </select>

  <hr>
  <div class="section-title">דגלי סיכון</div>

  <label><input type="checkbox" id="f_flag_org_auth"> מחזיק תעודת הרשאה ארגונית</label><br><br>
  <label><input type="checkbox" id="f_flag_criminal"> עבר פלילי</label><br><br>
  <label><input type="checkbox" id="f_flag_medical"> בעיה רפואית רלוונטית</label><br><br>
  <label><input type="checkbox" id="f_flag_late"> הגשה מחוץ לחלון זמן</label>

  <hr>
  <button class="btn-primary" onclick="runEngine()">▶ הפעל מנוע החלטה</button>
</aside>

<!-- ════════════ MAIN — OUTPUT ════════════ -->
<main class="main">

  <div class="topbar">
    <div>
      <h1>מנוע החלטה — רישוי כלי ירייה פרטי</h1>
      <div style="font-size:12px;color:var(--muted);margin-top:4px;font-family:var(--mono)">v1.1 · Enforceable Engine · 49 מסלולים · Supabase Locality Lookup</div>
    </div>
    <div style="display:flex;align-items:center;gap:12px">
      <div class="db-status">
        <div class="db-dot" id="db-dot"></div>
        <span id="db-label">DB לא מחובר</span>
      </div>
      <div class="badge-system">DECISION ENGINE</div>
    </div>
  </div>

  <!-- DB Config -->
  <div class="config-banner" id="config-banner">
    <span>🔗</span>
    <div style="flex:1">
      <div style="font-weight:600;margin-bottom:6px">חיבור Supabase</div>
      <div style="display:grid;grid-template-columns:1fr 1fr auto;gap:8px;align-items:center">
        <input type="text" id="sb_url" placeholder="https://xxx.supabase.co" style="margin-bottom:0">
        <input type="text" id="sb_key" placeholder="anon key" style="margin-bottom:0">
        <button class="btn-sm" onclick="connectDB()">חבר</button>
      </div>
    </div>
  </div>

  <!-- Empty state -->
  <div id="empty-state" class="empty-state">
    <div class="icon">⚖️</div>
    <p>מלא את פרטי המבקש בסרגל השמאלי<br>ולחץ <strong>"הפעל מנוע החלטה"</strong></p>
    <p style="margin-top:8px;font-size:12px;color:var(--muted)">המנוע יבדוק תנאי סף, יזהה מסלולים זכאים,<br>ויפיק כרטיס עו"ד מלא</p>
  </div>

  <!-- Results -->
  <div id="results" style="display:none">

    <!-- Layer 1: Eligibility Gates -->
    <div class="card" id="card-eligibility">
      <div class="section-title">Layer 1 — תנאי סף</div>
      <div id="gates-output"></div>
    </div>

    <!-- Layer 2: Routes -->
    <div class="card" id="card-routes" style="display:none">
      <div class="section-title">Layer 2 — מסלול מזוהה</div>
      <div id="routes-output"></div>
    </div>

    <!-- Layer 3+4: Docs + Flags (2 col) -->
    <div class="two-col" id="docs-flags-row" style="display:none">
      <div class="card">
        <div class="section-title">Layer 3 — דרישות הוכחה</div>
        <div id="docs-output"></div>
      </div>
      <div class="card">
        <div class="section-title">Layer 4 — דגלי סיכון</div>
        <div id="flags-output"></div>
      </div>
    </div>

    <!-- Layer 5: Client Card -->
    <div class="card" id="card-client" style="display:none">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px">
        <div class="section-title" style="margin:0">Layer 5 — כרטיס לקוח (פנימי)</div>
        <button class="btn-sm" onclick="window.print()">🖨 הדפס</button>
      </div>
      <div class="two-col">
        <div>
          <div class="score-display">
            <div class="score-value" id="score-val">—</div>
            <div class="score-label" id="score-label">סיווג פנימי</div>
          </div>
        </div>
        <div id="card-details"></div>
      </div>
      <hr>
      <div class="section-title">הנחיית שיחה</div>
      <div id="call-guidance" style="font-size:13px;line-height:1.8;color:var(--text)"></div>
    </div>

  </div><!-- /results -->

</main>
</div><!-- /app -->

<script>
// ══════════════════════════════════════════════
// DATA — criteria_routes v1.0 FINAL
// ══════════════════════════════════════════════
const ROUTES = {
  RESIDENT_ELIGIBLE_LOCALITY_STANDARD: {
    group:"RESIDENCY", name:"מגורים ביישוב זכאי",
    hard_stops:["NOT_IN_ELIGIBLE_LOCALITY"],
    required_docs:["ID_WITH_ADDRESS","MUNICIPAL_RESIDENCY_CONFIRMATION"],
    required_affidavits:[],
    authority_approvals:[],
    risk_flags:[]
  },
  RESIDENT_ELIGIBLE_LOCALITY_PROPERTY_TAX_ALTERNATIVE: {
    group:"RESIDENCY", name:"מגורים — חלופת ארנונה",
    hard_stops:["NOT_IN_ELIGIBLE_LOCALITY"],
    required_docs:["PROPERTY_OWNERSHIP_PROOF","ARNONA_PAYMENT_PROOF","ID_WITH_ADDRESS"],
    required_affidavits:[],
    authority_approvals:[],
    risk_flags:[]
  },
  WORK_ELIGIBLE_LOCALITY_EMPLOYEE: {
    group:"WORK", name:"שכיר ביישוב זכאי",
    hard_stops:["ORG_AUTHORIZATION_CONFLICT"],
    required_docs:["PAYSLIPS_3","EMPLOYER_CONFIRMATION","VEHICLE_LICENSE_IF_REQUIRED"],
    required_affidavits:["EMPLOYER_APPLICANT_WORK_LOCALITY_AFFIDAVIT"],
    authority_approvals:[],
    risk_flags:["ORG_AUTHORIZATION_CONFLICT"]
  },
  WORK_ELIGIBLE_LOCALITY_SELF_EMPLOYED_FIXED: {
    group:"WORK", name:"עצמאי — בית עסק ביישוב",
    hard_stops:[],
    required_docs:["BUSINESS_LICENSE","AUTHORIZED_DEALER_CERT","MUNICIPAL_BUSINESS_CONFIRMATION"],
    required_affidavits:["SELF_EMPLOYED_ELIGIBLE_LOCALITY_AFFIDAVIT"],
    authority_approvals:[],
    risk_flags:[]
  },
  WORK_ELIGIBLE_LOCALITY_SELF_EMPLOYED_MOBILE: {
    group:"WORK", name:"עצמאי — מגיע ליישובים",
    hard_stops:[],
    required_docs:["AUTHORIZED_DEALER_CERT","CONTRACTS_LOCALITY","INVOICES_3M_LOCALITY"],
    required_affidavits:["MOBILE_SELF_EMPLOYED_ELIGIBLE_LOCALITY_AFFIDAVIT"],
    authority_approvals:[],
    risk_flags:[]
  },
  WORK_ELIGIBLE_LOCALITY_STUDENT: {
    group:"WORK", name:"תלמיד/סטודנט ביישוב זכאי",
    hard_stops:[],
    required_docs:["INSTITUTION_CONFIRMATION","TIMETABLE_PROOF"],
    required_affidavits:["STUDENT_ELIGIBLE_LOCALITY_AFFIDAVIT"],
    authority_approvals:[],
    risk_flags:[]
  },
  SECURITY_FORCES_OFFICER_NCO: {
    group:"SECURITY_FORCES", name:"קצין/נגד — סגן ומעלה / רב\"ס ומעלה",
    hard_stops:[],
    required_docs:["RANK_CERTIFICATE_OFFICIAL"],
    required_affidavits:[],
    authority_approvals:["IDF_HR"],
    risk_flags:[]
  },
  SECURITY_FORCES_RIFLEMAN_07: {
    group:"SECURITY_FORCES", name:"לוחם רובאי 07+",
    hard_stops:[],
    required_docs:["DISCHARGE_CERT_WITH_RIFLEMAN_07"],
    required_affidavits:[],
    authority_approvals:["IDF_PROFESSIONAL"],
    risk_flags:[]
  },
  SECURITY_FORCES_FIGHTER_CERT: {
    group:"SECURITY_FORCES", name:"בעל תעודת לוחם",
    hard_stops:[],
    required_docs:["FIGHTER_CERTIFICATE_IDF"],
    required_affidavits:[],
    authority_approvals:["IDF_PROFESSIONAL"],
    risk_flags:[]
  },
  SECURITY_FORCES_PRE1999_COMBAT: {
    group:"SECURITY_FORCES", name:"בוגר עד 1999 — מקצוע קרבי",
    hard_stops:[],
    required_docs:["HISTORICAL_SERVICE_PROOF"],
    required_affidavits:[],
    authority_approvals:["IDF_PROFESSIONAL"],
    risk_flags:["HISTORICAL_SERVICE_PROOF_COMPLEX"]
  },
  SECURITY_FORCES_INSTRUCTOR_DEFINED: {
    group:"SECURITY_FORCES", name:"מדריך בתפקיד מוגדר",
    hard_stops:[],
    required_docs:["IDF_ROLE_CONFIRMATION_OFFICIAL"],
    required_affidavits:[],
    authority_approvals:["IDF_PROFESSIONAL"],
    risk_flags:[]
  },
  POLICE_CAREER_ACTIVE_2Y: {
    group:"POLICE", name:"שוטר קבע פעיל",
    hard_stops:[],
    required_docs:["POLICE_EMPLOYMENT_CONFIRMATION_DISTRICT_HR"],
    required_affidavits:[],
    authority_approvals:["POLICE_DISTRICT_HR"],
    risk_flags:[]
  },
  POLICE_CAREER_COMPLETED_2Y: {
    group:"POLICE", name:"שוטר שסיים קבע",
    hard_stops:[],
    required_docs:["POLICE_SERVICE_COMPLETION_CERT"],
    required_affidavits:[],
    authority_approvals:["POLICE_RETIREMENT_CENTER_OR_DISTRICT_HR"],
    risk_flags:["LATE_SUBMISSION_WINDOW"]
  },
  BORDER_POLICE_COMBAT_2Y: {
    group:"POLICE", name:"שוטר מג\"ב לוחם מבצעי",
    hard_stops:[],
    required_docs:["MAGAV_SERVICE_CONFIRMATION_COMBAT"],
    required_affidavits:[],
    authority_approvals:["MAGAV_HR"],
    risk_flags:[]
  },
  POLICE_VOLUNTEER_ACTIVE: {
    group:"POLICE", name:"מתנדב משטרה פעיל",
    hard_stops:[],
    required_docs:["VOLUNTEER_POLICE_ACTIVE_CONFIRMATION"],
    required_affidavits:[],
    authority_approvals:["POLICE_VOLUNTEERS_DEPT"],
    risk_flags:[]
  },
  POLICE_VOLUNTEER_15Y_10Y_WINDOW: {
    group:"POLICE", name:"מתנדב משטרה — 15 שנה",
    hard_stops:["LATE_SUBMISSION_WINDOW"],
    required_docs:["VOLUNTEER_POLICE_15Y_PERIOD_CONFIRMATION"],
    required_affidavits:[],
    authority_approvals:["POLICE_VOLUNTEERS_DEPT"],
    risk_flags:["LATE_SUBMISSION_WINDOW"]
  },
  POLICE_VOLUNTEER_ELIGIBLE_LOCALITY_HYBRID: {
    group:"POLICE", name:"מתנדב משטרה + יישוב זכאי",
    hard_stops:["NOT_IN_ELIGIBLE_LOCALITY"],
    required_docs:["VOLUNTEER_CONFIRMATION","MUNICIPAL_RESIDENCY_CONFIRMATION","SERVICE_PROOF"],
    required_affidavits:[],
    authority_approvals:["POLICE_VOLUNTEERS_DEPT"],
    risk_flags:["HYBRID_ROUTE_DEPENDENCY"]
  },
  BORDER_POLICE_SCOUT_COURSE: {
    group:"POLICE", name:"בוגר קורס סייר מג\"ב",
    hard_stops:[],
    required_docs:["SCOUT_COURSE_CERT","RIFLEMAN_03_PROOF","SERVICE_1Y_PROOF"],
    required_affidavits:[],
    authority_approvals:["IDF_PROFESSIONAL"],
    risk_flags:[]
  },
  SECURITY_OFFICER_APPOINTED: {
    group:"SECURITY_OFFICER", name:"ממונה ביטחון / קב\"ט",
    hard_stops:[],
    required_docs:["SECURITY_OFFICER_CERT_VALID"],
    required_affidavits:[],
    authority_approvals:["POLICE_SECURITY_DIVISION_HEAD"],
    risk_flags:[]
  },
  FARMER_SELF_EMPLOYED: {
    group:"FARMER", name:"חקלאי עצמאי",
    hard_stops:[],
    required_docs:["FORM_1220_TAX","ONE_OF_RECOMMENDERS"],
    required_affidavits:["FARMER_SELF_DECLARATION_AFFIDAVIT"],
    authority_approvals:["LOCAL_SECURITY_OFFICER_OR_FARMERS_ASSOC_OR_MOSHAVIM"],
    risk_flags:[]
  },
  FARMER_FAMILY_MEMBER: {
    group:"FARMER", name:"בן משפחה של חקלאי",
    hard_stops:["INVALID_FAMILY_RELATION"],
    required_docs:["ID_APPENDIX_FAMILY_LINK","FORM_1220_PRIMARY_FARMER"],
    required_affidavits:["FAMILY_MEMBER_FARMER_AFFIDAVIT"],
    authority_approvals:["LOCAL_SECURITY_OFFICER_OR_FARMERS_ASSOC_OR_MOSHAVIM"],
    risk_flags:["FAMILY_RELATION_VERIFICATION_REQUIRED"]
  },
  FARMER_EMPLOYEE: {
    group:"FARMER", name:"שכיר בחקלאות",
    hard_stops:[],
    required_docs:["PAYSLIPS_3","EMPLOYER_FARMER_DOCS"],
    required_affidavits:["FARMER_EMPLOYEE_AFFIDAVIT"],
    authority_approvals:["LOCAL_SECURITY_OFFICER_OR_FARMERS_ASSOC_OR_MOSHAVIM"],
    risk_flags:[]
  },
  FARMER_COOPERATIVE_MEMBER: {
    group:"FARMER", name:"חבר אגודה שיתופית חקלאית",
    hard_stops:[],
    required_docs:["COOPERATIVE_MEMBERSHIP_CERT","REGISTRAR_COOPERATIVES_APPROVAL"],
    required_affidavits:["COOPERATIVE_MEMBER_JOINT_AFFIDAVIT"],
    authority_approvals:["LOCAL_SECURITY_OFFICER_OR_FARMERS_ASSOC_OR_MOSHAVIM"],
    risk_flags:[]
  },
  EXPLOSIVES_SELF_EMPLOYED: {
    group:"EXPLOSIVES", name:"מוביל חומרי נפץ — עצמאי",
    hard_stops:[],
    required_docs:["EXPLOSIVES_PERMIT_LABOR_MINISTRY","VEHICLE_LICENSE_EXPLOSIVES","TAX_INCOME_PROOF"],
    required_affidavits:["EXPLOSIVES_CARRIER_AFFIDAVIT"],
    authority_approvals:[],
    risk_flags:[]
  },
  EXPLOSIVES_EMPLOYEE: {
    group:"EXPLOSIVES", name:"מוביל חומרי נפץ — שכיר",
    hard_stops:[],
    required_docs:["PAYSLIPS_3","EXPLOSIVES_PERMIT_EMPLOYER","VEHICLE_LICENSE_EXPLOSIVES"],
    required_affidavits:["EXPLOSIVES_EMPLOYEE_AFFIDAVIT"],
    authority_approvals:[],
    risk_flags:[]
  },
  TOUR_GUIDE_LICENSED: {
    group:"TOUR_GUIDE", name:"מורה דרך מוסמך",
    hard_stops:[],
    required_docs:["TOUR_GUIDE_LICENSE_TOURISM_MINISTRY"],
    required_affidavits:["TOUR_GUIDE_AFFIDAVIT"],
    authority_approvals:[],
    risk_flags:[]
  },
  VETERINARIAN: {
    group:"VETERINARY", name:"רופא וטרינר",
    hard_stops:[],
    required_docs:["VETERINARY_LICENSE"],
    required_affidavits:["VETERINARIAN_AFFIDAVIT"],
    authority_approvals:["VETERINARY_SERVICES_DIRECTOR"],
    risk_flags:[]
  },
  VETERINARY_UNDER_SUPERVISION: {
    group:"VETERINARY", name:"עובד תחת פיקוח וטרינר",
    hard_stops:[],
    required_docs:["VETERINARIAN_SUPERVISION_COMMITMENT"],
    required_affidavits:["VETERINARY_EMPLOYEE_AND_VET_JOINT_AFFIDAVIT"],
    authority_approvals:["VETERINARY_SERVICES_DIRECTOR"],
    risk_flags:[]
  },
  PEST_CONTROL_LEVEL2: {
    group:"PEST_CONTROL", name:"מדביר מוסמך",
    hard_stops:[],
    required_docs:["PEST_CONTROL_LICENSE_LEVEL2","REGISTRAR_RECOMMENDATION"],
    required_affidavits:["PEST_CONTROL_COMMITMENT_AFFIDAVIT"],
    authority_approvals:[],
    risk_flags:[]
  },
  HUNTING_LICENSED: {
    group:"HUNTING", name:"ציד — בעל רישיון",
    hard_stops:[],
    required_docs:["HUNTING_LICENSE_OR_PERMIT"],
    required_affidavits:[],
    authority_approvals:["NATURE_PARKS_WILDLIFE_DIRECTOR"],
    risk_flags:[]
  },
  SPECIAL_TRAINING_AIRPORT: {
    group:"SPECIAL_TRAINING", name:"רשות שדות התעופה",
    hard_stops:[],
    required_docs:["AIRPORT_AUTHORITY_COURSE_CERT","AIRPORT_EMPLOYMENT_PROOF"],
    required_affidavits:[],
    authority_approvals:["AIRPORT_AUTHORITY_DIRECTOR"],
    risk_flags:[]
  },
  SHABAK_TRAINED: {
    group:"SPECIAL_TRAINING", name:"שב\"כ",
    hard_stops:[],
    required_docs:["SHABAK_COURSE_CERT","SHABAK_EMPLOYMENT_PROOF"],
    required_affidavits:[],
    authority_approvals:["SHABAK_HR_OR_AUTHORIZED"],
    risk_flags:[]
  },
  MALMAB_UNIFORM_COURSE: {
    group:"SPECIAL_TRAINING", name:"מלמ\"ב",
    hard_stops:[],
    required_docs:["MALMAB_UNIFORM_COURSE_CERT","MALMAB_EMPLOYMENT_PROOF"],
    required_affidavits:[],
    authority_approvals:[],
    risk_flags:[]
  },
  KNESSET_OZ_UNIT_GRADUATE: {
    group:"SPECIAL_TRAINING", name:"יחידת עוז — כנסת",
    hard_stops:[],
    required_docs:["OZ_UNIT_GRADUATION_CERT"],
    required_affidavits:[],
    authority_approvals:[],
    risk_flags:[]
  },
  GUIDED_BODY_SECURITY_ADVANCED_A_B: {
    group:"SPECIAL_TRAINING", name:"מאבטח גוף מונחה — קורס מתקדם",
    hard_stops:[],
    required_docs:["ADVANCED_SECURITY_COURSE_CERT_A_OR_B","GUIDED_ORG_CONFIRMATION"],
    required_affidavits:["JOINT_AFFIDAVIT_APPLICANT_SPECIAL_LICENSE_HOLDER"],
    authority_approvals:[],
    risk_flags:["HARD_RISK_EXTERNAL_DEPENDENCY"]
  },
  RANGE_INSTRUCTOR_ACTIVE: {
    group:"FIREARMS_INSTRUCTION", name:"מדריך ירי פעיל",
    hard_stops:["LESS_THAN_60_TRAINED","LESS_THAN_1_YEAR_EXPERIENCE"],
    required_docs:["RANGE_INSTRUCTOR_LICENSE","RANGE_ACTIVITY_60_TRAINEES_PROOF"],
    required_affidavits:["RANGE_MANAGER_AND_INSTRUCTOR_DECLARATION"],
    authority_approvals:[],
    risk_flags:[]
  },
  SPORTS_OLYMPIC: {
    group:"SPORT_SHOOTING", name:"ספורטאי ירי אולימפי",
    hard_stops:[],
    required_docs:["OLYMPIC_FEDERATION_MEMBERSHIP_2Y","COMPETITION_RECORDS_4_PER_SEASON"],
    required_affidavits:["OLYMPIC_SHOOTING_ATHLETE_AFFIDAVIT"],
    authority_approvals:["OLYMPIC_SHOOTING_FEDERATION_DIRECTOR"],
    risk_flags:[]
  },
  SPORTS_PRACTICAL: {
    group:"SPORT_SHOOTING", name:"ספורטאי ירי מעשי",
    hard_stops:[],
    required_docs:["PRACTICAL_SHOOTING_MEMBERSHIP_3Y","COMPETITION_RECORDS_4_PER_SEASON"],
    required_affidavits:["PRACTICAL_SHOOTING_ATHLETE_AFFIDAVIT"],
    authority_approvals:["PRACTICAL_SHOOTING_FEDERATION_DIRECTOR"],
    risk_flags:[]
  },
  SPORTS_PARALYMPIC: {
    group:"SPORT_SHOOTING", name:"ספורטאי פראולימפי",
    hard_stops:["INVALID_DISABILITY_STATUS"],
    required_docs:["DISABILITY_STATUS_LAW_5719_1959","IDF_DISABLED_VETERANS_ASSOC_MEMBERSHIP","COMPETITION_RECORDS"],
    required_affidavits:["PARALYMPIC_ATHLETE_AFFIDAVIT"],
    authority_approvals:["IDF_DISABLED_RANGE_MANAGER"],
    risk_flags:[]
  },
  MEDA_WORKER_OR_VOLUNTEER: {
    group:"RESCUE_ORG", name:"מד\"א",
    hard_stops:[],
    required_docs:["MEDA_EMPLOYMENT_VOLUNTEER_CONFIRMATION"],
    required_affidavits:["MEDA_AFFIDAVIT"],
    authority_approvals:["MEDA_CEO_AUTHORIZED"],
    risk_flags:[]
  },
  ZAKA_WORKER_OR_VOLUNTEER: {
    group:"RESCUE_ORG", name:"זק\"א",
    hard_stops:[],
    required_docs:["ZAKA_EMPLOYMENT_VOLUNTEER_CONFIRMATION"],
    required_affidavits:["ZAKA_AFFIDAVIT"],
    authority_approvals:["ZAKA_CEO_AUTHORIZED"],
    risk_flags:[]
  },
  IHUD_HATZALA_WORKER_OR_VOLUNTEER: {
    group:"RESCUE_ORG", name:"איחוד הצלה",
    hard_stops:[],
    required_docs:["IHUD_HATZALA_CONFIRMATION"],
    required_affidavits:["IHUD_HATZALA_AFFIDAVIT"],
    authority_approvals:["IHUD_HATZALA_CEO_AUTHORIZED"],
    risk_flags:[]
  },
  FIREFIGHTER_ACTIVE_2Y: {
    group:"FIREFIGHTER", name:"כבאי פעיל",
    hard_stops:[],
    required_docs:["FIRE_AUTHORITY_EMPLOYMENT_CERT_2Y"],
    required_affidavits:["FIREFIGHTER_AFFIDAVIT"],
    authority_approvals:["FIRE_AUTHORITY_SECURITY_OFFICER"],
    risk_flags:[]
  },
  FIREFIGHTER_VOLUNTEER_2Y: {
    group:"FIREFIGHTER", name:"מתנדב כבאות",
    hard_stops:[],
    required_docs:["FIRE_AUTHORITY_VOLUNTEER_CERT_2Y"],
    required_affidavits:["FIREFIGHTER_VOLUNTEER_AFFIDAVIT"],
    authority_approvals:["FIRE_AUTHORITY_SECURITY_OFFICER"],
    risk_flags:[]
  },
  FIREFIGHTER_FORMER_30D: {
    group:"FIREFIGHTER", name:"כבאי לשעבר",
    hard_stops:["LATE_SUBMISSION_WINDOW"],
    required_docs:["FIRE_AUTHORITY_SERVICE_END_CERT"],
    required_affidavits:["FIREFIGHTER_FORMER_AFFIDAVIT"],
    authority_approvals:["FIRE_AUTHORITY_SECURITY_OFFICER"],
    risk_flags:["LATE_SUBMISSION_WINDOW"]
  },
  AMENDMENT25_BATTLE_CASUALTY_INCOMPLETE_SERVICE: {
    group:"AMENDMENT25", name:"פצוע קרב — לא סיים שירות",
    hard_stops:[],
    required_docs:["IDF_OFFICER_NOTICE_COMBAT_INJURY","MEDICAL_INJURY_DOCS"],
    required_affidavits:["AMENDMENT25_AFFIDAVIT"],
    authority_approvals:["IDF_OFFICER_LICENSING_DEPT"],
    risk_flags:["MEDICAL_SOURCE_VERIFICATION"]
  },
  AMENDMENT25_FIGHTER_MEDICAL_RELEASE: {
    group:"AMENDMENT25", name:"לוחם — שוחרר מסיבות רפואיות",
    hard_stops:[],
    required_docs:["IDF_OFFICER_NOTICE_MEDICAL_RELEASE","SERVICE_PROOF","MEDICAL_RELEASE_DOCS"],
    required_affidavits:["AMENDMENT25_AFFIDAVIT"],
    authority_approvals:["IDF_OFFICER_LICENSING_DEPT"],
    risk_flags:["MEDICAL_SOURCE_VERIFICATION"]
  }
};

// Readable labels for docs/affidavits
const DOC_LABELS = {
  ID_WITH_ADDRESS:"תעודת זהות + ספח עם כתובת",
  MUNICIPAL_RESIDENCY_CONFIRMATION:"אישור תושבות מהרשות המוניציפלית",
  PROPERTY_OWNERSHIP_PROOF:"אסמכתא על החזקת נכס",
  ARNONA_PAYMENT_PROOF:"הוכחת תשלום ארנונה (שנה קודמת)",
  PAYSLIPS_3:"3 תלושי שכר (3 חודשים אחרונים)",
  EMPLOYER_CONFIRMATION:"אישור רשמי מהמעסיק",
  VEHICLE_LICENSE_IF_REQUIRED:"רישיון רכב ונהיגה (אם נדרש)",
  BUSINESS_LICENSE:"רישיון עסק בתוקף",
  AUTHORIZED_DEALER_CERT:"אישור עוסק מורשה / נסח חברה",
  MUNICIPAL_BUSINESS_CONFIRMATION:"אישור רשות על מיקום בית העסק",
  CONTRACTS_LOCALITY:"חוזי עבודה עם גופים ביישובים זכאים",
  INVOICES_3M_LOCALITY:"חשבוניות מ-3 חודשים אחרונים (יישובים זכאים)",
  INSTITUTION_CONFIRMATION:"אישור לימודים ממוסד",
  TIMETABLE_PROOF:"מערכת שעות (עם ימי נוכחות)",
  RANK_CERTIFICATE_OFFICIAL:"תעודת קצין/נגד / אישור רשמי",
  DISCHARGE_CERT_WITH_RIFLEMAN_07:"תעודת שחרור עם רובאי 07+",
  FIGHTER_CERTIFICATE_IDF:"תעודת לוחם (לפי הוראות צה\"ל)",
  HISTORICAL_SERVICE_PROOF:"מסמך שירות היסטורי (עד 1999)",
  IDF_ROLE_CONFIRMATION_OFFICIAL:"אישור תפקיד רשמי מצה\"ל",
  POLICE_EMPLOYMENT_CONFIRMATION_DISTRICT_HR:"אישור העסקה מקצין אמ\"ש מחוזי",
  POLICE_SERVICE_COMPLETION_CERT:"אישור סיום שירות משטרה",
  MAGAV_SERVICE_CONFIRMATION_COMBAT:"אישור שירות מג\"ב + סטטוס לוחם",
  VOLUNTEER_POLICE_ACTIVE_CONFIRMATION:"אישור מתנדב פעיל (ראש מחלקת מתנדבים)",
  VOLUNTEER_POLICE_15Y_PERIOD_CONFIRMATION:"אישור תקופת התנדבות 15 שנה + מועד סיום",
  VOLUNTEER_CONFIRMATION:"אישור התנדבות פעיל",
  SERVICE_PROOF:"אישור שירות",
  SCOUT_COURSE_CERT:"תעודת בוגר קורס סייר",
  RIFLEMAN_03_PROOF:"אישור רובאות 03",
  SERVICE_1Y_PROOF:"אישור שירות שנה (רצוף)",
  SECURITY_OFFICER_CERT_VALID:"תעודת קב\"ט / ממונה ביטחון בתוקף",
  FORM_1220_TAX:"טופס 1220 + חותמת רשות המסים",
  ONE_OF_RECOMMENDERS:"המלצת אחד מהממליצים המוסמכים",
  ID_APPENDIX_FAMILY_LINK:"ספח ת\"ז להוכחת קרבה משפחתית",
  FORM_1220_PRIMARY_FARMER:"טופס 1220 של החקלאי הראשי",
  EMPLOYER_FARMER_DOCS:"מסמכי המעסיק החקלאי",
  COOPERATIVE_MEMBERSHIP_CERT:"אישור חברות באגודה שיתופית",
  REGISTRAR_COOPERATIVES_APPROVAL:"אישור רשם האגודות השיתופיות",
  EXPLOSIVES_PERMIT_LABOR_MINISTRY:"היתר ממשרד העבודה — הובלת נפץ",
  VEHICLE_LICENSE_EXPLOSIVES:"רישיון רכב/נהיגה עם אישור נפץ",
  TAX_INCOME_PROOF:"אישור מס הכנסה על הכנסה מהעיסוק",
  EXPLOSIVES_PERMIT_EMPLOYER:"היתר נפץ על שם המעסיק",
  TOUR_GUIDE_LICENSE_TOURISM_MINISTRY:"רישיון מורה דרך תקף — משרד התיירות",
  VETERINARY_LICENSE:"רישיון וטרינר בתוקף",
  VETERINARIAN_SUPERVISION_COMMITMENT:"כתב התחייבות הוטרינר המפקח",
  PEST_CONTROL_LICENSE_LEVEL2:"רישיון מדביר מוסמך רמה 2",
  REGISTRAR_RECOMMENDATION:"המלצת הרשם לענייני מדבירים",
  HUNTING_LICENSE_OR_PERMIT:"רישיון ציד / היתר צידה בתוקף",
  AIRPORT_AUTHORITY_COURSE_CERT:"תעודת בוגר קורס — רשות שדות התעופה",
  AIRPORT_EMPLOYMENT_PROOF:"אישור העסקה ברשות שדות התעופה",
  SHABAK_COURSE_CERT:"תעודת בוגר קורס שב\"כ",
  SHABAK_EMPLOYMENT_PROOF:"אישור העסקה בשב\"כ",
  MALMAB_UNIFORM_COURSE_CERT:"תעודת קורס אחיד — מלמ\"ב",
  MALMAB_EMPLOYMENT_PROOF:"אישור העסקה במערכת הביטחון",
  OZ_UNIT_GRADUATION_CERT:"תעודת בוגר יחידת עוז — כנסת",
  ADVANCED_SECURITY_COURSE_CERT_A_OR_B:"תעודת קורס מתקדם א' או ב'",
  GUIDED_ORG_CONFIRMATION:"אישור מארגון מונחה",
  RANGE_INSTRUCTOR_LICENSE:"רישיון מדריך ירי בתוקף",
  RANGE_ACTIVITY_60_TRAINEES_PROOF:"אישור מטווח — הדרכת 60 מתאמנים",
  OLYMPIC_FEDERATION_MEMBERSHIP_2Y:"אישור חברות 2 שנים — התאחדות אולימפית",
  COMPETITION_RECORDS_4_PER_SEASON:"תיעוד 4 תחרויות לפחות לעונה",
  PRACTICAL_SHOOTING_MEMBERSHIP_3Y:"אישור חברות 3 שנים — ירי מעשי",
  COMPETITION_RECORDS:"תיעוד תחרויות",
  DISABILITY_STATUS_LAW_5719_1959:"אישור נכות לפי חוק הנכים תשי\"ט-1959",
  IDF_DISABLED_VETERANS_ASSOC_MEMBERSHIP:"אישור חברות — עמותת נכי צה\"ל",
  MEDA_EMPLOYMENT_VOLUNTEER_CONFIRMATION:"אישור העסקה/התנדבות — מד\"א",
  ZAKA_EMPLOYMENT_VOLUNTEER_CONFIRMATION:"אישור העסקה/התנדבות — זק\"א",
  IHUD_HATZALA_CONFIRMATION:"אישור מאיחוד הצלה",
  FIRE_AUTHORITY_EMPLOYMENT_CERT_2Y:"אישור כבאות והצלה (ותק 2 שנים)",
  FIRE_AUTHORITY_VOLUNTEER_CERT_2Y:"אישור התנדבות כבאות (ותק 2 שנים)",
  FIRE_AUTHORITY_SERVICE_END_CERT:"אישור סיום שירות + מועד סיום",
  IDF_OFFICER_NOTICE_COMBAT_INJURY:"הודעת קצין צה\"ל — פציעה מבצעית",
  MEDICAL_INJURY_DOCS:"מסמכים רפואיים — פציעה",
  IDF_OFFICER_NOTICE_MEDICAL_RELEASE:"הודעת קצין צה\"ל — שחרור מסיבות רפואיות",
  SERVICE_STATUS_PROOF:"מסמכי סטטוס שירות",
  MEDICAL_RELEASE_DOCS:"מסמכים רפואיים — שחרור"
};

const AFFIDAVIT_LABELS = {
  EMPLOYER_APPLICANT_WORK_LOCALITY_AFFIDAVIT:"תצהיר משותף — מעסיק ומבקש (עיסוק ביישוב)",
  SELF_EMPLOYED_ELIGIBLE_LOCALITY_AFFIDAVIT:"תצהיר עצמאי — עיסוק במקום זכאי",
  MOBILE_SELF_EMPLOYED_ELIGIBLE_LOCALITY_AFFIDAVIT:"תצהיר עצמאי — מגיע ליישובים זכאים",
  STUDENT_ELIGIBLE_LOCALITY_AFFIDAVIT:"תצהיר ואישור — תלמיד/סטודנט במקום זכאי",
  FARMER_SELF_DECLARATION_AFFIDAVIT:"תצהיר חקלאי עצמאי פעיל",
  FAMILY_MEMBER_FARMER_AFFIDAVIT:"תצהיר בן משפחה של חקלאי",
  FARMER_EMPLOYEE_AFFIDAVIT:"תצהיר שכיר אצל חקלאי",
  COOPERATIVE_MEMBER_JOINT_AFFIDAVIT:"תצהיר משותף — חבר אגודה שיתופית",
  EXPLOSIVES_CARRIER_AFFIDAVIT:"תצהיר מוביל חומרי נפץ",
  EXPLOSIVES_EMPLOYEE_AFFIDAVIT:"תצהיר העסקת מוביל חומרי נפץ שכיר",
  TOUR_GUIDE_AFFIDAVIT:"תצהיר מורה דרך מוסמך",
  VETERINARIAN_AFFIDAVIT:"תצהיר רופא וטרינר",
  VETERINARY_EMPLOYEE_AND_VET_JOINT_AFFIDAVIT:"תצהיר משותף — עובד + וטרינר מפקח",
  PEST_CONTROL_COMMITMENT_AFFIDAVIT:"התחייבות מדביר מוסמך",
  JOINT_AFFIDAVIT_APPLICANT_SPECIAL_LICENSE_HOLDER:"תצהיר משותף — מבקש + בעל רישיון מיוחד",
  RANGE_MANAGER_AND_INSTRUCTOR_DECLARATION:"הצהרת מדריך + מנהל מטווח",
  OLYMPIC_SHOOTING_ATHLETE_AFFIDAVIT:"תצהיר ספורטאי ירי אולימפי",
  PRACTICAL_SHOOTING_ATHLETE_AFFIDAVIT:"תצהיר ספורטאי ירי מעשי",
  PARALYMPIC_ATHLETE_AFFIDAVIT:"תצהיר ספורטאי פראולימפי",
  MEDA_AFFIDAVIT:"תצהיר מד\"א",
  ZAKA_AFFIDAVIT:"תצהיר זק\"א",
  IHUD_HATZALA_AFFIDAVIT:"תצהיר איחוד הצלה",
  FIREFIGHTER_AFFIDAVIT:"אישור כבאות והצלה",
  FIREFIGHTER_VOLUNTEER_AFFIDAVIT:"אישור כבאות — מתנדב",
  FIREFIGHTER_FORMER_AFFIDAVIT:"אישור כבאות לשעבר",
  AMENDMENT25_AFFIDAVIT:"טופס ייעודי — תיקון 25"
};

const AUTHORITY_LABELS = {
  IDF_HR:"משאבי אנוש צה\"ל",
  IDF_PROFESSIONAL:"גורמי מקצוע צה\"ל (בדיקה ישירה)",
  POLICE_DISTRICT_HR:"קצין אמ\"ש מחוזי — משטרה",
  POLICE_RETIREMENT_CENTER_OR_DISTRICT_HR:"מרכז פרישה / אמ\"ש מחוזי — משטרה",
  MAGAV_HR:"קצין אמ\"ש מג\"ב",
  POLICE_VOLUNTEERS_DEPT:"ראש מחלקת מתנדבים — משטרה",
  POLICE_SECURITY_DIVISION_HEAD:"ראש חטיבת האבטחה — משטרה",
  LOCAL_SECURITY_OFFICER_OR_FARMERS_ASSOC_OR_MOSHAVIM:"קב\"ט מועצה אזורית / מנכ\"ל התאחדות האיכרים / מזכיר תנועת המושבים",
  VETERINARY_SERVICES_DIRECTOR:"מנהל השירותים הווטרינריים",
  NATURE_PARKS_WILDLIFE_DIRECTOR:"מנהל אגף להגנה על החי והצומח — רט\"ג",
  AIRPORT_AUTHORITY_DIRECTOR:"מנהל / מורשה — רשות שדות התעופה",
  SHABAK_HR_OR_AUTHORIZED:"ראש אגף משאבי אנוש שב\"כ / מורשה",
  OLYMPIC_SHOOTING_FEDERATION_DIRECTOR:"מנהל התאחדות הקליעה האולימפית",
  PRACTICAL_SHOOTING_FEDERATION_DIRECTOR:"מנהל התאחדות הירי המעשי",
  IDF_DISABLED_RANGE_MANAGER:"מנהל מטווח נכי צה\"ל",
  MEDA_CEO_AUTHORIZED:"מנכ\"ל / מורשה — מד\"א",
  ZAKA_CEO_AUTHORIZED:"מנכ\"ל / מורשה — זק\"א",
  IHUD_HATZALA_CEO_AUTHORIZED:"מנכ\"ל / מורשה — איחוד הצלה",
  FIRE_AUTHORITY_SECURITY_OFFICER:"קב\"ט הרשות הארצית לכבאות והצלה",
  IDF_OFFICER_LICENSING_DEPT:"קצין מוסמך + אגף לרישוי כלי ירייה"
};

const FLAG_LABELS = {
  ORG_AUTHORIZATION_CONFLICT:"מחזיק תעודת הרשאה ארגונית — סיכון סירוב",
  LATE_SUBMISSION_WINDOW:"הגשה מחוץ לחלון הזמן",
  INSUFFICIENT_PROOF_OF_ROUTE:"חסר מסמך מסלול מהותי",
  MEDICAL_SOURCE_VERIFICATION:"נדרש אימות מסמכים רפואיים",
  HISTORICAL_SERVICE_PROOF_COMPLEX:"שירות היסטורי — אימות מוגבר",
  HYBRID_ROUTE_DEPENDENCY:"מסלול משולב — תלות בשני אשכולות",
  FAMILY_RELATION_VERIFICATION_REQUIRED:"נדרש אימות קרבה משפחתית",
  HARD_RISK_EXTERNAL_DEPENDENCY:"תלות בגורם חיצוני — סיכון גבוה",
  INVALID_DISABILITY_STATUS:"נכות לא מוכרת לפי חוק הנכים",
  INVALID_FAMILY_RELATION:"קרבה משפחתית לא מתאימה",
  LESS_THAN_60_TRAINED:"פחות מ-60 מתאמנים — Hard Stop",
  LESS_THAN_1_YEAR_EXPERIENCE:"ותק פחות משנה — Hard Stop",
  NOT_IN_ELIGIBLE_LOCALITY:"יישוב לא מזכה"
};

// ══════════════════════════════════════════════
// ELIGIBILITY ENGINE — Layer 1 (v1.1)
// Output: { status: PASS|CONDITIONAL|FAIL, gates, hard_fails, conditional }
// ══════════════════════════════════════════════
function runEligibilityEngine(data) {
  const gates = [];

  // Gate 1: Status
  if (!data.status) {
    gates.push({id:'STATUS', label:'סטטוס אזרחות/תושבות', result:'fail', note:'לא הוגדר'});
  } else {
    const newImmigrantNote = data.status === 'new_immigrant' ? 'עולה חדש — מסלול מוגבל למגורים בלבד' : '';
    gates.push({id:'STATUS', label:'אזרח / תושב קבע / עולה', result:'pass', note:newImmigrantNote});
  }

  // Gate 2: 3-year residency
  if (data.status === 'new_immigrant') {
    gates.push({id:'RESIDENCY_3Y', label:'שהייה רציפה 3 שנים', result:'warn', note:'עולה חדש — חריג לתבחין מגורים בלבד'});
  } else if (data.residency_years < 3) {
    gates.push({id:'RESIDENCY_3Y', label:'שהייה רציפה 3 שנים', result:'fail', note:'נדרשת שהייה רציפה של 3 שנים לפחות'});
  } else {
    gates.push({id:'RESIDENCY_3Y', label:'שהייה רציפה 3 שנים', result:'pass'});
  }

  // Gate 3: Hebrew
  if (data.hebrew === 'no') {
    gates.push({id:'HEBREW', label:'שליטה בסיסית בעברית', result:'fail', note:'נדרשת שליטה בסיסית'});
  } else {
    gates.push({id:'HEBREW', label:'שליטה בסיסית בעברית', result:'pass'});
  }

  // Gate 4: Age + service matrix
  gates.push(checkAgeGate(data));

  // Gate 5: New immigrant route restriction (ENFORCED, not just note)
  if (data.status === 'new_immigrant' && data.criterion &&
      !['RESIDENT_ELIGIBLE_LOCALITY_STANDARD','RESIDENT_ELIGIBLE_LOCALITY_PROPERTY_TAX_ALTERNATIVE'].includes(data.criterion)) {
    gates.push({id:'NEW_IMMIGRANT_ROUTE', label:'הגבלת מסלול לעולה חדש', result:'fail', note:'עולה חדש רשאי להגיש בתבחין מגורים בלבד'});
  }

  // Gate 6: Police clearance — CONDITIONAL, not ignorable
  gates.push({id:'POLICE', label:'אין מניעת משטרה', result:'pending', note:'נבדק ע"י הרשות — לא ניתן לאשר עצמאית'});

  // Gate 7: Org auth conflict
  if (data.flags.org_auth) {
    gates.push({id:'ORG_AUTH', label:'ניגוד תעודת הרשאה ארגונית', result:'warn', note:'קיים סיכון סירוב — בחר בין רישיון פרטי לתעודה ארגונית'});
  }

  const hardFails = gates.filter(g => g.result === 'fail');
  const conditionalItems = gates.filter(g => g.result === 'pending' || g.result === 'warn');

  let status = 'PASS';
  if (hardFails.length > 0) status = 'FAIL';
  else if (conditionalItems.length > 0) status = 'CONDITIONAL';

  return {
    status,
    gates,
    hard_fails: hardFails.map(g => g.id),
    conditional: conditionalItems.map(g => g.id),
    // backward compat
    passed: hardFails.length === 0,
    failed_gates: hardFails.map(g => g.id)
  };
}

function checkAgeGate(data) {
  const age = data.age;
  const service = data.service_type;
  const status = data.status;

  if (service === 'amendment25_casualty' || service === 'amendment25_medical') {
    if (age >= 18) return {id:'AGE_SERVICE', label:`גיל ${age} — תיקון 25`, result:'pass', note:'גיל 18+ (תיקון 25)'};
    return {id:'AGE_SERVICE', label:`גיל ${age} — תיקון 25`, result:'fail', note:'נדרש גיל 18+'};
  }

  if (service === 'regular_basic' || service === 'regular_2y' || service === 'regular_combat') {
    if (age >= 18) return {id:'AGE_SERVICE', label:`גיל ${age} — סדיר`, result:'pass', note:'גיל 18+ עם שירות סדיר'};
    return {id:'AGE_SERVICE', label:`גיל ${age}`, result:'fail', note:'נדרש גיל 18+'};
  }

  if (service === 'civil_2y') {
    if (age >= 21) return {id:'AGE_SERVICE', label:`גיל ${age} — שירות אזרחי`, result:'pass', note:'גיל 21+ עם שירות אזרחי'};
    return {id:'AGE_SERVICE', label:`גיל ${age}`, result:'fail', note:'נדרש גיל 21+'};
  }

  // No service
  if (status === 'citizen') {
    if (age >= 27) return {id:'AGE_SERVICE', label:`גיל ${age} — אזרח`, result:'pass', note:'גיל 27+'};
    return {id:'AGE_SERVICE', label:`גיל ${age}`, result:'fail', note:'נדרש גיל 27+ (ללא שירות)'};
  }

  if (status === 'permanent_resident') {
    if (age >= 45) return {id:'AGE_SERVICE', label:`גיל ${age} — תושב קבע`, result:'pass', note:'גיל 45+'};
    return {id:'AGE_SERVICE', label:`גיל ${age}`, result:'fail', note:'נדרש גיל 45+ (תושב קבע ללא שירות)'};
  }

  return {id:'AGE_SERVICE', label:`גיל ${age}`, result:'pending', note:'לא ניתן לחשב — בדוק ידנית'};
}

// ══════════════════════════════════════════════
// ROUTE ENGINE — Layer 2 (v1.1)
// Evaluates ALL 49 routes, returns ranked list
// ══════════════════════════════════════════════
async function runRouteEngine(data, localityEligible) {
  const results = [];

  for (const [route_id, route] of Object.entries(ROUTES)) {
    let status = 'MATCH';
    const reasons = [];

    for (const stop of route.hard_stops) {
      if (stop === 'ORG_AUTHORIZATION_CONFLICT' && data.flags.org_auth) {
        status = 'BLOCKED'; reasons.push('ניגוד תעודת הרשאה ארגונית');
      }
      if (stop === 'LATE_SUBMISSION_WINDOW' && data.flags.late) {
        status = 'BLOCKED'; reasons.push('הגשה מחוץ לחלון הזמן');
      }
      if (stop === 'NOT_IN_ELIGIBLE_LOCALITY') {
        if (localityEligible === false) {
          status = 'BLOCKED'; reasons.push('יישוב לא מזכה');
        } else if (localityEligible === null && data.settlement_id) {
          status = 'INSUFFICIENT_DATA'; reasons.push('לא ניתן לאמת יישוב — DB לא מחובר');
        }
      }
      if (stop === 'LESS_THAN_60_TRAINED' && data.service_type !== 'range_instructor') {
        // Can only verify if user is in this route context
      }
      if (stop === 'INVALID_FAMILY_RELATION') {
        status = 'INSUFFICIENT_DATA'; reasons.push('נדרש אימות קרבה משפחתית');
      }
      if (stop === 'INVALID_DISABILITY_STATUS') {
        status = 'INSUFFICIENT_DATA'; reasons.push('נדרש אימות נכות לפי חוק');
      }
    }

    results.push({ route_id, route, status, reasons });
  }

  // Rank: MATCH first, then INSUFFICIENT_DATA, then BLOCKED
  results.sort((a,b) => {
    const order = {MATCH:0, INSUFFICIENT_DATA:1, BLOCKED:2};
    return (order[a.status]||3) - (order[b.status]||3);
  });

  return results;
}

// Pick primary route: hint > same group > first MATCH
function selectPrimaryRoute(routeResults, hint) {
  const matched = routeResults.filter(r => r.status === 'MATCH');
  if (!matched.length) return routeResults.find(r => r.status === 'INSUFFICIENT_DATA') || null;

  if (hint) {
    const exact = matched.find(r => r.route_id === hint);
    if (exact) return exact;
    // Same group fallback
    const hintGroup = ROUTES[hint]?.group;
    if (hintGroup) {
      const sameGroup = matched.find(r => r.route.group === hintGroup);
      if (sameGroup) return sameGroup;
    }
  }

  return matched[0];
}

// ══════════════════════════════════════════════
// REQUIREMENTS ENGINE — Layer 3
// ══════════════════════════════════════════════
function getRequirements(route) {
  return {
    docs: route.required_docs.map(d => ({ code: d, label: DOC_LABELS[d] || d })),
    affidavits: route.required_affidavits.map(a => ({ code: a, label: AFFIDAVIT_LABELS[a] || a })),
    authority: route.authority_approvals.map(a => ({ code: a, label: AUTHORITY_LABELS[a] || a }))
  };
}

// ══════════════════════════════════════════════
// RISK FLAGS — Layer 4
// ══════════════════════════════════════════════
function getRiskFlags(route, userFlags) {
  const flags = [];
  // Route-inherent flags
  route.risk_flags.forEach(f => {
    flags.push({ code: f, label: FLAG_LABELS[f] || f, level: f.startsWith('HARD') || ['ORG_AUTHORIZATION_CONFLICT','LESS_THAN_60_TRAINED','LESS_THAN_1_YEAR_EXPERIENCE','LATE_SUBMISSION_WINDOW','NOT_IN_ELIGIBLE_LOCALITY'].includes(f) ? 'hard' : 'review' });
  });
  // User-input flags
  if (userFlags.criminal) flags.push({ code:'CRIMINAL_RECORD', label:'עבר פלילי — נדרש בירור', level:'hard' });
  if (userFlags.medical) flags.push({ code:'MEDICAL_ISSUE', label:'בעיה רפואית — נדרש בירור', level:'review' });
  return flags;
}

// ══════════════════════════════════════════════
// INTERNAL SCORE — Layer 5 (v1.1 dual-axis)
// ══════════════════════════════════════════════
function calcScore(eligibility, primaryRoute, flags) {
  // Axis 1: Eligibility
  const eligibility_status =
    eligibility.status === 'FAIL' ? 'NOT_ELIGIBLE' :
    eligibility.status === 'CONDITIONAL' ? 'CONDITIONAL' : 'ELIGIBLE';

  // Axis 2: Readiness
  let readiness_status = 'READY';
  if (!primaryRoute || primaryRoute.status === 'BLOCKED') {
    readiness_status = 'NOT_READY';
  } else if (primaryRoute.status === 'INSUFFICIENT_DATA') {
    readiness_status = 'PARTIAL';
  } else if (flags.some(f => f.level === 'hard')) {
    readiness_status = 'PARTIAL';
  } else if (flags.some(f => f.level === 'review')) {
    readiness_status = 'READY'; // review flags don't block readiness
  }

  // Lawyer priority
  let lawyer_priority = 'STANDARD_REVIEW';
  if (eligibility_status === 'ELIGIBLE' && readiness_status === 'READY') {
    lawyer_priority = 'FAST_TRACK';
  } else if (eligibility_status === 'NOT_ELIGIBLE' || readiness_status === 'NOT_READY') {
    lawyer_priority = 'SENIOR_REVIEW';
  }

  // Legacy single score for UI color
  const value = eligibility_status === 'ELIGIBLE' && readiness_status === 'READY' ? 'HIGH' :
                eligibility_status === 'NOT_ELIGIBLE' ? 'LOW' : 'MEDIUM';

  const labels = {
    FAST_TRACK: 'מסלול מהיר — ניתן להגיש',
    STANDARD_REVIEW: 'בירור נדרש לפני הגשה',
    SENIOR_REVIEW: 'נדרש טיפול בכיר — חסם מהותי'
  };

  return { eligibility_status, readiness_status, lawyer_priority, value, label: labels[lawyer_priority] };
}

// ══════════════════════════════════════════════
// CALL GUIDANCE
// ══════════════════════════════════════════════
function buildCallGuidance(data, eligibility, primaryResult, flags, score) {
  const lines = [];
  const route = primaryResult?.route;

  if (eligibility.status === 'FAIL') {
    lines.push('⛔ לקוח לא עומד בתנאי סף — חסמים:');
    eligibility.gates.filter(g => g.result === 'fail').forEach(g =>
      lines.push(`  • ${g.label}${g.note ? ' — ' + g.note : ''}`)
    );
    return lines.join('\n');
  }

  if (eligibility.status === 'CONDITIONAL') {
    lines.push('⚠️ זכאות מותנית — פריטים לבירור:');
    eligibility.gates.filter(g => g.result === 'pending' || g.result === 'warn').forEach(g =>
      lines.push(`  • ${g.label}${g.note ? ' — ' + g.note : ''}`)
    );
    lines.push('');
  }

  if (!route) {
    lines.push('❓ לא זוהה מסלול — לברר עם הלקוח מהי הסיבה המרכזית לבקשה.');
    return lines.join('\n');
  }

  lines.push(`✅ מסלול מוביל: ${route.name}`);
  lines.push('');

  if (primaryResult.status === 'BLOCKED') {
    lines.push(`⛔ מסלול חסום: ${primaryResult.reasons.join(', ')}`);
  } else {
    // All required docs
    if (route.required_docs.length) {
      lines.push('📋 מסמכים לבדיקה עם הלקוח:');
      route.required_docs.forEach(d => lines.push(`  • ${DOC_LABELS[d] || d}`));
    }
    if (route.required_affidavits.length) {
      lines.push('📝 תצהירים לתיאום:');
      route.required_affidavits.forEach(a => lines.push(`  • ${AFFIDAVIT_LABELS[a] || a}`));
    }
    if (route.authority_approvals.length) {
      lines.push('🏛 אישורי גוף מוסמך נדרשים:');
      route.authority_approvals.forEach(a => lines.push(`  • ${AUTHORITY_LABELS[a] || a}`));
    }
  }

  if (flags.length) {
    lines.push('');
    lines.push('⚠️ נקודות לבירור:');
    flags.forEach(f => lines.push(`  • ${f.label}`));
  }

  lines.push('');
  const priorityEmoji = {FAST_TRACK:'🟢', STANDARD_REVIEW:'🟡', SENIOR_REVIEW:'🔴'};
  lines.push(`${priorityEmoji[score.lawyer_priority]} עדיפות: ${score.lawyer_priority} — ${score.label}`);

  return lines.join('\n');
}

// ══════════════════════════════════════════════
// RENDER FUNCTIONS
// ══════════════════════════════════════════════
function renderGates(gates) {
  return gates.map(g => {
    const icon = g.result === 'pass' ? '✅' : g.result === 'fail' ? '❌' : g.result === 'warn' ? '⚠️' : '🔲';
    const cls = g.result === 'pass' ? 'pass' : g.result === 'fail' ? 'fail' : g.result === 'warn' ? 'warn' : 'pending';
    return `<div class="gate-row ${cls}"><span class="gate-icon">${icon}</span><div><strong>${g.label}</strong>${g.note ? `<div style="font-size:11px;color:var(--muted);margin-top:2px">${g.note}</div>` : ''}</div></div>`;
  }).join('');
}

function renderDocs(reqs) {
  let html = '';
  if (reqs.docs.length) {
    html += '<div style="font-size:11px;color:var(--muted);margin-bottom:6px">מסמכים</div>';
    html += reqs.docs.map(d => `<div class="doc-item required">📄 ${d.label}</div>`).join('');
  }
  if (reqs.affidavits.length) {
    html += '<div style="font-size:11px;color:var(--muted);margin-top:10px;margin-bottom:6px">תצהירים ייעודיים</div>';
    html += reqs.affidavits.map(a => `<div class="doc-item affidavit">📝 ${a.label}</div>`).join('');
  }
  if (reqs.authority.length) {
    html += '<div style="font-size:11px;color:var(--muted);margin-top:10px;margin-bottom:6px">אישורי גוף מוסמך</div>';
    html += reqs.authority.map(a => `<div class="doc-item authority">🏛 ${a.label}</div>`).join('');
  }
  if (!reqs.docs.length && !reqs.affidavits.length && !reqs.authority.length) {
    html = '<div style="color:var(--muted);font-size:13px">לא נבחר מסלול</div>';
  }
  return html;
}

function renderFlags(flags) {
  if (!flags.length) return '<div style="color:var(--green);font-size:13px">✅ אין דגלי סיכון</div>';
  return flags.map(f => `<div class="flag-item ${f.level}"><span>${f.level === 'hard' ? '🔴' : '🟡'}</span><div>${f.label}</div></div>`).join('');
}

// ══════════════════════════════════════════════
// MAIN ENGINE RUN (v1.1 — async)
// ══════════════════════════════════════════════
async function runEngine() {
  const data = {
    name: document.getElementById('f_name').value || '—',
    phone: document.getElementById('f_phone').value || '—',
    settlement_id: document.getElementById('f_settlement_id').value || '',
    settlement_name: document.getElementById('f_settlement_name').value || '',
    age: parseInt(document.getElementById('f_age').value) || 0,
    status: document.getElementById('f_status').value,
    residency_years: parseInt(document.getElementById('f_residency_years').value) || 0,
    hebrew: document.getElementById('f_hebrew').value,
    service_type: document.getElementById('f_service_type').value,
    criterion: document.getElementById('f_criterion').value,
    flags: {
      org_auth: document.getElementById('f_flag_org_auth').checked,
      criminal: document.getElementById('f_flag_criminal').checked,
      medical: document.getElementById('f_flag_medical').checked,
      late: document.getElementById('f_flag_late').checked
    }
  };

  // Show loading
  document.getElementById('empty-state').style.display = 'none';
  document.getElementById('results').style.display = 'block';
  document.getElementById('gates-output').innerHTML = '<div style="color:var(--muted);font-size:13px">מריץ מנוע...</div>';

  // Layer 1
  const eligibility = runEligibilityEngine(data);

  // Locality lookup
  const localityEligible = await isEligibleLocality(data.settlement_id);

  // Layer 2
  const routeResults = await runRouteEngine(data, localityEligible);
  const primaryResult = selectPrimaryRoute(routeResults, data.criterion);
  const primaryRoute = primaryResult?.route || null;

  // Layer 3
  const reqs = primaryRoute ? getRequirements(primaryRoute) : {docs:[], affidavits:[], authority:[]};

  // Layer 4
  const flags = primaryRoute ? getRiskFlags(primaryRoute, data.flags) : [];

  // Layer 5
  const score = calcScore(eligibility, primaryResult, flags);
  const guidance = buildCallGuidance(data, eligibility, primaryResult, flags, score);

  // ── Render ──
  document.getElementById('gates-output').innerHTML = renderGates(eligibility.gates);

  // Layer 1 status banner
  const statusColors = {PASS:'var(--green)', CONDITIONAL:'var(--amber)', FAIL:'var(--red)'};
  const statusLabels = {PASS:'עבר תנאי סף ✅', CONDITIONAL:'מותנה ⚠️', FAIL:'לא עבר ❌'};
  document.getElementById('gates-output').innerHTML +=
    `<div style="margin-top:10px;padding:8px 12px;border-radius:6px;background:rgba(255,255,255,0.04);font-size:13px;font-weight:600;color:${statusColors[eligibility.status]}">
      סטטוס Layer 1: ${statusLabels[eligibility.status]}
    </div>`;

  document.getElementById('card-routes').style.display = 'block';

  // Show primary + alternatives
  let routesHtml = '';
  if (primaryResult) {
    routesHtml += '<div style="font-size:11px;color:var(--muted);margin-bottom:6px">מסלול מוביל</div>';
    routesHtml += renderRouteCard(primaryResult, true);
  }
  const alternatives = routeResults.filter(r => r.status === 'MATCH' && r.route_id !== primaryResult?.route_id).slice(0,3);
  if (alternatives.length) {
    routesHtml += '<div style="font-size:11px;color:var(--muted);margin-top:10px;margin-bottom:6px">מסלולים אפשריים נוספים</div>';
    alternatives.forEach(r => { routesHtml += renderRouteCard(r, false); });
  }
  const blocked = routeResults.filter(r => r.status === 'BLOCKED').slice(0,3);
  if (blocked.length) {
    routesHtml += '<div style="font-size:11px;color:var(--red);margin-top:10px;margin-bottom:6px">מסלולים חסומים</div>';
    blocked.forEach(r => { routesHtml += renderRouteCard(r, false); });
  }
  document.getElementById('routes-output').innerHTML = routesHtml || '<div style="color:var(--muted);font-size:13px">אין מסלול מזוהה</div>';

  document.getElementById('docs-flags-row').style.display = 'grid';
  document.getElementById('docs-output').innerHTML = renderDocs(reqs);
  document.getElementById('flags-output').innerHTML = renderFlags(flags);

  // Client card
  document.getElementById('card-client').style.display = 'block';
  const sv = document.getElementById('score-val');
  sv.textContent = score.value;
  sv.className = 'score-value ' + score.value.toLowerCase();
  document.getElementById('score-label').textContent = score.label;

  const eligLabels = {ELIGIBLE:'זכאי ✅', CONDITIONAL:'מותנה ⚠️', NOT_ELIGIBLE:'לא זכאי ❌'};
  const readLabels = {READY:'מוכן להגשה', PARTIAL:'חוסרים', NOT_READY:'לא מוכן'};

  document.getElementById('card-details').innerHTML = `
    <div style="font-size:13px;line-height:2">
      <div><strong>שם:</strong> ${data.name}</div>
      <div><strong>טלפון:</strong> ${data.phone}</div>
      <div><strong>גיל:</strong> ${data.age}</div>
      <div><strong>יישוב:</strong> ${data.settlement_name || '—'} ${localityEligible === true ? '✅' : localityEligible === false ? '❌' : ''}</div>
      <div><strong>מסלול:</strong> ${primaryRoute ? primaryRoute.name : '—'}</div>
      <div><strong>זכאות:</strong> ${eligLabels[score.eligibility_status]}</div>
      <div><strong>מוכנות:</strong> ${readLabels[score.readiness_status]}</div>
      <div><strong>עדיפות:</strong> ${score.lawyer_priority}</div>
      <div><strong>דגלים:</strong> ${flags.length ? flags.length + ' פריטים' : 'ללא'}</div>
    </div>
  `;
  document.getElementById('call-guidance').innerHTML = guidance.replace(/\n/g, '<br>');

  // Save to Supabase
  if (window._sb_connected) saveToSupabase(data, eligibility, primaryResult, routeResults, flags, score);
}

// ══════════════════════════════════════════════
// SETTLEMENT SEARCH + LOCALITY LOOKUP (v1.1)
// ══════════════════════════════════════════════
let _searchTimeout = null;
async function searchSettlement(val) {
  clearTimeout(_searchTimeout);
  const el = document.getElementById('settlement_results');
  document.getElementById('f_settlement_id').value = '';
  if (!val || val.length < 2) { el.textContent = ''; return; }

  if (!window._sb_connected) {
    el.innerHTML = '<span style="color:var(--amber)">חבר Supabase לאימות יישוב</span>';
    return;
  }

  _searchTimeout = setTimeout(async () => {
    try {
      const res = await fetch(
        `${window._sb_url}/rest/v1/eligible_localities?settlement_name_he=ilike.*${encodeURIComponent(val)}*&is_active=eq.true&select=settlement_id,settlement_name_he&limit=5`,
        { headers: { apikey: window._sb_key, Authorization: `Bearer ${window._sb_key}` } }
      );
      const data = await res.json();
      if (!data.length) { el.innerHTML = '<span style="color:var(--muted)">לא נמצא ביישובים זכאים</span>'; return; }
      el.innerHTML = data.map(d =>
        `<span style="cursor:pointer;color:var(--accent);margin-left:8px" onclick="selectSettlement('${d.settlement_id}','${d.settlement_name_he}')">✓ ${d.settlement_name_he}</span>`
      ).join('');
    } catch(e) { el.innerHTML = '<span style="color:var(--red)">שגיאת חיפוש</span>'; }
  }, 400);
}

function selectSettlement(id, name) {
  document.getElementById('f_settlement_id').value = id;
  document.getElementById('f_settlement_name').value = name;
  document.getElementById('settlement_results').innerHTML = `<span style="color:var(--green)">✅ ${name} — יישוב זכאי מאומת</span>`;
}

async function isEligibleLocality(settlement_id) {
  if (!window._sb_connected || !settlement_id) return null;
  try {
    const res = await fetch(
      `${window._sb_url}/rest/v1/eligible_localities?settlement_id=eq.${settlement_id}&is_active=eq.true&select=settlement_id`,
      { headers: { apikey: window._sb_key, Authorization: `Bearer ${window._sb_key}` } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data.length > 0;
  } catch(e) { return null; }
}

// ══════════════════════════════════════════════
// RENDER ROUTE CARD (v1.1)
// ══════════════════════════════════════════════
function renderRouteCard(routeResult, isPrimary) {
  const r = routeResult.route;
  const statusColors = {MATCH:'var(--green)', BLOCKED:'var(--red)', INSUFFICIENT_DATA:'var(--amber)'};
  const statusLabels = {MATCH:'זכאי', BLOCKED:'חסום', INSUFFICIENT_DATA:'חסר מידע'};
  const cls = routeResult.status === 'MATCH' ? (isPrimary ? 'selected' : '') : routeResult.status === 'BLOCKED' ? 'blocked' : '';
  const color = statusColors[routeResult.status] || 'var(--muted)';
  return `<div class="route-card ${cls}">
    <div class="route-header">
      <div>
        <div class="route-name">${r.name}</div>
        <div class="route-group">${routeResult.route_id}</div>
      </div>
      <span style="font-size:11px;font-weight:700;padding:2px 8px;border-radius:20px;background:${color}22;color:${color}">${statusLabels[routeResult.status]}</span>
    </div>
    ${routeResult.reasons.length ? `<div style="margin-top:6px;font-size:11px;color:${color}">${routeResult.reasons.join(' · ')}</div>` : ''}
  </div>`;
}

// ══════════════════════════════════════════════
// SUPABASE (v1.1 — saves all route results)
// ══════════════════════════════════════════════
window._sb_connected = false;
window._sb_url = 'https://lcvshepgzizrlqbzvjoe.supabase.co';
window._sb_key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxjdnNoZXBneml6cmxxYnp2am9lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU0MDU5NzEsImV4cCI6MjA5MDk4MTk3MX0.ca4rw8QeRoPdQPwAsqPiLEZD6S-eOCdw6-P4a4BIFNk';
window._current_submission_id = null;

function getSubmissionIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const raw = params.get('submission_id');
  if (!raw) return null;
  const id = Number(raw);
  return Number.isFinite(id) ? id : null;
}

function populateFormFromSubmission(record) {
  const d = record?.applicant_data || {};
  window._current_submission_id = record.id || null;

  const name = d.name || record.full_name || '';
  const phone = d.phone || record.phone || '';
  const settlementName = d.settlement_name || '';
  const settlementId = d.settlement_id || '';
  const age = d.age || '';
  const status = d.status || '';
  const residencyYears = d.residency_years || '';
  const hebrew = d.hebrew || 'yes';
  const serviceType = d.service_type || 'none';
  const criterion = d.criterion || '';
  const flags = d.flags || {};

  document.getElementById('f_name').value = name;
  document.getElementById('f_phone').value = phone;
  document.getElementById('f_settlement_name').value = settlementName;
  document.getElementById('f_settlement_id').value = settlementId;
  document.getElementById('f_age').value = age;
  document.getElementById('f_status').value = status;
  document.getElementById('f_residency_years').value = residencyYears;
  document.getElementById('f_hebrew').value = hebrew;
  document.getElementById('f_service_type').value = serviceType;
  document.getElementById('f_criterion').value = criterion;

  document.getElementById('f_flag_org_auth').checked = !!flags.org_auth;
  document.getElementById('f_flag_criminal').checked = !!flags.criminal;
  document.getElementById('f_flag_medical').checked = !!flags.medical;
  document.getElementById('f_flag_late').checked = !!flags.late;

  if (settlementName && settlementId) {
    document.getElementById('settlement_results').innerHTML =
      `<span style="color:var(--green)">✅ ${settlementName} — יישוב טעון מהמערכת</span>`;
  }

  const hint = document.createElement('div');
  hint.style.cssText = 'margin-bottom:12px;padding:10px 12px;border:1px solid rgba(59,130,246,.2);background:rgba(59,130,246,.08);border-radius:10px;font-size:12px;color:var(--text)';
  hint.innerHTML = `נטען ליד קיים מהמערכת · מזהה פנייה: <strong>${record.id}</strong>`;
  const emptyState = document.getElementById('empty-state');
  if (emptyState && !document.getElementById('submission-hint')) {
    hint.id = 'submission-hint';
    emptyState.parentNode.insertBefore(hint, emptyState);
  }
}

async function loadSubmissionFromUrl() {
  const submissionId = getSubmissionIdFromUrl();
  if (!submissionId || !window._sb_connected) return false;

  try {
    const res = await fetch(`${window._sb_url}/rest/v1/client_submissions?id=eq.${submissionId}&select=*`, {
      headers: { apikey: window._sb_key, Authorization: `Bearer ${window._sb_key}` }
    });
    if (!res.ok) throw new Error('status ' + res.status);
    const rows = await res.json();
    if (!rows.length) return false;

    populateFormFromSubmission(rows[0]);
    await runEngine();
    return true;
  } catch (e) {
    console.error('Load submission failed:', e);
    return false;
  }
}

async function connectDB() {
  const url = document.getElementById('sb_url').value.trim() || window._sb_url;
  const key = document.getElementById('sb_key').value.trim() || window._sb_key;
  if (!url || !key) { alert('הכנס URL ו-Key'); return; }
  try {
    const res = await fetch(`${url}/rest/v1/eligible_localities?select=count&limit=1`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` }
    });
    if (res.ok) {
      window._sb_connected = true;
      window._sb_url = url;
      window._sb_key = key;
      document.getElementById('db-dot').className = 'db-dot ok';
      document.getElementById('db-label').textContent = 'DB מחובר';
      document.getElementById('config-banner').style.display = 'none';
      await loadSubmissionFromUrl();
    } else throw new Error('status ' + res.status);
  } catch(e) {
    document.getElementById('db-dot').className = 'db-dot err';
    document.getElementById('db-label').textContent = 'שגיאת חיבור';
    alert('לא ניתן להתחבר: ' + e.message);
  }
}

async function saveToSupabase(data, eligibility, primaryResult, allRouteResults, flags, score) {
  try {
    const eligibleRoutes = allRouteResults.filter(r => r.status === 'MATCH').map(r => r.route_id);
    const payload = {
      full_name: data.name,
      phone: data.phone,
      applicant_data: {
        ...data,
        eligibility_status: score.eligibility_status,
        readiness_status: score.readiness_status,
        lawyer_priority: score.lawyer_priority
      },
      eligibility_passed: eligibility.status !== 'FAIL',
      failed_gates: eligibility.hard_fails || [],
      eligible_routes: eligibleRoutes,
      selected_route: primaryResult?.route_id || null,
      risk_flags: flags.map(f => f.code),
      internal_score: score.value,
      status: 'ANALYZED'
    };

    if (window._current_submission_id) {
      await fetch(`${window._sb_url}/rest/v1/client_submissions?id=eq.${window._current_submission_id}`, {
        method: 'PATCH',
        headers: {
          apikey: window._sb_key,
          Authorization: `Bearer ${window._sb_key}`,
          'Content-Type': 'application/json',
          Prefer: 'return=minimal'
        },
        body: JSON.stringify({
          ...payload,
          updated_at: new Date().toISOString()
        })
      });
    } else {
      await fetch(`${window._sb_url}/rest/v1/client_submissions`, {
        method: 'POST',
        headers: {
          apikey: window._sb_key,
          Authorization: `Bearer ${window._sb_key}`,
          'Content-Type': 'application/json',
          Prefer: 'return=minimal'
        },
        body: JSON.stringify(payload)
      });
    }
  } catch(e) { console.error('Save failed:', e); }
}

async function initEngine() {
  document.getElementById('sb_url').value = window._sb_url;
  document.getElementById('sb_key').value = window._sb_key;
  if (window._sb_url && window._sb_key) {
    await connectDB();
  }
}

initEngine();
</script>
</body>
</html>
