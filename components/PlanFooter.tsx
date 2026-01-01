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
    <footer className="mt-24 md:mt-48 pt-16 md:pt-24 border-t-2 border-border/30 text-center space-y-8 md:space-y-12 pb-16 md:pb-32 px-4 md:px-0">
      <AnimatePresence mode="wait">
        <motion.p
          key={feeling || "default"}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm md:text-base text-muted-foreground/85 italic font-light max-w-sm mx-auto min-h-[3rem]"
        >
          {getFeelingMessage()}
        </motion.p>
      </AnimatePresence>

      <div className="space-y-6 md:space-y-8 pt-6 md:pt-8">
        <button
          onClick={onSubmit}
          className="group relative px-8 md:px-12 py-4 md:py-5 rounded-full border-2 border-primary/40 bg-accent/30 hover:bg-accent/40 hover:border-primary/60 transition-all duration-700 overflow-hidden sparkle-hover romantic-glow-hover min-h-[56px] w-full max-w-md mx-auto shadow-lg hover:shadow-xl active:scale-[0.98]"
        >
          <div className="absolute inset-0 bg-primary/10 translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-out" />
          <span className="relative z-10 text-xs md:text-xs uppercase tracking-[0.4em] text-foreground group-hover:text-primary transition-colors duration-700 font-semibold">
            Gửi lại những mong muốn này
          </span>
        </button>

        <div className="w-px h-12 md:h-16 bg-gradient-to-b from-primary/30 to-transparent mx-auto" />
      </div>
    </footer>
  )
}

