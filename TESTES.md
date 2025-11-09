# 🧪 Guia de Testes - WCAG Auditor

> **Teste a extensão em 5 minutos!**

## ✅ Pré-requisitos

- [ ] Extensão carregada no Chrome (`chrome://extensions/`)
- [ ] Modo desenvolvedor ativado
- [ ] Ícone fixado na barra de ferramentas

---

## 🎯 Teste 1: Instalação e Carregamento

### Objetivo
Verificar se a extensão carrega sem erros.

### Passos
1. Abra `chrome://extensions/`
2. Verifique se "WCAG Auditor v1.0.0" aparece
3. Status deve estar **ativado** (toggle azul)
4. Abra o Console de Erros (se houver)
5. **Esperado:** Nenhum erro vermelho

### ✅ Critério de Sucesso
- Extensão aparece na lista
- Sem erros no console de extensões

---

## 🎯 Teste 2: Popup Básico

### Objetivo
Verificar se o popup abre e exibe a interface.

### Passos
1. Navegue para qualquer site (ex: `https://unb.br`)
2. Clique no ícone da extensão na barra de ferramentas
3. **Esperado:**
   - Popup abre em ~300ms
   - Título "WCAG Auditor"
   - Botão "Auditar Página" visível e habilitado
   - Botão "Destacar Violações" oculto inicialmente

### ✅ Critério de Sucesso
- Popup abre sem travar
- Interface renderizada corretamente

---

## 🎯 Teste 3: Auditoria Básica (Site com Violações)

### Objetivo
Testar auditoria em site real com violações conhecidas.

### Site de Teste
Use: **https://unb.br** (captura de tela fornecida mostra violações)

### Passos
1. Acesse `https://unb.br`
2. Abra o popup da extensão
3. Clique em **"Auditar Página"**
4. Aguarde 2-3 segundos
5. **Esperado:**
   - Loading aparece durante processamento
   - Resultados exibidos:
     - **Erros:** ≥ 2
     - **Avisos:** pode variar
   - Violações listadas com:
     - Nome da regra (ex: "img-alt")
     - WCAG e nível (ex: "1.1.1 - A")
     - Lista de elementos
     - Snippets HTML
     - Dicas de correção

### 🔍 Console (F12)
Abra o console da **página** (não da extensão) e verifique logs:
```
[WCAG Auditor] Content script carregado e pronto
[WCAG Auditor] Regra 'page-title' (WCAG 2.4.2) registrada
[WCAG Auditor] Regra 'lang-html' (WCAG 3.1.1) registrada
[WCAG Auditor] Regra 'img-alt' (WCAG 1.1.1) registrada
[WCAG Auditor] Regra 'link-name' (WCAG 2.4.4) registrada
[WCAG Auditor] Mensagem START_AUDIT recebida
[WCAG Auditor] Auditoria concluída: X violação(ões) encontrada(s)
```

### ✅ Critério de Sucesso
- Auditoria completa sem erros
- Violações detectadas e listadas
- Todas as 4 regras executaram

---

## 🎯 Teste 4: Overlay de Destaque

### Objetivo
Testar o destaque visual de elementos com violações.

### Passos
1. Após auditar a página (Teste 3)
2. Verifique se botão **"Destacar Violações"** está visível e habilitado
3. Clique no botão
4. **Esperado:**
   - Elementos com violações ganham **outline vermelho grosso**
   - **Badges** aparecem acima dos elementos (ex: "img-alt")
   - Página rola automaticamente para o **primeiro elemento**
   - Botão muda para **"Ocultar Destaques"** (verde)
5. Navegue pela página com **Tab** (teclado)
6. **Esperado:**
   - Elementos destacados são focáveis
   - Outline azul aparece ao focar
7. Clique novamente em "Ocultar Destaques"
8. **Esperado:**
   - Outlines removidos
   - Badges desaparecem
   - Botão volta para "Destacar Violações" (cinza)

### 🎨 Visual Esperado
```
┌────────────────────────────────────┐
│  [img-alt]                         │ ← Badge vermelho
│  ╔════════════════════════════╗    │
│  ║                            ║    │ ← Outline vermelho
│  ║   <img src="logo.png">     ║    │    pulsando (animação)
│  ║                            ║    │
│  ╚════════════════════════════╝    │
└────────────────────────────────────┘
```

### ✅ Critério de Sucesso
- Overlay aparece/desaparece corretamente
- Animação não trava a página
- Navegação por teclado funciona

---

