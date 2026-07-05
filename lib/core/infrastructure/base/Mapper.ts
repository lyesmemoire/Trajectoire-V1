/**
 * Interface générique pour un Mapper.
 * Traduit un objet du modèle de persistance vers le modèle du domaine et inversement.
 */
export interface Mapper<TPersistence, TDomain> {
  toDomain(raw: TPersistence): TDomain;
  toPersistence(domain: TDomain): TPersistence;
}
