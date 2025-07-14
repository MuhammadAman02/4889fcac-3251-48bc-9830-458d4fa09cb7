import { FastifyRequest, FastifyReply } from 'fastify';
import { createFruit, getFruits, getFruitNames } from '../services/fruit.service';
import { AppError } from '../utils/AppError';

export async function createFruitHandler(
  req: FastifyRequest<{ Body: { name: string; color: string; taste: string } }>,
  res: FastifyReply
) {
  try {
    const fruit = await createFruit(req.body);
    res.status(201).send(fruit);
  } catch (error: any) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).send({ error: error.message });
    }
    return res.status(500).send({ error: 'Internal server error' });
  }
}

export async function getFruitsHandler(
  req: FastifyRequest<{ Querystring: { page: number; limit: number } }>,
  res: FastifyReply
) {
  try {
    const fruits = await getFruits(req.query.page, req.query.limit);
    res.status(200).send(fruits);
  } catch (error: any) {
    return res.status(500).send({ error: 'Internal server error' });
  }
}

export async function getFruitNamesHandler(
  req: FastifyRequest,
  res: FastifyReply
) {
  try {
    const fruitNames = await getFruitNames();
    res.status(200).send(fruitNames);
  } catch (error: any) {
    return res.status(500).send({ error: 'Internal server error' });
  }
}