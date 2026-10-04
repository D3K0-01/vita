// Passo a passo do Modo Crise (5c). Funciona offline: nada aqui depende de rede.
// `{calma}` é trocado pelo que acalma a criança (cadastrado no onboarding).

export type CrisisStep = { title: string; tips: string[] };

export const CRISIS_STEPS: Record<'sensorial' | 'emocional', CrisisStep[]> = {
  sensorial: [
    { title: 'Diminua os estímulos', tips: ['Baixe a luz e desligue sons e telas.', 'Se puder, leve para um lugar mais quieto.', 'Ofereça o abafador, se tiver um por perto.'] },
    { title: 'Fique perto, falando pouco', tips: ['Fale baixo, devagar e com poucas palavras.', 'Avise antes de tocar — ou não toque.', 'Fique na altura da criança, sem pressa.'] },
    { title: 'Ofereça conforto', tips: ['Ofereça {calma}.', 'Um canto calmo ou um cobertor podem ajudar.', 'Deixe a criança escolher, sem insistir.'] },
    { title: 'Espere a onda passar', tips: ['Não peça explicações agora.', 'Ofereça água quando ela aceitar.', 'Retome o dia devagar, sem cobranças.'] },
  ],
  emocional: [
    { title: 'Garanta a segurança', tips: ['Afaste objetos que possam machucar.', 'Mantenha uma distância segura e visível.', 'Respire fundo antes de falar.'] },
    { title: 'Valide sem negociar', tips: ['"Você está muito bravo. Eu estou aqui."', 'Evite sermão e perguntas agora.', 'Poucas palavras, tom calmo.'] },
    { title: 'Ajude a regular', tips: ['Respire junto, de forma que ela veja.', 'Ofereça {calma}.', 'Conte devagar até dez, em voz baixa.'] },
    { title: 'Reconecte', tips: ['Quando acalmar, ofereça água e colo — ou espaço.', 'Nada de castigo no calor do momento.', 'Conversar sobre o que houve fica para depois.'] },
  ],
};
