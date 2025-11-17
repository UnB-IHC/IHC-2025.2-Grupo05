/**
 * Regra: focus-trap
 * WCAG 2.1.2 (Nível A) - Sem Armadilha de Teclado
 * NBR 17225:2025 — Diretriz 2.1 (Acessível por Teclado)
 * 
 * Descrição: Verifica se é possível sair de componentes interativos usando
 * apenas teclado. Armadilhas de teclado (keyboard traps) ocorrem quando o foco
 * fica preso em um elemento/região sem forma de escapar via Tab/Shift+Tab/Esc.
 * Modais, menus e widgets devem permitir saída via teclado.
 * 
 * Violação: Modal sem Esc para fechar
 *           Menu que não libera foco ao Tab
 *           Plugin/iframe que prende o foco
 * 
 * Correto: Modal fecha com Esc, foco volta ao trigger
 *          Tab/Shift+Tab circula dentro do modal mas Esc libera
 */

(function() {
  'use strict';

  const RULE_ID = 'focus-trap';

  const ruleMetadata = {
    wcag: {
      id: '2.1.2',
      level: 'A'
    },
    severity: 'error',
    description: 'Não deve haver armadilha de teclado - usuário deve poder sair de modais/menus com Tab/Esc',
    enabled: true
  };

  /**
   * Verifica se elemento é um modal/dialog
   * @param {Element} element - Elemento a verificar
   * @returns {boolean} true se parece modal
   */
  function isModal(element) {
    const role = element.getAttribute('role');
    const ariaModal = element.getAttribute('aria-modal');
    const className = element.className || '';
    const id = element.id || '';
    
    return (
      role === 'dialog' ||
      role === 'alertdialog' ||
      ariaModal === 'true' ||
      className.toLowerCase().includes('modal') ||
      className.toLowerCase().includes('dialog') ||
      className.toLowerCase().includes('popup') ||
      id.toLowerCase().includes('modal') ||
      id.toLowerCase().includes('dialog')
    );
  }

  /**
   * Verifica se elemento é um menu/dropdown
   * @param {Element} element - Elemento a verificar
   * @returns {boolean} true se parece menu
   */
  function isMenu(element) {
    const role = element.getAttribute('role');
    const className = element.className || '';
    const id = element.id || '';
    
    return (
      role === 'menu' ||
      role === 'menubar' ||
      role === 'listbox' ||
      role === 'combobox' ||
      className.toLowerCase().includes('menu') ||
      className.toLowerCase().includes('dropdown') ||
      id.toLowerCase().includes('menu') ||
      id.toLowerCase().includes('dropdown')
    );
  }

  /**
   * Verifica se elemento/documento tem handler de Escape
   * @param {Element} element - Elemento a verificar
   * @returns {boolean} true se tem handler de Escape
   */
  function hasEscapeHandler(element) {
    // Verifica handlers inline
    if (element.onkeydown || element.onkeyup || element.onkeypress) {
      return true;
    }

    // Verifica atributos
    const keydownAttr = element.getAttribute('onkeydown') || '';
    const keyupAttr = element.getAttribute('onkeyup') || '';
    const keypressAttr = element.getAttribute('onkeypress') || '';
    
    return (
      keydownAttr.includes('Escape') ||
      keydownAttr.includes('Esc') ||
      keydownAttr.includes('27') ||
      keyupAttr.includes('Escape') ||
      keyupAttr.includes('Esc') ||
      keyupAttr.includes('27') ||
      keypressAttr.includes('Escape') ||
      keypressAttr.includes('Esc') ||
      keypressAttr.includes('27')
    );
  }

  /**
   * Verifica se elemento tem botão de fechar
   * @param {Element} element - Elemento a verificar
   * @returns {boolean} true se tem botão de fechar
   */
  function hasCloseButton(element) {
    // Procura botões de fechar comuns
    const closeButtons = element.querySelectorAll(
      'button[aria-label*="lose"], button[aria-label*="echar"], ' +
      'button[class*="close"], button[class*="dismiss"], ' +
      '[role="button"][aria-label*="lose"], ' +
      'button[data-dismiss], button[data-bs-dismiss]'
    );

    return closeButtons.length > 0;
  }

  /**
   * Verifica elementos com tabindex negativo que podem criar armadilhas
   * @param {Element} element - Elemento a verificar
   * @returns {boolean} true se pode criar armadilha
   */
  function hasNegativeTabindexTrap(element) {
    // Elementos focáveis dentro com tabindex="-1" podem indicar trap
    const focusableWithNegativeTabindex = element.querySelectorAll('[tabindex="-1"]');
    return focusableWithNegativeTabindex.length > 5; // threshold
  }

  /**
   * Verifica armadilhas de foco (focus traps)
   * @param {Document} document - Documento DOM
   * @returns {Object} { nodes: Array } com violações encontradas
   */
  async function check(document) {
    const violations = [];

    // 1. Verifica modais/dialogs
    const possibleModals = document.querySelectorAll(
      '[role="dialog"], [role="alertdialog"], [aria-modal="true"], ' +
      '[class*="modal"], [id*="modal"], [class*="dialog"], [id*="dialog"]'
    );
    
    possibleModals.forEach(modal => {
      if (!isModal(modal)) return;

      const hasEsc = hasEscapeHandler(modal) || hasEscapeHandler(document);
      const hasClose = hasCloseButton(modal);
      
      // Se não tem Escape handler nem botão de fechar acessível
      if (!hasEsc && !hasClose) {
        violations.push({
          selector: window.wcagUtils.getSelector(modal),
          snippet: window.wcagUtils.getSnippet(modal),
          help: 'Este modal/dialog não tem forma de fechar via teclado. ' +
                'Adicione: 1) Handler de Escape (document.addEventListener("keydown", e => if(e.key==="Escape")fechar())) ' +
                'E 2) Botão de fechar focável (<button aria-label="Fechar">×</button>). ' +
                'O modal deve fechar com Esc e devolver o foco ao elemento que o abriu. ' +
                'Isso evita armadilha de teclado (keyboard trap).'
        });
      } else if (!hasEsc) {
        violations.push({
          selector: window.wcagUtils.getSelector(modal),
          snippet: window.wcagUtils.getSnippet(modal),
          help: 'Este modal tem botão de fechar mas não responde à tecla Escape. ' +
                'Adicione handler de Escape: document.addEventListener("keydown", e => if(e.key==="Escape")fechar()). ' +
                'Usuários de teclado esperam poder fechar modais com Esc.'
        });
      }

      // Verifica se modal prende o foco (focus trap management)
      const focusableElements = modal.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled]), ' +
        'select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );

      if (focusableElements.length === 0) {
        violations.push({
          selector: window.wcagUtils.getSelector(modal),
          snippet: window.wcagUtils.getSnippet(modal),
          help: 'Este modal não tem elementos focáveis dentro dele. ' +
                'Adicione pelo menos um botão de fechar focável. ' +
                'Sem elementos focáveis, usuários de teclado ficam presos.'
        });
      }
    });

    // 2. Verifica menus/dropdowns
    const possibleMenus = document.querySelectorAll(
      '[role="menu"], [role="menubar"], [role="listbox"], [role="combobox"], ' +
      '[class*="menu"]:not([class*="menu-item"]), [class*="dropdown"]'
    );
    
    possibleMenus.forEach(menu => {
      if (!isMenu(menu)) return;

      const hasEsc = hasEscapeHandler(menu) || hasEscapeHandler(document);
      const isExpanded = menu.getAttribute('aria-expanded') === 'true';
      const hasHidden = menu.hasAttribute('hidden') || 
                        menu.style.display === 'none' ||
                        menu.style.visibility === 'hidden';

      // Só verifica se está visível/expandido
      if (!hasHidden && isExpanded !== false) {
        if (!hasEsc) {
          violations.push({
            selector: window.wcagUtils.getSelector(menu),
            snippet: window.wcagUtils.getSnippet(menu),
            help: 'Este menu/dropdown não responde à tecla Escape para fechar. ' +
                  'Adicione handler: addEventListener("keydown", e => if(e.key==="Escape")fechar()). ' +
                  'Menus devem fechar com Esc e devolver foco ao botão que os abriu. ' +
                  'Use aria-expanded="true/false" para indicar estado.'
          });
        }
      }
    });

    // 3. Verifica iframes que podem criar armadilhas
    const iframes = document.querySelectorAll('iframe');
    
    iframes.forEach(iframe => {
      const src = iframe.getAttribute('src') || '';
      const title = iframe.getAttribute('title') || '';
      
      // Verifica se é iframe de conteúdo externo (potencial armadilha)
      if (src && !src.startsWith(window.location.origin)) {
        violations.push({
          selector: window.wcagUtils.getSelector(iframe),
          snippet: window.wcagUtils.getSnippet(iframe),
          help: 'Este iframe de conteúdo externo pode criar armadilha de teclado. ' +
                `${!title ? 'Adicione title descritivo ao iframe. ' : ''}` +
                'Certifique-se de que o conteúdo do iframe também é acessível por teclado. ' +
                'Considere fornecer link alternativo para o conteúdo fora do iframe. ' +
                'Teste navegando com Tab para verificar se consegue sair do iframe.'
        });
      }
    });

    // 4. Verifica elementos com tabindex que podem atrapalhar navegação
    const highTabindex = document.querySelectorAll('[tabindex]');
    
    highTabindex.forEach(element => {
      const tabindex = parseInt(element.getAttribute('tabindex'));
      
      // tabindex > 0 pode criar ordem confusa e "armadilhas"
      if (tabindex > 0) {
        violations.push({
          selector: window.wcagUtils.getSelector(element),
          snippet: window.wcagUtils.getSnippet(element),
          help: `Este elemento usa tabindex="${tabindex}" (valor positivo) que pode criar ` +
                'ordem de navegação confusa e comportamento similar a armadilha. ' +
                'Use apenas tabindex="0" (ordem natural) ou tabindex="-1" (programático). ' +
                'Valores positivos interferem na ordem lógica de navegação.'
        });
      }
    });

    // 5. Detecta overlays/backdrop sem forma de fechar
    const overlays = document.querySelectorAll(
      '[class*="overlay"], [class*="backdrop"], [class*="mask"]'
    );
    
    overlays.forEach(overlay => {
      const style = window.getComputedStyle(overlay);
      const isVisible = style.display !== 'none' && 
                        style.visibility !== 'hidden' &&
                        style.opacity !== '0';
      
      if (isVisible) {
        const hasClick = overlay.onclick || overlay.hasAttribute('onclick');
        
        if (hasClick && !overlay.hasAttribute('tabindex')) {
          violations.push({
            selector: window.wcagUtils.getSelector(overlay),
            snippet: window.wcagUtils.getSnippet(overlay),
            help: 'Este overlay/backdrop fecha ao clicar mas não é acessível por teclado. ' +
                  'Isso pode criar armadilha: usuário não consegue fechar o modal. ' +
                  'Adicione handler de Escape no modal/documento para fechar. ' +
                  'Não dependa apenas de click no overlay para fechar.'
          });
        }
      }
    });

    // 6. Verifica elementos que previnem Tab (event.preventDefault no Tab)
    // Nota: Difícil detectar via análise estática, mas podemos avisar sobre padrões suspeitos
    const elementsWithKeyHandler = document.querySelectorAll('[onkeydown], [onkeyup]');
    
    elementsWithKeyHandler.forEach(element => {
      const keydownAttr = element.getAttribute('onkeydown') || '';
      const keyupAttr = element.getAttribute('onkeyup') || '';
      
      // Detecta preventDefault em Tab (suspeito)
      const preventsTab = (
        keydownAttr.includes('preventDefault') || 
        keyupAttr.includes('preventDefault')
      ) && (
        keydownAttr.includes('Tab') || 
        keydownAttr.includes('9') ||
        keyupAttr.includes('Tab') ||
        keyupAttr.includes('9')
      );

      if (preventsTab && !isModal(element)) {
        violations.push({
          selector: window.wcagUtils.getSelector(element),
          snippet: window.wcagUtils.getSnippet(element),
          help: 'Este elemento parece prevenir o comportamento padrão da tecla Tab. ' +
                'Isso só é aceitável em modais (para prender foco temporariamente). ' +
                'Prevenir Tab em outros contextos cria armadilha de teclado. ' +
                'Remova preventDefault() do Tab, exceto se for gerenciamento de foco em modal.'
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
