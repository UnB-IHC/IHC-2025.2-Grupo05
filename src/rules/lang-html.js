/**
 * Regra: lang-html
 * WCAG 3.1.1 (Nível A)
 * 
 * Descrição: Verifica se o elemento <html> possui o atributo lang com um código válido.
 * O atributo lang é essencial para leitores de tela identificarem o idioma da página.
 * 
 * Violação: <html> ou <html lang=""> ou <html lang="xyz">
 * Correto: <html lang="pt-BR"> ou <html lang="en">
 */

(function() {
  'use strict';

  const RULE_ID = 'lang-html';

  const ruleMetadata = {
    wcag: {
      id: '3.1.1',
      level: 'A'
    },
    severity: 'error',
    description: 'O elemento <html> deve ter um atributo lang válido que identifique o idioma da página',
    enabled: true
  };

  // Lista de códigos de idioma válidos (ISO 639-1 + alguns regionais comuns)
  const VALID_LANG_CODES = [
    'pt', 'pt-BR', 'pt-PT',
    'en', 'en-US', 'en-GB',
    'es', 'es-ES', 'es-MX',
    'fr', 'fr-FR',
    'de', 'de-DE',
    'it', 'it-IT',
    'ja', 'zh', 'ko',
    'ar', 'ru', 'hi',
    'nl', 'sv', 'no', 'da', 'fi',
    'pl', 'tr', 'cs', 'hu', 'ro',
    // Aceita qualquer formato XX ou XX-YY
  ];

  /**
   * Valida se o código de idioma está em formato válido
   * @param {string} lang - Código de idioma
   * @returns {boolean} true se válido
   */
  function isValidLangCode(lang) {
    if (!lang) return false;
    
    // Remove espaços e converte para minúsculas
    lang = lang.trim().toLowerCase();
    
    // Verifica se está na lista ou segue o padrão XX ou XX-YY
    if (VALID_LANG_CODES.includes(lang)) return true;
    
    // Valida formato: 2-3 letras ou 2-3 letras + hífen + 2-3 letras/dígitos
    const langPattern = /^[a-z]{2,3}(-[a-z]{2,3})?$/i;
    return langPattern.test(lang);
  }

  /**
   * Verifica se o <html> possui atributo lang válido
   * @param {Document} document - Documento DOM
   * @returns {Object} { nodes: Array } com violações encontradas
   */
  async function check(document) {
    const violations = [];
    const htmlElement = document.documentElement;

    if (!htmlElement) {
      // Caso extremo: sem elemento <html>
      violations.push({
        selector: 'html',
        snippet: '(elemento <html> não encontrado)',
        help: 'A página deve ter um elemento <html> com atributo lang.'
      });
      return { nodes: violations };
    }

    const langAttr = htmlElement.getAttribute('lang');

    // Verifica se o atributo lang existe
    if (!langAttr) {
      violations.push({
        selector: 'html',
        snippet: `<html${htmlElement.className ? ` class="${htmlElement.className}"` : ''}>`,
        help: 'Adicione o atributo lang ao elemento <html>. Exemplo: <html lang="pt-BR"> para português brasileiro.'
      });
      return { nodes: violations };
    }

    // Verifica se o atributo lang está vazio
    if (langAttr.trim() === '') {
      violations.push({
        selector: 'html',
        snippet: '<html lang="">',
        help: 'O atributo lang está vazio. Defina um código de idioma válido. Exemplo: lang="pt-BR" ou lang="en".'
      });
      return { nodes: violations };
    }

    // Verifica se o código de idioma é válido
    if (!isValidLangCode(langAttr)) {
      violations.push({
        selector: 'html',
        snippet: `<html lang="${langAttr}">`,
        help: `O código de idioma "${langAttr}" não parece válido. Use códigos ISO 639-1 como "pt-BR", "en", "es", etc.`
      });
    }

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
