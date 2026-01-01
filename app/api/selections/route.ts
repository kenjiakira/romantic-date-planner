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

    const { feeling, selectedMoods, selectedCuisines, customIdeas, selectedLocations, checklist } = body

    if (!selectedLocations) {
      return NextResponse.json(
        { error: "selectedLocations is required" },
        { status: 400 }
      )
    }

    const hasSaturday = selectedLocations.saturday && selectedLocations.saturday.length > 0
    const hasSunday = selectedLocations.sunday && selectedLocations.sunday.length > 0
    
    let planDay: string | null = null
    if (hasSaturday && hasSunday) {
      planDay = "both"
    } else if (hasSaturday) {
      planDay = "saturday"
    } else if (hasSunday) {
      planDay = "sunday"
    }

    if (planDay) {
      const { data: existingSelections } = await supabase
        .from("selections")
        .select("plan_day")
      
      const hasDuplicate = existingSelections?.some((sel: any) => {
        if (!sel.plan_day) return false

        if (planDay === "both") {
          return sel.plan_day === "both" || sel.plan_day === "saturday" || sel.plan_day === "sunday"
        }
        
        if (planDay === "saturday") {
          return sel.plan_day === "saturday" || sel.plan_day === "both"
        }
        
        if (planDay === "sunday") {
          return sel.plan_day === "sunday" || sel.plan_day === "both"
        }
        
        return false
      })

      if (hasDuplicate) {
        const dayLabel = planDay === "saturday" ? "thứ 7" : planDay === "sunday" ? "chủ nhật" : "cả hai ngày"
        return NextResponse.json(
          { error: `Đã có plan cho ${dayLabel} trong database. Vui lòng chỉnh sửa plan hiện có hoặc xóa plan cũ trước.` },
          { status: 400 }
        )
      }
    }

    const { data, error } = await supabase
      .from("selections")
      .insert({
        feeling: feeling || null,
        selected_moods: selectedMoods || [],
        selected_cuisines: selectedCuisines || [],
        custom_ideas: customIdeas || [],
        selected_locations: selectedLocations || {
          saturday: [],
          sunday: [],
        },
        checklist: checklist || { items: [], checkedItems: [] },
        plan_day: planDay,
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

