import { apiClient } from './apiClient';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  accessToken: string;
  tokenType: string;
  expiresInMinutes: number;
  user: {
    id: number;
    fullName: string;
    email: string;
  };
}

export const authApi = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    localStorage.setItem('accessToken', response.accessToken);
    localStorage.setItem('apiUser', JSON.stringify(response.user));

    return response;
  },

  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('apiUser');
  },
};