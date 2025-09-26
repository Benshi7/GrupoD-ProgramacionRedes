"use client"

import { motion } from "framer-motion"
import { CheckCircle, XCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface AnswerBadgeProps {
  isCorrect: boolean
}

export function AnswerBadge({ isCorrect }: AnswerBadgeProps) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}>
      <Badge
        variant="secondary"
        className={`flex items-center gap-2 text-sm py-2 px-3 ${
          isCorrect
            ? "bg-green-400/20 text-green-400 border-green-400/30"
            : "bg-red-400/20 text-red-400 border-red-400/30"
        }`}
      >
        {isCorrect ? (
          <>
            <CheckCircle className="w-4 h-4" />
            ¡Correcto!
          </>
        ) : (
          <>
            <XCircle className="w-4 h-4" />
            Incorrecto
          </>
        )}
      </Badge>
    </motion.div>
  )
}
