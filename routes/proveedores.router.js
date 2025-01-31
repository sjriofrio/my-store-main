const express = require('express');

const ProveedoresService = require('../services/proveedores.service');
const validatorHandler = require('../middlewares/validator.handler');
const {
  createProveedorSchema,
  updateProveedorSchema,
  getProveedorSchema,
} = require('../schemas/proveedor.schema');

const router = express.Router();
const service = new ProveedoresService();

// Obtener todos los proveedores
router.get('/', async (req, res, next) => {
  try {
    const proveedores = await service.findAll();
    res.json(proveedores);
  } catch (error) {
    next(error);
  }
});

// Obtener un proveedor por ID
router.get(
  '/:id',
  validatorHandler(getProveedorSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const proveedor = await service.findOne(id);
      res.json(proveedor);
    } catch (error) {
      next(error);
    }
  }
);

// Crear un nuevo proveedor
router.post(
  '/',
  validatorHandler(createProveedorSchema, 'body'),
  async (req, res, next) => {
    try {
      const body = req.body;
      const newProveedor = await service.create(body);
      res.status(201).json(newProveedor);
    } catch (error) {
      next(error);
    }
  }
);

// Actualizar un proveedor por ID
router.put(
  '/:id',
  validatorHandler(getProveedorSchema, 'params'),
  validatorHandler(updateProveedorSchema, 'body'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const body = req.body;
      const updatedProveedor = await service.update(id, body);
      res.json(updatedProveedor);
    } catch (error) {
      next(error);
    }
  }
);

// Eliminar un proveedor por ID
router.delete(
  '/:id',
  validatorHandler(getProveedorSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      await service.delete(id);
      res.status(201).json({ message: 'Proveedor eliminado', id });
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  '/:id',
  validatorHandler(getProveedorSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const proveedor = await service.findOne(id);
      res.json(proveedor);
    } catch (error) {
      next(error);
    }
  }
);

// Actualizar usando PATCH
router.patch(
  '/:id',
  validatorHandler(getProveedorSchema, 'params'),
  validatorHandler(updateProveedorSchema, 'body'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const body = req.body;
      const updatedProveedor = await service.updatee(id, body);
      res.json(updatedProveedor);
    } catch (error) {
      next(error);
    }
  }
);



module.exports = router;
