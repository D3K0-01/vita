import React from 'react';
import { View, Text, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BadgeCheck, Check } from 'lucide-react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { ScreenContainer } from '../../components/ScreenContainer';
import { BackHeader } from '../../components/BackHeader';
import { Button } from '../../components/Button';
import { useUI } from '../../components/UIProvider';
import { useApp } from '../../state/AppContext';
import { getArticle } from '../../data/articles';

export default function Article({ navigation, route }: any) {
  const { palette, colors, type } = useTheme();
  const { state, toggleIn } = useApp();
  const { toast } = useUI();
  const article = getArticle(route.params?.id);
  const saved = state.savedPosts.includes(article.id);
  const liked = state.likedPosts.includes(article.id);

  return (
    <ScreenContainer edges={['top', 'bottom']} contentStyle={{ paddingHorizontal: 20, paddingTop: 4, gap: 16 }}>
      <BackHeader title="Conteúdo revisado" size="sm" />
      <Text style={[type.caption, { color: colors.accent2, fontFamily: 'Lexend_500Medium' }]}>{article.source}</Text>
      <Text style={[type.title, { color: palette.text, fontSize: 28, lineHeight: 34 }]} accessibilityRole="header">
        {article.title}
      </Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: -6 }}>
        <BadgeCheck size={14} color={colors.accent2} />
        <Text style={[type.caption, { color: palette.textMuted, fontSize: 12 }]}>{article.reviewedBy}</Text>
      </View>
      {article.cover ? (
        <Image source={article.cover} style={{ height: 190, width: '100%', borderRadius: 18 }} resizeMode="cover" />
      ) : (
        <LinearGradient colors={article.gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ height: 150, borderRadius: 18 }} />
      )}
      {article.full.map((p, i) => (
        <Text key={i} style={[type.bodyLg, { color: palette.text, fontSize: 15.5, lineHeight: 26 }]}>
          {p}
        </Text>
      ))}
      {article.takeaways ? (
        <View style={{ backgroundColor: colors.pastelGreen, borderRadius: 18, padding: 18, gap: 9 }}>
          <Text style={[type.cardTitle, { color: colors.darkAzure, fontSize: 15.5 }]}>Para lembrar</Text>
          {article.takeaways.map((t) => (
            <View key={t} style={{ flexDirection: 'row', gap: 9, alignItems: 'flex-start' }}>
              <Check size={15} color={colors.darkAzure} strokeWidth={2.6} style={{ marginTop: 3 }} />
              <Text style={[type.bodySm, { flex: 1, color: colors.darkAzure, fontSize: 13.5 }]}>{t}</Text>
            </View>
          ))}
        </View>
      ) : null}
      <Text style={[type.caption, { color: palette.textFaint, fontSize: 11.5, lineHeight: 17 }]}>
        Conteúdo informativo. Não substitui a avaliação de profissionais de saúde que acompanham sua família.
      </Text>
      <View style={{ gap: 6, marginTop: 2 }}>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <Button
            label={saved ? 'Salvo ✓' : 'Salvar'}
            variant={saved ? 'secondary' : 'primary'}
            onPress={() => {
              toggleIn('savedPosts', article.id);
              toast(saved ? 'Removido dos salvos' : 'Salvo no seu perfil da Comunidade');
            }}
            style={{ flex: 1 }}
          />
          <Button label={liked ? 'Útil ✓' : 'Foi útil'} variant="secondary" onPress={() => toggleIn('likedPosts', article.id)} style={{ flex: 1 }} />
        </View>
        {article.cta ? <Button label={article.cta.label} variant="ghost" onPress={() => navigation.navigate(article.cta!.route, article.cta!.params)} /> : null}
      </View>
    </ScreenContainer>
  );
}
