# Ferramentas — V2.0

Esta página reúne **ferramentas práticas** para apoiar o time (Design, Conteúdo, Dev, QA) na verificação de acessibilidade.

> Legenda: **[NOVO]** = adicionada ou muito ampliada em relação ao guia do Grupo 09.  
> Importante: **validações automáticas não substituem** testes manuais com **teclado** e **tecnologias assistivas** (TA), nem **testes com pessoas**.

---

## Validação automática (página inteira ou componentes)

### ASES / e-Scanner (Gov.br) — **oficial BR** **[NOVO]**
**Quando usar:** verificação inicial de **conformidade geral** em portais e páginas públicas no Brasil.  
**Como usar (passo a passo):**
1. Abra a página publicada e rode a análise com o endereço completo.  
2. Revise o **resumo** (erros/alertas) e clique para ver **onde** ocorreu.  
3. Registre achados por **categoria** (texto alternativo, contraste, semântica) no ticket.  
**Limitações:** não avalia intenção/experiência; pode gerar **falsos positivos**; não “lê” estados dinâmicos.  
**Dica avançada:** reexecute após **interações** (abrir modal, trocar aba de um componente) usando o **URL do estado** quando existir.

---

### axe DevTools (extensão)
**Quando usar:** checar **componentes** durante o desenvolvimento (local e publicado).  
**Como usar:**
1. Com a página aberta, **DevTools → aba “axe”** → “Analyze”.  
2. Navegue pelos itens e use o **seletor** para ir ao elemento exato.  
3. Corrija e rode novamente até zerar erros críticos.  
**Limitações:** cobre **regras objetivas**; não avalia linguagem/UX.  
**Dica avançada:** use “**Needs review**” para triagem com o time (evita “tudo ou nada”).

---

### Lighthouse (DevTools Chrome)
**Quando usar:** medição **rápida** de Acessibilidade (pontuação) e performance.  
**Como usar:** DevTools → Lighthouse → selecione **Accessibility** → “Analyze page load”.  
**Limitações:** nota **não é certificação**; alguns itens passam “no escuro”.  
**Dica avançada:** gere **relatório JSON/HTML** e anexe no PR.

---

### WAVE (extensão)
**Quando usar:** visão **visual** de erros/alertas **sobre a própria página**.  
**Como usar:** ative a extensão; percorra os **ícones** no layout; clique para detalhes.  
**Limitações:** pode “poluir” a interface; cuidado com falsos positivos.  
**Dica avançada:** combine com **HeadingsMap** para checar a estrutura.

---

### Accessibility Insights (Web/Windows)
**Quando usar:** **fluxos guiados** (FastPass/Assessment) e **tab stops** visuais.  
**Como usar:** rode o **FastPass** (checagens essenciais) e visualize o **mapa de Tab** (ordem do foco).  
**Limitações:** foco em ambiente Microsoft/Chromium; não cobre tudo.  
**Dica avançada:** excelente para **mapear ordem de foco** e **armadilhas** rapidamente.

---

### Pa11y (CLI) **[NOVO]**
**Quando usar:** automatizar **CI/CD** com regras de acessibilidade.  
**Como usar:** instale e rode `pa11y <url>`; configure scripts para **pipelines**.  
**Limitações:** precisa de setup; resultados variam conforme DOM carregado.  
**Dica avançada:** rode após um **script de interação** (ex.: abrir modal via Playwright).

---

## DevTools (inspeção de árvore e papéis)

### Chrome/Edge — **Accessibility Tree** **[NOVO]**
**Quando usar:** conferir **Name, Role, Value** e hierarquia exposta ao leitor de tela.  
**Como usar:** DevTools → **Elements** → “Accessibility”.  
**Limitações:** exige leitura da **árvore de acessibilidade**; não é relatório pronto.  
**Dica avançada:** valide se o **nome acessível** vem do **label correto** (e não de texto decorativo).

---

### Firefox — **Accessibility Inspector** **[NOVO]**
**Quando usar:** inspeção **completa** da árvore e **contraste**.  
**Como usar:** Tools → Accessibility → explore os **nodes** e as **computed properties**.  
**Limitações:** curva de aprendizado.  
**Dica avançada:** use a aba **Contrast** para verificar **1.4.11** (não-texto) em elementos de UI.

---

### HeadingsMap (extensão)
**Quando usar:** checar **hierarquia de títulos** rapidamente (H1→H2→H3…).  
**Como usar:** abra a extensão na página e navegue pela **árvore de headings**.  
**Limitações:** foca só em headings; não vê landmarks.  
**Dica avançada:** use junto com **Landmarks**.

