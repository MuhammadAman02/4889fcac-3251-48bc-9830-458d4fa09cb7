import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

// Zod schemas
const CreateFruitZod = z.object({
  name: z.string().min(1, 'Name is required'),
  color: z.string().min(1, 'Color is required'),
  taste: z.string().min(1, 'Taste is required'),
});

const FruitResponseZod = z.object({
  id: z.string().uuid(),
  name: z.string(),
  color: z.string(),
  taste: z.string(),
  createdAt: z.string(),
});

const GetFruitsQueryZod = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
});

const FruitNamesResponseZod = z.array(z.string());

// Fastify-compatible JSON schemas
export const createFruitSchema = {
  tags: ["Fruits"],
  body: zodToJsonSchema(CreateFruitZod),
  response: {
    201: zodToJsonSchema(FruitResponseZod),
  },
};

export const getFruitsSchema = {
  tags: ["Fruits"],
  querystring: zodToJsonSchema(GetFruitsQueryZod),
  response: {
    200: zodToJsonSchema(z.array(FruitResponseZod)),
  },
};

export const getFruitNamesSchema = {
  tags: ["Fruits"],
  response: {
    200: zodToJsonSchema(FruitNamesResponseZod),
  },
};