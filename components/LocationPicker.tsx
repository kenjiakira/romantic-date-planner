"use client"

import { motion } from "framer-motion"
import { Plus } from "lucide-react"

type Location = {
  id: string
  name: string
  category: string
  description: string
  tags: string[]
}

type SelectedLocation = {
  locationId: string
  time: string
}

type LocationPickerProps = {
  locations: Location[]
  selectedLocations: SelectedLocation[]
  showLocationPicker: boolean
  canAddMoreLocations: boolean
  maxLocationsPerDay: number
  activeDay: "saturday" | "sunday"
  onShowPicker: (show: boolean) => void
  onAddLocation: (locationId: string) => void
}

export function LocationPicker({
  locations,
  selectedLocations,
  showLocationPicker,
  canAddMoreLocations,
  maxLocationsPerDay,
  activeDay,
  onShowPicker,
  onAddLocation,
}: LocationPickerProps) {
  return (
    <>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
        <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
          <h3 className="text-xs uppercase tracking-[0.4em] text-muted-foreground/80 font-medium">
            Địa điểm cho {activeDay === "saturday" ? "Thứ Bảy" : "Chủ Nhật"}
          </h3>
          <span className="text-sm text-muted-foreground/80 font-semibold">
            ({selectedLocations.length}/{maxLocationsPerDay})
          </span>
        </div>
        <button
          onClick={() => canAddMoreLocations && onShowPicker(!showLocationPicker)}
          disabled={!canAddMoreLocations}
          className={`text-sm uppercase tracking-widest transition-all flex items-center gap-2 font-semibold px-5 py-3 rounded-full border-2 min-h-[48px] ${
            canAddMoreLocations
              ? "text-foreground border-primary/40 bg-accent/30 hover:bg-accent/40 hover:border-primary/60 hover:shadow-md active:scale-95"
              : "text-muted-foreground/50 border-border/30 bg-transparent cursor-not-allowed"
          }`}
        >
          <Plus className="w-5 h-5" />
          <span>{canAddMoreLocations ? "Thêm địa điểm" : "Đã đạt giới hạn"}</span>
        </button>
      </div>

      {!canAddMoreLocations && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 md:p-4 rounded-2xl bg-accent/30 border-2 border-primary/20 text-center"
        >
          <p className="text-sm md:text-base text-muted-foreground/85 italic">
            Bạn đã chọn đủ {maxLocationsPerDay} địa điểm. Hãy xóa một địa điểm nếu muốn thêm mới.
          </p>
        </motion.div>
      )}

      {showLocationPicker && canAddMoreLocations && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="space-y-4"
        >
          <p className="text-sm text-muted-foreground/80 italic text-center px-4">
            Chọn tối đa {maxLocationsPerDay} địa điểm. Thời gian sẽ được tự động đề xuất.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 p-4 md:p-6 rounded-3xl border-2 border-border/50 bg-card/60 backdrop-blur-sm">
            {locations.map((location) => {
              const isSelected = selectedLocations.some((loc) => loc.locationId === location.id)
              const isDisabled = !canAddMoreLocations || isSelected
              return (
                <button
                  key={location.id}
                  onClick={() => !isDisabled && onAddLocation(location.id)}
                  disabled={isDisabled}
                  className={`p-4 md:p-4 rounded-2xl border-2 text-left transition-all duration-500 min-h-[140px] ${
                    isDisabled
                      ? "bg-accent/20 border-primary/20 opacity-50 cursor-not-allowed"
                      : "bg-transparent border-border/50 hover:border-primary/40 hover:bg-accent/20 hover:shadow-md active:scale-[0.98]"
                  }`}
                >
                  <h4 className="text-base font-semibold mb-2">{location.name}</h4>
                  <p className="text-sm text-muted-foreground/80 italic leading-relaxed line-clamp-2">{location.description}</p>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {location.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] px-2 py-1 rounded-full bg-primary/10 text-primary/80 uppercase tracking-wider font-semibold"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </button>
              )
            })}
          </div>
        </motion.div>
      )}
    </>
  )
}

