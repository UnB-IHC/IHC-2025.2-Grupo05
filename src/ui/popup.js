/**
 * Popup Script - Com Options Inline + Export JSON/CSV
 * KPIs, filtros, expand/collapse, clipboard + configurações + EXPORTAÇÃO
 */

import { exportJSON, exportCSV, getStatistics } from "../core/export.js";

// ============================================
// ELEMENTOS DO DOM
// ============================================

// Views
const auditView = document.getElementById("audit-view");
const optionsView = document.getElementById("options-view");

// Botões de navegação
const openOptionsBtn = document.getElementById("open-options");
const backToAuditBtn = document.getElementById("back-to-audit");

// Elementos da auditoria
const runAuditBtn = document.getElementById("run-audit");
const highlightToggleBtn = document.getElementById("highlight-toggle");
const highlightText = document.getElementById("highlight-text");
const loadingSection = document.getElementById("loading");
const resultsSection = document.getElementById("results");
const violationsList = document.getElementById("violations-list");
const noViolations = document.getElementById("no-violations");
const noResultsFilter = document.getElementById("no-results-filter");
const ruleFilter = document.getElementById("rule-filter");
const toast = document.getElementById("toast");

// 🆕 Botões de exportação
const exportJSONBtn = document.getElementById("export-json");
const exportCSVBtn = document.getElementById("export-csv");

// KPI elements
const levelAErrors = document.getElementById("level-a-errors");
const levelAWarnings = document.getElementById("level-a-warnings");
const levelAAErrors = document.getElementById("level-aa-errors");
const levelAAWarnings = document.getElementById("level-aa-warnings");
const levelAAAErrors = document.getElementById("level-aaa-errors");
const levelAAAWarnings = document.getElementById("level-aaa-warnings");

// Elementos de configurações
const rulesList = document.getElementById("rules-list");
const enableAllBtn = document.getElementById("enable-all");
const disableAllBtn = document.getElementById("disable-all");
const saveOptionsBtn = document.getElementById("save-options");
const resetOptionsBtn = document.getElementById("reset-options");

// ============================================
// THEME SWITCHER
// ============================================

const themeCurrentBtn = document.querySelector(".theme-current");
const themeOptions = document.querySelector(".theme-options");
const themeOptionBtns = document.querySelectorAll(".theme-option");

// ============================================
// ESTADO GLOBAL
// ============================================

let highlightActive = false;
let currentViolations = [];
let allViolations = [];
let activeFilters = {
  levels: ["A", "AA", "AAA"],
  rule: "all",
};

// 🆕 Metadados da auditoria
let auditMetadata = {
  url: "",
  timestamp: null,
  userAgent: navigator.userAgent,
};

let currentConfig = {
  targetLevel: "AA",
  enabledRules: {},
};

const availableRules = [
  {
    id: "page-title",
    description: "Página deve ter título descritivo",
    wcag: { id: "2.4.2", level: "A" },
  },
  {
    id: "lang-html",
    description: "HTML deve ter atributo lang",
    wcag: { id: "3.1.1", level: "A" },
  },
  {
    id: "img-alt",
    description: "Imagens devem ter texto alternativo",
    wcag: { id: "1.1.1", level: "A" },
  },
  {
    id: "link-name",
    description: "Links devem ter nome acessível",
    wcag: { id: "2.4.4", level: "A" },
  },
  {
    id: "heading-order",
    description: "Hierarquia de headings deve ser lógica",
    wcag: { id: "1.3.1", level: "A" },
  },
  {
    id: "multiple-ways",
    description: "Múltiplas formas de navegação",
    wcag: { id: "2.4.5", level: "AA" },
  },
  {
    id: "text-spacing",
    description: "Espaçamento de texto adequado",
    wcag: { id: "1.4.12", level: "AA" },
  },
  {
    id: "images-of-text",
    description: "Evitar imagens de texto",
    wcag: { id: "1.4.5", level: "AA" },
  },
  {
    id: "alt-indicates-longdesc",
    description: "Alt deve indicar descrição longa",
    wcag: { id: "1.1.1", level: "A" },
  },
  {
    id: "icon-labels",
    description: "Ícones devem ter labels",
    wcag: { id: "1.1.1", level: "A" },
  },
  {
    id: "semantic-landmarks",
    description: "Uso correto de landmarks HTML5",
    wcag: { id: "1.3.1", level: "A" },
  },
  {
    id: "links-vs-buttons",
    description: "Links devem navegar, botões devem executar ações",
    wcag: { id: "4.1.2", level: "A" },
  },
  {
    id: "keyboard-operable",
    description: "Funcionalidades operáveis por teclado",
    wcag: { id: "2.1.1", level: "A" },
  },
  {
    id: "focus-trap",
    description: "Sem armadilha de teclado em modais/menus",
    wcag: { id: "2.1.2", level: "A" },
  },
];

