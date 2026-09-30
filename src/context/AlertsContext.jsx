import React, { createContext, useContext, useState, useEffect } from 'react';
import { BASELINE_SCENARIO } from '../data/demoData';

const AlertsContext = createContext(null);

export function AlertsProvider({ children }) {
  const [alerts, setAlerts] = useState(() => {
    try {
      const saved = localStorage.getItem('cyclonex_alerts');
      return saved ? JSON.parse(saved) : BASELINE_SCENARIO.alerts;
    } catch {
      return BASELINE_SCENARIO.alerts;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('cyclonex_alerts', JSON.stringify(alerts));
    } catch (e) {
      console.error("Failed to save alerts to localStorage", e);
    }
  }, [alerts]);

  const unreadCount = alerts.filter(a => !a.read).length;

  const markAsRead = (id) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, read: true } : a));
  };

  const markAllAsRead = () => {
    setAlerts(prev => prev.map(a => ({ ...a, read: true })));
  };

  const addAlert = (newAlert) => {
    const alertItem = {
      id: `alt-${Date.now()}`,
      timestamp: "Just now",
      read: false,
      ...newAlert
    };
    setAlerts(prev => [alertItem, ...prev]);
  };

  return (
    <AlertsContext.Provider value={{
      alerts,
      unreadCount,
      markAsRead,
      markAllAsRead,
      addAlert
    }}>
      {children}
    </AlertsContext.Provider>
  );
}

export function useAlerts() {
  const ctx = useContext(AlertsContext);
  if (!ctx) throw new Error("useAlerts must be used within an AlertsProvider");
  return ctx;
}
