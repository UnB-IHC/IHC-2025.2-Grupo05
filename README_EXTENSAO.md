# WCAG Auditor - Extensão Chrome

Extensão Chrome para auditoria de acessibilidade web baseada nas diretrizes WCAG 2.1.

## 👥 Integrantes do Grupo 05

- **Euller** - Motor de auditoria, regras base e overlay
- **Ana** - UI/UX, Options page e exportação de relatórios
- **Kauã** - Regras avançadas, testes e validação

## 📋 Sobre o Projeto

Esta extensão Chrome detecta automaticamente violações de acessibilidade em páginas web, seguindo as diretrizes WCAG 2.1 (níveis A, AA e AAA). 

### Funcionalidades

- ✅ Auditoria automática de páginas web
- ✅ Identificação de violações WCAG
- ✅ Destaque visual de elementos problemáticos
- ✅ Relatório detalhado com seletores CSS e snippets
- ✅ Exportação em JSON/CSV
- ✅ Configuração por regra

## 🚀 Como Instalar

### Pré-requisitos
- Google Chrome ou navegador baseado em Chromium (Edge, Brave, etc.)

### Instalação (Modo Desenvolvedor)

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/UnB-IHC/IHC-2025.2-Grupo05.git
   cd IHC-2025.2-Grupo05
   git checkout extensao
   ```

2. **Crie os ícones temporários** (opcional para testes):
   - Crie 3 arquivos PNG (16x16, 48x48, 128x128) na pasta `/icons`
   - Nomeie como `icon16.png`, `icon48.png`, `icon128.png`
   - Ou use o script auxiliar: `npm run generate-icons` (se implementado)

3. **Carregue a extensão no Chrome:**
   - Abra o Chrome e vá para `chrome://extensions/`
   - Ative o **"Modo do desenvolvedor"** (toggle no canto superior direito)
   - Clique em **"Carregar sem compactação"**
   - Selecione a pasta raiz do projeto (`IHC-2025.2-Grupo05`)
   - A extensão aparecerá na lista e o ícone na barra de ferramentas

## 🔍 Como Usar

1. **Navegue até a página que deseja auditar**
2. **Clique no ícone da extensão** na barra de ferramentas do Chrome
3. **Clique no botão "Auditar Página"**
4. **Visualize os resultados:**
   - Contadores de erros e avisos
   - Lista detalhada de violações por regra WCAG
   - Seletores CSS e snippets de código
5. **Destaque violações** (opcional): clique em "Destacar" para visualizar elementos problemáticos na página

## 📊 Regras Implementadas

### Lote 0 (Fundação)
| Regra         | WCAG  | Nível | Descrição                              |
|---------------|-------|-------|----------------------------------------|
| `page-title`  | 2.4.2 | A     | Verifica se `<title>` existe e não está vazio |
| `lang-html`   | 3.1.1 | A     | Valida atributo `lang` no `<html>`    |
| `img-alt`     | 1.1.1 | A     | Verifica texto alternativo em imagens |
| `link-name`   | 2.4.4 | A     | Valida nome acessível em links        |

### Lote 1 (Semântica/Formulários) - Em desenvolvimento
- `form-label-for` (WCAG 1.3.1 A)
- `button-role` (WCAG 4.1.2 A)
- `duplicate-id` (WCAG 4.1.1 A)
- `iframe-title` (WCAG 2.4.1 A)

### Lote 2 (Navegação/Teclado) - Em desenvolvimento
- `focus-visible` (WCAG 2.4.7 AA)
- `tabindex-positive` (WCAG 2.4.3 A)
- `clickable-nonfocusable` (WCAG 2.1.1 A)

### Lote 3 (Percepção/Estrutura) - Em desenvolvimento
- `contrast-AA` (WCAG 1.4.3 AA)
- `heading-order` (WCAG 1.3.1 A)

## 🛠 Arquitetura Técnica

### Estrutura de Arquivos
```
/
├── manifest.json              # Configuração da extensão (MV3)
├── service-worker.js          # Background script (gerencia mensagens)
├── content.js                 # Content script (executa na página)
├── /src
│   ├── /core
│   │   ├── audit-runner.js    # Motor de auditoria
│   │   ├── messaging.js       # Comunicação entre componentes
│   │   └── contrast.js        # Cálculo de contraste de cores
│   ├── /rules                 # Regras WCAG (uma por arquivo)
│   │   ├── page-title.js
│   │   ├── img-alt.js
│   │   └── ...
│   └── /ui
│       ├── popup.html         # Interface do popup
│       ├── popup.js           # Lógica do popup
│       └── popup.css          # Estilos do popup
└── /icons                     # Ícones da extensão
```

### Técnicas de Detecção DOM

Cada regra utiliza técnicas específicas de varredura do DOM:

#### 1. **page-title (WCAG 2.4.2)**
- **Técnica:** Query Selector simples
- **Implementação:** `document.querySelector('title')?.textContent.trim()`
- **Valida:** Existência e conteúdo não-vazio do elemento `<title>`

#### 2. **lang-html (WCAG 3.1.1)**
- **Técnica:** Atributo validation
- **Implementação:** `document.documentElement.getAttribute('lang')`
- **Valida:** Presença e validade do atributo `lang` no `<html>`

#### 3. **img-alt (WCAG 1.1.1)**
- **Técnica:** Query All + Attribute check
- **Implementação:** `document.querySelectorAll('img')` → verifica `alt`
- **Valida:** Presença de atributo `alt` adequado em todas as imagens

#### 4. **link-name (WCAG 2.4.4)**
- **Técnica:** Accessible name computation
- **Implementação:** Verifica `textContent`, `aria-label`, `aria-labelledby`, `title`
- **Valida:** Nome acessível para todos os links `<a href>`

_Mais detalhes técnicos serão adicionados conforme implementação das regras._

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
