import { z } from 'zod';
import { ValidationError } from '../errors';

export function validateInput<T>(schema: z.Schema<T>, data: unknown): T {
  const result = schema.safeParse(data);
  
  if (!result.success) {
    const messages = result.error.errors.map(err => `${err.path.join('.')}: ${err.message}`).join(', ');
    throw new ValidationError(`Validation failed: ${messages}`);
  }
  
  return result.data;
}
