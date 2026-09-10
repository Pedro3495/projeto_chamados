# Sistema de Chamados

## Objetivo

Estou desenvolvendo esse projeto com objetivo de aprender na prática conceitos do básico até o avançado da área onde desejo atuar.

## Tecnologias

- HTML
- CSS
- JavaScript
- TypeScript
- Módulos ESM

## Funcionalidades concluídas

- CRUD Funcionando.
- Tratamento de caso quando não há nenhum chamado.
- Pesquisa por título e cliente.
- Filtro por status e prioridade.
- Filtros combinados.
- Normalização de classes CSS.
- Ordenação por mais recentes, mais antigos e prioridades.
- Persistência dos chamados com `localStorage` e JSON.
- Carregamento assíncrono simulado, com estados de loading e erro.
- Organização do código em módulos.
- Migração dos módulos de `src` para TypeScript.

## Comandos do projeto

```bash
npm run typecheck
npm run build
npm run watch
```

- `typecheck`: verifica os tipos sem gerar arquivos em `dist`.
- `build`: verifica os tipos e compila o TypeScript para JavaScript em `dist`.
- `watch`: mantém o compilador ativo e recompila após alterações salvas.

## Aprendizados

- Aprendi como eu deveria pensar na criação de novas funcionalidades.
- Achei erros, bugs e consertei eu mesmo.
- Descobri o que é e como usar funções como
-- map() -> itera sobre cada item de um array, aplica uma função em cada um(pode ser uma verificação ou etc) e retorna um novo array.
-- arrow function -> uma forma bastante abreviada em js de uma function
- Aprendi que devemos usar event/params nas arrow functions quando for preciso consultar alguma informacao do event.
-- Exemplo: o usuario clicou em um botao dentro de um card, então a gente precisa saber qual é o botão que foi acionado (event.target)
-- Exemplo : o usuario clicou para dar submit no form, entao eu preciso impedir o comportamento padrao de reiniciar a pagina para poder executar -- a minha funcao (event.preventDefault()).
- Aprendi mais sobre o método sort() e como eu posso manipular um array.
- Aprendi "change" como eventListener para listas Drop-down.
- Estou me habituando a forma de desenvolver e pensar.
- Uma Promise pode terminar de duas formas: resolve ou reject.
- resolve indica sucesso, recebe o valor
- reject indica falha e encerra a promise com falha
- finally executa o código posto nele independente do resultado do try/catch
- o navegador está executando a pasta dist, que é resultado da verificação do typescript, feita via npx tsc.
- O parâmetro Ordenacao, Prioridade e Status foi tipado.
- Migrei storage.js para storage.ts e fiz a tipagem necessária
- A ideia de tipar uma promise é essa: Promise<Chamado[]> -> Quando resolver, entregará um array de chamados.
- Migrei main.js para main.ts
- Tipei várias variáveis, elementos DOM e até resultados de find()
- Criei várias verificações: null, verificar tipos.

- Configurei `noUnusedLocals` e `noUnusedParameters` para encontrar código não utilizado.
- Configurei `noEmitOnError` para impedir a geração de JavaScript quando houver erros de TypeScript.
- `type` desaparece na compilação;
- dados externos precisam de validação em execução;
- unknown obriga o código a verificar antes de usar;
- um type guard associa a verificação real ao tipo TypeScript.

## Próximas etapas

- Validar em tempo de execução os dados recuperados do `localStorage`.
- Adicionar testes.
- Evoluir para React.
- Integrar posteriormente com Java, Spring Boot e PostgreSQL.
- Realizar testes de integração e deploy.
