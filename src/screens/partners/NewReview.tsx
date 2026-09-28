import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, TextInput } from 'react-native';
import { X, Star } from 'lucide-react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { ScreenContainer } from '../../components/ScreenContainer';
import { Button } from '../../components/Button';
import { Chip } from '../../components/Chip';
import { useApp } from '../../state/AppContext';
import { getPartner } from '../../data/partners';

// Tela não presente no design original (chamada por 1f e 1h).
// Padrão simples: estrelas + texto + tags + condição da criança. Sinalizada
// para revisão de design junto com as etapas 2 e 3 do cadastro (1g).
const TAGS = ['correu bem', 'horário reservado', 'ruído externo', 'ir de manhã', 'espera curta', 'equipe atenciosa'];
const CONDICOES = ['TDAH', 'TEA', 'Sensibilidade auditiva', 'Outra'];

export default function NewReview({ navigation, route }: any) {
  const { palette, colors, type, radii } = useTheme();
  const { state, addUserReview } = useApp();

  const partnerId: string = route.params?.partnerId;
  const partner = getPartner(partnerId, state.communityPartners);

  const [rating, setRating] = useState(5);
  const [texto, setTexto] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [condicao, setCondicao] = useState(state.diagnoses[0] ?? 'TDAH');

  const enviar = () => {
    addUserReview({
      id: `ur${Date.now()}`,
      partnerId,
      autorNome: state.parentName,
      relacao: `responsável do ${state.childName}`,
      criancaIdade: state.childAge,
      condicao,
      rating,
      texto: texto.trim() || 'Fomos e correu bem.',
      tags,
      uteisCount: 0,
      criadoEm: 'agora',
    });
    navigation.goBack();
  };

  return (
    <ScreenContainer scroll={false}>
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 10, paddingBottom: 12 }}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={12} accessibilityRole="button" accessibilityLabel="Fechar">
          <X size={22} color={palette.text} strokeWidth={2} />
        </Pressable>
        <Text style={[type.cardTitle, { flex: 1, textAlign: 'center', fontSize: 17, color: palette.text }]}>Como foi?</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24, gap: 18 }} showsVerticalScrollIndicator={false}>
        <Text style={[type.bodySm, { fontSize: 13.5, lineHeight: 21, color: palette.textMuted }]}>
          Seu relato sobre o {partner?.nome ?? 'parceiro'} ajuda outra família a decidir se vale sair de casa.
        </Text>

        <View style={{ alignItems: 'center', gap: 10, backgroundColor: palette.surface, borderWidth: 1, borderColor: palette.surfaceBorder, borderRadius: radii.xl, padding: 18 }}>
          <Text style={[type.eyebrow, { fontSize: 10, color: palette.hint }]}>Sua nota</Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {[1, 2, 3, 4, 5].map((n) => (
              <Pressable key={n} onPress={() => setRating(n)} hitSlop={6} accessibilityRole="button" accessibilityLabel={`${n} estrelas`}>
                <Star
                  size={30}
                  color={n <= rating ? colors.accent1 : palette.chipBorder}
                  fill={n <= rating ? colors.accent1 : 'transparent'}
                  strokeWidth={1.8}
                />
              </Pressable>
            ))}
          </View>
        </View>

        <View style={{ gap: 10 }}>
          <Text style={[type.eyebrow, { fontSize: 10, color: palette.hint }]}>O que aconteceu</Text>
          <TextInput
            value={texto}
            onChangeText={setTexto}
            multiline
            placeholder="Contamos como foi a espera, o barulho, o atendimento…"
            placeholderTextColor={palette.textFaint}
            style={{
              minHeight: 110,
              backgroundColor: palette.surface,
              borderWidth: 1,
              borderColor: palette.surfaceBorder,
              borderRadius: radii.lg,
              padding: 14,
              fontFamily: 'Lexend_400Regular',
              fontSize: 13.5,
              lineHeight: 20,
              color: palette.text,
              textAlignVertical: 'top',
            }}
          />
        </View>

        <View style={{ gap: 10 }}>
          <Text style={[type.eyebrow, { fontSize: 10, color: palette.hint }]}>Marque o que resume a visita</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {TAGS.map((t) => (
              <Chip
                key={t}
                label={t}
                selected={tags.includes(t)}
                onPress={() => setTags((s) => (s.includes(t) ? s.filter((x) => x !== t) : [...s, t]))}
              />
            ))}
          </View>
        </View>

        <View style={{ gap: 10 }}>
          <Text style={[type.eyebrow, { fontSize: 10, color: palette.hint }]}>Condição da criança</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {CONDICOES.map((c) => (
              <Chip key={c} label={c} selected={condicao === c} onPress={() => setCondicao(c)} />
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={{ paddingHorizontal: 20, paddingTop: 12, paddingBottom: 22, borderTopWidth: 1, borderTopColor: palette.divider }}>
        <Button label="Publicar relato" onPress={enviar} />
      </View>
    </ScreenContainer>
  );
}
