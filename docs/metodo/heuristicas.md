# As 10 Heurísticas de Nielsen

## O que são?

As **10 Heurísticas de Usabilidade de Jakob Nielsen** são um conjunto de **princípios gerais** que ajudam a:

- **Avaliar interfaces** (encontrar problemas de usabilidade);
- **Guiar decisões de design** (evitar problemas antes que apareçam);
- Apoiar **avaliações heurísticas**, quando avaliadores percorrem um sistema procurando problemas com base nessas diretrizes.

Elas **não são regras rígidas** nem checklist exaustivo, mas funcionam como um **filtro poderoso** para identificar problemas comuns de interação, especialmente quando combinadas com testes de acessibilidade (WCAG / NBR) e testes com pessoas usuárias.

---

## 1. Visibilidade do estado do sistema

O sistema deve manter o usuário **sempre informado sobre o que está acontecendo**, por meio de feedback adequado e em tempo razoável.

- **Exemplos:**
  - Indicadores de carregamento (“Carregando…”, spinners, barras de progresso);
  - Mensagens “Salvando…”, “Enviando…”;
  - Passos claramente destacados em formulários multi-etapas.

- **Pergunte-se:**
  - O usuário consegue perceber que algo está acontecendo?
  - Ele sabe **em que etapa está** e o que falta para terminar?

- **Se ignorado, risco de:**
  - Usuário achar que o sistema travou;
  - Cliques repetidos, ações duplicadas e frustração.

---

## 2. Correspondência entre o sistema e o mundo real

A interface deve **falar a linguagem do usuário**, usando termos, conceitos e metáforas familiares, em vez de jargão técnico.

- **Exemplos:**
  - Usar “Carrinho” em vez de “Cesta de itens transacionais”;
  - Ícones intuitivos (🗑️ lixeira para excluir, 🔍 lupa para buscar);
  - Datas, horários e moedas no formato que o público entende.

- **Pergunte-se:**
  - Este texto/ícone faz sentido para alguém que **não é da área técnica**?
  - Estou usando linguagem do usuário ou do sistema?

- **Se ignorado, risco de:**
  - Confusão, erros por má interpretação;
  - Usuário precisar de ajuda externa para entender coisas simples.

---

## 3. Controle e liberdade do usuário

Usuários podem executar ações por engano. O sistema deve oferecer **saídas claras**, como desfazer ou cancelar, sem puni-los por pequenos erros.

- **Exemplos:**
  - Botões “Cancelar”, “Voltar”, “Desfazer” visíveis;
  - Confirmação para ações destrutivas (“Tem certeza que deseja excluir?”);
  - Possibilidade de editar dados antes de enviar definitivamente.

- **Pergunte-se:**
  - Se o usuário clicar errado, ele consegue **se recuperar facilmente**?
  - A interface incentiva experimentação ou medo de “estragar tudo”?

- **Se ignorado, risco de:**
  - Medo de usar o sistema;
  - Abandono por sentir que “qualquer erro é irreversível”.

---

## 4. Consistência e padrões

A interface deve ser **coerente** e seguir **padrões conhecidos**, para que o usuário não precise reaprender tudo o tempo todo.

- **Exemplos:**
  - Mesma cor e estilo para botões primários em todas as telas;
  - Mesmo comportamento para botões com o mesmo rótulo;
  - Seguir padrões da plataforma (Android, iOS, web).

- **Pergunte-se:**
  - Elementos visualmente iguais têm o **mesmo comportamento**?
  - Estou reinventando algo que já tem um padrão consolidado?

- **Se ignorado, risco de:**
  - Usuário confuso (“Aqui esse botão faz uma coisa, ali faz outra…”);
  - Curva de aprendizado desnecessariamente alta.

---

## 5. Prevenção de erros

Melhor do que mostrar mensagens de erro é **evitar que o erro aconteça** em primeiro lugar.

- **Exemplos:**
  - Máscaras de entrada para data, CPF, telefone;
  - Desabilitar o botão “Enviar” enquanto campos obrigatórios estiverem vazios;
  - Limitar opções por listas suspensas em vez de texto livre quando fizer sentido.

- **Pergunte-se:**
  - Estou ajudando o usuário a **acertar de primeira**?
  - O sistema deixa espaço para erros simples que poderiam ser evitados?

- **Se ignorado, risco de:**
  - Muitas mensagens de erro;
  - Frustração e sensação de incompetência do usuário (“Sou eu que não sei usar…”).

---

## 6. Reconhecimento em vez de memorização

