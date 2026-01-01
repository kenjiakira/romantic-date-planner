"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Heart, Plus, X } from "lucide-react"
import type React from "react"

const MAX_IDEA_LENGTH = 50

const foodMoods = [
  {
    id: "casual",
    label: "Thoải Mái & Tiện Lợi",
    flavor: "Những món ăn đường phố, đồ ăn nhanh yêu thích",
    color: "bg-[#7c6a5a]",
  },
  {
    id: "peaceful",
    label: "Thanh Đạm & Nhẹ Nhàng",
    flavor: "Chút salad tươi, trái cây hay đồ uống thanh mát",
    color: "bg-[#a8b5a0]",
  },
  {
    id: "shared",
    label: "Sẻ Chia & Kết Nối",
    flavor: "Lẩu nóng hổi hoặc những món ăn cùng nhau nhâm nhi",
    color: "bg-[#9c6a6a]",
  },
  {
    id: "rest",
    label: "Nạp Lại Năng Lượng",
    flavor: "Đồ ăn vặt tại Second Home khi chúng mình đang lười",
    color: "bg-[#d9c5b2]",
  },
] as const

type FoodMoodsSelectorProps = {
  selectedMoods: string[]
  customIdeas: string[]
  onToggleMood: (id: string) => void
  onAddIdea: (idea: string) => void
  onRemoveIdea: (index: number) => void
}

