import React from 'react';
import { View, Text } from 'react-native';
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

export function CouponCardCompact({ partner, coupon, footer }: { partner: Partner; coupon: Coupon; footer?: React.ReactNode }) {
  const { palette, colors, type, radii, alpha } = useTheme();
  const usado = coupon.status === 'usado';

  return (
    <View
      style={{
        backgroundColor: palette.surface,
        borderWidth: 1,
        borderColor: palette.surfaceBorder,
        borderRadius: radii.lg,
        padding: 13,
        opacity: usado ? 0.75 : 1,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <PhotoPlaceholder label="Logo" height={46} radius={13} style={{ width: 46 }} fontSize={9.5} />
        <View style={{ flex: 1, gap: 2 }}>
          <SeloBadge selo={partner.selo} size={9} />
          <Text style={[type.cardTitle, { fontSize: 15.5, color: palette.text }]} numberOfLines={1}>
            {partner.nome}
          </Text>
          <Text style={[type.caption, { fontSize: 11.5, color: palette.textFaint }]} numberOfLines={1}>
            {partner.beneficio.titulo}
          </Text>
          <Text style={{ fontFamily: 'BricolageGrotesque_600SemiBold', fontSize: 14, letterSpacing: 1.4, color: palette.text, marginTop: 2 }}>
            {coupon.codigo}
          </Text>
        </View>
        <View
          style={{
            backgroundColor: usado ? alpha(colors.greyAzure, 0.2) : alpha(colors.pastelGreen, 0.55),
            borderRadius: 8,
            paddingVertical: 4,
            paddingHorizontal: 8,
            maxWidth: 92,
          }}
        >
          <Text style={{ fontFamily: 'Lexend_500Medium', fontSize: 10.5, color: usado ? palette.textMuted : colors.accent2, textAlign: 'center' }}>
            {coupon.validade}
          </Text>
        </View>
      </View>
      {footer}
    </View>
  );
}
