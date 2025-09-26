"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Trophy, Target, Clock } from "lucide-react"
import { useQuizStore } from "@/store/useQuizStore"

export function ScoreBoard() {
  const { getTotalScore, getTotalProgress, getTotalTimeSpent } = useQuizStore()

  const totalScore = getTotalScore()
  const totalProgress = getTotalProgress()
  const timeSpent = getTotalTimeSpent()

  return (
    <Card className="bg-card/50 border-border">
      <CardContent className="p-4">
        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-primary" />
            <span className="text-muted-foreground">Puntuación:</span>
            <span className="font-medium text-foreground">{totalScore}%</span>
          </div>

          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-accent" />
            <span className="text-muted-foreground">Progreso:</span>
            <span className="font-medium text-foreground">{totalProgress}%</span>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-secondary-foreground" />
            <span className="text-muted-foreground">Tiempo:</span>
            <span className="font-medium text-foreground">{timeSpent}min</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
