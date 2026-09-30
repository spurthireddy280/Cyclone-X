import React from 'react';

export default function RiskGauge({
  score = 61,
  severity = "HIGH",
  size = 200,
  strokeWidth = 14,
  label = "Overall Risk Index"
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  // Use a 270 degree arc (from 135 deg to 405 deg)
  const arcLength = circumference * 0.75;
  const strokeDashoffset = arcLength - (arcLength * Math.min(100, Math.max(0, score))) / 100;

  const getColor = () => {
    if (score >= 75) return '#EF4444'; // Red
    if (score >= 50) return '#F59E0B'; // Amber
    if (score >= 25) return '#3B82F6'; // Blue
    return '#10B981'; // Green
  };

  const color = getColor();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: 'rotate(135deg)' }}>
          {/* Background track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth={strokeWidth}
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeLinecap="round"
          />
          {/* Active progress */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{
              transition: 'stroke-dashoffset 600ms cubic-bezier(0.16, 1, 0.3, 1), stroke 400ms ease',
              filter: `drop-shadow(0 0 8px ${color})`
            }}
          />
        </svg>

        {/* Center content */}
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center'
        }}>
          <span className="font-display font-bold" style={{ fontSize: size * 0.26, lineHeight: 1, color: 'var(--text-primary)' }}>
            {score}
          </span>
          <span
            className="font-mono font-semibold"
            style={{
              fontSize: '12px',
              color,
              marginTop: '4px',
              letterSpacing: '0.08em',
              textTransform: 'uppercase'
            }}
          >
            {severity}
          </span>
          <span style={{ fontSize: '11px', color: 'var(--text-dim)', marginTop: '2px' }}>
            Scale 0–100
          </span>
        </div>
      </div>

      <div style={{ textAlign: 'center', marginTop: '4px' }}>
        <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>
          {label}
        </span>
      </div>
    </div>
  );
}
