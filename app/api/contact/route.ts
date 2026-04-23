/**
 * Endpoint POST /api/contact — reçoit les messages du formulaire de contact
 * et envoie une notification par email via l'API HTTP Brevo.
 *
 * Flux :
 *   Navigateur ─▶ POST /api/contact (cette route, serveur)
 *                    ↓  validation + honeypot + rate-limit
 *                POST https://api.brevo.com/v3/smtp/email
 *                    ↓
 *             Gmail : CONTACT_TO_EMAIL
 *
 * Aucun stockage côté Strapi (voir docs-site-interne/contact-flow.md pour la
 * décision d'architecture). Si l'envoi Brevo échoue, on renvoie une erreur 502
 * au client pour qu'il puisse ré-essayer.
 *
 * Variables d'environnement requises (voir .env.example) :
 *   - BREVO_API_KEY
 *   - CONTACT_FROM_EMAIL  (doit être un expéditeur vérifié dans Brevo)
 *   - CONTACT_FROM_NAME
 *   - CONTACT_TO_EMAIL
 *   - CONTACT_TO_NAME
 */

import { NextResponse, type NextRequest } from "next/server";

// Force Node runtime : `fetch` est dispo sur l'edge aussi, mais on veut la
// stdlib Node pour les logs serveur et parce que Brevo peut mettre >1s à
// répondre (edge a une limite de timeout plus stricte sur Vercel free).
export const runtime = "nodejs";

// Map en mémoire pour le rate-limit. `Map<ip, number[]>` où number[] est la
// liste des timestamps d'envois récents. On nettoie à la volée. Suffisant pour
// un portfolio — pas besoin de Redis tant qu'on reste sur une instance.
// Note : en mode serverless (plusieurs lambdas), cette map n'est pas partagée,
// donc le rate-limit est "best effort". Pour du ship prod sous charge, passer
// sur Redis ou Upstash.
const rateLimitStore = new Map<string, number[]>();
const RATE_LIMIT_MAX = 3; // 3 envois max
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // par tranche de 10 minutes

const MAX_NAME_LENGTH = 120;
const MAX_EMAIL_LENGTH = 160;
const MAX_MESSAGE_LENGTH = 5000;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type ContactPayload = {
  name?: string;
  email?: string;
  message?: string;
  // Champ honeypot : rempli = bot. Ne jamais loguer son contenu.
  website?: string;
};

function getClientIp(req: NextRequest): string {
  // Ordre de priorité classique derrière un reverse-proxy (Vercel, Nginx).
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  const xrip = req.headers.get("x-real-ip");
  if (xrip) return xrip.trim();
  // Fallback local : pas d'IP extractible (ex. `localhost`), on bucketise tout
  // le trafic dans un même compartiment. Acceptable en dev.
  return "unknown";
}

function checkRateLimit(ip: string): { ok: boolean; retryAfterMs: number } {
  const now = Date.now();
  const recent = (rateLimitStore.get(ip) ?? []).filter(
    (ts) => now - ts < RATE_LIMIT_WINDOW_MS
  );
  if (recent.length >= RATE_LIMIT_MAX) {
    const oldest = recent[0];
    return { ok: false, retryAfterMs: RATE_LIMIT_WINDOW_MS - (now - oldest) };
  }
  recent.push(now);
  rateLimitStore.set(ip, recent);
  return { ok: true, retryAfterMs: 0 };
}

