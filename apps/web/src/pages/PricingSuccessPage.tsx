import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { Navbar } from '../components/layout/Navbar';

export const PricingSuccessPage: React.FC = () => {
  const navigate = useNavigate();
  const { loadUser, isAuthenticated } = useAuthStore();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (!isAuthenticated) {
      // If session was lost during Stripe redirect, send to login
      navigate('/auth/login');
      return;
    }

    // Refresh user data so tier updates from Stripe webhook
    loadUser();

    const timer = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) { clearInterval(timer); navigate('/my-gardens'); return 0; }
        return c - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [loadUser, navigate, isAuthenticated]);

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #FFF5F7 0%, #FAF7F5 100%)' }}>
      <Navbar />
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 80px)',
        padding: '40px 24px',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: '72px', marginBottom: '24px' }}>{'\uD83C\uDF38'}</div>
        <h1 style={{
          fontSize: '36px',
          fontWeight: 700,
          fontFamily: 'Georgia, serif',
          color: '#3D3340',
          margin: '0 0 16px',
        }}>
          Welcome to Pro!
        </h1>
        <p style={{
          fontSize: '18px',
          color: '#6B5F68',
          maxWidth: '480px',
          lineHeight: 1.6,
          margin: '0 0 32px',
        }}>
          Your subscription is active. You now have access to all Pro flower types and features.
        </p>
        <div style={{
          background: '#FFFFFF',
          border: '1px solid rgba(232, 180, 184, 0.3)',
          borderRadius: '16px',
          padding: '24px 40px',
          boxShadow: '0 4px 16px rgba(212, 144, 154, 0.1)',
          marginBottom: '32px',
        }}>
          <p style={{ margin: 0, fontSize: '14px', color: '#9D8F99', fontFamily: 'Georgia, serif' }}>
            Redirecting to your gardens in{' '}
            <strong style={{ color: '#D4909A' }}>{countdown}</strong> seconds...
          </p>
        </div>
        <button
          onClick={() => navigate('/my-gardens')}
          style={{
            background: 'linear-gradient(135deg, #D4909A 0%, #B87580 100%)',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '12px',
            padding: '14px 32px',
            fontSize: '15px',
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: 'Georgia, serif',
            boxShadow: '0 4px 16px rgba(212, 144, 154, 0.35)',
          }}
        >
          Go to My Gardens &rarr;
        </button>
      </div>
    </div>
  );
};
