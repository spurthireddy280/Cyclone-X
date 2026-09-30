import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, Sparkles, Menu, ShieldAlert, Cpu } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAlerts } from '../../context/AlertsContext';
import { useScenario } from '../../context/ScenarioContext';
import StatusIndicator from '../common/StatusIndicator';
import Badge from '../common/Badge';

export default function Header({ onToggleMobileSidebar }) {
  const { user } = useAuth();
  const { unreadCount } = useAlerts();
  const { scenario, baselineRisk } = useScenario();
  const navigate = useNavigate();

  return (
    <header
      className="app-header header"
      style={{
        height: 'var(--header-height)',
        background: 'var(--bg-glass)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        flexShrink: 0
      }}
    >
      {/* Left: Mobile Toggle & Scenario Context */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {onToggleMobileSidebar && (
          <button
            onClick={onToggleMobileSidebar}
            className="mobile-only"
            aria-label="Toggle navigation menu"
            style={{
              padding: '6px',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              background: 'rgba(255, 255, 255, 0.04)'
            }}
          >
            <Menu size={18} />
          </button>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="font-display font-semibold" style={{ fontSize: '13.5px', color: 'var(--text-primary)' }}>
                {scenario.name}
              </span>
              <Badge severity="warning">
                Cat {scenario.category}
              </Badge>
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>Landfall: {scenario.currentConditions.landfallEstimateHours}h</span>
              <span className="desktop-only">•</span>
              <span className="font-mono text-cyan desktop-only">Wind: {scenario.currentConditions.windSpeed} km/h</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right: Status, AI Shortcut, Alerts Badge & Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {/* System Simulation Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div className="desktop-only">
            <StatusIndicator status="SIMULATION ACTIVE" variant="active" />
          </div>
          <span
            className="font-mono"
            style={{
              fontSize: '10px',
              padding: '2px 7px',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(0, 240, 255, 0.06)',
              border: '1px solid var(--border-cyan-subtle)',
              color: 'var(--accent-cyan)',
              letterSpacing: '0.04em'
            }}
          >
            DEMO DATA
          </span>
        </div>

        {/* Quick AI Trigger */}
        <Link
          to="/app/ai"
          className="btn btn-secondary btn-sm"
          style={{
            borderColor: 'rgba(0, 240, 255, 0.3)',
            background: 'rgba(0, 240, 255, 0.05)',
            color: 'var(--accent-cyan)',
            padding: '6px 10px'
          }}
          title="AI Reasoning"
        >
          <Sparkles size={14} />
          <span className="desktop-only">AI Reasoning</span>
        </Link>

        {/* Alerts Bell with Unread Count */}
        <Link
          to="/app/alerts"
          style={{
            position: 'relative',
            padding: '8px',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid var(--border-subtle)',
            color: 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all var(--transition-fast)'
          }}
          title={`${unreadCount} Unread Alerts`}
        >
          <Bell size={17} />
          {unreadCount > 0 && (
            <span
              style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                background: 'var(--color-critical)',
                color: '#FFFFFF',
                borderRadius: 'var(--radius-full)',
                fontSize: '10px',
                fontWeight: 700,
                minWidth: '16px',
                height: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0 4px',
                boxShadow: '0 0 8px rgba(239, 68, 68, 0.7)'
              }}
            >
              {unreadCount}
            </span>
          )}
        </Link>

        {/* User Avatar */}
        <div style={{
          width: 32,
          height: 32,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #00F0FF 0%, #6366F1 100%)',
          color: '#06080D',
          fontSize: '12px',
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 10px rgba(0, 240, 255, 0.25)'
        }}>
          {user?.avatar || "OP"}
        </div>
      </div>
    </header>
  );
}
