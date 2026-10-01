'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '../api/utils/supabase';
import DoctransLogo from '../components/DoctransLogo';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;
    
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!cancelled) {
        if (session) {
          // Already logged in — redirect
          router.replace('/translate');
        } else {
          // No session — show form
          setCheckingSession(false);
        }
      }
    };

    checkSession();
    return () => { cancelled = true; };
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      if (error) throw error;
      router.push('/translate');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (checkingSession) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Vérification...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-700 hidden lg:block" />
      <div className="absolute -top-20 -left-20 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl" />
      <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-indigo-200/30 rounded-full blur-3xl" />

      <div className="w-full max-w-5xl bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden grid lg:grid-cols-2 relative z-10">
        <div className="p-8 lg:p-12 flex flex-col justify-center">
          <DoctransLogo size="lg" />
          <h1 className="text-3xl font-bold text-gray-900 mt-8 mb-2">Connexion</h1>
          <p className="text-gray-500 mb-8">Accédez à votre espace de traduction</p>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="vous@exemple.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mot de passe</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-50"
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-500">
            Pas encore de compte ?{' '}
            <Link href="/signup" className="text-blue-600 font-semibold hover:underline">
              S'inscrire
            </Link>
          </p>
        </div>

        <div className="hidden lg:flex flex-col justify-center items-center bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-700 text-white p-8">
          <h2 className="text-2xl font-bold mb-4">Bienvenue sur Doctrans ✨</h2>
          <p className="text-blue-100 text-center max-w-xs">
            Traduisez vos documents en toute simplicité. La mise en forme est préservée, la qualité est professionnelle.
          </p>
        </div>
      </div>
    </div>
  );
}