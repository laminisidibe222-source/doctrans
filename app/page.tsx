import Link from 'next/link';
import DoctransLogo from './components/DoctransLogo';
import { FileText, Languages, Shield, Zap } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-white">
      <header className="px-6 py-4 flex justify-between items-center max-w-7xl mx-auto">
        <DoctransLogo size="md" />
        <nav className="flex gap-4">
          <Link href="/login" className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium">
            Connexion
          </Link>
          <Link href="/signup" className="px-5 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition">
            S'inscrire
          </Link>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Traduisez vos documents <span className="text-blue-600">sans perdre la mise en forme</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Doctrans préserve la mise en forme de vos PDF, Word, PowerPoint et Excel. 
            Rapide, sécurisé et professionnel.
          </p>
          <Link 
            href="/signup" 
            className="inline-block px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold text-lg hover:bg-blue-700 transition shadow-lg"
          >
            Commencer gratuitement →
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-12">
          {[
            { icon: <FileText className="w-8 h-8 text-blue-600" />, title: "Multi-formats", desc: "PDF, DOCX, PPTX, XLSX, TXT — tous supportés" },
            { icon: <Languages className="w-8 h-8 text-blue-600" />, title: "9+ Langues", desc: "Français, Anglais, Espagnol, Allemand, Chinois, Arabe..." },
            { icon: <Shield className="w-8 h-8 text-blue-600" />, title: "Sécurisé", desc: "Vos fichiers restent privés et protégés" },
          ].map((f, i) => (
            <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
              <div className="mb-4">{f.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
              <p className="text-gray-600">{f.desc}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}