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
  /** Grupos exclusivos do Plus/Premium (rodas menores, com mediação). */
  exclusive?: boolean;
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
  /** Selo de apoiador(a) Plus/Premium. */
  supporter?: boolean;
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
  {
    id: 'g7',
    name: 'Roda Plus: especialistas convidados',
    members: 412,
    description: 'Toda semana, uma profissional convidada responde às perguntas das famílias apoiadoras: fonoaudiologia, terapia ocupacional, psicologia e neuropediatria.',
    rules: ['Uma pergunta por família a cada semana', 'As respostas são orientações gerais, não consulta', 'Sem compartilhar laudos ou documentos com dados pessoais'],
    moderators: 'Equipe Vita',
    exclusive: true,
  },
  {
    id: 'g8',
    name: 'Adolescência e novas fases',
    members: 286,
    description: 'Puberdade, autonomia, amizades e a passagem para o ensino médio. Um grupo menor e mediado para famílias de pré-adolescentes e adolescentes.',
    rules: ['Respeite a privacidade dos adolescentes: nada de fotos ou nomes completos', 'Sem julgamento sobre o ritmo de cada um', 'Temas sensíveis com aviso no início do post'],
    moderators: 'Equipe Vita e Lúcia R.',
    exclusive: true,
  },
];

export const getGroup = (id: string) => GROUPS.find((g) => g.id === id);
export const groupByName = (name: string) => GROUPS.find((g) => g.name === name);

