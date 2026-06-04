import React, { useState } from 'react';
import { Mail, Lock } from 'lucide-react';

interface LoginViewProps {
  onLogin: (email: string) => void;
}

export default function LoginView({ onLogin }: LoginViewProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Loose verification: since the user specified "Không cần ràng buộc" (No constraints),
    // we allow any non-empty input or default admin credentials.
    if (!email.trim()) {
      setError('Please enter your email.');
      return;
    }
    if (!password.trim()) {
      setError('Please enter your password.');
      return;
    }

    setError(null);
    onLogin(email);
  };

  return (
    <div className="min-h-screen w-screen bg-[#d2d6de] flex flex-col items-center justify-center font-sans select-none p-4" id="login-layout">
      {/* Title */}
      <div className="mb-5 text-center">
        <a href="/" className="text-4xl font-light text-[#444444] hover:text-[#444444] transition-colors leading-none tracking-tight block">
          <b>TCA</b> CMS
        </a>
      </div>

      {/* Login Box */}
      <div className="w-full max-w-[360px] bg-white rounded shadow-[0_1px_3px_rgba(0,0,0,0.15)] border border-t-0 border-[#d2d6de]" id="login-box">
        <div className="p-5">
          <p className="text-center text-slate-500 text-sm mb-5">Sign in to start your session</p>

          {error && (
            <div className="mb-4 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email input */}
            <div className="relative">
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full bg-white border border-[#ccc] rounded px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#3c8dbc] transition-colors pr-10"
                id="login-email"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[#777] pointer-events-none">
                <Mail className="w-4.5 h-4.5" />
              </div>
            </div>

            {/* Password input */}
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full bg-white border border-[#ccc] rounded px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#3c8dbc] transition-colors pr-10"
                id="login-password"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[#777] pointer-events-none">
                <Lock className="w-4.5 h-4.5" />
              </div>
            </div>

            {/* Remember Me & Sign In */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  className="rounded border-[#ccc] text-[#3c8dbc] focus:ring-[#3c8dbc] w-4 h-4 cursor-pointer"
                  id="login-remember"
                />
                <span className="text-sm text-[#555]">Remember me</span>
              </label>

              <button
                type="submit"
                className="bg-[#3c8dbc] hover:bg-[#367fa9] text-white font-medium px-4 py-2 rounded text-sm transition-colors cursor-pointer shadow-sm active:bg-[#367fa9] focus:outline-none"
                id="login-submit-btn"
              >
                Sign in
              </button>
            </div>
          </form>

          {/* Links */}
          <div className="mt-4 pt-2 border-t border-slate-100">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                alert('Password reset functionality: Please contact system administrator.');
              }}
              className="text-xs text-[#3c8dbc] hover:underline"
            >
              I forgot my password
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
