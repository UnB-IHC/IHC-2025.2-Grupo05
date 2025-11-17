/**
 * Regra: links-vs-buttons
 * WCAG 4.1.2 (Nível A) - Nome, Função, Valor
 * NBR 17225:2025 — Diretriz 4.1 (Compatível)
 * 
 * Descrição: Verifica uso correto de <a> para navegação e <button> para ações.
 * Links (<a>) devem ter href e levar a outro lugar. Botões (<button>) devem
 * executar ações (abrir modal, enviar, etc). Elementos não devem ser usados
 * incorretamente (ex: <a> sem href, <button> com href).
 * 
 * Violação: <a onclick="...">Ação</a> (sem href)
 *           <a href="#">Abrir modal</a> (ação disfarçada de link)
 *           <button href="...">Link</button> (botão usado como link)
 * 
 * Correto: <a href="/pagina">Ir para página</a>
 *          <button type="button">Abrir modal</button>
 */

(function() {
  'use strict';

  const RULE_ID = 'links-vs-buttons';

  const ruleMetadata = {
    wcag: {
      id: '4.1.2',
      level: 'A'
    },
    severity: 'error',
    description: 'Links (<a>) devem navegar e botões (<button>) devem executar ações',
    enabled: true
  };

  /**
   * Verifica uso correto de links vs botões
   * @param {Document} document - Documento DOM
   * @returns {Object} { nodes: Array } com violações encontradas
   */
  async function check(document) {
    const violations = [];

    // 1. Verifica elementos <a> sem href (deveria ser <button>)
    const linksWithoutHref = document.querySelectorAll('a:not([href])');
    
    linksWithoutHref.forEach(link => {
      // Ignora se já tem role="button" (pode ser intencional com ARIA)
      if (link.getAttribute('role') === 'button') {
        return;
      }

      const hasClickHandler = link.onclick || 
                              link.hasAttribute('onclick') || 
                              link.hasAttribute('ng-click') ||
                              link.hasAttribute('@click') ||
                              link.hasAttribute('v-on:click');

      if (hasClickHandler || link.textContent.trim().length > 0) {
        violations.push({
          selector: window.wcagUtils.getSelector(link),
          snippet: window.wcagUtils.getSnippet(link),
          help: 'Este <a> não tem atributo href, indicando que executa uma ação em vez de navegar. ' +
                'Use <button type="button">...</button> para ações. ' +
                'Links (<a>) são para navegação e devem sempre ter href. ' +
                'Se for realmente um botão, adicione role="button" e suporte a teclado (Enter/Space).'
        });
      }
    });

    // 2. Verifica links com href="#" ou href="javascript:" (ações disfarçadas)
    const linksWithFakeHref = document.querySelectorAll(
      'a[href="#"], a[href="javascript:void(0)"], a[href="javascript:"], a[href="#!"]'
    );
    
    linksWithFakeHref.forEach(link => {
      // Ignora se é âncora real (tem name ou id correspondente)
      const href = link.getAttribute('href');
      if (href === '#' && link.hasAttribute('name')) {
        return;
      }

      const text = link.textContent.trim().toLowerCase();
      
      // Palavras que indicam ação em vez de navegação
      const actionWords = [
        'abrir', 'fechar', 'mostrar', 'ocultar', 'exibir', 'esconder',
        'enviar', 'salvar', 'deletar', 'remover', 'adicionar', 'editar',
        'cancelar', 'confirmar', 'aceitar', 'recusar', 'voltar',
        'open', 'close', 'show', 'hide', 'submit', 'save', 'delete',
        'remove', 'add', 'edit', 'cancel', 'ok', 'yes', 'no'
      ];

      const seemsLikeAction = actionWords.some(word => text.includes(word));

      if (seemsLikeAction || link.onclick || link.hasAttribute('onclick')) {
        violations.push({
          selector: window.wcagUtils.getSelector(link),
          snippet: window.wcagUtils.getSnippet(link),
          help: `Este link usa href="${href}" mas parece executar uma ação ("${text}"). ` +
                'Links com href="#" ou "javascript:" não navegam de verdade. ' +
                'Use <button type="button">...</button> para ações. ' +
                'Reserve <a> para navegação real entre páginas/seções.'
        });
      }
    });

    // 3. Verifica botões com href (tentando navegar)
    const buttonsWithHref = document.querySelectorAll('button[href]');
    
    buttonsWithHref.forEach(button => {
      violations.push({
        selector: window.wcagUtils.getSelector(button),
        snippet: window.wcagUtils.getSnippet(button),
        help: 'O elemento <button> não suporta atributo href. ' +
              'Se precisa navegar para outra página, use <a href="...">Link</a>. ' +
              'Se precisa executar JavaScript para depois navegar, use onclick ou addEventListener.'
      });
    });

    // 4. Verifica links que parecem botões visualmente (classe "btn", "button")
    const linksLookingLikeButtons = document.querySelectorAll(
      'a[href][class*="btn"], a[href][class*="button"]'
    );
    
    linksLookingLikeButtons.forEach(link => {
      const href = link.getAttribute('href');
      
      // Se href é falso (#, javascript:, etc), provavelmente é um botão disfarçado
      if (href === '#' || href.startsWith('javascript:')) {
        violations.push({
          selector: window.wcagUtils.getSelector(link),
          snippet: window.wcagUtils.getSnippet(link),
          help: 'Este link tem estilo de botão (classe "btn"/"button") mas href falso. ' +
                'Isso confunde usuários e tecnologias assistivas. ' +
                'Use <button> para ações e <a> apenas para navegação real.'
        });
      }
    });

    // 5. Verifica links que abrem modal/dialog (comum em frameworks)
    const linksOpeningModals = document.querySelectorAll(
      'a[data-toggle="modal"], a[data-bs-toggle="modal"], a[data-target*="modal"], ' +
      'a[href*="modal"], a[aria-haspopup="dialog"]'
    );
    
    linksOpeningModals.forEach(link => {
      const href = link.getAttribute('href');
      if (href === '#' || !href || href.startsWith('javascript:')) {
        violations.push({
          selector: window.wcagUtils.getSelector(link),
          snippet: window.wcagUtils.getSnippet(link),
          help: 'Este link abre um modal/diálogo, o que é uma ação, não navegação. ' +
                'Use <button data-toggle="modal"> em vez de <a>. ' +
                'Adicione aria-haspopup="dialog" e aria-expanded para melhor acessibilidade.'
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
