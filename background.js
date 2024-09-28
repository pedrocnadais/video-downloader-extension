chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'startDownload' || message.action === 'startRecording') {
    // Obtém a aba ativa no momento
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length > 0) {
        const tabId = tabs[0].id;
        
        // Injeta o content.js na aba ativa
        chrome.scripting.executeScript(
          {
            target: { tabId: tabId },
            files: ['content.js'],
          },
          () => {
            if (chrome.runtime.lastError) {
              console.error('Erro ao injetar script:', chrome.runtime.lastError.message);
              sendResponse({ status: 'injection_failed' });
            } else {
              // Enviar a mensagem correspondente ao content.js
              chrome.tabs.sendMessage(tabId, { action: message.action }, (response) => {
                if (chrome.runtime.lastError) {
                  console.error('Erro ao enviar mensagem para content.js:', chrome.runtime.lastError.message);
                } else {
                  sendResponse(response);
                }
              });
            }
          }
        );
      } else {
        console.error('Nenhuma aba ativa encontrada.');
        sendResponse({ status: 'no_active_tab' });
      }
    });

    // Retorna true para manter o canal de comunicação aberto enquanto a mensagem é processada
    return true;
  }
});
