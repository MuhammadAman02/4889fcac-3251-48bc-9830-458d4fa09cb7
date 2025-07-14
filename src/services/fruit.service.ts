import { db } from '../db/client';
import { fruits } from '../db/schema';
import { AppError } from '../utils/AppError';

export async function createFruit({
  name,
  color,
  taste,
}: {
  name: string;
  color: string;
  taste: string;
}) {
  try {
    const result = await db
      .insert(fruits)
      .values({ name, color, taste })
      .returning({
        id: fruits.id,
        name: fruits.name,
        color: fruits.color,
        taste: fruits.taste,
        createdAt: fruits.createdAt,
      });

    return result[0];
  } catch (error: any) {
    if (error?.code === '23505') {
      throw new AppError('Fruit name already exists', 409);
    }
    throw new AppError('Failed to create fruit');
  }
}

export async function getFruits(page: number, limit: number) {
  const offset = (page - 1) * limit;

  return db
    .select({
      id: fruits.id,
      name: fruits.name,
      color: fruits.color,
      taste: fruits.taste,
      createdAt: fruits.createdAt,
    })
    .from(fruits)
    .limit(limit)
    .offset(offset)
    .orderBy(fruits.createdAt);
}

export async function getFruitNames() {
  const result = await db
    .select({
      name: fruits.name,
    })
    .from(fruits)
    .orderBy(fruits.name);

  return result.map(fruit => fruit.name);
}