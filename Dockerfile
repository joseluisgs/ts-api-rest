# Imgen
FROM node:14-alpine

# Opcional Crear estos directorios garantizará que tengan los permisos deseados,
# lo que será importante al crear módulos de nodo locales en el contenedor con npm install.
# Además de crear estos directorios, estableceremos la propiedad sobre ellos a nuestro usuario node
# RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

# app como directorio de trabajo
WORKDIR /app

# copiar 'package.json' y 'package-lock.json' (si están disponibles)
COPY package*.json ./

# Instalamos las dependencias
RUN npm install
# Si es nuestro docker de producción, lo hacemos así
# RUN npm ci --only=production

# Bundle del código de la app, este es la parte opcional si no usar la línea posterior comentada
# COPY --chown=node:node . .
COPY . .

# Si queremos hacer el build aquí, si no deberíamos copiar solo el directorio /dist
RUN npm run build

# Exponemos el puerto del servidor
EXPOSE 8000

# Ejecutamos el comando en dist, pero en el resto del contenedor tenemos el resto de código (ver COPY)
CMD [ "node", "build/index.js" ]

# Para subirla al registro, primero le ponemos una tag
# docker build -t joseluisgs/joseluisgs/ts-api-rest .
# Subirla:
# docker push joseluisgs/ts-api-rest
# Ejecutarla: 
# docker run -it -p 8000:8000 --rm --name ts-api-rest-1 joseluisgs/ts-api-rest