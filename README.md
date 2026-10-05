# Vita

A React Native (Expo) implementation of the **Vita** design — an app that helps parents/caregivers of neurodivergent kids run a low-pressure daily routine, with a dedicated crisis-support mode and a gentle "small advances" development tracker.

> Previously named NeuroFlow; some files in the original design bundle still use that name.

Built from the Claude Design handoff bundle (`../README.md`, `../chats/`, `../project/`). See that bundle for the full 36-screen visual reference and the design rationale.

## What this is

This is a **clickable prototype**, not a production build:

- All screens are real React Native components (not static mockups) with working navigation, local state, and the interactions described in the design chats.
- Data is mocked and held in-memory / `AsyncStorage` (no backend). All flows are interactive, including Comunidade, Configurações and Planos (everything stays on the device).
- The AI chat (tab **IA**) uses a real LLM — **Google Gemini** — through a small serverless function on Vercel (`api/chat.ts`). If the server is not configured or unreachable, the app answers with varied local tips instead of failing (see "Configurar a IA" below).
- The Parceiros map (1e) is a real **Google Maps** map. The partners themselves are still sample data, with the "Vita recomenda" seal (see "Configurar o Google Maps" below).
- The Planos/checkout screen collects card details for **UI purposes only** — no payment processor is integrated.
- State persists across reloads via `AsyncStorage`, so the demo resumes where it left off (including "you left the crisis flow mid-step" → screen 5e).

## Configurar a IA (Gemini + Vercel)

A chave da IA nunca fica dentro do app: ela fica no servidor (Vercel), na função `api/chat.ts`.

1. Crie uma chave gratuita em **https://aistudio.google.com/apikey** (conta Google; o plano gratuito tem limite diário).
2. Em **https://vercel.com/new**, importe o repositório `d3k0-01/vita`. O `vercel.json` já configura tudo: build do site (`expo export -p web`) e a função `/api/chat`.
3. Em *Settings → Environment Variables* do projeto, adicione `GEMINI_API_KEY` com a chave do passo 1 e faça um *Redeploy*.
4. Pronto: o site publicado no Vercel já usa a IA. Para conferir, abra `https://SEU-PROJETO.vercel.app/api/chat`: deve aparecer `{"ok":true,"configured":true}`.
5. (Opcional) Para o GitHub Pages e o app no celular também usarem a IA, coloque o endereço em `DEFAULT_CHAT_API_URL` (`src/config.ts`) ou crie um `.env` com `EXPO_PUBLIC_CHAT_API_URL=https://SEU-PROJETO.vercel.app/api/chat`. Se o site ficar em outro domínio, inclua-o em `ALLOWED_ORIGINS` no Vercel.

Variáveis opcionais no Vercel: `GEMINI_MODEL` (padrão `gemini-flash-latest`, com troca automática para outros modelos Flash) e `ALLOWED_ORIGINS` (sites que podem chamar a função, separados por vírgula).

Sem servidor configurado, o chat continua funcionando com respostas locais (marcadas como "resposta salva no app").

## Configurar o Google Maps

O mapa de Parceiros funciona em dois modos:

- **Sem chave (padrão):** mapa real do Google embutido, com os pinos do Vita posicionados por cima. Dá para tocar nos pinos, dar zoom pelos botões e abrir a rota no Google Maps.
- **Com chave:** mapa interativo completo (arrastar, pinça para zoom) com os pinos do Vita. Crie uma chave da *Maps JavaScript API* no Google Cloud, **restrinja por domínio** (ex.: `*.vercel.app/*`, `d3k0-01.github.io/*`) e defina `EXPO_PUBLIC_GOOGLE_MAPS_API_KEY` no `.env` local ou nas variáveis do Vercel.

No Android/iOS o app usa `react-native-maps` (Google Maps no Android, Apple Maps no iOS). Builds Android próprias (fora do Expo Go) também leem `EXPO_PUBLIC_GOOGLE_MAPS_API_KEY` via `app.config.js`.

## Tech stack

