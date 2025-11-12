/**
 * Regra: multiple-ways
 * NBR 17225:2025 — Diretrizes 2.4 (Navegável) e 1.3 (Adaptável); WCAG 2.2 — 2.4., 2.4.4.
 * 
 * Descrição: Verifica se há mais de uma forma de localizar páginas dentro do site
 * (menu de navegação, busca, mapa do site, índice, breadcrumbs, etc).
 * 
 * NOTA: Esta regra tem limitações - ela detecta a PRESENÇA de mecanismos comuns,
 * mas não pode validar se funcionam corretamente ou se cobrem todo o site.
 * 
 * Violação: Site sem menu, busca, sitemap ou outros mecanismos de navegação
 * Correto: Site com pelo menos 2 mecanismos (ex: menu + busca, ou menu + sitemap)
 */

(function() {
  'use strict';

  const RULE_ID = 'multiple-ways';

  const ruleMetadata = {
    wcag: {
      id: '2.4.5',
      level: 'AA'
    },
    severity: 'warn', // warn porque é difícil validar automaticamente com 100% de precisão
    description: 'Deve haver mais de uma forma de localizar páginas (menu, busca, mapa do site, etc)',
    enabled: true
  };

  /**
   * Detecta presença de menu de navegação principal
   * @param {Document} document - Documento DOM
   * @returns {boolean} true se encontrar menu
   */
  function hasNavigationMenu(document) {
    // Procura por elementos semânticos de navegação
    const navElements = document.querySelectorAll('nav, [role="navigation"]');
    
    if (navElements.length > 0) {
      // Verifica se tem links dentro
      for (const nav of navElements) {
        const links = nav.querySelectorAll('a[href]');
        if (links.length >= 3) { // Menu com pelo menos 3 links
          return true;
        }
      }
    }

    // Procura por classes/IDs comuns de menu
    const menuSelectors = [
      '[class*="menu"]', '[id*="menu"]',
      '[class*="nav"]', '[id*="nav"]',
      '[class*="header"]', '[id*="header"]'
    ];

    for (const selector of menuSelectors) {
      const elements = document.querySelectorAll(selector);
      for (const el of elements) {
        const links = el.querySelectorAll('a[href]');
        if (links.length >= 3) {
          return true;
        }
      }
    }

    return false;
  }

  /**
   * Detecta presença de campo de busca
   * @param {Document} document - Documento DOM
   * @returns {boolean} true se encontrar busca
   */
  function hasSearchFunction(document) {
    // Procura por elementos semânticos de busca
    const searchElements = document.querySelectorAll('[role="search"]');
    if (searchElements.length > 0) {
      return true;
    }

    // Procura por inputs do tipo search
    const searchInputs = document.querySelectorAll('input[type="search"]');
    if (searchInputs.length > 0) {
      return true;
    }

    // Procura por inputs com atributos/classes relacionados a busca
    const searchRelatedInputs = document.querySelectorAll(
      'input[name*="search"], input[name*="busca"], input[name*="query"], ' +
      'input[placeholder*="earch"], input[placeholder*="busca"], input[placeholder*="pesquis"], ' +
      'input[class*="search"], input[class*="busca"], input[id*="search"], input[id*="busca"]'
    );
    
    if (searchRelatedInputs.length > 0) {
      return true;
    }

    // Procura por formulários de busca
    const searchForms = document.querySelectorAll(
      'form[action*="search"], form[action*="busca"], ' +
      'form[class*="search"], form[class*="busca"]'
    );
    
    return searchForms.length > 0;
  }

  /**
   * Detecta presença de breadcrumbs (trilha de navegação)
   * @param {Document} document - Documento DOM
   * @returns {boolean} true se encontrar breadcrumbs
   */
  function hasBreadcrumbs(document) {
    // Procura por elementos com aria-label breadcrumb
    const breadcrumbsByAria = document.querySelectorAll('[aria-label*="breadcrumb"], [aria-label*="Breadcrumb"]');
    if (breadcrumbsByAria.length > 0) {
      return true;
    }

    // Procura por classes/IDs comuns de breadcrumb
    const breadcrumbSelectors = [
      '[class*="breadcrumb"]', '[id*="breadcrumb"]',
      '[class*="trilha"]', '[id*="trilha"]'
    ];

    for (const selector of breadcrumbSelectors) {
      const elements = document.querySelectorAll(selector);
      if (elements.length > 0) {
        // Verifica se tem pelo menos 2 links (indicando hierarquia)
        for (const el of elements) {
          const links = el.querySelectorAll('a[href]');
          if (links.length >= 2) {
            return true;
          }
        }
      }
    }

    return false;
  }

  /**
   * Detecta presença de mapa do site ou índice
   * @param {Document} document - Documento DOM
   * @returns {boolean} true se encontrar sitemap/índice
   */
  function hasSitemapOrIndex(document) {
    // Procura por links para sitemap
    const sitemapLinks = document.querySelectorAll(
      'a[href*="sitemap"], a[href*="site-map"], ' +
      'a[href*="mapa"], a[href*="indice"], a[href*="index"]'
    );

    if (sitemapLinks.length > 0) {
      return true;
    }

    // Procura por elementos com classes/IDs de sitemap
    const sitemapElements = document.querySelectorAll(
      '[class*="sitemap"], [id*="sitemap"], ' +
      '[class*="site-map"], [id*="site-map"]'
    );

    return sitemapElements.length > 0;
  }

  /**
   * Detecta presença de índice alfabético ou TOC
   * @param {Document} document - Documento DOM
   * @returns {boolean} true se encontrar índice
   */
  function hasTableOfContents(document) {
    // Procura por elementos com role complementary ou aside
    const tocElements = document.querySelectorAll(
      '[role="complementary"], aside, ' +
      '[class*="toc"], [id*="toc"], ' +
      '[class*="table-of-contents"], [id*="table-of-contents"], ' +
      '[class*="indice"], [id*="indice"]'
    );

    for (const toc of tocElements) {
      const links = toc.querySelectorAll('a[href]');
      if (links.length >= 3) {
        return true;
      }
    }

    return false;
  }

  /**
   * Verifica se há múltiplas formas de navegação
   * @param {Document} document - Documento DOM
   * @returns {Object} { nodes: Array } com violações encontradas
   */
  async function check(document) {
    const violations = [];
    
    // Detecta mecanismos de navegação presentes
    const mechanisms = {
      menu: hasNavigationMenu(document),
      search: hasSearchFunction(document),
      breadcrumbs: hasBreadcrumbs(document),
      sitemap: hasSitemapOrIndex(document),
      toc: hasTableOfContents(document)
    };

    // Conta quantos mecanismos foram encontrados
    const foundMechanisms = Object.entries(mechanisms)
      .filter(([key, value]) => value)
      .map(([key]) => key);

    const mechanismCount = foundMechanisms.length;

    // Se menos de 2 mecanismos, é uma violação
    if (mechanismCount < 2) {
      const mechanismNames = {
        menu: 'Menu de navegação',
        search: 'Campo de busca',
        breadcrumbs: 'Breadcrumbs (trilha de navegação)',
        sitemap: 'Mapa do site ou índice',
        toc: 'Índice ou sumário'
      };

      let foundList = '';
      if (mechanismCount === 1) {
        foundList = `Apenas "${mechanismNames[foundMechanisms[0]]}" foi detectado. `;
      } else {
        foundList = 'Nenhum mecanismo de navegação foi detectado automaticamente. ';
      }

      violations.push({
        selector: 'body',
        snippet: '<body> ... (estrutura geral da página)</body>',
        help: `${foundList}Para atender WCAG 2.4.5 (Nível AA), deve haver pelo menos 2 formas diferentes de localizar páginas. ` +
              `Considere adicionar: menu de navegação principal, campo de busca, mapa do site, breadcrumbs ou índice. ` +
              `NOTA: Esta verificação automática pode ter falsos positivos/negativos - revise manualmente.`
      });
    }

    // Mesmo se passar, adiciona informação sobre o que foi detectado (opcional, comentado)
    // Descomente se quiser sempre mostrar o que foi detectado
    /*
    else {
      console.log('[WCAG Auditor] Mecanismos de navegação detectados:', foundMechanisms.join(', '));
    }
    */

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
