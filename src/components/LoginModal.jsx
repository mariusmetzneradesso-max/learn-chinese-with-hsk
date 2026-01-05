import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Shield, X } from 'lucide-react';
import { auth } from '../firebase';
import { EmailAuthProvider, GoogleAuthProvider, OAuthProvider } from 'firebase/auth';
import * as firebaseui from 'firebaseui';
import 'firebaseui/dist/firebaseui.css';

const translations = {
    de: {
        welcomeBack: 'Willkommen zurück',
        signinSync: 'Melde dich an, um deine HSK-Reise zu synchronisieren'
    },
    en: {
        welcomeBack: 'Welcome Back',
        signinSync: 'Sign in to sync your HSK journey'
    },
    es: {
        welcomeBack: 'Bienvenido de nuevo',
        signinSync: 'Inicia sesión para sincronizar tu viaje HSK'
    },
    ar: {
        welcomeBack: 'مرحبًا بعودتك',
        signinSync: 'سجل الدخول لمزامنة رحلة HSK الخاصة بك'
    },
    hi: {
        welcomeBack: 'वापसी पर स्वागत है',
        signinSync: 'अपनी HSK यात्रा को सिंक करने के लिए साइन इन करें'
    }
};

const LoginModal = ({ isOpen, onClose, targetLang = 'en' }) => {
    const uiRef = useRef(null);
    const containerRef = useRef(null);

    useEffect(() => {
        if (isOpen && containerRef.current) {
            // Initialize the FirebaseUI Widget using Firebase.
            const ui = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(auth);
            uiRef.current = ui;

            const uiConfig = {
                signInFlow: 'popup',
                signInSuccessUrl: '/',
                signInOptions: [
                    GoogleAuthProvider.PROVIDER_ID,
                    EmailAuthProvider.PROVIDER_ID
                ],
                callbacks: {
                    signInSuccessWithAuthResult: () => {
                        onClose();
                        return false;
                    },
                    uiShown: () => {
                        // The widget is rendered.
                        // You could hide a loader here if we had one.
                    }
                }
            };

            ui.start(containerRef.current, uiConfig);
        }

        return () => {
            // Cleanup logic if needed, though ui.reset() is often problematic in strict mode 
            // if called too eagerly. authUI is a singleton usually.
            // We usually don't need to explicitly reset here for popup flow, 
            // but if we do: 
            // if (uiRef.current) uiRef.current.reset();
        };
    }, [isOpen, onClose]);

    const t = translations[targetLang] || translations.en;

    if (!isOpen) return null;
    if (typeof document === 'undefined') return null;

    const modalContent = (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, width: '100vw', height: '100vh', zIndex: 999999, alignItems: 'flex-start', paddingTop: '6rem' }} className="flex justify-center px-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200" onClick={onClose}></div>
            <div className="bg-white/75 backdrop-blur-md rounded-[32px] w-1/2 overflow-hidden shadow-2xl relative animate-in slide-in-from-top-4 duration-300">
                <div className="p-8">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors z-10"
                    >
                        <X size={20} />
                    </button>

                    <div className="text-center mb-6">
                        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-red-50 to-red-100 text-red-600 mb-4 shadow-sm shadow-red-100">
                            <Shield size={28} />
                        </div>
                        <h2 className="text-2xl font-black text-slate-800 tracking-tight">
                            {t.welcomeBack}
                        </h2>
                        <p className="text-slate-500 font-medium text-sm mt-2 max-w-[280px] mx-auto leading-relaxed">
                            {t.signinSync}
                        </p>
                    </div>

                    {/* Container for FirebaseUI */}
                    <div ref={containerRef} className="firebase-auth-container min-h-[200px]" />
                </div>
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
};

export default LoginModal;
