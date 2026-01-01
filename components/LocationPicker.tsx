"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus } from "lucide-react"
import type React from "react"

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
  onAddCustomLocation?: (locationName: string) => void
}

const MAX_LOCATION_NAME_LENGTH = 50

const getLocationImage = (locationId: string): string | null => {
  const imageMap: Record<string, string> = {
    cinema: "/images/cinema.jpeg",
    quiet_cafe: "/images/cofe.avif",
    aeon_xuan_thuy: "/images/eaon-mall.webp",
    game_center: "/images/game-center.jpg",
    park_walk: "/images/park.jpg",
    photobooth: "/images/photobooth.png",
    street_food: "/images/street-food.jpg",
    random_walk: "/images/walk.jpg",
    lotte_center: "/images/lotte-center.jpg",
    second_home: "/images/home.avif",
    bookstore: "/images/book_store.jpg",
    art_gallery: "/images/art_gallery.jpg", 
    picnic: "/images/picnic.jpg",
  }
  return imageMap[locationId] || null
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
  onAddCustomLocation,
}: LocationPickerProps) {
  const [customLocationName, setCustomLocationName] = useState("")
  const [error, setError] = useState<string | null>(null)

  const canSubmitCustom = useMemo(() => {
    const trimmed = customLocationName.trim()
    if (!trimmed) return false
    if (trimmed.length > MAX_LOCATION_NAME_LENGTH) return false
    // Check if already selected (check by name for custom locations)
    const isAlreadySelected = selectedLocations.some((loc) => {
      if (loc.locationId.startsWith("custom_")) {
        return loc.locationId === `custom_${trimmed}`
      }
      return false
    })
    return !isAlreadySelected
  }, [customLocationName, selectedLocations])

  const handleSubmitCustom = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = customLocationName.trim()

    if (!trimmed) {
      setError("Vui lòng nhập tên địa điểm")
      return
    }

    if (trimmed.length > MAX_LOCATION_NAME_LENGTH) {
      setError(`Tên địa điểm không được quá ${MAX_LOCATION_NAME_LENGTH} ký tự`)
      return
    }

    if (onAddCustomLocation) {
      onAddCustomLocation(trimmed)
      setCustomLocationName("")
      setError(null)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value.length <= MAX_LOCATION_NAME_LENGTH) {
      setCustomLocationName(value)
      setError(null)
    }
  }

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
          className="space-y-6"
        >
          <p className="text-sm text-muted-foreground/80 italic text-center px-4">
            Chọn tối đa {maxLocationsPerDay} địa điểm. Thời gian sẽ được tự động đề xuất.
          </p>

          {/* Custom Location Input */}
          {onAddCustomLocation && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 md:p-5 rounded-2xl border-2 border-primary/30 bg-accent/20 backdrop-blur-sm"
            >
              <form onSubmit={handleSubmitCustom} className="space-y-3">
                <div className="relative">
                  <input
                    type="text"
                    value={customLocationName}
                    onChange={handleInputChange}
                    onKeyDown={(e) => {
                      if (e.key === "Escape") {
                        setCustomLocationName("")
                        setError(null)
                      }
                    }}
                    placeholder="Nhập địa điểm tùy chỉnh..."
                    maxLength={MAX_LOCATION_NAME_LENGTH}
                    aria-label="Thêm địa điểm tùy chỉnh"
                    aria-invalid={error ? "true" : "false"}
                    aria-describedby={error ? "custom-location-error custom-location-help" : "custom-location-help"}
                    className={`w-full bg-background/50 border-2 py-3 px-4 text-base font-light rounded-xl focus:outline-none transition-colors placeholder:text-muted-foreground/70 pr-12 ${
                      error
                        ? "border-destructive/50 focus:border-destructive/70"
                        : "border-border/50 focus:border-primary/60"
                    }`}
                  />
                  <button
                    type="submit"
                    disabled={!canSubmitCustom}
                    aria-label="Thêm địa điểm tùy chỉnh"
                    className={`absolute right-2 top-1/2 -translate-y-1/2 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded-lg p-2 min-w-[36px] min-h-[36px] flex items-center justify-center ${
                      canSubmitCustom
                        ? "text-primary hover:bg-primary/10 cursor-pointer active:scale-95"
                        : "text-muted-foreground/30 cursor-not-allowed"
                    }`}
                  >
                    <Plus className="w-5 h-5" aria-hidden="true" />
                  </button>
                </div>
                <div className="flex items-center justify-between px-1 text-xs">
                  <span
                    id="custom-location-help"
                    className={`${error ? "text-destructive/80" : "text-muted-foreground/60"}`}
                  >
                    {error || `${customLocationName.length}/${MAX_LOCATION_NAME_LENGTH} ký tự`}
                  </span>
                  {error && (
                    <span id="custom-location-error" className="sr-only" role="alert">
                      {error}
                    </span>
                  )}
                </div>
              </form>
            </motion.div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 p-4 md:p-6 rounded-3xl border-2 border-border/50 bg-card/60 backdrop-blur-sm">
            {locations.map((location) => {
              const isSelected = selectedLocations.some((loc) => loc.locationId === location.id)
              const isDisabled = !canAddMoreLocations || isSelected
              const imagePath = getLocationImage(location.id)
              return (
                <button
                  key={location.id}
                  onClick={() => !isDisabled && onAddLocation(location.id)}
                  disabled={isDisabled}
                  className={`relative p-4 md:p-4 rounded-2xl border-2 text-left transition-all duration-500 min-h-[140px] overflow-hidden group ${
                    isDisabled
                      ? "border-primary/20 opacity-50 cursor-not-allowed"
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
                      isDisabled
                        ? "bg-black/60"
                        : imagePath
                          ? "bg-black/40 group-hover:bg-black/50"
                          : "bg-accent/20 group-hover:bg-accent/30"
                    }`}
                  />
                  
                  {/* Content */}
                  <div className="relative z-10">
                    <h4 className="text-base font-semibold mb-2 text-white drop-shadow-lg">{location.name}</h4>
                    <p className="text-sm text-white/90 italic leading-relaxed line-clamp-2 drop-shadow-md">{location.description}</p>
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {location.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] px-2 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white uppercase tracking-wider font-semibold border border-white/30"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
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

