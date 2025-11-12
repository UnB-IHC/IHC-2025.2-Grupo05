/**
 * Regra: images-of-text
 * WCAG 2.2 — 1.4.5 (Imagens de texto).
 * 
 * Descrição: Verifica se há imagens de texto quando texto real poderia ser usado.
 * Texto real é preferível pois pode ser redimensionado, tem melhor contraste ajustável,
 * e é mais acessível para leitores de tela e tradução.
 * 
 * NOTA: Esta regra usa heurísticas para detectar possíveis imagens de texto baseadas
 * em nomes de arquivo, atributos alt, e contexto. Não é 100% precisa.
 * 
 * Exceções válidas: Logotipos, texto que faz parte essencial de foto/captura de tela.
 * 
 * Violação: <img src="titulo-secao.png" alt="Bem-vindo ao nosso site">
 * Correto: <h1>Bem-vindo ao nosso site</h1>
 */

(function() {
  'use strict';

  const RULE_ID = 'images-of-text';

  const ruleMetadata = {
    wcag: {
      id: '1.4.5',
      level: 'AA'
    },
    severity: 'warn', // warn porque nem sempre é possível detectar com precisão
    description: 'Evite imagens de texto; prefira texto real (HTML/CSS) quando possível',
    enabled: true
  };

  /**
   * Verifica se o nome do arquivo sugere que é uma imagem de texto
   * @param {string} src - Atributo src da imagem
   * @returns {boolean} true se provavelmente é imagem de texto
   */
  function hasTextImageFilename(src) {
    if (!src) return false;
    
    const filename = src.toLowerCase();
    const textIndicators = [
      'text', 'texto', 'title', 'titulo', 'heading', 'cabecalho',
      'button', 'botao', 'label', 'rotulo', 'caption', 'legenda',
      'quote', 'citacao', 'message', 'mensagem', 'slogan',
      'banner-text', 'text-banner', 'heading-', 'title-'
    ];

    return textIndicators.some(indicator => filename.includes(indicator));
  }

  /**
   * Verifica se o alt sugere texto que poderia ser HTML
   * @param {string} alt - Texto alternativo
   * @returns {boolean} true se parece ser texto simples/formatável
   */
  function altSuggestsFormattableText(alt) {
    if (!alt || alt.length < 5) return false;
    
    // Se o alt é muito longo e parece prosa, provavelmente é texto que deveria ser HTML
    if (alt.length > 100) return true;

    // Padrões que sugerem texto formatável
    const textPatterns = [
      /^(bem.vindo|welcome|título|title|heading)/i,
      /^(clique|click|leia|read)/i,
      /^(saiba mais|learn more|descubra|discover)/i,
      /(novo|new|promoção|sale|oferta|offer)$/i
    ];

    return textPatterns.some(pattern => pattern.test(alt));
  }

  /**
   * Verifica se é provavelmente um logotipo (exceção válida)
   * @param {HTMLImageElement} img - Elemento de imagem
   * @param {string} alt - Texto alternativo
   * @returns {boolean} true se provavelmente é logo
   */
  function isProbablyLogo(img, alt) {
    const src = img.getAttribute('src') || '';
    const className = img.className || '';
    const id = img.id || '';
    
    const logoIndicators = [
      'logo', 'brand', 'marca', 'logotipo'
    ];

    const combined = (src + className + id + alt).toLowerCase();
    return logoIndicators.some(indicator => combined.includes(indicator));
  }

  /**
   * Verifica se é provavelmente screenshot/foto (exceção válida)
   * @param {string} src - Atributo src
   * @param {string} alt - Texto alternativo
   * @returns {boolean} true se provavelmente é screenshot/foto
   */
  function isProbablyScreenshotOrPhoto(src, alt) {
    const combined = (src + alt).toLowerCase();
    
    const photoIndicators = [
      'screenshot', 'captura', 'photo', 'foto', 'image',
      'picture', 'figura', 'diagram', 'diagrama', 'chart',
      'grafico', 'graph', 'ilustra', 'illustr'
    ];

    return photoIndicators.some(indicator => combined.includes(indicator));
  }

  /**
   * Verifica se há imagens de texto na página
   * @param {Document} document - Documento DOM
   * @returns {Object} { nodes: Array } com violações encontradas
   */
  async function check(document) {
    const violations = [];
    const images = document.querySelectorAll('img');

    images.forEach(img => {
      const alt = img.getAttribute('alt') || '';
      const src = img.getAttribute('src') || '';
      
      // Ignora imagens decorativas (sem alt ou alt vazio com role)
      const role = img.getAttribute('role');
      if (alt === '' && (role === 'presentation' || role === 'none')) {
        return;
      }

      // Ignora imagens muito pequenas (provavelmente ícones/decoração)
      if (img.width <= 50 && img.height <= 50) {
        return;
      }

      // Verifica se é exceção válida (logo, screenshot, foto)
      if (isProbablyLogo(img, alt)) {
        return; // Logos são exceção válida
      }

      if (isProbablyScreenshotOrPhoto(src, alt)) {
        return; // Screenshots e fotos são exceção válida
      }

      // Detecta imagens de texto por nome de arquivo
      if (hasTextImageFilename(src)) {
        violations.push({
          selector: window.wcagUtils.getSelector(img),
          snippet: window.wcagUtils.getSnippet(img),
          help: `O nome do arquivo "${src.split('/').pop()}" sugere que esta é uma imagem de texto. ` +
                `Considere usar texto HTML/CSS real em vez de imagem. Texto real é mais acessível, ` +
                `pode ser redimensionado, traduzido e tem melhor contraste. Se for essencial usar imagem ` +
                `(ex: logo, assinatura), garanta que o alt descreva adequadamente.`
        });
        return;
      }

      // Detecta por conteúdo do alt (texto que poderia ser HTML)
      if (altSuggestsFormattableText(alt)) {
        violations.push({
          selector: window.wcagUtils.getSelector(img),
          snippet: window.wcagUtils.getSnippet(img),
          help: `O texto alternativo "${alt.substring(0, 80)}${alt.length > 80 ? '...' : ''}" sugere que esta ` +
                `imagem contém texto formatável. Considere usar elementos HTML (h1, p, button, etc) ` +
                `estilizados com CSS em vez de imagem. Exceções: logotipos, capturas de tela, texto ` +
                `em fotos reais. Se for uma exceção válida, ignore este aviso.`
        });
        return;
      }

      // Detecta SVGs com muito texto (podem ser gráficos de texto)
      if (src.toLowerCase().includes('.svg')) {
        const altWords = alt.split(/\s+/).length;
        if (altWords > 5 && altWords < 20) {
          violations.push({
            selector: window.wcagUtils.getSelector(img),
            snippet: window.wcagUtils.getSnippet(img),
            help: `Este SVG pode conter texto que poderia ser HTML/CSS. SVGs com texto descritivo ` +
                  `muitas vezes podem ser substituídos por texto estilizado. Revise se o texto no SVG ` +
                  `poderia ser implementado com CSS (gradientes, sombras, etc).`
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
