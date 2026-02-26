import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { useAuthStore } from '../stores/authStore';
import authService from '../services/authService';
import ArrowBack from '@mui/icons-material/ArrowBack';
import PersonOutline from '@mui/icons-material/PersonOutline';
import LocalFlorist from '@mui/icons-material/LocalFlorist';
import Park from '@mui/icons-material/Park';
import CalendarToday from '@mui/icons-material/CalendarToday';
import CheckCircle from '@mui/icons-material/CheckCircle';

// Common timezones for dropdown
const TIMEZONES = [
  'America/Vancouver','America/Edmonton','America/Winnipeg','America/Toronto',
  'America/Halifax','America/St_Johns','America/New_York','America/Chicago',
  'America/Denver','America/Los_Angeles','America/Anchorage','Pacific/Honolulu',
  'Europe/London','Europe/Paris','Europe/Berlin','Europe/Rome','Europe/Madrid',
  'Europe/Amsterdam','Europe/Stockholm','Europe/Warsaw','Europe/Helsinki',
  'Asia/Tokyo','Asia/Seoul','Asia/Shanghai','Asia/Singapore','Asia/Dubai',
  'Asia/Kolkata','Asia/Bangkok','Australia/Sydney','Australia/Melbourne',
  'Pacific/Auckland','UTC',
];

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, loadUser } = useAuthStore();
  const [name, setName] = useState('');
  const [timezone, setTimezone] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<{ totalGardens: number; totalFlowers: number } | null>(null);

  // Populate form from user
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setTimezone(user.timezone || 'UTC');
    }
  }, [user]);

  // Load fresh profile + stats on mount
  useEffect(() => {
    loadUser();
    authService.getUserStats()
      .then((s) => setStats({ totalGardens: s.totalGardens, totalFlowers: s.totalFlowers }))
      .catch(() => {});
  }, [loadUser]);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSaveSuccess(false);
    try {
      await authService.updateProfile({ name: name.trim(), timezone });
      await loadUser();
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: unknown) {
      const msg = err && typeof err === 'object' && 'message' in err
        ? String((err as { message: string }).message)
        : 'Failed to save. Please try again.';
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  const getInitials = (n: string) =>
    n.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || 'U';

  const tierColor: Record<string, string> = {
    FREE: '#D4909A',
    PRO: '#C07080',
    PREMIUM: '#9E7DAE',
  };

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : '—';

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

          <div style={{ marginBottom: '24px' }}>
            <label style={labelStyle}>Timezone</label>
            <select
              style={{ ...inputStyle, cursor: 'pointer', appearance: 'auto' }}
              value={timezone}
              onChange={e => setTimezone(e.target.value)}
            >
              {TIMEZONES.map(tz => (
                <option key={tz} value={tz}>{tz}</option>
              ))}
            </select>
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

        {/* Account stats */}
        <div style={sectionStyle}>
          <div style={sectionTitleStyle}>Account Overview</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            {[
              { icon: <Park sx={{ fontSize: 22, color: '#D4909A' }} />, label: 'Gardens', value: stats?.totalGardens ?? '—' },
              { icon: <LocalFlorist sx={{ fontSize: 22, color: '#D4909A' }} />, label: 'Flowers', value: stats?.totalFlowers ?? '—' },
              { icon: <CalendarToday sx={{ fontSize: 20, color: '#D4909A' }} />, label: 'Member Since', value: memberSince },
            ].map(({ icon, label, value }) => (
              <div key={label} style={{
                background: 'linear-gradient(135deg, #FFF5F7 0%, #FAF0F2 100%)',
                borderRadius: '14px', padding: '18px 16px', textAlign: 'center',
                border: '1px solid rgba(232, 180, 184, 0.25)',
              }}>
                <div style={{ marginBottom: '6px' }}>{icon}</div>
                <div style={{ fontSize: '22px', fontWeight: 700, color: '#3D3340', fontFamily: 'Georgia, serif' }}>{value}</div>
                <div style={{ fontSize: '12px', color: '#9D8F99', marginTop: '2px' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
