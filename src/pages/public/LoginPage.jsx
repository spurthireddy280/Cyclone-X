import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import {
  Shield,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Lock,
  Mail
} from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFillDemo = () => {
    setEmail('demo@cyclonex.ai');
    setPassword('demo123');
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await login(email, password);
      navigate('/app');
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      background: 'var(--bg-primary)'
    }}>
      {/* Left Column: Branding & Aerospace Visual */}
      <div style={{
        background: 'radial-gradient(ellipse at center, rgba(0, 240, 255, 0.08) 0%, rgba(6, 8, 13, 0.95) 100%), var(--bg-secondary)',
        borderRight: '1px solid var(--border-subtle)',
        padding: '40px 24px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Top Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: 38,
            height: 38,
            borderRadius: 'var(--radius-sm)',
            background: 'linear-gradient(135deg, #00F0FF, #0077FF)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#06080D',
            boxShadow: '0 0 16px rgba(0, 240, 255, 0.4)'
          }}>
            <Shield size={22} strokeWidth={2.5} />
          </div>
          <div>
            <span className="font-display font-bold" style={{ fontSize: '18px', letterSpacing: '0.04em' }}>
              CYCLONE <span className="text-cyan">X</span>
            </span>
            <span style={{ fontSize: '10px', color: 'var(--text-dim)', display: 'block', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Tactical Operations Gateway
            </span>
          </div>
        </div>

        {/* Center Mission Control Callout */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '440px', margin: '40px 0' }}>
          <Badge severity="warning">OFFICIAL DISASTER RESPONSE PORTAL</Badge>
          <h2 className="font-display font-bold" style={{ fontSize: '32px', color: 'var(--text-primary)', lineHeight: 1.2 }}>
            Real-time storm cascade intelligence at your fingertips.
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            Access deterministic vulnerability calculations, active hydrodynamic surge layers, and AI-prioritized evacuation directives for <strong>Cyclone Varuna</strong>.
          </p>

          <div style={{
            padding: '16px',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            fontSize: '12px',
            color: 'var(--text-muted)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-cyan)' }}>
              <Sparkles size={14} />
              <span className="font-mono font-semibold">Demo Credentials Ready</span>
            </div>
            <div>Email: <code style={{ color: 'var(--text-primary)' }}>demo@cyclonex.ai</code></div>
            <div>Password: <code style={{ color: 'var(--text-primary)' }}>demo123</code></div>
          </div>
        </div>

        {/* Bottom Disclaimer */}
        <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>
          Cyclone X Disaster Operations • Hackathon Build 2026
        </div>
      </div>

      {/* Right Column: Login Form */}
      <div style={{
        padding: '40px 24px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'var(--bg-primary)'
      }}>
        <div style={{ width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div>
            <h1 className="font-display font-bold" style={{ fontSize: '26px', color: 'var(--text-primary)' }}>
              Sign In to Command Center
            </h1>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Enter your authorized disaster response credentials
            </p>
          </div>

          {/* Quick Demo Account Button */}
          <button
            type="button"
            onClick={handleFillDemo}
            className="surface-card interactive"
            style={{
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              borderColor: 'rgba(0, 240, 255, 0.35)',
              background: 'rgba(0, 240, 255, 0.05)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Sparkles size={16} color="var(--accent-cyan)" />
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--accent-cyan)' }}>
                  Use Demo Account
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  Auto-fills demo@cyclonex.ai / demo123
                </div>
              </div>
            </div>
            <ArrowRight size={14} color="var(--accent-cyan)" />
          </button>

          {/* Error Message Notice */}
          {error && (
            <div style={{
              padding: '10px 14px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--color-critical-bg)',
              border: '1px solid var(--color-critical-border)',
              fontSize: '12px',
              color: 'var(--color-critical)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <AlertTriangle size={15} />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {/* Email Field */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label htmlFor="login-email" style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-secondary)' }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="login-email"
                  type="email"
                  required
                  placeholder="operator@cyclonex.ai"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input"
                  style={{ paddingLeft: '36px' }}
                />
                <Mail size={15} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
            </div>

            {/* Password Field */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label htmlFor="login-password" style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-secondary)' }}>
                  Password
                </label>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input"
                  style={{ paddingLeft: '36px', paddingRight: '36px' }}
                />
                <Lock size={15} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', cursor: 'pointer' }}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={{ accentColor: 'var(--accent-cyan)' }}
                />
                <span>Remember this terminal</span>
              </label>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isLoading}
              loadingText="Authorizing..."
              iconRight={ArrowRight}
              style={{ width: '100%', marginTop: '6px' }}
            >
              Sign In
            </Button>
          </form>

          {/* Sign Up Link */}
          <div style={{ textAlign: 'center', fontSize: '13px', color: 'var(--text-muted)' }}>
            Need an operational account?{' '}
            <Link to="/signup" style={{ color: 'var(--accent-cyan)', fontWeight: 500 }}>
              Register Organization
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
