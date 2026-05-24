const request = require('supertest');
const app = require('../app');
const crypto = require('crypto');

describe('Portfolio Module', () => {
  describe('POST /api/portfolio/upload', () => {
    it('harus mengembalikan 401 tanpa token', async () => {
      const res = await request(app).post('/api/portfolio/upload');
      expect(res.statusCode).toBe(401);
    });
  });

  describe('Hash Utility', () => {
    it('harus menghasilkan hash SHA-256 yang konsisten', () => {
      const buffer = Buffer.from('test-file-content');
      const hash1 = crypto.createHash('sha256').update(buffer).digest('hex');
      const hash2 = crypto.createHash('sha256').update(buffer).digest('hex');
      expect(hash1).toBe(hash2);
    });

    it('hash dari konten berbeda harus berbeda', () => {
      const hash1 = crypto.createHash('sha256').update('file-a').digest('hex');
      const hash2 = crypto.createHash('sha256').update('file-b').digest('hex');
      expect(hash1).not.toBe(hash2);
    });
  });
});