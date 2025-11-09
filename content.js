/**
 * Content Script - Executado no contexto da página
 * Realiza a auditoria DOM e comunica resultados ao popup
 */

// Cria instância do audit runner
class AuditRunner {
  constructor() {
    this.rules = new Map();
  }

  register(id, rule) {
    if (!rule.check || typeof rule.check !== 'function') {
      throw new Error(`Regra ${id} deve ter uma função check`);
    }
    
    this.rules.set(id, {
      id,
      wcag: rule.wcag || {},
      severity: rule.severity || 'error',
      description: rule.description || '',
      check: rule.check,
      enabled: rule.enabled !== false
    });
  }

  async run(document) {
    const violations = [];

    for (const [id, rule] of this.rules) {
      if (!rule.enabled) continue;

      try {
        const result = await rule.check(document);
        
        if (result && result.nodes && result.nodes.length > 0) {
          // Valida e normaliza o resultado conforme schema padrão
          const normalizedViolation = this.normalizeResult(id, rule, result);
          violations.push(normalizedViolation);
        }
      } catch (error) {
        console.error(`Erro ao executar regra ${id}:`, error);
      }
    }

    return violations;
  }

  /**
   * Normaliza resultado da regra conforme schema padrão
   * @param {string} id - ID da regra
   * @param {Object} rule - Metadados da regra
   * @param {Object} result - Resultado bruto da regra
   * @returns {Object} Resultado normalizado
   */
  normalizeResult(id, rule, result) {
    return {
      ruleId: id,
      wcag: {
        id: rule.wcag.id || 'N/A',
        level: rule.wcag.level || 'A'
      },
      severity: rule.severity || 'error',
      description: rule.description || 'Violação detectada',
      nodes: result.nodes.map(node => ({
        selector: node.selector || 'N/A',
        snippet: node.snippet || '',
        help: node.help || 'Corrija este elemento conforme as diretrizes WCAG'
      }))
    };
  }

  setRuleEnabled(id, enabled) {
    const rule = this.rules.get(id);
    if (rule) {
      rule.enabled = enabled;
    }
  }

  getRules() {
    return Array.from(this.rules.values()).map(rule => ({
      id: rule.id,
      wcag: rule.wcag,
      severity: rule.severity,
      description: rule.description,
      enabled: rule.enabled
    }));
  }
}

// Instância global do audit runner
const auditRunner = new AuditRunner();

/**
 * Percorre o DOM e executa todas as regras registradas
 * @returns {Promise<Array>} Lista de violações encontradas (normalizadas)
 */
async function runAudit() {
  try {
    console.log('[WCAG Auditor] Iniciando auditoria...');
    
    // Aguarda DOM estar completamente carregado
    if (document.readyState === 'loading') {
      await new Promise(resolve => {
        document.addEventListener('DOMContentLoaded', resolve);
      });
    }
    
    // Executa todas as regras registradas
    const violations = await auditRunner.run(document);
    
    console.log(`[WCAG Auditor] Auditoria concluída: ${violations.length} violação(ões) encontrada(s)`);
    
    return violations;
  } catch (error) {
    console.error('[WCAG Auditor] Erro ao executar auditoria:', error);
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

/**
 * Gera seletor CSS único para um elemento
 * @param {Element} element - Elemento DOM
 * @returns {string} Seletor CSS
 */
function getSelector(element) {
  if (element.id) {
    return `#${element.id}`;
  }
  
  if (element.className && typeof element.className === 'string') {
    const classes = element.className.trim().split(/\s+/).filter(c => c);
    if (classes.length > 0) {
      return `${element.tagName.toLowerCase()}.${classes[0]}`;
    }
  }
  
  return element.tagName.toLowerCase();
}

/**
 * Gera snippet HTML do elemento (truncado)
 * @param {Element} element - Elemento DOM
 * @returns {string} HTML snippet
 */
function getSnippet(element) {
  const html = element.outerHTML;
  if (html.length > 150) {
    return html.substring(0, 147) + '...';
  }
  return html;
}

// Listener para mensagens do service worker
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'START_AUDIT') {
    console.log('[WCAG Auditor] Mensagem START_AUDIT recebida');
    
    runAudit().then(violations => {
      console.log('[WCAG Auditor] Enviando resultados:', violations);
      sendResponse({ 
        success: true, 
        violations: violations,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        totalViolations: violations.reduce((sum, v) => sum + v.nodes.length, 0)
      });
    }).catch(error => {
      console.error('[WCAG Auditor] Erro na auditoria:', error);
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
  
  if (message.type === 'GET_RULES') {
    const rules = auditRunner.getRules();
    sendResponse({ success: true, rules });
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
    scroll-margin-top: 100px !important;
  }
`;
document.head.appendChild(style);

console.log('[WCAG Auditor] Content script carregado e pronto');

// Exporta funções utilitárias para uso nas regras
window.wcagUtils = {
  getSelector,
  getSnippet
};