// ============================================
// NAVEGAÇÃO ENTRE VIEWS
// ============================================

openOptionsBtn.addEventListener("click", () => {
  auditView.classList.add("hidden");
  optionsView.classList.remove("hidden");
  loadOptionsConfig();
});

backToAuditBtn.addEventListener("click", async () => {
  optionsView.classList.add("hidden");
  auditView.classList.remove("hidden");

  console.log("[Popup] Voltando das configurações, rodando auditoria...");
  await runAudit();
});

// ============================================
// AUTO-RUN AUDIT ON POPUP OPEN
// ============================================

(async function autoRunAudit() {
  try {
    console.log("[Popup] Executando auditoria automática...");
    await runAudit();
  } catch (error) {
    console.error("[Popup] Erro na auditoria automática:", error);
  }
})();

// ============================================
// AUDITORIA
// ============================================

async function runAudit() {
  try {
    loadingSection.classList.remove("hidden");
    resultsSection.classList.add("hidden");
    runAuditBtn.disabled = true;

    console.log("[Popup] Solicitando auditoria...");

    const stored = await chrome.storage.sync.get("wcagConfig");
    const config = stored.wcagConfig || { targetLevel: "AA", enabledRules: {} };
    console.log("[Popup] 📋 Config carregada:", config);

    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    if (!tab || !tab.id) {
      showError("Não foi possível identificar a aba ativa");
      return;
    }

    if (
      tab.url.startsWith("chrome://") ||
      tab.url.startsWith("chrome-extension://") ||
      tab.url.startsWith("edge://") ||
      tab.url.startsWith("about:")
    ) {
      showError(
        "❌ Não é possível auditar páginas internas do navegador.\n\nTente em uma página web normal (http:// ou https://)"
      );
      return;
    }

    // 🆕 Salva metadados da auditoria
    auditMetadata = {
      url: tab.url,
      title: tab.title,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      targetLevel: config.targetLevel,
    };

    const response = await window.messaging.requestAudit(config);
    console.log("[Popup] Resposta recebida:", response);

    if (response && response.success) {
      console.log(
        `[Popup] ${response.totalViolations || 0} violações encontradas`
      );
      allViolations = response.violations || [];
      currentViolations = [...allViolations];

      populateRuleFilter(allViolations);
      resetFilters();
      displayResults(currentViolations);

      if (currentViolations.length > 0) {
        highlightToggleBtn.disabled = false;
      }

      // 🆕 Habilita botões de export
      updateExportButtons();
    } else {
      showError(
        "Erro ao executar auditoria: " +
          (response?.error || "Sem resposta do content script")
      );
    }
  } catch (error) {
    console.error("[Popup] Erro:", error);

    if (
      error.message &&
      error.message.includes("Receiving end does not exist")
    ) {
      showError(
        "⚠️ Content script não carregado.\n\n📍 Solução: Recarregue a página (F5 ou Ctrl+R) e tente novamente.\n\n💡 Se o problema persistir, recarregue a extensão em chrome://extensions/"
      );
    } else {
      showError("Erro ao comunicar com a página: " + error.message);
    }
  } finally {
    loadingSection.classList.add("hidden");
    runAuditBtn.disabled = false;
  }
}

