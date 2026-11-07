'use client';

import { useState, useTransition } from 'react';
import { format } from 'date-fns';
import { CheckCircle2, Mail, RefreshCw, TriangleAlert } from 'lucide-react';
import { toast } from 'sonner';
import { ConfirmDialog } from '@/components/admin/confirm-dialog';
import { sendPublicationEmailForArticle } from '@/lib/actions/articles';

type PublicationEmailStatus = 'not_sent' | 'sent' | 'failed';

interface PublicationEmailCardProps {
  articleId: string;
  articleTitle: string;
  articleUrl: string;
  articleStatus: string | null;
  submitterName: string | null;
  submitterEmail: string | null;
  emailStatus: string | null;
  emailSentAt: Date | string | null;
  emailLastAttemptedAt: Date | string | null;
  emailFailureReason: string | null;
  resendConfigured: boolean;
  configurationReason: string | null;
}

function formatDateSafely(date: Date | string | null | undefined): string | null {
  if (!date) return null;
  const d = new Date(date);
  if (isNaN(d.getTime())) return null;
  return format(d, 'dd MMM yyyy, h:mm a');
}

export function PublicationEmailCard({
  articleId,
  articleTitle,
  articleUrl,
  articleStatus,
  submitterName,
  submitterEmail,
  emailStatus,
  emailSentAt,
  emailLastAttemptedAt,
  emailFailureReason,
  resendConfigured,
  configurationReason,
}: PublicationEmailCardProps) {
  const [isPending, startTransition] = useTransition();
  const [confirmResend, setConfirmResend] = useState(false);
  const [state, setState] = useState({
    status: (emailStatus ?? 'not_sent') as PublicationEmailStatus,
    sentAt: emailSentAt,
    lastAttemptedAt: emailLastAttemptedAt,
    failureReason: emailFailureReason,
  });

  const hasRecipient = Boolean(submitterEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(submitterEmail));
  const isPublished = articleStatus === 'published';
  const canSend = isPublished && hasRecipient && resendConfigured;

  function send(resend: boolean) {
    startTransition(async () => {
      const result = await sendPublicationEmailForArticle(articleId, resend);
      if (result.success) {
        const sentAt = result.sentAt ? new Date(result.sentAt) : new Date();
        setState({ status: 'sent', sentAt, lastAttemptedAt: sentAt, failureReason: null });
        toast.success(resend ? 'Publication email resent.' : 'Publication email sent.');
        setConfirmResend(false);
      } else {
        setState((current) => ({
          ...current,
          status: result.status === 'failed' ? 'failed' : current.status,
          lastAttemptedAt: new Date(),
          failureReason: result.status === 'failed' ? result.error : current.failureReason,
        }));
        toast.error(result.error ?? 'Unable to send the publication email.');
      }
    });
  }

  let unavailableReason: string | null = null;
  if (!isPublished) unavailableReason = 'The article must be published before a notification can be sent.';
  else if (!hasRecipient) unavailableReason = 'The original submission does not have a valid submitter email.';
  else if (!resendConfigured) unavailableReason = configurationReason ?? 'Resend has not been configured.';

  return (
    <>
      <section className="bg-white rounded-xl border border-slate-200 p-6 space-y-5">
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
              <Mail className="w-4 h-4 text-blue-600" />
              Publication Email
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Notify the original submitter when this article is published.
            </p>
          </div>
          {state.status === 'sent' ? (
            <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-green-50 text-green-700 border border-green-200">
              <CheckCircle2 className="w-3.5 h-3.5" /> Sent
            </span>
          ) : state.status === 'failed' ? (
            <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-red-50 text-red-700 border border-red-200">
              <TriangleAlert className="w-3.5 h-3.5" /> Failed
            </span>
          ) : (
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
              Not sent
            </span>
          )}
        </div>

        <dl className="grid sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
          <div>
            <dt className="text-xs font-medium text-slate-500">Submitter</dt>
            <dd className="text-slate-900 mt-0.5">{submitterName || 'Unavailable'}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-slate-500">Recipient email</dt>
            <dd className="text-slate-900 mt-0.5 break-all">{submitterEmail || 'Unavailable'}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-slate-500">Published article</dt>
            <dd className="text-slate-900 mt-0.5">{articleTitle}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-slate-500">Public URL</dt>
            <dd className="mt-0.5 break-all">
              <a href={articleUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                {articleUrl}
              </a>
            </dd>
          </div>
        </dl>

        {state.status === 'sent' && state.sentAt && formatDateSafely(state.sentAt) && (
          <p className="text-xs text-green-700 bg-green-50 border border-green-100 rounded-lg px-3 py-2">
            Sent {formatDateSafely(state.sentAt)}.
          </p>
        )}
        {state.status === 'failed' && (
          <p className="text-xs text-red-700 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
            {state.failureReason || 'The last delivery attempt failed.'}
            {state.lastAttemptedAt && formatDateSafely(state.lastAttemptedAt) && ` Last attempted ${formatDateSafely(state.lastAttemptedAt)}.`}
          </p>
        )}
        {unavailableReason && (
          <p className="text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
            {unavailableReason}
          </p>
        )}

        <div className="flex justify-end">
          {state.status === 'sent' ? (
            <button
              type="button"
              disabled={!canSend || isPending}
              onClick={() => setConfirmResend(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Resend Email
            </button>
          ) : (
            <button
              type="button"
              disabled={!canSend || isPending}
              onClick={() => send(false)}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
            >
              <Mail className="w-4 h-4" />
              {isPending ? 'Sending…' : state.status === 'failed' ? 'Try Sending Again' : 'Send Publication Email'}
            </button>
          )}
        </div>
      </section>

      <ConfirmDialog
        open={confirmResend}
        onOpenChange={setConfirmResend}
        title="Resend publication email?"
        description={`A new publication notification will be sent to ${submitterEmail ?? 'the original submitter'}.`}
        confirmLabel="Resend Email"
        onConfirm={() => send(true)}
        loading={isPending}
      />
    </>
  );
}
