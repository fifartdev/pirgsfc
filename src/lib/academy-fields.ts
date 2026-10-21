/**
 * The /academy page's editable copy, listed once and shared by the
 * AcademyContent global (schema), getCmsAcademyContent (public loader), the
 * club-admin form and its save action. Each key is stored as `<key>` (Greek)
 * and `<key>En` (English); `key` also matches the i18n `academy.*` entry
 * used as the fallback while a field is empty.
 */
export const ACADEMY_TEXT_SECTIONS = [
  {
    title: "Hero",
    fields: [
      { key: "eyebrow", label: "Υπότιτλος" },
      { key: "title", label: "Τίτλος" },
      { key: "heroText", label: "Κείμενο", textarea: true },
    ],
  },
  {
    title: "Φιλοσοφία",
    fields: [
      { key: "philosophyEyebrow", label: "Υπότιτλος" },
      { key: "philosophyTitle", label: "Τίτλος" },
      { key: "philosophy1", label: "Παράγραφος 1", textarea: true },
      { key: "philosophy2", label: "Παράγραφος 2", textarea: true },
    ],
  },
  {
    title: "Απόφοιτοι",
    fields: [
      { key: "graduatesEyebrow", label: "Υπότιτλος" },
      { key: "graduatesTitle", label: "Τίτλος" },
      { key: "graduatesText", label: "Κείμενο", textarea: true },
    ],
  },
  {
    title: "Τμήματα υποδομών",
    fields: [
      { key: "groupsTitle", label: "Τίτλος" },
      { key: "groupsText", label: "Κείμενο", textarea: true },
    ],
  },
  {
    title: "Δοκιμαστικά & εγγραφές",
    fields: [
      { key: "trialsTitle", label: "Τίτλος" },
      { key: "trialsText", label: "Κείμενο", textarea: true },
      { key: "trialsCta", label: "Κείμενο κουμπιού" },
    ],
  },
] as const satisfies readonly {
  title: string;
  fields: readonly { key: string; label: string; textarea?: boolean }[];
}[];

export type AcademyTextKey = (typeof ACADEMY_TEXT_SECTIONS)[number]["fields"][number]["key"];

export const ACADEMY_TEXT_KEYS: AcademyTextKey[] = ACADEMY_TEXT_SECTIONS.flatMap((s) =>
  s.fields.map((f) => f.key)
);

/** Per-age-group fields; each stored as `<key>` (Greek) and `<key>En` (English). */
export const ACADEMY_GROUP_FIELDS = [
  { key: "name", label: "Όνομα (π.χ. Κ19)" },
  { key: "ages", label: "Ηλικίες" },
  { key: "coach", label: "Προπονητής" },
  { key: "trainingDays", label: "Προπονήσεις" },
  { key: "description", label: "Περιγραφή", textarea: true },
] as const satisfies readonly { key: string; label: string; textarea?: boolean }[];

export type AcademyGroupKey = (typeof ACADEMY_GROUP_FIELDS)[number]["key"];
