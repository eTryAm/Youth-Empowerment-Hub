'use server';

import { contactSubmissionSchema, type ContactSubmission } from '@/lib/validators/contact';
import { db } from '@/lib/db';
import { contactSubmissions } from '@/lib/db/schema';
import { resolveContactCategory } from '@/lib/public/contact';

export async function validateSubmission(data: ContactSubmission) {
  try {
    const validated = contactSubmissionSchema.parse(data);

    if (validated.website) {
      return { success: true };
    }

    await db.insert(contactSubmissions).values({
      name: validated.name,
      email: validated.email,
      phone: validated.phone || null,
      subject: validated.subject,
      message: validated.message,
      category: resolveContactCategory(validated.category) || 'General Inquiry',
    });

    return { success: true };
  } catch {
    return { success: false, error: 'Something went wrong. Please try again.' };
  }
}
