import React from 'react';
import { View, Text, Pressable, ScrollView, TextInput } from 'react-native';
import { X, Search, Check, Award } from 'lucide-react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { ScreenContainer } from '../../components/ScreenContainer';
import { Button } from '../../components/Button';
import { Switch } from '../../components/Switch';
import { Chip } from '../../components/Chip';
import { SensoryLevelSelector } from '../../components/partners/SensoryLevelSelector';
import { useApp } from '../../state/AppContext';
import { usePartnerFilters } from '../../state/PartnerFilters';
import {
  ADAPTACOES,
  CATEGORIAS,
  DISTANCIAS,
  filterPartners,
  partners,
  type AdaptacaoKey,
  type CategoriaKey,
} from '../../data/partners';

export default function Filters1b({ navigation }: any) {
  const { palette, colors, type, radii } = useTheme();
  const { state } = useApp();
  const { filters, patch, clear } = usePartnerFilters();

  const todos = [...partners, ...state.communityPartners];
  const resultado = filterPartners(todos, filters).length;

  const toggleCategoria = (key: CategoriaKey) =>
    patch({
      categorias: filters.categorias.includes(key)
        ? filters.categorias.filter((k) => k !== key)
        : [...filters.categorias, key],
    });

  const toggleAdaptacao = (key: AdaptacaoKey) =>
    patch({
      adaptacoesDesejadas: filters.adaptacoesDesejadas.includes(key)
        ? filters.adaptacoesDesejadas.filter((k) => k !== key)
        : [...filters.adaptacoesDesejadas, key],
    });

  const distIndex = Math.max(0, DISTANCIAS.indexOf(filters.distanciaMaxKm));

  return (
    <ScreenContainer scroll={false}>
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 10, paddingBottom: 12 }}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={12} accessibilityRole="button" accessibilityLabel="Fechar filtros">
          <X size={22} color={palette.text} strokeWidth={2} />
        </Pressable>
        <Text style={[type.cardTitle, { flex: 1, textAlign: 'center', fontSize: 17, color: palette.text }]}>Filtros</Text>
        <Pressable onPress={clear} hitSlop={12}>
          <Text style={[type.bodySm, { fontSize: 13, color: colors.accent2 }]}>limpar</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24, gap: 20 }} showsVerticalScrollIndicator={false}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: palette.surface, borderWidth: 1, borderColor: palette.surfaceBorder, borderRadius: radii.md, paddingHorizontal: 14 }}>
          <Search size={17} color={palette.hint} strokeWidth={2} />
          <TextInput
            value={filters.buscaTexto}
            onChangeText={(t) => patch({ buscaTexto: t })}
            placeholder="Barbearia, festa, dentista…"
            placeholderTextColor={palette.textFaint}
            style={{ flex: 1, paddingVertical: 12, fontFamily: 'Lexend_400Regular', fontSize: 13.5, color: palette.text }}
          />
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: palette.surface, borderWidth: 1, borderColor: palette.surfaceBorder, borderRadius: radii.lg, padding: 14 }}>
          <View style={{ width: 34, height: 34, borderRadius: 11, backgroundColor: colors.darkAzure, alignItems: 'center', justifyContent: 'center' }}>
            <Award size={18} color={colors.pastelGreen} strokeWidth={2} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[type.bodySm, { fontSize: 13.5, color: palette.text, fontFamily: 'Lexend_500Medium' }]}>Só com selo Vita recomenda</Text>
            <Text style={[type.caption, { fontSize: 11.5, color: palette.textFaint }]}>Lugares que a equipe visitou</Text>
          </View>
          <Switch value={filters.apenasSeloVita} onValueChange={(v) => patch({ apenasSeloVita: v })} />
        </View>

        <View style={{ gap: 10 }}>
          <Text style={[type.eyebrow, { fontSize: 10, color: palette.hint }]}>Categoria</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {CATEGORIAS.map((c) => (
              <Chip key={c.key} label={c.label} selected={filters.categorias.includes(c.key)} onPress={() => toggleCategoria(c.key)} />
            ))}
          </View>
        </View>

        <View style={{ gap: 10 }}>
          <Text style={[type.eyebrow, { fontSize: 10, color: palette.hint }]}>Adaptações necessárias</Text>
          <View style={{ backgroundColor: palette.surface, borderWidth: 1, borderColor: palette.surfaceBorder, borderRadius: radii.lg, paddingHorizontal: 14 }}>
            {ADAPTACOES.map((a, i) => {
              const on = filters.adaptacoesDesejadas.includes(a.key);
              return (
                <Pressable
                  key={a.key}
                  onPress={() => toggleAdaptacao(a.key)}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: on }}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 11,
                    paddingVertical: 12,
                    borderTopWidth: i === 0 ? 0 : 1,
                    borderTopColor: palette.divider,
                  }}
                >
                  <View
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: 7,
                      borderWidth: on ? 0 : 1.6,
                      borderColor: palette.chipBorder,
                      backgroundColor: on ? colors.accent1 : 'transparent',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {on ? <Check size={13} color={colors.white} strokeWidth={3} /> : null}
                  </View>
                  <Text style={[type.bodySm, { flex: 1, fontSize: 13.5, color: palette.text }]}>{a.label}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={{ gap: 10 }}>
          <Text style={[type.eyebrow, { fontSize: 10, color: palette.hint }]}>Estímulo sensorial máximo</Text>
          <SensoryLevelSelector value={filters.estimuloMax} onChange={(v) => patch({ estimuloMax: v })} />
        </View>

        <View style={{ gap: 10 }}>
          <Text style={[type.eyebrow, { fontSize: 10, color: palette.hint }]}>Distância</Text>
          <View style={{ backgroundColor: palette.surface, borderWidth: 1, borderColor: palette.surfaceBorder, borderRadius: radii.lg, padding: 16 }}>
            <View style={{ flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 14 }}>
              <Text style={[type.bodySm, { fontSize: 13, color: palette.textMuted }]}>até</Text>
              <Text style={[type.cardTitle, { fontSize: 17, color: palette.text }]}>{filters.distanciaMaxKm} km</Text>
            </View>

            <View style={{ height: 6, borderRadius: 3, backgroundColor: colors.pastelGreen + '66', justifyContent: 'center' }}>
              <View
                style={{
                  position: 'absolute',
                  left: 0,
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: colors.accent1,
                  width: `${(distIndex / (DISTANCIAS.length - 1)) * 100}%`,
                }}
              />
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
              {DISTANCIAS.map((d) => {
                const on = d === filters.distanciaMaxKm;
                return (
                  <Pressable key={d} onPress={() => patch({ distanciaMaxKm: d })} hitSlop={10} style={{ alignItems: 'center', gap: 6 }}>
                    <View style={{ height: 16, justifyContent: 'center' }}>
                      <View
                        style={{
                          width: on ? 16 : 10,
                          height: on ? 16 : 10,
                          borderRadius: 8,
                          backgroundColor: on ? colors.white : colors.pastelGreen,
                          borderWidth: on ? 2.5 : 0,
                          borderColor: colors.accent1,
                        }}
                      />
                    </View>
                    <Text style={[type.caption, { fontSize: 11, color: on ? palette.text : palette.textFaint }]}>{d} km</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={{ paddingHorizontal: 20, paddingTop: 12, paddingBottom: 22, borderTopWidth: 1, borderTopColor: palette.divider, backgroundColor: palette.bg }}>
        <Button
          label={resultado === 1 ? 'Ver 1 parceiro' : `Ver ${resultado} parceiros`}
          onPress={() => navigation.goBack()}
          disabled={resultado === 0}
        />
        {resultado === 0 ? (
          <Text style={[type.caption, { fontSize: 11.5, color: palette.textFaint, textAlign: 'center', marginTop: 8 }]}>
            Nenhum lugar atende a todos esses critérios juntos.
          </Text>
        ) : null}
      </View>
    </ScreenContainer>
  );
}
