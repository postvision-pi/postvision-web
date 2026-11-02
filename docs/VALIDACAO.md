# Validação do pacote atualizado

Base oficial: postvision-pi/postvision-web, commit
547cd7d6fae4a5ff25212c81721769ffec45b445 (sincronização feita em 01/11/2026).
Os 101 arquivos da base foram conferidos pelo SHA dos blobs do GitHub.

## Executado

- Instalação com npm pelo lockfile corrigido.
- ESLint sem erros/avisos e TypeScript sem erros.
- 64 testes passando em 8 arquivos: cliente da API, estatísticas, notificações,
  último treino, autenticação, formulários, preferências e histórico.
- Build de produção com Next.js 16.3.1, preservando as dependências da versão atual.
- Runtime standalone via Node.js: páginas públicas, autenticação no proxy,
  imagem e 16 assets estáticos respondendo corretamente.
- Encaminhamento real de /api para um servidor de teste local: GET, POST, query,
  cabeçalho Bearer e corpo JSON preservados.
- YAML do Compose complementar e workflow lidos, com serviços/dependências conferidos.

Os testes unitários simulam a API; a conferência de encaminhamento usa um servidor
HTTP de teste. Não usa usuários reais, produção ou MongoDB. A conferência de token
no proxy usa segredo descartável e não substitui o teste de login da demonstração.

## Conferir no seu ambiente

Docker Engine/CLI não estão instalados neste ambiente. Não foram executados aqui
o build da imagem ou os três containers. O runtime standalone verificado usa o
server.js que a imagem executará, mas isso não substitui o teste do Dockerfile.
O workflow foi escrito e conferido; sua execução no GitHub depende do seu push.

Siga DOCKER-COMPOSE.md para validar a configuração, subir os serviços, rodar o seed
da API e entrar na conta demo. Confira também localhost:3000/api/health para testar
o encaminhamento até o backend. A API deve conter suas etapas de Docker/Compose/seed.

O pacote mantém tema, fontes, idiomas, histórico, relatório, hasSessions, componentes
de gráfico e chamada relativa /api da versão sincronizada. O destino API_INTERNAL_URL
é configurado no build; JWT_SECRET é lido somente quando o servidor executa.
