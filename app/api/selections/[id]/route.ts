import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

// GET - Lấy selection theo ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

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
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()

    const { feeling, selectedMoods, customIdeas, selectedLocations, checklist } = body

    const { data, error } = await supabase
      .from("selections")
      .update({
        feeling: feeling || null,
        selected_moods: selectedMoods || [],
        custom_ideas: customIdeas || [],
        selected_locations: selectedLocations || {
          saturday: [],
          sunday: [],
        },
        checklist: checklist || { items: [], checkedItems: [] },
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
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

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

