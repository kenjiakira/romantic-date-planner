"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Clock, MapPin, X } from "lucide-react"

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

type SelectedLocationsListProps = {
  selectedLocations: SelectedLocation[]
  getLocationById: (id: string) => Location | undefined
  onRemoveLocation: (index: number) => void
  onUpdateLocationTime: (index: number, time: string) => void
}

export function SelectedLocationsList({
  selectedLocations,
  getLocationById,
  onRemoveLocation,
  onUpdateLocationTime,
}: SelectedLocationsListProps) {
  if (selectedLocations.length === 0) {
    return (
      <div className="text-center py-16 md:py-24 border-2 border-dashed border-border/50 rounded-3xl px-4">
        <MapPin className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
        <p className="text-base md:text-base text-muted-foreground/80 italic">Chưa có địa điểm nào được chọn</p>
        <p className="text-sm text-muted-foreground/70 mt-2">Nhấn "Thêm địa điểm" để bắt đầu</p>
      </div>
    )
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.8, ease: [0.2, 0, 0, 1] }}
        className="space-y-8 md:space-y-12"
      >
        {selectedLocations.map((selectedLoc, index) => {
          const location = getLocationById(selectedLoc.locationId)
          if (!location) return null

          const isBase = location.tags.includes("base")

          return (
            <motion.div
              key={`${selectedLoc.locationId}-${index}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid md:grid-cols-[1fr_2fr] gap-8 md:gap-12 lg:gap-24 items-start group relative p-4 md:p-6 rounded-3xl border-2 border-border/30 bg-card/30 hover:bg-card/50 hover:border-primary/20 transition-all duration-500"
            >
              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-3 text-muted-foreground/80">
                  <Clock className="w-4 h-4 flex-shrink-0" />
                  <input
                    type="text"
                    value={selectedLoc.time}
                    onChange={(e) => onUpdateLocationTime(index, e.target.value)}
                    placeholder="Thời gian (VD: 12:00 CH)"
                    className="text-sm tracking-[0.2em] uppercase font-sans font-semibold bg-transparent border-b-2 border-border/40 focus:border-primary/60 focus:outline-none w-full py-1"
                  />
                </div>
                <div className="flex items-start gap-3 text-muted-foreground/85">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span className="text-base font-sans italic font-semibold">{location.name}</span>
                </div>
              </div>

              <div className="space-y-6 md:space-y-8">
                <div className="space-y-4">
                  <div className="flex items-start gap-3 flex-wrap">
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-light italic group-hover:text-primary transition-colors duration-700 flex-1 min-w-0">
                      {location.name}
                    </h2>
                    {isBase && (
                      <div className="px-3 py-1.5 rounded-full bg-accent/40 text-[10px] uppercase tracking-widest text-primary border-2 border-primary/20 font-semibold">
                        Căn cứ địa
                      </div>
                    )}
                    <button
                      onClick={() => onRemoveLocation(index)}
                      className="p-2.5 hover:bg-accent/30 rounded-full transition-all text-muted-foreground/70 hover:text-destructive hover:border-2 hover:border-destructive/30 active:scale-95 min-w-[44px] min-h-[44px] flex items-center justify-center"
                      aria-label="Xóa địa điểm"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  {location.category !== "custom" && (
                    <p className="text-lg md:text-xl text-muted-foreground/85 leading-relaxed font-light text-pretty">
                      {location.description}
                    </p>
                  )}
                  {location.category === "custom" && (
                    <p className="text-base md:text-lg text-muted-foreground/70 leading-relaxed font-light italic">
                      Địa điểm tùy chỉnh của bạn
                    </p>
                  )}
                  {location.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2">
                      {location.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-3 py-1.5 rounded-full bg-primary/10 text-primary/80 uppercase tracking-wider font-semibold border border-primary/10"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )
        })}
      </motion.div>
    </AnimatePresence>
  )
}

