import React, { useEffect, useState } from 'react';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'];

function rand(a, b) { return a + Math.random() * (b - a); }

export default function Confetti({ show }) {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (!show) { setParticles([]); return; }
    setParticles(
      Array.from({ length: 70 }, (_, i) => ({
        id: i,
        x: rand(2, 98),
        delay: rand(0, 1.8),
        duration: rand(2.5, 4.5),
        size: rand(7, 15),
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        isCircle: Math.random() > 0.5,
        wobble: rand(-30, 30),
      }))
    );
  }, [show]);

  if (!show || particles.length === 0) return null;

  return (
    <div
      style={{
        position: 'fixed', inset: 0,
        pointerEvents: 'none',
        zIndex: 9999,
        overflow: 'hidden',
      }}
    >
      {particles.map(p => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            left: `${p.x}%`,
            top: '-20px',
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            borderRadius: p.isCircle ? '50%' : '2px',
            animation: `confetti-fall ${p.duration}s ${p.delay}s ease-in forwards`,
          }}
        />
      ))}
    </div>
  );
}
