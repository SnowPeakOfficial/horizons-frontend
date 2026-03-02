import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { ConfirmationDialog } from '../components/common/ConfirmationDialog';
import subscriptionService from '../services/subscriptionService';
import { theme } from '../styles/theme';

export const PricingPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, loadUser } = useAuthStore();
  const [billingInterval, setBillingInterval] = useState<'monthly' | 'yearly'>('monthly');
  const [loadingTier, setLoadingTier] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [cancelSuccess, setCancelSuccess] = useState<string | null>(null);
  const [renewSuccess, setRenewSuccess] = useState<string | null>(null);
  const [renewLoading, setRenewLoading] = useState(false);
  const [subscription, setSubscription] = useState<{ cancelAtPeriodEnd: boolean; currentPeriodEnd: string | null } | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);

  // Fetch fresh user data and subscription status on mount
  useEffect(() => {
    if (isAuthenticated) {
      loadUser();
      subscriptionService.getCurrentSubscription().then((sub) => {
        setSubscription({ cancelAtPeriodEnd: sub.cancelAtPeriodEnd, currentPeriodEnd: sub.currentPeriodEnd ?? null });
      }).catch(() => {});
    }
  }, [isAuthenticated, loadUser]);

  const currentTier = user?.tier || 'FREE';

  const handleReactivate = async () => {
    setRenewLoading(true);
    setError(null);
    try {
      await subscriptionService.reactivateSubscription();
      setRenewSuccess('Your subscription has been renewed!');
      setCancelSuccess(null);
      setSubscription((prev) => prev ? { ...prev, cancelAtPeriodEnd: false } : null);
      await loadUser();
    } catch (err: unknown) {
      const msg =
        err && typeof err === 'object' && 'message' in err
          ? String((err as { message: string }).message)
          : 'Failed to renew subscription. Please try again.';
      setError(msg);
    } finally {
      setRenewLoading(false);
    }
  };

  const confirmCancelSubscription = async () => {
    setShowCancelModal(false);
    setCancelLoading(true);
    setError(null);
    try {
      const result = await subscriptionService.cancelSubscription();
      const endDate = result.cancelAt ? new Date(result.cancelAt).toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' }) : null;
      setCancelSuccess(endDate ? `Subscription cancelled. You have access until ${endDate}.` : 'Subscription cancelled successfully.');
      setSubscription((prev) => prev ? { ...prev, cancelAtPeriodEnd: true } : null);
      await loadUser();
    } catch (err: unknown) {
      const msg =
        err && typeof err === 'object' && 'message' in err
          ? String((err as { message: string }).message)
          : 'Failed to cancel subscription. Please try again.';
      setError(msg);
    } finally {
      setCancelLoading(false);
    }
  };

  const handleUpgrade = async (tier: 'PRO' | 'PREMIUM') => {
    if (!isAuthenticated) { navigate('/auth/login'); return; }
    if (tier === 'PREMIUM') return;
    setLoadingTier(tier);
    setError(null);
    try {
      await subscriptionService.redirectToCheckout(tier, billingInterval);
    } catch (err: unknown) {
      const msg =
        err && typeof err === 'object' && 'message' in err
          ? String((err as { message: string }).message)
          : 'Something went wrong. Please try again.';
      setError(msg);
      setLoadingTier(null);
    }
  };

  const tiers = [
    {
      key: 'FREE',
      name: 'Free',
      emoji: '\uD83C\uDF31',
      price: '$0',
      period: 'forever',
      annualNote: null,
      tagline: 'Start your garden journey',
      color: theme.colors.rose[600],
      borderColor: theme.colors.rose[200],
      bgGradient: 'linear-gradient(135deg, #FFFFFF 0%, #FFF5F7 100%)',
      featured: false,
      comingSoon: false,
      features: [
        '3 flower types',
        '1 garden',
        'Basic garden themes',
        'Share garden with friends',
        'Secret blooming messages',
        'Voice and video messages',
      ],
    },
    {
      key: 'PRO',
      name: 'Pro',
      emoji: '\uD83C\uDF38',
      price: billingInterval === 'yearly' ? '$49.99' : '$5.99',
      period: billingInterval === 'yearly' ? 'CAD / year' : 'CAD / month',
      annualNote: billingInterval === 'yearly' ? 'That\'s $4.17/mo — save $21.89' : null,
      tagline: 'For deeper connections',
      color: '#D4909A',
      borderColor: '#FFB0C8',
      bgGradient: 'linear-gradient(135deg, #FFF5F7 0%, #FFE0E8 100%)',
      featured: true,
      comingSoon: false,
      features: [
        'Everything in Free',
        '5 exclusive flower types',
        'Unlimited gardens',
        'Multiple letter templates',
        'Priority support',
      ],
    },
    {
      key: 'PREMIUM',
      name: 'Premium',
      emoji: '\uD83D\uDC9C',
      price: 'Coming Soon',
      period: '',
      annualNote: null,
      tagline: 'The full experience',
      color: '#9E7DAE',
      borderColor: '#D6C3E3',
      bgGradient: 'linear-gradient(135deg, #FAF8FC 0%, #F3EEF7 100%)',
      featured: false,
      comingSoon: true,
      features: [
        'Everything in Pro',
        '3 premium flower types',
        'Seasonal garden themes',
        'Advanced animations',
        'Early access to new flowers',
      ],
    },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #FFF5F7 0%, #FAF7F5 50%, #F3EEF7 100%)' }}>
      <Navbar />

      {/* Hero */}
      <div style={{ textAlign: 'center', padding: '64px 24px 48px' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>{'\uD83C\uDF38'}</div>
        <h1 style={{ fontSize: '42px', fontWeight: 700, fontFamily: 'Georgia, serif', color: '#3D3340', margin: '0 0 16px' }}>
          Simple, Honest Pricing
        </h1>
        <p style={{ fontSize: '18px', color: '#6B5F68', maxWidth: '560px', margin: '0 auto', lineHeight: 1.6 }}>
          Plant meaningful flowers, share real moments. Start free and upgrade when you&apos;re ready.
        </p>

        {/* Billing interval toggle */}
        <div style={{ display: 'inline-flex', alignItems: 'center', marginTop: '32px', background: 'rgba(255,255,255,0.7)', borderRadius: '999px', padding: '4px', border: '1.5px solid rgba(232,180,184,0.4)', boxShadow: '0 2px 12px rgba(212,144,154,0.1)' }}>
          <button
            onClick={() => setBillingInterval('monthly')}
            style={{
              padding: '8px 24px',
              borderRadius: '999px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '14px',
              fontFamily: 'Georgia, serif',
              transition: 'all 0.2s ease',
              background: billingInterval === 'monthly' ? 'linear-gradient(135deg, #D4909A 0%, #B87580 100%)' : 'transparent',
              color: billingInterval === 'monthly' ? '#FFFFFF' : '#9D8F99',
              boxShadow: billingInterval === 'monthly' ? '0 2px 8px rgba(212,144,154,0.3)' : 'none',
            }}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingInterval('yearly')}
            style={{
              padding: '8px 24px',
              borderRadius: '999px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '14px',
              fontFamily: 'Georgia, serif',
              transition: 'all 0.2s ease',
              background: billingInterval === 'yearly' ? 'linear-gradient(135deg, #D4909A 0%, #B87580 100%)' : 'transparent',
              color: billingInterval === 'yearly' ? '#FFFFFF' : '#9D8F99',
              boxShadow: billingInterval === 'yearly' ? '0 2px 8px rgba(212,144,154,0.3)' : 'none',
            }}
          >
            Yearly
          </button>
        </div>
      </div>

      {/* Error banner */}
      {error && (
        <div style={{ textAlign: 'center', color: '#D4909A', marginBottom: '24px', fontSize: '14px' }}>
          {error}
        </div>
      )}

      {/* Cards */}
      <div style={{
        display: 'flex',
        gap: '24px',
        justifyContent: 'center',
        alignItems: 'stretch',
        padding: '0 24px 80px',
        maxWidth: '1100px',
        margin: '0 auto',
        flexWrap: 'wrap',
      }}>
        {tiers.map((tier) => {
          const isCurrent = currentTier === tier.key;
          // FREE card is also non-interactive for higher-tier users (it's already included)
          const isFreeIncluded = tier.key === 'FREE' && isAuthenticated && currentTier !== 'FREE';
          const isDisabled = tier.comingSoon || isCurrent || isFreeIncluded;

          const btnLabel = tier.comingSoon
            ? 'Coming Soon'
            : isCurrent
            ? 'Current Plan'
            : loadingTier === tier.key
            ? 'Redirecting...'
            : tier.key === 'FREE'
            ? isAuthenticated
              ? currentTier !== 'FREE'
                ? 'Included \u2713'
                : 'Your Plan'
              : 'Get Started Free'
            : `Upgrade to ${tier.name}`;

          return (
            <div
              key={tier.key}
              style={{
                background: tier.bgGradient,
                border: tier.featured
                  ? `2px solid ${tier.borderColor}`
                  : tier.comingSoon
                  ? '1.5px solid rgba(198, 170, 225, 0.55)'
                  : '1.5px solid rgba(232, 180, 184, 0.5)',
                borderRadius: '24px',
                padding: '36px 32px',
                flex: 1,
                minHeight: '540px',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                boxShadow: tier.featured
                  ? '0 8px 32px rgba(212, 144, 154, 0.18)'
                  : tier.comingSoon
                  ? '0 4px 20px rgba(158, 125, 174, 0.14)'
                  : '0 4px 20px rgba(212, 144, 154, 0.12)',
                opacity: tier.comingSoon ? 0.65 : 1,
              }}
            >
              {/* Featured badge */}
              {tier.featured && (
                <div style={{
                  position: 'absolute',
                  top: '-14px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'linear-gradient(135deg, #D4909A 0%, #B87580 100%)',
                  color: '#FFFFFF',
                  padding: '4px 20px',
                  borderRadius: '999px',
                  fontSize: '12px',
                  fontWeight: 700,
                  letterSpacing: '0.05em',
                  whiteSpace: 'nowrap',
                }}>
                  MOST POPULAR
                </div>
              )}

              {/* Coming soon badge */}
              {tier.comingSoon && (
                <div style={{
                  position: 'absolute',
                  top: '-14px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'linear-gradient(135deg, #C5A9D0 0%, #9E7DAE 100%)',
                  color: '#FFFFFF',
                  padding: '4px 20px',
                  borderRadius: '999px',
                  fontSize: '12px',
                  fontWeight: 700,
                  letterSpacing: '0.05em',
                  whiteSpace: 'nowrap',
                }}>
                  COMING SOON
                </div>
              )}

              {/* Header */}
              <div style={{ marginBottom: '24px', textAlign: 'center' }}>
                <h2 style={{ fontSize: '24px', fontWeight: 700, fontFamily: 'Georgia, serif', color: '#3D3340', margin: '0 0 4px' }}>
                  {tier.name}
                </h2>
                <p style={{ fontSize: '13px', color: '#9D8F99', margin: 0 }}>{tier.tagline}</p>
              </div>

              {/* Price — fixed height so features start at the same line across all cards */}
              <div style={{ marginBottom: '28px', paddingBottom: '28px', borderBottom: '1px solid rgba(232, 180, 184, 0.2)', height: '90px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: '4px' }}>
                  <span style={{
                    fontSize: '38px',
                    fontWeight: 800,
                    color: tier.color,
                    fontFamily: 'Georgia, serif',
                  }}>
                    {tier.price}
                  </span>
                  {tier.period && (
                    <span style={{ fontSize: '13px', color: '#9D8F99', marginLeft: '4px' }}>{tier.period}</span>
                  )}
                </div>
                {tier.annualNote && (
                  <p style={{ fontSize: '12px', color: '#B87580', margin: '4px 0 0', textAlign: 'center', fontStyle: 'italic' }}>
                    {tier.annualNote}
                  </p>
                )}
              </div>

              {/* Features */}
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px', flex: 1 }}>
                {tier.features.map((f, i) => (
                  <li key={i} style={{
                    fontSize: '14px',
                    color: '#3D3340',
                    marginBottom: '10px',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '8px',
                  }}>
                    <span style={{ color: tier.color, flexShrink: 0, fontWeight: 600 }}>+</span>
                    {f}
                  </li>
                ))}
              </ul>

              {/* CTA Button — pushed to bottom, aligned across all cards */}
              <div style={{ marginTop: 'auto' }}>
                <button
                  disabled={isDisabled || loadingTier === tier.key}
                  onClick={() => {
                    if (tier.key === 'FREE' && !isAuthenticated) { navigate('/auth/register'); return; }
                    if (tier.key === 'PRO') handleUpgrade('PRO');
                  }}
                  style={{
                    width: '100%',
                    padding: '14px 28px',
                    borderRadius: '12px',
                    cursor: isDisabled ? 'default' : 'pointer',
                    fontWeight: 600,
                    fontSize: '15px',
                    fontFamily: 'Georgia, serif',
                    background: isCurrent || isFreeIncluded
                      ? '#FFF0F2'
                      : tier.comingSoon
                      ? '#F3EEF8'
                      : tier.featured
                      ? 'linear-gradient(135deg, #D4909A 0%, #B87580 100%)'
                      : 'linear-gradient(135deg, #E8B4B8 0%, #D4909A 100%)',
                    border: isCurrent || isFreeIncluded
                      ? '1.5px solid #E8B4B8'
                      : tier.comingSoon
                      ? '1.5px solid #C5A9D0'
                      : 'none',
                    color: isCurrent || isFreeIncluded
                      ? '#C07080'
                      : tier.comingSoon
                      ? '#8B6BA0'
                      : '#FFFFFF',
                    boxShadow: (!isDisabled && tier.featured)
                      ? '0 4px 16px rgba(212, 144, 154, 0.35)'
                      : 'none',
                  }}
                >
                  {btnLabel}
                </button>
              </div>

              {/* Cancel / renew slot — fixed height on ALL cards to keep buttons aligned */}
              <div style={{ marginTop: '12px', textAlign: 'center', minHeight: '56px' }}>
                {isCurrent && tier.key === 'PRO' && (
                  <div>
                    {renewSuccess ? (
                      <p style={{ fontSize: '12px', color: '#6B8E6B', margin: 0 }}>{renewSuccess}</p>
                    ) : cancelSuccess ? (
                      <div>
                        <p style={{ fontSize: '12px', color: '#6B8E6B', margin: '0 0 4px' }}>{cancelSuccess}</p>
                        <span
                          style={{
                            fontSize: '12px',
                            color: renewLoading ? '#A8C5A8' : '#6B8E6B',
                            cursor: renewLoading ? 'default' : 'pointer',
                            textDecoration: 'underline',
                          }}
                          onClick={renewLoading ? undefined : handleReactivate}
                        >
                          {renewLoading ? 'Renewing...' : 'Resubscribe'}
                        </span>
                      </div>
                    ) : subscription?.cancelAtPeriodEnd ? (
                      <div>
                        <p style={{ fontSize: '12px', color: '#9D8F99', margin: '0 0 2px' }}>
                          {subscription.currentPeriodEnd
                            ? `Cancels on ${new Date(subscription.currentPeriodEnd).toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' })}`
                            : 'Cancels at end of billing period'}
                        </p>
                        <span
                          style={{
                            fontSize: '12px',
                            color: renewLoading ? '#A8C5A8' : '#6B8E6B',
                            cursor: renewLoading ? 'default' : 'pointer',
                            textDecoration: 'underline',
                          }}
                          onClick={renewLoading ? undefined : handleReactivate}
                        >
                          {renewLoading ? 'Renewing...' : 'Renew subscription'}
                        </span>
                      </div>
                    ) : (
                      <span
                        style={{
                          fontSize: '12px',
                          color: cancelLoading ? '#C0A8AA' : '#C0706A',
                          cursor: cancelLoading ? 'default' : 'pointer',
                          textDecoration: 'underline',
                        }}
                        onClick={cancelLoading ? undefined : () => setShowCancelModal(true)}
                      >
                        {cancelLoading ? 'Cancelling...' : 'Cancel subscription'}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer note */}
      <div style={{ textAlign: 'center', paddingBottom: '64px', color: '#9D8F99', fontSize: '13px' }}>
        <p>All prices in CAD. Cancel anytime from your billing portal.</p>
      </div>

      {/* Cancel subscription confirmation modal */}
      <ConfirmationDialog
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={confirmCancelSubscription}
        title="Cancel your Pro subscription?"
        message="You'll keep full access to all Pro features until the end of your current billing period. After that, your account will revert to the Free plan."
        confirmText="Yes, cancel"
        cancelText="Keep my plan"
        variant="warning"
        isLoading={cancelLoading}
      />
      <Footer />
    </div>
  );
};
