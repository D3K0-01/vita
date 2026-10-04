import type { Partner } from '../data/partners';

export type LatLng = { lat: number; lng: number };

/** Ponto de partida do mapa quando a localização do aparelho não está disponível (Pinheiros, SP). */
export const DEFAULT_CENTER: LatLng = { lat: -23.5636, lng: -46.6843 };

/**
 * Coordenadas do parceiro. Locais indicados pela comunidade (1g) ainda não têm
 * endereço confirmado: ficam numa posição aproximada, estável por id.
 */
export function partnerCoords(p: Partner): LatLng {
  if (p.coords) return p.coords;
  let h = 0;
  for (const ch of p.id) h = (h * 31 + ch.charCodeAt(0)) | 0;
  const a = ((h & 0xffff) / 0xffff - 0.5) * 0.02;
  const b = (((h >>> 16) & 0xffff) / 0xffff - 0.5) * 0.02;
  return { lat: DEFAULT_CENTER.lat + a, lng: DEFAULT_CENTER.lng + b };
}

// Projeção Web Mercator, a mesma do Google Maps: em zoom z o mundo tem 256·2^z px.
export function project({ lat, lng }: LatLng, zoom: number) {
  const scale = 256 * Math.pow(2, zoom);
  const siny = Math.min(Math.max(Math.sin((lat * Math.PI) / 180), -0.9999), 0.9999);
  return {
    x: scale * (0.5 + lng / 360),
    y: scale * (0.5 - Math.log((1 + siny) / (1 - siny)) / (4 * Math.PI)),
  };
}

/** Posição em px de `point` num mapa de `width`×`height` centrado em `center`. */
export function toScreen(point: LatLng, center: LatLng, zoom: number, width: number, height: number) {
  const p = project(point, zoom);
  const c = project(center, zoom);
  return { x: width / 2 + (p.x - c.x), y: height / 2 + (p.y - c.y) };
}

/** Distância em km (haversine). */
export function distanceKm(a: LatLng, b: LatLng) {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const s = Math.sin(dLat / 2) ** 2 + Math.cos((a.lat * Math.PI) / 180) * Math.cos((b.lat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}

export function boundsOf(points: LatLng[]) {
  const lats = points.map((p) => p.lat);
  const lngs = points.map((p) => p.lng);
  return { north: Math.max(...lats), south: Math.min(...lats), east: Math.max(...lngs), west: Math.min(...lngs) };
}

export function directionsUrl(p: Partner) {
  const c = partnerCoords(p);
  const dest = p.coords ? `${c.lat},${c.lng}` : encodeURIComponent(`${p.nome}, ${p.endereco}, ${p.bairro}, São Paulo`);
  return `https://www.google.com/maps/dir/?api=1&destination=${dest}`;
}