> **Comentário do grupo:**  
> O HeadingsMap ajudou bastante a visualizar, de forma rápida, a **hierarquia de títulos** da página.  
> Com ele, conseguimos enxergar se a estrutura fazia sentido (H1 → H2 → H3…) e se a navegação
> por headings seria coerente para leitores de tela.  
> Uma coisa que percebemos é que a ferramenta mostra apenas a **estrutura técnica**, então
> ainda foi necessário analisar se os títulos realmente descreviam o conteúdo de maneira clara
> e alinhada com a experiência real de uso.


---

### Landmarks (extensão)
**Quando usar:** conferir se há `header/nav/main/aside/footer` e landmarks ARIA.  
**Como usar:** ative a extensão e visualize a **estrutura por região**.  
**Limitações:** não garante qualidade do **conteúdo** da região.  
**Dica avançada:** um único **`<main>`** por página.

---

## Leitores de tela (TA) — testes manuais essenciais

### NVDA (Windows) — **gratuito**
**Quando usar:** **padrão** de testes no Windows.  
**Como usar (roteiro curto):**
1. Abra a página; use **H** (títulos), **D** (landmarks), **Tab/Shift+Tab** (interativos).  
2. Teste formulários: leia **label**, **erro** e **mensagens de status**.  
**Limitações:** precisa prática com **atalhos**; comportamento difere do JAWS.  
**Dica avançada:** combine com **Firefox** (par historicamente robusto).

---

### JAWS (Windows)
**Quando usar:** ambientes corporativos que usam JAWS.  
**Como usar:** similar ao NVDA, mas com **atalhos próprios** e **modo forms**.  
**Limitações:** licenças; diferenças de anúncio vs. NVDA.  
**Dica avançada:** valide **ambos** se o público usa os dois.

---

### VoiceOver (macOS/iOS)
**Quando usar:** checagem em **Safari** e em **apps iOS**.  
**Como usar:** macOS: `⌘⌥F5` (ou Acessibilidade) | iOS: Ajustes → Acessibilidade → VoiceOver.  
**Limitações:** curva de aprendizado; rotor/gestos específicos.  
**Dica avançada:** teste **rotas por headings e landmarks** com o **Rotor**.

---

### TalkBack (Android)
**Quando usar:** **apps Android** e **Chrome mobile**.  
**Como usar:** Ajustes → Acessibilidade → TalkBack; gestos de navegação por controle.  
**Limitações:** diferenças entre fabricantes/skins.  
**Dica avançada:** verifique **ordem e rótulos** em listas e **componentes custom**.

---

## Testes de teclado (sem ferramenta) **[NOVO]**

**Quando usar:** sempre — é a **base** de operabilidade.  
**Como fazer (roteiro de 2 minutos):**
1. **TAB** do topo ao rodapé (sem mouse).  
2. Acesse **todos** os interativos, sem “prisão” em modais/menus.  
3. Verifique **foco visível** e ordem lógica.  
4. Tente **Esc** para fechar modais e **Shift+Tab** para voltar.  
**Limitações:** manual, requer atenção.  
**Dica avançada:** grave um **GIF curto** do foco percorrendo os elementos para anexar ao PR.

---

## Cores, contraste e simulação

### Contrast Checker (CCA / ferramentas equivalentes)
**Quando usar:** validar **1.4.3 (texto)** e **1.4.11 (não-texto)**.  
**Como usar:** pegue **cores exatas** do CSS/DevTools; verifique **estados** (hover, focus, selected).  
**Limitações:** capturar cor errada gera **falso resultado**.  
**Dica avançada:** documente **tokens** (ex.: `--text-on-primary`) com os **ratios** esperados.

### WCAG Color Contrast Checker (extensão)
**Quando usar:** validar contraste de **pares específicos de cores** diretamente no navegador (texto, ícones, bordas de componentes etc.), sobretudo quando você está ajustando o design “na mão”.
**Como usar:**  
1. Ative a extensão na página que deseja testar.  
2. Use o conta-gotas ou informe manualmente as cores de primeiro plano e fundo.  
3. Verifique os valores de contraste reportados para texto normal e texto grande, comparando com os requisitos da WCAG (ex.: 4.5:1 para texto normal).  
**Limitações:** o resultado depende de capturar a **cor exata**; se você pegar o tom errado, o ratio também sai errado. E não avalia contexto (tamanho da fonte, peso, estado de foco/hover), só o contraste numérico.
**Dica avançada:** use em conjunto com DevTools (para inspecionar o CSS real) e registre os **ratios aprovados** como tokens de design (ex.: `--text-on-primary: 4.8:1`), facilitando a padronização no time.

> **Comentário do grupo:**  
> Usamos o *WCAG Color Contrast Checker* como nosso “termômetro rápido” de contraste.  
> Ele ajudou a testar combinações específicas de cores e verificar se atendiam aos
> valores mínimos exigidos pela WCAG, principalmente em textos, links e botões.  
> Percebemos, porém, que a ferramenta **não substitui olhar o componente no contexto real**
> (tamanho da fonte, peso, fundo, estado de foco/hover), então usamos o resultado como
> apoio técnico, e não como a única decisão de design.

