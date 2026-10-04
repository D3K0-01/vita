// Parceiros — diretório de estabelecimentos que fazem adaptações reais
// para crianças neurodivergentes.
//
// Regra de negócio central: o selo "Vita recomenda" é atribuído MANUALMENTE
// pela equipe, só depois de visita presencial. Nada no app promove um parceiro
// de `comunidade` para `vita_recomenda` — cadastros feitos na tela 1g entram
// sempre como indicados pela comunidade.

export type Selo = 'vita_recomenda' | 'comunidade';

export type NivelEstimulo = 'baixo' | 'medio' | 'alto';

export type CategoriaKey =
  | 'barbearia_salao'
  | 'festas'
  | 'saude'
  | 'lazer'
  | 'escola_terapia'
  | 'restaurantes';

export const CATEGORIAS: { key: CategoriaKey; label: string }[] = [
  { key: 'barbearia_salao', label: 'Barbearia e salão' },
  { key: 'festas', label: 'Festas' },
  { key: 'saude', label: 'Saúde' },
  { key: 'lazer', label: 'Lazer' },
  { key: 'escola_terapia', label: 'Escola e terapia' },
  { key: 'restaurantes', label: 'Restaurantes' },
];

export type AdaptacaoKey =
  | 'ruido_baixo'
  | 'sem_fila'
  | 'luz_regulavel'
  | 'descompressao'
  | 'caa_libras'
  | 'equipe_treinada';

export const ADAPTACOES: { key: AdaptacaoKey; label: string }[] = [
  { key: 'ruido_baixo', label: 'Ruído baixo ou abafador disponível' },
  { key: 'sem_fila', label: 'Sem fila · horário reservado' },
  { key: 'luz_regulavel', label: 'Luz regulável ou baixa' },
  { key: 'descompressao', label: 'Espaço de descompressão' },
  { key: 'caa_libras', label: 'Comunicação alternativa · CAA ou Libras' },
  { key: 'equipe_treinada', label: 'Equipe com treinamento' },
];

export type BeneficioTipo =
  | 'desconto_percentual'
  | 'cupom_codigo'
  | 'primeira_gratis'
  | 'brinde'
  | 'horario_reservado'
  | 'so_acessibilidade';

export const BENEFICIOS: { key: BeneficioTipo; label: string }[] = [
  { key: 'cupom_codigo', label: 'Cupom com código' },
  { key: 'desconto_percentual', label: 'Desconto %' },
  { key: 'primeira_gratis', label: '1ª vez grátis' },
  { key: 'horario_reservado', label: 'Horário reservado' },
  { key: 'brinde', label: 'Brinde' },
  { key: 'so_acessibilidade', label: 'Só acessibilidade' },
];

export type Adaptacao = {
  descricao: string;
  /** `atencao` é ressalva informativa — ajuda a família a decidir, não é erro. */
  status: 'confirmado' | 'atencao';
};

export type Beneficio = {
  tipo: BeneficioTipo;
  /** Texto curto que aparece na tag do card, ex: "20% off". */
  resumo: string;
  titulo: string;
  regras: string;
  /** Prefixo do código gerado no resgate (1d). */
  codigo: string;
  /** Texto completo, mostrado no cupom (1d). */
  validade: string;
  /** Versão curta para a lista de Meus cupons (1h), ex: "vence em 12 dias". */
  validadeCurta: string;
  /** Dica prática mostrada no bloco "Antes de ir" da tela 1d. */
  antesDeIr?: string;
};

export type Partner = {
  id: string;
  nome: string;
  categoria: string;
  categoriaKey: CategoriaKey;
  endereco: string;
  bairro: string;
  distanciaKm: number;
  selo: Selo;
  rating: number | null;
  totalAvaliacoes: number;
  /** Quantas famílias indicaram — usado no lugar do rating nos cards da comunidade. */
  indicacoes?: number;
  fotos: { label: string }[];
  estimuloSensorial: { ruido: NivelEstimulo; luz: NivelEstimulo; esperaMin: number };
  adaptacoes: Adaptacao[];
  adaptacoesKeys: AdaptacaoKey[];
  tagsRapidas: string[];
  beneficio: Beneficio;
  contato: { telefone: string; whatsapp: string };
  horarioFuncionamento: string;
  abertoAgora: boolean;
  testemunhoDestaque?: { texto: string; autor: string; relacao: string; idadeCrianca: number; condicao: string };
  subnotas?: { acolhimento: number; ruidoReal: number; espera: number };
  /** Posição relativa (0–1) usada pelo mapa ilustrado antigo. Mantida por compatibilidade. */
  mapa: { x: number; y: number };
  /** Coordenadas reais aproximadas do endereço de exemplo, usadas no Google Maps (1e). */
  coords?: { lat: number; lng: number };
  /** Cadastros vindos da 1g ficam em análise até a visita da equipe. */
  emAnalise?: boolean;
};

