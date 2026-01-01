import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { FloatingParticles } from "@/components/FloatingParticles"
import { InteractiveBackground } from "@/components/InteractiveBackground"

export default function Home() {

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden romantic-gradient">
      {/* Interactive background */}
      <InteractiveBackground />
      
      {/* Floating particles */}
      <FloatingParticles />
    
      {/* Subtle noise texture */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] z-0" />

      <div className="max-w-2xl w-full text-center space-y-12 z-10 relative">
        <header className="space-y-6">
          <p className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground font-medium animate-in fade-in slide-in-from-bottom-2 duration-1000">
            Lời mời riêng tư
          </p>
          <h1 className="text-5xl md:text-7xl font-serif italic text-balance leading-tight text-foreground animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200 romantic-glow-text">
            Cho một cuối tuần <br /> trôi thật chậm.
          </h1>
        </header>

        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-500">
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed font-light text-pretty max-w-lg mx-auto italic animate-romantic-pulse">
          "Mình đã gom góp vài ý nghĩ, vài điểm đến, và một lịch trình tĩnh lặng cho đôi ta. Không vội vã, chỉ có thời
            gian."
          </p>

          <div className="flex flex-col items-center gap-6 md:gap-8 pt-4 w-full max-w-md mx-auto px-4">
            <Link
              href="/plan"
              className="group flex items-center justify-center gap-4 px-8 md:px-10 py-4 md:py-5 bg-foreground text-background rounded-full hover:opacity-90 transition-all duration-700 ease-in-out shadow-lg hover:shadow-xl border-2 border-foreground/10 romantic-glow-hover sparkle-hover relative overflow-hidden w-full min-h-[56px] active:scale-[0.98]"
            >
              <span className="text-sm font-semibold tracking-widest uppercase relative z-10">Mở xem kế hoạch</span>
              <ArrowRight className="w-5 h-5 md:w-4 md:h-4 group-hover:translate-x-1 transition-transform duration-500 relative z-10" />
            </Link>

            <Link
              href="/selections"
              className="group flex items-center justify-center gap-4 px-8 md:px-10 py-4 md:py-5 bg-transparent text-foreground rounded-full hover:bg-foreground/10 transition-all duration-700 ease-in-out border-2 border-foreground/30 hover:border-foreground/50 relative overflow-hidden w-full min-h-[56px] active:scale-[0.98]"
            >
              <span className="text-sm font-semibold tracking-widest uppercase relative z-10">Xem kế hoạch đã lưu</span>
              <ArrowRight className="w-5 h-5 md:w-4 md:h-4 group-hover:translate-x-1 transition-transform duration-500 relative z-10" />
            </Link>

            <p className="text-[9px] uppercase tracking-[0.5em] text-muted-foreground/50">Only for you</p>
          </div>
        </div>
      </div>

      <footer className="absolute bottom-12 text-center w-full px-6 animate-in fade-in duration-1000 delay-1000 z-10">
        <div className="w-px h-16 bg-foreground/10 mx-auto mb-8" />
        <p className="text-[11px] font-serif italic text-muted-foreground/60 tracking-wider">With care, from me.</p>
      </footer>
    </main>
  )
}