- Expo (React Native 0.86, React 19), TypeScript
- React Navigation (native-stack + bottom-tabs)
- `lucide-react-native` for icons (matches the design's "Lucide" icon spec)
- `@expo-google-fonts/bricolage-grotesque` + `@expo-google-fonts/lexend` for the two brand typefaces
- `expo-linear-gradient` / `expo-blur` for the "Verde de Conquista" gradient accents and the lock-screen blur

## Running it

```bash
npm install
npm run start   # then press i / a / w, or scan the QR code with Expo Go
```

`npm run web` also works for a quick browser preview.

## Revisão (outubro de 2026)

Revisão focada em uso no celular, mantendo a identidade visual (paleta, tipografia e tom):

- **Nada de botão "de enfeite":** todo cartão, link e ícone que parece clicável agora faz algo (avisos, filtros, histórico, editar perfil, curtir/comentar/salvar, entrar em grupos, inscrever em encontros, exportar relatório…).
- **Sem sobreposição:** o SOS flutua fora da rolagem e o conteúdo ganha espaço no fim; o botão de nova tarefa foi para o cabeçalho da Rotina (antes ficava em cima do SOS). Áreas de toque de pelo menos 44px.
- **Dados reais do dia:** datas, semana, saudação e gráficos são calculados a partir da rotina marcada (antes eram fixos em "terça, 12 de agosto").
- **Formulários de verdade:** cadastro, tarefas, contato de confiança, perfil, filhos e pagamento com validação. Diálogos próprios (o `Alert` nativo não funciona no navegador).
- **Novas telas:** boas-vindas, respiração guiada, histórico das trilhas, artigo completo, ajustes de conta, filhos, privacidade (LGPD: baixar/apagar dados), central de ajuda e suporte.
- **Vários filhos:** o seletor no topo troca o filho em Home, Rotina, Fases, Acompanhamento e IA.
- **Acessibilidade:** tamanho do texto, mais contraste, modo escuro e "desligar animações" funcionam e ficam salvos.
- **Diário de crises:** ao sair do Modo Crise, registro em 3 toques (o que veio antes, intensidade/duração, o que ajudou). A tela do diário mostra padrões calculados no aparelho e leva o resumo para o Chat ou para o relatório.
- **Tour guiado:** no primeiro uso, um tour escurece a tela e destaca cada área principal com uma explicação curta (pode pular; dá para rever em Central de ajuda).
- **Comunidade completa:** página de cada publicação com comentários e respostas, páginas de grupo e encontros com local, mapa e dúvidas.
- **Planos Gratuito, Plus e Premium:** regras em `src/data/plans.ts` e permissões em `src/state/usePlan.ts`. Gratuito: até 15 tarefas por filho, 2 trilhas em paralelo, até 20 grupos, 1 filho e resumo semanal. Plus: sem esses limites (2 filhos), acompanhantes, grupos exclusivos com selo, histórico e exportação. Premium: tudo do Plus, até 5 filhos + profissional de referência (mensagens e orientação por vídeo, fictícias). Chat e Modo Crise são ilimitados em todos os planos.
- **Perfil e Configurações separados:** a foto na Home abre o Perfil (conta, filhos, rede de apoio, registros, plano) e a engrenagem abre as Configurações (notificações, acessibilidade, privacidade, ajuda e rever o tour).
- **Conteúdos revisados:** artigos da Equipe Vita em `src/data/articles.ts`, intercalados no feed e salvos no perfil.

## Project structure

```
src/
  theme/        design tokens (colors, type, spacing) from the brand manual + a ThemeProvider (light/dark)
  components/   shared UI: Button, Card, Chip, CheckRow, Switch, SOSButton, ScreenContainer…
  state/        AppContext — mock app state persisted to AsyncStorage
  data/         mock content (tasks, community posts, trusted contact, progress…)
  navigation/   RootNavigator + one navigator per flow
  screens/      one folder per flow: onboarding, home, routine, crisis, phases, partners, community, settings, tracking, plans
```

## Screen map (design id → file)

| Flow | Screens | Location |
|---|---|---|
| 02 Onboarding | 2b–2g | `screens/onboarding/` |
| 03 Home | 3a/3b/3c (one screen, state-driven) | `screens/home/HomeScreen.tsx` |
| 04 Rotina | 4a/4b (tabs), 4d, 4e | `screens/routine/` |
| 05 IA / Modo Crise | 5a–5f | `screens/crisis/` |
| 06 Fases | 6a–6d | `screens/phases/` |
| 01 Parceiros | 1a–1h | `screens/partners/` |
| 07 Comunidade | 7a–7d (tabs) | `screens/community/CommunityScreen.tsx` |
| 08 Configurações | 8a–8c | `screens/settings/` |
| 09 Acompanhamento | 9a/9b | `screens/tracking/TrackingScreen.tsx` |
| 10 Planos | 10a/10b (toggle), 10c | `screens/plans/` |

## Notable interaction details carried over from the design

- The Home check-in ("tranquilo / agitado / difícil") actually reshapes the screen — picking "difícil" collapses Home to the single-task 3c view.
- The floating SOS button opens the crisis triage (5b) directly; if a crisis session was left mid-step, it resumes at 5e instead ("Você tinha aberto o Modo Crise…").
- Accessibility (8c) has a "simular modo offline" demo toggle that switches the crisis step guide to the 5f offline variant (emergency numbers + bolded calming item instead of the illustration/breathing prompt).
- Accessibility (8c) also has a real light/dark toggle — the whole app re-themes, including the crisis flow.
- Parceiros (1a–1h) é um diretório de locais que adaptam de verdade. O selo "Vita recomenda" só existe onde a equipe visitou — cadastros feitos na tela 1g entram sempre como "indicado pela comunidade", em análise, e nada no app promove um local ao selo. Os filtros de 1b são cumulativos, as ressalvas de adaptação usam ícone neutro (são aviso, não erro) e os cupons ficam em `AsyncStorage`, para abrir no balcão sem internet.
- A tela de novo relato (chamada por 1f/1h) e as etapas 2 e 3 do cadastro (1g) não estavam no design original — foram implementadas no padrão do app e estão pendentes de revisão de design.
- "Pequenos Avanços" (6b) draws the phase timeline with the gradient-filled completed step, a highlighted current step, and untouched future steps — no due dates anywhere, matching the "no phase is ever late" principle from the brand manual.
