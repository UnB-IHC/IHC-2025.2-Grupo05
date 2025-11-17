/**
 * Messaging - Comunicação entre popup e content script
 * SEM service worker - comunicação direta!
 */

/**
 * Envia mensagem para o content script da aba ativa
 * @param {Object} message - Mensagem a ser enviada
 * @returns {Promise<Object>} Resposta do content script
 */
async function sendToContent(message) {
  return new Promise((resolve, reject) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (!tabs[0]) {
        reject(new Error("Nenhuma aba ativa encontrada"));
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
 * @param {Object} config - Configurações do usuário (opcional)
 * @returns {Promise<Object>} Resultado da auditoria
 */
async function requestAudit(config = null) {
  try {
    console.log("[Messaging] Solicitando auditoria com config:", config);

    // Envia direto pro content script
    const response = await sendToContent({
      type: "START_AUDIT",
      config: config, // PASSA A CONFIG!
    });

    console.log("[Messaging] Resposta recebida:", response);
    return response;
  } catch (error) {
    console.error("[Messaging] Erro ao solicitar auditoria:", error);
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
    const response = await sendToContent({
      type: "HIGHLIGHT",
      nodes,
    });
    return response;
  } catch (error) {
    console.error("[Messaging] Erro ao solicitar destaque:", error);
    throw error;
  }
}

/**
 * Busca lista de regras disponíveis
 * @returns {Promise<Array>} Lista de regras
 */
async function getRules() {
  try {
    const response = await sendToContent({ type: "GET_RULES" });
    return response.rules || [];
  } catch (error) {
    console.error("[Messaging] Erro ao buscar regras:", error);
    return [];
  }
}

// Exporta para uso no popup
if (typeof window !== "undefined") {
  window.messaging = {
    sendToContent,
    requestAudit,
    requestHighlight,
    getRules,
  };
}

console.log("[Messaging] Módulo carregado ✓");
