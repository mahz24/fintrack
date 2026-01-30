import swaggerJSDoc from "swagger-jsdoc";
import { env } from "./env.js";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "FindTrack API",
      version: "1.0.0",
      description: "API REST for personal finance manage",
    },
    servers: [
      {
        url: `http://localhost:${env.PORT}`,
        description: "Development server",
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

export const swaggerSpect = swaggerJSDoc(options);
