"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Clock, Play, BookOpen } from "lucide-react"
import { type Module, getDifficultyColor, getDifficultyLabel } from "@/lib/modules"
import { useQuizStore } from "@/store/useQuizStore"
import { useRouter } from "next/navigation"

interface ModuleCardProps {
  module: Module
}

export function ModuleCard({ module }: ModuleCardProps) {
  const router = useRouter()
  const { getModuleProgress, getModuleScore } = useQuizStore()

  const progress = getModuleProgress(module.id)
  const score = getModuleScore(module.id)

  const handleStartQuiz = () => {
    router.push(`/quiz/${module.id}`)
  }

  const handleOpenSandbox = () => {
    router.push(`/sandbox/${module.id}`)
  }

  return (
    <Card className="group hover:glow-accent transition-all duration-300 bg-card border-border">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="text-2xl mb-2">{module.icon}</div>
          <Badge variant="secondary" className={`${getDifficultyColor(module.difficulty)} bg-secondary/50`}>
            {getDifficultyLabel(module.difficulty)}
          </Badge>
        </div>
        <CardTitle className="text-lg text-foreground group-hover:text-primary transition-colors">
          {module.title}
        </CardTitle>
        <CardDescription className="text-muted-foreground">{module.description}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progreso</span>
            <span className="text-foreground font-medium">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
          {score > 0 && <div className="text-sm text-accent">Mejor puntuación: {score}%</div>}
        </div>

        {/* Topics */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-foreground">Temas incluidos:</h4>
          <div className="flex flex-wrap gap-1">
            {module.topics.map((topic) => (
              <Badge key={topic} variant="outline" className="text-xs">
                {topic}
              </Badge>
            ))}
          </div>
        </div>

        {/* Time estimate */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="w-4 h-4" />
          <span>{module.estimatedTime}</span>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button onClick={handleStartQuiz} className="flex-1 glow-primary" size="sm">
            <Play className="w-4 h-4 mr-2" />
            Quiz
          </Button>
          <Button onClick={handleOpenSandbox} variant="outline" className="flex-1 bg-transparent" size="sm">
            <BookOpen className="w-4 h-4 mr-2" />
            Sandbox
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
