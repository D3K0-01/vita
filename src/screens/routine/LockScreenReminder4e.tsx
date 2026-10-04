import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { X, Camera, Clock } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useTheme } from '../../theme/ThemeProvider';
import { useApp } from '../../state/AppContext';
import { useUI } from '../../components/UIProvider';
import { formatHour, formatLongDate, nowHHMM } from '../../utils/date';

export default function LockScreenReminder4e({ navigation }: any) {
  const { colors, type, radii } = useTheme();
  const { toggleTask, state } = useApp();
  const { toast } = useUI();
  const [now, setNow] = React.useState(new Date());
  React.useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 15000);
    return () => clearInterval(id);
  }, []);
  const upcoming = state.todayTasks.find((t) => !t.done && t.time >= nowHHMM(now)) ?? state.todayTasks.find((t) => !t.done);

  return (
    <LinearGradient colors={['#2E4B52', '#1B2C30', '#243C42']} locations={[0, 0.6, 1]} style={{ flex: 1 }}>
      <Pressable onPress={() => navigation.goBack()} accessibilityLabel="Fechar prévia" style={{ position: 'absolute', top: 44, right: 14, zIndex: 2, width: 48, height: 48, alignItems: 'center', justifyContent: 'center' }}>
        <X size={20} color={colors.offWhite} />
      </Pressable>

      <View style={{ paddingTop: 90, paddingHorizontal: 24, alignItems: 'center' }}>
        <Text style={{ fontFamily: 'Lexend_300Light', fontSize: 14, color: colors.offWhite, opacity: 0.7 }}>{formatLongDate(now)}</Text>
        <Text style={{ fontFamily: 'BricolageGrotesque_500Medium', fontSize: 78, lineHeight: 78, marginTop: 6, letterSpacing: -1.5, color: colors.offWhite }}>{nowHHMM(now)}</Text>
      </View>

      <View style={{ paddingTop: 44, paddingHorizontal: 16 }}>
        <BlurView intensity={40} tint="light" style={{ borderRadius: 22, padding: 18, overflow: 'hidden' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 9 }}>
              <LinearGradient colors={[colors.accent1, colors.accent2]} style={{ width: 20, height: 20, borderRadius: 6 }} />
              <Text style={[type.eyebrow, { color: colors.accent2, fontSize: 10.5 }]}>Vita</Text>
            </View>
            <Text style={{ fontFamily: 'Lexend_300Light', fontSize: 11.5, color: colors.darkAzure, opacity: 0.5 }}>agora</Text>
          </View>
          <Text style={[type.cardTitle, { color: colors.darkAzure, fontSize: 17, lineHeight: 22 }]}>
            {upcoming ? `${formatHour(upcoming.time)}: ${upcoming.label}` : 'Tudo feito por hoje'}
          </Text>
          <Text style={[type.body, { color: colors.darkAzure, fontSize: 13.5, opacity: 0.72, marginTop: 6 }]}>Se hoje não der, tudo bem.</Text>
          <View style={{ flexDirection: 'row', gap: 9, marginTop: 16, paddingTop: 14, borderTopWidth: 1, borderTopColor: 'rgba(46,75,82,.12)' }}>
            <Pressable
              onPress={() => {
                if (upcoming) {
                  toggleTask(upcoming.id);
                  toast(`"${upcoming.label}" marcada como feita`);
                }
                navigation.goBack();
              }}
              style={{ flex: 1, alignItems: 'center', paddingVertical: 11, borderRadius: 14, backgroundColor: colors.darkAzure }}
            >
              <Text style={{ fontFamily: 'Lexend_500Medium', fontSize: 13, color: colors.offWhite }}>marcar como feito</Text>
            </Pressable>
            <Pressable
              onPress={() => {
                toast('Lembrete adiado por 15 minutos (simulação)');
                navigation.goBack();
              }}
              style={{ flex: 1, alignItems: 'center', paddingVertical: 11, borderRadius: 14, borderWidth: 1, borderColor: 'rgba(46,75,82,.18)' }}
            >
              <Text style={{ fontFamily: 'Lexend_400Regular', fontSize: 13, color: colors.darkAzure }}>adiar 15 min</Text>
            </Pressable>
          </View>
        </BlurView>
      </View>

      <View style={{ marginTop: 'auto', paddingHorizontal: 40, paddingBottom: 30, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(242,239,230,.14)', alignItems: 'center', justifyContent: 'center' }}>
          <Camera size={20} color={colors.offWhite} strokeWidth={1.8} />
        </View>
        <View style={{ width: 120, height: 5, borderRadius: 3, backgroundColor: 'rgba(242,239,230,.5)' }} />
        <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(242,239,230,.14)', alignItems: 'center', justifyContent: 'center' }}>
          <Clock size={20} color={colors.offWhite} strokeWidth={1.8} />
        </View>
      </View>
    </LinearGradient>
  );
}
