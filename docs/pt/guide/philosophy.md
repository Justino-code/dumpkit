# Filosofia

## Separação de Preocupações

O dumpkit é construído sobre um princípio simples:

> **Gerar output de debug sem se preocupar para onde vai.**

Isto significa:

- `inspect()` retorna uma string - pura, sem efeitos secundários
- `dump()` usa `inspect()` + escreve para stderr
- O mesmo núcleo pode ser reutilizado para diferentes outputs (terminal, HTTP, ficheiros)

## Zero Configuração

Sem variáveis de ambiente. Sem ficheiros de configuração. Sem surpresas.

- Cores detectam automaticamente baseado no TTY (mas podes forçar)
- Sem verificações de `NODE_ENV` - tu controlas quando chamar o dumpkit
- Sem dependências externas - mantém o teu projeto leve

## API Previsível

Cada função faz exatamente o que esperas:

| Função | O que faz |
|--------|-----------|
| `dump()` | Imprime e continua |
| `dd()` | Imprime e termina o processo |
| `inspect()` | Retorna string formatada |
| `trace()` | Mostra onde estás no código |
| `measure()` | Mede tempo de execução |

## Porquê não usar apenas console.log?

| Funcionalidade | console.log | dumpkit |
|----------------|-------------|----------|
| Formatação bonita | ❌ | ✅ |
| Referências circulares | 💥 Crash | ✅ Seguro |
| Suporte a Map/Set | `Map(3)` | ✅ Expansão completa |
| Controlo de profundidade | ❌ | ✅ |
| Encadeamento | ❌ | ✅ (dump) |
| Stack traces | ❌ | ✅ (trace) |
| Temporização | ❌ | ✅ (measure) |
| Dump e parar | ❌ | ✅ (dd) |

## Extensibilidade

A separação limpa permite que qualquer pessoa construa em cima:

### Exemplo: Debugger HTTP personalizado

```js
import { inspect } from 'dumpkit';

app.get('/debug/estado', (req, res) => {
  const estado = inspect(app.state);
  res.json({ debug: estado });
});
```

### Exemplo: Logger para ficheiro

```js
import { inspect } from 'dumpkit';
import { appendFile } from 'fs/promises';

await appendFile('debug.log', inspect(dados));
```

### Exemplo: Middleware de debug

```js
import { dump } from 'dumpkit';

app.use((req, res, next) => {
  dump({ method: req.method, url: req.url });
  next();
});
```

## Design Minimalista

O dumpkit faz uma coisa e faz bem: **debugging**.

- Não faz logging estruturado (usa Pino/Winston para isso)
- Não faz tracing distribuído (usa OpenTelemetry para isso)
- Não faz dashboards (usa Datadog/NewRelic para isso)

Mas podes **combinar** o dumpkit com essas ferramentas - o `inspect()` dá-te a string formatada que podes enviar para qualquer lado.