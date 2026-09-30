import React from 'react';
import { Wind, CloudRain, Waves, ShieldAlert } from 'lucide-react';

export default function ContributionBar({
  factors,
  interactive = true,
  onFactorClick
}) {
  const defaultFactors = factors || {
    wind: { weight: 30, contribution: 23, label: "Wind Exposure", normalized: 76 },
    rainfall: { weight: 25, contribution: 18, label: "Rainfall Inundation", normalized: 72 },
    stormSurge: { weight: 30, contribution: 21, label: "Storm Surge", normalized: 70 },
    infrastructure: { weight: 15, contribution: 9, label: "Infra Vulnerability", normalized: 60 }
  };

  const items = [
    { key: 'wind', color: '#00F0FF', icon: Wind, data: defaultFactors.wind },
    { key: 'stormSurge', color: '#38BDF8', icon: Waves, data: defaultFactors.stormSurge },
    { key: 'rainfall', color: '#818CF8', icon: CloudRain, data: defaultFactors.rainfall },
    { key: 'infrastructure', color: '#F59E0B', icon: ShieldAlert, data: defaultFactors.infrastructure }
  ];

  const totalContribution = items.reduce((acc, it) => acc + (it.data?.contribution || 0), 0);

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {/* Stacked Bar */}
      <div style={{
        height: '14px',
        width: '100%',
        borderRadius: 'var(--radius-full)',
        overflow: 'hidden',
        display: 'flex',
        background: 'rgba(255, 255, 255, 0.06)',
        border: '1px solid var(--border-subtle)',
        boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.4)'
      }}>
        {items.map((item) => {
          const widthPercent = totalContribution > 0 ? (item.data.contribution / totalContribution) * 100 : 25;
          return (
            <div
              key={item.key}
              style={{
                width: `${widthPercent}%`,
                height: '100%',
                backgroundColor: item.color,
                transition: 'width 500ms cubic-bezier(0.16, 1, 0.3, 1)',
                cursor: interactive ? 'pointer' : 'default',
                position: 'relative'
              }}
              title={`${item.data.label}: ${item.data.contribution} pts (${Math.round(widthPercent)}%)`}
              onClick={() => onFactorClick && onFactorClick(item.key)}
            />
          );
        })}
      </div>

      {/* Legend & Details */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(135px, 1fr))',
        gap: '10px'
      }}>
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.key}
              onClick={() => onFactorClick && onFactorClick(item.key)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 10px',
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                cursor: interactive ? 'pointer' : 'default',
                transition: 'all var(--transition-fast)'
              }}
              className="interactive"
            >
              <div style={{
                width: 26,
                height: 26,
                borderRadius: 'var(--radius-sm)',
                background: `${item.color}15`,
                border: `1px solid ${item.color}30`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: item.color,
                flexShrink: 0
              }}>
                <Icon size={14} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {item.data.label}
                  </span>
                  <span className="font-mono font-semibold" style={{ fontSize: '11px', color: item.color, marginLeft: '4px' }}>
                    {item.data.weight}%
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10.5px', color: 'var(--text-dim)', marginTop: '2px' }}>
                  <span>Impact</span>
                  <span className="font-mono text-cyan">+{item.data.contribution} pts</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
