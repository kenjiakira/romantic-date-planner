"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Check, Plus, X, Luggage, Umbrella, Camera, Heart, Sun, Droplets } from "lucide-react"

type ChecklistItem = {
  id: string
  label: string
  icon: React.ReactNode
  category: "essential" | "comfort" | "activity" | "weather"
}

const defaultItems: ChecklistItem[] = [
  {
    id: "phone",
    label: "Điện thoại & sạc dự phòng",
    icon: <Luggage className="w-4 h-4" />,
    category: "essential",
  },
  {
    id: "wallet",
    label: "Ví tiền",
    icon: <Luggage className="w-4 h-4" />,
    category: "essential",
  },
  {
    id: "keys",
    label: "Chìa khóa",
    icon: <Luggage className="w-4 h-4" />,
    category: "essential",
  },
  {
    id: "umbrella",
    label: "Ô/dù",
    icon: <Umbrella className="w-4 h-4" />,
    category: "weather",
  },
  {
    id: "sunscreen",
    label: "Kem chống nắng",
    icon: <Sun className="w-4 h-4" />,
    category: "weather",
  },
  {
    id: "water",
    label: "Nước uống",
    icon: <Droplets className="w-4 h-4" />,
    category: "comfort",
  },
  {
    id: "tissues",
    label: "Khăn giấy",
    icon: <Luggage className="w-4 h-4" />,
    category: "comfort",
  },
]

type SerializableChecklistItem = {
  id: string
  label: string
  category: "essential" | "comfort" | "activity" | "weather"
}

type PreparationChecklistProps = {
  selectedLocations: Array<{ locationId: string; time: string }>
  getLocationById: (id: string) => { category: string; tags: string[] } | undefined
  onChecklistChange?: (data: { items: SerializableChecklistItem[]; checkedItems: string[] }) => void
}

