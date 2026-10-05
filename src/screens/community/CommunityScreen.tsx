import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Pressable, Image, TextInput, Linking, Animated, Platform, ScrollView, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Search, Heart, Bookmark, X, ChevronRight, ChevronDown, ChevronUp, MapPin, Video, Clock, MessageCircle, Lock, BadgeCheck } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../theme/ThemeProvider';
import { SOSButton } from '../../components/SOSButton';
import { TourTarget } from '../../components/tour/Tour';
import { Avatar } from '../../components/Avatar';
import { PostCard, SupporterSeal, useFeed } from '../../components/community/PostCard';
import { CommentThread, useCommentComposer, useCommentCount } from '../../components/community/CommentThread';
import { useJoinGroup } from '../../components/community/useJoinGroup';
import { useUI } from '../../components/UIProvider';
import { useApp } from '../../state/AppContext';
import { usePlan } from '../../state/usePlan';
import { ARTICLES, VitaArticle } from '../../data/articles';
import { GROUPS, Group, upcomingMeetings, Meeting } from '../../data/community';
import { formatDayMonth, weekdayLong, weekdayShort } from '../../utils/date';
import { pickProfilePhoto } from '../../utils/pickImage';

const TABS = ['Feed', 'Grupos', 'Encontros', 'Meu perfil'] as const;
type Tab = (typeof TABS)[number];

const PLACEHOLDER: Record<Tab, string> = {
  Feed: 'buscar no feed',
  Grupos: 'buscar grupos',
  Encontros: 'buscar encontros',
  'Meu perfil': 'buscar nos seus salvos',
};

/** Busca sem diferenciar acentos e maiúsculas. */
const norm = (t: string) => t.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
const matches = (q: string, ...fields: (string | undefined)[]) => !q || norm(fields.filter(Boolean).join(' ')).includes(q);

function Empty({ query }: { query: string }) {
  const { palette, type } = useTheme();
  return <Text style={[type.body, { color: palette.textMuted, textAlign: 'center', marginTop: 10 }]}>Nada encontrado para "{query}".</Text>;
}

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

/** Conteúdo revisado da Equipe Vita, no feed e nos salvos. */
function ArticleCard({ a, compact }: { a: VitaArticle; compact?: boolean }) {
  const { palette, colors, type } = useTheme();
  const { state, toggleIn } = useApp();
  const { toast } = useUI();
  const navigation = useNavigation<any>();
  const liked = state.likedPosts.includes(a.id);
  const saved = state.savedPosts.includes(a.id);
  return (
    <View style={{ backgroundColor: palette.surface, borderWidth: 1, borderColor: palette.surfaceBorder, borderRadius: 18, overflow: 'hidden' }}>
      <Pressable onPress={() => navigation.navigate('Article', { id: a.id })} accessibilityHint="Abre o artigo completo">
        <View style={{ padding: 16, paddingBottom: 12 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <LinearGradient colors={[colors.accent1, colors.accent2]} style={{ width: 8, height: 8, borderRadius: 4 }} />
            <Text style={[type.eyebrow, { color: colors.accent2, fontSize: 10.5 }]}>Conteúdo revisado · Vita</Text>
          </View>
          <Text style={[type.caption, { fontSize: 11.5, color: palette.textFaint, marginTop: 8 }]}>{a.source}</Text>
          <Text style={[type.cardTitle, { color: palette.text, fontSize: compact ? 16 : 18, marginTop: 6, lineHeight: compact ? 21 : 23 }]}>{a.title}</Text>
        </View>
        {compact ? null : a.cover ? (
          <Image source={a.cover} style={{ height: 150, width: '100%' }} resizeMode="cover" />
        ) : (
          <LinearGradient colors={a.gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ height: 110 }} />
        )}
        <View style={{ padding: 16, paddingTop: compact ? 0 : 16, paddingBottom: 6 }}>
          <Text style={[type.body, { fontSize: 13.5, color: palette.textMuted, lineHeight: 20 }]} numberOfLines={compact ? 2 : 3}>
            {a.body}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 8 }}>
            <BadgeCheck size={13} color={colors.accent2} />
            <Text style={[type.caption, { flex: 1, color: palette.textFaint, fontSize: 11 }]} numberOfLines={1}>{a.reviewedBy}</Text>
          </View>
          <Text style={[type.bodySm, { color: colors.accent2, fontFamily: 'Lexend_500Medium', marginTop: 8 }]}>ler artigo completo</Text>
        </View>
      </Pressable>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, marginHorizontal: 16, marginBottom: 6, paddingTop: 4, borderTopWidth: 1, borderTopColor: palette.divider }}>
        <Pressable onPress={() => toggleIn('likedPosts', a.id)} accessibilityRole="button" accessibilityLabel={liked ? 'Descurtir' : 'Curtir'} style={{ flexDirection: 'row', alignItems: 'center', gap: 6, minHeight: 40 }}>
          <Heart size={16} color={liked ? colors.accent2 : palette.text} fill={liked ? colors.accent2 : 'transparent'} strokeWidth={1.8} />
          <Text style={[type.caption, { color: liked ? colors.accent2 : palette.textMuted }]}>{a.likes + (liked ? 1 : 0)}</Text>
        </Pressable>
        <View style={{ flex: 1 }} />
        <Pressable
          onPress={() => {
            toggleIn('savedPosts', a.id);
            toast(saved ? 'Removido dos salvos' : 'Salvo no seu perfil');
          }}
          accessibilityRole="button"
          accessibilityLabel={saved ? 'Remover dos salvos' : 'Salvar artigo'}
          style={{ flexDirection: 'row', alignItems: 'center', gap: 6, minHeight: 40 }}
        >
          <Bookmark size={16} color={saved ? colors.accent2 : palette.text} fill={saved ? colors.accent2 : 'transparent'} strokeWidth={1.8} />
          <Text style={[type.caption, { color: saved ? colors.accent2 : palette.textMuted }]}>{saved ? 'salvo' : 'salvar'}</Text>
        </Pressable>
      </View>
    </View>
  );
}

