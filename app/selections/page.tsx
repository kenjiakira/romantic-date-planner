"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, Calendar, Heart, MapPin, Clock, Trash2, Check, Edit, Sparkles, Tag, Utensils, Map } from "lucide-react"
import Link from "next/link"
import { FloatingParticles } from "@/components/FloatingParticles"
import { getLocationById, getMoodById, getCuisineById } from "@/lib/locations"

type Selection = {
  id: string
  feeling: string | null
  selected_moods: string[]
  selected_cuisines: string[]
  custom_ideas: string[]
  selected_locations: {
    saturday: Array<{ locationId: string; time: string }>
    sunday: Array<{ locationId: string; time: string }>
  }
  checklist?: {
    items: Array<{ id: string; label: string; category: string; iconType?: string }>
    checkedItems: string[]
  }
  plan_day: string | null
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
    if (!id || id === "undefined" || id.trim() === "") {
      alert("ID không hợp lệ")
      return
    }

    if (!confirm("Bạn có chắc muốn xóa lựa chọn này?")) return

    try {
      const response = await fetch(`/api/selections/${id}`, {
        method: "DELETE",
      })
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Unknown error" }))
        throw new Error(errorData.error || "Failed to delete selection")
      }
      
      setSelections(selections.filter((s) => s.id !== id))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Không thể xóa lựa chọn này"
      alert(errorMessage)
      console.error("Delete error:", err)
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
      <main className="min-h-screen romantic-gradient text-foreground font-serif selection:bg-primary/20 flex flex-col items-center justify-center p-6 relative">
        <FloatingParticles />
        <div className="fixed inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] z-0" />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-4"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 mx-auto border-2 border-primary/30 border-t-primary rounded-full"
          />
          <p className="text-muted-foreground/80 italic">Đang tải...</p>
        </motion.div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="min-h-screen romantic-gradient text-foreground font-serif selection:bg-primary/20 flex flex-col items-center justify-center p-6 relative">
        <FloatingParticles />
        <div className="fixed inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] z-0" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4 p-8 rounded-3xl bg-destructive/10 border border-destructive/20"
        >
          <p className="text-destructive font-medium">{error}</p>
          <button
            onClick={fetchSelections}
            className="text-sm text-primary hover:underline"
          >
            Thử lại
          </button>
        </motion.div>
      </main>
    )
  }

  return (
    <main className="min-h-screen romantic-gradient text-foreground font-serif selection:bg-primary/20 relative">
      <FloatingParticles />
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] z-0" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 md:py-16 lg:py-24 relative z-10">
        <header className="mb-12 md:mb-16">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-muted-foreground/80 hover:text-primary transition-all duration-500 mb-8 md:mb-10"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-500" />
            Quay lại trang chủ
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4 md:space-y-6"
          >
            <div className="flex items-center gap-3 mb-2">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/30 flex items-center justify-center"
              >
                <Heart className="w-6 h-6 md:w-7 md:h-7 text-primary" />
              </motion.div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light italic leading-tight romantic-glow-text">
                Các lựa chọn đã lưu
              </h1>
            </div>
            <p className="font-sans text-sm md:text-base tracking-widest uppercase text-muted-foreground/80 pl-16 md:pl-20">
              Xem lại những kế hoạch đã được tạo
            </p>
            {selections.length > 0 && (
              <div className="pl-16 md:pl-20 pt-2">
                <span className="text-xs md:text-sm text-muted-foreground/70 italic">
                  {selections.length} {selections.length === 1 ? "kế hoạch" : "kế hoạch"}
                </span>
              </div>
            )}
          </motion.div>
        </header>

        <AnimatePresence mode="wait">
          {selections.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="text-center py-24 md:py-32 border border-dashed border-border/40 rounded-3xl bg-gradient-to-br from-card/40 to-card/20 backdrop-blur-sm"
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-6 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center"
              >
                <Heart className="w-8 h-8 md:w-10 md:h-10 text-primary/60" />
              </motion.div>
              <h3 className="text-xl md:text-2xl font-light italic mb-3 romantic-glow-text">
                Chưa có lựa chọn nào được lưu
              </h3>
              <p className="text-sm md:text-base text-muted-foreground/80 italic mb-8 max-w-sm mx-auto">
                Hãy tạo kế hoạch đầu tiên để bắt đầu cuộc phiêu lưu của bạn
              </p>
              <Link
                href="/plan"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 transition-all duration-300 text-sm md:text-base font-medium"
              >
                <Sparkles className="w-4 h-4" />
                Tạo lựa chọn mới
              </Link>
            </motion.div>
          ) : (
            <div className="space-y-8 md:space-y-12">
              {selections.map((selection, index) => (
                <motion.div
                  key={selection.id}
                  initial={{ opacity: 0, y: 30, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.08, duration: 0.5, ease: [0.2, 0, 0, 1] }}
                  className="group relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative glass-romantic rounded-3xl p-6 md:p-8 lg:p-10 border border-border/30 bg-gradient-to-br from-card/80 via-card/60 to-card/40 backdrop-blur-xl shadow-lg shadow-black/5 overflow-hidden">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-8 pb-6 border-b border-border/20">
                      <div className="flex items-start gap-4 flex-1">
                        <motion.div
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          className="flex-shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/30 flex items-center justify-center"
                        >
                          <Calendar className="w-6 h-6 md:w-7 md:h-7 text-primary" />
                        </motion.div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <h2 className="text-lg md:text-xl font-medium text-foreground/90 uppercase tracking-wider">
                              {selection.plan_day === "saturday" 
                                ? "Thứ Bảy" 
                                : selection.plan_day === "sunday" 
                                ? "Chủ Nhật" 
                                : selection.plan_day === "both"
                                ? "Thứ Bảy & Chủ Nhật"
                                : "Chưa xác định"}
                            </h2>
                            {selection.plan_day === "both" && (
                              <Sparkles className="w-4 h-4 text-primary/60" />
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground/60 italic">
                            <Clock className="w-3 h-3" />
                            <span>Tạo lúc: {formatDate(selection.created_at)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <Link
                          href={`/plan?edit=${selection.id}`}
                          className="p-2.5 hover:bg-primary/10 rounded-xl transition-all duration-300 text-muted-foreground/70 hover:text-primary border border-transparent hover:border-primary/20"
                          aria-label="Chỉnh sửa lựa chọn"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(selection.id)}
                          className="p-2.5 hover:bg-destructive/10 rounded-xl transition-all duration-300 text-muted-foreground/70 hover:text-destructive border border-transparent hover:border-destructive/20"
                          aria-label="Xóa lựa chọn"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Content Sections */}
                    <div className="space-y-8">
                      {/* Feeling */}
                      {selection.feeling && (
                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.08 + 0.1 }}
                          className="flex items-start gap-4"
                        >
                          <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                            <Heart className="w-5 h-5 text-primary/70" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xs uppercase tracking-[0.4em] text-muted-foreground/80 font-medium mb-3">
                              Cảm xúc
                            </h3>
                            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-primary/15 to-primary/5 border border-primary/30 text-primary font-medium text-sm shadow-sm">
                              <Sparkles className="w-3.5 h-3.5" />
                              {feelingLabels[selection.feeling] || selection.feeling}
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {/* Locations */}
                      {(selection.selected_locations.saturday.length > 0 ||
                        selection.selected_locations.sunday.length > 0) && (
                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.08 + 0.15 }}
                          className="flex items-start gap-4"
                        >
                          <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                            <Map className="w-5 h-5 text-blue-500/70" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xs uppercase tracking-[0.4em] text-muted-foreground/80 font-medium mb-6">
                              Địa điểm
                            </h3>
                            <div className="space-y-6">
                              {selection.selected_locations.saturday.length > 0 && (
                                <div>
                                  <h4 className="text-sm uppercase tracking-wider text-muted-foreground/70 mb-4 font-medium flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-rose-400/60"></span>
                                    Thứ Bảy
                                  </h4>
                                  <div className="space-y-3">
                                    {selection.selected_locations.saturday.map((loc, idx) => {
                                      const location = getLocationById(loc.locationId)
                                      if (!location) return null
                                      return (
                                        <motion.div
                                          key={idx}
                                          whileHover={{ scale: 1.02 }}
                                          className="p-4 md:p-5 rounded-2xl bg-gradient-to-br from-accent/15 to-accent/5 border border-border/30 hover:border-primary/30 transition-all duration-300 group/item"
                                        >
                                          <div className="flex items-start gap-3">
                                            <MapPin className="w-5 h-5 text-primary/60 group-hover/item:text-primary transition-colors flex-shrink-0 mt-0.5" />
                                            <div className="flex-1 min-w-0">
                                              <h5 className="text-base md:text-lg font-medium mb-1.5 group-hover/item:text-primary transition-colors">
                                                {location.name}
                                              </h5>
                                              <p className="text-sm text-muted-foreground/80 italic mb-3 leading-relaxed">
                                                {location.description}
                                              </p>
                                              <div className="flex items-center gap-2 text-xs text-muted-foreground/70 bg-background/40 px-3 py-1.5 rounded-full w-fit">
                                                <Clock className="w-3.5 h-3.5" />
                                                <span className="font-medium">{loc.time}</span>
                                              </div>
                                            </div>
                                          </div>
                                        </motion.div>
                                      )
                                    })}
                                  </div>
                                </div>
                              )}

                              {selection.selected_locations.sunday.length > 0 && (
                                <div>
                                  <h4 className="text-sm uppercase tracking-wider text-muted-foreground/70 mb-4 font-medium flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-amber-400/60"></span>
                                    Chủ Nhật
                                  </h4>
                                  <div className="space-y-3">
                                    {selection.selected_locations.sunday.map((loc, idx) => {
                                      const location = getLocationById(loc.locationId)
                                      if (!location) return null
                                      return (
                                        <motion.div
                                          key={idx}
                                          whileHover={{ scale: 1.02 }}
                                          className="p-4 md:p-5 rounded-2xl bg-gradient-to-br from-accent/15 to-accent/5 border border-border/30 hover:border-primary/30 transition-all duration-300 group/item"
                                        >
                                          <div className="flex items-start gap-3">
                                            <MapPin className="w-5 h-5 text-primary/60 group-hover/item:text-primary transition-colors flex-shrink-0 mt-0.5" />
                                            <div className="flex-1 min-w-0">
                                              <h5 className="text-base md:text-lg font-medium mb-1.5 group-hover/item:text-primary transition-colors">
                                                {location.name}
                                              </h5>
                                              <p className="text-sm text-muted-foreground/80 italic mb-3 leading-relaxed">
                                                {location.description}
                                              </p>
                                              <div className="flex items-center gap-2 text-xs text-muted-foreground/70 bg-background/40 px-3 py-1.5 rounded-full w-fit">
                                                <Clock className="w-3.5 h-3.5" />
                                                <span className="font-medium">{loc.time}</span>
                                              </div>
                                            </div>
                                          </div>
                                        </motion.div>
                                      )
                                    })}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {/* Food Moods & Cuisines */}
                      {(selection.selected_moods.length > 0 || 
                        (selection.selected_cuisines && selection.selected_cuisines.length > 0) ||
                        (selection.custom_ideas && selection.custom_ideas.length > 0)) && (
                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.08 + 0.2 }}
                          className="flex items-start gap-4"
                        >
                          <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                            <Utensils className="w-5 h-5 text-amber-500/70" />
                          </div>
                          <div className="flex-1 space-y-6">
                            {/* Food Moods */}
                            {selection.selected_moods.length > 0 && (
                              <div>
                                <h3 className="text-xs uppercase tracking-[0.4em] text-muted-foreground/80 font-medium mb-4">
                                  Vị giác
                                </h3>
                                <div className="flex flex-wrap gap-2.5">
                                  {selection.selected_moods.map((moodId) => {
                                    const mood = getMoodById(moodId)
                                    if (!mood) return null
                                    return (
                                      <motion.div
                                        key={moodId}
                                        whileHover={{ scale: 1.05 }}
                                        className="px-4 py-2 rounded-full bg-gradient-to-r from-primary/15 to-primary/5 border border-primary/30 text-primary text-sm font-medium shadow-sm"
                                      >
                                        {mood.label}
                                      </motion.div>
                                    )
                                  })}
                                </div>
                              </div>
                            )}

                            {/* Selected Cuisines */}
                            {selection.selected_cuisines && selection.selected_cuisines.length > 0 && (
                              <div>
                                <h3 className="text-xs uppercase tracking-[0.4em] text-muted-foreground/80 font-medium mb-4 flex items-center gap-2">
                                  <Tag className="w-3.5 h-3.5" />
                                  Loại Món Ăn
                                </h3>
                                <div className="flex flex-wrap gap-2.5">
                                  {selection.selected_cuisines.map((cuisineId) => {
                                    const cuisine = getCuisineById(cuisineId)
                                    if (!cuisine) return null
                                    return (
                                      <motion.div
                                        key={cuisineId}
                                        whileHover={{ scale: 1.05 }}
                                        className="px-4 py-2 rounded-full bg-gradient-to-r from-accent/20 to-accent/10 border border-primary/20 text-foreground/90 text-sm font-medium shadow-sm"
                                      >
                                        {cuisine.name}
                                      </motion.div>
                                    )
                                  })}
                                </div>
                              </div>
                            )}

                            {/* Custom Ideas */}
                            {selection.custom_ideas && selection.custom_ideas.length > 0 && (
                              <div>
                                <h3 className="text-xs uppercase tracking-[0.4em] text-muted-foreground/80 font-medium mb-4">
                                  Món ăn cụ thể
                                </h3>
                                <div className="flex flex-wrap gap-2.5">
                                  {selection.custom_ideas.map((idea, idx) => (
                                    <motion.div
                                      key={idx}
                                      whileHover={{ scale: 1.05 }}
                                      className="px-4 py-2 rounded-full bg-gradient-to-r from-accent/30 to-accent/20 border border-primary/15 text-foreground/90 text-sm uppercase tracking-wider font-medium shadow-sm"
                                    >
                                      {idea}
                                    </motion.div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}

                      {/* Checklist */}
                      {selection.checklist && selection.checklist.items && selection.checklist.items.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.08 + 0.25 }}
                          className="flex items-start gap-4"
                        >
                          <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                            <Check className="w-5 h-5 text-emerald-500/70" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xs uppercase tracking-[0.4em] text-muted-foreground/80 font-medium mb-4">
                              Checklist Chuẩn Bị
                            </h3>
                            <div className="space-y-2.5">
                              {selection.checklist.items.map((item) => {
                                const isChecked = selection.checklist?.checkedItems?.includes(item.id) || false
                                return (
                                  <motion.div
                                    key={item.id}
                                    whileHover={{ scale: 1.01, x: 4 }}
                                    className={`flex items-center gap-3 p-3.5 rounded-xl border transition-all duration-300 ${
                                      isChecked
                                        ? "bg-gradient-to-r from-accent/30 to-accent/20 border-primary/30"
                                        : "bg-background/40 border-border/40 hover:border-primary/20"
                                    }`}
                                  >
                                    <div
                                      className={`flex-shrink-0 w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all duration-300 ${
                                        isChecked
                                          ? "bg-primary border-primary shadow-sm shadow-primary/20"
                                          : "bg-transparent border-border/60"
                                      }`}
                                    >
                                      {isChecked && (
                                        <motion.div
                                          initial={{ scale: 0 }}
                                          animate={{ scale: 1 }}
                                          transition={{ type: "spring", stiffness: 300 }}
                                        >
                                          <Check className="w-3 h-3 text-background" />
                                        </motion.div>
                                      )}
                                    </div>
                                    <span
                                      className={`text-sm transition-all duration-300 ${
                                        isChecked
                                          ? "text-foreground/70 line-through decoration-primary/40"
                                          : "text-muted-foreground/90"
                                      }`}
                                    >
                                      {item.label}
                                    </span>
                                  </motion.div>
                                )
                              })}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>
    </main>
  )
}

