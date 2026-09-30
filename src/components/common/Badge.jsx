import React from 'react';

export default function Badge({
  children,
  severity = 'neutral', // 'critical' | 'warning' | 'success' | 'info' | 'neutral'
  pulse = false,
  icon: Icon,
  style = {}
}) {
  const normSeverity = severity ? severity.toLowerCase() : 'neutral';
  const badgeClass = `badge-${normSeverity}`;

  return (
    <span className={`badge ${badgeClass}`} style={style}>
      {pulse && <span className="pulse-dot" />}
      {Icon && <Icon size={12} />}
      <span>{children}</span>
    </span>
  );
}
