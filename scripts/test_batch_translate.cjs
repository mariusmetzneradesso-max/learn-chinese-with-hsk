const https = require('https');

const translateBatch = (texts, targetLang) => {
    return new Promise((resolve, reject) => {
        // Join with newline
        const q = texts.join('\n');
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodeURIComponent(q)}`;

        console.log('Testing with newline join...');

        https.get(url, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    // console.log('Raw response:', data);
                    const result = JSON.parse(data);
                    resolve(result);
                } catch (e) {
                    reject(e);
                }
            });
        }).on('error', reject);
    });
};

translateBatch(['one', 'two', 'father / dad'], 'de')
    .then(res => {
        // Expected: [[["eins\n","one\n",...], ["zwei\n","two\n",...], ...]]
        // Or single string "eins\nzwei\n..." split by sentences.
        // Let's see the structure.
        console.log('Result:', JSON.stringify(res, null, 2));
    })
    .catch(err => console.error('Error:', err));
