"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BookOpen, ExternalLink } from "lucide-react"
import { useRouter } from "next/navigation"
import type { Question } from "@/lib/questions"

interface ExplanationDialogProps {
  question: Question
  isOpen: boolean
  onClose: () => void
}

export function ExplanationDialog({ question, isOpen, onClose }: ExplanationDialogProps) {
  const router = useRouter()

  const handleSandboxClick = () => {
    if (question.explanation.sandboxLink) {
      router.push(question.explanation.sandboxLink)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            Explicación
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">{question.prompt}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Quick Summary */}
          <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
            <h3 className="font-semibold text-primary mb-2">Resumen</h3>
            <p className="text-foreground">{question.explanation.tldr}</p>
          </div>

          {/* Detailed Explanation */}
          <div>
            <h3 className="font-semibold text-foreground mb-3">Explicación detallada</h3>
            <ul className="space-y-2">
              {question.explanation.details.map((detail, index) => (
                <li key={index} className="flex items-start gap-3 text-muted-foreground">
                  <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0" />
                  <span>{detail}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Module Badge */}
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-accent">
              Módulo: {question.module.toUpperCase()}
            </Badge>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-border">
            {question.explanation.sandboxLink && (
              <Button onClick={handleSandboxClick} className="glow-primary">
                <ExternalLink className="w-4 h-4 mr-2" />
                Probar en sandbox
              </Button>
            )}
            <Button variant="outline" onClick={onClose} className="bg-transparent">
              Cerrar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
