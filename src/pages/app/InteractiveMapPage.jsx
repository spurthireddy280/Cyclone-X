import React, { useState } from 'react';
import { useScenario } from '../../context/ScenarioContext';
import InteractiveMap from '../../components/map/InteractiveMap';
import PageHeader from '../../components/common/PageHeader';
import Badge from '../../components/common/Badge';
import { ShieldCheck, Info } from 'lucide-react';

export default function InteractiveMapPage() {
  const { scenario, dynamicZones, setSelectedInfra, setSelectedZone } = useScenario();
  const [basemapStatus, setBasemapStatus] = useState('checking'); // 'online' | 'unavailable'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <PageHeader
        title="Interactive Risk & Infrastructure Map"
        subtitle="Geospatial hazard intelligence simulation, infrastructure exposure nodes, and surge envelope tracking"
        badge={
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <Badge severity={basemapStatus === 'online' ? 'success' : 'warning'}>
              <span style={{
                display: 'inline-block',
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: basemapStatus === 'online' ? 'var(--color-safe)' : 'var(--color-warning)',
                marginRight: 6
              }} />
              {basemapStatus === 'online' ? 'BASEMAP ONLINE' : 'BASEMAP UNAVAILABLE'}
            </Badge>
            <Badge severity="neutral">SIMULATION DATA</Badge>
          </div>
        }
        breadcrumbs={['Command Hub', 'Risk Map']}
      />

      {/* Info Alert Strip */}
      <div style={{
        padding: '10px 16px',
        borderRadius: 'var(--radius-md)',
        background: 'rgba(0, 240, 255, 0.04)',
        border: '1px solid rgba(0, 240, 255, 0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '12px',
        color: 'var(--text-secondary)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Info size={15} color="var(--accent-cyan)" />
          <span>Click any infrastructure facility, electrical node, or risk zone to inspect exposure metrics and AI tactical recommendations.</span>
        </div>
        <span className="font-mono text-cyan" style={{ fontSize: '11px' }}>
          8 ACTIVE HAZARD LAYERS
        </span>
      </div>

      {/* Full-Height Leaflet Map */}
      <InteractiveMap
        scenario={scenario}
        dynamicZones={dynamicZones}
        onSelectInfra={setSelectedInfra}
        onSelectZone={setSelectedZone}
        onBasemapStatusChange={setBasemapStatus}
        height="calc(100vh - 220px)"
      />
    </div>
  );
}
