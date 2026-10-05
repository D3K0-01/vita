// Conteúdos revisados da Equipe Vita que aparecem no feed da Comunidade.
// Linguagem simples, sem promessas, e sempre lembrando que não substituem
// o acompanhamento profissional. Revisoras fictícias (protótipo).
import type { ImageSourcePropType } from 'react-native';
import { articleCover } from './images';

export type ArticleCta = { label: string; route: string; params?: Record<string, unknown> };

export type VitaArticle = {
  id: string;
  title: string;
  source: string;
  reviewedBy: string;
  /** Resumo que aparece no cartão do feed. */
  body: string;
  full: string[];
  /** Pontos para lembrar, no fim do artigo. */
  takeaways?: string[];
  cover: ImageSourcePropType | null;
  /** Cores do degradê quando não há foto de capa. */
  gradient: [string, string];
  likes: number;
  cta?: ArticleCta;
};

export const ARTICLES: VitaArticle[] = [
  {
    id: 'article-quebras',
    title: 'Por que "quebras saudáveis" não são falhas',
    source: 'Equipe Vita · leitura de 4 min',
    reviewedBy: 'Revisado por Bruna Lima, terapeuta ocupacional',
    body:
      'Rotina não é sobre perfeição — é sobre previsibilidade. Quando uma pausa é combinada com antecedência, ela deixa de ser uma falha e vira parte do plano. Isso muda completamente como a criança (e o adulto) se relaciona com o dia.',
    full: [
      'Rotina não é sobre perfeição — é sobre previsibilidade. Para muitas crianças neurodivergentes, saber o que vem depois reduz a ansiedade e libera energia para o resto do dia.',
      'Só que a vida real muda: um compromisso atrasa, a avó chega de surpresa, a chuva cancela o parquinho. Quando toda mudança vira "quebra da rotina", cada imprevisto parece um fracasso — para a criança e para quem cuida.',
      'A ideia das quebras saudáveis é inverter isso. Uma pequena variação, combinada com antecedência, vira parte do plano. "Hoje o banho vai ser 20 minutos mais tarde" dito de manhã é muito diferente de uma mudança anunciada na hora.',
      'Comece pequeno: uma variação por semana, de baixo impacto, sempre avisada antes. Use o mesmo apoio visual da rotina. Com o tempo, a flexibilidade também vira hábito.',
      'E se der errado? Tudo bem. A rotina continua ali no dia seguinte — e a tentativa conta.',
    ],
    takeaways: ['Avise a mudança com antecedência', 'Uma variação pequena por semana', 'Use o mesmo apoio visual da rotina'],
    cover: articleCover,
    gradient: ['#C7D6BF', '#7FA0AC'],
    likes: 34,
    cta: { label: 'Programar uma quebra na Rotina', route: 'Main', params: { screen: 'RotinaTab' } },
  },
  {
    id: 'article-transicoes',
    title: 'Transições sem briga: o aviso antes e o "primeiro, depois"',
    source: 'Equipe Vita · leitura de 5 min',
    reviewedBy: 'Revisado por Bruna Lima, terapeuta ocupacional',
    body:
      'Desligar a TV, sair do parquinho, ir para o banho: para muitas crianças com TEA ou TDAH, o difícil não é a atividade, é a troca. Duas ferramentas simples ajudam a deixar essa troca previsível.',
    full: [
      'Desligar a TV, sair do parquinho, ir para o banho. Para muitas crianças com TEA ou TDAH, o difícil não é a próxima atividade em si, e sim o momento da troca. Parar algo prazeroso sem aviso é como ter a página arrancada no meio da leitura.',
      'A primeira ferramenta é o aviso antes. Avise com alguns minutos de antecedência, sempre com a mesma frase ("faltam 5 minutos para o banho") e, se possível, com um apoio visual: um timer que mostra o tempo acabando funciona melhor do que só a fala, porque a criança vê o fim chegando.',
      'A segunda é o "primeiro, depois". Mostre duas figuras ou fotos lado a lado: primeiro o banho, depois a história. A criança entende que a atividade de que gosta não acabou para sempre, só ficou para o passo seguinte.',
      'Ofereça uma escolha pequena dentro da transição: "quer ir pulando ou andando de costas até o banheiro?". A escolha devolve um pouco de controle sem mudar o combinado.',
      'Se mesmo assim vier choro ou recusa, mantenha o combinado com calma e menos palavras. Não é preciso explicar de novo: valide ("é chato parar, eu sei") e siga. A consistência ao longo dos dias é o que ensina.',
      'Cada criança responde de um jeito. Se as transições estiverem muito difíceis, vale conversar com a terapeuta que acompanha vocês para ajustar as estratégias.',
    ],
    takeaways: ['Mesmo aviso, mesma frase, alguns minutos antes', 'Timer visual: a criança vê o tempo acabando', '"Primeiro, depois" com figuras', 'Menos palavras na hora difícil'],
    cover: null,
    gradient: ['#E6D9B8', '#C7D6BF'],
    likes: 52,
    cta: { label: 'Criar uma tarefa com lembrete', route: 'NewTask4d' },
  },
  {
    id: 'article-depois-da-crise',
    title: 'Depois da crise: quando conversar (e quando ainda não)',
    source: 'Equipe Vita · leitura de 4 min',
    reviewedBy: 'Revisado por Lívia Andrade, psicóloga',
    body:
      'No meio de uma crise, o cérebro está em modo de proteção e explicações não chegam. O que ajuda depende do momento: antes, durante e depois. Um guia curto para cada fase.',
    full: [
      'Uma crise não é birra nem manipulação. É um momento em que a criança perdeu, por um tempo, a capacidade de se regular. Nessa hora, o corpo está em modo de proteção, e argumentos, sermões ou perguntas não são processados.',
      'Durante: menos é mais. Diminua estímulos (luz, barulho, pessoas em volta), fale pouco e com voz baixa, garanta a segurança e fique por perto se a criança aceitar. Sua calma empresta regulação: é o que os profissionais chamam de corregulação.',
      'Logo depois: ainda não é hora de conversar sobre o que aconteceu. Ofereça água, um lugar tranquilo, um objeto de conforto. Reconecte com gestos simples, sem cobrança. Se a criança quiser ficar sozinha, respeite.',
      'Mais tarde, com todos calmos (às vezes só no dia seguinte), converse de forma curta e concreta: o que sentiu, o que pode ajudar da próxima vez. Desenhos e figuras ajudam quem tem dificuldade com palavras.',
      'E anote. Registrar o que veio antes, quanto tempo durou e o que ajudou mostra padrões que passam despercebidos no dia a dia — e é um material valioso para levar à terapeuta.',
      'Se as crises forem frequentes, muito intensas ou envolverem risco, procure a equipe de saúde que acompanha a criança. Em emergência, ligue 192.',
    ],
    takeaways: ['Durante: segurança, poucos estímulos, poucas palavras', 'Logo depois: conforto, sem cobrança', 'Mais tarde: conversa curta e concreta', 'Registrar ajuda a ver padrões'],
    cover: null,
    gradient: ['#7FA0AC', '#2E4B52'],
    likes: 61,
    cta: { label: 'Abrir o diário de crises', route: 'CrisisDiary' },
  },
  {
    id: 'article-sono',
    title: 'Sono: o que realmente ajuda na rotina de dormir',
    source: 'Equipe Vita · leitura de 5 min',
    reviewedBy: 'Revisado por Lívia Andrade, psicóloga',
    body:
      'Dificuldades para dormir são muito comuns em crianças com TEA e TDAH — e cansam a família inteira. Ajustes simples e constantes costumam fazer mais diferença do que grandes mudanças.',
    full: [
      'Dificuldades para pegar no sono, despertares no meio da noite e acordar muito cedo são frequentes em crianças com TEA e TDAH. Não é falta de limite, e você não está sozinha(o) nisso.',
      'Horários parecidos todos os dias, inclusive nos fins de semana, ajudam o relógio interno. Uma variação de até meia hora costuma ser bem tolerada.',
      'Crie uma sequência curta e sempre igual antes de dormir — por exemplo: banho, pijama, escovar os dentes, uma história, luz apagada. O apoio visual com as etapas deixa a sequência previsível.',
      'Telas (TV, tablet, celular) estimulam e a luz delas atrapalha o sono. O ideal é desligá-las cerca de uma hora antes de deitar, trocando por atividades calmas.',
      'Observe o quarto com os olhos da criança: luz que entra pela janela, barulhos, a textura do pijama ou do lençol. Pequenos ajustes sensoriais podem resolver muito.',
      'Suplementos e remédios para dormir, como a melatonina, só com orientação médica. Se o sono continuar muito difícil, leve suas anotações ao pediatra ou neuropediatra.',
    ],
    takeaways: ['Horários parecidos, inclusive no fim de semana', 'Sequência curta e sempre igual', 'Telas desligadas cerca de 1h antes', 'Remédios só com orientação médica'],
    cover: null,
    gradient: ['#2E4B52', '#7FA0AC'],
    likes: 47,
    cta: { label: 'Ver o grupo "Sono e hora de dormir"', route: 'GroupDetail', params: { groupId: 'g1' } },
  },
];

export const getArticle = (id?: string) => ARTICLES.find((a) => a.id === id) ?? ARTICLES[0];
export const isArticleId = (id: string) => id.startsWith('article-');
