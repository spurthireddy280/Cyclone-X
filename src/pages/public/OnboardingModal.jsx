import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import {
  Shield,
  Building2,
  Waves,
  ArrowRight,
  CheckCircle2,
  Activity,
  Compass
} from 'lucide-react';

export default function OnboardingModal({ isOpen, onClose }) {
  const { setOnboardingCompleted } = useAuth();
  const [step, setStep] = useState(1);
  const [orgType, setOrgType] = useState('Emergency Services');
  const [preferredScenario, setPreferredScenario] = useState('Coastal Cyclone');

  if (!isOpen) return null;

  const orgOptions = [
    'Emergency Services',
    'Government',
    'Healthcare',
    'Infrastructure',
    'Research',
    'Other'
  ];

  const scenarioOptions = [
    { title: 'Coastal Cyclone', desc: 'Category 3 marine track with astronomical storm surge and estuarine flooding.' },
    { title: 'Urban Flooding', desc: 'Heavy flash precipitation inundating metropolitan transit and drainage pumps.' },
    { title: 'Severe Storm', desc: 'High gale-force structural wind shear impacting high-voltage transmission grids.' }
  ];

  const handleFinish = () => {
    setOnboardingCompleted(true);
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-dialog" style={{ maxWidth: '520px', padding: '32px' }}>
        {/* Progress indicator */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: 28,
              height: 28,
              borderRadius: 'var(--radius-sm)',
              background: 'linear-gradient(135deg, #00F0FF, #0077FF)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#06080D'
            }}>
              <Shield size={16} strokeWidth={2.5} />
            </div>
            <span className="font-display font-semibold" style={{ fontSize: '14px' }}>
              Cyclone X Setup
            </span>
          </div>

          <div style={{ display: 'flex', gap: '6px' }}>
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                style={{
                  width: '24px',
                  height: '4px',
                  borderRadius: '2px',
                  background: step >= s ? 'var(--accent-cyan)' : 'rgba(255, 255, 255, 0.1)',
                  transition: 'background var(--transition-fast)'
                }}
              />
            ))}
          </div>
        </div>

        {/* Screen 1: Organization Type */}
        {step === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div>
              <span className="font-mono text-cyan" style={{ fontSize: '11px' }}>STEP 01 OF 03</span>
              <h2 className="font-display font-bold" style={{ fontSize: '20px', color: 'var(--text-primary)', marginTop: '2px' }}>
                Select Your Organization Type
              </h2>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Tailors decision support alerts and critical infrastructure asset prioritizing.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {orgOptions.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setOrgType(opt)}
                  style={{
                    padding: '12px 14px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid',
                    borderColor: orgType === opt ? 'var(--accent-cyan)' : 'var(--border-subtle)',
                    background: orgType === opt ? 'rgba(0, 240, 255, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                    color: orgType === opt ? 'var(--text-primary)' : 'var(--text-secondary)',
                    fontSize: '12px',
                    fontWeight: 500,
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  {opt}
                </button>
              ))}
            </div>

            <Button
              variant="primary"
              iconRight={ArrowRight}
              onClick={() => setStep(2)}
              style={{ marginTop: '10px', alignSelf: 'flex-end' }}
            >
              Next Step
            </Button>
          </div>
        )}

        {/* Screen 2: Preferred Scenario */}
        {step === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div>
              <span className="font-mono text-cyan" style={{ fontSize: '11px' }}>STEP 02 OF 03</span>
              <h2 className="font-display font-bold" style={{ fontSize: '20px', color: 'var(--text-primary)', marginTop: '2px' }}>
                Choose Preferred Disaster Scenario
              </h2>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Initializes active Doppler radar telemetry and zone exposure weighting.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {scenarioOptions.map((scen) => (
                <div
                  key={scen.title}
                  onClick={() => setPreferredScenario(scen.title)}
                  style={{
                    padding: '14px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid',
                    borderColor: preferredScenario === scen.title ? 'var(--accent-cyan)' : 'var(--border-subtle)',
                    background: preferredScenario === scen.title ? 'rgba(0, 240, 255, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {scen.title}
                    </span>
                    {preferredScenario === scen.title && (
                      <CheckCircle2 size={16} color="var(--accent-cyan)" />
                    )}
                  </div>
                  <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    {scen.desc}
                  </p>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
              <Button variant="ghost" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button variant="primary" iconRight={ArrowRight} onClick={() => setStep(3)}>
                Review Setup
              </Button>
            </div>
          </div>
        )}

        {/* Screen 3: Ready to Enter Command Center */}
        {step === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', textAlign: 'center' }}>
            <div style={{
              width: 54,
              height: 54,
              borderRadius: '50%',
              background: 'rgba(0, 240, 255, 0.1)',
              border: '1px solid var(--border-cyan)',
              color: 'var(--accent-cyan)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto'
            }}>
              <CheckCircle2 size={28} />
            </div>

            <div>
              <span className="font-mono text-cyan" style={{ fontSize: '11px' }}>TERMINAL CONFIGURED</span>
              <h2 className="font-display font-bold" style={{ fontSize: '22px', color: 'var(--text-primary)', marginTop: '4px' }}>
                Tactical Intelligence Station Ready
              </h2>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '6px', lineHeight: 1.5 }}>
                Your workstation is now linked to the <strong>Cyclone Varuna (Category 3)</strong> simulation for <strong>{orgType}</strong> operations.
              </p>
            </div>

            <div style={{
              padding: '14px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid var(--border-subtle)',
              fontSize: '12px',
              color: 'var(--text-muted)',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              textAlign: 'left'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Organization Sector:</span>
                <span style={{ color: 'var(--text-primary)' }}>{orgType}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Loaded Scenario:</span>
                <span style={{ color: 'var(--accent-cyan)' }}>{preferredScenario}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Cascade Engine:</span>
                <span style={{ color: 'var(--color-success)' }}>Active (Online)</span>
              </div>
            </div>

            <Button
              variant="primary"
              size="lg"
              iconRight={ArrowRight}
              onClick={handleFinish}
              style={{ width: '100%', marginTop: '8px' }}
            >
              Enter Command Center
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
