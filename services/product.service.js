const boom = require('boom');
const { faker } = require('@faker-js/faker');
const pool = require('../libs/postgres.pool');
class ProductsService {
  constructor() {
    this.products = [];
    this.generate();
    this.pool = pool;
    this.pool.on('error', (err) => console.error(err));
  }

  generate() {
    const limit = 100;
    for (let index = 0; index < limit; index++) {
      this.products.push({
        id: faker.string.uuid(),
        name: faker.commerce.productName(),
        price: parseInt(faker.commerce.price(), 10),
        image: faker.image.url(),
        is_block: faker.datatype.boolean(),
      });
    }
  }

   async create(data) {
    const client = await this.pool.connect();
    try {
      const query = 'INSERT INTO products (id, name, price, image, is_block) VALUES ($1, $2, $3, $4, $5) RETURNING *';
      const values = [faker.string.uuid(), data.name, data.price, data.image, data.is_block];
      const result = await client.query(query, values);
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  async find() {
    const query = 'SELECT * FROM products';
    const rst = await this.pool.query(query);
    return rst.rows;
  }

  async findOne(id) {
    const client = await this.pool.connect();
    try {
      const query = 'SELECT * FROM products WHERE id = $1';
      const values = [id];
      const result = await client.query(query, values);
      if (result.rows.length === 0) {
        throw boom.notFound('product not found');
      }
      const product = result.rows[0];
      if (product.is_block) {
        throw boom.conflict('product is block');
      }
      return product;
    } finally {
      client.release();
    }
  }


  async update(id, changes) {
    const index = this.products.findIndex((item) => item.id === id);
    if (index === -1) {
      throw boom.notFound('product not found');
    }
    const product = this.products[index];
    this.products[index] = {
      ...product,
      ...changes,
    };
    return this.products[index];
  }

  async delete(id) {
    const client = await this.pool.connect();
    try {
      const query = 'DELETE FROM products WHERE id = $1 RETURNING *';
      const values = [id];
      const result = await client.query(query, values);
      if (result.rows.length === 0) {
        throw boom.notFound('product not found');
      }
      return result.rows[0];
    } finally {
      client.release();
    }
  }
}

module.exports = ProductsService;