// os artigos entram intercalados com as conversas: depois da 2ª, da 6ª, da 10ª…
const ARTICLE_SLOTS = [2, 6, 10, 14];

function FeedTab({ query }: { query: string }) {
  const { palette, type } = useTheme();
  const { state, addPost } = useApp();
  const { prompt, choose, toast } = useUI();
  const { hasExclusiveGroups } = usePlan();
  const q = norm(query.trim());
  const posts = useFeed().filter((p) => matches(q, p.body, p.author, p.group));
  const articles = ARTICLES.filter((a) => matches(q, a.title, a.body, a.full.join(' ')));

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
      GROUPS.filter((g) => !g.exclusive || hasExclusiveGroups).map((g) => ({
        label: g.name,
        hint: state.joinedGroups.includes(g.id) ? 'você participa' : `${g.members.toLocaleString('pt-BR')} famílias`,
        onPress: () => {
          addPost(r.body, g.id);
          toast('Publicação enviada');
        },
      }))
    );
  };

  const items: React.ReactNode[] = [];
  let ai = 0;
  posts.forEach((p, i) => {
    if (ARTICLE_SLOTS.includes(i) && articles[ai]) {
      items.push(<ArticleCard key={articles[ai].id} a={articles[ai]} />);
      ai++;
    }
    items.push(<PostCard key={p.id} p={p} />);
  });
  // artigos que sobraram (feed curto ou busca) vão para o fim
  articles.slice(ai).forEach((a) => items.push(<ArticleCard key={a.id} a={a} />));

  return (
    <View style={{ gap: 14 }}>
      {!q && <Composer label="Contar algo do seu dia…" onPress={compose} />}
      {q ? (
        <Text style={[type.caption, { color: palette.textMuted }]}>
          {posts.length + articles.length} resultado(s) no feed
        </Text>
      ) : null}
      {items}
      {q && items.length === 0 ? <Empty query={query} /> : null}
    </View>
  );
}

