import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { MoreHorizontal, Heart, MessageCircle, Bookmark } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../theme/ThemeProvider';
import { Avatar } from '../Avatar';
import { useUI } from '../UIProvider';
import { useApp } from '../../state/AppContext';
import { POSTS, Post } from '../../data/community';
import { timeAgo } from '../../utils/date';
import { useCommentCount } from './CommentThread';

/** Feed completo: publicações do usuário + exemplos, sem as ocultadas. */
export function useFeed() {
  const { state } = useApp();
  return [...state.posts, ...POSTS].filter((p) => !state.hiddenPosts.includes(p.id));
}

export function findPost(id: string, mine: Post[]) {
  return mine.find((p) => p.id === id) ?? POSTS.find((p) => p.id === id);
}

function Action({ icon, label, onPress, active }: { icon: React.ReactNode; label: string; onPress: () => void; active?: boolean }) {
  const { palette, type, colors } = useTheme();
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={label} style={({ pressed }) => ({ flexDirection: 'row', alignItems: 'center', gap: 6, minHeight: 40, paddingRight: 6, opacity: pressed ? 0.6 : 1 })}>
      {icon}
      <Text style={[type.caption, { fontSize: 12.5, color: active ? colors.accent2 : palette.textMuted, fontFamily: active ? 'Lexend_500Medium' : 'Lexend_400Regular' }]}>{label}</Text>
    </Pressable>
  );
}

type Props = {
  p: Post;
  /** Na página da publicação: destaque e texto maior, sem abrir de novo ao tocar. */
  highlighted?: boolean;
  /** Esconde o nome do grupo (na página do próprio grupo). */
  hideGroup?: boolean;
};

export function PostCard({ p, highlighted, hideGroup }: Props) {
  const { palette, colors, type } = useTheme();
  const { state, toggleIn, setState } = useApp();
  const { choose, toast, confirm } = useUI();
  const navigation = useNavigation<any>();
  const liked = state.likedPosts.includes(p.id);
  const saved = state.savedPosts.includes(p.id);
  const comments = useCommentCount(p.id);
  const fresh = p.mine && Date.now() - new Date(p.createdAt).getTime() < 2 * 60000;

  const open = () => {
    if (!highlighted) navigation.navigate('PostThread', { postId: p.id });
  };

  const menu = () =>
    choose(undefined, [
      { label: saved ? 'Remover dos salvos' : 'Salvar publicação', onPress: () => toggleIn('savedPosts', p.id) },
      ...(hideGroup ? [] : [{ label: `Ver o grupo "${p.group}"`, onPress: () => navigation.navigate('GroupDetail', { groupId: p.groupId }) }]),
      ...(p.mine
        ? [
            {
              label: 'Excluir publicação',
              destructive: true,
              onPress: async () => {
                if (await confirm({ title: 'Excluir publicação?', confirmLabel: 'Excluir', destructive: true })) {
                  setState((s) => ({ ...s, posts: s.posts.filter((x) => x.id !== p.id) }));
                  toast('Publicação excluída');
                  if (highlighted) navigation.goBack();
                }
              },
            },
          ]
        : [
            {
              label: 'Ocultar do meu feed',
              onPress: () => {
                toggleIn('hiddenPosts', p.id);
                toast('Publicação ocultada');
                if (highlighted) navigation.goBack();
              },
            },
            { label: 'Denunciar', destructive: true, hint: 'a moderação revisa em até 24h', onPress: () => toast('Denúncia enviada à moderação. Obrigada por cuidar da comunidade.') },
          ]),
    ]);

  return (
    <Pressable
      onPress={open}
      disabled={highlighted}
      // sem role de botão: o cartão contém outros botões (curtir, comentar…)
      accessibilityHint={highlighted ? undefined : 'Toque para abrir a publicação e os comentários'}
      style={({ pressed }) => ({
        backgroundColor: palette.surface,
        borderWidth: highlighted ? 1.5 : 1,
        borderStyle: fresh ? 'dashed' : 'solid',
        borderColor: highlighted ? colors.accent1 : fresh ? palette.chipBorder : palette.surfaceBorder,
        borderRadius: 18,
        padding: 16,
        opacity: pressed ? 0.92 : 1,
      })}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <Avatar person={p.avatar === 'me' ? 'me' : p.avatar} name={p.author} size={highlighted ? 40 : 34} />
        <View style={{ flex: 1 }}>
          <Text style={[type.bodySm, { fontSize: 13.5, color: palette.text, fontFamily: 'Lexend_500Medium' }]}>
            {p.author}
            {p.mine ? ' · você' : ''}
          </Text>
          <Text style={[type.caption, { fontSize: 11, color: palette.textFaint, marginTop: 1 }]} numberOfLines={1}>
            {hideGroup ? '' : `${p.group} · `}
            {timeAgo(p.createdAt)}
          </Text>
        </View>
        {fresh ? (
          <View style={{ backgroundColor: colors.greyAzure + '33', borderRadius: 14, paddingVertical: 4, paddingHorizontal: 10 }}>
            <Text style={{ fontFamily: 'Lexend_500Medium', fontSize: 10.5, color: palette.text }}>em análise</Text>
          </View>
        ) : null}
        <Pressable onPress={menu} accessibilityLabel="Mais opções" style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center', marginRight: -10 }}>
          <MoreHorizontal size={18} color={palette.textFaint} />
        </Pressable>
      </View>
      <Text style={[type.body, { fontSize: highlighted ? 15.5 : 14, color: palette.text, marginTop: 10, lineHeight: highlighted ? 24 : 21 }]}>{p.body}</Text>
      {fresh ? <Text style={[type.caption, { fontSize: 11.5, color: palette.textFaint, marginTop: 8 }]}>Sua publicação aparece para o grupo em alguns minutos.</Text> : null}

      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, marginTop: 10, paddingTop: 6, borderTopWidth: 1, borderTopColor: palette.divider }}>
        <Action
          icon={<Heart size={16} color={liked ? colors.accent2 : palette.text} fill={liked ? colors.accent2 : 'transparent'} strokeWidth={1.8} />}
          label={String(p.likes + (liked ? 1 : 0))}
          active={liked}
          onPress={() => toggleIn('likedPosts', p.id)}
        />
        <Action
          icon={<MessageCircle size={16} color={palette.text} strokeWidth={1.8} />}
          label={highlighted ? `${comments} ${comments === 1 ? 'comentário' : 'comentários'}` : `${comments} · comentar`}
          onPress={() => (highlighted ? undefined : navigation.navigate('PostThread', { postId: p.id, focus: true }))}
        />
        <View style={{ flex: 1 }} />
        <Action
          icon={<Bookmark size={16} color={saved ? colors.accent2 : palette.text} fill={saved ? colors.accent2 : 'transparent'} strokeWidth={1.8} />}
          label={saved ? 'salvo' : 'salvar'}
          active={saved}
          onPress={() => toggleIn('savedPosts', p.id)}
        />
      </View>
    </Pressable>
  );
}
