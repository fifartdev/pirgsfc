import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { CLUB } from "@/lib/constants";

interface ContactPayload {
  name?: unknown;
  email?: unknown;
  subject?: unknown;
  message?: unknown;
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Strip line breaks before any user input reaches a mail header (name/email
// are only ever used in From/Reply-To/Subject-adjacent fields, never the
// message body) — defense in depth against header injection even though
// nodemailer's own MIME builder already treats these as structured fields
// rather than raw concatenated header strings.
function sanitizeHeaderValue(value: string): string {
  return value.replace(/[\r\n]+/g, " ").trim();
}

let cachedTransporter: ReturnType<typeof nodemailer.createTransport> | null = null;

function getTransporter() {
  if (cachedTransporter) return cachedTransporter;
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_SECURE } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) return null;

  const port = SMTP_PORT ? Number(SMTP_PORT) : 587;
  cachedTransporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port,
    secure: SMTP_SECURE ? SMTP_SECURE === "true" : port === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
  return cachedTransporter;
}

/**
 * Contact endpoint. Validates the payload and, when SMTP credentials are
 * configured (SMTP_HOST/SMTP_USER/SMTP_PASS — see AGENTS.md), sends the
 * message via SMTP through Nodemailer. Without those env vars set (e.g. in
 * preview/dev), it still validates and returns success but sends nothing —
 * this lets the form be exercised safely without real credentials.
 *
 * RESEND_API_KEY is read but intentionally not wired up here — this project
 * uses SMTP as its email transport; Resend remains a documented-but-unbuilt
 * alternative (see README) if a future deploy prefers it over SMTP.
 */
export async function POST(request: Request) {
  let payload: ContactPayload;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid JSON body." },
      { status: 400 }
    );
  }

  const { name, email, subject, message } = payload;

  const errors: Record<string, string> = {};
  if (!isNonEmptyString(name)) errors.name = "Name is required.";
  if (!isNonEmptyString(email)) {
    errors.email = "Email is required.";
  } else if (!EMAIL_PATTERN.test(email)) {
    errors.email = "Email is not valid.";
  }
  if (!isNonEmptyString(subject)) errors.subject = "Subject is required.";
  if (!isNonEmptyString(message)) errors.message = "Message is required.";

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ success: false, errors }, { status: 400 });
  }

  const transporter = getTransporter();
  if (transporter) {
    const safeName = sanitizeHeaderValue(name as string);
    const safeEmail = sanitizeHeaderValue(email as string);
    const safeSubject = sanitizeHeaderValue(subject as string);
    const recipient = process.env.CONTACT_RECIPIENT_EMAIL || CLUB.contact.email;

    try {
      await transporter.sendMail({
        from: `"PYRGOS AFC Contact Form" <${process.env.SMTP_USER}>`,
        to: recipient,
        replyTo: `"${safeName}" <${safeEmail}>`,
        subject: `[Contact] ${safeSubject}`,
        text: `From: ${safeName} <${safeEmail}>\nSubject: ${safeSubject}\n\n${message}`,
      });
    } catch (err) {
      console.error("[contact] Failed to send email:", err);
      return NextResponse.json(
        {
          success: false,
          error: "We couldn't send your message right now. Please try again later or contact us directly.",
        },
        { status: 502 }
      );
    }
  }

  return NextResponse.json({
    success: true,
    message: "Thank you for contacting PYRGOS FC. We will get back to you soon.",
  });
}
