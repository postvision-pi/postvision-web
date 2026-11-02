# Ambiente local com web, API e MongoDB

Este arquivo complementa a implementação IEC da API: Dockerfile, compose.yaml,
/health e seed devem estar aplicados no backend antes de iniciar o ambiente completo.
O web acrescenta seu próprio Dockerfile e compose.web.yaml. Cada repositório mantém
seus arquivos, commits e CI.

## Pastas

Os clones devem estar lado a lado:

| Pasta | Arquivos necessários |
|---|---|
| postvision-api | Dockerfile, compose.yaml e seed da API |
| postvision-web | Dockerfile e compose.web.yaml deste pacote |

Você pode renomear a pasta local do clone, sem alterar o remote. Se usar outro nome
para o web, ajuste WEB_CONTEXT no .env da API e o caminho do segundo -f nos comandos.
Todos os caminhos de build são relativos ao primeiro Compose, o da API.

## Configurar

Dentro da pasta da API, copie .env.example para .env caso ainda não exista.
No PowerShell: `Copy-Item .env.example .env`. Preserve um .env que já tenha preenchido.
Defina JWT_SECRET com um valor próprio, por exemplo gerado pelo comando:

```bash
node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
```

O Compose usa esse mesmo segredo para API e web. Confira também no .env da API:

```dotenv
FRONTEND_URL=http://localhost:3000
SEED_PASSWORD=PostVision123!
```

Não é necessário criar .env.local no web para usar este Compose. A comunicação segue:

| Quem chama | Endereço |
|---|---|
| Navegador | http://localhost:3000/api/... |
| Servidor Next.js | http://api:4000/... |
| API | mongodb://mongo:27017/postvision_demo |

A URL interna do backend é passada no build por WEB_API_INTERNAL_URL, cujo padrão é
http://api:4000. O navegador não precisa conhecer esse nome Docker nem a porta da API.
As chamadas públicas para a API do mobile continuam usando o endereço publicado do backend.

O encaminhamento de /api é serializado no build do Next.js. Se mudar o destino
interno, reconstrua o web. Alterar só uma variável no container pronto não o atualiza.
JWT_SECRET entra somente na execução e não é argumento de build.

## Subir e popular o banco

Com Docker Desktop/Engine ativo e Compose v2 com suporte a --wait, execute dentro de
postvision-api. Cada comando está em uma linha e funciona no PowerShell:

```bash
docker compose -f compose.yaml -f ../postvision-web/compose.web.yaml config --quiet
docker compose -f compose.yaml -f ../postvision-web/compose.web.yaml up --build -d --wait --wait-timeout 180
docker compose -f compose.yaml -f ../postvision-web/compose.web.yaml run --rm seed
docker compose -f compose.yaml -f ../postvision-web/compose.web.yaml ps
```

O primeiro comando deve terminar sem erro. Os serviços mongo, api e web devem ficar
saudáveis. O seed é um serviço opcional, executado sob demanda, e termina ao popular.

| URL | Resultado |
|---|---|
| http://localhost:3000 | Interface web |
| http://localhost:3000/health | Saúde do processo web |
| http://localhost:3000/api/health | Saúde da API, passando pelo encaminhamento do web |
| http://localhost:4000/health | Saúde da API diretamente |

Entre com demo@postvision.local e a senha inicial PostVision123! (ou a SEED_PASSWORD
usada na primeira execução). A segunda conta é bruno@postvision.local, com a mesma
senha inicial. O seed não duplica registros e não troca a senha de contas já criadas.

O MongoDB do Compose é local, usa postvision_demo e persiste no volume da API.
O seed continua no backend; o frontend não acessa o MongoDB nem precisa de outro seed.

## Parar, logs e reconstrução

Ainda dentro da pasta da API:

```bash
docker compose -f compose.yaml -f ../postvision-web/compose.web.yaml logs -f web api
docker compose -f compose.yaml -f ../postvision-web/compose.web.yaml down
docker compose -f compose.yaml -f ../postvision-web/compose.web.yaml up --build -d --wait web
```

O último comando reconstrói o frontend quando necessário. down preserva o banco;
down -v apaga o volume local e os dados nele, e não é necessário para atualizar o web.
Use os dois -f também para encerrar o ambiente completo.

| Variável no .env da API | Padrão | Quando alterar |
|---|---|---|
| WEB_PORT | 3000 | Porta pública do web; ajustar FRONTEND_URL junto |
| API_PORT | 4000 | Porta pública do backend; não muda api:4000 na rede interna |
| WEB_CONTEXT | ../postvision-web | Se a pasta local do web tiver outro nome |
| WEB_API_INTERNAL_URL | http://api:4000 | Se alterar serviço/porta INTERNA da API; reconstruir o web |

O valor de API_INTERNAL_URL do seu .env.local é usado fora do Docker. Ele não substitui
a configuração de build acima. Dentro do container, localhost é o próprio container.
Se alterar API_PORT, ajuste também PUBLIC_API_URL da API quando usar URLs de fotos.

As funcionalidades básicas funcionam com web, API e banco. Fotos ainda precisam do
PostVision Files externo. A câmera precisa de permissão e dos downloads do MediaPipe.
O ambiente de demonstração em localhost é aceito pelo navegador para acesso à câmera.

O CI de cada repositório continua independente. O da API usa somente seu compose.yaml;
o do web constrói e verifica a imagem web. O teste dos três serviços segue este guia.

Referências: [Compose com vários arquivos](https://docs.docker.com/compose/how-tos/multiple-compose-files/merge/)
e [rewrites do Next.js](https://nextjs.org/docs/app/api-reference/config/next-config-js/rewrites).
