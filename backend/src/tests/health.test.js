const request = require('supertest');
const app = require('../app');

describe('Health Check', () => {
  it('GET /api/health harus mengembalikan status OK', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('OK');
  });
});