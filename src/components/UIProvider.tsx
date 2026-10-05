import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { View, Text, Pressable, Modal, Animated, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeProvider';
import { TextField } from './TextField';

// Avisos rápidos (toast), confirmações, listas de opções e formulários curtos.
// `Alert.alert` não funciona no navegador, por isso o app usa estes no lugar.

type Choice = { label: string; onPress: () => void; destructive?: boolean; hint?: string };

type PromptField = {
  key: string;
  label: string;
  placeholder?: string;
  initial?: string;
  multiline?: boolean;
  keyboardType?: 'default' | 'number-pad' | 'phone-pad' | 'email-address';
  maxLength?: number;
};

type ConfirmOpts = { title: string; message?: string; confirmLabel?: string; cancelLabel?: string; destructive?: boolean };
type PromptOpts = {
  title: string;
  message?: string;
  fields: PromptField[];
  confirmLabel?: string;
  /** Devolve uma mensagem de erro para impedir o envio. */
  validate?: (values: Record<string, string>) => string | null;
};

type Overlay =
  | { kind: 'confirm'; opts: ConfirmOpts; resolve: (v: boolean) => void }
  | { kind: 'choose'; title?: string; message?: string; choices: Choice[] }
  | { kind: 'prompt'; opts: PromptOpts; resolve: (v: Record<string, string> | null) => void }
  | null;

type Ctx = {
  toast: (msg: string) => void;
  confirm: (opts: ConfirmOpts) => Promise<boolean>;
  choose: (title: string | undefined, choices: Choice[], message?: string) => void;
  prompt: (opts: PromptOpts) => Promise<Record<string, string> | null>;
};

const UICtx = createContext<Ctx | null>(null);

export function UIProvider({ children }: { children: React.ReactNode }) {
  const { palette, colors, type, radii } = useTheme();
  const insets = useSafeAreaInsets();
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const opacity = useRef(new Animated.Value(0)).current;
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [overlay, setOverlay] = useState<Overlay>(null);
  const [values, setValues] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);

  const toast = useCallback(
    (msg: string) => {
      if (timer.current) clearTimeout(timer.current);
      setToastMsg(msg);
      Animated.timing(opacity, { toValue: 1, duration: 160, useNativeDriver: Platform.OS !== 'web' }).start();
      timer.current = setTimeout(() => {
        Animated.timing(opacity, { toValue: 0, duration: 220, useNativeDriver: Platform.OS !== 'web' }).start(() => setToastMsg(null));
      }, 2400);
    },
    [opacity]
  );

  useEffect(() => () => (timer.current ? clearTimeout(timer.current) : undefined), []);

  const confirm = useCallback((opts: ConfirmOpts) => new Promise<boolean>((resolve) => setOverlay({ kind: 'confirm', opts, resolve })), []);
  const choose = useCallback((title: string | undefined, choices: Choice[], message?: string) => setOverlay({ kind: 'choose', title, message, choices }), []);
  const prompt = useCallback(
    (opts: PromptOpts) =>
      new Promise<Record<string, string> | null>((resolve) => {
        setValues(Object.fromEntries(opts.fields.map((f) => [f.key, f.initial ?? ''])));
        setError(null);
        setOverlay({ kind: 'prompt', opts, resolve });
      }),
    []
  );

  const close = () => {
    if (overlay?.kind === 'confirm') overlay.resolve(false);
    if (overlay?.kind === 'prompt') overlay.resolve(null);
    setOverlay(null);
  };

  const submitPrompt = () => {
    if (overlay?.kind !== 'prompt') return;
    const trimmed = Object.fromEntries(Object.entries(values).map(([k, v]) => [k, v.trim()]));
    const err = overlay.opts.validate?.(trimmed) ?? null;
    if (err) {
      setError(err);
      return;
    }
    overlay.resolve(trimmed);
    setOverlay(null);
  };

  const sheetStyle = {
    backgroundColor: palette.bg,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 22,
    paddingTop: 12,
    paddingBottom: Math.max(insets.bottom, 18) + 10,
    gap: 14,
    width: '100%' as const,
    maxWidth: 520,
    alignSelf: 'center' as const,
  };

  const handle = <View style={{ width: 44, height: 5, borderRadius: 3, backgroundColor: palette.chipBorder, alignSelf: 'center', marginBottom: 4 }} />;

  const primaryBtn = (label: string, onPress: () => void, destructive?: boolean) => (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => ({
        backgroundColor: destructive ? '#9B3D3D' : colors.darkAzure,
        borderRadius: radii.pill,
        paddingVertical: 16,
        alignItems: 'center',
        opacity: pressed ? 0.85 : 1,
      })}
    >
      <Text style={[type.button, { color: '#fff' }]}>{label}</Text>
    </Pressable>
  );

  const ghostBtn = (label: string, onPress: () => void) => (
    <Pressable onPress={onPress} accessibilityRole="button" style={({ pressed }) => ({ paddingVertical: 12, alignItems: 'center', opacity: pressed ? 0.5 : 1 })}>
      <Text style={[type.bodySm, { color: palette.textMuted, fontSize: 14 }]}>{label}</Text>
    </Pressable>
  );

  return (
    <UICtx.Provider value={{ toast, confirm, choose, prompt }}>
      {children}

      {toastMsg !== null && (
        <Animated.View
          style={{ pointerEvents: 'none', position: 'absolute', left: 16, right: 16, top: insets.top + 12, alignItems: 'center', opacity, zIndex: 1000 }}
        >
          <View style={{ backgroundColor: colors.darkAzure, borderRadius: 16, paddingVertical: 12, paddingHorizontal: 18, maxWidth: 480, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 12, shadowOffset: { width: 0, height: 6 }, elevation: 8 }}>
            <Text style={[type.bodySm, { color: colors.offWhite, textAlign: 'center' }]}>{toastMsg}</Text>
          </View>
        </Animated.View>
      )}

      <Modal visible={overlay !== null} transparent animationType="fade" onRequestClose={close}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(20,32,36,0.55)' }}>
          <Pressable style={{ flex: 1 }} onPress={close} accessibilityLabel="Fechar" />

          {overlay?.kind === 'confirm' && (
            <View style={sheetStyle}>
              {handle}
              <Text style={[type.titleSm, { color: palette.text }]}>{overlay.opts.title}</Text>
              {overlay.opts.message ? <Text style={[type.body, { color: palette.textMuted }]}>{overlay.opts.message}</Text> : null}
              <View style={{ gap: 4, marginTop: 6 }}>
                {primaryBtn(
                  overlay.opts.confirmLabel ?? 'Confirmar',
                  () => {
                    overlay.resolve(true);
                    setOverlay(null);
                  },
                  overlay.opts.destructive
                )}
                {ghostBtn(overlay.opts.cancelLabel ?? 'Cancelar', close)}
              </View>
            </View>
          )}

          {overlay?.kind === 'choose' && (
            <View style={sheetStyle}>
              {handle}
              {overlay.title ? <Text style={[type.titleSm, { color: palette.text }]}>{overlay.title}</Text> : null}
              {overlay.message ? <Text style={[type.bodySm, { color: palette.textMuted }]}>{overlay.message}</Text> : null}
              <View style={{ backgroundColor: palette.surface, borderRadius: 18, borderWidth: 1, borderColor: palette.surfaceBorder, overflow: 'hidden' }}>
                {overlay.choices.map((c, i) => (
                  <Pressable
                    key={`${i}-${c.label}`}
                    accessibilityRole="button"
                    onPress={() => {
                      setOverlay(null);
                      c.onPress();
                    }}
                    style={({ pressed }) => ({
                      paddingVertical: 16,
                      paddingHorizontal: 18,
                      borderTopWidth: i === 0 ? 0 : 1,
                      borderTopColor: palette.divider,
                      backgroundColor: pressed ? palette.chipSelectedBg : 'transparent',
                    })}
                  >
                    <Text style={[type.body, { color: c.destructive ? '#9B3D3D' : palette.text }]}>{c.label}</Text>
                    {c.hint ? <Text style={[type.caption, { color: palette.textFaint, marginTop: 2 }]}>{c.hint}</Text> : null}
                  </Pressable>
                ))}
              </View>
              {ghostBtn('Cancelar', close)}
            </View>
          )}

          {overlay?.kind === 'prompt' && (
            <View style={[sheetStyle, { maxHeight: '90%' }]}>
              {handle}
              <Text style={[type.titleSm, { color: palette.text }]}>{overlay.opts.title}</Text>
              {overlay.opts.message ? <Text style={[type.bodySm, { color: palette.textMuted }]}>{overlay.opts.message}</Text> : null}
              <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ gap: 14 }} style={{ flexGrow: 0 }}>
                {overlay.opts.fields.map((f, i) => (
                  <TextField
                    key={f.key}
                    label={f.label}
                    value={values[f.key] ?? ''}
                    onChangeText={(v) => {
                      setValues((s) => ({ ...s, [f.key]: v }));
                      setError(null);
                    }}
                    placeholder={f.placeholder}
                    multiline={f.multiline}
                    keyboardType={f.keyboardType}
                    maxLength={f.maxLength}
                    autoFocus={i === 0}
                    onSubmitEditing={f.multiline ? undefined : submitPrompt}
                  />
                ))}
              </ScrollView>
              {error ? <Text style={[type.caption, { color: '#9B3D3D' }]}>{error}</Text> : null}
              <View style={{ gap: 4 }}>
                {primaryBtn(overlay.opts.confirmLabel ?? 'Salvar', submitPrompt)}
                {ghostBtn('Cancelar', close)}
              </View>
            </View>
          )}
        </KeyboardAvoidingView>
      </Modal>
    </UICtx.Provider>
  );
}

export function useUI() {
  const ctx = useContext(UICtx);
  if (!ctx) throw new Error('useUI must be used within UIProvider');
  return ctx;
}
