# 🧪 Guia Prático de Teste no Navegador

## ⚡ Teste Rápido em 3 Minutos

### Passo 1: Carregar a Extensão (primeira vez)

1. **Abra o Chrome** (ou Edge/Brave/Opera)

2. **Acesse a página de extensões:**
   - Digite na barra de endereço: `chrome://extensions/`
   - Ou clique nos 3 pontos (⋮) → Mais ferramentas → Extensões

3. **Ative o Modo do Desenvolvedor:**
   - No canto superior direito, ative o toggle **"Modo do desenvolvedor"**
   - Deve ficar azul/ativado

4. **Carregue a extensão:**
   - Clique no botão **"Carregar sem compactação"** (aparece após ativar modo desenvolvedor)
   - Navegue até a pasta do projeto: `/home/euller/IHC-2025.2-Grupo05`
   - Clique em **"Selecionar pasta"**

5. **Verifique se carregou:**
   - Você deve ver um card com:
     - Nome: **"WCAG Auditor"**
     - Versão: **1.0.0**
     - Status: **Ativado** (toggle azul)
   - Se houver erros, eles aparecerão em vermelho

6. **Fixe o ícone na barra:**
   - Clique no ícone de quebra-cabeça (🧩) no canto superior direito
   - Encontre "WCAG Auditor"
   - Clique no ícone de alfinete (📌) para fixar

---

### Passo 2: Primeiro Teste - UnB

1. **Abra uma nova aba**
   - Acesse: `https://unb.br`
   - Aguarde a página carregar completamente

2. **Abra o Console da Página (para ver os logs)**
   - Pressione **F12** ou **Ctrl+Shift+I**
   - Vá para a aba **"Console"**
   - Você deve ver logs como:
     ```
     [WCAG Auditor] Content script carregado e pronto
     [WCAG Auditor] Regra 'page-title' (WCAG 2.4.2) registrada
     [WCAG Auditor] Regra 'lang-html' (WCAG 3.1.1) registrada
     [WCAG Auditor] Regra 'img-alt' (WCAG 1.1.1) registrada
     [WCAG Auditor] Regra 'link-name' (WCAG 2.4.4) registrada
     ```

3. **Clique no ícone da extensão** (na barra de ferramentas)
   - Um popup deve abrir
   - Deve mostrar:
     - Título: "WCAG Auditor"
     - Subtítulo: "Auditoria de Acessibilidade Web"
     - Botão: "🔍 Auditar Página" (azul)

4. **Clique em "Auditar Página"**
   - Você verá:
     - Loading spinner (por 1-2 segundos)
     - Depois os resultados aparecem

5. **Veja os resultados:**
   ```
   Resultado da Auditoria
   ┌─────────┬─────────┐
   │ 2-5     │ 0-3     │  ← Contadores
   │ Erros   │ Avisos  │
   └─────────┴─────────┘
   ```
   
   - Abaixo aparecerão cards de violações
   - Cada card mostra:
     - Badge vermelho: **"error"** ou laranja: **"warn"**
     - Descrição: ex. "Imagens devem possuir texto alternativo"
     - WCAG: ex. "WCAG 1.1.1 (A)"
     - Elementos: lista com seletores CSS e snippets

6. **No Console, você verá:**
   ```
   [WCAG Auditor] Mensagem START_AUDIT recebida
   [WCAG Auditor] Iniciando auditoria...
   [WCAG Auditor] Auditoria concluída: X violação(ões) encontrada(s)
   [Popup] X violações encontradas
   [Popup] Exibindo: X erros, X avisos
   ```

---

### Passo 3: Testar Destaque de Violações

1. **Após a auditoria, veja o botão novo:**
   - Apareceu um botão: **"🎯 Destacar Violações"** (cinza)

2. **Clique em "Destacar Violações":**
   - A página será destacada:
     - Elementos com problemas ganham **outline vermelho grosso**
     - **Badge vermelho** aparece acima de cada elemento (ex: "img-alt")
     - Página **rola automaticamente** até o primeiro problema
     - Botão muda para **"Ocultar Destaques"** (verde)

3. **Visual esperado na página:**
   ```
   ╔═══════════════════════════════╗
   ║ [img-alt]                     ║ ← Badge vermelho no topo
   ║ ┌─────────────────────────┐   ║
   ║ │                         │   ║
   ║ │   [Imagem sem alt]      │   ║ ← Outline vermelho
   ║ │                         │   ║    pulsando (animado)
   ║ └─────────────────────────┘   ║
   ╚═══════════════════════════════╝
   ```

