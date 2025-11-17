/**
 * Regra: page-title
 * WCAG 2.4.2 (Nível A)
 * 
 * Descrição: Verifica se a página possui um elemento <title> descritivo e não vazio.
 * O título da página é essencial para orientação e navegação em leitores de tela.
 * 
 * Violação: <title></title> ou <title>   </title> ou ausência do elemento
 * Correto: <title>Universidade de Brasília - UnB</title>
 */

(function() {
  'use strict';

  const RULE_ID = 'page-title';

  const ruleMetadata = {
    wcag: {
      id: '2.4.2',
      level: 'A'
    },
    severity: 'error',
    description: 'A página deve ter um título (<title>) descritivo e não vazio',
    enabled: true
  };

  /**
   * Verifica se a página possui um <title> válido
   * @param {Document} document - Documento DOM
   * @returns {Object} { nodes: Array } com violações encontradas
   */
  async function check(document) {
    const violations = [];
    const titleElement = document.querySelector('title');

    // Verifica se o <title> existe
    if (!titleElement) {
      violations.push({
        selector: 'head',
        snippet: '<head> ... (sem elemento <title>)</head>',
        help: 'Adicione um elemento <title> dentro do <head> com uma descrição clara e única da página.'
      });
      return { nodes: violations };
    }

    // Verifica se o <title> tem conteúdo
    const titleText = titleElement.textContent.trim();
    if (!titleText) {
      violations.push({
        selector: 'title',
        snippet: window.wcagUtils.getSnippet(titleElement),
        help: 'O elemento <title> existe mas está vazio. Adicione um texto descritivo que identifique o propósito ou conteúdo da página.'
      });
    }

    // Verifica se o título é muito curto (menos de 3 caracteres pode não ser descritivo)
    else if (titleText.length < 3) {
      violations.push({
        selector: 'title',
        snippet: window.wcagUtils.getSnippet(titleElement),
        help: `O título "${titleText}" é muito curto. Use um título mais descritivo que identifique claramente o conteúdo da página.`
      });
    }

    return { nodes: violations };
  }

  // Registra a regra no audit runner
  if (typeof auditRunner !== 'undefined') {
    auditRunner.register(RULE_ID, {
      ...ruleMetadata,
      check
    });
    console.log(`[WCAG Auditor] Regra '${RULE_ID}' (WCAG ${ruleMetadata.wcag.id}) registrada`);
  }
})();