function escapeHtml(raw: string): string {
  return raw
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function buildEmailContents(input: {
  name: string;
  email: string;
  message: string;
  ip: string;
}) {
  const dateTime = new Date().toLocaleString("fr-FR", {
    timeZone: "Europe/Paris",
  });
  const safeName = escapeHtml(input.name);
  const safeEmail = escapeHtml(input.email);
  const safeMessage = escapeHtml(input.message).replace(/\n/g, "<br>");

  const subject = `Nouveau message portfolio — ${input.name}`;

  const textContent = [
    `Nouveau message reçu sur le formulaire de contact.`,
    ``,
    `Nom : ${input.name}`,
    `Email : ${input.email}`,
    `Date : ${dateTime}`,
    `IP : ${input.ip}`,
    ``,
    `Message :`,
    input.message,
    ``,
    `---`,
    `Répondre directement à ce mail renverra vers ${input.email}.`,
  ].join("\n");

  const htmlContent = `
<!doctype html>
<html>
  <body style="font-family: system-ui, -apple-system, Segoe UI, sans-serif; color: #191c1d; background: #f8fafa; margin: 0; padding: 24px;">
    <div style="max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 16px; padding: 24px; box-shadow: 0 4px 12px rgba(25,28,29,0.06);">
      <h1 style="font-size: 18px; font-weight: 700; color: #26445d; margin: 0 0 16px;">
        Nouveau message portfolio
      </h1>
      <table role="presentation" style="width: 100%; font-size: 14px; line-height: 1.5;">
        <tr>
          <td style="color: #516169; padding: 4px 0; width: 80px;">Nom</td>
          <td style="font-weight: 600;">${safeName}</td>
        </tr>
        <tr>
          <td style="color: #516169; padding: 4px 0;">Email</td>
          <td><a href="mailto:${safeEmail}" style="color: #26445d;">${safeEmail}</a></td>
        </tr>
        <tr>
          <td style="color: #516169; padding: 4px 0;">Date</td>
          <td>${dateTime}</td>
        </tr>
        <tr>
          <td style="color: #516169; padding: 4px 0;">IP</td>
          <td style="font-family: monospace; font-size: 12px; color: #42474d;">${escapeHtml(input.ip)}</td>
        </tr>
      </table>
      <div style="margin-top: 20px; padding: 16px; background: #f2f4f4; border-radius: 12px;">
        <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.15em; color: #516169; margin-bottom: 8px;">Message</div>
        <div style="font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${safeMessage}</div>
      </div>
      <p style="margin-top: 20px; font-size: 12px; color: #73777d;">
        Répondre directement à ce mail renverra vers <strong>${safeEmail}</strong>.
      </p>
    </div>
  </body>
</html>
`.trim();

  return { subject, textContent, htmlContent };
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.BREVO_API_KEY;
  const fromEmail = process.env.CONTACT_FROM_EMAIL;
  const fromName = process.env.CONTACT_FROM_NAME ?? "Portfolio — nouveau message";
  const toEmail = process.env.CONTACT_TO_EMAIL;
  const toName = process.env.CONTACT_TO_NAME ?? "Portfolio";

  if (!apiKey || !fromEmail || !toEmail) {
    console.error("[/api/contact] Configuration Brevo incomplète", {
      hasKey: Boolean(apiKey),
      hasFrom: Boolean(fromEmail),
      hasTo: Boolean(toEmail),
    });
    return NextResponse.json(
      { ok: false, error: "SERVER_MISCONFIGURED" },
      { status: 500 }
    );
  }

  let payload: ContactPayload;
  try {
    payload = (await req.json()) as ContactPayload;
  } catch {
    return NextResponse.json(
      { ok: false, error: "INVALID_JSON" },
      { status: 400 }
    );
  }

  const name = (payload.name ?? "").trim();
  const email = (payload.email ?? "").trim();
  const message = (payload.message ?? "").trim();
  const honeypot = (payload.website ?? "").trim();

  // Honeypot : si un bot a rempli le champ caché, on simule un succès silencieux.
  // Ne jamais renvoyer une erreur → ça donnerait aux bots un signal pour retry.
  if (honeypot.length > 0) {
    console.warn("[/api/contact] Honeypot déclenché, IP :", getClientIp(req));
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  if (!name || !email || !message) {
    return NextResponse.json(
      { ok: false, error: "MISSING_FIELDS" },
      { status: 400 }
    );
  }

  if (
    name.length > MAX_NAME_LENGTH ||
    email.length > MAX_EMAIL_LENGTH ||
    message.length > MAX_MESSAGE_LENGTH
  ) {
    return NextResponse.json(
      { ok: false, error: "TOO_LONG" },
      { status: 413 }
    );
  }

  if (!EMAIL_REGEX.test(email)) {
    return NextResponse.json(
      { ok: false, error: "INVALID_EMAIL" },
      { status: 400 }
    );
  }

  const ip = getClientIp(req);
  const rate = checkRateLimit(ip);
  if (!rate.ok) {
    return NextResponse.json(
      { ok: false, error: "RATE_LIMITED" },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil(rate.retryAfterMs / 1000)),
        },
      }
    );
  }

  const { subject, textContent, htmlContent } = buildEmailContents({
    name,
    email,
    message,
    ip,
  });

  try {
    const brevoRes = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": apiKey,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        sender: { name: fromName, email: fromEmail },
        to: [{ email: toEmail, name: toName }],
        // replyTo : clé de confort UX. Cliquer "Répondre" dans Gmail écrit
        // directement au visiteur, sans aller-retour manuel pour recopier
        // l'email depuis le corps du mail.
        replyTo: { email, name },
        subject,
        htmlContent,
        textContent,
        tags: ["portfolio", "contact-form"],
      }),
    });

    if (!brevoRes.ok) {
      const text = await brevoRes.text();
      console.error(
        "[/api/contact] Brevo error",
        brevoRes.status,
        brevoRes.statusText,
        text
      );
      return NextResponse.json(
        { ok: false, error: "BREVO_ERROR" },
        { status: 502 }
      );
    }
  } catch (err) {
    console.error("[/api/contact] Brevo fetch failed:", err);
    return NextResponse.json(
      { ok: false, error: "BREVO_UNREACHABLE" },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}
