import React, { useState, useMemo } from 'react';
import { BookOpen, Image as ImageIcon, Languages, Download, Sparkles, RefreshCw, Search, Volume2, GraduationCap } from 'lucide-react';
import { hsk1Vocab, hsk2Vocab, hsk3Vocab, hsk4Vocab } from './vocabulary';

const App = () => {
  const [activeTab, setActiveTab] = useState('vocabulary');
  const [hskLevel, setHskLevel] = useState(1);
  const [targetLang, setTargetLang] = useState('de');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState(null);
  const [prompt, setPrompt] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const languages = { de: "Deutsch", en: "English", es: "Español" };

  const currentVocab = useMemo(() => {
    if (hskLevel === 1) return hsk1Vocab;
    if (hskLevel === 2) return hsk2Vocab;
    if (hskLevel === 3) return hsk3Vocab;
    return hsk4Vocab;
  }, [hskLevel]);

  const targetCount = hskLevel === 4 ? 600 : (hskLevel === 3 ? 300 : 150);

  const categorizedVocab = useMemo(() => {
    const groups = {};
    const filtered = currentVocab.filter(item => 
      item.char.includes(searchTerm) || 
      item.pinyin.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (item[targetLang] && item[targetLang].toLowerCase().includes(searchTerm.toLowerCase()))
    );
    filtered.forEach(item => {
      if (!groups[item.cat]) groups[item.cat] = [];
      groups[item.cat].push(item);
    });
    return groups;
  }, [currentVocab, searchTerm, targetLang]);

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'zh-CN';
    window.speechSynthesis.speak(utterance);
  };

  const generateNewGraphic = async () => {
    setIsGenerating(true);
    setTimeout(() => {
      setGeneratedImageUrl("https://via.placeholder.com/800x600/dc2626/ffffff?text=HSK+Poster+Preview");
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-20">
      <nav className="bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 shadow-sm px-4 sm:px-8 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-red-600 p-2.5 rounded-2xl text-white shadow-lg rotate-3">
            <Languages size={24} />
          </div>
          <div className="hidden sm:block">
            <h1 className="font-black text-xl italic tracking-tighter">HSK MASTER</h1>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-0.5">Vocabulary Visual Hub</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex bg-slate-100 p-1 rounded-xl shadow-inner border border-slate-200">
            {['de', 'en', 'es'].map(lang => (
              <button key={lang} onClick={() => setTargetLang(lang)}
                className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all ${targetLang === lang ? 'bg-slate-100 text-slate-900 shadow-md' : 'text-slate-400'}`}
                style={targetLang === lang ? { backgroundColor: '#0f172a', color: 'white' } : {}}>
                {lang.toUpperCase()}
              </button>
            ))}
          </div>
          <div className="flex gap-1 ml-2">
            <button onClick={() => setActiveTab('vocabulary')}
              className={`p-2.5 rounded-xl transition-all ${activeTab === 'vocabulary' ? 'bg-red-50 text-red-600 shadow-sm' : 'text-slate-400'}`}>
              <BookOpen size={20} />
            </button>
            <button onClick={() => setActiveTab('graphics')}
              className={`p-2.5 rounded-xl transition-all ${activeTab === 'graphics' ? 'bg-red-50 text-red-600 shadow-sm' : 'text-slate-400'}`}>
              <ImageIcon size={20} />
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-8 pt-8">
        {activeTab === 'vocabulary' ? (
          <section className="space-y-10 animate-in">
            <div className="flex flex-col lg:flex-row gap-6 items-center justify-between bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-100">
                  {[1, 2, 3, 4].map(lvl => (
                    <button key={lvl} onClick={() => { setHskLevel(lvl); setSearchTerm(""); }}
                      className={`px-8 py-3 rounded-xl font-black text-sm transition-all ${hskLevel === lvl ? 'bg-red-600 text-white shadow-xl scale-105' : 'text-slate-400'}`}>
                      HSK {lvl}
                    </button>
                  ))}
                </div>
                <div className="hidden sm:flex flex-col">
                  <span className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Vollständigkeit</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-slate-800">{currentVocab.length} Einträge</span>
                    <div style={{ width: '6rem', height: '0.375rem', backgroundColor: '#f1f5f9', borderRadius: '9999px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', backgroundColor: '#22c55e', width: `${Math.min((currentVocab.length / targetCount) * 100, 100)}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative w-full max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input type="text" placeholder={`Suche (Zeichen, Pinyin, ${targetLang.toUpperCase()})...`}
                  value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-6 py-4 bg-slate-100 border border-slate-100 rounded-2xl outline-none transition-all text-sm font-medium"
                  style={{ backgroundColor: '#f8fafc' }}/>
              </div>
            </div>

            {Object.keys(categorizedVocab).sort().map(cat => (
              <div key={cat} className="space-y-4">
                <div className="flex items-center gap-3 px-2">
                  <div style={{ height: '1.5rem', width: '0.375rem', backgroundColor: '#dc2626', borderRadius: '9999px' }}></div>
                  <h2 className="text-lg font-black tracking-tight text-slate-800 uppercase">{cat}</h2>
                  <span className="text-xs font-bold text-slate-400 bg-white border border-slate-200 px-2 py-0.5 rounded-full">{categorizedVocab[cat].length}</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {categorizedVocab[cat].map((item, idx) => (
                    <button key={idx} onClick={() => speak(item.char)} className="group bg-white p-6 rounded-[32px] border border-slate-200 transition-all text-center relative overflow-hidden flex flex-col items-center justify-center min-h-[220px]"
                      style={{ cursor: 'pointer' }}
                      onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#f87171'; e.currentTarget.style.boxShadow = '0 25px 50px -12px rgba(239, 68, 68, 0.1)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.boxShadow = 'none'; }}>
                      <div className="absolute top-4 right-4 text-slate-200">
                        <Volume2 size={16} />
                      </div>
                      <span className="text-5xl mb-4 transition-transform duration-300" style={{ display: 'block' }}>{item.icon}</span>
                      <h3 className="text-3xl font-black text-slate-800 leading-tight">{item.char}</h3>
                      <p className="text-slate-400 font-bold text-xs italic mt-1">{item.pinyin}</p>
                      <div className="mt-4 pt-3 border-t border-slate-100 w-full">
                        <p className="text-slate-600 font-bold text-sm line-clamp-2">{item[targetLang]}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </section>
        ) : (
          <section className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom-6">
            <div className="bg-white p-10 rounded-[48px] border border-slate-200 shadow-sm relative overflow-hidden">
              <header className="mb-10 text-center sm:text-left">
                <h2 className="text-4xl font-black tracking-tight mb-2 italic">LERN<span className="text-red-600">POSTER</span></h2>
                <p className="text-slate-500 font-medium italic">Level: HSK {hskLevel} | Sprache: {languages[targetLang]}</p>
              </header>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Thema eingeben</label>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input type="text" value={prompt} onChange={(e) => setPrompt(e.target.value)}
                      className="flex-1 px-6 py-5 rounded-[24px] bg-slate-100 border border-slate-100 outline-none transition-all font-medium"
                      placeholder="Z.B. Wetter in China, Büroarbeit, etc." style={{ backgroundColor: '#f8fafc' }}/>
                    <button onClick={generateNewGraphic} disabled={isGenerating || !prompt}
                      className="bg-red-600 text-white px-10 py-5 rounded-[24px] font-black flex items-center justify-center gap-3 shadow-xl transition-all"
                      style={{ opacity: (isGenerating || !prompt) ? 0.5 : 1 }}>
                      {isGenerating ? <RefreshCw className="animate-spin" size={20} /> : <Sparkles size={20} />}
                      Generieren
                    </button>
                  </div>
                </div>
              </div>
              {isGenerating && (
                <div className="mt-12 flex flex-col items-center justify-center p-16 bg-slate-100 rounded-[40px] border border-slate-100 animate-pulse">
                  <RefreshCw className="text-red-600 animate-spin mb-4" size={48} />
                  <p className="text-slate-400 font-black text-sm uppercase tracking-widest">KI entwirft Lernposter...</p>
                </div>
              )}
              {generatedImageUrl && !isGenerating && (
                <div className="mt-12 space-y-6 zoom-in-95">
                  <div className="flex justify-between items-center px-2">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Vorschau</span>
                    <button onClick={() => { const link = document.createElement('a'); link.href = generatedImageUrl; link.download = `HSK${hskLevel}_Graphic.png`; link.click(); }}
                      className="text-red-600 font-black text-xs flex items-center gap-1">
                      <Download size={14} /> SPEICHERN
                    </button>
                  </div>
                  <img src={generatedImageUrl} className="w-full rounded-[40px] shadow-2xl border border-slate-200" alt="Generated Poster" />
                </div>
              )}
            </div>
            <div className="p-8 bg-red-600 rounded-[32px] text-white shadow-xl flex items-center gap-6">
              <GraduationCap size={48} className="opacity-50" />
              <div>
                <h4 className="font-black text-lg">HSK 4 FOKUS</h4>
                <p className="text-red-100 text-sm font-medium">HSK 4 verdoppelt den Wortschatz erneut. Wir haben Hunderte neue Begriffe aus Bereichen wie Wirtschaft und Wissenschaft hinzugefügt.</p>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default App;
