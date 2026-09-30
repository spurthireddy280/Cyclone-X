import React, { useState } from 'react';
import { ArrowDown, AlertTriangle, ShieldCheck, Activity, Layers } from 'lucide-react';
import Badge from '../common/Badge';

export default function CascadeFlow({
  steps = [],
  activeStepIndex,
  onStepClick
}) {
  const [selectedStep, setSelectedStep] = useState(0);

  const defaultCascade = [
    {
      step: 1,
      title: "Cyclone Intensifies Over Coastal Waters",
      impact: "Sustained wind gusts reach 145+ km/h; barometric drop drives massive tidal buildup towards estuary mouth.",
      severity: "CRITICAL",
      domain: "Meteorological"
    },
    {
      step: 2,
      title: "Hydrodynamic Storm Surge Increases to +3.2m",
      impact: "Outer harbor seawalls and coastal earthen dikes are overtopped; saltwater breaches low-lying drainage canals.",
      severity: "CRITICAL",
      domain: "Hydrological"
    },
    {
      step: 3,
      title: "Low-Lying Roads & Route R14 Flood",
      impact: "Runoff from 420mm extreme precipitation combines with surge water; 45-80cm water covers primary evacuation corridor.",
      severity: "CRITICAL",
      domain: "Transportation"
    },
    {
      step: 4,
      title: "Emergency Transport & Evacuation Slows",
      impact: "Ground transport gridlock occurs; civilian ambulances and emergency support vehicles unable to navigate inundated roads.",
      severity: "HIGH",
      domain: "Logistics"
    },
    {
      step: 5,
      title: "Hospital Access & Substation 07 Pressure Rises",
      impact: "Coastal Medical Center isolated from resupply; basement generator room faces water ingress while Substation 07 trips.",
      severity: "CRITICAL",
      domain: "Healthcare & Power"
    },
    {
      step: 6,
      title: "Emergency Response Capacity Threshold Exceeded",
      impact: "Local first responders overwhelmed without amphibious heavy equipment and regional air-support intervention.",
      severity: "CRITICAL",
      domain: "Systemic Response"
    }
  ];

  const cascadeList = steps.length > 0 ? steps : defaultCascade;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', position: 'relative', paddingLeft: '8px' }}>
      {cascadeList.map((step, idx) => {
        const isCurrent = idx === selectedStep;
        const isLast = idx === cascadeList.length - 1;

        return (
          <div
            key={step.step || idx}
            onClick={() => {
              setSelectedStep(idx);
              if (onStepClick) onStepClick(step);
            }}
            style={{
              display: 'flex',
              gap: '16px',
              cursor: 'pointer',
              position: 'relative'
            }}
          >
            {/* Timeline Node & Rail */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0, width: '32px' }}>
              <div
                className="font-mono font-bold"
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 'var(--radius-sm)',
                  background: isCurrent ? 'var(--accent-cyan)' : 'rgba(255, 255, 255, 0.05)',
                  color: isCurrent ? '#06080D' : 'var(--text-secondary)',
                  border: isCurrent ? '1px solid var(--accent-cyan)' : '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '11px',
                  transition: 'all var(--transition-fast)',
                  zIndex: 2
                }}
              >
                0{step.step || idx + 1}
              </div>

              {!isLast && (
                <div
                  style={{
                    width: '2px',
                    flex: 1,
                    minHeight: '28px',
                    background: isCurrent ? 'rgba(0, 240, 255, 0.35)' : 'var(--border-subtle)',
                    margin: '4px 0',
                    transition: 'background var(--transition-fast)'
                  }}
                />
              )}
            </div>

            {/* Step Detail Content */}
            <div
              style={{
                flex: 1,
                padding: '12px 16px',
                borderRadius: 'var(--radius-md)',
                background: isCurrent ? 'rgba(0, 240, 255, 0.04)' : 'rgba(255, 255, 255, 0.015)',
                border: isCurrent ? '1px solid var(--border-cyan)' : '1px solid var(--border-subtle)',
                marginBottom: isLast ? 0 : '12px',
                transition: 'all var(--transition-fast)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h4 style={{ fontSize: '13.5px', fontWeight: 600, color: isCurrent ? 'var(--accent-cyan)' : 'var(--text-primary)' }}>
                    {step.title}
                  </h4>
                  {step.domain && (
                    <span style={{ fontSize: '10px', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      • {step.domain}
                    </span>
                  )}
                </div>

                <Badge severity={step.severity || 'warning'}>
                  {step.severity || 'HIGH'}
                </Badge>
              </div>

              <p style={{
                marginTop: '6px',
                fontSize: '12.5px',
                color: 'var(--text-secondary)',
                lineHeight: 1.5
              }}>
                {step.impact}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
