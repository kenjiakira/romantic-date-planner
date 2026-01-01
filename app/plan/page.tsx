"use client"

import type React from "react"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, Heart } from "lucide-react"
import Link from "next/link"
import { FloatingParticles } from "@/components/FloatingParticles"
import { ConfettiCelebration } from "@/components/ConfettiCelebration"
import { WeatherDisplay } from "@/components/WeatherDisplay"
import { CountdownTimer } from "@/components/CountdownTimer"
import { PreparationChecklist } from "@/components/PreparationChecklist"
import { FeelingSelector } from "@/components/FeelingSelector"
import { DayTabs } from "@/components/DayTabs"
import { LocationPicker } from "@/components/LocationPicker"
import { SelectedLocationsList } from "@/components/SelectedLocationsList"
import { FoodMoodsSelector } from "@/components/FoodMoodsSelector"
import { PlanFooter } from "@/components/PlanFooter"

import { locations } from "@/lib/locations"

type SelectedLocation = {
  locationId: string
  time: string
}

const MAX_LOCATIONS_PER_DAY = 4

const generateAutoTime = (
  index: number,
  location: (typeof locations)[0],
  totalLocations: number,
  day: "saturday" | "sunday"
): string => {
  if (location.category === "safe_place" || location.tags.includes("base")) {
    if (index === 0) return "Buổi sáng"
    if (index === totalLocations - 1) return "Buổi tối"
    return "Cả buổi chiều"
  }

  if (location.category === "food") {
    if (index === 0) return "12:00 CH - 2:00 CH"
    return "7:00 CH - 9:00 CH"
  }

  if (location.category === "cafe") {
    if (index === 0) return "10:00 SA - 12:00 CH"
    if (location.tags.includes("buổi tối")) return "7:00 CH - 9:00 CH"
    return "2:00 CH - 4:00 CH"
  }

  if (location.category === "mall") {
    if (location.tags.includes("buổi tối")) return "6:00 CH - 9:00 CH"
    return "2:00 CH - 6:00 CH"
  }

  if (location.category === "entertainment") {
    return "7:00 CH - 10:00 CH"
  }

  if (location.category === "outdoor") {
    if (index === 0) return "9:00 SA - 12:00 CH"
    return "4:00 CH - 6:00 CH"
  }

  if (location.category === "activity") {
    if (index === 0) return "10:00 SA - 12:00 CH"
    return "3:00 CH - 5:00 CH"
  }

  if (location.category === "free") {
    if (index === 0) return "Buổi sáng"
    if (index === totalLocations - 1) return "Buổi tối"
    return "Buổi chiều"
  }

  const timeSlots = [
    "10:00 SA - 12:00 CH",
    "12:00 CH - 3:00 CH",
    "3:00 CH - 6:00 CH",
    "6:00 CH - 9:00 CH",
  ]
  return timeSlots[index % timeSlots.length] || "Linh hoạt"
}

