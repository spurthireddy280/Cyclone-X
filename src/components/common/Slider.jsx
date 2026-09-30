import React from 'react';

export default function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  unit = "",
  onChange,
  id,
  hint
}) {
  return (
    <div className="custom-slider-wrap">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <label htmlFor={id} style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)' }}>
          {label}
        </label>
        <span
          className="font-mono text-cyan"
          style={{
            fontSize: '13px',
            fontWeight: 600,
            background: 'rgba(0, 240, 255, 0.08)',
            padding: '2px 8px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid rgba(0, 240, 255, 0.2)'
          }}
        >
          {value} {unit}
        </span>
      </div>

      <input
        type="range"
        id={id}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="custom-slider"
      />

      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-dim)' }}>
        <span>{min} {unit}</span>
        {hint && <span>{hint}</span>}
        <span>{max} {unit}</span>
      </div>
    </div>
  );
}
