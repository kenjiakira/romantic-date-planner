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
      <div className="text-center py-24 border border-dashed border-border/40 rounded-3xl">
        <MapPin className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
        <p className="text-base text-muted-foreground/80 italic">Chưa có địa điểm nào được chọn</p>
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
        className="space-y-12"
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
              className="grid md:grid-cols-[1fr_2fr] gap-12 md:gap-24 items-start group relative"
            >
              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-3 text-muted-foreground/80">
                  <Clock className="w-4 h-4" />
                  <input
                    type="text"
                    value={selectedLoc.time}
                    onChange={(e) => onUpdateLocationTime(index, e.target.value)}
                    placeholder="Thời gian (VD: 12:00 CH)"
                    className="text-sm tracking-[0.2em] uppercase font-sans font-medium bg-transparent border-b border-border/40 focus:border-primary/60 focus:outline-none w-full"
                  />
                </div>
                <div className="flex items-start gap-3 text-muted-foreground/85">
                  <MapPin className="w-4 h-4 mt-0.5" />
                  <span className="text-base font-sans italic font-medium">{location.name}</span>
                </div>
              </div>

              <div className="space-y-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h2 className="text-3xl md:text-4xl font-light italic group-hover:text-primary transition-colors duration-700">
                      {location.name}
                    </h2>
                    {isBase && (
                      <div className="px-3 py-1 rounded-full bg-accent/30 text-[10px] uppercase tracking-widest text-primary border border-primary/10 font-medium">
                        Căn cứ địa
                      </div>
                    )}
                    <button
                      onClick={() => onRemoveLocation(index)}
                      className="ml-auto p-2 hover:bg-accent/20 rounded-full transition-colors text-muted-foreground/70 hover:text-primary"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <p className="text-xl text-muted-foreground/85 leading-relaxed font-light text-pretty">
                    {location.description}
                  </p>
                  {location.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2">
                      {location.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-3 py-1 rounded-full bg-primary/5 text-primary/80 uppercase tracking-wider font-medium"
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