export function PreparationChecklist({ selectedLocations, getLocationById, onChecklistChange }: PreparationChecklistProps) {
  const [items, setItems] = useState<ChecklistItem[]>(defaultItems)
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set())
  const [newItem, setNewItem] = useState("")
  const [showAddForm, setShowAddForm] = useState(false)

  useEffect(() => {
    if (onChecklistChange) {

      const serializableItems = items.map(({ icon, ...item }) => ({
        id: item.id,
        label: item.label,
        category: item.category,
      }))
      onChecklistChange({
        items: serializableItems,
        checkedItems: Array.from(checkedItems),
      })
    }
  }, [items, checkedItems, onChecklistChange])

  const getSuggestedItems = () => {
    const suggestions: ChecklistItem[] = []
    
    selectedLocations.forEach((loc) => {
      const location = getLocationById(loc.locationId)
      if (!location) return

      if (location.category === "outdoor" || location.tags.includes("ngoài trời")) {
        if (!items.find((i) => i.id === "sunscreen")) {
          suggestions.push({
            id: "sunscreen",
            label: "Kem chống nắng",
            icon: <Sun className="w-4 h-4" />,
            category: "weather",
          })
        }
        if (!items.find((i) => i.id === "water")) {
          suggestions.push({
            id: "water",
            label: "Nước uống",
            icon: <Droplets className="w-4 h-4" />,
            category: "comfort",
          })
        }
      }

      if (location.category === "mall" || location.category === "entertainment") {
        if (!items.find((i) => i.id === "comfortable_shoes")) {
          suggestions.push({
            id: "comfortable_shoes",
            label: "Giày dép thoải mái",
            icon: <Luggage className="w-4 h-4" />,
            category: "comfort",
          })
        }
      }
    })

    return suggestions.filter((s) => !items.find((i) => i.id === s.id))
  }

  const suggestedItems = getSuggestedItems()

  const toggleItem = (id: string) => {
    setCheckedItems((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  const addCustomItem = (e: React.FormEvent) => {
    e.preventDefault()
    if (newItem.trim()) {
      const newId = `custom-${Date.now()}`
      setItems([
        ...items,
        {
          id: newId,
          label: newItem.trim(),
          icon: <Heart className="w-4 h-4" />,
          category: "comfort",
        },
      ])
      setNewItem("")
      setShowAddForm(false)
    }
  }

  const removeItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id))
    setCheckedItems((prev) => {
      const newSet = new Set(prev)
      newSet.delete(id)
      return newSet
    })
  }

  const addSuggestedItems = () => {
    setItems([...items, ...suggestedItems])
  }

  const categories = {
    essential: { label: "Cần thiết", color: "text-red-400/80" },
    comfort: { label: "Thoải mái", color: "text-blue-400/80" },
    activity: { label: "Hoạt động", color: "text-purple-400/80" },
    weather: { label: "Thời tiết", color: "text-amber-400/80" },
  }

  const groupedItems = items.reduce(
    (acc, item) => {
      if (!acc[item.category]) acc[item.category] = []
      acc[item.category].push(item)
      return acc
    },
    {} as Record<string, ChecklistItem[]>
  )

  const totalItems = items.length
  const checkedCount = checkedItems.size
  const progress = totalItems > 0 ? (checkedCount / totalItems) * 100 : 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.2, 0, 0, 1] }}
      className="space-y-6"
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs uppercase tracking-[0.4em] text-muted-foreground/80 font-medium mb-2">
              Checklist Chuẩn Bị
            </h3>
            <h2 className="text-3xl font-light italic romantic-glow-text">Những thứ cần mang theo</h2>
          </div>
          <div className="text-right">
            <div className="text-2xl font-light italic romantic-glow-text">
              {checkedCount}/{totalItems}
            </div>
            <div className="text-xs text-muted-foreground/70 uppercase tracking-widest">Đã chuẩn bị</div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="relative h-2 bg-background/40 rounded-full overflow-hidden border border-border/20">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.8, ease: [0.2, 0, 0, 1] }}
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary/60 to-primary/40 rounded-full"
          />
        </div>
      </div>

      {/* Suggested items */}
      {suggestedItems.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-2xl bg-accent/20 border border-primary/10"
        >
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-muted-foreground/85 italic">
              Gợi ý dựa trên địa điểm đã chọn:
            </p>
            <button
              onClick={addSuggestedItems}
              className="text-xs uppercase tracking-widest text-primary hover:text-primary/80 transition-colors font-medium flex items-center gap-2"
            >
              <Plus className="w-3 h-3" />
              Thêm tất cả
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {suggestedItems.map((item) => (
              <span
                key={item.id}
                className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary/80 uppercase tracking-wider font-medium"
              >
                {item.label}
              </span>
            ))}
          </div>
        </motion.div>
      )}

      {/* Checklist items grouped by category */}
      <div className="space-y-6">
        {Object.entries(groupedItems).map(([category, categoryItems]) => (
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            <h4 className={`text-xs uppercase tracking-widest font-medium ${categories[category as keyof typeof categories]?.color || "text-muted-foreground/70"}`}>
              {categories[category as keyof typeof categories]?.label || category}
            </h4>
            <div className="space-y-2">
              <AnimatePresence mode="popLayout">
                {categoryItems.map((item) => {
                  const isChecked = checkedItems.has(item.id)
                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="group relative"
                    >
                      <button
                        onClick={() => toggleItem(item.id)}
                        className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all duration-500 text-left ${
                          isChecked
                            ? "bg-accent/30 border-primary/20 romantic-glow"
                            : "bg-transparent border-border/40 hover:border-primary/20 hover:bg-accent/10 glass-romantic"
                        }`}
                      >
                        <div
                          className={`flex-shrink-0 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-500 ${
                            isChecked
                              ? "bg-primary border-primary"
                              : "bg-transparent border-border/60 group-hover:border-primary/40"
                          }`}
                        >
                          {isChecked && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: "spring", stiffness: 300 }}
                            >
                              <Check className="w-4 h-4 text-background" />
                            </motion.div>
                          )}
                        </div>
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className={`transition-colors duration-500 ${isChecked ? "text-primary" : "text-muted-foreground/70 group-hover:text-muted-foreground/90"}`}>
                            {item.icon}
                          </div>
                          <span
                            className={`text-base font-light transition-all duration-500 ${
                              isChecked
                                ? "text-foreground line-through decoration-primary/40"
                                : "text-muted-foreground/90 group-hover:text-foreground"
                            }`}
                          >
                            {item.label}
                          </span>
                        </div>
                        {item.id.startsWith("custom-") && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              removeItem(item.id)
                            }}
                            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-accent/20 rounded-full text-muted-foreground/70 hover:text-primary"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </button>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Add custom item */}
      <div className="pt-4 border-t border-border/20">
        {!showAddForm ? (
          <button
            onClick={() => setShowAddForm(true)}
            className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl border border-dashed border-border/40 hover:border-primary/40 hover:bg-accent/10 transition-all duration-500 text-muted-foreground/70 hover:text-primary group"
          >
            <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-500" />
            <span className="text-sm uppercase tracking-widest font-medium">Thêm mục mới</span>
          </button>
        ) : (
          <motion.form
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            onSubmit={addCustomItem}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              placeholder="Nhập tên mục cần thêm..."
              autoFocus
              className="flex-1 bg-transparent border-b border-border/50 py-3 px-2 text-base italic font-light focus:outline-none focus:border-primary/50 transition-colors placeholder:text-muted-foreground/70"
            />
            <button
              type="submit"
              disabled={!newItem.trim()}
              className="p-3 rounded-full bg-primary/10 border border-primary/20 hover:bg-primary/20 disabled:opacity-50 transition-all text-primary"
            >
              <Plus className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => {
                setShowAddForm(false)
                setNewItem("")
              }}
              className="p-3 rounded-full bg-background/40 border border-border/40 hover:bg-accent/20 transition-all text-muted-foreground/70 hover:text-primary"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.form>
        )}
      </div>
    </motion.div>
  )
}

