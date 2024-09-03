chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'startRecording') {
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
            } else {
              console.log('Script injetado com sucesso.');
              // Após injetar o script, chamar a função de gravação
              chrome.tabs.sendMessage(tabId, { action: 'startRecording' });
            }
          }
        );
      } else {
        console.error('Nenhuma aba ativa encontrada.');
      }
    });
  }
  sendResponse({ status: 'message received' });
  return true; // Manter o canal de comunicação aberto
});
