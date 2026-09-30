import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Wind,
  CloudRain,
  Waves,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Building2,
  Zap,
  Navigation,
  Shield,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useScenario } from '../../context/ScenarioContext';
import MetricCard from '../../components/common/MetricCard';
import RiskGauge from '../../components/visualization/RiskGauge';
import ContributionBar from '../../components/visualization/ContributionBar';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';

export default function OverviewDashboard() {
  const { user } = useAuth();
  const { scenario, baselineRisk, setSelectedZone, setSelectedInfra } = useScenario();
  const navigate = useNavigate();

  // Top 3 priority zones
  const priorityZones = [...scenario.zones]
    .sort((a, b) => b.riskScore - a.riskScore)
    .slice(0, 3);

  // Grouped infrastructure counts
  const infraCounts = {
    hospitals: scenario.infrastructure.filter(i => i.category === 'hospitals').length,
    power: scenario.infrastructure.filter(i => i.category === 'power').length,
    roads: scenario.infrastructure.filter(i => i.category === 'roads').length,
    shelters: scenario.infrastructure.filter(i => i.category === 'shelters').length
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Top Banner / Operator Greeting */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        paddingBottom: '20px',
        borderBottom: '1px solid var(--border-subtle)'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              Tactical Command Center
            </span>
            <span style={{ color: 'var(--border-subtle)' }}>•</span>
            <span className="font-mono text-cyan" style={{ fontSize: '12px' }}>
              SECTOR EAST COAST
            </span>
          </div>
          <h1 className="font-display font-bold" style={{ fontSize: '26px', color: 'var(--text-primary)', marginTop: '4px' }}>
            Good morning, {user?.name || "Operator"}
          </h1>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '12px', color: 'var(--text-dim)' }}>Target Scenario</div>
            <div className="font-display font-semibold" style={{ fontSize: '14px', color: 'var(--text-primary)' }}>
              {scenario.name}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              padding: '6px 12px',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(0, 240, 255, 0.08)',
              border: '1px solid var(--border-cyan)',
              fontSize: '11px',
              fontWeight: 600,
              color: 'var(--accent-cyan)'
            }}>
              SIMULATION ACTIVE
            </div>
            <div style={{
              padding: '6px 10px',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid var(--border-subtle)',
              fontSize: '11px',
              fontWeight: 500,
              color: 'var(--text-dim)'
            }}>
              DEMO DATA
            </div>
          </div>
        </div>
      </div>

      {/* Summary Metrics Row */}
      <div
        className="metrics-grid-responsive"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '14px'
        }}
      >
        <MetricCard
          label="Sustained Wind"
          value={scenario.currentConditions.windSpeed}
          unit="km/h"
          icon={Wind}
          severity="high"
          subtext="Category 3 Gusts"
          onClick={() => navigate('/app/storm')}
        />
        <MetricCard
          label="24h Precipitation"
          value={scenario.currentConditions.rainfall}
          unit="mm"
          icon={CloudRain}
          severity="critical"
          subtext="Runoff Saturated"
          onClick={() => navigate('/app/storm')}
        />
        <MetricCard
          label="Storm Surge Height"
          value={scenario.currentConditions.stormSurge}
          unit="m"
          icon={Waves}
          severity="critical"
          subtext="+0.4m over levee"
          onClick={() => navigate('/app/map')}
        />
        <MetricCard
          label="Estimated Landfall"
          value="08h 24m"
          icon={Clock}
          severity="warning"
          subtext="Tracking WNW at 18 km/h"
          onClick={() => navigate('/app/storm')}
        />
      </div>

      {/* Middle Section: Risk Summary & Explainability */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: '24px'
      }}>
        {/* Risk Summary Gauge Card */}
        <div className="surface-card" style={{ padding: '28px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Composite Risk Index
            </span>
            <Link to="/app/risk" style={{ fontSize: '12px', color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span>Explain</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          <RiskGauge
            score={baselineRisk.score}
            severity={baselineRisk.severity}
            size={220}
          />

          <p style={{
            fontSize: '12px',
            color: 'var(--text-secondary)',
            textAlign: 'center',
            marginTop: '16px',
            lineHeight: 1.6,
            maxWidth: '380px'
          }}>
            {baselineRisk.formulaDescription}
          </p>
        </div>

        {/* Explainable Factor Breakdown */}
        <div className="surface-card" style={{ padding: '28px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <h2 className="font-display font-semibold" style={{ fontSize: '16px', color: 'var(--text-primary)' }}>
                Explainable Vulnerability Engine
              </h2>
              <Badge severity="info">Deterministic</Badge>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '20px' }}>
              Overall threat combines sustained atmospheric wind shear, peak rainfall accumulation, hydrodynamic surge overtopping, and regional infrastructure vulnerability.
            </p>

            <ContributionBar factors={baselineRisk.factors} />
          </div>

          <div style={{
            marginTop: '20px',
            padding: '12px 16px',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Simulate intensifications or variable tracks:
            </span>
            <Link to="/app/simulator" className="btn btn-secondary btn-sm">
              Launch Simulator
            </Link>
          </div>
        </div>
      </div>

      {/* Priority Areas (Show only 3 most important zones) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 className="font-display font-bold" style={{ fontSize: '17px', color: 'var(--text-primary)' }}>
              Priority Risk Areas
            </h2>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              Top 3 vulnerable geographic corridors requiring immediate containment
            </p>
          </div>
          <Link to="/app/risk" style={{ fontSize: '12px', color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span>View All 5 Zones</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '16px'
        }}>
          {priorityZones.map((zone) => (
            <div
              key={zone.id}
              onClick={() => setSelectedZone(zone)}
              className="surface-card interactive cursor-pointer"
              style={{
                padding: '20px',
                borderColor: zone.riskScore >= 80 ? 'rgba(239, 68, 68, 0.35)' : 'var(--border-subtle)',
                position: 'relative'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div>
                  <span className="font-mono text-cyan" style={{ fontSize: '11px', fontWeight: 600 }}>
                    {zone.code}
                  </span>
                  <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', marginTop: '2px' }}>
                    {zone.name}
                  </h3>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className="font-display font-bold" style={{ fontSize: '20px', color: zone.riskScore >= 80 ? 'var(--color-critical)' : 'var(--color-warning)' }}>
                    {zone.riskScore}
                  </div>
                  <Badge severity={zone.severity}>
                    {zone.severity}
                  </Badge>
                </div>
              </div>

              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-dim)' }}>Population:</span>
                  <span>{zone.population.toLocaleString()} residents</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-dim)' }}>Primary Hazard:</span>
                  <span style={{ color: 'var(--text-primary)' }}>{zone.vulnerabilityFactors[0]}</span>
                </div>
              </div>

              <div style={{
                marginTop: '14px',
                paddingTop: '10px',
                borderTop: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '11px',
                color: 'var(--accent-cyan)'
              }}>
                <span>Click for vulnerability determinants</span>
                <ChevronRight size={14} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Critical Infrastructure Category Counters */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 className="font-display font-bold" style={{ fontSize: '16px', color: 'var(--text-primary)' }}>
              Critical Infrastructure Status
            </h2>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              Monitored facilities, power gateways, transportation causeways, and emergency shelters
            </p>
          </div>
          <Link to="/app/infrastructure" style={{ fontSize: '12px', color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span>Full Inventory</span>
            <ArrowRight size={13} />
          </Link>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
          gap: '12px'
        }}>
          <Link to="/app/infrastructure" className="surface-card interactive" style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: 32, height: 32, borderRadius: 'var(--radius-sm)', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#EF4444', flexShrink: 0 }}>
              <Building2 size={16} />
            </div>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Hospitals</div>
              <div className="font-display font-bold" style={{ fontSize: '16px', color: 'var(--text-primary)' }}>
                3 <span style={{ fontSize: '11px', color: '#EF4444', fontWeight: 500 }}>(2 At Risk)</span>
              </div>
            </div>
          </Link>

          <Link to="/app/infrastructure" className="surface-card interactive" style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: 32, height: 32, borderRadius: 'var(--radius-sm)', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F59E0B', flexShrink: 0 }}>
              <Zap size={16} />
            </div>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Power Grid Hubs</div>
              <div className="font-display font-bold" style={{ fontSize: '16px', color: 'var(--text-primary)' }}>
                2 <span style={{ fontSize: '11px', color: '#EF4444', fontWeight: 500 }}>(Substation 07 Critical)</span>
              </div>
            </div>
          </Link>

          <Link to="/app/infrastructure" className="surface-card interactive" style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: 32, height: 32, borderRadius: 'var(--radius-sm)', background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#A78BFA', flexShrink: 0 }}>
              <Navigation size={16} />
            </div>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Evacuation Arterials</div>
              <div className="font-display font-bold" style={{ fontSize: '16px', color: 'var(--text-primary)' }}>
                2 <span style={{ fontSize: '11px', color: '#EF4444', fontWeight: 500 }}>(R14 Inundated)</span>
              </div>
            </div>
          </Link>

          <Link to="/app/infrastructure" className="surface-card interactive" style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: 32, height: 32, borderRadius: 'var(--radius-sm)', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10B981', flexShrink: 0 }}>
              <Shield size={16} />
            </div>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Safe Shelters</div>
              <div className="font-display font-bold" style={{ fontSize: '16px', color: 'var(--text-primary)' }}>
                2 <span style={{ fontSize: '11px', color: '#10B981', fontWeight: 500 }}>(S12 Ready)</span>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Bottom Pair: Latest AI Insight & Recommended Next Action */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: '20px'
      }}>
        {/* Latest AI Insight */}
        <div className="surface-card" style={{
          padding: '24px',
          borderColor: 'rgba(0, 240, 255, 0.25)',
          background: 'radial-gradient(ellipse at top left, rgba(0, 240, 255, 0.05), transparent 70%), var(--bg-card)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={16} color="var(--accent-cyan)" />
              <span className="font-display font-semibold text-cyan" style={{ fontSize: '14px' }}>
                Latest AI Decision Support Insight
              </span>
            </div>
            <Link to="/app/ai" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              Command Center →
            </Link>
          </div>

          <p style={{ fontSize: '13px', color: 'var(--text-primary)', lineHeight: 1.6 }}>
            "Hydrodynamic surge wave of 3.2m coincides with high tide in 8.4 hours. Zone 04 levee overtopping is guaranteed, severing Highway R14 and cutting off Coastal Medical Center. Recommend immediate forward-deployment of amphibious transport to execute pre-landfall evacuation."
          </p>

          <div style={{ marginTop: '14px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '11px', color: 'var(--text-dim)' }}>
            <span>Model: Gemini 1.5 Flash / Cascade Engine</span>
            <span>•</span>
            <span className="text-cyan font-mono">92% Confidence</span>
          </div>
        </div>

        {/* Recommended Next Action */}
        <div className="surface-card" style={{
          padding: '24px',
          borderColor: 'rgba(239, 68, 68, 0.35)',
          background: 'radial-gradient(ellipse at top right, rgba(239, 68, 68, 0.05), transparent 70%), var(--bg-card)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldAlert size={16} color="var(--color-critical)" />
                <span className="font-display font-semibold" style={{ fontSize: '14px', color: 'var(--color-critical)' }}>
                  Recommended Next Action
                </span>
              </div>
              <Badge severity="critical" pulse>PRIORITY 1</Badge>
            </div>

            <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
              Execute Urgent Evacuation Transfer for Zone 04 & Shelter S08
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Single escape route R14 will become impassable within 150 minutes. Dispatch all available high-clearance military convoys before peak high tide.
            </p>
          </div>

          <div style={{ marginTop: '18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-dim)' }}>
              Assigned to: National Disaster Response Team Alpha
            </span>
            <Button
              variant="primary"
              size="sm"
              iconRight={ArrowRight}
              onClick={() => navigate('/app/response')}
            >
              Open Response Planner
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
