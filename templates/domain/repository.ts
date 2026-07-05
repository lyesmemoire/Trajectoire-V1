import prisma from '@/lib/prisma';
import { BaseRepository } from '@/lib/core';
// import { Entity, Prisma } from '@prisma/client';

export class DomainRepository extends BaseRepository<any> {
  constructor() {
    super(prisma as any, 'entity_name');
  }
}

export const domainRepository = new DomainRepository();
