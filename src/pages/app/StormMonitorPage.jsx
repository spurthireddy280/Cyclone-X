import React from 'react';
import { useScenario } from '../../context/ScenarioContext';
import CycloneRadarCanvas from '../../components/visualization/CycloneRadarCanvas';
import PageHeader from '../../components/common/PageHeader';
import MetricCard from '../../components/common/MetricCard';
import Badge from '../../components/common/Badge';
import {
  Wind,
  CloudRain,
  Waves,
  Gauge,
  Clock,
  Compass,
  CheckCircle2,
  CircleDot,
  Radio,
  Navigation
} from 'lucide-react';

export default function StormMonitorPage() {
  const { scenario } = useScenario();
  const { currentConditions, timeline } = scenario;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <PageHeader
        title={`${scenario.name} — Meteorological Monitor`}
        subtitle="Multi-spectral simulated cyclone telemetry, Doppler vortex tracking, and landfall path projection"
        badge={
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <Badge severity="warning">Category {scenario.category} Severe Storm</Badge>
            <Badge severity="neutral">SIMULATION DATA</Badge>
          </div>
        }
        breadcrumbs={['Command Hub', 'Storm Monitor']}
      />

      {/* Main Meteorological Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
        gap: '24px'
      }}>
        {/* Left: Doppler Radar Vortex Visualization */}
        <div className="surface-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Simulated Doppler Convective Sweep
            </span>
            <span className="font-mono text-cyan" style={{ fontSize: '11px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Radio size={13} className="animate-pulse" />
              SIMULATION TELEMETRY
            </span>
          </div>

          <CycloneRadarCanvas
            width={380}
            height={380}
            windSpeed={currentConditions.windSpeed}
            stormName={scenario.name}
          />

          <div style={{
            marginTop: '20px',
            width: '100%',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: '12px',
            background: 'rgba(255, 255, 255, 0.02)',
            padding: '12px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
            textAlign: 'center'
          }}>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>Eye Diameter</div>
              <div className="font-mono font-bold text-cyan" style={{ fontSize: '14px', marginTop: '2px' }}>
                {currentConditions.eyeDiameter} km
              </div>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>Forward Velocity</div>
              <div className="font-mono font-bold text-cyan" style={{ fontSize: '14px', marginTop: '2px' }}>
                {currentConditions.movementSpeed} km/h
              </div>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>Heading</div>
              <div className="font-mono font-bold text-cyan" style={{ fontSize: '14px', marginTop: '2px' }}>
                {currentConditions.movementDirection}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Dynamic Storm Conditions Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="surface-card" style={{ padding: '24px' }}>
            <h2 className="font-display font-semibold" style={{ fontSize: '16px', color: 'var(--text-primary)', marginBottom: '16px' }}>
              Atmospheric Conditions at Eye Wall
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              {/* Wind Card with Animation */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '16px',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Wind Speed</span>
                  <Wind size={16} color="var(--accent-cyan)" />
                </div>
                <div className="font-display font-bold text-cyan" style={{ fontSize: '24px', margin: '8px 0 4px' }}>
                  {currentConditions.windSpeed} <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>km/h</span>
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                  Sustained 1-min gust peak: 165 km/h
                </div>
              </div>

              {/* Central Pressure */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '16px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Barometer</span>
                  <Gauge size={16} color="#38BDF8" />
                </div>
                <div className="font-display font-bold" style={{ fontSize: '24px', color: '#38BDF8', margin: '8px 0 4px' }}>
                  {currentConditions.centralPressure} <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>hPa</span>
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                  Deep tropical depression (-28 hPa)
                </div>
              </div>

              {/* 24h Rainfall */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '16px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Precipitation</span>
                  <CloudRain size={16} color="#818CF8" />
                </div>
                <div className="font-display font-bold" style={{ fontSize: '24px', color: '#818CF8', margin: '8px 0 4px' }}>
                  {currentConditions.rainfall} <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>mm</span>
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                  Extreme orographic torrents
                </div>
              </div>

              {/* Storm Surge */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '16px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Storm Surge</span>
                  <Waves size={16} color="var(--color-critical)" />
                </div>
                <div className="font-display font-bold" style={{ fontSize: '24px', color: 'var(--color-critical)', margin: '8px 0 4px' }}>
                  {currentConditions.stormSurge} <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>m</span>
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                  Levee freeboard exceeded (+0.4m)
                </div>
              </div>
            </div>
          </div>

          {/* Landfall Forecast Summary */}
          <div className="surface-card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <Navigation size={18} color="var(--accent-cyan)" />
              <span className="font-display font-semibold" style={{ fontSize: '14px', color: 'var(--text-primary)' }}>
                Target Coastal Impact Corridor
              </span>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Center forecast to make landfall along the coastal estuary (Coordinates 17.48°N, 83.15°E) in approximately <strong>08h 24m</strong>. High-tide astronomical surge overlap expected to produce maximum wave inundation across maritime docks and agricultural lowlands.
            </p>
          </div>
        </div>
      </div>

      {/* Chronological Storm Evolution Timeline */}
      <div className="surface-card" style={{ padding: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h2 className="font-display font-bold" style={{ fontSize: '18px', color: 'var(--text-primary)' }}>
              Storm Lifecycle & Projections
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              Evolution from offshore convective depression to Category 3 landfall and inland decay
            </p>
          </div>
          <Badge severity="info">UTC +05:30 Synchronized</Badge>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
          {timeline.map((step, idx) => {
            const isLast = idx === timeline.length - 1;
            return (
              <div key={idx} style={{ display: 'flex', gap: '20px' }}>
                {/* Time & Dot Column */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '90px', flexShrink: 0 }}>
                  <span className="font-mono" style={{ fontSize: '12px', fontWeight: 600, color: step.current ? 'var(--accent-cyan)' : 'var(--text-muted)' }}>
                    {step.time}
                  </span>
                  <div style={{
                    width: step.current ? '16px' : '10px',
                    height: step.current ? '16px' : '10px',
                    borderRadius: '50%',
                    background: step.current ? 'var(--accent-cyan)' : step.completed ? 'var(--color-success)' : 'rgba(255, 255, 255, 0.2)',
                    boxShadow: step.current ? '0 0 10px var(--accent-cyan)' : 'none',
                    margin: '8px 0',
                    border: step.current ? '2px solid #06080D' : 'none'
                  }} />
                  {!isLast && (
                    <div style={{
                      width: '2px',
                      flex: 1,
                      minHeight: '44px',
                      background: step.completed ? 'rgba(16, 185, 129, 0.4)' : 'rgba(255, 255, 255, 0.08)'
                    }} />
                  )}
                </div>

                {/* Event Card */}
                <div style={{
                  flex: 1,
                  paddingBottom: isLast ? '0' : '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <h3 style={{ fontSize: '14px', fontWeight: 600, color: step.current ? 'var(--accent-cyan)' : 'var(--text-primary)' }}>
                      {step.title}
                    </h3>
                    <Badge severity={step.current ? 'warning' : step.projected ? 'neutral' : 'success'}>
                      {step.category}
                    </Badge>
                  </div>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    {step.description}
                  </p>
                  <div style={{ display: 'flex', gap: '14px', fontSize: '11px', color: 'var(--text-dim)', marginTop: '4px' }}>
                    <span className="font-mono">Wind: {step.wind} km/h</span>
                    <span>•</span>
                    <span className="font-mono">Pressure: {step.pressure} hPa</span>
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
