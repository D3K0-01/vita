# Vita

A React Native (Expo) implementation of the **Vita** design — an app that helps parents/caregivers of neurodivergent kids run a low-pressure daily routine, with a dedicated crisis-support mode and a gentle "small advances" development tracker.

> Previously named NeuroFlow; some files in the original design bundle still use that name.

Built from the Claude Design handoff bundle (`../README.md`, `../chats/`, `../project/`). See that bundle for the full 36-screen visual reference and the design rationale.

## What this is

This is a **clickable prototype**, not a production build:

- All screens are real React Native components (not static mockups) with working navigation, local state, and the interactions described in the design chats.
- Data is mocked and held in-memory / `AsyncStorage` (no backend). The investor-demo path (Onboarding → Home → Rotina → SOS/Modo Crise → Fases) is fully interactive; secondary flows (Comunidade, Configurações, Planos) are navigable but shallow, per the design chat's own recommendation.
- The AI chat and crisis assistant use **scripted responses** — no real LLM is wired in.
- The Planos/checkout screen collects card details for **UI purposes only** — no payment processor is integrated.
- State persists across reloads via `AsyncStorage`, so the demo resumes where it left off (including "you left the crisis flow mid-step" → screen 5e).

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
