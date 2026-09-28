# Refactor & Improvement Plan for dumpkit

Este documento consolida a análise técnica do projeto e organiza as melhorias em prioridade, com foco em robustez, segurança, manutenibilidade e adoção no ecossistema Node.js.

## Visão geral

O dumpkit é uma biblioteca pequena, orientada a desenvolvimento, para inspeção de valores em Node.js. Sua proposta principal é simplificar debugging em ambientes de desenvolvimento, oferecendo uma API inspirada em Laravel com `dump()`, `dd()`, `dp()`, `inspect()`, `trace()`, `measure()` e `analyze()`.

A arquitetura atual é saneada e bem direcionada: análise do valor, transformação em uma estrutura intermediária (`AnalysisNode`) e renderização em diferentes views (`flat`, `tree`, `table`). Isso é uma base sólida para expansão.

Apesar disso, a biblioteca ainda precisa de uma etapa de endurecimento antes de alcançar maior adoção. Os pontos principais são: robustez do `dp()`, gestão de getters/side effects, limites de custo da análise, compatibilidade com Node e qualidade de testes.

---

## Prioridade Alta

### 1) Corrigir a gestão de `stdin` em `dp()`

#### Problema
A implementação atual de `dp()` usa `process.stdin.removeAllListeners('data')`, o que pode afetar listeners externos e quebrar a aplicação caso outra parte do processo também use `stdin`.

#### Melhorias recomendadas
- Substituir `removeAllListeners('data')` por `removeListener('data', onData)`.
- Salvar e restaurar o estado anterior de raw mode quando disponível.
- Garantir que `stdin` seja sempre limpo, mesmo em casos de timeout, erro ou interrupção.
- Tratar sinais do processo (`SIGINT`, `SIGTERM`) para restaurar o console antes de sair.
- Evitar correr risco de dois `dp()` simultâneos compartilharem o mesmo `stdin`.

#### Ação
- Implementar uma fila simples ou lock local para `dp()`.
- Garantir que cada chamada apenas capture a entrada que lhe pertence.

#### Benefício
- Elimina interferência com o restante da aplicação.
- Torna `dp()` mais seguro em ambientes interativos e em CI.

---

### 2) Cobrir `dp()` com testes reais de terminal

#### Problema
A biblioteca manipula TTY, raw mode e leitura de entrada. Isso é um ponto delicado e exige testes de integração, não apenas testes unitários de string.

#### Melhorias recomendadas
- Testar `dp()` em TTY real usando pseudo-terminal (`pty`) em ambiente de teste.
- Testar `autoContinue` em non-TTY.
- Validar timeout e fila de entrada.
- Cobrir `\n`, `\r` e `\r\n`.
- Validar multi-call sequential behavior.

#### Ação
- Adicionar suíte de testes em `tests/dump` ou `tests/terminal`.
- Usar devDependencies adequadas para PseudoTTY (se necessário).

#### Benefício
- Reduz chance de regressões em execução interativa.
- Melhora a confiabilidade da funcionalidade que mais depende de comportamento do sistema operacional.

---

### 3) Proteger `analyze()` contra side effects em getters

#### Problema
A análise recursiva pode acessar propriedades e invocar getters. Em JavaScript, getters podem executar código arbitrário, causar I/O, disparar efeitos colaterais e lançar exceções.

#### Melhorias recomendadas
- Adicionar opção explícita de acesso a propriedades:
  - `accessors: 'invoke' | 'skip' | 'descriptor'`
- Padrão atual pode continuar como `invoke` por compatibilidade, mas deve ser documentado como risco operacional.
- `descriptor` deve exibir propriedades sem executar getter, apenas metadados.

#### Ação
- Criar helper para leitura segura de propriedades.
- Documentar claramente que `inspect()`/`analyze()` podem executar getters, dependendo da configuração.

#### Benefício
- Torna a biblioteca mais segura para uso em dados de terceiros ou estruturas complexas.
- Ajuda a evitar comportamento surpreendente ou destrutivo em objetos personalizados.

---

### 4) Adicionar limites de custo de análise

#### Problema
A análise de estruturas muito grandes pode consumir memória e CPU, gerando saídas massivas e impacto em runtime.

#### Melhorias recomendadas
- Introduzir configurações globais como:
  - `maxNodes?: number`
  - `maxTimeMs?: number`
- Ao exceder a cota:
  - interromper a análise;
  - emitir um nó `truncated` ou `limit-reached`;
  - impedir que a saída exploda.

#### Ação
- Implementar contador de nós em `analyze()`.
- Usar `performance.now()` para promover corte no tempo de execução.

#### Benefício
- Reduz risco de crash, lentidão e logs gigantes.
- Torna a biblioteca mais previsível em produção e em ambientes com dados muito grandes.

