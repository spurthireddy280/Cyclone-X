import React from 'react';

export default function PageHeader({
  title,
  subtitle,
  badge,
  actions,
  breadcrumbs = []
}) {
  return (
    <div style={{
      marginBottom: '24px',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px'
    }}>
      {breadcrumbs.length > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-muted)' }}>
          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={idx}>
              {idx > 0 && <span>/</span>}
              <span style={{ color: idx === breadcrumbs.length - 1 ? 'var(--text-primary)' : 'inherit' }}>
                {crumb}
              </span>
            </React.Fragment>
          ))}
        </div>
      )}

      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px 12px' }}>
            <h1 className="font-display font-bold" style={{ fontSize: 'clamp(20px, 3vw, 24px)', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              {title}
            </h1>
            {badge}
          </div>
          {subtitle && (
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.5 }}>
              {subtitle}
            </p>
          )}
        </div>

        {actions && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
