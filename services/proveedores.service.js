const boom = require('boom');
const pool = require('../libs/postgres.pool');
class ProveedoresService {
  constructor() {
    this.pool = pool;
    this.pool.on('error', (err) => console.error(err));
  }

  // Crear un proveedor
  async create(data) {
    const client = await pool.connect();
    try {
      const checkQuery = 'SELECT 1 FROM proveedores WHERE ruc = $1 LIMIT 1;';
      const checkResult = await client.query(checkQuery, [data.ruc]);
      if (checkResult.rowCount > 0) {
        throw boom.conflict('El RUC ya está registrado');
      }
      const query = `
        INSERT INTO proveedores (nombre, ruc, direccion, estado)
        VALUES ($1, $2, $3, $4) RETURNING *;
      `;
      const values = [
        data.nombre,
        data.ruc,
        data.direccion || null,
        data.estado ?? true,
      ];
      const result = await client.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw boom.badImplementation(error.message);
    } finally {
      client.release();
    }
  }

  // Listar todos los proveedores
  async findAll() {
    const client = await this.pool.connect();
    try {
      const query = `SELECT * FROM proveedores ORDER BY id ASC;`;
      const result = await client.query(query);
      return result.rows;
    } catch (error) {
      throw boom.badImplementation(error.message);
    } finally {
      client.release();
    }
  }

  // Editar un proveedor por ID
  async update(id, data) {
    const client = await this.pool.connect();
    try {
      const query = `
        UPDATE proveedores
        SET nombre = $1, ruc = $2, direccion = $3, estado = $4
        WHERE id = $5 RETURNING *;
      `;
      const values = [
        data.nombre,
        data.ruc,
        data.direccion || null,
        data.estado ?? true,
        id,
      ];
      const result = await client.query(query, values);

      if (result.rowCount === 0) {
        throw boom.notFound('Proveedor no encontrado');
      }
      return result.rows[0];
    } catch (error) {
      throw boom.badImplementation(error.message);
    } finally {
      client.release();
    }
  }
//Actualizar un proveedor por ID con patch
  async updatee(id, data) {
    const client = await this.pool.connect();
    try {
      const fields = [];
      const values = [];

      let index = 1;
      for (const key in data) {
        if (data[key] !== undefined) {
          fields.push(`${key} = $${index}`);
          values.push(data[key]);
          index++;
        }
      }

      if (fields.length === 0) {
        throw boom.badRequest('No hay campos para actualizar');
      }

      const query = `UPDATE proveedores SET ${fields.join(', ')} WHERE id = $${index} RETURNING *;`;
      values.push(id);

      const result = await client.query(query, values);

      if (result.rowCount === 0) {
        throw boom.notFound('Proveedor no encontrado');
      }

      return result.rows[0];
    } catch (error) {
      throw boom.badImplementation(error.message);
    } finally {
      client.release();
    }
  }


  // Eliminar un proveedor por ID
  async delete(id) {
    const client = await this.pool.connect();
    try {
      const query = `DELETE FROM proveedores WHERE id = $1 RETURNING *;`;
      const result = await client.query(query, [id]);

      if (result.rowCount === 0) {
        throw boom.notFound('Proveedor no encontrado');
      }
      return { message: 'Proveedor eliminado con éxito' };
    } catch (error) {
      throw boom.badImplementation(error.message);
    } finally {
      client.release();
    }
  }
  async findOne(id) {
    const query = 'SELECT * FROM proveedores WHERE id = $1';
    const { rows } = await this.pool.query(query, [id]);
    if (rows.length === 0) {
      throw boom.notFound('Proveedor no encontrado');
    }
    return rows[0];
  }

}

module.exports = ProveedoresService;
