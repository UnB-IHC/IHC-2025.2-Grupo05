/**
 * Regra: img-alt
 * WCAG 1.1.1 (Nível A)
 * 
 * Descrição: Verifica se todas as imagens possuem texto alternativo adequado.
 * O atributo alt é essencial para usuários de leitores de tela compreenderem o conteúdo visual.
 * 
 * Violação: <img src="logo.png"> ou <img src="logo.png" alt="">
 * Correto: <img src="logo.png" alt="Logo da Universidade de Brasília">
 * Correto (decorativa): <img src="decoracao.png" alt="" role="presentation">
 */

(function() {
  'use strict';

  const RULE_ID = 'img-alt';

  const ruleMetadata = {
    wcag: {
      id: '1.1.1',
      level: 'A'
    },
    severity: 'error',
    description: 'Imagens devem possuir texto alternativo (atributo alt) adequado',
    enabled: true
  };

  /**
   * Verifica se a imagem é provavelmente decorativa baseado em contexto
   * @param {HTMLImageElement} img - Elemento de imagem
   * @returns {boolean} true se provavelmente decorativa
   */
  function isProbablyDecorative(img) {
    // Imagens com role="presentation" ou role="none" são intencionalmente decorativas
    const role = img.getAttribute('role');
    if (role === 'presentation' || role === 'none') {
      return true;
    }

    // Imagens CSS de background (não são <img>, mas se chegou aqui, não é o caso)
    // Imagens muito pequenas podem ser decorativas (ícones, espaçadores)
    if (img.width <= 10 && img.height <= 10) {
      return true;
    }

    return false;
  }

  /**
   * Verifica se todas as <img> possuem alt adequado
   * @param {Document} document - Documento DOM
   * @returns {Object} { nodes: Array } com violações encontradas
   */
  async function check(document) {
    const violations = [];
    const images = document.querySelectorAll('img');

    images.forEach(img => {
      const alt = img.getAttribute('alt');
      const src = img.getAttribute('src') || '(sem src)';

      // Caso 1: Imagem sem atributo alt
      if (alt === null) {
        violations.push({
          selector: window.wcagUtils.getSelector(img),
          snippet: window.wcagUtils.getSnippet(img),
          help: `Adicione o atributo alt a esta imagem. Se a imagem é informativa, descreva seu conteúdo. Se é decorativa, use alt="" e considere adicionar role="presentation".`
        });
        return;
      }

      // Caso 2: Imagem com alt vazio, mas não marcada como decorativa
      if (alt.trim() === '' && !isProbablyDecorative(img)) {
        // Alt vazio pode ser válido para imagens decorativas, mas deve ser intencional
        // Emitimos warning se não houver indicação clara (role)
        violations.push({
          selector: window.wcagUtils.getSelector(img),
          snippet: window.wcagUtils.getSnippet(img),
          help: `Esta imagem tem alt="" (vazio). Se for decorativa, adicione role="presentation". Se for informativa, adicione uma descrição adequada no alt.`
        });
        return;
      }

      // Caso 3: Alt muito longo (geralmente não é bom para UX de leitores de tela)
      if (alt.length > 150) {
        violations.push({
          selector: window.wcagUtils.getSelector(img),
          snippet: window.wcagUtils.getSnippet(img),
          help: `O texto alternativo tem ${alt.length} caracteres. Considere resumir (máx. ~150 chars). Para descrições longas, use longdesc ou um link para descrição detalhada.`
        });
        return;
      }

      // Caso 4: Alt genérico ou não descritivo
      const genericAlts = [
        'imagem', 'image', 'foto', 'photo', 'picture', 'img',
        'ícone', 'icon', 'logo', 'banner', 'graphic'
      ];
      const altLower = alt.toLowerCase().trim();
      
      if (genericAlts.includes(altLower) || altLower === src.split('/').pop()) {
        violations.push({
          selector: window.wcagUtils.getSelector(img),
          snippet: window.wcagUtils.getSnippet(img),
          help: `O texto alternativo "${alt}" é muito genérico. Descreva o conteúdo ou função da imagem de forma específica.`
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