---

### 5) Melhorar a detecção de thenables em `measure()`

#### Problema
`measure()` usa `result instanceof Promise`, que é mais rígido do que a realidade do JavaScript. Há thenables e objetos Promise-like que não necessariamente passam por `instanceof Promise`.

#### Melhorias recomendadas
- Implementar helper `isThenable(value)`:
  - `value != null && typeof value.then === 'function'`
- Usar essa verificação para detectar funções assíncronas.

#### Ação
- Revisar a implementação de `measure()` em `src/measure/measure.ts`.

#### Benefício
- Aumenta compatibilidade com abstrações assíncronas e edges cases.

---

### 6) Reduzir interferência de `stdin` em execução não interativa

#### Problema
`dp()` entra em modo de leitura/prompt, e isso pode afetar outros fluxos de entrada em processos que não são apenas de debug.

#### Melhorias recomendadas
- Evitar `pause()` indiscriminado de `stdin` quando não houver necessidade.
- Dar prioridade a ambientes non-TTY com autoContinue.
- Documentar claramente comportamento em CI/CD e scripts headless.

#### Ação
- Revisar `src/dump/pause.ts` e ajustar read semantics.

#### Benefício
- Melhor compatibilidade com execução automatizada, pipelines, e processos de produção.

---

## Prioridade Média

### 7) Revisar requisito mínimo de Node

#### Problema
O projeto exige `node >= 22`, o que reduz a adoção em bases legadas e em ambientes corporativos conservadores.

#### Melhorias recomendadas
- Verificar se há uso real de APIs exclusivas do Node 22.
- Se não houver, reduzir a faixa mínima para Node 18 ou 20.

#### Ação
- Revisar `package.json` e `tsup.config.ts`.
- Rodar testes em versões LTS anteriores.

#### Benefício
- Expande o público e a adoção do pacote.

---

### 8) Melhorar a tipagem interna de `AnalysisNode`

#### Problema
O código faz uso de `as any` em vários pontos, especialmente nos renderers. Isso enfraquece a segurança de tipos e dificulta manutenção.

#### Melhorias recomendadas
- Definir `AnalysisNode` como discriminated union real e específico por tipo.
- Garantir que cada renderizador receba o tipo correto.
- Eliminar casts desnecessários.

#### Ação
- Revisar `src/core/analysis/types.ts` e os renderers em `src/core/renderers/*`.

#### Benefício
- Reduz bugs silenciosos.
- Melhora manutenção, refatoração e robustez.

---

### 9) Expandir cobertura de testes para ambientes reais

#### Problema
A biblioteca lida com saída de stream, buffers, TTY e Node internals; unit tests simples não cobrem a maior parte dos riscos.

#### Melhorias recomendadas
- Testar `trace()` com caminhos reais e falsos.
- Testar saldos de `colors` em TTY e non-TTY.
- Cobrir `measure()` em sucesso e erro.
- Cobrir `analyze()` para circular vs shared refs vs truncation.

#### Ação
- Adicionar testes específicos por módulo: `core`, `dump`, `measure`, `trace`, `shared`.

#### Benefício
- Reduz regressões e aumenta a confiabilidade do pacote.

---

### 10) Melhorar robustez de `trace()`

#### Problema
A identificação de frames do usuário depende de strings e heurísticas de caminho, o que pode falhar em Windows, monorepos, bundles e ambientes com caminhos similares.

#### Melhorias recomendadas
- Normalizar separadores de caminho.
- Tratar Windows e Unix de forma homogênea.
- Usar melhor distinção entre código da biblioteca e código do usuário.
- Considerar sourcemap support quando disponível.

#### Ação
- Revisar `src/trace/trace.ts` e `src/shared/utils/stack.ts`.

#### Benefício
- Melhor qualidade de saída em ambientes diversos.

---

### 11) Tratar valores Promise-like em outros casos

#### Problema
O código assume Promise nativo em `measure()`. Há cenários com thenables ou abstrações compatíveis.

#### Melhorias recomendadas
- Criar helper `isThenable` compartilhado e reutilizável.
- Usar em outros lugares que analogue loops de async em futuro.

#### Benefício
- Evita bugs em objetos compatíveis com Promise mas não nativos.

---

## Prioridade Baixa / Evolução funcional

### 12) Suportar renderers customizados

#### Ideia
Dar ao usuário a capacidade de registrar ou trocar o renderer para um formato específico.

#### Proposta
- `registerRenderer('myview', fn)`
- `inspect(value, { view: 'myview' })`

#### Benefício
- Expande extensibilidade com zero risco para a API pública base.

---

### 13) Respeitar `util.inspect.custom` e hooks de classe

