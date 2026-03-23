import React, { useState } from 'react';
import { Phone, X, MessageSquare } from 'lucide-react';

const LINES = [
  { name: 'SAMHSA Helpline', number: '18006624357', display: '1-800-662-4357', desc: 'Free, confidential, 24/7', color: '#ef4444' },
  { name: 'Suicide & Crisis Lifeline', number: '988', display: '988', desc: 'Call or text, 24/7', color: '#3b82f6' },
  { name: 'AA Hotline', number: '18008391686', display: '1-800-839-1686', desc: 'Find an AA meeting now', color: '#10b981' },
];

export default function SOSButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        style={{
          position: 'fixed',
          bottom: '88px',
          right: '16px',
          zIndex: 40,
          width: '52px',
          height: '52px',
          borderRadius: '50%',
          backgroundColor: '#dc2626',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(220,38,38,0.5)',
          animation: 'sos-pulse 2s ease-in-out infinite',
        }}
        aria-label="Emergency crisis lines"
      >
        <Phone style={{ width: '22px', height: '22px', color: 'white' }} />
      </button>

      {open && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 50,
            backgroundColor: 'rgba(0,0,0,0.85)',
            display: 'flex', alignItems: 'flex-end',
          }}
          onClick={e => e.target === e.currentTarget && setOpen(false)}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '448px',
              margin: '0 auto',
              backgroundColor: '#111827',
              borderRadius: '20px 20px 0 0',
              padding: '24px',
              animation: 'slide-up 0.25s ease-out',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <h3 style={{ color: 'white', fontSize: '18px', fontWeight: 700, margin: 0 }}>Get Help Now</h3>
              <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
                <X style={{ color: '#9ca3af', width: '20px', height: '20px' }} />
              </button>
            </div>
            <p style={{ color: '#6b7280', fontSize: '13px', marginBottom: '20px', marginTop: 0 }}>
              You are not alone. Reach out right now.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
              {LINES.map(l => (
                <a
                  key={l.name}
                  href={`tel:${l.number}`}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '14px',
                    backgroundColor: '#1f2937',
                    borderRadius: '14px', padding: '14px',
                    textDecoration: 'none',
                    border: '1px solid #374151',
                  }}
                >
                  <div style={{
                    width: '40px', height: '40px', borderRadius: '50%',
                    backgroundColor: l.color + '22',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <Phone style={{ width: '18px', height: '18px', color: l.color }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ color: 'white', fontWeight: 600, fontSize: '14px', margin: 0 }}>{l.name}</p>
                    <p style={{ color: '#9ca3af', fontSize: '12px', margin: '2px 0 0' }}>{l.desc}</p>
                  </div>
                  <span style={{ color: l.color, fontWeight: 700, fontSize: '15px' }}>{l.display}</span>
                </a>
              ))}

              <div style={{
                display: 'flex', alignItems: 'center', gap: '14px',
                backgroundColor: '#1f2937', borderRadius: '14px', padding: '14px',
                border: '1px solid #374151',
              }}>
                <div style={{
                  width: '40px', height: '40px', borderRadius: '50%',
                  backgroundColor: '#f59e0b22',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <MessageSquare style={{ width: '18px', height: '18px', color: '#f59e0b' }} />
                </div>
                <div>
                  <p style={{ color: 'white', fontWeight: 600, fontSize: '14px', margin: 0 }}>Crisis Text Line</p>
                  <p style={{ color: '#9ca3af', fontSize: '12px', margin: '2px 0 0' }}>Text HOME to 741741</p>
                </div>
              </div>
            </div>

            <p style={{ color: '#4b5563', fontSize: '11px', textAlign: 'center', margin: 0 }}>
              If you are in immediate danger, call 911
            </p>
          </div>
        </div>
      )}
    </>
  );
}
