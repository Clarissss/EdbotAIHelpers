(function() {
    'use strict';

    console.clear();
    const LOG_STYLE = "background: #222; color: #00ff00; font-size: 14px; padding: 6px; border-radius: 4px;";
    console.log("%c EDBOT Bypasser: Info Soalnya wok", LOG_STYLE);

    const originalFetch = window.fetch;

    window.fetch = async function(...args) {
        const response = await originalFetch.apply(this, args);
        
        const url = args[0] ? args[0].toString() : '';

        if (url.includes('get-questions')) {
            const clone = response.clone();

            clone.json().then(data => {
                if (data && data.aQuestions && data.aQuestions.length > 0) {
                    
                    console.group(`%c SOAL BARU DITEMUKAN (${data.aQuestions.length} Soal)`, "color: yellow; font-size: 16px; font-weight: bold;");

                    const cheatSheet = data.aQuestions.map((item, index) => {
                        const qData = item.question_data;
                        
                        let questionText = qData.question || "Soal Gambar/Audio";
                        questionText = questionText.replace(/\n/g, ' ').substring(0, 50);

                        let rawAnswer = qData.answer;
                        let decodedAnswer = "KOSONG";
                        
                        try {
                            if (rawAnswer) {
                                decodedAnswer = atob(rawAnswer); 
                            }
                        } catch (e) {
                            decodedAnswer = "Error Decode";
                        }

                        return {
                            'No': index + 1,
                            'Pertanyaan': questionText,
                            '🔐 KUNCI JAWABAN': decodedAnswer,
                            'Opsi Pilihan': qData.options ? qData.options.join(', ') : '-'
                        };
                    });

                    console.table(cheatSheet);
                    console.log("%c Gunakan kolom 'KUNCI JAWABAN' untuk mengisi.", "color: cyan;");
                    console.groupEnd();
                }
            }).catch(err => {
            });
        }

        return response;
    };

})();