/**
 * Regra: icon-labels
 *  WCAG 2.2 — 4.1.2 (Name, Role, Value) — nomes acessíveis.
 * 
 * Descrição: Verifica se ícones (especialmente em links e botões) têm rótulo textual
 * claro que indica sua função. Ícones sem texto visível devem ter aria-label ou
 * título adequado para que a função seja compreensível.
 * 
 * NOTA: Detecta elementos interativos (links, botões) que parecem conter apenas
 * ícones (Font Awesome, Material Icons, SVG, etc) sem texto visível.
 * 
 * Violação: <a href="/home"><i class="fa fa-home"></i></a>
 *           <button><span class="icon-search"></span></button>
 * 
 * Correto: <a href="/home"><i class="fa fa-home"></i> Página Inicial</a>
 *          <button aria-label="Buscar"><span class="icon-search"></span></button>
 */

(function() {
  'use strict';

  const RULE_ID = 'icon-labels';

  const ruleMetadata = {
    wcag: {
      id: '1.1.1',
      level: 'A'
    },
    severity: 'error',
    description: 'Ícones em links/botões devem ter rótulo textual visível ou aria-label',
    enabled: true
  };

  /**
   * Verifica se elemento parece conter apenas ícone
   * @param {Element} element - Elemento a verificar
   * @returns {boolean} true se parece ter apenas ícone
   */
  function containsOnlyIcon(element) {
    // Verifica se tem texto visível (excluindo whitespace)
    const visibleText = element.textContent.trim();
    if (visibleText.length > 0) {
      return false; // Tem texto visível, não é só ícone
    }

    // Procura por elementos comuns de ícones
    const iconSelectors = [
      'i[class*="fa"]', 'i[class*="icon"]', 'i[class*="material"]',
      'span[class*="icon"]', 'span[class*="fa"]', 'span[class*="material"]',
      'svg', 'img[class*="icon"]',
      '[class*="glyphicon"]', '[class*="octicon"]'
    ];

    for (const selector of iconSelectors) {
      if (element.querySelector(selector)) {
        return true;
      }
    }

    // Verifica se a própria classe sugere ícone
    const className = element.className || '';
    const iconClassPatterns = [
      'icon', 'fa-', 'material-', 'glyphicon', 'octicon'
    ];

    if (iconClassPatterns.some(pattern => className.includes(pattern))) {
      return true;
    }

    return false;
  }

  /**
   * Obtém o nome acessível de um elemento (incluindo aria-label, title)
   * @param {Element} element - Elemento a verificar
   * @returns {string} Nome acessível
   */
  function getAccessibleName(element) {
    // aria-labelledby
    const labelledby = element.getAttribute('aria-labelledby');
    if (labelledby) {
      const labelElement = document.getElementById(labelledby);
      if (labelElement) {
        return labelElement.textContent.trim();
      }
    }

    // aria-label
    const ariaLabel = element.getAttribute('aria-label');
    if (ariaLabel && ariaLabel.trim()) {
      return ariaLabel.trim();
    }

    // title (não é ideal, mas é melhor que nada)
    const title = element.getAttribute('title');
    if (title && title.trim()) {
      return title.trim();
    }

    // Verifica se SVG tem <title>
    const svg = element.querySelector('svg');
    if (svg) {
      const svgTitle = svg.querySelector('title');
      if (svgTitle && svgTitle.textContent.trim()) {
        return svgTitle.textContent.trim();
      }
    }

    // Verifica se img tem alt
    const img = element.querySelector('img');
    if (img) {
      const alt = img.getAttribute('alt');
      if (alt && alt.trim()) {
        return alt.trim();
      }
    }

    return '';
  }

  /**
   * Verifica se ícones têm rótulos adequados
   * @param {Document} document - Documento DOM
   * @returns {Object} { nodes: Array } com violações encontradas
   */
  async function check(document) {
    const violations = [];

    // Verifica links e botões que podem conter ícones
    const interactiveElements = document.querySelectorAll('a[href], button, [role="button"]');

    interactiveElements.forEach(element => {
      // Verifica se parece conter apenas ícone
      if (!containsOnlyIcon(element)) {
        return; // Tem texto visível, está ok
      }

      // Verifica se tem nome acessível
      const accessibleName = getAccessibleName(element);

      if (!accessibleName || accessibleName.length < 2) {
        const tagName = element.tagName.toLowerCase();
        const href = element.getAttribute('href') || '';
        
        // Identifica o tipo de ícone para mensagem mais específica
        let iconType = 'ícone';
        if (element.querySelector('i[class*="fa"]')) {
          iconType = 'ícone Font Awesome';
        } else if (element.querySelector('[class*="material"]')) {
          iconType = 'ícone Material';
        } else if (element.querySelector('svg')) {
          iconType = 'SVG';
        } else if (element.querySelector('img')) {
          iconType = 'imagem de ícone';
        }

        violations.push({
          selector: window.wcagUtils.getSelector(element),
          snippet: window.wcagUtils.getSnippet(element),
          help: `Este ${tagName} contém apenas ${iconType} sem texto visível ou rótulo acessível. ` +
                `Opções para corrigir: ` +
                `1) Adicione texto visível junto ao ícone: "<i class="icon"></i> Texto"; ` +
                `2) Adicione aria-label="${tagName === 'a' ? 'ex: Página Inicial' : 'ex: Buscar'}"; ` +
                `3) Use aria-labelledby apontando para elemento com ID; ` +
                `4) Para SVG, adicione <title> dentro do SVG; ` +
                `5) Para <img>, garanta que tem alt adequado. ` +
                `A função do ${iconType} deve ser clara mesmo para quem não o vê.`
        });
      }
      // Verifica se o rótulo é muito genérico
      else if (accessibleName.length <= 3) {
        violations.push({
          selector: window.wcagUtils.getSelector(element),
          snippet: window.wcagUtils.getSnippet(element),
          help: `O rótulo "${accessibleName}" é muito curto/genérico. ` +
                `Use um rótulo mais descritivo que indique claramente a função do elemento. ` +
                `Exemplo: em vez de "OK", use "Confirmar envio"; em vez de "X", use "Fechar janela".`
        });
      }
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
