import React from 'react';
import { useScenario } from '../../context/ScenarioContext';
import PageHeader from '../../components/common/PageHeader';
import RiskGauge from '../../components/visualization/RiskGauge';
import ContributionBar from '../../components/visualization/ContributionBar';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import {
  ShieldAlert,
  HelpCircle,
  ChevronRight,
  TrendingUp,
  AlertTriangle,
  Layers,
  MapPin,
  Users,
  Compass
} from 'lucide-react';

export default function RiskAnalysisPage() {
  const { scenario, baselineRisk, setSelectedZone } = useScenario();
  const { factors } = baselineRisk;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <PageHeader
        title="Risk Analysis & Vulnerability Engine"
        subtitle="Explainable deterministic multi-hazard vulnerability assessment across coastal infrastructure zones"
        badge={<Badge severity="info">Deterministic Engine</Badge>}
        breadcrumbs={['Command Hub', 'Risk Analysis']}
      />

      {/* Top Grid: Composite Score + Contribution Bar */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '24px'
      }}>
        {/* Composite Score Card */}
        <div className="surface-card" style={{ padding: '28px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Explainable Risk Score
            </span>
            <Badge severity={baselineRisk.severity} pulse>
              {baselineRisk.severity}
            </Badge>
          </div>

          <RiskGauge
            score={baselineRisk.score}
            severity={baselineRisk.severity}
            size={220}
          />

          <div style={{
            marginTop: '16px',
            textAlign: 'center',
            fontSize: '12px',
            color: 'var(--text-secondary)',
            lineHeight: 1.5,
            maxWidth: '380px'
          }}>
            Calculated by the <strong>Explainable Vulnerability Engine</strong>. No black-box machine learning; entirely derived from transparent physical formulas.
          </div>
        </div>

        {/* Explainable Factor Weights & Contributions */}
        <div className="surface-card" style={{ padding: '28px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Layers size={18} color="var(--accent-cyan)" />
              <h2 className="font-display font-semibold" style={{ fontSize: '16px', color: 'var(--text-primary)' }}>
                Multi-Hazard Weighting Architecture
              </h2>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '20px' }}>
              Formula: <code>(Wind × 30%) + (Precipitation × 25%) + (Storm Surge × 30%) + (Infra Vulnerability × 15%)</code>
            </p>

            <ContributionBar factors={factors} />
          </div>

          <div style={{
            marginTop: '20px',
            padding: '14px 16px',
            background: 'rgba(0, 240, 255, 0.04)',
            border: '1px solid rgba(0, 240, 255, 0.2)',
            borderRadius: 'var(--radius-md)',
            fontSize: '12px',
            color: 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <HelpCircle size={18} color="var(--accent-cyan)" style={{ flexShrink: 0 }} />
            <span>
              Storm Surge and Wind account for <strong>60% of total regional vulnerability</strong>, making coastal lowlands and harbors the primary areas of failure.
            </span>
          </div>
        </div>
      </div>

      {/* Risk by Zone Table / Grid */}
      <div className="surface-card" style={{ padding: '28px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <div>
            <h2 className="font-display font-bold" style={{ fontSize: '18px', color: 'var(--text-primary)' }}>
              Geographic Vulnerability by Zone
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              Click any zone to inspect explainable determinants, population demographics, and infrastructure exposure
            </p>
          </div>
          <Badge severity="neutral">5 Tactical Zones Monitored</Badge>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {scenario.zones.map((zone) => {
            const isCritical = zone.riskScore >= 75;
            const isHigh = zone.riskScore >= 50 && zone.riskScore < 75;
            const scoreColor = isCritical ? 'var(--color-critical)' : isHigh ? 'var(--color-warning)' : 'var(--color-info)';

            return (
              <div
                key={zone.id}
                onClick={() => setSelectedZone(zone)}
                className="surface-card interactive cursor-pointer"
                style={{
                  padding: '18px 22px',
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '16px',
                  borderLeft: `4px solid ${scoreColor}`
                }}
              >
                {/* Zone Name & Code */}
                <div style={{ minWidth: '220px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="font-mono text-cyan font-semibold" style={{ fontSize: '12px' }}>
                      {zone.code}
                    </span>
                    <Badge severity={zone.severity}>
                      {zone.severity}
                    </Badge>
                  </div>
                  <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', marginTop: '2px' }}>
                    {zone.name}
                  </h3>
                </div>

                {/* Population & Nodes */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '24px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Users size={14} color="var(--text-dim)" />
                    <span>{zone.population.toLocaleString()} citizens</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MapPin size={14} color="var(--text-dim)" />
                    <span>{zone.infrastructureCount} Assets</span>
                  </div>
                </div>

                {/* Primary Vulnerability Factor */}
                <div style={{ flex: 1, minWidth: '220px', maxWidth: '380px', fontSize: '12px', color: 'var(--text-muted)' }}>
                  <span style={{ color: 'var(--text-dim)', fontSize: '11px', textTransform: 'uppercase' }}>Key Vulnerability:</span>
                  <div style={{ color: 'var(--text-secondary)', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {zone.vulnerabilityFactors[0]}
                  </div>
                </div>

                {/* Score & Action */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div className="font-display font-bold" style={{ fontSize: '24px', color: scoreColor, lineHeight: 1 }}>
                      {zone.riskScore}
                    </div>
                    <span style={{ fontSize: '10px', color: 'var(--text-dim)' }}>INDEX</span>
                  </div>

                  <div style={{
                    width: 32,
                    height: 32,
                    borderRadius: 'var(--radius-sm)',
                    background: 'rgba(255, 255, 255, 0.04)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--accent-cyan)'
                  }}>
                    <ChevronRight size={16} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
