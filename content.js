(function () {
  let recorder = null;
  let chunks = [];

  // Função para baixar o vídeo diretamente se houver um link direto
  function downloadDirectLink() {
    const video = document.querySelector('video');
    
    // Verifica se o vídeo tem um link direto (não 'blob:')
    if (video) {
      const videoSrc = video.src || video.getAttribute('src');
      if (videoSrc && !videoSrc.startsWith('blob:')) {
        // Se o link for direto (não 'blob:'), iniciar o download
        const a = document.createElement('a');
        a.href = videoSrc;
        const title = document.title.replace(/[^\w\s]/gi, '');
        a.download = `${title}-video.${videoSrc.split('.').pop()}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a); // Remover o link após o clique
        alert('Download direto iniciado: ' + a.download);
        return true; // Indica que o download foi realizado com sucesso
      } else {
        // Caso o link seja 'blob:', não é possível fazer o download direto
        return false;
      }
    } else {
      alert('Nenhum vídeo encontrado na página.');
      return false;
    }
  }

  // Função para gravar o vídeo com MediaRecorder
  function startRecording() {
    const video = document.querySelector('video');

    // Verifica se o vídeo existe e se a gravação já foi iniciada
    if (video && !recorder) {
      const stream = video.captureStream();
      console.log('Stream capturado:', stream);

      recorder = new MediaRecorder(stream, { mimeType: 'video/webm' });

      // Coleta os pedaços de vídeo enquanto a gravação ocorre
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
          console.log('Dados capturados:', event.data);
        }
      };

      // Ao parar a gravação, cria e baixa o arquivo
      recorder.onstop = () => {
        if (chunks.length > 0) {
          const blob = new Blob(chunks, { type: 'video/webm' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.style.display = 'none';
          a.href = url;
          const title = document.title.replace(/[^\w\s]/gi, '');
          a.download = `${title}-video.webm`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a); // Remove o link após o download
          window.URL.revokeObjectURL(url); // Revoga o URL do blob
          alert(`Gravação salva com o nome: ${a.download}`);
          chunks = [];
        } else {
          alert('Nenhum dado foi gravado. Verifique se o vídeo estava tocando corretamente.');
        }

        // Resetar o estado da gravação
        recorder = null;
      };

      // Inicia a gravação e exibe o alerta uma vez
      recorder.start();
      console.log('Gravação iniciada.');
      alert('Gravação iniciada.');

      // Parar a gravação automaticamente quando o vídeo terminar
      video.onended = () => {
        if (recorder && recorder.state === 'recording') {
          recorder.stop();
          console.log('Gravação parada automaticamente após o vídeo.');
        }
      };
    } else if (!video) {
      alert('Nenhum vídeo encontrado.');
    } else if (recorder) {
      alert('A gravação já está em andamento.');
    }
  }

  // Ouvir mensagens do background.js
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'startDownload') {
      const downloadSuccess = downloadDirectLink();
      if (!downloadSuccess) {
        alert('Download direto não disponível. Tente usar o botão de gravação.');
        sendResponse({ status: 'direct_download_unavailable' });
      } else {
        sendResponse({ status: 'download_started' });
      }
    } else if (message.action === 'startRecording') {
      startRecording();
    }
  });
})();
