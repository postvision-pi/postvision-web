# PostVision

Sistema de Correção de Postura com Análise de Agachamento via Visão Computacional

O **PostVision** é um aplicativo desenvolvido em **Next.js** que utiliza **visão computacional** para analisar a postura do usuário durante o exercício de **agachamento**, auxiliando na correção de movimentos incorretos e promovendo treinos mais seguros e eficientes.

---

## Arquitetura do Projeto

| Camada | Tecnologia | Hospedagem |
| --- | --- | --- |
| **Frontend** | Next.js (App Router) | Vercel |
| **API** | Node.js + Express | Render |
| **Banco de dados** | MongoDB | MongoDB Atlas |

O navegador chama `/api` no frontend. O Next.js encaminha essas chamadas para a API configurada em `API_INTERNAL_URL`, local ou hospedada. A API é responsável pela lógica de negócio e acesso ao MongoDB.

---

## Acesso

A aplicação está disponível em produção na Vercel:
**[postvision.vercel.app](https://postvision.vercel.app)**

---

## Como executar localmente

### 1. Clone o repositório

```bash
git clone https://github.com/postvision-pi/postvision-web.git
cd postvision-web
```

### 2. Configure as variáveis de ambiente

Crie um arquivo `.env.local` na raiz do projeto com base no `.env.example`:

```bash
cp .env.example .env.local
```

Preencha as variáveis:

```env
# URL interna da API usada pelo proxy do Next.js
# Em desenvolvimento: endereço local da API
# Em produção: URL do serviço da API
API_INTERNAL_URL=http://localhost:4000

# Segredo JWT (deve ser igual ao configurado na postvision-api)
JWT_SECRET=seu_jwt_secret_aqui
```

### 3. Instale as dependências

```bash
npm ci
```

### 4. Execute o projeto

```bash
npm run dev
```

O servidor será iniciado em:

http://localhost:3000

> Certifique-se de que a [postvision-api](https://github.com/postvision-pi/postvision-api) esteja disponível no endereço configurado em `API_INTERNAL_URL`.

---

## Tecnologias Utilizadas

| Tecnologia | Descrição |
| --- | --- |
| **Next.js** | Framework React com renderização híbrida (SSR e SSG). |
| **TypeScript** | Tipagem estática e segurança no desenvolvimento. |
| **Node.js + Express** | Backend da API hospedado no Render. |
| **MongoDB Atlas** | Banco de dados NoSQL em nuvem. |

---

## Principais Bibliotecas

### bcryptjs

Biblioteca para criptografia de senhas, garantindo segurança nos dados armazenados.

### jsonwebtoken (JWT)

Usado para autenticação de usuários, gerando tokens seguros para login e controle de sessão.

### Recharts

Biblioteca de gráficos interativos em React, utilizada para exibir estatísticas dos treinos, comparativos e desempenhos do usuário.

### MediaPipe

Usado para análise de postura e detecção de landmarks corporais, possibilitando a avaliação da execução dos agachamentos em tempo real.

### Iconify

Biblioteca de ícones universais, integrada ao design do sistema para compor uma interface moderna e intuitiva.

## IEC — ambiente e verificações

Esta sequência parte da versão oficial sincronizada em `547cd7d` e mantém tema,
tamanho da fonte, idioma, histórico, relatório e dashboard existentes.
Use Node.js 24 e npm 11 ou superior. O gerenciador adotado para CI e Docker é npm;
`package-lock.json` é o lockfile utilizado. Os arquivos de pnpm foram retirados.

```bash
npm ci
npm run type-check
```

`npm run check` é um atalho para a checagem de tipos. O navegador continua usando
`/api`, encaminhado pelo Next.js para `API_INTERNAL_URL`. No `.env.local`, defina a
porta em que sua API está executando (por exemplo, `http://localhost:4000`).
Mantenha o mesmo `JWT_SECRET` da API. Não copie o `.env.local` para o Git.


### Lint

```bash
npm run lint
npm run lint:fix
```

ESLint usa a configuração flat do Next.js 16 e reprova erros e avisos. As exceções
locais dos providers permitem restaurar dados externos após a hidratação. As regras
de dependências dos efeitos continuam ativas. Os tipos dos landmarks e do relatório
substituem os `any` existentes sem retirar o relatório ou outras funcionalidades.


### Testes unitários

```bash
npm test
npm run test:watch
```

Vitest + Testing Library simulam o navegador e as respostas da API. O cliente mantém
`/api`, incluindo a listagem de sessões usada no histórico e no relatório. Os testes
cobrem armazenamento/remoção de token, UTF-8, JSON, Bearer e falhas HTTP/rede.


Os providers verificam respostas HTTP e ignoram consultas antigas após sair da conta.
O estado `hasSessions`, as médias e os componentes de carregamento/ausência de dados
da versão sincronizada continuam disponíveis. O último treino usa `lastSession`,
sem confundir uma sessão com a soma de vários treinos em um dia.


### Autenticação, preferências e histórico

O segredo JWT é lido na execução do servidor, permitindo construir a imagem sem
credenciais. O proxy continua protegendo Status, Profile e Settings. Os testes
verificam assinatura/expiração, login, cadastro, restauração de preferências e
histórico de sessões. O campo de gênero do cadastro envia `Outro`, aceito pela API.
As telas públicas continuam claras mesmo quando o tema escuro está salvo.


### Docker do web

```bash
docker build --build-arg API_INTERNAL_URL=http://host.docker.internal:4000 -t postvision-web:local .
docker run --rm --name postvision-web -p 127.0.0.1:3000:3000 --env-file .env.local postvision-web:local
```

O exemplo acima conecta o container a uma API já executando no computador, usando
Docker Desktop. Em Docker Engine no Linux, acrescente ao `docker run` a opção
`--add-host=host.docker.internal:host-gateway`. Para API e banco também em containers,
use o Compose da próxima etapa; ele constrói com o destino interno `http://api:4000`.

`API_INTERNAL_URL` entra no **build** porque o Next serializa os rewrites na saída
standalone. Mudar esse destino exige reconstruir a imagem; trocar apenas uma variável
no container pronto não reconfigura esse encaminhamento. O navegador continua em
`/api` e não precisa resolver `api:4000`. O segredo JWT entra apenas na execução.

A imagem usa estágios e usuário sem privilégios. Copia standalone, public e assets;
`GET /health` verifica o processo web. A checagem da API/banco continua separada.
O build usa o download de fontes Google já existente no projeto. A câmera mantém
o modelo/WASM externo do MediaPipe e a permissão do navegador.

Referências: [rewrites](https://nextjs.org/docs/app/api-reference/config/next-config-js/rewrites)
e [standalone](https://nextjs.org/docs/app/api-reference/config/next-config-js/output).

### Compose completo

[O guia de Compose](docs/DOCKER-COMPOSE.md) explica as pastas irmãs, o ambiente da API,
o banco local, o seed e os comandos para iniciar os três serviços. compose.web.yaml
complementa o compose.yaml do backend sem substituir os arquivos da API.


### CI no GitHub

O workflow CI do Web roda em push, pull request e execução manual pela aba Actions.
O primeiro job instala pelo lockfile e executa lint, tipos, testes unitários e build
Next.js. O segundo depende do primeiro: constrói a imagem Docker e confere por HTTP
saúde, páginas, assets e proteção de rotas. Usa valores descartáveis próprios do CI,
sem Secrets de produção, Atlas ou checkout do backend. O job Docker testa somente
o web; o teste com os três serviços usa o guia de Compose.

Para conferir um web executando, com JWT_SECRET no .env.local:

```bash
npm run test:smoke
```

Com o ambiente Compose ativo, execute a partir do web para ler o segredo da API:

```bash
node --env-file=../postvision-api/.env scripts/smoke-web.mjs
```

SMOKE_WEB_URL muda o endereço/porta da conferência. Para conferir também a API via
/api/health, defina SMOKE_CHECK_API=true. No PowerShell:

```powershell
$env:SMOKE_CHECK_API = "true"
node --env-file=../postvision-api/.env scripts/smoke-web.mjs
Remove-Item Env:SMOKE_CHECK_API
```

A checagem HTTP usa token sintético apenas para o proxy, não login real no backend.
Não publica imagem, não altera o deploy da Vercel e não faz gravações no banco.
Depois do push, confira os dois jobs em Actions → CI do Web.
As verificações executadas na preparação estão em [VALIDACAO.md](docs/VALIDACAO.md).
