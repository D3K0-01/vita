// Conteúdo de exemplo da Comunidade (mockup): grupos, publicações, comentários
// com respostas e encontros. As datas são relativas a "agora".
import { addDays } from '../utils/date';

export type AvatarRef = 'julia' | 'diego' | null;

export type Group = {
  id: string;
  name: string;
  members: number;
  description: string;
  rules: string[];
  moderators: string;
};

export type Post = {
  id: string;
  groupId: string;
  group: string;
  author: string;
  avatar: AvatarRef | 'me';
  body: string;
  likes: number;
  createdAt: string;
  mine?: boolean;
};

/** Comentário ou resposta. `threadId` é o id do post ou do encontro; `parentId` indica resposta. */
export type CommunityComment = {
  id: string;
  threadId: string;
  parentId?: string;
  /** Em respostas a respostas: nome mencionado (@fulano). */
  mention?: string;
  author: string;
  avatar: AvatarRef | 'me';
  text: string;
  createdAt: string;
  likes: number;
  mine?: boolean;
};

export type Meeting = {
  id: string;
  title: string;
  date: string;
  durationMin: number;
  mode: 'online' | 'presencial';
  place: string;
  address?: string;
  coords?: { lat: number; lng: number };
  host: string;
  description: string;
  enrolled: number;
};

const ago = (h: number) => new Date(Date.now() - h * 3600000).toISOString();

export const GROUPS: Group[] = [
  {
    id: 'g1',
    name: 'Sono e hora de dormir',
    members: 1204,
    description: 'Rotinas de dormir, despertares no meio da noite e o cansaço que vem junto. Aqui se troca o que funcionou — e o que não funcionou também.',
    rules: ['Sem julgamento sobre escolhas de cada família', 'Dicas de remédio só com orientação médica', 'Conte o contexto: idade e o que já tentou'],
    moderators: 'Equipe Vita e Renata M.',
  },
  {
    id: 'g2',
    name: 'Primeiros passos com rotina',
    members: 2891,
    description: 'Para quem está começando: quadros visuais, primeiras tarefas, como lidar com os dias em que nada sai como o planejado.',
    rules: ['Toda pergunta é bem-vinda', 'Compartilhe fotos do seu quadro sem mostrar o rosto das crianças', 'Celebre os pequenos avanços dos outros'],
    moderators: 'Equipe Vita e Diego F.',
  },
  {
    id: 'g3',
    name: 'TDAH em casa',
    members: 3407,
    description: 'Atenção, impulsividade, lição de casa e a convivência em família. Para mães, pais e cuidadores de crianças com TDAH (com ou sem laudo).',
    rules: ['Respeito acima de tudo', 'Nada de diagnóstico pela internet', 'Desabafos são bem-vindos — use o aviso "só desabafo" se não quiser conselhos'],
    moderators: 'Equipe Vita',
  },
  {
    id: 'g4',
    name: 'TEA no dia a dia',
    members: 1988,
    description: 'Sensorialidade, comunicação, seletividade alimentar e inclusão. Um espaço para trocar experiências sobre o autismo no cotidiano.',
    rules: ['Linguagem respeitosa com pessoas autistas', 'Sem promessas de "cura"', 'Indicações de profissionais por mensagem privada'],
    moderators: 'Equipe Vita e Marta S.',
  },
  {
    id: 'g5',
    name: 'Escola e inclusão',
    members: 1530,
    description: 'Adaptações curriculares, conversa com a escola, mediadores e direitos. Modelos de carta e experiências reais.',
    rules: ['Não exponha nomes de escolas ou professores', 'Informações legais: cite a fonte', 'Seja gentil com quem está começando'],
    moderators: 'Equipe Vita',
  },
  {
    id: 'g6',
    name: 'Cuidar de quem cuida',
    members: 2260,
    description: 'O espaço de vocês. Cansaço, culpa, pequenas pausas e apoio entre adultos que cuidam.',
    rules: ['Aqui o foco é você, não a criança', 'Sem comparações', 'Em risco, ligue 188 (CVV) ou 192'],
    moderators: 'Equipe Vita e Ana P.',
  },
];

