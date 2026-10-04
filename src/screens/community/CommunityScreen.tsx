import React, { useState } from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import { Search, Heart, MoreHorizontal } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../theme/ThemeProvider';
import { ScreenContainer } from '../../components/ScreenContainer';
import { SOSButton } from '../../components/SOSButton';
import { Avatar } from '../../components/Avatar';
import { articleCover } from '../../data/images';
import { communityPosts, communityGroups, article } from '../../data/mock';

const TABS = ['Feed', 'Grupos', 'Encontros', 'Meu perfil'] as const;
type Tab = (typeof TABS)[number];

function Tabs({ active, onChange }: { active: Tab; onChange: (t: Tab) => void }) {
  const { palette, type } = useTheme();
  return (
    <View style={{ flexDirection: 'row', gap: 20, borderBottomWidth: 1, borderBottomColor: palette.divider, paddingBottom: 2 }}>
      {TABS.map((t) => (
        <Pressable key={t} onPress={() => onChange(t)} style={{ paddingBottom: 9, borderBottomWidth: 2, borderBottomColor: active === t ? palette.text : 'transparent' }}>
          <Text style={[type.bodySm, { fontSize: 13.5, color: palette.text, opacity: active === t ? 1 : 0.6, fontFamily: active === t ? 'Lexend_600SemiBold' : 'Lexend_400Regular' }]}>{t}</Text>
        </Pressable>
      ))}
    </View>
  );
}

