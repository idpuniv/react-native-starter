import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import config from '@/app/config';

// ─── Instance ─────────────────────────────────────────────────────────────────

const api: AxiosInstance = axios.create({
  baseURL: `${config.API_BASE_URL}/${config.API_VERSION}`,
  timeout: 10_000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

export default api;