export const getGroup = (id: string) => GROUPS.find((g) => g.id === id);
export const groupByName = (name: string) => GROUPS.find((g) => g.name === name);

const post = (id: string, groupId: string, author: string, avatar: AvatarRef, hoursAgo: number, likes: number, body: string): Post => ({
  id,
  groupId,
  group: getGroup(groupId)!.name,
  author,
  avatar,
  body,
  likes,
  createdAt: ago(hoursAgo),
});

export const POSTS: Post[] = [
  post('p1', 'g1', 'Renata M.', null, 2, 14, 'Aqui em casa a rotina de dormir trava sempre na troca de roupa. Testamos deixar o pijama escolhido desde a tarde e ajudou um pouco. Como vocês fazem?'),
  post('p2', 'g2', 'Diego F.', 'diego', 5, 8, 'Depois de 3 semanas usando ícones em vez de texto, as manhãs ficaram bem mais tranquilas por aqui. O segredo foi deixar o quadro na altura dos olhos dele.'),
  post('p4', 'g4', 'Marta S.', null, 7, 31, 'Primeira vez que conseguimos cortar o cabelo sem choro! Fomos num horário vazio, levamos o abafador e o barbeiro deixou ele segurar a máquina desligada antes. Pequena vitória enorme.'),
  post('p5', 'g5', 'Paulo R.', null, 11, 19, 'Alguém já pediu adaptação de prova na escola particular? Queria saber como vocês fizeram o pedido e se precisou de laudo.'),
  post('p3', 'g3', 'Julia', 'julia', 26, 22, 'Foi um daqueles dias. Só queria dividir com quem entende.'),
  post('p6', 'g6', 'Ana P.', null, 30, 47, 'Lembrete para quem precisa ouvir hoje: tirar 10 minutos pra você não é egoísmo. Hoje tomei um café sozinha, quentinho, pela primeira vez na semana.'),
  post('p7', 'g1', 'Lucas T.', null, 34, 11, 'Meu filho acorda todo dia às 4h e não volta a dormir. Já tentamos cortina blackout e ruído branco. Mais alguém passou por isso?'),
  post('p8', 'g3', 'Fernanda L.', null, 49, 16, 'Dica que funcionou aqui para a lição de casa: timer visual de 15 minutos + 5 de pausa pulando corda. Ele termina mais rápido do que quando ficava 1 hora sentado.'),
  post('p9', 'g4', 'Carla B.', null, 60, 9, 'Ele só come alimentos de uma cor (bege). A nutricionista sugeriu a "ponte de alimentos". Alguém já usou? Como foi?'),
  post('p10', 'g2', 'Beatriz N.', null, 75, 27, 'Fizemos uma "quebra saudável" combinada pela primeira vez: avisamos de manhã que o banho seria depois do jantar. Ele reclamou, mas aceitou. Antes isso virava crise.'),
  post('p11', 'g1', 'Sofia C.', null, 90, 13, 'Luz noturna com timer mudou tudo aqui. Ela apaga sozinha em 30 minutos e ele não acorda mais procurando a luz do corredor.'),
  post('p12', 'g2', 'Rafael O.', null, 100, 6, 'Como vocês lidam com fim de semana? Durante a semana a rotina vai bem, mas sábado e domingo tudo desanda.'),
  post('p13', 'g3', 'Patrícia V.', null, 110, 18, 'A professora mandou bilhete de novo dizendo que ele "não para quieto". Alguém tem um modelo de conversa com a escola que não vire bronca?'),
  post('p14', 'g4', 'Tiago M.', null, 120, 24, 'Começamos a usar pranchas de comunicação (CAA) em casa. Em duas semanas ele pediu água sozinho apontando a figura. Chorei.'),
  post('p15', 'g5', 'Helena S.', null, 130, 15, 'Consegui mediador na escola depois de 4 meses de pedidos. Se alguém precisar, deixo nos comentários o caminho que fiz.'),
  post('p16', 'g5', 'Marcos L.', null, 140, 7, 'A escola quer reduzir a carga horária dele "para adaptar". Isso é permitido? Me parece exclusão disfarçada.'),
  post('p17', 'g6', 'Juliana R.', null, 150, 38, 'Comecei terapia pra mim. Demorei dois anos pra entender que eu também precisava de cuidado. Recomendo de olhos fechados.'),
  post('p18', 'g6', 'Camila T.', null, 160, 21, 'Alguém mais sente culpa quando sai sozinha por uma hora? Como vocês lidam com isso?'),
  post('p19', 'g3', 'André F.', null, 170, 12, 'Usamos uma "caixa de movimento" com bola de pilates e elástico perto da mesa de estudo. Ajuda muito nas pausas.'),
  post('p20', 'g4', 'Luana P.', null, 180, 10, 'Dica de lugar: a biblioteca do bairro tem um horário silencioso às terças de manhã. Ele adorou.'),
];

