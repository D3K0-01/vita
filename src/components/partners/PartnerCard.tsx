import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Star } from 'lucide-react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { PhotoPlaceholder } from './PhotoPlaceholder';
import { SeloBadge } from './SeloBadge';
import { BenefitTag } from './BenefitTag';
import { TagPill } from './TagPill';
import { formatKm, formatRating, type Partner } from '../../data/partners';

type Props = {
  partner: Partner;
  onPress?: () => void;
  /** `comunidade` troca o rating por "N famílias indicaram". */
  density?: 'recomendado' | 'comunidade';
};

export function PartnerCard({ partner, onPress, density = 'recomendado' }: Props) {
  const { palette, colors, type, radii } = useTheme();
  const indicacoes = partner.indicacoes ?? 0;
  const meta =
    density === 'comunidade'
      ? `${partner.categoria} · ${formatKm(partner.distanciaKm)} · ${indicacoes} ${indicacoes === 1 ? 'família indicou' : 'famílias indicaram'}`
      : `${partner.categoria} · ${formatKm(partner.distanciaKm)}`;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        flexDirection: 'row',
        gap: 12,
        backgroundColor: palette.surface,
        borderWidth: 1,
        borderColor: palette.surfaceBorder,
        borderRadius: radii.xl,
        padding: 12,
        opacity: pressed ? 0.85 : 1,
      })}
    >
      <PhotoPlaceholder label={partner.categoria} height={82} radius={15} style={{ width: 82 }} />

      <View style={{ flex: 1, gap: 4 }}>
        <SeloBadge selo={partner.selo} size={9.5} />
        <Text style={[type.cardTitle, { fontSize: 16, color: palette.text }]} numberOfLines={1}>
          {partner.nome}
        </Text>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          <Text style={[type.caption, { fontSize: 11.5, color: palette.textFaint }]} numberOfLines={2}>
            {meta}
          </Text>
          {density === 'recomendado' && partner.rating != null ? (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
              <Star size={11} color={colors.accent1} fill={colors.accent1} strokeWidth={0} />
              <Text style={{ fontFamily: 'Lexend_500Medium', fontSize: 11.5, color: palette.text }}>
                {formatRating(partner.rating)}
              </Text>
            </View>
          ) : null}
        </View>

        <View style={{ marginTop: 2 }}>
          <BenefitTag tipo={partner.beneficio.tipo} label={partner.beneficio.resumo} />
        </View>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 5, marginTop: 2 }}>
          {partner.tagsRapidas.map((t) => (
            <TagPill key={t} label={t} />
          ))}
        </View>

        {partner.emAnalise ? (
          <Text style={[type.caption, { fontSize: 11, color: palette.hint, marginTop: 2 }]}>
            cadastro em análise · visita ainda não agendada
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
}
