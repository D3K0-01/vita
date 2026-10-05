import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, Image, TextInput, Linking } from 'react-native';
import { Search, Heart, Bookmark, X, ChevronRight, ChevronDown, ChevronUp, MapPin, Video, Clock, MessageCircle } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../theme/ThemeProvider';
import { ScreenContainer } from '../../components/ScreenContainer';
import { SOSButton } from '../../components/SOSButton';
import { TourTarget } from '../../components/tour/Tour';
import { Avatar } from '../../components/Avatar';
import { PostCard, useFeed } from '../../components/community/PostCard';
import { CommentThread, useCommentComposer, useCommentCount } from '../../components/community/CommentThread';
import { useUI } from '../../components/UIProvider';
import { useApp } from '../../state/AppContext';
import { article } from '../../data/mock';
import { GROUPS, upcomingMeetings, Meeting } from '../../data/community';
import { articleCover } from '../../data/images';
import { formatDayMonth, weekdayLong, weekdayShort } from '../../utils/date';
import { pickProfilePhoto } from '../../utils/pickImage';

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

function Composer({ label, onPress }: { label: string; onPress: () => void }) {
  const { palette, colors, type } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => ({ flexDirection: 'row', alignItems: 'center', gap: 11, backgroundColor: palette.surface, borderWidth: 1, borderColor: palette.surfaceBorder, borderRadius: 24, padding: 10, paddingRight: 16, opacity: pressed ? 0.8 : 1 })}
    >
      <Avatar person="me" size={34} />
      <Text style={[type.bodySm, { flex: 1, fontSize: 13.5, color: palette.textFaint }]}>{label}</Text>
      <Text style={[type.bodySm, { fontSize: 13, color: colors.accent2, fontFamily: 'Lexend_500Medium' }]}>publicar</Text>
    </Pressable>
  );
}

