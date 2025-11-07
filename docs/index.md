# VerificAAA — Guia de Acessibilidade (V2)

> **Grupo 05 — IHC/UnB (2025.2)**  
> Esta é a **Versão 2** do nosso *Guia de Acessibilidade*, evoluída a partir de um pocket de um grupo do semestre passado, agora alinhada a **WCAG 2.2 (AA)**, **ABNT NBR 17225:2025 (Web)** e **ABNT NBR 17060:2022 (Mobile)**.

---

## Sobre o projeto

Somos o **Grupo 05** da disciplina **Interação Humano-Computador (IHC)**, Universidade de Brasília.  
Nosso objetivo é oferecer **checklists práticos** e **guias rápidos** que ajudem equipes (Design, Dev, Conteúdo, QA e Gestão) a **planejar, construir e validar** produtos acessíveis — do esboço ao deploy.

- Base normativa principal: **WCAG 2.2 (AA)**
- Adoção nacional: **NBR 17225:2025 (Web)** e **NBR 17060:2022 (Mobile)**
- Contexto público BR: recomendações **Gov.br** (Guias e Ferramentas oficiais)

---

## O que mais tem de novo na V2

- **Texto e layout mais resilientes:** *Text Spacing* **1.4.12** (aumentar espaçamentos sem quebrar o layout) e *Content on Hover/Focus* **1.4.13** (tooltips/hover não atrapalham a interação).
- **Instruções claras:** *Sensory Characteristics* **1.3.3** (não depender de cor/forma/posição nas instruções).
- **Tabelas e grupos de campos:** *Info & Relationships* **1.3.1** — uso de `<th scope>`, `<caption>`, e `<fieldset>/<legend>` para relação semântica.
- **Links previsíveis:** **3.2.2** — avisar quando o link abre em nova aba/janela.
- **Mídia controlável e segura:** **1.4.2** (pausar/parar/volume para áudio > 3s), **2.3.1** (≤ 3 flashes/s), **2.2.2** (Pausar/Parar/Ocultar conteúdo em movimento).
- **Mobile de verdade:** **1.3.4** (não travar orientação) + checklist baseado na **NBR 17060** (gestos com alternativa, labels nativos, foco com teclado externo).
- **Preferências do usuário:** `prefers-reduced-motion`, `prefers-contrast` e `color-scheme` (claro/escuro) respeitadas por padrão.
- **Operabilidade completa:** *Dragging Movements* **2.5.7** (alternativa ao arrastar), *Target Size* **2.5.8** (alvos confortáveis).
- **Formulários & login mais gentis:** *Redundant Entry* **3.3.7** (pré-preencher, não exigir repetição), *Accessible Authentication* **3.3.8/3.3.9** (permitir colar, evitar quebra-cabeças).
- **Governança contínua:** Declaração pública de acessibilidade, auditorias periódicas, gestão de incidentes/débitos, exigência de conformidade de terceiros, destaque de mudanças de A11y no *release notes*.
- **Ferramental BR oficial:** inclusão de **ASES/e-Scanner** e **VLibras** com passo a passo e limitações.
- **Histórico importante:** remoção do **SC 4.1.1 (Parsing)** na WCAG 2.2 — mantido só como boa prática (validar HTML/CSS).

---

## Referências principais

1. **WCAG 2.2 – Quick Reference (W3C/WAI)** — critérios e técnicas (A/AA/AAA).  
2. **WCAG 2.2 – Mudanças em relação à 2.1** — novos SC (2.5.7, 2.5.8, 3.2.6, 3.3.7, 3.3.8/9 etc.).  
3. **WAI-ARIA Authoring Practices (APG)** — componentes, *name/role/value*, teclado.  
4. **ABNT NBR 17225:2025 (Web)** — diretrizes brasileiras de acessibilidade para web.  
5. **ABNT NBR 17060:2022 (Mobile)** — requisitos de acessibilidade para aplicativos móveis.  
6. **Gov.br — Guia de Boas Práticas de Acessibilidade** — linguagem simples, links descritivos, estrutura.  
7. **Gov.br — Ferramentas oficiais** — **ASES/e-Scanner** (automático) e **VLibras** (complementar).  
8. **W3C/WAI — Media Accessibility** — legendas, transcrição, audiodescrição; limites de flash e controle de movimento.  
9. **CSS Media Queries for Accessibility** — `prefers-reduced-motion`, `prefers-contrast`, `color-scheme`.  
10. **Boas práticas de testes com TA** — combinações alvo: NVDA+Firefox, JAWS+Chrome, VoiceOver+Safari, TalkBack+Chrome.

---

## Como usar este guia

1. **Planejamento** → veja **Gestão do Projeto** para políticas, metas, DoD e auditoria.  
2. **Design** → cheque contraste, foco, alvos, movimento e reflow.  
3. **Desenvolvimento** → semântica nativa, teclado, ARIA/APG, formulários, status, autenticação.  
4. **Conteúdo** → linguagem simples, alternativas textuais, mídia (CC/AD), links e documentos.  
5. **Validação** → use as **Ferramentas** (automáticas + manuais + TA) e registre evidências no PR.

---

## Fotos do grupo

---

## Créditos e referência ao trabalho anterior

Esta V2 se baseia em um *pocket* de um grupo anterior, que serviu de **ponto de partida**.  
Todas as **inclusões/atualizações** foram **referenciadas** nas páginas internas (rodapé “Referências”).

- **Equipe**: Grupo 05 (IHC/UnB — 2025.2)  
- **Contato**: `nop` 

---

## Nota de conformidade

- Objetivo-alvo: **WCAG 2.2 nível AA**.  
- Adoção nacional: **NBR 17225 (Web)** e **NBR 17060 (Mobile)**.  
- Publicaremos a **Declaração de Acessibilidade** com escopo, limitações e canal de contato na seção **Gestão do Projeto**.

<style>
.gallery{
  display:grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: .85rem;
  margin-top:.5rem
}
.gallery figure{
  margin:0; padding:0; background: var(--md-code-bg-color);
  border-radius: .6rem; overflow:hidden; box-shadow: var(--md-shadow-z2)
}
.gallery img{ width:100%; height:220px; object-fit:cover; display:block }
.gallery figcaption{
  padding:.5rem .75rem; font-size:.85rem; opacity:.85
}
</style>
