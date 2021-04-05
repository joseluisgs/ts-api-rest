# TypeScrip API REST
Ejemplo de un API REST realizada con TypeScript

[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue)](https://www.typescriptlang.org/)
[![NodeJS](https://img.shields.io/badge/NodeJS-Ready-83BA63)](https://nodejs.org/es/)
[![JS Style](https://img.shields.io/badge/JS%20Style-AirBnB-ff69b4)](https://airbnb.io/javascript)
[![Licence](https://img.shields.io/github/license/joseluisgs/todo-native-script)](./LICENSE)
![GitHub](https://img.shields.io/github/last-commit/joseluisgs/ts-api-rest)

- [TypeScrip API REST](#typescrip-api-rest)
  - [Sobre el proyecto](#sobre-el-proyecto)
  - [Arquitectura y diseño](#arquitectura-y-diseño)
  - [EndPoints](#endpoints)
  - [TDD: JEST](#tdd-jest)
  - [Ejecición](#ejecición)
  - [Despliegue](#despliegue)
    - [Docker](#docker)
    - [Docker Hub](#docker-hub)
  - [Autor](#autor)
  - [Licencia](#licencia)

## Sobre el proyecto

El proyecto consiste en que tengas un ejemplo de API REST pero realizada con TypeScript con el objetivo de mejorar con tipos tus desarrollos.

![assets/image.png](https://hiddenbg.zentica-global.com/wp-content/uploads/2020/12/secure-rest-api-in-nodejs-18f43b3033c239da5d2525cfd9fdc98f.png)

## Arquitectura y diseño
El diseño de esta API REST se corresponde con el patrón Servidor->Enrutador->Controlador->Modelo. 
El Servidor escucha en un puesto diversas peticiones. Las procesa según su ruta o punto de entrada y se las pasa al Enrutador.
El Enrutador analiza la petición dependiendo de la ruta y se la pasa al Controlador correspondiente a dicha ruta que ejecutará el método indicado.
El Controlador realiza el método indicado según la ruta consultando los modelos y almacenamiento para ello.
El Modelo es la estructuración de los datos a tratar.

En todo momento se ofrece información de la petición en base a los códigos de estado HTTP.

## EndPoints
Los Endpoints para conectarse y consumir esta api rest, empiezan siempre por /api/vx/recurso, donde x es a versión de esta api, y recurso es el recurso a consumir, por ejemplo /api/v1/juegos.

| Método | Recurso | Descripción |
| -- | -- | -- |
| GET| /juegos | Obtiene todos las juegos |
| GET | /juegos/id| obtiene el juego con el id indicado |
| Contenido 3-1 | Contenido 3-2 | Contenido 3-3 |

## TDD: JEST
Se ha usado la librería Jest, con TypeScript para realizar los test siguiendo un enfoque TDD y Supertest para testear las peticiones HTTP a la API.

## Ejecición
Tareas que podemos ejecutar dentro de nuestra aplicación. Te recomiendo leer el fichero package.json:
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
```

## Despliegue
### Docker

Esta API se puede desplegar con Docker si te gusta ya sea a través de su Dockerfile o a otraves de Docker Hub, para ello:
```bash
- docker build -t joseluisgs/joseluisgs/ts-api-rest .
- docker run -it -p 8000:8000 --rm --name ts-api-rest-1 joseluisgs/ts-api-rest
```
### Docker Hub
Disponible en: https://hub.docker.com/r/joseluisgs/ts-api-rest


## Autor

Codificado con :sparkling_heart: por [José Luis González Sánchez](https://twitter.com/joseluisgonsan)

[![Twitter](https://img.shields.io/twitter/follow/joseluisgonsan?style=social)](https://twitter.com/joseluisgonsan)
[![GitHub](https://img.shields.io/github/followers/joseluisgs?style=social)](https://github.com/joseluisgs)

## Licencia

Este proyecto esta licenciado bajo licencia **MIT**, si desea saber más, visite el fichero
[LICENSE](./LICENSE) para su uso docente y educativo.
