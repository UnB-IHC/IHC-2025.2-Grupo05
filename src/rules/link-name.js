/**
 * Regra: link-name
 * WCAG 2.4.4 (Nível A) e 4.1.2 (Nome acessível)
 * 
 * Descrição: Verifica se todos os links (<a href>) possuem nome acessível.
 * Links sem texto ou com textos genéricos dificultam a navegação por leitores de tela.
 * 
 * Violação: <a href="/contato"></a> ou <a href="/sobre">clique aqui</a>
 * Correto: <a href="/contato">Entre em contato</a>
 */

(function() {
  'use strict';

  const RULE_ID = 'link-name';

  const ruleMetadata = {
    wcag: {
      id: '2.4.4',
      level: 'A'
    },
    severity: 'error',
    description: 'Links devem ter nome acessível (texto, aria-label ou aria-labelledby)',
    enabled: true
  };

  /**
   * Obtém o nome acessível de um elemento
   * Segue a ordem de prioridade do cálculo de nome acessível (Accessible Name Computation)
   * @param {HTMLElement} element - Elemento a verificar
   * @returns {string} Nome acessível (pode estar vazio)
   */
  function getAccessibleName(element) {
    // 1. aria-labelledby (mais alta prioridade)
    const labelledby = element.getAttribute('aria-labelledby');
    if (labelledby) {
      const labelElement = document.getElementById(labelledby);
      if (labelElement) {
        return labelElement.textContent.trim();
      }
    }

    // 2. aria-label
    const ariaLabel = element.getAttribute('aria-label');
    if (ariaLabel) {
      return ariaLabel.trim();
    }

    // 3. Texto visível do link (textContent)
    let textContent = '';
    
    // Se tem imagem filho, considerar o alt da imagem
    const img = element.querySelector('img');
    if (img && img.hasAttribute('alt')) {
      textContent += img.getAttribute('alt') + ' ';
    }

    // Adiciona texto direto do link
    textContent += element.textContent.trim();

    // Remove múltiplos espaços
    textContent = textContent.replace(/\s+/g, ' ').trim();

    // 4. title (última opção, não recomendado)
    if (!textContent) {
      const title = element.getAttribute('title');
      if (title) {
        return title.trim();
      }
    }

    return textContent;
  }

  /**
   * Verifica se o texto do link é genérico/não descritivo
   * @param {string} text - Texto do link
   * @returns {boolean} true se for genérico
   */
  function isGenericLinkText(text) {
    const genericTexts = [
      'clique aqui', 'click here', 'aqui', 'here',
      'saiba mais', 'leia mais', 'read more', 'more',
      'ver mais', 'see more',
      'continuar', 'continue',
      'link', 'página', 'page',
      'próximo', 'anterior', 'next', 'previous'
    ];

    const textLower = text.toLowerCase().trim();
    return genericTexts.includes(textLower);
  }

  /**
   * Verifica se todos os links possuem nome acessível
   * @param {Document} document - Documento DOM
   * @returns {Object} { nodes: Array } com violações encontradas
   */
  async function check(document) {
    const violations = [];
    
    // Seleciona apenas links com href (links de navegação)
    const links = document.querySelectorAll('a[href]');

    links.forEach(link => {
      const accessibleName = getAccessibleName(link);
      const href = link.getAttribute('href');

      // Caso 1: Link sem nome acessível (vazio)
      if (!accessibleName) {
        violations.push({
          selector: window.wcagUtils.getSelector(link),
          snippet: window.wcagUtils.getSnippet(link),
          help: 'Este link não tem texto visível nem rótulo acessível. Adicione texto descritivo, aria-label, ou garanta que imagens filhas tenham alt adequado.'
        });
        return;
      }

      // Caso 2: Nome acessível muito curto (1-2 caracteres)
      if (accessibleName.length <= 2) {
        violations.push({
          selector: window.wcagUtils.getSelector(link),
          snippet: window.wcagUtils.getSnippet(link),
          help: `O texto do link "${accessibleName}" é muito curto. Use um texto mais descritivo que indique claramente o destino ou propósito do link.`
        });
        return;
      }

      // Caso 3: Texto genérico (warning, não error crítico)
      if (isGenericLinkText(accessibleName)) {
        // Nota: podemos tornar isso um 'warn' em vez de 'error'
        // mas por enquanto mantemos como error para garantir qualidade
        violations.push({
          selector: window.wcagUtils.getSelector(link),
          snippet: window.wcagUtils.getSnippet(link),
          help: `O texto "${accessibleName}" é muito genérico. Reescreva para ser mais específico. Exemplo: em vez de "Clique aqui", use "Saiba mais sobre acessibilidade".`
        });
        return;
      }

      // Caso 4: Link apenas com URL ou # (não descritivo)
      if (accessibleName === href || accessibleName === '#') {
        violations.push({
          selector: window.wcagUtils.getSelector(link),
          snippet: window.wcagUtils.getSnippet(link),
          help: `O texto do link é apenas a URL ou "#". Adicione um texto descritivo que indique o destino ou ação do link.`
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