function FeedTab({ query, navigation }: { query: string; navigation: any }) {
  const { palette, colors, type } = useTheme();
  const { state, addPost, toggleIn } = useApp();
  const { prompt, choose, toast } = useUI();
  const q = query.trim().toLowerCase();
  const posts = useFeed().filter((p) => !q || `${p.body} ${p.author} ${p.group}`.toLowerCase().includes(q));
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
      GROUPS.map((g) => ({
        label: g.name,
        hint: state.joinedGroups.includes(g.id) ? 'você participa' : `${g.members.toLocaleString('pt-BR')} famílias`,
        onPress: () => {
          addPost(r.body, g.id);
          toast('Publicação enviada');
        },
      }))
    );
  };

  // o artigo entra depois das duas primeiras conversas, como um destaque
  const ArticleCard = showArticle ? (
    <View key="article" style={{ backgroundColor: palette.surface, borderWidth: 1, borderColor: palette.surfaceBorder, borderRadius: 18, overflow: 'hidden' }}>
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
          <Image source={articleCover} style={{ height: 150, width: '100%' }} resizeMode="cover" />
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
        <Pressable onPress={() => toggleIn('likedPosts', ARTICLE_ID)} accessibilityRole="button" style={{ flexDirection: 'row', alignItems: 'center', gap: 6, minHeight: 40 }}>
          <Heart size={16} color={articleLiked ? colors.accent2 : palette.text} fill={articleLiked ? colors.accent2 : 'transparent'} strokeWidth={1.8} />
          <Text style={[type.caption, { color: articleLiked ? colors.accent2 : palette.textMuted }]}>{34 + (articleLiked ? 1 : 0)}</Text>
        </Pressable>
        <View style={{ flex: 1 }} />
        <Pressable onPress={() => toggleIn('savedPosts', ARTICLE_ID)} accessibilityRole="button" style={{ flexDirection: 'row', alignItems: 'center', gap: 6, minHeight: 40 }}>
          <Bookmark size={16} color={articleSaved ? colors.accent2 : palette.text} fill={articleSaved ? colors.accent2 : 'transparent'} strokeWidth={1.8} />
          <Text style={[type.caption, { color: articleSaved ? colors.accent2 : palette.textMuted }]}>{articleSaved ? 'salvo' : 'salvar'}</Text>
        </Pressable>
      </View>
    </View>
  ) : null;

  return (
    <View style={{ gap: 14 }}>
      <Composer label="Contar algo do seu dia…" onPress={compose} />
      {posts.slice(0, 2).map((p) => (
        <PostCard key={p.id} p={p} />
      ))}
      {ArticleCard}
      {posts.slice(2).map((p) => (
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
  const feed = useFeed();
  const joinedCount = state.joinedGroups.length;
  const ordered = [...GROUPS].sort((a, b) => Number(state.joinedGroups.includes(b.id)) - Number(state.joinedGroups.includes(a.id)));

  return (
    <View style={{ gap: 14 }}>
      <View style={{ backgroundColor: palette.surface, borderWidth: 1, borderColor: palette.surfaceBorder, borderRadius: 20, padding: 20 }}>
        <Text style={[type.title, { color: palette.text, fontSize: 22, lineHeight: 28 }]}>
          {joinedCount ? `Você participa de ${joinedCount} ${joinedCount === 1 ? 'grupo' : 'grupos'}` : 'Encontre o seu grupo'}
        </Text>
        <Text style={[type.body, { color: palette.textMuted, fontSize: 13.5, marginTop: 8, lineHeight: 21 }]}>Toque em um grupo para ver a descrição e as conversas. Entrar e sair é livre.</Text>
      </View>
      {ordered.map((g) => {
        const on = state.joinedGroups.includes(g.id);
        const count = feed.filter((p) => p.groupId === g.id).length;
        return (
          <Pressable
            key={g.id}
            onPress={() => navigation.navigate('GroupDetail', { groupId: g.id })}
            accessibilityHint={`Abre o grupo ${g.name}`}
            style={({ pressed }) => ({ backgroundColor: palette.surface, borderWidth: on ? 1.5 : 1, borderColor: on ? colors.accent1 : palette.surfaceBorder, borderRadius: 16, padding: 15, gap: 8, opacity: pressed ? 0.85 : 1 })}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <View style={{ flex: 1 }}>
                <Text style={[type.cardTitle, { color: palette.text, fontSize: 16 }]}>{g.name}</Text>
                <Text style={[type.caption, { color: palette.textFaint, fontSize: 11.5, marginTop: 3 }]}>
                  {(g.members + (on ? 1 : 0)).toLocaleString('pt-BR')} famílias · {count} {count === 1 ? 'conversa' : 'conversas'}
                </Text>
              </View>
              <Pressable
                onPress={() => {
                  toggleIn('joinedGroups', g.id);
                  toast(on ? `Você saiu de "${g.name}"` : `Você entrou em "${g.name}"`);
                }}
                accessibilityRole="button"
                accessibilityLabel={on ? `Sair de ${g.name}` : `Entrar em ${g.name}`}
                hitSlop={6}
              >
                {on ? (
                  <View style={{ borderRadius: 20, paddingVertical: 9, paddingHorizontal: 14, borderWidth: 1.5, borderColor: palette.chipBorder }}>
                    <Text style={{ fontFamily: 'BricolageGrotesque_500Medium', fontSize: 12.5, color: palette.text }}>participando</Text>
                  </View>
                ) : (
                  <LinearGradient colors={[colors.accent1, colors.accent2]} style={{ borderRadius: 20, paddingVertical: 10, paddingHorizontal: 18 }}>
                    <Text style={{ fontFamily: 'BricolageGrotesque_500Medium', fontSize: 12.5, color: '#fff' }}>entrar</Text>
                  </LinearGradient>
                )}
              </Pressable>
            </View>
            <Text style={[type.bodySm, { color: palette.textMuted, fontSize: 12.5, lineHeight: 19 }]} numberOfLines={2}>
              {g.description}
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Text style={[type.caption, { color: colors.accent2, fontFamily: 'Lexend_500Medium' }]}>ver conversas</Text>
              <ChevronRight size={13} color={colors.accent2} />
            </View>
          </Pressable>
        );
      })}
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

function MeetingCard({ m, expanded, onToggle }: { m: Meeting; expanded: boolean; onToggle: () => void }) {
  const { palette, colors, type, radii } = useTheme();
  const { state, toggleIn } = useApp();
  const { toast } = useUI();
  const compose = useCommentComposer();
  const comments = useCommentCount(m.id);
  const d = new Date(m.date);
  const on = state.meetings.includes(m.id);
  const hour = `${d.getHours()}h${d.getMinutes() ? String(d.getMinutes()).padStart(2, '0') : ''}`;

  const openMap = () => {
    const url = m.coords
      ? `https://www.google.com/maps/search/?api=1&query=${m.coords.lat},${m.coords.lng}`
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(m.address ?? m.place)}`;
    Linking.openURL(url).catch(() => {});
  };

  return (
    <View style={{ backgroundColor: palette.surface, borderWidth: expanded ? 1.5 : 1, borderColor: expanded ? colors.accent1 : palette.surfaceBorder, borderRadius: 18, overflow: 'hidden' }}>
      <Pressable onPress={onToggle} accessibilityRole="button" accessibilityState={{ expanded }} accessibilityLabel={`${m.title}. ${expanded ? 'Recolher' : 'Ver detalhes'}`} style={{ padding: 16, flexDirection: 'row', gap: 14 }}>
        <View style={{ width: 54, alignItems: 'center', backgroundColor: colors.pastelGreen, borderRadius: 12, paddingVertical: 10, alignSelf: 'flex-start' }}>
          <Text style={[type.eyebrow, { fontSize: 10, color: colors.darkAzure }]}>{weekdayShort(d)}</Text>
          <Text style={{ fontFamily: 'BricolageGrotesque_600SemiBold', fontSize: 20, marginTop: 2, color: colors.darkAzure }}>{d.getDate()}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[type.cardTitle, { color: palette.text, fontSize: 17 }]}>{m.title}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 5 }}>
            {m.mode === 'online' ? <Video size={13} color={palette.hint} /> : <MapPin size={13} color={palette.hint} />}
            <Text style={[type.caption, { color: palette.textMuted, fontSize: 12, flex: 1 }]} numberOfLines={1}>
              {m.mode === 'online' ? 'online' : m.place} · {hour}
            </Text>
          </View>
          <Text style={[type.caption, { color: palette.textFaint, fontSize: 11.5, marginTop: 3 }]}>
            {m.enrolled + (on ? 1 : 0)} inscritos · {comments} {comments === 1 ? 'comentário' : 'comentários'}
          </Text>
        </View>
        {expanded ? <ChevronUp size={18} color={palette.hint} /> : <ChevronDown size={18} color={palette.hint} />}
      </Pressable>

      {expanded && (
        <View style={{ paddingHorizontal: 16, paddingBottom: 16, gap: 14 }}>
          <Text style={[type.bodySm, { color: palette.text, lineHeight: 21 }]}>{m.description}</Text>

          <View style={{ backgroundColor: palette.bg, borderRadius: radii.md, padding: 14, gap: 10 }}>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <Clock size={16} color={colors.accent2} style={{ marginTop: 2 }} />
              <Text style={[type.bodySm, { flex: 1, color: palette.text }]}>
                {weekdayLong(d)}, {formatDayMonth(d)} · {hour} · {m.durationMin} min
              </Text>
            </View>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              {m.mode === 'online' ? <Video size={16} color={colors.accent2} style={{ marginTop: 2 }} /> : <MapPin size={16} color={colors.accent2} style={{ marginTop: 2 }} />}
              <View style={{ flex: 1 }}>
                <Text style={[type.bodySm, { color: palette.text, fontFamily: 'Lexend_500Medium' }]}>{m.place}</Text>
                {m.address ? <Text style={[type.caption, { color: palette.textMuted, marginTop: 2 }]}>{m.address}</Text> : null}
                <Text style={[type.caption, { color: palette.textFaint, marginTop: 2 }]}>{m.host}</Text>
              </View>
            </View>
          </View>

          <View style={{ flexDirection: 'row', gap: 10 }}>
            {m.mode === 'presencial' ? (
              <Pressable onPress={openMap} accessibilityRole="button" style={{ flex: 1, flexDirection: 'row', gap: 6, alignItems: 'center', justifyContent: 'center', minHeight: 46, borderRadius: radii.pill, borderWidth: 1.5, borderColor: palette.chipBorder }}>
                <MapPin size={15} color={palette.text} />
                <Text style={[type.button, { color: palette.text, fontSize: 13.5 }]}>Ver no mapa</Text>
              </Pressable>
            ) : (
              <Pressable
                onPress={() => toast(on ? 'O link da sala aparece aqui 15 minutos antes do início.' : 'Inscreva-se para receber o link da sala.')}
                accessibilityRole="button"
                style={{ flex: 1, flexDirection: 'row', gap: 6, alignItems: 'center', justifyContent: 'center', minHeight: 46, borderRadius: radii.pill, borderWidth: 1.5, borderColor: palette.chipBorder }}
              >
                <Video size={15} color={palette.text} />
                <Text style={[type.button, { color: palette.text, fontSize: 13.5 }]}>Como entrar</Text>
              </Pressable>
            )}
            <Pressable
              onPress={() => {
                toggleIn('meetings', m.id);
                toast(on ? 'Inscrição cancelada' : `Inscrição feita! Lembramos você em ${formatDayMonth(d)}.`);
              }}
              accessibilityRole="button"
              style={{ flex: 1 }}
            >
              {on ? (
                <View style={{ minHeight: 46, borderRadius: radii.pill, alignItems: 'center', justifyContent: 'center', backgroundColor: palette.chipSelectedBg }}>
                  <Text style={[type.button, { color: colors.accent2, fontSize: 13.5 }]}>Inscrita(o) ✓</Text>
                </View>
              ) : (
                <LinearGradient colors={[colors.accent1, colors.accent2]} style={{ minHeight: 46, borderRadius: radii.pill, alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={[type.button, { color: '#fff', fontSize: 13.5 }]}>Inscrever</Text>
                </LinearGradient>
              )}
            </Pressable>
          </View>

          <View style={{ borderTopWidth: 1, borderTopColor: palette.divider, paddingTop: 14, gap: 12 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text style={[type.eyebrow, { color: palette.hint }]}>Dúvidas e combinados</Text>
              <Pressable onPress={() => compose(m.id)} accessibilityRole="button" style={{ flexDirection: 'row', alignItems: 'center', gap: 5, minHeight: 36 }}>
                <MessageCircle size={14} color={colors.accent2} />
                <Text style={[type.caption, { color: colors.accent2, fontFamily: 'Lexend_500Medium' }]}>comentar</Text>
              </Pressable>
            </View>
            <CommentThread threadId={m.id} emptyText="Ninguém comentou ainda. Tire sua dúvida aqui." />
          </View>
        </View>
      )}
    </View>
  );
}

function MeetingsTab({ initialOpen }: { initialOpen?: string }) {
  const { colors, type } = useTheme();
  const { state } = useApp();
  const meetings = upcomingMeetings();
  const [open, setOpen] = useState<string | null>(initialOpen ?? null);
  const mine = meetings.filter((m) => state.meetings.includes(m.id));
  return (
    <View style={{ gap: 14 }}>
      {meetings.map((m) => (
        <MeetingCard key={m.id} m={m} expanded={open === m.id} onToggle={() => setOpen((o) => (o === m.id ? null : m.id))} />
      ))}
      <View style={{ backgroundColor: colors.pastelGreen, borderRadius: 18, padding: 18 }}>
        <Text style={[type.cardTitle, { color: colors.darkAzure, fontSize: 16.5 }]}>Suas inscrições</Text>
        <Text style={[type.caption, { color: colors.darkAzure, fontSize: 12.5, opacity: 0.85, marginTop: 5 }]}>
          {mine.length ? mine.map((m) => `${m.title} (${formatDayMonth(new Date(m.date))})`).join(' · ') : 'Nenhuma inscrição ainda. Toque num encontro para ver os detalhes.'}
        </Text>
      </View>
    </View>
  );
}

function ProfileTab() {
  const { palette, colors, type } = useTheme();
  const { state, setState } = useApp();
  const { prompt, toast } = useUI();
  const feed = useFeed();
  const saved = feed.filter((p) => state.savedPosts.includes(p.id));
  const myPosts = state.posts;

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

  const changePhoto = async () => {
    const uri = await pickProfilePhoto();
    if (uri) {
      setState((s) => ({ ...s, photo: uri }));
      toast('Foto atualizada');
    }
  };

  return (
    <View style={{ gap: 18 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
        <Pressable onPress={changePhoto} accessibilityRole="button" accessibilityLabel="Trocar foto de perfil">
          <Avatar person="me" name={state.parentName} size={58} ring />
        </Pressable>
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

      {myPosts.length > 0 && (
        <View style={{ gap: 10 }}>
          <Text style={[type.eyebrow, { color: palette.hint }]}>Suas publicações</Text>
          {myPosts.map((p) => (
            <PostCard key={p.id} p={p} />
          ))}
        </View>
      )}

      <View style={{ gap: 10 }}>
        <Text style={[type.eyebrow, { color: palette.hint }]}>Salvos</Text>
        {saved.length ? saved.map((p) => <PostCard key={p.id} p={p} />) : <Text style={[type.bodySm, { color: palette.textMuted }]}>Toque em "salvar" numa publicação para guardar aqui.</Text>}
      </View>
    </View>
  );
}

export default function CommunityScreen({ navigation, route }: any) {
  const { palette, type } = useTheme();
  const [tab, setTab] = useState<Tab>('Feed');
  const [searching, setSearching] = useState(false);
  const [query, setQuery] = useState('');
  const [meetingToOpen, setMeetingToOpen] = useState<string | undefined>();

  // a Home pode abrir direto em "Encontros" (e já com um encontro aberto)
  useEffect(() => {
    const t = route.params?.tab as Tab | undefined;
    if (t && TABS.includes(t)) {
      setTab(t);
      if (route.params?.meetingId) setMeetingToOpen(route.params.meetingId);
      navigation.setParams({ tab: undefined, meetingId: undefined });
    }
  }, [route.params?.tab, route.params?.meetingId, navigation]);

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

      <TourTarget id="community-tabs">
        <Tabs active={tab} onChange={setTab} />
      </TourTarget>
      {tab === 'Feed' && <FeedTab query={query} navigation={navigation} />}
      {tab === 'Grupos' && <GroupsTab navigation={navigation} />}
      {tab === 'Encontros' && <MeetingsTab key={meetingToOpen ?? 'none'} initialOpen={meetingToOpen} />}
      {tab === 'Meu perfil' && <ProfileTab />}
    </ScreenContainer>
  );
}
