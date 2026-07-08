import { Badge } from "@/components/ui/Badge";
import { getDict } from "@/i18n";
import type { Lang, StaffMember } from "@/types";

interface StaffCardProps {
  member: StaffMember;
  lang: Lang;
}

export function StaffCard({ member, lang }: StaffCardProps) {
  const dict = getDict(lang);

  return (
    <article className="glass group relative overflow-hidden rounded-2xl p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-crimson/30">
      <div
        className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-crimson/10 blur-3xl"
        aria-hidden="true"
      />
      <div className="relative flex items-start gap-4">
        <div
          className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-crimson/30 bg-gradient-to-b from-ash-600 to-ash-900 font-display text-xl font-extrabold text-smoke-bright"
          aria-hidden="true"
        >
          {member.initials}
        </div>
        <div>
          <h3 className="font-display text-lg font-bold uppercase tracking-wide text-white">
            {member.name[lang]}
          </h3>
          <p className="mt-0.5 font-display text-xs font-semibold uppercase tracking-[0.2em] text-crimson-bright">
            {member.role[lang]}
          </p>
        </div>
      </div>

      <p className="relative mt-4 text-sm leading-relaxed text-mist">{member.bio[lang]}</p>

      <div className="relative mt-5 flex flex-wrap items-center gap-2 border-t border-line pt-4">
        <Badge variant="crimson">
          {member.yearsOfExperience}+ {dict.common.yearsExperience}
        </Badge>
        <Badge variant="outline">{member.specialty[lang]}</Badge>
      </div>
    </article>
  );
}
