const fs = require('fs');
const path = require('path');

// --- Configuration ---
const OLD_HSK_FILES = [
    '../src/hsk1.js',
    '../src/hsk2.js',
    '../src/hsk3.js',
    '../src/hsk4.js',
    '../src/hsk5.js',
    '../src/hsk6.js',
];

const NEW_HSK_FILES = [
    '../src/hsk1_3.0.js',
    '../src/hsk2_3.0.js',
    '../src/hsk3_3.0.js',
    '../src/hsk4_3.0.js',
    '../src/hsk5_3.0.js',
    '../src/hsk6_3.0.js',
    '../src/hsk7_3.0.js',
];

const LOG_FILE = 'refinement_log.txt';

// --- Functions ---

const extractOldEnglish = () => {
    const map = {};
    for (const file of OLD_HSK_FILES) {
        const filePath = path.join(__dirname, file);
        if (!fs.existsSync(filePath)) continue;
        const content = fs.readFileSync(filePath, 'utf8');
        const objectRegex = /\{[^{}]+\}/g;
        const matches = content.match(objectRegex);
        if (matches) {
            matches.forEach(match => {
                try {
                    // Robust regex extraction for 'char' and 'en' keys
                    const charMatch = match.match(/char:\s*(['"])(.+?)\1/);
                    const enMatch = match.match(/en:\s*(['"])(.+?)\1/);

                    if (charMatch && enMatch) {
                        map[charMatch[2]] = enMatch[2];
                    }
                } catch (e) { }
            });
        }
    }
    return map;
};

const refineEnglish = (en) => {
    if (!en) return '';
    // Split by semicolon
    const parts = en.split(';').map(s => s.trim()).filter(s => s);

    if (parts.length <= 1) return parts[0] || '';

    // Take top 2
    const candidates = parts.slice(0, 2);

    // Heuristic: If they are very similar (e.g. one contains same word), pick one
    // Simple check: do they share words?
    const words0 = candidates[0].toLowerCase().split(/\s+/);
    const words1 = candidates[1].toLowerCase().split(/\s+/);

    const intersection = words0.filter(w => words1.includes(w) && w.length > 2);

    // If significant overlap or if first one is short and good, stick to first?
    // User asked for "max 2", "best 1 if similar".
    // Let's check similarity.

    if (intersection.length > 0) {
        // Overlap found. Prefer the shorter one usually, OR just the first one as it's conventionally primary.
        // Often the second definition is a nuance. 
        // Example: "to love", "affection". Overlap: 0. Keep both? "Love / Affection"
        // Example: "father", "dad". Overlap: 0. Keep both? "Father / Dad"
        // Example: "to like", "to be fond of". Overlap: 0. Keep both?

        // Let's just keep the FIRST one if there is any word overlap to avoid redundancy like "to eat; to eat at a cafeteria".
        return candidates[0];
    }

    return candidates.join(' / ');
};

const main = () => {
    const oldMap = extractOldEnglish();
    let logContent = `Refinement Log - ${new Date().toISOString()}\n\n`;

    for (const file of NEW_HSK_FILES) {
        const filePath = path.join(__dirname, file);
        if (!fs.existsSync(filePath)) continue;

        console.log(`Processing ${file}...`);
        const content = fs.readFileSync(filePath, 'utf8');

        // Parse the export const ... = [...] syntax
        // We expect `export const hskXNew = [` 
        const startIdx = content.indexOf('[');
        const endIdx = content.lastIndexOf(']');

        if (startIdx === -1 || endIdx === -1) {
            console.warn(`Could not parse array in ${file}`);
            continue;
        }

        const jsonStr = content.substring(startIdx, endIdx + 1);
        let data;
        try {
            data = JSON.parse(jsonStr);
        } catch (e) {
            console.error(`JSON parse error in ${file}: ${e.message}`);
            continue;
        }

        let modifiedCount = 0;

        const newData = data.map(item => {
            const originalEn = item.en;
            let newEn = originalEn;
            let source = 'heuristic';

            if (oldMap[item.char]) {
                newEn = oldMap[item.char];
                source = 'old_vocab';
            } else {
                newEn = refineEnglish(originalEn);
                source = 'heuristic';
            }

            if (newEn !== originalEn) {
                logContent += `[${item.char}] (${source})\n  OLD: ${originalEn}\n  NEW: ${newEn}\n\n`;
                modifiedCount++;
            }

            return { ...item, en: newEn };
        });

        // Reconstruct file content
        const varName = content.match(/export const (\w+) =/)[1];
        const newFileContent = `export const ${varName} = ${JSON.stringify(newData, null, 2)};`;

        fs.writeFileSync(filePath, newFileContent);
        console.log(`  Updated ${modifiedCount} entries.`);
    }

    fs.writeFileSync(path.join(__dirname, LOG_FILE), logContent);
    console.log(`Log saved to ${LOG_FILE}`);
};

main();
