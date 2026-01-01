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
    <div className="flex gap-12 border-b border-border/40 pb-4 mt-12">
      <button
        onClick={() => !isSaturdayDisabled && onDayChange("saturday")}
        disabled={isSaturdayDisabled}
        className={`relative pb-4 text-base uppercase tracking-[0.4em] transition-all duration-700 font-medium ${
          isSaturdayDisabled
            ? "text-muted-foreground/30 cursor-not-allowed"
            : activeDay === "saturday"
            ? "text-foreground"
            : "text-muted-foreground/70 hover:text-muted-foreground/90"
        }`}
      >
        Thứ Bảy
        {activeDay === "saturday" && !isSaturdayDisabled && (
          <motion.div
            layoutId="underline"
            className="absolute bottom-0 left-0 right-0 h-px bg-primary"
            transition={{ type: "spring", bounce: 0.2, duration: 0.8 }}
          />
        )}
      </button>
      <button
        onClick={() => !isSundayDisabled && onDayChange("sunday")}
        disabled={isSundayDisabled}
        className={`relative pb-4 text-base uppercase tracking-[0.4em] transition-all duration-700 font-medium ${
          isSundayDisabled
            ? "text-muted-foreground/30 cursor-not-allowed"
            : activeDay === "sunday"
            ? "text-foreground"
            : "text-muted-foreground/70 hover:text-muted-foreground/90"
        }`}
      >
        Chủ Nhật
        {activeDay === "sunday" && !isSundayDisabled && (
          <motion.div
            layoutId="underline"
            className="absolute bottom-0 left-0 right-0 h-px bg-primary"
            transition={{ type: "spring", bounce: 0.2, duration: 0.8 }}
          />
        )}
      </button>
    </div>
  )
}

