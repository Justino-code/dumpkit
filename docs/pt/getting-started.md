# Começar

## Instalação

```bash
yarn add nodedump
# ou
npm install nodedump
```

## Uso Básico

### Importar o que precisas

```js
import { dump, dd, inspect, trace, measure } from 'nodedump';
```

### Dump de um valor

```js
const user = { nome: 'João', idade: 30, tags: ['admin', 'user'] };

dump(user);
```

**Output:**
```
{
  nome: "João",
  idade: 30,
  tags: ["admin", "user"]
}
```

### Dump e parar (dump and die)

```js
dd(user); // Mostra o valor e termina o processo
```

### Obter string formatada sem imprimir

```js
const output = inspect(user);
console.log('Debug:', output);
```

### Traçar fluxo de execução

```js
function autenticar() {
  trace('auth-user');
  // ... lógica de autenticação
}

autenticar();
```

**Output:**
```
[Trace] auth-user at src/auth.ts:42:12
```

### Medir performance

```js
// Síncrono
measure('ordenar-array', () => {
  return array.sort();
});

// Assíncrono
await measure('consulta-db', async () => {
  return await database.find({ id: 1 });
});
```

**Output:**
```
[Measure] ordenar-array: 2.35ms
[Measure] consulta-db: 45.23ms
```

## Próximos Passos

- Consulta a [Referência da API](/pt/api/dump) para opções detalhadas
- Vê [Exemplos](/pt/guide/examples) para usos avançados
- Lê sobre a [Filosofia](/pt/guide/philosophy) por trás do nodedump