import React, { useMemo, useState } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { ChevronLeft, PencilLine } from 'lucide-react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { ScreenContainer } from '../../components/ScreenContainer';
import { SensoryBar } from '../../components/partners/SensoryBar';
import { ReviewCard, Stars } from '../../components/partners/ReviewCard';
import { useApp } from '../../state/AppContext';
import { formatRating, getPartner, partnerReviews } from '../../data/partners';

export default function PartnerReviews1f({ navigation, route }: any) {
  const { palette, colors, type, radii } = useTheme();
  const { state } = useApp();
  const [condicao, setCondicao] = useState('Todos');

  const partnerId: string = route.params?.partnerId;
  const partner = getPartner(partnerId, state.communityPartners);

  const relatos = useMemo(
    () => [...state.userReviews, ...partnerReviews].filter((r) => r.partnerId === partnerId),
    [state.userReviews, partnerId]
  );

  // Os chips de condição saem das próprias avaliações do parceiro.
  const condicoes = useMemo(() => ['Todos', ...Array.from(new Set(relatos.map((r) => r.condicao)))], [relatos]);
  const lista = condicao === 'Todos' ? relatos : relatos.filter((r) => r.condicao === condicao);

  // A nota e o total vêm do parceiro (agregado oficial); os relatos carregados
  // são uma amostra, então não recalculamos a média em cima deles.
  const mediaCalculada = relatos.length ? relatos.reduce((acc, r) => acc + r.rating, 0) / relatos.length : 0;
  const media = partner?.rating ?? mediaCalculada;
  const totalRelatos = Math.max(partner?.totalAvaliacoes ?? 0, relatos.length);
  const sub = partner?.subnotas;

  if (!partner) {
    return (
      <ScreenContainer contentStyle={{ padding: 20 }}>
        <Text style={[type.body, { color: palette.text }]}>Parceiro não encontrado.</Text>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer scroll={false}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 20, paddingTop: 10, paddingBottom: 12 }}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={12} accessibilityRole="button" accessibilityLabel="Voltar">
          <ChevronLeft size={22} color={palette.text} strokeWidth={2} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={[type.cardTitle, { fontSize: 17, color: palette.text }]}>{partner.nome}</Text>
          <Text style={[type.caption, { fontSize: 11.5, color: palette.textFaint }]}>{totalRelatos} relatos de famílias</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24, gap: 14 }} showsVerticalScrollIndicator={false}>
        <View style={{ flexDirection: 'row', gap: 16, alignItems: 'center', backgroundColor: palette.surface, borderWidth: 1, borderColor: palette.surfaceBorder, borderRadius: radii.xl, padding: 16 }}>
          <View style={{ alignItems: 'center', gap: 6 }}>
            <Text style={{ fontFamily: 'BricolageGrotesque_600SemiBold', fontSize: 38, lineHeight: 42, color: palette.text }}>
              {media ? formatRating(media) : '—'}
            </Text>
            <Stars value={media} />
          </View>
          <View style={{ flex: 1, gap: 9 }}>
            <SensoryBar labelWidth={80} label="Acolhimento" progress={(sub?.acolhimento ?? media) / 5} value={formatRating(sub?.acolhimento ?? media)} />
            <SensoryBar labelWidth={80} label="Ruído real" progress={(sub?.ruidoReal ?? media) / 5} value={formatRating(sub?.ruidoReal ?? media)} tone="medium" />
            <SensoryBar labelWidth={80} label="Espera" progress={(sub?.espera ?? media) / 5} value={formatRating(sub?.espera ?? media)} />
          </View>
        </View>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {condicoes.map((c) => {
            const on = c === condicao;
            return (
              <Pressable
                key={c}
                onPress={() => setCondicao(c)}
                style={{
                  borderRadius: radii.pill,
                  paddingVertical: 8,
                  paddingHorizontal: 13,
                  backgroundColor: on ? palette.chipSelectedBg : palette.surface,
                  borderWidth: 1,
                  borderColor: on ? palette.chipSelectedBorder : palette.chipBorder,
                }}
              >
                <Text style={{ fontFamily: on ? 'Lexend_500Medium' : 'Lexend_400Regular', fontSize: 12.5, color: on ? colors.accent2 : palette.text }}>{c}</Text>
              </Pressable>
            );
          })}
        </View>

        {lista.length ? (
          lista.map((r) => <ReviewCard key={r.id} review={r} />)
        ) : (
          <View style={{ backgroundColor: palette.surface, borderWidth: 1, borderStyle: 'dashed', borderColor: palette.chipBorder, borderRadius: radii.xl, padding: 20 }}>
            <Text style={[type.bodySm, { fontSize: 13, lineHeight: 20, color: palette.textMuted }]}>
              Ainda não há relatos com esse filtro. O seu pode ser o primeiro.
            </Text>
          </View>
        )}
      </ScrollView>

      <View style={{ paddingHorizontal: 20, paddingTop: 12, paddingBottom: 22, borderTopWidth: 1, borderTopColor: palette.divider }}>
        <Pressable
          onPress={() => navigation.navigate('NewReview', { partnerId: partner.id })}
          style={({ pressed }) => ({
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            borderRadius: radii.pill,
            backgroundColor: colors.accent1,
            paddingVertical: 17,
            opacity: pressed ? 0.85 : 1,
          })}
        >
          <PencilLine size={16} color={colors.white} strokeWidth={2} />
          <Text style={{ fontFamily: 'BricolageGrotesque_600SemiBold', fontSize: 15, color: colors.white }}>Contar como foi pra gente</Text>
        </Pressable>
      </View>
    </ScreenContainer>
  );
}
