# Geração de Conteúdo — Checklist V2.0

Boas práticas para textos, imagens (simples e complexas), ícones, vídeos/podcasts, hyperlinks, documentos baixáveis e linguagem inclusiva.  
Baseado em **WCAG 2.2 (AA)**, **ABNT NBR 17225:2025** e Guia Gov.br.  
> Marcação: **[NOVO]** (incluído na V2.0) • **[ATUALIZADO]** (ajustado por mudança de norma/entendimento).

---

## 1) Estrutura Geral e Navegação
- [ ] Página tem **título descritivo e único**. [[1]](#ref-1)
- [ ] Cabeçalhos em **hierarquia lógica** (H1 → H2 → H3…), sem “pular” níveis. [[1]](#ref-1)
- [ ] **Idioma da página** e de trechos copiados está configurado (`lang`). [[2]](#ref-2)
- [ ] Há **mais de uma forma** de encontrar páginas (menu, busca, índice). [[1]](#ref-1)
- [ ] **[NOVO]** Instruções **não dependem de características sensoriais** (cor, forma, posição). [[3]](#ref-3)

!!! success "Certo"
    H1 “Guia de Tarifas 2025”; H2 “Preços”; H3 “Isenções”. Trecho em inglês marcado com `lang="en"`.

!!! failure "Errado"
    H1 → H3 sem H2; instrução “clique no botão **redondo à direita**”.

---

## 2) Termos e Linguagem Inclusiva
- [ ] Usar **“pessoas com deficiência (PCD)”** e especificações corretas (pessoa surda, pessoa cega etc.). [[4]](#ref-4)
- [ ] Evitar termos capacitistas e generalizações; priorizar **pessoa antes da condição**. [[4]](#ref-4)

!!! success "Certo"
    “Pessoas cegas podem…”; “Pessoas surdas usuárias de Libras…”.

!!! failure "Errado"
    “Os deficientes…”; “O autista”.

---

## 3) Textos e Legibilidade
- [ ] Texto **claro, direto**, com vocabulário conhecido; evitar jargões. [[5]](#ref-5)
- [ ] Explicar siglas na primeira ocorrência. [[5]](#ref-5)
- [ ] Frases curtas (≈15–20 palavras) e **ordem direta** (SVO). [[5]](#ref-5)
- [ ] **[ATUALIZADO]** Links **descritivos** (evitar “clique aqui”). [[1]](#ref-1)
- [ ] **[NOVO]** **Espaçamento de texto** pode ser aumentado (linhas, parágrafos, letras, palavras) **sem perda** de conteúdo/funcionalidade. [[6]](#ref-6)

!!! success "Certo"
    “Baixe o **Relatório Anual 2024**”; “Associação Brasileira de Normas Técnicas (ABNT)”.

!!! failure "Errado"
    “Clique aqui”; parágrafos longos e densos sem respiro.

---

## 4) Descrição de Imagens (simples)
- [ ] Fornecer **texto alternativo** significativo: quem/o quê, onde, ação/estado. [[7]](#ref-7)
- [ ] Imagens **decorativas** usam `alt=""`. [[7]](#ref-7)
- [ ] Evitar **imagem de texto**; prefira texto real. [[8]](#ref-8)

!!! success "Certo"
    `alt="Pessoa escrevendo em caderno sobre uma mesa de madeira."`

!!! failure "Errado"
    `alt="imagem123.jpg"`; banner com frase como imagem sem texto real.

---

## 5) Imagens Complexas (gráficos, mapas, infográficos)
- [ ] **Descrição longa** próxima ao gráfico, explicando **o que mostrar e os dados**. [[7]](#ref-7)
- [ ] **Alt curto** indica onde está a descrição longa. [[7]](#ref-7)
- [ ] Disponibilizar os **dados em tabela** quando aplicável. [[1]](#ref-1)

!!! success "Certo"
    `alt="Gráfico de pizza do uso de navegadores; descrição detalhada na tabela a seguir."`

!!! failure "Errado"
    Apenas `alt` genérico; dados só no gráfico.

---

## 6) Ícones e Rótulos
- [ ] Função de ícones **é clara**; usar **rótulo textual visível** quando necessário. [[9]](#ref-9)
- [ ] Ícones clicáveis têm **nome acessível** (rótulo/`aria-label`) que descreve a ação. [[10]](#ref-10)

!!! success "Certo"
    Ícone de lupa com label “Buscar no site”.

!!! failure "Errado"
    Ícone sem rótulo; `alt="lupa"` sem indicar ação.

---

## 7) Mídias de Vídeo
- [ ] **Legendas sincronizadas** (CC) para todo vídeo. [[11]](#ref-11)
- [ ] **Audiodescrição** para conteúdo visual essencial. [[11]](#ref-11)
- [ ] **Libras** como recurso complementar quando pertinente. [[11]](#ref-11)
- [ ] **[ATUALIZADO]** Evitar **flash** > 3x/seg; não publicar conteúdo que possa **provocar convulsão**. [[12]](#ref-12)

!!! success "Certo"
    CC completas, AD disponível, janela de Libras quando necessário.

!!! failure "Errado"
    Vídeo sem legendas; elementos piscando rapidamente.

---

## 8) Autodescrição (quando houver pessoas em vídeo)
- [ ] **Roteirizar** e realizar **autodescrição** dos participantes. [[13]](#ref-13)

> Ex.: “Olá, sou Ana; mulher branca, cabelos castanhos na altura dos ombros, uso óculos pretos…”

---

## 9) Podcasts (áudio)
- [ ] **Transcrição completa** com falas, identificação de locutores e sons relevantes. [[7]](#ref-7)
- [ ] Considerar **videocast** para facilitar Libras/legendas. [[11]](#ref-11)
- [ ] **[NOVO]** Se houver **autoplay de áudio > 3s**, deve haver **Pausar/Parar** ou controle de **volume**. [[14]](#ref-14)

!!! success "Certo"
    Transcrição publicada junto do episódio; player com pausar/volume.

!!! failure "Errado"
    Áudio começa automático sem controle.

---

## 10) Hashtags e Emojis
- [ ] Hashtags em **CamelCase** (`#AcessibilidadeDigital`). [[5]](#ref-5)
- [ ] Não **abusar de emojis** e nunca usá-los como **único** meio de informação. [[7]](#ref-7)

!!! success "Certo"
    `#GuiaDeAcessibilidade` e emojis pontuais como apoio.

!!! failure "Errado"
    Texto composto só por emojis; hashtag em minúsculas.

---

## 11) Hiperlinks (texto do link e comportamento)
- [ ] Texto do link **compreensível isoladamente**. [[1]](#ref-1)
- [ ] **Informar** quando link **abre em nova aba/janela**. [[15]](#ref-15)
- [ ] Evitar **URLs cruas** no texto; prefira rótulos significativos. [[5]](#ref-5)

!!! success "Certo"
    “Leia o **Relatório (PDF, 2,5 MB)** **(abre em nova aba)**”.

!!! failure "Errado"
    “[clique aqui]”; colar a URL gigante como texto.

---

## 12) Documentos para Download (PDF, DOCX etc.)
- [ ] Estrutura com **tags de títulos** e **ordem de leitura** correta. [[1]](#ref-1)
- [ ] **Alt** nas imagens do documento. [[7]](#ref-7)
- [ ] Indicar **tipo e tamanho** do arquivo no link. [[1]](#ref-1)

!!! success "Certo"
    “Relatório de Vendas **(PDF, 2,5 MB)**”.

!!! failure "Errado"
    “[Baixar relatório]” sem contexto.

---

## 13) Ajuda Consistente **[NOVO]**
- [ ] Se houver links/contatos de ajuda (FAQ, chat, “fale conosco”), manter **no mesmo local** em páginas similares. [[16]](#ref-16)

!!! success "Certo"
    Link “Ajuda” persistente no cabeçalho durante o fluxo.

!!! failure "Errado"
    Mudar o link de ajuda de lugar em cada página.

---

## O que **remover/ajustar** (comparado ao pocket antigo)
- **Links genéricos “clique aqui/saiba mais”** → **[ATUALIZADO]**: usar **rótulos descritivos**. [[1]](#ref-1)  
- **Apenas cor para comunicar** → manter a regra, mas **reforçar** uso de rótulos/ícones/padrões. [[3]](#ref-3)  
- **Conteúdo piscando** → **[ATUALIZADO]**: explicitar o limite **≤3 flashes/seg**. [[12]](#ref-12)  
- **Autoplay de áudio** → **[NOVO]**: exigir **Pausar/Parar/Volume** quando > 3s. [[14]](#ref-14)

---

### Notas rápidas de autoria
- Prefira **voz ativa**, títulos descritivos e parágrafos curtos.  
- Revise com leitores beta e, quando possível, com **pessoas com deficiência** (teste de usabilidade).

---

## Referências

<a id="ref-1"></a>[1] **NBR 17225:2025** — Diretrizes 2.4 (Navegável) e 1.3 (Adaptável); WCAG 2.2 — 2.4.*, 2.4.4.  
<a id="ref-2"></a>[2] **WCAG 2.2 — 3.1.1 / 3.1.2** (Idioma de página e de partes).  
<a id="ref-3"></a>[3] **WCAG 2.2 — 1.3.3** (Características sensoriais).  
<a id="ref-4"></a>[4] **NBR 17225:2025 — Princípio 3 (Compreensível)**; linguagem inclusiva.  
<a id="ref-5"></a>[5] **Guia de Boas Práticas — Gov.br (2023)** — linguagem simples, links descritivos, hashtags.  
<a id="ref-6"></a>[6] **WCAG 2.2 — 1.4.12** (Text Spacing).  
<a id="ref-7"></a>[7] **WCAG 2.2 — 1.1.1** (Alternativas textuais) / práticas para alt.  
<a id="ref-8"></a>[8] **WCAG 2.2 — 1.4.5** (Imagens de texto).  
<a id="ref-9"></a>[9] **NBR 17225:2025 — Diretriz 3.2** (Previsível) — ícones e funções claras.  
<a id="ref-10"></a>[10] **WCAG 2.2 — 4.1.2** (Name, Role, Value) — nomes acessíveis.  
<a id="ref-11"></a>[11] **WCAG 2.2 — 1.2.\*** (Mídia baseada em tempo) — legendas e AD; **Libras** como apoio.  
<a id="ref-12"></a>[12] **WCAG 2.2 — 2.3.1** (Três flashes ou abaixo do limiar).  
<a id="ref-13"></a>[13] **Princípio 1 (Perceptível)** — autodescrição (boa prática consolidada).  
<a id="ref-14"></a>[14] **WCAG 2.2 — 1.4.2** (Controle de áudio).  
<a id="ref-15"></a>[15] **WCAG 2.2 — 3.2.2** (Na entrada — avisar nova aba/janela).  
<a id="ref-16"></a>[16] **WCAG 2.2 — 3.2.6** (Ajuda consistente).
