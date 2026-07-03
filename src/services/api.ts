import axios from 'axios';
import config from '@/app/config';

const api = axios.create({
  baseURL: `${config.API_BASE_URL}/${config.API_VERSION}`,
  timeout: 10_000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

export default api;