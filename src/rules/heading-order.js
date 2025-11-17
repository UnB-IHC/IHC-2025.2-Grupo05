/**
 * Regra: heading-order
 * NBR 17225:2025 — Diretrizes 2.4 (Navegável) e 1.3 (Adaptável); WCAG 2.2 — 2.4., 2.4.4.
 * 
 * Descrição: Verifica se os cabeçalhos seguem uma hierarquia lógica (H1 → H2 → H3...)
 * sem "pular" níveis. Estrutura de cabeçalhos inadequada dificulta a navegação com
 * leitores de tela e a compreensão da estrutura da página.
 * 
 * Violação: <h1>Título</h1> ... <h3>Subtítulo</h3> (pulou o H2)
 * Correto: <h1>Título</h1> ... <h2>Seção</h2> ... <h3>Subseção</h3>
 */

(function() {
  'use strict';

  const RULE_ID = 'heading-order';

  const ruleMetadata = {
    wcag: {
      id: '1.3.1',
      level: 'A'
    },
    severity: 'error',
    description: 'Cabeçalhos devem seguir hierarquia lógica (H1 → H2 → H3...) sem pular níveis',
    enabled: true
  };

  /**
   * Verifica se os cabeçalhos seguem hierarquia lógica
   * @param {Document} document - Documento DOM
   * @returns {Object} { nodes: Array } com violações encontradas
   */
  async function check(document) {
    const violations = [];
    
    // Seleciona todos os cabeçalhos (h1 a h6) na ordem que aparecem no documento
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    
    if (headings.length === 0) {
      return { nodes: violations };
    }

    let previousLevel = 0; // Começa em 0 (antes do H1)

    headings.forEach((heading, index) => {
      // Extrai o número do nível (h1 = 1, h2 = 2, etc.)
      const currentLevel = parseInt(heading.tagName.substring(1));
      
      // Verifica se pulou níveis (ex: de H1 para H3)
      if (currentLevel > previousLevel + 1) {
        const skippedLevel = previousLevel + 1;
        const headingText = heading.textContent.trim().substring(0, 50);
        
        violations.push({
          selector: window.wcagUtils.getSelector(heading),
          snippet: window.wcagUtils.getSnippet(heading),
          help: `Este cabeçalho <h${currentLevel}> pulou do nível H${previousLevel} para H${currentLevel}. ` +
                `Use <h${skippedLevel}> para manter a hierarquia lógica. ` +
                `${headingText ? `Conteúdo: "${headingText}${headingText.length === 50 ? '...' : ''}"` : ''}`
        });
      }
      
      // Verifica se é o primeiro cabeçalho e não é H1
      if (index === 0 && currentLevel !== 1) {
        violations.push({
          selector: window.wcagUtils.getSelector(heading),
          snippet: window.wcagUtils.getSnippet(heading),
          help: `A página começa com <h${currentLevel}> mas deveria começar com <h1>. ` +
                `O primeiro cabeçalho deve sempre ser H1 para representar o título principal da página.`
        });
      }

      previousLevel = currentLevel;
    });

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
