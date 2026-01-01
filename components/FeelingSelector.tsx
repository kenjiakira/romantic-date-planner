"use client"

import { motion } from "framer-motion"
import { Cloud, Navigation, HomeIcon, Sparkles } from "lucide-react"

type FeelingOption = {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  description: string
}

const feelingOptions: FeelingOption[] = [
  {
    id: "quiet",
    label: "Cần Sự Yên Tĩnh",
    icon: Cloud,
    description: "Cuối tuần này, mình muốn một ngày thật chậm, không tiếng ồn, chỉ có sự hiện diện của đôi ta.",
  },
  {
    id: "active",
    label: "Muốn Đi Đây Đó",
    icon: Navigation,
    description: "Cuối tuần này, mình muốn cùng em lang thang phố phường, ngắm nhìn nhịp sống ngoài kia.",
  },
  {
    id: "comfortable",
    label: "Chỉ Cần Thoải Mái",
    icon: HomeIcon,
    description: "Cuối tuần này, dù là đi đâu hay làm gì, miễn là chúng mình cảm thấy tự nhiên nhất.",
  },
  {
    id: "social",
    label: "Muốn Chút Vui Vẻ",
    icon: Sparkles,
    description: "Cuối tuần này, một chút hoạt náo, trò chơi hay những nơi đông vui để nạp lại năng lượng.",
  },
]

type FeelingSelectorProps = {
  feeling: string | null
  onFeelingChange: (feeling: string) => void
}

export function FeelingSelector({ feeling, onFeelingChange }: FeelingSelectorProps) {
  return (
    <section className="pt-6 pb-6 md:pt-8 md:pb-8 border-t border-border/20">
      <h3 className="text-xs uppercase tracking-[0.4em] text-muted-foreground/80 font-medium mb-6 md:mb-8">
        Cuối tuần này em muốn cảm giác thế nào?
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {feelingOptions.map((option) => {
          const Icon = option.icon
          return (
            <button
              key={option.id}
              onClick={() => onFeelingChange(option.id)}
              className={`group relative flex flex-col items-center text-center p-5 md:p-6 rounded-2xl border-2 transition-all duration-700 sparkle-hover min-h-[160px] md:min-h-[180px] ${
                feeling === option.id
                  ? "bg-accent/50 border-primary/40 shadow-lg romantic-glow scale-[1.02]"
                  : "bg-transparent border-border/50 hover:border-primary/30 hover:bg-accent/15 glass-romantic active:scale-[0.98]"
              }`}
            >
              <Icon
                className={`w-7 h-7 md:w-6 md:h-6 mb-3 md:mb-4 transition-colors duration-700 ${
                  feeling === option.id
                    ? "text-primary"
                    : "text-muted-foreground/70 group-hover:text-muted-foreground/90"
                }`}
              />
              <span
                className={`text-sm md:text-sm tracking-widest uppercase mb-2 font-semibold ${
                  feeling === option.id ? "text-foreground" : "text-muted-foreground/80"
                }`}
              >
                {option.label}
              </span>
              <p className="text-xs md:text-xs italic leading-relaxed text-muted-foreground/70 font-sans group-hover:text-muted-foreground/90 transition-colors duration-700 line-clamp-3">
                {option.description}
              </p>
              {feeling === option.id && (
                <motion.div
                  layoutId="feeling-pulse"
                  className="absolute inset-0 rounded-2xl ring-2 ring-primary/30 animate-pulse"
                />
              )}
            </button>
          )
        })}
      </div>
    </section>
  )
}

