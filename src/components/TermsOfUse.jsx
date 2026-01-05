import React from 'react';
import { ArrowLeft } from 'lucide-react';

const TermsOfUse = ({ onBack, targetLang = 'de' }) => {
    const translations = {
        de: {
            back: "Zurück zur App",
            title: "Nutzungsbedingungen",
            subtitle: "Terms of Use",
            scope: "1. Geltungsbereich",
            scopeText: "Diese Allgemeinen Nutzungsbedingungen gelten für die Nutzung der HSK Master App. Mit der Nutzung der App erklären Sie sich mit diesen Bedingungen einverstanden.",
            service: "2. Leistungsbeschreibung",
            serviceText: "HSK Master ist eine Lernplattform für chinesische Vokabeln. Wir bemühen uns um eine stetige Verfügbarkeit und Richtigkeit der Inhalte, können jedoch keine Garantien für die Korrektheit der Übersetzungen oder die durchgehende Erreichbarkeit der Dienste übernehmen.",
            account: "3. Nutzerkonto",
            accountText: "Einige Funktionen erfordern ein Benutzerkonto. Sie sind verpflichtet, Ihre Zugangsdaten geheim zu halten. Wir behalten uns das Recht vor, Konten bei Missbrauch zu sperren oder zu löschen.",
            intellectualProperty: "4. Geistiges Eigentum",
            intellectualPropertyText: "Alle Inhalte der App, einschließlich Texte, Grafiken, Logos und Software, sind, soweit nicht anders gekennzeichnet, geistiges Eigentum des Betreibers und urheberrechtlich geschützt.",
            changes: "5. Änderungen",
            changesText: "Wir behalten uns das Recht vor, diese Nutzungsbedingungen jederzeit zu ändern. Über wesentliche Änderungen werden die Nutzer in geeigneter Form informiert.",
            status: "Stand: Januar 2026"
        },
        en: {
            back: "Back to App",
            title: "Terms of Use",
            subtitle: "Terms of Use",
            scope: "1. Scope",
            scopeText: "These General Terms of Use apply to the use of the HSK Master App. By using the app, you agree to these terms.",
            service: "2. Service Description",
            serviceText: "HSK Master is a learning platform for Chinese vocabulary. We strive for constant availability and accuracy of content, but cannot guarantee the correctness of translations or continuous availability of services.",
            account: "3. User Account",
            accountText: "Some features require a user account. You are obliged to keep your access data secret. We reserve the right to block or delete accounts in case of misuse.",
            intellectualProperty: "4. Intellectual Property",
            intellectualPropertyText: "All content of the app, including text, graphics, logos and software, is, unless otherwise stated, the intellectual property of the operator and protected by copyright.",
            changes: "5. Changes",
            changesText: "We reserve the right to change these terms of use at any time. Users will be informed of significant changes in an appropriate form.",
            status: "Status: January 2026"
        },
        es: {
            back: "Volver a la aplicación",
            title: "Condiciones de Uso",
            subtitle: "Términos de Uso",
            scope: "1. Alcance",
            scopeText: "Estas Condiciones Generales de Uso se aplican al uso de la aplicación HSK Master. Al utilizar la aplicación, usted acepta estas condiciones.",
            service: "2. Descripción del Servicio",
            serviceText: "HSK Master es una plataforma de aprendizaje de vocabulario chino. Nos esforzamos por la disponibilidad constante y la precisión del contenido, pero no podemos garantizar la exactitud de las traducciones o la disponibilidad continua de los servicios.",
            account: "3. Cuenta de Usuario",
            accountText: "Algunas funciones requieren una cuenta de usuario. Usted está obligado a mantener sus datos de acceso en secreto. Nos reservamos el derecho de bloquear o eliminar cuentas en caso de mal uso.",
            intellectualProperty: "4. Propiedad Intelectual",
            intellectualPropertyText: "Todo el contenido de la aplicación, incluidos textos, gráficos, logotipos y software, es, a menos que se indique lo contrario, propiedad intelectual del operador y está protegido por derechos de autor.",
            changes: "5. Cambios",
            changesText: "Nos reservamos el derecho de cambiar estos términos de uso en cualquier momento. Los usuarios serán informados de cambios significativos de forma adecuada.",
            status: "Estado: Enero 2026"
        },
        ar: {
            back: "العودة للتطبيق",
            title: "شروط الاستخدام",
            subtitle: "شروط الخدمة",
            scope: "1. النطاق",
            scopeText: "تنطبق شروط الاستخدام العامة هذه على استخدام تطبيق HSK Master. باستخدام التطبيق، فإنك توافق على هذه الشروط.",
            service: "2. وصف الخدمة",
            serviceText: "HSK Master هي منصة لتعلم المفردات الصينية. نسعى جاهدين لتحقيق التوافر المستمر ودقة المحتوى، ولكن لا يمكننا ضمان صحة الترجمات أو التوافر المستمر للخدمات.",
            account: "3. حساب المستخدم",
            accountText: "تتطلب بعض الميزات حساب مستخدم. أنت ملزم بالحفاظ على سرية بيانات الوصول الخاصة بك. نحتفظ بالحق في حظر أو حذف الحسابات في حالة سوء الاستخدام.",
            intellectualProperty: "4. الملكية الفكرية",
            intellectualPropertyText: "جميع محتويات التطبيق، بما في ذلك النصوص والرسومات والشعارات والبرامج، هي ملكية فكرية للمشغل ومحمية بموجب حقوق النشر، ما لم يذكر خلاف ذلك.",
            changes: "5. التغييرات",
            changesText: "نحتفظ بالحق في تغيير شروط الاستخدام هذه في أي وقت. سيتم إبلاغ المستخدمين بالتغييرات المهمة بشكل مناسب.",
            status: "الحالة: يناير 2026"
        },
        hi: {
            back: "ऐप पर वापस जाएं",
            title: "उपयोग की शर्तें",
            subtitle: "उपयोग की शर्तें",
            scope: "1. दायरा",
            scopeText: "ये सामान्य उपयोग की शर्तें HSK Master ऐप के उपयोग पर लागू होती हैं। ऐप का उपयोग करके, आप इन शर्तों से सहमत हैं।",
            service: "2. सेवा विवरण",
            serviceText: "HSK Master चीनी शब्दावली सीखने का एक मंच है। हम सामग्री की निरंतर उपलब्धता और सटीकता के लिए प्रयास करते हैं, लेकिन अनुवाद की शुद्धता या सेवाओं की निरंतर उपलब्धता की गारंटी नहीं दे सकते।",
            account: "3. उपयोगकर्ता खाता",
            accountText: "कुछ सुविधाओं के लिए उपयोगकर्ता खाते की आवश्यकता होती है। आप अपने एक्सेस डेटा को गुप्त रखने के लिए बाध्य हैं। हम दुरुपयोग के मामले में खातों को ब्लॉक या हटाने का अधिकार सुरक्षित रखते हैं।",
            intellectualProperty: "4. बौद्धिक संपदा",
            intellectualPropertyText: "ऐप की सभी सामग्री, जिसमें टेक्स्ट, ग्राफिक्स, लोगो और सॉफ़्टवेयर शामिल हैं, जब तक कि अन्यथा न कहा गया हो, ऑपरेटर की बौद्धिक संपदा है और कॉपीराइट द्वारा सुरक्षित है।",
            changes: "5. परिवर्तन",
            changesText: "हम किसी भी समय इन उपयोग की शर्तों को बदलने का अधिकार सुरक्षित रखते हैं। उपयोगकर्ताओं को उचित रूप में महत्वपूर्ण परिवर्तनों के बारे में सूचित किया जाएगा।",
            status: "स्थिति: जनवरी 2026"
        }
    };

    const t = translations[targetLang] || translations.de;

    return (
        <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4">
            <div className="mb-8">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-slate-500 hover:text-red-600 transition-colors font-bold text-sm bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-200"
                >
                    <ArrowLeft size={16} />
                    {t.back}
                </button>
            </div>

            <div className="bg-white p-8 sm:p-12 rounded-[48px] border border-slate-200 shadow-sm space-y-10 text-slate-700">
                <header>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">{t.title}</h1>
                    <p className="text-slate-400 font-medium italic">{t.subtitle}</p>
                </header>

                <section className="space-y-4">
                    <h2 className="text-xl font-black text-slate-900">{t.scope}</h2>
                    <p className="leading-relaxed">
                        {t.scopeText}
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-xl font-black text-slate-900">{t.service}</h2>
                    <p className="leading-relaxed">
                        {t.serviceText}
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-xl font-black text-slate-900">{t.account}</h2>
                    <p className="leading-relaxed">
                        {t.accountText}
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-xl font-black text-slate-900">{t.intellectualProperty}</h2>
                    <p className="leading-relaxed">
                        {t.intellectualPropertyText}
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-xl font-black text-slate-900">{t.changes}</h2>
                    <p className="leading-relaxed">
                        {t.changesText}
                    </p>
                </section>

                <div className="pt-8 border-t border-slate-100 flex flex-col items-center text-center">
                    <p className="text-sm font-bold text-slate-400">{t.status}</p>
                </div>
            </div>
        </div>
    );
};

export default TermsOfUse;
