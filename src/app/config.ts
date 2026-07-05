
const config = {

  MOCK_DELAY_MS: 800,

  STORAGE_PREFIX: 'monapp',

  API_VERSION: 'v1',

  // API_BASE_URL: 'http://10.0.2.2:3001/api', // Android émulateur
  API_BASE_URL: 'http://192.168.11.105:3001/api', // Vrai téléphone
} as const;

export default config;
