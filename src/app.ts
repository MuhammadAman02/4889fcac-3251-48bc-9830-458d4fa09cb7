import Fastify from "fastify";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import helmet from "@fastify/helmet";
import root from "./routes/root";
import { fruitRoutes } from "./routes/fruit.route";

export async function createApp() {
  const app = Fastify({
    logger: true,
  });
  
  await app.register(fastifySwagger, {
      swagger: {
        info: {
          title: "Joylo API",
          description: "Documentation for the Joylo backend services",
          version: "1.0.0",
        },
      },
    });

  await app.register(fastifySwaggerUi, {
      routePrefix: "/docs",
      uiConfig: {
        docExpansion: "list",
        deepLinking: true,
      },
      staticCSP: false,
      transformSpecification: (swaggerObject, request, reply) => {
        return swaggerObject;
      },
      transformSpecificationClone: true,
    });
    
  await app.register(helmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:"],
        frameAncestors: ["*"],
      },
    },
  });

  // Register routes
  app.register(root, { prefix: "/" });
  app.register(fruitRoutes);

  // Global error handler with better logging
  app.setErrorHandler((error, request, reply) => {
    console.error('Global error handler caught:', {
      error: error.message,
      stack: error.stack,
      url: request.url,
      method: request.method,
    });
    
    app.log.error(error);
    
    // Handle validation errors
    if (error.validation) {
      return reply.status(400).send({
        error: "Validation failed",
        details: error.validation,
      });
    }
    
    reply.status(500).send({ 
      error: "Internal Server Error",
      message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  });

  return app;
}