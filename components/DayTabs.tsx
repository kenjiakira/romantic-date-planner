"use client"

import { motion } from "framer-motion"

type DayTabsProps = {
  activeDay: "saturday" | "sunday"
  onDayChange: (day: "saturday" | "sunday") => void
  disabledDays?: ("saturday" | "sunday")[]
}

export function DayTabs({ activeDay, onDayChange, disabledDays = [] }: DayTabsProps) {
  const isSaturdayDisabled = disabledDays.includes("saturday")
  const isSundayDisabled = disabledDays.includes("sunday")

  return (
    <div className="flex gap-6 md:gap-12 border-b-2 border-border/50 pb-4 mt-8 md:mt-12">
      <button
        onClick={() => !isSaturdayDisabled && onDayChange("saturday")}
        disabled={isSaturdayDisabled}
        className={`relative pb-4 px-2 md:px-0 text-base md:text-base uppercase tracking-[0.4em] transition-all duration-700 font-semibold min-h-[48px] flex items-center ${
          isSaturdayDisabled
            ? "text-muted-foreground/30 cursor-not-allowed"
            : activeDay === "saturday"
            ? "text-foreground"
            : "text-muted-foreground/70 hover:text-primary/80 active:scale-95"
        }`}
      >
        Thứ Bảy
        {activeDay === "saturday" && !isSaturdayDisabled && (
          <motion.div
            layoutId="underline"
            className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-full"
            transition={{ type: "spring", bounce: 0.2, duration: 0.8 }}
          />
        )}
      </button>
      <button
        onClick={() => !isSundayDisabled && onDayChange("sunday")}
        disabled={isSundayDisabled}
        className={`relative pb-4 px-2 md:px-0 text-base md:text-base uppercase tracking-[0.4em] transition-all duration-700 font-semibold min-h-[48px] flex items-center ${
          isSundayDisabled
            ? "text-muted-foreground/30 cursor-not-allowed"
            : activeDay === "sunday"
            ? "text-foreground"
            : "text-muted-foreground/70 hover:text-primary/80 active:scale-95"
        }`}
      >
        Chủ Nhật
        {activeDay === "sunday" && !isSundayDisabled && (
          <motion.div
            layoutId="underline"
            className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-full"
            transition={{ type: "spring", bounce: 0.2, duration: 0.8 }}
          />
        )}
      </button>
    </div>
  )
}

