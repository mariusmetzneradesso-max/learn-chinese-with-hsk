import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useAuth } from './contexts/AuthContext';
import { useUserProgress } from './hooks/useUserProgress';
import { BookOpen, Image as ImageIcon, Languages, Download, Sparkles, RefreshCw, Search, Volume2, GraduationCap, ChevronDown, Play, BrainCircuit, LogIn, LogOut, Lock } from 'lucide-react';
import {
  hsk1Vocab, hsk2Vocab, hsk3Vocab, hsk4Vocab, hsk5Vocab, hsk6Vocab,
  hsk1New, hsk2New, hsk3New, hsk4New, hsk5New, hsk6New, hsk7New, hsk8New, hsk9New
} from './vocabulary';

import Quiz from './Quiz';
import LoginModal from './components/LoginModal';
import Footer from './components/Footer';
import Impressum from './components/Impressum';
import TermsOfUse from './components/TermsOfUse';

const App = () => {
  const { currentUser, signInWithGoogle, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('vocabulary');
  const [hskLevel, setHskLevel] = useState(1);
  const [hskVersion, setHskVersion] = useState('new'); // 'old' (2.0) or 'new' (3.0)
  const [targetLang, setTargetLang] = useState('de');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState(null);
  const [prompt, setPrompt] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [voices, setVoices] = useState([]);
  const [selectedVoiceIndex, setSelectedVoiceIndex] = useState(0);
  const [voiceDropdownOpen, setVoiceDropdownOpen] = useState(false);
  const voiceDropdownRef = useRef(null);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (voiceDropdownRef.current && !voiceDropdownRef.current.contains(event.target)) {
        setVoiceDropdownOpen(false);
      }
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Load available Chinese voices (including dialects)
  useEffect(() => {
    const loadVoices = () => {
      const allVoices = window.speechSynthesis.getVoices();
      // Include all Chinese dialects: Mandarin (zh-CN), Taiwan (zh-TW), 
      // Cantonese (yue, zh-HK), Wu/Shanghainese (wuu), and more
      const chineseVoices = allVoices.filter(voice => {
        const lang = voice.lang.toLowerCase();
        return lang.startsWith('zh') ||
          lang.startsWith('yue') ||    // Cantonese
          lang.startsWith('wuu') ||    // Wu/Shanghainese
          lang.includes('chinese') ||
          lang.includes('cantonese') ||
          lang.includes('mandarin');
      });

      if (chineseVoices.length > 0) {
        // Sort by dialect type for better organization
        const sorted = chineseVoices.sort((a, b) => {
          const getPriority = (v) => {
            const lang = v.lang.toLowerCase();
            if (lang.includes('cn') || lang === 'zh') return 1;  // Mandarin first
            if (lang.includes('tw')) return 2;                   // Taiwan
            if (lang.includes('hk') || lang.startsWith('yue')) return 3; // Cantonese
            if (lang.startsWith('wuu')) return 4;                // Wu/Shanghainese
            return 5;
          };
          return getPriority(a) - getPriority(b);
        });
        setVoices(sorted);

        // Restore saved voice preference
        const savedVoiceURI = localStorage.getItem('hsk_voice_uri');
        if (savedVoiceURI) {
          const savedIndex = sorted.findIndex(v => v.voiceURI === savedVoiceURI);
          if (savedIndex !== -1) {
            setSelectedVoiceIndex(savedIndex);
          }
        }
      }
    };

    loadVoices();
    // Some browsers load voices asynchronously
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  const languages = { de: "Deutsch", en: "English", es: "Español", ar: "العربية", hi: "हिन्दी" };

  const appTranslations = {
    de: {
      progress: "Fortschritt",
      found: "gefunden",
      of: "von",
      words: "Wörter",
      voice: "Stimme",
      selectVoice: "Stimme auswählen",
      searchPlaceholder: "Suche (Zeichen, Pinyin, ...)",
      testVoice: "Stimme testen",
      enterTopic: "Thema eingeben",
      generate: "Generieren",
      preview: "Vorschau",
      save: "SPEICHERN",
      learningPoster: "LERNPOSTER",
      level: "Level",
      language: "Sprache",
      creatingPoster: "KI entwirft Lernposter...",
      hskFocusTitle: "HSK 4 FOKUS",
      hskFocusText: "HSK 4 verdoppelt den Wortschatz erneut. Wir haben Hunderte neue Begriffe aus Bereichen wie Wirtschaft und Wissenschaft hinzugefügt.",
      lockedSuffix: "ist gesperrt",
      lockedText: "Melde dich jetzt kostenlos an, um Zugriff auf alle HSK-Level von 1 bis 6 zu erhalten, deinen Lernfortschritt zu speichern und mehr."

    },
    en: {
      progress: "Progress",
      found: "found",
      of: "of",
      words: "Words",
      voice: "Voice",
      selectVoice: "Select Voice",
      searchPlaceholder: "Search (Char, Pinyin, ...)",
      testVoice: "Test voice",
      enterTopic: "Enter Topic",
      generate: "Generate",
      preview: "Preview",
      save: "SAVE",
      learningPoster: "LEARNING POSTER",
      level: "Level",
      language: "Language",
      creatingPoster: "AI creating poster...",
      hskFocusTitle: "HSK 4 FOCUS",
      hskFocusText: "HSK 4 doubles the vocabulary again. We added hundreds of new terms from fields like business and science.",
      lockedSuffix: "is locked",
      lockedText: "Sign up for free now to get access to all HSK levels from 1 to 6, save your learning progress, and more."
    },
    es: {
      progress: "Progreso",
      found: "encontrado",
      of: "de",
      words: "Palabras",
      voice: "Voz",
      selectVoice: "Seleccionar voz",
      searchPlaceholder: "Buscar (Carácter, Pinyin, ...)",
      testVoice: "Probar voz",
      enterTopic: "Introducir tema",
      generate: "Generar",
      preview: "Vista previa",
      save: "GUARDAR",
      learningPoster: "PÓSTER DE APRENDIZAJE",
      level: "Nivel",
      language: "Idioma",
      creatingPoster: "IA creando póster...",
      hskFocusTitle: "ENFOQUE HSK 4",
      hskFocusText: "HSK 4 duplica el vocabulario de nuevo. Hemos añadido cientos de términos nuevos de campos como negocios y ciencia.",
      lockedSuffix: "está bloqueado",
      lockedText: "Regístrate gratis ahora para obtener acceso a todos los niveles HSK del 1 al 6, guardar tu progreso de aprendizaje y más."
    },
    ar: {
      progress: "تقدم",
      found: "وجد",
      of: "من",
      words: "كلمات",
      voice: "صوت",
      selectVoice: "اختر الصوت",
      searchPlaceholder: "بحث (رمز، بينيين، ...)",
      testVoice: "اختبار الصوت",
      enterTopic: "أدخل الموضوع",
      generate: "توليد",
      preview: "معاينة",
      save: "حفظ",
      learningPoster: "ملصق تعليمي",
      level: "مستوى",
      language: "لغة",
      creatingPoster: "الذكاء الاصطناعي ينشئ ملصقًا...",
      hskFocusTitle: "تركيز HSK 4",
      hskFocusText: "HSK 4 يضاعف المفردات مرة أخرى. أضفنا مئات المصطلحات الجديدة من مجالات مثل الأعمال والعلوم.",
      lockedSuffix: "مغلق",
      lockedText: "سجل مجاناً الآن للحصول على حق الوصول إلى جميع مستويات HSK من 1 إلى 6، وحفظ تقدمك في التعلم والمزيد."
    },
    hi: {
      progress: "प्रगति",
      found: "मिला",
      of: "का",
      words: "शब्द",
      voice: "आवाज़",
      selectVoice: "आवाज़ चुनें",
      searchPlaceholder: "खोजें (वर्ण, पिनयिन, ...)",
      testVoice: "आवाज़ का परीक्षण करें",
      enterTopic: "विषय दर्ज करें",
      generate: "उत्पन्न करें",
      preview: "पूर्वावलोकन",
      save: "सहेजें",
      learningPoster: "सीखने का पोस्टर",
      level: "स्तर",
      language: "भाषा",
      creatingPoster: "AI पोस्टर बना रहा है...",
      hskFocusTitle: "HSK 4 फोकस",
      hskFocusText: "HSK 4 फिर से शब्दावली को दोगुना करता है। हमने व्यापार और विज्ञान जैसे क्षेत्रों से सैकड़ों नए शब्द जोड़े हैं।",
      lockedSuffix: "लॉक है",
      lockedText: "1 से 6 तक के सभी HSK स्तरों तक पहुँच प्राप्त करने, अपनी सीखने की प्रगति को सहेजने और अधिक के लिए अभी निःशुल्क साइन अप करें।"
    }
  };

  const appT = appTranslations[targetLang] || appTranslations.de;


  const currentVocab = useMemo(() => {
    if (hskVersion === 'new') {
      if (hskLevel === 1) return hsk1New;
      if (hskLevel === 2) return hsk2New;
      if (hskLevel === 3) return hsk3New;
      if (hskLevel === 4) return hsk4New;
      if (hskLevel === 5) return hsk5New;
      if (hskLevel === 6) return hsk6New;
      if (hskLevel === 7) return [...hsk7New, ...hsk8New, ...hsk9New];
      return hsk1New;
    }
    if (hskLevel === 1) return hsk1Vocab;
    if (hskLevel === 2) return hsk2Vocab;
    if (hskLevel === 3) return hsk3Vocab;
    if (hskLevel === 4) return hsk4Vocab;
    if (hskLevel === 5) return hsk5Vocab;
    return hsk6Vocab;
  }, [hskLevel, hskVersion]);

  const targetCount = useMemo(() => {
    if (hskVersion === 'new') {
      // Approximate counts for HSK 3.0
      // Level 1: 500, 2: 772, 3: 973, 4: 1000, 5: 1071, 6: 1140, 7-9: ~5636 (cumulative 11092)
      // Adjust these numbers based on actual lists later
      const counts = { 1: 500, 2: 1272, 3: 2245, 4: 3245, 5: 4316, 6: 5456, 7: 5636 };
      return counts[hskLevel] || 500;
    }
    return hskLevel === 6 ? 2500 : (hskLevel === 5 ? 1300 : (hskLevel === 4 ? 600 : (hskLevel === 3 ? 300 : 150)));
  }, [hskLevel, hskVersion]);

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

  // Progress tracking
  const { markAsClicked, getProgressCount } = useUserProgress(currentUser);

  // Count clicked words for current level
  const progressCount = useMemo(() => {
    return getProgressCount(hskLevel);
  }, [hskLevel, getProgressCount]);

  // Count filtered words (search results)
  const searchResultCount = useMemo(() => {
    return Object.values(categorizedVocab).reduce((sum, arr) => sum + arr.length, 0);
  }, [categorizedVocab]);

  const speak = (text) => {
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'zh-CN';

    // Use selected voice if available
    if (voices.length > 0 && voices[selectedVoiceIndex]) {
      utterance.voice = voices[selectedVoiceIndex];
    }

    window.speechSynthesis.speak(utterance);
  };

  // Helper to get a friendly voice name with dialect info
  const getVoiceInfo = (voice) => {
    const lang = voice.lang.toLowerCase();
    const name = voice.name.toLowerCase();

    // Determine dialect
    let dialect = '普通话';
    let dialectEmoji = '🇨🇳';
    if (lang.includes('hk') || lang.startsWith('yue') || name.includes('cantonese')) {
      dialect = '粤语 (Kantonesisch)';
      dialectEmoji = '🇭🇰';
    } else if (lang.includes('tw')) {
      dialect = '台湾 (Taiwan)';
      dialectEmoji = '🇹🇼';
    } else if (lang.startsWith('wuu') || name.includes('shanghai') || name.includes('wu')) {
      dialect = '吴语 (Shanghai)';
      dialectEmoji = '🏙️';
    }

    // Determine gender/type
    let genderEmoji = '🗣️';
    if (name.includes('female') || name.includes('woman') || name.includes('tingting') ||
      name.includes('lili') || name.includes('yaoyao') || name.includes('huihui') ||
      name.includes('sinji') || name.includes('meijia')) {
      genderEmoji = '👩';
    } else if (name.includes('male') || name.includes('man') || name.includes('kangkang') ||
      name.includes('yafang') || name.includes('zhiwei')) {
      genderEmoji = '👨';
    } else if (name.includes('child') || name.includes('kid') || name.includes('xiaoxiao')) {
      genderEmoji = '👧';
    }

    // Extract short name
    let shortName = voice.name;
    // Remove common prefixes for cleaner display
    shortName = shortName.replace(/Microsoft /gi, '')
      .replace(/Google /gi, '')
      .replace(/Apple /gi, '')
      .replace(/ \(.*\)$/gi, '')
      .trim();

    return {
      fullName: voice.name,
      shortName,
      dialect,
      dialectEmoji,
      genderEmoji,
      displayName: `${genderEmoji} ${shortName}`,
      groupLabel: `${dialectEmoji} ${dialect}`
    };
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
            {['de', 'en', 'es', 'ar', 'hi'].map(lang => (
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
            <button onClick={() => setActiveTab('quiz')}
              className={`p-2.5 rounded-xl transition-all ${activeTab === 'quiz' ? 'bg-red-50 text-red-600 shadow-sm' : 'text-slate-400'}`}>
              <BrainCircuit size={20} />
            </button>
          </div>

          <div className="pl-2 ml-2 border-l border-slate-200">
            {currentUser ? (
              <div className="relative" ref={profileMenuRef}>
                <button
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  className="block rounded-full overflow-hidden transition-transform hover:scale-105 flex-shrink-0"
                  style={{ width: '32px', height: '32px', minWidth: '32px', borderRadius: '50%' }}
                >
                  <img
                    src={currentUser.photoURL}
                    alt={currentUser.displayName}
                    className="w-full h-full object-cover max-w-full block"
                    title={currentUser.displayName}
                    referrerPolicy="no-referrer"
                    style={{ width: '100%', height: '100%', borderRadius: '50%' }}
                  />
                </button>
                {profileMenuOpen && (
                  <div className="absolute right-0 top-12 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="p-3 border-b border-slate-50 mb-1">
                      <p className="text-sm font-black text-slate-800 truncate">{currentUser.displayName}</p>
                      <p className="text-xs text-slate-400 truncate">{currentUser.email}</p>
                    </div>
                    <button
                      onClick={() => {
                        logout();
                        setProfileMenuOpen(false); // Close menu on logout
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <LogOut size={14} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="flex items-center gap-2 bg-red-600 text-white px-4 py-2.5 rounded-xl font-bold text-xs shadow-lg hover:bg-red-700 transition-all hover:scale-105"
              >
                <LogIn size={16} />
                <span className="hidden sm:inline">Login</span>
              </button>
            )}
          </div>
        </div>
      </nav >

      <main className="max-w-screen-2xl mx-auto px-4 sm:px-8 pt-8">
        <div className={activeTab === 'vocabulary' ? 'block' : 'hidden'}>
          <section className="space-y-10 animate-in">
            <div className="flex flex-col lg:flex-row gap-6 items-center justify-between bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm">
              <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                <div className="w-full flex flex-col gap-4">
                  {/* HSK Version Toggle */}
                  <div className="flex gap-2 p-1 bg-slate-100 rounded-2xl w-fit">
                    <button
                      onClick={() => { setHskVersion('old'); setHskLevel(1); setSearchTerm(""); }}
                      className={`px-4 py-2 rounded-xl text-sm font-black transition-all ${hskVersion === 'old' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                      Old HSK (2.0)
                    </button>
                    <button
                      onClick={() => { setHskVersion('new'); setHskLevel(1); setSearchTerm(""); }}
                      className={`px-4 py-2 rounded-xl text-sm font-black transition-all ${hskVersion === 'new' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                      New HSK (3.0)
                    </button>
                  </div>

                  <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-100 overflow-x-auto max-w-full no-scrollbar">
                    {(hskVersion === 'old' ? [1, 2, 3, 4, 5, 6] : [1, 2, 3, 4, 5, 6, 7]).map(lvl => {
                      const isLocked = !currentUser && lvl > 1;
                      let label = `HSK ${lvl}`;
                      if (hskVersion === 'new' && lvl === 7) label = "HSK 7-9";

                      return (
                        <button key={lvl} onClick={() => { setHskLevel(lvl); setSearchTerm(""); }}
                          className={`relative px-3 sm:px-4 lg:px-5 xl:px-6 py-3 rounded-xl font-black text-sm transition-all flex-shrink-0 whitespace-nowrap ${hskLevel === lvl ? 'bg-red-600 text-white shadow-xl scale-105' : 'text-slate-500'} ${isLocked ? 'defaut-cursor' : ''}`}>
                          <span>{label}</span>
                          {isLocked && (
                            <div className="absolute flex items-center justify-center" style={{ top: 0, left: 0, width: '100%', height: '100%', zIndex: 10 }}>
                              <Lock size={24} className="text-slate-400 opacity-25" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">{appT.progress}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-slate-800">
                      {searchTerm ? `${searchResultCount} ${appT.found}` : `${progressCount} ${appT.of} ${targetCount}`}
                    </span>
                    <div style={{ width: '6rem', height: '0.375rem', backgroundColor: '#f1f5f9', borderRadius: '9999px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', backgroundColor: progressCount >= targetCount ? '#22c55e' : '#f59e0b', width: `${Math.min((progressCount / targetCount) * 100, 100)}%` }}></div>
                    </div>
                    <span className="text-xs font-bold text-slate-400">{appT.words}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4 w-full lg:w-auto">
                <div className="relative flex-1 lg:w-64">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <input type="text" placeholder={`${appT.searchPlaceholder}`}
                    value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-6 py-4 bg-slate-100 border border-slate-100 rounded-2xl outline-none transition-all text-sm font-medium"
                    style={{ backgroundColor: '#f8fafc' }} />
                </div>
                {voices.length > 0 && (
                  <div className="relative" ref={voiceDropdownRef}>
                    {/* Dropdown Trigger */}
                    <button
                      onClick={() => setVoiceDropdownOpen(!voiceDropdownOpen)}
                      className="flex items-center gap-3 bg-white px-4 py-3 rounded-2xl border-2 transition-all hover:border-red-200"
                      style={{
                        borderColor: voiceDropdownOpen ? '#fca5a5' : '#e2e8f0',
                        boxShadow: voiceDropdownOpen ? '0 4px 12px rgba(239, 68, 68, 0.15)' : '0 1px 3px rgba(0,0,0,0.05)'
                      }}
                    >
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-sm">
                        <Volume2 size={16} className="text-white" />
                      </div>
                      <div className="text-left">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{appT.voice}</p>
                        <p className="text-sm font-bold text-slate-700">
                          {voices[selectedVoiceIndex] && getVoiceInfo(voices[selectedVoiceIndex]).shortName}
                        </p>
                      </div>
                      <ChevronDown
                        size={18}
                        className={`text-slate-400 transition-transform ${voiceDropdownOpen ? 'rotate-180' : ''}`}
                      />
                    </button>

                    {/* Dropdown Menu */}
                    {voiceDropdownOpen && (
                      <div
                        className="absolute top-full right-0 mt-2 bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden"
                        style={{ minWidth: '280px', zIndex: 9999 }}
                      >
                        <div className="p-3 border-b border-slate-100 bg-slate-50">
                          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{appT.selectVoice}</p>
                        </div>
                        <div className="max-h-64 overflow-y-auto p-2">
                          {voices.map((voice, idx) => {
                            const info = getVoiceInfo(voice);
                            const isSelected = selectedVoiceIndex === idx;
                            return (
                              <div
                                key={idx}
                                className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${isSelected
                                  ? 'bg-red-50 border-2 border-red-200'
                                  : 'hover:bg-slate-50 border-2 border-transparent'
                                  }`}
                                onClick={() => {
                                  setSelectedVoiceIndex(idx);
                                  // Save preference
                                  localStorage.setItem('hsk_voice_uri', voice.voiceURI);
                                  setVoiceDropdownOpen(false);
                                }}
                              >
                                <span className="text-2xl">{info.dialectEmoji}</span>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-bold text-slate-700 truncate">
                                    {info.genderEmoji} {info.shortName}
                                  </p>
                                  <p className="text-xs text-slate-400">{info.dialect}</p>
                                </div>
                                {isSelected && (
                                  <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center">
                                    <div className="w-2 h-2 bg-white rounded-full"></div>
                                  </div>
                                )}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const utterance = new SpeechSynthesisUtterance('你好');
                                    utterance.voice = voice;
                                    window.speechSynthesis.cancel();
                                    window.speechSynthesis.speak(utterance);
                                  }}
                                  className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-red-100 flex items-center justify-center transition-colors"
                                  title={appT.testVoice}
                                >
                                  <Play size={14} className="text-slate-500" />
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {(!currentUser && hskLevel > 1) ? (
              <div className="flex flex-col items-center justify-center py-20 animate-in fade-in slide-in-from-bottom-4 text-center px-4">
                <div className="bg-red-50 p-6 rounded-full mb-6">
                  <Lock size={48} className="text-red-600" />
                </div>
                <h2 className="text-3xl font-black text-slate-800 mb-4">HSK {hskLevel} {appT.lockedSuffix}</h2>
                <p className="text-slate-500 max-w-md mb-8 text-lg font-medium">
                  {appT.lockedText}
                </p>
                <button
                  onClick={() => setIsLoginModalOpen(true)}
                  className="flex items-center gap-3 bg-red-600 text-white px-8 py-4 rounded-2xl font-black text-lg shadow-xl hover:bg-red-700 transition-all hover:scale-105"
                >
                  <LogIn size={20} />
                  Jetzt anmelden
                </button>
              </div>
            ) : (
              Object.keys(categorizedVocab).sort().map(cat => (
                <div key={cat} className="space-y-4">
                  <div className="flex items-center gap-3 px-2">
                    <div style={{ height: '1.5rem', width: '0.375rem', backgroundColor: '#dc2626', borderRadius: '9999px' }}></div>
                    <h2 className="text-lg font-black tracking-tight text-slate-800 uppercase">{cat}</h2>
                    <span className="text-xs font-bold text-slate-400 bg-white border border-slate-200 px-2 py-0.5 rounded-full">{categorizedVocab[cat].length}</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {categorizedVocab[cat].map((item, idx) => (
                      <div key={idx} onClick={() => { markAsClicked(hskLevel, item.char); speak(item.char); }} className="group bg-white p-6 rounded-[32px] border border-slate-200 transition-all text-center relative overflow-hidden flex flex-col items-center justify-center min-h-[220px]"
                        style={{ cursor: 'pointer', userSelect: 'text', WebkitUserSelect: 'text' }}
                        onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#f87171'; e.currentTarget.style.boxShadow = '0 25px 50px -12px rgba(239, 68, 68, 0.1)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.boxShadow = 'none'; }}>
                        <div className="absolute top-4 right-4 text-slate-200">
                          <Volume2 size={16} />
                        </div>
                        <span className="text-5xl mb-4 transition-transform duration-300" style={{ display: 'block' }}>{item.icon}</span>
                        <h3 className="text-3xl font-black text-slate-800 leading-tight" style={{ userSelect: 'text', WebkitUserSelect: 'text' }}>{item.char}</h3>
                        <p className="text-slate-400 font-bold text-xs italic mt-1" style={{ userSelect: 'text', WebkitUserSelect: 'text' }}>{item.pinyin}</p>
                        <div className="mt-4 pt-3 border-t border-slate-100 w-full">
                          <p className="text-slate-600 font-bold text-sm line-clamp-2" style={{ userSelect: 'text', WebkitUserSelect: 'text' }}>{item[targetLang]}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )))}
          </section>
        </div>

        <div className={activeTab === 'graphics' ? 'block' : 'hidden'}>
          <section className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom-6">
            <div className="bg-white p-10 rounded-[48px] border border-slate-200 shadow-sm relative overflow-hidden">
              <header className="mb-10 text-center sm:text-left">
                <h2 className="text-4xl font-black tracking-tight mb-2 italic">LERN<span className="text-red-600">POSTER</span></h2>
                <p className="text-slate-500 font-medium italic">{appT.level}: HSK {hskLevel} | {appT.language}: {languages[targetLang]}</p>
              </header>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">{appT.enterTopic}</label>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input type="text" value={prompt} onChange={(e) => setPrompt(e.target.value)}
                      className="flex-1 px-6 py-5 rounded-[24px] bg-slate-100 border border-slate-100 outline-none transition-all font-medium"
                      placeholder="Z.B. Wetter in China, Büroarbeit, etc." style={{ backgroundColor: '#f8fafc' }} />
                    <button onClick={generateNewGraphic} disabled={isGenerating || !prompt}
                      className="bg-red-600 text-white px-10 py-5 rounded-[24px] font-black flex items-center justify-center gap-3 shadow-xl transition-all"
                      style={{ opacity: (isGenerating || !prompt) ? 0.5 : 1 }}>
                      {isGenerating ? <RefreshCw className="animate-spin" size={20} /> : <Sparkles size={20} />}
                      {appT.generate}
                    </button>
                  </div>
                </div>
              </div>
              {isGenerating && (
                <div className="mt-12 flex flex-col items-center justify-center p-16 bg-slate-100 rounded-[40px] border border-slate-100 animate-pulse">
                  <RefreshCw className="text-red-600 animate-spin mb-4" size={48} />
                  <p className="text-slate-400 font-black text-sm uppercase tracking-widest">{appT.creatingPoster}</p>
                </div>
              )}
              {generatedImageUrl && !isGenerating && (
                <div className="mt-12 space-y-6 zoom-in-95">
                  <div className="flex justify-between items-center px-2">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{appT.preview}</span>
                    <button onClick={() => { const link = document.createElement('a'); link.href = generatedImageUrl; link.download = `HSK${hskLevel}_Graphic.png`; link.click(); }}
                      className="text-red-600 font-black text-xs flex items-center gap-1">
                      <Download size={14} /> {appT.save}
                    </button>
                  </div>
                  <img src={generatedImageUrl} className="w-full rounded-[40px] shadow-2xl border border-slate-200" alt="Generated Poster" />
                </div>
              )}
            </div>
            <div className="p-8 bg-red-600 rounded-[32px] text-white shadow-xl flex items-center gap-6">
              <GraduationCap size={48} className="opacity-50" />
              <div>
                <h4 className="font-black text-lg">{appT.hskFocusTitle}</h4>
                <p className="text-red-100 text-sm font-medium">{appT.hskFocusText}</p>
              </div>
            </div>
          </section>
        </div>

        <div className={activeTab === 'quiz' ? 'block' : 'hidden'}>
          <Quiz
            vocabData={currentVocab}
            hskLevel={hskLevel}
            setHskLevel={setHskLevel}
            targetLang={targetLang}
            speak={speak}
            isActive={activeTab === 'quiz'}
            onLoginClick={() => setIsLoginModalOpen(true)}
          />
        </div>

        {activeTab === 'impressum' && (
          <Impressum onBack={() => setActiveTab('vocabulary')} targetLang={targetLang} />
        )}

        {activeTab === 'terms' && (
          <TermsOfUse onBack={() => setActiveTab('vocabulary')} targetLang={targetLang} />
        )}
      </main>

      {/* Only show Footer if not in nested legal pages, or show everywhere? 
          Usually legal pages are terminal, but users might want to switch between them.
          Let's show it everywhere, but the content above changes. 
          Actually, the footer is navigation to these pages. */}
      {activeTab !== 'impressum' && activeTab !== 'terms' && (
        <Footer onNavigate={setActiveTab} targetLang={targetLang} />
      )}

      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} targetLang={targetLang} />
    </div >
  );
};

export default App;
