import React, { useState } from 'react';
import { View, Text, Pressable, Platform, Share } from 'react-native';
import { Copy, Lock } from 'lucide-react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { ScreenContainer } from '../../components/ScreenContainer';
import { BackHeader } from '../../components/BackHeader';
import { Button } from '../../components/Button';
import { TextField } from '../../components/TextField';
import { useUI } from '../../components/UIProvider';
import { useApp } from '../../state/AppContext';
import { addDays, formatDayMonth } from '../../utils/date';
import { PLANS, PlanId } from '../../data/plans';

// Protótipo: nenhum pagamento é processado. Os campos só são validados no formato.

const PIX_CODE = '00020126580014BR.GOV.BCB.PIX0136vita-prototipo-sem-cobranca5204000053039865406039.905802BR5904VITA6009SAO PAULO';

function RadioCard({ label, sub, selected, onPress }: { label: string; sub?: string; selected: boolean; onPress: () => void }) {
  const { palette, colors, type, radii } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ checked: selected }}
      style={{ flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: palette.surface, borderWidth: selected ? 1.5 : 1, borderColor: selected ? colors.accent1 : palette.chipBorder, borderRadius: radii.md, padding: 15, minHeight: 52 }}
    >
      <View style={{ width: 18, height: 18, borderRadius: 9, borderWidth: selected ? 5 : 1.5, borderColor: selected ? colors.accent2 : palette.hint, backgroundColor: '#fff' }} />
      <View style={{ flex: 1 }}>
        <Text style={[type.body, { fontSize: 14, color: palette.text }]}>{label}</Text>
        {sub ? <Text style={[type.caption, { fontSize: 11.5, color: palette.textFaint, marginTop: 2 }]}>{sub}</Text> : null}
      </View>
    </Pressable>
  );
}

const onlyDigits = (v: string) => v.replace(/\D/g, '');

function luhn(num: string) {
  let sum = 0;
  let dbl = false;
  for (let i = num.length - 1; i >= 0; i--) {
    let d = Number(num[i]);
    if (dbl) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
    dbl = !dbl;
  }
  return sum % 10 === 0;
}

