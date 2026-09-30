import React, { useState, useMemo } from 'react';
import { useScenario } from '../../context/ScenarioContext';
import PageHeader from '../../components/common/PageHeader';
import Tabs from '../../components/common/Tabs';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import {
  Building2,
  Zap,
  Navigation,
  Shield,
  Search,
  Filter,
  ArrowUpDown,
  ChevronRight,
  AlertTriangle,
  Activity
} from 'lucide-react';

export default function InfrastructurePage() {
  const { scenario, setSelectedInfra } = useScenario();

  const [activeTab, setActiveTab] = useState('all');
  const [filterSeverity, setFilterSeverity] = useState('ALL');
  const [sortOption, setSortOption] = useState('riskDesc'); // 'riskDesc' | 'riskAsc' | 'exposureDesc'
  const [searchQuery, setSearchQuery] = useState('');

  const tabs = [
    { id: 'all', label: 'All Assets', icon: Activity, count: scenario.infrastructure.length },
    { id: 'hospitals', label: 'Hospitals', icon: Building2, count: scenario.infrastructure.filter(i => i.category === 'hospitals').length },
    { id: 'power', label: 'Power Grid', icon: Zap, count: scenario.infrastructure.filter(i => i.category === 'power').length },
    { id: 'roads', label: 'Road Corridors', icon: Navigation, count: scenario.infrastructure.filter(i => i.category === 'roads').length },
    { id: 'shelters', label: 'Shelters', icon: Shield, count: scenario.infrastructure.filter(i => i.category === 'shelters').length }
  ];

  // Filtering & Sorting logic
  const filteredAssets = useMemo(() => {
    return scenario.infrastructure
      .filter(item => {
        // Tab category
        if (activeTab !== 'all' && item.category !== activeTab) return false;
        // Severity filter
        if (filterSeverity !== 'ALL' && item.risk.toUpperCase() !== filterSeverity) return false;
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = item.name.toLowerCase().includes(q);
          const matchZone = item.zone.toLowerCase().includes(q);
          const matchType = item.type.toLowerCase().includes(q);
          if (!matchName && !matchZone && !matchType) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortOption === 'riskDesc') {
          return b.exposure - a.exposure;
        } else if (sortOption === 'riskAsc') {
          return a.exposure - b.exposure;
        } else if (sortOption === 'floodDesc') {
          return b.floodExposure - a.floodExposure;
        }
        return 0;
      });
  }, [scenario.infrastructure, activeTab, filterSeverity, sortOption, searchQuery]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <PageHeader
        title="Infrastructure Vulnerability & Intelligence"
        subtitle="Critical facility inventory, flood inundation vulnerability, electrical dependencies, and tactical mitigations"
        breadcrumbs={['Command Hub', 'Infrastructure']}
      />

      {/* Navigation Tabs */}
      <Tabs
        tabs={tabs}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {/* Filter, Search & Sort Toolbar */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '14px',
        padding: '14px 18px',
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)'
      }}>
        {/* Search Input */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(255, 255, 255, 0.04)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '6px 12px',
          flex: '1 1 200px',
          maxWidth: '320px'
        }}>
          <Search size={15} color="var(--text-muted)" />
          <input
            type="text"
            placeholder="Search facility name or zone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '100%', fontSize: '12px', color: 'var(--text-primary)' }}
          />
        </div>

        {/* Severity Filter Chips */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', overflowX: 'auto' }}>
          <span style={{ fontSize: '11px', color: 'var(--text-dim)', marginRight: '4px' }}>SEVERITY:</span>
          {['ALL', 'CRITICAL', 'HIGH', 'MODERATE', 'LOW'].map((sev) => {
            const isSelected = filterSeverity === sev;
            return (
              <button
                key={sev}
                onClick={() => setFilterSeverity(sev)}
                style={{
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '11px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  background: isSelected ? 'var(--accent-cyan)' : 'rgba(255, 255, 255, 0.04)',
                  color: isSelected ? '#06080D' : 'var(--text-secondary)',
                  border: isSelected ? '1px solid var(--accent-cyan)' : '1px solid var(--border-subtle)',
                  transition: 'all var(--transition-fast)'
                }}
              >
                {sev}
              </button>
            );
          })}
        </div>

        {/* Sorting Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ArrowUpDown size={14} color="var(--text-muted)" />
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            style={{
              padding: '6px 10px',
              fontSize: '12px',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--text-primary)',
              cursor: 'pointer'
            }}
          >
            <option value="riskDesc" style={{ background: '#0E1424' }}>Highest Exposure First</option>
            <option value="riskAsc" style={{ background: '#0E1424' }}>Lowest Exposure First</option>
            <option value="floodDesc" style={{ background: '#0E1424' }}>Highest Flood Risk First</option>
          </select>
        </div>
      </div>

      {/* Asset Cards List */}
      {filteredAssets.length === 0 ? (
        <div className="surface-card" style={{ padding: '48px', textAlign: 'center' }}>
          <AlertTriangle size={32} color="var(--text-muted)" style={{ margin: '0 auto 12px' }} />
          <h3 className="font-display font-semibold" style={{ fontSize: '16px', color: 'var(--text-primary)' }}>
            No infrastructure assets matched your filters
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Try adjusting your search query or reset the severity filter.
          </p>
          <button
            onClick={() => { setFilterSeverity('ALL'); setSearchQuery(''); }}
            className="btn btn-secondary btn-sm"
            style={{ marginTop: '16px' }}
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          {filteredAssets.map((asset) => {
            const isCritical = asset.risk === 'CRITICAL';
            return (
              <div
                key={asset.id}
                onClick={() => setSelectedInfra(asset)}
                className="surface-card interactive cursor-pointer"
                style={{
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '14px',
                  borderColor: isCritical ? 'rgba(239, 68, 68, 0.35)' : 'var(--border-subtle)'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <div>
                      <span className="font-mono text-cyan" style={{ fontSize: '11px' }}>
                        {asset.zone} • {asset.type}
                      </span>
                      <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', marginTop: '2px' }}>
                        {asset.name}
                      </h3>
                    </div>
                    <Badge severity={asset.risk} pulse={isCritical}>
                      {asset.risk}
                    </Badge>
                  </div>

                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-dim)' }}>Capacity:</span>
                      <span style={{ color: 'var(--text-primary)' }}>{asset.capacity}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-dim)' }}>Backup Power:</span>
                      <span style={{ color: 'var(--text-primary)' }}>{asset.backupPower}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-dim)' }}>Access Corridor:</span>
                      <span style={{ color: 'var(--text-primary)' }}>{asset.access}</span>
                    </div>
                  </div>

                  {/* Exposure Bar */}
                  <div style={{ marginTop: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '4px' }}>
                      <span style={{ color: 'var(--text-dim)' }}>Total Exposure</span>
                      <span className="font-mono text-cyan font-bold">{asset.exposure}%</span>
                    </div>
                    <div style={{ height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                      <div
                        style={{
                          width: `${asset.exposure}%`,
                          height: '100%',
                          background: isCritical ? 'var(--color-critical)' : 'var(--accent-cyan)'
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div style={{
                  paddingTop: '10px',
                  borderTop: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '11px',
                  color: 'var(--accent-cyan)'
                }}>
                  <span>View dependencies & AI mitigation</span>
                  <ChevronRight size={14} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
