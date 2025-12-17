import axios, { AxiosError } from 'axios';
import type { ApiError } from './types';

export const http = axios.create({
  baseURL: 'https://api.lorettoeletronics.uz:5000',
  timeout: 20000,
});
/* ===================== AUTH HEADERS ===================== */
let sessionId: string | null = null;
let userCode: string | null = null;

export function setAuthHeaders(next: {
  sessionId: string | null;
  userCode: string | null;
}) {
  sessionId = next.sessionId;
  userCode = next.userCode;
}

http.interceptors.request.use(config => {
  config.headers = config.headers ?? {};
  if (sessionId) {
    config.headers['Cookie'] = sessionId;
  }

  if (userCode) {
    config.headers['userCode'] = userCode;
  }

  config.headers['Content-Type'] = 'application/json';

  return config;
});

/* ===================== ERROR NORMALIZER ===================== */

function normalizeError(error: AxiosError<any>): ApiError {
  const data = error.response?.data;

  return {
    code:
      data?.error?.code ?? String(error.response?.status ?? 'NETWORK_ERROR'),
    message:
      data?.error?.message ?? data?.message ?? error.message ?? "Noma'lum xato",
  };
}

http.interceptors.response.use(
  response => response,
  (error: AxiosError<any>) => {
    if (error.response?.status === 401) {
      return Promise.reject(normalizeError(error));
    }

    return Promise.reject(normalizeError(error));
  },
);
