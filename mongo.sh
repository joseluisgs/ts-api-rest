#!/bin/bash
# Para crear una instancia de MongoDB e instalar mongo-epress para manejarla
# docker run -d -p 27017:27017 --name mongo-api mongo
# Para usar MongoDB con Mongo Express en: http://localhost:8081/
docker-compose -f mongo-compose.yml up -d