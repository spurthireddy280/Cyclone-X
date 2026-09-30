// Formatting helpers for metrics, time, and indicators

export function formatWindSpeed(kmh) {
  return `${kmh} km/h`;
}

export function formatRainfall(mm) {
  return `${mm} mm`;
}

export function formatSurge(meters) {
  return `${Number(meters).toFixed(1)} m`;
}

export function formatPressure(hpa) {
  return `${hpa} hPa`;
}

export function formatPopulation(num) {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(0)}k`;
  }
  return num.toString();
}

export function formatDateTime(isoString) {
  if (!isoString) return "";
  const d = new Date(isoString);
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}
