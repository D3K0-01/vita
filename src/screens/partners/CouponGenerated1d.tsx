import React from 'react';
import { View, Text, Pressable, Linking, ScrollView } from 'react-native';
import { X, Share2, Check, MessageCircle } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../theme/ThemeProvider';
import { ScreenContainer } from '../../components/ScreenContainer';
import { Button } from '../../components/Button';
import { CouponCard } from '../../components/partners/CouponCard';
import { useApp } from '../../state/AppContext';
import { getPartner } from '../../data/partners';

export default function CouponGenerated1d({ navigation, route }: any) {
  const { palette, colors, type, radii, gradients } = useTheme();
  const { state } = useApp();

  const partnerId: string = route.params?.partnerId;
  const couponId: string = route.params?.couponId;
  const partner = getPartner(partnerId, state.communityPartners);
  const coupon = state.coupons.find((c) => c.id === couponId) ?? state.coupons.find((c) => c.partnerId === partnerId);

  if (!partner || !coupon) {
    return (
      <ScreenContainer contentStyle={{ padding: 20 }}>
        <Text style={[type.body, { color: palette.text }]}>Cupom não encontrado.</Text>
      </ScreenContainer>
    );
  }

  const avisarWhatsApp = () => {
    const msg = encodeURIComponent(
      `Oi! Tenho o cupom ${coupon.codigo} do Vita (${partner.beneficio.titulo}). Queria agendar um horário reservado para o meu filho. Podem me ajudar?`
    );
    Linking.openURL(`https://wa.me/${partner.contato.whatsapp}?text=${msg}`).catch(() => {});
  };

  return (
    <ScreenContainer scroll={false}>
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 10, paddingBottom: 6 }}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={12} accessibilityRole="button" accessibilityLabel="Fechar">
          <X size={22} color={palette.text} strokeWidth={2} />
        </Pressable>
        <Text style={[type.cardTitle, { flex: 1, textAlign: 'center', fontSize: 17, color: palette.text }]}>Seu cupom</Text>
        <Share2 size={19} color={palette.text} strokeWidth={1.9} />
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 28, gap: 16 }} showsVerticalScrollIndicator={false}>
        <View style={{ alignItems: 'center', gap: 10, marginTop: 10 }}>
          <LinearGradient colors={gradients.achievement} style={{ width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center' }}>
            <Check size={30} color={colors.white} strokeWidth={3} />
          </LinearGradient>
          <Text style={[type.title, { fontSize: 24, color: palette.text }]}>Cupom liberado</Text>
          <Text style={[type.bodySm, { fontSize: 13, color: palette.textMuted, textAlign: 'center' }]}>
            Mostre esta tela no balcão do {partner.nome}.
          </Text>
        </View>

        <CouponCard partner={partner} coupon={coupon} />

        {partner.beneficio.antesDeIr ? (
          <View style={{ backgroundColor: colors.darkAzure, borderRadius: radii.xl, padding: 16 }}>
            <Text style={[type.cardTitle, { fontSize: 15, color: colors.white }]}>Antes de ir</Text>
            <Text style={[type.bodySm, { fontSize: 12.5, lineHeight: 20, color: colors.offWhite, opacity: 0.9, marginTop: 6 }]}>
              {partner.beneficio.antesDeIr}
            </Text>
          </View>
        ) : null}

        <View style={{ gap: 10 }}>
          <Pressable
            onPress={avisarWhatsApp}
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
            <MessageCircle size={17} color={colors.white} strokeWidth={2} />
            <Text style={{ fontFamily: 'BricolageGrotesque_600SemiBold', fontSize: 15, color: colors.white }}>Avisar no WhatsApp</Text>
          </Pressable>

          <Button label="Salvar em Meus cupons" variant="ghost" onPress={() => navigation.navigate('MyCoupons1h')} />
        </View>

        <Text style={[type.caption, { fontSize: 11.5, color: palette.textFaint, textAlign: 'center' }]}>
          O cupom já está salvo em Meus cupons e funciona offline.
        </Text>
      </ScrollView>
    </ScreenContainer>
  );
}
