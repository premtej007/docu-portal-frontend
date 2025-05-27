// src/services/auth.ts
import api from './api';  // your axios instance

export interface LoginPayload {
  username: string;
  password: string;
}

export interface TokenResponse {
  access: string;
  refresh: string;
}

export const loginRequest = (payload: LoginPayload) =>
  api.post<TokenResponse>('/token/', payload)
     .then(res => {
       localStorage.setItem('accessToken', res.data.access);
       return res.data;
     });
