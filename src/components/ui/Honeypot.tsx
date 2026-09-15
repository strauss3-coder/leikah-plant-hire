/* ============================================================================
   HONEYPOT

   A field that only an automated script fills in.

   Three rules make it work, and breaking any one of them breaks it:

     • It must not be `display:none` or `hidden`. Most scrapers skip those.
       It is moved off-screen and given zero size instead, so a bot parsing
       the DOM still sees a normal text input worth filling.
     • It must be unreachable for real people. `aria-hidden` keeps it out of
       the accessibility tree, `tabIndex={-1}` keeps it out of the tab order,
       and the label is there only for any reader that ignores both.
     • The name must mean nothing to a password manager. Anything resembling
       `website`, `url`, `company` or `email` risks being autofilled for a
       genuine visitor, which would silently drop their enquiry.

   A filled honeypot is never reported as an error. The server returns an
   ordinary success so the sender learns nothing about why it failed.
   ========================================================================= */

const OFFSCREEN: React.CSSProperties = {
  position: "absolute",
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  border: 0,
  overflow: "hidden",
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  whiteSpace: "nowrap",
};

export function Honeypot({
  value,
  onChange,
  id = "hp-field",
}: {
  value: string;
  onChange: (value: string) => void;
  id?: string;
}) {
  return (
    <div style={OFFSCREEN} aria-hidden="true">
      <label htmlFor={id}>Leave this field empty</label>
      <input
        id={id}
        name="hpField"
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        tabIndex={-1}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
      />
    </div>
  );
}
