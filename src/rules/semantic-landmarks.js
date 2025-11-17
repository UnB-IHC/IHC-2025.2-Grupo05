/**
 * Regra: semantic-landmarks
 * WCAG 1.3.1 (Nível A) - Info e Relações
 * NBR 17225:2025 — Diretriz 1.3 (Adaptável)
 * 
 * Descrição: Verifica o uso correto de landmarks semânticos HTML5:
 * <header>, <nav>, <main>, <aside>, <footer>. Essas tags estruturam
 * a página e facilitam navegação com leitores de tela e atalhos de teclado.
 * 
 * Violação: Página sem <main>, múltiplos <main>, ausência de landmarks básicos
 * Correto: Um <main> por página + uso apropriado de <header>, <nav>, <footer>
 */

(function() {
  'use strict';

  const RULE_ID = 'semantic-landmarks';

  const ruleMetadata = {
    wcag: {
      id: '1.3.1',
      level: 'A'
    },
    severity: 'error',
    description: 'A página deve usar landmarks semânticos HTML5 (<header>, <nav>, <main>, <footer>)',
    enabled: true
  };

  /**
   * Verifica uso correto de landmarks semânticos
   * @param {Document} document - Documento DOM
   * @returns {Object} { nodes: Array } com violações encontradas
   */
  async function check(document) {
    const violations = [];
    
    // 1. Verifica elemento <main> (obrigatório e único)
    const mainElements = document.querySelectorAll('main, [role="main"]');
    
    if (mainElements.length === 0) {
      violations.push({
        selector: 'body',
        snippet: '<body>...</body>',
        help: 'A página deve ter um elemento <main> contendo o conteúdo principal. ' +
              'Isso permite que usuários de leitores de tela pulem diretamente para o conteúdo. ' +
              'Exemplo: <main><h1>Título</h1><p>Conteúdo...</p></main>'
      });
    } else if (mainElements.length > 1) {
      mainElements.forEach((main, index) => {
        if (index > 0) { // Só reporta a partir do segundo <main>
          violations.push({
            selector: window.wcagUtils.getSelector(main),
            snippet: window.wcagUtils.getSnippet(main),
            help: `Encontrados ${mainElements.length} elementos <main> na página. ` +
                  `Deve haver apenas UM <main> por página contendo o conteúdo principal. ` +
                  `Use <section> ou <article> para outras áreas de conteúdo.`
          });
        }
      });
    }

    // 2. Verifica presença de <nav> (recomendado)
    const navElements = document.querySelectorAll('nav, [role="navigation"]');
    if (navElements.length === 0) {
      // Verifica se há menus que deveriam ser <nav>
      const menuLikeElements = document.querySelectorAll(
        '[class*="menu"], [id*="menu"], [class*="nav"], [id*="nav"]'
      );
      
      if (menuLikeElements.length > 0) {
        menuLikeElements.forEach(element => {
          // Verifica se contém links
          const links = element.querySelectorAll('a[href]');
          if (links.length >= 3 && element.tagName !== 'NAV') {
            violations.push({
              selector: window.wcagUtils.getSelector(element),
              snippet: window.wcagUtils.getSnippet(element),
              help: `Este elemento parece ser um menu de navegação mas usa <${element.tagName.toLowerCase()}> ` +
                    `em vez de <nav>. Use o elemento semântico <nav> para menus de navegação. ` +
                    `Exemplo: <nav><ul><li><a href="...">Link</a></li></ul></nav>`
            });
          }
        });
      }
    }

    // 3. Verifica presença de <header> (recomendado)
    const headerElements = document.querySelectorAll('header, [role="banner"]');
    if (headerElements.length === 0) {
      // Verifica se há elementos que parecem ser cabeçalhos
      const headerLikeElements = document.querySelectorAll(
        '[class*="header"], [id*="header"], [class*="top-bar"], [id*="top"]'
      );
      
      if (headerLikeElements.length > 0) {
        headerLikeElements.forEach(element => {
          if (element.tagName !== 'HEADER' && element !== document.body) {
            violations.push({
              selector: window.wcagUtils.getSelector(element),
              snippet: window.wcagUtils.getSnippet(element),
              help: `Este elemento parece ser o cabeçalho da página mas usa <${element.tagName.toLowerCase()}> ` +
                    `em vez de <header>. Use o elemento semântico <header> para o cabeçalho principal. ` +
                    `Exemplo: <header><h1>Logo</h1><nav>...</nav></header>`
            });
          }
        });
      }
    }

    // 4. Verifica presença de <footer> (recomendado)
    const footerElements = document.querySelectorAll('footer, [role="contentinfo"]');
    if (footerElements.length === 0) {
      // Verifica se há elementos que parecem ser rodapés
      const footerLikeElements = document.querySelectorAll(
        '[class*="footer"], [id*="footer"], [class*="bottom"], [id*="bottom"]'
      );
      
      if (footerLikeElements.length > 0) {
        footerLikeElements.forEach(element => {
          if (element.tagName !== 'FOOTER' && element !== document.body) {
            violations.push({
              selector: window.wcagUtils.getSelector(element),
              snippet: window.wcagUtils.getSnippet(element),
              help: `Este elemento parece ser o rodapé da página mas usa <${element.tagName.toLowerCase()}> ` +
                    `em vez de <footer>. Use o elemento semântico <footer> para o rodapé. ` +
                    `Exemplo: <footer><p>&copy; 2025 - Contato</p></footer>`
            });
          }
        });
      }
    }

    // 5. Detecta uso excessivo de divs onde landmarks seriam apropriados
    const bodyChildren = Array.from(document.body.children);
    bodyChildren.forEach(child => {
      if (child.tagName === 'DIV' || child.tagName === 'SECTION') {
        const hasNavigation = child.querySelectorAll('nav, a[href]').length >= 5;
        const isLarge = child.innerHTML.length > 500;
        const hasRole = child.hasAttribute('role');
        
        if (isLarge && !hasRole && child.className && 
            (child.className.match(/content|main|principal/i))) {
          violations.push({
            selector: window.wcagUtils.getSelector(child),
            snippet: window.wcagUtils.getSnippet(child),
            help: `Este <${child.tagName.toLowerCase()}> parece conter conteúdo principal ` +
                  `mas não usa um landmark semântico. Considere usar <main>, <article> ou <section> ` +
                  `com role apropriado para melhorar a estrutura da página.`
          });
        }
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
