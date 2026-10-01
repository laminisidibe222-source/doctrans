'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '../api/utils/supabase';
import DoctransLogo from '../components/DoctransLogo';

export default function SignupPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Redirect if already logged in
  useEffect(() => {
    const check = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) router.replace('/translate');
    };
    check();
  }, [router]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } }
      });
      if (error) throw error;
      router.push('/translate');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative shapes */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-br from-blue-600 via-indigo-700 to-indigo-800 rounded-l-[4rem] hidden lg:block" />
      <div className="absolute -top-20 -left-20 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl" />
      <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-indigo-200/30 rounded-full blur-3xl" />

      <div className="w-full max-w-5xl bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden grid lg:grid-cols-2 relative z-10">
        {/* Left — Decorative Side */}
        <div className="hidden lg:flex flex-col justify-center items-center bg-gradient-to-br from-blue-600 via-indigo-700 to-indigo-800 text-white p-8 relative overflow-hidden order-1 lg:order-1">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-10 right-10 w-20 h-20 bg-white rounded-full blur-xl" />
            <div className="absolute bottom-20 left-10 w-32 h-32 bg-white rounded-full blur-xl" />
            <div className="absolute top-1/2 left-1/2 w-40 h-40 bg-white rounded-full blur-xl -translate-x-1/2 -translate-y-1/2" />
          </div>
          <div className="relative z-10 text-center">
            <h2 className="text-2xl font-bold mb-4">Rejoignez-nous !</h2>
            <p className="text-blue-100 max-w-xs">
              Créez votre compte et commencez à traduire vos documents dès aujourd'hui. Rapide, gratuit et sécurisé.
            </p>
          </div>
        </div>

        {/* Right — Form */}
        <div className="p-8 lg:p-12 flex flex-col justify-center order-2 lg:order-2">
          <div className="mb-8">
            <DoctransLogo size="lg" />
            <h1 className="text-3xl font-bold text-gray-900 mt-8">S'inscrire</h1>
            <p className="text-gray-500 mt-2">Créez votre compte Doctrans</p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nom complet</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="Votre nom"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
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
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="Au moins 6 caractères"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-50 shadow-lg mt-2"
            >
              {loading ? 'Création en cours...' : 'Créer mon compte'}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-500">
            Déjà un compte ?{' '}
            <Link href="/Login" className="text-blue-600 font-semibold hover:underline">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}