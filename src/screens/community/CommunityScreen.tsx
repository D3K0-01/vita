import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, Pressable, Image, TextInput } from 'react-native';
import { Search, MoreHorizontal, Heart, MessageCircle, Bookmark, X, ChevronRight } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../theme/ThemeProvider';
import { ScreenContainer } from '../../components/ScreenContainer';
import { SOSButton } from '../../components/SOSButton';
import { Avatar } from '../../components/Avatar';
import { useUI } from '../../components/UIProvider';
import { useApp } from '../../state/AppContext';
import { communityGroups, article, upcomingMeetings, Post } from '../../data/mock';
import { articleCover } from '../../data/images';
import { formatDayMonth, timeAgo, weekdayShort } from '../../utils/date';

const TABS = ['Feed', 'Grupos', 'Encontros', 'Meu perfil'] as const;
type Tab = (typeof TABS)[number];

const ARTICLE_ID = 'article-quebras';

function Tabs({ active, onChange }: { active: Tab; onChange: (t: Tab) => void }) {
  const { palette, type } = useTheme();
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: palette.divider }}>
      {TABS.map((t) => (
        <Pressable
          key={t}
          onPress={() => onChange(t)}
          accessibilityRole="tab"
          accessibilityState={{ selected: active === t }}
          style={{ paddingVertical: 11, paddingHorizontal: 2, borderBottomWidth: 2, borderBottomColor: active === t ? palette.text : 'transparent', marginBottom: -1 }}
        >
          <Text style={[type.bodySm, { fontSize: 13.5, color: palette.text, opacity: active === t ? 1 : 0.65, fontFamily: active === t ? 'Lexend_600SemiBold' : 'Lexend_400Regular' }]}>{t}</Text>
        </Pressable>
      ))}
    </View>
  );
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

