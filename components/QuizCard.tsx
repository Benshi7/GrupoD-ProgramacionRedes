"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, HelpCircle } from "lucide-react"
import { ExplanationDialog } from "@/components/ExplanationDialog"
import { AnswerBadge } from "@/components/AnswerBadge"
import type { Question } from "@/lib/questions"
import { getDifficultyColor, getDifficultyLabel } from "@/lib/modules"

interface QuizCardProps {
  question: Question
  selectedAnswer?: string
  onAnswerSelect: (choiceId: string) => void
}

export function QuizCard({ question, selectedAnswer, onAnswerSelect }: QuizCardProps) {
  const [showExplanation, setShowExplanation] = useState(false)

  const selectedChoice = question.choices.find((c) => c.id === selectedAnswer)
  const isAnswered = !!selectedAnswer
  const isCorrect = selectedChoice?.correct || false

  const handleChoiceSelect = (choiceId: string) => {
    if (!isAnswered) {
      onAnswerSelect(choiceId)
    }
  }

  return (
    <>
      <Card className="bg-card border-border glow-accent">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg text-foreground mb-2">{question.prompt}</CardTitle>
              <CardDescription className="flex items-center gap-2">
                <Badge variant="secondary" className={`${getDifficultyColor(question.difficulty)} bg-secondary/50`}>
                  {getDifficultyLabel(question.difficulty)}
                </Badge>
                <span className="text-muted-foreground">•</span>
                <span className="text-muted-foreground capitalize">{question.module.toUpperCase()}</span>
              </CardDescription>
            </div>
            {isAnswered && (
              <div className="ml-4">
                {isCorrect ? (
                  <CheckCircle className="w-6 h-6 text-green-400" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-400" />
                )}
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Answer Choices */}
          <div className="space-y-3">
            {question.choices.map((choice) => {
              const isSelected = selectedAnswer === choice.id
              const isCorrectChoice = choice.correct
              const showCorrectness = isAnswered

              const buttonVariant: "default" | "outline" | "secondary" = "outline"
              let buttonClass = "justify-start text-left h-auto p-4 bg-transparent hover:bg-accent/50"

              if (showCorrectness) {
                if (isCorrectChoice) {
                  buttonClass += " border-green-400 bg-green-400/10 text-green-400"
                } else if (isSelected && !isCorrectChoice) {
                  buttonClass += " border-red-400 bg-red-400/10 text-red-400"
                }
              } else if (isSelected) {
                buttonClass += " border-primary bg-primary/10 text-primary"
              }

              return (
                <Button
                  key={choice.id}
                  variant={buttonVariant}
                  className={buttonClass}
                  onClick={() => handleChoiceSelect(choice.id)}
                  disabled={isAnswered}
                >
                  <div className="flex items-center gap-3 w-full">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full border-2 border-current flex items-center justify-center text-xs font-bold">
                      {choice.id.toUpperCase()}
                    </div>
                    <span className="flex-1">{choice.label}</span>
                    {showCorrectness && isCorrectChoice && <CheckCircle className="w-5 h-5" />}
                    {showCorrectness && isSelected && !isCorrectChoice && <XCircle className="w-5 h-5" />}
                  </div>
                </Button>
              )
            })}
          </div>

          {/* Answer Feedback */}
          {isAnswered && (
            <div className="pt-4 border-t border-border">
              <AnswerBadge isCorrect={isCorrect} />
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowExplanation(true)}
                className="mt-3 bg-transparent"
              >
                <HelpCircle className="w-4 h-4 mr-2" />
                Mostrar explicación
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <ExplanationDialog question={question} isOpen={showExplanation} onClose={() => setShowExplanation(false)} />
    </>
  )
  
}
