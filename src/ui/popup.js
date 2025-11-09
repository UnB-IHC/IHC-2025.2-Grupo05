/**
 * Popup Script - Lógica da interface do popup
 */

// Elementos do DOM
const runAuditBtn = document.getElementById('run-audit');
const loadingSection = document.getElementById('loading');
const resultsSection = document.getElementById('results');
const violationsList = document.getElementById('violations-list');
const noViolations = document.getElementById('no-violations');
const errorCount = document.getElementById('error-count');
const warningCount = document.getElementById('warning-count');

/**
 * Executa a auditoria na página atual
 */
async function runAudit() {
  try {
    // Mostra loading
    loadingSection.classList.remove('hidden');
    resultsSection.classList.add('hidden');
    runAuditBtn.disabled = true;

    console.log('[Popup] Solicitando auditoria...');

    // Solicita auditoria
    const response = await window.messaging.requestAudit();

    console.log('[Popup] Resposta recebida:', response);

    if (response && response.success) {
      console.log(`[Popup] ${response.totalViolations || 0} violações encontradas`);
      displayResults(response.violations, response);
    } else {
      showError('Erro ao executar auditoria: ' + (response?.error || 'Sem resposta do content script'));
    }
  } catch (error) {
    console.error('[Popup] Erro:', error);
    showError('Erro ao comunicar com a página: ' + error.message);
  } finally {
    loadingSection.classList.add('hidden');
    runAuditBtn.disabled = false;
  }
}

/**
 * Exibe os resultados da auditoria
 * @param {Array} violations - Lista de violações (schema normalizado)
 * @param {Object} metadata - Metadados da auditoria (url, timestamp, etc)
 */
function displayResults(violations, metadata = {}) {
  resultsSection.classList.remove('hidden');
  
  if (!violations || violations.length === 0) {
    // Nenhuma violação
    violationsList.innerHTML = '';
    noViolations.classList.remove('hidden');
    errorCount.textContent = '0';
    warningCount.textContent = '0';
    
    console.log('[Popup] Nenhuma violação encontrada! ✅');
    return;
  }

  // Há violações
  noViolations.classList.add('hidden');
  
  // Conta erros e avisos
  let errors = 0;
  let warnings = 0;
  
  violations.forEach(v => {
    if (v.severity === 'error') {
      errors += v.nodes.length;
    } else if (v.severity === 'warn') {
      warnings += v.nodes.length;
    }
  });
  
  errorCount.textContent = errors;
  warningCount.textContent = warnings;
  
  console.log(`[Popup] Exibindo: ${errors} erros, ${warnings} avisos`);
  
  // Renderiza lista de violações
  renderViolations(violations);
}

/**
 * Renderiza lista de violações no DOM
 * @param {Array} violations - Lista de violações
 */
function renderViolations(violations) {
  violationsList.innerHTML = '';
  
  violations.forEach((violation, index) => {
    const violationEl = document.createElement('div');
    violationEl.className = 'violation';
    
    const headerEl = document.createElement('div');
    headerEl.className = 'violation-header';
    headerEl.innerHTML = `
      <div class="violation-title">
        <span class="severity-badge severity-${violation.severity}">${violation.severity}</span>
        <strong>${violation.description}</strong>
      </div>
      <div class="violation-meta">
        <span class="wcag-tag">WCAG ${violation.wcag.id} (${violation.wcag.level})</span>
        <span class="node-count">${violation.nodes.length} ocorrência(s)</span>
      </div>
    `;
    
    violationEl.appendChild(headerEl);
    
    // Lista de nós com violação
    const nodesEl = document.createElement('div');
    nodesEl.className = 'violation-nodes';
    
    violation.nodes.forEach((node, nodeIndex) => {
      const nodeEl = document.createElement('div');
      nodeEl.className = 'violation-node';
      nodeEl.innerHTML = `
        <div class="node-info">
          <code class="selector">${escapeHtml(node.selector)}</code>
          <pre class="snippet">${escapeHtml(node.snippet)}</pre>
        </div>
        <div class="node-help">${escapeHtml(node.help)}</div>
      `;
      nodesEl.appendChild(nodeEl);
    });
    
    violationEl.appendChild(nodesEl);
    violationsList.appendChild(violationEl);
  });
}

/**
 * Exibe mensagem de erro
 * @param {string} message - Mensagem de erro
 */
function showError(message) {
  resultsSection.classList.remove('hidden');
  noViolations.classList.add('hidden');
  violationsList.innerHTML = `
    <div class="error-message">
      <span class="icon">⚠️</span>
      <p>${escapeHtml(message)}</p>
    </div>
  `;
}

/**
 * Escapa HTML para prevenir XSS
 * @param {string} text - Texto a escapar
 * @returns {string} Texto escapado
 */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Event listeners
runAuditBtn.addEventListener('click', runAudit);

// Inicialização
console.log('Popup carregado');
