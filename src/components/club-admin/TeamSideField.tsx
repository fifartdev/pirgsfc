"use client";

import { useState } from "react";

interface TeamSideFieldProps {
  label: string;
  selectName: string;
  manualName: string;
  clubOptions: { value: string; label: string }[];
  defaultSelectValue?: string;
  defaultManualValue?: string;
}

/**
 * One side (home or away) of a match: a select offering "PYRGOS AFC" + every
 * registered Clubs record, plus a manual-entry fallback for a one-off
 * opponent that was never added to the registry. Used twice per match form
 * (Γηπεδούχος/Φιλοξενούμενος) — the action derives isHomeMatch/opponentClub
 * from whichever side is "PYRGOS" vs a club vs manual text.
 */
export function TeamSideField({
  label,
  selectName,
  manualName,
  clubOptions,
  defaultSelectValue,
  defaultManualValue,
}: TeamSideFieldProps) {
  const [value, setValue] = useState(defaultSelectValue ?? "PYRGOS");

  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-gray-400">{label}</label>
      <select
        name={selectName}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white focus:border-red-600/60 focus:outline-none focus:ring-1 focus:ring-red-600/40"
      >
        <option value="PYRGOS">PYRGOS AFC</option>
        {clubOptions.map((c) => (
          <option key={c.value} value={c.value}>
            {c.label}
          </option>
        ))}
        <option value="__manual__">— Χειροκίνητη καταχώρηση —</option>
      </select>
      {value === "__manual__" && (
        <input
          type="text"
          name={manualName}
          defaultValue={defaultManualValue}
          placeholder="Όνομα ομάδας"
          className="mt-2 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-gray-500 focus:border-red-600/60 focus:outline-none focus:ring-1 focus:ring-red-600/40"
        />
      )}
    </div>
  );
}
