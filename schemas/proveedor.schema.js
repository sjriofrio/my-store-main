const Joi = require('joi');

const id = Joi.number().integer().positive();
const nombre = Joi.string().min(3).max(50);
const ruc = Joi.string().length(13).pattern(/^\d+$/); 
const direccion = Joi.string().max(255).allow(null, '');
const estado = Joi.boolean();

const createProveedorSchema = Joi.object({
  nombre: nombre.required(),
  ruc: ruc.required(),
  direccion: direccion,
  estado: estado.default(true),
});

const updateProveedorSchema = Joi.object({
  nombre: nombre,
  ruc: ruc,
  direccion: direccion,
  estado: estado,
});

const getProveedorSchema = Joi.object({
  id: id.required(),
});

module.exports = { createProveedorSchema, updateProveedorSchema, getProveedorSchema };
