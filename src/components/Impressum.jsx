import React from 'react';
import { ArrowLeft } from 'lucide-react';

const Impressum = ({ onBack, targetLang = 'de' }) => {
    const translations = {
        de: {
            back: "Zurück zur App",
            title: "Impressum",
            subtitle: "Rechtliche Hinweise",
            section5: "Angaben gemäß § 5 TMG",
            contact: "Kontakt",
            contentLiability: "Haftung für Inhalte",
            linkLiability: "Haftung für Links",
            copyright: "Urheberrecht",
            phone: "Telefon",
            email: "E-Mail",
            contentLiabilityText: "Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.",
            linkLiabilityText: "Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.",
            copyrightText: "Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers."
        },
        en: {
            back: "Back to App",
            title: "Legal Notice",
            subtitle: "Legal Information",
            section5: "Information according to § 5 TMG",
            contact: "Contact",
            contentLiability: "Liability for Content",
            linkLiability: "Liability for Links",
            copyright: "Copyright",
            phone: "Phone",
            email: "Email",
            contentLiabilityText: "As a service provider, we are responsible for our own content on these pages in accordance with general laws pursuant to § 7 Para.1 TMG. According to §§ 8 to 10 TMG, however, we as a service provider are not obliged to monitor transmitted or stored third-party information or to investigate circumstances that indicate illegal activity.",
            linkLiabilityText: "Our offer contains links to external third-party websites, on whose contents we have no influence. Therefore, we cannot assume any liability for these external contents. The respective provider or operator of the pages is always responsible for the content of the linked pages.",
            copyrightText: "The content and works created by the site operators on these pages are subject to German copyright law. Duplication, processing, distribution, and any kind of exploitation outside the limits of copyright law require the written consent of the respective author or creator."
        },
        es: {
            back: "Volver a la aplicación",
            title: "Aviso Legal",
            subtitle: "Información Legal",
            section5: "Información según § 5 TMG",
            contact: "Contacto",
            contentLiability: "Responsabilidad por contenidos",
            linkLiability: "Responsabilidad por enlaces",
            copyright: "Derechos de autor",
            phone: "Teléfono",
            email: "Correo electrónico",
            contentLiabilityText: "Como proveedor de servicios, somos responsables de nuestros propios contenidos en estas páginas de acuerdo con las leyes generales según § 7 Párr.1 TMG. Según §§ 8 a 10 TMG, sin embargo, no estamos obligados a monitorear información de terceros transmitida o almacenada ni a investigar circunstancias que indiquen actividad ilegal.",
            linkLiabilityText: "Nuestra oferta contiene enlaces a sitios web externos de terceros, sobre cuyos contenidos no tenemos influencia. Por lo tanto, no podemos asumir ninguna responsabilidad por estos contenidos externos. El proveedor u operador respectivo de las páginas es siempre responsable del contenido de las páginas vinculadas.",
            copyrightText: "El contenido y las obras creadas por los operadores del sitio en estas páginas están sujetos a la ley de derechos de autor alemana. La duplicación, el procesamiento, la distribución y cualquier tipo de explotación fuera de los límites de la ley de derechos de autor requieren el consentimiento por escrito del autor o creador respectivo."
        },
        ar: {
            back: "العودة للتطبيق",
            title: "إشعار قانوني",
            subtitle: "معلومات قانونية",
            section5: "معلومات وفقاً لـ § 5 TMG",
            contact: "اتصال",
            contentLiability: "مسؤولية المحتوى",
            linkLiability: "مسؤولية الروابط",
            copyright: "حقوق النشر",
            phone: "هاتف",
            email: "بريد إلكتروني",
            contentLiabilityText: "بصفتنا مقدم خدمة، نحن مسؤولون عن محتوانا الخاص على هذه الصفحات وفقًا للقوانين العامة بموجب § 7 الفقرة 1 TMG. وفقًا لـ §§ 8 إلى 10 TMG، ومع ذلك، لسنا ملزمين بمراقبة المعلومات المنقولة أو المخزنة من جهات خارجية أو التحقيق في الظروف التي تشير إلى نشاط غير قانوني.",
            linkLiabilityText: "يحتوي عرضنا على روابط لمواقع خارجية تابعة لجهات خارجية، والتي ليس لدينا تأثير على محتوياتها. لذلك، لا يمكننا تحمل أي مسؤولية عن هذه المحتويات الخارجية. الموفر أو المشغل المعني للصفحات هو المسألة دائمًا عن محتوى الصفحات المرتبطة.",
            copyrightText: "يخضع المحتوى والأعمال التي أنشأها مشغلو الموقع على هذه الصفحات لقانون حقوق النشر الألماني. يتطلب النسخ والمعالجة والتوزيع وأي نوع من الاستغلال خارج حدود قانون حقوق النشر موافقة خطية من المؤلف أو المنشئ المعني."
        },
        hi: {
            back: "ऐप पर वापस जाएं",
            title: "कानूनी नोटिस",
            subtitle: "कानूनी जानकारी",
            section5: "§ 5 TMG के अनुसार जानकारी",
            contact: "संपर्क",
            contentLiability: "सामग्री के लिए दायित्व",
            linkLiability: "लिंक के लिए दायित्व",
            copyright: "कॉपीराइट",
            phone: "फ़ोन",
            email: "ईमेल",
            contentLiabilityText: "एक सेवा प्रदाता के रूप में, हम § 7 पैरा 1 TMG के अनुसार सामान्य कानूनों के अनुसार इन पृष्ठों पर अपनी स्वयं की सामग्री के लिए जिम्मेदार हैं। §§ 8 से 10 TMG के अनुसार, हालांकि, हम प्रेषित या संग्रहीत तृतीय-पक्ष जानकारी की निगरानी करने या अवैध गतिविधि का संकेत देने वाली परिस्थितियों की जांच करने के लिए बाध्य नहीं हैं।",
            linkLiabilityText: "हमारे ऑफ़र में बाहरी तृतीय-पक्ष वेबसाइटों के लिंक शामिल हैं, जिनकी सामग्री पर हमारा कोई प्रभाव नहीं है। इसलिए, हम इन बाहरी सामग्रियों के लिए कोई दायित्व नहीं ले सकते। लिंक किए गए पृष्ठों की सामग्री के लिए संबंधित प्रदाता या ऑपरेटर हमेशा जिम्मेदार होता है।",
            copyrightText: "इन पृष्ठों पर साइट ऑपरेटरों द्वारा बनाई गई सामग्री और कार्य जर्मन कॉपीराइट कानून के अधीन हैं। कॉपीराइट कानून की सीमाओं के बाहर दोहराव, प्रसंस्करण, वितरण और किसी भी प्रकार के शोषण के लिए संबंधित लेखक या निर्माता की लिखित सहमति की आवश्यकता होती है।"
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
                    <h2 className="text-xl font-black text-slate-900">{t.section5}</h2>
                    <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 font-medium">
                        <p className="font-bold text-slate-900">Marius Metzner</p>
                        <p>Musterstraße 123</p>
                        <p>12345 Musterstadt</p>
                    </div>
                </section>

                <section className="space-y-4">
                    <h2 className="text-xl font-black text-slate-900">{t.contact}</h2>
                    <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 font-medium space-y-2">
                        <p>{t.phone}: +49 (0) 123 44 55 66</p>
                        <p>{t.email}: <a href="mailto:info@hsk-vocab-app.de" className="text-red-600 hover:text-red-700 font-bold">info@hsk-vocab-app.de</a></p>
                    </div>
                </section>

                <section className="space-y-4">
                    <h2 className="text-xl font-black text-slate-900">{t.contentLiability}</h2>
                    <p className="leading-relaxed">
                        {t.contentLiabilityText}
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-xl font-black text-slate-900">{t.linkLiability}</h2>
                    <p className="leading-relaxed">
                        {t.linkLiabilityText}
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-xl font-black text-slate-900">{t.copyright}</h2>
                    <p className="leading-relaxed">
                        {t.copyrightText}
                    </p>
                </section>
            </div>
        </div>
    );
};

export default Impressum;
