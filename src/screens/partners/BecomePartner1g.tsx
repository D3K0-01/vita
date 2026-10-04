import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, TextInput } from 'react-native';
import { Check, Plus, ChevronDown, Award } from 'lucide-react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { ScreenContainer } from '../../components/ScreenContainer';
import { Button } from '../../components/Button';
import { Chip } from '../../components/Chip';
import { StepProgressHeader } from '../../components/partners/StepProgressHeader';
import { PhotoPlaceholder } from '../../components/partners/PhotoPlaceholder';
import { useApp } from '../../state/AppContext';
import {
  BENEFICIOS,
  CATEGORIAS,
  type AdaptacaoKey,
  type BeneficioTipo,
  type CategoriaKey,
  type Partner,
} from '../../data/partners';

// O que o local diz já oferecer. Vira `adaptacoesKeys` — mas nunca vira selo:
// o "Vita recomenda" só é atribuído pela equipe, depois de visita presencial.
const OFERTAS: { key: AdaptacaoKey; label: string }[] = [
  { key: 'descompressao', label: 'Espaço de descompressão' },
  { key: 'luz_regulavel', label: 'Luz e som reguláveis' },
  { key: 'equipe_treinada', label: 'Equipe com treinamento' },
  { key: 'caa_libras', label: 'Atendimento em Libras ou CAA' },
];

const RESUMO_BENEFICIO: Record<BeneficioTipo, string> = {
  cupom_codigo: 'Cupom',
  desconto_percentual: 'Desconto',
  primeira_gratis: '1ª grátis',
  horario_reservado: 'Horário',
  brinde: 'Brinde',
  so_acessibilidade: 'Acessível',
};

