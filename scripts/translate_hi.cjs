const fs = require('fs');
const path = require('path');
const https = require('https');

// --- Configuration ---
const NEW_HSK_FILES = [
    '../src/hsk1_3.0.js',
    '../src/hsk2_3.0.js',
    '../src/hsk3_3.0.js',
    '../src/hsk4_3.0.js',
    '../src/hsk5_3.0.js',
    '../src/hsk6_3.0.js',
    '../src/hsk7_3.0.js',
];

const BATCH_SIZE = 30; // Batch size
const DELAY_MS = 300; // Delay between batches

// --- Helper Functions ---

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const translateBatch = (texts, targetLang) => {
    return new Promise((resolve, reject) => {
        const q = texts.join('\n');
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodeURIComponent(q)}`;

        https.get(url, (res) => {
            if (res.statusCode !== 200) {
                reject(new Error(`Status ${res.statusCode}`));
                return;
            }

            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    const result = JSON.parse(data);
                    if (!result || !result[0]) {
                        resolve([]);
                        return;
                    }

                    const rawSegments = result[0].map(s => s[0]);
                    const fullText = rawSegments.join('');
                    const translations = fullText.split('\n');

                    if (translations.length > texts.length && translations[translations.length - 1] === '') {
                        translations.pop();
                    }

                    resolve(translations);
                } catch (e) {
                    reject(e);
                }
            });
        }).on('error', reject);
    });
};

const processFile = async (file) => {
    const filePath = path.join(__dirname, file);
    if (!fs.existsSync(filePath)) return;

    console.log(`Processing ${file}...`);
    const content = fs.readFileSync(filePath, 'utf8');

    const startIdx = content.indexOf('[');
    const endIdx = content.lastIndexOf(']');
    if (startIdx === -1) return;

    const jsonStr = content.substring(startIdx, endIdx + 1);
    let data;
    try {
        data = JSON.parse(jsonStr);
    } catch (e) {
        console.error(`JSON parse error: ${e.message}`);
        return;
    }

    let modifiedCount = 0;
    let itemsToTranslate = [];

    // Identify items needing translation
    for (let i = 0; i < data.length; i++) {
        // Check if Hindi is missing
        if (!data[i].hi && data[i].en) {
            itemsToTranslate.push({ index: i, text: data[i].en });
        }
    }

    console.log(`  Found ${itemsToTranslate.length} words to translate.`);

    // Process in batches
    for (let i = 0; i < itemsToTranslate.length; i += BATCH_SIZE) {
        const batch = itemsToTranslate.slice(i, i + BATCH_SIZE);
        const texts = batch.map(b => b.text);

        try {
            const translations = await translateBatch(texts, 'hi');

            for (let j = 0; j < batch.length; j++) {
                if (translations[j]) {
                    data[batch[j].index].hi = translations[j].trim();
                    modifiedCount++;
                }
            }
            process.stdout.write('.');
        } catch (e) {
            console.error(`\nBatch error at ${i}: ${e.message}`);
            if (e.message.includes('429')) {
                console.log('Rate limited. Waiting 10s...');
                await sleep(10000);
                i -= BATCH_SIZE;
                continue;
            }
        }

        await sleep(DELAY_MS);
    }
    console.log('\n');

    if (modifiedCount > 0) {
        const varName = content.match(/export const (\w+) =/)[1];
        const newFileContent = `export const ${varName} = ${JSON.stringify(data, null, 2)};`;
        fs.writeFileSync(filePath, newFileContent);
        console.log(`Saved ${file} with ${modifiedCount} new translations.`);
    } else {
        console.log(`No changes for ${file}.`);
    }
};

const main = async () => {
    for (const file of NEW_HSK_FILES) {
        await processFile(file);
    }
    console.log('Done!');
};

main();