function displayResults(violations) {
  resultsSection.classList.remove("hidden");

  if (!violations || violations.length === 0) {
    violationsList.innerHTML = "";
    noViolations.classList.remove("hidden");
    noResultsFilter.classList.add("hidden");
    updateKPIs([]);
    console.log("[Popup] Nenhuma violação encontrada! ✅");
    return;
  }

  noViolations.classList.add("hidden");
  noResultsFilter.classList.add("hidden");
  updateKPIs(violations);
  renderViolationsGrouped(violations);
}

function updateKPIs(violations) {
  const stats = {
    A: { errors: 0, warnings: 0 },
    AA: { errors: 0, warnings: 0 },
    AAA: { errors: 0, warnings: 0 },
  };

  violations.forEach((violation) => {
    const level = violation.wcag.level;
    const nodeCount = violation.nodes.length;

    if (violation.severity === "error") {
      stats[level].errors += nodeCount;
    } else if (violation.severity === "warn") {
      stats[level].warnings += nodeCount;
    }
  });

  levelAErrors.textContent = stats.A.errors;
  levelAWarnings.textContent = stats.A.warnings;
  levelAAErrors.textContent = stats.AA.errors;
  levelAAWarnings.textContent = stats.AA.warnings;
  levelAAAErrors.textContent = stats.AAA.errors;
  levelAAAWarnings.textContent = stats.AAA.warnings;
}

function populateRuleFilter(violations) {
  const rules = new Set();
  violations.forEach((v) => rules.add(v.ruleId));

  ruleFilter.innerHTML = '<option value="all">Todas as regras</option>';

  Array.from(rules)
    .sort()
    .forEach((ruleId) => {
      const option = document.createElement("option");
      option.value = ruleId;
      option.textContent = ruleId;
      ruleFilter.appendChild(option);
    });
}

function renderViolationsGrouped(violations) {
  violationsList.innerHTML = "";

  if (violations.length === 0) {
    noResultsFilter.classList.remove("hidden");
    return;
  }

  const grouped = {};
  violations.forEach((violation) => {
    if (!grouped[violation.ruleId]) {
      grouped[violation.ruleId] = { ...violation, allNodes: [] };
    }
    grouped[violation.ruleId].allNodes.push(...violation.nodes);
  });

  Object.values(grouped).forEach((violation) => {
    const groupEl = document.createElement("div");
    groupEl.className = "violation-group";
    groupEl.dataset.ruleId = violation.ruleId;

    const headerEl = document.createElement("div");
    headerEl.className = "violation-group-header";
    headerEl.innerHTML = `
      <div class="violation-group-title">
        <span class="expand-icon">▶</span>
        <span class="severity-badge severity-${violation.severity}">${violation.severity}</span>
        <strong>${violation.description}</strong>
      </div>
      <div class="violation-group-meta">
        <span class="wcag-tag">WCAG ${violation.wcag.id} (${violation.wcag.level})</span>
        <span class="node-count">${violation.allNodes.length} ocorrência(s)</span>
      </div>
    `;

    headerEl.addEventListener("click", () => {
      groupEl.classList.toggle("expanded");
    });

    groupEl.appendChild(headerEl);

    const nodesEl = document.createElement("div");
    nodesEl.className = "violation-nodes";

    violation.allNodes.forEach((node) => {
      const nodeEl = document.createElement("div");
      nodeEl.className = "violation-node";

      nodeEl.innerHTML = `
        <div class="node-header">
          <code class="selector">${escapeHtml(node.selector)}</code>
          <div class="copy-buttons">
            <button class="copy-btn copy-selector" data-selector="${escapeHtml(
              node.selector
            )}">
              📋 Seletor
            </button>
            <button class="copy-btn copy-snippet" data-snippet="${escapeHtml(
              node.snippet
            )}">
              📋 Código
            </button>
          </div>
        </div>
        <pre class="snippet">${escapeHtml(node.snippet)}</pre>
        <div class="node-help">${escapeHtml(node.help)}</div>
      `;

      nodesEl.appendChild(nodeEl);
    });

    groupEl.appendChild(nodesEl);
    violationsList.appendChild(groupEl);
  });

  setupCopyButtons();
}

