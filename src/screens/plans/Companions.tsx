import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Lock, UserPlus, Trash2, Users } from 'lucide-react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { ScreenContainer } from '../../components/ScreenContainer';
import { BackHeader } from '../../components/BackHeader';
import { Button } from '../../components/Button';
import { useUI } from '../../components/UIProvider';
import { useApp } from '../../state/AppContext';
import { usePlan } from '../../state/usePlan';

// Plus: acompanhantes (outro responsável, avó, babá, terapeuta) veem a rotina
// do dia e marcam tarefas. No protótipo, o convite é só registrado no app.

export default function Companions({ navigation }: any) {
  const { palette, colors, type } = useTheme();
  const { state, setState } = useApp();
  const { prompt, confirm, toast } = useUI();
  const { hasCompanions } = usePlan();

  const invite = async () => {
    const v = await prompt({
      title: 'Convidar acompanhante',
      message: `A pessoa vê a rotina de ${state.childName} e pode marcar tarefas. Não vê o diário nem o Chat.`,
      fields: [
        { key: 'name', label: 'Nome', placeholder: 'ex.: Vó Marta' },
        { key: 'email', label: 'E-mail', placeholder: 'para enviar o convite', keyboardType: 'email-address' },
        { key: 'relation', label: 'Quem é', placeholder: 'avó, babá, terapeuta…' },
      ],
      confirmLabel: 'Enviar convite',
      validate: (x) => (x.name.trim().length < 2 ? 'Escreva o nome' : !/^\S+@\S+\.\S+$/.test(x.email.trim()) ? 'E-mail inválido' : null),
    });
    if (!v) return;
    setState((s) => ({ ...s, companions: [...s.companions, { id: `cp${Date.now()}`, name: v.name.trim(), email: v.email.trim(), relation: v.relation.trim() || 'acompanhante' }] }));
    toast(`Convite enviado para ${v.name.trim()} (protótipo)`);
  };

  const remove = async (id: string, name: string) => {
    if (await confirm({ title: `Remover ${name}?`, message: 'A pessoa deixa de ver a rotina na hora.', confirmLabel: 'Remover', destructive: true })) {
      setState((s) => ({ ...s, companions: s.companions.filter((c) => c.id !== id) }));
      toast('Acompanhante removido(a)');
    }
  };

  return (
    <ScreenContainer edges={['top', 'bottom']} contentStyle={{ paddingHorizontal: 20, paddingTop: 4, gap: 16 }}>
      <BackHeader title="Acompanhantes" />
      <Text style={[type.body, { color: palette.textMuted, fontSize: 13.5, lineHeight: 21, marginTop: -6 }]}>
        Divida a rotina com quem também cuida: a pessoa vê as tarefas do dia e marca o que foi feito.
      </Text>

      {!hasCompanions ? (
        <View style={{ backgroundColor: colors.darkAzure, borderRadius: 22, padding: 20, gap: 10 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Lock size={15} color={colors.offWhite} />
            <Text style={[type.eyebrow, { color: colors.offWhite, opacity: 0.8 }]}>Plus e Premium</Text>
          </View>
          <Text style={[type.titleSm, { color: colors.offWhite, fontSize: 21 }]}>Acompanhantes fazem parte do Plus</Text>
          <Text style={[type.bodySm, { color: colors.offWhite, opacity: 0.85, lineHeight: 20 }]}>
            Junto com tarefas ilimitadas, todas as trilhas e o histórico completo.
          </Text>
          <Button label="Conhecer o Plus" onPress={() => navigation.navigate('PlansStack')} style={{ marginTop: 6 }} />
        </View>
      ) : (
        <>
          {state.companions.length === 0 ? (
            <View style={{ alignItems: 'center', gap: 8, paddingVertical: 24 }}>
              <Users size={30} color={palette.hint} />
              <Text style={[type.bodySm, { color: palette.textMuted, textAlign: 'center' }]}>Ninguém convidado ainda.</Text>
            </View>
          ) : (
            <View style={{ gap: 10 }}>
              {state.companions.map((c) => (
                <View key={c.id} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: palette.surface, borderWidth: 1, borderColor: palette.surfaceBorder, borderRadius: 16, padding: 14 }}>
                  <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: colors.pastelGreen, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontFamily: 'BricolageGrotesque_600SemiBold', fontSize: 16, color: colors.darkAzure }}>{c.name[0]?.toUpperCase()}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[type.cardTitle, { color: palette.text, fontSize: 15 }]}>{c.name}</Text>
                    <Text style={[type.caption, { color: palette.textMuted, fontSize: 12 }]} numberOfLines={1}>
                      {c.relation} · {c.email} · convite enviado
                    </Text>
                  </View>
                  <Pressable onPress={() => remove(c.id, c.name)} accessibilityRole="button" accessibilityLabel={`Remover ${c.name}`} style={{ width: 44, height: 44, alignItems: 'center', justifyContent: 'center', marginRight: -8 }}>
                    <Trash2 size={17} color={palette.textFaint} />
                  </Pressable>
                </View>
              ))}
            </View>
          )}
          <Button label="Convidar acompanhante" icon={<UserPlus size={17} color={colors.offWhite} />} onPress={invite} />
        </>
      )}
    </ScreenContainer>
  );
}
