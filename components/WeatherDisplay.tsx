"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Cloud, Sun, CloudRain, Wind, Droplets, Thermometer, Umbrella, Sparkles, MapPin } from "lucide-react"

type WeatherData = {
  temp: number
  condition: string
  description: string
  humidity: number
  windSpeed: number
  icon: string
  feelsLike: number
}

type WeatherRecommendation = {
  message: string
  icon: React.ReactNode
  color: string
  bgGradient: string
}

const getWeatherIcon = (condition: string, temp: number) => {
  const lowerCondition = condition.toLowerCase()
  const iconProps = {
    className: "w-12 h-12",
    style: {
      filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.1))",
    },
  }
  
  if (lowerCondition.includes("rain") || lowerCondition.includes("drizzle")) {
    return (
      <motion.div
        animate={{ y: [0, -3, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <CloudRain className="w-12 h-12 text-blue-400" style={iconProps.style} />
      </motion.div>
    )
  }
  if (lowerCondition.includes("cloud")) {
    return (
      <motion.div
        animate={{ x: [0, 2, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <Cloud className="w-12 h-12 text-slate-400" style={iconProps.style} />
      </motion.div>
    )
  }
  if (temp > 30) {
    return (
      <motion.div
        animate={{ rotate: [0, 10, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <Sun className="w-12 h-12 text-amber-400 fill-amber-200/30" style={iconProps.style} />
      </motion.div>
    )
  }
  return (
    <motion.div
      animate={{ scale: [1, 1.05, 1] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
    >
      <Sun className="w-12 h-12 text-orange-300 fill-orange-100/20" style={iconProps.style} />
    </motion.div>
  )
}

const getWeatherRecommendation = (
  condition: string,
  temp: number,
  humidity: number
): WeatherRecommendation => {
  const lowerCondition = condition.toLowerCase()

  // Trời mưa
  if (lowerCondition.includes("rain") || lowerCondition.includes("drizzle")) {
    return {
      message: "Trời đang mưa nhẹ",

      icon: <Umbrella className="w-5 h-5" />,
      color: "border-blue-400/30 text-blue-700/90",
      bgGradient: "from-blue-50/50 to-blue-100/30",
    }
  }

  // Nóng quá (>35°C)
  if (temp > 35) {
    return {
      message: "Thời tiết khá nóng",

      icon: <Thermometer className="w-5 h-5" />,
      color: "border-orange-400/30 text-orange-700/90",
      bgGradient: "from-orange-50/50 to-amber-100/30",
    }
  }

  // Lạnh (<15°C)
  if (temp < 15) {
    return {
      message: "Thời tiết hơi lạnh",

      icon: <Thermometer className="w-5 h-5" />,
      color: "border-cyan-400/30 text-cyan-700/90",
      bgGradient: "from-cyan-50/50 to-blue-100/30",
    }
  }

  // Độ ẩm cao
  if (humidity > 80) {
    return {
      message: "Độ ẩm khá cao",

      icon: <Droplets className="w-5 h-5" />,
      color: "border-slate-400/30 text-slate-700/90",
      bgGradient: "from-slate-50/50 to-gray-100/30",
    }
  }

  // Thời tiết đẹp
  if (!lowerCondition.includes("cloud") && temp >= 20 && temp <= 30) {
    return {
      message: "Thời tiết tuyệt vời",

      icon: <Sparkles className="w-5 h-5" />,
      color: "border-emerald-400/30 text-emerald-700/90",
      bgGradient: "from-emerald-50/50 to-green-100/30",
    }
  }

  // Mặc định - thời tiết ổn
  return {
    message: "Thời tiết ổn định",
    icon: <Cloud className="w-5 h-5" />,
    color: "border-primary/30 text-primary/90",
    bgGradient: "from-primary/5 to-accent/20",
  }
}

export function WeatherDisplay() {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch("/api/weather")
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: "Unknown error" }))
          if (response.status === 401) {
            throw new Error("API key không hợp lệ hoặc chưa được cấu hình")
          }
          throw new Error(errorData.error || "Không thể tải thông tin thời tiết")
        }
        const data = await response.json()
        if (data.error) {
          throw new Error(data.error)
        }
        setWeather(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Đã xảy ra lỗi")
      } finally {
        setLoading(false)
      }
    }

    fetchWeather()
    // Refresh mỗi 10 phút
    const interval = setInterval(fetchWeather, 600000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative p-8 rounded-3xl border border-border/40 bg-gradient-to-br from-card/60 to-card/40 backdrop-blur-xl glass-romantic overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-50" />
        <div className="relative flex items-center gap-4">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20"
          />
          <div className="space-y-3 flex-1">
            <div className="h-5 w-32 bg-muted/40 rounded-lg animate-pulse" />
            <div className="h-4 w-48 bg-muted/30 rounded animate-pulse" />
          </div>
        </div>
      </motion.div>
    )
  }

  if (error || !weather) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative p-6 rounded-3xl border border-border/40 bg-gradient-to-br from-card/60 to-card/40 backdrop-blur-xl glass-romantic overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-50" />
        <div className="relative text-center py-4">
          <p className="text-sm text-muted-foreground/70 italic mb-2">
            {error || "Không thể tải thông tin thời tiết"}
          </p>
          {error && error.includes("API key") && (
            <p className="text-xs text-muted-foreground/60 italic">
              Vui lòng kiểm tra WEATHER_API_KEY trong file .env.local
            </p>
          )}
        </div>
      </motion.div>
    )
  }

  const recommendation = getWeatherRecommendation(
    weather.condition,
    weather.temp,
    weather.humidity
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.2, 0, 0, 1] }}
      className="space-y-5"
    >
      {/* Weather Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.2, 0, 0, 1] }}
        className="relative p-8 rounded-3xl border border-border/30 bg-gradient-to-br from-card/80 via-card/60 to-card/40 backdrop-blur-xl glass-romantic sparkle-hover overflow-hidden group"
      >
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/10 opacity-60 group-hover:opacity-80 transition-opacity duration-700" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/5 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-50" />
        
        <div className="relative z-10">
          <div className="flex items-start justify-between gap-6 mb-6">
            <div className="flex items-start gap-6 flex-1">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="relative"
              >
                <div className="absolute inset-0 bg-primary/10 rounded-2xl blur-xl" />
                {getWeatherIcon(weather.condition, weather.temp)}
              </motion.div>
              
              <div className="space-y-3 flex-1 pt-1">
                <div className="flex items-baseline gap-3 flex-wrap">
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-5xl font-light italic tracking-tight romantic-glow-text"
                  >
                    {Math.round(weather.temp)}°
                  </motion.span>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="flex items-center gap-2 text-sm text-muted-foreground/70 uppercase tracking-[0.2em] font-sans"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Hà Nội</span>
                  </motion.div>
                </div>
                
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-base italic text-muted-foreground/85 font-light leading-relaxed"
                >
                  {weather.description}
                </motion.p>
              </div>
            </div>
          </div>

          {/* Weather details */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-3 gap-4 pt-6 border-t border-border/30"
          >
            <div className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-background/40 border border-border/20 backdrop-blur-sm group/item">
              <Droplets className="w-5 h-5 text-primary/70 group-hover/item:text-primary transition-colors" />
              <div className="text-center">
                <div className="text-xs uppercase tracking-widest text-muted-foreground/70 font-sans mb-1">Độ ẩm</div>
                <div className="text-lg font-light italic">{weather.humidity}%</div>
              </div>
            </div>
            
            <div className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-background/40 border border-border/20 backdrop-blur-sm group/item">
              <Wind className="w-5 h-5 text-primary/70 group-hover/item:text-primary transition-colors" />
              <div className="text-center">
                <div className="text-xs uppercase tracking-widest text-muted-foreground/70 font-sans mb-1">Gió</div>
                <div className="text-lg font-light italic">{Math.round(weather.windSpeed * 3.6)} km/h</div>
              </div>
            </div>
            
            <div className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-background/40 border border-border/20 backdrop-blur-sm group/item">
              <Thermometer className="w-5 h-5 text-primary/70 group-hover/item:text-primary transition-colors" />
              <div className="text-center">
                <div className="text-xs uppercase tracking-widest text-muted-foreground/70 font-sans mb-1">Cảm giác</div>
                <div className="text-lg font-light italic">{Math.round(weather.feelsLike)}°</div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  )
}

