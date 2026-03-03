import React from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div style={{ marginBottom: '36px' }}>
    <h2 style={{ fontSize: '18px', fontWeight: 700, fontFamily: 'Georgia, serif', color: '#3D3340', marginBottom: '12px' }}>
      {title}
    </h2>
    <div style={{ fontSize: '15px', color: '#5A5060', lineHeight: 1.75 }}>{children}</div>
  </div>
);

export const TermsPage: React.FC = () => {
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #FFF5F7 0%, #FAF7F5 50%, #F3EEF7 100%)', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <div style={{ flex: 1 }}>
        <div style={{ maxWidth: '760px', margin: '0 auto', padding: '48px 24px 64px' }}>
          {/* Header */}
          <div style={{ marginBottom: '40px' }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#D4909A', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '10px' }}>
              Legal
            </div>
            <h1 style={{ fontSize: '36px', fontWeight: 700, fontFamily: 'Georgia, serif', color: '#3D3340', margin: '0 0 12px' }}>
              Terms of Service
            </h1>
            <p style={{ fontSize: '14px', color: '#9D8F99' }}>Last updated: February 2026</p>
          </div>

          <div style={{ background: '#FFFFFF', borderRadius: '20px', padding: '40px', border: '1.5px solid rgba(232, 180, 184, 0.3)', boxShadow: '0 4px 20px rgba(212, 144, 154, 0.08)' }}>
            <Section title="1. Acceptance of Terms">
              <p>By creating an account or using the Horizons platform ("Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Service.</p>
            </Section>

            <Section title="2. Description of Service">
              <p>Horizons is a digital platform that allows users to create virtual gardens, plant digital flowers, and share meaningful moments with others. The Service includes garden creation, flower planting, member collaboration, and time-based bloom features.</p>
            </Section>

            <Section title="3. Account Registration">
              <p>To use most features of Horizons, you must create an account. You agree to:</p>
              <ul style={{ paddingLeft: '20px', marginTop: '8px' }}>
                <li style={{ marginBottom: '6px' }}>Provide accurate, current, and complete information during registration</li>
                <li style={{ marginBottom: '6px' }}>Maintain the security of your password and accept responsibility for all activity under your account</li>
                <li style={{ marginBottom: '6px' }}>Notify us immediately of any unauthorised use of your account</li>
                <li style={{ marginBottom: '6px' }}>Not share your account credentials with any third party</li>
              </ul>
            </Section>

            <Section title="4. Acceptable Use">
              <p>You agree not to use Horizons to:</p>
              <ul style={{ paddingLeft: '20px', marginTop: '8px' }}>
                <li style={{ marginBottom: '6px' }}>Upload or share content that is illegal, harmful, threatening, abusive, or defamatory</li>
                <li style={{ marginBottom: '6px' }}>Harass, bully, or intimidate other users</li>
                <li style={{ marginBottom: '6px' }}>Post spam, unsolicited messages, or commercial solicitations</li>
                <li style={{ marginBottom: '6px' }}>Attempt to gain unauthorised access to any part of the Service</li>
                <li style={{ marginBottom: '6px' }}>Reverse engineer, decompile, or disassemble any part of the Service</li>
                <li style={{ marginBottom: '6px' }}>Use automated tools to scrape, crawl, or harvest data from the Service</li>
              </ul>
            </Section>

            <Section title="5. Content Ownership">
              <p>You retain ownership of all content you create on Horizons, including messages, images, and garden designs. By using the Service, you grant Horizons a limited, non-exclusive, royalty-free license to store and display your content solely for the purpose of providing the Service.</p>
              <p style={{ marginTop: '10px' }}>You are solely responsible for the content you submit and must ensure you have the rights to share any images or media uploaded to the platform.</p>
            </Section>

            <Section title="6. Subscriptions & Payments">
              <p>Horizons offers free and paid subscription tiers. Paid subscriptions are billed on a recurring basis (monthly or annually) via Stripe. By subscribing, you authorise us to charge the payment method on file for the applicable subscription fee.</p>
              <p style={{ marginTop: '10px' }}>You may cancel your subscription at any time. Cancellation takes effect at the end of the current billing period. We do not provide refunds for partial billing periods except where required by law.</p>
            </Section>

            <Section title="7. Termination">
              <p>We reserve the right to suspend or terminate your account at our sole discretion if you violate these Terms of Service. You may delete your account at any time through the account settings. Upon termination, your access to the Service will cease and your data will be removed in accordance with our Privacy Policy.</p>
            </Section>

            <Section title="8. Disclaimer of Warranties">
              <p>The Service is provided "as is" and "as available" without any warranties of any kind, express or implied. We do not warrant that the Service will be uninterrupted, error-free, or free of viruses or other harmful components. Your use of the Service is at your sole risk.</p>
            </Section>

            <Section title="9. Limitation of Liability">
              <p>To the fullest extent permitted by law, Horizons shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Service. Our total liability to you for any claim arising from these terms shall not exceed the amount you paid us in the 12 months preceding the claim.</p>
            </Section>

            <Section title="10. Changes to Terms">
              <p>We may modify these Terms of Service at any time. We will notify you of material changes via email or a prominent notice on the platform. Your continued use of the Service after changes take effect constitutes acceptance of the updated terms.</p>
            </Section>

            <Section title="11. Governing Law">
              <p>These Terms of Service are governed by and construed in accordance with applicable laws. Any disputes arising from these terms shall be resolved in the courts of the jurisdiction in which Horizons operates.</p>
            </Section>

            <Section title="12. Contact Us">
              <p>If you have questions about these Terms of Service, please contact us at <strong>horizons.memory.garden@gmail.com</strong> or via our <span style={{ color: '#D4909A', cursor: 'pointer' }} onClick={() => window.location.href = '/contact'}>Contact page</span>.</p>
            </Section>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};
