import React, { createContext, useContext, useState, useEffect } from 'react';
import { BASELINE_SCENARIO } from '../data/demoData';

const ResponseContext = createContext(null);

export function ResponseProvider({ children }) {
  const [tasks, setTasks] = useState(() => {
    try {
      const saved = localStorage.getItem('cyclonex_tasks');
      return saved ? JSON.parse(saved) : BASELINE_SCENARIO.initialTasks;
    } catch {
      return BASELINE_SCENARIO.initialTasks;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('cyclonex_tasks', JSON.stringify(tasks));
    } catch (e) {
      console.error("Failed to save tasks to localStorage", e);
    }
  }, [tasks]);

  const updateTaskStatus = (taskId, newStatus) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
  };

  const generateNewPlan = (aiActions = null) => {
    if (aiActions && aiActions.length > 0) {
      const formatted = aiActions.map((act, idx) => ({
        id: `task-ai-${Date.now()}-${idx}`,
        priority: act.priority ? `${act.priority} - HIGH` : "P1 - CRITICAL",
        rank: idx + 1,
        title: act.action,
        reason: act.reason,
        area: act.target || "Coastal Corridor",
        urgency: idx === 0 ? "Immediate (< 60 mins)" : "Urgent (< 3 hours)",
        status: "Pending",
        assignedTo: "Cyclone X Rapid Response Unit"
      }));
      setTasks(formatted);
      return formatted;
    }

    // Default dynamic synthesis
    const freshTasks = [
      {
        id: `task-refresh-1-${Date.now()}`,
        priority: "P1 - CRITICAL",
        rank: 1,
        title: "Deploy Automated Flood Defenses at Substation 07",
        reason: "Surge wave cresting within 120 minutes; critical node for coastal power grid.",
        area: "Zone 02 Harbor Basin",
        urgency: "Immediate (< 45 mins)",
        status: "In Progress",
        assignedTo: "National Grid Incident Unit"
      },
      {
        id: `task-refresh-2-${Date.now()}`,
        priority: "P1 - CRITICAL",
        rank: 2,
        title: "Mandatory Delta Evacuation Convoy via Route R14",
        reason: "Highway water levels crossing 45cm; last window for ground extraction of 96,000 citizens.",
        area: "Zone 04 Southern Delta",
        urgency: "Immediate (< 90 mins)",
        status: "Pending",
        assignedTo: "Civil Defense Transport Division"
      },
      {
        id: `task-refresh-3-${Date.now()}`,
        priority: "P2 - HIGH",
        rank: 3,
        title: "Secure Coastal Medical Center Fuel & ICU Backup",
        reason: "Generator transfer pumps require sandbag reinforcement against saltwater spray.",
        area: "Coastal Medical Center (Zone 04)",
        urgency: "High (< 2 hours)",
        status: "Pending",
        assignedTo: "Hospital Engineering Taskforce"
      },
      {
        id: `task-refresh-4-${Date.now()}`,
        priority: "P2 - HIGH",
        rank: 4,
        title: "Scale Reception Intake at Centennial Arena Shelter S12",
        reason: "Absorb displaced populations from flooded coastal schools.",
        area: "Zone 05 Foothills Mega-Shelter",
        urgency: "High (< 4 hours)",
        status: "In Progress",
        assignedTo: "Red Crescent Logistics Group"
      },
      {
        id: `task-refresh-5-${Date.now()}`,
        priority: "P3 - MODERATE",
        rank: 5,
        title: "Deploy Mobile Cellular Mesh Radios across Estuary",
        reason: "Maintain emergency communication as cellular towers face structural wind thresholds.",
        area: "Zone 01 Northern Estuary",
        urgency: "Moderate (< 6 hours)",
        status: "Pending",
        assignedTo: "Telecom Emergency Wing"
      }
    ];

    setTasks(freshTasks);
    return freshTasks;
  };

  return (
    <ResponseContext.Provider value={{
      tasks,
      updateTaskStatus,
      generateNewPlan
    }}>
      {children}
    </ResponseContext.Provider>
  );
}

export function useResponse() {
  const ctx = useContext(ResponseContext);
  if (!ctx) throw new Error("useResponse must be used within a ResponseProvider");
  return ctx;
}
