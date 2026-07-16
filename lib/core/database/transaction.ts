import prisma from '@/lib/prisma';

/**
 * Exécute un bloc de code dans une transaction Prisma.
 * 
 * Usage :
 * ```ts
 * const result = await withTransaction(async (tx) => {
 *   await tx.user.update({ ... });
 *   await tx.creditUsage.create({ ... });
 *   return { success: true };
 * });
 * ```
 * 
 * Si le callback lance une erreur, la transaction est rollback automatiquement.
 */
export async function withTransaction<T>(
  fn: (tx: Parameters<Parameters<typeof prisma.$transaction>[0]>[0]) => Promise<T>,
  options?: {
    maxWait?: number;
    timeout?: number;
    isolationLevel?: 'ReadUncommitted' | 'ReadCommitted' | 'RepeatableRead' | 'Serializable';
  }
): Promise<T> {
  return prisma.$transaction(fn, {
    maxWait: options?.maxWait ?? 5000,
    timeout: options?.timeout ?? 10000,
    ...(options?.isolationLevel && { isolationLevel: options.isolationLevel as 'ReadUncommitted' | 'ReadCommitted' | 'RepeatableRead' | 'Serializable' }),
  });
}
