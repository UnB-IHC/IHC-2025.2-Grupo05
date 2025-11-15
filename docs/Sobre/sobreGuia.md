
## Para quem é este guia?

Este guia foi pensado para apoiar diferentes perfis dentro de um time de produto digital:

- **Pessoas desenvolvedoras (Dev)**  
  Que precisam checar rapidamente se **componentes, páginas e fluxos** estão atendendo requisitos mínimos de acessibilidade antes do deploy.

- **Pessoas de UX/UI / Design**  
  Que estão **prototipando telas** e querem garantir desde o início bom contraste, foco visível, hierarquia de informação e interações acessíveis (toque, teclado, movimento etc.).

- **Pessoas de Conteúdo**  
  Que produzem **textos, imagens, vídeos e documentos** e precisam de apoio para escrever em linguagem simples, criar descrições alternativas e organizar links e anexos de forma acessível.

- **Pessoas de Gestão / Coordenação**  
  Que definem **prioridades, metas, Definition of Done (DoD)** e precisam incluir acessibilidade como critério de qualidade, não apenas como “melhoria futura”.

- **Qualidade / Testes (QA)**  
  Que realizam **verificações funcionais e não funcionais** e podem usar os checklists e ferramentas aqui descritos para planejar casos de teste relacionados à acessibilidade.

## Glossário rápido

Alguns termos usados ao longo do guia:

- **A11y**  
  Abreviação de *accessibility*: as letras “a” e “y” com 11 letras no meio. Usada como atalho para falar de acessibilidade digital.

- **WCAG**  
  *Web Content Accessibility Guidelines*. Conjunto de diretrizes internacionais mantidas pelo W3C para tornar conteúdos web mais acessíveis (no guia, usamos principalmente a **WCAG 2.2 nível AA**).

- **SC (Success Criterion / Critério de Sucesso)**  
  É cada requisito específico dentro da WCAG (ex.: 1.4.3 Contraste (mínimo), 2.1.1 Teclado, 3.3.7 Assistência na autenticação).

- **ARIA / WAI-ARIA**  
  Conjunto de atributos usados para melhorar a acessibilidade de componentes ricos (menus, modais, carrosséis etc.), principalmente para leitores de tela. Devem **complementar**, e não substituir, HTML semântico.

- **APG (Authoring Practices Guide)**  
  Guia de boas práticas do W3C que mostra **padrões recomendados de comportamento** para componentes acessíveis (como deve se comportar um menu, um diálogo, um acordeão, etc.).

- **DoD (Definition of Done)**  
  Lista de critérios que uma tarefa precisa cumprir para ser considerada “pronta”. Quando incluímos acessibilidade no DoD, ela deixa de ser “extra” e passa a ser parte da qualidade mínima.

- **NBR 17225 / NBR 17060**  
  Normas ABNT que tratam de acessibilidade em **serviços digitais web** (17225) e **aplicativos móveis** (17060). Este guia se apoia nessas normas junto com a WCAG 2.2.


## Limitações deste guia

Apesar de buscar ser prático e alinhado às normas, este guia **não cobre tudo** que envolve acessibilidade. Em especial:

- **Foco em acessibilidade digital**  
  O conteúdo aqui trata de **interfaces e serviços digitais** (web e mobile).  
  Não aborda em detalhe acessibilidade **física/predial**, **sinalização urbana**, transporte, mobiliário etc.

- **Não substitui avaliação com pessoas usuárias**  
  Os checklists e ferramentas ajudam a encontrar muitos problemas, mas **não substituem testes com pessoas com deficiência** e outros perfis de usuários.

- **Não é laudo ou certificação**  
  Este guia apoia o time a melhorar a acessibilidade, mas **não é um laudo oficial** nem uma certificação de conformidade. Em contextos formais, pode ser necessário o trabalho de **especialistas externos**.

- **Escopo dinâmico**  
  Normas e diretrizes (como WCAG e NBR) evoluem com o tempo. Este material é uma fotografia de um momento e pode precisar de revisões futuras para acompanhar novas versões.

> Mesmo com essas limitações, usar este guia de forma consistente já representa um avanço significativo na inclusão e na qualidade de produtos digitais.