export type Review = {
  id: string;
  partnerId: string;
  autorNome: string;
  relacao: string;
  criancaIdade: number;
  condicao: string;
  rating: number;
  texto: string;
  tags: string[];
  uteisCount: number;
  criadoEm: string;
};

export type Coupon = {
  id: string;
  partnerId: string;
  codigo: string;
  status: 'ativo' | 'usado';
  geradoEm: string;
  validade: string;
  /** O usuário já escreveu relato depois de usar? */
  avaliado: boolean;
};

export type FilterState = {
  buscaTexto: string;
  apenasSeloVita: boolean;
  categorias: CategoriaKey[];
  adaptacoesDesejadas: AdaptacaoKey[];
  estimuloMax: NivelEstimulo;
  distanciaMaxKm: number;
};

export const emptyFilters: FilterState = {
  buscaTexto: '',
  apenasSeloVita: false,
  categorias: [],
  adaptacoesDesejadas: [],
  estimuloMax: 'alto',
  distanciaMaxKm: 20,
};

export const DISTANCIAS = [1, 5, 10, 20];

const NIVEL_ORDEM: Record<NivelEstimulo, number> = { baixo: 0, medio: 1, alto: 2 };

export const partners: Partner[] = [
  {
    id: 'corte-calmo',
    nome: 'Corte Calmo',
    categoria: 'Barbearia',
    categoriaKey: 'barbearia_salao',
    endereco: 'R. Cardeal, 412',
    bairro: 'Pinheiros',
    distanciaKm: 1.2,
    selo: 'vita_recomenda',
    rating: 4.8,
    totalAvaliacoes: 38,
    fotos: [{ label: 'Entrada' }, { label: 'Cadeira' }, { label: 'Espera' }],
    estimuloSensorial: { ruido: 'baixo', luz: 'medio', esperaMin: 5 },
    adaptacoes: [
      { descricao: 'Abafador de ruído e máquina silenciosa disponíveis na casa', status: 'confirmado' },
      { descricao: 'Horário reservado sem outros clientes na sala', status: 'confirmado' },
      { descricao: 'Dois barbeiros com formação em atendimento neurodivergente', status: 'confirmado' },
      { descricao: 'Aceitam prancha de comunicação e apontar em fotos', status: 'confirmado' },
      { descricao: 'Sem sala de descompressão — a rua na frente é movimentada', status: 'atencao' },
    ],
    adaptacoesKeys: ['ruido_baixo', 'sem_fila', 'equipe_treinada', 'caa_libras'],
    tagsRapidas: ['abafador na casa', 'ruído baixo', 'sem fila'],
    beneficio: {
      tipo: 'desconto_percentual',
      resumo: '20% off',
      titulo: '20% no corte infantil',
      regras: 'Vale para atendimento em horário reservado, de terça a quinta. Um uso por mês.',
      codigo: 'VITA-CC20',
      validade: 'Válido até 30 de setembro · um uso',
      validadeCurta: 'vence em 12 dias',
      antesDeIr:
        'Eles pedem para avisar no WhatsApp com um dia de antecedência, para reservar a sala só para vocês. O abafador fica na segunda gaveta — pode pedir na chegada.',
    },
    contato: { telefone: '+551132145566', whatsapp: '5511987654321' },
    horarioFuncionamento: 'Terça a sábado, 9h às 19h',
    abertoAgora: true,
    testemunhoDestaque: {
      texto:
        'O Téo entrou com o abafador dele e o barbeiro deixou ele escolher a cadeira. Primeira vez que saímos sem choro.',
      autor: 'Camila',
      relacao: 'mãe do Téo',
      idadeCrianca: 7,
      condicao: 'TDAH',
    },
    subnotas: { acolhimento: 4.9, ruidoReal: 3.7, espera: 4.5 },
    mapa: { x: 0.44, y: 0.46 },
    coords: { lat: -23.5598, lng: -46.6822 },
  },
  {
    id: 'buffet-girassol',
    nome: 'Buffet Girassol',
    categoria: 'Salão de festas',
    categoriaKey: 'festas',
    endereco: 'R. das Palmeiras, 87',
    bairro: 'Perdizes',
    distanciaKm: 3.4,
    selo: 'vita_recomenda',
    rating: 4.6,
    totalAvaliacoes: 21,
    fotos: [{ label: 'Salão' }, { label: 'Sala calma' }, { label: 'Entrada' }],
    estimuloSensorial: { ruido: 'medio', luz: 'baixo', esperaMin: 10 },
    adaptacoes: [
      { descricao: 'Sala de descompressão com luz baixa, aberta durante toda a festa', status: 'confirmado' },
      { descricao: 'Som e luzes reguláveis — a equipe combina o volume antes de começar', status: 'confirmado' },
      { descricao: 'Equipe orientada a não insistir em participação', status: 'confirmado' },
      { descricao: 'Parabéns pode ser cantado sem palmas, se a família pedir', status: 'confirmado' },
      { descricao: 'O salão é compartilhado nos fins de semana — pode ter outra festa ao lado', status: 'atencao' },
    ],
    adaptacoesKeys: ['descompressao', 'luz_regulavel', 'equipe_treinada'],
    tagsRapidas: ['sala de descompressão', 'luz regulável'],
    beneficio: {
      tipo: 'cupom_codigo',
      resumo: 'Cupom',
      titulo: 'Cupom de festa com sala calma inclusa',
      regras: 'A sala de descompressão entra sem custo no pacote. Reservar com 15 dias de antecedência.',
      codigo: 'VITA-GIR7',
      validade: 'Válido até 31 de dezembro',
      validadeCurta: 'vence em 3 meses',
      antesDeIr: 'Avise no WhatsApp quantas crianças vão usar a sala calma — eles deixam o espaço pronto antes de vocês chegarem.',
    },
    contato: { telefone: '+551138761200', whatsapp: '5511981234567' },
    horarioFuncionamento: 'Todos os dias, 10h às 20h',
    abertoAgora: true,
    subnotas: { acolhimento: 4.7, ruidoReal: 3.9, espera: 4.4 },
    mapa: { x: 0.7, y: 0.26 },
    coords: { lat: -23.5372, lng: -46.6735 },
  },
  {
    id: 'clinica-jacana',
    nome: 'Clínica Jaçanã',
    categoria: 'Odontologia sensorial',
    categoriaKey: 'saude',
    endereco: 'Av. Rebouças, 1.940',
    bairro: 'Pinheiros',
    distanciaKm: 5.0,
    selo: 'vita_recomenda',
    rating: 4.9,
    totalAvaliacoes: 17,
    fotos: [{ label: 'Recepção' }, { label: 'Consultório' }, { label: 'Sala de espera' }],
    estimuloSensorial: { ruido: 'baixo', luz: 'baixo', esperaMin: 0 },
    adaptacoes: [
      { descricao: 'Visita de adaptação antes da consulta, sem procedimento nenhum', status: 'confirmado' },
      { descricao: 'Equipe com formação em odontologia para pacientes neurodivergentes', status: 'confirmado' },
      { descricao: 'Luz do consultório regulável e óculos escuros disponíveis', status: 'confirmado' },
      { descricao: 'Agenda com um paciente por vez — não há sala de espera cheia', status: 'confirmado' },
    ],
    adaptacoesKeys: ['equipe_treinada', 'sem_fila', 'luz_regulavel', 'ruido_baixo'],
    tagsRapidas: ['equipe treinada', 'visita de adaptação'],
    beneficio: {
      tipo: 'primeira_gratis',
      resumo: '1ª grátis',
      titulo: 'Primeira avaliação grátis',
      regras: 'Inclui a visita de adaptação. Uma por criança, com agendamento.',
      codigo: 'VITA-JAC1',
      validade: 'Válido por 2 meses',
      validadeCurta: 'vence em 2 meses',
      antesDeIr: 'Peça a visita de adaptação ao marcar: a criança conhece a cadeira e os instrumentos sem nenhum procedimento.',
    },
    contato: { telefone: '+551130789090', whatsapp: '5511975554433' },
    horarioFuncionamento: 'Segunda a sexta, 8h às 18h',
    abertoAgora: false,
    subnotas: { acolhimento: 5, ruidoReal: 4.6, espera: 4.8 },
    mapa: { x: 0.63, y: 0.83 },
    coords: { lat: -23.5642, lng: -46.6779 },
  },
  {
    id: 'estudio-mare',
    nome: 'Estúdio Maré',
    categoria: 'Salão infantil',
    categoriaKey: 'barbearia_salao',
    endereco: 'R. Teodoro Sampaio, 233',
    bairro: 'Pinheiros',
    distanciaKm: 2.1,
    selo: 'comunidade',
    rating: null,
    totalAvaliacoes: 6,
    indicacoes: 14,
    fotos: [{ label: 'Salão' }, { label: 'Cadeira' }],
    estimuloSensorial: { ruido: 'medio', luz: 'medio', esperaMin: 8 },
    adaptacoes: [
      { descricao: 'Atendimento em Libras com uma das cabeleireiras', status: 'confirmado' },
      { descricao: 'Agendamento com espera curta, segundo as famílias que indicaram', status: 'confirmado' },
      { descricao: 'Sem visita da equipe Vita — as adaptações ainda não foram confirmadas', status: 'atencao' },
    ],
    adaptacoesKeys: ['caa_libras', 'sem_fila'],
    tagsRapidas: ['espera curta', 'Libras'],
    beneficio: {
      tipo: 'brinde',
      resumo: 'Brinde',
      titulo: 'Brinde na primeira visita',
      regras: 'Um brinde por criança, enquanto durar o estoque.',
      codigo: 'VITA-MARE',
      validade: 'Sem prazo',
      validadeCurta: 'sem prazo',
      antesDeIr: 'As famílias que indicaram sugerem ir logo na abertura, quando o salão está mais vazio.',
    },
    contato: { telefone: '+551130112233', whatsapp: '5511970001122' },
    horarioFuncionamento: 'Terça a sábado, 10h às 18h',
    abertoAgora: true,
    mapa: { x: 0.26, y: 0.72 },
    coords: { lat: -23.5547, lng: -46.6713 },
  },
  {
    id: 'cine-aurora',
    nome: 'Cine Aurora',
    categoria: 'Cinema',
    categoriaKey: 'lazer',
    endereco: 'R. Augusta, 2.100',
    bairro: 'Consolação',
    distanciaKm: 4.8,
    selo: 'comunidade',
    rating: null,
    totalAvaliacoes: 4,
    indicacoes: 9,
    fotos: [{ label: 'Sala' }, { label: 'Entrada' }],
    estimuloSensorial: { ruido: 'medio', luz: 'medio', esperaMin: 12 },
    adaptacoes: [
      { descricao: 'Sessão azul quinzenal: som reduzido e luz acesa na sala', status: 'confirmado' },
      { descricao: 'Pode entrar e sair da sala durante o filme', status: 'confirmado' },
      { descricao: 'Fora da sessão azul, o cinema funciona no formato comum', status: 'atencao' },
    ],
    adaptacoesKeys: ['ruido_baixo', 'luz_regulavel'],
    tagsRapidas: ['som reduzido', 'luz acesa'],
    beneficio: {
      tipo: 'horario_reservado',
      resumo: 'Sessão azul',
      titulo: 'Lugar garantido na sessão azul',
      regras: 'Reserva até 2 horas antes da sessão, por criança acompanhada.',
      codigo: 'VITA-AURO',
      validade: 'Sem prazo',
      validadeCurta: 'sem prazo',
      antesDeIr: 'A sessão azul acontece a cada 15 dias, no sábado de manhã — confirme a data antes de sair de casa.',
    },
    contato: { telefone: '+551132550101', whatsapp: '5511966003300' },
    horarioFuncionamento: 'Todos os dias, 13h às 22h',
    abertoAgora: false,
    mapa: { x: 0.8, y: 0.56 },
    coords: { lat: -23.5607, lng: -46.665 },
  },
];

