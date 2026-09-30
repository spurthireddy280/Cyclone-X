// Centralized seed scenario data for Cyclone Varuna (Category 3)
export const initialScenarioData = {
  id: "varuna-2026",
  name: "Cyclone Varuna",
  category: 3,
  status: "SIMULATION ACTIVE",
  isSimulation: true,
  currentConditions: {
    windSpeed: 145,       // km/h
    rainfall: 420,        // mm / 24h
    stormSurge: 3.2,      // meters
    centralPressure: 964, // hPa
    movementSpeed: 18,    // km/h
    movementDirection: "WNW",
    landfallEstimateHours: 8.4, // 08h 24m
    eyeDiameter: 32,      // km
    coordinates: [17.3850, 83.3100] // Coastal Bay of Bengal / Visakhapatnam region
  },
  riskScore: 61,
  severity: "HIGH",
  explanation: "Wind exposure (30%) + extreme rainfall (25%) + storm surge (30%) + coastal infrastructure vulnerability (15%). Low-lying zones show compounded risk due to saturated soil conditions.",
  
  timeline: [
    { time: "T-20h (12:00)", title: "Deep Depression Forms", category: "Depression", wind: 55, pressure: 1002, description: "System consolidated over warm open waters with convective banding.", completed: true },
    { time: "T-16h (16:00)", title: "Rapid Cyclogenesis", category: "Severe Storm", wind: 95, pressure: 990, description: "Central pressure drops 12 hPa in 4 hours; eye feature starts forming.", completed: true },
    { time: "T-12h (20:00)", title: "Upgraded to Category 3", category: "Category 3", wind: 130, pressure: 974, description: "Gale-force winds extend 140 km from the center. Outer bands make coastal contact.", completed: true },
    { time: "T-06h (02:00)", title: "Peak Offshore Intensity", category: "Category 3", wind: 155, pressure: 960, description: "Sustained peak winds reached; high sea surface temperatures fuel surge wave height to 3.8m.", completed: true },
    { time: "CURRENT", title: "Approaching Landfall Corridor", category: "Category 3", wind: 145, pressure: 964, description: "Eye wall tracking towards coastal industrial belt; landfall expected within 8.4 hours.", current: true },
    { time: "T+08h (08:00)", title: "Projected Coastal Landfall", category: "Category 2-3", wind: 140, pressure: 968, description: "Maximum surge overlap with high tide; severe flooding expected across coastal estuaries.", projected: true },
    { time: "T+16h (16:00)", title: "Inland Dissipation", category: "Category 1", wind: 85, pressure: 988, description: "System weakens rapidly over topographic ridge; heavy orographic precipitation continues.", projected: true }
  ],

  zones: [
    {
      id: "zone-01",
      code: "Zone 01",
      name: "Northern Coastal Estuary",
      riskScore: 68,
      severity: "HIGH",
      population: 84000,
      floodExposure: 72,
      windExposure: 65,
      surgeExposure: 70,
      vulnerabilityFactors: ["Tidal canal confluence", "Unreinforced masonry dwellings", "Limited evacuation causeways"],
      infrastructureCount: 12,
      coordinates: [17.4800, 83.3500],
      radius: 4200
    },
    {
      id: "zone-02",
      code: "Zone 02",
      name: "Harbor & Industrial Maritime Belt",
      riskScore: 82,
      severity: "CRITICAL",
      population: 112000,
      floodExposure: 88,
      windExposure: 80,
      surgeExposure: 92,
      vulnerabilityFactors: ["Chemical storage yards at 1.8m elevation", "Container terminal crane exposure", "Substation 07 proximity to shoreline"],
      infrastructureCount: 28,
      coordinates: [17.4100, 83.3200],
      radius: 5000
    },
    {
      id: "zone-03",
      code: "Zone 03",
      name: "Metropolitan Central & Commercial Core",
      riskScore: 74,
      severity: "HIGH",
      population: 260000,
      floodExposure: 64,
      windExposure: 82,
      surgeExposure: 45,
      vulnerabilityFactors: ["High-rise glass facade vulnerability", "Underground drainage pump station saturation", "High density hospital cluster"],
      infrastructureCount: 35,
      coordinates: [17.3800, 83.2600],
      radius: 4600
    },
    {
      id: "zone-04",
      code: "Zone 04",
      name: "Southern Delta & Lowland Settlement",
      riskScore: 91,
      severity: "CRITICAL",
      population: 96000,
      floodExposure: 95,
      windExposure: 78,
      surgeExposure: 96,
      vulnerabilityFactors: ["Below sea level reclaimed land", "Earthen levee failure probability > 85%", "Only one arterial road (R14) access"],
      infrastructureCount: 14,
      coordinates: [17.3100, 83.2200],
      radius: 5400
    },
    {
      id: "zone-05",
      code: "Zone 05",
      name: "Inland Foothills & Elevated Suburbs",
      riskScore: 54,
      severity: "MODERATE",
      population: 145000,
      floodExposure: 40,
      windExposure: 62,
      surgeExposure: 10,
      vulnerabilityFactors: ["Localized landslide risk on western cuts", "Overhead power transmission lines", "Shelter staging area"],
      infrastructureCount: 19,
      coordinates: [17.4300, 83.1800],
      radius: 4800
    }
  ],

  infrastructure: [
    {
      id: "hosp-01",
      name: "Coastal Medical Center",
      type: "Hospital",
      category: "hospitals",
      zone: "Zone 04",
      risk: "CRITICAL",
      exposure: 82,
      floodExposure: 78,
      windExposure: 61,
      capacity: "450 beds (88% occupied)",
      backupPower: "Diesel generators (Level -1, flood risk)",
      access: "Route R14 (impassable at +1.2m water)",
      currentStatus: "At Risk",
      aiRecommendation: "Prepare backup generator elevation and secure alternate hovercraft / high-clearance access route.",
      dependencies: ["Substation 07 (Grid Power)", "Water Treatment Station 03", "Access Highway R14"],
      coordinates: [17.3200, 83.2350]
    },
    {
      id: "hosp-02",
      name: "Apex Regional Trauma & General",
      type: "Hospital",
      category: "hospitals",
      zone: "Zone 03",
      risk: "HIGH",
      exposure: 68,
      floodExposure: 52,
      windExposure: 75,
      capacity: "720 beds (65% occupied)",
      backupPower: "Dual rooftop micro-turbines + 72h diesel",
      access: "Metro Arterial 01 (Elevated flyover)",
      currentStatus: "Operational",
      aiRecommendation: "Establish triage surge overflow staging area; alert regional air-lift teams.",
      dependencies: ["Central Substation 02", "Municipal Water Mains"],
      coordinates: [17.3820, 83.2550]
    },
    {
      id: "hosp-03",
      name: "Harbor Children's & Community Clinic",
      type: "Hospital",
      category: "hospitals",
      zone: "Zone 02",
      risk: "CRITICAL",
      exposure: 89,
      floodExposure: 91,
      windExposure: 79,
      capacity: "120 beds (94% occupied)",
      backupPower: "Battery ESS (4 hour capacity)",
      access: "Harbor Boulevard (Prone to storm surge wash)",
      currentStatus: "Severe Vulnerability",
      aiRecommendation: "Initiate pre-landfall patient transfers to Apex Regional within the next 4 hours.",
      dependencies: ["Substation 07", "Harbor Levee 02"],
      coordinates: [17.4050, 83.3150]
    },
    {
      id: "pwr-01",
      name: "Coastal Transmission Substation 07",
      type: "Power",
      category: "power",
      zone: "Zone 02",
      risk: "CRITICAL",
      exposure: 92,
      floodExposure: 94,
      windExposure: 86,
      capacity: "220kV Grid Gateway (Serves 180,000 residents)",
      backupPower: "N/A (Primary Node)",
      access: "Port Access Road (Surface water rising)",
      currentStatus: "Imminent Failure Risk",
      aiRecommendation: "Deploy mobile flood barrier dikes immediately and prepare remote load-shedding transfer to Grid Node 05.",
      dependencies: ["Harbor Sea Wall", "Drainage Canal 04"],
      coordinates: [17.4150, 83.3280]
    },
    {
      id: "pwr-02",
      name: "Inland Combined-Cycle Substation 04",
      type: "Power",
      category: "power",
      zone: "Zone 05",
      risk: "MODERATE",
      exposure: 38,
      floodExposure: 25,
      windExposure: 52,
      capacity: "400kV Backbone Hub",
      backupPower: "Automated switchgear isolators",
      access: "Expressway 16 (Clear)",
      currentStatus: "Stable",
      aiRecommendation: "Maintain continuous line tension monitoring and ready secondary distribution relays.",
      dependencies: ["National Grid Intertie"],
      coordinates: [17.4380, 83.1750]
    },
    {
      id: "rd-01",
      name: "Arterial Highway Corridor R14",
      type: "Roads",
      category: "roads",
      zone: "Zone 04",
      risk: "CRITICAL",
      exposure: 95,
      floodExposure: 96,
      windExposure: 70,
      capacity: "4-lane Primary Evacuation Arterial",
      backupPower: "Solar LED Gantries",
      access: "Delta Causeways",
      currentStatus: "Flooding Imminent",
      aiRecommendation: "Close lane 1 & 2 for civilian traffic; escort remaining priority evacuation convoys with amphibious support.",
      dependencies: ["Delta Sluice Gate 02", "South Culvert 11"],
      coordinates: [17.3350, 83.2400]
    },
    {
      id: "rd-02",
      name: "Elevated Ring Expressway E02",
      type: "Roads",
      category: "roads",
      zone: "Zone 03",
      risk: "MODERATE",
      exposure: 42,
      floodExposure: 18,
      windExposure: 84,
      capacity: "6-lane Grade Separated Highway",
      backupPower: "Backup generators for toll plazas",
      access: "Ramps A through H",
      currentStatus: "Operational with High Wind Caution",
      aiRecommendation: "Restrict high-profile commercial trucks; reserve median lanes for emergency vehicle transit.",
      dependencies: ["Structural Wind Sensors"],
      coordinates: [17.3950, 83.2700]
    },
    {
      id: "shlt-01",
      name: "Centennial Arena Emergency Shelter S12",
      type: "Shelters",
      category: "shelters",
      zone: "Zone 05",
      risk: "LOW",
      exposure: 28,
      floodExposure: 15,
      windExposure: 42,
      capacity: "3,500 people (currently 1,240 registered)",
      backupPower: "Dual 500kVA Industrial Gensets + Microgrid",
      access: "Foothill Parkway (Completely Unobstructed)",
      currentStatus: "Operational & Receiving",
      aiRecommendation: "Ready secondary supply cache and dispatch additional medical intake team.",
      dependencies: ["Substation 04", "Municipal Reservoir 01"],
      coordinates: [17.4420, 83.1900]
    },
    {
      id: "shlt-02",
      name: "Delta Technical School Shelter S08",
      type: "Shelters",
      category: "shelters",
      zone: "Zone 04",
      risk: "CRITICAL",
      exposure: 86,
      floodExposure: 92,
      windExposure: 74,
      capacity: "1,200 people (currently 820 inside)",
      backupPower: "Single portable generator",
      access: "Secondary connector (Water level +0.6m)",
      currentStatus: "Secondary Threat",
      aiRecommendation: "Halt new admissions; execute phased evacuation to Centennial Shelter S12 before high tide at 04:00.",
      dependencies: ["Highway R14", "Mobile Cellular Tower 09"],
      coordinates: [17.3180, 83.2120]
    }
  ],

  stormPath: [
    { name: "Observation Point 1", time: "-12h", coords: [16.8000, 84.1000], wind: 120, pressure: 980 },
    { name: "Observation Point 2", time: "-08h", coords: [17.0500, 83.8000], wind: 135, pressure: 972 },
    { name: "Observation Point 3", time: "-04h", coords: [17.2200, 83.5200], wind: 145, pressure: 965 },
    { name: "Current Eye Center", time: "NOW", coords: [17.3850, 83.3100], wind: 145, pressure: 964, current: true },
    { name: "Forecast Landfall", time: "+08h", coords: [17.4800, 83.1500], wind: 140, pressure: 968, forecast: true },
    { name: "Forecast Inland 1", time: "+16h", coords: [17.6500, 82.9000], wind: 105, pressure: 982, forecast: true },
    { name: "Forecast Inland 2", time: "+24h", coords: [17.8500, 82.6000], wind: 75, pressure: 994, forecast: true }
  ],

  alerts: [
    {
      id: "alt-01",
      severity: "CRITICAL",
      title: "Storm Surge Alert — Zone 04",
      timestamp: "12 mins ago",
      message: "Hydrodynamic surge gauges register 3.2m sea elevation. Wave crest overtopping low-lying earthen levee by +0.4m.",
      target: "Zone 04 Delta Sector",
      read: false
    },
    {
      id: "alt-02",
      severity: "CRITICAL",
      title: "Substation 07 Water Ingress Imminent",
      timestamp: "28 mins ago",
      message: "Basement flood sensors triggered at 220kV yard. Potential outage affecting 180,000 residents within 2 hours.",
      target: "Substation 07 (Zone 02)",
      read: false
    },
    {
      id: "alt-03",
      severity: "WARNING",
      title: "Highway Corridor R14 Water Accumulation",
      timestamp: "45 mins ago",
      message: "Sustained rainfall of 420mm has inundated drainage culverts. Water level reaching 45cm across primary lanes.",
      target: "Arterial Highway R14",
      read: false
    },
    {
      id: "alt-04",
      severity: "WARNING",
      title: "Apex Trauma Overflow Readiness Notice",
      timestamp: "1h 15m ago",
      message: "Surge triage team deployed to support potential evacuation from coastal clinics.",
      target: "Apex Regional Trauma (Zone 03)",
      read: true
    },
    {
      id: "alt-05",
      severity: "INFO",
      title: "Centennial Arena Shelter S12 Capacity Available",
      timestamp: "2h 00m ago",
      message: "2,260 safe berths open. Microgrid running at 100% nominal output with surplus medical stockpiles.",
      target: "Shelter S12 (Zone 05)",
      read: true
    }
  ],

  initialTasks: [
    {
      id: "task-01",
      priority: "P1 - CRITICAL",
      rank: 1,
      title: "Execute Phased Evacuation of Zone 04 & Shelter S08",
      reason: "Storm surge water levels overtopping protective sea dikes by +0.4m; single escape route R14 will become impassable within 150 minutes.",
      area: "Zone 04 Delta & Shelter S08",
      urgency: "Immediate (< 90 mins)",
      status: "In Progress",
      assignedTo: "National Disaster Response Team Alpha"
    },
    {
      id: "task-02",
      priority: "P1 - CRITICAL",
      rank: 2,
      title: "Deploy Tiger Dam Flood Barriers to Substation 07",
      reason: "Unmitigated flooding will cause 220kV catastrophic failure, knocking out coastal hospital life-support backup connections.",
      area: "Zone 02 Maritime Substation",
      urgency: "Immediate (< 2 hours)",
      status: "Pending",
      assignedTo: "Municipal Utility Emergency Corps"
    },
    {
      id: "task-03",
      priority: "P2 - HIGH",
      rank: 3,
      title: "Pre-Position Heavy Dewatering Pumps along Route R14",
      reason: "Ensure highway corridor remains clear for high-clearance military evacuation convoys.",
      area: "Highway R14 Kilometer 4-8",
      urgency: "High (< 3 hours)",
      status: "Pending",
      assignedTo: "Highway Authority Fleet Division"
    },
    {
      id: "task-04",
      priority: "P2 - HIGH",
      rank: 4,
      title: "Pre-Stock Blood Bank & Oxygen at Apex Regional Trauma",
      reason: "Anticipated influx of 140+ critical care transfers from vulnerable coastal clinics.",
      area: "Zone 03 Apex Trauma",
      urgency: "High (< 4 hours)",
      status: "Completed",
      assignedTo: "Regional Health Disaster Bureau"
    },
    {
      id: "task-05",
      priority: "P3 - MODERATE",
      rank: 5,
      title: "Activate Backup Microwave Telemetry for S12 Mega-Shelter",
      reason: "Overhead fiber trunk lines in Zone 02 vulnerable to gale force winds > 140 km/h.",
      area: "Zone 05 Centennial Arena",
      urgency: "Moderate (< 6 hours)",
      status: "Pending",
      assignedTo: "Emergency Communications Taskforce"
    }
  ]
};
