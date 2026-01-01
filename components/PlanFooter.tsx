"use client"

import { motion, AnimatePresence } from "framer-motion"

type PlanFooterProps = {
  feeling: string | null
  onSubmit: () => void
}

export function PlanFooter({ feeling, onSubmit }: PlanFooterProps) {
  const getFeelingMessage = () => {
    switch (feeling) {
      case "quiet":
        return "Mọi thứ sẽ thật tĩnh lặng. Anh chỉ cần được ở bên em."
      case "active":
        return "Thế giới ngoài kia đang chờ mình, nhưng anh chỉ chờ được đi cùng em."
      case "comfortable":
        return "Sự thoải mái của em là ưu tiên duy nhất của anh."
      case "social":
        return "Cùng nhau tận hưởng niềm vui nhé, anh sẽ luôn bên cạnh em."
      default:
        return "Không áp lực, không vội vã. Cứ để cuối tuần này trôi đi thật nhẹ nhàng."
    }
  }

  return (
    <footer className="mt-48 pt-24 border-t border-border/20 text-center space-y-12 pb-32">
      <AnimatePresence mode="wait">
        <motion.p
          key={feeling || "default"}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-base text-muted-foreground/85 italic font-light max-w-sm mx-auto min-h-[3rem]"
        >
          {getFeelingMessage()}
        </motion.p>
      </AnimatePresence>

      <div className="space-y-8 pt-8">
        <button
          onClick={onSubmit}
          className="group relative px-12 py-4 rounded-full border border-primary/10 hover:border-primary/20 transition-all duration-1000 overflow-hidden sparkle-hover romantic-glow-hover glass-romantic"
        >
          <div className="absolute inset-0 bg-primary/5 translate-y-full group-hover:translate-y-0 transition-transform duration-1000 ease-out" />
          <span className="relative z-10 text-xs uppercase tracking-[0.4em] text-muted-foreground/90 group-hover:text-primary transition-colors duration-1000 font-medium">
            Gửi lại những mong muốn này
          </span>
        </button>

        <div className="w-px h-16 bg-gradient-to-b from-primary/20 to-transparent mx-auto" />
      </div>
    </footer>
  )
}

