# Usamos la imagen oficial de Node.js
FROM node:18

# Establecer el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar archivos del proyecto
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar todo el código del backend
COPY . .

# Exponer el puerto que usa la API
EXPOSE 3000

# Comando para ejecutar la aplicación
CMD ["node", "server.js"]
