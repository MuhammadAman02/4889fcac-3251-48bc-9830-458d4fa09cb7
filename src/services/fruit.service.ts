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
    console.log('Creating fruit:', { name, color, taste });
    
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

    console.log('Fruit created successfully:', result[0]);
    return result[0];
  } catch (error: any) {
    console.error('Error creating fruit:', error);
    
    if (error?.code === '23505') {
      throw new AppError('Fruit name already exists', 409);
    }
    
    // More specific error handling
    if (error?.code === '42P01') {
      throw new AppError('Database table does not exist. Please run migrations.', 500);
    }
    
    throw new AppError(`Failed to create fruit: ${error.message}`, 500);
  }
}

export async function getFruits(page: number, limit: number) {
  try {
    const offset = (page - 1) * limit;

    const result = await db
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

    return result;
  } catch (error: any) {
    console.error('Error fetching fruits:', error);
    throw new AppError(`Failed to fetch fruits: ${error.message}`, 500);
  }
}

export async function getFruitNames() {
  try {
    const result = await db
      .select({
        name: fruits.name,
      })
      .from(fruits)
      .orderBy(fruits.name);

    return result.map(fruit => fruit.name);
  } catch (error: any) {
    console.error('Error fetching fruit names:', error);
    throw new AppError(`Failed to fetch fruit names: ${error.message}`, 500);
  }
}