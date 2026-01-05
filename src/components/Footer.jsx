import React from 'react';

const Footer = ({ onNavigate, targetLang = 'de' }) => {
    const translations = {
        de: {
            rights: "Alle Rechte vorbehalten.",
            impressum: "Impressum",
            terms: "Nutzungsbedingungen"
        },
        en: {
            rights: "All rights reserved.",
            impressum: "Legal Notice",
            terms: "Terms of Use"
        },
        es: {
            rights: "Todos los derechos reservados.",
            impressum: "Aviso Legal",
            terms: "Condiciones de Uso"
        },
        ar: {
            rights: "جميع الحقوق محفوظة.",
            impressum: "إشعار قانوني",
            terms: "شروط الاستخدام"
        },
        hi: {
            rights: "सभी अधिकार सुरक्षित।",
            impressum: "कानूनी नोटिस",
            terms: "उपयोग की शर्तें"
        }
    };

    const t = translations[targetLang] || translations.de;

    return (
        <footer className="w-full py-8 mt-12 mb-8 border-t border-slate-200">
            <div className="max-w-4xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm font-medium text-slate-400">
                <div>
                    © {new Date().getFullYear()} HSK Master. {t.rights}
                </div>
                <div className="flex items-center gap-6">
                    <button
                        onClick={() => onNavigate('impressum')}
                        className="hover:text-red-600 transition-colors"
                    >
                        {t.impressum}
                    </button>
                    <button
                        onClick={() => onNavigate('terms')}
                        className="hover:text-red-600 transition-colors"
                    >
                        {t.terms}
                    </button>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
