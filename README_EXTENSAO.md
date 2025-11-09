# 🔍 WCAG Auditor - Extensão Chrome

> **Auditoria automática de acessibilidade web baseada nas diretrizes WCAG 2.2**

Extensão Chrome que identifica violações de acessibilidade em tempo real, ajudando desenvolvedores e designers a criar sites mais inclusivos.

[![WCAG 2.2](https://img.shields.io/badge/WCAG-2.2-blue.svg)](https://www.w3.org/WAI/WCAG22/quickref/)
[![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-green.svg)](https://developer.chrome.com/docs/extensions/)
[![License](https://img.shields.io/badge/license-MIT-orange.svg)](LICENSE.md)

---

## 👥 Integrantes do Grupo 05

- **Euller Henrique** - Motor de auditoria, regras base (lote 0) e overlay de destaque
- **Ana Carolina** - UI/UX do popup, Options page e exportação de relatórios
- **Kauã Vinícius** - Regras avançadas (lotes 1-3), testes e validação

**Instituição:** Universidade de Brasília (UnB)  
**Disciplina:** Interação Humano-Computador (IHC) - 2025.2  
**Repositório:** [UnB-IHC/IHC-2025.2-Grupo05](https://github.com/UnB-IHC/IHC-2025.2-Grupo05)

---

## 📋 Sobre o Projeto

Esta extensão Chrome detecta **automaticamente** violações de acessibilidade em páginas web, seguindo as diretrizes **WCAG 2.2** (níveis A, AA e AAA). 

### 🎯 Funcionalidades Implementadas

- ✅ **Auditoria automática** de páginas web via botão no popup
- ✅ **Identificação de violações WCAG** com severidade (erro/aviso)
- ✅ **Destaque visual** de elementos problemáticos (overlay acessível)
- ✅ **Relatório detalhado** com seletores CSS, snippets HTML e dicas de correção
- ✅ **Navegação por teclado** entre elementos destacados
- ✅ **4 regras base implementadas** (lote 0)
- 🚧 Exportação em JSON/CSV (em desenvolvimento)
- 🚧 Configuração por regra (em desenvolvimento)

## 🚀 Como Instalar

### Pré-requisitos

- **Google Chrome** versão 88+ ou navegador baseado em Chromium (Edge, Brave, Opera)
- **Git** instalado (para clonar o repositório)

### Instalação em 3 Passos

#### 1️⃣ Clone o Repositório

```bash
git clone https://github.com/UnB-IHC/IHC-2025.2-Grupo05.git
cd IHC-2025.2-Grupo05
git checkout extensao
```

#### 2️⃣ (Opcional) Crie Ícones Temporários

Para testes, você pode criar ícones simples ou usar placeholders:

- Crie 3 arquivos PNG na pasta `/icons`:
  - `icon16.png` (16×16 px)
  - `icon48.png` (48×48 px)
  - `icon128.png` (128×128 px)
- Ou use qualquer imagem quadrada (a extensão funcionará sem ícones, apenas sem logo)

#### 3️⃣ Carregue no Chrome

1. Abra o Chrome e acesse: **`chrome://extensions/`**
2. Ative o **"Modo do desenvolvedor"** (toggle no canto superior direito)
3. Clique em **"Carregar sem compactação"**
4. Selecione a **pasta raiz do projeto** (`IHC-2025.2-Grupo05`)
5. ✅ A extensão aparecerá na lista com o nome **"WCAG Auditor"**
6. Fixe o ícone na barra de ferramentas (clique no ícone de quebra-cabeça → pin)

---

## 🔍 Como Auditar uma Página

### Passo a Passo

1. **Navegue até a página** que deseja auditar (qualquer site)
2. **Clique no ícone da extensão** (🔍) na barra de ferramentas
3. **Clique no botão "Auditar Página"**
4. **Aguarde** (1-3 segundos) enquanto a auditoria é executada
5. **Visualize os resultados** no popup:
   - 📊 **Resumo**: Contadores de erros (vermelho) e avisos (laranja)
   - 📋 **Lista de violações**: Expandida com detalhes por regra
   - 🎯 **Destaque**: Botão para destacar elementos na página

### Destaque Visual de Violações

Após auditar, clique em **"Destacar Violações"** para:
- ✨ Ver **outlines vermelhos** ao redor dos elementos problemáticos
- 🏷️ Visualizar **badges** com o ID da regra violada
- 🎯 **Scroll automático** até o primeiro elemento
- ⌨️ **Navegar por teclado** (Tab) entre elementos destacados
- 🔄 Clicar novamente para **ocultar** os destaques

### Interpretando os Resultados

Cada violação mostra:
- **Regra WCAG**: Critério e nível (ex: 1.1.1 - Nível A)
- **Descrição**: Explicação clara do problema
- **Seletor CSS**: Identificador único do elemento
- **Snippet HTML**: Trecho do código problemático
- **Dica de correção**: Como resolver o problema

---

## 📊 Regras Implementadas (Lote 0)

### ✅ 4 Regras Base - WCAG 2.2 Nível A

| ID | Regra | WCAG | Nível | O que Verifica |
|----|-------|------|-------|----------------|
| `page-title` | Título da Página | 2.4.2 | A | `<title>` existe e não está vazio |
| `lang-html` | Idioma da Página | 3.1.1 | A | `<html lang="...">` válido (ISO 639-1) |
| `img-alt` | Texto Alternativo | 1.1.1 | A | `<img>` tem `alt` adequado (não vazio, não genérico) |
| `link-name` | Nome de Link | 2.4.4 | A | `<a>` tem texto descritivo (não "clique aqui") |

### � Detalhes das Regras

#### 1. `page-title` - Título da Página (WCAG 2.4.2)
**O que detecta:**
- ✗ Página sem `<title>`
- ✗ `<title>` vazio ou com menos de 3 caracteres

**Exemplo de violação:**
```html
<title></title>
<!-- ou -->
<title>   </title>
```

**Como corrigir:**
```html
<title>Universidade de Brasília - Página Inicial</title>
```

---

#### 2. `lang-html` - Idioma da Página (WCAG 3.1.1)
**O que detecta:**
- ✗ `<html>` sem atributo `lang`
- ✗ `lang` vazio ou inválido

**Exemplo de violação:**
```html
<html>
<!-- ou -->
<html lang="">
<!-- ou -->
<html lang="xyz">
```

**Como corrigir:**
```html
<html lang="pt-BR">  <!-- Português brasileiro -->
<html lang="en">     <!-- Inglês -->
<html lang="es">     <!-- Espanhol -->
```

---

#### 3. `img-alt` - Texto Alternativo (WCAG 1.1.1)
**O que detecta:**
- ✗ `<img>` sem atributo `alt`
- ✗ `alt` vazio sem `role="presentation"`
- ✗ `alt` genérico ("imagem", "foto", nome do arquivo)
- ✗ `alt` muito longo (>150 caracteres)

**Exemplo de violação:**
```html
<img src="logo.png">
<img src="banner.jpg" alt="">
<img src="produto.jpg" alt="imagem">
```

**Como corrigir:**
```html
<img src="logo.png" alt="Logo da Universidade de Brasília">
<img src="banner.jpg" alt="" role="presentation">  <!-- se decorativa -->
<img src="produto.jpg" alt="Notebook Dell Inspiron 15 polegadas">
```

---

#### 4. `link-name` - Nome de Link (WCAG 2.4.4)
**O que detecta:**
- ✗ `<a>` sem texto ou `aria-label`
- ✗ Texto muito curto (≤2 caracteres)
- ✗ Texto genérico ("clique aqui", "saiba mais", "aqui")
- ✗ Texto é apenas a URL

**Exemplo de violação:**
```html
<a href="/contato"></a>
<a href="/sobre">Clique aqui</a>
<a href="/docs">Saiba mais</a>
```

**Como corrigir:**
```html
<a href="/contato">Entre em contato conosco</a>
<a href="/sobre">Conheça a história da UnB</a>
<a href="/docs">Leia a documentação completa</a>
```

---

## 🚧 Roadmap - Próximas Regras

### Lote 1 (Semântica/Formulários) - Em desenvolvimento
- `form-label-for` (WCAG 1.3.1 A) - Inputs com `<label for>`
- `button-role` (WCAG 4.1.2 A) - Elementos clicáveis sem papel adequado
- `duplicate-id` (WCAG 4.1.1 A) - IDs duplicados no DOM
- `iframe-title` (WCAG 2.4.1 A) - `<iframe>` com `title`

### Lote 2 (Navegação/Teclado) - Em desenvolvimento
- `focus-visible` (WCAG 2.4.7 AA) - Indicador de foco visível
- `tabindex-positive` (WCAG 2.4.3 A) - Evitar `tabindex > 0`
- `clickable-nonfocusable` (WCAG 2.1.1 A) - Elementos clicáveis não focáveis

### Lote 3 (Percepção/Estrutura) - Em desenvolvimento
- `contrast-AA` (WCAG 1.4.3 AA) - Contraste de cores
- `heading-order` (WCAG 1.3.1 A) - Hierarquia de headings

## 🛠️ Arquitetura Técnica

### Estrutura de Arquivos

```
/
├── manifest.json              # Configuração da extensão (MV3)
├── service-worker.js          # Background script (gerencia mensagens)
├── content.js                 # Content script (motor + overlay)
├── /src
│   ├── /core
│   │   ├── audit-runner.js    # Motor de auditoria (documentação)
│   │   ├── messaging.js       # Comunicação entre componentes
│   │   ├── contrast.js        # Cálculo de contraste de cores
│   │   └── SCHEMA.md          # Especificação do contrato de resultados
│   ├── /rules                 # Regras WCAG (uma por arquivo)
│   │   ├── README.md          # Guia de criação de regras
│   │   ├── TEMPLATE.js        # Template para novas regras
│   │   ├── page-title.js      # ✅ Implementada
│   │   ├── lang-html.js       # ✅ Implementada
│   │   ├── img-alt.js         # ✅ Implementada
│   │   └── link-name.js       # ✅ Implementada
│   └── /ui
│       ├── popup.html         # Interface do popup
│       ├── popup.js           # Lógica do popup + highlight
│       └── popup.css          # Estilos do popup
└── /icons                     # Ícones da extensão (16, 48, 128px)
```

### Fluxo de Comunicação

```
┌──────────┐         ┌────────────────┐         ┌─────────────┐
│  Popup   │ ◄─────► │ Service Worker │ ◄─────► │   Content   │
│ (popup.js)│         │ (background)   │         │ (content.js)│
└──────────┘         └────────────────┘         └─────────────┘
     │                                                   │
     │ 1. requestAudit()                                │
     │ ─────────────────────────────────────────────►  │
     │                                                   │
     │                                 2. runAudit()    │
     │                        ┌──────────────────────┐  │
     │                        │ AuditRunner.run()    │  │
     │                        │ - Executa regras     │  │
     │                        │ - Normaliza results  │  │
     │                        └──────────────────────┘  │
     │                                                   │
     │  ◄───────────────────────────────────────────────│
     │ 3. { violations: [...] }                         │
     │                                                   │
     │ 4. displayResults()                              │
     │ 5. requestHighlight()                            │
     │ ─────────────────────────────────────────────►  │
     │                                                   │
     │                        6. highlightNodes()       │
     │                           - Aplica CSS           │
     │                           - Scroll + focus       │
```

### Técnicas de Detecção DOM

Cada regra utiliza técnicas específicas de varredura e validação do DOM:

#### 1. **page-title (WCAG 2.4.2)** ✅
- **Técnica:** Query Selector + Validação de Conteúdo
- **Implementação:**
  ```javascript
  const title = document.querySelector('title');
  const text = title?.textContent.trim();
  if (!title || !text || text.length < 3) { /* violação */ }
  ```
- **Valida:** Existência, conteúdo não-vazio e mínimo descritivo

#### 2. **lang-html (WCAG 3.1.1)** ✅
- **Técnica:** Attribute Validation + Regex ISO 639-1
- **Implementação:**
  ```javascript
  const lang = document.documentElement.getAttribute('lang');
  const isValid = /^[a-z]{2,3}(-[a-z]{2,3})?$/i.test(lang);
  ```
- **Valida:** Presença e formato válido do atributo `lang`

#### 3. **img-alt (WCAG 1.1.1)** ✅
- **Técnica:** Query All + Attribute + Context Analysis
- **Implementação:**
  ```javascript
  document.querySelectorAll('img').forEach(img => {
    const alt = img.getAttribute('alt');
    const isDecorative = img.getAttribute('role') === 'presentation';
    // Valida alt, contexto decorativo, tamanho, genericidade
  });
  ```
- **Valida:** Presença de `alt`, adequação (não vazio, não genérico, tamanho)

#### 4. **link-name (WCAG 2.4.4)** ✅
- **Técnica:** Accessible Name Computation (ARIA)
- **Implementação:**
  ```javascript
  function getAccessibleName(link) {
    return link.getAttribute('aria-labelledby') // prioridade 1
        || link.getAttribute('aria-label')      // prioridade 2
        || link.textContent.trim()              // prioridade 3
        || link.getAttribute('title');          // prioridade 4
  }
  ```
- **Valida:** Nome acessível adequado (não vazio, não genérico)

### Motor de Auditoria

O `AuditRunner` (implementado em `content.js`) gerencia:

1. **Registro de regras** via `auditRunner.register(id, rule)`
2. **Execução paralela** de todas as regras habilitadas
3. **Normalização automática** de resultados (schema padronizado)
4. **Tratamento de erros** com logs detalhados

**Schema de resultado padrão:**
```javascript
{
  ruleId: 'img-alt',
  wcag: { id: '1.1.1', level: 'A' },
  severity: 'error',
  description: 'Imagens devem possuir texto alternativo',
  nodes: [{
    selector: 'img.logo',
    snippet: '<img class="logo" src="...">',
    help: 'Adicione o atributo alt com descrição'
  }]
}
```

### Overlay de Destaque

O sistema de highlight (`highlightNodes()`) implementa:

- **Outline visual** com animação (respeitando `prefers-reduced-motion`)
- **Badges** com ID da regra violada
- **Scroll automático** até o primeiro elemento
- **Foco programático** para navegação por teclado
- **Acessibilidade** com contraste adequado e estados de foco

## 🧪 Testes

```bash
# Executar testes unitários (quando implementado)
npm test

# Executar testes com coverage
npm run test:coverage
```

## 📦 Build e Distribuição

```bash
# Build para produção (quando implementado)
npm run build

# Gerar pacote .zip para Chrome Web Store
npm run package
```

## 🤝 Contribuindo

Este projeto está em desenvolvimento ativo. Para contribuir:

1. Crie uma feature branch: `git checkout -b feature/nova-regra`
2. Implemente a funcionalidade seguindo conventional commits
3. Faça commit: `git commit -m 'feat(rules): add nova-regra (WCAG X.X.X)'`
4. Push: `git push origin feature/nova-regra`
5. Abra um Pull Request curto e focado

## 📄 Licença

Este projeto está sob a licença especificada em [LICENSE.md](LICENSE.md).

## 📞 Contato

Projeto desenvolvido como parte da disciplina de Interação Humano-Computador (IHC) - UnB 2025.2

---

**Status:** 🚧 Em desenvolvimento - Branch `extensao`