## 🎯 Teste 5: Site Sem Violações (Ideal)

### Objetivo
Verificar comportamento quando não há problemas.

### Site de Teste
Crie um HTML simples ou use site bem acessível:

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Página Acessível - Teste</title>
</head>
<body>
  <h1>Bem-vindo</h1>
  <img src="logo.png" alt="Logo da Empresa">
  <a href="/contato">Entre em contato conosco</a>
</body>
</html>
```

### Passos
1. Carregue a página acima
2. Execute auditoria
3. **Esperado:**
   - **0 erros, 0 avisos**
   - Mensagem: "✅ Nenhuma violação encontrada!"
   - Texto: "A página passou em todas as verificações implementadas."
   - Botão "Destacar" permanece oculto

### ✅ Critério de Sucesso
- Mensagem de sucesso clara
- Sem falsos positivos

---

## 🎯 Teste 6: Regras Específicas

### 6.1 Teste: `page-title`

**Site com erro:**
```html
<title></title> <!-- vazio -->
```
**Esperado:** Violação detectada

**Site correto:**
```html
<title>Universidade de Brasília</title>
```
**Esperado:** Sem violação

---

### 6.2 Teste: `lang-html`

**Site com erro:**
```html
<html> <!-- sem lang -->
```
**Esperado:** Violação detectada

**Site correto:**
```html
<html lang="pt-BR">
```
**Esperado:** Sem violação

---

### 6.3 Teste: `img-alt`

**Site com erro:**
```html
<img src="foto.jpg"> <!-- sem alt -->
<img src="banner.jpg" alt=""> <!-- alt vazio não decorativo -->
<img src="logo.jpg" alt="imagem"> <!-- genérico -->
```
**Esperado:** 3 violações detectadas

**Site correto:**
```html
<img src="foto.jpg" alt="Estudantes na UnB">
<img src="decoracao.jpg" alt="" role="presentation">
<img src="logo.jpg" alt="Logo da UnB">
```
**Esperado:** Sem violações

---

### 6.4 Teste: `link-name`

**Site com erro:**
```html
<a href="/sobre"></a> <!-- sem texto -->
<a href="/docs">Clique aqui</a> <!-- genérico -->
```
**Esperado:** 2 violações detectadas

**Site correto:**
```html
<a href="/sobre">Conheça nossa história</a>
<a href="/docs">Leia a documentação técnica</a>
```
**Esperado:** Sem violações

---

## 🐛 Problemas Comuns e Soluções

### Problema: "Sem resposta do content script"
**Causa:** Content script não foi injetado  
**Solução:**
1. Recarregue a extensão (`chrome://extensions/` → botão de recarregar)
2. Recarregue a página auditada (F5)
3. Tente novamente

### Problema: Popup não abre
**Causa:** Erro no popup.js  
**Solução:**
1. Clique com botão direito no ícone → "Inspecionar popup"
2. Verifique erros no console
3. Corrija e recarregue extensão

### Problema: Overlay não aparece
**Causa:** Seletor CSS inválido ou elemento não encontrado  
**Solução:**
1. Abra console da página (F12)
2. Veja logs `[WCAG Auditor]`
3. Verifique se há warnings sobre seletores

### Problema: Muitos falsos positivos
**Causa:** Regra muito restritiva  
**Solução:**
- Ajuste lógica da regra em `src/rules/*.js`
- Recarregue extensão e teste novamente

---

## 📊 Checklist Final

Antes de considerar concluído, verifique:

- [ ] Extensão carrega sem erros
- [ ] Popup abre corretamente
- [ ] Auditoria detecta violações reais
- [ ] Overlay funciona (aparecer/desaparecer)
- [ ] Navegação por teclado funciona
- [ ] Sem travar em páginas grandes
- [ ] Logs aparecem no console
- [ ] Todas as 4 regras executam
- [ ] README está claro e testável
- [ ] Commits seguem conventional commits

---

## 🎓 Testes Avançados (Opcional)

### Performance
- Teste em página com 1000+ imagens
- Verifique tempo de auditoria (deve ser <5s)

### Compatibilidade
- Teste em SPAs (React, Vue)
- Teste em iframes

### Edge Cases
- Página sem `<html>` (erro do servidor)
- Página com JavaScript bloqueado
- Página com CSP restritivo

---

## 📞 Reportar Bugs

Se encontrar problemas, abra uma issue no GitHub com:
- URL da página testada
- Passos para reproduzir
- Comportamento esperado vs. observado
- Screenshots/console logs

