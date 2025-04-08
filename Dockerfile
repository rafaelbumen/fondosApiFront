# Etapa de construcción con Node.js
FROM node:18-alpine as build

WORKDIR /app
COPY . .  
RUN npm install && npm run build  

# Etapa para servir la aplicación con Node.js
FROM node:18-alpine

WORKDIR /app

# Copiar los archivos construidos de la etapa anterior
COPY --from=build /app/dist /app/dist 

# Exponer el puerto 80
EXPOSE 80

# Instalar 'serve' para servir la aplicación
RUN npm install -g serve

# Comando para iniciar la app usando serve
CMD ["serve", "-s", "/app/dist", "-l", "80"]
