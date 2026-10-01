import Link from 'next/link';
import DoctransLogo from './components/DoctransLogo';
import { FileText, Languages, Shield, Zap, CheckCircle, ArrowRight , Globe } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <header className="px-6 py-4 border-b border-gray-100">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <DoctransLogo size="md" />
          <nav className="flex items-center gap-4">
            <Link 
              href="/Login" 
              className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition"
            >
              Connexion
            </Link>
            <Link 
              href="/Signup" 
              className="px-5 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition shadow-sm"
            >
              S'inscrire
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-6 py-20 bg-gradient-to-br from-sky-50 via-white to-blue-50">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Traduisez vos documents
            <span className="text-blue-600"> sans perdre la mise en forme</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
            Doctrans préserve intégralement la mise en forme de vos PDF, Word, PowerPoint et Excel. 
            Rapide, sécurisé et professionnel.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link 
              href="/Signup" 
              className="px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold text-lg hover:bg-blue-700 transition shadow-lg flex items-center gap-2"
            >
              Commencer gratuitement <ArrowRight className="w-5 h-5" />
            </Link>
            <a 
              href="#features" 
              className="px-8 py-4 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition"
            >
              En savoir plus
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Pourquoi Doctrans ?</h2>
            <p className="text-lg text-gray-500 max-w-xl mx-auto">
              L'outil de référence pour la traduction professionnelle de documents
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <FileText className="w-8 h-8 text-blue-600" />,
                title: "Multi-formats supportés",
                desc: "PDF, DOCX, PPTX, XLSX, TXT — vos fichiers sont acceptés quel que soit le format.",
              },
              {
                icon: <Languages className="w-8 h-8 text-blue-600" />,
                title: "Plus de 9 langues",
                desc: "Français, Anglais, Espagnol, Allemand, Chinois, Arabe, Russe, Italien, Portugais...",
              },
              {
                icon: <Shield className="w-8 h-8 text-blue-600" />,
                title: "Sécurisé et privé",
                desc: "Vos fichiers ne sont jamais partagés. Suppression automatique après traitement.",
              },
              {
                icon: <Zap className="w-8 h-8 text-blue-600" />,
                title: "Traitement rapide",
                desc: "Quelques secondes suffisent pour obtenir votre document traduit et mis en forme.",
              },
              {
                icon: <CheckCircle className="w-8 h-8 text-blue-600" />,
                title: "Mise en forme préservée",
                desc: "Vos tableaux, images, polices et styles restent identiques au document original.",
              },
              {
                icon: <Globe className="w-8 h-8 text-blue-600" />,
                title: "Accessible partout",
                desc: "Depuis votre ordinateur, votre tablette ou votre téléphone — où que vous soyez.",
              },
            ].map((feature, index) => (
              <div 
                key={index} 
                className="bg-white p-8 rounded-2xl border border-gray-100 hover:shadow-lg hover:border-blue-100 transition"
              >
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Prêt à traduire vos documents ?</h2>
          <p className="text-lg text-blue-100 mb-8">
            Créez votre compte gratuitement et commencez dès maintenant.
          </p>
          <Link 
            href="/Signup" 
            className="inline-block px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold text-lg hover:bg-blue-50 transition shadow-lg"
          >
            Créer un compte gratuit →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-10 border-t border-gray-100 bg-gray-50">
        <div className="max-w-7xl mx-auto text-center">
          <DoctransLogo size="sm" className="mx-auto mb-4" />
          <p className="text-sm text-gray-500">
            © 2026 Doctrans — Traduction de documents professionnelle
          </p>
        </div>
      </footer>
    </div>
  );
}