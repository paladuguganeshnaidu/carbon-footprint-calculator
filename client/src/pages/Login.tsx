import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { Leaf, Mail, Lock, User as UserIcon, AlertCircle } from 'lucide-react';

export default function Login() {
  const { login, signup, isDevMode } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all required fields.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    try {
      setError('');
      setLoading(true);
      if (isSignUp) {
        await signup(email, password);
        // Note: For Firebase, we can optionally update profile displayName here
      } else {
        await login(email, password);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Authentication failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDevBypass = async () => {
    try {
      setError('');
      setLoading(true);
      await login('dev-mock@example.com', 'password123');
    } catch (err: any) {
      setError('Failed to trigger developer bypass.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      width: '100vw',
      background: 'linear-gradient(135deg, #0f172a 0%, #064e3b 100%)',
      padding: '20px',
      position: 'fixed',
      top: 0,
      left: 0,
      zIndex: 9999
    }}>
      {/* Decorative Blur Spheres */}
      <div style={{
        position: 'absolute',
        width: '300px',
        height: '300px',
        background: 'radial-gradient(circle, rgba(16,185,129,0.3) 0%, rgba(0,0,0,0) 70%)',
        top: '10%',
        left: '15%',
        filter: 'blur(50px)',
        zIndex: 1
      }}></div>
      <div style={{
        position: 'absolute',
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(14,165,233,0.2) 0%, rgba(0,0,0,0) 70%)',
        bottom: '10%',
        right: '15%',
        filter: 'blur(60px)',
        zIndex: 1
      }}></div>

      <div className="card-glass animate-fade-in" style={{
        width: '100%',
        maxWidth: '440px',
        padding: '40px 32px',
        zIndex: 10,
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        background: 'rgba(15, 23, 42, 0.75)'
      }}>
        {/* Branding header */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
          <div style={{
            background: 'rgba(16, 185, 129, 0.15)',
            color: '#10b981',
            padding: '12px',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Leaf size={32} />
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.5px' }}>
            EcoCoach Platform
          </h1>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8', textAlign: 'center' }}>
            {isSignUp ? 'Create your account to start tracking emissions' : 'Log in to track your carbon footprint logs'}
          </p>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {isSignUp && (
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" htmlFor="name-input" style={{ color: '#94a3b8' }}>Display Name</label>
              <div style={{ position: 'relative' }}>
                <UserIcon size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                <input
                  id="name-input"
                  className="form-input"
                  type="text"
                  placeholder="e.g. Ganesh"
                  style={{ paddingLeft: '44px', background: 'rgba(15, 23, 42, 0.6)', borderColor: 'rgba(255,255,255,0.1)' }}
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                />
              </div>
            </div>
          )}

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" htmlFor="email-input" style={{ color: '#94a3b8' }}>Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
              <input
                id="email-input"
                className="form-input"
                type="email"
                required
                placeholder="you@example.com"
                style={{ paddingLeft: '44px', background: 'rgba(15, 23, 42, 0.6)', borderColor: 'rgba(255,255,255,0.1)', color: '#f8fafc' }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" htmlFor="password-input" style={{ color: '#94a3b8' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
              <input
                id="password-input"
                className="form-input"
                type="password"
                required
                placeholder="••••••••"
                style={{ paddingLeft: '44px', background: 'rgba(15, 23, 42, 0.6)', borderColor: 'rgba(255,255,255,0.1)', color: '#f8fafc' }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: '#ef4444',
              background: 'rgba(239, 68, 68, 0.1)',
              padding: '10px 14px',
              borderRadius: '8px',
              fontSize: '0.85rem'
            }}>
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', height: '46px', background: '#10b981', color: '#fff' }}
          >
            {loading ? 'Authenticating...' : isSignUp ? 'Create Eco Account' : 'Sign In'}
          </button>
        </form>

        {/* Toggle Mode */}
        <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.85rem' }}>
          <span style={{ color: '#94a3b8' }}>
            {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
          </span>
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError('');
            }}
            style={{
              background: 'none',
              border: 'none',
              color: '#10b981',
              fontWeight: 600,
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </button>
        </div>

        {/* Development Bypass Card */}
        {isDevMode && (
          <div style={{
            marginTop: '28px',
            paddingTop: '20px',
            borderTop: '1px dashed rgba(255,255,255,0.1)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            <div style={{ fontSize: '0.75rem', color: '#64748b', textAlign: 'center' }}>
              Firebase keys not configured. Local Dev mode is active.
            </div>
            <button
              onClick={handleDevBypass}
              disabled={loading}
              className="btn btn-secondary"
              style={{
                width: '100%',
                fontSize: '0.8rem',
                borderColor: 'rgba(255,255,255,0.15)',
                color: '#f8fafc',
                background: 'rgba(255,255,255,0.02)'
              }}
            >
              Sign In as Mock Developer
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
