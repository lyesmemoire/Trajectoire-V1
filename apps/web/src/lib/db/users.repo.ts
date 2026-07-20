import type { Database } from "@/types/database";
import { BaseRepository } from "./base.repository";
import { UserService } from "@/lib/db/user.service";

export class UsersRepository extends BaseRepository<
  Database["public"]["Tables"]["profiles"]
> {
  constructor(db: any) {
    super(db, "profiles");
  }

  async findByEmail(email: string) {
    const { data, error } = await UserService.getProfileByEmail(email, "*", this.db);

    if (error) throw error;
    return data;
  }
}
