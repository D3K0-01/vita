export type Task = {
  id: string;
  label: string;
  time: string;
  done: boolean;
};

export const defaultTasks: Task[] = [
  { id: 't1', label: 'escovar os dentes', time: '7h', done: true },
  { id: 't2', label: 'mochila pronta', time: '7h30', done: true },
  { id: 't3', label: 'lição de casa', time: '16h', done: false },
  { id: 't4', label: 'jantar sem tela', time: '19h', done: false },
  { id: 't5', label: 'rotina de dormir', time: '20h30', done: false },
];

export const weekTasks: Record<string, Task[]> = {
  seg: [
    { id: 'w1-1', label: 'escovar os dentes', time: '7h', done: true },
    { id: 'w1-2', label: 'mochila pronta', time: '7h30', done: true },
    { id: 'w1-3', label: 'lição de casa', time: '16h', done: true },
  ],
  ter: defaultTasks,
  qua: [
    { id: 'w3-1', label: 'escovar os dentes', time: '7h', done: false },
    { id: 'w3-2', label: 'mochila pronta', time: '7h30', done: false },
    { id: 'w3-3', label: 'lição de casa', time: '16h', done: false },
    { id: 'w3-4', label: 'jantar sem tela', time: '19h', done: false },
    { id: 'w3-5', label: 'rotina de dormir', time: '20h30', done: false },
  ],
};

export const calmingThings = ['abraço apertado', 'objeto favorito'];

export const trustedContact = {
  name: 'Marina',
  relation: 'irmã(o)',
  phone: '(11) 98765-4321',
};

export const phaseTrack = {
  name: 'Autonomia no dia a dia',
  phaseLabel: 'Fase 2: pequenas escolhas',
  stepIndex: 3,
  stepTotal: 7,
};

export const communityPosts = [
  {
    id: 'p1',
    group: 'Sono e hora de dormir',
    author: 'Renata M.',
    avatar: null,
    title: 'Alguém mais tem dificuldade na troca de pijama?',
    body:
      'Aqui em casa a rotina de dormir trava sempre na troca de roupa. Testamos deixar o pijama escolhido desde a tarde e ajudou um pouco. Como vocês fazem?',
    replies: 14,
    time: '2h',
  },
  {
    id: 'p2',
    group: 'Primeiros passos com rotina',
    author: 'Diego F.',
    avatar: 'diego' as const,
    title: 'Quadro de rotina visual mudou nossa manhã',
    body: 'Depois de 3 semanas usando ícones em vez de texto, as manhãs ficaram bem mais tranquilas por aqui.',
    replies: 8,
    time: '5h',
  },
  {
    id: 'p3',
    group: 'TDAH em casa',
    author: 'Julia',
    avatar: 'julia' as const,
    title: 'Dia difícil hoje, alguém por perto?',
    body: 'Foi um daqueles dias. Só queria dividir com quem entende.',
    replies: 22,
    time: '1d',
  },
];

export const communityGroups = [
  { id: 'g1', name: 'Sono e hora de dormir', members: 1204 },
  { id: 'g2', name: 'Primeiros passos com rotina', members: 2891 },
  { id: 'g3', name: 'TDAH em casa', members: 3407 },
  { id: 'g4', name: 'TEA no dia a dia', members: 1988 },
];

export const article = {
  title: 'Por que "quebras saudáveis" não são falhas',
  source: 'Equipe Vita · leitura de 4 min',
  body:
    'Rotina não é sobre perfeição — é sobre previsibilidade. Quando uma pausa é combinada com antecedência, ela deixa de ser uma falha e vira parte do plano. Isso muda completamente como a criança (e o adulto) se relaciona com o dia.',
};

export const weekProgress = [
  { day: 'seg', value: 1 },
  { day: 'ter', value: 0.8 },
  { day: 'qua', value: 0.6 },
  { day: 'qui', value: 1 },
  { day: 'sex', value: 0.4 },
  { day: 'sáb', value: 0.8 },
  { day: 'dom', value: 0.6 },
];

export const monthProgress = [
  { week: 'sem 1', value: 0.7 },
  { week: 'sem 2', value: 0.85 },
  { week: 'sem 3', value: null }, // pausa
  { week: 'sem 4', value: 0.9 },
];
