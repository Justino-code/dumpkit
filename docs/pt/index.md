---
sidebar: true
---

# dumpkit

Debugging sem dependências para Node.js

<div style="text-align: center; margin: 1rem 0 2rem 0;">
  Inspirado no dump() e dd() do Laravel
</div>

<div style="display: flex; gap: 1rem; justify-content: center; margin-bottom: 3rem;">
  <a href="/dumpkit/pt/getting-started" class="btn-primary">Começar</a>
  <a href="https://github.com/justino-code/dumpkit" class="btn-secondary">GitHub</a>
</div>

## Porquê dumpkit?

Já perdeu minutos a tentar entender uma estrutura de dados complexa com `console.log()`?

```js
// O que console.log mostra
console.log(usuario);
// { nome: 'João', endereco: [Object], permissoes: [Object], metadata: [Object] }
// Você não vê o que está dentro! 😫
```

**Com dumpkit:**

```js
import { dump } from 'dumpkit';

dump(usuario);
```

**Saída completa e legível:**

```js
{
  nome: "João",
  endereco: {
    rua: "Rua Augusta",
    cidade: "Lisboa",
    codigoPostal: "1100-053"
  },
  permissoes: ["ler", "escrever", "admin"],
  metadata: Map(2) {
    "criado" => Date(2024-01-15T10:30:00.000Z),
    "ultimoAcesso" => Date(2024-12-20T15:45:00.000Z)
  }
}
```

## Debug que para a execução

Precisa parar o código num ponto específico para inspecionar?

```js
import { dd } from 'dumpkit';

function processarPedido(pedido) {
  // Validação falhou? Para tudo e mostra
  if (!pedido.valido) {
    dd({ erro: 'Pedido inválido', pedido });
  }
  
  // Se chegou aqui, pedido é válido
  return processar(pedido);
}
```

`dd()` = **dump and die** - mostra o valor e termina o processo imediatamente.

## Características

<div class="features">
  <div class="feature">
    <strong>API Simples</strong>
    <p>dump(), dd(), trace(), measure()</p>
  </div>
  <div class="feature">
    <strong>Zero Dependências</strong>
    <p>Sem baggage de npm</p>
  </div>
  <div class="feature">
    <strong>Output Bonito</strong>
    <p>Formatação colorida e legível</p>
  </div>
  <div class="feature">
    <strong>Seguro para Circulares</strong>
    <p>Sem crash em referências circulares</p>
  </div>
  <div class="feature">
    <strong>TypeScript</strong>
    <p>Tipos completos incluídos</p>
  </div>
  <div class="feature">
    <strong>Zero Config</strong>
    <p>Funciona imediatamente</p>
  </div>
</div>

## Instalação

```bash
yarn add dumpkit
```

<style>
.btn-primary {
  display: inline-block;
  background-color: #2c3e50;
  color: white !important;
  padding: 0.5rem 1.25rem;
  border-radius: 6px;
  text-decoration: none !important;
  font-weight: 500;
  font-size: 0.9rem;
}

.btn-primary:hover {
  background-color: #1a2632;
}

.btn-secondary {
  display: inline-block;
  background-color: transparent;
  color: #2c3e50;
  padding: 0.5rem 1.25rem;
  border-radius: 6px;
  text-decoration: none !important;
  font-weight: 500;
  font-size: 0.9rem;
  border: 1px solid #cbd5e1;
}

.btn-secondary:hover {
  background-color: #f1f5f9;
}

@media (prefers-color-scheme: dark) {
  .btn-primary {
    background-color: #475569;
    color: white;
  }
  .btn-primary:hover {
    background-color: #334155;
  }
  .btn-secondary {
    color: #e2e8f0;
    border-color: #475569;
  }
  .btn-secondary:hover {
    background-color: #334155;
  }
}

.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin: 2rem 0;
}

.feature {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 1rem;
  text-align: center;
}

@media (prefers-color-scheme: dark) {
  .feature {
    border-color: #334155;
  }
}

.feature strong {
  display: block;
  margin-bottom: 0.5rem;
}

.feature p {
  font-size: 0.85rem;
  color: #64748b;
  margin: 0;
}

@media (prefers-color-scheme: dark) {
  .feature p {
    color: #94a3b8;
  }
}
</style>
