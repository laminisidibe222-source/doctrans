'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Upload, Globe, Download, LogOut, User, Sparkles, 
  FileText, Languages, ArrowRight, CheckCircle2, Lock, Crown
} from 'lucide-react';
import { supabase } from '../api/utils/supabase';
import DoctransLogo from '../components/DoctransLogo';

export const maxDuration = 120;
export const dynamic = 'force-dynamic';

// Quota config
const FREE_TRANSLATIONS = 3;

export default function TranslatePage() {
  const [file, setFile] = useState<File | null>(null);
  const [sourceLang, setSourceLang] = useState('fr');
  const [targetLang, setTargetLang] = useState('en');
  const [isTranslating, setIsTranslating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('');
  const [isDone, setIsDone] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quota, setQuota] = useState({ used: 0, remaining: FREE_TRANSLATIONS });
  const [showPayment, setShowPayment] = useState(false);
  const router = useRouter();

  const languages = [
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'en', name: 'Anglais', flag: '🇬🇧' },
    { code: 'es', name: 'Espagnol', flag: '🇪🇸' },
    { code: 'de', name: 'Allemand', flag: '🇩🇪' },
    { code: 'pt', name: 'Portugais', flag: '🇧🇷' },
    { code: 'it', name: 'Italien', flag: '🇮🇹' },
    { code: 'ru', name: 'Russe', flag: '🇷🇺' },
    { code: 'zh', name: 'Chinois', flag: '🇨🇳' },
    { code: 'ar', name: 'Arabe', flag: '🇸🇦' },
  ];

  // Auth + Quota check
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.replace('/Login');
        return;
      }
      setUser(session.user);
      
      // Load quota from localStorage (replace with DB in production)
      const savedQuota = localStorage.getItem(`quota_${session.user.id}`);
      if (savedQuota) {
        const parsed = JSON.parse(savedQuota);
        setQuota(parsed);
      }
      
      setLoading(false);
    };
    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/Login');
  };

  const deductQuota = () => {
    const newQuota = { ...quota, used: quota.used + 1, remaining: quota.remaining - 1 };
    setQuota(newQuota);
    localStorage.setItem(`quota_${user.id}`, JSON.stringify(newQuota));
  };

  const handleTranslate = async () => {
    if (!file) return;

    // ✅ Check quota BEFORE starting
    if (quota.remaining <= 0) {
      setShowPayment(true);
      return;
    }

    setIsTranslating(true);
    setProgress(0);
    setStatusText('Téléversement...');
    setIsDone(false);
    setDownloadUrl(null);
    setShowPayment(false);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('sourceLang', sourceLang);
    formData.append('targetLang', targetLang);

    // ✅ Realistic progress — stops at 90% then jumps to 100%
    const progressInterval = setInterval(() => {
      setProgress(p => {
        if (p < 30) return p + 5;
        if (p < 60) return p + 2;
        if (p < 90) return p + 0.5; // Slower as we approach processing
        return 90; // ✅ Stays here while backend works
      });
    }, 150);

    try {
      setStatusText('Traitement du document...');
      
      const res = await fetch('/api/translate', {
        method: 'POST',
        body: formData
      });

      const data = await res.json();
      clearInterval(progressInterval);

      if (!res.ok) {
        throw new Error(data.error || 'Erreur de traduction');
      }

      if (data.success) {
        setProgress(100); // ✅ Instant jump when backend responds
        setStatusText('Terminé !');
        setDownloadUrl(data.downloadUrl);
        setIsDone(true);
        deductQuota(); // ✅ Decrement free count
      }
    } catch (err: any) {
      clearInterval(progressInterval);
      alert(err.message || 'Erreur de connexion au serveur');
      setProgress(0);
      setStatusText('');
    } finally {
      setIsTranslating(false);
    }
  };

  const handlePayment = () => {
    // ✅ Replace with your Stripe checkout URL
    alert('🔓 Redirection vers le paiement...\n\nIntégration Stripe à connecter ici !');
    
    // After successful payment — reset quota:
    // setQuota({ used: 0, remaining: 999 });
    // localStorage.setItem(`quota_${user.id}`, JSON.stringify({ used: 0, remaining: 999 }));
  };

  const resetForm = () => {
    setFile(null);
    setIsDone(false);
    setDownloadUrl(null);
    setShowPayment(false);
    setProgress(0);
    setStatusText('');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-lg text-gray-600">Chargement de votre espace...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl -translate-y-1/2" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl translate-y-1/2" />
      <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-sky-200/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />

      {/* Navigation */}
      <nav className="relative z-10 px-6 py-4 backdrop-blur-md bg-white/60 border-b border-white/50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <DoctransLogo size="md" />
          </Link>
          <div className="flex items-center gap-4">
            {/* ✅ Quota Display */}
            <div className="px-3 py-1.5 bg-blue-50 rounded-full text-sm font-medium text-blue-700">
              {quota.remaining > 0 ? (
                <span>✨ {quota.remaining} traduction{quota.remaining > 1 ? 's' : ''} gratuite{quota.remaining > 1 ? 's' : ''}</span>
              ) : (
                <span className="text-amber-600 font-semibold">Quota épuisé</span>
              )}
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-full">
              <User className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">
                {user.user_metadata?.full_name || user.email}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-500 transition px-3 py-1.5 rounded-lg hover:bg-red-50"
            >
              <LogOut className="w-4 h-4" /> Déconnexion
            </button>
          </div>
        </div>
      </nav>

      <main className="relative z-10 max-w-5xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            Traduction intelligente
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Traduisez vos documents en toute simplicité
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            La mise en forme est 100% préservée. Sélectionnez votre fichier, choisissez les langues, et c'est parti !
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/60 p-8 md:p-10 mb-8">
          <div className="space-y-8">
            {/* File Upload */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                <FileText className="w-4 h-4 inline mr-2" />
                Votre document
              </label>
              <div className={`border-2 border-dashed rounded-2xl p-10 text-center transition-all cursor-pointer ${
                file ? 'border-blue-400 bg-blue-50/50' : 'border-gray-200 hover:border-blue-400 hover:bg-blue-50/30'
              }`}>
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  accept=".pdf,.docx,.txt,.pptx,.xlsx"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  disabled={isTranslating}
                />
                <label htmlFor="file-upload" className={`cursor-pointer block ${isTranslating ? 'pointer-events-none opacity-50' : ''}`}>
                  {file ? (
                    <div className="space-y-2">
                      <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto" />
                      <span className="text-lg font-semibold text-blue-700">{file.name}</span>
                      <p className="text-sm text-gray-400">
                        {(file.size / 1024 / 1024).toFixed(2)} MB — Cliquez pour changer
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Upload className="w-12 h-12 text-gray-400 mx-auto" />
                      <span className="text-lg font-medium text-gray-600">
                        Cliquez ou déposez votre fichier ici
                      </span>
                      <p className="text-sm text-gray-400">
                        PDF, DOCX, PPTX, XLSX, TXT — Tous formats supportés
                      </p>
                    </div>
                  )}
                </label>
              </div>
            </div>

            {/* Language Selectors */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-sky-50 rounded-2xl p-5 border border-blue-100">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Traduire DE
                </label>
                <select
                  value={sourceLang}
                  onChange={(e) => setSourceLang(e.target.value)}
                  className="w-full px-4 py-3 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800 font-medium"
                  disabled={isTranslating}
                >
                  {languages.map(l => (
                    <option key={l.code} value={l.code}>
                      {l.flag} {l.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-5 border border-indigo-100">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Traduire VERS
                </label>
                <select
                  value={targetLang}
                  onChange={(e) => setTargetLang(e.target.value)}
                  className="w-full px-4 py-3 border border-indigo-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-gray-800 font-medium"
                  disabled={isTranslating}
                >
                  {languages.map(l => (
                    <option key={l.code} value={l.code}>
                      {l.flag} {l.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* ✅ Payment Prompt — Shows when quota exhausted */}
            {showPayment && (
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-6 text-center">
                <Crown className="w-10 h-10 text-amber-500 mx-auto mb-3" />
                <h3 className="text-xl font-bold text-amber-800 mb-2">
                  Votre période d'essai est terminée
                </h3>
                <p className="text-amber-700 mb-5">
                  Vous avez utilisé vos {FREE_TRANSLATIONS} traductions gratuites. 
                  Passez à l'abonnement pour un accès illimité !
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={handlePayment}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-bold hover:opacity-90 transition shadow-lg"
                  >
                    <Lock className="w-5 h-5" />
                    Débloquer l'accès illimité
                  </button>
                  <button
                    onClick={() => setShowPayment(false)}
                    className="text-amber-600 font-medium hover:underline px-4"
                  >
                    Plus tard
                  </button>
                </div>
              </div>
            )}

            {/* Progress / Button / Download */}
            {isTranslating ? (
              <div className="space-y-3">
                <div className="flex justify-between text-sm font-medium text-gray-600">
                  <span>{statusText || 'Traduction en cours...'}</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 transition-all duration-300 rounded-full"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-sm text-gray-400 text-center">
                  {progress >= 85 && progress < 95 
                    ? '⏳ Traitement avancé — cela peut prendre quelques instants...' 
                    : '🔒 Vos fichiers sont traités en toute sécurité'}
                </p>
              </div>
            ) : isDone && downloadUrl ? (
              <div className="space-y-4 text-center">
                <div className="py-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <CheckCircle2 className="w-10 h-10 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-green-700">Traduction terminée !</h3>
                  <p className="text-gray-500 mt-1">Votre document est prêt à être téléchargé</p>
                </div>
                <a
                  href={downloadUrl}
                  download
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold text-lg hover:opacity-90 transition shadow-lg"
                >
                  <Download className="w-5 h-5" /> Télécharger le document traduit
                </a>
                <button
                  onClick={resetForm}
                  className="block mx-auto text-blue-600 font-medium hover:underline mt-2"
                >
                  Traduire un autre document
                </button>
              </div>
            ) : (
              <button
                onClick={handleTranslate}
                disabled={!file}
                className="w-full py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-xl font-semibold text-lg hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-3 shadow-lg"
              >
                <Globe className="w-5 h-5" />
                {quota.remaining > 0 
                  ? 'Lancer la traduction' 
                  : 'Débloquer pour traduire'}
                <ArrowRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Features Footer */}
        <div className="grid md:grid-cols-3 gap-6 text-center">
          {[
            { icon: <Languages className="w-6 h-6 text-blue-600" />, title: '9+ Langues', desc: 'Couverture mondiale' },
            { icon: <FileText className="w-6 h-6 text-blue-600" />, title: 'Mise en forme préservée', desc: 'Identique à l\'original' },
            { icon: <Sparkles className="w-6 h-6 text-blue-600" />, title: 'Qualité professionnelle', desc: 'Traduction précise' },
          ].map((f, i) => (
            <div key={i} className="bg-white/60 backdrop-blur-sm rounded-xl p-5 border border-white/80">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mx-auto mb-3">
                {f.icon}
              </div>
              <h3 className="font-semibold text-gray-800">{f.title}</h3>
              <p className="text-sm text-gray-500 mt-1">{f.desc}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}