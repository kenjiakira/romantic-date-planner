"use client"

import { useEffect, useState } from "react"
import { Heart, Sparkles } from "lucide-react"

type Particle = {
  id: number
  x: number
  y: number
  size: number
  duration: number
  delay: number
  type: "heart" | "sparkle"
  opacity: number
}

export function FloatingParticles() {
  const [particles, setParticles] = useState<Particle[]>([])

  useEffect(() => {
    const particleCount = 20
    const newParticles: Particle[] = []

    for (let i = 0; i < particleCount; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 10 + 6,
        duration: Math.random() * 25 + 20,
        delay: Math.random() * 8,
        type: Math.random() > 0.4 ? "heart" : "sparkle",
        opacity: Math.random() * 0.3 + 0.1,
      })
    }

    setParticles(newParticles)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute animate-float"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            animationDuration: `${particle.duration}s`,
            animationDelay: `${particle.delay}s`,
            animationTimingFunction: "ease-in-out",
            opacity: particle.opacity,
          }}
        >
          {particle.type === "heart" ? (
            <Heart
              className="text-primary fill-primary/40 drop-shadow-sm"
              style={{ 
                width: `${particle.size}px`, 
                height: `${particle.size}px`,
                filter: "drop-shadow(0 0 4px oklch(0.65 0.12 15 / 0.3))",
              }}
            />
          ) : (
            <Sparkles
              className="text-primary/70 drop-shadow-sm"
              style={{ 
                width: `${particle.size}px`, 
                height: `${particle.size}px`,
                filter: "drop-shadow(0 0 4px oklch(0.65 0.12 15 / 0.2))",
              }}
            />
          )}
        </div>
      ))}
    </div>
  )
}

