import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import Drawer from '../common/Drawer';
import Badge from '../common/Badge';
import Button from '../common/Button';
import { useScenario } from '../../context/ScenarioContext';
import {
  Building2,
  Zap,
  Navigation,
  Shield,
  Activity,
  AlertTriangle,
  CheckCircle,
  ExternalLink,
  Users
} from 'lucide-react';

export default function AppShell() {
  const [isCollapsed, setIsCollapsed] = useState(() => {
    try {
      return localStorage.getItem('cyclonex_sidebar_collapsed') === 'true';
    } catch {
      return false;
    }
  });
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const {
    selectedInfra,
    setSelectedInfra,
    selectedZone,
    setSelectedZone
  } = useScenario();

  const handleToggleCollapse = () => {
    setIsCollapsed(prev => {
      const next = !prev;
      try {
        localStorage.setItem('cyclonex_sidebar_collapsed', next.toString());
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  };

  return (
    <div className="app-shell" style={{ display: 'flex', height: '100vh', width: '100%', overflow: 'hidden', background: 'var(--bg-primary)', position: 'relative' }}>
      {/* Sidebar */}
      <Sidebar
        isCollapsed={isCollapsed}
        onToggleCollapse={handleToggleCollapse}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="app-main" style={{ height: '100vh', minWidth: 0, flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto', overflowX: 'hidden', position: 'relative' }}>
        <Header onToggleMobileSidebar={() => setMobileSidebarOpen(prev => !prev)} />

        <main className="page-content" style={{ flex: 1, minHeight: 0, padding: '24px 28px', maxWidth: '1600px', width: '100%', margin: '0 auto' }}>
          <div className="page-enter">
            <Outlet />
          </div>
        </main>
      </div>

      {/* ============================================================
          GLOBAL INFRASTRUCTURE DETAIL DRAWER
          ============================================================ */}
      <Drawer
        isOpen={!!selectedInfra}
        onClose={() => setSelectedInfra(null)}
        title={selectedInfra?.name}
        subtitle={`${selectedInfra?.type} • ${selectedInfra?.zone}`}
      >
        {selectedInfra && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Status & Risk Banner */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 16px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid var(--border-subtle)'
            }}>
              <div>
                <span style={{ fontSize: '11px', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Current Status</span>
                <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {selectedInfra.currentStatus}
                </div>
              </div>
              <Badge severity={selectedInfra.risk} pulse={selectedInfra.risk === 'CRITICAL'}>
                {selectedInfra.risk} RISK
              </Badge>
            </div>

            {/* Exposure Breakdown */}
            <div className="surface-card" style={{ padding: '16px' }}>
              <span className="font-display font-semibold" style={{ fontSize: '13px', color: 'var(--text-primary)' }}>
                Multi-Hazard Exposure Rating
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '12px' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Overall Threat Index</span>
                    <span className="font-mono text-cyan font-bold">{selectedInfra.exposure}%</span>
                  </div>
                  <div style={{ height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                    <div style={{ width: `${selectedInfra.exposure}%`, height: '100%', background: 'var(--accent-cyan)' }} />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Flood / Surge Exposure</span>
                    <span className="font-mono font-bold" style={{ color: 'var(--color-critical)' }}>{selectedInfra.floodExposure}%</span>
                  </div>
                  <div style={{ height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                    <div style={{ width: `${selectedInfra.floodExposure}%`, height: '100%', background: 'var(--color-critical)' }} />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Wind Shear Stress</span>
                    <span className="font-mono font-bold" style={{ color: 'var(--color-warning)' }}>{selectedInfra.windExposure}%</span>
                  </div>
                  <div style={{ height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                    <div style={{ width: `${selectedInfra.windExposure}%`, height: '100%', background: 'var(--color-warning)' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Operating Parameters */}
            <div className="surface-card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <span className="font-display font-semibold" style={{ fontSize: '13px', color: 'var(--text-primary)' }}>
                Operational Profile
              </span>
              <div style={{ fontSize: '12px', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '6px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Capacity / Footprint</span>
                <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{selectedInfra.capacity}</span>
              </div>
              <div style={{ fontSize: '12px', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '6px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Backup Power Systems</span>
                <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{selectedInfra.backupPower}</span>
              </div>
              <div style={{ fontSize: '12px', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Primary Arterial Access</span>
                <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{selectedInfra.access}</span>
              </div>
            </div>

            {/* Critical Dependencies */}
            {selectedInfra.dependencies && (
              <div>
                <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Critical Upstream Dependencies
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
                  {selectedInfra.dependencies.map((dep, idx) => (
                    <span
                      key={idx}
                      style={{
                        padding: '4px 10px',
                        borderRadius: 'var(--radius-sm)',
                        background: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid var(--border-subtle)',
                        fontSize: '11px',
                        color: 'var(--text-secondary)'
                      }}
                    >
                      {dep}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* AI Recommendation */}
            <div style={{
              padding: '16px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(0, 240, 255, 0.06)',
              border: '1px solid rgba(0, 240, 255, 0.3)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <Activity size={16} color="var(--accent-cyan)" />
                <span className="font-display font-semibold text-cyan" style={{ fontSize: '13px' }}>
                  AI Tactical Recommendation
                </span>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-primary)', lineHeight: 1.5 }}>
                {selectedInfra.aiRecommendation}
              </p>
            </div>
          </div>
        )}
      </Drawer>

      {/* ============================================================
          GLOBAL ZONE DETAIL DRAWER
          ============================================================ */}
      <Drawer
        isOpen={!!selectedZone}
        onClose={() => setSelectedZone(null)}
        title={`${selectedZone?.code} — ${selectedZone?.name}`}
        subtitle="Explainable Vulnerability Engine Analysis"
      >
        {selectedZone && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid var(--border-subtle)'
            }}>
              <div>
                <span style={{ fontSize: '11px', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Composite Risk Rating</span>
                <div className="font-display font-bold" style={{ fontSize: '28px', color: selectedZone.riskScore >= 75 ? 'var(--color-critical)' : 'var(--color-warning)' }}>
                  {selectedZone.riskScore} <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-muted)' }}>/ 100</span>
                </div>
              </div>
              <Badge severity={selectedZone.severity} pulse={selectedZone.severity === 'CRITICAL'}>
                {selectedZone.severity}
              </Badge>
            </div>

            <div className="surface-card" style={{ padding: '16px' }}>
              <span className="font-display font-semibold" style={{ fontSize: '13px', color: 'var(--text-primary)' }}>
                Zone Demographics & Exposure
              </span>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '12px' }}>
                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '10px', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>Population at Risk</div>
                  <div className="font-mono font-bold" style={{ fontSize: '16px', color: 'var(--text-primary)', marginTop: '2px' }}>
                    {selectedZone.population.toLocaleString()}
                  </div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '10px', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>Critical Facilities</div>
                  <div className="font-mono font-bold" style={{ fontSize: '16px', color: 'var(--accent-cyan)', marginTop: '2px' }}>
                    {selectedZone.infrastructureCount} Nodes
                  </div>
                </div>
              </div>
            </div>

            {/* Why is this zone vulnerable? */}
            <div>
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Explainable Vulnerability Determinants
              </span>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px', listStyle: 'none' }}>
                {selectedZone.vulnerabilityFactors?.map((factor, idx) => (
                  <li
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '8px',
                      fontSize: '12px',
                      color: 'var(--text-secondary)',
                      background: 'rgba(255, 255, 255, 0.02)',
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-subtle)'
                    }}
                  >
                    <AlertTriangle size={14} color="var(--color-warning)" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span>{factor}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
