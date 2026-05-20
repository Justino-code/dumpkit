# Exemplos

## Estruturas de Dados Complexas

### Objetos Aninhados

```js
const usuario = {
  id: 1,
  nome: 'João Silva',
  email: 'joao@exemplo.com',
  perfil: {
    idade: 30,
    cidade: 'Lisboa',
    endereco: {
      rua: 'Rua Augusta',
      codigoPostal: '1100-053'
    }
  },
  interesses: ['programação', 'música', 'fotografia']
};

dump(usuario);
```

### Map e Set

```js
const permissoes = new Map([
  ['admin', ['criar', 'ler', 'atualizar', 'eliminar']],
  ['user', ['ler']]
]);

const tags = new Set(['nodejs', 'debugging', 'opensource']);

const config = {
  permissoes,
  tags,
  meta: {
    versao: '1.0.0',
    ambiente: 'desenvolvimento'
  }
};

dump(config);
```

## Referências Circulares

O nodedump lida automaticamente com objetos que referenciam a si próprios:

```js
const pessoa = { nome: 'João' };
const empresa = { nome: 'TechCorp', dono: pessoa };
pessoa.empresa = empresa;  // Referência circular!

dump(pessoa);
// Output: { nome: "João", empresa: { nome: "TechCorp", dono: [Circular *1] } }
```

## Debugging com trace()

### Localizar onde o código está a falhar

```js
function processarPedido(pedido) {
  trace('processar-pedido-inicio');
  
  if (!pedido.valido) {
    trace('pedido-invalido');
    return { erro: 'Pedido inválido' };
  }
  
  trace('processar-pedido-fim');
  return { sucesso: true };
}
```

### Mostrar stack completo

```js
function nivel3() {
  trace('chamada-profunda', { showStack: true });
}

function nivel2() {
  nivel3();
}

function nivel1() {
  nivel2();
}

nivel1();
// Mostra toda a cadeia de chamadas
```

## Medir Performance

### Operações síncronas

```js
function ordenarGrandeArray() {
  const arr = Array.from({ length: 100000 }, () => Math.random());
  return arr.sort();
}

const ordenado = measure('ordenacao-grande-array', () => ordenarGrandeArray());
```

### Operações assíncronas

```js
async function buscarUsuarios() {
  const response = await fetch('https://api.exemplo.com/usuarios');
  return response.json();
}

const usuarios = await measure('buscar-usuarios-api', () => buscarUsuarios());
```

### Comparar diferentes abordagens

```js
// Abordagem 1: for loop
measure('for-loop', () => {
  let soma = 0;
  for (let i = 0; i < 1000000; i++) {
    soma += i;
  }
  return soma;
});

// Abordagem 2: reduce
measure('array-reduce', () => {
  const arr = Array.from({ length: 1000000 }, (_, i) => i);
  return arr.reduce((acc, val) => acc + val, 0);
});
```

## Controlo de Output

### Desligar cores

```js
dump(objeto, { colors: false });
```

### Limitar profundidade

```js
const dadosProfundos = { a: { b: { c: { d: { e: 'muito fundo' } } } } };

dump(dadosProfundos, { depth: 2 });
// Output: { a: { b: [Object] } }
```

### Limpar output para testes

```js
import { inspect } from 'nodedump';

// Num ficheiro de teste
const resultado = funcaoComplexa();
const output = inspect(resultado, { colors: false });
expect(output).toContain('valor-esperado');
```

## Integração com Logger

### Enviar debug para ficheiro

```js
import { inspect } from 'nodedump';
import { writeFileSync } from 'fs';

const estado = {
  timestamp: new Date().toISOString(),
  memoria: process.memoryUsage(),
  uptime: process.uptime()
};

writeFileSync('debug.json', inspect(estado, { colors: false }));
```

### Middleware para Express

```js
import { dump } from 'nodedump';

app.use((req, res, next) => {
  dump({
    method: req.method,
    url: req.url,
    headers: req.headers,
    query: req.query
  });
  next();
});
```

## Debugging Condicional

```js
const DEBUG = process.env.MY_APP_DEBUG === 'true';

function debugOnly(message, data) {
  if (DEBUG) {
    dump({ message, data, timestamp: new Date().toISOString() });
  }
}

debugOnly('Configuração carregada', config);
```

## Combinar com console.time

```js
console.time('operacao');
measure('operacao-medida', () => operacaoPesada());
console.timeEnd('operacao');
// Ambos os métodos funcionam lado a lado
```