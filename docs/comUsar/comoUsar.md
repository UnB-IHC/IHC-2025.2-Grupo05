# Como usar este guia na prática

Este guia foi pensado para **ser usado ao longo de todo o ciclo de vida do produto**, não só no final.  
A seguir, sugerimos um fluxo de uso por etapa e por papel.

## 1. Início do projeto – Gestão e metas

Defina, com o time, o **nível de conformidade alvo** (ex.: WCAG 2.2 AA).

Use o checklist de **Gestão do Projeto** para:

- incluir acessibilidade na **Definition of Done (DoD)**;

- prever tempo/esforço para ajustes de acessibilidade;

- definir como serão feitas as **evidências** (prints, relatórios, issues).

> Resultado esperado: o projeto já nasce com acessibilidade como requisito e não como “extra”.

## 2. Durante o design – Prototipação e UI

Para cada nova tela, use o checklist de **Design**:

- verifique contraste de cores;

- tamanho de fonte;

- hierarquia de títulos;

- foco visível;

- alvos de toque (especialmente em mobile).

Ajuste o design **antes** de enviar para desenvolvimento.

> Resultado esperado: os protótipos já chegam para dev com menos problemas de acessibilidade.

## 3. Durante o desenvolvimento – Implementação

Use o checklist de **Desenvolvimento Web / Mobile** para:

- garantir HTML semântico ou componentes equivalentes;

- suporte completo à navegação por teclado;

- formulários com rótulos, mensagens de erro e instruções claras;

- componentes interativos acessíveis (menus, modais, carrosséis, drag & drop).

Na revisão de código (PR), verifique se os itens críticos estão marcados como **“atendidos”**.

> Resultado esperado: o código já incorpora padrões de acessibilidade e reduz retrabalho.

## 4. Conteúdo – Textos, mídias e documentos

Use o checklist de **Conteúdo** para:

- escrever textos em linguagem clara;

- criar descrições alternativas para imagens;

- revisar links (“clique aqui” → descrições significativas);

- avaliar acessibilidade de PDFs e outros anexos.

Sempre que um novo conteúdo for criado ou atualizado, revise pelos itens do checklist.

> Resultado esperado: o usuário entende o conteúdo mesmo com leitor de tela, zoom ou recursos de apoio.

## 5. Validação final – Ferramentas e testes

Execute as ferramentas listadas em **Ferramentas de Apoio**:

- validador automático (axe, Lighthouse, WAVE, etc.);

- leitores de tela (NVDA, TalkBack, VoiceOver);

- simuladores e ampliadores.

Registre os resultados:

- capture **prints**;

- exporte **relatórios**;

- abra **issues** com os problemas encontrados.

Atualize os checklists marcando o que foi corrigido.

> Resultado esperado: existe um **rastro de evidências** mostrando como a acessibilidade foi verificada e tratada.

## 6. Manutenção contínua

Repita este fluxo sempre que:

  1. novas funcionalidades forem criadas;

  2. o layout for reformulado;

  3. houver atualização de normas ou critérios.
  
- Use este guia como referência viva, podendo ser ajustado e ampliado conforme a experiência do time.

---

> Este fluxo é uma sugestão prática para integrar o VerificAAA ao dia a dia do time, evitando que a acessibilidade seja vista apenas como etapa final ou atividade isolada.
