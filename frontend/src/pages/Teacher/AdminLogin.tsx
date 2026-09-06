import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would authenticate here.
    // For now, directly navigate to dashboard as requested.
    navigate('/dashboard');
  };

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100%', fontFamily: 'Inter, system-ui, sans-serif', backgroundColor: '#1a1d2d' }}>

      {/* Slow drift keyframe for the silk-fold highlight */}
      <style>{`
        @keyframes silkDrift {
          0%, 100% { transform: rotate(18deg) translateX(0%); }
          50% { transform: rotate(18deg) translateX(5%); }
        }
      `}</style>

      {/* Left Side (Visuals) — flowing violet gradient, covering the full height */}
      <div style={{
        flex: 1,
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(160deg, #33204f 0%, #241638 55%, #1c1130 100%)',
        display: 'flex',
        color: 'white'
      }}>
        {/* Soft top-left lavender glow */}
        <div style={{
          position: 'absolute', top: '-15%', left: '-10%', width: '75%', height: '75%',
          borderRadius: '50%',
          background: 'radial-gradient(circle at 40% 40%, rgba(196,171,224,0.55), rgba(196,171,224,0) 65%)',
          filter: 'blur(10px)'
        }}></div>

        {/* Deep violet mid glow */}
        <div style={{
          position: 'absolute', top: '28%', left: '18%', width: '60%', height: '60%',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(110,70,160,0.5), rgba(110,70,160,0) 60%)',
          filter: 'blur(40px)'
        }}></div>

        {/* Soft glow at the bottom, so the violet carries all the way down */}
        <div style={{
          position: 'absolute', bottom: '-10%', left: '10%', width: '70%', height: '70%',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(139,102,181,0.35), rgba(139,102,181,0) 65%)',
          filter: 'blur(30px)'
        }}></div>

        {/* Diagonal silk-fold sheen, drifting very slowly */}
        <div style={{
          position: 'absolute', top: '5%', left: '-25%', width: '150%', height: '60%',
          background: 'linear-gradient(120deg, rgba(255,255,255,0) 30%, rgba(215,196,235,0.35) 48%, rgba(255,255,255,0) 65%)',
          transform: 'rotate(18deg)',
          filter: 'blur(25px)',
          animation: 'silkDrift 16s ease-in-out infinite'
        }}></div>

        {/* Text block, aligned to the left */}
        <div style={{ position: 'absolute', bottom: '18%', left: '8%', maxWidth: '320px', textAlign: 'left', zIndex: 1 }}>
          <h1 style={{ fontSize: '3rem', fontWeight: 800, color: 'white', margin: 0, lineHeight: 1.1, letterSpacing: '-0.5px' }}>
            Welcome.
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.65)', marginTop: '1rem', lineHeight: 1.6 }}>
            Access the admin panel to manage users, roles, and system settings.
          </p>
          <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.75)', marginTop: '1.5rem' }}>
            Trouble logging in? <span style={{ fontWeight: 700, color: 'white', cursor: 'pointer' }}>Contact support</span>
          </p>
        </div>
      </div>

      {/* Right Side (Form) — white */}
      <div style={{
        flex: 1,
        backgroundColor: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem'
      }}>
        <div style={{ width: '100%', maxWidth: '400px' }}>
          <h2 style={{ color: '#1a1d2d', fontSize: '1.8rem', fontWeight: 600, marginBottom: '0.5rem' }}>Admin Login</h2>
          <p style={{ color: '#5f6b8a', fontSize: '0.9rem', marginBottom: '2.5rem', lineHeight: 1.5 }}>
            Access the admin panel to manage users, roles, and system settings
          </p>

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', color: '#4b5568', fontSize: '0.85rem', marginBottom: '0.5rem' }}>Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '0.8rem 1rem',
                  backgroundColor: 'transparent',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  color: '#1a1d2d',
                  fontSize: '0.95rem',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', color: '#4b5568', fontSize: '0.85rem', marginBottom: '0.5rem' }}>Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '0.8rem 1rem',
                  backgroundColor: 'transparent',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  color: '#1a1d2d',
                  fontSize: '0.95rem',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <button
              type="submit"
              style={{
                width: '100%',
                padding: '0.85rem',
                backgroundColor: '#4a2f74',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '1rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Login
            </button>
          </form>
        </div>
      </div>

    </div>
  );
}