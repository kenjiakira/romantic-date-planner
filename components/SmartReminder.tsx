"use client"

import { useState, useEffect, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Bell, Clock, MapPin, X, CheckCircle, AlertCircle } from "lucide-react"

type SelectedLocation = {
  locationId: string
  time: string
}

type Reminder = {
  id: string
  locationId: string
  locationName: string
  time: string
  reminderTime: number // minutes before
  enabled: boolean
  notified: boolean
}

type SmartReminderProps = {
  selectedLocations: {
    saturday: SelectedLocation[]
    sunday: SelectedLocation[]
  }
  getLocationById: (id: string) => { name: string } | undefined
  targetDate: Date
}

const REMINDER_OPTIONS = [
  { label: "15 phút trước", value: 15 },
  { label: "30 phút trước", value: 30 },
  { label: "1 giờ trước", value: 60 },
  { label: "2 giờ trước", value: 120 },
]

export function SmartReminder({ selectedLocations, getLocationById, targetDate }: SmartReminderProps) {
  const [reminders, setReminders] = useState<Reminder[]>([])
  const [showNotifications, setShowNotifications] = useState(true)
  const [activeNotification, setActiveNotification] = useState<Reminder | null>(null)

  // Tạo reminders tự động từ selectedLocations
  useEffect(() => {
    const newReminders: Reminder[] = []

    const processDay = (dayLocations: SelectedLocation[], dayName: string) => {
      dayLocations.forEach((loc, index) => {
        const location = getLocationById(loc.locationId)
        if (!location) return

        const startTime = parseTimeString(loc.time, targetDate, dayName === "saturday" ? 6 : 0)
        if (!startTime) return

        const reminderId = `${dayName}-${loc.locationId}-${index}`
        const existingReminder = reminders.find((r) => r.id === reminderId)

        if (!existingReminder) {
          newReminders.push({
            id: reminderId,
            locationId: loc.locationId,
            locationName: location.name,
            time: loc.time,
            reminderTime: 30,
            enabled: true,
            notified: false,
          })
        } else {
          newReminders.push(existingReminder)

        }
      })
    }

    processDay(selectedLocations.saturday, "saturday")
    processDay(selectedLocations.sunday, "sunday")

    const currentIds = reminders.map((r) => r.id).sort().join(",")
    const newIds = newReminders.map((r) => r.id).sort().join(",")
    
    if (currentIds !== newIds) {
      setReminders(newReminders)
    }
  }, [selectedLocations.saturday.length, selectedLocations.sunday.length, targetDate])

  const parseTimeString = (timeStr: string, baseDate: Date, dayOffset: number): Date | null => {
    const date = new Date(baseDate)
    date.setDate(date.getDate() + dayOffset)

    if (timeStr.includes("SA") || timeStr.includes("CH")) {

      const timeMatch = timeStr.match(/(\d{1,2}):(\d{2})\s*(SA|CH)/)
      if (timeMatch) {
        let hours = parseInt(timeMatch[1])
        const minutes = parseInt(timeMatch[2])
        const period = timeMatch[3]

        if (period === "CH" && hours !== 12) hours += 12
        if (period === "SA" && hours === 12) hours = 0

        date.setHours(hours, minutes, 0, 0)
        return date
      }
    } else if (timeStr.includes("Buổi sáng")) {
      date.setHours(9, 0, 0, 0)
      return date
    } else if (timeStr.includes("Buổi chiều")) {
      date.setHours(14, 0, 0, 0)
      return date
    } else if (timeStr.includes("Buổi tối")) {
      date.setHours(19, 0, 0, 0)
      return date
    } else if (timeStr.includes("Cả buổi chiều")) {
      date.setHours(13, 0, 0, 0)
      return date
    }

    return null
  }

  useEffect(() => {
    if (!showNotifications) return

    const checkReminders = () => {
      const now = new Date()
      const activeReminder = reminders.find((reminder) => {
        if (!reminder.enabled || reminder.notified) return false

        const location = getLocationById(reminder.locationId)
        if (!location) return false

        const eventTime = parseTimeString(reminder.time, targetDate, reminder.id.includes("saturday") ? 6 : 0)
        if (!eventTime) return false

        const reminderTime = new Date(eventTime.getTime() - reminder.reminderTime * 60 * 1000)
        const timeDiff = reminderTime.getTime() - now.getTime()
        return timeDiff >= 0 && timeDiff <= 60000
      })

      if (activeReminder && !activeNotification) {
        setActiveNotification(activeReminder)
        setReminders((prev) =>
          prev.map((r) => (r.id === activeReminder.id ? { ...r, notified: true } : r))
        )

        setTimeout(() => {
          setActiveNotification(null)
        }, 10000)
      }
    }

    const interval = setInterval(checkReminders, 10000) // Kiểm tra mỗi 10 giây
    checkReminders() // Kiểm tra ngay lập tức

    return () => clearInterval(interval)
  }, [reminders, showNotifications, targetDate, getLocationById, activeNotification])

  const updateReminder = (id: string, updates: Partial<Reminder>) => {
    setReminders((prev) => prev.map((r) => (r.id === id ? { ...r, ...updates } : r)))
  }

  const toggleReminder = (id: string) => {
    updateReminder(id, { enabled: !reminders.find((r) => r.id === id)?.enabled })
  }

  const upcomingReminders = useMemo(() => {
    const now = new Date()
    return reminders
      .filter((r) => r.enabled)
      .map((r) => {
        const eventTime = parseTimeString(r.time, targetDate, r.id.includes("saturday") ? 6 : 0)
        if (!eventTime) return null

        const reminderTime = new Date(eventTime.getTime() - r.reminderTime * 60 * 1000)
        return {
          ...r,
          reminderTime: reminderTime,
          eventTime: eventTime,
          isPast: reminderTime < now,
        }
      })
      .filter((r): r is NonNullable<typeof r> => r !== null)
      .sort((a, b) => a.reminderTime.getTime() - b.reminderTime.getTime())
  }, [reminders, targetDate])

  const formatTimeUntil = (date: Date) => {
    const now = new Date()
    const diff = date.getTime() - now.getTime()

    if (diff < 0) return "Đã qua"

    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (days > 0) return `${days} ngày nữa`
    if (hours > 0) return `${hours} giờ nữa`
    return `${minutes} phút nữa`
  }

  return (
    <>
      {/* Active Notification */}
      <AnimatePresence>
        {activeNotification && showNotifications && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 right-6 z-50 max-w-sm w-full"
          >
            <motion.div
              initial={{ x: 400 }}
              animate={{ x: 0 }}
              exit={{ x: 400 }}
              className="relative p-6 rounded-3xl border border-primary/20 bg-gradient-to-br from-card/90 via-card/70 to-card/50 backdrop-blur-xl glass-romantic shadow-lg romantic-glow"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/5 opacity-60" />
              <div className="relative z-10 space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-primary/10 border border-primary/20">
                      <Bell className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-base font-medium mb-1">Nhắc nhở</h4>
                      <p className="text-sm text-muted-foreground/80 italic">
                        Sắp đến giờ đến <span className="font-medium text-foreground">{activeNotification.locationName}</span>
                      </p>
                      <p className="text-xs text-muted-foreground/70 mt-1">{activeNotification.time}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveNotification(null)}
                    className="p-1 hover:bg-accent/20 rounded-full transition-colors text-muted-foreground/70 hover:text-primary"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reminder Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.2, 0, 0, 1] }}
        className="space-y-6"
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs uppercase tracking-[0.4em] text-muted-foreground/80 font-medium mb-2">
                Nhắc Nhở Thông Minh
              </h3>
              <h2 className="text-3xl font-light italic romantic-glow-text">Không bỏ lỡ khoảnh khắc</h2>
            </div>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className={`p-3 rounded-full border transition-all duration-500 ${
                showNotifications
                  ? "bg-primary/10 border-primary/20 text-primary"
                  : "bg-background/40 border-border/40 text-muted-foreground/70"
              }`}
            >
              <Bell className={`w-5 h-5 ${showNotifications ? "fill-primary" : ""}`} />
            </button>
          </div>

          {!showNotifications && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-2xl bg-accent/20 border border-primary/10 text-center"
            >
              <p className="text-sm text-muted-foreground/85 italic">
                Nhắc nhở đã tắt. Bật lại để nhận thông báo trước khi đến địa điểm.
              </p>
            </motion.div>
          )}
        </div>

        {/* Upcoming Reminders */}
        {upcomingReminders.length > 0 ? (
          <div className="space-y-4">
            <h4 className="text-xs uppercase tracking-widest text-muted-foreground/70 font-medium">
              Nhắc nhở sắp tới
            </h4>
            <div className="space-y-3">
              <AnimatePresence mode="popLayout">
                {upcomingReminders.slice(0, 5).map((reminder) => {
                  const baseReminder = reminders.find((r) => r.id === reminder.id)
                  if (!baseReminder) return null

                  return (
                    <motion.div
                      key={reminder.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className={`p-4 rounded-2xl border transition-all duration-500 ${
                        baseReminder.enabled
                          ? reminder.isPast
                            ? "bg-accent/20 border-primary/10"
                            : "bg-transparent border-border/40 hover:border-primary/20 hover:bg-accent/10 glass-romantic"
                          : "bg-background/20 border-border/20 opacity-50"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3 flex-1">
                          <div className="p-2 rounded-xl bg-primary/10 border border-primary/20 mt-0.5">
                            <MapPin className="w-4 h-4 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h5 className="text-base font-medium">{reminder.locationName}</h5>
                              {reminder.isPast && (
                                <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground/80 italic mb-2">{reminder.time}</p>
                            <div className="flex items-center gap-4 flex-wrap">
                              <div className="flex items-center gap-2 text-xs text-muted-foreground/70">
                                <Clock className="w-3 h-3" />
                                <span>
                                  {reminder.isPast ? "Đã qua" : formatTimeUntil(reminder.reminderTime)}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground/70">
                                <Bell className="w-3 h-3" />
                                <span>{baseReminder.reminderTime} phút trước</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <select
                            value={baseReminder.reminderTime}
                            onChange={(e) => updateReminder(reminder.id, { reminderTime: parseInt(e.target.value) })}
                            onClick={(e) => e.stopPropagation()}
                            className="text-xs bg-background/40 border border-border/40 rounded-lg px-2 py-1 text-muted-foreground/80 focus:outline-none focus:border-primary/40"
                          >
                            {REMINDER_OPTIONS.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                          <button
                            onClick={() => toggleReminder(reminder.id)}
                            className={`p-2 rounded-lg border transition-all duration-500 ${
                              baseReminder.enabled
                                ? "bg-primary/10 border-primary/20 text-primary"
                                : "bg-background/40 border-border/40 text-muted-foreground/70"
                            }`}
                          >
                            <Bell className={`w-4 h-4 ${baseReminder.enabled ? "fill-primary" : ""}`} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 border border-dashed border-border/40 rounded-3xl">
            <Bell className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-base text-muted-foreground/80 italic">
              Chưa có nhắc nhở nào. Thêm địa điểm vào kế hoạch để tự động tạo nhắc nhở.
            </p>
          </div>
        )}

        {reminders.length > 0 && (
          <div className="pt-4 border-t border-border/20">
            <p className="text-xs text-muted-foreground/70 italic text-center">
              Nhắc nhở sẽ tự động hiển thị khi đến thời điểm. Bạn có thể tùy chỉnh thời gian nhắc trước.
            </p>
          </div>
        )}
      </motion.div>
    </>
  )
}

