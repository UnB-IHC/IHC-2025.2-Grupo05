# Desenvolvimento Web — Checklist V2.0

Práticas de implementação para HTML, ARIA, formulários, navegação por teclado, foco, autenticação e padrões de interação.  
Baseado em **WCAG 2.2 (AA)**, **ABNT NBR 17225:2025** e WAI-ARIA Authoring Practices.  
> Marcação: **[NOVO]** (incluído na V2.0) • **[ATUALIZADO]** (ajustado por mudança de norma/entendimento).

---

## 1) Semântica, Estrutura e Navegação
- [ ] Documento tem **um `<h1>`** descritivo e hierarquia correta (`h2`/`h3`...). [[1]](#ref-1)
- [ ] Uso de **landmarks**: `<header>`, `<nav>`, `<main>`, `<aside>`, `<footer>` (um `<main>` por página). [[2]](#ref-2)
- [ ] **Links** são `<a>` (navegação) e **ações** são `<button>` (evento). [[3]](#ref-3)
- [ ] Elementos interativos **não são** `div/span` com `onclick` sem papéis/teclado. [[3]](#ref-3)

!!! success "Certo"
    Navegação com `<nav>` e links; botão de abrir modal em `<button>` com `aria-expanded`.

!!! failure "Errado"
    `div` com `onclick` para navegar; múltiplos `<main>`; títulos pulando níveis.

- [ ] **[NOVO]** Em **tabelas de dados**, usar `<th>` e `scope` apropriado (col/row); quando útil, fornecer `<caption>` descritivo. [[A1]](#ref-a1)
- [ ] **[NOVO]** **Links que abrem em nova aba/janela** informam claramente o usuário no texto ou por rótulo acessível. [[A2]](#ref-a2)

!!! success "Certo"
    `<th scope="col">Preço</th>`; `<caption>Tabela de tarifas 2025</caption>`  
    “Relatório Anual **(abre em nova aba)**”

!!! failure "Errado"
    Tabela só com `<td>`; link que abre nova aba sem aviso.

---

## 2) Teclado, Ordens e Armadilhas
- [ ] Toda funcionalidade é **operável por teclado** (Tab/Shift+Tab/Enter/Espaço/Setas). [[4]](#ref-4)
- [ ] **Sem armadilha de teclado** (é possível sair de modais/menus por Tab/ESC). [[5]](#ref-5)
- [ ] **Ordem de foco** segue a ordem visual e lógica do conteúdo. [[6]](#ref-6)
- [ ] **Skip link** para “Ir ao conteúdo principal” no topo. [[2]](#ref-2)

!!! success "Certo"
    Modal prende foco dentro e devolve ao botão que o abriu ao fechar.

!!! failure "Errado"
    Componente acessível só por mouse; foco some atrás de cabeçalho fixo.

---

## 3) Formulários: Rótulos, Ajuda e Erros
- [ ] Todo **input** tem **`<label>` visível** ou nome acessível (`aria-label/aria-labelledby`). [[7]](#ref-7)
- [ ] Mensagens de erro são **próximas** ao campo, com **texto claro** e relação por `aria-describedby`. [[8]](#ref-8)
- [ ] **Sugestões** (SC 3.3.3) e **prevenção de erro** (3.3.4) em transações importantes (financeiras/legais). [[9]](#ref-9)
- [ ] **Propósito de entrada** (autocompletes) para dados pessoais/conta (SC 1.3.5). [[10]](#ref-10)
- [ ] **[NOVO]** **Agrupar campos relacionados** (ex.: múltiplos checkboxes/radios) com `<fieldset>` e `<legend>` para indicar relação semântica. [[A1]](#ref-a1)


!!! success "Certo"
    `<label for="cpf">CPF</label>` + erro “CPF inválido” ligado ao input via `aria-describedby="cpf-erro"`.

!!! failure "Errado"
    Placeholder como “label”; erro só com borda vermelha sem texto.

---

## 4) Mensagens de Status e Live Regions
- [ ] Mudanças dinâmicas relevantes usam **ARIA live** (`role="status"`, `aria-live="polite/assertive"`). [[11]](#ref-11)
- [ ] Mensagens não movem foco **sem necessidade** e são anunciadas por leitores de tela. [[11]](#ref-11)

!!! success "Certo"
    “Item adicionado ao carrinho” em `role="status"`.

!!! failure "Errado"
    Snackbar surge fora de foco e não é lido; atualização silenciosa de erro.

- [ ] **[NOVO]** **Áudio automático** com duração > 3 s oferece **pausar/parar** ou controle de **volume**. [[A3]](#ref-a3)

!!! success "Certo"
    Player com botão de pausar; controle de volume disponível.

!!! failure "Errado"
    Áudio que toca sozinho sem controle algum.

---

## 5) Autenticação Acessível **[NOVO]**
- [ ] Permite **colar** senhas/códigos; funciona com **gerenciadores de senha**. [[12]](#ref-12)
- [ ] Oferece alternativa a **desafios cognitivos** (link mágico, gestor do SO/biometria quando aplicável). [[12]](#ref-12)
- [ ] Não exige **memorização** como única via de login. [[12]](#ref-12)

!!! success "Certo"
    2FA por app/código; “Entrar por e-mail (link mágico)”.

!!! failure "Errado"
    Bloquear “colar” no input; CAPTCHA sem alternativa acessível.

---

## 6) Entrada Redundante **[NOVO]**
- [ ] Não **repetir** dados já informados; **pré-preencher** quando possível e seguro. [[13]](#ref-13)

!!! success "Certo"
    Endereço digitado na etapa 1 já aparece na etapa 2 para conferência.

!!! failure "Errado"
    Exigir redigitar CPF/endereço sem motivo.

- [ ] **[NOVO]** **Orientação do dispositivo** (retrato/paisagem) **não é requisito** para usar o conteúdo; não “travar” layout em uma única orientação sem justificativa funcional. [[A4]](#ref-a4)


---

## 7) Drag & Drop com Alternativa **[NOVO]**
- [ ] Toda interação de **arrastar e soltar** tem **alternativa por clique/teclado** (ordenar, mover, anexar). [[14]](#ref-14)

!!! success "Certo"
    Botões “mover para cima/baixo” em listas ordenáveis; upload com botão “Escolher arquivo”.

!!! failure "Errado"
    Reordenar só por arrastar.

---

## 8) Padrões de Ponteiro e Gestos
- [ ] **Gestos complexos** (arrastar, pinçar, multi-toque) têm **alternativa** de **toque único/clique**. [[15]](#ref-15)
- [ ] **Cancelamento por ponteiro**: ações por toque/click podem ser **abortadas** (não “dispara ao pressionar”). [[16]](#ref-16)

!!! success "Certo"
    Slide carrega com botões anterior/próximo; ação só conclui ao soltar/clicar.

!!! failure "Errado"
    “Pressionar” já executa sem chance de cancelar; só gestos complexos.

---

## 9) Conteúdo Dinâmico: Hover/Foco e Movimento
- [ ] Conteúdo que aparece em **hover/foco** pode ser **dispensado**, não obscurece e persiste enquanto houver foco. [[17]](#ref-17)
- [ ] Conteúdos que **movem/rolam/atualizam** oferecem **Pausar / Parar / Ocultar**. [[18]](#ref-18)
- [ ] Evitar **flash** acima de 3 vezes/seg (ou manter abaixo do limiar seguro). [[19]](#ref-19)

!!! success "Certo"
    Tooltip dispensável; carrossel com pausar/anterior/próximo.

!!! failure "Errado"
    Banner piscando; tooltip que cobre formulário e some ao tentar interagir.

---

## 10) Idioma, Títulos e Metadados
- [ ] **Idioma da página** (`<html lang="pt-BR">`) e **partes** com idioma distinto (`lang`). [[20]](#ref-20)
- [ ] **Título de página** é único e descreve o conteúdo principal. [[21]](#ref-21)
- [ ] Metadados de **viewport** e zoom não bloqueado; não usar `user-scalable=no`. [[22]](#ref-22)

!!! success "Certo"
    `<html lang="pt-BR">` e citação em inglês marcada com `lang="en"`.

!!! failure "Errado"
    Página em PT sem `lang`; zoom bloqueado em mobile.

---

## 11) Nomes, Papéis e Estados (Name, Role, Value)
- [ ] Componentes custom têm **nome acessível**, **papel** e **estado/valor** expostos (ARIA conforme APG). [[23]](#ref-23)
- [ ] **Evitar ARIA desnecessária** quando o elemento nativo atende. [[3]](#ref-3)

!!! success "Certo"
    Componente “switch” custom segue APG: `role="switch"`, `aria-checked`, teclado com Espaço/Enter.

!!! failure "Errado"
    `div role="button"` sem responder ao teclado; `aria-*` conflitando com nativo.

---

## 12) Tempo e Sessão
- [ ] Informar **tempo limite** e oferecer forma de **estender** a sessão antes de expirar. [[24]](#ref-24)
- [ ] Processos longos indicam **progresso** e preservam dados em caso de expiração. [[24]](#ref-24)

!!! success "Certo"
    Aviso “Sua sessão expira em 2 min. Deseja estender?” com botão “Estender”.

!!! failure "Errado"
    Sessão expira sem alerta e perde o formulário.

---

## O que **remover/ajustar** (comparado ao pocket antigo)
- **SC 4.1.1 (Parsing)** tratado como critério normativo → **[ATUALIZADO]**: considerar só como **boa prática** (validar HTML/CSS); o SC foi removido na **WCAG 2.2**. [[25]](#ref-25)
- **Accesskey** como recomendação geral → **[ATUALIZADO]**: preferir **skip-link + landmarks + headings**; se usar, documente e evite conflitos com atalhos do navegador/SO. [[2]](#ref-2) [[23]](#ref-23)

---

### Notas rápidas de implementação
- Use elementos nativos sempre que possível; complemente com ARIA **apenas** quando necessário.  
- Garanta testes com teclado, NVDA/Firefox, JAWS/Chrome, VoiceOver/Safari e TalkBack/Chrome.  
- Validação automática ajuda, mas **não substitui** testes manuais com TA e usuários.

---

## Referências

<a id="ref-1"></a>[1] WCAG 2.2 — 2.4.* (Títulos e navegação)  
<a id="ref-2"></a>[2] WCAG 2.2 — Landmarks / Padrões de navegação; skip link  
<a id="ref-3"></a>[3] WAI-ARIA Authoring Practices (APG) — uso de elementos nativos vs. ARIA  
<a id="ref-4"></a>[4] WCAG 2.2 — 2.1.1 (Teclado)  
<a id="ref-5"></a>[5] WCAG 2.2 — 2.1.2 (Sem armadilha de teclado)  
<a id="ref-6"></a>[6] WCAG 2.2 — 2.4.3 (Ordem de foco)  
<a id="ref-7"></a>[7] WCAG 2.2 — 3.3.2 (Rótulos ou instruções)  
<a id="ref-8"></a>[8] WCAG 2.2 — 3.3.1 / 3.3.3 (Erros: identificação e sugestões)  
<a id="ref-9"></a>[9] WCAG 2.2 — 3.3.4 (Prevenção de erro — financeiro/legais)  
<a id="ref-10"></a>[10] WCAG 2.2 — 1.3.5 (Purpose of Input — autocompletes)  
<a id="ref-11"></a>[11] WCAG 2.2 — 4.1.3 (Mensagens de status)  
<a id="ref-12"></a>[12] WCAG 2.2 — 3.3.8 / 3.3.9 (Autenticação acessível)  
<a id="ref-13"></a>[13] WCAG 2.2 — 3.3.7 (Entrada redundante)  
<a id="ref-14"></a>[14] WCAG 2.2 — 2.5.7 (Movimentos de arrastar — alternativa)  
<a id="ref-15"></a>[15] WCAG 2.2 — 2.5.1 (Gestos de ponteiro)  
<a id="ref-16"></a>[16] WCAG 2.2 — 2.5.2 (Cancelamento por ponteiro)  
<a id="ref-17"></a>[17] WCAG 2.2 — 1.4.13 (Conteúdo em hover ou foco)  
<a id="ref-18"></a>[18] WCAG 2.2 — 2.2.2 (Pausar, Parar, Ocultar)  
<a id="ref-19"></a>[19] WCAG 2.2 — 2.3.1 (Três flashes ou abaixo do limiar)  
<a id="ref-20"></a>[20] WCAG 2.2 — 3.1.1 / 3.1.2 (Idioma de página e de partes)  
<a id="ref-21"></a>[21] Boas práticas WAI — Títulos de página  
<a id="ref-22"></a>[22] WCAG 2.2 — 1.4.4 / Mobile zoom (não bloquear)  
<a id="ref-23"></a>[23] WAI-ARIA Authoring Practices — Name, Role, Value  
<a id="ref-24"></a>[24] WCAG 2.2 — 2.2.1 / 2.2.6 (Temporizadores e controle de tempo)  
<a id="ref-25"></a>[25] Mudanças WCAG 2.2 — Remoção do SC 4.1.1 (Parsing)
<a id="ref-a1"></a>[A1] WCAG 2.2 — 1.3.1 (Informação e Relações): tabelas com `<th>` e `scope`; uso de `<caption>`.
<a id="ref-a2"></a>[A2] WCAG 2.2 — 3.2.2 (Na Entrada): indicar comportamentos inesperados, como abrir em nova aba/janela.
<a id="ref-a3"></a>[A3] WCAG 2.2 — 1.4.2 (Controle de Áudio): pausar/parar/volume para áudio com autoplay > 3 s.
<a id="ref-a4"></a>[A4] WCAG 2.2 — 1.3.4 (Orientação): não exigir orientação específica do dispositivo.
