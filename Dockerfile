# Etapa de build
FROM node:20 AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY tsconfig.json ./
COPY prisma ./prisma               
COPY src ./src

RUN npx prisma generate            
RUN npm run build                  

# Etapa final para Lambda
FROM public.ecr.aws/lambda/nodejs:20

WORKDIR /var/task

COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules   
COPY --from=build /app/package*.json ./
COPY --from=build /app/prisma ./prisma              

# Lambda CMD (handler do container)
CMD ["dist/lambda.handler"]
