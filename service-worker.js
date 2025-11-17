/**
 * Service Worker (background script) para Chrome Extension MV3
 * Gerencia comunicação entre popup e content scripts
 */

// Listener para mensagens do popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'RUN_AUDIT') {
    // Injeta script de auditoria no content script da aba ativa
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, { type: 'START_AUDIT' }, (response) => {
          sendResponse(response);
        });
      }
    });
    return true; // Mantém o canal aberto para resposta assíncrona
  }
  
  if (message.type === 'HIGHLIGHT_NODES') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, { 
          type: 'HIGHLIGHT', 
          nodes: message.nodes 
        }, (response) => {
          sendResponse(response);
        });
      }
    });
    return true;
  }
});

// Instalação da extensão
chrome.runtime.onInstalled.addListener(() => {
  console.log('WCAG Auditor instalado com sucesso!');
});
