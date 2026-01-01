"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Heart, Plus, X } from "lucide-react"
import type React from "react"

const MAX_IDEA_LENGTH = 50

const getCuisineImage = (cuisineId: string): string | null => {
  const imageMap: Record<string, string> = {
    vietnamese: "/images/vietnam-food.jpg",
    japanese: "/images/japan-food.jpg",
    korean: "/images/korea-food.jpg",
    thai: "/images/thai-food.jpg",
    chinese: "/images/chinese-food.jpeg",
    western: "/images/us-food.webp",
    italian: "/images/italian-food.avif",
    french: "/images/french-food.webp",
  }
  return imageMap[cuisineId] || null
}

const getFoodMoodImage = (moodId: string): string | null => {
  const imageMap: Record<string, string> = {
    casual: "/images/casual.webp",
    peaceful: "/images/cofe.avif", 
    shared: "/images/street-food.jpg", 
    rest: "/images/home.avif",
  }
  return imageMap[moodId] || null
}

const cuisines = [
  {
    id: "vietnamese",
    name: "Việt Nam",
    description: "Phở, bún chả, bánh mì, cơm tấm...",
    tags: ["quen thuộc", "đậm đà", "đa dạng"],
  },
  {
    id: "japanese",
    name: "Nhật Bản",
    description: "Sushi, ramen, udon, tempura...",
    tags: ["tinh tế", "thanh đạm", "tươi ngon"],
  },
  {
    id: "korean",
    name: "Hàn Quốc",
    description: "BBQ, kimchi, bibimbap, tteokbokki...",
    tags: ["đậm vị", "nóng hổi", "đa dạng"],
  },
  {
    id: "thai",
    name: "Thái Lan",
    description: "Tom yum, pad thai, green curry...",
    tags: ["cay nồng", "chua ngọt", "đậm đà"],
  },
  {
    id: "chinese",
    name: "Trung Hoa",
    description: "Dim sum, lẩu, mì xào, vịt quay...",
    tags: ["phong phú", "đa dạng", "nhiều món"],
  },
  {
    id: "western",
    name: "Âu Mỹ",
    description: "Pizza, pasta, burger, steak...",
    tags: ["quen thuộc", "no bụng", "dễ ăn"],
  },
  {
    id: "italian",
    name: "Ý",
    description: "Pasta, pizza, risotto, tiramisu...",
    tags: ["lãng mạn", "tinh tế", "no bụng"],
  },
  {
    id: "french",
    name: "Pháp",
    description: "Bánh mì, croissant, escargot...",
    tags: ["tinh tế", "lãng mạn", "đặc biệt"],
  },
] as const

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
  selectedCuisines?: string[]
  customIdeas: string[]
  onToggleMood: (id: string) => void
  onToggleCuisine?: (id: string) => void
  onAddIdea: (idea: string) => void
  onRemoveIdea: (index: number) => void
}

export function FoodMoodsSelector({
  selectedMoods,
  selectedCuisines = [],
  customIdeas,
  onToggleMood,
  onToggleCuisine,
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
          const imagePath = getFoodMoodImage(mood.id)
          return (
            <button
              key={mood.id}
              onClick={() => onToggleMood(mood.id)}
              aria-pressed={isSelected}
              aria-label={`${mood.label}: ${mood.flavor}${isSelected ? " (đã chọn)" : ""}`}
              className={`group relative p-6 md:p-8 rounded-3xl md:rounded-[2.5rem] overflow-hidden transition-all duration-700 text-left sparkle-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 border-2 min-h-[140px] md:min-h-[160px] ${
                isSelected
                  ? "scale-[1.02] romantic-glow border-primary/40 shadow-lg"
                  : "hover:scale-[1.01] glass-romantic border-border/50 hover:border-primary/30 active:scale-[0.98]"
              }`}
              style={
                imagePath
                  ? {
                      backgroundImage: `url(${imagePath})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat",
                    }
                  : undefined
              }
            >
              {/* Overlay for better text readability */}
              <div
                className={`absolute inset-0 transition-opacity duration-300 ${
                  isSelected
                    ? imagePath
                      ? "bg-black/60"
                      : "bg-black/40"
                    : imagePath
                    ? "bg-black/60 group-hover:bg-black/70"
                    : "bg-black/50 group-hover:bg-black/60"
                }`}
                aria-hidden="true"
              />
              <div className="relative z-10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm md:text-sm tracking-widest uppercase font-sans text-white drop-shadow-lg font-semibold">
                    {mood.label}
                  </span>
                  {isSelected && (
                    <Heart className="w-5 h-5 md:w-4 md:h-4 text-primary fill-primary" aria-hidden="true" />
                  )}
                </div>
                <p className="text-base md:text-lg italic font-light leading-snug text-white drop-shadow-md">{mood.flavor}</p>
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

      {/* Cuisine Selection Section */}
      {onToggleCuisine && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6 md:space-y-8"
        >
          <div className="text-center space-y-2">
            <h3 className="text-xs uppercase tracking-[0.4em] text-muted-foreground/80 font-medium">
              Loại Món Ăn
            </h3>
            <p className="text-sm text-muted-foreground/80 italic px-4">
              Chọn các loại món ăn em muốn thử cuối tuần này
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 max-w-4xl mx-auto px-4 md:px-0">
            {cuisines.map((cuisine) => {
              const isSelected = selectedCuisines.includes(cuisine.id)
              const imagePath = getCuisineImage(cuisine.id)
              return (
                <button
                  key={cuisine.id}
                  onClick={() => onToggleCuisine(cuisine.id)}
                  className={`relative p-4 md:p-5 rounded-2xl border-2 text-left transition-all duration-300 min-h-[120px] md:min-h-[140px] overflow-hidden group ${
                    isSelected
                      ? "border-primary/50 shadow-md scale-[1.02]"
                      : "border-border/50 hover:border-primary/40 hover:shadow-md active:scale-[0.98]"
                  }`}
                  style={
                    imagePath
                      ? {
                          backgroundImage: `url(${imagePath})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                          backgroundRepeat: "no-repeat",
                        }
                      : undefined
                  }
                >
                  {/* Overlay for better text readability */}
                  <div
                    className={`absolute inset-0 transition-opacity duration-300 ${
                      isSelected
                        ? imagePath
                          ? "bg-black/70"
                          : "bg-accent/30"
                        : imagePath
                        ? "bg-black/60 group-hover:bg-black/70"
                        : "bg-accent/20 group-hover:bg-accent/30"
                    }`}
                    aria-hidden="true"
                  />
                  <div className="relative z-10 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm md:text-base font-semibold text-white drop-shadow-lg">{cuisine.name}</h4>
                      {isSelected && (
                        <Heart className="w-4 h-4 text-primary fill-primary" aria-hidden="true" />
                      )}
                    </div>
                    <p className="text-xs md:text-sm text-white/90 italic leading-relaxed line-clamp-2 drop-shadow-md">
                      {cuisine.description}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {cuisine.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="text-[9px] px-1.5 py-0.5 rounded-full bg-white/20 backdrop-blur-sm text-white uppercase tracking-wider font-semibold border border-white/30"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  {isSelected && (
                    <motion.div
                      layoutId={`cuisine-border-${cuisine.id}`}
                      className="absolute inset-0 border-2 border-primary/40 rounded-2xl"
                      aria-hidden="true"
                    />
                  )}
                </button>
              )
            })}
          </div>
        </motion.div>
      )}

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