export const partnerReviews: Review[] = [
  {
    id: 'r1',
    partnerId: 'corte-calmo',
    autorNome: 'Camila',
    relacao: 'mãe do Téo',
    criancaIdade: 7,
    condicao: 'TDAH',
    rating: 5,
    texto:
      'Pedimos o horário reservado das 14h. A sala estava vazia e o barbeiro explicou cada passo antes de encostar nele. Levamos o abafador de casa por costume, mas eles têm.',
    tags: ['correu bem', 'horário reservado'],
    uteisCount: 22,
    criadoEm: '3 dias',
  },
  {
    id: 'r2',
    partnerId: 'corte-calmo',
    autorNome: 'Rafael',
    relacao: 'pai da Nina',
    criancaIdade: 5,
    condicao: 'TEA',
    rating: 4,
    texto:
      'Atendimento ótimo, mas a rua na frente é barulhenta e a espera é na calçada. Fomos de manhã e deu certo; à tarde acho que não daria.',
    tags: ['ruído externo', 'ir de manhã'],
    uteisCount: 15,
    criadoEm: '1 semana',
  },
  {
    id: 'r3',
    partnerId: 'corte-calmo',
    autorNome: 'Bianca',
    relacao: 'mãe do Léo',
    criancaIdade: 9,
    condicao: 'Sensibilidade auditiva',
    rating: 5,
    texto:
      'A máquina silenciosa fez diferença de verdade. O Léo usou o abafador só no começo e depois tirou sozinho.',
    tags: ['correu bem', 'máquina silenciosa'],
    uteisCount: 9,
    criadoEm: '2 semanas',
  },
  {
    id: 'r4',
    partnerId: 'buffet-girassol',
    autorNome: 'Tatiana',
    relacao: 'mãe da Alice',
    criancaIdade: 6,
    condicao: 'TEA',
    rating: 5,
    texto:
      'A sala calma salvou a festa. Ela ficou lá metade do tempo e voltou para o parabéns por conta própria.',
    tags: ['sala de descompressão', 'correu bem'],
    uteisCount: 11,
    criadoEm: '5 dias',
  },
];

