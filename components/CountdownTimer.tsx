"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Heart, Clock, Calendar } from "lucide-react"

type TimeLeft = {
  days: number
  hours: number
  minutes: number
  seconds: number
}

const TARGET_DATE = new Date("2026-01-10T12:00:00").getTime()

export function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    const calculateTimeLeft = () => {
      const now = Date.now()
      const difference = TARGET_DATE - now

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        })
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      }
    }

    calculateTimeLeft()
    const interval = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(interval)
  }, [])

  if (!mounted) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative p-8 rounded-3xl border border-border/40 bg-gradient-to-br from-card/60 to-card/40 backdrop-blur-xl glass-romantic overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-50" />
        <div className="relative flex items-center justify-center">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 animate-pulse" />
        </div>
      </motion.div>
    )
  }

  const timeUnits = [
    { label: "Ngày", value: timeLeft.days, icon: Calendar },
    { label: "Giờ", value: timeLeft.hours, icon: Clock },
    { label: "Phút", value: timeLeft.minutes, icon: Clock },
    { label: "Giây", value: timeLeft.seconds, icon: Heart },
  ]

  const isTimeUp = timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.2, 0, 0, 1] }}
      className="relative p-8 rounded-3xl border border-border/30 bg-gradient-to-br from-card/80 via-card/60 to-card/40 backdrop-blur-xl glass-romantic sparkle-hover overflow-hidden group"
    >
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/10 opacity-60 group-hover:opacity-80 transition-opacity duration-700" />
      <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-accent/10 to-transparent rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2 opacity-50" />
      
      <div className="relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 mb-4 relative"
          >
            <div className="absolute inset-0 bg-primary/10 rounded-2xl blur-xl" />
            <Heart className="w-8 h-8 text-primary relative z-10" />
          </motion.div>
          
          <motion.h3
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-xl md:text-2xl font-light italic mb-2 romantic-glow-text"
          >
            {isTimeUp ? "Đã đến lúc gặp nhau" : "Đếm ngược đến cuối tuần"}
          </motion.h3>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-sm italic text-muted-foreground/80 font-light"
          >
            {isTimeUp ? "Hãy tận hưởng khoảnh khắc này" : "10 tháng 1, 2026 · 12:00"}
          </motion.p>
        </div>

        {/* Countdown Grid */}
        {!isTimeUp ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {timeUnits.map((unit, index) => {
              const IconComponent = unit.icon
              return (
                <motion.div
                  key={unit.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.1, type: "spring", stiffness: 200 }}
                  className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-background/40 border border-border/20 backdrop-blur-sm group/item relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover/item:opacity-100 transition-opacity duration-300" />
                  
                  <div className="relative z-10 w-full">
                    <div className="flex items-center justify-center gap-2 mb-3">
                      <IconComponent className="w-4 h-4 text-primary/70 group-hover/item:text-primary transition-colors" />
                      <span className="text-xs uppercase tracking-widest text-muted-foreground/70 font-sans">
                        {unit.label}
                      </span>
                    </div>
                    
                    <motion.div
                      key={unit.value}
                      initial={{ scale: 1.2, opacity: 0.5 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="text-4xl md:text-5xl font-light italic tracking-tight text-center romantic-glow-text"
                    >
                      {String(unit.value).padStart(2, "0")}
                    </motion.div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="text-center py-12"
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="text-6xl mb-4"
            >
              ✨
            </motion.div>
            <p className="text-2xl font-light italic romantic-glow-text">
              Đã đến lúc gặp nhau
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

