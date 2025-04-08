# Etapa de construcción con Node.js
FROM node:18-alpine as build

WORKDIR /app
COPY . .  
RUN npm install && npm run build  # Ejecuta el build de la app React

# Etapa para servir con NGINX
FROM nginx:alpine

# Copiar el archivo de configuración de NGINX
COPY nginx.conf /etc/nginx/nginx.conf

# Copiar los archivos construidos a la carpeta pública de NGINX
COPY --from=build /app/build /usr/share/nginx/html  # Asegúrate de que sea /build (si usas CRA)

# Exponer el puerto 80
EXPOSE 80

# Iniciar NGINX
CMD ["nginx", "-g", "daemon off;"]
