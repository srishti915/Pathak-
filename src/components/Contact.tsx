import React, { useState } from 'react';
import {
  Mail,
  Instagram,
  MessageSquare,
  Send,
  CheckCircle2,
  AlertCircle,
  ArrowDown,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

interface ContactFormData {
  name: string;
  email: string;
  message: string;
  honeypot?: string;
}

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    message: '',
    honeypot: '',
  });

  const [formErrors, setFormErrors] = useState<Partial<Record<keyof ContactFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const validate = (): boolean => {
    const errors: Partial<Record<keyof ContactFormData, string>> = {};

    if (!formData.name.trim()) {
      errors.name = 'Please enter your full name.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      errors.email = 'Please enter your email address.';
    } else if (!emailRegex.test(formData.email.trim())) {
      errors.email = 'Please enter a valid email format (e.g. name@example.com).';
    }

    if (!formData.message.trim()) {
      errors.message = 'Please enter your message.';
    } else if (formData.message.trim().length < 5) {
      errors.message = 'Message must be at least 5 characters.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name as keyof ContactFormData]) {
      setFormErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitSuccess(null);
    setSubmitError(null);

    // Spam honeypot trap
    if (formData.honeypot) {
      setSubmitSuccess('Thank you! Your message has been sent successfully.');
      return;
    }

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          message: formData.message.trim(),
        }),
      });

      const data = await response.json().catch(() => null);

      if (response.ok && data?.success) {
        // Required exact success message
        setSubmitSuccess('Thank you! Your message has been sent successfully.');
        // Clear form only upon real successful submission
        setFormData({ name: '', email: '', message: '', honeypot: '' });
      } else {
        // Required exact error message
        setSubmitError('Something went wrong. Please try again later.');
      }
    } catch (err) {
      console.error('Contact submission error:', err);
      // Keep form input intact and display required error message
      setSubmitError('Something went wrong. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollToLeadForm = () => {
    const el = document.getElementById('lead-form');
    if (el) {
      const offset = 80;
      const top = el.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <section id="contact" className="py-20 md:py-28 bg-white relative overflow-hidden">
      {/* Background ambient accents */}
      <div className="absolute top-1/3 left-0 -z-10 w-96 h-96 bg-purple-100/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-0 -z-10 w-96 h-96 bg-blue-100/25 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 1. Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="heading-font text-3xl sm:text-4xl md:text-5xl font-extrabold text-purple-950 tracking-tight">
            Let's Connect
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600 font-medium">
            Have a project, idea, or simply want to{' '}
            <span className="highlight-yellow font-semibold text-purple-950">get in touch</span>
            ? I'd love to hear from you.
          </p>
        </div>

        {/* Desktop Two-Column Layout | Mobile Stacked in required sequence */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          
          {/* LEFT SIDE — Contact Information & CTA */}
          <div className="lg:col-span-5 space-y-8">
            
            {/* 2. Contact Information Cards */}
            <div className="space-y-4">
              <div className="text-xs uppercase font-bold tracking-wider text-slate-400 px-1">
                Reach Me Directly
              </div>

              {/* Email (Clickable, opens mail application) */}
              <a
                href="mailto:srishtidigital36@gmail.com"
                className="group p-5 rounded-2xl bg-white border-2 border-purple-100 hover:border-purple-300 shadow-xs hover:shadow-md transition-all flex items-center justify-between block"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-11 h-11 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">
                      Email
                    </div>
                    <div className="font-bold text-purple-950 text-sm sm:text-base truncate group-hover:text-purple-700 transition-colors">
                      srishtidigital36@gmail.com
                    </div>
                  </div>
                </div>
                <span className="text-xs text-purple-700 font-semibold shrink-0 ml-2">
                  Send Mail &rarr;
                </span>
              </a>

              {/* Instagram (Clickable, links to Instagram profile) */}
              <a
                href="https://www.instagram.com/Srishti.diaries_/"
                target="_blank"
                rel="noopener noreferrer"
                className="group p-5 rounded-2xl bg-white border-2 border-blue-100 hover:border-blue-300 shadow-xs hover:shadow-md transition-all flex items-center justify-between block"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-pink-100 via-purple-100 to-blue-100 text-purple-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Instagram className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">
                      Instagram
                    </div>
                    <div className="font-bold text-purple-950 text-sm sm:text-base group-hover:text-purple-700 transition-colors flex items-center gap-1.5">
                      <span>Srishti.diaries_</span>
                      <ExternalLink className="w-3.5 h-3.5 text-blue-600" />
                    </div>
                  </div>
                </div>
                <span className="text-xs text-blue-600 font-semibold shrink-0 ml-2">
                  Follow &rarr;
                </span>
              </a>

              {/* WhatsApp (Clickable WhatsApp button) */}
              <a
                href={`https://wa.me/?text=${encodeURIComponent(
                  "Hi Srishti! I saw your portfolio and would like to connect."
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group p-5 rounded-2xl bg-white border-2 border-emerald-100 hover:border-emerald-300 shadow-xs hover:shadow-md transition-all flex items-center justify-between block"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">
                      WhatsApp
                    </div>
                    <div className="font-bold text-purple-950 text-sm sm:text-base group-hover:text-emerald-700 transition-colors">
                      Direct Chat
                    </div>
                  </div>
                </div>
                <span className="text-xs text-emerald-700 font-semibold shrink-0 ml-2">
                  Chat &rarr;
                </span>
              </a>
            </div>

            {/* 3. Contact CTA: Let's Work Together */}
            <div className="p-7 rounded-3xl bg-gradient-to-br from-purple-50/70 via-white to-blue-50/60 border-2 border-purple-100/90 shadow-sm space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-yellow-500" />
                <span>Collaboration</span>
              </div>

              <h3 className="heading-font text-2xl font-bold text-purple-950">
                Let's Work Together
              </h3>

              <p className="text-slate-600 text-sm leading-relaxed">
                Whether you have a project idea, collaboration opportunity, or a question, feel free to send me a message.
              </p>

              <div>
                <button
                  type="button"
                  onClick={scrollToLeadForm}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-semibold text-sm shadow-xs hover:shadow-md transition-all active:scale-98 cursor-pointer"
                >
                  <span>Send Me a Message</span>
                  <ArrowDown className="w-4 h-4 text-yellow-300" />
                </button>
              </div>
            </div>

          </div>

          {/* RIGHT SIDE — 4. LEAD FORM */}
          <div id="lead-form" className="lg:col-span-7">
            <div className="bg-white rounded-3xl p-7 sm:p-9 border-2 border-purple-100/90 shadow-xl relative">
              
              {/* Form Title & Subtitle */}
              <div className="mb-6">
                <h3 className="heading-font text-2xl sm:text-3xl font-bold text-purple-950">
                  Send Me a Message
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm mt-1">
                  Fill out the form and I'll get back to you.
                </p>
              </div>

              {/* 7. Success Message Banner */}
              {submitSuccess && (
                <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-start gap-3 animate-in fade-in duration-300">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="text-sm font-semibold">
                    {submitSuccess}
                  </div>
                </div>
              )}

              {/* 8. Error Message Banner */}
              {submitError && (
                <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-900 flex items-start gap-3 animate-in fade-in duration-300">
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <div className="text-sm font-semibold">
                    {submitError}
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                
                {/* Honeypot Spam Protection (Hidden) */}
                <input
                  type="text"
                  name="honeypot"
                  value={formData.honeypot}
                  onChange={handleInputChange}
                  tabIndex={-1}
                  autoComplete="off"
                  className="hidden"
                />

                {/* Field 1: Full Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-xs sm:text-sm font-bold text-purple-950 mb-1.5"
                  >
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your name"
                    required
                    className={`w-full px-4 py-3 rounded-xl border text-sm text-slate-800 placeholder-slate-400 bg-slate-50/50 focus:bg-white focus:outline-hidden transition-all ${
                      formErrors.name
                        ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100'
                        : 'border-slate-200 focus:border-purple-600 focus:ring-2 focus:ring-purple-100'
                    }`}
                  />
                  {formErrors.name && (
                    <p className="mt-1.5 text-xs text-red-600 font-medium flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{formErrors.name}</span>
                    </p>
                  )}
                </div>

                {/* Field 2: Email Address */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-xs sm:text-sm font-bold text-purple-950 mb-1.5"
                  >
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email address"
                    required
                    className={`w-full px-4 py-3 rounded-xl border text-sm text-slate-800 placeholder-slate-400 bg-slate-50/50 focus:bg-white focus:outline-hidden transition-all ${
                      formErrors.email
                        ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100'
                        : 'border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-100'
                    }`}
                  />
                  {formErrors.email && (
                    <p className="mt-1.5 text-xs text-red-600 font-medium flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{formErrors.email}</span>
                    </p>
                  )}
                </div>

                {/* Field 3: Message */}
                <div>
                  <label
                    htmlFor="message"
                    className="block text-xs sm:text-sm font-bold text-purple-950 mb-1.5"
                  >
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Write your message here..."
                    required
                    className={`w-full px-4 py-3 rounded-xl border text-sm text-slate-800 placeholder-slate-400 bg-slate-50/50 focus:bg-white focus:outline-hidden transition-all resize-y min-h-[120px] ${
                      formErrors.message
                        ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100'
                        : 'border-slate-200 focus:border-purple-600 focus:ring-2 focus:ring-purple-100'
                    }`}
                  />
                  {formErrors.message && (
                    <p className="mt-1.5 text-xs text-red-600 font-medium flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{formErrors.message}</span>
                    </p>
                  )}
                </div>

                {/* 5. SUBMIT BUTTON */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 px-6 rounded-xl bg-purple-700 hover:bg-purple-800 disabled:bg-purple-400 text-white font-semibold text-base shadow-sm hover:shadow-md transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <span>Send Message</span>
                        <Send className="w-4 h-4 text-yellow-300" />
                      </>
                    )}
                  </button>
                </div>

                {/* Secure Note */}
                <div className="text-center pt-1">
                  <p className="text-[11px] text-slate-400">
                    🔒 Messages are securely forwarded to <span className="font-semibold text-purple-900">srishtidigital36@gmail.com</span>
                  </p>
                </div>

              </form>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
