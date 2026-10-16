import { apiClient } from '../api/apiClient';
import { UserProfile } from '../../types';

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterResponse {
  message: string;
}

interface LoginResponse {
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

export class AuthService {
  static async register(
    request: RegisterRequest
  ): Promise<RegisterResponse> {
    return apiClient<RegisterResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  static async login(
    request: LoginRequest
  ): Promise<LoginResponse> {
    console.log('[AuthService] Login request:', {
      email: request.email,
      passwordLength: request.password.length,
    });

    const response = await apiClient<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(request),
    });

    console.log('[AuthService] Login response:', {
      message: response.message,
      user: response.user,
      hasToken: Boolean(response.accessToken),
    });

    localStorage.setItem('accessToken', response.accessToken);

    return response;
  }

  static async getCurrentUser(): Promise<UserProfile> {
    const token = localStorage.getItem('accessToken');

    if (!token) {
      throw new Error('No authentication token found');
    }

    const payload = JSON.parse(atob(token.split('.')[1]));

    return {
      uid: String(payload.sub),
      phone: '',
      name: payload.fullName || '',
      email: payload.email || '',
      photoURL: '',
      settings: {
        darkMode: false,
        fontSize: 'normal',
        language: 'en',
        pushAlerts: true,
        sound: true,
        vibrate: true,
        missedRepeat: true,
        voice: true,
      },
      onboarding: {
        done: false,
        problem: null,
        reminderStyle: null,
        fallback: null,
      },
      streak: 0,
      createdAt: new Date(),
    };
  }

  static async signOut(): Promise<void> {
    localStorage.removeItem('accessToken');
  }

  static isAuthenticated(): boolean {
    return Boolean(localStorage.getItem('accessToken'));
  }
}

export default AuthService;