export default function BecomePartner1g({ navigation }: any) {
  const { palette, colors, type, radii, alpha } = useTheme();
  const { addCommunityPartner } = useApp();

  const [step, setStep] = useState(1);
  const [enviado, setEnviado] = useState(false);

  const [nome, setNome] = useState('');
  const [categoria, setCategoria] = useState<CategoriaKey>('festas');
  const [categoriaAberta, setCategoriaAberta] = useState(false);
  const [ofertas, setOfertas] = useState<AdaptacaoKey[]>([]);
  const [beneficio, setBeneficio] = useState<BeneficioTipo>('cupom_codigo');
  const [endereco, setEndereco] = useState('');
  const [bairro, setBairro] = useState('');
  const [telefone, setTelefone] = useState('');
  const [horario, setHorario] = useState('');

  const categoriaLabel = CATEGORIAS.find((c) => c.key === categoria)?.label ?? '';
  const beneficioLabel = BENEFICIOS.find((b) => b.key === beneficio)?.label ?? '';

  const enviar = () => {
    const partner: Partner = {
      id: `novo-${Date.now()}`,
      nome: nome.trim() || 'Local sem nome',
      categoria: categoriaLabel,
      categoriaKey: categoria,
      endereco: endereco.trim() || 'Endereço a confirmar',
      bairro: bairro.trim() || 'São Paulo',
      distanciaKm: 2.5,
      selo: 'comunidade',
      rating: null,
      totalAvaliacoes: 0,
      indicacoes: 1,
      fotos: [{ label: 'Foto 1' }, { label: 'Foto 2' }],
      estimuloSensorial: { ruido: 'medio', luz: 'medio', esperaMin: 10 },
      adaptacoes: [
        ...ofertas.map((k) => ({
          descricao: OFERTAS.find((o) => o.key === k)?.label ?? '',
          status: 'confirmado' as const,
        })),
        {
          descricao: 'Sem visita da equipe Vita — as adaptações ainda não foram confirmadas',
          status: 'atencao' as const,
        },
      ],
      adaptacoesKeys: ofertas,
      tagsRapidas: ofertas.slice(0, 2).map((k) => OFERTAS.find((o) => o.key === k)?.label.toLowerCase() ?? ''),
      beneficio: {
        tipo: beneficio,
        resumo: RESUMO_BENEFICIO[beneficio],
        titulo: beneficioLabel,
        regras: 'Condições a combinar na visita da equipe Vita.',
        codigo: `VITA-${(nome.trim() || 'NOVO').slice(0, 4).toUpperCase()}`,
        validade: 'Sem prazo',
        validadeCurta: 'sem prazo',
      },
      contato: { telefone: telefone.trim(), whatsapp: telefone.replace(/\D/g, '') },
      horarioFuncionamento: horario.trim() || 'A confirmar',
      abertoAgora: true,
      mapa: { x: 0.35, y: 0.35 },
    };
    addCommunityPartner(partner);
    setEnviado(true);
  };

  if (enviado) {
    return (
      <ScreenContainer contentStyle={{ padding: 20, gap: 16, paddingTop: 40 }}>
        <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: colors.pastelGreen, alignItems: 'center', justifyContent: 'center' }}>
          <Check size={30} color={colors.accent2} strokeWidth={3} />
        </View>
        <Text style={[type.title, { fontSize: 26, color: palette.text }]}>Cadastro enviado</Text>
        <Text style={[type.body, { fontSize: 14, lineHeight: 22, color: palette.textMuted }]}>
          O {nome.trim() || 'local'} já aparece na lista como indicado pela comunidade. A equipe Vita entra em contato para
          agendar a visita — o selo só aparece no card depois dela.
        </Text>
        <Button label="Voltar para parceiros" onPress={() => navigation.popToTop()} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer scroll={false}>
      <View style={{ paddingHorizontal: 20, paddingTop: 10, paddingBottom: 14 }}>
        <StepProgressHeader
          step={step}
          total={3}
          title="Seja parceiro"
          onBack={() => (step === 1 ? navigation.goBack() : setStep((s) => s - 1))}
        />
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24, gap: 18 }} showsVerticalScrollIndicator={false}>
        {step === 1 ? (
          <>
            <View>
              <Text style={[type.title, { fontSize: 24, color: palette.text }]}>Seja um parceiro Vita</Text>
              <Text style={[type.bodySm, { fontSize: 13.5, lineHeight: 21, color: palette.textMuted, marginTop: 8 }]}>
                Conte o que seu espaço já faz. Se as adaptações se confirmam numa visita, o selo Vita recomenda aparece no
                seu card.
              </Text>
            </View>

            <View style={{ gap: 10 }}>
              <Text style={[type.eyebrow, { fontSize: 10, color: palette.hint }]}>Nome do local</Text>
              <TextInput
                value={nome}
                onChangeText={setNome}
                placeholder="Buffet Girassol"
                placeholderTextColor={palette.textFaint}
                style={{
                  backgroundColor: palette.surface,
                  borderWidth: 1,
                  borderColor: palette.surfaceBorder,
                  borderRadius: radii.md,
                  paddingVertical: 13,
                  paddingHorizontal: 14,
                  fontFamily: 'Lexend_400Regular',
                  fontSize: 14.5,
                  color: palette.text,
                }}
              />
            </View>

            <View style={{ gap: 10 }}>
              <Text style={[type.eyebrow, { fontSize: 10, color: palette.hint }]}>Categoria</Text>
              <Pressable
                onPress={() => setCategoriaAberta((v) => !v)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: palette.surface,
                  borderWidth: 1,
                  borderColor: palette.surfaceBorder,
                  borderRadius: radii.md,
                  paddingVertical: 13,
                  paddingHorizontal: 14,
                }}
              >
                <Text style={[type.body, { fontSize: 14.5, color: palette.text }]}>{categoriaLabel}</Text>
                <ChevronDown size={17} color={palette.hint} strokeWidth={2} />
              </Pressable>
              {categoriaAberta ? (
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                  {CATEGORIAS.map((c) => (
                    <Chip
                      key={c.key}
                      label={c.label}
                      selected={c.key === categoria}
                      onPress={() => {
                        setCategoria(c.key);
                        setCategoriaAberta(false);
                      }}
                    />
                  ))}
                </View>
              ) : null}
            </View>

            <View style={{ gap: 10 }}>
              <Text style={[type.eyebrow, { fontSize: 10, color: palette.hint }]}>O que vocês já oferecem</Text>
              <View style={{ backgroundColor: palette.surface, borderWidth: 1, borderColor: palette.surfaceBorder, borderRadius: radii.lg, paddingHorizontal: 14 }}>
                {OFERTAS.map((o, i) => {
                  const on = ofertas.includes(o.key);
                  return (
                    <Pressable
                      key={o.key}
                      onPress={() => setOfertas((s) => (on ? s.filter((k) => k !== o.key) : [...s, o.key]))}
                      accessibilityRole="checkbox"
                      accessibilityState={{ checked: on }}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 11,
                        paddingVertical: 12,
                        borderTopWidth: i === 0 ? 0 : 1,
                        borderTopColor: palette.divider,
                      }}
                    >
                      <View
                        style={{
                          width: 22,
                          height: 22,
                          borderRadius: 7,
                          borderWidth: on ? 0 : 1.6,
                          borderColor: palette.chipBorder,
                          backgroundColor: on ? colors.accent1 : 'transparent',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {on ? <Check size={13} color={colors.white} strokeWidth={3} /> : null}
                      </View>
                      <Text style={[type.bodySm, { flex: 1, fontSize: 13.5, color: palette.text }]}>{o.label}</Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            <View style={{ gap: 10 }}>
              <Text style={[type.eyebrow, { fontSize: 10, color: palette.hint }]}>Benefício para as famílias</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                {BENEFICIOS.map((b) => (
                  <Chip key={b.key} label={b.label} selected={b.key === beneficio} onPress={() => setBeneficio(b.key)} />
                ))}
              </View>
            </View>

            <View style={{ gap: 10 }}>
              <Text style={[type.eyebrow, { fontSize: 10, color: palette.hint }]}>Fotos do ambiente</Text>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <PhotoPlaceholder label="Foto 1" height={92} radius={14} style={{ flex: 1 }} />
                <PhotoPlaceholder label="Foto 2" height={92} radius={14} style={{ flex: 1 }} />
                <View
                  style={{
                    flex: 1,
                    height: 92,
                    borderRadius: 14,
                    borderWidth: 1.5,
                    borderStyle: 'dashed',
                    borderColor: palette.chipBorder,
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 4,
                  }}
                >
                  <Plus size={18} color={palette.hint} strokeWidth={2} />
                  <Text style={[type.caption, { fontSize: 11, color: palette.textFaint }]}>adicionar</Text>
                </View>
              </View>
            </View>
          </>
        ) : null}

        {step === 2 ? (
          <>
            <View>
              <Text style={[type.title, { fontSize: 24, color: palette.text }]}>Onde e quando</Text>
              <Text style={[type.bodySm, { fontSize: 13.5, lineHeight: 21, color: palette.textMuted, marginTop: 8 }]}>
                É por aqui que a equipe Vita entra em contato para marcar a visita.
              </Text>
            </View>

            {[
              { label: 'Endereço', value: endereco, set: setEndereco, placeholder: 'R. das Palmeiras, 87' },
              { label: 'Bairro', value: bairro, set: setBairro, placeholder: 'Perdizes' },
              { label: 'Telefone ou WhatsApp', value: telefone, set: setTelefone, placeholder: '(11) 98765-4321' },
              { label: 'Horário de funcionamento', value: horario, set: setHorario, placeholder: 'Terça a sábado, 10h às 18h' },
            ].map((f) => (
              <View key={f.label} style={{ gap: 10 }}>
                <Text style={[type.eyebrow, { fontSize: 10, color: palette.hint }]}>{f.label}</Text>
                <TextInput
                  value={f.value}
                  onChangeText={f.set}
                  placeholder={f.placeholder}
                  placeholderTextColor={palette.textFaint}
                  style={{
                    backgroundColor: palette.surface,
                    borderWidth: 1,
                    borderColor: palette.surfaceBorder,
                    borderRadius: radii.md,
                    paddingVertical: 13,
                    paddingHorizontal: 14,
                    fontFamily: 'Lexend_400Regular',
                    fontSize: 14.5,
                    color: palette.text,
                  }}
                />
              </View>
            ))}
          </>
        ) : null}

        {step === 3 ? (
          <>
            <View>
              <Text style={[type.title, { fontSize: 24, color: palette.text }]}>Conferir e enviar</Text>
              <Text style={[type.bodySm, { fontSize: 13.5, lineHeight: 21, color: palette.textMuted, marginTop: 8 }]}>
                A equipe Vita analisa o cadastro e agenda a visita presencial.
              </Text>
            </View>

            <View style={{ backgroundColor: palette.surface, borderWidth: 1, borderColor: palette.surfaceBorder, borderRadius: radii.xl, paddingHorizontal: 16 }}>
              {[
                { label: 'Local', value: nome.trim() || '—' },
                { label: 'Categoria', value: categoriaLabel },
                { label: 'Adaptações informadas', value: ofertas.length ? `${ofertas.length} selecionadas` : 'nenhuma' },
                { label: 'Benefício', value: beneficioLabel },
                { label: 'Endereço', value: [endereco.trim(), bairro.trim()].filter(Boolean).join(' · ') || '—' },
                { label: 'Contato', value: telefone.trim() || '—' },
                { label: 'Horário', value: horario.trim() || '—' },
              ].map((r, i) => (
                <View
                  key={r.label}
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    gap: 16,
                    paddingVertical: 12,
                    borderTopWidth: i === 0 ? 0 : 1,
                    borderTopColor: palette.divider,
                  }}
                >
                  <Text style={[type.caption, { fontSize: 12, color: palette.textFaint }]}>{r.label}</Text>
                  <Text style={[type.bodySm, { flex: 1, fontSize: 13, color: palette.text, textAlign: 'right' }]}>{r.value}</Text>
                </View>
              ))}
            </View>

            <View style={{ flexDirection: 'row', gap: 12, backgroundColor: alpha(colors.pastelGreen, 0.4), borderRadius: radii.xl, padding: 16 }}>
              <Award size={20} color={colors.accent2} strokeWidth={2} />
              <Text style={[type.bodySm, { flex: 1, fontSize: 12.5, lineHeight: 19, color: palette.text }]}>
                Até a visita acontecer, o local aparece como indicado pela comunidade.
              </Text>
            </View>
          </>
        ) : null}

        <Text style={[type.caption, { fontSize: 11.5, lineHeight: 18, color: palette.textFaint }]}>
          O selo é dado só depois de visita presencial. Sem visita, seu local entra como indicado pela comunidade.
        </Text>
      </ScrollView>

      <View style={{ paddingHorizontal: 20, paddingTop: 12, paddingBottom: 22, borderTopWidth: 1, borderTopColor: palette.divider }}>
        <Button
          label={step === 3 ? 'Enviar para análise' : 'Continuar'}
          disabled={step === 1 && !nome.trim()}
          onPress={() => (step === 3 ? enviar() : setStep((s) => s + 1))}
        />
        {step === 1 && !nome.trim() ? (
          <Text style={[type.caption, { fontSize: 11.5, color: palette.textFaint, textAlign: 'center', marginTop: 8 }]}>
            Comece pelo nome do local.
          </Text>
        ) : null}
      </View>
    </ScreenContainer>
  );
}
