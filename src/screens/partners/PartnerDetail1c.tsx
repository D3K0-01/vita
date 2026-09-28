import React from 'react';
import { View, Text, Pressable, Linking } from 'react-native';
import { ChevronLeft, ChevronRight, Bookmark, MapPin, Phone } from 'lucide-react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { ScreenContainer } from '../../components/ScreenContainer';
import { Button } from '../../components/Button';
import { PhotoPlaceholder } from '../../components/partners/PhotoPlaceholder';
import { SeloBadge } from '../../components/partners/SeloBadge';
import { SensoryBar } from '../../components/partners/SensoryBar';
import { AdaptationRow } from '../../components/partners/AdaptationRow';
import { Stars } from '../../components/partners/ReviewCard';
import { useApp } from '../../state/AppContext';
import {
  esperaProgresso,
  formatKm,
  formatRating,
  getPartner,
  nivelLabel,
  nivelProgresso,
  partnerReviews,
} from '../../data/partners';

export default function PartnerDetail1c({ navigation, route }: any) {
  const { palette, colors, type, radii, alpha } = useTheme();
  const { state, generateCoupon, toggleSavedPartner } = useApp();

  const partnerId: string = route.params?.partnerId;
  const partner = getPartner(partnerId, state.communityPartners);
  const salvo = state.savedPartners.includes(partnerId);

  if (!partner) {
    return (
      <ScreenContainer contentStyle={{ padding: 20 }}>
        <Text style={[type.body, { color: palette.text }]}>Parceiro não encontrado.</Text>
      </ScreenContainer>
    );
  }

  const relatos = [...state.userReviews, ...partnerReviews].filter((r) => r.partnerId === partner.id);

  const abrirCupom = () => {
    const coupon = generateCoupon(partner.id);
    navigation.navigate('CouponGenerated1d', { partnerId: partner.id, couponId: coupon.id });
  };

  const ligar = () => {
    Linking.openURL(`tel:${partner.contato.telefone}`).catch(() => {});
  };

  return (
    <ScreenContainer edges={[]} contentStyle={{ paddingBottom: 0 }}>
      <View style={{ height: 250 }}>
        <PhotoPlaceholder label={`Foto do ambiente — ${partner.categoria.toLowerCase()}`} radius={0} style={{ flex: 1 }} fontSize={12} />

        <View style={{ position: 'absolute', top: 54, left: 20, right: 20, flexDirection: 'row', justifyContent: 'space-between' }}>
          <Pressable
            onPress={() => navigation.goBack()}
            accessibilityRole="button"
            accessibilityLabel="Voltar"
            style={{ width: 38, height: 38, borderRadius: 13, backgroundColor: alpha(colors.darkAzure, 0.5), alignItems: 'center', justifyContent: 'center' }}
          >
            <ChevronLeft size={20} color={colors.white} strokeWidth={2} />
          </Pressable>
          <Pressable
            onPress={() => toggleSavedPartner(partner.id)}
            accessibilityRole="button"
            accessibilityLabel={salvo ? 'Remover dos salvos' : 'Salvar parceiro'}
            style={{ width: 38, height: 38, borderRadius: 13, backgroundColor: alpha(colors.darkAzure, 0.5), alignItems: 'center', justifyContent: 'center' }}
          >
            <Bookmark size={19} color={colors.white} fill={salvo ? colors.white : 'transparent'} strokeWidth={1.9} />
          </Pressable>
        </View>

        <View style={{ position: 'absolute', left: 20, bottom: 16 }}>
          <SeloBadge selo={partner.selo} variant="pill" />
        </View>

        {partner.fotos.length > 1 ? (
          <View style={{ position: 'absolute', right: 20, bottom: 22, flexDirection: 'row', gap: 5 }}>
            {partner.fotos.map((f, i) => (
              <View key={f.label} style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: i === 0 ? colors.white : alpha(colors.white, 0.45) }} />
            ))}
          </View>
        ) : null}
      </View>

      <View style={{ padding: 20, gap: 16 }}>
        <View>
          <Text style={[type.title, { fontSize: 26, color: palette.text }]}>{partner.nome}</Text>
          <Text style={[type.caption, { fontSize: 12.5, color: palette.textMuted, marginTop: 5 }]}>
            {partner.categoria} · {partner.endereco} · {partner.bairro} · {formatKm(partner.distanciaKm)}
          </Text>

          <Pressable
            onPress={() => navigation.navigate('PartnerReviews1f', { partnerId: partner.id })}
            style={{ flexDirection: 'row', alignItems: 'center', gap: 7, marginTop: 10 }}
          >
            {partner.rating != null ? (
              <>
                <Stars value={partner.rating} size={14} />
                <Text style={{ fontFamily: 'Lexend_600SemiBold', fontSize: 14, color: palette.text }}>{formatRating(partner.rating)}</Text>
              </>
            ) : null}
            <Text style={[type.caption, { fontSize: 12.5, color: palette.textMuted }]}>
              {partner.rating != null
                ? `· ${partner.totalAvaliacoes} famílias`
                : `${partner.indicacoes ?? 0} famílias indicaram · ${relatos.length} relatos`}
            </Text>
            <ChevronRight size={15} color={palette.hint} strokeWidth={2} />
          </Pressable>
        </View>

        <View style={{ backgroundColor: alpha(colors.pastelGreen, 0.45), borderRadius: radii.xl, padding: 16 }}>
          <Text style={[type.eyebrow, { fontSize: 10, color: colors.accent2 }]}>Seu benefício</Text>
          <Text style={[type.cardTitle, { fontSize: 19, color: palette.text, marginTop: 6 }]}>{partner.beneficio.titulo}</Text>
          <Text style={[type.bodySm, { fontSize: 12.5, lineHeight: 19, color: palette.textMuted, marginTop: 7, marginBottom: 14 }]}>
            {partner.beneficio.regras}
          </Text>
          <Button label="Gerar meu cupom" onPress={abrirCupom} />
        </View>

        <View style={{ backgroundColor: palette.surface, borderWidth: 1, borderColor: palette.surfaceBorder, borderRadius: radii.xl, padding: 16, gap: 10 }}>
          <Text style={[type.eyebrow, { fontSize: 10, color: palette.hint }]}>Estímulo sensorial</Text>
          <SensoryBar
            label="Ruído"
            progress={nivelProgresso(partner.estimuloSensorial.ruido)}
            value={nivelLabel(partner.estimuloSensorial.ruido)}
            tone={partner.estimuloSensorial.ruido === 'baixo' ? 'calm' : 'medium'}
          />
          <SensoryBar
            label="Luz"
            progress={nivelProgresso(partner.estimuloSensorial.luz)}
            value={nivelLabel(partner.estimuloSensorial.luz)}
            tone={partner.estimuloSensorial.luz === 'baixo' ? 'calm' : 'medium'}
          />
          <SensoryBar
            label="Espera"
            progress={esperaProgresso(partner.estimuloSensorial.esperaMin)}
            value={partner.estimuloSensorial.esperaMin === 0 ? 'sem fila' : `${partner.estimuloSensorial.esperaMin} min`}
          />
        </View>

        <View style={{ backgroundColor: palette.surface, borderWidth: 1, borderColor: palette.surfaceBorder, borderRadius: radii.xl, paddingHorizontal: 16, paddingVertical: 4 }}>
          <Text style={[type.eyebrow, { fontSize: 10, color: palette.hint, marginTop: 12, marginBottom: 2 }]}>O que eles adaptam</Text>
          {partner.adaptacoes.map((a, i) => (
            <AdaptationRow key={a.descricao} item={a} isLast={i === partner.adaptacoes.length - 1} />
          ))}
        </View>

        <View style={{ gap: 10 }}>
          <Text style={[type.eyebrow, { fontSize: 10, color: palette.hint }]}>Fotos do ambiente</Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {partner.fotos.map((f) => (
              <PhotoPlaceholder key={f.label} label={f.label} height={96} radius={14} style={{ flex: 1 }} />
            ))}
          </View>
        </View>

        {partner.testemunhoDestaque ? (
          <View style={{ backgroundColor: alpha(colors.pastelGreen, 0.35), borderRadius: radii.xl, padding: 16 }}>
            <Text style={[type.body, { fontSize: 14, lineHeight: 22, color: palette.text }]}>
              “{partner.testemunhoDestaque.texto}”
            </Text>
            <Text style={[type.caption, { fontSize: 11.5, color: palette.textMuted, marginTop: 10 }]}>
              {partner.testemunhoDestaque.autor}, {partner.testemunhoDestaque.relacao} · {partner.testemunhoDestaque.idadeCrianca} anos ·{' '}
              {partner.testemunhoDestaque.condicao}
            </Text>
          </View>
        ) : null}
      </View>

      <View style={{ flexDirection: 'row', gap: 10, paddingHorizontal: 20, paddingTop: 12, paddingBottom: 28, borderTopWidth: 1, borderTopColor: palette.divider }}>
        <Pressable
          onPress={() => navigation.navigate('PartnersMap1e', { partnerId: partner.id })}
          style={({ pressed }) => ({
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 7,
            borderRadius: radii.pill,
            borderWidth: 1.5,
            borderColor: palette.chipBorder,
            paddingVertical: 16,
            opacity: pressed ? 0.6 : 1,
          })}
        >
          <MapPin size={16} color={palette.text} strokeWidth={1.9} />
          <Text style={{ fontFamily: 'BricolageGrotesque_600SemiBold', fontSize: 14, color: palette.text }}>Ver no mapa</Text>
        </Pressable>

        <Pressable
          onPress={ligar}
          style={({ pressed }) => ({
            flex: 1.15,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 7,
            borderRadius: radii.pill,
            backgroundColor: colors.darkAzure,
            paddingVertical: 16,
            opacity: pressed ? 0.85 : 1,
          })}
        >
          <Phone size={16} color={colors.white} strokeWidth={1.9} />
          <Text style={{ fontFamily: 'BricolageGrotesque_600SemiBold', fontSize: 14, color: colors.white }}>Ligar e agendar</Text>
        </Pressable>
      </View>
    </ScreenContainer>
  );
}
