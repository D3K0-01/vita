import React, { useState } from 'react';
import { View, Text, Pressable, TextInput, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowUp, Users } from 'lucide-react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { BackHeader } from '../../components/BackHeader';
import { Avatar } from '../../components/Avatar';
import { PostCard, findPost } from '../../components/community/PostCard';
import { CommentThread, useCommentCount } from '../../components/community/CommentThread';
import { useUI } from '../../components/UIProvider';
import { useApp } from '../../state/AppContext';

// Publicação aberta: o post em destaque no topo e a conversa completa embaixo.
export default function PostThread({ navigation, route }: any) {
  const { palette, colors, type } = useTheme();
  const { state, addComment } = useApp();
  const { toast } = useUI();
  const post = findPost(route.params?.postId, state.posts);
  const count = useCommentCount(post?.id ?? '');
  const [draft, setDraft] = useState('');

  if (!post) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: palette.bg, padding: 20 }}>
        <BackHeader title="Publicação" />
        <Text style={[type.body, { color: palette.textMuted }]}>Essa publicação não está mais disponível.</Text>
      </SafeAreaView>
    );
  }

  const send = () => {
    const text = draft.trim();
    if (!text) return;
    addComment(post.id, text);
    setDraft('');
    toast('Comentário publicado');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: palette.bg }} edges={['top', 'bottom']}>
      <View style={{ paddingHorizontal: 20 }}>
        <BackHeader title="Publicação" size="sm" />
      </View>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 4, paddingBottom: 24, gap: 14 }} keyboardShouldPersistTaps="handled">
          <Pressable
            onPress={() => navigation.navigate('GroupDetail', { groupId: post.groupId })}
            accessibilityRole="link"
            style={{ flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start', backgroundColor: palette.chipSelectedBg, borderRadius: 16, paddingVertical: 7, paddingHorizontal: 12 }}
          >
            <Users size={13} color={colors.accent2} />
            <Text style={[type.caption, { color: colors.accent2, fontFamily: 'Lexend_500Medium' }]}>{post.group}</Text>
          </Pressable>

          <PostCard p={post} highlighted />

          <Text style={[type.eyebrow, { color: palette.hint, marginTop: 6 }]}>
            {count} {count === 1 ? 'comentário' : 'comentários'}
          </Text>
          <CommentThread threadId={post.id} />
        </ScrollView>

        <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 10, paddingHorizontal: 16, paddingTop: 8, paddingBottom: 10, borderTopWidth: 1, borderTopColor: palette.divider, backgroundColor: palette.bg }}>
          <Avatar person="me" size={36} style={{ marginBottom: 6 }} />
          <TextInput
            value={draft}
            onChangeText={setDraft}
            placeholder={`Comentar como ${state.parentName}…`}
            placeholderTextColor={palette.textFaint}
            autoFocus={!!route.params?.focus}
            multiline
            maxLength={600}
            accessibilityLabel="Escrever comentário"
            style={[
              { flex: 1, maxHeight: 110, minHeight: 46, backgroundColor: palette.surface, borderWidth: 1, borderColor: palette.chipBorder, borderRadius: 23, paddingHorizontal: 15, paddingTop: 12, paddingBottom: 12, fontFamily: 'Lexend_400Regular', fontSize: 14.5, color: palette.text },
              { outlineStyle: 'none' } as any,
            ]}
          />
          <Pressable
            onPress={send}
            disabled={!draft.trim()}
            accessibilityRole="button"
            accessibilityLabel="Publicar comentário"
            style={{ width: 46, height: 46, borderRadius: 23, backgroundColor: colors.darkAzure, alignItems: 'center', justifyContent: 'center', opacity: draft.trim() ? 1 : 0.4 }}
          >
            <ArrowUp size={20} color={colors.offWhite} strokeWidth={2.2} />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
