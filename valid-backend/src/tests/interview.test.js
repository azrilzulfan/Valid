//src/tests/interview.test.js

const request = require('supertest');
const app = require('../app');

describe('Interview Module', () => {
  describe('POST /api/interview/start', () => {
    it('harus mengembalikan 401 tanpa token', async () => {
      const res = await request(app)
        .post('/api/interview/start')
        .send({ vocationField: 'teknologi_informasi' });
      expect(res.statusCode).toBe(401);
    });
  });

  describe('POST /api/interview/question', () => {
    it('harus mengembalikan 401 tanpa token', async () => {
      const res = await request(app)
        .post('/api/interview/question')
        .send({ sessionId: 'test-session' });
      expect(res.statusCode).toBe(401);
    });
  });

  describe('Badge Level Logic', () => {
    const determineBadgeLevel = (behavioral, technical) => {
      const combined = (behavioral + technical) / 2;
      if (behavioral >= 75 && technical >= 75 && combined >= 75) return 'gold';
      if (technical >= 60) return 'silver';
      if (behavioral >= 60) return 'bronze';
      return null;
    };

    it('harus menghasilkan gold jika kedua skor >= 75', () => {
      expect(determineBadgeLevel(80, 80)).toBe('gold');
    });

    it('harus menghasilkan silver jika hanya technical >= 60', () => {
      expect(determineBadgeLevel(50, 70)).toBe('silver');
    });

    it('harus menghasilkan bronze jika hanya behavioral >= 60', () => {
      expect(determineBadgeLevel(65, 40)).toBe('bronze');
    });

    it('harus menghasilkan null jika kedua skor < 60', () => {
      expect(determineBadgeLevel(50, 50)).toBeNull();
    });
  });
});