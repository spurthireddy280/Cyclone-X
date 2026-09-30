import React from 'react';

export default function Tabs({
  tabs = [],
  activeTab,
  onChange
}) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      borderBottom: '1px solid var(--border-subtle)',
      paddingBottom: '2px',
      overflowX: 'auto'
    }}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            style={{
              padding: '8px 16px',
              fontSize: '13px',
              fontWeight: isActive ? 600 : 500,
              color: isActive ? 'var(--accent-cyan)' : 'var(--text-secondary)',
              background: isActive ? 'rgba(0, 240, 255, 0.06)' : 'transparent',
              borderBottom: isActive ? '2px solid var(--accent-cyan)' : '2px solid transparent',
              borderRadius: 'var(--radius-sm) var(--radius-sm) 0 0',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all var(--transition-fast)'
            }}
          >
            {tab.icon && <tab.icon size={15} />}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className="font-mono"
                style={{
                  fontSize: '11px',
                  padding: '1px 6px',
                  borderRadius: 'var(--radius-full)',
                  background: isActive ? 'rgba(0, 240, 255, 0.2)' : 'rgba(255, 255, 255, 0.08)',
                  color: isActive ? 'var(--accent-cyan)' : 'var(--text-muted)'
                }}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
