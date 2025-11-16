/**
 * Popup Script - T7 Complete
 * Lógica completa: KPIs por nível WCAG, filtros, expand/collapse, copy to clipboard
 */

// Elementos do DOM
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

// KPI elements
const levelAErrors = document.getElementById("level-a-errors");
const levelAWarnings = document.getElementById("level-a-warnings");
const levelAAErrors = document.getElementById("level-aa-errors");
const levelAAWarnings = document.getElementById("level-aa-warnings");
const levelAAAErrors = document.getElementById("level-aaa-errors");
const levelAAAWarnings = document.getElementById("level-aaa-warnings");

// Estado
let highlightActive = false;
let currentViolations = [];
let allViolations = []; // Guarda todas as violações originais
let activeFilters = {
  levels: ["A", "AA", "AAA"],
  rule: "all",
};

/**
 * Executa a auditoria na página atual
 */
async function runAudit() {
  try {
    loadingSection.classList.remove("hidden");
    resultsSection.classList.add("hidden");
    runAuditBtn.disabled = true;

    console.log("[Popup] Solicitando auditoria...");

    const response = await window.messaging.requestAudit();

    console.log("[Popup] Resposta recebida:", response);

    if (response && response.success) {
      console.log(
        `[Popup] ${response.totalViolations || 0} violações encontradas`
      );
      allViolations = response.violations || [];
      currentViolations = [...allViolations];

      // Popula filtro de regras
      populateRuleFilter(allViolations);

      // Reseta filtros
      resetFilters();

      // Exibe resultados
      displayResults(currentViolations);

      if (currentViolations.length > 0) {
        highlightToggleBtn.classList.remove("hidden");
        highlightToggleBtn.disabled = false;
      }
    } else {
      showError(
        "Erro ao executar auditoria: " +
          (response?.error || "Sem resposta do content script")
      );
    }
  } catch (error) {
    console.error("[Popup] Erro:", error);
    showError("Erro ao comunicar com a página: " + error.message);
  } finally {
    loadingSection.classList.add("hidden");
    runAuditBtn.disabled = false;
  }
}

/**
 * Exibe os resultados da auditoria
 */
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

  // Atualiza KPIs
  updateKPIs(violations);

  // Renderiza violações agrupadas
  renderViolationsGrouped(violations);
}

/**
 * Atualiza KPIs por nível WCAG
 */
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

  // Atualiza DOM
  levelAErrors.textContent = stats.A.errors;
  levelAWarnings.textContent = stats.A.warnings;
  levelAAErrors.textContent = stats.AA.errors;
  levelAAWarnings.textContent = stats.AA.warnings;
  levelAAAErrors.textContent = stats.AAA.errors;
  levelAAAWarnings.textContent = stats.AAA.warnings;
}

/**
 * Popula o select de filtro de regras
 */
function populateRuleFilter(violations) {
  // Extrai regras únicas
  const rules = new Set();
  violations.forEach((v) => rules.add(v.ruleId));

  // Limpa e popula select
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

/**
 * Renderiza violações agrupadas por regra com expand/collapse
 */
function renderViolationsGrouped(violations) {
  violationsList.innerHTML = "";

  if (violations.length === 0) {
    noResultsFilter.classList.remove("hidden");
    return;
  }

  // Agrupa por ruleId
  const grouped = {};
  violations.forEach((violation) => {
    if (!grouped[violation.ruleId]) {
      grouped[violation.ruleId] = {
        ...violation,
        allNodes: [],
      };
    }
    grouped[violation.ruleId].allNodes.push(...violation.nodes);
  });

  // Renderiza cada grupo
  Object.values(grouped).forEach((violation, index) => {
    const groupEl = document.createElement("div");
    groupEl.className = "violation-group";
    groupEl.dataset.ruleId = violation.ruleId;

    // Header do grupo (clicável)
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

    // Toggle expand/collapse
    headerEl.addEventListener("click", () => {
      groupEl.classList.toggle("expanded");
    });

    groupEl.appendChild(headerEl);

    // Nós do grupo
    const nodesEl = document.createElement("div");
    nodesEl.className = "violation-nodes";

    violation.allNodes.forEach((node, nodeIndex) => {
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

  // Adiciona event listeners para botões de copiar
  setupCopyButtons();
}

/**
 * Configura event listeners dos botões de copiar
 */
function setupCopyButtons() {
  // Copiar seletor
  document.querySelectorAll(".copy-selector").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const selector = btn.dataset.selector;
      copyToClipboard(selector, "Seletor copiado!");
    });
  });

  // Copiar snippet
  document.querySelectorAll(".copy-snippet").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const snippet = btn.dataset.snippet;
      copyToClipboard(snippet, "Código copiado!");
    });
  });
}

