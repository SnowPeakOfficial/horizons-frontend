/**
 * Footer Component - Shared across pages
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';

export const Footer: React.FC = () => {
  const navigate = useNavigate();
  const year = new Date().getFullYear();

  const footerStyle: React.CSSProperties = {
    background: 'linear-gradient(180deg, #FFF5F7 0%, #FAF0F2 100%)',
    borderTop: '1px solid rgba(232, 180, 184, 0.3)',
    padding: '48px 24px 32px',
  };

  const containerStyle: React.CSSProperties = {
    maxWidth: '1100px',
    margin: '0 auto',
  };

  const topRowStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: '32px',
    marginBottom: '40px',
  };

  const logoStyle: React.CSSProperties = {
    fontFamily: 'Georgia, serif',
    fontWeight: 500,
    fontSize: '18px',
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    color: '#9D8F99',
    opacity: 0.7,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  };

  const taglineStyle: React.CSSProperties = {
    fontSize: '13px',
    color: '#B0A0AC',
    marginTop: '6px',
    lineHeight: 1.5,
    maxWidth: '220px',
  };

  const columnTitleStyle: React.CSSProperties = {
    fontSize: '11px',
    fontWeight: 700,
    letterSpacing: '0.08em',
    color: '#9D8F99',
    textTransform: 'uppercase',
    marginBottom: '14px',
  };

  const linkStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '14px',
    color: '#7A6E78',
    marginBottom: '10px',
    cursor: 'pointer',
    textDecoration: 'none',
    transition: 'color 0.2s ease',
  };

  const dividerStyle: React.CSSProperties = {
    height: '1px',
    background: 'rgba(232, 180, 184, 0.25)',
    marginBottom: '24px',
  };

  const bottomRowStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '12px',
  };

  const copyrightStyle: React.CSSProperties = {
    fontSize: '13px',
    color: '#B0A0AC',
  };

  const handleLinkHover = (e: React.MouseEvent<HTMLSpanElement>, entering: boolean) => {
    (e.currentTarget as HTMLElement).style.color = entering ? '#D4909A' : '#7A6E78';
  };

  return (
    <footer style={footerStyle}>
      <div style={containerStyle}>
        <div style={topRowStyle}>
          {/* Brand */}
          <div>
            <div style={logoStyle} onClick={() => navigate('/')}>
              <img
                src="/images/horizons-logo.svg"
                alt="Horizons logo"
                style={{ height: '24px', width: 'auto', display: 'block' }}
              />
              <span style={{ letterSpacing: '0.15em', textTransform: 'uppercase' }}>Horizons</span>
            </div>
            <p style={taglineStyle}>
              A digital garden to grow and share meaningful moments.
            </p>
          </div>

          {/* Product */}
          <div>
            <div style={columnTitleStyle}>Product</div>
            <span
              style={linkStyle}
              onClick={() => navigate('/my-gardens')}
              onMouseEnter={(e) => handleLinkHover(e, true)}
              onMouseLeave={(e) => handleLinkHover(e, false)}
            >
              My Gardens
            </span>
            <span
              style={linkStyle}
              onClick={() => navigate('/pricing')}
              onMouseEnter={(e) => handleLinkHover(e, true)}
              onMouseLeave={(e) => handleLinkHover(e, false)}
            >
              Pricing
            </span>
          </div>

          {/* Legal */}
          <div>
            <div style={columnTitleStyle}>Legal</div>
            <span
              style={linkStyle}
              onClick={() => navigate('/privacy')}
              onMouseEnter={(e) => handleLinkHover(e, true)}
              onMouseLeave={(e) => handleLinkHover(e, false)}
            >
              Privacy Policy
            </span>
            <span
              style={linkStyle}
              onClick={() => navigate('/terms')}
              onMouseEnter={(e) => handleLinkHover(e, true)}
              onMouseLeave={(e) => handleLinkHover(e, false)}
            >
              Terms of Service
            </span>
          </div>

          {/* Support */}
          <div>
            <div style={columnTitleStyle}>Support</div>
            <span
              style={linkStyle}
              onClick={() => navigate('/contact')}
              onMouseEnter={(e) => handleLinkHover(e, true)}
              onMouseLeave={(e) => handleLinkHover(e, false)}
            >
              Contact Us
            </span>
          </div>
        </div>

        <div style={dividerStyle} />

        <div style={bottomRowStyle}>
          <span style={copyrightStyle}>
            © {year} Horizons. All rights reserved.
          </span>
          <div style={{ display: 'flex', gap: '20px' }}>
            <span
              style={{ ...linkStyle, marginBottom: 0, fontSize: '13px' }}
              onClick={() => navigate('/privacy')}
              onMouseEnter={(e) => handleLinkHover(e, true)}
              onMouseLeave={(e) => handleLinkHover(e, false)}
            >
              Privacy
            </span>
            <span
              style={{ ...linkStyle, marginBottom: 0, fontSize: '13px' }}
              onClick={() => navigate('/terms')}
              onMouseEnter={(e) => handleLinkHover(e, true)}
              onMouseLeave={(e) => handleLinkHover(e, false)}
            >
              Terms
            </span>
            <span
              style={{ ...linkStyle, marginBottom: 0, fontSize: '13px' }}
              onClick={() => navigate('/contact')}
              onMouseEnter={(e) => handleLinkHover(e, true)}
              onMouseLeave={(e) => handleLinkHover(e, false)}
            >
              Contact
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
