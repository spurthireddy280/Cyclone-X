import React, { useState } from 'react';
import { useSettings } from '../../context/SettingsContext';
import PageHeader from '../../components/common/PageHeader';
import Toggle from '../../components/common/Toggle';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import {
  Settings as SettingsIcon,
  Sun,
  Moon,
  Bell,
  Map as MapIcon,
  Cpu,
  Eye,
  Trash2,
  Check,
  ShieldAlert
} from 'lucide-react';

export default function SettingsPage() {
  const { settings, updateSetting, clearDemoData } = useSettings();
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [savedNotice, setSavedNotice] = useState(false);

  const showSavedIndicator = () => {
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2000);
  };

  const handleToggle = (key, val) => {
    updateSetting(key, val);
    showSavedIndicator();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '900px' }}>
      <PageHeader
        title="Platform Settings & Preferences"
        subtitle="Configure visualization aesthetics, telemetry notifications, default map layers, and local simulation persistence"
        badge={savedNotice ? <Badge severity="success"><Check size={12} /> Saved</Badge> : <Badge severity="neutral">Local Storage Persisted</Badge>}
        breadcrumbs={['Command Hub', 'Settings']}
      />

      {/* General Settings Section */}
      <div className="surface-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px' }}>
          <h2 className="font-display font-semibold" style={{ fontSize: '16px', color: 'var(--text-primary)' }}>
            General & Appearance
          </h2>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            System theme, typography contrast, and emergency notification settings
          </p>
        </div>

        {/* Theme Selector */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)' }}>Theme Mode</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Choose between deep space dark mode or high-contrast daylight mode</div>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => handleToggle('theme', 'dark')}
              className={`btn btn-sm ${settings.theme === 'dark' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Moon size={14} />
              <span>Dark</span>
            </button>
            <button
              onClick={() => handleToggle('theme', 'light')}
              className={`btn btn-sm ${settings.theme === 'light' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Sun size={14} />
              <span>Light</span>
            </button>
          </div>
        </div>

        {/* Notifications Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)' }}>Emergency Audio/Visual Alerts</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Display real-time banner notices when hydrodynamic water sensor thresholds are breached</div>
          </div>
          <Toggle
            checked={settings.notificationsEnabled}
            onChange={(val) => handleToggle('notificationsEnabled', val)}
            id="setting-notifications"
          />
        </div>
      </div>

      {/* Geospatial Map Settings */}
      <div className="surface-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px' }}>
          <h2 className="font-display font-semibold" style={{ fontSize: '16px', color: 'var(--text-primary)' }}>
            Geospatial Risk Map Defaults
          </h2>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            Default layers and telemetry polling behavior for the Leaflet interactive map
          </p>
        </div>

        {/* Default Layer Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)' }}>Default Map Preset</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Initial layers rendered upon opening the Interactive Risk Map</div>
          </div>
          <select
            value={settings.defaultMapLayer}
            onChange={(e) => handleToggle('defaultMapLayer', e.target.value)}
            style={{
              padding: '6px 12px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-medium)',
              color: 'var(--text-primary)',
              fontSize: '12px',
              cursor: 'pointer'
            }}
          >
            <option value="all" style={{ background: '#0E1424' }}>All Active Hazard Layers</option>
            <option value="zones" style={{ background: '#0E1424' }}>Vulnerability Zones Focus</option>
            <option value="infrastructure" style={{ background: '#0E1424' }}>Critical Infrastructure Focus</option>
            <option value="surge" style={{ background: '#0E1424' }}>Storm Surge Envelope Focus</option>
          </select>
        </div>

        {/* Auto Refresh Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)' }}>Auto-Refresh Telemetry Feed</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Automatically simulate new radar frames every 60 seconds</div>
          </div>
          <Toggle
            checked={settings.autoRefresh}
            onChange={(val) => handleToggle('autoRefresh', val)}
            id="setting-autorefresh"
          />
        </div>
      </div>

      {/* AI & Accessibility */}
      <div className="surface-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px' }}>
          <h2 className="font-display font-semibold" style={{ fontSize: '16px', color: 'var(--text-primary)' }}>
            AI Engine & Accessibility
          </h2>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            Reasoning model configuration and reduced motion display modes
          </p>
        </div>

        {/* AI Analysis Mode */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)' }}>AI Synthesis Strategy</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Deep multi-stage cascade reasoning vs rapid tactical response</div>
          </div>
          <select
            value={settings.aiAnalysisMode}
            onChange={(e) => handleToggle('aiAnalysisMode', e.target.value)}
            style={{
              padding: '6px 12px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-medium)',
              color: 'var(--text-primary)',
              fontSize: '12px',
              cursor: 'pointer'
            }}
          >
            <option value="deep" style={{ background: '#0E1424' }}>Deep Cascade Chain (6 Stages)</option>
            <option value="fast" style={{ background: '#0E1424' }}>Fast Tactical Response (3 Stages)</option>
          </select>
        </div>

        {/* Reduced Motion Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)' }}>Reduced Motion</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Disable radar sweeps, particle effects, and animated drawer transitions</div>
          </div>
          <Toggle
            checked={settings.reducedMotion}
            onChange={(val) => handleToggle('reducedMotion', val)}
            id="setting-motion"
          />
        </div>
      </div>

      {/* Data Management & Demo Reset */}
      <div className="surface-card" style={{ padding: '24px', borderColor: 'rgba(239, 68, 68, 0.3)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <h2 className="font-display font-semibold" style={{ fontSize: '16px', color: 'var(--color-critical)' }}>
            Data Management & Demo Reset
          </h2>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            Clear all cached scenario simulations, unread alert acknowledgments, response planner edits, and generated incident reports.
          </p>
        </div>

        {showClearConfirm ? (
          <div style={{
            padding: '16px',
            background: 'var(--color-critical-bg)',
            border: '1px solid var(--color-critical-border)',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px'
          }}>
            <span style={{ fontSize: '13px', color: 'var(--color-critical)' }}>
              Are you sure? This will reset all demo state to initial defaults.
            </span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => setShowClearConfirm(false)}
                className="btn btn-secondary btn-sm"
              >
                Cancel
              </button>
              <button
                onClick={clearDemoData}
                className="btn btn-danger btn-sm"
              >
                Yes, Reset All
              </button>
            </div>
          </div>
        ) : (
          <Button
            variant="danger"
            size="sm"
            icon={Trash2}
            onClick={() => setShowClearConfirm(true)}
            style={{ alignSelf: 'flex-start' }}
          >
            Clear Local Demo Data
          </Button>
        )}
      </div>
    </div>
  );
}
