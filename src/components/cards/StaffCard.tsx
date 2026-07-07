import { Badge } from "@/components/ui/Badge";
import type { StaffMember } from "@/types";

interface StaffCardProps {
  member: StaffMember;
}

export function StaffCard({ member }: StaffCardProps) {
  return (
    <article className="glass group relative overflow-hidden rounded-2xl p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-gold/30">
      <div
        className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-gold/10 blur-3xl"
        aria-hidden="true"
      />
      <div className="relative flex items-start gap-4">
        <div
          className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-gold/30 bg-gradient-to-b from-navy-600 to-navy-900 font-display text-xl font-extrabold text-gold"
          aria-hidden="true"
        >
          {member.initials}
        </div>
        <div>
          <h3 className="font-display text-lg font-bold uppercase tracking-wide text-white">
            {member.name}
          </h3>
          <p className="mt-0.5 font-display text-xs font-semibold uppercase tracking-[0.2em] text-gold">
            {member.role}
          </p>
        </div>
      </div>

      <p className="relative mt-4 text-sm leading-relaxed text-mist">{member.bio}</p>

      <div className="relative mt-5 flex flex-wrap items-center gap-2 border-t border-line pt-4">
        <Badge variant="royal">{member.yearsOfExperience}+ yrs experience</Badge>
        <Badge variant="outline">{member.specialty}</Badge>
      </div>
    </article>
  );
}
