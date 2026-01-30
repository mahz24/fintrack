import swaggerJSDoc from "swagger-jsdoc";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "FinTrack API",
      version: "1.0.0",
      description: "API REST for personal finance management",
    },
    servers: [
      {
        url: "/",
        description: "Current server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: [
    path.join(__dirname, "../modules/**/*.routes.ts"),
    path.join(__dirname, "../modules/**/*.route.ts"),
  ],
};

export const swaggerSpec = swaggerJSDoc(options);
