import React, { useState } from 'react';
import { View, Text, Pressable, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { X } from 'lucide-react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { Button } from '../../components/Button';
import { useApp } from '../../state/AppContext';

export default function RegisterAttempt6c({ navigation, route }: any) {
  const { palette, colors, type, radii } = useTheme();
  const { registerTrackAttempt } = useApp();
  const trackId = route.params?.id ?? 'alimentacao';
  const [answer, setAnswer] = useState<'sim' | 'não' | null>(null);
  const [note, setNote] = useState('');

  const save = () => {
    if (!answer) return;
    registerTrackAttempt(trackId, answer === 'sim', note);
    navigation.replace(answer === 'sim' ? 'Celebration6c2' : 'NotYet6d', { id: trackId });
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1, backgroundColor: 'rgba(20,32,36,0.6)', justifyContent: 'flex-end' }}>
      <Pressable style={{ flex: 1 }} onPress={() => navigation.goBack()} />
      <View style={{ backgroundColor: palette.bg, borderTopLeftRadius: 32, borderTopRightRadius: 32, paddingHorizontal: 22, paddingTop: 20, paddingBottom: 40, gap: 22 }}>
        <View style={{ width: 44, height: 5, borderRadius: 3, backgroundColor: palette.chipBorder, alignSelf: 'center' }} />
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text style={[type.title, { color: palette.text, fontSize: 24 }]}>Registrar tentativa</Text>
          <Pressable onPress={() => navigation.goBack()} accessibilityLabel="Fechar" style={{ width: 44, height: 44, alignItems: 'center', justifyContent: 'center', marginRight: -10 }}>
            <X size={22} color={palette.hint} strokeWidth={2} />
          </Pressable>
        </View>

        <View>
          <Text style={[type.cardTitle, { color: palette.text, fontSize: 19 }]}>A criança aceitou avançar?</Text>
          <Text style={[type.caption, { color: palette.textMuted, fontSize: 13, opacity: 0.75, marginTop: 6 }]}>Uma resposta só. Qualquer uma delas ajuda.</Text>
          <View style={{ flexDirection: 'row', gap: 10, marginTop: 16 }}>
            {(['sim', 'não'] as const).map((a) => (
              <Pressable
                key={a}
                onPress={() => setAnswer(a)}
                style={{
                  flex: 1,
                  alignItems: 'center',
                  paddingVertical: 20,
                  borderRadius: 18,
                  backgroundColor: answer === a ? colors.pastelGreen : palette.surface,
                  borderWidth: 1.5,
                  borderColor: colors.pastelGreen,
                }}
              >
                <Text style={{ fontFamily: 'BricolageGrotesque_500Medium', fontSize: 18, color: answer === a ? colors.darkAzure : palette.text }}>{a}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View>
          <Text style={[type.body, { fontSize: 14, color: palette.text, marginBottom: 9 }]}>
            Quer anotar algo? <Text style={{ opacity: 0.55 }}>(opcional)</Text>
          </Text>
          <TextInput
            value={note}
            onChangeText={setNote}
            multiline
            placeholder="ex: mexeu a massa por 5 minutos"
            placeholderTextColor={palette.textFaint}
            style={{ backgroundColor: palette.surface, borderWidth: 1, borderColor: palette.chipBorder, borderRadius: radii.md, padding: 15, minHeight: 74, fontFamily: 'Lexend_400Regular', fontSize: 14, color: palette.text, textAlignVertical: 'top' }}
          />
        </View>

        <Button label="Salvar tentativa" onPress={save} disabled={!answer} />
      </View>
    </KeyboardAvoidingView>
  );
}
