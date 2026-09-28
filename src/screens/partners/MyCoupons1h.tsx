import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { ScreenContainer } from '../../components/ScreenContainer';
import { CouponCardCompact } from '../../components/partners/CouponCard';
import { useApp } from '../../state/AppContext';
import { getPartner } from '../../data/partners';

export default function MyCoupons1h({ navigation }: any) {
  const { palette, colors, type, radii, alpha } = useTheme();
  const { state, markCouponUsed } = useApp();
  const [tab, setTab] = useState<'ativos' | 'usados'>('ativos');

  const ativos = state.coupons.filter((c) => c.status === 'ativo');
  const usados = state.coupons.filter((c) => c.status === 'usado');
  const lista = tab === 'ativos' ? ativos : usados;

  return (
    <ScreenContainer scroll={false}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 20, paddingTop: 10, paddingBottom: 12 }}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={12} accessibilityRole="button" accessibilityLabel="Voltar">
          <ChevronLeft size={22} color={palette.text} strokeWidth={2} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={[type.cardTitle, { fontSize: 19, color: palette.text }]}>Meus cupons</Text>
          <Text style={[type.caption, { fontSize: 11.5, color: palette.textFaint }]}>
            {ativos.length} {ativos.length === 1 ? 'ativo' : 'ativos'} · {usados.length} {usados.length === 1 ? 'usado' : 'usados'}
          </Text>
        </View>
      </View>

      <View style={{ flexDirection: 'row', gap: 22, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: palette.divider }}>
        {(['ativos', 'usados'] as const).map((t) => (
          <Pressable
            key={t}
            onPress={() => setTab(t)}
            accessibilityRole="tab"
            accessibilityState={{ selected: tab === t }}
            style={{ paddingBottom: 10, borderBottomWidth: 2.5, borderBottomColor: tab === t ? palette.text : 'transparent', marginBottom: -1 }}
          >
            <Text
              style={{
                fontFamily: tab === t ? 'Lexend_600SemiBold' : 'Lexend_400Regular',
                fontSize: 14,
                color: tab === t ? palette.text : palette.textMuted,
                textTransform: 'capitalize',
              }}
            >
              {t}
            </Text>
          </Pressable>
        ))}
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 14, paddingBottom: 24, gap: 10 }} showsVerticalScrollIndicator={false}>
        {lista.map((coupon) => {
          const partner = getPartner(coupon.partnerId, state.communityPartners);
          if (!partner) return null;

          return (
            <View key={coupon.id} style={{ gap: 10 }}>
              <CouponCardCompact
                partner={partner}
                coupon={coupon}
                footer={
                  coupon.status === 'ativo' ? (
                    <View style={{ flexDirection: 'row', gap: 16, marginTop: 12, paddingTop: 10, borderTopWidth: 1, borderTopColor: palette.divider }}>
                      <Pressable onPress={() => navigation.navigate('PartnerDetail1c', { partnerId: partner.id })}>
                        <Text style={[type.caption, { fontSize: 12.5, color: palette.textMuted }]}>ver parceiro</Text>
                      </Pressable>
                      <Pressable onPress={() => markCouponUsed(coupon.id)} style={{ marginLeft: 'auto' }}>
                        <Text style={[type.caption, { fontSize: 12.5, color: colors.accent2, fontFamily: 'Lexend_500Medium' }]}>marcar como usado</Text>
                      </Pressable>
                    </View>
                  ) : null
                }
              />

              {coupon.status === 'usado' && !coupon.avaliado ? (
                <View style={{ backgroundColor: alpha(colors.pastelGreen, 0.45), borderRadius: radii.lg, padding: 14 }}>
                  <Text style={[type.bodySm, { fontSize: 12.5, lineHeight: 19, color: palette.text }]}>
                    Você ainda não contou como foi. Dois minutos ajudam outra família a decidir.
                  </Text>
                  <Pressable onPress={() => navigation.navigate('NewReview', { partnerId: partner.id })} style={{ marginTop: 9 }}>
                    <Text style={[type.bodySm, { fontSize: 13, color: colors.accent2, fontFamily: 'Lexend_500Medium' }]}>Escrever relato</Text>
                  </Pressable>
                </View>
              ) : null}
            </View>
          );
        })}

        {!lista.length ? (
          <View style={{ backgroundColor: palette.surface, borderWidth: 1, borderStyle: 'dashed', borderColor: palette.chipBorder, borderRadius: radii.xl, padding: 20, gap: 8 }}>
            <Text style={[type.cardTitle, { fontSize: 16, color: palette.text }]}>
              {tab === 'ativos' ? 'Nenhum cupom ativo' : 'Nenhum cupom usado ainda'}
            </Text>
            <Text style={[type.bodySm, { fontSize: 13, lineHeight: 20, color: palette.textMuted }]}>
              {tab === 'ativos'
                ? 'Quando você resgatar um benefício, ele fica guardado aqui.'
                : 'Os cupons que você mostrar no balcão aparecem nesta aba.'}
            </Text>
          </View>
        ) : null}
      </ScrollView>

      <View style={{ paddingHorizontal: 20, paddingTop: 12, paddingBottom: 22, borderTopWidth: 1, borderTopColor: palette.divider }}>
        <Text style={[type.caption, { fontSize: 11.5, color: palette.textFaint, textAlign: 'center' }]}>
          Os cupons funcionam offline — dá para mostrar no balcão sem internet.
        </Text>
      </View>
    </ScreenContainer>
  );
}
