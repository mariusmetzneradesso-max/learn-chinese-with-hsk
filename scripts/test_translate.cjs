const https = require('https');

const translate = (text, targetLang) => {
    return new Promise((resolve, reject) => {
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;

        https.get(url, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    const result = JSON.parse(data);
                    // result[0][0][0] contains the translated text
                    if (result && result[0] && result[0][0] && result[0][0][0]) {
                        resolve(result[0][0][0]);
                    } else {
                        reject(new Error('Invalid response structure'));
                    }
                } catch (e) {
                    reject(e);
                }
            });
        }).on('error', reject);
    });
};

translate('Hello world', 'de')
    .then(res => console.log('Translation:', res))
    .catch(err => console.error('Error:', err));
