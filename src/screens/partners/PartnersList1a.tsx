import React, { useMemo } from 'react';
import { View, Text, Pressable } from 'react-native';
import { MapPin, Search, Ticket, Award } from 'lucide-react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { ScreenContainer } from '../../components/ScreenContainer';
import { SOSButton } from '../../components/SOSButton';
import { TourTarget } from '../../components/tour/Tour';
import { PartnerCard } from '../../components/partners/PartnerCard';
import { useApp } from '../../state/AppContext';
import { usePartnerFilters } from '../../state/PartnerFilters';
import { partners, filterPartners, countActiveFilters, type AdaptacaoKey } from '../../data/partners';

const ATALHOS: { key: AdaptacaoKey; label: string }[] = [
  { key: 'ruido_baixo', label: 'Ruído baixo' },
  { key: 'sem_fila', label: 'Sem fila' },
];

export default function PartnersList1a({ navigation }: any) {
  const { palette, colors, type, radii, alpha } = useTheme();
  const { state } = useApp();
  const { filters, patch } = usePartnerFilters();

  const todos = useMemo(() => [...partners, ...state.communityPartners], [state.communityPartners]);
  const visiveis = useMemo(() => filterPartners(todos, filters), [todos, filters]);
  const recomendados = visiveis.filter((p) => p.selo === 'vita_recomenda');
  const comunidade = visiveis.filter((p) => p.selo === 'comunidade');
  const ativos = countActiveFilters(filters);

  const toggleAtalho = (key: AdaptacaoKey) =>
    patch({
      adaptacoesDesejadas: filters.adaptacoesDesejadas.includes(key)
        ? filters.adaptacoesDesejadas.filter((k) => k !== key)
        : [...filters.adaptacoesDesejadas, key],
    });

  return (
    <ScreenContainer floating={<SOSButton />} contentStyle={{ paddingTop: 10, gap: 16 }}>
      <View style={{ paddingHorizontal: 20, flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
        <View style={{ flex: 1 }}>
          <Text style={[type.title, { color: palette.text }]}>Parceiros</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 4 }}>
            <MapPin size={13} color={palette.hint} strokeWidth={2} />
            <Text style={[type.caption, { fontSize: 12.5, color: palette.textMuted }]}>Perto de Pinheiros, São Paulo</Text>
          </View>
        </View>

        <TourTarget id="partners-actions">
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Ver parceiros no mapa"
            onPress={() => navigation.navigate('PartnersMap1e')}
            style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: palette.surface, borderWidth: 1, borderColor: palette.surfaceBorder, alignItems: 'center', justifyContent: 'center' }}
          >
            <MapPin size={18} color={palette.text} strokeWidth={1.9} />
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Meus cupons"
            onPress={() => navigation.navigate('MyCoupons1h')}
            style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: palette.surface, borderWidth: 1, borderColor: palette.surfaceBorder, alignItems: 'center', justifyContent: 'center' }}
          >
            <Ticket size={18} color={palette.text} strokeWidth={1.9} />
          </Pressable>
        </View>
        </TourTarget>
      </View>

      <Pressable
        onPress={() => navigation.navigate('Filters1b')}
        style={{ marginHorizontal: 20, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: palette.surface, borderWidth: 1, borderColor: palette.surfaceBorder, borderRadius: radii.md, paddingVertical: 12, paddingHorizontal: 14 }}
      >
        <Search size={17} color={palette.hint} strokeWidth={2} />
        <Text style={[type.bodySm, { flex: 1, fontSize: 13.5, color: filters.buscaTexto ? palette.text : palette.textFaint }]}>
          {filters.buscaTexto || 'Barbearia, festa, dentista…'}
        </Text>
      </Pressable>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingHorizontal: 20 }}>
        <Pressable
          onPress={() => navigation.navigate('Filters1b')}
          style={{ flexDirection: 'row', alignItems: 'center', gap: 7, backgroundColor: colors.darkAzure, borderRadius: radii.pill, paddingVertical: 9, paddingHorizontal: 14 }}
        >
          <Text style={{ fontFamily: 'Lexend_500Medium', fontSize: 13, color: colors.white }}>Filtros</Text>
          {ativos > 0 ? (
            <View style={{ backgroundColor: alpha(colors.white, 0.22), borderRadius: 10, paddingHorizontal: 6, paddingVertical: 1 }}>
              <Text style={{ fontFamily: 'Lexend_600SemiBold', fontSize: 11, color: colors.white }}>{ativos}</Text>
            </View>
          ) : null}
        </Pressable>

        {ATALHOS.map((a) => {
          const on = filters.adaptacoesDesejadas.includes(a.key);
          return (
            <Pressable
              key={a.key}
              onPress={() => toggleAtalho(a.key)}
              style={{
                borderRadius: radii.pill,
                paddingVertical: 9,
                paddingHorizontal: 14,
                backgroundColor: on ? palette.chipSelectedBg : palette.surface,
                borderWidth: 1,
                borderColor: on ? palette.chipSelectedBorder : palette.chipBorder,
              }}
            >
              <Text style={{ fontFamily: on ? 'Lexend_500Medium' : 'Lexend_400Regular', fontSize: 13, color: on ? colors.accent2 : palette.text }}>
                {a.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {recomendados.length ? (
        <View style={{ paddingHorizontal: 20, gap: 10 }}>
          <View style={{ flexDirection: 'row', gap: 12, backgroundColor: colors.darkAzure, borderRadius: radii.xl, padding: 15 }}>
            <View style={{ width: 34, height: 34, borderRadius: 11, backgroundColor: colors.accent1, alignItems: 'center', justifyContent: 'center' }}>
              <Award size={18} color={colors.white} strokeWidth={2} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[type.eyebrow, { fontSize: 10, color: colors.pastelGreen }]}>Vita recomenda</Text>
              <Text style={[type.bodySm, { fontSize: 12.5, lineHeight: 18, color: colors.offWhite, opacity: 0.9, marginTop: 4 }]}>
                Visitamos, conversamos com a equipe e confirmamos as adaptações.
              </Text>
            </View>
          </View>

          {recomendados.map((p) => (
            <PartnerCard key={p.id} partner={p} onPress={() => navigation.navigate('PartnerDetail1c', { partnerId: p.id })} />
          ))}
        </View>
      ) : null}

      {comunidade.length ? (
        <View style={{ paddingHorizontal: 20, gap: 10 }}>
          <View style={{ flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', marginTop: 4 }}>
            <Text style={[type.cardTitle, { fontSize: 16, color: palette.text }]}>Indicados pela comunidade</Text>
            <Text style={[type.caption, { fontSize: 12.5, color: palette.textFaint }]}>{comunidade.length} {comunidade.length === 1 ? 'lugar' : 'lugares'}</Text>
          </View>
          {comunidade.map((p) => (
            <PartnerCard
              key={p.id}
              partner={p}
              density="comunidade"
              onPress={() => navigation.navigate('PartnerDetail1c', { partnerId: p.id })}
            />
          ))}
        </View>
      ) : null}

      {!visiveis.length ? (
        <View style={{ marginHorizontal: 20, backgroundColor: palette.surface, borderWidth: 1, borderStyle: 'dashed', borderColor: palette.chipBorder, borderRadius: radii.xl, padding: 20, gap: 8 }}>
          <Text style={[type.cardTitle, { fontSize: 16, color: palette.text }]}>Nenhum parceiro com esses filtros</Text>
          <Text style={[type.bodySm, { fontSize: 13, lineHeight: 20, color: palette.textMuted }]}>
            Tente aumentar a distância ou tirar uma das adaptações — a lista volta a crescer.
          </Text>
          <Pressable onPress={() => navigation.navigate('Filters1b')} hitSlop={10} style={{ alignSelf: 'flex-start', paddingVertical: 4 }}>
            <Text style={[type.bodySm, { fontSize: 13, color: colors.accent2, fontFamily: 'Lexend_500Medium' }]}>Ajustar filtros</Text>
          </Pressable>
        </View>
      ) : null}

      <View style={{ paddingHorizontal: 20, alignItems: 'center', gap: 4, marginTop: 4 }}>
        <Text style={[type.caption, { fontSize: 12, color: palette.textFaint, textAlign: 'center' }]}>
          Conhece um lugar que adapta de verdade?
        </Text>
        <Pressable onPress={() => navigation.navigate('BecomePartner1g')} accessibilityRole="button" style={{ minHeight: 44, justifyContent: 'center', paddingHorizontal: 12 }}>
          <Text style={[type.bodySm, { fontSize: 13, color: colors.accent2, fontFamily: 'Lexend_500Medium' }]}>Indique ou seja parceiro</Text>
        </Pressable>
      </View>

    </ScreenContainer>
  );
}
