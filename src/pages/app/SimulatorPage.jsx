import React from 'react';
import { useScenario } from '../../context/ScenarioContext';
import PageHeader from '../../components/common/PageHeader';
import Slider from '../../components/common/Slider';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import RiskGauge from '../../components/visualization/RiskGauge';
import {
  Sliders,
  Play,
  RotateCcw,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  Users,
  Building2,
  Navigation,
  ShieldAlert,
  ArrowRight,
  Zap
} from 'lucide-react';

export default function SimulatorPage() {
  const {
    scenario,
    simParams,
    updateSimParam,
    previewSimRisk,
    activeSim,
    activeSimRisk,
    baselineRisk,
    deltas,
    applyPreset,
    runSimulation,
    isSimulating
  } = useScenario();

  const hasUnappliedChanges =
    simParams.windSpeed !== activeSim.windSpeed ||
    simParams.rainfall !== activeSim.rainfall ||
    simParams.stormSurge !== activeSim.stormSurge ||
    simParams.infrastructureVulnerability !== activeSim.infrastructureVulnerability;

  // Explain why simulated risk changed
  const getAiExplanation = () => {
    const diff = activeSimRisk.score - baselineRisk.score;
    if (diff > 20) {
      return `Risk surged by +${diff} points primarily driven by the severe +${(activeSim.stormSurge - scenario.currentConditions.stormSurge).toFixed(1)}m hydrodynamic surge wave combined with ${activeSim.windSpeed} km/h wind shear. All secondary earthen dykes in Zone 04 will experience continuous overtopping, cutting the sole evacuation artery R14 and cutting off power to Coastal Medical Center.`;
    } else if (diff > 5) {
      return `Risk increased moderately by +${diff} points. Increased precipitation saturation (${activeSim.rainfall}mm) reduces urban drainage throughput, elevating flooding along industrial harbor docks (Zone 02) and low-elevation bridges.`;
    } else if (diff < -5) {
      return `Risk reduced by ${Math.abs(diff)} points due to decreased surge and wind velocities. Primary evacuation corridors remain passable for standard vehicles and secondary shelter facilities operate without emergency generators.`;
    }
    return `Simulated storm matches current baseline profile. Risk remains concentrated in coastal delta Sector 04 and Maritime Harbor Sector 02.`;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <PageHeader
        title="Scenario Simulator & Impact Forecasting"
        subtitle="Change the storm. See how the impact cascades across vulnerable communities."
        badge={
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <Badge severity="info">What-If Analysis Engine</Badge>
            <Badge severity="neutral">SIMULATION DATA</Badge>
          </div>
        }
        breadcrumbs={['Command Hub', 'Simulator']}
      />

      {/* Preset Buttons Bar */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        padding: '16px 20px',
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
            Scenario Presets:
          </span>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => applyPreset('baseline')}
              className={`btn btn-sm ${simParams.preset === 'baseline' ? 'btn-primary' : 'btn-secondary'}`}
            >
              Baseline (Cat 3)
            </button>
            <button
              onClick={() => applyPreset('severe')}
              className={`btn btn-sm ${simParams.preset === 'severe' ? 'btn-primary' : 'btn-secondary'}`}
            >
              Severe (Cat 4 Surge)
            </button>
            <button
              onClick={() => applyPreset('extreme')}
              className={`btn btn-sm ${simParams.preset === 'extreme' ? 'btn-primary' : 'btn-secondary'}`}
            >
              Extreme (Super Cyclone)
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Button
            variant="primary"
            icon={Play}
            isLoading={isSimulating}
            loadingText="Recalculating Cascade..."
            onClick={runSimulation}
            style={hasUnappliedChanges ? { boxShadow: '0 0 20px rgba(0, 240, 255, 0.6)' } : {}}
          >
            {hasUnappliedChanges ? 'Run Simulation (Apply Sliders)' : 'Run Simulation'}
          </Button>
          <Button
            variant="ghost"
            icon={RotateCcw}
            onClick={() => applyPreset('baseline')}
          >
            Reset
          </Button>
        </div>
      </div>

      {/* Main Simulator Grid: Controls on Left, Live Impact Comparison on Right */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '24px'
      }}>
        {/* Sliders Input Panel */}
        <div className="surface-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '22px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sliders size={18} color="var(--accent-cyan)" />
              <h2 className="font-display font-semibold" style={{ fontSize: '16px', color: 'var(--text-primary)' }}>
                Storm Parameter Controls
              </h2>
            </div>
            <span className="font-mono text-cyan" style={{ fontSize: '11px' }}>
              REAL-TIME SLIDERS
            </span>
          </div>

          {/* Wind Speed Slider */}
          <Slider
            label="Sustained Wind Speed"
            value={simParams.windSpeed}
            min={100}
            max={200}
            step={5}
            unit="km/h"
            id="sim-wind"
            hint="Category 2 to 5"
            onChange={(val) => updateSimParam('windSpeed', val)}
          />

          {/* Rainfall Slider */}
          <Slider
            label="24h Cumulative Precipitation"
            value={simParams.rainfall}
            min={100}
            max={600}
            step={10}
            unit="mm"
            id="sim-rain"
            hint="Severe to Catastrophic Flood"
            onChange={(val) => updateSimParam('rainfall', val)}
          />

          {/* Storm Surge Slider */}
          <Slider
            label="Hydrodynamic Storm Surge"
            value={simParams.stormSurge}
            min={1.0}
            max={5.0}
            step={0.1}
            unit="m"
            id="sim-surge"
            hint="Astronomical Tide Overlap"
            onChange={(val) => updateSimParam('stormSurge', val)}
          />

          {/* Infrastructure Vulnerability Slider */}
          <Slider
            label="Infrastructure Physical Vulnerability"
            value={simParams.infrastructureVulnerability}
            min={0}
            max={100}
            step={5}
            unit="/100"
            id="sim-vuln"
            hint="Structural Satiation"
            onChange={(val) => updateSimParam('infrastructureVulnerability', val)}
          />

          <div style={{
            marginTop: 'auto',
            padding: '12px',
            background: 'rgba(255, 255, 255, 0.02)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
            fontSize: '11px',
            color: 'var(--text-dim)',
            lineHeight: 1.5
          }}>
            Adjusting sliders previews calculations instantly. Click <strong>"Run Simulation"</strong> to lock in scenario parameters and propagate dynamic cascades to all other modules.
          </div>
        </div>

        {/* Comparison Result Panel: CURRENT vs SIMULATED */}
        <div className="surface-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px' }}>
            <h2 className="font-display font-semibold" style={{ fontSize: '16px', color: 'var(--text-primary)' }}>
              Scenario Comparison
            </h2>
            <Badge severity={deltas.riskDelta > 0 ? "critical" : "success"}>
              {deltas.riskDelta > 0 ? `+${deltas.riskDelta} Risk Increase` : `${deltas.riskDelta} Risk Delta`}
            </Badge>
          </div>

          {/* Side by Side Gauges: Current vs After Simulation */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', alignItems: 'center' }}>
            {/* Current Baseline */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '16px',
              textAlign: 'center'
            }}>
              <span style={{ fontSize: '11px', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Current Baseline
              </span>
              <div className="font-display font-bold" style={{ fontSize: '32px', color: 'var(--text-primary)', margin: '8px 0 2px' }}>
                {baselineRisk.score}
              </div>
              <Badge severity={baselineRisk.severity}>
                {baselineRisk.severity}
              </Badge>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '8px' }}>
                Wind: {scenario.currentConditions.windSpeed} km/h • Surge: {scenario.currentConditions.stormSurge}m
              </div>
            </div>

            {/* After Simulation */}
            <div style={{
              background: activeSimRisk.score >= 75 ? 'rgba(239, 68, 68, 0.05)' : 'rgba(0, 240, 255, 0.05)',
              border: activeSimRisk.score >= 75 ? '1px solid rgba(239, 68, 68, 0.4)' : '1px solid rgba(0, 240, 255, 0.4)',
              borderRadius: 'var(--radius-md)',
              padding: '16px',
              textAlign: 'center',
              boxShadow: activeSimRisk.score >= 75 ? '0 0 15px rgba(239, 68, 68, 0.15)' : '0 0 15px rgba(0, 240, 255, 0.15)'
            }}>
              <span className="font-mono text-cyan" style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                After Simulation
              </span>
              <div className="font-display font-bold" style={{ fontSize: '32px', color: activeSimRisk.color, margin: '8px 0 2px' }}>
                {activeSimRisk.score}
              </div>
              <Badge severity={activeSimRisk.severity} pulse={activeSimRisk.severity === 'CRITICAL'}>
                {activeSimRisk.severity}
              </Badge>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '8px' }}>
                Wind: {activeSim.windSpeed} km/h • Surge: {activeSim.stormSurge}m
              </div>
            </div>
          </div>

          {/* Impact Deltas Counter Row */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '10px',
            background: 'rgba(255, 255, 255, 0.02)',
            padding: '14px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
            textAlign: 'center'
          }}>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>Risk Delta</div>
              <div className="font-mono font-bold" style={{ fontSize: '18px', color: deltas.riskDelta > 0 ? 'var(--color-critical)' : 'var(--color-success)', marginTop: '2px' }}>
                {deltas.riskDelta > 0 ? `+${deltas.riskDelta}` : deltas.riskDelta}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>Infra Vulnerable</div>
              <div className="font-mono font-bold text-cyan" style={{ fontSize: '18px', marginTop: '2px' }}>
                +{deltas.additionalInfra} Nodes
              </div>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>Exposed Pop.</div>
              <div className="font-mono font-bold" style={{ fontSize: '18px', color: 'var(--color-warning)', marginTop: '2px' }}>
                +{deltas.additionalPeople.toLocaleString()}
              </div>
            </div>
          </div>

          {/* "Why did risk increase?" AI Reasoning Callout */}
          <div style={{
            padding: '16px',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(0, 240, 255, 0.04)',
            border: '1px solid rgba(0, 240, 255, 0.25)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Sparkles size={16} color="var(--accent-cyan)" />
              <span className="font-display font-semibold text-cyan" style={{ fontSize: '13px' }}>
                Why did risk change? — AI Synthesis
              </span>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-primary)', lineHeight: 1.6 }}>
              {getAiExplanation()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
