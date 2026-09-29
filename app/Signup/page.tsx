'use client';

import { useState } from 'react';
import Link from 'next/link';
import { User, Mail, Lock, ArrowRight } from 'lucide-react';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }

    // Get existing users or start fresh
    const users = JSON.parse(localStorage.getItem('doctrans_users') || '[]');
    
    // Check if email already exists
    if (users.find((u: any) => u.email === email)) {
      setError('Cet email est déjà utilisé. Veuillez vous connecter.');
      return;
    }

    // Add new user
    const newUser = { name, email, password, createdAt: new Date().toISOString() };
    users.push(newUser);
    localStorage.setItem('doctrans_users', JSON.stringify(users));
    
    // Auto-login
    localStorage.setItem('doctrans_user', JSON.stringify(newUser));
    setSuccess(true);
    
    // Redirect after 1.5s
    setTimeout(() => {
      window.location.href = '/translate';
    }, 1500);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 to-white flex items-center justify-center p-4">
        <div className="bg-white p-10 rounded-3xl shadow-2xl text-center max-w-md">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Compte créé !</h2>
          <p className="text-gray-600">Redirection en cours...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex">
        {/* Left Side - Decorative */}
        <div className="hidden md:block w-1/2 bg-gradient-to-br from-blue-700 to-indigo-900 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-10 left-10 w-20 h-20 border-2 border-white/40 rounded-full"></div>
            <div className="absolute top-32 right-16 w-16 h-16 border-2 border-white/40 rotate-45"></div>
            <div className="absolute bottom-20 left-20 w-24 h-24 border-2 border-white/40 rounded-full"></div>
            <div className="absolute bottom-10 right-10 w-8 h-8 bg-white/30 rounded-full"></div>
            <div className="absolute top-1/2 left-1/3 w-12 h-12 border-2 border-white/40 rotate-12"></div>
          </div>
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/80 text-center px-6">
            <p className="text-lg font-semibold">Rejoignez-nous</p>
            <p className="text-sm opacity-70">Commencez à traduire vos documents dès aujourd'hui</p>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-1/2 bg-white p-8 md:p-10">
          <h1 className="text-3xl font-bold text-blue-700 mb-8 text-center">S'INSCRIRE</h1>
          
          <form onSubmit={handleSignup} className="space-y-4">
            {error && (
              <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg text-center">
                {error}
              </div>
            )}

            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nom complet"
                required
                className="w-full pl-10 pr-4 py-3 border-b-2 border-gray-200 focus:border-blue-600 outline-none transition bg-transparent"
              />
            </div>

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
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

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirmer le mot de passe"
                required
                className="w-full pl-10 pr-4 py-3 border-b-2 border-gray-200 focus:border-blue-600 outline-none transition bg-transparent"
              />
            </div>

            <button
              type="submit"
              className="w-full mt-6 bg-gradient-to-r from-blue-700 to-blue-900 text-white py-3 rounded-lg font-medium hover:opacity-90 transition flex items-center justify-center gap-2"
            >
              Créer mon compte
              <ArrowRight className="w-5 h-5" />
            </button>

            <p className="text-center text-sm text-gray-600 mt-4">
              Déjà un compte ?{' '}
              <Link href="/login" className="text-blue-600 font-medium hover:underline">
                Se connecter
              </Link>
            </p>
          </form>

          <p className="text-xs text-gray-400 text-center mt-10">
            © 2026 Doctrans. Tous droits réservés.
          </p>
        </div>
      </div>
    </div>
  );
}