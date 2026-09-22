/**
 * Builds the five Leikah email signatures.
 *
 * Email HTML is not web HTML. Outlook renders through Microsoft Word, Gmail
 * strips <style> blocks, and neither supports flexbox, grid, web fonts or
 * external stylesheets. So: tables for layout, every style inline, a system
 * font stack, and explicit widths.
 *
 * Two decisions that matter more than they look:
 *
 *   No background colour on the signature. Outlook and Gmail both have dark
 *   modes that invert light backgrounds and leave dark text on dark. Letting
 *   the client's own background show through is the only thing that survives
 *   both. The gold rule and the mark carry the brand instead.
 *
 *   The logo is a hosted URL, not an embedded or attached image. Attached
 *   images show as paperclips on every message and many clients block them.
 *   Every line still reads with images off, which is how a large minority of
 *   recipients will see it.
 */
import { writeFileSync } from "node:fs";

const LOGO = "https://leikahgroup.co.za/brand/social-avatar.png";
const SITE = "https://leikahgroup.co.za";
const PHONE = "+27 60 976 3429";
const PHONE_TEL = "+27609763429";
const ALT = "+27 82 435 7961";
const ALT_TEL = "+27824357961";

const INK = "#1a1d21";      // not pure black: survives dark-mode inversion better
const MUTED = "#5a6470";
const GOLD = "#9a660a";     // gold-700 from the brand palette. The brand gold
                            // (#eda91b) manages only 2.04:1 on white and even a
                            // mid tone fails; this one measures 4.91:1 and passes.
const RULE_GOLD = "#eda91b"; // the real brand gold, kept for the decorative rule,
                            // where contrast rules for text do not apply.
const RULE = "#d8dce1";

const A = (href, text, color = GOLD) =>
  `<a href="${href}" style="color:${color};text-decoration:none">${text}</a>`;

/** One signature. `name` is what appears in bold, `role` the line under it. */
function signature({ name, role, email }) {
  return `<table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:1.45;color:${INK}">
  <tr>
    <td width="72" style="width:72px;padding:0 16px 0 0;vertical-align:top">
      <!-- alt is empty on purpose. The company name is the next thing read, so
           the mark is decorative and a screen reader announcing "Leikah Plant
           Hire" twice helps nobody. It also stops the alt text wrapping to
           three lines and stretching this column when images are blocked,
           which is how a large minority of recipients will see it. The fixed
           width holds the layout either way. -->
      <img src="${LOGO}" width="56" height="56" alt="" style="display:block;width:56px;height:56px;border:0;outline:none">
    </td>
    <td style="vertical-align:top;border-left:3px solid ${RULE_GOLD};padding:0 0 0 16px">
      <div style="font-size:15px;font-weight:bold;color:${INK};padding:0 0 1px 0">${name}</div>
      <div style="font-size:12px;color:${MUTED};padding:0 0 8px 0">${role}</div>
      <div style="font-size:13px;font-weight:bold;color:${INK};letter-spacing:.3px;padding:0 0 6px 0">LEIKAH PLANT HIRE</div>
      <div style="padding:0 0 2px 0">
        <span style="color:${MUTED}">T</span>&nbsp;&nbsp;${A(`tel:${PHONE_TEL}`, PHONE, INK)}
        <span style="color:${RULE}">&nbsp;|&nbsp;</span>
        ${A(`tel:${ALT_TEL}`, ALT, INK)}
      </div>
      <div style="padding:0 0 2px 0"><span style="color:${MUTED}">E</span>&nbsp;&nbsp;${A(`mailto:${email}`, email)}</div>
      <div style="padding:0 0 2px 0"><span style="color:${MUTED}">W</span>&nbsp;&nbsp;${A(SITE, "leikahgroup.co.za")}</div>
      <div style="padding:8px 0 0 0;font-size:11px;color:${MUTED}">
        Plant hire &middot; Earthmoving &middot; Heavy mechanical &middot; Mpumalanga
      </div>
      <div style="padding:2px 0 0 0;font-size:11px;color:${MUTED}">
        Breakdowns answered 24 hours on ${A(`tel:${PHONE_TEL}`, PHONE, MUTED)}
      </div>
    </td>
  </tr>
</table>`;
}

