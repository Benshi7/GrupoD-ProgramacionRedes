"use client"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trophy, Clock, Target, RotateCcw, Home, BookOpen } from "lucide-react"
import { modules } from "@/lib/modules"

export default function QuizResultsPage() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()

  const moduleId = params.module as string
  const score = Number.parseInt(searchParams.get("score") || "0")
  const timeSpent = Number.parseInt(searchParams.get("time") || "0")
  const correctAnswers = Number.parseInt(searchParams.get("correct") || "0")
  const totalQuestions = Number.parseInt(searchParams.get("total") || "0")

  const module = modules.find((m) => m.id === moduleId)

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-400"
    if (score >= 60) return "text-yellow-400"
    return "text-red-400"
  }

  const getScoreMessage = (score: number) => {
    if (score >= 90) return "¡Excelente trabajo!"
    if (score >= 80) return "¡Muy bien hecho!"
    if (score >= 70) return "¡Buen trabajo!"
    if (score >= 60) return "No está mal, pero puedes mejorar"
    return "Necesitas repasar más este tema"
  }

  const getStars = (score: number) => {
    if (score >= 90) return 3
    if (score >= 70) return 2
    if (score >= 50) return 1
    return 0
  }

  if (!module) {
    return <div>Módulo no encontrado</div>
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Results Card */}
          <Card className="bg-card border-border glow-accent text-center">
            <CardHeader className="pb-6">
              <div className="flex justify-center mb-4">
                <div className="text-6xl">{module.icon}</div>
              </div>
              <CardTitle className="text-2xl text-foreground">{module.title}</CardTitle>
              <p className="text-muted-foreground">Quiz completado</p>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Score */}
              <div className="text-center">
                <div className={`text-6xl font-bold ${getScoreColor(score)} mb-2`}>{score}%</div>
                <p className="text-lg text-foreground mb-2">{getScoreMessage(score)}</p>

                {/* Stars */}
                <div className="flex justify-center gap-1 mb-4">
                  {[1, 2, 3].map((star) => (
                    <div
                      key={star}
                      className={`text-2xl ${star <= getStars(score) ? "text-yellow-400" : "text-muted-foreground"}`}
                    >
                      ⭐
                    </div>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 py-6 border-y border-border">
                <div className="text-center">
                  <div className="flex justify-center mb-2">
                    <Target className="w-6 h-6 text-primary" />
                  </div>
                  <div className="text-2xl font-bold text-foreground">{correctAnswers}</div>
                  <div className="text-sm text-muted-foreground">de {totalQuestions}</div>
                  <div className="text-xs text-muted-foreground">Correctas</div>
                </div>

                <div className="text-center">
                  <div className="flex justify-center mb-2">
                    <Clock className="w-6 h-6 text-accent" />
                  </div>
                  <div className="text-2xl font-bold text-foreground">{timeSpent}</div>
                  <div className="text-xs text-muted-foreground">Minutos</div>
                </div>

                <div className="text-center">
                  <div className="flex justify-center mb-2">
                    <Trophy className="w-6 h-6 text-secondary-foreground" />
                  </div>
                  <div className="text-2xl font-bold text-foreground">{getStars(score)}</div>
                  <div className="text-xs text-muted-foreground">Estrellas</div>
                </div>
              </div>

              {/* Performance Badge */}
              <div className="flex justify-center">
                <Badge variant="secondary" className={`${getScoreColor(score)} bg-secondary/50 text-base py-2 px-4`}>
                  {score >= 80 ? "Aprobado" : "Necesita mejorar"}
                </Badge>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button
                  onClick={() => router.push(`/quiz/${moduleId}`)}
                  variant="outline"
                  className="flex-1 bg-transparent"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reintentar
                </Button>

                <Button
                  onClick={() => router.push(`/sandbox/${moduleId}`)}
                  variant="outline"
                  className="flex-1 bg-transparent"
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Explorar sandbox
                </Button>

                <Button onClick={() => router.push("/")} className="flex-1 glow-primary">
                  <Home className="w-4 h-4 mr-2" />
                  Volver al inicio
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card className="mt-6 bg-card/50 border-border">
            <CardContent className="p-6">
              <h3 className="font-semibold text-foreground mb-3">Próximos pasos</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <span>Explora el sandbox interactivo para practicar los conceptos</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <span>Revisa las explicaciones de las preguntas que fallaste</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <span>Continúa con otros módulos para completar tu aprendizaje</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
