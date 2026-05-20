# Contribuir para o nodedump

Antes de mais, obrigado por considerares contribuir para o nodedump! 🎉

## Filosofia

Antes de contribuir, compreende os princípios fundamentais do nodedump:

- **Zero dependências** – Sem pacotes externos. Nunca.
- **Zero configuração** – Sem variáveis de ambiente, sem ficheiros de configuração. Funciona imediatamente.
- **Simples por design** – Preferir clareza sobre soluções complexas.
- **Separação de preocupações** – Gerar output de debug sem se preocupar para onde vai.
- **Funcional sobre OOP** – Funções puras, sem classes, sem efeitos secundários quando possível.

Se a tua contribuição se alinhar com estes princípios, estás no lugar certo.

## Código de Conduta

Ao participar neste projeto, concordas em manter um ambiente respeitoso e construtivo para todos.

## Como Posso Contribuir?

### Reportar Bugs

Antes de criar um relatório de bug, verifica as issues existentes para evitar duplicados.

**Um bom relatório de bug inclui:**
- Versão do Node.js
- Sistema operativo
- Comportamento esperado vs real
- Exemplo mínimo de código para reproduzir
- Mensagens de erro relevantes

### Sugerir Melhorias

Aceitamos sugestões! Inclui:
- Uma descrição clara da funcionalidade
- Exemplos de uso
- Porque é que isto se alinha com a filosofia do projeto
- Porque seria valioso para outros

### Pull Requests

1. Faz fork do repositório
2. Cria uma branch de feature (`git checkout -b feature/nova-funcionalidade`)
3. Faz commit das alterações (`git commit -m 'feat: adicionar nova funcionalidade'`)
4. Faz push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abre um Pull Request

## Setup de Desenvolvimento

```bash
# Clonar o repositório
git clone https://github.com/justino-code/nodedump.git
cd nodedump

# Instalar dependências
yarn install

# Executar testes
yarn test

# Executar testes em modo watch
yarn test --watch

# Build do projeto
yarn build

# Executar documentação localmente
yarn docs:dev
```

## Estrutura do Projeto

```
nodedump/
├── src/           # Código fonte
│   ├── shared/    # Utilitários e tipos partilhados
│   ├── core/      # Lógica core de formatação
│   ├── dump/      # dump() e dd()
│   ├── trace/     # trace()
│   └── measure/   # measure()
├── tests/         # Ficheiros de teste
├── docs/          # Documentação (VitePress)
│   ├── pt/        # Português
│   └── en/        # Inglês
└── dist/          # Output do build
```

## Diretrizes de Código

- **TypeScript** – Todo o código deve ser tipado
- **Testes** – Incluir testes para novas funcionalidades
- **Sem dependências** – Manter a biblioteca com zero dependências
- **Sem classes** – Preferir funções puras e tipos simples
- **Sem variáveis de ambiente** – Toda a configuração via parâmetros de função
- **Documentação** – Atualizar docs para qualquer alteração na API (PT e EN)

## Testes

```bash
# Executar todos os testes
yarn test:run

# Executar com cobertura
yarn test:coverage

# Executar ficheiro específico
yarn test tests/core/inspect.test.ts
```

## Documentação

A documentação usa VitePress com suporte i18n (Português e Inglês).

```bash
# Executar docs localmente
yarn docs:dev

# Build dos docs
yarn docs:build
```

Ao adicionar ou alterar funcionalidades, atualiza a documentação em Português (`docs/pt/`) e Inglês (`docs/en/`).

## Mensagens de Commit

Usa mensagens de commit claras e descritivas:

- `feat:` – Nova funcionalidade
- `fix:` – Correção de bug
- `docs:` – Alterações na documentação
- `test:` – Atualizações de testes
- `chore:` – Tarefas de manutenção
- `refactor:` – Refatoração de código

Exemplo: `feat: adicionar suporte para inspeção de WeakMap`

## Licença

Ao contribuir, concordas que as tuas contribuições serão licenciadas sob a MIT License.