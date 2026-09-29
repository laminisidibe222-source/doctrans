'use client';
import { useState, useEffect } from 'react';
import { Upload, Globe, Download, FileText, LogOut, User } from 'lucide-react';
import Link from 'next/link';

export default function TranslatePage() {
  const [file, setFile] = useState<File | null>(null);
  const [sourceLang, setSourceLang] = useState('fr');
  const [targetLang, setTargetLang] = useState('en');
  const [isTranslating, setIsTranslating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);

  const languages = [
    { code: 'fr', name: 'Français' }, { code: 'en', name: 'Anglais' },
    { code: 'es', name: 'Espagnol' }, { code: 'de', name: 'Allemand' },
    { code: 'pt', name: 'Portugais' }, { code: 'it', name: 'Italien' },
    { code: 'ru', name: 'Russe' }, { code: 'zh', name: 'Chinois' },
    { code: 'ar', name: 'Arabe' }
  ];

  useEffect(() => {
    const saved = localStorage.getItem('doctrans_user');
    if (!saved) {
      window.location.href = '/login';
      return;
    }
    setCurrentUser(JSON.parse(saved));
  }, []);

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

  const handleLogout = () => {
    localStorage.removeItem('doctrans_user');
    window.location.href = '/';
  };

  if (!currentUser) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-white">
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <FileText className="w-7 h-7 text-blue-600" />
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Doctrans
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              <User className="w-4 h-4 text-blue-600" />
              <span className="font-medium">{currentUser.name || currentUser.email}</span>
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
                      <FileText className="w-10 h-10 text-blue-600 mx-auto mb-2" />
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