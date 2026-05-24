const request = require('supertest');
const app = require('../app');

describe('Auth Module', () => {
  describe('POST /api/auth/register', () => {
    it('harus gagal jika uid tidak dikirim', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ email: 'test@test.com' });
      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBeDefined();
    });

    it('harus gagal jika email tidak dikirim', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ uid: 'uid-test-123' });
      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBeDefined();
    });
  });

  describe('GET /api/auth/me', () => {
    it('harus mengembalikan 401 tanpa token', async () => {
      const res = await request(app).get('/api/auth/me');
      expect(res.statusCode).toBe(401);
    });

    it('harus mengembalikan 401 dengan token tidak valid', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer token-palsu-tidak-valid');
      expect(res.statusCode).toBe(401);
    });
  });
});