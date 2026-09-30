import React, { createContext, useContext, useState, useEffect } from 'react';

const SettingsContext = createContext(null);

const DEFAULT_SETTINGS = {
  theme: 'dark',
  notificationsEnabled: true,
  defaultMapLayer: 'all',
  autoRefresh: false,
  aiAnalysisMode: 'deep',
  reducedMotion: false,
  defaultScenario: 'Cyclone Varuna (Cat 3)'
};

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('cyclonex_settings');
      return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('cyclonex_settings', JSON.stringify(settings));
    } catch (e) {
      console.error("Failed to save settings to localStorage", e);
    }

    // Apply theme
    if (settings.theme === 'light') {
      document.body.classList.remove('dark-theme');
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
      document.body.classList.add('dark-theme');
    }

    // Apply reduced motion
    if (settings.reducedMotion) {
      document.body.classList.add('reduced-motion');
    } else {
      document.body.classList.remove('reduced-motion');
    }
  }, [settings]);

  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const clearDemoData = () => {
    localStorage.removeItem('cyclonex_alerts');
    localStorage.removeItem('cyclonex_tasks');
    localStorage.removeItem('cyclonex_reports');
    localStorage.removeItem('cyclonex_onboarding');
    window.location.reload();
  };

  return (
    <SettingsContext.Provider value={{
      settings,
      updateSetting,
      clearDemoData
    }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used within a SettingsProvider");
  return ctx;
}
