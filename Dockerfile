# Etapa de construcción con Node.js
FROM node:18-alpine as build

WORKDIR /app
COPY . .  
RUN npm install && npm run build  

# Etapa para servir con Node.js
FROM node:18-alpine

WORKDIR /app

# Copiar los archivos construidos de la etapa anterior
COPY --from=build /app/dist /usr/share/nginx/html  

# Instalar 'serve' para servir la aplicación
RUN npm install -g serve

# Exponer el puerto 80 (puedes cambiar este puerto si es necesario)
EXPOSE 80

# Iniciar el servidor con el comando 'serve' para servir los archivos estáticos
CMD ["serve", "-s", "/usr/share/nginx/html", "-l", "80"]
