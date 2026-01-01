import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Missing Supabase environment variables")
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      selections: {
        Row: {
          id: string
          feeling: string | null
          selected_moods: string[]
          custom_ideas: string[]
          selected_locations: {
            saturday: Array<{ locationId: string; time: string }>
            sunday: Array<{ locationId: string; time: string }>
          }
          checklist: {
            items: Array<{ id: string; label: string; category: string; iconType?: string }>
            checkedItems: string[]
          }
          plan_day: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          feeling: string | null
          selected_moods: string[]
          custom_ideas: string[]
          selected_locations: {
            saturday: Array<{ locationId: string; time: string }>
            sunday: Array<{ locationId: string; time: string }>
          }
          checklist?: {
            items: Array<{ id: string; label: string; category: string; iconType?: string }>
            checkedItems: string[]
          }
          plan_day?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          feeling?: string | null
          selected_moods?: string[]
          custom_ideas?: string[]
          selected_locations?: {
            saturday: Array<{ locationId: string; time: string }>
            sunday: Array<{ locationId: string; time: string }>
          }
          plan_day?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}

