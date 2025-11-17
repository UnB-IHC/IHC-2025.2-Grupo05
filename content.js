/**
 * Content Script - Executado no contexto da página
 * Realiza a auditoria DOM e comunica resultados ao popup
 */

// Cria instância do audit runner
class AuditRunner {
  constructor() {
    this.rules = new Map();
    console.log("[Audit Runner] Construtor chamado");
  }

  register(id, rule) {
    if (!rule.check || typeof rule.check !== "function") {
      throw new Error(`Regra ${id} deve ter uma função check`);
    }

    this.rules.set(id, {
      id,
      wcag: rule.wcag || {},
      severity: rule.severity || "error",
      description: rule.description || "",
      check: rule.check,
      enabled: rule.enabled !== false,
    });

    console.log(
      `[Audit Runner] Regra ${id} registrada (enabled: ${
        rule.enabled !== false
      })`
    );
  }

  /**
   * Executa auditoria com configurações
   * @param {Document} document - Documento DOM
   * @param {Object} config - Configurações do usuário (opcional)
   */
  async run(document, config = null) {
    console.log("[Audit Runner] ===== INICIANDO RUN =====");

    // Se config não foi passada, carrega do storage
    if (!config) {
      config = await this.loadUserConfig();
    }

    console.log(
      "[Audit Runner] Config recebida:",
      JSON.stringify(config, null, 2)
    );

    const violations = [];
    let executedCount = 0;
    let skippedDisabled = 0;
    let skippedLevel = 0;

    const levelOrder = { A: 1, AA: 2, AAA: 3 };
    const targetLevelNum = levelOrder[config.targetLevel] || 2;

    console.log(`[Audit Runner] Total de regras: ${this.rules.size}`);
    console.log(
      `[Audit Runner] Nível alvo: ${config.targetLevel} (${targetLevelNum})`
    );

    // APLICA AS CONFIGURAÇÕES NAS REGRAS
    if (config.enabledRules) {
      console.log("[Audit Runner] Aplicando enabledRules...");
      for (const [ruleId, enabled] of Object.entries(config.enabledRules)) {
        this.setRuleEnabled(ruleId, enabled);
        console.log(`[Audit Runner]   → ${ruleId}: ${enabled}`);
      }
    }

    for (const [id, rule] of this.rules) {
      console.log(
        `[Audit Runner] Verificando ${id}: enabled=${rule.enabled}, level=${rule.wcag.level}`
      );

      // FILTRO 1: Regra desabilitada pelo usuário
      if (rule.enabled === false) {
        console.log(`[Audit Runner]   ❌ DESATIVADA pelo usuário`);
        skippedDisabled++;
        continue;
      }

      // FILTRO 2: Nível WCAG acima do alvo
      const ruleLevelNum = levelOrder[rule.wcag.level] || 1;
      if (ruleLevelNum > targetLevelNum) {
        console.log(
          `[Audit Runner]   ⏭️ NÍVEL IGNORADO (${rule.wcag.level} > ${config.targetLevel})`
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
            `[Audit Runner]   🔴 ${result.nodes.length} violação(ões) encontrada(s)`
          );
          const normalizedViolation = this.normalizeResult(id, rule, result);
          violations.push(normalizedViolation);
        } else {
          console.log(`[Audit Runner]   ✓ Passou (0 violações)`);
        }
      } catch (error) {
        console.error(`[Audit Runner]   ⚠️ Erro:`, error);
      }
    }

    console.log("[Audit Runner] ===== RESUMO =====");
    console.log(`[Audit Runner] ✅ Executadas: ${executedCount}`);
    console.log(`[Audit Runner] ❌ Desativadas: ${skippedDisabled}`);
    console.log(`[Audit Runner] ⏭️ Nível ignorado: ${skippedLevel}`);
    console.log(`[Audit Runner] 🔴 Violações: ${violations.length}`);

