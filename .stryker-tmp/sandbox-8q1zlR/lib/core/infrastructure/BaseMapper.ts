// @ts-nocheck
export abstract class BaseMapper<Persistence, Domain, Response> {
  abstract toDomain(raw: Persistence): Domain;
  abstract toPersistence(domain: Domain): Persistence;
  abstract toResponse(domain: Domain): Response;
}
