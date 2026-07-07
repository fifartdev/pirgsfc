import { NextResponse } from "next/server";

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

/**
 * Placeholder contact endpoint.
 *
 * Validates the payload and returns success without sending email. When email
 * credentials are configured (see .env.local.example — RESEND_API_KEY or the
 * SMTP_* variables), wire up Resend / Nodemailer inside the marked block.
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

  const emailConfigured =
    Boolean(process.env.RESEND_API_KEY) ||
    Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);

  if (emailConfigured) {
    // Integration point: send the message with Resend, Nodemailer, or SMTP.
    // Intentionally left unimplemented so no email is sent from this
    // placeholder deployment and no secrets are required.
  }

  return NextResponse.json({
    success: true,
    message: "Thank you for contacting PYRGOS FC. We will get back to you soon.",
  });
}
