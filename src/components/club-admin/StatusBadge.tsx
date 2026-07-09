const VARIANTS: Record<string, string> = {
  // Status values
  active: "bg-green-500/20 text-green-400",
  published: "bg-green-500/20 text-green-400",
  completed: "bg-blue-500/20 text-blue-400",
  draft: "bg-gray-500/20 text-gray-400",
  archived: "bg-gray-500/20 text-gray-400",
  inactive: "bg-yellow-500/20 text-yellow-400",
  scheduled: "bg-blue-500/20 text-blue-400",
  live: "bg-red-500/20 text-red-400",
  postponed: "bg-yellow-500/20 text-yellow-400",
  cancelled: "bg-red-500/20 text-red-400",
  // Roles
  superadmin: "bg-purple-500/20 text-purple-400",
  club_admin: "bg-blue-500/20 text-blue-400",
};

const LABELS: Record<string, string> = {
  active: "Ενεργό",
  published: "Δημοσιευμένο",
  completed: "Ολοκληρώθηκε",
  draft: "Πρόχειρο",
  archived: "Αρχείο",
  inactive: "Ανενεργό",
  scheduled: "Προγραμματισμένο",
  live: "Σε εξέλιξη",
  postponed: "Αναβλήθηκε",
  cancelled: "Ακυρώθηκε",
  superadmin: "Superadmin",
  club_admin: "Club Admin",
  men: "Άντρες",
  women: "Γυναίκες",
  futsal: "Futsal",
  youth: "Νέοι",
  academy: "Υποδομές",
  veterans: "Βετεράνοι",
};

interface StatusBadgeProps {
  value: string;
}

export function StatusBadge({ value }: StatusBadgeProps) {
  const cls = VARIANTS[value] ?? "bg-gray-500/20 text-gray-400";
  const label = LABELS[value] ?? value;
  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${cls}`}>
      {label}
    </span>
  );
}