const c = (
  id: string,
  threadId: string,
  author: string,
  hoursAgo: number,
  likes: number,
  text: string,
  parentId?: string,
  avatar: AvatarRef = null
): CommunityComment => ({ id, threadId, parentId, author, avatar, text, likes, createdAt: ago(hoursAgo) });

export const SEED_COMMENTS: CommunityComment[] = [
  // p1 — pijama
  c('c1', 'p1', 'Diego F.', 1.8, 6, 'Aqui funcionou deixar ele escolher entre dois pijamas. A escolha dá sensação de controle.', undefined, 'diego'),
  c('c2', 'p1', 'Renata M.', 1.6, 2, 'Vou testar com dois! Hoje ele escolheu sozinho e foi mais rápido.', 'c1'),
  c('c3', 'p1', 'Ana P.', 1.5, 3, 'Com a gente o problema era a etiqueta. Cortamos todas e pronto 😅', 'c1'),
  c('c4', 'p1', 'Lucas T.', 1.2, 4, 'Tecido faz muita diferença. Algodão sem costura grossa aqui em casa.'),
  c('c5', 'p1', 'Julia', 0.9, 1, 'Também uso o timer da música: quando acaba a música, pijama vestido.', undefined, 'julia'),
  c('c6', 'p1', 'Renata M.', 0.7, 2, 'Que ideia boa a da música!', 'c5'),
  // p2 — ícones
  c('c7', 'p2', 'Beatriz N.', 4.5, 5, 'Vocês imprimiram ou compraram pronto? Onde acharam os ícones?'),
  c('c8', 'p2', 'Diego F.', 4.2, 3, 'Imprimi e plastifiquei com fita larga. Velcro atrás pra ele tirar quando termina.', 'c7', 'diego'),
  c('c9', 'p2', 'Fernanda L.', 3.8, 2, 'O velcro é genial, ele ver que "acabou" ajuda muito.', 'c7'),
  // p4 — corte de cabelo
  c('c10', 'p4', 'Paulo R.', 6.5, 8, 'Que conquista! Qual barbearia? Aqui é sempre uma batalha.'),
  c('c11', 'p4', 'Marta S.', 6.2, 4, 'Foi no Corte Calmo, tá na aba Parceiros com o selo Vita 💚', 'c10'),
  c('c12', 'p4', 'Carla B.', 5, 6, 'Segurar a máquina desligada antes é uma ótima dica de dessensibilização.'),
  // p5 — escola
  c('c13', 'p5', 'Fernanda L.', 10, 7, 'Fiz por escrito, protocolado, citando a Lei 13.146 (Lei Brasileira de Inclusão). Não precisou de laudo fechado, só relatório da terapeuta.'),
  c('c14', 'p5', 'Paulo R.', 9.5, 2, 'Muito obrigado! Vou pedir o relatório.', 'c13'),
  c('c15', 'p5', 'Marta S.', 9, 3, 'No grupo "Escola e inclusão" tem um modelo de carta fixado.', 'c13'),
  c('c16', 'p5', 'Beatriz N.', 8, 1, 'Pede uma reunião com a coordenação também. Ao vivo costuma andar mais rápido.'),
  // p3 — dia difícil
  c('c17', 'p3', 'Ana P.', 25, 12, 'Tô aqui. Amanhã é outro dia. Você está fazendo o melhor que dá. 💚'),
  c('c18', 'p3', 'Julia', 24, 5, 'Obrigada, de verdade.', 'c17', 'julia'),
  c('c19', 'p3', 'Diego F.', 23, 7, 'Alguns dias a vitória é só chegar ao fim. E você chegou.', undefined, 'diego'),
  // p6 — cuidar de quem cuida
  c('c20', 'p6', 'Renata M.', 29, 9, 'Precisava ler isso hoje. Obrigada, Ana.'),
  c('c21', 'p6', 'Lucas T.', 28, 4, 'Meu momento é a caminhada de 15 min depois que ele dorme.'),
  // p7 — acorda às 4h
  c('c22', 'p7', 'Carla B.', 33, 3, 'Já conversou com o pediatra sobre o horário que ele vai dormir? Aqui, atrasar 30 min ajudou.'),
  c('c23', 'p7', 'Lucas T.', 32, 1, 'Ainda não, vou levar na próxima consulta.', 'c22'),
  // p8 — lição
  c('c24', 'p8', 'Paulo R.', 48, 5, 'Vou testar a corda! Movimento ajuda demais aqui também.'),
  // p9 — alimentação
  c('c25', 'p9', 'Marta S.', 59, 6, 'Usamos! Começamos com batata frita → batata assada → mandioca. Levou uns 2 meses, mas foi.'),
  c('c26', 'p9', 'Carla B.', 58, 2, 'Que animador, obrigada!', 'c25'),
  // p10 — quebra saudável
  c('c27', 'p10', 'Diego F.', 74, 4, 'Avisar de manhã faz toda diferença. Parabéns pela tentativa!', undefined, 'diego'),
  c('c39', 'p11', 'Lucas T.', 89, 3, 'Qual marca? Estamos procurando uma assim.'),
  c('c40', 'p11', 'Sofia C.', 88, 2, 'Comprei numa loja de iluminação, procura por "luminária com timer". Qualquer uma serve!', 'c39'),
  c('c41', 'p12', 'Beatriz N.', 99, 5, 'Fizemos um quadro só de fim de semana, mais solto, mas com os mesmos horários de refeição e sono.'),
  c('c42', 'p12', 'Rafael O.', 98, 1, 'Boa! Manter refeição e sono fixos já deve ajudar.', 'c41'),
  c('c43', 'p13', 'Fernanda L.', 109, 6, 'Peça uma reunião e leve exemplos do que funciona em casa. Muda o tom da conversa: vira parceria.'),
  c('c44', 'p13', 'Paulo R.', 108, 3, 'No grupo Escola e inclusão tem um roteiro de reunião ótimo.'),
  c('c45', 'p14', 'Marta S.', 119, 9, 'Que lindo!! A CAA abre um mundo. 💚'),
  c('c46', 'p14', 'Carla B.', 118, 4, 'Vocês fizeram as figuras ou usaram algum aplicativo?'),
  c('c47', 'p14', 'Tiago M.', 117, 3, 'Começamos com figuras impressas, depois a fono indicou um app.', 'c46'),
  c('c48', 'p15', 'Marcos L.', 139, 4, 'Por favor, conta o caminho! Estou exatamente nessa.'),
  c('c49', 'p15', 'Helena S.', 138, 7, 'Pedido por escrito → resposta em 30 dias → sem resposta, procurei a Secretaria de Educação e a Defensoria. Guarde tudo protocolado.', 'c48'),
  c('c50', 'p16', 'Helena S.', 139, 8, 'Redução de carga só deveria acontecer com acordo da família e plano escrito. Vale buscar orientação na Defensoria.'),
  c('c51', 'p17', 'Ana P.', 149, 11, 'Que bom, Juliana. Cuidar de você também é cuidar dele.'),
  c('c52', 'p18', 'Renata M.', 159, 6, 'Sinto sempre. Hoje penso que volto mais paciente — e isso é bom pra todo mundo.'),
  c('c53', 'p18', 'Camila T.', 158, 2, 'Vou tentar pensar assim. Obrigada.', 'c52'),
  c('c54', 'p19', 'Fernanda L.', 169, 3, 'Elástico na perna da cadeira é genial também!'),
  c('c55', 'p20', 'Sofia C.', 179, 2, 'Qual bairro? Adoraria levar a minha.'),
  // encontros
  c('c28', 'm1', 'Renata M.', 20, 3, 'Vai ficar gravado? Às 20h estou no banho das crianças.'),
  c('c29', 'm1', 'Equipe Vita', 19, 6, 'Vai sim! A gravação fica disponível por 7 dias para quem se inscreveu.', 'c28'),
  c('c30', 'm1', 'Lucas T.', 12, 2, 'Posso levar uma pergunta sobre despertar de madrugada?'),
  c('c31', 'm1', 'Equipe Vita', 11, 3, 'Pode! Deixa ela aqui que a mediadora já separa.', 'c30'),
  c('c32', 'm2', 'Beatriz N.', 30, 4, 'Alguém vai de metrô? Dá pra ir junto da estação Fradique Coutinho.'),
  c('c33', 'm2', 'Fernanda L.', 28, 2, 'Eu vou! Te encontro na saída às 9h40.', 'c32'),
  c('c34', 'm2', 'Diego F.', 26, 5, 'Tem espaço para as crianças? Ou é melhor ir sem?', undefined, 'diego'),
  c('c35', 'm2', 'Equipe Vita', 25, 7, 'Tem uma sala de brincar com recreadoras e luz baixa. Pode levar!', 'c34'),
  c('c36', 'm3', 'Carla B.', 40, 2, 'Vou levar a lista do que ele come hoje, pode ser útil.'),
  c('c37', 'm4', 'Paulo R.', 50, 3, 'Alguém sabe se o parque tem sombra perto do parquinho?'),
  c('c38', 'm4', 'Marta S.', 49, 2, 'Tem sim, perto da entrada do portão 2. E banheiro adaptado.', 'c37'),
];

