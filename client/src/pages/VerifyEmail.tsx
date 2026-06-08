import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { Mail, RefreshCw, LogOut, AlertCircle, CheckCircle } from 'lucide-react';

export default function VerifyEmail() {
  const { user, logout, sendVerification, reloadUser } = useAuth();
  const [checking, setChecking] = useState(false);
  const [resending, setResending] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (cooldown > 0) {
      timer = setInterval(() => {
        setCooldown(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleCheck = async () => {
    try {
      setError('');
      setChecking(true);
      await reloadUser();
      
      // Give feedback if they click it but are still not verified
      if (user && !user.emailVerified) {
        setError('Email not verified yet. Please click the link in your verification email and try again.');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to reload user status.');
    } finally {
      setChecking(false);
    }
  };

  const handleResend = async () => {
    if (cooldown > 0) return;
    try {
      setError('');
      setMessage('');
      setResending(true);
      await sendVerification();
      setMessage('Verification email sent! Please check your inbox (and spam folder).');
      setCooldown(60);
    } catch (err: any) {
      setError(err.message || 'Failed to send verification email. Try again later.');
    } finally {
      setResending(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      width: '100vw',
      background: 'var(--bg-app)',
      padding: '20px',
      position: 'fixed',
      top: 0,
      left: 0,
      zIndex: 9999
    }}>
      {/* Decorative Spheres */}
      <div style={{
        position: 'absolute',
        width: '300px',
        height: '300px',
        background: 'radial-gradient(circle, rgba(16,185,129,0.1) 0%, rgba(0,0,0,0) 70%)',
        top: '15%',
        left: '20%',
        filter: 'blur(40px)',
        zIndex: 1
      }}></div>

      <div className="card-glass animate-fade-in" style={{
        width: '100%',
        maxWidth: '460px',
        padding: '40px 32px',
        zIndex: 10,
        boxShadow: 'var(--shadow-md)',
        background: 'var(--bg-card)'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', marginBottom: '28px' }}>
          <div style={{
            background: 'rgba(16, 185, 129, 0.12)',
            color: 'var(--primary)',
            padding: '16px',
            borderRadius: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Mail size={40} />
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, textAlign: 'center', color: 'var(--text-main)' }}>
            Verify your email
          </h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textAlign: 'center', lineHeight: '1.6' }}>
            We've sent a verification email to <strong style={{ color: 'var(--text-main)' }}>{user?.email}</strong>. 
            Please click the link inside that email to complete your registration.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {error && (
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px',
              color: '#ef4444',
              background: 'rgba(239, 68, 68, 0.08)',
              padding: '12px 16px',
              borderRadius: '10px',
              fontSize: '0.85rem'
            }}>
              <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
              <span>{error}</span>
            </div>
          )}

          {message && (
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px',
              color: '#10b981',
              background: 'rgba(16, 185, 129, 0.08)',
              padding: '12px 16px',
              borderRadius: '10px',
              fontSize: '0.85rem'
            }}>
              <CheckCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
              <span>{message}</span>
            </div>
          )}

          <button
            onClick={handleCheck}
            disabled={checking}
            className="btn btn-primary"
            style={{
              width: '100%',
              height: '46px',
              gap: '10px',
              fontSize: '0.95rem'
            }}
          >
            <RefreshCw size={18} className={checking ? 'animate-spin' : ''} style={{ animation: checking ? 'spin 1s linear infinite' : 'none' }} />
            {checking ? 'Checking Status...' : 'I have verified my email'}
          </button>

          <button
            onClick={handleResend}
            disabled={resending || cooldown > 0}
            className="btn btn-secondary"
            style={{
              width: '100%',
              height: '46px',
              fontSize: '0.95rem'
            }}
          >
            {cooldown > 0 
              ? `Resend Email in ${cooldown}s` 
              : resending 
                ? 'Sending Link...' 
                : 'Resend Verification Link'}
          </button>

          <button
            onClick={logout}
            className="btn btn-secondary"
            style={{
              width: '100%',
              height: '46px',
              color: '#ef4444',
              borderColor: 'rgba(239, 68, 68, 0.2)',
              marginTop: '12px',
              fontSize: '0.95rem',
              gap: '10px'
            }}
          >
            <LogOut size={18} />
            Sign Out & Switch Account
          </button>
        </div>
      </div>
    </div>
  );
}