function FeedTab() {
  const { palette, colors, type } = useTheme();
  return (
    <View style={{ gap: 14 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 11, backgroundColor: palette.surface, borderWidth: 1, borderColor: palette.surfaceBorder, borderRadius: 24, padding: 12 }}>
        <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: colors.pastelGreen }} />
        <Text style={[type.bodySm, { flex: 1, fontSize: 13.5, color: palette.textFaint, opacity: 0.8 }]}>Contar algo do seu dia…</Text>
        <Text style={[type.bodySm, { fontSize: 12.5, color: colors.accent2, fontFamily: 'Lexend_500Medium' }]}>publicar</Text>
      </View>

      <View style={{ backgroundColor: palette.surface, borderWidth: 1, borderStyle: 'dashed', borderColor: palette.chipBorder, borderRadius: 18, padding: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 }}>
          <Text style={[type.bodySm, { fontSize: 13.5, color: palette.text, fontFamily: 'Lexend_500Medium' }]}>Cami · você</Text>
          <Text style={[type.caption, { fontSize: 11.5, color: palette.textFaint, opacity: 0.7 }]}>agora</Text>
          <View style={{ marginLeft: 'auto', backgroundColor: colors.greyAzure + '33', borderRadius: 14, paddingVertical: 4, paddingHorizontal: 10 }}>
            <Text style={{ fontFamily: 'Lexend_500Medium', fontSize: 10.5, color: palette.text }}>em análise</Text>
          </View>
        </View>
        <Text style={[type.body, { fontSize: 13.5, color: palette.text, lineHeight: 21 }]}>
          Consegui levar o Téo na terapia hoje sem crise na saída. Dividindo aqui porque foi difícil chegar até isso.
        </Text>
        <Text style={[type.caption, { fontSize: 11.5, color: palette.textFaint, opacity: 0.85, marginTop: 12, paddingTop: 10, borderTopWidth: 1, borderTopColor: palette.divider }]}>
          Sua publicação aparece para o grupo em alguns minutos.
        </Text>
      </View>

      <View style={{ backgroundColor: palette.surface, borderWidth: 1, borderColor: palette.surfaceBorder, borderRadius: 18, overflow: 'hidden' }}>
        <View style={{ padding: 16, paddingBottom: 12 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <LinearGradient colors={[colors.accent1, colors.accent2]} style={{ width: 8, height: 8, borderRadius: 4 }} />
              <Text style={[type.eyebrow, { color: colors.accent2, fontSize: 10.5 }]}>Conteúdo revisado · Vita</Text>
            </View>
            <MoreHorizontal size={16} color={palette.textFaint} />
          </View>
          <Text style={[type.caption, { fontSize: 11.5, color: palette.textFaint, opacity: 0.85, marginTop: 8 }]}>{article.source}</Text>
          <Text style={[type.cardTitle, { color: palette.text, fontSize: 18, marginTop: 6, lineHeight: 23 }]}>{article.title}</Text>
        </View>
        {articleCover ? (
          <Image source={articleCover} style={{ height: 150, width: '100%' }} resizeMode="cover" />
        ) : (
          <LinearGradient colors={[colors.pastelGreen, colors.greyAzure]} style={{ height: 150 }} />
        )}
        <View style={{ padding: 16 }}>
          <Text style={[type.body, { fontSize: 13, color: palette.textMuted, opacity: 0.85, lineHeight: 20 }]}>{article.body}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16, marginTop: 14, paddingTop: 12, borderTopWidth: 1, borderTopColor: palette.divider }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Heart size={15} color={palette.text} strokeWidth={1.8} />
              <Text style={[type.caption, { fontSize: 12.5, color: palette.textMuted }]}>34</Text>
            </View>
            <Text style={[type.caption, { fontSize: 12.5, color: palette.textMuted }]}>12 comentários</Text>
            <Text style={[type.caption, { fontSize: 12.5, color: palette.textMuted, marginLeft: 'auto' }]}>salvar</Text>
          </View>
        </View>
      </View>

      {communityPosts.slice(1).map((p) => (
        <View key={p.id} style={{ backgroundColor: palette.surface, borderWidth: 1, borderColor: palette.surfaceBorder, borderRadius: 18, padding: 16, marginBottom: p.id === communityPosts[communityPosts.length - 1].id ? 130 : 0 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <Avatar person={p.avatar} name={p.author} size={32} />
              <View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7 }}>
                  <Text style={[type.bodySm, { fontSize: 13.5, color: palette.text, fontFamily: 'Lexend_500Medium' }]}>{p.author}</Text>
                </View>
                <Text style={[type.caption, { fontSize: 11, color: palette.textFaint, opacity: 0.85, marginTop: 2 }]}>{p.group} · há {p.time}</Text>
              </View>
            </View>
            <MoreHorizontal size={16} color={palette.textFaint} />
          </View>
          <Text style={[type.body, { fontSize: 13.5, color: palette.text, marginTop: 12, lineHeight: 21 }]}>{p.body}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16, marginTop: 14, paddingTop: 12, borderTopWidth: 1, borderTopColor: palette.divider }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Heart size={15} color={palette.text} strokeWidth={1.8} />
              <Text style={[type.caption, { fontSize: 12.5, color: palette.textMuted }]}>{p.replies}</Text>
            </View>
            <Text style={[type.caption, { fontSize: 12.5, color: palette.textMuted }]}>comentar</Text>
            <Text style={[type.caption, { fontSize: 12.5, color: palette.textMuted, marginLeft: 'auto' }]}>salvar</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

function GroupsTab() {
  const { palette, colors, type } = useTheme();
  return (
    <View style={{ gap: 16 }}>
      <View style={{ backgroundColor: palette.surface, borderWidth: 1, borderColor: palette.surfaceBorder, borderRadius: 20, padding: 24 }}>
        <Text style={[type.title, { color: palette.text, fontSize: 24 }]}>Você ainda não entrou em nenhum grupo</Text>
        <Text style={[type.body, { color: palette.textMuted, fontSize: 13.5, opacity: 0.75, marginTop: 10, lineHeight: 21 }]}>
          Separamos três que combinam com o que você contou. Entrar e sair é livre.
        </Text>
      </View>
      <View>
        <Text style={[type.eyebrow, { color: palette.hint, marginBottom: 10 }]}>Sugeridos para você</Text>
        <View style={{ gap: 10 }}>
          {communityGroups.slice(0, 3).map((g) => (
            <View key={g.id} style={{ backgroundColor: palette.surface, borderWidth: 1, borderColor: palette.surfaceBorder, borderRadius: 16, padding: 15, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <View style={{ flex: 1 }}>
                <Text style={[type.cardTitle, { color: palette.text, fontSize: 16 }]}>{g.name}</Text>
                <Text style={[type.caption, { color: palette.textFaint, fontSize: 11.5, opacity: 0.85, marginTop: 3 }]}>{g.members.toLocaleString('pt-BR')} famílias</Text>
              </View>
              <LinearGradient colors={[colors.accent1, colors.accent2]} style={{ borderRadius: 20, paddingVertical: 9, paddingHorizontal: 18 }}>
                <Text style={{ fontFamily: 'BricolageGrotesque_500Medium', fontSize: 12.5, color: '#fff' }}>entrar</Text>
              </LinearGradient>
            </View>
          ))}
        </View>
      </View>
      <View style={{ backgroundColor: colors.darkAzure, borderRadius: 18, padding: 18, marginBottom: 130 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <Text style={{ fontFamily: 'BricolageGrotesque_500Medium', fontSize: 16.5, color: colors.offWhite }}>Grupos temáticos do Plus</Text>
          <View style={{ backgroundColor: colors.pastelGreen, borderRadius: 12, paddingVertical: 3, paddingHorizontal: 9 }}>
            <Text style={{ fontFamily: 'Lexend_600SemiBold', fontSize: 10, color: colors.darkAzure }}>Plus</Text>
          </View>
        </View>
        <Text style={{ fontFamily: 'Lexend_300Light', fontSize: 12.5, lineHeight: 20, color: colors.offWhite, opacity: 0.8, marginTop: 6 }}>
          Rodas menores com mediação. Os grupos acima seguem abertos para todos.
        </Text>
      </View>
    </View>
  );
}

function MeetingsTab() {
  const { palette, colors, type } = useTheme();
  return (
    <View style={{ gap: 18 }}>
      <View style={{ backgroundColor: palette.surface, borderWidth: 1, borderColor: palette.surfaceBorder, borderRadius: 18, padding: 16, flexDirection: 'row', gap: 14 }}>
        <View style={{ width: 52, alignItems: 'center', backgroundColor: colors.pastelGreen, borderRadius: 12, paddingVertical: 10 }}>
          <Text style={[type.eyebrow, { fontSize: 10, color: palette.text, opacity: 0.7 }]}>qua</Text>
          <Text style={{ fontFamily: 'BricolageGrotesque_600SemiBold', fontSize: 20, marginTop: 2, color: palette.text }}>13</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[type.cardTitle, { color: palette.text, fontSize: 17 }]}>Roda de conversa: sono</Text>
          <Text style={[type.caption, { color: palette.textFaint, fontSize: 11.5, opacity: 0.85, marginTop: 5 }]}>online · 20h · 60 min · 38 inscritos</Text>
          <LinearGradient colors={[colors.accent1, colors.accent2]} style={{ alignSelf: 'flex-start', borderRadius: 20, paddingVertical: 9, paddingHorizontal: 18, marginTop: 12 }}>
            <Text style={{ fontFamily: 'BricolageGrotesque_500Medium', fontSize: 12.5, color: '#fff' }}>inscrever</Text>
          </LinearGradient>
        </View>
      </View>
      <View style={{ backgroundColor: colors.pastelGreen, borderRadius: 18, padding: 18, marginBottom: 130 }}>
        <Text style={[type.cardTitle, { color: colors.darkAzure, fontSize: 16.5 }]}>Suas inscrições</Text>
        <Text style={[type.caption, { color: colors.darkAzure, fontSize: 12.5, opacity: 0.75, marginTop: 5 }]}>1 encontro amanhã · lembrete ativado</Text>
      </View>
    </View>
  );
}

function ProfileTab() {
  const { palette, colors, type } = useTheme();
  return (
    <View style={{ gap: 18 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
        <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: colors.pastelGreen }} />
        <View style={{ flex: 1 }}>
          <Text style={[type.title, { color: palette.text, fontSize: 22 }]}>Cami</Text>
          <Text style={[type.caption, { color: palette.textMuted, fontSize: 12, opacity: 0.75, marginTop: 2 }]}>mãe de 2 · membro desde março</Text>
        </View>
        <Text style={[type.bodySm, { color: colors.accent2, fontSize: 12.5, fontFamily: 'Lexend_500Medium' }]}>editar</Text>
      </View>

      <View style={{ flexDirection: 'row', gap: 10 }}>
        {[
          { n: 3, l: 'grupos' },
          { n: 12, l: 'salvos' },
          { n: 2, l: 'encontros' },
        ].map((s) => (
          <View key={s.l} style={{ flex: 1, backgroundColor: palette.surface, borderWidth: 1, borderColor: palette.surfaceBorder, borderRadius: 16, padding: 16, alignItems: 'center' }}>
            <Text style={{ fontFamily: 'BricolageGrotesque_600SemiBold', fontSize: 22, color: palette.text }}>{s.n}</Text>
            <Text style={[type.caption, { fontSize: 11, color: palette.textMuted, opacity: 0.7, marginTop: 2 }]}>{s.l}</Text>
          </View>
        ))}
      </View>

      <View style={{ backgroundColor: colors.greyAzure + '29', borderRadius: 18, padding: 18, marginBottom: 130 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <Text style={{ fontFamily: 'BricolageGrotesque_500Medium', fontSize: 16, color: palette.text }}>Selo de apoiador</Text>
          <View style={{ backgroundColor: colors.darkAzure, borderRadius: 12, paddingVertical: 3, paddingHorizontal: 9 }}>
            <Text style={{ fontFamily: 'Lexend_600SemiBold', fontSize: 10, color: colors.offWhite }}>Plus</Text>
          </View>
        </View>
        <Text style={[type.caption, { fontSize: 12.5, color: palette.textMuted, opacity: 0.8, marginTop: 6, lineHeight: 19 }]}>Só um detalhe ao lado do nome. Não muda o que você pode fazer aqui.</Text>
      </View>
    </View>
  );
}

export default function CommunityScreen() {
  const { palette, type } = useTheme();
  const [tab, setTab] = useState<Tab>('Feed');

  return (
    <ScreenContainer contentStyle={{ paddingHorizontal: 20, paddingTop: 14, gap: 14 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Text style={[type.title, { color: palette.text }]}>Comunidade</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Search size={17} color={palette.text} strokeWidth={1.9} />
          <Text style={[type.caption, { color: palette.textMuted, fontSize: 12.5, opacity: 0.75 }]}>buscar</Text>
        </View>
      </View>

      <Tabs active={tab} onChange={setTab} />

      {tab === 'Feed' && <FeedTab />}
      {tab === 'Grupos' && <GroupsTab />}
      {tab === 'Encontros' && <MeetingsTab />}
      {tab === 'Meu perfil' && <ProfileTab />}

      <SOSButton />
    </ScreenContainer>
  );
}