function GroupCard({ g }: { g: Group }) {
  const { palette, colors, type } = useTheme();
  const { state } = useApp();
  const navigation = useNavigation<any>();
  const feed = useFeed();
  const { toggle, locked: isLocked } = useJoinGroup();
  const on = state.joinedGroups.includes(g.id);
  const locked = isLocked(g);
  const count = feed.filter((p) => p.groupId === g.id).length;
  return (
    <Pressable
      onPress={() => navigation.navigate('GroupDetail', { groupId: g.id })}
      accessibilityHint={`Abre o grupo ${g.name}`}
      style={({ pressed }) => ({ backgroundColor: palette.surface, borderWidth: on ? 1.5 : 1, borderColor: on ? colors.accent1 : palette.surfaceBorder, borderRadius: 16, padding: 15, gap: 8, opacity: pressed ? 0.85 : 1 })}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <View style={{ flex: 1 }}>
          <Text style={[type.cardTitle, { color: palette.text, fontSize: 16 }]}>{g.name}</Text>
          <Text style={[type.caption, { color: palette.textFaint, fontSize: 11.5, marginTop: 3 }]}>
            {(g.members + (on ? 1 : 0)).toLocaleString('pt-BR')} famílias{locked ? ' · exclusivo Plus' : ` · ${count} ${count === 1 ? 'conversa' : 'conversas'}`}
          </Text>
        </View>
        <Pressable onPress={() => toggle(g)} accessibilityRole="button" accessibilityLabel={on ? `Sair de ${g.name}` : locked ? `${g.name}: exclusivo do Plus` : `Entrar em ${g.name}`} hitSlop={6}>
          {on ? (
            <View style={{ borderRadius: 20, paddingVertical: 9, paddingHorizontal: 14, borderWidth: 1.5, borderColor: palette.chipBorder }}>
              <Text style={{ fontFamily: 'BricolageGrotesque_500Medium', fontSize: 12.5, color: palette.text }}>participando</Text>
            </View>
          ) : locked ? (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, borderRadius: 20, paddingVertical: 9, paddingHorizontal: 13, backgroundColor: colors.pastelGreen }}>
              <Lock size={12} color={colors.darkAzure} />
              <Text style={{ fontFamily: 'BricolageGrotesque_500Medium', fontSize: 12.5, color: colors.darkAzure }}>Plus</Text>
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
        <Text style={[type.caption, { color: colors.accent2, fontFamily: 'Lexend_500Medium' }]}>{locked ? 'ver o grupo' : 'ver conversas'}</Text>
        <ChevronRight size={13} color={colors.accent2} />
      </View>
    </Pressable>
  );
}

