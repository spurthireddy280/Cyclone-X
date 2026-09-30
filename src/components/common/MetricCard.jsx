import React from 'react';

export default function MetricCard({
  label,
  value,
  unit = "",
  icon: Icon,
  delta,
  deltaType = "neutral", // 'increase' | 'decrease' | 'neutral'
  subtext,
  severity,
  onClick,
  className = ""
}) {
  const getSeverityBorder = () => {
    if (!severity) return 'var(--border-subtle)';
    switch (severity.toLowerCase()) {
      case 'critical': return 'rgba(239, 68, 68, 0.4)';
      case 'high': return 'rgba(245, 158, 11, 0.4)';
      case 'moderate': return 'rgba(59, 130, 246, 0.4)';
      case 'low': return 'rgba(16, 185, 129, 0.4)';
      default: return 'var(--border-subtle)';
    }
  };

  return (
    <div
      onClick={onClick}
      className={`surface-card ${onClick ? 'interactive cursor-pointer' : ''} ${className}`}
      style={{
        padding: '16px 18px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        borderColor: getSeverityBorder(),
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
        <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {label}
        </span>
        {Icon && (
          <div style={{
            width: 28,
            height: 28,
            borderRadius: 'var(--radius-sm)',
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent-cyan)',
            flexShrink: 0
          }}>
            <Icon size={14} />
          </div>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: '5px', marginBottom: '6px' }}>
        <span className="font-display font-bold" style={{ fontSize: '24px', color: 'var(--text-primary)', lineHeight: 1.1 }}>
          {value}
        </span>
        {unit && (
          <span className="font-mono" style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            {unit}
          </span>
        )}
      </div>

      {(delta || subtext) && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px' }}>
          {delta && (
            <span
              className="font-mono font-medium"
              style={{
                color: deltaType === 'increase' ? 'var(--color-critical)' : deltaType === 'decrease' ? 'var(--color-success)' : 'var(--text-secondary)'
              }}
            >
              {delta}
            </span>
          )}
          {subtext && (
            <span style={{ color: 'var(--text-dim)' }}>
              {subtext}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
