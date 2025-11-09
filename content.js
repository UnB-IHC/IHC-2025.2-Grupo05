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
    el.removeAttribute('data-wcag-violation');
  });

  // Se array vazio, apenas remove destaques
  if (!nodes || nodes.length === 0) {
    console.log('[WCAG Auditor] Destaques removidos');
    return;
  }
  
  // Adiciona novos destaques
  let firstElement = null;
  let highlightedCount = 0;

  nodes.forEach((nodeInfo, index) => {
    try {
      const element = document.querySelector(nodeInfo.selector);
      if (element) {
        element.classList.add('wcag-auditor-highlight');
        element.setAttribute('data-wcag-violation', nodeInfo.ruleId || 'unknown');
        
        // Torna o elemento focável via teclado se ainda não for
        if (!element.hasAttribute('tabindex') && !element.matches('a, button, input, select, textarea')) {
          element.setAttribute('tabindex', '-1');
        }

        highlightedCount++;

        // Guarda referência ao primeiro elemento
        if (!firstElement) {
          firstElement = element;
        }
      }
    } catch (e) {
      console.warn('[WCAG Auditor] Não foi possível destacar:', nodeInfo.selector, e);
    }
  });

  console.log(`[WCAG Auditor] ${highlightedCount} elemento(s) destacado(s)`);

  // Scroll suave até o primeiro elemento
  if (firstElement) {
    setTimeout(() => {
      firstElement.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center',
        inline: 'nearest'
      });
      
      // Foca o elemento para navegação por teclado
      try {
        firstElement.focus({ preventScroll: true });
      } catch (e) {
        // Alguns elementos não são focáveis, tudo bem
      }
    }, 100);
  }
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

// Injeta estilos para destacar violações de forma acessível
const style = document.createElement('style');
style.id = 'wcag-auditor-styles';
style.textContent = `
  /* Destaque de violações - acessível e visível */
  .wcag-auditor-highlight {
    outline: 4px solid #d32f2f !important;
    outline-offset: 3px !important;
    background-color: rgba(211, 47, 47, 0.1) !important;
    scroll-margin-top: 100px !important;
    position: relative !important;
    z-index: 999998 !important;
  }

  /* Animação de destaque (acessível - respeita prefers-reduced-motion) */
  @media (prefers-reduced-motion: no-preference) {
    .wcag-auditor-highlight {
      animation: wcag-pulse 1.5s ease-in-out infinite;
    }
  }

  @keyframes wcag-pulse {
    0%, 100% {
      outline-color: #d32f2f;
      background-color: rgba(211, 47, 47, 0.1);
    }
    50% {
      outline-color: #ff5252;
      background-color: rgba(255, 82, 82, 0.15);
    }
  }

  /* Estado de foco (para navegação por teclado) */
  .wcag-auditor-highlight:focus {
    outline: 5px solid #0066cc !important;
    outline-offset: 4px !important;
    box-shadow: 0 0 0 2px #ffffff, 0 0 0 6px #0066cc !important;
  }

  /* Badge com ID da regra violada */
  .wcag-auditor-highlight::before {
    content: attr(data-wcag-violation);
    position: absolute;
    top: -28px;
    left: 0;
    background: #d32f2f;
    color: white;
    padding: 4px 8px;
    border-radius: 3px;
    font-size: 11px;
    font-weight: 600;
    font-family: monospace;
    z-index: 999999;
    pointer-events: none;
    box-shadow: 0 2px 4px rgba(0,0,0,0.3);
  }
`;
document.head.appendChild(style);

console.log('[WCAG Auditor] Content script carregado e pronto');

// Exporta funções utilitárias para uso nas regras
window.wcagUtils = {
  getSelector,
  getSnippet
};
