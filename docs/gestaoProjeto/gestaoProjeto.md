# Gestão do Projeto — Checklist V2.0

Governança de acessibilidade: políticas, papéis, fluxo de trabalho, critérios de aceite, auditoria contínua, publicação e comunicação.  
Baseado em **WCAG 2.2 (AA)**, **ABNT NBR 17225:2025** (web), **ABNT NBR 17060:2022** (mobile) e diretrizes Gov.br.  
> Marcação: **[NOVO]** (incluído na V2.0) • **[ATUALIZADO]** (ajustado por mudança de norma/entendimento).

---

## 1) Política e Metas de Conformidade
- [ ] **[ATUALIZADO]** Meta oficial: **WCAG 2.2 nível AA** (web e mobile) como **Definition of Done**. [[1]](#ref-1)
- [ ] **[NOVO]** Aderência à **NBR 17225:2025** (web) e, quando houver app, à **NBR 17060:2022**. [[2]](#ref-2) [[3]](#ref-3)
- [ ] Padrões aplicáveis (WCAG/NBR/Gov.br) estão **documentados** no repositório. [[4]](#ref-4)

!!! success "Certo"
    Política de Acessibilidade aprovada; DoD menciona “WCAG 2.2 AA + NBR 17225”.

!!! failure "Errado"
    “Faremos acessibilidade se der tempo”; critérios vagos ou não escritos.

---

## 2) Declaração Pública de Acessibilidade
- [ ] **[NOVO]** Publicar **Declaração de Acessibilidade** (escopo, nível de conformidade, limitações conhecidas, data/versão e **canal de contato**). [[2]](#ref-2) [[4]](#ref-4)
- [ ] **[NOVO]** Atualizar declaração a cada **release relevante** ou auditoria. [[4]](#ref-4)

!!! success "Certo"
    Página “Acessibilidade” com AA, data da última revisão e formulário de contato.

!!! failure "Errado"
    Selo genérico “acessível” sem detalhar critérios/escopo.

---

## 3) Papéis e Responsabilidades (RACI)
- [ ] Há um **RACI** claro: Design, Conteúdo, Dev, QA, PO/PM e **Responsável por Acessibilidade**. [[4]](#ref-4)
- [ ] **[NOVO]** Cada etapa do fluxo (descoberta → design → dev → QA → release) tem **entregáveis de acessibilidade** definidos. [[4]](#ref-4)

!!! success "Certo"
    QA valida foco e teclado; Conteúdo publica alternativas textuais; Dev segue APG.

!!! failure "Errado"
    “Acessibilidade é só do QA”; ninguém sabe quem aprova.

---

## 4) Planejamento, Cronograma e Risco
- [ ] Itens de acessibilidade estão no **backlog** com prioridade e esforço. [[4]](#ref-4)
- [ ] **[NOVO]** **Riscos** (ex.: dependência de componente de terceiro) são mapeados com plano de mitigação. [[4]](#ref-4)

!!! success "Certo"
    Épico “Acessibilidade V2.0” com histórias por fluxo e critérios de aceite claros.

!!! failure "Errado"
    Correções ad-hoc e sem previsão de entrega.

---

## 5) Critérios de Aceite (PR/DoD)
- [ ] **[ATUALIZADO]** Cada história tem **critérios mensuráveis** (ex.: “Tab percorre todos os controles, foco visível, contraste 4.5:1, leitura por NVDA”). [[1]](#ref-1)
- [ ] **[NOVO]** PR checklist inclui **WCAG 2.2 AA**, teste de teclado, leitura por TA e verificação de **mensagens de status**. [[1]](#ref-1)

!!! success "Certo"
    Template de PR com seção “Acessibilidade verificada”.

!!! failure "Errado"
    “Acho que está ok” sem evidências.

---

## 6) QA e Auditoria Contínua
- [ ] Pipeline roda **validação automática** (ex.: linters/escâneres) — com entendimento das limitações. [[4]](#ref-4)
- [ ] **[NOVO]** Rodadas **manuais** (teclado + leitores de tela) em combinações-alvo (NVDA/Firefox, JAWS/Chrome, VoiceOver/Safari, TalkBack/Chrome). [[1]](#ref-1)
- [ ] **[NOVO]** Ciclo de **auditoria periódica** (ex.: a cada 2 sprints) com registro de achados. [[4]](#ref-4)

!!! success "Certo"
    Agenda fixa: “A cada sprint, 30 min de QA manual de acessibilidade”.

!!! failure "Errado"
    Só relatório automático antes da produção.

---

## 7) Ferramentas oficiais e passo a passo
- [ ] **[ATUALIZADO]** Uso de **ASES/eScanner** e **VLibras** (com limitações documentadas). [[5]](#ref-5)
- [ ] Guia rápido **passo a passo** de como validar com essas ferramentas. [[5]](#ref-5)

!!! success "Certo"
    Check com ASES + teste de teclado + leitores de tela; anotações no ticket.

!!! failure "Errado"
    Report automático = “conformidade garantida”.

---

## 8) Testes com pessoas usuárias (inclui PcD)
- [ ] Há **planejamento de testes de usabilidade** com pessoas com deficiência (amostra pequena porém recorrente). [[4]](#ref-4)
- [ ] **[NOVO]** Definir **perfis/recursos** (ex.: pessoas cegas usuárias de leitores de tela; pessoas surdas; mobilidade reduzida). [[4]](#ref-4)

!!! success "Certo"
    Três sessões curtas por release com roteiro essencial.

!!! failure "Errado"
    Nunca testamos com usuários reais.

---

## 9) Gestão de Incidentes e Débitos
- [ ] **[NOVO]** Regressões de acessibilidade tratadas como **incidentes** (SLA, severidade, triagem). [[4]](#ref-4)
- [ ] **[NOVO]** **Débitos** (conhecidos) ficam visíveis com **plano de correção** e prazo. [[4]](#ref-4)

!!! success "Certo"
    Tabela “Não-conformidades” com responsável e data-alvo.

!!! failure "Errado"
    Bugs de acessibilidade sem dono e sem prazo.

---

## 10) Terceiros e Componentes Externos
- [ ] **[NOVO]** Avaliar **bibliotecas/widgets** de terceiros (ex.: carrosséis, gráficos) quanto à acessibilidade. [[4]](#ref-4)
- [ ] **[NOVO]** Contratos pedem **declaração de conformidade** e plano de correções. [[4]](#ref-4)

!!! success "Certo"
    Critérios no RFP: “WCAG 2.2 AA + NBR”, com evidências.

!!! failure "Errado"
    Aceitar plugin fechado sem avaliação.

---

## 11) Publicação, Versionamento e Release Notes
- [ ] **[NOVO]** Notas de versão destacam **mudanças de acessibilidade** e itens que afetam TA. [[4]](#ref-4)
- [ ] **[NOVO]** Versionamento da **Declaração de Acessibilidade** com histórico de alterações. [[2]](#ref-2)

!!! success "Certo"
    Changelog com seção “Acessibilidade”.

!!! failure "Errado"
    Mudanças invisíveis ao público.

---

## 12) Feedback e Canal de Suporte
- [ ] **[ATUALIZADO]** Canal de **feedback** acessível (formulário, e-mail, telefone) está **visível e consistente** em todas as páginas. [[4]](#ref-4)
- [ ] **[NOVO]** Processar feedback com **SLA** e resposta ao usuário. [[4]](#ref-4)

!!! success "Certo"
    “Encontrou barreira? Fale conosco (retorno em 5 dias úteis).”

!!! failure "Errado"
    Caixa postal sem dono; respostas nunca chegam.

---

## 13) Privacidade, Segurança e Consentimento
- [ ] **[NOVO]** Fluxos de **autenticação** e **consentimento** não criam barreiras (sem “quebra-cabeças” cognitivos; permitem colar códigos; textos claros). [[1]](#ref-1)
- [ ] **[NOVO]** Avisos e políticas com linguagem simples e títulos descritivos. [[4]](#ref-4)

!!! success "Certo"
    Consentimento granular com rótulos claros; login com link mágico como alternativa.

!!! failure "Errado"
    CAPTCHA de imagem sem alternativa acessível.

---

## 14) Mobile (quando aplicável)
- [ ] **[NOVO]** Adotar o checklist de **NBR 17060:2022** para aplicativos (gestos com alternativa, labels nativos, foco com teclado externo, zoom). [[3]](#ref-3)

!!! success "Certo"
    Gestos complexos substituídos por botões; suporte a TalkBack/VoiceOver.

!!! failure "Errado"
    Travar orientação/zoom sem justificativa; componentes custom sem nome acessível.

---

## O que **remover/ajustar** (comparado ao pocket antigo)
- **Checklist apenas WCAG 2.1** → **[ATUALIZADO]**: elevar para **WCAG 2.2 AA**. [[1]](#ref-1)  
- **Sem menção a NBR** → **[NOVO]**: incluir **NBR 17225 (web)** e **NBR 17060 (mobile)**. [[2]](#ref-2) [[3]](#ref-3)  
- **Sem Declaração de Acessibilidade** → **[NOVO]**: publicar e versionar a declaração. [[2]](#ref-2)  
- **Ferramentas só internacionais** → **[ATUALIZADO]**: incluir **ASES/eScanner** e **VLibras**, com **passo a passo** e limitações. [[5]](#ref-5)

---

### Comparação com o Grupo 09
- **Mantido**: estrutura de governança, responsabilidades gerais, preocupação com ferramentas e cronograma.  
- **Atualizado**: metas **WCAG 2.2 AA**, foco em **declaração pública**, **auditoria contínua**, **incidentes/débitos**, **terceiros** e **release notes**.  
- **Adicionado**: **NBR 17225/17060**, **RACI com entregáveis por etapa**, **KPIs implícitos via DoD/PR**, **feedback com SLA** e **conformidade em contratos**.

---

## Referências

<a id="ref-1"></a>[1] WCAG 2.2 — Quick Reference (nível AA; autenticação acessível, 2.5.7/2.5.8, foco não obscurecido).  
<a id="ref-2"></a>[2] **ABNT NBR 17225:2025** — Acessibilidade na Web (critérios de conformidade e comunicação pública).  
<a id="ref-3"></a>[3] **ABNT NBR 17060:2022** — Acessibilidade em Aplicativos Móveis (requisitos e testes).  
<a id="ref-4"></a>[4] Diretrizes Gov.br — gestão, comunicação e boAS práticas de implementação/monitoramento.  
<a id="ref-5"></a>[5] Portal Governo Digital — **ASES/eScanner**, **VLibras** (quando usar e limitações).
