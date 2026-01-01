import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

// GET - Lấy selection theo ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    // Handle both Promise and direct params (Next.js 15 compatibility)
    const resolvedParams = params instanceof Promise ? await params : params
    const { id } = resolvedParams

    // Validate ID
    if (!id || id === "undefined" || id.trim() === "") {
      return NextResponse.json(
        { error: "Invalid selection ID" },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from("selections")
      .select("*")
      .eq("id", id)
      .single()

    if (error) {
      console.error("Error fetching selection:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!data) {
      return NextResponse.json({ error: "Selection not found" }, { status: 404 })
    }

    return NextResponse.json({ data }, { status: 200 })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// PUT - Cập nhật selection
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    // Handle both Promise and direct params (Next.js 15 compatibility)
    const resolvedParams = params instanceof Promise ? await params : params
    const { id } = resolvedParams

    // Validate ID
    if (!id || id === "undefined" || id.trim() === "") {
      return NextResponse.json(
        { error: "Invalid selection ID" },
        { status: 400 }
      )
    }

    const body = await request.json()

    const { feeling, selectedMoods, selectedCuisines, customIdeas, selectedLocations, checklist } = body

    const hasSaturday = selectedLocations?.saturday && selectedLocations.saturday.length > 0
    const hasSunday = selectedLocations?.sunday && selectedLocations.sunday.length > 0
    
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
        .select("plan_day, id")
      
      const hasDuplicate = existingSelections?.some((sel: any) => {
        if (!sel.plan_day || sel.id === id) return false
        
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
          { error: `Đã có plan khác cho ${dayLabel} trong database. Vui lòng xóa plan cũ trước.` },
          { status: 400 }
        )
      }
    }

    const { data, error } = await supabase
      .from("selections")
      .update({
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
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("Error updating selection:", error)
      return NextResponse.json(
        {
          error: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
        },
        { status: 500 }
      )
    }

    if (!data) {
      return NextResponse.json({ error: "Selection not found" }, { status: 404 })
    }

    return NextResponse.json({ data }, { status: 200 })
  } catch (error) {
    console.error("Unexpected error:", error)
    const errorMessage = error instanceof Error ? error.message : "Internal server error"
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}

// DELETE - Xóa selection
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    // Handle both Promise and direct params (Next.js 15 compatibility)
    const resolvedParams = params instanceof Promise ? await params : params
    const { id } = resolvedParams

    // Validate ID
    if (!id || id === "undefined" || id.trim() === "") {
      return NextResponse.json(
        { error: "Invalid selection ID" },
        { status: 400 }
      )
    }

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(id)) {
      return NextResponse.json(
        { error: "Invalid UUID format" },
        { status: 400 }
      )
    }

    const { error } = await supabase.from("selections").delete().eq("id", id)

    if (error) {
      console.error("Error deleting selection:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ message: "Selection deleted successfully" }, { status: 200 })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

