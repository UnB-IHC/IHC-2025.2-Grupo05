# Regras WCAG

Esta pasta contém as regras de auditoria de acessibilidade WCAG.

## Schema Padrão de Resultado

Todas as regras **DEVEM** retornar resultados que sigam este schema:

```javascript
{
  ruleId: string,              // Ex: 'img-alt', 'page-title', 'contrast-AA'
  wcag: {
    id: string,                // Ex: '1.1.1', '2.4.2', '1.4.3'
    level: string              // 'A', 'AA' ou 'AAA'
  },
  severity: string,            // 'error' ou 'warn'
  description: string,         // Descrição clara da violação em português
  nodes: [{
    selector: string,          // Seletor CSS único do elemento
    snippet: string,           // HTML snippet (truncado em ~200 chars)
    help: string              // Dica específica de como corrigir
  }]
}
```

## Estrutura de uma Regra

Cada regra é um arquivo JavaScript independente que:

1. **Define metadados** (WCAG, severidade, descrição)
2. **Implementa função `check(document)`** que retorna `{ nodes: [...] }`
3. **Registra-se no `auditRunner`** global

### Exemplo Mínimo

```javascript
(function() {
  'use strict';

  const RULE_ID = 'page-title';

  async function check(document) {
    const violations = [];
    const title = document.querySelector('title');
    
    if (!title || !title.textContent.trim()) {
      violations.push({
        selector: 'head',
        snippet: '<title></title>',
        help: 'Adicione um elemento <title> descritivo dentro do <head>'
      });
    }
    
    return { nodes: violations };
  }

  auditRunner.register(RULE_ID, {
    wcag: { id: '2.4.2', level: 'A' },
    severity: 'error',
    description: 'A página deve ter um título descritivo',
    check
  });
})();
```

## Utilitários Disponíveis

O `content.js` expõe utilitários em `window.wcagUtils`:

- **`getSelector(element)`**: Gera seletor CSS único
- **`getSnippet(element)`**: Gera HTML snippet truncado

### Uso:

```javascript
violations.push({
  selector: window.wcagUtils.getSelector(img),
  snippet: window.wcagUtils.getSnippet(img),
  help: 'Sua dica aqui'
});
```

## Boas Práticas

### ✅ Fazer

- Usar mensagens claras e acionáveis em português
- Fornecer dicas específicas no campo `help`
- Testar com diferentes tipos de elementos
- Usar `async/await` se necessário
- Validar existência antes de acessar propriedades
- Usar IIFE para evitar poluir escopo global

### ❌ Evitar

- Mensagens genéricas ("corrija isso")
- Travar execução com loops infinitos
- Acessar propriedades sem validação
- Depender de bibliotecas externas
- Criar variáveis globais

## Carregar Regras

Para carregar regras no `manifest.json`, adicione ao `content_scripts`:

```json
"content_scripts": [{
  "matches": ["<all_urls>"],
  "js": [
    "content.js",
    "src/rules/page-title.js",
    "src/rules/img-alt.js",
    "src/rules/lang-html.js"
  ],
  "run_at": "document_idle"
}]
```

## Regras Planejadas

Consulte o roadmap no README principal para ver:
- Lote 0: Regras base (page-title, lang-html, img-alt, link-name)
- Lote 1: Semântica e formulários
- Lote 2: Navegação e teclado
- Lote 3: Percepção e estrutura

## Template

Use o arquivo `TEMPLATE.js` como base para criar novas regras.

## Referências

- [WCAG 2.2](https://www.w3.org/WAI/WCAG22/quickref/)
- [Técnicas WCAG](https://www.w3.org/WAI/WCAG22/Techniques/)
- [Checklist Design](../../docs/design/design.md)
