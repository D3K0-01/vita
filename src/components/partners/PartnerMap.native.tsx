// Mapa de Parceiros — Android/iOS. Usa react-native-maps: Google Maps no
// Android e Apple Maps no iOS (o Google no iOS exige configuração nativa extra).
// Para builds Android fora do Expo Go, defina EXPO_PUBLIC_GOOGLE_MAPS_API_KEY
// (lida em app.config.js).
import React, { useEffect, useRef } from 'react';
import { View, Text, Platform } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { useTheme } from '../../theme/ThemeProvider';
import { partnerCoords, DEFAULT_CENTER } from '../../utils/geo';
import type { PartnerMapProps } from './PartnerMap';

export type { PartnerMapProps };

export function PartnerMap({ partners, selectedId, onSelect, user }: PartnerMapProps) {
  const { colors, palette } = useTheme();
  const ref = useRef<MapView>(null);
  const selected = partners.find((p) => p.id === selectedId) ?? partners[0];
  const start = selected ? partnerCoords(selected) : DEFAULT_CENTER;

  useEffect(() => {
    if (!selected) return;
    const c = partnerCoords(selected);
    ref.current?.animateToRegion({ latitude: c.lat, longitude: c.lng, latitudeDelta: 0.03, longitudeDelta: 0.03 }, 350);
  }, [selected?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <MapView
      ref={ref}
      style={{ flex: 1 }}
      provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
      initialRegion={{ latitude: start.lat, longitude: start.lng, latitudeDelta: 0.04, longitudeDelta: 0.04 }}
      toolbarEnabled={false}
      showsPointsOfInterests={false}
    >
      {user && <Marker coordinate={{ latitude: user.lat, longitude: user.lng }} title="Você está aqui" pinColor={colors.greyAzure} />}
      {partners.map((p) => {
        const c = partnerCoords(p);
        const on = p.id === selectedId;
        const vita = p.selo === 'vita_recomenda';
        return (
          <Marker
            key={`${p.id}-${on}`}
            coordinate={{ latitude: c.lat, longitude: c.lng }}
            onPress={() => onSelect(p.id)}
            anchor={{ x: 0.5, y: 1 }}
            zIndex={on ? 10 : 1}
            tracksViewChanges={false}
          >
            <View style={{ alignItems: 'center' }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 5,
                  paddingVertical: 6,
                  paddingHorizontal: 10,
                  borderRadius: 16,
                  backgroundColor: on ? colors.darkAzure : '#fff',
                  borderWidth: 1,
                  borderColor: on ? colors.darkAzure : palette.chipBorder,
                }}
              >
                {vita ? (
                  <View style={{ width: 16, height: 16, borderRadius: 8, backgroundColor: colors.accent2, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ color: '#fff', fontSize: 10 }}>✓</Text>
                  </View>
                ) : (
                  <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: colors.greyAzure }} />
                )}
                <Text style={{ fontFamily: 'Lexend_600SemiBold', fontSize: 11.5, color: on ? '#fff' : colors.darkAzure }}>
                  {on ? `${p.beneficio.resumo} · ${p.nome}` : p.beneficio.resumo}
                </Text>
              </View>
              <View style={{ width: 0, height: 0, borderLeftWidth: 6, borderRightWidth: 6, borderTopWidth: 7, borderLeftColor: 'transparent', borderRightColor: 'transparent', borderTopColor: on ? colors.darkAzure : '#fff' }} />
            </View>
          </Marker>
        );
      })}
    </MapView>
  );
}