    return violations;
  }

  async loadUserConfig() {
    console.log("[Audit Runner] loadUserConfig() chamado");

    try {
      const result = await chrome.storage.sync.get(["wcagConfig"]);
      console.log("[Audit Runner] chrome.storage.sync.get resultado:", result);

      if (result.wcagConfig) {
        const config = result.wcagConfig;
        console.log(
          "[Audit Runner] ✓ Config encontrada:",
          JSON.stringify(config, null, 2)
        );
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

  normalizeResult(id, rule, result) {
    return {
      ruleId: id,
      wcag: {
        id: rule.wcag.id || "N/A",
        level: rule.wcag.level || "A",
      },
      severity: rule.severity || "error",
      description: rule.description || "Violação detectada",
      nodes: result.nodes.map((node) => ({
        selector: node.selector || "N/A",
        snippet: node.snippet || "",
        help: node.help || "Corrija este elemento conforme as diretrizes WCAG",
      })),
    };
  }

  setRuleEnabled(id, enabled) {
    const rule = this.rules.get(id);
    if (rule) {
      rule.enabled = enabled;
    }
  }

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

// Instância global do audit runner
const auditRunner = new AuditRunner();

/**
 * Executa auditoria com configurações
 * @param {Object} config - Configurações do usuário (opcional)
 */
async function runAudit(config = null) {
  try {
    console.log("[Content] Iniciando auditoria com config:", config);

    // Aguarda DOM estar completamente carregado
    if (document.readyState === "loading") {
      await new Promise((resolve) => {
        document.addEventListener("DOMContentLoaded", resolve);
      });
    }

    // Executa todas as regras registradas
    const violations = await auditRunner.run(document, config);

    console.log(
      `[Content] Auditoria concluída: ${violations.length} violação(ões) encontrada(s)`
    );

    return violations;
  } catch (error) {
    console.error("[Content] Erro ao executar auditoria:", error);
    return [];
  }
}

/**
 * Destaca elementos no DOM que possuem violações
 */
function highlightNodes(nodes) {
  // Remove destaques anteriores
  document.querySelectorAll(".wcag-auditor-highlight").forEach((el) => {
    el.classList.remove("wcag-auditor-highlight");
    el.removeAttribute("data-wcag-violation");
  });

  // Se array vazio, apenas remove destaques
  if (!nodes || nodes.length === 0) {
    console.log("[Content] Destaques removidos");
    return;
  }

  // Adiciona novos destaques
  let firstElement = null;
  let highlightedCount = 0;

  nodes.forEach((nodeInfo, index) => {
    try {
      const element = document.querySelector(nodeInfo.selector);
      if (element) {
        element.classList.add("wcag-auditor-highlight");
        element.setAttribute(
          "data-wcag-violation",
          nodeInfo.ruleId || "unknown"
        );

        if (
          !element.hasAttribute("tabindex") &&
          !element.matches("a, button, input, select, textarea")
        ) {
          element.setAttribute("tabindex", "-1");
        }

        highlightedCount++;

        if (!firstElement) {
          firstElement = element;
        }
      }
    } catch (e) {
      console.warn(
        "[Content] Não foi possível destacar:",
        nodeInfo.selector,
        e
      );
    }
  });

  console.log(`[Content] ${highlightedCount} elemento(s) destacado(s)`);

  if (firstElement) {
    setTimeout(() => {
      firstElement.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "nearest",
      });

      try {
        firstElement.focus({ preventScroll: true });
      } catch (e) {
        // Alguns elementos não são focáveis
      }
    }, 100);
  }
}

/**
 * Gera seletor CSS único para um elemento
 */
function getSelector(element) {
  if (element.id) {
    return `#${element.id}`;
  }

  if (element.className && typeof element.className === "string") {
    const classes = element.className
      .trim()
      .split(/\s+/)
      .filter((c) => c);
    if (classes.length > 0) {
      return `${element.tagName.toLowerCase()}.${classes[0]}`;
    }
  }

  return element.tagName.toLowerCase();
}

/**
 * Gera snippet HTML do elemento
 */
function getSnippet(element) {
  const html = element.outerHTML;
  if (html.length > 150) {
    return html.substring(0, 147) + "...";
  }
  return html;
}

// ============================================
// MESSAGE LISTENER - RECEBE CONFIG DO POPUP!
// ============================================

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("[Content] Mensagem recebida:", message.type);

  if (message.type === "START_AUDIT") {
    console.log("[Content] Config recebida na mensagem:", message.config);

    // PASSA A CONFIG PRO RUNNER!
    runAudit(message.config)
      .then((violations) => {
        console.log("[Content] Enviando resultados:", violations);
        sendResponse({
          success: true,
          violations: violations,
          timestamp: new Date().toISOString(),
          url: window.location.href,
          totalViolations: violations.reduce(
            (sum, v) => sum + v.nodes.length,
            0
          ),
        });
      })
      .catch((error) => {
        console.error("[Content] Erro na auditoria:", error);
        sendResponse({
          success: false,
          error: error.message,
        });
      });
    return true; // Mantém canal aberto
  }

  if (message.type === "HIGHLIGHT") {
    highlightNodes(message.nodes);
    sendResponse({ success: true });
    return true;
  }

  if (message.type === "GET_RULES") {
    const rules = auditRunner.getRules();
    sendResponse({ success: true, rules });
    return true;
  }
});

// Injeta estilos para destacar violações
const style = document.createElement("style");
style.id = "wcag-auditor-styles";
style.textContent = `
  .wcag-auditor-highlight {
    outline: 4px solid #d32f2f !important;
    outline-offset: 3px !important;
    background-color: rgba(211, 47, 47, 0.1) !important;
    scroll-margin-top: 100px !important;
    position: relative !important;
    z-index: 999998 !important;
  }

  @media (prefers-reduced-motion: no-preference) {
    .wcag-auditor-highlight {
      animation: wcag-pulse 1.5s ease-in-out infinite;
    }
  }

  @keyframes wcag-pulse {
    0%, 100% {
      outline-color: #d32f2f;
      background-color: rgba(211, 47, 47, 0.1);
    }
    50% {
      outline-color: #ff5252;
      background-color: rgba(255, 82, 82, 0.15);
    }
  }

  .wcag-auditor-highlight:focus {
    outline: 5px solid #0066cc !important;
    outline-offset: 4px !important;
    box-shadow: 0 0 0 2px #ffffff, 0 0 0 6px #0066cc !important;
  }

  .wcag-auditor-highlight::before {
    content: attr(data-wcag-violation);
    position: absolute;
    top: -28px;
    left: 0;
    background: #d32f2f;
    color: white;
    padding: 4px 8px;
    border-radius: 3px;
    font-size: 11px;
    font-weight: 600;
    font-family: monospace;
    z-index: 999999;
    pointer-events: none;
    box-shadow: 0 2px 4px rgba(0,0,0,0.3);
  }
`;
document.head.appendChild(style);

console.log("[Content] Content script carregado e pronto ✓");

// Exporta funções utilitárias para uso nas regras
window.wcagUtils = {
  getSelector,
  getSnippet,
};

// Exporta runner para debug
window.auditRunner = auditRunner;
