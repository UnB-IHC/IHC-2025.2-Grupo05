/**
 * TEMPLATE DE REGRA WCAG
 * 
 * Este arquivo serve como template para criação de novas regras.
 * Copie este arquivo e renomeie para o nome da sua regra (ex: img-alt.js)
 * 
 * IMPORTANTE: Todas as regras devem seguir o schema padrão de resultado.
 */

/**
 * Template: Nome da Regra
 * WCAG X.X.X (Nível A/AA/AAA)
 * 
 * Descrição: [Descreva o que a regra verifica]
 * 
 * Exemplo de violação:
 * <elemento problema>conteúdo</elemento>
 * 
 * Exemplo correto:
 * <elemento corrigido>conteúdo</elemento>
 */

(function() {
  'use strict';

  // ID único da regra (usar kebab-case)
  const RULE_ID = 'template-rule';

  // Metadados da regra
  const ruleMetadata = {
    wcag: {
      id: 'X.X.X',        // Critério WCAG (ex: '1.1.1')
      level: 'A'          // Nível: 'A', 'AA' ou 'AAA'
    },
    severity: 'error',    // 'error' ou 'warn'
    description: 'Descrição da violação em português claro',
    enabled: true
  };

  /**
   * Função de verificação da regra
   * @param {Document} document - Documento DOM
   * @returns {Object} { nodes: Array } com elementos que violam a regra
   */
  async function check(document) {
    const violations = [];

    // 1. Selecione os elementos a verificar
    const elements = document.querySelectorAll('seletor-css');

    // 2. Para cada elemento, verifique a condição de violação
    elements.forEach(element => {
      // Condição que indica violação
      if (/* condição de violação */) {
        
        // 3. Para cada violação, adicione ao array com:
        // - selector: seletor CSS único
        // - snippet: HTML do elemento (truncado)
        // - help: dica de como corrigir
        
        violations.push({
          selector: window.wcagUtils.getSelector(element),
          snippet: window.wcagUtils.getSnippet(element),
          help: 'Dica específica de como corrigir esta violação'
        });
      }
    });

    // 4. Retorne o objeto com array de nodes
    return { nodes: violations };
  }

  // Registra a regra no audit runner
  if (typeof auditRunner !== 'undefined') {
    auditRunner.register(RULE_ID, {
      ...ruleMetadata,
      check
    });
    console.log(`[WCAG Auditor] Regra '${RULE_ID}' registrada`);
  }
})();

/**
 * EXEMPLO COMPLETO: Regra para verificar <img> sem alt
 */

/*
(function() {
  'use strict';

  const RULE_ID = 'img-alt';

  const ruleMetadata = {
    wcag: {
      id: '1.1.1',
      level: 'A'
    },
    severity: 'error',
    description: 'Imagens devem possuir texto alternativo (atributo alt)',
    enabled: true
  };

  async function check(document) {
    const violations = [];
    const images = document.querySelectorAll('img');

    images.forEach(img => {
      // Verifica se não tem alt ou se alt está vazio
      if (!img.hasAttribute('alt') || img.getAttribute('alt').trim() === '') {
        violations.push({
          selector: window.wcagUtils.getSelector(img),
          snippet: window.wcagUtils.getSnippet(img),
          help: 'Adicione o atributo alt com uma descrição da imagem. Use alt="" apenas para imagens decorativas.'
        });
      }
    });

    return { nodes: violations };
  }

  if (typeof auditRunner !== 'undefined') {
    auditRunner.register(RULE_ID, {
      ...ruleMetadata,
      check
    });
    console.log(`[WCAG Auditor] Regra '${RULE_ID}' registrada`);
  }
})();
*/
