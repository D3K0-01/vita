import React, { useState } from 'react';
import { View, Text, Pressable, Linking, Platform, Share } from 'react-native';
import { ChevronDown, ChevronUp, Mail, MessageCircle, Download, Trash2, PlayCircle } from 'lucide-react-native';
import { useTour } from '../../components/tour/Tour';
import { useTheme } from '../../theme/ThemeProvider';
import { ScreenContainer } from '../../components/ScreenContainer';
import { BackHeader } from '../../components/BackHeader';
import { Button } from '../../components/Button';
import { Chip } from '../../components/Chip';
import { TextField } from '../../components/TextField';
import { useUI } from '../../components/UIProvider';
import { useApp } from '../../state/AppContext';
import { formatPhone } from '../../utils/format';
import { RELATIONS } from '../onboarding/TrustedContact2g';

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

function Label({ children }: { children: React.ReactNode }) {
  const { palette, type } = useTheme();
  return <Text style={[type.eyebrow, { color: palette.hint, marginBottom: 8 }]}>{children}</Text>;
}

export function EditProfile({ navigation }: any) {
  const { state, setState } = useApp();
  const { toast } = useUI();
  const [name, setName] = useState(state.parentName);
  const [email, setEmail] = useState(state.email);
  const [relation, setRelation] = useState(state.relation);
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});

  const save = () => {
    const e: typeof errors = {};
    if (!name.trim()) e.name = 'Informe seu nome';
    if (email && !isEmail(email)) e.email = 'E-mail inválido';
    setErrors(e);
    if (e.name || e.email) return;
    setState((s) => ({ ...s, parentName: name.trim(), email: email.trim(), relation }));
    toast('Dados salvos');
    navigation.goBack();
  };

  return (
    <ScreenContainer edges={['top', 'bottom']} contentStyle={{ paddingHorizontal: 20, paddingTop: 4, gap: 18 }}>
      <BackHeader title="Nome e e-mail" />
      <TextField label="Como podemos te chamar" value={name} onChangeText={setName} autoCapitalize="words" maxLength={40} error={errors.name} />
      <TextField label="E-mail" value={email} onChangeText={setEmail} keyboardType="email-address" placeholder="seu@email.com" error={errors.email} />
      <View>
        <Label>Vínculo com a criança</Label>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {['mãe', 'pai', 'responsável legal', 'outro'].map((r) => (
            <Chip key={r} label={r} selected={relation === r} onPress={() => setRelation(r)} />
          ))}
        </View>
      </View>
      <Button label="Salvar" onPress={save} />
    </ScreenContainer>
  );
}

export function Security({ navigation }: any) {
  const { palette, type } = useTheme();
  const { toast } = useUI();
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [error, setError] = useState<string | null>(null);

  const save = () => {
    if (!current) return setError('Digite a senha atual');
    if (next.length < 6) return setError('A nova senha precisa de pelo menos 6 caracteres');
    if (next !== confirmPw) return setError('As senhas novas não são iguais');
    setError(null);
    toast('Senha alterada (simulado no protótipo)');
    navigation.goBack();
  };

  return (
    <ScreenContainer edges={['top', 'bottom']} contentStyle={{ paddingHorizontal: 20, paddingTop: 4, gap: 18 }}>
      <BackHeader title="Senha e acesso" />
      <TextField label="Senha atual" value={current} onChangeText={setCurrent} password />
      <TextField label="Nova senha" value={next} onChangeText={setNext} password placeholder="mínimo de 6 caracteres" />
      <TextField label="Repita a nova senha" value={confirmPw} onChangeText={setConfirmPw} password />
      {error ? <Text style={[type.caption, { color: '#9B3D3D' }]}>{error}</Text> : null}
      <Button label="Alterar senha" onPress={save} />
      <Text style={[type.caption, { color: palette.textFaint, textAlign: 'center' }]}>Protótipo: não há servidor de contas, então a senha não é guardada.</Text>
    </ScreenContainer>
  );
}

