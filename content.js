(function () {
  let recorder;
  let chunks = [];

  function startRecording() {
    const video = document.querySelector('video');
    if (video) {
      const stream = video.captureStream();
      recorder = new MediaRecorder(stream, { mimeType: 'video/webm' });

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        const title = document.title.replace(/[^\w\s]/gi, '');
        a.download = `${title}-video.webm`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        alert('Gravação salva com o nome: ' + a.download);
        chunks = [];
      };

      recorder.start();
       // Exibe o alerta quando o download começa
       alert('O download do vídeo foi iniciado.');

      video.onended = () => {
        if (recorder.state === 'recording') {
          recorder.stop();
        }
      };

      if (video.ended) {
        recorder.stop();
      }
    } else {
      alert('Nenhum vídeo encontrado.');
    }
  }

  // Ouvir mensagens enviadas pelo background.js para iniciar a gravação
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'startRecording') {
      startRecording();
    }
    sendResponse({ status: 'recording started' });
  });
})();
