import { DomainDTO } from './dto';

export function toDomainDTO(entity: any): DomainDTO {
  return {
    id: entity.id,
  };
}
