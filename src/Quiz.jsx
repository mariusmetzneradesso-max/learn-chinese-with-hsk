import React, { useState, useEffect, useMemo, useRef } from 'react';
import { HelpCircle, CheckCircle, XCircle, RefreshCw, Trophy, ArrowRight, Volume2, ArrowLeftRight, Lock, LogIn } from 'lucide-react';
import { useQuizStats } from './hooks/useQuizStats';
import { useAuth } from './contexts/AuthContext';

const Quiz = ({ vocabData, hskLevel, setHskLevel, targetLang = 'de', speak, isActive = true, onLoginClick }) => {
    const { currentUser } = useAuth();
    const { stats, updateStats, loading: statsLoading } = useQuizStats(currentUser);
    const { score, totalAnswered, streak } = stats;

    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [options, setOptions] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);
    const [isCorrect, setIsCorrect] = useState(null);
    const [gameMode, setGameMode] = useState('char-to-meaning'); // 'char-to-meaning' or 'meaning-to-char'

    // UI Translations
    const translations = {
        de: {
            noVocab: "Keine Vokabeln verfügbar für dieses Level.",
            whatMeansChar: "Was bedeutet dieses Zeichen?",
            whichChar: "Welches Zeichen ist das?",
            whatHear: "Was hören Sie?",
            clickRepeat: "Zum Wiederholen klicken",
            nextQuestion: "Nächste Frage",
            score: "Score",
            streak: "Streak",
            noStreak: "Noch kein Streak"
        },
        en: {
            noVocab: "No vocabulary available for this level.",
            whatMeansChar: "What does this character mean?",
            whichChar: "Which character is this?",
            whatHear: "What do you hear?",
            clickRepeat: "Click to repeat",
            nextQuestion: "Next Question",
            score: "Score",
            streak: "Streak",
            noStreak: "No streak yet"
        },
        es: {
            noVocab: "No hay vocabulario disponible para este nivel.",
            whatMeansChar: "¿Qué significa este carácter?",
            whichChar: "¿Qué carácter es este?",
            whatHear: "¿Qué escuchas?",
            clickRepeat: "Haz clic para repetir",
            nextQuestion: "Siguiente Pregunta",
            score: "Puntuación",
            streak: "Racha",
            noStreak: "Sin racha aún"
        },
        ar: {
            noVocab: "لا توجد مفردات متاحة لهذا المستوى.",
            whatMeansChar: "ماذا يعني هذا الرمز؟",
            whichChar: "أي رمز هذا؟",
            whatHear: "ماذا تسمع؟",
            clickRepeat: "اضغط للتكرار",
            nextQuestion: "السؤال التالي",
            score: "النتيجة",
            streak: "تتابع",
            noStreak: "لا يوجد تتابع بعد"
        },
        hi: {
            noVocab: "इस स्तर के लिए कोई शब्दावली उपलब्ध नहीं है.",
            whatMeansChar: "इस वर्ण का क्या अर्थ है?",
            whichChar: "यह कौन सा वर्ण है?",
            whatHear: "आप क्या सुन रहे हैं?",
            clickRepeat: "दोहराने के लिए क्लिक करें",
            nextQuestion: "अगला प्रश्न",
            score: "स्कोर",
            streak: "लगातार जीत",
            noStreak: "अभी कोई लगातार जीत नहीं"
        },
        locked: {
            de: {
                title: "HSK Level gesperrt",
                desc: "Melde dich kostenlos an, um Zugriff auf alle HSK-Level und Statistiken zu erhalten.",
                button: "Jetzt anmelden"
            },
            en: {
                title: "HSK Level Locked",
                desc: "Sign up for free to access all HSK levels and track your progress.",
                button: "Sign Up Now"
            },
            es: {
                title: "Nivel HSK Bloqueado",
                desc: "Regístrate gratis para acceder a todos los niveles HSK y guardar tu progreso.",
                button: "Regístrate Ahora"
            },
            ar: {
                title: "مستوى HSK مقفل",
                desc: "سجل مجاناً للوصول إلى جميع مستويات HSK وحفظ تقدمك.",
                button: "سجل الآن"
            },
            hi: {
                title: "HSK स्तर लॉक है",
                desc: "सभी HSK स्तरों तक पहुँचने और अपनी प्रगति को ट्रैक करने के लिए निःशुल्क साइन अप करें।",
                button: "अभी साइन अप करें"
            }
        }
    };

    const t = translations[targetLang] || translations.de;


    const getFlag = (lang) => {
        switch (lang) {
            case 'en': return '🇬🇧';
            case 'es': return '🇪🇸';
            case 'ar': return '🇸🇦';
            case 'hi': return '🇮🇳';
            default: return '🇩🇪';
        }
    };

    const targetFlag = getFlag(targetLang);

    // Helper to get random items from array
    const getRandomItems = (arr, n) => {
        const result = new Set();
        while (result.size < n && result.size < arr.length) {
            const randomIndex = Math.floor(Math.random() * arr.length);
            result.add(arr[randomIndex]);
        }
        return Array.from(result);
    };

    const generateQuestion = () => {
        if (!vocabData || vocabData.length < 4) return;

        // Pick 1 correct answer logic
        const correct = vocabData[Math.floor(Math.random() * vocabData.length)];

        // Pick 3 distractors
        let distractors = [];
        while (distractors.length < 3) {
            const randomItem = vocabData[Math.floor(Math.random() * vocabData.length)];
            if (randomItem.char !== correct.char && !distractors.find(d => d.char === randomItem.char)) {
                distractors.push(randomItem);
            }
        }

        // Combine and shuffle
        const allOptions = [correct, ...distractors].sort(() => Math.random() - 0.5);

        setCurrentQuestion(correct);
        setOptions(allOptions);
        setSelectedOption(null);
        setIsCorrect(null);
    };

    // Initialize first question
    useEffect(() => {
        if (vocabData && vocabData.length > 0) {
            generateQuestion();
        }
    }, [vocabData, hskLevel, gameMode]);

    // Play audio when question changes if in listening mode
    useEffect(() => {
        if (isActive && gameMode === 'audio-to-meaning' && currentQuestion && speak) {
            // Include a small delay to ensure UI is ready and it feels natural
            const timer = setTimeout(() => {
                speak(currentQuestion.char);
            }, 500);
            return () => {
                clearTimeout(timer);
                window.speechSynthesis.cancel();
            };
        }
    }, [currentQuestion, gameMode, speak, isActive]);

    const handleOptionClick = (option) => {
        if (selectedOption) return; // Prevent multiple clicks

        setSelectedOption(option);
        const correct = option.char === currentQuestion.char;
        setIsCorrect(correct);

        const newStats = { ...stats, totalAnswered: stats.totalAnswered + 1 };

        if (correct) {
            newStats.score = stats.score + 1;
            newStats.streak = stats.streak + 1;
        } else {
            newStats.streak = 0;
        }
        updateStats(newStats);
    };

    const nextQuestion = () => {
        generateQuestion();
    };

    if (!vocabData || vocabData.length === 0) {
        return <div className="text-center p-10 text-slate-400">{t.noVocab}</div>;
    }

    if (!currentQuestion) return null;

    return (
        <section className="max-w-3xl mx-auto space-y-8 animate-in slide-in-from-bottom-6">

            {/* Controls: HSK Level & Game Mode */}
            <div className="bg-white p-4 rounded-[24px] border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex gap-1 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-hide">
                    {[1, 2, 3, 4, 5, 6].map(lvl => {
                        const isLocked = !currentUser && lvl > 1;
                        return (
                            <button
                                key={lvl}
                                onClick={() => setHskLevel(lvl)}
                                className={`relative px-4 py-2 rounded-xl text-sm font-black transition-all whitespace-nowrap flex items-center justify-center gap-2 ${hskLevel === lvl ? 'bg-red-600 text-white shadow-md' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                            >
                                <span>HSK {lvl}</span>
                                {isLocked && <Lock size={12} className={hskLevel === lvl ? "text-red-200" : "text-slate-300"} />}
                            </button>
                        );
                    })}
                </div>

                <div className="flex bg-slate-100 p-1 rounded-xl shadow-inner border border-slate-200">
                    <button
                        onClick={() => setGameMode('char-to-meaning')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all ${gameMode === 'char-to-meaning' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        🇨🇳 ⮕ {targetFlag}
                    </button>
                    <button
                        onClick={() => setGameMode('meaning-to-char')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all ${gameMode === 'meaning-to-char' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        {targetFlag} ⮕ 🇨🇳
                    </button>
                    <button
                        onClick={() => setGameMode('audio-to-meaning')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all ${gameMode === 'audio-to-meaning' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        🔊 ⮕ {targetFlag}
                    </button>
                </div>
            </div>

            {/* Header / Stats */}
            <div className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className={`p-4 rounded-2xl ${streak > 2 ? 'bg-orange-100 text-orange-600' : 'bg-slate-100 text-slate-500'}`}>
                        <Trophy size={24} className={streak > 2 ? 'animate-bounce' : ''} />
                    </div>
                    <div>
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{t.score}</p>
                        <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-black text-slate-800">{score}</span>
                            <span className="text-sm font-bold text-slate-400">/ {totalAnswered}</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-sm font-bold text-slate-500">{t.streak}:</span>
                    <div className="flex gap-1">
                        {Array.from({ length: Math.min(streak, 5) }).map((_, i) => (
                            <span key={i}>🔥</span>
                        ))}
                        {streak === 0 && <span className="text-slate-300">{t.noStreak}</span>}
                    </div>
                </div>
            </div>

            {/* Locked State Overlay or Content */}
            {(!currentUser && hskLevel > 1) ? (
                <div className="bg-white p-12 rounded-[48px] border-2 border-slate-100 shadow-xl text-center flex flex-col items-center justify-center min-h-[400px] animate-in fade-in slide-in-from-bottom-4">
                    <div className="bg-red-50 p-6 rounded-full mb-6">
                        <Lock size={48} className="text-red-600" />
                    </div>
                    <h2 className="text-3xl font-black text-slate-800 mb-4">
                        {(translations.locked[targetLang] || translations.locked.de).title}
                    </h2>
                    <p className="text-slate-500 max-w-md mb-8 text-lg font-medium">
                        {(translations.locked[targetLang] || translations.locked.de).desc}
                    </p>
                    <button
                        onClick={onLoginClick}
                        className="flex items-center gap-3 bg-red-600 text-white px-8 py-4 rounded-2xl font-black text-lg shadow-xl hover:bg-red-700 transition-all hover:scale-105"
                    >
                        <LogIn size={20} />
                        {(translations.locked[targetLang] || translations.locked.de).button}
                    </button>
                </div>
            ) : (
                /* Question Card */
                <div className="bg-white p-8 sm:p-12 rounded-[48px] border-2 border-slate-100 shadow-xl text-center relative overflow-hidden">

                    <span className="inline-block px-4 py-1 rounded-full bg-red-50 text-red-600 text-xs font-black uppercase tracking-widest mb-6">
                        {gameMode === 'char-to-meaning' ? t.whatMeansChar : (gameMode === 'meaning-to-char' ? t.whichChar : t.whatHear)}
                    </span>

                    {gameMode === 'audio-to-meaning' ? (
                        <div className="flex flex-col items-center justify-center mb-10">
                            <button
                                onClick={() => speak(currentQuestion.char)}
                                className="w-32 h-32 rounded-full bg-red-600 text-white shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center mb-4"
                            >
                                <Volume2 size={48} />
                            </button>
                            <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">{t.clickRepeat}</p>
                        </div>
                    ) : (
                        <h2 className={`font-black text-slate-800 mb-2 ${gameMode === 'char-to-meaning' ? 'text-8xl' : 'text-4xl'}`}>
                            {gameMode === 'char-to-meaning' ? currentQuestion.char : (currentQuestion[targetLang] || currentQuestion.en)}
                        </h2>
                    )}
                    {gameMode === 'char-to-meaning' && (
                        <p className="text-slate-400 text-2xl font-medium italic mb-6">{currentQuestion.pinyin}</p>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                        {options.map((opt, idx) => {
                            const isSelected = selectedOption === opt;
                            const isTheCorrectAnswer = opt === currentQuestion;

                            let updateStyle = "border-slate-200";
                            // Only add hover effects if no option is selected
                            if (!selectedOption) {
                                updateStyle += " hover:border-slate-300 hover:bg-slate-50";
                            }

                            if (selectedOption) {
                                if (isTheCorrectAnswer) {
                                    // Correct answer: Solid Green
                                    updateStyle = "border-green-600 bg-green-500 text-white ring-4 ring-green-200 shadow-md transform scale-[1.02]";
                                } else if (isSelected && !isTheCorrectAnswer) {
                                    // Selected incorrect answer: Solid Red
                                    updateStyle = "border-red-600 bg-red-600 text-white shadow-sm";
                                } else {
                                    // Unselected options: Fade out
                                    updateStyle = "border-slate-100 opacity-40 bg-slate-50";
                                }
                            }

                            return (
                                <button
                                    key={idx}
                                    onClick={() => handleOptionClick(opt)}
                                    disabled={!!selectedOption}
                                    className={`p-6 rounded-2xl border-2 text-lg font-bold transition-all duration-200 ${updateStyle}`}
                                >
                                    <div className="flex flex-col items-center gap-1">
                                        {gameMode === 'meaning-to-char' ? (
                                            <>
                                                <span className="text-4xl mb-1">{opt.char}</span>
                                                <span className="text-sm font-normal opacity-75">{opt.pinyin}</span>
                                            </>
                                        ) : (
                                            <span>{opt[targetLang] || opt.en}</span>
                                        )}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Feedback / Next Button */}
            {!(!currentUser && hskLevel > 1) && selectedOption && (
                <div className="flex justify-center animate-in md:justify-end">
                    <button onClick={nextQuestion} className="w-full sm:w-auto bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-lg shadow-xl hover:bg-blue-700 hover:scale-105 transition-all flex items-center justify-center gap-3">
                        {t.nextQuestion} <ArrowRight size={20} />
                    </button>
                </div>
            )}

        </section>
    );
};

export default Quiz;
