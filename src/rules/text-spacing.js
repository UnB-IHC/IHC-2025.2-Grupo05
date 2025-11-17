/**
 * Regra: text-spacing
 * WCAG 2.2 — 1.4.12 (Text Spacing).
 * 
 * Descrição: Verifica se o espaçamento de texto pode ser aumentado sem perda de conteúdo
 * ou funcionalidade. Usuários com dislexia e baixa visão frequentemente ajustam espaçamentos.
 * 
 * A regra testa se aplicar os seguintes valores mínimos quebra o layout:
 * - line-height: 1.5x tamanho da fonte
 * - letter-spacing: 0.12em
 * - word-spacing: 0.16em
 * - paragraph spacing: 2x tamanho da fonte
 * 
 * NOTA: Esta verificação detecta elementos com altura/largura fixa que podem
 * causar overflow, mas não pode testar todas as situações de quebra de layout.
 * 
 * Violação: Elementos com height fixa, overflow:hidden, ou white-space:nowrap
 * Correto: Usar min-height, overflow:visible/auto, permitir wrap de texto
 */

(function() {
  'use strict';

  const RULE_ID = 'text-spacing';

  const ruleMetadata = {
    wcag: {
      id: '1.4.12',
      level: 'AA'
    },
    severity: 'warn', // warn porque é difícil detectar todas as situações automaticamente
    description: 'Espaçamento de texto deve poder ser aumentado sem perda de conteúdo/funcionalidade',
    enabled: true
  };

  /**
   * Verifica se um elemento tem restrições que podem impedir ajuste de espaçamento
   * @param {Element} element - Elemento a verificar
   * @returns {Object|null} Informação sobre a violação ou null
   */
  function checkTextSpacingRestrictions(element) {
    const computedStyle = window.getComputedStyle(element);
    const violations = [];

    // Ignora elementos sem texto
    const textContent = element.textContent.trim();
    if (!textContent || textContent.length === 0) {
      return null;
    }

    // 1. Altura fixa em elementos com texto
    const height = computedStyle.height;
    const maxHeight = computedStyle.maxHeight;
    
    if (height && height !== 'auto' && !height.includes('%')) {
      const heightValue = parseFloat(height);
      // Se altura é fixa e pequena, pode cortar texto com espaçamento aumentado
      if (heightValue > 0 && heightValue < 500) {
        violations.push({
          property: 'height',
          value: height,
          issue: 'Altura fixa pode cortar texto quando espaçamento é aumentado'
        });
      }
    }

    // 2. max-height muito restritiva
    if (maxHeight && maxHeight !== 'none' && !maxHeight.includes('%')) {
      const maxHeightValue = parseFloat(maxHeight);
      if (maxHeightValue > 0 && maxHeightValue < 200) {
        violations.push({
          property: 'max-height',
          value: maxHeight,
          issue: 'max-height restritiva pode limitar espaçamento de texto'
        });
      }
    }

    // 3. overflow: hidden em elementos com texto
    const overflow = computedStyle.overflow;
    const overflowY = computedStyle.overflowY;
    
    if ((overflow === 'hidden' || overflowY === 'hidden') && textContent.length > 50) {
      violations.push({
        property: 'overflow',
        value: overflow,
        issue: 'overflow:hidden pode ocultar texto quando espaçamento é aumentado'
      });
    }

    // 4. white-space: nowrap (impede quebra de linha)
    const whiteSpace = computedStyle.whiteSpace;
    if (whiteSpace === 'nowrap' && textContent.length > 30) {
      violations.push({
        property: 'white-space',
        value: whiteSpace,
        issue: 'white-space:nowrap impede quebra de linha com espaçamento aumentado'
      });
    }

    // 5. line-height muito restritiva (menor que 1.2)
    const lineHeight = computedStyle.lineHeight;
    if (lineHeight && lineHeight !== 'normal') {
      const lineHeightValue = parseFloat(lineHeight);
      const fontSize = parseFloat(computedStyle.fontSize);
      
      if (lineHeightValue && fontSize) {
        const ratio = lineHeightValue / fontSize;
        if (ratio < 1.2 && textContent.length > 20) {
          violations.push({
            property: 'line-height',
            value: lineHeight,
            issue: `line-height muito baixa (${ratio.toFixed(2)}). Mínimo recomendado: 1.5`
          });
        }
      }
    }

    // 6. Largura fixa muito restritiva
    const width = computedStyle.width;
    if (width && width !== 'auto' && !width.includes('%')) {
      const widthValue = parseFloat(width);
      if (widthValue > 0 && widthValue < 300 && textContent.length > 30) {
        violations.push({
          property: 'width',
          value: width,
          issue: 'Largura fixa pequena pode causar overflow com word-spacing aumentado'
        });
      }
    }

    return violations.length > 0 ? violations : null;
  }

  /**
   * Verifica espaçamento de texto na página
   * @param {Document} document - Documento DOM
   * @returns {Object} { nodes: Array } com violações encontradas
   */
  async function check(document) {
    const allViolations = [];
    
    // Seleciona elementos que tipicamente contém texto
    const textElements = document.querySelectorAll(
      'p, div, span, h1, h2, h3, h4, h5, h6, li, td, th, button, a, label, article, section'
    );

    const checkedElements = new Set(); // Evita duplicatas

    textElements.forEach(element => {
      // Evita verificar elementos já verificados
      if (checkedElements.has(element)) {
        return;
      }
      checkedElements.add(element);

      const restrictions = checkTextSpacingRestrictions(element);
      
      if (restrictions) {
        // Agrupa todas as issues deste elemento
        const issuesList = restrictions
          .map(r => `${r.property}: ${r.value} (${r.issue})`)
          .join('; ');

        allViolations.push({
          selector: window.wcagUtils.getSelector(element),
          snippet: window.wcagUtils.getSnippet(element),
          help: `Este elemento tem restrições de CSS que podem impedir ajuste de espaçamento: ${issuesList}. ` +
                `Recomendações: use min-height em vez de height, overflow:visible/auto em vez de hidden, ` +
                `evite white-space:nowrap em textos longos, use line-height >= 1.5.`
        });
      }
    });

    // Limita a 20 violações para não sobrecarregar o relatório
    if (allViolations.length > 20) {
      allViolations.length = 20;
    }

    return { nodes: allViolations };
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
