/**
 * Messaging - Utilitários para comunicação entre componentes da extensão
 */

/**
 * Envia mensagem para o service worker
 * @param {Object} message - Mensagem a ser enviada
 * @returns {Promise<Object>} Resposta do service worker
 */
async function sendToBackground(message) {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(message, (response) => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
      } else {
        resolve(response);
      }
    });
  });
}

/**
 * Envia mensagem para o content script da aba ativa
 * @param {Object} message - Mensagem a ser enviada
 * @returns {Promise<Object>} Resposta do content script
 */
async function sendToContent(message) {
  return new Promise((resolve, reject) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (!tabs[0]) {
        reject(new Error('Nenhuma aba ativa encontrada'));
        return;
      }

      chrome.tabs.sendMessage(tabs[0].id, message, (response) => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
        } else {
          resolve(response);
        }
      });
    });
  });
}

/**
 * Solicita execução de auditoria na página atual
 * @returns {Promise<Object>} Resultado da auditoria
 */
async function requestAudit() {
  try {
    const response = await sendToBackground({ type: 'RUN_AUDIT' });
    return response;
  } catch (error) {
    console.error('Erro ao solicitar auditoria:', error);
    throw error;
  }
}

/**
 * Solicita destaque de elementos na página
 * @param {Array} nodes - Lista de nós a serem destacados
 * @returns {Promise<Object>} Confirmação
 */
async function requestHighlight(nodes) {
  try {
    const response = await sendToBackground({ 
      type: 'HIGHLIGHT_NODES', 
      nodes 
    });
    return response;
  } catch (error) {
    console.error('Erro ao solicitar destaque:', error);
    throw error;
  }
}

// Exporta para uso no popup
if (typeof window !== 'undefined') {
  window.messaging = {
    sendToBackground,
    sendToContent,
    requestAudit,
    requestHighlight
  };
}
