import { ModuleCard } from "@/components/ModuleCard"
import { ScoreBoard } from "@/components/ScoreBoard"
import { ProgressBar } from "@/components/ProgressBar"
import { ThemeToggle } from "@/components/ThemeToggle"
import { modules } from "@/lib/modules"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-primary glow-primary">Grupo D - IFTS 18</h1>
              <p className="text-muted-foreground mt-1">Aprende protocolos de red de forma interactiva</p>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <ScoreBoard />
            </div>
          </div>
          <ProgressBar />
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-foreground mb-2">Módulos Disponibles</h2>
          <p className="text-muted-foreground">
            Selecciona un módulo para comenzar con el quiz y explorar los simuladores interactivos.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module) => (
            <ModuleCard key={module.id} module={module} />
          ))}
        </div>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-border">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <p>© 2025 Grupo D - IFTS 18 - Plataforma Educativa de Redes</p>
            <a href="/fuentes" className="text-accent hover:text-primary transition-colors focus-visible">
              Ver Fuentes →
            </a>
          </div>
        </footer>
      </main>
    </div>
  )
}
