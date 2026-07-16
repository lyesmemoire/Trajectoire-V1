// @ts-nocheck
import type { Database } from "@/types/database"

export type DB = Database
export type Tables = Database["public"]["Tables"]

export type Profiles = Tables["profiles"]["Row"]
export type CVs = Tables["cvs"]["Row"]