export function upcomingMeetings(today = new Date()): Meeting[] {
  const at = (days: number, hour: number, min = 0) => {
    const d = addDays(today, days);
    d.setHours(hour, min, 0, 0);
    return d.toISOString();
  };
  return [
    {
      id: 'm1',
      title: 'Roda de conversa: sono',
      date: at(1, 20),
      durationMin: 60,
      mode: 'online',
      place: 'Sala online do Vita (Google Meet)',
      host: 'Mediação: psicóloga Lívia Andrade',
      description: 'Uma conversa aberta sobre rotina de dormir, despertares e o cansaço de quem cuida. Câmera opcional.',
      enrolled: 38,
    },
    {
      id: 'm2',
      title: 'Rotina visual na prática',
      date: at(4, 10),
      durationMin: 90,
      mode: 'presencial',
      place: 'Espaço Maré · sala 2',
      address: 'R. Teodoro Sampaio, 233 · Pinheiros, São Paulo',
      coords: { lat: -23.5547, lng: -46.6713 },
      host: 'Oficina com a terapeuta ocupacional Bruna Lima',
      description: 'Vamos montar juntos um quadro de rotina com figuras. Material incluso. Há sala de brincar com luz baixa para as crianças.',
      enrolled: 24,
    },
    {
      id: 'm3',
      title: 'Seletividade alimentar',
      date: at(9, 20),
      durationMin: 60,
      mode: 'online',
      place: 'Sala online do Vita (Google Meet)',
      host: 'Com a nutricionista Carol Mendes',
      description: 'Como introduzir alimentos novos sem pressão: a "ponte de alimentos" e outras estratégias.',
      enrolled: 21,
    },
    {
      id: 'm4',
      title: 'Piquenique sensorial no parque',
      date: at(12, 15),
      durationMin: 120,
      mode: 'presencial',
      place: 'Parque Villa-Lobos · área do parquinho',
      address: 'Av. Prof. Fonseca Rodrigues, 2001 · Alto de Pinheiros, São Paulo',
      coords: { lat: -23.5465, lng: -46.7213 },
      host: 'Encontro organizado pela comunidade',
      description: 'Traga um lanche e uma toalha. Espaço amplo, sem música alta. Cada família no seu ritmo — dá para chegar e sair quando quiser.',
      enrolled: 33,
    },
  ];
}
