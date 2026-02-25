import React, { useState } from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import api from '../services/api';
import CheckCircle from '@mui/icons-material/CheckCircle';
import EmailOutlined from '@mui/icons-material/EmailOutlined';

export const ContactPage: React.FC = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setError('Please fill in all required fields.');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await api.post('/contact', form);
      setSuccess(true);
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch {
      setError('Something went wrong. Please try again or email us directly.');
    } finally {
      setSubmitting(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '11px 14px',
    borderRadius: '10px',
    border: '1.5px solid rgba(232, 180, 184, 0.5)',
    fontSize: '15px',
    color: '#3D3340',
    background: '#FFFFFF',
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
    transition: 'border-color 0.2s',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '12px',
    fontWeight: 700,
    color: '#9D8F99',
    letterSpacing: '0.06em',
    marginBottom: '6px',
    textTransform: 'uppercase',
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #FFF5F7 0%, #FAF7F5 50%, #F3EEF7 100%)', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <div style={{ flex: 1 }}>
        <div style={{ maxWidth: '760px', margin: '0 auto', padding: '48px 24px 64px' }}>
          {/* Header */}
          <div style={{ marginBottom: '40px' }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#D4909A', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '10px' }}>
              Get in Touch
            </div>
            <h1 style={{ fontSize: '36px', fontWeight: 700, fontFamily: 'Georgia, serif', color: '#3D3340', margin: '0 0 12px' }}>
              Contact Us
            </h1>
            <p style={{ fontSize: '15px', color: '#7A6E78', lineHeight: 1.6 }}>
              Have a question, feedback, or need support? We'd love to hear from you. Fill in the form below and we'll get back to you as soon as possible.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '24px', alignItems: 'start' }}>
            {/* Form card */}
            <div style={{ background: '#FFFFFF', borderRadius: '20px', padding: '36px', border: '1.5px solid rgba(232, 180, 184, 0.3)', boxShadow: '0 4px 20px rgba(212, 144, 154, 0.08)' }}>
              {success ? (
                <div style={{ textAlign: 'center', padding: '32px 0' }}>
                  <CheckCircle sx={{ fontSize: 52, color: '#6B8E6B' }} />
                  <h2 style={{ fontFamily: 'Georgia, serif', color: '#3D3340', marginTop: '16px', marginBottom: '8px' }}>Message Sent!</h2>
                  <p style={{ color: '#7A6E78', fontSize: '15px', lineHeight: 1.6 }}>
                    Thanks for reaching out. We'll get back to you within 1–2 business days.
                  </p>
                  <button
                    onClick={() => setSuccess(false)}
                    style={{ marginTop: '24px', padding: '10px 24px', borderRadius: '10px', border: '1.5px solid rgba(232, 180, 184, 0.5)', background: 'transparent', color: '#D4909A', cursor: 'pointer', fontSize: '14px', fontWeight: 600 }}
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                    <div>
                      <label style={labelStyle}>Name *</label>
                      <input style={inputStyle} name="name" value={form.name} onChange={handleChange} placeholder="Your name" required />
                    </div>
                    <div>
                      <label style={labelStyle}>Email *</label>
                      <input style={inputStyle} name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com" required />
                    </div>
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <label style={labelStyle}>Subject</label>
                    <select style={{ ...inputStyle, appearance: 'auto', cursor: 'pointer' }} name="subject" value={form.subject} onChange={handleChange}>
                      <option value="">Select a topic…</option>
                      <option value="General Question">General Question</option>
                      <option value="Technical Support">Technical Support</option>
                      <option value="Billing & Subscriptions">Billing &amp; Subscriptions</option>
                      <option value="Feature Request">Feature Request</option>
                      <option value="Bug Report">Bug Report</option>
                      <option value="Privacy & Data">Privacy &amp; Data</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div style={{ marginBottom: '24px' }}>
                    <label style={labelStyle}>Message *</label>
                    <textarea
                      style={{ ...inputStyle, minHeight: '140px', resize: 'vertical' }}
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Tell us how we can help…"
                      required
                    />
                  </div>

                  {error && (
                    <p style={{ color: '#D4909A', fontSize: '13px', marginBottom: '16px' }}>{error}</p>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    style={{
                      width: '100%', padding: '13px', borderRadius: '12px', border: 'none',
                      background: submitting ? 'rgba(212,144,154,0.5)' : 'linear-gradient(135deg, #E8B4B8 0%, #D4909A 100%)',
                      color: '#FFFFFF', fontWeight: 600, fontSize: '15px', fontFamily: 'Georgia, serif',
                      cursor: submitting ? 'default' : 'pointer',
                      boxShadow: submitting ? 'none' : '0 4px 16px rgba(212, 144, 154, 0.35)',
                    }}
                  >
                    {submitting ? 'Sending…' : 'Send Message'}
                  </button>
                </form>
              )}
            </div>

            {/* Info card */}
            <div style={{ background: 'linear-gradient(135deg, #FFF0F2 0%, #FAE8EC 100%)', borderRadius: '20px', padding: '28px', border: '1.5px solid rgba(232, 180, 184, 0.3)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <EmailOutlined sx={{ fontSize: 22, color: '#D4909A' }} />
                <span style={{ fontWeight: 700, fontFamily: 'Georgia, serif', color: '#3D3340', fontSize: '15px' }}>Email</span>
              </div>
              <p style={{ fontSize: '14px', color: '#7A6E78', lineHeight: 1.6, marginBottom: '20px' }}>
                hello@horizons.app
              </p>

              <div style={{ height: '1px', background: 'rgba(232, 180, 184, 0.3)', marginBottom: '20px' }} />

              <div style={{ fontSize: '13px', color: '#9D8F99', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '8px' }}>
                Response Time
              </div>
              <p style={{ fontSize: '14px', color: '#7A6E78', lineHeight: 1.6 }}>
                We typically respond within 1–2 business days.
              </p>

              <div style={{ height: '1px', background: 'rgba(232, 180, 184, 0.3)', margin: '20px 0' }} />

              <div style={{ fontSize: '13px', color: '#9D8F99', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '8px' }}>
                Quick Links
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
                  { label: 'Privacy Policy', path: '/privacy' },
                  { label: 'Terms of Service', path: '/terms' },
                  { label: 'Pricing', path: '/pricing' },
                ].map(({ label, path }) => (
                  <a
                    key={path}
                    href={path}
                    style={{ fontSize: '14px', color: '#D4909A', textDecoration: 'none', fontWeight: 500 }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.textDecoration = 'underline'; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.textDecoration = 'none'; }}
                  >
                    {label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};
