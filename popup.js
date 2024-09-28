document.addEventListener('DOMContentLoaded', () => {
  const downloadButton = document.getElementById('download-button');
  const recordButton = document.getElementById('record-button');

  // Botão para tentar baixar o vídeo diretamente
  if (downloadButton) {
    downloadButton.addEventListener('click', () => {
      chrome.runtime.sendMessage({ action: 'startDownload' }, (response) => {
        if (chrome.runtime.lastError) {
          console.error('Erro ao enviar mensagem:', chrome.runtime.lastError.message);
        } else {
          console.log('Tentando baixar o vídeo diretamente...');
          // Verifica se o download direto falhou
          if (response.status === 'direct_download_unavailable') {
            alert('Não foi possível baixar o vídeo diretamente. Tente usar o botão de gravação.');
          }
        }
      });
    });
  }

  // Botão para gravar o vídeo usando MediaRecorder
  if (recordButton) {
    recordButton.addEventListener('click', () => {
      chrome.runtime.sendMessage({ action: 'startRecording' }, (response) => {
        if (chrome.runtime.lastError) {
          console.error('Erro ao enviar mensagem:', chrome.runtime.lastError.message);
        } else {
          console.log('Iniciando a gravação...');
        }
      });
    });
  }
});
