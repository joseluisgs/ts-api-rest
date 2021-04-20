# TypeScrip API REST
Ejemplo de un API REST realizada con TypeScript. Autenticación, CRUD, transferencia de ficheros. Modos de trabajo en: Memoria, MongoDB o MariaDB. Despliegue en Docker y test con Jest.

[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178c6)](https://www.typescriptlang.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ed)](https://www.docker.com/)
[![NodeJS](https://img.shields.io/badge/NodeJS-Ready-83BA63)](https://nodejs.org/es/)
[![JS Style](https://img.shields.io/badge/JS%20Style-AirBnB-ff69b4)](https://airbnb.io/javascript)
[![Licence](https://img.shields.io/github/license/joseluisgs/todo-native-script)](./LICENSE)
![GitHub](https://img.shields.io/github/last-commit/joseluisgs/ts-api-rest)

- [TypeScrip API REST](#typescrip-api-rest)
  - [Sobre el proyecto](#sobre-el-proyecto)
  - [Arquitectura y diseño](#arquitectura-y-diseño)
  - [Modos de funcionamiento](#modos-de-funcionamiento)
  - [Autenticación y Autorización: JWT y Middleware](#autenticación-y-autorización-jwt-y-middleware)
  - [Validadores de datos](#validadores-de-datos)
  - [EndPoints](#endpoints)
  - [TDD: JEST](#tdd-jest)
  - [Producción y Desarrollo](#producción-y-desarrollo)
  - [Ejecución](#ejecución)
  - [Despliegue](#despliegue)
    - [Docker](#docker)
    - [Docker Compose](#docker-compose)
    - [Docker Hub](#docker-hub)
  - [Versiones con BB.DD](#versiones-con-bbdd)
    - [MongoDB](#mongodb)
      - [Mongo-Express](#mongo-express)
    - [MariaDB](#mariadb)
      - [Adminer](#adminer)
  - [Prueba y consumo](#prueba-y-consumo)
  - [Autor](#autor)
  - [Licencia](#licencia)

## Sobre el proyecto

El proyecto consiste en que tengas un ejemplo de API REST pero realizada con TypeScript con el objetivo de mejorar con tipos tus desarrollos. Además propone el uso de ficheros, autenticación y autorización mediante JWT. Tiene tres modos de uso Memoria, con MongoDB (NoSQL) y MariaDB (SQL). 

Acceso desde: http://localhost:8000.

![assets/image.png](https://hiddenbg.zentica-global.com/wp-content/uploads/2020/12/secure-rest-api-in-nodejs-18f43b3033c239da5d2525cfd9fdc98f.png)

## Arquitectura y diseño
El diseño de esta API REST se corresponde con el patrón Servidor->Enrutador->Controlador->Modelo. 
El Servidor escucha en un puesto diversas peticiones. Las procesa según su ruta o punto de entrada y se las pasa al Enrutador.
El Enrutador analiza la petición dependiendo de la ruta y se la pasa al Controlador correspondiente a dicha ruta que ejecutará el método indicado.
El Controlador realiza el método indicado según la ruta consultando los modelos y almacenamiento para ello.
El Modelo es la estructuración de los datos a tratar.

En todo momento se ofrece información de la petición en base a los códigos de estado HTTP.

## Modos de funcionamiento
Este proyecto está basado en dos modos de funcionamiento en la url: http://localhost:8000. 
- Memoria: Usando almacenamiento en memoria. Lo tienes en la rama Memoria.
- MogoDB: Usando almacenamiento en MogoDB. Lo tienes en la rama MongoDB.
- MariaDB: Usando almacenamiento en MariaDB. Lo tienes en la rama MariaDB.

## Autenticación y Autorización: JWT y Middleware
Se ha implementado un sistema de atenticación y autorización basado en JWT y aplicando un Middleware para analizar si el usuario puede entrar a un recurso, ya sea por que está autenticado para ello (auth), o tiene permisos dependiendo su rol (grant), o dicho recurso le pertenece, si tenemos datos que los relacionen (owner). Se ha jugado con distintas políticas dependiendo del recurso y se puede adaptar a las distintas necesidades del problema. En el código podrás ver distintas soluciones con middleware o dentro del controlador.

## Validadores de datos
Se ha implemedo dos sistemas de validación de campos según los requisitos de los tipos de datos. Por un lado un middleware de validación y por otro, si no queremos hacerlo de esta manera, con funciones auxiliares en el propio controlador.

## EndPoints
Los Endpoints para conectarse y consumir esta api rest, empiezan siempre por /api/vx/recurso, donde x es a versión de esta api, y recurso es el recurso a consumir, por ejemplo /api/v1/juegos desde http://localhost:8000.

| Método | Recurso | Auten/Autor. | Descripción |
| -- | -- | -- | -- |
| POST| user/register | -- | Registra un usuario/a |
| POST| user/login | -- | Se indentifica en el sistema y obtiene token de acceso |
| GET| /user/id | auth | Obtiene los datos del usuario/a con id indicado si pertenece a él/ella |
| PUT| /user/id | auth | Modifica los datos del usuario/a con id indicado si pertenecen a él/ella |
| DELETE| /user/id | auth | Elimina el usuario/a con id indicado si pertenecen a él/ella |
| GET| /juegos | -- | Obtiene todos las juegos |
| GET | /juegos/id | -- | Obtiene el juego con el id indicado |
| POST | /juegos | auth | Añade el juego |
| PUT | /juegos/id | auth, owner | Modifica el juego con el id indicado si pertenece al usuario/a |
| DELETE | /juegos/id | auth  | Elimina el juego con el id indicado si pertenece al usuario/a |
| GET| /files | auth, grant('ADMIN') | Obtiene todos los ficheros. Solo Admin |
| GET | /files/id | auth | Obtiene datos del fichero con el id indicado si pertenece al usuario/a |
| GET | /files/download/id | -- | Descarga el fichero con el id indicado |
| POST | /files | auth | Añade el fichero |
| PUT | /files/id | auth | Modifica el fichero con el id indicado si pertenece al usuario/a |
| DELETE | /files/id | auth | Elimina el fichero con el id indicado si pertenece al usuario/a |


## TDD: JEST
Se ha usado la librería Jest, con TypeScript para realizar los test siguiendo un enfoque TDD y Supertest para testear las peticiones HTTP a la API.

## Producción y Desarrollo 
Es importante que ajustes el fichero .env o que hagas dos de ellos según sea desarrollo o producción y con ello ajustes el docker.compose o la forma de lanzar todo.

## Ejecución
Tareas que podemos ejecutar dentro de nuestra aplicación.

Te recomiendo leer el fichero package.json:
```bash
- npm install: para instalar las dependencias.
- npm start (npm run start): ejecuta el entorno producción.
- npm run dev: compila el TypeScript en busca de errores.
- npm run dev:run: ejecuta el código en podo desarrollo.
- npm run dev:watch: ejecuta el código en modo observador.
- npm run build: construye la versión de distribución/producción (en el directorio build).
- npm test (npm run test): ejecuta todos los test.
- npm run test:coverage: obtiene el índice de cobertura del código.
- npm run test:watch: realiza los test mientras modificas el código.
- npm run test:sec: realiza los test de manera secuencial pues puede dar error al cerrar el servidor.
- npm run docker:mongo: incia sel servidor local MongoDB y Mongo-Express en desarrollo (si estás en su rama)
- npm run docker:mariadb: incia sel servidor local MariaDB y Adminer en desarrollo (Si estás en su rama)
- npm run docker:clean: limpia todos lso dockers
- npm run docker:deploy: lanza el fichero docker-compose para producción
```

## Despliegue
El desppliegue dependerá de la rama.
### Docker
Esta API se puede desplegar con Docker si te gusta ya sea a través de su Dockerfile o a otraves de Docker Hub, para ello:
```bash
- docker build -t joseluisgs/joseluisgs/ts-api-rest .
- docker run -it -p 8000:8000 --rm --name ts-api-rest-1 joseluisgs/ts-api-rest
```
### Docker Compose
Se ha optimizado el uso de contenedores usando Docker Compose y acceder desde http://localhost:8000 . De hecho el almacenamiento se ha implementado en un contenedor de tipo Volumen tanto para la API como para MongoDB. Además permite consultar con Mongo-Empress (http://localhost:8081/).
```bash
- docker-compose up -d
```
### Docker Hub
Disponible en: https://hub.docker.com/r/joseluisgs/ts-api-rest

## Versiones con BB.DD
Las versiones de almacenamiento con BB.DD dependerán de cada rama

### MongoDB
Para probar y hacer pruebas locales con MongoDB puedes usar el fichero mongo.sh, o simplemente ejecutar el compose de MongoDB y Mongo-Express:
```bash
- docker-compose -f mongo-compose.yml up -d
```
#### Mongo-Express
Esta apliación web te permite manejar MongoDB a partir de una interfaz web en: http://localhost:8081/

### MariaDB
Para probar y hacer pruebas locales con MariaDB puedes usar el fichero mariadb.sh, o simplemente ejecutar el compose de MariaDB y Adminer:
```bash
- docker-compose -f maria-compose.yml up -d
```
#### Adminer
Esta apliación web te permite manejar MariaDB a partir de una interfaz web en: http://localhost:8080/

## Prueba y consumo
Puedes probar y consumir la API usando por ejemplo Postman y su [fichero](./TS-API-REST.postman_collection.json).Deberás completar las llamadas que hagan uso de los tokens.

## Autor

Codificado con :sparkling_heart: por [José Luis González Sánchez](https://twitter.com/joseluisgonsan)

[![Twitter](https://img.shields.io/twitter/follow/joseluisgonsan?style=social)](https://twitter.com/joseluisgonsan)
[![GitHub](https://img.shields.io/github/followers/joseluisgs?style=social)](https://github.com/joseluisgs)

## Licencia

Este proyecto esta licenciado bajo licencia **MIT**, si desea saber más, visite el fichero
[LICENSE](./LICENSE) para su uso docente y educativo.
