'use client';

import { useState } from 'react';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { contactCategories } from '@/config/site';
import { contactSubmissionSchema, type ContactSubmission } from '@/lib/validators/contact';
import { validateSubmission } from '@/lib/actions/contact';

export function ContactForm({ defaultCategory = '' }: { defaultCategory?: string }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactSubmission>({
    resolver: zodResolver(contactSubmissionSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
      category: defaultCategory,
      website: '',
    },
  });

  const onSubmit = async (data: ContactSubmission) => {
    setIsSubmitting(true);
    setErrorMsg('');
    try {
      const result = await validateSubmission(data);
      if (result.success) {
        setIsSuccess(true);
        reset({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
          category: defaultCategory,
          website: '',
        });
      } else {
        setErrorMsg(result.error || 'Failed to submit form.');
      }
    } catch {
      setErrorMsg('An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-4">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h3 className="text-2xl font-bold text-slate-900">Message sent successfully</h3>
        <p className="text-slate-600 max-w-md">
          Thank you for reaching out. We have received your message and will respond as soon as possible.
        </p>
        <button
          onClick={() => setIsSuccess(false)}
          className="mt-6 px-6 py-2 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 font-medium transition-colors"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {errorMsg ? (
        <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm font-medium border border-red-100">
          {errorMsg}
        </div>
      ) : null}

      <input type="text" {...register('website')} className="hidden" tabIndex={-1} autoComplete="off" />

      <div className="grid sm:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-bold text-slate-900">
            Full Name
          </label>
          <input
            id="name"
            {...register('name')}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all bg-slate-50 focus:bg-white"
            placeholder="Your name"
          />
          {errors.name ? <p className="text-red-500 text-xs mt-1 font-medium">{errors.name.message}</p> : null}
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-bold text-slate-900">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            {...register('email')}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all bg-slate-50 focus:bg-white"
            placeholder="you@example.com"
          />
          {errors.email ? <p className="text-red-500 text-xs mt-1 font-medium">{errors.email.message}</p> : null}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="phone" className="text-sm font-bold text-slate-900">
            Phone Number (Optional)
          </label>
          <input
            id="phone"
            {...register('phone')}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all bg-slate-50 focus:bg-white"
            placeholder="+91 00000 00000"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="category" className="text-sm font-bold text-slate-900">
            Category
          </label>
          <select
            id="category"
            {...register('category')}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all bg-slate-50 focus:bg-white appearance-none"
          >
            <option value="">Select a category</option>
            {contactCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          {errors.category ? (
            <p className="text-red-500 text-xs mt-1 font-medium">{errors.category.message}</p>
          ) : null}
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="subject" className="text-sm font-bold text-slate-900">
          Subject
        </label>
        <input
          id="subject"
          {...register('subject')}
          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all bg-slate-50 focus:bg-white"
          placeholder="How can we help?"
        />
        {errors.subject ? <p className="text-red-500 text-xs mt-1 font-medium">{errors.subject.message}</p> : null}
      </div>

      <div className="space-y-2">
        <label htmlFor="message" className="text-sm font-bold text-slate-900">
          Message
        </label>
        <textarea
          id="message"
          {...register('message')}
          rows={5}
          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all bg-slate-50 focus:bg-white resize-none"
          placeholder="Write your message here..."
        />
        {errors.message ? <p className="text-red-500 text-xs mt-1 font-medium">{errors.message.message}</p> : null}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Sending...
          </>
        ) : (
          'Send Message'
        )}
      </button>
    </form>
  );
}
