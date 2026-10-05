import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { ChevronDown, ChevronUp, ShieldCheck, Users, Lock } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../theme/ThemeProvider';
import { ScreenContainer } from '../../components/ScreenContainer';
import { BackHeader } from '../../components/BackHeader';
import { Avatar } from '../../components/Avatar';
import { PostCard, useFeed } from '../../components/community/PostCard';
import { useJoinGroup } from '../../components/community/useJoinGroup';
import { Button } from '../../components/Button';
import { POSTS } from '../../data/community';
import { useUI } from '../../components/UIProvider';
import { useApp } from '../../state/AppContext';
import { getGroup } from '../../data/community';

// Página de um grupo: descrição, regras, participação e as conversas do grupo.
export default function GroupDetail({ route, navigation }: any) {
  const { palette, colors, type, radii } = useTheme();
  const { state, addPost } = useApp();
  const { toggle, locked: isLocked } = useJoinGroup();
  const { toast, prompt } = useUI();
  const group = getGroup(route.params?.groupId);
  const feed = useFeed();
  const [rulesOpen, setRulesOpen] = useState(false);

  if (!group) {
    return (
      <ScreenContainer edges={['top', 'bottom']} contentStyle={{ padding: 20 }}>
        <BackHeader title="Grupo" />
        <Text style={[type.body, { color: palette.textMuted }]}>Grupo não encontrado.</Text>
      </ScreenContainer>
    );
  }

  const joined = state.joinedGroups.includes(group.id);
  const locked = isLocked(group);
  const posts = feed.filter((p) => p.groupId === group.id);
  const lockedCount = POSTS.filter((p) => p.groupId === group.id).length;

  const toggleJoin = () => toggle(group, { welcome: true });

  const compose = async () => {
    if (!joined && !toggle(group)) return;
    const r = await prompt({
      title: `Publicar em ${group.name}`,
      message: 'Publicações passam por uma revisão rápida antes de aparecer para o grupo.',
      fields: [{ key: 'body', label: 'Sua publicação', placeholder: 'o que você quer dividir?', multiline: true, maxLength: 800 }],
      confirmLabel: 'Publicar',
      validate: (v) => (v.body.length >= 3 ? null : 'Escreva um pouco mais'),
    });
    if (r) {
      addPost(r.body, group.id);
      toast('Publicação enviada');
    }
  };

  return (
    <ScreenContainer edges={['top', 'bottom']} contentStyle={{ paddingHorizontal: 20, paddingTop: 4, gap: 16 }}>
      <BackHeader title="Grupo" size="sm" />

      <LinearGradient colors={[colors.darkAzure, '#3B5C64']} style={{ borderRadius: radii.xl, padding: 20, gap: 10 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Users size={16} color={colors.pastelGreen} />
          <Text style={[type.eyebrow, { color: colors.pastelGreen, flex: 1 }]}>{(group.members + (joined ? 1 : 0)).toLocaleString('pt-BR')} famílias</Text>
          {group.exclusive ? (
            <View style={{ backgroundColor: colors.pastelGreen, borderRadius: 10, paddingVertical: 3, paddingHorizontal: 8 }}>
              <Text style={{ fontFamily: 'Lexend_600SemiBold', fontSize: 9.5, color: colors.darkAzure }}>EXCLUSIVO PLUS</Text>
            </View>
          ) : null}
        </View>
        <Text style={[type.title, { color: colors.offWhite, fontSize: 25, lineHeight: 30 }]} accessibilityRole="header">
          {group.name}
        </Text>
        <Text style={[type.bodySm, { color: colors.offWhite, opacity: 0.88, lineHeight: 21 }]}>{group.description}</Text>
        <View style={{ flexDirection: 'row', gap: 10, marginTop: 6 }}>
          <Pressable
            onPress={toggleJoin}
            accessibilityRole="button"
            style={({ pressed }) => ({
              flex: 1,
              minHeight: 46,
              borderRadius: radii.pill,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: joined ? 'transparent' : colors.offWhite,
              borderWidth: joined ? 1.5 : 0,
              borderColor: 'rgba(242,239,230,.45)',
              opacity: pressed ? 0.8 : 1,
            })}
          >
            <Text style={[type.button, { color: joined ? colors.offWhite : colors.darkAzure, fontSize: 14 }]}>{joined ? 'Participando ✓' : locked ? 'Liberar com o Plus' : 'Entrar no grupo'}</Text>
          </Pressable>
        </View>
      </LinearGradient>

      <Pressable
        onPress={() => setRulesOpen((o) => !o)}
        accessibilityRole="button"
        accessibilityState={{ expanded: rulesOpen }}
        style={{ backgroundColor: palette.surface, borderWidth: 1, borderColor: palette.surfaceBorder, borderRadius: 16, padding: 15 }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <ShieldCheck size={18} color={colors.accent2} />
          <Text style={[type.body, { flex: 1, color: palette.text, fontFamily: 'Lexend_500Medium', fontSize: 14 }]}>Regras e moderação</Text>
          {rulesOpen ? <ChevronUp size={16} color={palette.hint} /> : <ChevronDown size={16} color={palette.hint} />}
        </View>
        {rulesOpen && (
          <View style={{ gap: 8, marginTop: 12 }}>
            {group.rules.map((r, i) => (
              <Text key={r} style={[type.bodySm, { color: palette.textMuted }]}>
                {i + 1}. {r}
              </Text>
            ))}
            <Text style={[type.caption, { color: palette.textFaint, marginTop: 4 }]}>Moderação: {group.moderators}</Text>
          </View>
        )}
      </Pressable>

      {locked ? (
        <View style={{ backgroundColor: palette.surface, borderWidth: 1, borderColor: palette.surfaceBorder, borderRadius: 18, padding: 20, alignItems: 'center', gap: 10 }}>
          <View style={{ width: 46, height: 46, borderRadius: 23, backgroundColor: colors.pastelGreen, alignItems: 'center', justifyContent: 'center' }}>
            <Lock size={20} color={colors.darkAzure} />
          </View>
          <Text style={[type.cardTitle, { color: palette.text, fontSize: 16, textAlign: 'center' }]}>{lockedCount} conversas esperando por você</Text>
          <Text style={[type.bodySm, { color: palette.textMuted, textAlign: 'center', lineHeight: 20 }]}>
            Os grupos exclusivos fazem parte do Plus e do Premium: rodas menores, mediação da equipe e selo de apoiador(a) no seu perfil.
          </Text>
          <Button label="Conhecer o Plus" onPress={() => navigation.navigate('PlansStack')} style={{ alignSelf: 'stretch', marginTop: 4 }} />
        </View>
      ) : (
      <>
      <Pressable
        onPress={compose}
        accessibilityRole="button"
        style={({ pressed }) => ({ flexDirection: 'row', alignItems: 'center', gap: 11, backgroundColor: palette.surface, borderWidth: 1, borderColor: palette.surfaceBorder, borderRadius: 24, padding: 10, paddingRight: 16, opacity: pressed ? 0.8 : 1 })}
      >
        <Avatar person="me" size={34} />
        <Text style={[type.bodySm, { flex: 1, fontSize: 13.5, color: palette.textFaint }]}>Escrever neste grupo…</Text>
        <Text style={[type.bodySm, { fontSize: 13, color: colors.accent2, fontFamily: 'Lexend_500Medium' }]}>publicar</Text>
      </Pressable>

      <Text style={[type.eyebrow, { color: palette.hint }]}>Conversas do grupo · {posts.length}</Text>
      {posts.length ? (
        posts.map((p) => <PostCard key={p.id} p={p} hideGroup />)
      ) : (
        <Text style={[type.bodySm, { color: palette.textMuted }]}>Ainda não há conversas. Que tal começar uma?</Text>
      )}
      </>
      )}
    </ScreenContainer>
  );
}
