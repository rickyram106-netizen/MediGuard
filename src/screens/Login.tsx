import React, { useState, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/ui/Button';
import { ArrowLeft, Mail, CheckCircle, AlertTriangle } from 'lucide-react';

interface Props {
  onBack: () => void;
}

const Login = ({ onBack }: Props) => {
  const {
    login,
    error: authError,
    isLoading,
  } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const isBusy = loading || isLoading;

  const handleLogin = useCallback(async () => {
    if (!email.trim() || !password || isBusy) return;

    setLoading(true);
    setLocalError(null);

    try {
      await login({
        email: email.trim(),
        password,
      });
    } catch (e: any) {
      console.error('[Login] Login failed:', e);
      setLocalError(
        e?.message || 'Invalid email or password'
      );
    } finally {
      setLoading(false);
    }
  }, [email, password, isBusy, login]);

  return (
    <div className="min-h-screen flex flex-col">
      <div className="p-6">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 text-[color:var(--muted)] font-semibold"
        >
          <ArrowLeft size={20} />
          Back
        </button>

        <div className="mt-8">
          <h1 className="text-2xl font-bold">Sign In</h1>
          <p className="text-[color:var(--muted)] mt-2">
            Enter your email and password to continue
          </p>
        </div>
      </div>

      <div className="p-6 flex-1">
        <label className="label-text mt-0">Email Address</label>

        <div className="flex">
          <span className="bg-teal-light text-teal-dark rounded-l-xl px-4 py-3 text-[length:var(--flg)] font-bold border-2 border-[color:var(--border)] border-r-0">
            <Mail size={20} />
          </span>

          <input
            className="input-field rounded-l-none"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setLocalError(null);
            }}
            autoComplete="email"
          />
        </div>

        <label className="label-text mt-6">Password</label>

        <input
          className="input-field"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setLocalError(null);
          }}
          autoComplete="current-password"
        />

        {(localError || authError) && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2 text-xs text-red-600 font-medium">
            <AlertTriangle size={14} className="shrink-0 mt-0.5" />
            <span>{localError || authError}</span>
          </div>
        )}

        <Button
          className="mt-6"
          disabled={!email.trim() || !password || isBusy}
          onClick={handleLogin}
        >
          {isBusy ? (
            <span className="animate-spin text-xl">⏳</span>
          ) : (
            <>
              <CheckCircle size={20} />
              Sign In
            </>
          )}
        </Button>

        <div className="mt-auto pt-8">
          <p className="text-center text-[color:var(--muted)] text-[11px] leading-relaxed">
            By continuing you agree to our Terms of Service.
            <br />
            Your account is securely authenticated.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;