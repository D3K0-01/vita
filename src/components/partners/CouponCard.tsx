import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { PhotoPlaceholder } from './PhotoPlaceholder';
import { SeloBadge } from './SeloBadge';
import type { Coupon, Partner } from '../../data/partners';

// Barras decorativas — o código de barras real viria do backend do parceiro.
const BAR_WIDTHS = [2, 4, 1.5, 3, 2, 5, 1.5, 2.5, 4, 1.5, 3, 2, 4.5, 1.5, 2, 3.5, 2, 4, 1.5, 3, 2.5, 4, 1.5, 2];

export function CouponCard({ partner, coupon }: { partner: Partner; coupon: Coupon }) {
  const { palette, colors, type, radii, alpha } = useTheme();

  return (
    <View style={{ backgroundColor: palette.surface, borderWidth: 1, borderColor: palette.surfaceBorder, borderRadius: radii.xl, overflow: 'hidden' }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16 }}>
        <PhotoPlaceholder label="Logo" height={52} radius={14} style={{ width: 52 }} fontSize={10} />
        <View style={{ flex: 1 }}>
          <Text style={[type.cardTitle, { fontSize: 17, color: palette.text }]}>{partner.nome}</Text>
          <Text style={[type.caption, { fontSize: 11.5, color: palette.textFaint }]}>
            {partner.categoria} · {partner.bairro}
          </Text>
        </View>
      </View>

      <View style={{ paddingHorizontal: 16, paddingBottom: 16 }}>
        <Text style={{ fontFamily: 'BricolageGrotesque_600SemiBold', fontSize: 26, color: colors.accent2 }}>
          {partner.beneficio.resumo}
        </Text>
        <Text style={[type.bodySm, { fontSize: 13, color: palette.textMuted, marginTop: 4 }]}>{partner.beneficio.titulo}</Text>
      </View>

      {/* divisor estilo ticket */}
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: palette.bg, marginLeft: -10 }} />
        <View style={{ flex: 1, height: 1, borderTopWidth: 1.5, borderStyle: 'dashed', borderColor: palette.divider }} />
        <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: palette.bg, marginRight: -10 }} />
      </View>

      <View style={{ alignItems: 'center', padding: 16 }}>
        <Text style={[type.eyebrow, { fontSize: 10, color: palette.hint }]}>Código</Text>
        <Text style={{ fontFamily: 'BricolageGrotesque_600SemiBold', fontSize: 25, letterSpacing: 2, color: palette.text, marginTop: 6 }}>
          {coupon.codigo}
        </Text>

        <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 2, height: 44, marginTop: 14 }}>
          {BAR_WIDTHS.map((w, i) => (
            <View key={i} style={{ width: w, height: i % 3 === 0 ? 44 : 38, backgroundColor: alpha(colors.darkAzure, 0.85) }} />
          ))}
        </View>

        <Text style={[type.caption, { fontSize: 11.5, color: palette.textFaint, marginTop: 10 }]}>{partner.beneficio.validade}</Text>
      </View>
    </View>
  );
}

export function CouponCardCompact({ partner, coupon, footer, onPress }: { partner: Partner; coupon: Coupon; footer?: React.ReactNode; onPress?: () => void }) {
  const { palette, colors, type, radii, alpha } = useTheme();
  const usado = coupon.status === 'usado';
  const b = partner.beneficio;

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      accessibilityHint={onPress ? `Abre o cupom de ${partner.nome}` : undefined}
      style={({ pressed }) => ({
        backgroundColor: palette.surface,
        borderWidth: 1,
        borderColor: palette.surfaceBorder,
        borderRadius: radii.lg,
        overflow: 'hidden',
        opacity: usado ? 0.75 : pressed ? 0.9 : 1,
      })}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 13 }}>
        <PhotoPlaceholder label="Logo" height={42} radius={12} style={{ width: 42 }} fontSize={9} />
        <View style={{ flex: 1, gap: 2 }}>
          <SeloBadge selo={partner.selo} size={9} />
          <Text style={[type.cardTitle, { fontSize: 15.5, color: palette.text }]} numberOfLines={1}>
            {partner.nome}
          </Text>
          <Text style={[type.caption, { fontSize: 11.5, color: palette.textFaint }]} numberOfLines={1}>
            {partner.categoria} · {partner.bairro}
          </Text>
        </View>
        <View style={{ backgroundColor: usado ? alpha(colors.greyAzure, 0.2) : alpha(colors.pastelGreen, 0.55), borderRadius: 8, paddingVertical: 4, paddingHorizontal: 8, maxWidth: 96 }}>
          <Text style={{ fontFamily: 'Lexend_500Medium', fontSize: 10.5, color: usado ? palette.textMuted : colors.accent2, textAlign: 'center' }}>
            {usado ? 'usado' : coupon.validade}
          </Text>
        </View>
      </View>

      {/* o benefício em destaque: o que o cupom dá */}
      <View style={{ marginHorizontal: 13, backgroundColor: alpha(colors.pastelGreen, usado ? 0.25 : 0.45), borderRadius: 14, padding: 13, flexDirection: 'row', gap: 12, alignItems: 'center' }}>
        <View style={{ backgroundColor: colors.accent2, borderRadius: 12, paddingVertical: 8, paddingHorizontal: 10, minWidth: 74, alignItems: 'center' }}>
          <Text style={{ fontFamily: 'BricolageGrotesque_600SemiBold', fontSize: 15, color: '#fff', textAlign: 'center' }} numberOfLines={2}>
            {b.resumo}
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[type.eyebrow, { fontSize: 9.5, color: colors.accent2 }]}>Seu benefício</Text>
          <Text style={[type.body, { fontSize: 14, color: palette.text, fontFamily: 'Lexend_500Medium', marginTop: 2 }]}>{b.titulo}</Text>
        </View>
      </View>

      <View style={{ paddingHorizontal: 13, paddingTop: 10, paddingBottom: 13, gap: 6 }}>
        <Text style={[type.caption, { fontSize: 12, color: palette.textMuted, lineHeight: 18 }]}>{b.regras}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 2 }}>
          <Text style={{ fontFamily: 'BricolageGrotesque_600SemiBold', fontSize: 14, letterSpacing: 1.4, color: palette.text }}>{coupon.codigo}</Text>
          {onPress && !usado ? (
            <Pressable onPress={onPress} accessibilityRole="button" style={{ minHeight: 36, justifyContent: 'center', paddingLeft: 10 }}>
              <Text style={[type.caption, { fontSize: 12.5, color: colors.accent2, fontFamily: 'Lexend_500Medium' }]}>mostrar no balcão ›</Text>
            </Pressable>
          ) : null}
        </View>
        {footer}
      </View>
    </Pressable>
  );
}