function PlanPageContent() {
  const searchParams = useSearchParams()
  const editId = searchParams.get("edit")
  
  const [activeDay, setActiveDay] = useState<"saturday" | "sunday">("saturday")
  const [feeling, setFeeling] = useState<string | null>(null)
  const [selectedMoods, setSelectedMoods] = useState<string[]>([])
  const [customIdeas, setCustomIdeas] = useState<string[]>([])
  const [checklist, setChecklist] = useState<{ items: any[]; checkedItems: string[] } | null>(null)
  const [isFinished, setIsFinished] = useState(false)
  const [selectedLocations, setSelectedLocations] = useState<{
    saturday: SelectedLocation[]
    sunday: SelectedLocation[]
  }>({
    saturday: [],
    sunday: [],
  })
  const [showLocationPicker, setShowLocationPicker] = useState(false)
  const [confettiTrigger, setConfettiTrigger] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (editId) {
      setLoading(true)
      fetch(`/api/selections/${editId}`)
        .then((res) => res.json())
        .then((result) => {
          if (result.data) {
            const data = result.data
            setFeeling(data.feeling)
            setSelectedMoods(data.selected_moods || [])
            setCustomIdeas(data.custom_ideas || [])
            setSelectedLocations(data.selected_locations || { saturday: [], sunday: [] })
            setChecklist(data.checklist || null)
            
            if (data.selected_locations?.saturday?.length > 0) {
              setActiveDay("sunday")
            }
          }
        })
        .catch((err) => {
          console.error("Error loading selection:", err)
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }, [editId])

  const hasSaturday = selectedLocations.saturday.length > 0
  const [hasSaturdayInDB, setHasSaturdayInDB] = useState(false)

  // Kiểm tra xem đã có thứ 7 trong DB chưa (khi tạo mới)
  useEffect(() => {
    if (!editId) {
      fetch("/api/selections")
        .then((res) => res.json())
        .then((result) => {
          if (result.data) {
            const hasSaturday = result.data.some((sel: any) => 
              sel.selected_locations?.saturday && sel.selected_locations.saturday.length > 0
            )
            setHasSaturdayInDB(hasSaturday)
            if (hasSaturday) {
              setActiveDay("sunday")
            }
          }
        })
        .catch((err) => {
          console.error("Error checking Saturday:", err)
        })
    }
  }, [editId])

  useEffect(() => {
    if (hasSaturday && editId && activeDay === "saturday") {
      setActiveDay("sunday")
    }
    if (hasSaturdayInDB && !editId && activeDay === "saturday") {
      setActiveDay("sunday")
    }
  }, [hasSaturday, hasSaturdayInDB, editId, activeDay])

  const toggleMood = (id: string) => {
    setSelectedMoods((prev) => (prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]))
  }

  const removeIdea = (index: number) => {
    setCustomIdeas(customIdeas.filter((_, i) => i !== index))
  }

  const getLocationById = (id: string) => locations.find((loc) => loc.id === id)

  const addLocation = (locationId: string) => {
    const location = getLocationById(locationId)
    if (!location) return

    const currentLocations = selectedLocations[activeDay]

    if (currentLocations.length >= MAX_LOCATIONS_PER_DAY) {
      return
    }

    const newIndex = currentLocations.length
    const autoTime = generateAutoTime(newIndex, location, currentLocations.length + 1, activeDay)

    setSelectedLocations((prev) => ({
      ...prev,
      [activeDay]: [...prev[activeDay], { locationId, time: autoTime }],
    }))
    setShowLocationPicker(false)
  }

  const reorderTimes = (dayLocations: SelectedLocation[]) => {
    return dayLocations.map((loc, index) => {
      const location = getLocationById(loc.locationId)
      if (!location) return loc

      if (!loc.time) {
        const newTime = generateAutoTime(index, location, dayLocations.length, activeDay)
        return { ...loc, time: newTime }
      }
      return loc
    })
  }

  const removeLocation = (index: number) => {
    setSelectedLocations((prev) => {
      const newLocations = prev[activeDay].filter((_, i) => i !== index)
      const reordered = reorderTimes(newLocations)
      return {
        ...prev,
        [activeDay]: reordered,
      }
    })
  }

  const updateLocationTime = (index: number, time: string) => {
    setSelectedLocations((prev) => ({
      ...prev,
      [activeDay]: prev[activeDay].map((loc, i) => (i === index ? { ...loc, time } : loc)),
    }))
  }

  const canAddMoreLocations = selectedLocations[activeDay].length < MAX_LOCATIONS_PER_DAY

  const handleSubmit = async () => {
    try {
      const url = editId ? `/api/selections/${editId}` : "/api/selections"
      const method = editId ? "PUT" : "POST"
      
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          feeling,
          selectedMoods,
          customIdeas,
          selectedLocations,
          checklist: checklist || { items: [], checkedItems: [] },
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        alert(errorData.error || "Có lỗi xảy ra khi lưu lựa chọn")
        return
      }
    } catch (error) {
      console.error("Error saving selection:", error)
      alert("Có lỗi xảy ra khi lưu lựa chọn")
      return
    }

    setConfettiTrigger(true)
    setTimeout(() => {
      setIsFinished(true)
      setTimeout(() => setConfettiTrigger(false), 3000)
    }, 300)
  }

  if (isFinished) {
    return (
      <main className="min-h-screen romantic-gradient text-foreground font-serif selection:bg-primary/20 flex flex-col items-center justify-center p-6 text-center relative">
        <ConfettiCelebration trigger={confettiTrigger} />
        <div className="fixed inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] z-0" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: [0.2, 0, 0, 1] }}
          className="max-w-xl space-y-12 relative z-10"
        >
          <div className="space-y-6">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
            >
              <Heart className="w-6 h-6 text-primary/40 mx-auto font-light" />
            </motion.div>

            <h1 className="text-4xl md:text-5xl font-light italic leading-tight text-pretty romantic-glow-text">
              Cảm ơn em đã lắng nghe những ý nghĩ này.
            </h1>

            <p className="text-lg text-muted-foreground/80 leading-relaxed font-light font-sans max-w-sm mx-auto">
              Không có gì là bắt buộc, không có gì là cố định. Cuối tuần này thuộc về em, và anh sẽ luôn ở đó để cùng em
              tạo nên những kỷ niệm thật đẹp.
            </p>
          </div>

          <div className="space-y-4 pt-12">
            <Link
              href="/selections"
              className="text-[10px] uppercase tracking-[0.3em] text-primary hover:text-primary/80 transition-all duration-700 block"
            >
              Xem các lựa chọn đã lưu
            </Link>
            <Link
              href="/"
              className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground hover:text-primary transition-all duration-700 block"
            >
              Quay lại từ đầu
            </Link>
          </div>
        </motion.div>
      </main>
    )
  }

  return (
    <main className="min-h-screen romantic-gradient text-foreground font-serif selection:bg-primary/20 relative">
      {/* Floating particles */}
      <FloatingParticles />

      <div className="fixed inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] z-0" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 md:py-16 lg:py-24 relative z-10">
        <header className="mb-12 md:mb-20 space-y-8 md:space-y-12">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-muted-foreground/80 hover:text-primary transition-colors duration-500 py-2"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-500" />
            Quay lại lời mời
          </Link>

          <div className="space-y-3 md:space-y-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light italic leading-tight romantic-glow-text">Gửi em, một cuối tuần tự do</h1>
            <p className="font-sans text-sm md:text-base tracking-widest uppercase text-muted-foreground/80 animate-romantic-pulse">
              Mọi sự lựa chọn đều là của em.
            </p>
          </div>

          <WeatherDisplay />

          <section className="pt-6 md:pt-8 pb-6 md:pb-8 border-t border-border/20 space-y-4 md:space-y-6">
            <div>
              <CountdownTimer />
            </div>
          </section>

          <FeelingSelector feeling={feeling} onFeelingChange={setFeeling} />

          <DayTabs 
            activeDay={activeDay} 
            onDayChange={setActiveDay}
            disabledDays={
              (hasSaturday && editId) || (hasSaturdayInDB && !editId) 
                ? ["saturday"] 
                : []
            }
          />
        </header>

        <section className="space-y-12 md:space-y-16">
          <LocationPicker
            locations={locations}
            selectedLocations={selectedLocations[activeDay]}
            showLocationPicker={showLocationPicker}
            canAddMoreLocations={canAddMoreLocations}
            maxLocationsPerDay={MAX_LOCATIONS_PER_DAY}
            activeDay={activeDay}
            onShowPicker={setShowLocationPicker}
            onAddLocation={addLocation}
          />

          <SelectedLocationsList
            selectedLocations={selectedLocations[activeDay]}
            getLocationById={getLocationById}
            onRemoveLocation={removeLocation}
            onUpdateLocationTime={updateLocationTime}
          />
        </section>

        <FoodMoodsSelector
          selectedMoods={selectedMoods}
          customIdeas={customIdeas}
          onToggleMood={toggleMood}
          onAddIdea={(idea) => setCustomIdeas([...customIdeas, idea])}
          onRemoveIdea={removeIdea}
        />

        <section className="mt-24 md:mt-48 space-y-12 md:space-y-16">
          <div className="space-y-3 md:space-y-4 text-center px-4">
            <h3 className="text-xs uppercase tracking-[0.4em] text-muted-foreground/80 font-medium">
              Chuẩn Bị
            </h3>
            <h2 className="text-3xl md:text-4xl font-light italic">Để mọi thứ diễn ra suôn sẻ</h2>
            <p className="text-sm md:text-base text-muted-foreground/80 font-sans max-w-sm mx-auto">
              Checklist đồ cần mang để không bỏ lỡ bất kỳ khoảnh khắc nào.
            </p>
          </div>

          <div className="max-w-2xl mx-auto px-4 md:px-0">
            <PreparationChecklist
              selectedLocations={[...selectedLocations.saturday, ...selectedLocations.sunday]}
              getLocationById={getLocationById}
              onChecklistChange={setChecklist}
            />
          </div>
        </section>

        <PlanFooter feeling={feeling} onSubmit={handleSubmit} />
      </div>
    </main>
  )
}

export default function PlanPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen romantic-gradient text-foreground font-serif selection:bg-primary/20 flex flex-col items-center justify-center p-6 text-center relative">
          <div className="fixed inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] z-0" />
          <div className="max-w-xl space-y-12 relative z-10">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl font-light italic leading-tight text-pretty romantic-glow-text">
                Đang tải...
              </h1>
            </div>
          </div>
        </main>
      }
    >
      <PlanPageContent />
    </Suspense>
  )
}
