import axios from 'axios';

export const http = axios.create({
  baseURL: 'https://api.lorettoeletronics.uz:5000',
  timeout: 20000,
});

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

  // backend sizda: Cookie = sessionId (RAW) yoki `sessionId=${sessionId}`
  if (sessionId) config.headers['Cookie'] = sessionId;

  if (userCode) config.headers['userCode'] = userCode;

  return config;
});