### Editor de espaçamento de texto (extensão)
**Quando usar:** verificar se o layout continua **legível e utilizável** quando o usuário aumenta espaçamentos, conforme o critério **1.4.12 Text Spacing** (WCAG 2.2).
**Como usar:**  
1. Ative a extensão na página que será testada.  
2. Aplique os valores recomendados de espaçamento (linha, parágrafo, letras e palavras).  
3. Observe se textos continuam legíveis, se botões e campos não “quebram” e se não surgem barras de rolagem horizontais desnecessárias.
**Limitações:** A ferramenta atua só no **texto**, não cobre outros aspectos de layout (como reflow total da página) e não substitui testes de zoom (ex.: 200%, 400%) nem checagem em diferentes larguras de tela.
**Dica avançada:** use o editor de espaçamento junto com testes de **zoom e reflow** para garantir que a interface se mantém estável em diferentes preferências de leitura, e registre casos problemáticos como débito de acessibilidade no backlog.

> **Comentário do grupo:**  
> O *Editor de espaçamento de texto* ajudou a simular situações em que o usuário aumenta
> o espaçamento entre linhas, parágrafos e letras, como previsto nos critérios de espaçamento
> de texto da WCAG.  
> Essa ferramenta evidenciou trechos em que o layout começava a “quebrar” ou ficar desconfortável
> de ler quando o espaçamento era ajustado.  
> A experiência mostrou que esse tipo de teste é importante e complementa outros, como zoom e reflow,
> para garantir que o conteúdo continue legível em diferentes configurações de leitura.

### Simuladores de daltonismo (diversos) **[NOVO]**
**Quando usar:** garantir que informações **não dependam de cor**.  
**Como usar:** aplique simulação (Deuteranopia, Protanopia, Tritanopia) e observe **gráficos e status**.  
**Limitações:** simulação ≠ experiência real.  
**Dica avançada:** **padrões** (tracejado, hachura) + **rótulos** resolvem muitos casos.

---

## Conteúdo de mídia (vídeo/áudio) e Libras

### Legendas, transcrições e audiodescrição
**Quando usar:** **sempre** que houver vídeo/áudio.  
**Como usar:**
1. Crie **legendas sincronizadas** (CC).  
2. Gere **transcrição** textual com identificação de locutores.  
3. Avalie **audiodescrição** quando houver conteúdo **visual essencial**.  
**Limitações:** dá trabalho — **planeje** na pauta.  
**Dica avançada:** roteirize **autodescrição** de participantes (autoapresentação descritiva).

### VLibras **[NOVO]**
**Quando usar:** adicionar **janela/intérprete virtual** em Libras como **recurso complementar**.  
**Como usar:** integre o player/componente conforme documentação e **teste com usuários**.  
**Limitações:** **não substitui** CC nem AD; qualidade varia por contexto.  
**Dica avançada:** sinalize quando **há Libras** e **onde ativar**.

---

## Documentos (PDF, DOCX, planilhas)

### PAC (PDF Accessibility Checker) e Acrobat Checker **[NOVO]**
**Quando usar:** validar **PDF acessível** (tags, ordem de leitura, alt em imagens).  
**Como usar:** exporte o PDF **com tags**; rode o checker e corrija títulos/ordem/alt.  
**Limitações:** PDF “salvo de imagem” precisa de **OCR** e revisão.  
**Dica avançada:** sempre que possível, **publique HTML**; use PDF apenas quando necessário.

---

## Mobile (apps e web mobile)

### Android Accessibility Scanner **[NOVO]**
**Quando usar:** achados **rápidos** em telas Android (alvo, contraste, toques).  
**Como usar:** instale, ative e **varra a tela** — o app lista sugestões.  
**Limitações:** não cobre fluxos complexos; não substitui TalkBack.  
**Dica avançada:** capture **prints** com os destaques e anexe ao ticket.

### iOS Accessibility Inspector (Xcode) **[NOVO]**
**Quando usar:** validar **nomes/traços** de acessibilidade em **apps iOS**.  
**Como usar:** Xcode → **Open Developer Tool** → **Accessibility Inspector**; aponte para o app e inspecione **rótulos, traits, foco**.  
**Limitações:** requer **macOS + Xcode**; curva de aprendizado.  
**Dica avançada:** automatize checagens com **UITests** focados em **traits** e **rotulagem**.

> **Observação geral sobre as ferramentas:**  
> As extensões foram importantes para conectar nossa análise a critérios formais (WCAG e NBR),
> mas reforçamos que **nenhuma ferramenta automática ou semiautomática substitui testes manuais**,
> como navegação por teclado, uso de leitor de tela e observação da experiência real de uso.

