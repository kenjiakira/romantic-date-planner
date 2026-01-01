"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, Calendar, Heart, MapPin, Clock, Trash2, Check, Edit } from "lucide-react"
import Link from "next/link"
import { FloatingParticles } from "@/components/FloatingParticles"
import { getLocationById, getMoodById } from "@/lib/locations"

type Selection = {
  id: string
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
  created_at: string
  updated_at: string
}

const feelingLabels: Record<string, string> = {
  quiet: "Cần Sự Yên Tĩnh",
  active: "Muốn Đi Đây Đó",
  comfortable: "Chỉ Cần Thoải Mái",
  social: "Muốn Chút Vui Vẻ",
}

export default function SelectionsPage() {
  const [selections, setSelections] = useState<Selection[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchSelections()
  }, [])

  const fetchSelections = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/selections")
      if (!response.ok) {
        throw new Error("Failed to fetch selections")
      }
      const result = await response.json()
      setSelections(result.data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc muốn xóa lựa chọn này?")) return

    try {
      const response = await fetch(`/api/selections/${id}`, {
        method: "DELETE",
      })
      if (!response.ok) {
        throw new Error("Failed to delete selection")
      }
      setSelections(selections.filter((s) => s.id !== id))
    } catch (err) {
      alert("Không thể xóa lựa chọn này")
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (loading) {
    return (
      <main className="min-h-screen romantic-gradient text-foreground font-serif selection:bg-primary/20 flex flex-col items-center justify-center p-6">
        <FloatingParticles />
        <div className="fixed inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] z-0" />
        <div className="text-muted-foreground/80 italic">Đang tải...</div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="min-h-screen romantic-gradient text-foreground font-serif selection:bg-primary/20 flex flex-col items-center justify-center p-6">
        <FloatingParticles />
        <div className="fixed inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] z-0" />
        <div className="text-destructive">{error}</div>
      </main>
    )
  }

  return (
    <main className="min-h-screen romantic-gradient text-foreground font-serif selection:bg-primary/20 relative">
      <FloatingParticles />
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] z-0" />

      <div className="max-w-4xl mx-auto px-6 py-16 md:py-24 relative z-10">
        <header className="mb-12">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-muted-foreground/80 hover:text-primary transition-colors duration-500 mb-8"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-500" />
            Quay lại trang chủ
          </Link>

          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-light italic leading-tight romantic-glow-text">
              Các lựa chọn đã lưu
            </h1>
            <p className="font-sans text-base tracking-widest uppercase text-muted-foreground/80">
              Xem lại những kế hoạch đã được tạo
            </p>
          </div>
        </header>

        {selections.length === 0 ? (
          <div className="text-center py-24 border border-dashed border-border/40 rounded-3xl">
            <Heart className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-base text-muted-foreground/80 italic">
              Chưa có lựa chọn nào được lưu
            </p>
            <Link
              href="/plan"
              className="inline-block mt-6 text-sm text-primary hover:underline"
            >
              Tạo lựa chọn mới
            </Link>
          </div>
        ) : (
          <div className="space-y-12">
            {selections.map((selection, index) => (
              <motion.div
                key={selection.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-romantic rounded-3xl p-8 md:p-12 border border-border/20"
              >
                <div className="flex items-start justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-primary/60" />
                    <div>
                      <div className="text-sm text-muted-foreground/70 uppercase tracking-wider">
                        {formatDate(selection.created_at)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/plan?edit=${selection.id}`}
                      className="p-2 hover:bg-accent/20 rounded-full transition-colors text-muted-foreground/70 hover:text-primary"
                      aria-label="Chỉnh sửa lựa chọn"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(selection.id)}
                      className="p-2 hover:bg-accent/20 rounded-full transition-colors text-muted-foreground/70 hover:text-destructive"
                      aria-label="Xóa lựa chọn"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Feeling */}
                {selection.feeling && (
                  <div className="mb-8">
                    <h3 className="text-xs uppercase tracking-[0.4em] text-muted-foreground/80 font-medium mb-4">
                      Cảm xúc
                    </h3>
                    <div className="inline-block px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary">
                      {feelingLabels[selection.feeling] || selection.feeling}
                    </div>
                  </div>
                )}

                {/* Locations */}
                {(selection.selected_locations.saturday.length > 0 ||
                  selection.selected_locations.sunday.length > 0) && (
                  <div className="mb-8">
                    <h3 className="text-xs uppercase tracking-[0.4em] text-muted-foreground/80 font-medium mb-6">
                      Địa điểm
                    </h3>
                    <div className="space-y-8">
                      {selection.selected_locations.saturday.length > 0 && (
                        <div>
                          <h4 className="text-sm uppercase tracking-wider text-muted-foreground/70 mb-4 font-medium">
                            Thứ Bảy
                          </h4>
                          <div className="space-y-4">
                            {selection.selected_locations.saturday.map((loc, idx) => {
                              const location = getLocationById(loc.locationId)
                              if (!location) return null
                              return (
                                <div
                                  key={idx}
                                  className="p-4 rounded-2xl bg-accent/10 border border-border/20"
                                >
                                  <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2 mb-2">
                                        <MapPin className="w-4 h-4 text-primary/60" />
                                        <h5 className="text-lg font-medium">{location.name}</h5>
                                      </div>
                                      <p className="text-sm text-muted-foreground/80 italic mb-3">
                                        {location.description}
                                      </p>
                                      <div className="flex items-center gap-2 text-xs text-muted-foreground/70">
                                        <Clock className="w-3 h-3" />
                                        <span>{loc.time}</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      )}

                      {selection.selected_locations.sunday.length > 0 && (
                        <div>
                          <h4 className="text-sm uppercase tracking-wider text-muted-foreground/70 mb-4 font-medium">
                            Chủ Nhật
                          </h4>
                          <div className="space-y-4">
                            {selection.selected_locations.sunday.map((loc, idx) => {
                              const location = getLocationById(loc.locationId)
                              if (!location) return null
                              return (
                                <div
                                  key={idx}
                                  className="p-4 rounded-2xl bg-accent/10 border border-border/20"
                                >
                                  <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2 mb-2">
                                        <MapPin className="w-4 h-4 text-primary/60" />
                                        <h5 className="text-lg font-medium">{location.name}</h5>
                                      </div>
                                      <p className="text-sm text-muted-foreground/80 italic mb-3">
                                        {location.description}
                                      </p>
                                      <div className="flex items-center gap-2 text-xs text-muted-foreground/70">
                                        <Clock className="w-3 h-3" />
                                        <span>{loc.time}</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Food Moods */}
                {selection.selected_moods.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-xs uppercase tracking-[0.4em] text-muted-foreground/80 font-medium mb-4">
                      Vị giác
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selection.selected_moods.map((moodId) => {
                        const mood = getMoodById(moodId)
                        if (!mood) return null
                        return (
                          <div
                            key={moodId}
                            className="px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm"
                          >
                            {mood.label}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {selection.custom_ideas && selection.custom_ideas.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-xs uppercase tracking-[0.4em] text-muted-foreground/80 font-medium mb-4">
                      Món ăn cụ thể
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selection.custom_ideas.map((idea, idx) => (
                        <div
                          key={idx}
                          className="px-4 py-2 rounded-full bg-accent/30 border border-primary/10 text-sm uppercase tracking-wider"
                        >
                          {idea}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Checklist */}
                {selection.checklist && selection.checklist.items && selection.checklist.items.length > 0 && (
                  <div>
                    <h3 className="text-xs uppercase tracking-[0.4em] text-muted-foreground/80 font-medium mb-4">
                      Checklist Chuẩn Bị
                    </h3>
                    <div className="space-y-3">
                      {selection.checklist.items.map((item) => {
                        const isChecked = selection.checklist?.checkedItems?.includes(item.id) || false
                        return (
                          <div
                            key={item.id}
                            className={`flex items-center gap-3 p-3 rounded-xl border ${
                              isChecked
                                ? "bg-accent/30 border-primary/20"
                                : "bg-transparent border-border/40"
                            }`}
                          >
                            <div
                              className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center ${
                                isChecked
                                  ? "bg-primary border-primary"
                                  : "bg-transparent border-border/60"
                              }`}
                            >
                              {isChecked && <Check className="w-3 h-3 text-background" />}
                            </div>
                            <span
                              className={`text-sm ${
                                isChecked
                                  ? "text-foreground line-through decoration-primary/40"
                                  : "text-muted-foreground/90"
                              }`}
                            >
                              {item.label}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}

