'use client';

import { useState } from 'react';
import { Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { useLandingContent } from '@/hooks/LandingContentContext';
import { resolveIcon } from '@/utils/icons';

const EMPTY_FORM = { fullName: '', email: '', phone: '', subject: '', message: '' };

export default function Contact() {
  const { contactItems, sectionHeaders } = useLandingContent();
  const cH = sectionHeaders.contact;

  const [form, setForm] = useState(EMPTY_FORM);
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch('/api/contact-submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, source: 'form' }),
      });
      if (!res.ok) throw new Error();
      setForm(EMPTY_FORM);
      setStatus('success');
      setTimeout(() => setStatus('idle'), 4000);
    } catch {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 4000);
    }
  };

  const inputCls = 'w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-hotel-400 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 focus:outline-none transition-colors backdrop-blur-sm';

  return (
    <section id="contact" className="scroll-mt-20 py-24 bg-hotel-900 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-400 mb-3">
            {cH.label}
          </p>
          <h2 className="font-serif text-4xl font-bold mb-4">{cH.title}</h2>
          <p className="mx-auto max-w-2xl text-hotel-300 leading-relaxed">
            {cH.description}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left: Contact Form */}
          <div className="rounded-2xl bg-white/5 border border-white/10 p-8 sm:p-10 backdrop-blur-sm flex flex-col">
            <div className="text-center mb-8">
              <h3 className="font-serif text-2xl font-bold mb-2">Send Us a Message</h3>
              <p className="text-sm text-hotel-300">We&apos;ll get back to you as soon as possible</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 flex flex-col flex-1">
              <div className="grid sm:grid-cols-2 gap-4">
                <input name="fullName" value={form.fullName} onChange={handleChange} placeholder="Full Name *" required className={inputCls} />
                <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Email Address *" required className={inputCls} />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone Number" className={inputCls} />
                <input name="subject" value={form.subject} onChange={handleChange} placeholder="Subject *" required className={inputCls} />
              </div>
              <textarea name="message" value={form.message} onChange={handleChange} placeholder="Your Message *" required rows={5} className={`${inputCls} resize-none flex-1 min-h-[120px]`} />

              <div className="flex items-center justify-between gap-4 pt-2">
                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="flex items-center gap-2 rounded-xl bg-gold-600 px-8 py-3 text-sm font-bold uppercase tracking-wider text-white shadow-lg shadow-gold-600/25 transition-all hover:bg-gold-700 hover:shadow-gold-700/30 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <Send className="h-4 w-4" />
                  {status === 'sending' ? 'Sending...' : 'Send Message'}
                </button>

                {status === 'success' && (
                  <p className="flex items-center gap-1.5 text-sm font-medium text-green-400 animate-modal-content">
                    <CheckCircle2 className="h-4 w-4" />Message sent successfully!
                  </p>
                )}
                {status === 'error' && (
                  <p className="flex items-center gap-1.5 text-sm font-medium text-red-400 animate-modal-content">
                    <AlertCircle className="h-4 w-4" />Failed to send. Please try again.
                  </p>
                )}
              </div>
            </form>
          </div>

          {/* Right: Contact Info Cards (2×2 grid) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {contactItems.map((item) => {
              const ItemIcon = resolveIcon(item.icon);
              return (
                <div
                  key={item.id}
                  className="rounded-2xl bg-white/5 border border-white/10 p-6 sm:p-8 text-center backdrop-blur-sm transition-all duration-300 hover:bg-white/10 hover:border-white/20 flex flex-col items-center justify-center overflow-hidden"
                >
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gold-600/20 text-gold-400">
                    <ItemIcon className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold text-lg mb-3">{item.title}</h3>
                  {item.lines.map((line) => (
                    <p key={line} className="text-sm text-hotel-300 leading-relaxed break-all sm:break-normal">{line}</p>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
