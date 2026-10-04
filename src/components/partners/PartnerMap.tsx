// Mapa de Parceiros — versão web (Expo web / navegador do celular).
// No Android/iOS o Metro usa PartnerMap.native.tsx no lugar deste arquivo.
//
// Dois modos:
//  • com EXPO_PUBLIC_GOOGLE_MAPS_API_KEY: Google Maps interativo (arrastar,
//    zoom com dois dedos) e pinos próprios do Vita desenhados sobre o mapa;
//  • sem chave: mapa real do Google embutido (sem conta) com os pinos do Vita
//    posicionados pela mesma projeção do Google. Para os pinos não saírem do
//    lugar, o mapa embutido não arrasta: o zoom e a centralização ficam nos
//    botões e nos próprios pinos.
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, Pressable, LayoutChangeEvent } from 'react-native';
import { Plus, Minus, LocateFixed } from 'lucide-react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { GOOGLE_MAPS_API_KEY } from '../../config';
import type { Partner } from '../../data/partners';
import { LatLng, partnerCoords, toScreen } from '../../utils/geo';
import { colors as brand } from '../../theme/colors';

export type PartnerMapProps = {
  partners: Partner[];
  selectedId: string;
  onSelect: (id: string) => void;
  user: LatLng | null;
  onLocate?: () => void;
};

export function PartnerMap(props: PartnerMapProps) {
  return GOOGLE_MAPS_API_KEY ? <InteractiveMap {...props} /> : <EmbedMap {...props} />;
}

// ---------------------------------------------------------------- com chave

