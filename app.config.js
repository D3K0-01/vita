// Estende o app.json com valores vindos de variáveis de ambiente.
//  • EXPO_BASE_URL: caminho do site (GitHub Pages usa "/vita"; Vercel usa "").
//  • EXPO_PUBLIC_GOOGLE_MAPS_API_KEY: chave do Google Maps (builds Android).
module.exports = ({ config }) => {
  const baseUrl = process.env.EXPO_BASE_URL ?? config.experiments?.baseUrl ?? '';
  const mapsKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;
  return {
    ...config,
    name: 'Vita',
    experiments: { ...config.experiments, baseUrl },
    android: {
      ...config.android,
      ...(mapsKey ? { config: { ...(config.android?.config ?? {}), googleMaps: { apiKey: mapsKey } } } : {}),
    },
    plugins: [...(config.plugins ?? [])],
  };
};