const post = (id: string, groupId: string, author: string, avatar: AvatarRef, hoursAgo: number, likes: number, body: string, supporter?: boolean): Post => ({
  id,
  groupId,
  group: getGroup(groupId)!.name,
  author,
  avatar,
  body,
  likes,
  createdAt: ago(hoursAgo),
  supporter,
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
  post('p21', 'g1', 'Bianca A.', null, 3, 29, 'Primeira noite em três semanas que ele dormiu na própria cama a noite inteira! Fizemos a "escada": colchão no quarto dele, depois eu numa cadeira ao lado, depois a cadeira na porta. Paciência compensa.'),
  post('p22', 'g2', 'Gustavo H.', null, 9, 12, 'Dúvida de iniciante: vocês colocam horário exato no quadro ou só a ordem das atividades? Meu filho tem 4 anos e ainda não lê as horas.'),
  post('p27', 'g7', 'Equipe Vita', null, 6, 41, 'Esta semana, a fonoaudióloga Paula Reis responde perguntas sobre comunicação alternativa (CAA): pranchas, aplicativos e como começar em casa. Deixe sua dúvida nos comentários até quinta.'),
  post('p29', 'g8', 'Cláudio M.', null, 12, 17, 'Meu filho de 13 anos quer ir sozinho para a escola. São quatro quadras. Como vocês começaram a dar esse tipo de autonomia?', true),
  post('p23', 'g3', 'Mariana K.', null, 15, 33, 'Desabafo: ouvi de um parente que TDAH é "falta de limite". Respirei fundo e expliquei. Alguém tem um texto curto e confiável para mandar nessas horas?'),
  post('p24', 'g4', 'Roberto C.', null, 20, 19, 'Festas de aniversário: vocês vão? Aqui a gente chega cedo, antes do barulho, e combina um sinal para ir embora. Funcionou muito bem no último fim de semana.'),
  post('p28', 'g7', 'Viviane T.', null, 30, 14, 'Pergunta para a neuropediatra da próxima semana: como saber se é hora de reavaliar a medicação? Ele cresceu bastante este ano e as tardes ficaram mais difíceis.', true),
  post('p25', 'g5', 'Débora F.', null, 40, 22, 'A escola aceitou montar um "cantinho da calma" na sala depois que levamos o relatório da terapeuta ocupacional. Almofada, abafador e um cartão de pausa. Vale tentar!'),
  post('p30', 'g8', 'Lúcia R.', null, 45, 23, 'Conversamos sobre puberdade usando um livro com ilustrações simples e uma lista de "o que é esperado acontecer". Ela ficou bem mais tranquila do que eu imaginava.', true),
  post('p26', 'g6', 'Simone G.', null, 52, 44, 'Montei um "revezamento" com duas mães da escola: cada uma fica com as três crianças um sábado por mês. Ganhei dois sábados livres por mês. Recomendo demais.'),
];

const c = (
  id: string,
  threadId: string,
  author: string,
  hoursAgo: number,
  likes: number,
  text: string,
  parentId?: string,
  avatar: AvatarRef = null,
  mention?: string
): CommunityComment => ({ id, threadId, parentId, mention, author, avatar, text, likes, createdAt: ago(hoursAgo) });

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
  c('c56', 'p20', 'Luana P.', 178, 3, 'Vila Mariana! Chega às 9h que é mais vazio.', 'c55'),
  c('c57', 'p20', 'Tiago M.', 170, 4, 'Aqui o museu de ciências tem "manhã sensorial" no primeiro domingo do mês. Luz mais baixa e sem som nas salas.'),
  // mais conversa nos grupos (exemplos)
  c('c58', 'p3', 'Fernanda L.', 22, 6, 'Passei por isso semana passada. Ajudou deitar 20 minutos no escuro depois que ele dormiu, sem celular. Se cuida. 💚'),
  c('c59', 'p3', 'Julia', 21, 3, 'Vou tentar isso hoje. Obrigada, Fernanda.', 'c58', 'julia'),
  c('c60', 'p3', 'Camila T.', 20, 4, 'Se quiser conversar, o grupo Cuidar de quem cuida tem gente acordada até tarde.'),
  c('c61', 'p6', 'Simone G.', 27, 5, 'Café quente é luxo! Aqui é o banho de 10 minutos com a porta trancada 😂'),
  c('c62', 'p6', 'Ana P.', 26, 3, 'Isso! Pequeno, mas é nosso.', 'c61'),
  c('c63', 'p6', 'Bianca A.', 24, 2, 'Salvando este post para reler nos dias difíceis.'),
  c('c64', 'p7', 'Sofia C.', 31, 4, 'Aqui foi fase. Durou uns dois meses e passou quando ajustamos o horário do jantar (estava muito cedo).'),
  c('c65', 'p7', 'Lucas T.', 30, 2, 'Jantar às 18h aqui. Pode ser isso mesmo!', 'c64'),
  c('c66', 'p7', 'Renata M.', 29, 3, 'Uma caixinha de atividades silenciosas do lado da cama ajudou a gente a ganhar mais uma horinha.', 'c64', null, 'Lucas T.'),
  c('c67', 'p8', 'Patrícia V.', 46, 4, 'Qual timer vocês usam? O do celular distrai mais do que ajuda aqui.'),
  c('c68', 'p8', 'Fernanda L.', 45, 3, 'Um de cozinha, daqueles com o disco vermelho que vai diminuindo. Ele vê o tempo "acabando".', 'c67'),
  c('c69', 'p8', 'André F.', 44, 2, 'Igual aqui! O visual faz toda a diferença.', 'c67', null, 'Fernanda L.'),
  c('c70', 'p9', 'Roberto C.', 57, 3, 'A fono daqui recomendou mudar uma coisa só por vez: mesma comida, outro formato. Depois outra cor. Bem devagar.'),
  c('c71', 'p9', 'Luana P.', 55, 2, 'Aqui funcionou deixar ela "brincar" com a comida nova, sem precisar comer. Tocar já era vitória.'),
  c('c72', 'p10', 'Gustavo H.', 72, 3, 'Que bom ler isso. Vou tentar com a troca do horário do parquinho.'),
  c('c73', 'p10', 'Beatriz N.', 71, 2, 'Avisa de manhã e lembra de novo uma hora antes. Aqui fez diferença.', 'c72'),
  c('c74', 'p12', 'Simone G.', 96, 4, 'Uma dica: fim de semana tem "blocos" em vez de horários. Manhã de casa, tarde de passeio. Dá previsibilidade sem engessar.'),
  c('c75', 'p12', 'Rafael O.', 95, 2, 'Blocos! Muito bom, vou montar assim.', 'c74'),
  c('c76', 'p16', 'Débora F.', 137, 5, 'Aconteceu com uma amiga. Ela pediu por escrito a justificativa pedagógica e a escola voltou atrás.'),
  c('c77', 'p16', 'Marcos L.', 136, 2, 'Vou pedir por escrito então. Obrigado!', 'c76'),
  c('c78', 'p17', 'Mariana K.', 147, 6, 'Também comecei este ano. Mudou até minha paciência em casa.'),
  c('c79', 'p17', 'Juliana R.', 146, 3, 'Exatamente isso! A gente acha que é luxo, mas é necessidade.', 'c78'),
  c('c80', 'p19', 'Patrícia V.', 168, 2, 'Onde comprou o elástico? É aquele de fisioterapia?'),
  c('c81', 'p19', 'André F.', 167, 2, 'Esse mesmo, faixa elástica de exercício. Amarrei nas pernas da frente da cadeira.', 'c80'),
  // p21 — dormir na própria cama
  c('c82', 'p21', 'Lucas T.', 2.8, 5, 'Que vitória! Quanto tempo ficou em cada degrau da escada?'),
  c('c83', 'p21', 'Bianca A.', 2.6, 4, 'Uma semana em cada, mais ou menos. Quando ele estava tranquilo três noites seguidas, a gente avançava.', 'c82'),
  c('c84', 'p21', 'Sofia C.', 2.4, 3, 'Vou fazer exatamente isso. Obrigada por contar o passo a passo!', 'c82', null, 'Bianca A.'),
  c('c85', 'p21', 'Renata M.', 2.1, 6, 'Isso tem nome, né? A psicóloga daqui chamou de "retirada gradual". Funciona mesmo.'),
  c('c86', 'p21', 'Bianca A.', 1.9, 2, 'Isso! Foi ela quem sugeriu aqui também.', 'c85'),
  c('c87', 'p21', 'Equipe Vita', 1.5, 8, 'Que conquista linda, Bianca! Para quem quiser tentar: dá para criar uma tarefa "hora de dormir" na Rotina e registrar como foi cada noite.'),
  // p22 — horário ou ordem
  c('c88', 'p22', 'Diego F.', 8.5, 6, 'Com 4 anos, só a ordem. Aqui usamos "primeiro / depois" e um relógio com cores (verde = pode acordar).', undefined, 'diego'),
  c('c89', 'p22', 'Gustavo H.', 8.2, 2, 'Relógio com cores! Não conhecia.', 'c88'),
  c('c90', 'p22', 'Beatriz N.', 8, 3, 'Coloca o horário pequenininho no cantinho para você, adulto. Ajuda quem cuida a se organizar.', 'c88', null, 'Gustavo H.'),
  c('c91', 'p22', 'Fernanda L.', 7, 4, 'Uma foto real de cada atividade funciona melhor que desenho para os menores.'),
  // p23 — "falta de limite"
  c('c92', 'p23', 'André F.', 14, 9, 'Mando sempre o material da ABDA (Associação Brasileira do Déficit de Atenção). Curto e com fonte.'),
  c('c93', 'p23', 'Mariana K.', 13.5, 3, 'Perfeito, vou procurar. Obrigada!', 'c92'),
  c('c94', 'p23', 'Patrícia V.', 13, 7, 'Minha resposta pronta: "é uma condição do neurodesenvolvimento, com diagnóstico e tratamento. Limite a gente dá, e muito." Encerra a conversa.'),
  c('c95', 'p23', 'Paulo R.', 12, 5, 'Vou roubar essa frase 😅', 'c94'),
  c('c96', 'p23', 'Camila T.', 11, 4, 'Às vezes eu só respondo "você está convidada a passar uma tarde aqui". Ninguém aceita.', 'c94', null, 'Patrícia V.'),
  c('c97', 'p23', 'Mariana K.', 10, 6, 'Vocês são demais. Já me sinto mais leve.'),
  // p24 — festas
  c('c98', 'p24', 'Marta S.', 19, 5, 'Também levamos o abafador e um brinquedo de casa. Ter algo conhecido ajuda muito.'),
  c('c99', 'p24', 'Carla B.', 18, 3, 'Qual é o sinal que vocês combinaram?'),
  c('c100', 'p24', 'Roberto C.', 17.5, 4, 'Ele aperta minha mão três vezes. Sem precisar falar nada na frente de todo mundo.', 'c99'),
  c('c101', 'p24', 'Luana P.', 17, 6, 'Que lindo isso. Vou combinar algo parecido.', 'c99', null, 'Roberto C.'),
  c('c102', 'p24', 'Tiago M.', 16, 2, 'Aqui avisamos os pais do aniversariante antes. Quase sempre eles separam um cantinho mais calmo.'),
  // p25 — cantinho da calma
  c('c103', 'p25', 'Helena S.', 38, 6, 'Que ótimo! Vale pedir que o cantinho seja para toda a turma, não só para ele. Evita rótulo.'),
  c('c104', 'p25', 'Débora F.', 37, 4, 'Foi isso que a professora fez! Virou o cantinho de todo mundo.', 'c103'),
  c('c105', 'p25', 'Patrícia V.', 35, 2, 'Pode compartilhar como foi o pedido? Quero levar na reunião.'),
  c('c106', 'p25', 'Débora F.', 34, 3, 'Levei o relatório e uma lista curta: o que é, por que ajuda, quanto custa (quase nada). Foi rápido.', 'c105'),
  // p26 — revezamento
  c('c107', 'p26', 'Ana P.', 50, 9, 'Simone, que ideia! Rede de apoio que a gente mesma cria.'),
  c('c108', 'p26', 'Camila T.', 49, 4, 'Como vocês combinaram as regras? Fico insegura de deixar com outra pessoa.'),
  c('c109', 'p26', 'Simone G.', 48, 5, 'Começamos com 2 horas e uma folha com o que acalma cada criança. Hoje já é o dia todo.', 'c108'),
  c('c110', 'p26', 'Juliana R.', 46, 3, 'A folha com o que acalma é genial. Dá para usar o "Sobre meu filho" do app pra isso!', 'c108', null, 'Simone G.'),
  // p27 — CAA (Plus)
  c('c111', 'p27', 'Tiago M.', 5.5, 7, 'Pergunta: é verdade que usar prancha atrasa a fala? Ouvi isso de um parente.'),
  c('c112', 'p27', 'Paula Reis (fono)', 5, 15, 'Ótima pergunta, Tiago. Não: os estudos mostram que a CAA não atrapalha a fala e muitas vezes ajuda. Ela dá um jeito de se comunicar agora, enquanto a fala se desenvolve.', 'c111'),
  c('c113', 'p27', 'Tiago M.', 4.8, 4, 'Que alívio. Obrigado!', 'c111', null, 'Paula Reis (fono)'),
  c('c114', 'p27', 'Carla B.', 4, 5, 'Por onde começar em casa? Muitas figuras de uma vez ou poucas?'),
  c('c115', 'p27', 'Paula Reis (fono)', 3.6, 11, 'Poucas! Comece com 3 a 5 figuras de coisas que a criança realmente quer (água, comida favorita, brinquedo). O pedido precisa "funcionar" logo de cara.', 'c114'),
  // p28 — medicação (Plus)
  c('c116', 'p28', 'Equipe Vita', 29, 6, 'Pergunta anotada para a Dra. Renata (neuropediatra) na próxima quinta. Enquanto isso, vale registrar no Acompanhamento como estão as tardes. Ajuda na consulta.'),
  c('c117', 'p28', 'Viviane T.', 28, 2, 'Ótima ideia, vou começar hoje.', 'c116'),
  c('c118', 'p28', 'André F.', 26, 3, 'Aqui o médico reavaliou depois de um estirão de crescimento também. Leve anotações de horários.'),
  // p29 — ir sozinho (adolescência)
  c('c119', 'p29', 'Lúcia R.', 11, 6, 'Fizemos em etapas: primeiro eu ia 10 metros atrás, depois esperava na esquina, depois só mensagem ao chegar.'),
  c('c120', 'p29', 'Cláudio M.', 10.5, 3, 'Gostei das etapas. Quanto tempo levou?', 'c119'),
  c('c121', 'p29', 'Lúcia R.', 10, 4, 'Uns dois meses. E combinamos um "plano B" escrito: o que fazer se algo sair diferente.', 'c119', null, 'Cláudio M.'),
  c('c122', 'p29', 'Viviane T.', 9, 3, 'O plano B escrito é ouro. Aqui ficou num cartão na mochila.'),
  // p30 — puberdade (adolescência)
  c('c123', 'p30', 'Cláudio M.', 44, 4, 'Qual livro vocês usaram? Estamos chegando nessa fase.'),
  c('c124', 'p30', 'Lúcia R.', 43, 3, 'Te mando o nome por mensagem! Mas qualquer um com desenhos simples e linguagem direta serve.', 'c123'),
  c('c125', 'p30', 'Equipe Vita', 40, 5, 'Na Roda Plus de novembro teremos uma psicóloga falando sobre puberdade e autismo. Fiquem de olho!'),
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
