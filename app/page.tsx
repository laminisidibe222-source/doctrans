'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-indigo-600">Doctrans</span>
            </div>
            
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-gray-600 hover:text-indigo-600 transition">Fonctionnalités</a>
              <a href="#how-it-works" className="text-gray-600 hover:text-indigo-600 transition">Comment ça marche</a>
              <a href="#pricing" className="text-gray-600 hover:text-indigo-600 transition">Tarifs</a>
              <Link href="/login" className="text-gray-600 hover:text-indigo-600 transition">Connexion</Link>
              <Link 
                href="/translate" 
                className="bg-indigo-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-indigo-700 transition"
              >
                Traduire un document
              </Link>
            </div>

            <button 
              className="md:hidden" 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              ☰
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-b px-4 pb-4">
            <div className="flex flex-col gap-3">
              <a href="#features" className="py-2">Fonctionnalités</a>
              <a href="#how-it-works" className="py-2">Comment ça marche</a>
              <a href="#pricing" className="py-2">Tarifs</a>
              <Link href="/login" className="py-2">Connexion</Link>
              <Link 
                href="/translate" 
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-center"
              >
                Traduire gratuitement
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="py-20 lg:py-32 bg-gradient-to-br from-indigo-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Traduisez vos documents sans jamais<br />
            <span className="text-indigo-600">perdre la mise en forme</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-10">
            PDF, DOCX, PPTX, XLSX — préservez mise en page, images et tableaux. 
            Traduisez en plus de 130 langues en quelques secondes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/translate" 
              className="bg-indigo-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-indigo-700 transition shadow-lg shadow-indigo-200"
            >
              🚀 Traduire un document gratuitement
            </Link>
            <Link 
              href="#pricing" 
              className="border border-gray-300 px-8 py-4 rounded-xl text-lg font-medium hover:bg-gray-50 transition"
            >
              Voir les tarifs
            </Link>
          </div>
          <p className="mt-6 text-sm text-gray-500">Aucune carte bancaire requise — 3 pages gratuites</p>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Pourquoi Doctrans ?</h2>
            <p className="text-gray-600 text-lg">La traduction professionnelle sans compromis sur la forme</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: '🎨',
                title: 'Mise en forme préservée',
                desc: 'Vos documents restent identiques : mise en page, polices, images et tableaux conservés.'
              },
              {
                icon: '🌍',
                title: '130+ langues supportées',
                desc: 'Anglais, Français, Espagnol, Chinois, Arabe… Couverture mondiale complète.'
              },
              {
                icon: '🔒',
                title: 'Sécurisé & Privé',
                desc: 'Vos fichiers sont chiffrés et supprimés automatiquement après traitement.'
              },
              {
                icon: '⚡',
                title: 'Traitement ultra-rapide',
                desc: 'Des documents traduits en quelques secondes, même plusieurs centaines de pages.'
              },
              {
                icon: '📄',
                title: 'Tous formats acceptés',
                desc: 'PDF, DOCX, PPTX, XLSX, TXT… Plus besoin de reformater vos fichiers.'
              },
              {
                icon: '💰',
                title: 'Tarifs transparents',
                desc: 'Pas de surprise. Forfaits adaptés aux particuliers comme aux entreprises.'
              }
            ].map((f, i) => (
              <div key={i} className="p-6 rounded-2xl border border-gray-100 hover:shadow-lg transition">
                <span className="text-4xl mb-4 block">{f.icon}</span>
                <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
                <p className="text-gray-600">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">3 étapes, c’est tout !</h2>
            <p className="text-gray-600 text-lg">Simple, rapide et efficace</p>
          </div>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              { step: '1', title: 'Déposez votre fichier', desc: 'Sélectionnez ou glissez-déposez votre document dans la zone d’envoi.' },
              { step: '2', title: 'Choisissez la langue', desc: 'Sélectionnez la ou les langues cibles parmi plus de 130 choix.' },
              { step: '3', title: 'Téléchargez le résultat', desc: 'Récupérez votre document traduit avec sa mise en forme intacte.' }
            ].map((s) => (
              <div key={s.step} className="text-center">
                <div className="w-16 h-16 bg-indigo-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {s.step}
                </div>
                <h3 className="text-xl font-semibold mb-2">{s.title}</h3>
                <p className="text-gray-600">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Des tarifs adaptés à vous</h2>
            <p className="text-gray-600 text-lg">Commencez gratuitement, évoluez sereinement</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Gratuit',
                price: '0€',
                period: '',
                features: ['3 pages par mois', '5 langues max', 'Téléchargement PDF', 'Suppression 7 jours'],
                cta: 'Commencer gratuitement',
                featured: false
              },
              {
                name: 'Pro',
                price: '19€',
                period: '/mois',
                features: ['500 pages/mois', 'Toutes les langues', 'Tous formats', 'Conservation 30j', 'Support prioritaire'],
                cta: 'Choisir Pro',
                featured: true
              },
              {
                name: 'Entreprise',
                price: '79€',
                period: '/mois',
                features: ['Pages illimitées', 'Toutes les langues', 'API accès', 'Conservation 1an', 'Support dédié', 'Personnalisation'],
                cta: 'Contacter nous',
                featured: false
              }
            ].map((plan) => (
              <div 
                key={plan.name} 
                className={`rounded-2xl p-8 ${
                  plan.featured 
                    ? 'bg-indigo-600 text-white shadow-xl scale-105' 
                    : 'border border-gray-200'
                }`}
              >
                <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                <p className="text-4xl font-bold mb-6">{plan.price}<span className="text-lg font-normal">{plan.period}</span></p>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-2">
                      ✓ {f}
                    </li>
                  ))}
                </ul>
                <Link 
                  href="/translate"
                  className={`block text-center py-3 rounded-lg font-medium transition ${
                    plan.featured 
                      ? 'bg-white text-indigo-600 hover:bg-gray-100' 
                      : 'bg-indigo-600 text-white hover:bg-indigo-700'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold text-indigo-400 mb-4">Doctrans</h3>
              <p className="text-gray-400">Traduisez sans limites, préservez la forme.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Liens</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#features" className="hover:text-white">Fonctionnalités</a></li>
                <li><a href="#pricing" className="hover:text-white">Tarifs</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Légal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Confidentialité</a></li>
                <li><a href="#" className="hover:text-white">CGU</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Contact</h4>
              <ul className="space-y-2 text-gray-400">
                <li>contact@doctrans.fr</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-10 pt-6 text-center text-gray-500">
            © 2026 Doctrans — Tous droits réservés
          </div>
        </div>
      </footer>
    </div>
  );
}