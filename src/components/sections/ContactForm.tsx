"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

type FormStatus = "idle" | "submitting" | "success" | "error";

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

const inputClasses =
  "w-full rounded-xl border border-line bg-night/60 px-4 py-3 text-sm text-white placeholder:text-mist/50 transition-colors focus:border-gold/60 focus:outline-none";

export function ContactForm() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errors, setErrors] = useState<FormErrors>({});

  function validate(data: Record<string, string>): FormErrors {
    const next: FormErrors = {};
    if (!data.name.trim()) next.name = "Please enter your name.";
    if (!data.email.trim()) {
      next.email = "Please enter your email address.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      next.email = "Please enter a valid email address.";
    }
    if (!data.subject.trim()) next.subject = "Please enter a subject.";
    if (!data.message.trim()) {
      next.message = "Please enter a message.";
    } else if (data.message.trim().length < 10) {
      next.message = "Your message should be at least 10 characters.";
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
        <p className="font-display text-2xl font-extrabold uppercase tracking-wide text-gold">
          Message Received
        </p>
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-mist">
          Thank you for reaching out to PYRGOS FC. Our team will get back to you
          as soon as possible — usually within two working days.
        </p>
        <div className="mt-8">
          <Button variant="outline" onClick={() => setStatus("idle")}>
            Send Another Message
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
            Name
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            autoComplete="name"
            placeholder="Your full name"
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
            Email
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
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
          Subject
        </label>
        <input
          id="contact-subject"
          name="subject"
          type="text"
          placeholder="What is your message about?"
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
          Message
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows={6}
          placeholder="Tell us how we can help..."
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
        <p className="mt-6 rounded-xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-300" role="alert">
          Something went wrong while sending your message. Please try again in a
          moment.
        </p>
      )}

      <div className="mt-8">
        <Button type="submit" variant="gold" size="lg" disabled={status === "submitting"}>
          {status === "submitting" ? "Sending..." : "Send Message"}
        </Button>
      </div>
    </form>
  );
}