function setupCopyButtons() {
  document.querySelectorAll(".copy-selector").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const selector = btn.dataset.selector;
      copyToClipboard(selector, "Seletor copiado!");
    });
  });

  document.querySelectorAll(".copy-snippet").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const snippet = btn.dataset.snippet;
      copyToClipboard(snippet, "Código copiado!");
    });
  });
}

async function copyToClipboard(text, message = "Copiado!") {
  try {
    await navigator.clipboard.writeText(text);
    showToast(message);
  } catch (error) {
    console.error("[Popup] Erro ao copiar:", error);
    showToast("Erro ao copiar!");
  }
}

function showToast(message) {
  const toastMessage = toast.querySelector(".toast-message");
  toastMessage.textContent = message;
  toast.classList.remove("hidden");
  setTimeout(() => {
    toast.classList.add("hidden");
  }, 2000);
}

function applyFilters() {
  let filtered = [...allViolations];

  filtered = filtered.filter((v) =>
    activeFilters.levels.includes(v.wcag.level)
  );

  if (activeFilters.rule !== "all") {
    filtered = filtered.filter((v) => v.ruleId === activeFilters.rule);
  }

  currentViolations = filtered;
  displayResults(filtered);
}

function resetFilters() {
  activeFilters = {
    levels: ["A", "AA", "AAA"],
    rule: "all",
  };

  document.querySelectorAll(".filter-chip").forEach((chip) => {
    chip.classList.add("active");
  });

  ruleFilter.value = "all";
}

async function toggleHighlight() {
  try {
    if (highlightActive) {
      await window.messaging.requestHighlight([]);
      highlightActive = false;
      highlightText.textContent = "Destacar";
      highlightToggleBtn.classList.remove("active");
    } else {
      const allNodes = [];
      currentViolations.forEach((violation) => {
        violation.nodes.forEach((node) => {
          allNodes.push({
            selector: node.selector,
            ruleId: violation.ruleId,
          });
        });
      });

      if (allNodes.length > 0) {
        await window.messaging.requestHighlight(allNodes);
        highlightActive = true;
        highlightText.textContent = "Ocultar";
        highlightToggleBtn.classList.add("active");
      }
    }
  } catch (error) {
    console.error("[Popup] Erro ao alternar destaque:", error);
    showError("Erro ao destacar elementos: " + error.message);
  }
}

