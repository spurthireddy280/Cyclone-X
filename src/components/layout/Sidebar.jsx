import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Activity,
  Wind,
  BarChart3,
  Map as MapIcon,
  Building2,
  Sliders,
  Sparkles,
  ListTodo,
  Bell,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Shield,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAlerts } from '../../context/AlertsContext';

export default function Sidebar({
  isCollapsed,
  onToggleCollapse,
  mobileOpen = false,
  onCloseMobile
}) {
  const { user, logout } = useAuth();
  const { unreadCount } = useAlerts();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { to: '/app', label: 'Overview', icon: Activity, end: true },
    { to: '/app/storm', label: 'Storm Monitor', icon: Wind },
    { to: '/app/risk', label: 'Risk Analysis', icon: BarChart3 },
    { to: '/app/map', label: 'Risk Map', icon: MapIcon },
    { to: '/app/infrastructure', label: 'Infrastructure', icon: Building2 },
    { to: '/app/simulator', label: 'Simulator', icon: Sliders },
    { to: '/app/ai', label: 'AI Command', icon: Sparkles, highlight: true },
    { to: '/app/response', label: 'Response Planner', icon: ListTodo },
    { to: '/app/alerts', label: 'Alerts', icon: Bell, badge: unreadCount > 0 ? unreadCount : null },
    { to: '/app/reports', label: 'Reports', icon: FileText }
  ];

  const handleNavClick = () => {
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(5, 7, 11, 0.75)',
            backdropFilter: 'blur(4px)',
            zIndex: 1040
          }}
          className="mobile-only"
        />
      )}

      <aside
        className={`app-sidebar sidebar ${mobileOpen ? 'mobile-drawer-open' : ''}`}
        style={{
          width: isCollapsed ? 'var(--sidebar-collapsed-width)' : 'var(--sidebar-expanded-width)',
          height: '100vh',
          flexShrink: 0,
          background: 'var(--bg-secondary)',
          borderRight: '1px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          position: 'relative',
          zIndex: mobileOpen ? 1050 : 100,
          transition: 'width var(--transition-normal), transform var(--transition-normal)'
        }}
      >
        {/* Brand Header */}
        <div style={{
          height: 'var(--header-height)',
          flexShrink: 0,
          padding: isCollapsed ? '0 10px' : '0 18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: isCollapsed ? 'center' : 'space-between',
          borderBottom: '1px solid var(--border-subtle)'
        }}>
          <NavLink to="/app" onClick={handleNavClick} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: 30,
              height: 30,
              borderRadius: 'var(--radius-sm)',
              background: 'linear-gradient(135deg, #00F0FF, #0284C7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#05070B',
              boxShadow: '0 0 10px rgba(0, 240, 255, 0.3)'
            }}>
              <Shield size={17} strokeWidth={2.5} />
            </div>
            {!isCollapsed && (
              <div>
                <div className="font-display font-bold" style={{ fontSize: '14.5px', letterSpacing: '0.04em', color: 'var(--text-primary)' }}>
                  CYCLONE <span className="text-cyan">X</span>
                </div>
                <div style={{ fontSize: '8.5px', color: 'var(--text-dim)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  Disaster Intelligence
                </div>
              </div>
            )}
          </NavLink>

          {/* Desktop collapse toggle */}
          {!isCollapsed && (
            <button
              onClick={onToggleCollapse}
              className="desktop-only"
              style={{
                padding: '5px',
                borderRadius: 'var(--radius-xs)',
                color: 'var(--text-dim)',
                cursor: 'pointer',
                transition: 'color var(--transition-fast)'
              }}
              title="Collapse Sidebar"
            >
              <ChevronLeft size={15} />
            </button>
          )}

          {/* Mobile close toggle */}
          {mobileOpen && (
            <button
              onClick={onCloseMobile}
              className="mobile-only"
              style={{
                padding: '5px',
                borderRadius: 'var(--radius-xs)',
                color: 'var(--text-dim)',
                cursor: 'pointer'
              }}
              title="Close Menu"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Main Navigation */}
        <nav className="sidebar-nav" style={{ flex: 1, minHeight: 0, padding: '14px 8px', display: 'flex', flexDirection: 'column', gap: '2px', overflowY: 'auto' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={handleNavClick}
                title={isCollapsed ? item.label : undefined}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '11px',
                  padding: isCollapsed ? '9px 0' : '8px 11px',
                  justifyContent: isCollapsed ? 'center' : 'flex-start',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '12.5px',
                  fontWeight: isActive ? 600 : 450,
                  color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                  background: isActive ? 'rgba(0, 240, 255, 0.05)' : 'transparent',
                  borderLeft: isActive ? '2px solid var(--accent-cyan)' : '2px solid transparent',
                  transition: 'all var(--transition-fast)'
                })}
              >
                <Icon
                  size={16}
                  style={{
                    color: item.highlight ? 'var(--accent-cyan)' : 'inherit',
                    flexShrink: 0
                  }}
                />
                {!isCollapsed && (
                  <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {item.label}
                  </span>
                )}
                {!isCollapsed && item.badge && (
                  <span
                    className="font-mono"
                    style={{
                      fontSize: '10px',
                      padding: '1px 5px',
                      borderRadius: 'var(--radius-full)',
                      background: 'var(--color-critical)',
                      color: '#FFFFFF'
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Sidebar Toggle in Collapsed Mode */}
        {isCollapsed && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '8px 0' }}>
            <button
              onClick={onToggleCollapse}
              style={{
                padding: '5px',
                borderRadius: 'var(--radius-xs)',
                color: 'var(--text-dim)',
                cursor: 'pointer',
                background: 'rgba(255, 255, 255, 0.04)'
              }}
              title="Expand Sidebar"
            >
              <ChevronRight size={15} />
            </button>
          </div>
        )}

        {/* Bottom Section: Settings & User */}
        <div className="sidebar-footer" style={{
          flexShrink: 0,
          padding: '10px 8px',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          gap: '3px'
        }}>
          <NavLink
            to="/app/settings"
            onClick={handleNavClick}
            title={isCollapsed ? "Settings" : undefined}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '11px',
              padding: isCollapsed ? '9px 0' : '8px 11px',
              justifyContent: isCollapsed ? 'center' : 'flex-start',
              borderRadius: 'var(--radius-md)',
              fontSize: '12.5px',
              color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
              background: isActive ? 'rgba(0, 240, 255, 0.05)' : 'transparent',
              borderLeft: isActive ? '2px solid var(--accent-cyan)' : '2px solid transparent'
            })}
          >
            <Settings size={16} style={{ flexShrink: 0 }} />
            {!isCollapsed && <span>Settings</span>}
          </NavLink>

          {/* User Profile Pill & Logout */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: isCollapsed ? 'center' : 'space-between',
            padding: isCollapsed ? '8px 0' : '8px 10px',
            background: 'rgba(255, 255, 255, 0.025)',
            borderRadius: 'var(--radius-md)',
            marginTop: '4px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: 25,
                height: 25,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #00F0FF, #6366F1)',
                color: '#05070B',
                fontWeight: 700,
                fontSize: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                {user?.avatar || "OP"}
              </div>
              {!isCollapsed && (
                <div style={{ overflow: 'hidden' }}>
                  <div style={{ fontSize: '11.5px', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {user?.name || "Operator"}
                  </div>
                  <div style={{ fontSize: '9.5px', color: 'var(--text-dim)', whiteSpace: 'nowrap' }}>
                    {user?.role || "Specialist"}
                  </div>
                </div>
              )}
            </div>

            {!isCollapsed && (
              <button
                onClick={handleLogout}
                style={{
                  color: 'var(--text-dim)',
                  cursor: 'pointer',
                  padding: '3px',
                  borderRadius: 'var(--radius-xs)'
                }}
                title="Logout"
              >
                <LogOut size={14} />
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