export function getPartner(id: string, extras: Partner[] = []): Partner | undefined {
  return [...partners, ...extras].find((p) => p.id === id);
}

export function nivelLabel(n: NivelEstimulo): string {
  return n === 'baixo' ? 'baixo' : n === 'medio' ? 'médio' : 'alto';
}

/** 0–1, para as barras de estímulo sensorial (1c). */
export function nivelProgresso(n: NivelEstimulo): number {
  return n === 'baixo' ? 0.25 : n === 'medio' ? 0.55 : 0.9;
}

export function esperaProgresso(min: number): number {
  return Math.max(0.08, Math.min(1, min / 30));
}

/** Filtros cumulativos: todos os critérios ativos são aplicados juntos. */
export function filterPartners(list: Partner[], f: FilterState): Partner[] {
  const busca = f.buscaTexto.trim().toLowerCase();
  return list.filter((p) => {
    if (f.apenasSeloVita && p.selo !== 'vita_recomenda') return false;
    if (f.categorias.length && !f.categorias.includes(p.categoriaKey)) return false;
    if (f.adaptacoesDesejadas.length && !f.adaptacoesDesejadas.every((a) => p.adaptacoesKeys.includes(a))) return false;
    if (p.distanciaKm > f.distanciaMaxKm) return false;
    const estimuloPartner = Math.max(
      NIVEL_ORDEM[p.estimuloSensorial.ruido],
      NIVEL_ORDEM[p.estimuloSensorial.luz]
    );
    if (estimuloPartner > NIVEL_ORDEM[f.estimuloMax]) return false;
    if (busca) {
      const alvo = `${p.nome} ${p.categoria} ${p.bairro} ${p.tagsRapidas.join(' ')}`.toLowerCase();
      if (!alvo.includes(busca)) return false;
    }
    return true;
  });
}

export function countActiveFilters(f: FilterState): number {
  let n = 0;
  if (f.apenasSeloVita) n += 1;
  n += f.categorias.length;
  n += f.adaptacoesDesejadas.length;
  if (f.estimuloMax !== 'alto') n += 1;
  if (f.distanciaMaxKm !== emptyFilters.distanciaMaxKm) n += 1;
  return n;
}

export function formatKm(km: number): string {
  return `${km.toFixed(1).replace('.', ',')} km`;
}

export function formatRating(rating: number): string {
  return rating.toFixed(1).replace('.', ',');
}
