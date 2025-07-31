import swaggerJsdoc from 'swagger-jsdoc';
import { SERVER_URL, SWAGGER_CONFIG } from './common.js';

const swaggerOptions = {
  definition: {
    openapi: SWAGGER_CONFIG.OPENAPI_VERSION,
    info: {
      title: SWAGGER_CONFIG.API_TITLE,
      version: SWAGGER_CONFIG.API_VERSION,
      description: SWAGGER_CONFIG.API_DESCRIPTION,
    },
    servers: [
      {
        url: `${SERVER_URL}${SWAGGER_CONFIG.API_BASE_PATH}`,
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: SWAGGER_CONFIG.SECURITY_SCHEME_TYPE,
          scheme: SWAGGER_CONFIG.SECURITY_SCHEME,
          bearerFormat: SWAGGER_CONFIG.BEARER_FORMAT,
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: [SWAGGER_CONFIG.APIS_PATH],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

export default swaggerSpec;