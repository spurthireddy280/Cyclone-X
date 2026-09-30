import React from 'react';

export default function Toggle({
  checked = false,
  onChange,
  label,
  description,
  id,
  disabled = false
}) {
  const handleKeyDown = (e) => {
    if (disabled) return;
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      onChange(!checked);
    }
  };

  return (
    <div
      className={`toggle-switch-container ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      onClick={() => !disabled && onChange(!checked)}
      role="switch"
      aria-checked={checked}
      tabIndex={disabled ? -1 : 0}
      onKeyDown={handleKeyDown}
      id={id}
    >
      <div className={`toggle-track ${checked ? 'active' : ''}`}>
        <div className="toggle-thumb" />
      </div>
      {(label || description) && (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {label && (
            <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)' }}>
              {label}
            </span>
          )}
          {description && (
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              {description}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