function showError(message) {
  resultsSection.classList.remove("hidden");
  noViolations.classList.add("hidden");

  const messageWithBreaks = escapeHtml(message).replace(/\n/g, "<br>");

  violationsList.innerHTML = `
    <div class="error-message" style="text-align: center; padding: 24px; color: var(--error-color); line-height: 1.6;">
      <span style="font-size: 36px; display: block; margin-bottom: 12px;">⚠️</span>
      <p style="white-space: pre-line;">${messageWithBreaks}</p>
    </div>
  `;
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// ============================================
// 🆕 EXPORT FUNCTIONS
// ============================================

function updateExportButtons() {
  const hasViolations = allViolations.length > 0;
  exportJSONBtn.disabled = !hasViolations;
  exportCSVBtn.disabled = !hasViolations;
}

function handleExportJSON() {
  if (allViolations.length === 0) {
    showToast("⚠️ Nenhum resultado para exportar");
    return;
  }

  try {
    // Converte o formato de violações para o formato esperado pelo export
    const resultsForExport = convertViolationsToExportFormat(allViolations);

    exportJSON(resultsForExport, auditMetadata);
    showToast("✅ JSON exportado com sucesso!");
    console.log("[Export] JSON exportado:", resultsForExport.length, "issues");
  } catch (error) {
    console.error("[Export] Erro ao exportar JSON:", error);
    showToast("❌ Erro ao exportar JSON");
  }
}

function handleExportCSV() {
  if (allViolations.length === 0) {
    showToast("⚠️ Nenhum resultado para exportar");
    return;
  }

  try {
    const resultsForExport = convertViolationsToExportFormat(allViolations);

    exportCSV(resultsForExport);
    showToast("✅ CSV exportado com sucesso!");
    console.log("[Export] CSV exportado:", resultsForExport.length, "issues");
  } catch (error) {
    console.error("[Export] Erro ao exportar CSV:", error);
    showToast("❌ Erro ao exportar CSV");
  }
}

/**
 * Converte o formato de violações agrupadas para o formato flat esperado pelo export
 */
function convertViolationsToExportFormat(violations) {
  const map = new Map();

  violations.forEach((violation) => {
    violation.nodes.forEach((node) => {
      const key = `${violation.ruleId}|||${node.selector}`;

      if (!map.has(key)) {
        map.set(key, {
          rule: violation.ruleId,
          description: violation.description,
          wcag: `${violation.wcag.id} (${violation.wcag.level})`,
          level: violation.wcag.level,
          severity: violation.severity,
          selector: node.selector,
          snippet: node.snippet,
          occurrences: 1,
          message: violation.description,
          helpUrl:
            node.helpUrl ||
            `https://www.w3.org/WAI/WCAG21/Understanding/${violation.wcag.id}`,
        });
      } else {
        map.get(key).occurrences++;
      }
    });
  });

  return Array.from(map.values());
}

// ============================================
// OPTIONS (dentro do popup)
// ============================================

async function loadOptionsConfig() {
  try {
    const stored = await chrome.storage.sync.get("wcagConfig");

    if (stored.wcagConfig) {
      currentConfig = stored.wcagConfig;
    } else {
      currentConfig = { targetLevel: "AA", enabledRules: {} };
    }

    console.log("[Popup Options] Config carregada:", currentConfig);
    updateOptionsUI();
  } catch (error) {
    console.error("[Popup Options] Erro ao carregar:", error);
  }
}

function updateOptionsUI() {
  const targetRadio = document.querySelector(
    `input[name="target-level"][value="${currentConfig.targetLevel}"]`
  );
  if (targetRadio) {
    targetRadio.checked = true;
  }

  renderRulesListInline();
}

function renderRulesListInline() {
  rulesList.innerHTML = "";

  const sorted = [...availableRules].sort((a, b) => {
    const levelOrder = { A: 1, AA: 2, AAA: 3 };
    const levelDiff = levelOrder[a.wcag.level] - levelOrder[b.wcag.level];
    if (levelDiff !== 0) return levelDiff;
    return a.id.localeCompare(b.id);
  });

  sorted.forEach((rule) => {
    const isEnabled = currentConfig.enabledRules[rule.id] !== false;

    const ruleItem = document.createElement("label");
    ruleItem.className = "rule-item";
    ruleItem.innerHTML = `
      <div class="rule-info">
        <div class="rule-name">${rule.description}</div>
        <div class="rule-meta">
          <span class="rule-id">${rule.id}</span>
          <span class="wcag-tag">WCAG ${rule.wcag.id} (${
      rule.wcag.level
    })</span>
        </div>
      </div>
      <label class="toggle-switch">
        <input type="checkbox" class="rule-toggle" data-rule-id="${rule.id}" ${
      isEnabled ? "checked" : ""
    } />
        <span class="toggle-slider"></span>
      </label>
    `;

    rulesList.appendChild(ruleItem);
  });
}

async function saveOptionsInline() {
  try {
    saveOptionsBtn.disabled = true;

    const targetLevel = document.querySelector(
      'input[name="target-level"]:checked'
    ).value;

    const enabledRules = {};
    document.querySelectorAll(".rule-toggle").forEach((checkbox) => {
      const ruleId = checkbox.dataset.ruleId;
      enabledRules[ruleId] = checkbox.checked;
    });

    currentConfig = { targetLevel, enabledRules };

    await chrome.storage.sync.set({ wcagConfig: currentConfig });

    console.log("[Popup Options] Config salva:", currentConfig);
    showToast("✅ Configurações salvas!");

    setTimeout(async () => {
      optionsView.classList.add("hidden");
      auditView.classList.remove("hidden");

      console.log("[Popup] Configurações salvas, rodando auditoria...");
      await runAudit();
    }, 500);
  } catch (error) {
    console.error("[Popup Options] Erro ao salvar:", error);
    showToast("❌ Erro ao salvar!");
  } finally {
    saveOptionsBtn.disabled = false;
  }
}

async function resetOptionsInline() {
  if (confirm("Deseja restaurar as configurações padrão?")) {
    currentConfig = { targetLevel: "AA", enabledRules: {} };

    availableRules.forEach((rule) => {
      currentConfig.enabledRules[rule.id] = true;
    });

    await chrome.storage.sync.set({ wcagConfig: currentConfig });
    updateOptionsUI();
    showToast("🔄 Configurações restauradas!");
  }
}

function enableAllRulesInline() {
  document.querySelectorAll(".rule-toggle").forEach((toggle) => {
    toggle.checked = true;
  });
}

function disableAllRulesInline() {
  document.querySelectorAll(".rule-toggle").forEach((toggle) => {
    toggle.checked = false;
  });
}

// ============================================
// EVENT LISTENERS
// ============================================

// Auditoria
runAuditBtn.addEventListener("click", runAudit);
highlightToggleBtn.addEventListener("click", toggleHighlight);

// 🆕 Export
exportJSONBtn.addEventListener("click", handleExportJSON);
exportCSVBtn.addEventListener("click", handleExportCSV);

// Filtros
document.querySelectorAll(".filter-chip").forEach((chip) => {
  chip.addEventListener("click", () => {
    const level = chip.dataset.level;
    chip.classList.toggle("active");

    if (chip.classList.contains("active")) {
      if (!activeFilters.levels.includes(level)) {
        activeFilters.levels.push(level);
      }
    } else {
      activeFilters.levels = activeFilters.levels.filter((l) => l !== level);
    }

    applyFilters();
  });
});

ruleFilter.addEventListener("change", (e) => {
  activeFilters.rule = e.target.value;
  applyFilters();
});

// Options
saveOptionsBtn.addEventListener("click", saveOptionsInline);
resetOptionsBtn.addEventListener("click", resetOptionsInline);
enableAllBtn.addEventListener("click", enableAllRulesInline);
disableAllBtn.addEventListener("click", disableAllRulesInline);

// Cleanup
window.addEventListener("unload", () => {
  if (highlightActive) {
    window.messaging.requestHighlight([]).catch(() => {});
  }
});

// ============================================
// TROCA DE TEMA - BOTÃOZINHO 🎨
// ============================================

// Abre / fecha o menu de temas
themeCurrentBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  themeOptions.classList.toggle("open");
});

// Clicar fora fecha o menu
document.addEventListener("click", () => {
  themeOptions.classList.remove("open");
});

// Aplicar tema
function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);

  // Atualiza visual do botão principal
  themeCurrentBtn.style.background = "var(--primary-color)";

  // Salva no storage
  chrome.storage.sync.set({ theme });
}

// Clicar numa opção aplica e fecha
themeOptionBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    const theme = btn.dataset.theme;
    applyTheme(theme);
    themeOptions.classList.remove("open");
  });
});

// Carregar tema salvo ao abrir popup
chrome.storage.sync.get(["theme"], ({ theme }) => {
  const selected = theme || "pink";
  applyTheme(selected);
});

console.log("[Popup] Popup carregado com options inline + export! ✨📊");
