import React from 'react';
import { View, Text, Pressable, ScrollView, Linking } from 'react-native';
import { ChevronLeft, X, Phone } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../theme/ThemeProvider';
import { useApp } from '../../state/AppContext';

function EmergencyRow({ number, name, sub }: { number: string; name: string; sub: string }) {
  const { colors } = useTheme();
  return (
    <Pressable
      onPress={() => Linking.openURL(`tel:${number}`)}
      style={{ backgroundColor: colors.darkAzure, borderRadius: 20, padding: 20, flexDirection: 'row', alignItems: 'center', gap: 16 }}
    >
      <Text style={{ fontFamily: 'BricolageGrotesque_600SemiBold', fontSize: 32, letterSpacing: -0.5, color: colors.offWhite }}>{number}</Text>
      <View style={{ flex: 1 }}>
        <Text style={{ fontFamily: 'BricolageGrotesque_500Medium', fontSize: 16, color: colors.offWhite }}>{name}</Text>
        <Text style={{ fontFamily: 'Lexend_300Light', fontSize: 12.5, color: colors.offWhite, opacity: 0.75, marginTop: 2 }}>{sub}</Text>
      </View>
      <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: colors.offWhite, alignItems: 'center', justifyContent: 'center' }}>
        <Phone size={20} color={colors.darkAzure} strokeWidth={2} />
      </View>
    </Pressable>
  );
}

export default function Safety5d({ navigation }: any) {
  const { palette, colors } = useTheme();
  const { state } = useApp();
  const [safer, setSafer] = React.useState<'sim' | 'ainda não' | null>(null);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: palette.bg }} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 22, paddingTop: 8, paddingBottom: 30, gap: 20 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Pressable onPress={() => navigation.goBack()} style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <ChevronLeft size={18} color={palette.text} strokeWidth={2} />
            <Text style={{ fontFamily: 'Lexend_400Regular', fontSize: 13.5, color: palette.text, opacity: 0.75 }}>voltar</Text>
          </Pressable>
          <Pressable onPress={() => navigation.getParent()?.goBack()}>
            <X size={18} color={palette.text} strokeWidth={2} />
          </Pressable>
        </View>

        <Text style={{ fontFamily: 'BricolageGrotesque_600SemiBold', fontSize: 34, lineHeight: 37, color: palette.text }}>Ligue agora</Text>

        <View style={{ gap: 12 }}>
          <EmergencyRow number="192" name="SAMU" sub="risco à vida ou ferimento" />
          <EmergencyRow number="188" name="CVV" sub="apoio emocional, 24h" />
        </View>

        {state.trustedContact && (
          <View style={{ backgroundColor: palette.surface, borderWidth: 1, borderColor: palette.surfaceBorder, borderRadius: 20, padding: 18 }}>
            <Text style={{ fontFamily: 'Lexend_600SemiBold', fontSize: 10, letterSpacing: 1.2, textTransform: 'uppercase', color: palette.hint, marginBottom: 10 }}>Contato de confiança</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
              <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: colors.pastelGreen }} />
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: 'BricolageGrotesque_500Medium', fontSize: 17, color: palette.text }}>{state.trustedContact.name}</Text>
                <Text style={{ fontFamily: 'Lexend_300Light', fontSize: 12.5, color: palette.textMuted, opacity: 0.85, marginTop: 2 }}>{state.trustedContact.relation}</Text>
              </View>
              <Pressable onPress={() => Linking.openURL(`tel:${state.trustedContact!.phone}`)} style={{ backgroundColor: colors.accent2, borderRadius: 22, paddingVertical: 12, paddingHorizontal: 22 }}>
                <Text style={{ fontFamily: 'BricolageGrotesque_500Medium', fontSize: 14, color: '#fff' }}>ligar</Text>
              </Pressable>
            </View>
          </View>
        )}

        <View style={{ backgroundColor: colors.greyAzure + '29', borderRadius: 18, padding: 18 }}>
          <Text style={{ fontFamily: 'BricolageGrotesque_500Medium', fontSize: 16, color: palette.text }}>Enquanto o socorro não chega</Text>
          <Text style={{ fontFamily: 'Lexend_300Light', fontSize: 14, lineHeight: 22, color: palette.text, opacity: 0.8, marginTop: 6 }}>
            Afaste objetos de risco. Fale pouco e baixo. Fique por perto.
          </Text>
        </View>

        <View style={{ borderTopWidth: 1, borderTopColor: palette.divider, paddingTop: 18 }}>
          <Text style={{ fontFamily: 'BricolageGrotesque_500Medium', fontSize: 18, color: palette.text }}>Está mais seguro agora?</Text>
          <View style={{ flexDirection: 'row', gap: 9, marginTop: 14 }}>
            {(['sim', 'ainda não'] as const).map((a) => (
              <Pressable
                key={a}
                onPress={() => {
                  setSafer(a);
                  if (a === 'sim') navigation.getParent()?.goBack();
                }}
                style={{ flex: 1, alignItems: 'center', paddingVertical: 14, borderRadius: 16, backgroundColor: safer === a ? palette.chipSelectedBg : palette.surface, borderWidth: 1, borderColor: palette.chipBorder }}
              >
                <Text style={{ fontFamily: 'Lexend_400Regular', fontSize: 14, color: palette.text }}>{a}</Text>
              </Pressable>
            ))}
          </View>
          <Pressable onPress={() => navigation.goBack()} style={{ marginTop: 16 }}>
            <Text style={{ fontFamily: 'Lexend_400Regular', fontSize: 13.5, color: palette.textMuted, opacity: 0.7, textAlign: 'center' }}>Voltar para a tela anterior</Text>
          </Pressable>
          <Text style={{ fontFamily: 'Lexend_300Light', fontSize: 11, lineHeight: 17, color: palette.textFaint, opacity: 0.85, textAlign: 'center', marginTop: 14 }}>
            O Vita não atende emergências. Em risco, ligue.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
