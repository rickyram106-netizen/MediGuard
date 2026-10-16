import { useCallback } from 'react';
import { useAppStore } from '../store/store';
import AuthService, {
  RegisterRequest,
  LoginRequest,
} from '../services/auth/authService';

export function useAuth() {
  const {
    user,
    isAuthLoading,
    authError,
    setUser,
    setAuthLoading,
    setAuthError,
  } = useAppStore();

  const login = useCallback(
    async (request: LoginRequest) => {
      try {
        setAuthError(null);
        setAuthLoading(true);

        const response = await AuthService.login(request);
        const profile = await AuthService.getCurrentUser();

        setUser(profile);
        setAuthLoading(false);

        return response;
      } catch (error: any) {
        setAuthError(error?.message || 'Login failed');
        setAuthLoading(false);
        throw error;
      }
    },
    [setUser, setAuthError, setAuthLoading]
  );

  const register = useCallback(
    async (request: RegisterRequest) => {
      try {
        setAuthError(null);
        setAuthLoading(true);

        const response = await AuthService.register(request);

        setAuthLoading(false);

        return response;
      } catch (error: any) {
        setAuthError(error?.message || 'Registration failed');
        setAuthLoading(false);
        throw error;
      }
    },
    [setAuthError, setAuthLoading]
  );

  const signOut = useCallback(async () => {
    try {
      setAuthLoading(true);
      await AuthService.signOut();
      setUser(null);
      setAuthLoading(false);
    } catch (error: any) {
      setAuthError(error?.message || 'Logout failed');
      setAuthLoading(false);
      throw error;
    }
  }, [setUser, setAuthError, setAuthLoading]);

  return {
    user,
    isLoading: isAuthLoading,
    error: authError,
    login,
    register,
    signOut,
    isAuthenticated: AuthService.isAuthenticated(),
  };
}

export default useAuth;