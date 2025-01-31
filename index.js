const express = require('express'); // Importar express
const cors = require('cors'); // Importar cors
const routerApi = require('./routes'); // Importar las rutas
const { logErrors, errorHandler, boomErrorHandler } = require('./middlewares/error.handler');
const app = express(); // Asignar express a mi aplicación
const port = process.env.PORT || 3001; // Asignación puerto donde se ejecutará el proy

app.use(express.json());

// Configurar CORS para permitir todas las solicitudes
app.use(cors());

app.get('/', (req, res) => {
  res.send('Hola servidor de express');
});
app.get('/nueva-ruta', (req, res) => {
  res.send('Hola, soy una nueva ruta');
});

routerApi(app);

app.use(logErrors);
app.use(boomErrorHandler);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});