export function TrustedContactEdit({ navigation }: any) {
  const { palette, type, radii } = useTheme();
  const { state, setState } = useApp();
  const { toast, confirm } = useUI();
  const [name, setName] = useState(state.trustedContact?.name ?? '');
  const [phone, setPhone] = useState(state.trustedContact?.phone ?? '');
  const [relation, setRelation] = useState(state.trustedContact?.relation ?? 'irmã(o)');
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});

  const save = () => {
    const e: typeof errors = {};
    if (!name.trim()) e.name = 'Informe o nome';
    if (phone.replace(/\D/g, '').length < 10) e.phone = 'Telefone com DDD';
    setErrors(e);
    if (e.name || e.phone) return;
    setState((s) => ({ ...s, trustedContact: { name: name.trim(), phone, relation } }));
    toast('Contato de confiança salvo');
    navigation.goBack();
  };

  const remove = async () => {
    if (await confirm({ title: 'Remover contato?', message: 'Ele deixa de aparecer no Modo Crise.', confirmLabel: 'Remover', destructive: true })) {
      setState((s) => ({ ...s, trustedContact: null }));
      toast('Contato removido');
      navigation.goBack();
    }
  };

  return (
    <ScreenContainer edges={['top', 'bottom']} contentStyle={{ paddingHorizontal: 20, paddingTop: 4, gap: 18 }}>
      <BackHeader title="Contato de confiança" />
      <Text style={[type.body, { color: palette.textMuted }]}>Aparece no Modo Crise, a um toque, inclusive sem internet.</Text>
      <TextField label="Nome" value={name} onChangeText={setName} autoCapitalize="words" error={errors.name} placeholder="ex: Marina" />
      <View>
        <Label>Vínculo</Label>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {RELATIONS.map((r) => (
            <Chip key={r} label={r} selected={relation === r} onPress={() => setRelation(r)} />
          ))}
        </View>
      </View>
      <TextField label="Telefone" value={phone} onChangeText={(v) => setPhone(formatPhone(v))} keyboardType="phone-pad" placeholder="(00) 00000-0000" error={errors.phone} />
      <Button label="Salvar contato" onPress={save} />
      {state.trustedContact ? <Button label="Remover contato" variant="ghost" onPress={remove} /> : null}
      <View style={{ backgroundColor: palette.hint + '29', borderRadius: radii.lg, padding: 14 }}>
        <Text style={[type.caption, { color: palette.text }]}>Só você vê esse contato. Nada é enviado sem você tocar.</Text>
      </View>
    </ScreenContainer>
  );
}

const DIAGNOSES = ['TDAH', 'TEA', 'TDAH + TEA', 'Em investigação', 'não informado'];

export function EditChild({ navigation, route }: any) {
  const { state, saveChild, removeChild, setActiveChild } = useApp();
  const { toast, confirm } = useUI();
  const existing = state.children.find((c) => c.id === route.params?.id);
  const [name, setName] = useState(existing?.name ?? '');
  const [age, setAge] = useState(existing ? String(existing.age) : '');
  const [diagnosis, setDiagnosis] = useState(existing?.diagnosis ?? 'Em investigação');
  const [errors, setErrors] = useState<{ name?: string; age?: string }>({});

  const save = () => {
    const n = Number(age);
    const e: typeof errors = {};
    if (!name.trim()) e.name = 'Informe o nome ou apelido';
    if (!age || !Number.isInteger(n) || n > 25) e.age = 'Idade inválida';
    setErrors(e);
    if (e.name || e.age) return;
    const id = existing?.id ?? `c${Date.now()}`;
    saveChild({ id, name: name.trim(), age: n, diagnosis });
    if (!existing) setActiveChild(id);
    toast(existing ? 'Dados atualizados' : `${name.trim()} foi adicionado(a)`);
    navigation.goBack();
  };

  const remove = async () => {
    if (!existing) return;
    if (state.children.length <= 1) return toast('É preciso manter pelo menos um filho cadastrado');
    if (await confirm({ title: `Remover ${existing.name}?`, message: 'A rotina dele(a) também será apagada deste aparelho.', confirmLabel: 'Remover', destructive: true })) {
      removeChild(existing.id);
      toast('Removido');
      navigation.goBack();
    }
  };

  return (
    <ScreenContainer edges={['top', 'bottom']} contentStyle={{ paddingHorizontal: 20, paddingTop: 4, gap: 18 }}>
      <BackHeader title={existing ? `Editar ${existing.name}` : 'Adicionar filho ou filha'} />
      <View style={{ flexDirection: 'row', gap: 12 }}>
        <View style={{ flex: 2 }}>
          <TextField label="Nome ou apelido" value={name} onChangeText={setName} autoCapitalize="words" error={errors.name} />
        </View>
        <View style={{ flex: 1 }}>
          <TextField label="Idade" value={age} onChangeText={(v) => setAge(v.replace(/\D/g, ''))} keyboardType="number-pad" maxLength={2} error={errors.age} />
        </View>
      </View>
      <View>
        <Label>Diagnóstico</Label>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {DIAGNOSES.map((d) => (
            <Chip key={d} label={d} selected={diagnosis === d} onPress={() => setDiagnosis(d)} />
          ))}
        </View>
      </View>
      <Button label="Salvar" onPress={save} />
      {existing ? <Button label="Remover este perfil" variant="ghost" onPress={remove} /> : null}
    </ScreenContainer>
  );
}

