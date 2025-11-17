/**
 * Regra: keyboard-operable
 * WCAG 2.1.1 (Nível A) - Teclado
 * NBR 17225:2025 — Diretriz 2.1 (Acessível por Teclado)
 * 
 * Descrição: Verifica se elementos interativos são operáveis por teclado.
 * Todo controle interativo deve ser acessível via Tab, Enter, Space ou setas,
 * sem depender exclusivamente de mouse/touch. Isso inclui links, botões,
 * controles customizados, e elementos com handlers de eventos.
 * 
 * Violação: <div onclick="acao()">Clique</div> (sem tabindex/role)
 *           <span onmouseover="mostrar()">Hover</span> (só mouse)
 *           Elemento focável mas não responde a Enter/Space
 * 
 * Correto: <button type="button">Clique</button>
 *          <div role="button" tabindex="0" onkeydown="handleKey">...</div>
 */

(function() {
  'use strict';

  const RULE_ID = 'keyboard-operable';

  const ruleMetadata = {
    wcag: {
      id: '2.1.1',
      level: 'A'
    },
    severity: 'error',
    description: 'Toda funcionalidade deve ser operável por teclado (Tab/Enter/Space/Setas)',
    enabled: true
  };

  /**
   * Verifica se elemento tem handler de teclado
   * @param {Element} element - Elemento a verificar
   * @returns {boolean} true se tem handler de teclado
   */
  function hasKeyboardHandler(element) {
    return !!(
      element.onkeydown ||
      element.onkeypress ||
      element.onkeyup ||
      element.hasAttribute('onkeydown') ||
      element.hasAttribute('onkeypress') ||
      element.hasAttribute('onkeyup')
    );
  }

  /**
   * Verifica se elemento tem handler de mouse exclusivo
   * @param {Element} element - Elemento a verificar
   * @returns {Object} { hasMouseHandler: boolean, eventType: string }
   */
  function getMouseOnlyHandlers(element) {
    const handlers = [];
    
    if (element.onclick || element.hasAttribute('onclick')) {
      handlers.push('click');
    }
    if (element.onmouseover || element.hasAttribute('onmouseover')) {
      handlers.push('mouseover');
    }
    if (element.onmouseenter || element.hasAttribute('onmouseenter')) {
      handlers.push('mouseenter');
    }
    if (element.onmousedown || element.hasAttribute('onmousedown')) {
      handlers.push('mousedown');
    }
    if (element.ondblclick || element.hasAttribute('ondblclick')) {
      handlers.push('dblclick');
    }

    // Detecta frameworks JS (Vue, Angular, React)
    if (element.hasAttribute('@click') || element.hasAttribute('v-on:click')) {
      handlers.push('click');
    }
    if (element.hasAttribute('ng-click') || element.hasAttribute('(click)')) {
      handlers.push('click');
    }

    return handlers;
  }

  /**
   * Verifica se elemento é naturalmente focável
   * @param {Element} element - Elemento a verificar
   * @returns {boolean} true se é naturalmente focável
   */
  function isNaturallyFocusable(element) {
    const tag = element.tagName.toLowerCase();
    const naturallyFocusable = ['a', 'button', 'input', 'select', 'textarea', 'audio', 'video'];
    
    if (naturallyFocusable.includes(tag)) {
      // <a> só é focável se tem href
      if (tag === 'a') {
        return element.hasAttribute('href');
      }
      // Verifica se não está disabled
      if (element.hasAttribute('disabled')) {
        return false;
      }
      return true;
    }
    
    return false;
  }

  /**
   * Verifica operabilidade por teclado
   * @param {Document} document - Documento DOM
   * @returns {Object} { nodes: Array } com violações encontradas
   */
  async function check(document) {
    const violations = [];

    // 1. Detecta elementos com eventos de mouse mas sem acessibilidade por teclado
    const allElements = document.querySelectorAll('*');
    
    allElements.forEach(element => {
      const mouseHandlers = getMouseOnlyHandlers(element);
      
      if (mouseHandlers.length === 0) return;

      // Ignora elementos naturalmente focáveis e acessíveis
      if (isNaturallyFocusable(element)) return;

      // Verifica se tem acessibilidade por teclado
      const hasTabindex = element.hasAttribute('tabindex');
      const hasKeyboard = hasKeyboardHandler(element);
      const hasRole = element.hasAttribute('role');

      // Se tem evento de mouse mas não é acessível por teclado
      if (!isNaturallyFocusable(element) && (!hasTabindex || !hasKeyboard)) {
        const tag = element.tagName.toLowerCase();
        const events = mouseHandlers.join(', ');

        violations.push({
          selector: window.wcagUtils.getSelector(element),
          snippet: window.wcagUtils.getSnippet(element),
          help: `Este <${tag}> tem evento(s) ${events} mas não é operável por teclado. ` +
                `Faltam: ${!hasTabindex ? 'tabindex="0"' : ''} ${!hasKeyboard ? 'handler de teclado (onkeydown/onkeypress)' : ''}. ` +
                `MELHOR: use elemento nativo (<button>, <a href>). ` +
                `ALTERNATIVA: adicione tabindex="0", role apropriado, e handler para Enter/Space. ` +
                `Usuários de teclado não conseguem acionar este elemento.`
        });
      }
    });

    // 2. Detecta elementos com tabindex="0" mas sem handlers de teclado
    const focusableWithoutKeyboard = document.querySelectorAll('[tabindex="0"]');
    
    focusableWithoutKeyboard.forEach(element => {
      if (isNaturallyFocusable(element)) return;

      const hasKeyboard = hasKeyboardHandler(element);
      const mouseHandlers = getMouseOnlyHandlers(element);
      
      // Se é focável, tem evento de mouse, mas não tem handler de teclado
      if (!hasKeyboard && mouseHandlers.length > 0) {
        violations.push({
          selector: window.wcagUtils.getSelector(element),
          snippet: window.wcagUtils.getSnippet(element),
          help: 'Este elemento é focável (tabindex="0") e tem eventos de mouse, ' +
                'mas não responde a teclas (Enter/Space). ' +
                'Adicione onkeydown ou onkeypress que responda a Enter (key==="Enter") e Space (key===" "). ' +
                'Exemplo: onkeydown="if(event.key===\'Enter\'||event.key===\' \')funcao()"'
        });
      }
    });

    // 3. Detecta elementos hover-only (mouseover/mouseenter) sem equivalente de foco
    const hoverElements = document.querySelectorAll('[onmouseover], [onmouseenter]');
    
    hoverElements.forEach(element => {
      const hasFocus = element.onfocus || element.hasAttribute('onfocus');
      const hasKeyboard = hasKeyboardHandler(element);
      const isFocusable = isNaturallyFocusable(element) || element.hasAttribute('tabindex');

      // Se tem hover mas não é focável ou não tem equivalente de foco
      if (!isFocusable || (!hasFocus && !hasKeyboard)) {
        violations.push({
          selector: window.wcagUtils.getSelector(element),
          snippet: window.wcagUtils.getSnippet(element),
          help: 'Este elemento tem evento mouseover/mouseenter (ativado por hover) ' +
                'mas não é acessível por teclado via foco. ' +
                'Adicione tabindex="0" e onfocus para replicar o comportamento. ' +
                'Exemplo: <div tabindex="0" onmouseover="mostrar()" onfocus="mostrar()">...</div>. ' +
                'Usuários de teclado não conseguem ver o conteúdo revelado por hover.'
        });
      }
    });

    // 4. Detecta controles customizados sem role apropriado
    const customControls = document.querySelectorAll(
      '[tabindex="0"]:not(a):not(button):not(input):not(select):not(textarea)'
    );
    
    customControls.forEach(element => {
      const hasRole = element.hasAttribute('role');
      const mouseHandlers = getMouseOnlyHandlers(element);
      
      if (mouseHandlers.length > 0 && !hasRole) {
        violations.push({
          selector: window.wcagUtils.getSelector(element),
          snippet: window.wcagUtils.getSnippet(element),
          help: 'Este elemento customizado é focável e interativo mas não tem role ARIA. ' +
                'Adicione role apropriado: role="button" (ação), role="link" (navegação), ' +
                'role="checkbox", role="tab", etc. ' +
                'O role ajuda tecnologias assistivas a identificarem o tipo de controle.'
        });
      }
    });

    // 5. Detecta elementos com role="button" mas sem responder a Space
    // (botões devem responder tanto a Enter quanto a Space)
    const roleButtons = document.querySelectorAll('[role="button"]');
    
    roleButtons.forEach(element => {
      if (element.tagName.toLowerCase() === 'button') return; // Botão nativo já funciona

      const hasKeyboard = hasKeyboardHandler(element);
      
      if (!hasKeyboard) {
        violations.push({
          selector: window.wcagUtils.getSelector(element),
          snippet: window.wcagUtils.getSnippet(element),
          help: 'Este elemento tem role="button" mas não tem handler de teclado. ' +
                'Botões devem responder a Enter E Space. ' +
                'Adicione: onkeydown="if(event.key===\'Enter\'||event.key===\' \')suaFuncao()". ' +
                'Ou melhor: use <button type="button"> nativo que já implementa isso.'
        });
      }
    });

    // 6. Detecta dropdowns/selects customizados sem suporte a setas
    const dropdownElements = document.querySelectorAll(
      '[role="listbox"], [role="combobox"], [role="menu"]'
    );
    
    dropdownElements.forEach(element => {
      const hasKeyboard = hasKeyboardHandler(element);
      
      if (!hasKeyboard) {
        const role = element.getAttribute('role');
        violations.push({
          selector: window.wcagUtils.getSelector(element),
          snippet: window.wcagUtils.getSnippet(element),
          help: `Este controle tem role="${role}" mas não implementa navegação por teclado. ` +
                'Controles de seleção customizados devem responder a: ' +
                '• Arrow Up/Down (navegar itens) ' +
                '• Enter/Space (selecionar) ' +
                '• Esc (fechar) ' +
                '• Home/End (primeiro/último). ' +
                'Consulte WAI-ARIA Authoring Practices para implementação completa.'
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
