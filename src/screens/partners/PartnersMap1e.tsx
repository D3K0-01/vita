import React, { useMemo, useState } from 'react';
import { View, Text, Pressable, Linking, TextInput, Platform } from 'react-native';
import { ChevronLeft, Search, Navigation } from 'lucide-react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { ScreenContainer } from '../../components/ScreenContainer';
import { PhotoPlaceholder } from '../../components/partners/PhotoPlaceholder';
import { SeloBadge } from '../../components/partners/SeloBadge';
import { TagPill } from '../../components/partners/TagPill';
import { useApp } from '../../state/AppContext';
import { formatKm, partners, type Partner } from '../../data/partners';
import { PartnerMap } from '../../components/partners/PartnerMap';
import { useUI } from '../../components/UIProvider';
import { directionsUrl, type LatLng } from '../../utils/geo';

const FILTROS = ['Recomendados', 'Todos', 'Abertos agora'] as const;
type FiltroMapa = (typeof FILTROS)[number];

// Mapa real (Google Maps). Os parceiros e o selo continuam sendo os dados de
// exemplo do protótipo; ver components/partners/PartnerMap.tsx.
function minutosDeRota(km: number) {
  return Math.max(3, Math.round(km * 6.5));
}

export default function PartnersMap1e({ navigation, route }: any) {
  const { palette, colors, type, radii, alpha } = useTheme();
  const { state, generateCoupon } = useApp();
  const [filtro, setFiltro] = useState<FiltroMapa>('Recomendados');

  const todos = useMemo(() => [...partners, ...state.communityPartners], [state.communityPartners]);
  const [busca, setBusca] = useState('');
  const [user, setUser] = useState<LatLng | null>(null);
  const { toast } = useUI();
  const visiveis = useMemo(() => {
    let list = todos;
    if (filtro === 'Recomendados') list = list.filter((p) => p.selo === 'vita_recomenda');
    if (filtro === 'Abertos agora') list = list.filter((p) => p.abertoAgora);
    const q = busca.trim().toLowerCase();
    if (q) list = list.filter((p) => `${p.nome} ${p.categoria} ${p.bairro} ${p.tagsRapidas.join(' ')}`.toLowerCase().includes(q));
    return list;
  }, [todos, filtro, busca]);

  const localizar = () => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) return toast('Seu navegador não informa a localização');
    navigator.geolocation.getCurrentPosition(
      (pos) => setUser({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => toast('Não foi possível pegar sua localização. Verifique a permissão do navegador.'),
      { enableHighAccuracy: false, timeout: 10000 }
    );
  };

  const inicial = route.params?.partnerId ?? visiveis[0]?.id ?? todos[0].id;
  const [selecionadoId, setSelecionadoId] = useState<string>(inicial);
  // se o filtro esconder o selecionado, passa para o primeiro visível
  const selecionado: Partner = visiveis.find((p) => p.id === selecionadoId) ?? visiveis[0] ?? todos.find((p) => p.id === selecionadoId) ?? todos[0];


  const abrirRota = () => {
    Linking.openURL(directionsUrl(selecionado)).catch(() => {});
  };

  const gerarCupom = () => {
    const coupon = generateCoupon(selecionado.id);
    navigation.navigate('CouponGenerated1d', { partnerId: selecionado.id, couponId: coupon.id });
  };

  return (
    <ScreenContainer scroll={false}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 20, paddingTop: 10, paddingBottom: 10 }}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={12} accessibilityRole="button" accessibilityLabel="Voltar">
          <ChevronLeft size={22} color={palette.text} strokeWidth={2} />
        </Pressable>
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 9, backgroundColor: palette.surface, borderWidth: 1, borderColor: palette.surfaceBorder, borderRadius: radii.md, paddingLeft: 13 }}>
          <Search size={16} color={palette.hint} strokeWidth={2} />
          <TextInput
            value={busca}
            onChangeText={setBusca}
            placeholder="buscar perto de Pinheiros"
            placeholderTextColor={palette.textFaint}
            accessibilityLabel="Buscar parceiro no mapa"
            style={[{ flex: 1, minHeight: 44, fontFamily: 'Lexend_400Regular', fontSize: 13.5, color: palette.text }, { outlineStyle: 'none' } as any]}
          />
        </View>
      </View>

      <View style={{ flexDirection: 'row', gap: 8, paddingHorizontal: 20, paddingBottom: 12 }}>
        {FILTROS.map((f) => {
          const on = f === filtro;
          return (
            <Pressable
              key={f}
              onPress={() => setFiltro(f)}
              accessibilityRole="button"
              accessibilityState={{ selected: on }}
              style={{
                borderRadius: radii.pill,
                paddingVertical: 10,
                paddingHorizontal: 13,
                backgroundColor: on ? palette.chipSelectedBg : palette.surface,
                borderWidth: 1,
                borderColor: on ? palette.chipSelectedBorder : palette.chipBorder,
              }}
            >
              <Text style={{ fontFamily: on ? 'Lexend_500Medium' : 'Lexend_400Regular', fontSize: 12.5, color: on ? colors.accent2 : palette.text }}>{f}</Text>
            </Pressable>
          );
        })}
      </View>

      {/* mapa (Google Maps) */}
      <View style={{ flex: 1 }}>
        {visiveis.length ? (
          <PartnerMap partners={visiveis} selectedId={selecionado.id} onSelect={setSelecionadoId} user={user} onLocate={Platform.OS === 'web' ? localizar : undefined} />
        ) : (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 30 }}>
            <Text style={[type.body, { color: palette.textMuted, textAlign: 'center' }]}>Nenhum parceiro encontrado para "{busca}".</Text>
          </View>
        )}
      </View>

      {/* bottom sheet do parceiro selecionado */}
      <View
        style={{
          backgroundColor: palette.surface,
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          paddingHorizontal: 20,
          paddingTop: 10,
          paddingBottom: 26,
          borderTopWidth: 1,
          borderTopColor: palette.divider,
        }}
      >
        <View style={{ width: 38, height: 4, borderRadius: 2, backgroundColor: palette.divider, alignSelf: 'center', marginBottom: 14 }} />

        <Pressable
          onPress={() => navigation.navigate('PartnerDetail1c', { partnerId: selecionado.id })}
          style={{ flexDirection: 'row', gap: 12 }}
        >
          <PhotoPlaceholder label="Foto" height={62} radius={14} style={{ width: 62 }} />
          <View style={{ flex: 1, gap: 3 }}>
            <SeloBadge selo={selecionado.selo} size={9.5} />
            <Text style={[type.cardTitle, { fontSize: 17, color: palette.text }]}>{selecionado.nome}</Text>
            <Text style={[type.caption, { fontSize: 11.5, color: palette.textFaint }]}>
              {selecionado.categoria} · {formatKm(selecionado.distanciaKm)} ·{' '}
              {selecionado.abertoAgora ? selecionado.horarioFuncionamento.split(', ')[1] ?? 'aberto agora' : 'fechado agora'}
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 5, marginTop: 4 }}>
              {selecionado.tagsRapidas.slice(0, 2).map((t) => (
                <TagPill key={t} label={t} />
              ))}
            </View>
          </View>
        </Pressable>

        <View style={{ flexDirection: 'row', gap: 10, marginTop: 14 }}>
          <Pressable
            onPress={abrirRota}
            style={({ pressed }) => ({
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 7,
              borderRadius: radii.pill,
              borderWidth: 1.5,
              borderColor: palette.chipBorder,
              paddingVertical: 15,
              opacity: pressed ? 0.6 : 1,
            })}
          >
            <Navigation size={15} color={palette.text} strokeWidth={1.9} />
            <Text style={{ fontFamily: 'BricolageGrotesque_600SemiBold', fontSize: 14, color: palette.text }}>
              Rota · {minutosDeRota(selecionado.distanciaKm)} min
            </Text>
          </Pressable>

          <Pressable
            onPress={gerarCupom}
            style={({ pressed }) => ({
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: radii.pill,
              backgroundColor: colors.accent1,
              paddingVertical: 15,
              opacity: pressed ? 0.85 : 1,
            })}
          >
            <Text style={{ fontFamily: 'BricolageGrotesque_600SemiBold', fontSize: 14, color: colors.white }}>Gerar cupom</Text>
          </Pressable>
        </View>
      </View>
    </ScreenContainer>
  );
}
