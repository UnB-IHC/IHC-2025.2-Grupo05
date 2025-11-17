/**
 * Regra: alt-indicates-longdesc
 * WCAG 2.2 — 1.1.1 (Alternativas textuais) / práticas para alt.
 * 
 * Descrição: Verifica se o texto alternativo (alt) de imagens com descrição longa
 * indica claramente onde encontrar a descrição detalhada.
 * 
 * Quando há descrição longa (aria-describedby, longdesc, ou descrição próxima),
 * o alt deve mencionar isso para que usuários de leitores de tela saibam que
 * há mais informações disponíveis.
 * 
 * Violação: <img alt="Gráfico de vendas" aria-describedby="desc1">
 *           (alt não menciona que há descrição detalhada)
 * 
 * Correto: <img alt="Gráfico de vendas. Descrição detalhada abaixo." aria-describedby="desc1">
 *          <img alt="Diagrama de processo (ver descrição completa após a imagem)">
 */

(function() {
  'use strict';

  const RULE_ID = 'alt-indicates-longdesc';

  const ruleMetadata = {
    wcag: {
      id: '1.1.1',
      level: 'A'
    },
    severity: 'error', 
    description: 'Alt curto deve indicar onde está a descrição longa quando houver uma',
    enabled: true
  };

  /**
   * Verifica se a imagem tem descrição longa vinculada
   * @param {HTMLImageElement} img - Elemento de imagem
   * @returns {string|null} Tipo de descrição longa ou null
   */
  function getLongDescriptionType(img) {
    // aria-describedby
    const describedby = img.getAttribute('aria-describedby');
    if (describedby) {
      const descElement = document.getElementById(describedby);
      if (descElement && descElement.textContent.trim().length > 100) {
        return 'aria-describedby';
      }
    }

    // longdesc (deprecado mas ainda válido)
    const longdesc = img.getAttribute('longdesc');
    if (longdesc) {
      return 'longdesc';
    }

    // aria-details
    const details = img.getAttribute('aria-details');
    if (details) {
      const detailsElement = document.getElementById(details);
      if (detailsElement && detailsElement.textContent.trim().length > 100) {
        return 'aria-details';
      }
    }

    return null;
  }

  /**
   * Verifica se há <figcaption> detalhado (se imagem está em <figure>)
   * @param {HTMLImageElement} img - Elemento de imagem
   * @returns {boolean} true se tem figcaption longo
   */
  function hasDetailedFigcaption(img) {
    const parent = img.parentElement;
    if (parent && parent.tagName.toLowerCase() === 'figure') {
      const figcaption = parent.querySelector('figcaption');
      if (figcaption && figcaption.textContent.trim().length > 100) {
        return true;
      }
    }
    return false;
  }

  /**
   * Verifica se o alt indica que há descrição longa disponível
   * @param {string} alt - Texto alternativo
   * @returns {boolean} true se alt menciona descrição
   */
  function altIndicatesLongDesc(alt) {
    if (!alt) return false;
    
    const altLower = alt.toLowerCase();
    
    const indicators = [
      'descrição', 'descricao', 'description',
      'detalhes', 'details', 'detailed',
      'abaixo', 'below', 'após', 'after',
      'seguir', 'following', 'próxim', 'next',
      'ver ', 'see ', 'veja ', 'consulte',
      'texto completo', 'full text', 'complete',
      'explicação', 'explanation', 'dados completos',
      'informações adicionais', 'additional information'
    ];

    return indicators.some(indicator => altLower.includes(indicator));
  }

  /**
   * Verifica se alt indica localização da descrição longa
   * @param {Document} document - Documento DOM
   * @returns {Object} { nodes: Array } com violações encontradas
   */
  async function check(document) {
    const violations = [];
    const images = document.querySelectorAll('img');

    images.forEach(img => {
      const alt = img.getAttribute('alt') || '';
      
      // Ignora imagens decorativas
      const role = img.getAttribute('role');
      if (alt === '' && (role === 'presentation' || role === 'none')) {
        return;
      }

      // Verifica se tem descrição longa vinculada
      const longDescType = getLongDescriptionType(img);
      const hasFigcaption = hasDetailedFigcaption(img);

      // Se tem descrição longa mas alt não indica
      if (longDescType || hasFigcaption) {
        if (!altIndicatesLongDesc(alt)) {
          let descLocation = '';
          
          if (longDescType === 'aria-describedby') {
            const describedby = img.getAttribute('aria-describedby');
            descLocation = `vinculada por aria-describedby="${describedby}"`;
          } else if (longDescType === 'longdesc') {
            descLocation = 'vinculada por atributo longdesc';
          } else if (longDescType === 'aria-details') {
            descLocation = 'vinculada por aria-details';
          } else if (hasFigcaption) {
            descLocation = 'em figcaption adjacente';
          }

          violations.push({
            selector: window.wcagUtils.getSelector(img),
            snippet: window.wcagUtils.getSnippet(img),
            help: `Esta imagem tem descrição longa ${descLocation}, mas o alt não menciona isso. ` +
                  `Alt atual: "${alt}". ` +
                  `Recomendação: Adicione ao final do alt uma indicação como: ` +
                  `"(descrição detalhada abaixo)", "(ver detalhes após a imagem)", ` +
                  `"(descrição completa disponível)", ou similar. ` +
                  `Isso ajuda usuários de leitores de tela a saberem que há mais informações disponíveis.`
          });
        }
      }

      // Caso contrário: tem indicação no alt mas não tem descrição longa
      else if (altIndicatesLongDesc(alt)) {
        violations.push({
          selector: window.wcagUtils.getSelector(img),
          snippet: window.wcagUtils.getSnippet(img),
          help: `O alt menciona descrição adicional ("${alt}"), mas nenhuma descrição longa foi detectada. ` +
                `Considere adicionar: ` +
                `1) aria-describedby apontando para elemento com ID; ` +
                `2) Texto descritivo após a imagem; ` +
                `3) <figcaption> detalhado (se em <figure>); ` +
                `4) Link para página com descrição completa. ` +
                `Ou remova a menção à descrição do alt se ela não existir.`
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
