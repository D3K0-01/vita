import React from 'react';
import { View, Text, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../theme/ThemeProvider';
import { ScreenContainer } from '../../components/ScreenContainer';
import { BackHeader } from '../../components/BackHeader';
import { Button } from '../../components/Button';
import { useUI } from '../../components/UIProvider';
import { useApp } from '../../state/AppContext';
import { article } from '../../data/mock';
import { articleCover } from '../../data/images';

export default function Article({ navigation }: any) {
  const { palette, colors, type } = useTheme();
  const { state, toggleIn } = useApp();
  const { toast } = useUI();
  const saved = state.savedPosts.includes('article-quebras');

  return (
    <ScreenContainer edges={['top', 'bottom']} contentStyle={{ paddingHorizontal: 20, paddingTop: 4, gap: 16 }}>
      <BackHeader title="Conteúdo revisado" size="sm" />
      <Text style={[type.caption, { color: colors.accent2, fontFamily: 'Lexend_500Medium' }]}>{article.source}</Text>
      <Text style={[type.title, { color: palette.text, fontSize: 28, lineHeight: 34 }]} accessibilityRole="header">
        {article.title}
      </Text>
      {articleCover ? (
        <Image source={articleCover} style={{ height: 190, width: '100%', borderRadius: 18 }} resizeMode="cover" />
      ) : (
        <LinearGradient colors={[colors.pastelGreen, colors.greyAzure]} style={{ height: 190, borderRadius: 18 }} />
      )}
      {article.full.map((p, i) => (
        <Text key={i} style={[type.bodyLg, { color: palette.text, fontSize: 15.5, lineHeight: 26 }]}>
          {p}
        </Text>
      ))}
      <View style={{ gap: 6, marginTop: 6 }}>
        <Button
          label={saved ? 'Salvo no seu perfil' : 'Salvar para ler depois'}
          variant={saved ? 'secondary' : 'primary'}
          onPress={() => {
            toggleIn('savedPosts', 'article-quebras');
            toast(saved ? 'Removido dos salvos' : 'Salvo no seu perfil');
          }}
        />
        <Button label="Programar uma quebra na Rotina" variant="ghost" onPress={() => navigation.navigate('Main', { screen: 'RotinaTab' })} />
      </View>
    </ScreenContainer>
  );
}
