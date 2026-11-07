import 'server-only';

import { Resend } from 'resend';

const SENDER_EMAIL = 'careers@youthempowerment.in';
const SENDER_IDENTITY = 'Youth Empowerment Hub <careers@youthempowerment.in>';

export type PublicationEmailInput = {
  recipientName: string;
  recipientEmail: string;
  articleTitle: string;
  articleUrl: string;
  idempotencyKey: string;
};

type PublicationEmailConfiguration =
  | { configured: true; apiKey: string; from: string; replyTo: string }
  | { configured: false; reason: string };

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    };
    return entities[character];
  });
}

function cleanEnvValue(value?: string): string | undefined {
  if (!value) return undefined;
  const trimmed = value.trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1).trim();
  }
  return trimmed;
}

function getConfiguration(): PublicationEmailConfiguration {
  const apiKey = cleanEnvValue(process.env.RESEND_API_KEY);
  const rawFrom = cleanEnvValue(process.env.RESEND_FROM_EMAIL);
  const rawReplyTo = cleanEnvValue(process.env.RESEND_REPLY_TO)?.toLowerCase();

  if (!apiKey) {
    return { configured: false, reason: 'Resend API key has not been configured (RESEND_API_KEY).' };
  }

  // Sender address: default to official identity if omitted, or validate authorized domain
  let from = SENDER_IDENTITY;
  if (rawFrom) {
    const normalized = rawFrom.trim();
    if (normalized.toLowerCase() === SENDER_EMAIL.toLowerCase()) {
      from = SENDER_IDENTITY;
    } else if (normalized.toLowerCase() === SENDER_IDENTITY.toLowerCase()) {
      from = SENDER_IDENTITY;
    } else {
      // Must be an authorized @youthempowerment.in address
      const emailMatch = normalized.match(/<([^>]+)>/) || [null, normalized];
      const parsedAddress = emailMatch[1]?.trim().toLowerCase();
      if (!parsedAddress || !parsedAddress.endsWith('@youthempowerment.in')) {
        return {
          configured: false,
          reason: 'Resend sender email must be an authorized @youthempowerment.in address.',
        };
      }
      from = normalized;
    }
  }

  // Reply-to address: default to careers@youthempowerment.in if omitted
  let replyTo = SENDER_EMAIL;
  if (rawReplyTo) {
    if (!rawReplyTo.endsWith('@youthempowerment.in')) {
      return {
        configured: false,
        reason: 'Resend reply-to address must be an authorized @youthempowerment.in address.',
      };
    }
    replyTo = rawReplyTo;
  }

  return { configured: true, apiKey, from, replyTo };
}

export function getPublicationEmailAvailability() {
  const configuration = getConfiguration();
  return {
    configured: configuration.configured,
    reason: configuration.configured ? null : configuration.reason,
  };
}

function buildPublicationEmail({ recipientName, articleTitle, articleUrl }: PublicationEmailInput) {
  const safeName = escapeHtml(recipientName.trim() || 'there');
  const safeTitle = escapeHtml(articleTitle);
  const safeUrl = escapeHtml(articleUrl);

  return {
    subject: 'Your Article Has Been Published – Youth Empowerment Hub',
    html: `<!doctype html>
<html lang="en">
  <body style="margin:0;padding:0;background:#f8fafc;font-family:Arial,Helvetica,sans-serif;color:#1e293b;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f8fafc;padding:32px 16px;">
      <tr><td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;background:#ffffff;border:1px solid #e2e8f0;border-radius:16px;overflow:hidden;">
          <tr><td style="background:#0a0f1c;padding:28px 32px;color:#ffffff;">
            <p style="margin:0;font-size:20px;font-weight:700;">Youth Empowerment Hub</p>
            <p style="margin:6px 0 0;font-size:13px;color:#cbd5e1;">Knowledge &amp; Updates</p>
          </td></tr>
          <tr><td style="padding:32px;">
            <p style="margin:0 0 20px;font-size:16px;line-height:24px;">Hello ${safeName},</p>
            <p style="margin:0 0 20px;font-size:16px;line-height:24px;">We are pleased to inform you that your article, <strong>&ldquo;${safeTitle}&rdquo;</strong>, has been successfully reviewed and published on Youth Empowerment Hub.</p>
            <p style="margin:0 0 28px;font-size:16px;line-height:24px;">Thank you for sharing your knowledge and contributing to our community. You can now read your published article using the link below.</p>
            <p style="margin:0 0 28px;"><a href="${safeUrl}" style="display:inline-block;background:#2563eb;color:#ffffff;text-decoration:none;font-size:15px;font-weight:700;padding:13px 20px;border-radius:8px;">Read Your Published Article</a></p>
            <p style="margin:0;font-size:16px;line-height:24px;">Regards,<br />Editorial Team<br />Youth Empowerment Hub<br /><a href="mailto:${SENDER_EMAIL}" style="color:#2563eb;">${SENDER_EMAIL}</a></p>
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`,
    text: `Hello ${recipientName.trim() || 'there'},\n\nWe are pleased to inform you that your article, "${articleTitle}", has been successfully reviewed and published on Youth Empowerment Hub.\n\nThank you for sharing your knowledge and contributing to our community.\n\nRead your published article: ${articleUrl}\n\nRegards,\nEditorial Team\nYouth Empowerment Hub\n${SENDER_EMAIL}`,
  };
}

export async function sendPublicationEmail(input: PublicationEmailInput) {
  const configuration = getConfiguration();
  if (!configuration.configured) {
    return { success: false as const, error: configuration.reason };
  }

  const message = buildPublicationEmail(input);

  try {
    const { data, error } = await new Resend(configuration.apiKey).emails.send(
      {
        from: configuration.from,
        replyTo: configuration.replyTo,
        to: input.recipientEmail,
        subject: message.subject,
        html: message.html,
        text: message.text,
      },
      { idempotencyKey: input.idempotencyKey },
    );

    if (error || !data?.id) {
      const errorMessage = error?.message || 'The email provider did not accept the notification.';
      console.error('[sendPublicationEmail] Resend rejected publication email:', error);
      return { success: false as const, error: errorMessage };
    }

    return { success: true as const, resendId: data.id };
  } catch (error: any) {
    console.error('[sendPublicationEmail] Resend request failed:', error);
    const errorMessage = error?.message || 'The email provider could not be reached.';
    return { success: false as const, error: errorMessage };
  }
}
