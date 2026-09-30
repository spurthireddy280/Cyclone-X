import React, { createContext, useContext, useState, useMemo } from 'react';
import { BASELINE_SCENARIO } from '../data/demoData';
import { calculateRiskScore, calculateDynamicZoneRisks } from '../utils/riskEngine';

const ScenarioContext = createContext(null);

export function ScenarioProvider({ children }) {
  const [scenario, setScenario] = useState(BASELINE_SCENARIO);

  // Simulator parameters
  const [simParams, setSimParams] = useState({
    windSpeed: 145,
    rainfall: 420,
    stormSurge: 3.2,
    infrastructureVulnerability: 65,
    preset: 'baseline'
  });

  // Active simulated state (updated when user clicks "Run Simulation" or selects a preset)
  const [activeSim, setActiveSim] = useState({
    windSpeed: 145,
    rainfall: 420,
    stormSurge: 3.2,
    infrastructureVulnerability: 65,
    preset: 'baseline',
    lastRunAt: new Date()
  });

  const [isSimulating, setIsSimulating] = useState(false);

  // Selected drawers
  const [selectedZone, setSelectedZone] = useState(null);
  const [selectedInfra, setSelectedInfra] = useState(null);

  // Baseline risk calculations
  const baselineRisk = useMemo(() => {
    return calculateRiskScore({
      windSpeed: scenario.currentConditions.windSpeed,
      rainfall: scenario.currentConditions.rainfall,
      stormSurge: scenario.currentConditions.stormSurge,
      infrastructureExposure: 65
    });
  }, [scenario]);

  // Real-time calculated risk for current simulator slider positions
  const previewSimRisk = useMemo(() => {
    return calculateRiskScore({
      windSpeed: simParams.windSpeed,
      rainfall: simParams.rainfall,
      stormSurge: simParams.stormSurge,
      infrastructureExposure: simParams.infrastructureVulnerability
    });
  }, [simParams]);

  // Active simulated risk
  const activeSimRisk = useMemo(() => {
    return calculateRiskScore({
      windSpeed: activeSim.windSpeed,
      rainfall: activeSim.rainfall,
      stormSurge: activeSim.stormSurge,
      infrastructureExposure: activeSim.infrastructureVulnerability
    });
  }, [activeSim]);

  // Dynamic zones based on active simulation
  const dynamicZones = useMemo(() => {
    return calculateDynamicZoneRisks(scenario.zones, baselineRisk.score, activeSimRisk.score);
  }, [scenario.zones, baselineRisk.score, activeSimRisk.score]);

  // Deltas between baseline and active simulation
  const deltas = useMemo(() => {
    const riskDelta = activeSimRisk.score - baselineRisk.score;
    // Estimated population and infrastructure affected based on risk delta
    const additionalPeople = Math.max(0, Math.round(riskDelta * 1192));
    const additionalInfra = Math.max(0, Math.round(riskDelta * 0.54));

    return {
      riskDelta,
      additionalPeople,
      additionalInfra
    };
  }, [activeSimRisk.score, baselineRisk.score]);

  const updateSimParam = (key, value) => {
    setSimParams(prev => ({
      ...prev,
      [key]: value,
      preset: 'custom'
    }));
  };

  const applyPreset = (presetKey) => {
    const preset = scenario.simulatorPresets[presetKey];
    if (preset) {
      const updated = {
        windSpeed: preset.windSpeed,
        rainfall: preset.rainfall,
        stormSurge: preset.stormSurge,
        infrastructureVulnerability: preset.infrastructureVulnerability,
        preset: presetKey
      };
      setSimParams(updated);
      setActiveSim({ ...updated, lastRunAt: new Date() });
    }
  };

  const runSimulation = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setActiveSim({
        ...simParams,
        lastRunAt: new Date()
      });
      setIsSimulating(false);
    }, 600);
  };

  return (
    <ScenarioContext.Provider value={{
      scenario,
      baselineRisk,
      simParams,
      updateSimParam,
      previewSimRisk,
      activeSim,
      activeSimRisk,
      dynamicZones,
      deltas,
      applyPreset,
      runSimulation,
      isSimulating,
      selectedZone,
      setSelectedZone,
      selectedInfra,
      setSelectedInfra
    }}>
      {children}
    </ScenarioContext.Provider>
  );
}

export function useScenario() {
  const ctx = useContext(ScenarioContext);
  if (!ctx) throw new Error("useScenario must be used within a ScenarioProvider");
  return ctx;
}
