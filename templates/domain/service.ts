import { Result, ok, fail, NotFoundError } from '@/lib/core';
import { DomainRepository } from './repository';
// import { toDomainDTO } from './mapper';

export class DomainService {
  constructor(private readonly repo: DomainRepository) {}
}

import { domainRepository } from './repository';
export const domainService = new DomainService(domainRepository);
