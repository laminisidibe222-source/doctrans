'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FileText, Mail, Lock, User, ArrowRight } from 'lucide-react';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <FileText className="w-8 h-8 text-indigo-600" />
            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              Doctrans
            </span>
          </div>
          <h1 className="text-2xl font-bold">Créer un compte</h1>
          <p className="text-gray-500">
            Commencez à traduire vos documents gratuitement
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom complet
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Marie Dubois"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="vous@exemple.com"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <button className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white py-3 rounded-xl font-medium hover:opacity-90 transition flex items-center justify-center gap-2">
              Créer mon compte
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          <p className="mt-6 text-center text-sm text-gray-500">
            Déjà un compte ?{' '}
            <Link href="/login" className="text-indigo-600 font-medium hover:underline">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}