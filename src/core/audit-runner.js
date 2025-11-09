/**
 * Audit Runner - Motor de auditoria
 * Gerencia registro e execução de regras WCAG
 * 
 * SCHEMA PADRÃO DE RESULTADO:
 * {
 *   ruleId: string,              // Ex: 'img-alt', 'page-title'
 *   wcag: {
 *     id: string,                // Ex: '1.1.1'
 *     level: string              // 'A', 'AA' ou 'AAA'
 *   },
 *   severity: string,            // 'error' ou 'warn'
 *   description: string,         // Descrição da violação
 *   nodes: [{
 *     selector: string,          // Seletor CSS do elemento
 *     snippet: string,           // HTML snippet (truncado)
 *     help: string              // Dica de como corrigir
 *   }]
 * }
 */

class AuditRunner {
  constructor() {
    this.rules = new Map();
  }

  /**
   * Registra uma nova regra de auditoria
   * @param {string} id - Identificador único da regra (ex: 'img-alt')
   * @param {Object} rule - Objeto com metadados e função check
   * @param {Object} rule.wcag - { id: '1.1.1', level: 'A' }
   * @param {string} rule.severity - 'error' ou 'warn'
   * @param {string} rule.description - Descrição da violação
   * @param {Function} rule.check - Função que retorna { nodes: [...] }
   * @param {boolean} [rule.enabled=true] - Se a regra está habilitada
   */
  register(id, rule) {
    if (!rule.check || typeof rule.check !== 'function') {
      throw new Error(`Regra ${id} deve ter uma função check`);
    }
    
    // Valida estrutura da regra
    if (!rule.wcag || !rule.wcag.id) {
      console.warn(`Regra ${id} sem WCAG ID definido`);
    }
    
    this.rules.set(id, {
      id,
      wcag: rule.wcag || { id: 'N/A', level: 'A' },
      severity: rule.severity || 'error',
      description: rule.description || 'Violação detectada',
      check: rule.check,
      enabled: rule.enabled !== false
    });
  }

  /**
   * Executa todas as regras habilitadas no documento
   * @param {Document} document - Documento DOM a ser auditado
   * @returns {Promise<Array>} Lista de violações encontradas (schema normalizado)
   */
  async run(document) {
    const violations = [];

    for (const [id, rule] of this.rules) {
      if (!rule.enabled) continue;

      try {
        // Executa a função check da regra
        const result = await rule.check(document);
        
        // Se houve violações, normaliza e adiciona à lista
        if (result && result.nodes && result.nodes.length > 0) {
          const normalizedViolation = this.normalizeResult(id, rule, result);
          violations.push(normalizedViolation);
        }
      } catch (error) {
        console.error(`Erro ao executar regra ${id}:`, error);
      }
    }

    return violations;
  }

  /**
   * Normaliza resultado da regra conforme schema padrão
   * Garante que todos os campos obrigatórios estejam presentes
   * @param {string} id - ID da regra
   * @param {Object} rule - Metadados da regra
   * @param {Object} result - Resultado bruto da regra
   * @returns {Object} Resultado normalizado conforme schema
   */
  normalizeResult(id, rule, result) {
    // Valida estrutura básica
    if (!result.nodes || !Array.isArray(result.nodes)) {
      console.warn(`Regra ${id} retornou resultado sem array 'nodes'`);
      return null;
    }

    // Normaliza cada nó
    const normalizedNodes = result.nodes.map(node => {
      if (!node.selector) {
        console.warn(`Nó da regra ${id} sem seletor CSS`);
      }
      
      return {
        selector: node.selector || 'N/A',
        snippet: (node.snippet || '').substring(0, 200), // Trunca snippet
        help: node.help || 'Corrija este elemento conforme as diretrizes WCAG'
      };
    }).filter(node => node !== null);

    // Retorna violação normalizada
    return {
      ruleId: id,
      wcag: {
        id: rule.wcag.id || 'N/A',
        level: rule.wcag.level || 'A'
      },
      severity: rule.severity || 'error',
      description: rule.description || 'Violação detectada',
      nodes: normalizedNodes
    };
  }

  /**
   * Habilita ou desabilita uma regra
   * @param {string} id - ID da regra
   * @param {boolean} enabled - Estado desejado
   */
  setRuleEnabled(id, enabled) {
    const rule = this.rules.get(id);
    if (rule) {
      rule.enabled = enabled;
    }
  }

  /**
   * Retorna lista de todas as regras registradas
   * @returns {Array} Lista de regras com seus metadados
   */
  getRules() {
    return Array.from(this.rules.values()).map(rule => ({
      id: rule.id,
      wcag: rule.wcag,
      severity: rule.severity,
      description: rule.description,
      enabled: rule.enabled
    }));
  }
}

// Exporta instância singleton
const auditRunner = new AuditRunner();

// Disponibiliza globalmente para content script
if (typeof window !== 'undefined') {
  window.auditRunner = auditRunner;
}

// Para uso em módulos (se necessário futuramente)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { AuditRunner, auditRunner };
}
