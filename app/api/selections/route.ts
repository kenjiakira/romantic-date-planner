import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

// GET - Lấy tất cả selections
export async function GET() {
  try {
    // Kiểm tra Supabase config
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error("Missing Supabase environment variables")
      return NextResponse.json(
        { 
          error: "Supabase configuration missing. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY" 
        },
        { status: 500 }
      )
    }

    const { data, error } = await supabase
      .from("selections")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching selections:", error)
      return NextResponse.json(
        { 
          error: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        },
        { status: 500 }
      )
    }

    return NextResponse.json({ data }, { status: 200 })
  } catch (error) {
    console.error("Unexpected error:", error)
    const errorMessage = error instanceof Error ? error.message : "Internal server error"
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}

// POST - Tạo selection mới
export async function POST(request: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error("Missing Supabase environment variables")
      return NextResponse.json(
        { 
          error: "Supabase configuration missing. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY" 
        },
        { status: 500 }
      )
    }

    const body = await request.json()

    const { feeling, selectedMoods, customIdeas, selectedLocations, checklist } = body

    if (!selectedLocations) {
      return NextResponse.json(
        { error: "selectedLocations is required" },
        { status: 400 }
      )
    }

    // Kiểm tra nếu đang tạo thứ 7, xem đã có thứ 7 trong DB chưa
    if (selectedLocations.saturday && selectedLocations.saturday.length > 0) {
      const { data: existingSelections } = await supabase
        .from("selections")
        .select("selected_locations")
      
      const hasSaturdayInDB = existingSelections?.some((sel: any) => 
        sel.selected_locations?.saturday && sel.selected_locations.saturday.length > 0
      )

      if (hasSaturdayInDB) {
        return NextResponse.json(
          { error: "Đã có thứ 7 trong database. Chỉ có thể tạo thêm chủ nhật." },
          { status: 400 }
        )
      }
    }

    const { data, error } = await supabase
      .from("selections")
      .insert({
        feeling: feeling || null,
        selected_moods: selectedMoods || [],
        custom_ideas: customIdeas || [],
        selected_locations: selectedLocations || {
          saturday: [],
          sunday: [],
        },
        checklist: checklist || { items: [], checkedItems: [] },
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating selection:", error)
      return NextResponse.json(
        { 
          error: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        },
        { status: 500 }
      )
    }

    return NextResponse.json({ data }, { status: 201 })
  } catch (error) {
    console.error("Unexpected error:", error)
    const errorMessage = error instanceof Error ? error.message : "Internal server error"
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}

