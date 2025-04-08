# Etapa de construcción con Node.js
FROM node:18-alpine as build

WORKDIR /app
COPY . .  
RUN npm install && npm run build 

# Etapa para servir con Node.js
FROM node:18-alpine

WORKDIR /app

# Copiar los archivos construidos de la etapa anterior
COPY --from=build /app/build /usr/share/nginx/html 

# Instalar un servidor Express para servir la aplicación React
RUN npm install -g serve

# Exponer el puerto 80
EXPOSE 80

# Iniciar el servidor con el comando 'serve' para servir los archivos estáticos en el puerto 80
CMD ["serve", "-s", "/usr/share/nginx/html", "-l", "80"]
