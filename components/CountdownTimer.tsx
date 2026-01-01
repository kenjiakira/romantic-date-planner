"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Heart, Clock, Calendar, Sparkles } from "lucide-react"

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
        className="relative p-8 md:p-10 rounded-3xl border border-border/40 bg-gradient-to-br from-card/60 to-card/40 backdrop-blur-xl glass-romantic overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-50" />
        <div className="relative flex items-center justify-center py-12">
          <motion.div
            animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center"
          >
            <Heart className="w-8 h-8 text-primary/60" />
          </motion.div>
        </div>
      </motion.div>
    )
  }

  const timeUnits = [
    { label: "Ngày", value: timeLeft.days, icon: Calendar, color: "text-rose-400/90" },
    { label: "Giờ", value: timeLeft.hours, icon: Clock, color: "text-amber-400/90" },
    { label: "Phút", value: timeLeft.minutes, icon: Clock, color: "text-blue-400/90" },
    { label: "Giây", value: timeLeft.seconds, icon: Heart, color: "text-pink-400/90" },
  ]

  const isTimeUp = timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.2, 0, 0, 1] }}
      className="relative p-8 md:p-10 lg:p-12 rounded-3xl border border-border/30 bg-gradient-to-br from-card/80 via-card/60 to-card/40 backdrop-blur-xl glass-romantic sparkle-hover overflow-hidden group"
    >
      {/* Animated background gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/10 opacity-60 group-hover:opacity-80 transition-opacity duration-700" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-primary/5 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-40" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-accent/5 to-transparent rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 opacity-40" />
      
      <div className="relative z-10">
        {/* Header */}
        <div className="text-center mb-10 md:mb-12">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
            className="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 rounded-3xl bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/30 mb-6 relative shadow-lg shadow-primary/10"
          >
            <div className="absolute inset-0 bg-primary/10 rounded-3xl blur-2xl animate-pulse" />
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
            >
              <Heart className="w-10 h-10 md:w-12 md:h-12 text-primary relative z-10 fill-primary/20" />
            </motion.div>
          </motion.div>
          
          <motion.h3
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-2xl md:text-3xl lg:text-4xl font-light italic mb-3 romantic-glow-text leading-tight"
          >
            {isTimeUp ? "Đã đến lúc gặp nhau" : "Đếm ngược đến cuối tuần"}
          </motion.h3>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-sm md:text-base italic text-muted-foreground/80 font-light font-sans"
          >
            {isTimeUp ? (
              <span className="flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4" />
                Hãy tận hưởng khoảnh khắc này
              </span>
            ) : (
              "10 tháng 1, 2026 · 12:00"
            )}
          </motion.p>
        </div>

        {/* Countdown Grid */}
        <AnimatePresence mode="wait">
          {!isTimeUp ? (
            <motion.div
              key="countdown"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
            >
              {timeUnits.map((unit, index) => {
                const IconComponent = unit.icon
                return (
                  <motion.div
                    key={unit.label}
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ 
                      delay: 0.5 + index * 0.1, 
                      type: "spring", 
                      stiffness: 200,
                      damping: 20
                    }}
                    className="relative group/item"
                  >
                    <div className="flex flex-col items-center gap-4 p-6 md:p-8 rounded-2xl bg-gradient-to-br from-background/50 to-background/30 border border-border/30 backdrop-blur-sm hover:border-primary/30 transition-all duration-500 overflow-hidden shadow-lg shadow-black/5">
                      {/* Hover gradient effect */}
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover/item:opacity-100 transition-opacity duration-500" />
                      
                      {/* Icon and Label */}
                      <div className="relative z-10 flex flex-col items-center gap-3 w-full">
                        <div className="flex items-center justify-center gap-2 mb-1">
                          <IconComponent className={`w-5 h-5 ${unit.color} group-hover/item:scale-110 transition-transform duration-300`} />
                          <span className="text-xs md:text-sm uppercase tracking-[0.15em] text-muted-foreground/80 font-sans font-medium">
                            {unit.label}
                          </span>
                        </div>
                        
                        {/* Number */}
                        <motion.div
                          key={`${unit.label}-${unit.value}`}
                          initial={{ scale: 1.3, opacity: 0, y: -10 }}
                          animate={{ scale: 1, opacity: 1, y: 0 }}
                          exit={{ scale: 0.8, opacity: 0 }}
                          transition={{ 
                            type: "spring", 
                            stiffness: 300,
                            damping: 25
                          }}
                          className={`text-5xl md:text-6xl lg:text-7xl font-light italic tracking-tight text-center ${unit.color} romantic-glow-text`}
                        >
                          {String(unit.value).padStart(2, "0")}
                        </motion.div>
                      </div>
                      
                      {/* Decorative corner accent */}
                      <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-primary/5 to-transparent rounded-bl-full opacity-0 group-hover/item:opacity-100 transition-opacity duration-500" />
                    </div>
                  </motion.div>
                )
              })}
            </motion.div>
          ) : (
            <motion.div
              key="timeup"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="text-center py-12 md:py-16"
            >
              <motion.div
                animate={{ 
                  scale: [1, 1.15, 1],
                  rotate: [0, 10, -10, 0]
                }}
                transition={{ 
                  duration: 2.5, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
                className="text-7xl md:text-8xl mb-6"
              >
                ✨
              </motion.div>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-3xl md:text-4xl font-light italic romantic-glow-text leading-tight"
              >
                Đã đến lúc gặp nhau
              </motion.p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-base md:text-lg text-muted-foreground/80 font-light mt-4 italic"
              >
                Hãy tận hưởng khoảnh khắc đặc biệt này
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

