import React, { useMemo, useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Heart, CornerDownRight } from 'lucide-react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { Avatar } from '../Avatar';
import { useUI } from '../UIProvider';
import { useApp } from '../../state/AppContext';
import { SEED_COMMENTS, CommunityComment } from '../../data/community';
import { timeAgo } from '../../utils/date';

/** Comentários de exemplo + os do usuário, de um post ou encontro. */
export function useThreadComments(threadId: string) {
  const { state } = useApp();
  return useMemo(() => {
    const mine: CommunityComment[] = state.comments
      .filter((c) => c.postId === threadId)
      .map((c) => ({ id: c.id, threadId, parentId: c.parentId, mention: c.mention, author: state.parentName, avatar: 'me', text: c.text, createdAt: c.date, likes: 0, mine: true }));
    return [...SEED_COMMENTS.filter((c) => c.threadId === threadId), ...mine];
  }, [state.comments, state.parentName, threadId]);
}

export function useCommentCount(threadId: string) {
  return useThreadComments(threadId).length;
}

/** Pede o texto de um comentário (ou resposta) e salva. */
export function useCommentComposer() {
  const { addComment } = useApp();
  const { prompt, toast } = useUI();
  return async (threadId: string, replyTo?: CommunityComment) => {
    const r = await prompt({
      title: replyTo ? `Responder a ${replyTo.author}` : 'Comentar',
      message: replyTo ? `"${replyTo.text.slice(0, 90)}${replyTo.text.length > 90 ? '…' : ''}"` : undefined,
      fields: [{ key: 'text', label: replyTo ? 'Sua resposta' : 'Seu comentário', placeholder: 'escreva com carinho…', multiline: true, maxLength: 600 }],
      confirmLabel: replyTo ? 'Responder' : 'Comentar',
      validate: (v) => (v.text ? null : 'Escreva algo antes de enviar'),
    });
    if (!r) return false;
    // resposta a uma resposta fica no mesmo nível (como no Instagram), marcando o autor
    const parentId = replyTo ? replyTo.parentId ?? replyTo.id : undefined;
    addComment(threadId, r.text, parentId, replyTo?.parentId ? replyTo.author : undefined);
    toast(replyTo ? 'Resposta publicada' : 'Comentário publicado');
    return true;
  };
}

function CommentItem({ c, reply, onReply }: { c: CommunityComment; reply?: boolean; onReply: (c: CommunityComment) => void }) {
  const { palette, colors, type } = useTheme();
  const { state, toggleIn } = useApp();
  const liked = state.likedComments.includes(c.id);
  return (
    <View style={{ flexDirection: 'row', gap: 10 }}>
      <Avatar person={c.avatar === 'me' ? 'me' : c.avatar} name={c.author} size={reply ? 28 : 34} />
      <View style={{ flex: 1 }}>
        <View style={{ backgroundColor: c.mine ? palette.chipSelectedBg : palette.surface, borderWidth: 1, borderColor: palette.surfaceBorder, borderRadius: 16, borderTopLeftRadius: 6, paddingVertical: 9, paddingHorizontal: 12 }}>
          <Text style={[type.caption, { color: palette.text, fontFamily: 'Lexend_500Medium', fontSize: 12.5 }]}>
            {c.author}
            {c.mine ? ' · você' : ''}
            {c.author === 'Equipe Vita' ? ' ✓' : ''}
          </Text>
          <Text style={[type.bodySm, { color: palette.text, fontSize: 13.5, lineHeight: 20, marginTop: 2 }]}>
            {c.mention ? <Text style={{ color: colors.accent2, fontFamily: 'Lexend_500Medium' }}>@{c.mention} </Text> : null}
            {c.text}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16, paddingLeft: 6, marginTop: 2 }}>
          <Text style={[type.caption, { fontSize: 11, color: palette.textFaint }]}>{timeAgo(c.createdAt)}</Text>
          <Pressable
            onPress={() => toggleIn('likedComments', c.id)}
            accessibilityRole="button"
            accessibilityLabel={liked ? 'Descurtir comentário' : 'Curtir comentário'}
            style={{ flexDirection: 'row', alignItems: 'center', gap: 4, minHeight: 32 }}
          >
            <Heart size={13} color={liked ? colors.accent2 : palette.textFaint} fill={liked ? colors.accent2 : 'transparent'} />
            <Text style={[type.caption, { fontSize: 11.5, color: liked ? colors.accent2 : palette.textFaint }]}>{c.likes + (liked ? 1 : 0) || ''}</Text>
          </Pressable>
          <Pressable onPress={() => onReply(c)} accessibilityRole="button" accessibilityLabel={`Responder a ${c.author}`} style={{ minHeight: 32, justifyContent: 'center' }}>
            <Text style={[type.caption, { fontSize: 11.5, color: palette.textMuted, fontFamily: 'Lexend_500Medium' }]}>responder</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

/**
 * Lista de comentários com respostas recolhíveis por comentário
 * (como no Instagram/Reddit). Respostas novas abrem o fio automaticamente.
 */
export function CommentThread({ threadId, emptyText = 'Seja a primeira pessoa a comentar.' }: { threadId: string; emptyText?: string }) {
  const { palette, colors, type } = useTheme();
  const all = useThreadComments(threadId);
  const compose = useCommentComposer();
  const [open, setOpen] = useState<Record<string, boolean>>({});

  const top = all.filter((c) => !c.parentId);
  const repliesOf = (id: string) => all.filter((c) => c.parentId === id).sort((a, b) => a.createdAt.localeCompare(b.createdAt));

  const reply = async (c: CommunityComment) => {
    const ok = await compose(threadId, c);
    if (ok) setOpen((o) => ({ ...o, [c.parentId ?? c.id]: true }));
  };

  if (!top.length) return <Text style={[type.bodySm, { color: palette.textMuted }]}>{emptyText}</Text>;

  return (
    <View style={{ gap: 14 }}>
      {top.map((c) => {
        const replies = repliesOf(c.id);
        const expanded = !!open[c.id];
        return (
          <View key={c.id} style={{ gap: 8 }}>
            <CommentItem c={c} onReply={reply} />
            {replies.length > 0 && (
              <View style={{ marginLeft: 44, gap: 8 }}>
                <Pressable
                  onPress={() => setOpen((o) => ({ ...o, [c.id]: !expanded }))}
                  accessibilityRole="button"
                  accessibilityState={{ expanded }}
                  style={{ flexDirection: 'row', alignItems: 'center', gap: 8, minHeight: 32 }}
                >
                  <View style={{ width: 22, height: 1, backgroundColor: palette.chipBorder }} />
                  <Text style={[type.caption, { fontSize: 12, color: colors.accent2, fontFamily: 'Lexend_500Medium' }]}>
                    {expanded ? 'ocultar respostas' : `ver ${replies.length} ${replies.length === 1 ? 'resposta' : 'respostas'}`}
                  </Text>
                </Pressable>
                {expanded &&
                  replies.map((r) => (
                    <View key={r.id} style={{ flexDirection: 'row', gap: 6 }}>
                      <CornerDownRight size={14} color={palette.chipBorder} style={{ marginTop: 8 }} />
                      <View style={{ flex: 1 }}>
                        <CommentItem c={r} reply onReply={reply} />
                      </View>
                    </View>
                  ))}
              </View>
            )}
          </View>
        );
      })}
    </View>
  );
}
