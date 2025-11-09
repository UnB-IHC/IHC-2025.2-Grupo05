/**
 * Audit Runner - Motor de auditoria
 * Gerencia registro e execução de regras WCAG
 */

class AuditRunner {
  constructor() {
    this.rules = new Map();
  }

  /**
   * Registra uma nova regra de auditoria
   * @param {string} id - Identificador único da regra (ex: 'img-alt')
   * @param {Object} rule - Objeto com metadados e função check
   */
  register(id, rule) {
    if (!rule.check || typeof rule.check !== 'function') {
      throw new Error(`Regra ${id} deve ter uma função check`);
    }
    
    this.rules.set(id, {
      id,
      wcag: rule.wcag || {},
      severity: rule.severity || 'error',
      description: rule.description || '',
      check: rule.check,
      enabled: rule.enabled !== false
    });
  }

  /**
   * Executa todas as regras habilitadas no documento
   * @param {Document} document - Documento DOM a ser auditado
   * @returns {Promise<Array>} Lista de violações encontradas
   */
  async run(document) {
    const violations = [];

    for (const [id, rule] of this.rules) {
      if (!rule.enabled) continue;

      try {
        // Executa a função check da regra
        const result = await rule.check(document);
        
        // Se houve violações, adiciona à lista
        if (result && result.nodes && result.nodes.length > 0) {
          violations.push({
            ruleId: id,
            wcag: rule.wcag,
            severity: rule.severity,
            description: rule.description,
            nodes: result.nodes
          });
        }
      } catch (error) {
        console.error(`Erro ao executar regra ${id}:`, error);
      }
    }

    return violations;
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
