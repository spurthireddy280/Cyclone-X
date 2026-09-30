import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import {
  Shield,
  ArrowRight,
  AlertTriangle,
  Building,
  User,
  Mail,
  Lock
} from 'lucide-react';

export default function SignUpPage() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [organization, setOrganization] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreedTerms, setAgreedTerms] = useState(true);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!agreedTerms) {
      setError("Please accept the operational protocol terms.");
      return;
    }

    setIsLoading(true);

    try {
      await signup({ name, organization, email, password });
      navigate('/app');
    } catch (err) {
      setError(err.message || "Registration failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      background: 'radial-gradient(ellipse at center, rgba(0, 240, 255, 0.04) 0%, rgba(6, 8, 13, 0.98) 100%), var(--bg-primary)'
    }}>
      <div className="surface-card" style={{
        width: '100%',
        maxWidth: '480px',
        padding: '36px',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: 36,
            height: 36,
            borderRadius: 'var(--radius-sm)',
            background: 'linear-gradient(135deg, #00F0FF, #0077FF)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#06080D',
            boxShadow: '0 0 14px rgba(0, 240, 255, 0.4)'
          }}>
            <Shield size={20} strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="font-display font-bold" style={{ fontSize: '20px', color: 'var(--text-primary)' }}>
              Register Command Account
            </h1>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              Join the Cyclone X Emergency Response Network
            </p>
          </div>
        </div>

        {/* Error Notice */}
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

        {/* Registration Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label htmlFor="reg-name" style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-secondary)' }}>
              Full Name / Officer In Charge
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="reg-name"
                type="text"
                required
                placeholder="Dr. Eleanor Vance"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '36px' }}
              />
              <User size={15} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label htmlFor="reg-org" style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-secondary)' }}>
              Agency / Organization
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="reg-org"
                type="text"
                required
                placeholder="National Emergency Operations Authority"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '36px' }}
              />
              <Building size={15} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label htmlFor="reg-email" style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-secondary)' }}>
              Official Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="reg-email"
                type="email"
                required
                placeholder="e.vance@disaster-ops.gov"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '36px' }}
              />
              <Mail size={15} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label htmlFor="reg-password" style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-secondary)' }}>
                Password
              </label>
              <input
                id="reg-password"
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label htmlFor="reg-confirm" style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-secondary)' }}>
                Confirm Password
              </label>
              <input
                id="reg-confirm"
                type="password"
                required
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="form-input"
              />
            </div>
          </div>

          <label style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '12px', color: 'var(--text-secondary)', cursor: 'pointer', marginTop: '6px' }}>
            <input
              type="checkbox"
              checked={agreedTerms}
              onChange={(e) => setAgreedTerms(e.target.checked)}
              style={{ accentColor: 'var(--accent-cyan)', marginTop: '2px' }}
            />
            <span>I acknowledge this platform is an operational decision support simulation tool and accept simulation safety guidelines.</span>
          </label>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isLoading}
            loadingText="Creating Credentials..."
            iconRight={ArrowRight}
            style={{ width: '100%', marginTop: '8px' }}
          >
            Complete Registration
          </Button>
        </form>

        <div style={{ textAlign: 'center', fontSize: '13px', color: 'var(--text-muted)' }}>
          Already authorized?{' '}
          <Link to="/login" style={{ color: 'var(--accent-cyan)', fontWeight: 500 }}>
            Sign In Here
          </Link>
        </div>
      </div>
    </div>
  );
}
