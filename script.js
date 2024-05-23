const flame = document.querySelector('.flame');

navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const analyser = audioContext.createAnalyser();
        const microphone = audioContext.createMediaStreamSource(stream);
        const scriptProcessor = audioContext.createScriptProcessor(2048, 1, 1);

        analyser.smoothingTimeConstant = 0.5;
        analyser.fftSize = 1024;

        microphone.connect(analyser);
        analyser.connect(scriptProcessor);
        scriptProcessor.connect(audioContext.destination);
        scriptProcessor.onaudioprocess = () => {
            const array = new Uint8Array(analyser.frequencyBinCount);
            analyser.getByteFrequencyData(array);
            const volume = array.reduce((a, b) => a + b) / array.length;

            if (volume > 100) { // Adjust this threshold as needed
                flame.style.display = 'none';
            } else {
                flame.style.display = 'block';
            }
        };
    })
    .catch(err => console.error('Error accessing microphone:', err));
