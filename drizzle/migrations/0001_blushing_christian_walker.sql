ALTER TYPE "public"."article_status" ADD VALUE IF NOT EXISTS 'pending_review' BEFORE 'published';--> statement-breakpoint
ALTER TYPE "public"."article_status" ADD VALUE IF NOT EXISTS 'rejected';--> statement-breakpoint
ALTER TABLE "articles" ADD COLUMN IF NOT EXISTS "view_count" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "articles" ADD COLUMN IF NOT EXISTS "submitted_by_name" text;--> statement-breakpoint
ALTER TABLE "articles" ADD COLUMN IF NOT EXISTS "submitted_by_email" text;--> statement-breakpoint
ALTER TABLE "articles" ADD COLUMN IF NOT EXISTS "submitted_at" timestamp;--> statement-breakpoint
ALTER TABLE "articles" ADD COLUMN IF NOT EXISTS "content_plaintext" text;--> statement-breakpoint
ALTER TABLE "articles" ADD COLUMN IF NOT EXISTS "review_note" text;--> statement-breakpoint
ALTER TABLE "articles" ADD COLUMN IF NOT EXISTS "publication_email_status" text DEFAULT 'not_sent' NOT NULL;--> statement-breakpoint
ALTER TABLE "articles" ADD COLUMN IF NOT EXISTS "publication_email_last_attempted_at" timestamp;--> statement-breakpoint
ALTER TABLE "articles" ADD COLUMN IF NOT EXISTS "publication_email_sent_at" timestamp;--> statement-breakpoint
ALTER TABLE "articles" ADD COLUMN IF NOT EXISTS "publication_email_resend_id" text;--> statement-breakpoint
ALTER TABLE "articles" ADD COLUMN IF NOT EXISTS "publication_email_failure_reason" text;--> statement-breakpoint
ALTER TABLE "articles" ADD COLUMN IF NOT EXISTS "publication_email_sending_at" timestamp;--> statement-breakpoint
ALTER TABLE "articles" ADD COLUMN IF NOT EXISTS "publication_email_attempt_key" text;