export default function Checkout10c({ navigation, route }: any) {
  const target: PlanId = route.params?.plan === 'premium' ? 'premium' : 'plus';
  const info = PLANS.find((p) => p.id === target)!;
  const { palette, colors, type } = useTheme();
  const { setState } = useApp();
  const { toast } = useUI();
  const [method, setMethod] = useState<'cartao' | 'pix'>('cartao');
  const [card, setCard] = useState('');
  const [name, setName] = useState('');
  const [exp, setExp] = useState('');
  const [cvv, setCvv] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [confirmed, setConfirmed] = useState(false);
  const trialEnd = addDays(new Date(), 7);

  const confirm = () => {
    if (method === 'cartao') {
      const e: Record<string, string> = {};
      const digits = onlyDigits(card);
      if (digits.length < 13 || !luhn(digits)) e.card = 'Número de cartão inválido';
      if (name.trim().length < 3) e.name = 'Nome como está no cartão';
      const [mm, yy] = exp.split('/').map(Number);
      const now = new Date();
      const expired = !mm || !yy || mm < 1 || mm > 12 || 2000 + yy < now.getFullYear() || (2000 + yy === now.getFullYear() && mm < now.getMonth() + 1);
      if (expired) e.exp = 'Validade inválida';
      if (onlyDigits(cvv).length < 3) e.cvv = 'CVV inválido';
      setErrors(e);
      if (Object.keys(e).length) return;
    }
    setState((s) => ({ ...s, plan: target }));
    setConfirmed(true);
  };

  const copyPix = async () => {
    if (Platform.OS === 'web' && typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(PIX_CODE).catch(() => {});
      toast('Código Pix copiado (fictício)');
    } else {
      Share.share({ message: PIX_CODE }).catch(() => {});
    }
  };

  if (confirmed) {
    return (
      <ScreenContainer edges={['top', 'bottom']} scroll={false} contentStyle={{ alignItems: 'center', justifyContent: 'center', padding: 30, gap: 12 }}>
        <Text style={[type.title, { color: palette.text, fontSize: 26, textAlign: 'center' }]}>Assinatura confirmada</Text>
        <Text style={[type.body, { color: palette.textMuted, fontSize: 14, textAlign: 'center', lineHeight: 22 }]}>
          Seus 7 dias grátis do {info.name} começaram agora. Avisamos 2 dias antes da primeira cobrança, em {formatDayMonth(trialEnd)}.
        </Text>
        {target === 'premium' ? (
          <Button label="Conhecer minha profissional de referência" onPress={() => navigation.getParent()?.navigate('Professional')} style={{ marginTop: 12, alignSelf: 'stretch' }} />
        ) : null}
        <Button label="Voltar para o app" variant={target === 'premium' ? 'ghost' : 'primary'} onPress={() => navigation.getParent()?.goBack()} style={{ marginTop: 12, alignSelf: 'stretch' }} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer edges={['top', 'bottom']} contentStyle={{ paddingHorizontal: 20, paddingTop: 4, gap: 18 }}>
      <BackHeader title="Assinatura" />

      <View style={{ backgroundColor: palette.surface, borderWidth: 1, borderColor: palette.surfaceBorder, borderRadius: 20, padding: 20 }}>
        <View style={{ flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <Text style={[type.title, { color: palette.text, fontSize: 24 }]}>{info.name}</Text>
          <Text style={[type.bodySm, { fontSize: 16, color: palette.text, fontFamily: 'Lexend_500Medium' }]}>{info.price}</Text>
        </View>
        <Text style={[type.body, { color: palette.textMuted, fontSize: 13, marginTop: 10, lineHeight: 21 }]}>
          {info.highlights.join(' · ')}
        </Text>
      </View>

      <View style={{ backgroundColor: colors.pastelGreen, borderRadius: 18, padding: 18 }}>
        <Text style={[type.cardTitle, { color: colors.darkAzure, fontSize: 17 }]}>7 dias grátis</Text>
        <Text style={[type.caption, { color: colors.darkAzure, fontSize: 12.5, opacity: 0.85, marginTop: 5, lineHeight: 19 }]}>Primeira cobrança só em {formatDayMonth(trialEnd)}. Cancela em dois toques.</Text>
      </View>

      <View>
        <Text style={[type.eyebrow, { color: palette.hint, marginBottom: 10 }]}>Forma de pagamento</Text>
        <View style={{ gap: 9 }}>
          <RadioCard label="Cartão de crédito" selected={method === 'cartao'} onPress={() => setMethod('cartao')} />
          <RadioCard label="Pix" sub="renovação manual a cada mês" selected={method === 'pix'} onPress={() => setMethod('pix')} />
        </View>
      </View>

      {method === 'cartao' ? (
        <View style={{ gap: 12 }}>
          <TextField
            label="Número do cartão"
            value={card}
            onChangeText={(v) => setCard(onlyDigits(v).slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 '))}
            keyboardType="number-pad"
            placeholder="0000 0000 0000 0000"
            autoComplete="cc-number"
            error={errors.card}
          />
          <TextField label="Nome no cartão" value={name} onChangeText={setName} autoCapitalize="characters" placeholder="como está impresso" error={errors.name} />
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <View style={{ flex: 1 }}>
              <TextField
                label="Validade"
                value={exp}
                onChangeText={(v) => {
                  const d = onlyDigits(v).slice(0, 4);
                  setExp(d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d);
                }}
                keyboardType="number-pad"
                placeholder="MM/AA"
                error={errors.exp}
              />
            </View>
            <View style={{ flex: 1 }}>
              <TextField label="CVV" value={cvv} onChangeText={(v) => setCvv(onlyDigits(v).slice(0, 4))} keyboardType="number-pad" placeholder="000" password error={errors.cvv} />
            </View>
          </View>
        </View>
      ) : (
        <View style={{ backgroundColor: palette.surface, borderWidth: 1, borderColor: palette.surfaceBorder, borderRadius: 18, padding: 18, gap: 10 }}>
          <Text style={[type.cardTitle, { color: palette.text, fontSize: 15 }]}>Pix copia e cola</Text>
          <Text selectable numberOfLines={2} style={[type.caption, { color: palette.textMuted, fontFamily: 'Lexend_300Light' }]}>
            {PIX_CODE}
          </Text>
          <Button label="Copiar código" variant="secondary" icon={<Copy size={16} color={palette.text} />} onPress={copyPix} />
        </View>
      )}

      <View style={{ gap: 6 }}>
        <Button label={method === 'pix' ? 'Já paguei · ativar teste' : 'Confirmar assinatura'} onPress={confirm} />
        <Button label="Voltar aos planos" variant="ghost" onPress={() => navigation.goBack()} />
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
          <Lock size={12} color={palette.textFaint} />
          <Text style={[type.caption, { color: palette.textFaint, fontSize: 11 }]}>Protótipo: nenhum pagamento é processado. Valores fictícios.</Text>
        </View>
      </View>
    </ScreenContainer>
  );
}