export function FoodMoodsSelector({
  selectedMoods,
  customIdeas,
  onToggleMood,
  onAddIdea,
  onRemoveIdea,
}: FoodMoodsSelectorProps) {
  const [newIdea, setNewIdea] = useState("")
  const [error, setError] = useState<string | null>(null)

  // Validate and check for duplicates
  const canSubmit = useMemo(() => {
    const trimmed = newIdea.trim()
    if (!trimmed) return false
    if (trimmed.length > MAX_IDEA_LENGTH) return false
    if (customIdeas.some((idea) => idea.toLowerCase() === trimmed.toLowerCase())) return false
    return true
  }, [newIdea, customIdeas])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = newIdea.trim()

    if (!trimmed) {
      setError("Vui lòng nhập món ăn")
      return
    }

    if (trimmed.length > MAX_IDEA_LENGTH) {
      setError(`Món ăn không được quá ${MAX_IDEA_LENGTH} ký tự`)
      return
    }

    if (customIdeas.some((idea) => idea.toLowerCase() === trimmed.toLowerCase())) {
      setError("Món ăn này đã có rồi")
      return
    }

    onAddIdea(trimmed)
    setNewIdea("")
    setError(null)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value.length <= MAX_IDEA_LENGTH) {
      setNewIdea(value)
      setError(null)
    }
  }

  return (
    <section className="mt-24 md:mt-48 space-y-12 md:space-y-16">
      <div className="space-y-3 md:space-y-4 text-center">
        <h3 className="text-xs uppercase tracking-[0.4em] text-muted-foreground/80 font-medium">Gợi Ý Vị Giác</h3>
        <h2 className="text-3xl md:text-4xl font-light italic">Cuối tuần này em muốn "ăn" điều gì?</h2>
        <p className="text-sm md:text-base text-muted-foreground/80 font-sans max-w-sm mx-auto px-4">
          Chọn những món ăn phù hợp với tâm trạng và cảm xúc em muốn có cho cuối tuần này.
        </p>
      </div>
      <div
        className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 max-w-2xl mx-auto px-4 md:px-0"
        role="group"
        aria-label="Lựa chọn vị giác"
      >
        {foodMoods.map((mood) => {
          const isSelected = selectedMoods.includes(mood.id)
          return (
            <button
              key={mood.id}
              onClick={() => onToggleMood(mood.id)}
              aria-pressed={isSelected}
              aria-label={`${mood.label}: ${mood.flavor}${isSelected ? " (đã chọn)" : ""}`}
              className={`group relative p-6 md:p-8 rounded-3xl md:rounded-[2.5rem] overflow-hidden transition-all duration-700 text-left sparkle-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 border-2 min-h-[140px] md:min-h-[160px] ${
                isSelected
                  ? "scale-[1.02] romantic-glow border-primary/40 shadow-lg bg-accent/20"
                  : "hover:scale-[1.01] glass-romantic border-border/50 hover:border-primary/30 active:scale-[0.98]"
              }`}
            >
              <div
                className={`absolute inset-0 opacity-10 transition-opacity duration-700 ${mood.color} ${
                  isSelected ? "opacity-25" : "group-hover:opacity-18"
                }`}
                aria-hidden="true"
              />
              <div className="relative z-10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm md:text-sm tracking-widest uppercase font-sans text-muted-foreground/90 font-semibold">
                    {mood.label}
                  </span>
                  {isSelected && (
                    <Heart className="w-5 h-5 md:w-4 md:h-4 text-primary fill-primary" aria-hidden="true" />
                  )}
                </div>
                <p className="text-base md:text-lg italic font-light leading-snug">{mood.flavor}</p>
              </div>
              {isSelected && (
                <motion.div
                  layoutId={`mood-border-${mood.id}`}
                  className="absolute inset-0 border-2 border-primary/40 rounded-3xl md:rounded-[2.5rem]"
                  aria-hidden="true"
                />
              )}
            </button>
          )
        })}
      </div>

      <div className="max-w-md mx-auto space-y-6 md:space-y-8 pt-6 md:pt-8 px-4 md:px-0">
        <div className="space-y-4">
          {customIdeas.length > 0 && (
            <div
              className="flex flex-wrap gap-2 md:gap-3 justify-center"
              role="list"
              aria-label="Danh sách món ăn tùy chỉnh"
            >
              <AnimatePresence mode="popLayout">
                {customIdeas.map((idea, i) => (
                  <motion.span
                    key={`${idea}-${i}`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="px-4 py-2.5 rounded-full bg-accent/40 border-2 border-primary/20 text-xs uppercase tracking-widest font-sans font-semibold flex items-center gap-2 group"
                    role="listitem"
                  >
                    <span>{idea}</span>
                    <button
                      onClick={() => onRemoveIdea(i)}
                      aria-label={`Xóa ${idea}`}
                      className="hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/50 rounded p-0.5 active:scale-95"
                    >
                      <X className="w-4 h-4" aria-hidden="true" />
                    </button>
                  </motion.span>
                ))}
              </AnimatePresence>
            </div>
          )}

          <form onSubmit={handleSubmit} className="relative group space-y-2">
            <div className="relative">
              <input
                type="text"
                value={newIdea}
                onChange={handleInputChange}
                onKeyDown={(e) => {
                  if (e.key === "Escape") {
                    setNewIdea("")
                    setError(null)
                  }
                }}
                placeholder="Ghi chú thêm món em thích..."
                maxLength={MAX_IDEA_LENGTH}
                aria-label="Thêm món ăn tùy chỉnh"
                aria-invalid={error ? "true" : "false"}
                aria-describedby={error ? "idea-error idea-help" : "idea-help"}
                className={`w-full bg-transparent border-b-2 py-4 px-2 text-base md:text-base italic font-light focus:outline-none transition-colors placeholder:text-muted-foreground/70 pr-12 ${
                  error
                    ? "border-destructive/50 focus:border-destructive/70"
                    : "border-border/50 focus:border-primary/60"
                }`}
              />
              <button
                type="submit"
                disabled={!canSubmit}
                aria-label="Thêm món ăn"
                className={`absolute right-2 top-1/2 -translate-y-1/2 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded p-1.5 min-w-[36px] min-h-[36px] flex items-center justify-center ${
                  canSubmit
                    ? "text-muted-foreground/70 hover:text-primary hover:bg-accent/20 cursor-pointer active:scale-95"
                    : "text-muted-foreground/30 cursor-not-allowed"
                }`}
              >
                <Plus className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>
            <div className="flex items-center justify-between px-2 text-xs">
              <span
                id="idea-help"
                className={`${error ? "text-destructive/80" : "text-muted-foreground/60"}`}
              >
                {error || `${newIdea.length}/${MAX_IDEA_LENGTH} ký tự`}
              </span>
              {error && (
                <span id="idea-error" className="sr-only" role="alert">
                  {error}
                </span>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}

