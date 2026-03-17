import React from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { theme } from '../styles/theme';
import { typography } from '../styles/typography';
import SEO from '../components/common/SEO';

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div style={{ marginBottom: '36px' }}>
    <h2 style={{ fontSize: '18px', fontWeight: 700, fontFamily: typography.fontFamily.serif, color: theme.text.primary, marginBottom: '12px' }}>
      {title}
    </h2>
    <div style={{ fontSize: '15px', color: theme.text.secondary, lineHeight: 1.75 }}>{children}</div>
  </div>
);

export const PrivacyPage: React.FC = () => {

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #FFF5F7 0%, #FAF7F5 50%, #F3EEF7 100%)', display: 'flex', flexDirection: 'column' }}>
      <SEO
        title="Privacy Policy"
        description="Learn how Horizons collects, uses, and protects your personal information. Your memories are private by design."
        canonical="/privacy"
      />
      <Navbar />
      <div style={{ flex: 1 }}>
        <div style={{ maxWidth: '760px', margin: '0 auto', padding: '48px 24px 64px' }}>
          {/* Header */}
          <div style={{ marginBottom: '40px' }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: theme.colors.rose[400], letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '10px' }}>
              Legal
            </div>
            <h1 style={{ fontSize: '36px', fontWeight: 700, fontFamily: typography.fontFamily.serif, color: theme.text.primary, margin: '0 0 12px' }}>
              Privacy Policy
            </h1>
            <p style={{ fontSize: '14px', color: theme.text.tertiary }}>Last updated: February 2026</p>
          </div>

          <div style={{ background: '#FFFFFF', borderRadius: '20px', padding: '40px', border: `1.5px solid rgba(232, 180, 184, 0.3)`, boxShadow: '0 4px 20px rgba(212, 144, 154, 0.08)' }}>
            <Section title="1. Introduction">
              <p>Welcome to Horizons ("we," "our," or "us"). We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.</p>
            </Section>

            <Section title="2. Information We Collect">
              <p><strong>Account Information:</strong> When you register, we collect your name, email address, and password (stored as a secure hash).</p>
              <p style={{ marginTop: '10px' }}><strong>Garden & Flower Data:</strong> We store the gardens you create, flowers you plant, messages, photos, and other content you add to your gardens.</p>
              <p style={{ marginTop: '10px' }}><strong>Usage Data:</strong> We may collect information about how you interact with our platform, including pages visited, features used, and time spent.</p>
              <p style={{ marginTop: '10px' }}><strong>Payment Information:</strong> Subscription payments are processed by Stripe. We do not store your full card number or payment credentials — Stripe handles all payment data securely.</p>
            </Section>

            <Section title="3. How We Use Your Information">
              <p>We use the information we collect to:</p>
              <ul style={{ paddingLeft: '20px', marginTop: '8px' }}>
                <li style={{ marginBottom: '6px' }}>Provide, operate, and maintain the Horizons platform</li>
                <li style={{ marginBottom: '6px' }}>Send transactional emails (bloom notifications, invitations, account updates)</li>
                <li style={{ marginBottom: '6px' }}>Process payments and manage subscriptions</li>
                <li style={{ marginBottom: '6px' }}>Improve and personalize your experience</li>
                <li style={{ marginBottom: '6px' }}>Respond to customer service requests</li>
                <li style={{ marginBottom: '6px' }}>Detect and prevent fraud or abuse</li>
              </ul>
            </Section>

            <Section title="4. Sharing Your Information">
              <p>We do not sell your personal information. We may share your information with:</p>
              <ul style={{ paddingLeft: '20px', marginTop: '8px' }}>
                <li style={{ marginBottom: '6px' }}><strong>Garden members</strong> you explicitly invite to your gardens</li>
                <li style={{ marginBottom: '6px' }}><strong>Service providers</strong> who assist us in operating the platform (e.g., Stripe for payments, Resend for email)</li>
                <li style={{ marginBottom: '6px' }}><strong>Legal authorities</strong> if required by law or to protect our rights</li>
              </ul>
            </Section>

            <Section title="5. Cookies & Tracking">
              <p>We use minimal cookies and local storage to keep you logged in and remember your preferences. We do not use tracking cookies for advertising purposes. You can clear your browser's local storage at any time to remove stored session data.</p>
            </Section>

            <Section title="6. Data Retention">
              <p>We retain your data for as long as your account is active. If you delete your account, we will remove your personal information within 30 days, except where retention is required by law.</p>
            </Section>

            <Section title="7. Your Rights">
              <p>Depending on your location, you may have the right to:</p>
              <ul style={{ paddingLeft: '20px', marginTop: '8px' }}>
                <li style={{ marginBottom: '6px' }}>Access the personal data we hold about you</li>
                <li style={{ marginBottom: '6px' }}>Request correction of inaccurate data</li>
                <li style={{ marginBottom: '6px' }}>Request deletion of your account and data</li>
                <li style={{ marginBottom: '6px' }}>Opt out of marketing emails at any time</li>
              </ul>
              <p style={{ marginTop: '10px' }}>To exercise any of these rights, please contact us at the address below.</p>
            </Section>

            <Section title="8. Security">
              <p>We implement industry-standard security measures including HTTPS encryption, hashed passwords, and access controls. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.</p>
            </Section>

            <Section title="9. Children's Privacy">
              <p>Horizons is not intended for children under the age of 13. We do not knowingly collect personal information from children. If you believe a child has provided us with personal data, please contact us immediately.</p>
            </Section>

            <Section title="10. Changes to This Policy">
              <p>We may update this Privacy Policy from time to time. We will notify you of significant changes by email or by a notice on our platform. Your continued use of Horizons after changes are posted constitutes your acceptance of the revised policy.</p>
            </Section>

            <Section title="11. Contact Us">
              <p>If you have any questions or concerns about this Privacy Policy, please contact us at <strong>support@horizons-garden.com</strong> or use our <span style={{ color: '#D4909A', cursor: 'pointer' }} onClick={() => window.location.href = '/contact'}>Contact page</span>.</p>
            </Section>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};