A interface deve **reduzir a carga de memória** do usuário, facilitando o **reconhecimento** de opções em vez de exigir que ele se lembre de informações de outra tela.

- **Exemplos:**
  - Menus e opções visíveis, não escondidos atrás de muitos cliques;
  - Mostrar filtros ativos e resultados claramente;
  - Rótulos descritivos em botões (“Salvar rascunho”, “Enviar formulário”).

- **Pergunte-se:**
  - O usuário precisa lembrar de algo que viu em outra tela para continuar?
  - As opções importantes estão visíveis ou escondidas?

- **Se ignorado, risco de:**
  - Cansaço mental;
  - Usuário se perder em fluxos longos e complexos.

---

## 7. Flexibilidade e eficiência de uso

O sistema deve atender tanto **pessoas iniciantes** quanto **usuários experientes**, permitindo caminhos mais rápidos para quem já domina a interface.

- **Exemplos:**
  - Atalhos de teclado;
  - Sugestões baseadas em uso recente;
  - Preenchimento automático de dados repetitivos.

- **Pergunte-se:**
  - Usuários frequentes conseguem fazer tarefas de forma **mais rápida**?
  - Existem “atalhos” opcionais sem prejudicar quem está começando?

- **Se ignorado, risco de:**
  - Usuários avançados frustrados com lentidão e cliques demais;
  - Sistema que não escala bem para uso intensivo.

---

## 8. Estética e design minimalista

As telas não devem ser sobrecarregadas com informações irrelevantes.  
**Menos ruído visual → mais clareza.**

- **Exemplos:**
  - Remover textos redundantes e instruções óbvias;
  - Limitar número de cores e estilos na mesma tela;
  - Destacar apenas o que é essencial para a tarefa.

- **Pergunte-se:**
  - Tudo o que aparece na tela é realmente necessário para **essa tarefa**?
  - Existem elementos puramente decorativos competindo com o conteúdo?

- **Se ignorado, risco de:**
  - Sobrecarga cognitiva;
  - Usuário não saber para onde olhar ou onde clicar.

---

## 9. Ajudar usuários a reconhecer, diagnosticar e recuperar-se de erros

Mensagens de erro devem ser **claras, em linguagem simples**, indicar **o que aconteceu** e **como corrigir**.

- **Exemplos:**
  - Ruim: “Erro 400 – Bad Request”.  
  - Melhor: “Não foi possível enviar o formulário. Verifique os campos obrigatórios marcados em vermelho.”

- **Pergunte-se:**
  - A mensagem diz **o que deu errado**?
  - Ela orienta o usuário sobre **o próximo passo**?

- **Se ignorado, risco de:**
  - Usuário preso em um erro sem saber o que fazer;
  - Suporte sobrecarregado com dúvidas básicas.

---

## 10. Ajuda e documentação

Mesmo um sistema bem projetado às vezes precisa de **ajuda e documentação** acessíveis e fáceis de encontrar.

- **Exemplos:**
  - FAQ organizado por temas;
  - Tutoriais rápidos ou tours guiados;
  - Dicas contextuais próximas a campos complexos;
  - Links “Saiba mais” em pontos críticos.

- **Pergunte-se:**
  - Se alguém travar nesse ponto, encontra ajuda sem sair do fluxo?
  - A documentação é simples e atualizada?

- **Se ignorado, risco de:**
  - Usuário abandonando a tarefa por falta de orientação;
  - Depender exclusivamente de suporte humano para dúvidas recorrentes.

---

## Como as heurísticas se conectam ao nosso relatório

No contexto da avaliação do site, usamos as **10 Heurísticas de Nielsen** como:

- **Referencial de usabilidade**, complementando os critérios de acessibilidade (WCAG / NBR);
- Um jeito de **classificar problemas** encontrados (ex.: “falta de feedback → heurística 1”, “mensagem de erro ruim → heurística 9”);
- Um elo entre **experiência do usuário** e **implementação**, ajudando o time a entender não só *o que* está errado, mas *por que* isso prejudica a interação.

Enquanto as normas de acessibilidade focam em garantir que pessoas com diferentes deficiências consigam **perceber, operar e compreender** a interface,  
as heurísticas ajudam a identificar problemas mais amplos de:

- clareza,
- feedback,
- consistência,
- prevenção e recuperação de erros,

que impactam **todos** os usuários, com ou sem deficiência.

> Em resumo:  
> **WCAG / NBR** nos dizem *“o mínimo que precisa funcionar”* para ser acessível,  
> enquanto as **Heurísticas de Nielsen** ajudam a tornar essa experiência **mais fluida, clara e agradável**.
