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
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <h3 className="text-xs uppercase tracking-[0.4em] text-muted-foreground/80 font-medium">
            Địa điểm cho {activeDay === "saturday" ? "Thứ Bảy" : "Chủ Nhật"}
          </h3>
          <span className="text-sm text-muted-foreground/80 font-medium">
            ({selectedLocations.length}/{maxLocationsPerDay})
          </span>
        </div>
        <button
          onClick={() => canAddMoreLocations && onShowPicker(!showLocationPicker)}
          disabled={!canAddMoreLocations}
          className={`text-sm uppercase tracking-widest transition-colors flex items-center gap-2 font-medium ${
            canAddMoreLocations
              ? "text-muted-foreground/90 hover:text-primary"
              : "text-muted-foreground/50 cursor-not-allowed"
          }`}
        >
          <Plus className="w-4 h-4" />
          {canAddMoreLocations ? "Thêm địa điểm" : "Đã đạt giới hạn"}
        </button>
      </div>

      {!canAddMoreLocations && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-2xl bg-accent/20 border border-primary/10 text-center"
        >
          <p className="text-base text-muted-foreground/85 italic">
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
          <p className="text-sm text-muted-foreground/80 italic text-center">
            Chọn tối đa {maxLocationsPerDay} địa điểm. Thời gian sẽ được tự động đề xuất.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6 rounded-3xl border border-border/40 bg-card/50 backdrop-blur-sm">
            {locations.map((location) => {
              const isSelected = selectedLocations.some((loc) => loc.locationId === location.id)
              const isDisabled = !canAddMoreLocations || isSelected
              return (
                <button
                  key={location.id}
                  onClick={() => !isDisabled && onAddLocation(location.id)}
                  disabled={isDisabled}
                  className={`p-4 rounded-2xl border text-left transition-all duration-500 ${
                    isDisabled
                      ? "bg-accent/20 border-primary/20 opacity-50 cursor-not-allowed"
                      : "bg-transparent border-border/40 hover:border-primary/20 hover:bg-accent/10"
                  }`}
                >
                  <h4 className="text-base font-medium mb-2">{location.name}</h4>
                  <p className="text-sm text-muted-foreground/80 italic leading-relaxed">{location.description}</p>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {location.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] px-2 py-0.5 rounded-full bg-primary/5 text-primary/80 uppercase tracking-wider font-medium"
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

