import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.tsx';
import { useTheme } from '../context/ThemeContext.tsx';
import { 
  LayoutDashboard, 
  Calculator, 
  Trophy, 
  ShoppingBag, 
  Sun, 
  Moon, 
  LogOut, 
  Leaf,
  Flame
} from 'lucide-react';

interface NavbarProps {
  userPoints?: number;
  userStreak?: number;
}

export default function Navbar({ userPoints = 0, userStreak = 0 }: NavbarProps) {
  const location = useLocation();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/calculator', label: 'Eco Calculator', icon: Calculator },
    { path: '/gamification', label: 'Eco Coach', icon: Trophy },
    { path: '/offset', label: 'Offsets', icon: ShoppingBag },
  ];

  return (
    <nav className="navbar" style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      height: '100vh',
      padding: '24px 16px',
      background: 'var(--bg-card)',
      backdropFilter: 'var(--glass-blur)',
      borderRight: '1px solid var(--border-color)',
      position: 'sticky',
      top: 0
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        {/* Header Branding */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingLeft: '8px' }}>
          <div style={{
            background: 'var(--primary-glow)',
            color: 'var(--primary)',
            padding: '8px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Leaf size={24} />
          </div>
          <span style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.5px' }}>
            Eco<span style={{ color: 'var(--primary)' }}>Coach</span>
          </span>
        </div>

        {/* Navigation list */}
        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {navItems.map(item => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <li key={item.path}>
                <Link 
                  to={item.path} 
                  aria-current={isActive ? 'page' : undefined}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    textDecoration: 'none',
                    fontWeight: 600,
                    color: isActive ? '#fff' : 'var(--text-main)',
                    backgroundColor: isActive ? 'var(--primary)' : 'transparent',
                    boxShadow: isActive ? '0 4px 12px var(--primary-glow)' : 'none',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'var(--border-color)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Stats Widget */}
        {user && (
          <div style={{
            padding: '14px',
            borderRadius: '14px',
            background: 'var(--border-color)',
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            fontSize: '0.9rem',
            fontWeight: 600
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent)' }}>
              <Trophy size={16} />
              <span>{userPoints} pts</span>
            </div>
            <div style={{ width: '1px', height: '20px', background: 'var(--border-color)' }}></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--danger)' }}>
              <Flame size={16} />
              <span>{userStreak} days</span>
            </div>
          </div>
        )}

        {/* Theme and Logout control */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            onClick={toggleTheme}
            className="btn btn-secondary"
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
            style={{ flex: 1, padding: '10px' }}
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>
          <button 
            onClick={logout}
            className="btn btn-secondary"
            aria-label="Logout"
            style={{ flex: 1, padding: '10px', color: 'var(--danger)' }}
          >
            <LogOut size={18} />
          </button>
        </div>

        {/* User Card */}
        {user && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            borderTop: '1px solid var(--border-color)',
            paddingTop: '16px'
          }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              backgroundColor: 'var(--primary)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '1rem',
              backgroundImage: user.avatarUrl ? `url(${user.avatarUrl})` : 'none',
              backgroundSize: 'cover'
            }}>
              {!user.avatarUrl && (user.displayName?.[0] || user.email?.[0] || 'U').toUpperCase()}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user.displayName || 'Eco Warrior'}
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user.email}
              </span>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
