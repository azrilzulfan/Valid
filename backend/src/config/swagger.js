const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'VeriSkill AI API',
      version: '1.0.0',
      description: 'API dokumentasi untuk platform VeriSkill AI — Peer Verification Tenaga Kerja Vokasi',
    },
    servers: [
      { url: 'http://localhost:5000', description: 'Development' },
      { url: 'https://veriskill-api.railway.app', description: 'Production' }
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Token Firebase ID — dapatkan dari Firebase Auth di frontend'
        }
      }
    },
    security: [{ BearerAuth: [] }]
  },
  apis: ['./src/modules/**/*.routes.js'],
};

module.exports = swaggerJsdoc(options);