#### Ideia
Quando houver uma serialização específica da classe, a biblioteca pode respeitar a convenção `util.inspect.custom` do Node.

#### Benefício
- Permite mais integração com objetos externos.
- Melhora interoperabilidade com util.inspect do Node.

---

### 14) Saída JSON estruturada

#### Ideia
Além de `flat`, `tree` e `table`, adicionar `view: 'json'` ou um utilitário separado para exportar `AnalysisNode` em formato serializável.

#### Benefício
- Útil para IDEs, logs estruturados, ferramentas de automação e observabilidade.

---

### 15) Redaction / mascaramento de dados sensíveis

#### Problema
A biblioteca pode tombar segredos, tokens, senhas e headers sensíveis.

#### Melhorias recomendadas
- Adicionar `redact` como opção de `dump()`/`inspect()`.
- Permitir lista de chaves ou fn para mascarar.
- Exemplos:
  - `password`
  - `authorization`
  - `token`

#### Benefício
- Aumenta segurança da ferramenta em ambientes reais.

---

### 16) Melhorar suporte de configuração global

#### Ideia
Adicionar mecanismo de configuração avançada de comportamento global:
- cores de colorização;
- defaults;
- redaction;
- perfil de renderização.

#### Benefício
- Facilita padronização em grandes projetos.

---

### 17) Extensão para integradores de logging

#### Ideia
Criar adaptadores opcionais para Pino, Winston, etc., sem forçar dependências de runtime do pacote principal.

#### Benefício
- Expande utilidade para produção e equipes com padrões de logging.

---

## Observações sobre utilidade no ecossistema

### Onde o dumpkit é forte
- Desenvolvimento local e depuração de objetos complexos
- Scripts Node
- APIs pequenas e serviços de backend
- CLI tools
- Debugging estrutural de `Map`, `Set`, `Error`, arrays profundos e objetos circulares

### Onde o dumpkit não substitui ferramentas existentes
- Logging estruturado em produção (`pino`, `winston`)
- OpenTelemetry / tracing distribuído
- Profiler e benchmarking (`perf_hooks`, Node inspector)
- Sistema de observabilidade centralizada (Sentry, Datadog, etc.)

### Posicionamento recomendado
O dumpkit deve ser apresentado como uma ferramenta de inspeção e depuração em desenvolvimento, não como um substituto para logging de produção ou observabilidade.

---

## Qualidade técnica atual

### Pontos fortes
- API pública simples e intuitiva
- Separação entre análise e apresentação
- `analyze()` como base arquitetural
- Suporte a tipos complexos
- `view` múltiplo (`flat`, `tree`, `table`)
- Zero dependências de runtime
- Build em ESM + CJS
- Documentação e changelog bem organizados

### Pontos de atenção
- `dp()` é o ponto mais frágil do projeto
- `trace()` depende de heurísticas por string/path
- getters podem ter side effects
- `measure()` usa checagem de Promise mais rígida
- tipagem interna em renderers ainda pode ser reforçada
- testes de terminal são insuficientes para a classe de problemas que a biblioteca expõe

---

## Plano de implementação recomendado

### Fase 1 — robustez crítica
1. Corrigir `dp()` (removeListener, raw mode, lock, cleanup de stdin)
2. Adicionar testes de integração para TTY / non-TTY / timeout
3. Substituir `instanceof Promise` por `isThenable`
4. Adicionar limites de análise (`maxNodes`, `maxTimeMs`) em `analyze()`
5. Reforçar tipagem de `AnalysisNode`

### Fase 2 — aprimoramento geral
1. Revisar requisito mínimo de Node
2. Melhorar `trace()` cross-platform
3. Documentar risco de getters e side effects
4. Melhorar cobertura de testes e documentação em README/docs

### Fase 3 — expansão funcional
1. Redaction
2. Renderer customizado
3. JSON structured output
4. Adaptadores para logging estruturado

---

## Conclusão

O dumpkit tem uma proposta útil, clara e bem alinhada ao ecossistema Node.js, especialmente para debugging local e inspeção interativa. A arquitetura atual é sólida e tem boa base para crescimento, mas ainda precisa de endurecimento para reduzir risco operacional e ampliar adoção.

Os maiores ganhos virão de:
- robustez em `dp()`;
- segurança na análise de valores arbitrários;
- limites de custo em `analyze()`;
- melhor cobertura de testes e compatibilidade cross-platform;
- revisão da tipagem interna e do tratamento de getters.

Se essas melhorias forem implementadas em pequenas entregas, a biblioteca pode evoluir de um utilitário útil para uma ferramenta de depuração mais confiável e profissional.

---

Autor: análise técnica do repositório Justino-code/dumpkit
Data: 2026-09-28
