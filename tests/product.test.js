import request from 'supertest';
import app from '../app'; 
import Product from "../models/product.model.js";
import Category from "../models/category.model.js";

// Mock the Product model's methods
jest.mock('../models/product.model.js');

describe('GET /products', () => {
  it('should return a list of products with pagination', async () => {
    // Mock the Product model to simulate data
    Product.find.mockResolvedValue([
      { name: 'Product 1', category: 'Category 1' },
      { name: 'Product 2', category: 'Category 2' },
    ]);
    Product.countDocuments.mockResolvedValue(20); // Simulate 20 total products in the DB

    // Send a GET request to /products with query params
    const response = await request(app).get('/products').query({ page: 1, limit: 2 });

    // Check if the response status is OK
    expect(response.status).toBe(200);

    // Check if the response body contains the correct structure
    expect(response.body).toHaveProperty('totalProducts', 20);
    expect(response.body).toHaveProperty('totalPages', 10); // 20 / 2 = 10 pages
    expect(response.body).toHaveProperty('currentPage', 1);
    expect(response.body).toHaveProperty('products');
    expect(response.body.products.length).toBe(2);
  });

  it('should return filtered products by name', async () => {
    Product.find.mockResolvedValue([{ name: 'Product 1', category: 'Category 1' }]);
    Product.countDocuments.mockResolvedValue(1);

    const response = await request(app).get('/products').query({ name: 'Product 1' });

    expect(response.status).toBe(200);
    expect(response.body.products).toHaveLength(1);
    expect(response.body.products[0].name).toBe('Product 1');
  });

  it('should return filtered products by category', async () => {
    Product.find.mockResolvedValue([{ name: 'Product 1', category: 'Category 1' }]);
    Product.countDocuments.mockResolvedValue(1);

    const response = await request(app).get('/products').query({ category: 'Category 1' });

    expect(response.status).toBe(200);
    expect(response.body.products).toHaveLength(1);
    expect(response.body.products[0].category).toBe('Category 1');
  });

  it('should return 400 if query is invalid', async () => {
    // Simulate invalid query handling, like a non-numeric page
    const response = await request(app).get('/products').query({ page: 'invalid' });

    expect(response.status).toBe(400);
    expect(response.body.error).toBeDefined();
  });
});
