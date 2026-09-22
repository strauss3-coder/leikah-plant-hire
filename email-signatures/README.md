# Email signatures

Five signatures, one per mailbox, for Leikah Plant Hire.

Open **`signatures.html`** in a browser. Copy a signature from that page and
paste it into the mailbox's settings. The individual `.html` files are the
source, only needed if a mail client asks for HTML rather than a paste.

## Installing one

1. Open the mailbox in Outlook on the web. A shared mailbox opens directly at
   `outlook.office.com/mail/info@leikahgroup.co.za/` and so on.
2. Settings (the gear) → Mail → Compose and reply.
3. Paste into the signature box, name it `Leikah`.
4. Tick it for new messages **and** for replies and forwards. Save.

Paste the rendered signature from `signatures.html`, not the code.

| Mailbox | Signature |
|---|---|
| `director@` | Leon Roos, Director |
| `info@` | General enquiries |
| `sales@` | Plant hire and quotations |
| `accounts@` | Accounts and vendor onboarding |
| `admin@` | Administration |

## Why they are built the way they are

**Tables and inline styles.** Outlook renders HTML through Microsoft Word.
Gmail strips `<style>` blocks. Neither supports flexbox, grid, web fonts or
external stylesheets, so anything else silently falls apart.

**No background colour.** Outlook and Gmail both have dark modes that invert
light backgrounds and leave dark text sitting on dark. Letting the client's own
background show through is the only thing that survives both.

**The logo is a hosted URL**, `leikahgroup.co.za/brand/social-avatar.png`, not
an attachment. Attached images show as a paperclip on every message and many
clients block them outright. Every line still reads with images off.

**Link gold is `#9a660a`, not the brand `#eda91b`.** The brand gold manages
only 2.04:1 against white, well under the 4.5:1 needed for text. This is
`gold-700` from the same palette and measures 4.91:1. The brand gold is kept
for the vertical rule, where it is decoration rather than text.

**The logo's `alt` is empty on purpose.** The company name is the next thing
read, so the mark is decorative, and with images blocked a long alt wrapped to
three lines and stretched the layout.

## Changing them

Edit `build.mjs` and run `node build.mjs`. It regenerates all five and the
preview page from one template, so they cannot drift apart.

## Not included

The physical address. Three versions of the trading name are still in
circulation and the address on the website has not been confirmed by the
client, so publishing it on every outbound email would be premature. Add it to
the template once that is settled.