function GroupsTab({ query }: { query: string }) {
  const { palette, colors, type } = useTheme();
  const { state } = useApp();
  const navigation = useNavigation<any>();
  const { plan, limits, hasExclusiveGroups } = usePlan();
  const q = norm(query.trim());
  const joinedCount = state.joinedGroups.length;
  const found = GROUPS.filter((g) => matches(q, g.name, g.description, g.rules.join(' ')));
  const ordered = [...found].sort((a, b) => Number(state.joinedGroups.includes(b.id)) - Number(state.joinedGroups.includes(a.id)));
  const open = ordered.filter((g) => !g.exclusive);
  const exclusive = ordered.filter((g) => g.exclusive);

  return (
    <View style={{ gap: 14 }}>
      {!q ? (
        <View style={{ backgroundColor: palette.surface, borderWidth: 1, borderColor: palette.surfaceBorder, borderRadius: 20, padding: 20 }}>
          <Text style={[type.title, { color: palette.text, fontSize: 22, lineHeight: 28 }]}>
            {joinedCount ? `Você participa de ${joinedCount} ${joinedCount === 1 ? 'grupo' : 'grupos'}` : 'Encontre o seu grupo'}
          </Text>
          <Text style={[type.body, { color: palette.textMuted, fontSize: 13.5, marginTop: 8, lineHeight: 21 }]}>
            Toque em um grupo para ver a descrição e as conversas.{plan === 'base' ? ` No Gratuito, até ${limits.groups} grupos ao mesmo tempo.` : ''}
          </Text>
        </View>
      ) : (
        <Text style={[type.caption, { color: palette.textMuted }]}>{found.length} grupo(s) encontrado(s)</Text>
      )}
      {open.map((g) => (
        <GroupCard key={g.id} g={g} />
      ))}
      {exclusive.length > 0 && (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 6 }}>
          <Text style={[type.eyebrow, { color: palette.hint, flex: 1 }]}>Grupos exclusivos do Plus</Text>
          {hasExclusiveGroups ? <SupporterSeal /> : <Lock size={13} color={palette.hint} />}
        </View>
      )}
      {exclusive.map((g) => (
        <GroupCard key={g.id} g={g} />
      ))}
      {!q && !hasExclusiveGroups && (
        <Pressable onPress={() => navigation.navigate('PlansStack')} accessibilityRole="button" style={{ backgroundColor: colors.darkAzure, borderRadius: 18, padding: 18 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <Text style={{ fontFamily: 'BricolageGrotesque_500Medium', fontSize: 16.5, color: colors.offWhite, flex: 1 }}>Rodas menores, com mediação</Text>
            <View style={{ backgroundColor: colors.pastelGreen, borderRadius: 12, paddingVertical: 3, paddingHorizontal: 9 }}>
              <Text style={{ fontFamily: 'Lexend_600SemiBold', fontSize: 10, color: colors.darkAzure }}>Plus</Text>
            </View>
          </View>
          <Text style={{ fontFamily: 'Lexend_300Light', fontSize: 12.5, lineHeight: 20, color: colors.offWhite, opacity: 0.85, marginTop: 6 }}>
            Grupos exclusivos e selo de apoiador(a). Os grupos abertos seguem livres para todos.
          </Text>
        </Pressable>
      )}
      {q && found.length === 0 ? <Empty query={query} /> : null}
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

function MeetingsTab({ initialOpen, query }: { initialOpen?: string; query: string }) {
  const { palette, colors, type } = useTheme();
  const { state } = useApp();
  const q = norm(query.trim());
  const all = upcomingMeetings();
  const meetings = all.filter((m) => matches(q, m.title, m.place, m.address, m.host, m.description, m.mode));
  const [open, setOpen] = useState<string | null>(initialOpen ?? null);
  const mine = all.filter((m) => state.meetings.includes(m.id));
  return (
    <View style={{ gap: 14 }}>
      {q ? <Text style={[type.caption, { color: palette.textMuted }]}>{meetings.length} encontro(s) encontrado(s)</Text> : null}
      {meetings.map((m) => (
        <MeetingCard key={m.id} m={m} expanded={open === m.id} onToggle={() => setOpen((o) => (o === m.id ? null : m.id))} />
      ))}
      {q && meetings.length === 0 ? <Empty query={query} /> : null}
      {!q && (
        <View style={{ backgroundColor: colors.pastelGreen, borderRadius: 18, padding: 18 }}>
          <Text style={[type.cardTitle, { color: colors.darkAzure, fontSize: 16.5 }]}>Suas inscrições</Text>
          <Text style={[type.caption, { color: colors.darkAzure, fontSize: 12.5, opacity: 0.85, marginTop: 5 }]}>
            {mine.length ? mine.map((m) => `${m.title} (${formatDayMonth(new Date(m.date))})`).join(' · ') : 'Nenhuma inscrição ainda. Toque num encontro para ver os detalhes.'}
          </Text>
        </View>
      )}
    </View>
  );
}

function ProfileTab({ query }: { query: string }) {
  const { palette, colors, type } = useTheme();
  const { state, setState } = useApp();
  const { prompt, toast } = useUI();
  const { name: planLabel, atLeast } = usePlan();
  const q = norm(query.trim());
  const feed = useFeed();
  const savedPosts = feed.filter((p) => state.savedPosts.includes(p.id) && matches(q, p.body, p.author, p.group));
  const savedArticles = ARTICLES.filter((a) => state.savedPosts.includes(a.id) && matches(q, a.title, a.body));
  const myPosts = state.posts.filter((p) => matches(q, p.body, p.group));
  const savedCount = feed.filter((p) => state.savedPosts.includes(p.id)).length + ARTICLES.filter((a) => state.savedPosts.includes(a.id)).length;

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
      {!q && (
        <>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
            <Pressable onPress={changePhoto} accessibilityRole="button" accessibilityLabel="Trocar foto de perfil">
              <Avatar person="me" name={state.parentName} size={58} ring />
            </Pressable>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={[type.title, { color: palette.text, fontSize: 22, flexShrink: 1 }]} numberOfLines={1}>{state.parentName}</Text>
                {atLeast('plus') ? <SupporterSeal /> : null}
              </View>
              <Text style={[type.caption, { color: palette.textMuted, fontSize: 12, marginTop: 2 }]}>
                {state.relation} de {state.children.length} · {atLeast('plus') ? `apoiador(a) ${planLabel}` : 'plano Gratuito'}
              </Text>
            </View>
            <Pressable onPress={edit} accessibilityRole="button" style={{ paddingVertical: 10, paddingLeft: 10 }}>
              <Text style={[type.bodySm, { color: colors.accent2, fontSize: 13, fontFamily: 'Lexend_500Medium' }]}>editar</Text>
            </Pressable>
          </View>

          <View style={{ flexDirection: 'row', gap: 10 }}>
            {[
              { n: state.joinedGroups.length, l: 'grupos' },
              { n: savedCount, l: 'salvos' },
              { n: state.meetings.length, l: 'encontros' },
            ].map((s) => (
              <View key={s.l} style={{ flex: 1, backgroundColor: palette.surface, borderWidth: 1, borderColor: palette.surfaceBorder, borderRadius: 16, padding: 16, alignItems: 'center' }}>
                <Text style={{ fontFamily: 'BricolageGrotesque_600SemiBold', fontSize: 22, color: palette.text }}>{s.n}</Text>
                <Text style={[type.caption, { fontSize: 11.5, color: palette.textMuted, marginTop: 2 }]}>{s.l}</Text>
              </View>
            ))}
          </View>
        </>
      )}

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
        {savedArticles.map((a) => (
          <ArticleCard key={a.id} a={a} compact />
        ))}
        {savedPosts.map((p) => (
          <PostCard key={p.id} p={p} />
        ))}
        {savedArticles.length + savedPosts.length === 0 ? (
          q ? <Empty query={query} /> : <Text style={[type.bodySm, { color: palette.textMuted }]}>Toque em "salvar" numa publicação ou artigo para guardar aqui.</Text>
        ) : null}
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
  const scrollRef = useRef<ScrollView>(null);

  // Cabeçalho (título, busca e abas) some ao descer e volta com um leve gesto para cima.
  const [headerH, setHeaderH] = useState(108);
  const offset = useRef(new Animated.Value(0)).current;
  const hidden = useRef(false);
  const lastY = useRef(0);
  const setHidden = (h: boolean) => {
    if (hidden.current === h) return;
    hidden.current = h;
    Animated.timing(offset, { toValue: h ? -headerH : 0, duration: 200, useNativeDriver: Platform.OS !== 'web' }).start();
  };
  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const y = e.nativeEvent.contentOffset.y;
    const dy = y - lastY.current;
    lastY.current = y;
    if (y < headerH || searching) return setHidden(false);
    if (dy > 6) setHidden(true);
    else if (dy < -4) setHidden(false);
  };

  const changeTab = (t: Tab) => {
    setTab(t);
    setHidden(false);
    scrollRef.current?.scrollTo({ y: 0, animated: false });
  };

  // a Home pode abrir direto em "Encontros" (e já com um encontro aberto)
  useEffect(() => {
    const t = route.params?.tab as Tab | undefined;
    if (t && TABS.includes(t)) {
      changeTab(t);
      if (route.params?.meetingId) setMeetingToOpen(route.params.meetingId);
      navigation.setParams({ tab: undefined, meetingId: undefined });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route.params?.tab, route.params?.meetingId, navigation]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: palette.bg }} edges={['top']}>
      <View style={{ flex: 1, overflow: 'hidden' }}>
        <ScrollView
          ref={scrollRef}
          style={{ flex: 1 }}
          onScroll={onScroll}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingHorizontal: 20, paddingTop: headerH + 14, paddingBottom: 96 }}
        >
          {tab === 'Feed' && <FeedTab query={query} />}
          {tab === 'Grupos' && <GroupsTab query={query} />}
          {tab === 'Encontros' && <MeetingsTab key={meetingToOpen ?? 'none'} initialOpen={meetingToOpen} query={query} />}
          {tab === 'Meu perfil' && <ProfileTab query={query} />}
        </ScrollView>

        <Animated.View
          onLayout={(e) => setHeaderH(Math.round(e.nativeEvent.layout.height))}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, paddingHorizontal: 20, paddingTop: 10, backgroundColor: palette.bg, zIndex: 2, transform: [{ translateY: offset }] }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', minHeight: 44, marginBottom: 6 }}>
            {searching ? (
              <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: palette.surface, borderWidth: 1, borderColor: palette.chipBorder, borderRadius: 22, paddingLeft: 14 }}>
                <Search size={16} color={palette.hint} />
                <TextInput
                  value={query}
                  onChangeText={setQuery}
                  autoFocus
                  placeholder={PLACEHOLDER[tab]}
                  placeholderTextColor={palette.textFaint}
                  accessibilityLabel={PLACEHOLDER[tab]}
                  returnKeyType="search"
                  style={[{ flex: 1, minHeight: 44, fontFamily: 'Lexend_400Regular', fontSize: 14.5, color: palette.text }, { outlineStyle: 'none' } as any]}
                />
                <Pressable
                  onPress={() => {
                    setSearching(false);
                    setQuery('');
                  }}
                  accessibilityRole="button"
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
                  onPress={() => setSearching(true)}
                  accessibilityRole="button"
                  accessibilityLabel={PLACEHOLDER[tab]}
                  style={{ flexDirection: 'row', alignItems: 'center', gap: 6, minHeight: 44, paddingLeft: 10 }}
                >
                  <Search size={17} color={palette.text} strokeWidth={1.9} />
                  <Text style={[type.caption, { color: palette.textMuted, fontSize: 12.5 }]}>buscar</Text>
                </Pressable>
              </>
            )}
          </View>
          <TourTarget id="community-tabs">
            <Tabs active={tab} onChange={changeTab} />
          </TourTarget>
        </Animated.View>
      </View>
      <SOSButton />
    </SafeAreaView>
  );
}
