import React from 'react';
import { View, Text } from 'react-native';
import { Star } from 'lucide-react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { Avatar } from '../Avatar';
import { TagPill } from './TagPill';
import type { Review } from '../../data/partners';

export function Stars({ value, size = 12 }: { value: number; size?: number }) {
  const { colors, alpha } = useTheme();
  return (
    <View style={{ flexDirection: 'row', gap: 2 }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          size={size}
          color={n <= Math.round(value) ? colors.accent1 : alpha(colors.greyAzure, 0.45)}
          fill={n <= Math.round(value) ? colors.accent1 : alpha(colors.greyAzure, 0.45)}
          strokeWidth={0}
        />
      ))}
    </View>
  );
}

export function ReviewCard({ review }: { review: Review }) {
  const { palette, type, radii } = useTheme();
  return (
    <View style={{ backgroundColor: palette.surface, borderWidth: 1, borderColor: palette.surfaceBorder, borderRadius: radii.lg, padding: 15 }}>
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 11 }}>
        <Avatar name={review.autorNome} size={36} />
        <View style={{ flex: 1 }}>
          <Text style={[type.bodySm, { fontSize: 13.5, color: palette.text, fontFamily: 'Lexend_500Medium' }]}>{review.autorNome}</Text>
          <Text style={[type.caption, { fontSize: 11.5, color: palette.textFaint }]}>
            {review.relacao} · {review.criancaIdade} anos · {review.condicao}
          </Text>
        </View>
        <Stars value={review.rating} />
      </View>

      <Text style={[type.bodySm, { fontSize: 13, lineHeight: 20, color: palette.text, marginTop: 10 }]}>{review.texto}</Text>

      {review.tags.length ? (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 11 }}>
          {review.tags.map((t) => (
            <TagPill key={t} label={t} />
          ))}
        </View>
      ) : null}

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 11, paddingTop: 10, borderTopWidth: 1, borderTopColor: palette.divider }}>
        <Text style={[type.caption, { fontSize: 11.5, color: palette.textMuted }]}>útil · {review.uteisCount}</Text>
        <Text style={[type.caption, { fontSize: 11.5, color: palette.textFaint }]}>{review.criadoEm}</Text>
      </View>
    </View>
  );
}
