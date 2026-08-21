import type { Database as GeneratedDatabase, Json as GeneratedJson } from "./supabase.generated"

type AnyTable = {
  Row: any
  Insert: any
  Update: any
  Relationships: any[]
}

type AnyFn = {
  Args: any
  Returns: any
}

export type Json = GeneratedJson

export type Database = GeneratedDatabase & {
  public: {
    Tables: GeneratedDatabase["public"]["Tables"] & Record<string, AnyTable>
    Views: GeneratedDatabase["public"]["Views"] & Record<string, AnyTable>
    Functions: GeneratedDatabase["public"]["Functions"] & Record<string, AnyFn>
    Enums: GeneratedDatabase["public"]["Enums"] & Record<string, any>
    CompositeTypes: GeneratedDatabase["public"]["CompositeTypes"] & Record<string, any>
  }
}