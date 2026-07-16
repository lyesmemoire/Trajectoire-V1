// @ts-nocheck
import { User } from '@prisma/client';
import { UserDTO } from './users.dto';

export function toUserDTO(user: User): UserDTO {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    image: user.image,
    role: user.role,
    plan: user.plan,
    referralCode: user.referralCode,
    referralCount: user.referralCount,
    createdAt: user.createdAt.toISOString(),
  };
}

export function toUserDTOList(users: User[]): UserDTO[] {
  return users.map(toUserDTO);
}
