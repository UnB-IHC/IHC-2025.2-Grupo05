/**
 * Content Script - Executado no contexto da página
 * Realiza a auditoria DOM e comunica resultados ao popup
 */

// Importa o audit runner (será carregado dinamicamente)
let auditRunner = null;

/**
 * Percorre o DOM e executa todas as regras registradas
 * @returns {Promise<Array>} Lista de violações encontradas
 */
async function runAudit() {
  try {
    // Carrega o audit runner se ainda não foi carregado
    if (!auditRunner) {
      // Por enquanto, retorna array vazio até implementarmos as regras
      return [];
    }
    
    // Executa todas as regras registradas
    const violations = await auditRunner.run(document);
    return violations;
  } catch (error) {
    console.error('Erro ao executar auditoria:', error);
    return [];
  }
}

/**
 * Destaca elementos no DOM que possuem violações
 * @param {Array} nodes - Lista de seletores para destacar
 */
function highlightNodes(nodes) {
  // Remove destaques anteriores
  document.querySelectorAll('.wcag-auditor-highlight').forEach(el => {
    el.classList.remove('wcag-auditor-highlight');
  });
  
  // Adiciona novos destaques
  nodes.forEach(nodeInfo => {
    try {
      const element = document.querySelector(nodeInfo.selector);
      if (element) {
        element.classList.add('wcag-auditor-highlight');
        // Scroll para o primeiro elemento
        if (nodes.indexOf(nodeInfo) === 0) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    } catch (e) {
      console.warn('Não foi possível destacar:', nodeInfo.selector);
    }
  });
}

// Listener para mensagens do service worker
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'START_AUDIT') {
    runAudit().then(violations => {
      sendResponse({ 
        success: true, 
        violations: violations,
        timestamp: new Date().toISOString()
      });
    }).catch(error => {
      sendResponse({ 
        success: false, 
        error: error.message 
      });
    });
    return true; // Mantém o canal aberto para resposta assíncrona
  }
  
  if (message.type === 'HIGHLIGHT') {
    highlightNodes(message.nodes);
    sendResponse({ success: true });
    return true;
  }
});

// Injeta estilos para destacar violações
const style = document.createElement('style');
style.textContent = `
  .wcag-auditor-highlight {
    outline: 3px solid #ff0000 !important;
    outline-offset: 2px !important;
    background-color: rgba(255, 0, 0, 0.1) !important;
  }
`;
document.head.appendChild(style);

console.log('WCAG Auditor content script carregado');