function usePostActions() {
  const { state, toggleIn, addComment, setState } = useApp();
  const { prompt, choose, toast, confirm } = useUI();

  const comment = async (p: Post) => {
    const r = await prompt({
      title: 'Comentar',
      message: `Respondendo a ${p.author}`,
      fields: [{ key: 'text', label: 'Seu comentário', placeholder: 'escreva com carinho…', multiline: true, maxLength: 500 }],
      confirmLabel: 'Comentar',
      validate: (v) => (v.text ? null : 'Escreva algo antes de enviar'),
    });
    if (r) {
      addComment(p.id, r.text);
      toast('Comentário publicado');
    }
  };

  const menu = (p: Post) =>
    choose(undefined, [
      { label: state.savedPosts.includes(p.id) ? 'Remover dos salvos' : 'Salvar publicação', onPress: () => toggleIn('savedPosts', p.id) },
      ...(p.mine
        ? [
            {
              label: 'Excluir publicação',
              destructive: true,
              onPress: async () => {
                if (await confirm({ title: 'Excluir publicação?', confirmLabel: 'Excluir', destructive: true })) {
                  setState((s) => ({ ...s, posts: s.posts.filter((x) => x.id !== p.id) }));
                  toast('Publicação excluída');
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
              },
            },
            { label: 'Denunciar', destructive: true, hint: 'a moderação revisa em até 24h', onPress: () => toast('Denúncia enviada à moderação. Obrigada por cuidar da comunidade.') },
          ]),
    ]);

  return { comment, menu };
}

function PostCard({ p }: { p: Post }) {
  const { palette, colors, type } = useTheme();
  const { state, toggleIn } = useApp();
  const { comment, menu } = usePostActions();
  const liked = state.likedPosts.includes(p.id);
  const saved = state.savedPosts.includes(p.id);
  const myComments = state.comments.filter((c) => c.postId === p.id);
  const fresh = p.mine && Date.now() - new Date(p.createdAt).getTime() < 2 * 60000;

  return (
    <View style={{ backgroundColor: palette.surface, borderWidth: 1, borderStyle: fresh ? 'dashed' : 'solid', borderColor: fresh ? palette.chipBorder : palette.surfaceBorder, borderRadius: 18, padding: 16 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <Avatar person={p.avatar} name={p.author} size={34} />
        <View style={{ flex: 1 }}>
          <Text style={[type.bodySm, { fontSize: 13.5, color: palette.text, fontFamily: 'Lexend_500Medium' }]}>
            {p.author}
            {p.mine ? ' · você' : ''}
          </Text>
          <Text style={[type.caption, { fontSize: 11, color: palette.textFaint, marginTop: 1 }]}>
            {p.group} · {timeAgo(p.createdAt)}
          </Text>
        </View>
        {fresh ? (
          <View style={{ backgroundColor: colors.greyAzure + '33', borderRadius: 14, paddingVertical: 4, paddingHorizontal: 10 }}>
            <Text style={{ fontFamily: 'Lexend_500Medium', fontSize: 10.5, color: palette.text }}>em análise</Text>
          </View>
        ) : null}
        <Pressable onPress={() => menu(p)} accessibilityLabel="Mais opções" style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center', marginRight: -10 }}>
          <MoreHorizontal size={18} color={palette.textFaint} />
        </Pressable>
      </View>
      <Text style={[type.body, { fontSize: 14, color: palette.text, marginTop: 10, lineHeight: 21 }]}>{p.body}</Text>
      {fresh ? <Text style={[type.caption, { fontSize: 11.5, color: palette.textFaint, marginTop: 8 }]}>Sua publicação aparece para o grupo em alguns minutos.</Text> : null}

      {myComments.length > 0 && (
        <View style={{ marginTop: 12, gap: 8 }}>
          {myComments.map((c) => (
            <View key={c.id} style={{ backgroundColor: palette.bg, borderRadius: 12, padding: 10 }}>
              <Text style={[type.caption, { color: palette.textFaint, fontSize: 11 }]}>
                {state.parentName} · {timeAgo(c.date)}
              </Text>
              <Text style={[type.bodySm, { color: palette.text, marginTop: 2 }]}>{c.text}</Text>
            </View>
          ))}
        </View>
      )}

      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, marginTop: 10, paddingTop: 6, borderTopWidth: 1, borderTopColor: palette.divider }}>
        <Action
          icon={<Heart size={16} color={liked ? colors.accent2 : palette.text} fill={liked ? colors.accent2 : 'transparent'} strokeWidth={1.8} />}
          label={String(p.likes + (liked ? 1 : 0))}
          active={liked}
          onPress={() => toggleIn('likedPosts', p.id)}
        />
        <Action icon={<MessageCircle size={16} color={palette.text} strokeWidth={1.8} />} label={`${p.comments + myComments.length} · comentar`} onPress={() => comment(p)} />
        <View style={{ flex: 1 }} />
        <Action
          icon={<Bookmark size={16} color={saved ? colors.accent2 : palette.text} fill={saved ? colors.accent2 : 'transparent'} strokeWidth={1.8} />}
          label={saved ? 'salvo' : 'salvar'}
          active={saved}
          onPress={() => toggleIn('savedPosts', p.id)}
        />
      </View>
    </View>
  );
}

function FeedTab({ query, navigation }: { query: string; navigation: any }) {
  const { palette, colors, type } = useTheme();
  const { state, addPost, toggleIn } = useApp();
  const { prompt, choose, toast } = useUI();
  const q = query.trim().toLowerCase();
  const posts = state.posts.filter((p) => !state.hiddenPosts.includes(p.id) && (!q || `${p.body} ${p.author} ${p.group}`.toLowerCase().includes(q)));
  const articleLiked = state.likedPosts.includes(ARTICLE_ID);
  const articleSaved = state.savedPosts.includes(ARTICLE_ID);
  const showArticle = !q || `${article.title} ${article.body}`.toLowerCase().includes(q);

  const compose = async () => {
    const r = await prompt({
      title: 'Contar algo do seu dia',
      message: 'Publicações passam por uma revisão rápida antes de aparecer para o grupo.',
      fields: [{ key: 'body', label: 'Sua publicação', placeholder: 'o que você quer dividir?', multiline: true, maxLength: 800 }],
      confirmLabel: 'Escolher o grupo',
      validate: (v) => (v.body.length >= 3 ? null : 'Escreva um pouco mais'),
    });
    if (!r) return;
    choose(
      'Publicar em qual grupo?',
      communityGroups.map((g) => ({
        label: g.name,
        hint: state.joinedGroups.includes(g.id) ? 'você participa' : `${g.members.toLocaleString('pt-BR')} famílias`,
        onPress: () => {
          addPost(r.body, g.name);
          toast('Publicação enviada');
        },
      }))
    );
  };

  return (
    <View style={{ gap: 14 }}>
      <Pressable
        onPress={compose}
        accessibilityRole="button"
        style={({ pressed }) => ({ flexDirection: 'row', alignItems: 'center', gap: 11, backgroundColor: palette.surface, borderWidth: 1, borderColor: palette.surfaceBorder, borderRadius: 24, padding: 10, paddingRight: 16, opacity: pressed ? 0.8 : 1 })}
      >
        <Avatar person="camila" name={state.parentName} size={34} />
        <Text style={[type.bodySm, { flex: 1, fontSize: 13.5, color: palette.textFaint }]}>Contar algo do seu dia…</Text>
        <Text style={[type.bodySm, { fontSize: 13, color: colors.accent2, fontFamily: 'Lexend_500Medium' }]}>publicar</Text>
      </Pressable>

      {showArticle && (
        <View style={{ backgroundColor: palette.surface, borderWidth: 1, borderColor: palette.surfaceBorder, borderRadius: 18, overflow: 'hidden' }}>
          <Pressable onPress={() => navigation.navigate('Article')} accessibilityRole="button">
            <View style={{ padding: 16, paddingBottom: 12 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <LinearGradient colors={[colors.accent1, colors.accent2]} style={{ width: 8, height: 8, borderRadius: 4 }} />
                <Text style={[type.eyebrow, { color: colors.accent2, fontSize: 10.5 }]}>Conteúdo revisado · Vita</Text>
              </View>
              <Text style={[type.caption, { fontSize: 11.5, color: palette.textFaint, marginTop: 8 }]}>{article.source}</Text>
              <Text style={[type.cardTitle, { color: palette.text, fontSize: 18, marginTop: 6, lineHeight: 23 }]}>{article.title}</Text>
            </View>
            {articleCover ? (
              <Image source={articleCover} style={{ height: 150, width: '100%' }} resizeMode="cover" accessibilityIgnoresInvertColors />
            ) : (
              <LinearGradient colors={[colors.pastelGreen, colors.greyAzure]} style={{ height: 150 }} />
            )}
            <View style={{ padding: 16, paddingBottom: 6 }}>
              <Text style={[type.body, { fontSize: 13.5, color: palette.textMuted, lineHeight: 20 }]} numberOfLines={3}>
                {article.body}
              </Text>
              <Text style={[type.bodySm, { color: colors.accent2, fontFamily: 'Lexend_500Medium', marginTop: 8 }]}>ler artigo completo</Text>
            </View>
          </Pressable>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, marginHorizontal: 16, marginBottom: 6, paddingTop: 4, borderTopWidth: 1, borderTopColor: palette.divider }}>
            <Action
              icon={<Heart size={16} color={articleLiked ? colors.accent2 : palette.text} fill={articleLiked ? colors.accent2 : 'transparent'} strokeWidth={1.8} />}
              label={String(34 + (articleLiked ? 1 : 0))}
              active={articleLiked}
              onPress={() => toggleIn('likedPosts', ARTICLE_ID)}
            />
            <View style={{ flex: 1 }} />
            <Action
              icon={<Bookmark size={16} color={articleSaved ? colors.accent2 : palette.text} fill={articleSaved ? colors.accent2 : 'transparent'} strokeWidth={1.8} />}
              label={articleSaved ? 'salvo' : 'salvar'}
              active={articleSaved}
              onPress={() => toggleIn('savedPosts', ARTICLE_ID)}
            />
          </View>
        </View>
      )}

      {posts.map((p) => (
        <PostCard key={p.id} p={p} />
      ))}
      {q && posts.length === 0 && !showArticle ? <Text style={[type.body, { color: palette.textMuted, textAlign: 'center', marginTop: 10 }]}>Nada encontrado para "{query}".</Text> : null}
    </View>
  );
}

function GroupsTab({ navigation }: { navigation: any }) {
  const { palette, colors, type } = useTheme();
  const { state, toggleIn } = useApp();
  const { toast } = useUI();
  const joined = communityGroups.filter((g) => state.joinedGroups.includes(g.id));
  return (
    <View style={{ gap: 16 }}>
      <View style={{ backgroundColor: palette.surface, borderWidth: 1, borderColor: palette.surfaceBorder, borderRadius: 20, padding: 22 }}>
        <Text style={[type.title, { color: palette.text, fontSize: 22, lineHeight: 28 }]}>
          {joined.length ? `Você participa de ${joined.length} ${joined.length === 1 ? 'grupo' : 'grupos'}` : 'Você ainda não entrou em nenhum grupo'}
        </Text>
        <Text style={[type.body, { color: palette.textMuted, fontSize: 13.5, marginTop: 8, lineHeight: 21 }]}>Entrar e sair é livre. Os grupos abaixo combinam com o que você contou.</Text>
      </View>
      <View style={{ gap: 10 }}>
        {communityGroups.map((g) => {
          const on = state.joinedGroups.includes(g.id);
          return (
            <View key={g.id} style={{ backgroundColor: palette.surface, borderWidth: 1, borderColor: palette.surfaceBorder, borderRadius: 16, padding: 15, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <View style={{ flex: 1 }}>
                <Text style={[type.cardTitle, { color: palette.text, fontSize: 16 }]}>{g.name}</Text>
                <Text style={[type.caption, { color: palette.textFaint, fontSize: 11.5, marginTop: 3 }]}>{(g.members + (on ? 1 : 0)).toLocaleString('pt-BR')} famílias</Text>
              </View>
              <Pressable
                onPress={() => {
                  toggleIn('joinedGroups', g.id);
                  toast(on ? `Você saiu de "${g.name}"` : `Você entrou em "${g.name}"`);
                }}
                accessibilityRole="button"
                accessibilityLabel={on ? `Sair de ${g.name}` : `Entrar em ${g.name}`}
              >
                {on ? (
                  <View style={{ borderRadius: 20, paddingVertical: 10, paddingHorizontal: 16, borderWidth: 1.5, borderColor: palette.chipBorder }}>
                    <Text style={{ fontFamily: 'BricolageGrotesque_500Medium', fontSize: 12.5, color: palette.text }}>participando</Text>
                  </View>
                ) : (
                  <LinearGradient colors={[colors.accent1, colors.accent2]} style={{ borderRadius: 20, paddingVertical: 11, paddingHorizontal: 20 }}>
                    <Text style={{ fontFamily: 'BricolageGrotesque_500Medium', fontSize: 12.5, color: '#fff' }}>entrar</Text>
                  </LinearGradient>
                )}
              </Pressable>
            </View>
          );
        })}
      </View>
      <Pressable onPress={() => navigation.navigate('PlansStack')} accessibilityRole="button" style={{ backgroundColor: colors.darkAzure, borderRadius: 18, padding: 18 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <Text style={{ fontFamily: 'BricolageGrotesque_500Medium', fontSize: 16.5, color: colors.offWhite, flex: 1 }}>Grupos temáticos do Plus</Text>
          <View style={{ backgroundColor: colors.pastelGreen, borderRadius: 12, paddingVertical: 3, paddingHorizontal: 9 }}>
            <Text style={{ fontFamily: 'Lexend_600SemiBold', fontSize: 10, color: colors.darkAzure }}>Plus</Text>
          </View>
        </View>
        <Text style={{ fontFamily: 'Lexend_300Light', fontSize: 12.5, lineHeight: 20, color: colors.offWhite, opacity: 0.85, marginTop: 6 }}>
          Rodas menores com mediação. Os grupos acima seguem abertos para todos.
        </Text>
      </Pressable>
    </View>
  );
}

function MeetingsTab() {
  const { palette, colors, type } = useTheme();
  const { state, toggleIn } = useApp();
  const { toast } = useUI();
  const meetings = upcomingMeetings();
  const mine = meetings.filter((m) => state.meetings.includes(m.id));
  return (
    <View style={{ gap: 14 }}>
      {meetings.map((m) => {
        const d = new Date(m.date);
        const on = state.meetings.includes(m.id);
        return (
          <View key={m.id} style={{ backgroundColor: palette.surface, borderWidth: 1, borderColor: palette.surfaceBorder, borderRadius: 18, padding: 16, flexDirection: 'row', gap: 14 }}>
            <View style={{ width: 54, alignItems: 'center', backgroundColor: colors.pastelGreen, borderRadius: 12, paddingVertical: 10, alignSelf: 'flex-start' }}>
              <Text style={[type.eyebrow, { fontSize: 10, color: colors.darkAzure }]}>{weekdayShort(d)}</Text>
              <Text style={{ fontFamily: 'BricolageGrotesque_600SemiBold', fontSize: 20, marginTop: 2, color: colors.darkAzure }}>{d.getDate()}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[type.cardTitle, { color: palette.text, fontSize: 17 }]}>{m.title}</Text>
              <Text style={[type.caption, { color: palette.textFaint, fontSize: 11.5, marginTop: 5 }]}>
                {m.info} · {m.enrolled + (on ? 1 : 0)} inscritos
              </Text>
              <Pressable
                onPress={() => {
                  toggleIn('meetings', m.id);
                  toast(on ? 'Inscrição cancelada' : `Inscrição feita! Lembramos você no dia ${formatDayMonth(d)}.`);
                }}
                accessibilityRole="button"
                style={{ alignSelf: 'flex-start', marginTop: 12 }}
              >
                {on ? (
                  <View style={{ borderRadius: 20, paddingVertical: 9, paddingHorizontal: 16, borderWidth: 1.5, borderColor: palette.chipBorder }}>
                    <Text style={{ fontFamily: 'BricolageGrotesque_500Medium', fontSize: 12.5, color: palette.text }}>inscrita(o) · cancelar</Text>
                  </View>
                ) : (
                  <LinearGradient colors={[colors.accent1, colors.accent2]} style={{ borderRadius: 20, paddingVertical: 10, paddingHorizontal: 20 }}>
                    <Text style={{ fontFamily: 'BricolageGrotesque_500Medium', fontSize: 12.5, color: '#fff' }}>inscrever</Text>
                  </LinearGradient>
                )}
              </Pressable>
            </View>
          </View>
        );
      })}
      <View style={{ backgroundColor: colors.pastelGreen, borderRadius: 18, padding: 18 }}>
        <Text style={[type.cardTitle, { color: colors.darkAzure, fontSize: 16.5 }]}>Suas inscrições</Text>
        <Text style={[type.caption, { color: colors.darkAzure, fontSize: 12.5, opacity: 0.8, marginTop: 5 }]}>
          {mine.length ? `${mine.length} ${mine.length === 1 ? 'encontro' : 'encontros'} · lembrete ativado` : 'Nenhuma inscrição ainda.'}
        </Text>
      </View>
    </View>
  );
}

function ProfileTab() {
  const { palette, colors, type } = useTheme();
  const { state, setState } = useApp();
  const { prompt, toast } = useUI();
  const saved = state.posts.filter((p) => state.savedPosts.includes(p.id));

  const edit = async () => {
    const r = await prompt({
      title: 'Editar perfil',
      fields: [{ key: 'name', label: 'Nome que aparece na comunidade', initial: state.parentName, maxLength: 30 }],
      validate: (v) => (v.name ? null : 'Informe um nome'),
    });
    if (r) {
      setState((s) => ({ ...s, parentName: r.name }));
      toast('Perfil atualizado');
    }
  };

  return (
    <View style={{ gap: 18 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
        <Avatar person="camila" name={state.parentName} size={58} ring />
        <View style={{ flex: 1 }}>
          <Text style={[type.title, { color: palette.text, fontSize: 22 }]}>{state.parentName}</Text>
          <Text style={[type.caption, { color: palette.textMuted, fontSize: 12, marginTop: 2 }]}>
            {state.relation} de {state.children.length} · {state.plan === 'plus' ? 'apoiador(a) Plus' : 'plano Base'}
          </Text>
        </View>
        <Pressable onPress={edit} accessibilityRole="button" style={{ paddingVertical: 10, paddingLeft: 10 }}>
          <Text style={[type.bodySm, { color: colors.accent2, fontSize: 13, fontFamily: 'Lexend_500Medium' }]}>editar</Text>
        </Pressable>
      </View>

      <View style={{ flexDirection: 'row', gap: 10 }}>
        {[
          { n: state.joinedGroups.length, l: 'grupos' },
          { n: state.savedPosts.length, l: 'salvos' },
          { n: state.meetings.length, l: 'encontros' },
        ].map((s) => (
          <View key={s.l} style={{ flex: 1, backgroundColor: palette.surface, borderWidth: 1, borderColor: palette.surfaceBorder, borderRadius: 16, padding: 16, alignItems: 'center' }}>
            <Text style={{ fontFamily: 'BricolageGrotesque_600SemiBold', fontSize: 22, color: palette.text }}>{s.n}</Text>
            <Text style={[type.caption, { fontSize: 11.5, color: palette.textMuted, marginTop: 2 }]}>{s.l}</Text>
          </View>
        ))}
      </View>

      <View>
        <Text style={[type.eyebrow, { color: palette.hint, marginBottom: 10 }]}>Salvos</Text>
        {saved.length ? (
          <View style={{ gap: 10 }}>
            {saved.map((p) => (
              <PostCard key={p.id} p={p} />
            ))}
          </View>
        ) : (
          <Text style={[type.bodySm, { color: palette.textMuted }]}>Toque em "salvar" numa publicação para guardar aqui.</Text>
        )}
      </View>

      <View style={{ backgroundColor: colors.greyAzure + '29', borderRadius: 18, padding: 18 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <Text style={{ fontFamily: 'BricolageGrotesque_500Medium', fontSize: 16, color: palette.text }}>Selo de apoiador</Text>
          <View style={{ backgroundColor: colors.darkAzure, borderRadius: 12, paddingVertical: 3, paddingHorizontal: 9 }}>
            <Text style={{ fontFamily: 'Lexend_600SemiBold', fontSize: 10, color: colors.offWhite }}>Plus</Text>
          </View>
        </View>
        <Text style={[type.caption, { fontSize: 12.5, color: palette.textMuted, marginTop: 6, lineHeight: 19 }]}>Só um detalhe ao lado do nome. Não muda o que você pode fazer aqui.</Text>
      </View>
    </View>
  );
}

export default function CommunityScreen({ navigation, route }: any) {
  const { palette, type } = useTheme();
  const [tab, setTab] = useState<Tab>('Feed');
  const [searching, setSearching] = useState(false);
  const [query, setQuery] = useState('');

  // a Home pode abrir direto em "Encontros"
  useEffect(() => {
    const t = route.params?.tab as Tab | undefined;
    if (t && TABS.includes(t)) {
      setTab(t);
      navigation.setParams({ tab: undefined });
    }
  }, [route.params?.tab, navigation]);

  const content = useMemo(() => {
    if (tab === 'Feed') return <FeedTab query={query} navigation={navigation} />;
    if (tab === 'Grupos') return <GroupsTab navigation={navigation} />;
    if (tab === 'Encontros') return <MeetingsTab />;
    return <ProfileTab />;
  }, [tab, query, navigation]);

  return (
    <ScreenContainer floating={<SOSButton />} contentStyle={{ paddingHorizontal: 20, paddingTop: 10, gap: 14 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', minHeight: 44 }}>
        {searching ? (
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: palette.surface, borderWidth: 1, borderColor: palette.chipBorder, borderRadius: 22, paddingLeft: 14 }}>
            <Search size={16} color={palette.hint} />
            <TextInput
              value={query}
              onChangeText={setQuery}
              autoFocus
              placeholder="buscar no feed"
              placeholderTextColor={palette.textFaint}
              style={[{ flex: 1, minHeight: 44, fontFamily: 'Lexend_400Regular', fontSize: 14.5, color: palette.text }, { outlineStyle: 'none' } as any]}
            />
            <Pressable
              onPress={() => {
                setSearching(false);
                setQuery('');
              }}
              accessibilityLabel="Fechar busca"
              style={{ width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }}
            >
              <X size={17} color={palette.hint} />
            </Pressable>
          </View>
        ) : (
          <>
            <Text style={[type.title, { color: palette.text }]}>Comunidade</Text>
            <Pressable
              onPress={() => {
                setSearching(true);
                setTab('Feed');
              }}
              accessibilityRole="button"
              accessibilityLabel="Buscar"
              style={{ flexDirection: 'row', alignItems: 'center', gap: 6, minHeight: 44, paddingLeft: 10 }}
            >
              <Search size={17} color={palette.text} strokeWidth={1.9} />
              <Text style={[type.caption, { color: palette.textMuted, fontSize: 12.5 }]}>buscar</Text>
            </Pressable>
          </>
        )}
      </View>

      <Tabs active={tab} onChange={setTab} />
      {content}
    </ScreenContainer>
  );
}
