'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, Globe, Download, LogOut, User } from 'lucide-react';
import Link from 'next/link';
import DoctransLogo from '../components/DoctransLogo';
import { supabase } from '../api/utils/supabase';

export default function TranslatePage() {
  const [file, setFile] = useState<File | null>(null);
  const [sourceLang, setSourceLang] = useState('fr');
  const [targetLang, setTargetLang] = useState('en');
  const [isTranslating, setIsTranslating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const router = useRouter();

  const languages = [
    { code: 'fr', name: 'Français' }, { code: 'en', name: 'Anglais' },
    { code: 'es', name: 'Espagnol' }, { code: 'de', name: 'Allemand' },
    { code: 'pt', name: 'Portugais' }, { code: 'it', name: 'Italien' },
    { code: 'ru', name: 'Russe' }, { code: 'zh', name: 'Chinois' },
    { code: 'ar', name: 'Arabe' }
  ];

  useEffect(() => {
    let cancelled = false;

    const checkUser = async () => {
      try {
        console.log('Checking Supabase session...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (cancelled) return;

        if (error) {
          console.error('Session error:', error);
          throw error;
        }

        if (!session) {
          console.log('No session found — redirecting to login');
          router.push('/Login');
          return;
        }

        console.log('User authenticated:', session.user.email);
        setUser(session.user);
      } catch (err: any) {
        if (!cancelled) {
          console.error('Auth check failed:', err);
          setErrorMsg(err.message || 'Erreur de connexion à Supabase');
          router.push('/Login');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!cancelled) {
        if (!session) router.push('/Login');
        else setUser(session.user);
        setLoading(false);
      }
    });

    // ⏱️ Timeout after 5 seconds — prevent infinite loading
    const timeout = setTimeout(() => {
      if (!cancelled && loading) {
        setErrorMsg('La connexion expire — vérifiez vos clés Supabase');
        setLoading(false);
      }
    }, 5000);

    return () => {
      cancelled = true;
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, [router, loading]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const handleTranslate = async () => {
    if (!file) return;
    setIsTranslating(true);
    setProgress(0);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('sourceLang', sourceLang);
    formData.append('targetLang', targetLang);

    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        body: formData
      });

      const interval = setInterval(() => {
        setProgress(p => p >= 90 ? 90 : p + 10);
      }, 200);

      const data = await res.json();
      clearInterval(interval);

      if (data.success) {
        setProgress(100);
        setDownloadUrl(data.downloadUrl);
        setIsDone(true);
      }
    } catch (err) {
      alert('Erreur de connexion au serveur');
    } finally {
      setIsTranslating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-lg">Chargement...</p>
        <p className="text-sm text-gray-500 mt-2">Vérifiez la console (F12) pour les détails</p>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6">
        <div className="bg-red-50 text-red-600 p-6 rounded-xl max-w-md text-center">
          <h3 className="font-bold text-lg mb-2">Erreur de connexion</h3>
          <p className="mb-4">{errorMsg}</p>
          <button onClick={() => router.push('/login')} className="bg-blue-600 text-white px-4 py-2 rounded-lg">
            Aller à la connexion
          </button>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-white">
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/">
            <DoctransLogo size="md" />
          </Link>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              <User className="w-4 h-4 text-blue-600" />
              <span className="font-medium">{user.user_metadata?.full_name || user.email}</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-500 transition"
            >
              <LogOut className="w-4 h-4" /> Déconnexion
            </button>
          </div>
        </div>
      </nav>

      <div className="flex items-center justify-center py-12 px-6">
        <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-blue-700">Traduire un document</h1>
            <p className="text-gray-500">Mise en forme 100% préservée</p>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Fichier</label>
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-blue-400 transition cursor-pointer">
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  accept=".pdf,.docx,.txt,.pptx,.xlsx"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  {file ? (
                    <div>
                      <span className="text-blue-600 font-medium">{file.name}</span>
                    </div>
                  ) : (
                    <div>
                      <Upload className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                      <span className="text-gray-500 text-sm">Cliquez ou déposez votre fichier</span>
                    </div>
                  )}
                </label>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">De</label>
                <select
                  value={sourceLang}
                  onChange={(e) => setSourceLang(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {languages.map(l => <option key={l.code} value={l.code}>{l.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Vers</label>
                <select
                  value={targetLang}
                  onChange={(e) => setTargetLang(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {languages.map(l => <option key={l.code} value={l.code}>{l.name}</option>)}
                </select>
              </div>
            </div>

            {isTranslating ? (
              <div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-center text-sm text-gray-500 mt-2">Traduction en cours… {progress}%</p>
              </div>
            ) : isDone && downloadUrl ? (
              <a
                href={downloadUrl}
                download
                className="w-full bg-green-600 text-white py-3 rounded-xl font-medium hover:bg-green-700 transition flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" /> Télécharger le document traduit
              </a>
            ) : (
              <button
                onClick={handleTranslate}
                disabled={!file}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-medium hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Globe className="w-5 h-5" /> Traduire maintenant
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}