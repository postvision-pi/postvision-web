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

O frontend se comunica exclusivamente com a API hospedada no Render. A API é responsável por toda a lógica de negócio e acesso ao banco.

---

## Acesso

A aplicação está disponível em produção na Vercel:
**[postvision.vercel.app](https://postvision.vercel.app)**

---

## Como executar localmente

### 1. Clone o repositório

```bash
git clone https://github.com/renanzanettio/web-postvision.git
cd web-postvision
```

### 2. Configure as variáveis de ambiente

Crie um arquivo `.env.local` na raiz do projeto com base no `.env.example`:

```bash
cp .env.example .env.local
```

Preencha as variáveis:

```env
# URL da API (postvision-api)
# Em desenvolvimento: endereço local da API
# Em produção: URL do serviço no Render
NEXT_PUBLIC_API_URL=http://localhost:4000

# Segredo JWT (deve ser igual ao configurado na postvision-api)
JWT_SECRET=seu_jwt_secret_aqui
```

> **Atenção:** `NEXT_PUBLIC_API_URL` é lida em **build time**. Sempre que alterar esse valor em produção, é necessário fazer um novo deploy para que a mudança entre em vigor.

### 3. Instale as dependências

```bash
npm install
```

### 4. Execute o projeto

```bash
npm run dev
```

O servidor será iniciado em:

http://localhost:3000

> Certifique-se de que a [postvision-api](https://github.com/renanzanettio/postvision-api) também está rodando localmente ou aponte `NEXT_PUBLIC_API_URL` para o serviço no Render.

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