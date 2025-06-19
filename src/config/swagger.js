import swaggerJsdoc from 'swagger-jsdoc';
import dotenv from 'dotenv';

dotenv.config();

const serverUrl = process.env.SERVER_URL;

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Manhwa Notifier API',
      version: '1.0.0',
      description: 'API documentation for the Manhwa Notifier backend',
    },
    servers: [
      {
        url: serverUrl,
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

export default swaggerSpec;