import React, { useState } from 'react';
import { useAlerts } from '../../context/AlertsContext';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import {
  Bell,
  AlertTriangle,
  AlertOctagon,
  Info,
  CheckCheck,
  Check,
  Clock,
  MapPin,
  Filter
} from 'lucide-react';

export default function AlertsPage() {
  const { alerts, markAsRead, markAllAsRead, unreadCount } = useAlerts();
  const [filterType, setFilterType] = useState('ALL'); // 'ALL' | 'CRITICAL' | 'WARNING' | 'INFO' | 'UNREAD'

  const filteredAlerts = alerts.filter(a => {
    if (filterType === 'ALL') return true;
    if (filterType === 'UNREAD') return !a.read;
    return a.severity.toUpperCase() === filterType;
  });

  const getAlertIcon = (severity) => {
    switch (severity.toUpperCase()) {
      case 'CRITICAL':
        return <AlertOctagon size={18} color="var(--color-critical)" />;
      case 'WARNING':
        return <AlertTriangle size={18} color="var(--color-warning)" />;
      case 'INFO':
      default:
        return <Info size={18} color="var(--accent-cyan)" />;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <PageHeader
        title="Emergency Alerts & Threat Warnings"
        subtitle="Chronological feed of automated hydrodynamic alarms, sensor overtopping warnings, and utility alerts"
        badge={unreadCount > 0 ? <Badge severity="critical" pulse>{unreadCount} Unread</Badge> : <Badge severity="success">All Acknowledged</Badge>}
        breadcrumbs={['Command Hub', 'Alerts']}
        actions={
          unreadCount > 0 && (
            <Button
              variant="secondary"
              icon={CheckCheck}
              onClick={markAllAsRead}
            >
              Mark All as Read
            </Button>
          )
        }
      />

      {/* Filter Tabs Toolbar */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        padding: '14px 18px',
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflowX: 'auto' }}>
          <button
            onClick={() => setFilterType('ALL')}
            className={`btn btn-sm ${filterType === 'ALL' ? 'btn-primary' : 'btn-secondary'}`}
          >
            All Alerts ({alerts.length})
          </button>
          <button
            onClick={() => setFilterType('UNREAD')}
            className={`btn btn-sm ${filterType === 'UNREAD' ? 'btn-primary' : 'btn-secondary'}`}
          >
            Unread ({unreadCount})
          </button>
          <button
            onClick={() => setFilterType('CRITICAL')}
            className={`btn btn-sm ${filterType === 'CRITICAL' ? 'btn-primary' : 'btn-secondary'}`}
          >
            Critical
          </button>
          <button
            onClick={() => setFilterType('WARNING')}
            className={`btn btn-sm ${filterType === 'WARNING' ? 'btn-primary' : 'btn-secondary'}`}
          >
            Warnings
          </button>
          <button
            onClick={() => setFilterType('INFO')}
            className={`btn btn-sm ${filterType === 'INFO' ? 'btn-primary' : 'btn-secondary'}`}
          >
            Information
          </button>
        </div>
      </div>

      {/* Alerts Feed */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filteredAlerts.length === 0 ? (
          <div className="surface-card" style={{ padding: '48px', textAlign: 'center' }}>
            <CheckCheck size={36} color="var(--color-success)" style={{ margin: '0 auto 12px' }} />
            <h3 className="font-display font-semibold" style={{ fontSize: '16px', color: 'var(--text-primary)' }}>
              No alerts match the selected criteria
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
              All threat notices for this category have been acknowledged.
            </p>
          </div>
        ) : (
          filteredAlerts.map((alert) => {
            const isCritical = alert.severity === 'CRITICAL';
            const isUnread = !alert.read;

            return (
              <div
                key={alert.id}
                className="surface-card"
                style={{
                  padding: '18px 22px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  gap: '16px',
                  borderColor: isUnread
                    ? isCritical ? 'rgba(239, 68, 68, 0.45)' : 'rgba(0, 240, 255, 0.4)'
                    : 'var(--border-subtle)',
                  background: isUnread
                    ? isCritical ? 'rgba(239, 68, 68, 0.03)' : 'rgba(0, 240, 255, 0.02)'
                    : 'var(--bg-card)',
                  opacity: isUnread ? 1 : 0.8,
                  transition: 'all var(--transition-fast)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', flex: 1 }}>
                  <div style={{
                    width: 36,
                    height: 36,
                    borderRadius: 'var(--radius-sm)',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: '2px'
                  }}>
                    {getAlertIcon(alert.severity)}
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <Badge severity={alert.severity} pulse={isCritical && isUnread}>
                        {alert.severity}
                      </Badge>
                      {isUnread && (
                        <span className="font-mono text-cyan" style={{ fontSize: '11px', fontWeight: 600 }}>
                          NEW
                        </span>
                      )}
                      <span style={{ fontSize: '11px', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={11} />
                        {alert.timestamp}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {alert.title}
                    </h3>

                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.5 }}>
                      {alert.message}
                    </p>

                    {alert.target && (
                      <div style={{ fontSize: '11px', color: 'var(--accent-cyan)', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <MapPin size={12} />
                        <span>Target: {alert.target}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Mark As Read Button */}
                {isUnread ? (
                  <Button
                    variant="secondary"
                    size="sm"
                    icon={Check}
                    onClick={() => markAsRead(alert.id)}
                  >
                    Acknowledge
                  </Button>
                ) : (
                  <span style={{ fontSize: '11px', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <CheckCheck size={14} color="var(--color-success)" />
                    <span>Read</span>
                  </span>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
