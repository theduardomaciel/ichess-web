<h1 align="center">
    IChess - Web
</h1>

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="/.github/cover.png">
  <source media="(prefers-color-scheme: light)" srcset="/.github/cover_light.png">
    <img alt="Main project cover" src="/.github/cover_light.png">
</picture>

<br />

## 💻 Projeto

Uma dashboard para o controle da frequência dos membros do projeto de extensão IChess.

#### 🧭 Disponível para Web

> [!NOTE]
> O design do frontend do projeto [está disponível no Figma](https://www.figma.com/file/DKXZoEFnCNbtVV6XGPXGv0/Design?type=design&node-id=0:1&mode=design&t=Fkxlh0xGwJ7xfDvd-1).

<br />

## ✨ Tecnologias

- `[Base]` Next.js
- `[Estilização]` TailwindCSS + Shadcn
- `[Banco de dados]` Neon (PostgreSQL)
- `[Hospedagem]` Vercel

> [!WARNING]
> O projeto ainda está em desenvolvimento, portanto, diversos aspectos estarão inacabados e/ou não funcionais à medida que a aplicação torna-se mais robusta.

<br />

## 🧠 Princípios

1.  Estar funcional o quanto antes, para a utilização das atividades do IChess.
2.  Ser o mais genérico possível, no bom sentido, em relação à possibilidade de reutilização das interfaces e sistemas para outros projetos de extensão, no futuro, com a alteração de poucos componentes.

<br />

## 🚧 Roadmap

- [x] Implementar o frontend de todas as páginas
- [x] Verificar a possibilidade da conversão do repositório em um monorepo

<br />

## 👣 Como iniciar o projeto

Antes mesmo de clonar o código do projeto, é necessário instalar algumas dependências globalmente. Recomendamos o uso do `pnpm` por sua disponibilidade em todas as principais plataformas (Windows, Linux e Mac) e sua velocidade quando comparado ao `npm` tradicional.
Caso o `pnpm` não esteja instalado, é possível [https://pnpm.io/installation](baixá-lo aqui).

1. Para o correto funcionamento da aplicação, instale as seguintes dependências:

```
pnpm install --global turbo dotenv-cli
```

2. Após instalar as dependências globais, clone o repositório e utilize `pnpm install` para instalar as dependências do projeto.

3. Com tudo instalado, basta acessar o projeto por meio de um editor de texto ou IDE de preferência, como o VSCode:
  ```
  cd ichess
  code .
  ```

  > [!WARNING]
  > Após a instalação das dependências, certifique-se de reiniciar tudo que possa estar carregando o projeto no momento, como o VSCode ou terminais.

4. Em seguida, adicione o arquivo `.env` com as variáveis de ambiente adequadas para todos os pacotes (`/packages`) e aplicações (`/apps`), com base nos arquivos de exemplo `.env.example`.  
Esse passo é essencial para o correto funcionamento dos pacotes e aplicações do monorepo. 

5. Para dar início ao servidor local de desenvolvimento, utilize `pnpm dev`

<br />

## 🎲 Dados

Para a migração de um novo esquema para o banco de dados, utilize `pnpm db:generate` para a criação do arquivo `.sql` com a migração, e em seguida `pnpm db:migrate` para enviar os dados para a rede.  
Para a visualização do banco de dados, utilize `pnpm db:studio`

> [!WARNING]
> Execute esse comando sempre na raiz do projeto para evitar erros com variáveis de ambiente.

## 🧹 Limpeza de dependências

```bash
pnpm dlx rimraf --glob **/node_modules
```

<br />

## 📝 Licença

Este projeto utiliza a MIT License. Veja o arquivo de [LICENÇA](LICENSE) para mais detalhes.