export function Privacy({ navigation }: any) {
  const { palette, colors, type } = useTheme();
  const { state, resetDemo } = useApp();
  const { confirm, toast } = useUI();

  const exportData = () => {
    const data = JSON.stringify(state, null, 2);
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'meus-dados-vita.json';
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      toast('Arquivo com seus dados baixado');
    } else {
      Share.share({ message: data, title: 'Meus dados do Vita' }).catch(() => {});
    }
  };

  const wipe = async () => {
    const ok = await confirm({
      title: 'Apagar todos os dados?',
      message: 'Rotina, filhos, histórico, cupons e conversas serão apagados deste aparelho. Não dá para desfazer.',
      confirmLabel: 'Apagar tudo',
      destructive: true,
    });
    if (ok) {
      resetDemo();
      toast('Dados apagados');
    }
  };

  const Item = ({ title, body }: { title: string; body: string }) => (
    <View style={{ gap: 4 }}>
      <Text style={[type.cardTitle, { color: palette.text, fontSize: 15.5 }]}>{title}</Text>
      <Text style={[type.bodySm, { color: palette.textMuted, lineHeight: 21 }]}>{body}</Text>
    </View>
  );

  return (
    <ScreenContainer edges={['top', 'bottom']} contentStyle={{ paddingHorizontal: 20, paddingTop: 4, gap: 18 }}>
      <BackHeader title="Privacidade (LGPD)" />
      <Item title="O que guardamos" body="Nome, filhos (nome, idade e diagnóstico, se você autorizou), rotina, registros das fases, cupons e conversas com a IA. Neste protótipo, tudo fica só no seu aparelho." />
      <Item title="Para que usamos" body="Só para personalizar o app para a sua família. Não vendemos nem compartilhamos dados com terceiros." />
      <Item title="Conversas com a IA" body="As mensagens são enviadas ao serviço de IA (Google Gemini) apenas para gerar a resposta, junto com o primeiro nome e a idade da criança. Evite escrever documentos, endereços ou telefones." />
      <Item title="Seus direitos" body="Você pode ver, baixar e apagar seus dados a qualquer momento, aqui mesmo." />
      <View style={{ gap: 10, marginTop: 4 }}>
        <Button label="Baixar meus dados" variant="secondary" icon={<Download size={16} color={palette.text} />} onPress={exportData} />
        <Pressable onPress={wipe} accessibilityRole="button" style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, minHeight: 48 }}>
          <Trash2 size={16} color="#9B3D3D" />
          <Text style={[type.bodySm, { color: '#9B3D3D', fontFamily: 'Lexend_500Medium' }]}>Apagar todos os meus dados</Text>
        </Pressable>
      </View>
      <Text style={[type.caption, { color: colors.greyAzure, textAlign: 'center' }]}>Encarregado de dados (fictício): privacidade@vita.app</Text>
    </ScreenContainer>
  );
}

