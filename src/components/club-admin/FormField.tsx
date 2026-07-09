interface FormFieldProps {
  label: string;
  name: string;
  type?: "text" | "number" | "email" | "date" | "textarea" | "select" | "checkbox";
  required?: boolean;
  defaultValue?: string | number | boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
  hint?: string;
  min?: number;
  max?: number;
}

export function FormField({
  label,
  name,
  type = "text",
  required,
  defaultValue,
  placeholder,
  options,
  hint,
  min,
  max,
}: FormFieldProps) {
  const baseInput =
    "w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-gray-500 focus:border-red-600/60 focus:outline-none focus:ring-1 focus:ring-red-600/40";

  if (type === "checkbox") {
    return (
      <label className="flex cursor-pointer items-center gap-3">
        <input
          type="checkbox"
          name={name}
          defaultChecked={Boolean(defaultValue)}
          className="h-4 w-4 rounded border-white/20 bg-white/10 accent-red-600"
        />
        <span className="text-sm text-gray-300">
          {label}
          {required && <span className="ml-1 text-red-500">*</span>}
        </span>
      </label>
    );
  }

  if (type === "select" && options) {
    return (
      <div>
        <label className="mb-1.5 block text-xs font-medium text-gray-400">
          {label}
          {required && <span className="ml-1 text-red-500">*</span>}
        </label>
        <select
          name={name}
          required={required}
          defaultValue={String(defaultValue ?? "")}
          className={baseInput}
        >
          <option value="">— Επιλογή —</option>
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        {hint && <p className="mt-1 text-xs text-gray-500">{hint}</p>}
      </div>
    );
  }

  if (type === "textarea") {
    return (
      <div>
        <label className="mb-1.5 block text-xs font-medium text-gray-400">
          {label}
          {required && <span className="ml-1 text-red-500">*</span>}
        </label>
        <textarea
          name={name}
          required={required}
          defaultValue={String(defaultValue ?? "")}
          placeholder={placeholder}
          rows={4}
          className={`${baseInput} resize-y`}
        />
        {hint && <p className="mt-1 text-xs text-gray-500">{hint}</p>}
      </div>
    );
  }

  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-gray-400">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>
      <input
        type={type}
        name={name}
        required={required}
        defaultValue={String(defaultValue ?? "")}
        placeholder={placeholder}
        min={min}
        max={max}
        className={baseInput}
      />
      {hint && <p className="mt-1 text-xs text-gray-500">{hint}</p>}
    </div>
  );
}
