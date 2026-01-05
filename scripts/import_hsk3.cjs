const fs = require('fs');
const path = require('path');
const https = require('https');

// --- Configuration ---
const OLD_HSK_FILES = [
    '../src/hsk1.js',
    '../src/hsk2.js',
    '../src/hsk3.js',
    '../src/hsk4.js',
    '../src/hsk5.js',
    '../src/hsk6.js',
];

const NEW_HSK_LEVELS = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const BASE_URL = 'https://raw.githubusercontent.com/drkameleon/complete-hsk-vocabulary/main/wordlists/exclusive/new/';

// --- Helper Functions ---

const fetchJson = (url) => {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            if (res.statusCode !== 200) {
                reject(new Error(`Failed to fetch ${url}: Status Code ${res.statusCode}`));
                return;
            }
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (e) {
                    reject(e);
                }
            });
        }).on('error', reject);
    });
};

const extractTranslations = () => {
    const translations = {}; // char -> { de, es, ar, hi }

    for (const file of OLD_HSK_FILES) {
        const filePath = path.join(__dirname, file);
        if (!fs.existsSync(filePath)) {
            console.warn(`File not found: ${filePath}`);
            continue;
        }

        const content = fs.readFileSync(filePath, 'utf8');
        // Regex to basic parsing of the JS files. 
        // Assumes export const hskXVocab = [ ...Objects... ];
        // We'll use a safer approach: standard require/import if possible, OR regex extraction
        // Since these are ES modules, we can't require them easily in CJS without dynamic import().
        // Let's rely on regex matching for array content.

        // Simplistic regex to find object literals. This might be fragile if code format varies.
        // Better strategy: Read file, find the array definition, parse it manually or use eval (unsafe but okay for local script)
        // Actually, let's just use regex to capture individual objects which look like { ... }

        const objectRegex = /\{[^{}]+\}/g;
        const matches = content.match(objectRegex);

        if (matches) {
            matches.forEach(match => {
                try {
                    // Fix unquoted keys for JSON.parse (simple heuristic)
                    let jsonStr = match.replace(/(['"])?([a-zA-Z0-9_]+)(['"])?:/g, '"$2":');
                    // Fix single quotes to double quotes
                    jsonStr = jsonStr.replace(/'/g, '"');
                    // Removing trailing commas
                    jsonStr = jsonStr.replace(/,(\s*})/g, '$1');

                    const obj = JSON.parse(jsonStr);
                    if (obj.char) {
                        translations[obj.char] = {
                            de: obj.de,
                            es: obj.es,
                            ar: obj.ar,
                            hi: obj.hi
                        };
                    }
                } catch (e) {
                    // console.warn('Failed to parse object in file:', file, match.substring(0, 20) + '...', e.message);
                    // Fallback: Use manual extraction if JSON parse fails because of complex formatting
                    // This is often needed for JS object literals
                    const charMatch = match.match(/char:\s*['"](.+?)['"]/);
                    if (charMatch) {
                        const char = charMatch[1];
                        if (!translations[char]) translations[char] = {};

                        const deMatch = match.match(/de:\s*['"](.+?)['"]/);
                        if (deMatch) translations[char].de = deMatch[1];

                        const esMatch = match.match(/es:\s*['"](.+?)['"]/);
                        if (esMatch) translations[char].es = esMatch[1];

                        const arMatch = match.match(/ar:\s*['"](.+?)['"]/);
                        if (arMatch) translations[char].ar = arMatch[1];

                        const hiMatch = match.match(/hi:\s*['"](.+?)['"]/);
                        if (hiMatch) translations[char].hi = hiMatch[1];
                    }
                }
            });
        }
    }
    return translations;
};

const processLevel = async (level, translationMap) => {
    const url = `${BASE_URL}${level}.json`;
    console.log(`Fetching Level ${level}...`);

    try {
        const data = await fetchJson(url);

        const processedData = data.map(item => {
            const char = item.simplified;

            // Attempt to find pinyin and meaning
            // The JSON structure is complex: forms -> transcriptions -> pinyin
            // meanings are array of strings

            let pinyin = '';
            let en = '';

            if (item.forms && item.forms.length > 0) {
                // Try to find a form with pinyin
                const form = item.forms[0];
                if (form.transcriptions && form.transcriptions.pinyin) {
                    pinyin = form.transcriptions.pinyin;
                }

                if (form.meanings && form.meanings.length > 0) {
                    en = form.meanings.join('; ');
                }
            }

            const newEntry = {
                char: char,
                pinyin: pinyin,
                en: en,
                // Default category
                cat: 'General'
            };

            // Inject existing translations
            if (translationMap[char]) {
                const trans = translationMap[char];
                if (trans.de) newEntry.de = trans.de;
                if (trans.es) newEntry.es = trans.es;
                if (trans.ar) newEntry.ar = trans.ar;
                if (trans.hi) newEntry.hi = trans.hi;
            }

            return newEntry;
        });

        // Write to file
        const outputFilename = `../src/hsk${level}_3.0.js`;
        const outputPath = path.join(__dirname, outputFilename);
        const fileContent = `export const hsk${level}New = ${JSON.stringify(processedData, null, 2)};`;

        fs.writeFileSync(outputPath, fileContent);
        console.log(`Saved ${processedData.length} words to ${outputFilename}`);

    } catch (error) {
        console.error(`Error processing level ${level}:`, error.message);
    }
};

const main = async () => {
    console.log('Building translation map from existing files...');
    const translations = extractTranslations();
    console.log(`Found translations for ${Object.keys(translations).length} characters.`);

    for (const level of NEW_HSK_LEVELS) {
        await processLevel(level, translations);
    }

    console.log('Done!');
};

main();
