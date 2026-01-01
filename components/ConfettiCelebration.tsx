"use client"

import { useEffect, useState } from "react"
import { Heart, Sparkles } from "lucide-react"

type ConfettiItem = {
  id: number
  x: number
  y: number
  rotation: number
  rotationSpeed: number
  speedX: number
  speedY: number
  type: "heart" | "sparkle"
  size: number
}

export function ConfettiCelebration({ trigger }: { trigger: boolean }) {
  const [confetti, setConfetti] = useState<ConfettiItem[]>([])

  useEffect(() => {
    if (!trigger) return

    const items: ConfettiItem[] = []
    const count = 30

    for (let i = 0; i < count; i++) {
      items.push({
        id: i,
        x: 50 + (Math.random() - 0.5) * 20,
        y: -10,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
        speedX: (Math.random() - 0.5) * 4,
        speedY: Math.random() * 3 + 2,
        type: Math.random() > 0.5 ? "heart" : "sparkle",
        size: Math.random() * 8 + 12,
      })
    }

    setConfetti(items)

    const interval = setInterval(() => {
      setConfetti((prev) =>
        prev
          .map((item) => ({
            ...item,
            x: item.x + item.speedX,
            y: item.y + item.speedY,
            rotation: item.rotation + item.rotationSpeed,
            speedY: item.speedY + 0.1,
          }))
          .filter((item) => item.y < 110)
      )
    }, 16)

    return () => clearInterval(interval)
  }, [trigger])

  if (!trigger || confetti.length === 0) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {confetti.map((item) => (
        <div
          key={item.id}
          className="absolute"
          style={{
            left: `${item.x}%`,
            top: `${item.y}%`,
            transform: `translate(-50%, -50%) rotate(${item.rotation}deg)`,
            opacity: item.y > 90 ? 1 - (item.y - 90) / 20 : 1,
          }}
        >
          {item.type === "heart" ? (
            <Heart
              className="text-primary fill-primary/60"
              style={{
                width: `${item.size}px`,
                height: `${item.size}px`,
                filter: "drop-shadow(0 0 8px oklch(0.65 0.12 15 / 0.6))",
              }}
            />
          ) : (
            <Sparkles
              className="text-primary/70"
              style={{
                width: `${item.size}px`,
                height: `${item.size}px`,
                filter: "drop-shadow(0 0 8px oklch(0.65 0.12 15 / 0.5))",
              }}
            />
          )}
        </div>
      ))}
    </div>
  )
}

