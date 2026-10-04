import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, TextInput } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../theme/ThemeProvider';
import { Button } from '../../components/Button';
import { useApp } from '../../state/AppContext';

function RadioCard({ label, sub, selected, onPress }: { label: string; sub?: string; selected: boolean; onPress: () => void }) {
  const { palette, colors, type, radii } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={{ flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: palette.surface, borderWidth: selected ? 1.5 : 1, borderColor: selected ? colors.accent1 : palette.chipBorder, borderRadius: radii.md, padding: 15 }}
    >
      <View style={{ width: 18, height: 18, borderRadius: 9, borderWidth: selected ? 5 : 1.5, borderColor: selected ? colors.accent2 : palette.hint, backgroundColor: '#fff' }} />
      <View style={{ flex: 1 }}>
        <Text style={[type.body, { fontSize: 14, color: palette.text }]}>{label}</Text>
        {sub ? <Text style={[type.caption, { fontSize: 11, color: palette.textFaint, opacity: 0.8, marginTop: 2 }]}>{sub}</Text> : null}
      </View>
    </Pressable>
  );
}

export default function Checkout10c({ navigation }: any) {
  const { palette, colors, type, radii } = useTheme();
  const { setState } = useApp();
  const [method, setMethod] = useState<'cartao' | 'pix'>('cartao');
  const [confirmed, setConfirmed] = useState(false);

  const confirm = () => {
    setState((s) => ({ ...s, plan: 'plus' }));
    setConfirmed(true);
  };

  if (confirmed) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: palette.bg, alignItems: 'center', justifyContent: 'center', padding: 30 }}>
        <Text style={[type.title, { color: palette.text, fontSize: 26, textAlign: 'center' }]}>Assinatura confirmada</Text>
        <Text style={[type.body, { color: palette.textMuted, fontSize: 14, opacity: 0.75, marginTop: 10, textAlign: 'center', lineHeight: 22 }]}>
          Seus 7 dias grátis do Plus começaram agora. Avisamos 2 dias antes da primeira cobrança.
        </Text>
        <Button label="Voltar para o app" onPress={() => navigation.getParent()?.goBack()} style={{ marginTop: 24, alignSelf: 'stretch' }} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: palette.bg }} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 12, paddingBottom: 40, gap: 18 }}>
        <Pressable onPress={() => navigation.goBack()} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <ChevronLeft size={20} color={palette.text} strokeWidth={2} />
          <Text style={[type.title, { color: palette.text, fontSize: 22 }]}>Assinatura</Text>
        </Pressable>

        <View style={{ backgroundColor: palette.surface, borderWidth: 1, borderColor: palette.surfaceBorder, borderRadius: 20, padding: 22 }}>
          <View style={{ flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' }}>
            <Text style={[type.title, { color: palette.text, fontSize: 24 }]}>Plus</Text>
            <Text style={[type.bodySm, { fontSize: 16, color: palette.text, fontFamily: 'Lexend_500Medium' }]}>R$ 39,90/mês</Text>
          </View>
          <Text style={[type.body, { color: palette.textMuted, fontSize: 13, opacity: 0.8, marginTop: 12, lineHeight: 21 }]}>
            O que muda: quebras saudáveis programadas, todas as trilhas em paralelo, IA sem limite com histórico da família, rodas mediadas e relatório para consultas.
          </Text>
          <Text style={[type.caption, { color: palette.textFaint, fontSize: 12, opacity: 0.75, marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: palette.divider }]}>
            Rotina, filhos e Modo Crise já eram ilimitados no Base.
          </Text>
        </View>

        <View style={{ backgroundColor: colors.pastelGreen, borderRadius: 18, padding: 18 }}>
          <Text style={[type.cardTitle, { color: colors.darkAzure, fontSize: 17 }]}>7 dias grátis</Text>
          <Text style={[type.caption, { color: colors.darkAzure, fontSize: 12.5, opacity: 0.8, marginTop: 5, lineHeight: 19 }]}>Avisamos 2 dias antes da primeira cobrança. Cancela em dois toques.</Text>
        </View>

        <View>
          <Text style={[type.eyebrow, { color: palette.hint, marginBottom: 10 }]}>Forma de pagamento</Text>
          <View style={{ gap: 9 }}>
            <RadioCard label="Cartão de crédito" selected={method === 'cartao'} onPress={() => setMethod('cartao')} />
            <RadioCard label="Pix" sub="renovação manual a cada mês" selected={method === 'pix'} onPress={() => setMethod('pix')} />
          </View>
        </View>

        {method === 'cartao' && (
          <View style={{ gap: 10 }}>
            <View>
              <Text style={[type.eyebrow, { color: palette.hint, marginBottom: 7 }]}>Número do cartão</Text>
              <TextInput
                keyboardType="number-pad"
                placeholder="0000 0000 0000 0000"
                placeholderTextColor={palette.textFaint}
                style={{ backgroundColor: palette.surface, borderWidth: 1, borderColor: palette.chipBorder, borderRadius: radii.md, padding: 15, fontFamily: 'Lexend_300Light', fontSize: 14.5, letterSpacing: 1, color: palette.text }}
              />
            </View>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <View style={{ flex: 1 }}>
                <Text style={[type.eyebrow, { color: palette.hint, marginBottom: 7 }]}>Validade</Text>
                <TextInput placeholder="MM/AA" placeholderTextColor={palette.textFaint} style={{ backgroundColor: palette.surface, borderWidth: 1, borderColor: palette.chipBorder, borderRadius: radii.md, padding: 15, fontFamily: 'Lexend_300Light', fontSize: 14.5, color: palette.text }} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[type.eyebrow, { color: palette.hint, marginBottom: 7 }]}>CVV</Text>
                <TextInput placeholder="000" keyboardType="number-pad" placeholderTextColor={palette.textFaint} style={{ backgroundColor: palette.surface, borderWidth: 1, borderColor: palette.chipBorder, borderRadius: radii.md, padding: 15, fontFamily: 'Lexend_300Light', fontSize: 14.5, color: palette.text }} />
              </View>
            </View>
          </View>
        )}

        <View style={{ gap: 12 }}>
          <Button label="Confirmar assinatura" onPress={confirm} />
          <Pressable onPress={() => navigation.goBack()}>
            <Text style={{ fontFamily: 'Lexend_400Regular', fontSize: 13.5, color: palette.textMuted, opacity: 0.7, textAlign: 'center' }}>Voltar para o plano Base</Text>
          </Pressable>
          <Text style={[type.caption, { color: palette.textFaint, fontSize: 10.5, opacity: 0.75, textAlign: 'center' }]}>Valores e benefícios fictícios, sujeitos à definição do time de produto.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
