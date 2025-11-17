// src/core/export.js
// Módulo de exportação JSON/CSV para WCAG Auditor

/**
 * Converte resultados da auditoria para formato JSON
 * @param {Array} results - Array de resultados da auditoria
 * @param {Object} metadata - Metadados da auditoria (url, timestamp, etc)
 * @returns {string} JSON formatado
 */
export function toJSON(results, metadata = {}) {
  const exportData = {
    metadata: {
      url: metadata.url || window.location.href,
      title: metadata.title || document.title,
      timestamp: new Date().toISOString(),
      totalIssues: results.length,
      userAgent: navigator.userAgent,
      targetLevel: metadata.targetLevel || "AA",
      ...metadata,
    },
    results: results.map((result) => ({
      rule: result.rule,
      wcag: result.wcag,
      level: result.level,
      severity: result.severity,
      selector: result.selector,
      snippet: result.snippet,
      message: result.message,
      helpUrl: result.helpUrl || "",
    })),
  };

  return JSON.stringify(exportData, null, 2);
}

/**
 * Converte resultados da auditoria para formato CSV
 * @param {Array} results - Array de resultados da auditoria
 * @returns {string} CSV formatado
 */
export function toCSV(results) {
  // Cabeçalho do CSV
  const headers = [
    "Regra",
    "WCAG",
    "Nível",
    "Severidade",
    "Seletor",
    "Snippet",
    "Mensagem",
    "URL de Ajuda",
    "Ocorrências",
  ];

  // Função auxiliar para escapar valores CSV
  const escapeCSV = (value) => {
    if (value === null || value === undefined) return "";
    const str = String(value);
    // Se contém vírgula, aspas ou quebra de linha, envolve em aspas
    if (str.includes(",") || str.includes('"') || str.includes("\n")) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  // Monta as linhas
  const rows = results.map((result) => [
    escapeCSV(result.rule),
    escapeCSV(result.wcag),
    escapeCSV(result.level),
    escapeCSV(result.severity),
    escapeCSV(result.selector),
    escapeCSV(result.snippet),
    escapeCSV(result.message),
    escapeCSV(result.helpUrl),
    escapeCSV(result.occurrences || 1),
  ]);

  // Combina cabeçalho e linhas
  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.join(",")),
  ].join("\n");

  return csvContent;
}

/**
 * Baixa arquivo no navegador
 * @param {string} content - Conteúdo do arquivo
 * @param {string} filename - Nome do arquivo
 * @param {string} mimeType - Tipo MIME
 */
export function downloadFile(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  link.style.display = "none";

  document.body.appendChild(link);
  link.click();

  // Limpa
  setTimeout(() => {
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, 100);
}

/**
 * Exporta resultados em JSON
 * @param {Array} results - Resultados da auditoria
 * @param {Object} metadata - Metadados opcionais
 */
export function exportJSON(results, metadata = {}) {
  const jsonContent = JSON.stringify(
    {
      metadata,
      results,
    },
    null,
    2
  );

  const timestamp = new Date().toISOString().replace(/:/g, "-").split(".")[0];
  const filename = `wcag-audit-${timestamp}.json`;

  downloadFile(jsonContent, filename, "application/json");
}

/**
 * Exporta resultados em CSV
 * @param {Array} results - Resultados da auditoria
 */
export function exportCSV(results) {
  const csvContent = toCSV(results);
  const timestamp = new Date().toISOString().replace(/:/g, "-").split(".")[0];
  const filename = `wcag-audit-${timestamp}.csv`;

  // UTF-8 BOM para Excel reconhecer acentuação corretamente
  const BOM = "\uFEFF";
  downloadFile(BOM + csvContent, filename, "text/csv;charset=utf-8;");
}

/**
 * Gera estatísticas dos resultados
 * @param {Array} results - Resultados da auditoria
 * @returns {Object} Estatísticas
 */
export function getStatistics(results) {
  const stats = {
    total: results.length,
    byLevel: { A: 0, AA: 0, AAA: 0 },
    bySeverity: { critical: 0, serious: 0, moderate: 0, minor: 0 },
    byRule: {},
  };

  results.forEach((result) => {
    // Por nível WCAG
    if (result.level) {
      stats.byLevel[result.level] = (stats.byLevel[result.level] || 0) + 1;
    }

    // Por severidade
    if (result.severity) {
      stats.bySeverity[result.severity] =
        (stats.bySeverity[result.severity] || 0) + 1;
    }

    // Por regra
    if (result.rule) {
      stats.byRule[result.rule] = (stats.byRule[result.rule] || 0) + 1;
    }
  });

  return stats;
}