// Visual discreto, nos tons da marca, para os pinos do Vita se destacarem.
const MAP_STYLE = [
  { elementType: 'geometry', stylers: [{ color: '#EEF0EA' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#5B7179' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#F7F6F1' }] },
  { featureType: 'poi', stylers: [{ visibility: 'off' }] },
  { featureType: 'poi.park', elementType: 'geometry', stylers: [{ visibility: 'on' }, { color: '#D6E2CF' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#FFFFFF' }] },
  { featureType: 'road.arterial', elementType: 'geometry', stylers: [{ color: '#FBFAF6' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#E3E9E4' }] },
  { featureType: 'transit', stylers: [{ visibility: 'off' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#C9DCE2' }] },
];

let loader: Promise<any> | null = null;
function loadGoogleMaps(key: string): Promise<any> {
  const w = window as any;
  if (w.google?.maps) return Promise.resolve(w.google);
  if (loader) return loader;
  loader = new Promise((resolve, reject) => {
    w.__vitaMapsReady = () => resolve(w.google);
    const s = document.createElement('script');
    s.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(key)}&v=weekly&language=pt-BR&region=BR&callback=__vitaMapsReady`;
    s.async = true;
    s.onerror = () => {
      loader = null;
      reject(new Error('Google Maps não carregou'));
    };
    document.head.appendChild(s);
  });
  return loader;
}

function pillHtml(p: Partner, selected: boolean) {
  const vita = p.selo === 'vita_recomenda';
  const bg = selected ? brand.darkAzure : '#FFFFFF';
  const fg = selected ? '#FFFFFF' : brand.darkAzure;
  const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c] as string);
  const badge = vita
    ? `<span style="display:inline-flex;align-items:center;justify-content:center;width:16px;height:16px;border-radius:8px;background:${brand.accent2};color:#fff;font-size:10px;font-weight:700">✓</span>`
    : `<span style="display:inline-block;width:8px;height:8px;border-radius:4px;background:${brand.greyAzure}"></span>`;
  const label = selected ? `${esc(p.beneficio.resumo)} · ${esc(p.nome)}` : esc(p.beneficio.resumo);
  return `<div style="display:flex;flex-direction:column;align-items:center;transform:translate(-50%,-100%);cursor:pointer;-webkit-tap-highlight-color:transparent">
    <div style="display:flex;align-items:center;gap:5px;white-space:nowrap;padding:6px 10px;border-radius:16px;background:${bg};color:${fg};border:1px solid ${selected ? bg : 'rgba(46,75,82,.18)'};box-shadow:0 3px 10px rgba(0,0,0,.18);font:600 11.5px Lexend_600SemiBold,system-ui,sans-serif">${badge}<span>${label}</span></div>
    <div style="width:0;height:0;border-left:6px solid transparent;border-right:6px solid transparent;border-top:7px solid ${bg};filter:drop-shadow(0 1px 1px rgba(0,0,0,.12))"></div>
  </div>`;
}

function InteractiveMap({ partners, selectedId, onSelect, user, onLocate }: PartnerMapProps) {
  const { palette, type } = useTheme();
  const host = useRef<any>(null);
  const mapRef = useRef<any>(null);
  const overlays = useRef<Map<string, any>>(new Map());
  const userOverlay = useRef<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const selectRef = useRef(onSelect);
  selectRef.current = onSelect;

  // cria o mapa uma vez
  useEffect(() => {
    let cancelled = false;
    loadGoogleMaps(GOOGLE_MAPS_API_KEY)
      .then((google) => {
        if (cancelled || !host.current) return;
        const first = partners.find((p) => p.id === selectedId) ?? partners[0];
        mapRef.current = new google.maps.Map(host.current as HTMLElement, {
          center: first ? partnerCoords(first) : { lat: -23.5636, lng: -46.6843 },
          zoom: 14,
          disableDefaultUI: true,
          zoomControl: false,
          gestureHandling: 'greedy',
          clickableIcons: false,
          styles: MAP_STYLE,
        });
        if (partners.length > 1) {
          const b = new google.maps.LatLngBounds();
          partners.forEach((p) => b.extend(partnerCoords(p)));
          mapRef.current.fitBounds(b, 56);
        }
        setReady(true);
      })
      .catch((e) => setError(e.message));
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // pinos dos parceiros
  useEffect(() => {
    const google = (window as any).google;
    if (!ready || !google) return;
    overlays.current.forEach((o) => o.setMap(null));
    overlays.current.clear();
    partners.forEach((p) => {
      const ov = new google.maps.OverlayView();
      const div = document.createElement('div');
      div.style.position = 'absolute';
      div.setAttribute('role', 'button');
      div.setAttribute('aria-label', `${p.nome}, ${p.beneficio.resumo}`);
      div.addEventListener('click', (e) => {
        e.stopPropagation();
        selectRef.current(p.id);
      });
      ov.onAdd = function () {
        this.getPanes().overlayMouseTarget.appendChild(div);
      };
      ov.draw = function () {
        const pt = this.getProjection().fromLatLngToDivPixel(new google.maps.LatLng(partnerCoords(p)));
        if (pt) {
          div.style.left = `${pt.x}px`;
          div.style.top = `${pt.y}px`;
        }
      };
      ov.onRemove = () => div.remove();
      (ov as any).__div = div;
      (ov as any).__partner = p;
      ov.setMap(mapRef.current);
      overlays.current.set(p.id, ov);
    });
  }, [ready, partners]);

  // destaque do selecionado + centralização
  useEffect(() => {
    overlays.current.forEach((ov, id) => {
      const div: HTMLDivElement = ov.__div;
      div.innerHTML = pillHtml(ov.__partner, id === selectedId);
      div.style.zIndex = id === selectedId ? '10' : '1';
    });
    const sel = partners.find((p) => p.id === selectedId);
    if (ready && sel && mapRef.current) mapRef.current.panTo(partnerCoords(sel));
  }, [selectedId, ready, partners]);

  // "você está aqui"
  useEffect(() => {
    const google = (window as any).google;
    if (!ready || !google) return;
    userOverlay.current?.setMap(null);
    if (!user) return;
    const ov = new google.maps.OverlayView();
    const div = document.createElement('div');
    div.style.position = 'absolute';
    div.innerHTML = `<div title="Você está aqui" style="transform:translate(-50%,-50%);width:18px;height:18px;border-radius:9px;background:${brand.greyAzure};border:3px solid #fff;box-shadow:0 0 0 6px rgba(127,160,172,.25)"></div>`;
    ov.onAdd = function () {
      this.getPanes().overlayLayer.appendChild(div);
    };
    ov.draw = function () {
      const pt = this.getProjection().fromLatLngToDivPixel(new google.maps.LatLng(user));
      if (pt) {
        div.style.left = `${pt.x}px`;
        div.style.top = `${pt.y}px`;
      }
    };
    ov.onRemove = () => div.remove();
    ov.setMap(mapRef.current);
    userOverlay.current = ov;
    mapRef.current.panTo(user);
  }, [user, ready]);

  if (error) return <EmbedMap partners={partners} selectedId={selectedId} onSelect={onSelect} user={user} onLocate={onLocate} />;

  return (
    <View style={{ flex: 1 }}>
      <View ref={host} style={{ flex: 1, backgroundColor: '#EEF0EA' }} />
      {!ready && (
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={[type.caption, { color: palette.textMuted }]}>carregando o mapa…</Text>
        </View>
      )}
      <MapButtons
        onZoomIn={() => mapRef.current?.setZoom(mapRef.current.getZoom() + 1)}
        onZoomOut={() => mapRef.current?.setZoom(mapRef.current.getZoom() - 1)}
        onLocate={onLocate}
      />
    </View>
  );
}

// ---------------------------------------------------------------- sem chave

function EmbedMap({ partners, selectedId, onSelect, user, onLocate }: PartnerMapProps) {
  const { colors } = useTheme();
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [zoom, setZoom] = useState(14);
  const selected = partners.find((p) => p.id === selectedId) ?? partners[0];
  const [center, setCenter] = useState<LatLng>(selected ? partnerCoords(selected) : { lat: -23.5636, lng: -46.6843 });

  // o mapa embutido acompanha o pino escolhido
  useEffect(() => {
    if (selected) setCenter(partnerCoords(selected));
  }, [selected?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Obs.: o mapa embutido sempre marca o centro com o pino vermelho do Google,
  // por isso ele fica no parceiro escolhido (e não na localização do usuário).

  const src = useMemo(
    () => `https://maps.google.com/maps?q=${center.lat.toFixed(6)},${center.lng.toFixed(6)}&z=${zoom}&hl=pt-BR&output=embed`,
    [center, zoom]
  );

  const onLayout = (e: LayoutChangeEvent) => setSize({ w: e.nativeEvent.layout.width, h: e.nativeEvent.layout.height });

  // o selecionado por último, para ficar por cima
  const ordered = [...partners].sort((a, b) => (a.id === selectedId ? 1 : b.id === selectedId ? -1 : 0));
  const userPt = user && size.w ? toScreen(user, center, zoom, size.w, size.h) : null;

  return (
    <View style={{ flex: 1, overflow: 'hidden', backgroundColor: '#EEF0EA' }} onLayout={onLayout}>
      {size.w > 0 && (
        <iframe
          key={src}
          title="Mapa dos parceiros"
          src={src}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0, pointerEvents: 'none' }}
        />
      )}

      {userPt && (
        <View pointerEvents="none" style={{ position: 'absolute', left: userPt.x - 9, top: userPt.y - 9, width: 18, height: 18, borderRadius: 9, backgroundColor: colors.greyAzure, borderWidth: 3, borderColor: '#fff' }} />
      )}

      {size.w > 0 &&
        ordered.map((p) => {
          const pt = toScreen(partnerCoords(p), center, zoom, size.w, size.h);
          if (pt.x < -80 || pt.x > size.w + 80 || pt.y < -20 || pt.y > size.h + 60) return null;
          const on = p.id === selectedId;
          return (
            <Pressable
              key={p.id}
              onPress={() => onSelect(p.id)}
              accessibilityRole="button"
              accessibilityLabel={`${p.nome}, ${p.beneficio.resumo}`}
              style={{ position: 'absolute', left: pt.x, top: on ? pt.y - 34 : pt.y, zIndex: on ? 10 : 1 }}
            >
              <View style={[{ alignItems: 'center' }, { transform: [{ translateX: '-50%' as any }, { translateY: '-100%' as any }] }]}>
                <Pill partner={p} selected={on} />
              </View>
            </Pressable>
          );
        })}

      <MapButtons onZoomIn={() => setZoom((z) => Math.min(18, z + 1))} onZoomOut={() => setZoom((z) => Math.max(11, z - 1))} onLocate={onLocate} />
    </View>
  );
}

function Pill({ partner, selected }: { partner: Partner; selected: boolean }) {
  const { colors, palette } = useTheme();
  const vita = partner.selo === 'vita_recomenda';
  const bg = selected ? colors.darkAzure : '#FFFFFF';
  return (
    <>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 5,
          paddingVertical: 6,
          paddingHorizontal: 10,
          borderRadius: 16,
          backgroundColor: bg,
          borderWidth: 1,
          borderColor: selected ? bg : palette.chipBorder,
          shadowColor: '#000',
          shadowOpacity: 0.18,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: 3 },
        }}
      >
        {vita ? (
          <View style={{ width: 16, height: 16, borderRadius: 8, backgroundColor: colors.accent2, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: '#fff', fontSize: 10, fontFamily: 'Lexend_600SemiBold' }}>✓</Text>
          </View>
        ) : (
          <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: colors.greyAzure }} />
        )}
        <Text numberOfLines={1} style={{ fontFamily: 'Lexend_600SemiBold', fontSize: 11.5, color: selected ? '#fff' : colors.darkAzure }}>
          {selected ? `${partner.beneficio.resumo} · ${partner.nome}` : partner.beneficio.resumo}
        </Text>
      </View>
      <View style={{ width: 0, height: 0, borderLeftWidth: 6, borderRightWidth: 6, borderTopWidth: 7, borderLeftColor: 'transparent', borderRightColor: 'transparent', borderTopColor: bg }} />
    </>
  );
}

function MapButtons({ onZoomIn, onZoomOut, onLocate }: { onZoomIn: () => void; onZoomOut: () => void; onLocate?: () => void }) {
  const { palette } = useTheme();
  const btn = { width: 44, height: 44, alignItems: 'center' as const, justifyContent: 'center' as const, backgroundColor: palette.surface };
  return (
    <View style={{ position: 'absolute', right: 12, top: 12, gap: 8 }}>
      <View style={{ borderRadius: 14, overflow: 'hidden', borderWidth: 1, borderColor: palette.surfaceBorder, shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 8 }}>
        <Pressable onPress={onZoomIn} accessibilityLabel="Aproximar" style={[btn, { borderBottomWidth: 1, borderBottomColor: palette.divider }]}>
          <Plus size={18} color={palette.text} />
        </Pressable>
        <Pressable onPress={onZoomOut} accessibilityLabel="Afastar" style={btn}>
          <Minus size={18} color={palette.text} />
        </Pressable>
      </View>
      {onLocate && (
        <Pressable onPress={onLocate} accessibilityLabel="Minha localização" style={[btn, { borderRadius: 14, borderWidth: 1, borderColor: palette.surfaceBorder }]}>
          <LocateFixed size={18} color={palette.text} />
        </Pressable>
      )}
    </View>
  );
}
