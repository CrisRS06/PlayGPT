import { Navigation } from "@/components/landing/Navigation"
import { Hero } from "@/components/landing/Hero"
import { Features } from "@/components/landing/Features"
import { Modules } from "@/components/landing/Modules"
import { CTASection } from "@/components/landing/CTASection"
import { Footer } from "@/components/landing/Footer"

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Navigation />
      <Hero />
      <Features />
      <Modules />
      <CTASection />
      <Footer />
    </div>
  )
}
