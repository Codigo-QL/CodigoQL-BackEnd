# CódigoQL - Backend

Este é o backend do projeto **CódigoQL**, responsável por fornecer a API e a lógica de negócio para interação com o banco de dados relacional.

## 📋 Pré-requisitos

Antes de rodar o projeto, certifique-se de ter instalado:

- [Node.js 20+](https://nodejs.org/)
- [npm](https://www.npmjs.com/)
- Banco de dados do repositório **CodigoQL-DataBase** configurado e em execução.

## ⚙️ Configuração do projeto

1. **Instalar dependências**
   ```bash
   npm install
   ```

2. **Configurar o Prisma**
   - Com o banco de dados do repositório **CodigoQL-DataBase** já configurado e rodando:
     ```bash
     npx prisma db pull
     npx prisma generate
     ```
   - O comando `npx prisma db pull` atualiza o schema do Prisma de acordo com o banco de dados existente.
   - O comando `npx prisma generate` gera o cliente Prisma para interação com o banco.

3. **Manter o Prisma atualizado**
   - Sempre que houver mudanças no banco de dados, rode novamente:
     ```bash
     npx prisma db pull
     npx prisma generate
     ```

## 🚀 Rodando o projeto

Para iniciar o backend localmente:

```bash
npm run start
```