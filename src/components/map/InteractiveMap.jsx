import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import {
  Crosshair,
  RotateCcw,
  Search,
  Layers,
  MapPin,
  Eye,
  Activity,
  Zap,
  Building2,
  Navigation,
  Shield,
  Waves,
  CloudRain
} from 'lucide-react';
import Toggle from '../common/Toggle';
import Badge from '../common/Badge';

export default function InteractiveMap({
  scenario,
  dynamicZones,
  onSelectInfra,
  onSelectZone,
  onBasemapStatusChange,
  height = "640px"
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const layerGroupsRef = useRef({});
  const tileLayerRef = useRef(null);

  // Basemap Connection & Status
  const [basemapStatus, setBasemapStatus] = useState('checking'); // 'online' | 'unavailable'

  // Layer Visibility Toggles
  const [layers, setLayers] = useState({
    stormPath: true,
    riskZones: true,
    hospitals: true,
    power: true,
    roads: true,
    shelters: true,
    rainfall: true,
    stormSurge: true
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [showLayerControls, setShowLayerControls] = useState(true);

  const defaultCenter = [17.3850, 83.2800];
  const defaultZoom = 11;

  // Initialize Map & Tile Layer with Safe Runtime Configuration & Fallback
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return; // already initialized

    // Safety check for React 18 strict mode remount
    if (mapContainerRef.current._leaflet_id) {
      mapContainerRef.current._leaflet_id = null;
    }

    const map = L.map(mapContainerRef.current, {
      center: defaultCenter,
      zoom: defaultZoom,
      zoomControl: false,
      attributionControl: false
    });

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Visible attribution control: © OpenStreetMap contributors, © CARTO
    L.control.attribution({
      position: 'bottomright',
      prefix: false
    }).addTo(map);

    // Custom panes to guarantee infrastructure markers and storm path render above hazard layers
    if (!map.getPane('hazardPane')) {
      const hazardPane = map.createPane('hazardPane');
      hazardPane.style.zIndex = '350';
    }
    if (!map.getPane('zonePane')) {
      const zonePane = map.createPane('zonePane');
      zonePane.style.zIndex = '380';
    }
    if (!map.getPane('stormPane')) {
      const stormPane = map.createPane('stormPane');
      stormPane.style.zIndex = '450';
    }

    // Default safe attribution & dark geographic basemap fallback
    const defaultAttribution = '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attributions" target="_blank" rel="noopener">CARTO</a>';
    const fallbackTileUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}';

    const setFallbackBasemap = () => {
      if (tileLayerRef.current && map.hasLayer(tileLayerRef.current)) {
        map.removeLayer(tileLayerRef.current);
      }
      const fallbackLayer = L.tileLayer(fallbackTileUrl, {
        maxZoom: 18,
        attribution: defaultAttribution
      });
      fallbackLayer.addTo(map);
      tileLayerRef.current = fallbackLayer;
      setBasemapStatus('unavailable');
      if (onBasemapStatusChange) onBasemapStatusChange('unavailable');
    };

    // Load runtime basemap configuration safely from server (never exposing Gemini keys)
    let isSubscribed = true;
    const apiBase = import.meta.env.VITE_API_URL || '';
    fetch(`${apiBase}/api/config/map`)
      .then(res => res.json())
      .then(config => {
        if (!isSubscribed || !mapInstanceRef.current) return;
        const attribution = config.attribution || defaultAttribution;

        if (config.hasKey && config.tileUrl) {
          // Official CARTO Dark Matter raster tiles with runtime key
          let hasLoadedAnyTile = false;
          const cartoLayer = L.tileLayer(config.tileUrl, {
            maxZoom: 18,
            attribution: attribution,
            subdomains: config.subdomains || 'abcd'
          });

          cartoLayer.on('tileload', () => {
            if (!hasLoadedAnyTile && isSubscribed) {
              hasLoadedAnyTile = true;
              setBasemapStatus('online');
              if (onBasemapStatusChange) onBasemapStatusChange('online');
            }
          });

          cartoLayer.on('tileerror', () => {
            if (isSubscribed) {
              console.warn('[Map] CARTO Dark Matter tile error. Activating clean dark geographic fallback.');
              setFallbackBasemap();
            }
          });

          cartoLayer.addTo(map);
          tileLayerRef.current = cartoLayer;

          // Non-blocking timeout if tiles fail to respond
          setTimeout(() => {
            if (!hasLoadedAnyTile && isSubscribed && tileLayerRef.current === cartoLayer) {
              setFallbackBasemap();
            }
          }, 3500);
        } else {
          // Graceful fallback when CARTO_BASEMAP_KEY is missing or placeholder
          // Provides clean dark canvas with visible coastlines/roads/cities and ZERO watermarks
          setFallbackBasemap();
        }
      })
      .catch(err => {
        if (isSubscribed) {
          console.warn('[Map] Failed to fetch map configuration, falling back to offline canvas:', err);
          setFallbackBasemap();
        }
      });

    // Create Layer Groups
    layerGroupsRef.current = {
      stormPath: L.layerGroup().addTo(map),
      riskZones: L.layerGroup().addTo(map),
      hospitals: L.layerGroup().addTo(map),
      power: L.layerGroup().addTo(map),
      roads: L.layerGroup().addTo(map),
      shelters: L.layerGroup().addTo(map),
      rainfall: L.layerGroup().addTo(map),
      stormSurge: L.layerGroup().addTo(map)
    };

    mapInstanceRef.current = map;

    // Observe container size changes (e.g. sidebar toggle or window resize)
    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize();
    });
    if (mapContainerRef.current) {
      resizeObserver.observe(mapContainerRef.current);
    }

    return () => {
      isSubscribed = false;
      resizeObserver.disconnect();
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Layers Content whenever data or layers toggle changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const groups = layerGroupsRef.current;
    if (!groups.stormPath) return;

    // Helper: Toggle group in map
    Object.keys(layers).forEach(layerKey => {
      if (groups[layerKey]) {
        if (layers[layerKey]) {
          if (!map.hasLayer(groups[layerKey])) {
            map.addLayer(groups[layerKey]);
          }
        } else {
          if (map.hasLayer(groups[layerKey])) {
            map.removeLayer(groups[layerKey]);
          }
        }
      }
    });

    // 1. Storm Path Layer
    groups.stormPath.clearLayers();
    if (scenario?.stormPath && scenario.stormPath.length > 0) {
      const latlngs = scenario.stormPath.map(p => p.coords);
      const polyline = L.polyline(latlngs, {
        pane: 'stormPane',
        color: '#00F0FF',
        weight: 3.5,
        opacity: 0.95,
        dashArray: '8, 8',
        lineCap: 'round'
      });
      groups.stormPath.addLayer(polyline);

      scenario.stormPath.forEach(pt => {
        const isCurrent = pt.current;
        const iconHtml = isCurrent
          ? `<div style="
              width: 32px; height: 32px; border-radius: 50%;
              background: radial-gradient(circle, #00F0FF 20%, rgba(0,240,255,0.2) 70%);
              border: 2px solid #00F0FF;
              box-shadow: 0 0 16px #00F0FF;
              display: flex; align-items: center; justify-content: center;
              animation: pulsePing 2s infinite;
             ">
             <div style="width: 8px; height: 8px; border-radius: 50%; background: #06080D;"></div>
            </div>`
          : `<div style="
              width: 14px; height: 14px; border-radius: 50%;
              background: #06080D; border: 2px solid ${pt.forecast ? '#38BDF8' : '#64748B'};
              box-shadow: 0 0 6px ${pt.forecast ? '#38BDF8' : '#64748B'};
             "></div>`;

        const marker = L.marker(pt.coords, {
          icon: L.divIcon({
            html: iconHtml,
            className: 'custom-storm-marker',
            iconSize: isCurrent ? [32, 32] : [14, 14],
            iconAnchor: isCurrent ? [16, 16] : [7, 7]
          }),
          zIndexOffset: isCurrent ? 1200 : 1100
        });

        marker.bindTooltip(`<b>${pt.name}</b><br/>Wind: ${pt.wind} km/h • Time: ${pt.time}`, {
          direction: 'top',
          className: 'map-tooltip'
        });

        groups.stormPath.addLayer(marker);
      });
    }

    // 2. Risk Zones Layer
    groups.riskZones.clearLayers();
    const zonesToRender = dynamicZones || scenario.zones;
    if (zonesToRender) {
      zonesToRender.forEach(zone => {
        const color = zone.riskScore >= 75 ? '#EF4444' : zone.riskScore >= 50 ? '#F59E0B' : '#3B82F6';
        const circle = L.circle(zone.coordinates, {
          pane: 'zonePane',
          radius: zone.radius || 4500,
          color: color,
          fillColor: color,
          fillOpacity: 0.18,
          weight: 2,
          dashArray: '4, 6'
        });

        circle.on('click', () => {
          if (onSelectZone) onSelectZone(zone);
        });

        circle.bindTooltip(
          `<b>${zone.code} — ${zone.name}</b><br/>Risk Score: <b>${zone.riskScore}/100</b> (${zone.severity})<br/>Population: ${zone.population.toLocaleString()}`,
          { sticky: true }
        );

        groups.riskZones.addLayer(circle);
      });
    }

    // 3. Infrastructure Assets (Hospitals, Power, Roads, Shelters)
    groups.hospitals.clearLayers();
    groups.power.clearLayers();
    groups.roads.clearLayers();
    groups.shelters.clearLayers();

    if (scenario.infrastructure) {
      scenario.infrastructure.forEach(item => {
        let groupTarget = null;
        let iconBg = '#3B82F6';
        let iconSymbol = '📍';

        if (item.category === 'hospitals') {
          groupTarget = groups.hospitals;
          iconBg = '#EF4444';
          iconSymbol = '🏥';
        } else if (item.category === 'power') {
          groupTarget = groups.power;
          iconBg = '#F59E0B';
          iconSymbol = '⚡';
        } else if (item.category === 'roads') {
          groupTarget = groups.roads;
          iconBg = '#8B5CF6';
          iconSymbol = '🛣️';
        } else if (item.category === 'shelters') {
          groupTarget = groups.shelters;
          iconBg = '#10B981';
          iconSymbol = '🛡️';
        }

        if (groupTarget) {
          const markerHtml = `
            <div style="
              width: 28px; height: 28px; border-radius: 8px;
              background: #0E1424; border: 2px solid ${iconBg};
              box-shadow: 0 0 10px ${iconBg}60;
              display: flex; align-items: center; justify-content: center;
              font-size: 13px; cursor: pointer;
            ">
              ${iconSymbol}
            </div>
          `;

          const marker = L.marker(item.coordinates, {
            icon: L.divIcon({
              html: markerHtml,
              className: 'custom-infra-marker',
              iconSize: [28, 28],
              iconAnchor: [14, 14]
            }),
            zIndexOffset: 1000 // Renders strictly above hazard polygons & circles
          });

          marker.on('click', () => {
            if (onSelectInfra) onSelectInfra(item);
          });

          marker.bindTooltip(
            `<b>${item.name}</b><br/>Type: ${item.type}<br/>Risk: <span style="color:${iconBg}">${item.risk}</span> • Exposure: ${item.exposure}%`,
            { direction: 'top' }
          );

          groupTarget.addLayer(marker);
        }
      });
    }

    // 4. Rainfall Heatmap / Inundation Circles
    groups.rainfall.clearLayers();
    const rainCircle = L.circle([17.4000, 83.2700], {
      pane: 'hazardPane',
      radius: 9500,
      color: '#818CF8',
      fillColor: '#818CF8',
      fillOpacity: 0.12,
      weight: 1.5,
      dashArray: '2, 4'
    });
    rainCircle.bindTooltip('Precipitation Envelope: 420mm extreme runoff zone');
    groups.rainfall.addLayer(rainCircle);

    // 5. Storm Surge Hazard Envelope (Coastal belt)
    groups.stormSurge.clearLayers();
    const surgePolygon = L.polygon([
      [17.5200, 83.3900],
      [17.4500, 83.3700],
      [17.3800, 83.3400],
      [17.2900, 83.2700],
      [17.2700, 83.2100],
      [17.3100, 83.2300],
      [17.3900, 83.2900],
      [17.4700, 83.3300]
    ], {
      pane: 'hazardPane',
      color: '#00F0FF',
      fillColor: '#00F0FF',
      fillOpacity: 0.22,
      weight: 1.5
    });
    surgePolygon.bindTooltip('Hydrodynamic Storm Surge Impact Corridor (+3.2m sea elevation)');
    groups.stormSurge.addLayer(surgePolygon);

  }, [scenario, dynamicZones, layers]);

  // Center on highest risk zone (Zone 04, Delta)
  const handleCenterHighestRisk = () => {
    if (!mapInstanceRef.current) return;
    const highestRiskZone = (dynamicZones || scenario.zones).reduce((max, z) => z.riskScore > max.riskScore ? z : max, scenario.zones[0]);
    if (highestRiskZone) {
      mapInstanceRef.current.flyTo(highestRiskZone.coordinates, 13, { duration: 1.2 });
      if (onSelectZone) onSelectZone(highestRiskZone);
    }
  };

  // Reset View to Default Extent
  const handleResetView = () => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.flyTo(defaultCenter, defaultZoom, { duration: 1 });
  };

  // Search filter
  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim() || !mapInstanceRef.current) return;
    const query = searchQuery.toLowerCase();

    // Check infrastructure
    const matchedInfra = scenario.infrastructure.find(item =>
      item.name.toLowerCase().includes(query) || item.type.toLowerCase().includes(query) || item.zone.toLowerCase().includes(query)
    );
    if (matchedInfra) {
      mapInstanceRef.current.flyTo(matchedInfra.coordinates, 14, { duration: 1.2 });
      if (onSelectInfra) onSelectInfra(matchedInfra);
      return;
    }

    // Check zones
    const matchedZone = scenario.zones.find(z =>
      z.name.toLowerCase().includes(query) || z.code.toLowerCase().includes(query)
    );
    if (matchedZone) {
      mapInstanceRef.current.flyTo(matchedZone.coordinates, 13, { duration: 1.2 });
      if (onSelectZone) onSelectZone(matchedZone);
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%', height, borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>
      {/* Real Map Canvas */}
      <div ref={mapContainerRef} style={{ width: '100%', height: '100%', zIndex: 1 }} />

      {/* Top Floating Controls Bar */}
      <div style={{
        position: 'absolute',
        top: '16px',
        left: '16px',
        right: '16px',
        zIndex: 500,
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        pointerEvents: 'none'
      }}>
        {/* Search Bar */}
        <form onSubmit={handleSearch} style={{ pointerEvents: 'auto', display: 'flex', alignItems: 'center', flex: '1 1 200px', maxWidth: '300px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            background: 'rgba(10, 15, 29, 0.92)',
            backdropFilter: 'blur(10px)',
            border: '1px solid var(--border-medium)',
            borderRadius: 'var(--radius-md)',
            padding: '6px 12px',
            gap: '8px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
            width: '100%'
          }}>
            <Search size={14} color="var(--text-muted)" />
            <input
              type="text"
              placeholder="Search zone, hospital, road..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                fontSize: '12px',
                color: 'var(--text-primary)',
                outline: 'none',
                background: 'transparent'
              }}
            />
          </div>
        </form>

        {/* Action Buttons & Status */}
        <div style={{ pointerEvents: 'auto', display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
          {/* Basemap Status Indicator */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(10, 15, 29, 0.92)',
            backdropFilter: 'blur(10px)',
            border: `1px solid ${basemapStatus === 'online' ? 'rgba(16, 185, 129, 0.4)' : 'rgba(245, 158, 11, 0.4)'}`,
            borderRadius: 'var(--radius-md)',
            padding: '6px 10px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
            fontSize: '11px',
            fontWeight: 600,
            letterSpacing: '0.04em',
            color: basemapStatus === 'online' ? '#34D399' : '#FBBF24'
          }} title={basemapStatus === 'online' ? 'CARTO Dark Matter Basemap Online' : 'Fallback Geographic Basemap Active (No Watermarks)'}>
            <span style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: basemapStatus === 'online' ? '#10B981' : '#F59E0B',
              boxShadow: basemapStatus === 'online' ? '0 0 8px #10B981' : '0 0 8px #F59E0B'
            }} />
            <span>{basemapStatus === 'online' ? 'BASEMAP ONLINE' : 'BASEMAP UNAVAILABLE'}</span>
          </div>

          <button
            onClick={handleCenterHighestRisk}
            className="btn btn-secondary btn-sm"
            style={{
              background: 'rgba(10, 15, 29, 0.92)',
              backdropFilter: 'blur(10px)',
              borderColor: 'rgba(239, 68, 68, 0.5)',
              color: 'var(--color-critical)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
              padding: '6px 10px'
            }}
            title="Center on Highest Risk Zone (Zone 04)"
          >
            <Crosshair size={13} />
            <span>Zone 04<span className="desktop-only"> (Critical)</span></span>
          </button>

          <button
            onClick={handleResetView}
            className="btn btn-secondary btn-sm"
            style={{
              background: 'rgba(10, 15, 29, 0.92)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
              padding: '6px 10px'
            }}
            title="Reset Map View"
          >
            <RotateCcw size={13} />
            <span className="desktop-only">Reset</span>
          </button>

          <button
            onClick={() => setShowLayerControls(!showLayerControls)}
            className="btn btn-secondary btn-sm"
            style={{
              background: 'rgba(10, 15, 29, 0.92)',
              backdropFilter: 'blur(10px)',
              borderColor: showLayerControls ? 'var(--accent-cyan)' : 'var(--border-medium)',
              color: showLayerControls ? 'var(--accent-cyan)' : 'var(--text-primary)',
              padding: '6px 10px'
            }}
            title="Toggle Map Layers"
          >
            <Layers size={13} />
            <span>Layers<span className="desktop-only"> ({Object.values(layers).filter(Boolean).length}/8)</span></span>
          </button>
        </div>
      </div>

      {/* Floating Layer Toggles Panel (Collapsible) */}
      {showLayerControls && (
        <div style={{
          position: 'absolute',
          top: '72px',
          right: '16px',
          zIndex: 500,
          width: '240px',
          background: 'rgba(10, 15, 29, 0.92)',
          backdropFilter: 'blur(14px)',
          border: '1px solid var(--border-medium)',
          borderRadius: 'var(--radius-lg)',
          padding: '16px',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.6)',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px' }}>
            <span className="font-display font-semibold" style={{ fontSize: '13px', color: 'var(--text-primary)' }}>
              Map Layers
            </span>
            <span className="font-mono text-cyan" style={{ fontSize: '11px' }}>
              INTERACTIVE
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '340px', overflowY: 'auto' }}>
            <Toggle
              checked={layers.stormPath}
              onChange={(val) => setLayers(prev => ({ ...prev, stormPath: val }))}
              label="Storm Path"
            />
            <Toggle
              checked={layers.riskZones}
              onChange={(val) => setLayers(prev => ({ ...prev, riskZones: val }))}
              label="Risk Zones"
            />
            <Toggle
              checked={layers.hospitals}
              onChange={(val) => setLayers(prev => ({ ...prev, hospitals: val }))}
              label="Hospitals"
            />
            <Toggle
              checked={layers.power}
              onChange={(val) => setLayers(prev => ({ ...prev, power: val }))}
              label="Power Stations"
            />
            <Toggle
              checked={layers.roads}
              onChange={(val) => setLayers(prev => ({ ...prev, roads: val }))}
              label="Roads & Corridors"
            />
            <Toggle
              checked={layers.shelters}
              onChange={(val) => setLayers(prev => ({ ...prev, shelters: val }))}
              label="Shelters"
            />
            <Toggle
              checked={layers.rainfall}
              onChange={(val) => setLayers(prev => ({ ...prev, rainfall: val }))}
              label="Rainfall Inundation"
            />
            <Toggle
              checked={layers.stormSurge}
              onChange={(val) => setLayers(prev => ({ ...prev, stormSurge: val }))}
              label="Storm Surge Envelope"
            />
          </div>
        </div>
      )}

      {/* Floating Map Legend (Bottom Left) */}
      <div style={{
        position: 'absolute',
        bottom: '16px',
        left: '16px',
        maxWidth: 'calc(100% - 32px)',
        zIndex: 500,
        background: 'rgba(10, 15, 29, 0.92)',
        backdropFilter: 'blur(10px)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)',
        padding: '8px 12px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: '8px 12px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--text-secondary)' }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#EF4444' }} />
          <span>Critical Risk</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--text-secondary)' }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#F59E0B' }} />
          <span>High Risk</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--text-secondary)' }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#3B82F6' }} />
          <span>Moderate</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--text-secondary)' }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10B981' }} />
          <span>Shelter Open</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--accent-cyan)' }}>
          <span style={{ width: 12, height: 2, background: '#00F0FF', display: 'inline-block' }} />
          <span>Surge Barrier</span>
        </div>
      </div>
    </div>
  );
}
