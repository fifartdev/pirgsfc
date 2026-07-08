import type { CalendarEvent } from "@/types";

const TC = { el: "Προπονητικό Κέντρο Πύργου", en: "Pyrgos Training Centre" };
const STADIUM = { el: "Στάδιο Πύργου", en: "Pyrgos Stadium" };
const HALL = { el: "Κλειστό Πύργου", en: "Pyrgos Indoor Hall" };
const PERF = {
  el: "Προπονητικό Κέντρο — Πτέρυγα Απόδοσης",
  en: "Training Centre — Performance Wing",
};

export const calendarEvents: CalendarEvent[] = [
  {
    id: "ev-01",
    title: { el: "Πρωινή Προπόνηση Ανδρών", en: "Men's Morning Training" },
    type: "training",
    date: "2026-07-06",
    startTime: "09:30",
    endTime: "11:30",
    location: TC,
    description: {
      el: "Τακτική προπόνηση υψηλής έντασης με έμφαση στο πρέσινγκ και τις μεταβάσεις ενόψει Ολύμπια Γιουνάιτεντ.",
      en: "High-intensity tactical session focused on pressing triggers and transitions ahead of the Olympia United fixture.",
    },
  },
  {
    id: "ev-02",
    title: { el: "Ανάλυση Βίντεο: Ολύμπια Γιουνάιτεντ", en: "Video Analysis: Olympia United" },
    type: "training",
    date: "2026-07-07",
    startTime: "10:00",
    endTime: "11:00",
    location: {
      el: "Προπονητικό Κέντρο — Αίθουσα Ανάλυσης",
      en: "Training Centre — Media Room",
    },
    description: {
      el: "Ανάλυση των πρόσφατων αγώνων της Ολύμπια: στημένες φάσεις και δομή πρέσινγκ.",
      en: "Full squad video review of Olympia United's recent matches, set-piece patterns, and pressing structure.",
    },
  },
  {
    id: "ev-03",
    title: { el: "Ημέρα Μέσων Ενημέρωσης", en: "Open Media Day" },
    type: "media",
    date: "2026-07-08",
    startTime: "12:00",
    endTime: "14:00",
    location: { el: "Στάδιο Πύργου — Αίθουσα Τύπου", en: "Pyrgos Stadium — Press Room" },
    description: {
      el: "Συνέντευξη Τύπου προπονητή και αρχηγού, με ανοιχτή προπόνηση για τα διαπιστευμένα μέσα.",
      en: "Pre-match press conference with the head coach and captain, plus open training access for accredited media.",
    },
  },
  {
    id: "ev-04",
    title: { el: "Προπόνηση Γυναικείας Ομάδας", en: "Women's Team Training" },
    type: "training",
    date: "2026-07-09",
    startTime: "18:00",
    endTime: "20:00",
    location: TC,
    description: {
      el: "Προετοιμασία της γυναικείας ομάδας για την αναμέτρηση με τις Αμαζόνες Δυτικής.",
      en: "Women's team preparation for the Amazones West fixture.",
    },
  },
  {
    id: "ev-05",
    title: { el: "Ανοιχτά Δοκιμαστικά Υποδομών", en: "Academy Open Trials" },
    type: "academy",
    date: "2026-07-10",
    startTime: "16:00",
    endTime: "19:00",
    location: { el: "Προπονητικό Κέντρο — Γήπεδο 3", en: "Training Centre — Pitch 3" },
    description: {
      el: "Ανοιχτά δοκιμαστικά για ηλικίες 12–16. Αξιολόγηση τεχνικής, αντίληψης και νοοτροπίας.",
      en: "Open trials for players aged 12–16. Academy staff assess technical skill, game intelligence, and attitude.",
    },
  },
  {
    id: "ev-06",
    title: { el: "Προπόνηση Ενεργοποίησης", en: "Light Activation Session" },
    type: "training",
    date: "2026-07-11",
    startTime: "10:00",
    endTime: "11:00",
    location: TC,
    description: {
      el: "Σύντομη, δυνατή προπόνηση παραμονής αγώνα: ταχύτητα, στημένες φάσεις και τελειώματα.",
      en: "Pre-matchday activation: speed work, set-piece walkthroughs, and finishing drills.",
    },
  },
  {
    id: "ev-07",
    title: { el: "PYRGOS AFC – Ολύμπια Γιουνάιτεντ", en: "PYRGOS AFC vs Olympia United" },
    type: "match",
    date: "2026-07-12",
    startTime: "19:30",
    location: STADIUM,
    description: {
      el: "16η Αγωνιστική Περιφερειακού Πρωταθλήματος. Το μεγαλύτερο εντός έδρας παιχνίδι της σεζόν. Πύλες 17:30.",
      en: "Regional League, Matchweek 16. The biggest home fixture of the season so far. Gates open at 17:30.",
    },
  },
  {
    id: "ev-08",
    title: { el: "PYRGOS AFC Γυναίκες – Αμαζόνες Δυτικής", en: "PYRGOS AFC Women vs Amazones West" },
    type: "match",
    date: "2026-07-13",
    startTime: "18:00",
    location: STADIUM,
    description: {
      el: "12η Αγωνιστική. Η γυναικεία ομάδα συνεχίζει την πορεία της στην έδρα της. Είσοδος ελεύθερη.",
      en: "Matchweek 12. The women's team continues its run at home. Free entry.",
    },
  },
  {
    id: "ev-09",
    title: { el: "Αποκατάσταση & Αναζωογόνηση", en: "Recovery & Regeneration" },
    type: "recovery",
    date: "2026-07-13",
    startTime: "10:00",
    endTime: "12:00",
    location: PERF,
    description: {
      el: "Πρωτόκολλα αποκατάστασης μετά τον αγώνα: πισίνα, μασάζ, κινητικότητα και ατομική φυσιοθεραπεία.",
      en: "Post-match recovery protocols: pool session, massage, mobility work, and individual physiotherapy.",
    },
  },
  {
    id: "ev-10",
    title: { el: "Κοινοτική Προπονητική Ημερίδα", en: "Community Coaching Clinic" },
    type: "community",
    date: "2026-07-14",
    startTime: "17:00",
    endTime: "19:00",
    location: { el: "Πάρκο Πόλης Πύργου", en: "Pyrgos City Park Pitches" },
    description: {
      el: "Παίκτες της πρώτης ομάδας και προπονητές των υποδομών διδάσκουν δωρεάν τα παιδιά της πόλης.",
      en: "First-team players and academy coaches lead a free coaching clinic for local children. All levels welcome.",
    },
  },
  {
    id: "ev-11",
    title: { el: "PYRGOS AFC Futsal – Δελφίνια Σάλας", en: "PYRGOS AFC Futsal vs Delfinia" },
    type: "match",
    date: "2026-07-15",
    startTime: "20:30",
    location: HALL,
    description: {
      el: "10η Αγωνιστική πρωταθλήματος futsal. Βραδιά θεάματος στο παρκέ του Κλειστού.",
      en: "Futsal league, Matchweek 10. A night of spectacle on the Indoor Hall court.",
    },
  },
  {
    id: "ev-12",
    title: { el: "Γύρισμα με Χορηγούς", en: "Sponsor Content Shoot" },
    type: "media",
    date: "2026-07-16",
    startTime: "13:00",
    endTime: "16:00",
    location: STADIUM,
    description: {
      el: "Γυρίσματα με τους συνεργάτες του συλλόγου για την καμπάνια της νέας σεζόν.",
      en: "Filming day with club partners for the new season campaign. Selected first-team players attend.",
    },
  },
  {
    id: "ev-13",
    title: { el: "Προετοιμασία Κυπέλλου", en: "Cup Preparation Session" },
    type: "training",
    date: "2026-07-17",
    startTime: "09:30",
    endTime: "11:30",
    location: TC,
    description: {
      el: "Τακτική προετοιμασία για το εκτός έδρας κύπελλο με τον Αστέρα Νότου, με εξάσκηση και στα πέναλτι.",
      en: "Tactical preparation for the away cup tie at Asteras South, including penalty practice.",
    },
  },
  {
    id: "ev-14",
    title: { el: "Αστέρας Νότου – PYRGOS AFC", en: "Asteras South vs PYRGOS AFC" },
    type: "match",
    date: "2026-07-19",
    startTime: "20:00",
    location: { el: "Αστέρας Αρένα", en: "Asteras Arena" },
    description: {
      el: "Κύπελλο, φάση των 16. Δύσκολη έξοδος κάτω από τα φώτα. Εισιτήρια φιλοξενουμένων από τον σύλλογο.",
      en: "Cup Round of 16. A tough away tie under the lights. Away tickets available through the club.",
    },
  },
  {
    id: "ev-15",
    title: { el: "Προπόνηση Αποκατάστασης", en: "Recovery Session" },
    type: "recovery",
    date: "2026-07-20",
    startTime: "10:00",
    endTime: "11:30",
    location: PERF,
    description: {
      el: "Ημέρα αποθεραπείας μετά το κύπελλο: υδροθεραπεία, διατάσεις και ατομικές θεραπείες.",
      en: "Post-cup recovery day: hydrotherapy, stretching protocols, and individual treatment sessions.",
    },
  },
  {
    id: "ev-16",
    title: { el: "Αγώνας Επίδειξης Κ17", en: "U17 Academy Showcase Match" },
    type: "academy",
    date: "2026-07-21",
    startTime: "17:30",
    endTime: "19:30",
    location: { el: "Προπονητικό Κέντρο — Γήπεδο 1", en: "Training Centre — Pitch 1" },
    description: {
      el: "Η Κ17 αγωνίζεται μπροστά στο επιτελείο της πρώτης ομάδας και προσκεκλημένους σκάουτερ.",
      en: "The U17 academy squad plays a showcase match in front of first-team staff and invited scouts.",
    },
  },
  {
    id: "ev-17",
    title: { el: "Βραδιά Φιλάθλων", en: "Fan Meet & Greet Evening" },
    type: "community",
    date: "2026-07-23",
    startTime: "18:00",
    endTime: "20:00",
    location: { el: "Στάδιο Πύργου — Κατάστημα Συλλόγου", en: "Pyrgos Stadium — Club Store" },
    description: {
      el: "Γνωρίστε τους παίκτες, υπογραφές σε φανέλες και κουβέντα με τον προπονητή στο επίσημο κατάστημα.",
      en: "Meet the players, get shirts signed, and hear from the head coach at the official club store evening.",
    },
  },
  {
    id: "ev-18",
    title: { el: "Προπόνηση Futsal", en: "Futsal Training Session" },
    type: "training",
    date: "2026-07-24",
    startTime: "20:00",
    endTime: "21:30",
    location: HALL,
    description: {
      el: "Προπόνηση του τμήματος futsal: κυκλοφορία σε ρόμβο και τελειώματα δεύτερης πάσας.",
      en: "Futsal section training: diamond rotations and second-post finishing patterns.",
    },
  },
  {
    id: "ev-19",
    title: { el: "Ενεργοποίηση Παραμονής Αγώνα", en: "Matchday -1 Activation" },
    type: "training",
    date: "2026-07-25",
    startTime: "10:00",
    endTime: "11:00",
    location: STADIUM,
    description: {
      el: "Τελευταία προετοιμασία στον αγωνιστικό χώρο του σταδίου: στημένες φάσεις και σχήμα ομάδας.",
      en: "Final preparation on the stadium pitch: set-piece rehearsal and team shape walkthrough.",
    },
  },
  {
    id: "ev-20",
    title: { el: "PYRGOS AFC – Ναυτικός Όρμου", en: "PYRGOS AFC vs Nautikos Bay" },
    type: "match",
    date: "2026-07-26",
    startTime: "19:00",
    location: STADIUM,
    description: {
      el: "17η Αγωνιστική. Ημέρα Οικογένειας — δωρεάν είσοδος για παιδιά κάτω των 12 με συνοδό.",
      en: "Regional League, Matchweek 17. Family Day — free entry for under-12s with a paying adult.",
    },
  },
  {
    id: "ev-21",
    title: { el: "Αποκατάσταση & Πισίνα", en: "Recovery & Pool Session" },
    type: "recovery",
    date: "2026-07-27",
    startTime: "10:00",
    endTime: "12:00",
    location: PERF,
    description: {
      el: "Ημέρα αποκατάστασης όλου του ρόστερ με υδροθεραπεία και εξατομικευμένη διαχείριση φορτίου.",
      en: "Full squad recovery day with hydrotherapy and individualised load management programmes.",
    },
  },
  {
    id: "ev-22",
    title: { el: "Έναρξη Καλοκαιρινού Camp Υποδομών", en: "Youth Academy Summer Camp Opens" },
    type: "academy",
    date: "2026-07-28",
    startTime: "09:00",
    endTime: "13:00",
    location: TC,
    description: {
      el: "Ξεκινά το εβδομαδιαίο καλοκαιρινό camp για όλες τις ηλικιακές κατηγορίες των υποδομών.",
      en: "The week-long summer camp for all academy age groups begins, led by the youth development staff.",
    },
  },
];

export function getEventsSorted(): CalendarEvent[] {
  return [...calendarEvents].sort(
    (a, b) => a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime)
  );
}
