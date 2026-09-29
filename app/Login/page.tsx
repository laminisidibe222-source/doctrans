'use client';
import DoctransLogo from '../components/DoctransLogo';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Lock } from 'lucide-react';
import { supabase } from '../api/utils/supabase';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (authError) throw authError;
      
      // Success — redirect to dashboard
      router.push('/translate');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Erreur de connexion. Vérifiez vos identifiants.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex">
        {/* Left Side - Form */}
        <div className="w-full md:w-1/2 bg-white p-8 md:p-10">
          <Link href="/" className="inline-block mb-6">
            <DoctransLogo size="lg" />
          </Link>

          <h1 className="text-3xl font-bold text-blue-700 mb-8 text-center">SIGN IN</h1>
          
          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg text-center">
                {error}
              </div>
            )}

            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Adresse email"
                required
                className="w-full pl-10 pr-4 py-3 border-b-2 border-gray-200 focus:border-blue-600 outline-none transition bg-transparent"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mot de passe"
                required
                className="w-full pl-10 pr-4 py-3 border-b-2 border-gray-200 focus:border-blue-600 outline-none transition bg-transparent"
              />
            </div>

            <div className="flex items-center justify-between text-sm mt-2">
              <label className="flex items-center gap-2 text-gray-600 cursor-pointer">
                <input type="checkbox" className="accent-blue-600" />
                Se souvenir de moi
              </label>
              <Link href="#" className="text-blue-600 hover:underline">
                Mot de passe oublié ?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 bg-gradient-to-r from-blue-700 to-blue-900 text-white py-3 rounded-lg font-medium hover:opacity-90 transition disabled:opacity-50"
            >
              {loading ? 'Connexion en cours...' : 'Connexion'}
            </button>

            <p className="text-center text-sm text-gray-600 mt-4">
              Pas encore de compte ?{' '}
              <Link href="/signup" className="text-blue-600 font-medium hover:underline">
                S'inscrire
              </Link>
            </p>
          </form>

          <p className="text-xs text-gray-400 text-center mt-10">
            © 2026 Doctrans. Tous droits réservés.
          </p>
        </div>

        {/* Right Side - Decorative */}
        <div className="hidden md:block w-1/2 bg-gradient-to-br from-blue-700 to-indigo-900 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-10 left-10 w-20 h-20 border-2 border-white/40 rounded-full"></div>
            <div className="absolute top-32 right-16 w-16 h-16 border-2 border-white/40 rotate-45"></div>
            <div className="absolute bottom-20 left-20 w-24 h-24 border-2 border-white/40 rounded-full"></div>
            <div className="absolute bottom-10 right-10 w-8 h-8 bg-white/30 rounded-full"></div>
            <div className="absolute top-1/2 left-1/3 w-12 h-12 border-2 border-white/40 rotate-12"></div>
          </div>
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/80 text-center px-6">
            <p className="text-lg font-semibold">Traduisez sans limites</p>
            <p className="text-sm opacity-70">Préservez la mise en forme de vos documents</p>
          </div>
        </div>
      </div>
    </div>
  );
}