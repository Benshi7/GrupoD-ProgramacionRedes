"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Clock, Target } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { QuizCard } from "@/components/QuizCard"
import { ScoreBoard } from "@/components/ScoreBoard"
import { getQuestionsByModule } from "@/lib/questions"
import { modules } from "@/lib/modules"
import { useQuizStore } from "@/store/useQuizStore"

export default function QuizPage() {
  console.log("QuizPage: componente inicializado")
  const params = useParams()
  const router = useRouter()
  const moduleId = params.module as string

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [startTime] = useState(Date.now())
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({})

  const { setModuleProgress, setModuleScore, addModuleTime, markQuestionAnswered } = useQuizStore()

  const questions = getQuestionsByModule(moduleId)
  const module = modules.find((m) => m.id === moduleId)
  const currentQuestion = questions[currentQuestionIndex]

  useEffect(() => {
    if (!module || questions.length === 0) {
      console.log(`QuizPage: preguntas no encontradas para ID: ${moduleId}.`) 
      router.push("/")
    }
    else {
      console.log(`QuizPage: Módulo cargado: ${module.title}.`)
    }
  }, [module, questions, router])

  const handleAnswerSelect = (questionId: string, choiceId: string) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: choiceId }))
    markQuestionAnswered(moduleId as any, questionId)
  }

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1)
    } else {
      // Quiz completed
      finishQuiz()
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1)
    }
  }

  const finishQuiz = () => {
    const timeSpent = Math.round((Date.now() - startTime) / 60000) // minutes
    addModuleTime(moduleId as any, timeSpent)

    // Calculate score
    const correctAnswers = questions.filter((q) => {
      const selectedChoice = selectedAnswers[q.id]
      return q.choices.find((c) => c.id === selectedChoice)?.correct
    }).length

    const score = Math.round((correctAnswers / questions.length) * 100)
    setModuleScore(moduleId as any, score)
    setModuleProgress(moduleId as any, 100)

    // Navigate to results
    router.push(
      `/quiz/${moduleId}/results?score=${score}&time=${timeSpent}&correct=${correctAnswers}&total=${questions.length}`,
    )
  }

  const progress = ((currentQuestionIndex + 1) / questions.length) * 100

  if (!module || !currentQuestion) {
    return <div>Cargando...</div>
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/")}
                className="text-muted-foreground hover:text-primary"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver
              </Button>
              <div>
                <h1 className="text-xl font-bold text-primary">{module.title}</h1>
                <p className="text-sm text-muted-foreground">
                  Pregunta {currentQuestionIndex + 1} de {questions.length}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>{Math.round((Date.now() - startTime) / 60000)} min</span>
              </div>
              <ScoreBoard />
            </div>
          </div>

          {/* Progress */}
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">Progreso del Quiz</span>
              <span className="text-foreground font-medium">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2 glow-accent" />
          </div>
        </div>
      </header>

      {/* Quiz Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <QuizCard
            question={currentQuestion}
            selectedAnswer={selectedAnswers[currentQuestion.id]}
            onAnswerSelect={(choiceId) => handleAnswerSelect(currentQuestion.id, choiceId)}
          />

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              className="bg-transparent"
            >
              Anterior
            </Button>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Target className="w-4 h-4" />
              <span>
                {Object.keys(selectedAnswers).length} de {questions.length} respondidas
              </span>
            </div>

            <Button onClick={handleNext} disabled={!selectedAnswers[currentQuestion.id]} className="glow-primary">
              {currentQuestionIndex === questions.length - 1 ? "Finalizar" : "Siguiente"}
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