const FAQ = [
  { q: 'O Modo Crise funciona sem internet?', a: 'Sim. O passo a passo, os telefones de emergência e o seu contato de confiança ficam salvos no aparelho.' },
  { q: 'Como troco de filho?', a: 'Toque no nome da criança no topo da Home, da Rotina, das Fases ou da conversa com a IA.' },
  { q: 'Como edito ou apago uma tarefa?', a: 'Na Rotina, toque no nome da tarefa. O quadradinho ao lado serve só para marcar como feita.' },
  { q: 'A IA substitui o terapeuta?', a: 'Não. Ela ajuda a pensar no dia a dia. Diagnóstico, remédios e planos de tratamento são com a equipe que acompanha a criança.' },
  { q: 'O que é o selo "Vita recomenda"?', a: 'Só os lugares que a equipe Vita visitou pessoalmente recebem o selo. Os indicados pela comunidade aparecem separados.' },
  { q: 'O que é o Diário de crises?', a: 'Depois de cada crise, o Vita pergunta em 3 toques o que veio antes, como foi e o que ajudou. Com alguns registros, aparecem padrões — e você pode levar o resumo para o Chat ou para a consulta.' },
  { q: 'Posso usar sem pagar?', a: 'Sim. O plano Base é gratuito para sempre e o Modo Crise nunca fica atrás de um plano.' },
];

export function Help() {
  const { palette, type } = useTheme();
  const { start } = useTour();
  const [open, setOpen] = useState<number | null>(0);
  return (
    <ScreenContainer edges={['top', 'bottom']} contentStyle={{ paddingHorizontal: 20, paddingTop: 4, gap: 12 }}>
      <BackHeader title="Central de ajuda" />
      <Button label="Rever o tour do app" icon={<PlayCircle size={17} color="#fff" />} onPress={start} />
      <Text style={[type.eyebrow, { color: palette.hint, marginTop: 8 }]}>Perguntas frequentes</Text>
      {FAQ.map((f, i) => (
        <Pressable
          key={f.q}
          onPress={() => setOpen(open === i ? null : i)}
          accessibilityRole="button"
          accessibilityState={{ expanded: open === i }}
          style={{ backgroundColor: palette.surface, borderWidth: 1, borderColor: palette.surfaceBorder, borderRadius: 16, padding: 16 }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <Text style={[type.body, { flex: 1, color: palette.text, fontFamily: 'Lexend_500Medium', fontSize: 14 }]}>{f.q}</Text>
            {open === i ? <ChevronUp size={16} color={palette.hint} /> : <ChevronDown size={16} color={palette.hint} />}
          </View>
          {open === i ? <Text style={[type.bodySm, { color: palette.textMuted, marginTop: 8, lineHeight: 21 }]}>{f.a}</Text> : null}
        </Pressable>
      ))}
    </ScreenContainer>
  );
}

export function Support({ navigation }: any) {
  const { palette, type } = useTheme();
  const { state } = useApp();
  const { toast } = useUI();
  const [msg, setMsg] = useState('');
  const [error, setError] = useState<string | null>(null);

  const send = () => {
    if (msg.trim().length < 10) return setError('Conte um pouco mais (mínimo de 10 caracteres)');
    const subject = encodeURIComponent('Suporte Vita');
    const body = encodeURIComponent(`${msg.trim()}\n\n— ${state.parentName}${state.email ? ` (${state.email})` : ''}`);
    Linking.openURL(`mailto:suporte@vita.app?subject=${subject}&body=${body}`).catch(() => {});
    toast('Abrimos seu app de e-mail com a mensagem pronta');
    setMsg('');
    setError(null);
  };

  return (
    <ScreenContainer edges={['top', 'bottom']} contentStyle={{ paddingHorizontal: 20, paddingTop: 4, gap: 16 }}>
      <BackHeader title="Falar com o suporte" />
      <Text style={[type.body, { color: palette.textMuted }]}>Respondemos em até 2 dias úteis. Para dúvidas do dia a dia com a criança, a IA responde na hora.</Text>
      <TextField label="Sua mensagem" value={msg} onChangeText={(v) => { setMsg(v); setError(null); }} multiline placeholder="Descreva o que aconteceu" maxLength={1500} error={error} />
      <Button label="Enviar por e-mail" icon={<Mail size={16} color="#fff" />} onPress={send} />
      <Button label="Conversar com a IA" variant="secondary" icon={<MessageCircle size={16} color={palette.text} />} onPress={() => navigation.getParent()?.navigate('Main', { screen: 'IATab' })} />
    </ScreenContainer>
  );
}
