import { FastifyInstance } from 'fastify';
import { 
  createFruitHandler, 
  getFruitsHandler, 
  getFruitNamesHandler 
} from '../controllers/fruit.controller';
import { 
  createFruitSchema, 
  getFruitsSchema, 
  getFruitNamesSchema 
} from '../schemas/fruit.schema';

export async function fruitRoutes(app: FastifyInstance) {
  // Create a new fruit
  app.post('/api/fruits', {
    schema: createFruitSchema,
    handler: createFruitHandler,
  });

  // Get all fruits with pagination
  app.get('/api/fruits', {
    schema: getFruitsSchema,
    handler: getFruitsHandler,
  });

  // Get fruit names only
  app.get('/api/fruits/names', {
    schema: getFruitNamesSchema,
    handler: getFruitNamesHandler,
  });
}