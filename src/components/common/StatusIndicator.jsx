import React from 'react';

export default function StatusIndicator({
  status = "ONLINE",
  variant = "active", // 'active' | 'warning' | 'critical' | 'offline'
  label
}) {
  const getColors = () => {
    switch (variant) {
      case 'active':
        return { dot: 'var(--accent-cyan)', bg: 'rgba(0, 240, 255, 0.1)', border: 'rgba(0, 240, 255, 0.3)' };
      case 'warning':
        return { dot: 'var(--color-warning)', bg: 'var(--color-warning-bg)', border: 'var(--color-warning-border)' };
      case 'critical':
        return { dot: 'var(--color-critical)', bg: 'var(--color-critical-bg)', border: 'var(--color-critical-border)' };
      case 'offline':
      default:
        return { dot: 'var(--text-muted)', bg: 'rgba(255, 255, 255, 0.05)', border: 'var(--border-subtle)' };
    }
  };

  const colors = getColors();

  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      padding: '4px 10px',
      borderRadius: 'var(--radius-full)',
      background: colors.bg,
      border: `1px solid ${colors.border}`
    }}>
      <span
        style={{
          width: '7px',
          height: '7px',
          borderRadius: '50%',
          backgroundColor: colors.dot,
          boxShadow: `0 0 8px ${colors.dot}`
        }}
      />
      <span className="font-mono" style={{ fontSize: '11px', fontWeight: 600, color: colors.dot, letterSpacing: '0.04em' }}>
        {label || status}
      </span>
    </div>
  );
}
