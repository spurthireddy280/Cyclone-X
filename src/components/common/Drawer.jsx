import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export default function Drawer({
  isOpen,
  onClose,
  title,
  subtitle,
  children
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="drawer-backdrop" onClick={onClose}>
      <div className="drawer-panel" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(6, 8, 13, 0.4)'
        }}>
          <div>
            <h3 className="font-display" style={{ fontSize: '17px', fontWeight: 600, color: 'var(--text-primary)' }}>
              {title}
            </h3>
            {subtitle && (
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                {subtitle}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            style={{
              padding: '6px',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              transition: 'background var(--transition-fast)'
            }}
            aria-label="Close drawer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '24px', flex: 1, overflowY: 'auto' }}>
          {children}
        </div>
      </div>
    </div>
  );
}
