"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

type FormStatus = "idle" | "submitting" | "success" | "error";

export interface ContactFormStrings {
  name: string;
  namePlaceholder: string;
  email: string;
  emailPlaceholder: string;
  subject: string;
  subjectPlaceholder: string;
  message: string;
  messagePlaceholder: string;
  submit: string;
  submitting: string;
  successTitle: string;
  successText: string;
  sendAnother: string;
  errorText: string;
  errName: string;
  errEmail: string;
  errEmailInvalid: string;
  errSubject: string;
  errMessage: string;
  errMessageShort: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

interface ContactFormProps {
  strings: ContactFormStrings;
}

const inputClasses =
  "w-full rounded-xl border border-line bg-night/60 px-4 py-3 text-sm text-white placeholder:text-mist/50 transition-colors focus:border-crimson/60 focus:outline-none";

export function ContactForm({ strings }: ContactFormProps) {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errors, setErrors] = useState<FormErrors>({});

  function validate(data: Record<string, string>): FormErrors {
    const next: FormErrors = {};
    if (!data.name.trim()) next.name = strings.errName;
    if (!data.email.trim()) {
      next.email = strings.errEmail;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      next.email = strings.errEmailInvalid;
    }
    if (!data.subject.trim()) next.subject = strings.errSubject;
    if (!data.message.trim()) {
      next.message = strings.errMessage;
    } else if (data.message.trim().length < 10) {
      next.message = strings.errMessageShort;
    }
    return next;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const data = {
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      subject: String(formData.get("subject") ?? ""),
      message: String(formData.get("message") ?? ""),
    };

    const validationErrors = validate(data);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setStatus("submitting");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Request failed");
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div
        className="glass rounded-3xl p-10 text-center shadow-card"
        role="status"
        aria-live="polite"
      >
        <p className="font-display text-2xl font-extrabold uppercase tracking-wide text-crimson-bright">
          {strings.successTitle}
        </p>
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-mist">
          {strings.successText}
        </p>
        <div className="mt-8">
          <Button variant="outline" onClick={() => setStatus("idle")}>
            {strings.sendAnother}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="glass rounded-3xl p-8 shadow-card sm:p-10">
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label
            htmlFor="contact-name"
            className="mb-2 block font-display text-xs font-bold uppercase tracking-[0.18em] text-white/80"
          >
            {strings.name}
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            autoComplete="name"
            placeholder={strings.namePlaceholder}
            className={cn(inputClasses, errors.name && "border-red-400/70")}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "contact-name-error" : undefined}
          />
          {errors.name && (
            <p id="contact-name-error" className="mt-2 text-xs text-red-300">
              {errors.name}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="contact-email"
            className="mb-2 block font-display text-xs font-bold uppercase tracking-[0.18em] text-white/80"
          >
            {strings.email}
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder={strings.emailPlaceholder}
            className={cn(inputClasses, errors.email && "border-red-400/70")}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "contact-email-error" : undefined}
          />
          {errors.email && (
            <p id="contact-email-error" className="mt-2 text-xs text-red-300">
              {errors.email}
            </p>
          )}
        </div>
      </div>

      <div className="mt-6">
        <label
          htmlFor="contact-subject"
          className="mb-2 block font-display text-xs font-bold uppercase tracking-[0.18em] text-white/80"
        >
          {strings.subject}
        </label>
        <input
          id="contact-subject"
          name="subject"
          type="text"
          placeholder={strings.subjectPlaceholder}
          className={cn(inputClasses, errors.subject && "border-red-400/70")}
          aria-invalid={Boolean(errors.subject)}
          aria-describedby={errors.subject ? "contact-subject-error" : undefined}
        />
        {errors.subject && (
          <p id="contact-subject-error" className="mt-2 text-xs text-red-300">
            {errors.subject}
          </p>
        )}
      </div>

      <div className="mt-6">
        <label
          htmlFor="contact-message"
          className="mb-2 block font-display text-xs font-bold uppercase tracking-[0.18em] text-white/80"
        >
          {strings.message}
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows={6}
          placeholder={strings.messagePlaceholder}
          className={cn(inputClasses, "resize-y", errors.message && "border-red-400/70")}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "contact-message-error" : undefined}
        />
        {errors.message && (
          <p id="contact-message-error" className="mt-2 text-xs text-red-300">
            {errors.message}
          </p>
        )}
      </div>

      {status === "error" && (
        <p
          className="mt-6 rounded-xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-300"
          role="alert"
        >
          {strings.errorText}
        </p>
      )}

      <div className="mt-8">
        <Button type="submit" variant="crimson" size="lg" disabled={status === "submitting"}>
          {status === "submitting" ? strings.submitting : strings.submit}
        </Button>
      </div>
    </form>
  );
}