const SIGS = [
  { file: "director",  name: "Leon Roos",          role: "Director",                         email: "director@leikahgroup.co.za" },
  { file: "info",      name: "Leikah Plant Hire",  role: "General enquiries",                email: "info@leikahgroup.co.za" },
  { file: "sales",     name: "Leikah Plant Hire",  role: "Plant hire and quotations",        email: "sales@leikahgroup.co.za" },
  { file: "accounts",  name: "Leikah Plant Hire",  role: "Accounts and vendor onboarding",   email: "accounts@leikahgroup.co.za" },
  { file: "admin",     name: "Leikah Plant Hire",  role: "Administration",                   email: "admin@leikahgroup.co.za" },
];

const OUT = "/private/tmp/claude-501/-Users-struass-Desktop-ISM--supply-and-maintancance-/7fca5b04-5681-4085-ae46-f4122e7b594b/scratchpad/sig";

for (const s of SIGS) {
  writeFileSync(`${OUT}/${s.file}.html`, signature(s) + "\n");
}

/* A single page to open, read and copy each one from. */
const page = `<!doctype html>
<html lang="en-ZA"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Leikah email signatures</title>
<style>
  body{margin:0;background:#f4f5f7;font:15px/1.6 -apple-system,BlinkMacSystemFont,"Segoe UI",Arial,sans-serif;color:#1a1d21}
  .wrap{max-width:820px;margin:0 auto;padding:40px 20px 80px}
  h1{font-size:26px;margin:0 0 6px}
  .lead{color:#5a6470;margin:0 0 36px}
  .card{background:#fff;border:1px solid #e3e6ea;border-radius:8px;margin:0 0 22px;overflow:hidden}
  .hd{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:12px 18px;background:#fafbfc;border-bottom:1px solid #e3e6ea}
  .who{font-weight:700;font-size:14px}
  .addr{font:12px ui-monospace,SFMono-Regular,Menlo,monospace;color:#5a6470}
  .body{padding:22px 18px}
  .steps{background:#fff;border:1px solid #e3e6ea;border-radius:8px;padding:22px 24px;margin:0 0 34px}
  .steps h2{font-size:15px;margin:0 0 10px}
  .steps ol{margin:0;padding-left:20px}
  .steps li{margin:0 0 7px}
  code{background:#eef0f3;padding:1px 5px;border-radius:3px;font-size:13px}
  .note{font-size:13px;color:#5a6470;border-left:3px solid #b07f0c;padding:2px 0 2px 12px;margin:14px 0 0}
</style></head><body><div class="wrap">

<h1>Leikah Plant Hire email signatures</h1>
<p class="lead">One for each mailbox. Prepared by Sirius Ascent.</p>

<div class="steps">
  <h2>How to install one</h2>
  <ol>
    <li>Select a signature below, from the logo through to the last grey line, and copy it.</li>
    <li>Open the mailbox in Outlook on the web. For a shared mailbox that is <code>outlook.office.com/mail/info@leikahgroup.co.za/</code> and so on.</li>
    <li><strong>Settings</strong> (the gear, top right) then <strong>Mail</strong> then <strong>Compose and reply</strong>.</li>
    <li>Paste into the signature box. Name it <code>Leikah</code>.</li>
    <li>Tick it for <strong>new messages</strong> and for <strong>replies and forwards</strong>, then Save.</li>
  </ol>
  <p class="note">Paste the rendered signature, not the code. Copying from this page keeps the formatting; the HTML files alongside it are only needed if a client asks for source.</p>
</div>

${SIGS.map((s) => `<div class="card">
  <div class="hd"><span class="who">${s.name}${s.role === "Director" ? "" : " &middot; " + s.role}</span><span class="addr">${s.email}</span></div>
  <div class="body">${signature(s)}</div>
</div>`).join("\n")}

</div></body></html>`;

writeFileSync(`${OUT}/signatures.html`, page);
console.log(`built ${SIGS.length} signatures + signatures.html`);
