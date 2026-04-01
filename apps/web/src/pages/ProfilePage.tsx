import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { useAuthStore } from '../stores/authStore';
import authService from '../services/authService';
import ArrowBack from '@mui/icons-material/ArrowBack';
import PersonOutline from '@mui/icons-material/PersonOutline';
import CheckCircle from '@mui/icons-material/CheckCircle';
import NotificationsNoneOutlined from '@mui/icons-material/NotificationsNoneOutlined';

interface EmailPrefs {
  bloomNotifications: boolean;
  invitations: boolean;
  accountUpdates: boolean;
  marketing: boolean;
}

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, loadUser } = useAuthStore();
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Email preferences state
  const [prefs, setPrefs] = useState<EmailPrefs>({
    bloomNotifications: true,
    invitations: true,
    accountUpdates: true,
    marketing: false,
  });
  const [prefsSaving, setPrefsSaving] = useState(false);
  const [prefsSuccess, setPrefsSuccess] = useState(false);
  const [prefsError, setPrefsError] = useState<string | null>(null);

  // Populate form from user
  useEffect(() => {
    if (user) {
      setName(user.name || '');
    }
  }, [user]);

  // Load fresh profile + email prefs on mount
  useEffect(() => {
    loadUser();
    authService.getEmailPreferences().then(setPrefs).catch(() => {});
  }, [loadUser]);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSaveSuccess(false);
    try {
      await authService.updateProfile({ name: name.trim() });
      await loadUser();
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: unknown) {
      const e = err as { message?: string; statusCode?: number; error?: string };
      let msg = 'Unable to save your changes. Please try again.';
      if (e.error === 'NETWORK_ERROR' || e.statusCode === 0) {
        msg = "We're having trouble reaching our servers. Please check your internet connection.";
      } else if (e.statusCode && e.statusCode >= 500) {
        msg = 'Something went wrong on our end. Please try again in a moment.';
      } else if (e.message) {
        msg = e.message;
      }
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleTogglePref = useCallback(async (key: keyof EmailPrefs) => {
    const updated = { ...prefs, [key]: !prefs[key] };
    setPrefs(updated);
    setPrefsSaving(true);
    setPrefsError(null);
    setPrefsSuccess(false);
    try {
      await authService.updateEmailPreferences({ [key]: updated[key] });
      setPrefsSuccess(true);
      setTimeout(() => setPrefsSuccess(false), 2000);
    } catch {
      // Revert on failure
      setPrefs(prefs);
      setPrefsError('Failed to save. Please try again.');
    } finally {
      setPrefsSaving(false);
    }
  }, [prefs]);

  const getInitials = (n: string) =>
    n.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || 'U';

  const tierColor: Record<string, string> = {
    FREE: '#D4909A',
    PRO: '#C07080',
    PREMIUM: '#9E7DAE',
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px 14px',
    borderRadius: '10px',
    border: '1.5px solid rgba(232, 180, 184, 0.5)',
    fontSize: '15px',
    color: '#3D3340',
    background: '#FFFFFF',
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
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

  const sectionStyle: React.CSSProperties = {
    background: '#FFFFFF',
    borderRadius: '20px',
    padding: '28px 32px',
    border: '1.5px solid rgba(232, 180, 184, 0.3)',
    boxShadow: '0 4px 20px rgba(212, 144, 154, 0.08)',
    marginBottom: '20px',
  };

  const sectionTitleStyle: React.CSSProperties = {
    fontSize: '16px',
    fontWeight: 700,
    fontFamily: 'Georgia, serif',
    color: '#3D3340',
    marginBottom: '20px',
    paddingBottom: '12px',
    borderBottom: '1px solid rgba(232, 180, 184, 0.2)',
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #FFF5F7 0%, #FAF7F5 50%, #F3EEF7 100%)' }}>
      <Navbar />

      <div style={{ maxWidth: '680px', margin: '0 auto', padding: '32px 24px 64px' }}>
        {/* Back link */}
        <div
          style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', color: '#9D8F99', fontSize: '14px', marginBottom: '24px' }}
          onClick={() => navigate(-1)}
        >
          <ArrowBack sx={{ fontSize: 18 }} />
          Back
        </div>

        {/* Avatar + name header */}
        <div style={{ ...sectionStyle, display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '20px' }}>
          <div style={{
            width: '72px', height: '72px', borderRadius: '50%', flexShrink: 0,
            background: 'linear-gradient(135deg, #FFE5EC 0%, #FFC9D9 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#C07080', fontSize: '24px', fontWeight: 700, fontFamily: 'Georgia, serif',
            border: '2px solid rgba(212, 144, 154, 0.3)',
          }}>
            {user?.name ? getInitials(user.name) : <PersonOutline sx={{ fontSize: 32 }} />}
          </div>
          <div>
            <div style={{ fontSize: '22px', fontWeight: 700, fontFamily: 'Georgia, serif', color: '#3D3340' }}>
              {user?.name || 'Your Name'}
            </div>
            <div style={{ fontSize: '14px', color: '#9D8F99', marginTop: '2px' }}>{user?.email}</div>
            <div style={{
              display: 'inline-block', marginTop: '8px', padding: '2px 12px',
              borderRadius: '999px', fontSize: '12px', fontWeight: 700,
              background: 'rgba(212, 144, 154, 0.12)',
              color: tierColor[user?.tier || 'FREE'] || '#D4909A',
              border: `1px solid rgba(212, 144, 154, 0.25)`,
            }}>
              {user?.tier || 'FREE'}
            </div>
          </div>
        </div>

        {/* Edit profile */}
        <div style={sectionStyle}>
          <div style={sectionTitleStyle}>Edit Profile</div>

          <div style={{ marginBottom: '18px' }}>
            <label style={labelStyle}>Display Name</label>
            <input
              style={inputStyle}
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Your name"
              maxLength={80}
            />
          </div>

          <div style={{ marginBottom: '18px' }}>
            <label style={labelStyle}>Email Address</label>
            <input
              style={{ ...inputStyle, background: '#FAF5F6', color: '#9D8F99', cursor: 'not-allowed' }}
              value={user?.email || ''}
              disabled
            />
            <p style={{ fontSize: '12px', color: '#B0A4AC', marginTop: '4px', marginBottom: 0 }}>
              Email cannot be changed at this time.
            </p>
          </div>

          {error && (
            <p style={{ color: '#D4909A', fontSize: '13px', marginBottom: '12px' }}>{error}</p>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={handleSave}
              disabled={saving}
              style={{
                padding: '12px 28px', borderRadius: '12px', border: 'none', cursor: saving ? 'default' : 'pointer',
                background: saving ? 'rgba(212,144,154,0.5)' : 'linear-gradient(135deg, #E8B4B8 0%, #D4909A 100%)',
                color: '#FFFFFF', fontWeight: 600, fontSize: '15px', fontFamily: 'Georgia, serif',
                boxShadow: saving ? 'none' : '0 4px 16px rgba(212, 144, 154, 0.35)',
              }}
            >
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
            {saveSuccess && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#6B8E6B', fontSize: '14px' }}>
                <CheckCircle sx={{ fontSize: 18 }} />
                Saved!
              </div>
            )}
          </div>
        </div>

        {/* Email Notifications */}
        <div style={sectionStyle}>
          <div style={{ ...sectionTitleStyle, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <NotificationsNoneOutlined sx={{ fontSize: 20, color: '#D4909A' }} />
            Email Notifications
            {prefsSuccess && (
              <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '4px', color: '#6B8E6B', fontSize: '13px', fontWeight: 400 }}>
                <CheckCircle sx={{ fontSize: 16 }} /> Saved
              </span>
            )}
          </div>

          {prefsError && (
            <p style={{ color: '#D4909A', fontSize: '13px', marginBottom: '12px' }}>{prefsError}</p>
          )}

          {([ 
            { key: 'bloomNotifications' as const, label: 'Bloom & flower notifications', desc: 'Get notified when flowers are planted or bloom in your gardens' },
            { key: 'invitations' as const, label: 'Garden invitations', desc: 'When someone adds you to a garden' },
            { key: 'accountUpdates' as const, label: 'Account updates', desc: 'Important emails about your account' },
            { key: 'marketing' as const, label: 'News & updates', desc: 'Occasional product news from Horizons' },
          ]).map(({ key, label, desc }) => (
            <div
              key={key}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '14px 0',
                borderBottom: key !== 'marketing' ? '1px solid rgba(232, 180, 184, 0.15)' : 'none',
              }}
            >
              <div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#3D3340', marginBottom: '2px' }}>{label}</div>
                <div style={{ fontSize: '12px', color: '#B0A4AC' }}>{desc}</div>
              </div>
              {/* Toggle switch */}
              <button
                onClick={() => !prefsSaving && handleTogglePref(key)}
                disabled={prefsSaving}
                aria-pressed={prefs[key]}
                style={{
                  position: 'relative', flexShrink: 0, width: '44px', height: '24px',
                  borderRadius: '999px', border: 'none', cursor: prefsSaving ? 'default' : 'pointer',
                  background: prefs[key] ? 'linear-gradient(135deg, #E8B4B8 0%, #D4909A 100%)' : 'rgba(0,0,0,0.12)',
                  transition: 'background 200ms ease',
                  opacity: prefsSaving ? 0.7 : 1,
                }}
              >
                <span style={{
                  position: 'absolute', top: '3px',
                  left: prefs[key] ? '23px' : '3px',
                  width: '18px', height: '18px', borderRadius: '50%',
                  background: '#FFFFFF',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                  transition: 'left 200ms ease',
                }} />
              </button>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};
