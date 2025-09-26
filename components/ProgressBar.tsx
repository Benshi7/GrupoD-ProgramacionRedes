"use client"

import { Progress } from "@/components/ui/progress"
import { useQuizStore } from "@/store/useQuizStore"

export function ProgressBar() {
  const { getTotalProgress } = useQuizStore()
  const progress = getTotalProgress()

  return (
    <div className="mt-4">
      <div className="flex justify-between text-sm mb-2">
        <span className="text-muted-foreground">Progreso General</span>
        <span className="text-foreground font-medium">{progress}% completado</span>
      </div>
      <Progress value={progress} className="h-2 glow-accent" />
    </div>
  )
}
