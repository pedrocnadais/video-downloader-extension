document.addEventListener('DOMContentLoaded', () => {
  const downloadButton = document.getElementById('download-button');
  
  if (downloadButton) {
    downloadButton.addEventListener('click', () => {
      chrome.runtime.sendMessage({ action: 'startRecording' }, (response) => {
        if (chrome.runtime.lastError) {
          console.error('Erro ao enviar mensagem:', chrome.runtime.lastError.message);
        } else {
          console.log('Mensagem enviada com sucesso');
        }
      });
    });
  } else {
    console.error('Elemento com ID "download-button" não encontrado.');
  }
});