/**
 * Copia texto para clipboard e mostra toast
 */
async function copyToClipboard(text, message = "Copiado!") {
  try {
    await navigator.clipboard.writeText(text);
    showToast(message);
  } catch (error) {
    console.error("[Popup] Erro ao copiar:", error);
    showToast("Erro ao copiar!");
  }
}

/**
 * Mostra toast de feedback
 */
function showToast(message) {
  const toastMessage = toast.querySelector(".toast-message");
  toastMessage.textContent = message;

  toast.classList.remove("hidden");

  setTimeout(() => {
    toast.classList.add("hidden");
  }, 2000);
}

/**
 * Aplica filtros às violações
 */
function applyFilters() {
  let filtered = [...allViolations];

  // Filtro por nível WCAG
  filtered = filtered.filter((v) =>
    activeFilters.levels.includes(v.wcag.level)
  );

  // Filtro por regra
  if (activeFilters.rule !== "all") {
    filtered = filtered.filter((v) => v.ruleId === activeFilters.rule);
  }

  currentViolations = filtered;
  displayResults(filtered);
}

/**
 * Reseta filtros para estado inicial
 */
function resetFilters() {
  activeFilters = {
    levels: ["A", "AA", "AAA"],
    rule: "all",
  };

  // Atualiza UI dos chips
  document.querySelectorAll(".filter-chip").forEach((chip) => {
    chip.classList.add("active");
  });

  ruleFilter.value = "all";
}

/**
 * Alterna o destaque de violações na página
 */
async function toggleHighlight() {
  try {
    if (highlightActive) {
      await window.messaging.requestHighlight([]);
      highlightActive = false;
      highlightText.textContent = "Destacar Violações";
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
        highlightText.textContent = "Ocultar Destaques";
        highlightToggleBtn.classList.add("active");
      }
    }
  } catch (error) {
    console.error("[Popup] Erro ao alternar destaque:", error);
    showError("Erro ao destacar elementos: " + error.message);
  }
}

/**
 * Exibe mensagem de erro
 */
function showError(message) {
  resultsSection.classList.remove("hidden");
  noViolations.classList.add("hidden");
  violationsList.innerHTML = `
    <div class="error-message" style="text-align: center; padding: 24px; color: var(--error-color);">
      <span style="font-size: 36px; display: block; margin-bottom: 12px;">⚠️</span>
      <p>${escapeHtml(message)}</p>
    </div>
  `;
}

/**
 * Escapa HTML para prevenir XSS
 */
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// Event Listeners

// Botão de auditoria
runAuditBtn.addEventListener("click", runAudit);

// Botão de destaque
highlightToggleBtn.addEventListener("click", toggleHighlight);

// Filtros de nível WCAG (chips)
document.querySelectorAll(".filter-chip").forEach((chip) => {
  chip.addEventListener("click", () => {
    const level = chip.dataset.level;

    // Toggle chip
    chip.classList.toggle("active");

    // Atualiza filtros ativos
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

// Filtro de regra (select)
ruleFilter.addEventListener("change", (e) => {
  activeFilters.rule = e.target.value;
  applyFilters();
});

// Desabilita destaque ao fechar popup
window.addEventListener("unload", () => {
  if (highlightActive) {
    window.messaging.requestHighlight([]).catch(() => {});
  }
});

// Log de inicialização
console.log("[Popup] Popup T7 carregado - KPIs, filtros e clipboard ready! ✨");
