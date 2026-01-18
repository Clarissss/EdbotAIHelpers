(function() {
    console.clear();
    console.log("%c EdBot Bypass 403 Request Audio", "background: #222; color: #00ff00; font-size: 16px; padding: 10px;");

    const originalFetch = window.fetch;

    window.fetch = async function(...args) {
        const url = args[0] ? args[0].toString() : '';

        if (url.includes('get-question-speech') && url.includes('text=')) {
            try {
                
                const urlObj = new URL(url);
                const rawText = urlObj.searchParams.get('text');

                if (rawText) {
                    const parts = rawText.split('Question:');
                    const statement = parts[0].replace('Statement:', '').replace(/"/g, '').trim();
                    const question = parts[1] ? parts[1].replace(/"/g, '').trim() : '';

                    console.group("%c 📢 Soal Baru Terdeteksi!", "font-size: 14px; color: yellow");
                    
                    console.log("%c 📖 Cerita Full:", "color: #ccc", statement);
                    console.log("%c ❓ Ditanya:", "font-weight: bold; color: white", question);

                    const ignoredWords = ['what', 'does', 'do', 'is', 'going', 'to', 'will', 'plans', 'plan', 'on', 'the', 'a', 'in', 'at', '?'];
                    const qWords = question.toLowerCase().replace('?', '').split(' ');
                    
                    const keywords = qWords.filter(w => !ignoredWords.includes(w) && w.length > 2);

                    const segments = statement.split(/,|\sand\s|\sthen\s/);
                    
                    let bestMatch = "";
                    let maxScore = 0;

                    segments.forEach(seg => {
                        let score = 0;
                        keywords.forEach(kw => {
                            if (seg.toLowerCase().includes(kw)) score++;
                        });
                        
                        if (score > maxScore) {
                            maxScore = score;
                            bestMatch = seg.trim();
                        }
                    });

                    console.log("%c 💡 Prediksi Jawaban (Cari kalimat ini):", "background: #004400; color: #00ff00; font-size: 14px; padding: 4px;");
                    if (bestMatch) {
                        console.log(` Mau Jawaban ? Nih dari sini wok > "${bestMatch}"`);
                    } else {
                        console.log(" (Tidak dapat mendeteksi pola otomatis, baca cerita di atas)");
                    }
                    
                    console.groupEnd();
                }
            } catch (e) {
                console.error("Gagal membaca soal:", e);
            }
        }

        return originalFetch.apply(this, args);
    };
})();