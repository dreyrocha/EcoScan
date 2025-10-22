# EcoScan ♻️

![EcoScan Preview](https://caminho/para/seu/gif_ou_screenshot.png)

> O EcoScan é uma plataforma full-stack que utiliza inteligência artificial para ajudar os utilizadores a identificar e descartar resíduos corretamente, conectando-os a pontos de coleta e empresas de reciclagem.

## 📋 Índice

- [ℹ️ Sobre o Projeto](#ℹ️-sobre-o-projeto)
- [✨ Principais Funcionalidades](#-principais-funcionalidades)
- [🛠️ Tecnologias Utilizadas](#️-tecnologias-utilizadas)
- [🚀 Como Executar o Projeto](#-como-executar-o-projeto)
- [📄 API Endpoints](#-api-endpoints)
- [📜 Licença](#-licença)
- [👤 Contato](#-contato)

## ℹ️ Sobre o Projeto

O descarte incorreto de resíduos é um grande desafio ambiental. Muitas vezes, a falta de informação clara impede que materiais recicláveis sejam devidamente processados.

O **EcoScan** nasceu para resolver este problema, oferecendo uma ferramenta inteligente e prática que:
1.  **Identifica** o tipo de material através da câmera do telemóvel ou upload de imagem.
2.  **Educa** o utilizador sobre a forma correta de descarte e os benefícios da reciclagem.
3.  **Conecta** o utilizador a empresas e pontos de coleta que reciclam aquele tipo específico de material, incentivando a economia circular.

## ✨ Principais Funcionalidades

-   **Análise de Resíduos via IA:** Envie uma foto ou use a câmera em tempo real para que a IA identifique o objeto e sugira o tipo de material.
-   **Dashboard Pessoal:** Utilizadores registados têm um painel com o histórico de todos os seus scans, visualizando seu impacto positivo através de gráficos.
-   **Busca por Pontos de Coleta:** Com base no material mais descartado, a plataforma sugere empresas próximas que coletam aquele tipo de resíduo.
-   **Painel para Empresas:** Empresas parceiras podem se cadastrar, gerenciar suas informações e registrar o volume de material coletado.
-   **Autenticação Segura:** Sistema completo de login e registo para utilizadores e empresas, com autenticação baseada em JWT.

## 🛠️ Tecnologias Utilizadas

Este projeto é um monorepo dividido em duas partes principais:

### Back-end (`api-ecoscan`)

-   **Runtime:** Node.js
-   **Framework:** Express.js
-   **Linguagem:** TypeScript
-   **Banco de Dados:** PostgreSQL (com Docker)
-   **Autenticação:** JSON Web Tokens (JWT)
-   **Validação:** Zod
-   **Inteligência Artificial:** Python (`ia_inference.py`) com PyTorch/Torchvision para inferência de objetos.

### Front-end (`ecoscan-project`)

-   **Framework:** React.js
-   **Bundler:** Vite
-   **Roteamento:** React Router
-   **Requisições HTTP:** Axios
-   **Gráficos:** Chart.js
-   **Detecção no Cliente (Live):** TensorFlow.js (Coco-SSD)

## 🚀 Como Executar o Projeto

Siga os passos abaixo para configurar e rodar o ambiente de desenvolvimento.

### Pré-requisitos

-   [Node.js](https://nodejs.org/en/) (v18 ou superior)
-   [Docker](https://www.docker.com/products/docker-desktop/)
-   Um gerenciador de pacotes ([NPM](https://www.npmjs.com/), [Yarn](https://yarnpkg.com/) ou [Bun](https://bun.sh/))

### Passo a Passo

1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/dreyrocha/EcoScan.git](https://github.com/dreyrocha/EcoScan.git)
    cd EcoScan
    ```

2.  **Configuração do Back-end:**
    ```bash
    # Navegue para a pasta da API
    cd api-ecoscan

    # Crie uma cópia do arquivo de ambiente de exemplo
    # (No Linux/macOS)
    cp .env.example .env
    # (No Windows)
    copy .env.example .env

    # Inicie o container do banco de dados PostgreSQL com Docker
    docker-compose up -d

    # Instale as dependências
    npm install

    # Rode o servidor de desenvolvimento
    npm run dev
    ```
    > O back-end estará rodando em `http://localhost:3000`.

3.  **Configuração do Front-end (em um novo terminal):**
    ```bash
    # Navegue para a pasta do front-end a partir da raiz
    cd ecoscan-project

    # Crie uma cópia do arquivo de ambiente de exemplo
    # (No Linux/macOS)
    cp .env.example .env
    # (No Windows)
    copy .env.example .env
    
    # **IMPORTANTE:** Abra o arquivo .env e configure a variável VITE_API_URL
    # para apontar para o seu backend (ex: VITE_API_URL=http://localhost:3000)

    # Instale as dependências
    npm install

    # Rode o servidor de desenvolvimento
    npm run dev
    ```
    > O front-end estará acessível no endereço fornecido pelo Vite (geralmente `http://localhost:5173`).

## 📄 API Endpoints

Uma visão geral dos principais endpoints disponíveis na API:

-   `POST /users` - Cria um novo utilizador.
-   `POST /login` - Autentica um utilizador e retorna um token.
-   `POST /enterprise` - Cria uma nova empresa.
-   `POST /enterprise/login` - Autentica uma empresa.
-   `POST /api/analyze` - Recebe uma imagem em base64 e retorna a análise da IA.
-   `GET /history` - Retorna o histórico de scans do utilizador autenticado.
-   `GET /enterprise/search?type={material}` - Busca empresas que coletam um tipo de resíduo.

## 📜 Licença

Distribuído sob a licença MIT. Veja `LICENSE` para mais informações.

## 👤 Contato

**Andrey Rocha**

-   LinkedIn: [SEU LINKEDIN](https://www.linkedin.com/in/andrey-rocha-790b6b1a0/)
-   GitHub: [@dreyrocha](https://github.com/dreyrocha)
-   Email: seu.email@exemplo.com