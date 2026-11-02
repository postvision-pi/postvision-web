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
API_INTERNAL_URL=http://localhost:3001

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
