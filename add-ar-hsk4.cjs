const fs = require('fs');

// Read the current file
let content = fs.readFileSync('./src/hsk4.js', 'utf8');

// Parse each line and add ar field after es field
const lines = content.split('\n');
const updatedLines = lines.map(line => {
    // Match vocabulary entries with es: "..." pattern
    if (line.includes('char:') && line.includes('es:') && !line.includes('ar:')) {
        // Extract the English translation to determine Arabic
        const enMatch = line.match(/en: "([^"]+)"/);
        if (enMatch) {
            const en = enMatch[1];
            const ar = getArabicTranslation(en);
            // Insert ar: "..." after es: "..."
            return line.replace(/(es: "[^"]+")/, `$1, ar: "${ar}"`);
        }
    }
    return line;
});

fs.writeFileSync('./src/hsk4.js', updatedLines.join('\n'));
console.log('Arabic translations added to HSK4!');

function getArabicTranslation(en) {
    const translations = {
        "love": "حب", "arrange": "ترتيب", "safe": "آمن", "on time": "في الوقت", "protect": "حماية",
        "sign up": "تسجيل", "apologize": "اعتذار", "graduate": "تخرج", "form": "نموذج", "perform": "أداء",
        "biscuit": "بسكويت", "doctor": "دكتور", "have to": "يجب", "material": "مادة", "visit": "زيارة",
        "success": "نجاح", "become": "يصبح", "honest": "صادق", "set out": "انطلاق", "be born": "يولد",
        "fax": "فاكس", "window": "نافذة", "save": "حفظ", "mistake": "خطأ", "answer": "إجابة",
        "disturb": "إزعاج", "print": "طباعة", "discount": "خصم", "probably": "ربما", "embassy": "سفارة",
        "guide": "مرشد", "earth": "أرض", "address": "عنوان", "fall": "سقوط", "lose": "يخسر",
        "action": "حركة", "jam": "ازدحام", "develop": "تطوير", "law": "قانون", "translate": "ترجمة",
        "method": "طريقة", "direction": "اتجاه", "give up": "استسلام", "relax": "استرخاء", "rich": "غني",
        "pay": "دفع", "responsible": "مسؤول", "complex": "معقد", "change": "تغيير", "cheers": "في صحتك",
        "moved": "متأثر", "emotion": "عاطفة", "thank": "شكر", "highway": "طريق سريع", "salary": "راتب",
        "kung fu": "كونغ فو", "shop": "تسوق", "enough": "كافي", "encourage": "تشجيع", "customer": "زبون",
        "key": "مفتاح", "manage": "إدارة", "ad": "إعلان", "rule": "قاعدة", "international": "دولي",
        "juice": "عصير", "ocean": "محيط", "shy": "خجول", "flight": "رحلة", "seem": "يبدو",
        "number": "رقم", "qualified": "مؤهل", "fit": "مناسب", "regret": "ندم", "internet": "إنترنت",
        "nurse": "ممرضة", "memory": "ذكرى", "lively": "نشيط", "obtain": "يحصل", "base": "أساس",
        "excited": "متحمس", "even if": "حتى لو", "plan": "خطة", "journalist": "صحفي", "since": "منذ",
        "mail": "بريد", "gas station": "محطة وقود", "furniture": "أثاث", "price": "سعر", "persist": "مثابرة",
        "lose weight": "تخسيس", "reduce": "تقليل", "suggest": "اقتراح", "future": "مستقبل", "bonus": "مكافأة",
        "traffic": "مرور", "exchange": "تبادل", "professor": "أستاذ", "education": "تعليم", "accept": "قبول",
        "result": "نتيجة", "save": "توفير", "explain": "شرح", "nervous": "متوتر", "although": "رغم",
        "carry out": "تنفيذ", "prohibit": "منع", "wonderful": "رائع", "economy": "اقتصاد", "experience": "تجربة",
        "police": "شرطة", "compete": "منافسة", "mirror": "مرآة", "actually": "فعلياً", "hold": "إقامة",
        "refuse": "رفض", "distance": "مسافة", "party": "حفلة", "card": "بطاقة", "joke": "مزاح",
        "view": "رأي", "consider": "اعتبار", "science": "علم", "pitiful": "مسكين", "pity": "أسف",
        "living room": "غرفة معيشة", "certain": "مؤكد", "empty": "فارغ", "afraid": "خائف", "bitter": "مر",
        "mineral water": "ماء معدني", "sleepy": "نعسان", "difficulty": "صعوبة", "pull": "سحب",
        "trash can": "سلة قمامة", "spicy": "حار", "come from": "يأتي من", "in time": "في الوقت",
        "waste": "إهدار", "romantic": "رومانسي", "tiger": "نمر", "calm": "هادئ", "haircut": "قص شعر",
        "understand": "فهم", "ideal": "مثالي", "strength": "قوة", "awesome": "مذهل", "for example": "مثلاً",
        "contact": "اتصال", "cool": "بارد", "chat": "دردشة", "besides": "إضافة", "stay": "بقاء",
        "fluent": "طلق", "popular": "شائع", "travel": "سفر", "lawyer": "محامي", "trouble": "مشكلة",
        "full": "ممتلئ", "towel": "منشفة", "beautiful": "جميل", "dream": "حلم", "password": "كلمة سر",
        "free": "مجاني", "second": "ثانية", "nation": "أمة", "mother": "أم", "purpose": "هدف",
        "inside": "داخل", "content": "محتوى", "patience": "صبر", "could it be": "هل يمكن",
        "uncomfortable": "غير مريح", "ability": "قدرة", "do": "يفعل", "warm": "دافئ",
        "occasionally": "أحياناً", "judge": "يحكم", "accompany": "يرافق", "criticize": "ينتقد",
        "skin": "جلد", "temper": "مزاج", "usually": "عادةً", "broken": "مكسور", "common": "شائع",
        "Mandarin": "الماندرين", "secondly": "ثانياً", "among": "بين", "climate": "مناخ", "must": "يجب",
        "visa": "تأشيرة", "wall": "جدار", "knock": "يطرق", "bridge": "جسر", "chocolate": "شوكولاتة",
        "relative": "قريب", "light": "خفيف", "relaxed": "مسترخي", "situation": "وضع",
        "ask for leave": "طلب إجازة", "treat": "يعامل", "poor": "فقير", "take": "يأخذ", "all": "كل",
        "weakness": "ضعف", "lack": "نقص", "but": "لكن", "indeed": "حقاً", "however": "ومع ذلك",
        "any": "أي", "task": "مهمة", "diary": "يوميات", "entrance": "مدخل", "walk": "يمشي",
        "forest": "غابة", "sofa": "أريكة", "sad": "حزين", "discuss": "يناقش", "slightly": "قليلاً",
        "spoon": "ملعقة", "society": "مجتمع", "apply": "يتقدم", "even": "حتى", "life": "حياة",
        "business": "عمل", "leftover": "متبقي", "fail": "يفشل", "disappointed": "محبط", "master": "معلم",
        "very": "جداً", "practical": "عملي", "really": "حقاً", "make": "يصنع", "use": "يستخدم",
        "century": "قرن", "suit": "يناسب", "adapt": "يتكيف", "collect": "يجمع", "income": "دخل",
        "tidy up": "يرتب", "capital": "عاصمة", "first": "أولاً", "unbearable": "لا يُحتمل",
        "receive": "يستلم", "salesperson": "بائع", "familiar": "مألوف", "quantity": "كمية",
        "handsome": "وسيم", "by the way": "بالمناسبة", "smooth": "سلس", "order": "ترتيب",
        "master's": "ماجستير", "die": "يموت", "speed": "سرعة", "plastic bag": "كيس بلاستيك",
        "sour": "حامض", "whatever": "أياً كان", "along with": "مع", "grandson": "حفيد",
        "platform": "منصة", "lift": "يرفع", "attitude": "موقف", "play piano": "يعزف بيانو",
        "talk": "يتحدث", "soup": "شوربة", "sugar": "سكر", "lie down": "يستلقي", "feature": "ميزة",
        "improve": "يحسن", "provide": "يوفر", "in advance": "مسبقاً", "remind": "يذكر", "fill": "يملأ",
        "sweet": "حلو", "condition": "شرط", "stop": "يتوقف", "quite": "تماماً", "through": "عبر",
        "notify": "يُخطر", "sympathy": "تعاطف", "meanwhile": "في الوقت نفسه", "push": "يدفع",
        "postpone": "يؤجل", "take off": "يخلع", "socks": "جوارب", "completely": "تماماً",
        "tennis": "تنس", "website": "موقع", "often": "غالباً", "danger": "خطر", "taste": "طعم",
        "temperature": "درجة حرارة", "culture": "ثقافة", "pollution": "تلوث", "without": "بدون",
        "boring": "ممل", "regardless": "بغض النظر", "misunderstanding": "سوء فهم", "tomato": "طماطم",
        "attract": "يجذب", "habit": "عادة", "drama": "دراما", "careful": "حذر", "download": "تحميل",
        "scare": "يخيف", "salty": "مالح", "cash": "نقد", "envy": "حسد", "opposite": "عكس",
        "believe": "يؤمن", "detailed": "مفصل", "ring": "يرن", "enjoy": "يستمتع",
        "snack": "وجبة خفيفة", "novel": "رواية", "effect": "تأثير", "mood": "مزاج",
        "envelope": "ظرف", "trust": "ثقة", "information": "معلومات", "credit card": "بطاقة ائتمان",
        "wake up": "يستيقظ", "personality": "شخصية", "happy": "سعيد", "repair": "يصلح", "fix": "يُصلح",
        "many": "كثير", "choose": "يختار", "semester": "فصل دراسي", "deposit": "وديعة",
        "toothpaste": "معجون أسنان", "Asia": "آسيا", "strict": "صارم", "serious": "خطير",
        "sunshine": "أشعة شمس", "invite": "يدعو", "page": "صفحة", "leaf": "ورقة",
        "everything": "كل شيء", "art": "فن", "cloudy": "غائم", "impression": "انطباع", "win": "يفوز",
        "should": "يجب", "advantage": "ميزة", "excellent": "ممتاز", "especially": "خاصةً",
        "by": "بواسطة", "due to": "بسبب", "post office": "مكتب بريد", "friendly": "ودود",
        "friendship": "صداقة", "interesting": "ممتع", "so": "لذلك", "and": "و", "badminton": "ريشة",
        "grammar": "قواعد", "language": "لغة", "preview": "معاينة", "originally": "أصلاً",
        "forgive": "يسامح", "reason": "سبب", "date": "موعد", "read": "يقرأ", "cloud": "سحابة",
        "allow": "يسمح", "we": "نحن", "temporarily": "مؤقتاً", "dirty": "قذر",
        "responsibility": "مسؤولية", "occupy": "يحتل", "recruit": "يوظف", "according to": "وفقاً لـ",
        "take care of": "يعتني", "philosophy": "فلسفة", "person": "شخص", "against": "ضد",
        "just right": "بالضبط", "correct": "صحيح", "formal": "رسمي", "prove": "يثبت", "of": "من",
        "support": "يدعم", "as long as": "طالما", "point": "يشير", "at least": "على الأقل",
        "quality": "جودة", "Chinese": "صيني", "center": "مركز", "focus": "تركيز", "value": "يقدر",
        "surroundings": "محيط", "proactive": "مبادر", "idea": "فكرة", "congratulate": "يهنئ",
        "famous": "مشهور", "specially": "خصيصاً", "major": "تخصص", "earn": "يكسب", "bump": "يصطدم",
        "accurate": "دقيق", "nature": "طبيعة", "confident": "واثق", "summarize": "يلخص",
        "rent": "يستأجر", "compose": "يؤلف", "organize": "ينظم", "seat": "مقعد", "writer": "كاتب",
        "function": "وظيفة", "author": "مؤلف", "percent": "بالمئة", "great": "عظيم", "hug": "يعانق",
        "stupid": "غبي", "standard": "معيار", "praise": "يمدح", "no matter": "مهما",
        "wipe": "يمسح", "guess": "يخمن", "restaurant": "مطعم", "toilet": "حمام", "almost": "تقريباً",
        "field": "ميدان", "quarrel": "يتشاجر", "ride": "يركب", "smoke": "يدخن",
        "business trip": "رحلة عمل", "appear": "يظهر", "kitchen": "مطبخ", "dictionary": "قاموس",
        "never": "أبداً", "careless": "مهمل", "about": "حوالي", "when": "عندما",
        "tour guide": "مرشد سياحي", "upside down": "مقلوب", "bottom": "قاع", "location": "موقع",
        "investigate": "يحقق", "reader": "قارئ", "traffic jam": "ازدحام مروري", "stomach": "معدة",
        "dialogue": "حوار", "regarding": "بخصوص", "child": "طفل", "send": "يرسل",
        "happen": "يحدث", "oppose": "يعارض", "range": "نطاق", "portion": "حصة",
        "otherwise": "وإلا", "conform": "يتوافق", "father": "أب", "review": "مراجعة", "copy": "ينسخ",
        "overtime": "عمل إضافي", "come on": "هيا", "housewife": "ربة منزل", "fake": "مزيف",
        "technology": "تكنولوجيا", "continue": "يستمر", "suburb": "ضاحية", "roast duck": "بط مشوي",
        "air": "هواء", "air conditioner": "مكيف", "too late": "فات الأوان", "lazy": "كسول",
        "suitable": "مناسب", "viewpoint": "وجهة نظر", "broadcast": "بث", "regulation": "لائحة",
        "nationality": "جنسية", "process": "عملية", "sea": "بحر", "winter vacation": "عطلة شتاء",
        "sweat": "عرق", "unexpectedly": "بشكل غير متوقع", "raise": "يرفع", "celebrate": "يحتفل",
        "opinion": "رأي", "pizza": "بيتزا", "age": "عمر", "countryside": "ريف", "queue": "طابور",
        "engineer": "مهندس", "kilometer": "كيلومتر", "estimate": "يقدر", "hang": "يعلق", "close": "يغلق"
    };
    return translations[en] || "ترجمة";
}
