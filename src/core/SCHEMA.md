# Schema de Resultado - Contrato Único

Este documento define o **contrato padrão** para resultados de auditoria WCAG.

## Objetivo

Garantir que todas as regras retornem dados em formato consistente, facilitando:
- Renderização no popup
- Exportação (JSON/CSV)
- Filtragem e agregação
- Manutenção e extensibilidade

---

## Schema Completo

```typescript
interface ViolationResult {
  ruleId: string;              // Identificador único da regra
  wcag: {
    id: string;                // Critério WCAG (ex: '1.1.1', '2.4.2')
    level: 'A' | 'AA' | 'AAA'; // Nível de conformidade
  };
  severity: 'error' | 'warn';  // Severidade da violação
  description: string;         // Descrição clara em português
  nodes: ViolationNode[];      // Elementos que violam a regra
}

interface ViolationNode {
  selector: string;  // Seletor CSS único do elemento
  snippet: string;   // HTML snippet (truncado em ~200 chars)
  help: string;      // Dica de correção específica
}
```

---

## Exemplo Real

```javascript
{
  ruleId: 'img-alt',
  wcag: { 
    id: '1.1.1', 
    level: 'A' 
  },
  severity: 'error',
  description: 'Imagens devem possuir texto alternativo (atributo alt)',
  nodes: [
    {
      selector: 'img.logo',
      snippet: '<img class="logo" src="/logo.png">',
      help: 'Adicione o atributo alt com uma descrição da imagem. Use alt="" apenas para imagens decorativas.'
    },
    {
      selector: 'img#hero',
      snippet: '<img id="hero" src="/banner.jpg" alt="">',
      help: 'O atributo alt está vazio. Se a imagem não é decorativa, adicione uma descrição adequada.'
    }
  ]
}
```

---

## Campos Obrigatórios

| Campo | Tipo | Descrição | Exemplo |
|-------|------|-----------|---------|
| `ruleId` | string | ID único da regra (kebab-case) | `'img-alt'`, `'contrast-AA'` |
| `wcag.id` | string | Critério WCAG | `'1.1.1'`, `'1.4.3'` |
| `wcag.level` | string | Nível de conformidade | `'A'`, `'AA'`, `'AAA'` |
| `severity` | string | Gravidade | `'error'`, `'warn'` |
| `description` | string | Descrição clara da violação | `'Imagens devem...'` |
| `nodes` | array | Lista de elementos infratores | `[{...}, {...}]` |
| `nodes[].selector` | string | Seletor CSS | `'img.logo'`, `'#main-nav'` |
| `nodes[].snippet` | string | HTML do elemento | `'<img src="...">'` |
| `nodes[].help` | string | Dica de correção | `'Adicione o atributo...'` |

---

## Normalização Automática

O `AuditRunner.normalizeResult()` garante:

1. **Validação de estrutura**: Verifica se `nodes` é array
2. **Valores padrão**: Preenche campos ausentes com defaults
3. **Truncamento**: Limita snippet a 200 caracteres
4. **Sanitização**: Remove valores `null`/`undefined`
5. **Logs de aviso**: Alerta sobre dados malformados

### Exemplo de Normalização

**Entrada (regra retorna):**
```javascript
{
  nodes: [
    { 
      selector: 'img',
      snippet: '<img src="..." class="very-long-element-with-many-attributes-that-goes-on-and-on...">'
      // 'help' ausente
    }
  ]
}
```

**Saída (normalizada):**
```javascript
{
  ruleId: 'img-alt',
  wcag: { id: '1.1.1', level: 'A' },
  severity: 'error',
  description: 'Imagens devem possuir texto alternativo',
  nodes: [{
    selector: 'img',
    snippet: '<img src="..." class="very-long-element-with-many-attributes-that-goes-on-and-on...', // truncado
    help: 'Corrija este elemento conforme as diretrizes WCAG' // default
  }]
}
```

---

## Quando Usar `error` vs `warn`

### 🔴 `error` (Erro)
Violação **inequívoca** das WCAG:
- Imagem sem `alt`
- Contraste abaixo do mínimo
- Campo sem `<label>`
- `<html>` sem `lang`

### 🟡 `warn` (Aviso)
Situações **potencialmente** problemáticas:
- Link com texto pouco descritivo ("clique aqui")
- Imagem com `alt` muito longo (> 150 chars)
- Uso de `tabindex` positivo
- Heading fora de ordem (h1 → h3)

---

## Funções Utilitárias

O `content.js` fornece helpers para gerar `selector` e `snippet`:

```javascript
// Gera seletor CSS único
const selector = window.wcagUtils.getSelector(element);
// Resultado: '#main-nav' ou 'nav.primary' ou 'nav'

// Gera snippet HTML truncado
const snippet = window.wcagUtils.getSnippet(element);
// Resultado: '<nav class="primary"><ul>...</ul></nav>'
```

---

## Validação no Código

### Na Regra (recomendado)

```javascript
async function check(document) {
  const violations = [];
  
  // ... lógica de verificação ...
  
  // Sempre retornar objeto com 'nodes'
  return { nodes: violations };
}
```

### No Audit Runner (automático)

```javascript
const normalizedViolation = this.normalizeResult(id, rule, result);

if (!normalizedViolation) {
  console.warn(`Regra ${id} retornou resultado inválido`);
  continue;
}

violations.push(normalizedViolation);
```

---

## Checklist para Criar Regra

- [ ] Define `ruleId` único
- [ ] Especifica `wcag.id` e `wcag.level`
- [ ] Escolhe `severity` adequada
- [ ] Escreve `description` clara
- [ ] Função `check()` retorna `{ nodes: [...] }`
- [ ] Cada `node` tem `selector`, `snippet`, `help`
- [ ] Usa `window.wcagUtils` para gerar seletor/snippet
- [ ] Testa com diferentes elementos e edge cases

---

## Benefícios do Schema Único

✅ **Consistência**: Todos os dados no mesmo formato  
✅ **Extensibilidade**: Adicionar campos sem quebrar código  
✅ **Debugabilidade**: Logs e erros padronizados  
✅ **Testabilidade**: Assertions uniformes  
✅ **Manutenibilidade**: Mudanças centralizadas

---

## Referências

- [WCAG 2.2 Quick Reference](https://www.w3.org/WAI/WCAG22/quickref/)
- [src/rules/README.md](../rules/README.md) - Guia de criação de regras
- [src/rules/TEMPLATE.js](../rules/TEMPLATE.js) - Template de regra
