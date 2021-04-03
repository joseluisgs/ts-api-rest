import express from 'express';

const app = express();

app.get('/', (req, res) => {
  res.send('Hola from TypeScript');
});

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Servidor escuchando desde: ${port}`));
