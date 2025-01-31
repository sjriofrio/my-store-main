const express = require('express');
const { Client } = require('pg');
const productsRouter = require('./products.router');
const usersRouter = require('./users.router');
const categoriesRouter = require('./categories.router');
const proveedoresRouter = require('./proveedores.router');
function routerApi(app) {
  const router = express.Router();
  app.use('/api/v1', router);
  router.use('/products', productsRouter);
  router.use('/users', usersRouter);
  router.use('/categories', categoriesRouter);
  router.use('/proveedores', proveedoresRouter);
  // Ruta para probar la conexión a la base de datos
  router.get('/test', async (req, res) => {
    const client = new Client({
      user: 'postgres',
      host: 'localhost',
      database: 'postgres',
      password : 'admin',
      port: 5432,
    });
    await client.connect();
    const { rows } = await client.query('SELECT * FROM users');
    res.json(rows);
    await client.end();

  });
}
module.exports = routerApi;

