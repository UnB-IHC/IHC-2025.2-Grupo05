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

/**
 * Audit Runner - Motor de auditoria
 * Gerencia registro e execução de regras WCAG com suporte a configurações
 */

class AuditRunner {
  constructor() {
    this.rules = new Map();
    console.log("[Audit Runner] Construtor inicializado");
  }

  /**
   * Registra uma nova regra de auditoria
   */
  register(id, rule) {
    if (!rule.check || typeof rule.check !== "function") {
      throw new Error(`Regra ${id} deve ter uma função check`);
    }

    if (!rule.wcag || !rule.wcag.id) {
      console.warn(`Regra ${id} sem WCAG ID definido`);
    }

    this.rules.set(id, {
      id,
      wcag: rule.wcag || { id: "N/A", level: "A" },
      severity: rule.severity || "error",
      description: rule.description || "Violação detectada",
      check: rule.check,
      enabled: rule.enabled !== false,
    });
  }

  /**
   * Executa todas as regras habilitadas no documento
   * APLICA CONFIGURAÇÕES DO USUÁRIO
   */
  async run(document) {
    console.log("[Audit Runner] ===== INICIANDO AUDITORIA =====");

    // Carrega configurações do usuário
    const config = await this.loadUserConfig();
    console.log("[Audit Runner] Config carregada:", config);

    const violations = [];
    let executedCount = 0;
    let skippedDisabled = 0;
    let skippedLevel = 0;

    // Mapeamento de níveis para comparação
    const levelOrder = { A: 1, AA: 2, AAA: 3 };
    const targetLevelNum = levelOrder[config.targetLevel] || 2;

    console.log(`[Audit Runner] Total de regras: ${this.rules.size}`);
    console.log(`[Audit Runner] Nível alvo: ${config.targetLevel}`);

    for (const [id, rule] of this.rules) {
      console.log(
        `[Audit Runner] → ${id}: enabled=${rule.enabled}, level=${rule.wcag.level}`
      );

      // Verifica se regra está desabilitada
      if (!rule.enabled) {
        console.log(`[Audit Runner]   ❌ DESABILITADA`);
        skippedDisabled++;
        continue;
      }

      // Filtra por nível WCAG
      const ruleLevelNum = levelOrder[rule.wcag.level] || 1;
      if (ruleLevelNum > targetLevelNum) {
        console.log(
          `[Audit Runner]   ❌ NÍVEL IGNORADO (${rule.wcag.level} > ${config.targetLevel})`
        );
        skippedLevel++;
        continue;
      }

      try {
        console.log(`[Audit Runner]   ✅ EXECUTANDO...`);
        executedCount++;

        const result = await rule.check(document);

        if (result && result.nodes && result.nodes.length > 0) {
          console.log(
            `[Audit Runner]   🔴 ${result.nodes.length} violação(ões)`
          );
          const normalizedViolation = this.normalizeResult(id, rule, result);
          violations.push(normalizedViolation);
        } else {
          console.log(`[Audit Runner]   ✓ OK`);
        }
      } catch (error) {
        console.error(`[Audit Runner]   ⚠️ ERRO:`, error);
      }
    }

    console.log("[Audit Runner] ===== RESUMO =====");
    console.log(`[Audit Runner] ✅ Executadas: ${executedCount}`);
    console.log(`[Audit Runner] ❌ Desabilitadas: ${skippedDisabled}`);
    console.log(`[Audit Runner] 🔒 Nível ignorado: ${skippedLevel}`);
    console.log(`[Audit Runner] 🔴 Violações: ${violations.length}`);
    console.log("[Audit Runner] ===================");

    return violations;
  }

  /**
   * Carrega configurações do usuário do chrome.storage
   */
  async loadUserConfig() {
    console.log("[Audit Runner] Carregando configurações...");

    try {
      const result = await chrome.storage.sync.get(["wcagConfig"]);

      if (result.wcagConfig) {
        const config = result.wcagConfig;
        console.log("[Audit Runner] ✓ Config encontrada:", config);
        console.log("[Audit Runner] Aplicando regras...");

        // Aplica estado de cada regra
        let applied = 0;
        for (const [ruleId, enabled] of Object.entries(config.enabledRules)) {
          this.setRuleEnabled(ruleId, enabled);
          console.log(`[Audit Runner]   ${ruleId}: ${enabled}`);
          applied++;
        }

        console.log(`[Audit Runner] ${applied} configurações aplicadas`);
        return config;
      }

      console.log("[Audit Runner] ⚠️ Nenhuma config salva, usando padrão");
      return {
        targetLevel: "AA",
        enabledRules: {},
      };
    } catch (error) {
      console.error("[Audit Runner] ❌ Erro ao carregar config:", error);
      return {
        targetLevel: "AA",
        enabledRules: {},
      };
    }
  }

  /**
   * Normaliza resultado da regra conforme schema padrão
   */
  normalizeResult(id, rule, result) {
    if (!result.nodes || !Array.isArray(result.nodes)) {
      console.warn(`Regra ${id} retornou resultado sem array 'nodes'`);
      return null;
    }

    const normalizedNodes = result.nodes
      .map((node) => {
        if (!node.selector) {
          console.warn(`Nó da regra ${id} sem seletor CSS`);
        }

        return {
          selector: node.selector || "N/A",
          snippet: (node.snippet || "").substring(0, 200),
          help:
            node.help || "Corrija este elemento conforme as diretrizes WCAG",
        };
      })
      .filter((node) => node !== null);

    return {
      ruleId: id,
      wcag: {
        id: rule.wcag.id || "N/A",
        level: rule.wcag.level || "A",
      },
      severity: rule.severity || "error",
      description: rule.description || "Violação detectada",
      nodes: normalizedNodes,
    };
  }

  /**
   * Habilita ou desabilita uma regra
   */
  setRuleEnabled(id, enabled) {
    const rule = this.rules.get(id);
    if (rule) {
      rule.enabled = enabled;
    } else {
      console.warn(`[Audit Runner] Regra ${id} não encontrada`);
    }
  }

  /**
   * Retorna lista de todas as regras registradas
   */
  getRules() {
    return Array.from(this.rules.values()).map((rule) => ({
      id: rule.id,
      wcag: rule.wcag,
      severity: rule.severity,
      description: rule.description,
      enabled: rule.enabled,
    }));
  }
}

// Exporta instância singleton
const auditRunner = new AuditRunner();

// Disponibiliza globalmente
if (typeof window !== "undefined") {
  window.auditRunner = auditRunner;
}

// Para uso em módulos
if (typeof module !== "undefined" && module.exports) {
  module.exports = { AuditRunner, auditRunner };
}
