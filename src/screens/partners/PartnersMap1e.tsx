import React, { useMemo, useState } from 'react';
import { View, Text, Pressable, Linking, Dimensions } from 'react-native';
import { ChevronLeft, Search, Navigation } from 'lucide-react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { ScreenContainer } from '../../components/ScreenContainer';
import { PhotoPlaceholder } from '../../components/partners/PhotoPlaceholder';
import { SeloBadge } from '../../components/partners/SeloBadge';
import { TagPill } from '../../components/partners/TagPill';
import { useApp } from '../../state/AppContext';
import { formatKm, partners, type Partner } from '../../data/partners';

const FILTROS = ['Recomendados', 'Todos', 'Abertos agora'] as const;
type FiltroMapa = (typeof FILTROS)[number];

// Protótipo: o mapa é uma representação estática com pinos posicionados por
// coordenada relativa (`partner.mapa`). A integração com mapa real entra depois.
function minutosDeRota(km: number) {
  return Math.max(3, Math.round(km * 6.5));
}

export default function PartnersMap1e({ navigation, route }: any) {
  const { palette, colors, type, radii, alpha } = useTheme();
  const { state, generateCoupon } = useApp();
  const [filtro, setFiltro] = useState<FiltroMapa>('Recomendados');

  const todos = useMemo(() => [...partners, ...state.communityPartners], [state.communityPartners]);
  const visiveis = useMemo(() => {
    if (filtro === 'Recomendados') return todos.filter((p) => p.selo === 'vita_recomenda');
    if (filtro === 'Abertos agora') return todos.filter((p) => p.abertoAgora);
    return todos;
  }, [todos, filtro]);

  const inicial = route.params?.partnerId ?? visiveis[0]?.id ?? todos[0].id;
  const [selecionadoId, setSelecionadoId] = useState<string>(inicial);
  const selecionado: Partner = todos.find((p) => p.id === selecionadoId) ?? todos[0];

  const largura = Dimensions.get('window').width;

  const abrirRota = () => {
    const destino = encodeURIComponent(`${selecionado.nome}, ${selecionado.endereco}, ${selecionado.bairro}`);
    Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${destino}`).catch(() => {});
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
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 9, backgroundColor: palette.surface, borderWidth: 1, borderColor: palette.surfaceBorder, borderRadius: radii.md, paddingVertical: 10, paddingHorizontal: 13 }}>
          <Search size={16} color={palette.hint} strokeWidth={2} />
          <Text style={[type.bodySm, { fontSize: 13, color: palette.text }]}>Pinheiros · até 5 km</Text>
        </View>
      </View>

      <View style={{ flexDirection: 'row', gap: 8, paddingHorizontal: 20, paddingBottom: 12 }}>
        {FILTROS.map((f) => {
          const on = f === filtro;
          return (
            <Pressable
              key={f}
              onPress={() => setFiltro(f)}
              style={{
                borderRadius: radii.pill,
                paddingVertical: 8,
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

      {/* mapa */}
      <View style={{ flex: 1, backgroundColor: alpha(colors.pastelGreen, 0.25), overflow: 'hidden' }}>
        {/* ruas */}
        <View style={{ position: 'absolute', left: '46%', top: 0, bottom: 0, width: 10, backgroundColor: alpha(colors.greyAzure, 0.25) }} />
        <View style={{ position: 'absolute', top: '38%', left: 0, right: 0, height: 10, backgroundColor: alpha(colors.greyAzure, 0.25) }} />
        <View style={{ position: 'absolute', top: '74%', left: 0, right: 0, height: 6, backgroundColor: alpha(colors.greyAzure, 0.18) }} />
        <View style={{ position: 'absolute', left: '16%', top: 0, bottom: 0, width: 5, backgroundColor: alpha(colors.greyAzure, 0.18) }} />
        {/* praça */}
        <View style={{ position: 'absolute', left: '62%', top: '8%', width: 120, height: 120, borderRadius: 60, backgroundColor: alpha(colors.accent1, 0.22) }} />

        {/* você está aqui */}
        <View style={{ position: 'absolute', left: '50%', top: '62%', marginLeft: -9, marginTop: -9 }}>
          <View style={{ width: 18, height: 18, borderRadius: 9, backgroundColor: colors.greyAzure, borderWidth: 3, borderColor: colors.white }} />
        </View>

        {visiveis.map((p) => {
          const on = p.id === selecionadoId;
          return (
            <Pressable
              key={p.id}
              onPress={() => setSelecionadoId(p.id)}
              style={{ position: 'absolute', left: `${p.mapa.x * 100}%`, top: `${p.mapa.y * 100}%`, transform: [{ translateX: -largura * 0.16 }, { translateY: -14 }] }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 5,
                  borderRadius: 20,
                  paddingVertical: 6,
                  paddingHorizontal: 10,
                  backgroundColor: on ? colors.darkAzure : colors.white,
                  borderWidth: 1,
                  borderColor: on ? colors.darkAzure : palette.chipBorder,
                }}
              >
                <Text style={{ fontFamily: 'Lexend_600SemiBold', fontSize: 10.5, color: on ? colors.white : colors.darkAzure }}>
                  {p.beneficio.resumo} · {p.nome}
                </Text>
              </View>
            </Pressable>
          );
        })}
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