4. **Teste navegação por teclado:**
   - Pressione **Tab** repetidamente
   - Você deve conseguir focar os elementos destacados
   - O foco mostrará outline **azul** adicional

5. **Clique em "Ocultar Destaques":**
   - Outlines e badges desaparecem
   - Botão volta para "Destacar Violações" (cinza)

---

### Passo 4: Teste com Página Limpa (Sem Violações)

Vamos criar uma página de teste sem problemas:

1. **Crie um arquivo HTML:**
   - Crie o arquivo: `/home/euller/teste-limpo.html`
   - Cole este conteúdo:

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Página Acessível - Teste WCAG Auditor</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      max-width: 800px;
      margin: 50px auto;
      padding: 20px;
      line-height: 1.6;
    }
    h1 { color: #0066cc; }
    img { max-width: 200px; margin: 20px 0; }
    a { color: #0066cc; text-decoration: underline; }
  </style>
</head>
<body>
  <h1>Página Totalmente Acessível</h1>
  
  <p>Esta página foi criada seguindo todas as diretrizes WCAG 2.2 básicas.</p>
  
  <h2>Imagem com alt adequado</h2>
  <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='100'%3E%3Crect fill='%230066cc' width='200' height='100'/%3E%3Ctext x='50%25' y='50%25' fill='white' text-anchor='middle' dominant-baseline='middle' font-size='20'%3ELogo UnB%3C/text%3E%3C/svg%3E" 
       alt="Logo da Universidade de Brasília em azul">
  
  <h2>Links descritivos</h2>
  <ul>
    <li><a href="#sobre">Conheça a história da universidade</a></li>
    <li><a href="#cursos">Veja todos os cursos oferecidos</a></li>
    <li><a href="#contato">Entre em contato com a secretaria</a></li>
  </ul>
  
  <h2>Imagem decorativa (com role)</h2>
  <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='20'%3E%3Crect fill='%23cccccc' width='100' height='20'/%3E%3C/svg%3E" 
       alt="" 
       role="presentation">
  
  <p><strong>Status:</strong> ✅ Esta página deve passar em todas as verificações!</p>
</body>
</html>
```

2. **Abra o arquivo no Chrome:**
   - Arraste o arquivo para o Chrome, ou
   - File → Abrir arquivo (Ctrl+O) → Selecione `teste-limpo.html`

3. **Execute a auditoria:**
   - Clique no ícone da extensão
   - Clique em "Auditar Página"

4. **Resultado esperado:**
   ```
   ✅ Nenhuma violação encontrada!
   
   A página passou em todas as verificações implementadas.
   
   0 Erros    0 Avisos
   ```

5. **O botão "Destacar" NÃO aparece** (porque não há nada para destacar)

---

### Passo 5: Teste com Página Problemática

Agora teste com uma página cheia de problemas:

1. **Crie outro arquivo HTML:**
   - Crie: `/home/euller/teste-problemas.html`
   - Cole este conteúdo:

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title></title>
</head>
<body>
  <h1>Página com Problemas</h1>
  
  <!-- Imagem sem alt -->
  <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='100'%3E%3Crect fill='red' width='200' height='100'/%3E%3C/svg%3E">
  
  <!-- Imagem com alt vazio (não decorativa) -->
  <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='100'%3E%3Crect fill='blue' width='200' height='100'/%3E%3C/svg%3E" alt="">
  
  <!-- Imagem com alt genérico -->
  <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='100'%3E%3Crect fill='green' width='200' height='100'/%3E%3C/svg%3E" alt="imagem">
  
  <!-- Link vazio -->
  <a href="/teste"></a>
  
  <!-- Link genérico -->
  <a href="/docs">Clique aqui</a>
  <a href="/sobre">Saiba mais</a>
  
  <!-- Link muito curto -->
  <a href="/x">OK</a>
</body>
</html>
```

2. **Abra no Chrome** e execute auditoria

3. **Resultado esperado:**
   - **4 tipos de violações** detectadas:
     - ✗ `page-title`: Título vazio
     - ✗ `lang-html`: Sem atributo lang
     - ✗ `img-alt`: 3 imagens problemáticas
     - ✗ `link-name`: 4 links problemáticos
   
   - **Total:** ~8-10 violações

4. **Clique em "Destacar":**
   - Todas as imagens e links problemáticos ficarão destacados
   - Role a página e veja os badges

---

## 🔍 Verificações Detalhadas

### Verificar se Content Script Carregou

1. Na página auditada, abra Console (F12)
2. Digite: `auditRunner`
3. Pressione Enter
4. **Esperado:** Deve mostrar objeto `AuditRunner` com propriedades
5. Se retornar `undefined`, a extensão não foi injetada

### Verificar Regras Registradas

1. No Console, digite: `auditRunner.getRules()`
2. Pressione Enter
3. **Esperado:** Array com 4 objetos:
   ```javascript
   [
     { id: 'page-title', wcag: {...}, ... },
     { id: 'lang-html', wcag: {...}, ... },
     { id: 'img-alt', wcag: {...}, ... },
     { id: 'link-name', wcag: {...}, ... }
   ]
   ```

### Debugar o Popup

1. Clique com **botão direito** no ícone da extensão
2. Selecione **"Inspecionar popup"**
3. Abre DevTools só do popup
4. Vá para aba **Console**
5. Clique em "Auditar Página"
6. Veja os logs:
   ```
   [Popup] Solicitando auditoria...
   [Popup] Resposta recebida: {...}
   [Popup] X violações encontradas
   ```

---

## ⚠️ Problemas Comuns

### "Sem resposta do content script"

**Sintoma:** Erro no popup após clicar em "Auditar"

**Causa:** Content script não foi injetado

**Solução:**
1. Vá em `chrome://extensions/`
2. Encontre "WCAG Auditor"
3. Clique em **🔄 Recarregar** (ícone de reload)
4. Volte para a página e **recarregue** (F5)
5. Tente novamente

### Popup não abre

**Sintoma:** Nada acontece ao clicar no ícone

**Solução:**
1. Vá em `chrome://extensions/`
2. Verifique se há **"Erros"** em vermelho
3. Clique em "Erros" para ver detalhes
4. Corrija os erros no código
5. Clique em **Recarregar** na extensão

### Overlay não aparece

**Sintoma:** Botão "Destacar" não faz nada

**Solução:**
1. Abra Console da página (F12)
2. Procure por erros JavaScript
3. Verifique se há log: `[WCAG Auditor] X elemento(s) destacado(s)`
4. Se não aparecer, veja se há warnings sobre seletores inválidos

### Extensão não aparece na barra

**Solução:**
1. Clique no ícone de quebra-cabeça (🧩)
2. Procure "WCAG Auditor"
3. Clique no alfinete 📌 para fixar

---

## 📊 Checklist de Teste Completo

Marque conforme testa:

- [ ] Extensão carrega sem erros em `chrome://extensions/`
- [ ] Console mostra logs de carregamento das 4 regras
- [ ] Popup abre ao clicar no ícone
- [ ] Auditoria executa e retorna resultados
- [ ] Violações são listadas com detalhes
- [ ] Botão "Destacar" aparece quando há violações
- [ ] Overlay funciona (elementos destacados em vermelho)
- [ ] Navegação por Tab funciona nos elementos destacados
- [ ] Botão "Ocultar" remove os destaques
- [ ] Página sem problemas mostra "0 erros, 0 avisos"
- [ ] Todas as 4 regras detectam problemas corretamente

---

## 🎥 Fluxo Visual Esperado

```
1. Carrega extensão → ✅ Card aparece em chrome://extensions/

2. Abre site → 🔍 Ícone fixado na barra

3. Clica no ícone → 📱 Popup abre em ~300ms

4. Clica "Auditar" → ⏳ Loading (1-2s) → 📊 Resultados

5. Vê violações → 📋 Lista expandida com detalhes

6. Clica "Destacar" → 🎯 Página mostra outlines vermelhos

7. Pressiona Tab → ⌨️ Navega entre elementos destacados

8. Clica "Ocultar" → 🔄 Destaques removidos
```

---

## 🆘 Ajuda Rápida

**Extensão não carrega?**  
→ Verifique erros em `chrome://extensions/`

**Content script não injeta?**  
→ Recarregue extensão + recarregue página

**Popup em branco?**  
→ Botão direito no ícone → "Inspecionar popup" → Console

**Nenhuma violação detectada (mas deveria)?**  
→ Abra Console da página → Veja logs `[WCAG Auditor]`

**Overlay não funciona?**  
→ Verifique se há warnings sobre seletores CSS inválidos

---

**Boa sorte com os testes! 🚀**

Se encontrar qualquer problema, verifique os logs do console primeiro.
