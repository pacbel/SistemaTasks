# Sistema de Gestão Clínica - Documentação Técnica

Este documento contém a especificação técnica do Sistema de Gestão Clínica para a Fundação Guimarães Rosa, com funcionalidade para acompanhamento de progresso compartilhado entre todos os usuários.

## Estrutura do Projeto

- `index.html` - Documento principal com a especificação técnica
- `styles.css` - Estilos do documento
- `script.js` - Lógica de interação e gerenciamento de progresso
- `server.js` - Servidor para armazenamento centralizado do progresso
- `package.json` - Configuração de dependências

## Guia de Instalação e Implantação

### Pré-requisitos

- Node.js (versão 14 ou superior) - [Download Node.js](https://nodejs.org/)
- NPM (geralmente instalado com o Node.js)

### Instalação Local (Ambiente de Desenvolvimento)

1. Baixe ou clone os arquivos para sua máquina local
2. Abra um terminal/prompt de comando na pasta do projeto
3. Instale as dependências:

```bash
npm install
```

4. Inicie o servidor:

```bash
npm start
```

5. Acesse o sistema em: http://localhost:3000

### Implantação em Servidor Compartilhado (Hospedagem Compartilhada)

Se seu servidor de hospedagem suporta Node.js:

1. Faça upload de todos os arquivos para o servidor
2. Conecte-se ao servidor via SSH ou painel de controle
3. Navegue até a pasta do projeto
4. Execute os comandos:

```bash
npm install
npm start
```

5. Configure um serviço de gerenciamento de processos como PM2 para manter o servidor rodando:

```bash
npm install -g pm2
pm2 start server.js
pm2 save # Salva a configuração para reiniciar automaticamente
```

Se seu servidor não suporta Node.js (apenas hospedagem de arquivos estáticos):

1. Modifique o arquivo `script.js` para usar uma solução de armazenamento alternativa, como Firebase Realtime Database
2. Faça upload dos arquivos HTML, CSS e JS modificados

### Implantação em Servidor Dedicado ou VPS

1. Conecte-se ao servidor via SSH
2. Instale o Node.js e o NPM (se ainda não estiverem instalados):

```bash
curl -sL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt-get install -y nodejs
```

3. Clone o repositório ou faça upload dos arquivos
4. Navegue até a pasta do projeto
5. Instale as dependências:

```bash
npm install
```

6. Configure o servidor para iniciar automaticamente com o sistema:

```bash
npm install -g pm2
pm2 start server.js
pm2 startup # Siga as instruções exibidas
pm2 save
```

7. Configure um proxy reverso com Nginx ou Apache:

Exemplo de configuração Nginx:

```nginx
server {
    listen 80;
    server_name seu-dominio.com www.seu-dominio.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

8. Configure HTTPS com Let's Encrypt:

```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d seu-dominio.com -d www.seu-dominio.com
```

### Implantação em Serviços de Nuvem

#### Heroku

1. Crie uma conta no [Heroku](https://heroku.com)
2. Instale o Heroku CLI
3. Adicione um arquivo `Procfile` na raiz do projeto com o conteúdo:

```
web: node server.js
```

4. Inicialize um repositório Git e faça o deploy:

```bash
git init
git add .
git commit -m "Primeira versão"
heroku create
git push heroku master
```

#### Vercel ou Netlify (para a parte frontend)

Para a parte frontend (HTML, CSS, JS), você pode usar Vercel ou Netlify, e para o backend, use um serviço como Heroku ou Railway.

1. Crie uma conta no [Vercel](https://vercel.com) ou [Netlify](https://netlify.com)
2. Conecte seu repositório Git
3. Configure as variáveis de ambiente para apontar para o backend

### Configuração de Porta

Por padrão, o servidor usa a porta 3000. Para alterar, defina a variável de ambiente PORT:

```bash
PORT=8080 npm start
```

Ou modifique a linha no arquivo `server.js`:

```javascript
const PORT = process.env.PORT || 8080;
```

## Funcionalidades

### Armazenamento Centralizado

O sistema agora armazena o progresso em um servidor central, permitindo que todos os usuários visualizem e atualizem o mesmo estado de progresso. Isso facilita o acompanhamento colaborativo das tarefas.

### Backup Local

Caso haja problemas de conexão com o servidor, o sistema mantém um backup local usando localStorage, garantindo que nenhum progresso seja perdido.

### Importação e Exportação

O sistema permite exportar o progresso atual como um arquivo JSON e importar um arquivo de progresso previamente salvo.

## Arquitetura

### Frontend

O frontend utiliza HTML, CSS e JavaScript puro, sem dependências externas. A comunicação com o servidor é feita através da API Fetch.

### Backend

O backend é implementado com Node.js e Express, fornecendo uma API RESTful para armazenar e recuperar o progresso. Os dados são persistidos em um arquivo JSON no servidor.

## API

### GET /api/progress

Retorna o progresso atual armazenado no servidor.

### POST /api/progress

Atualiza o progresso no servidor.

## Segurança

Esta implementação é destinada a ambientes de desenvolvimento ou intranet. Para uso em produção, recomenda-se adicionar:

1. Autenticação de usuários
2. HTTPS
3. Validação mais robusta de entrada
4. Armazenamento em banco de dados em vez de arquivo JSON
