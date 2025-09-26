"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Crown, Radio, Shield } from "lucide-react"

interface STPSwitch {
  id: string
  name: string
  bridgeId: number
  priority: number
  mac: string
  position: { x: number; y: number }
  isRoot: boolean
}

interface STPLink {
  id: string
  from: string
  to: string
  cost: number
  enabled: boolean
  isBlocked: boolean
}

interface STPAnimationProps {
  switches: STPSwitch[]
  links: STPLink[]
  onComplete: () => void
}

const ANIMATION_STEPS = [
  {
    id: "election",
    title: "Elección de Root Bridge",
    description: "Los switches intercambian BPDUs para elegir el root bridge",
    duration: 2000,
  },
  {
    id: "root_ports",
    title: "Selección de Root Ports",
    description: "Cada switch elige su puerto con menor costo hacia el root",
    duration: 1500,
  },
  {
    id: "designated_ports",
    title: "Puertos Designados",
    description: "Se eligen puertos designados para cada segmento",
    duration: 1500,
  },
  {
    id: "blocking",
    title: "Bloqueo de Puertos",
    description: "Los puertos redundantes se bloquean para prevenir bucles",
    duration: 1500,
  },
]

export function STPAnimation({ switches, links, onComplete }: STPAnimationProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [showMessage, setShowMessage] = useState(false)

  useEffect(() => {
    if (currentStep >= ANIMATION_STEPS.length) {
      setTimeout(onComplete, 1000)
      return
    }

    const step = ANIMATION_STEPS[currentStep]

    setShowMessage(true)

    const timer = setTimeout(() => {
      setShowMessage(false)
      setTimeout(() => {
        setCurrentStep((prev) => prev + 1)
      }, 300)
    }, step.duration)

    return () => clearTimeout(timer)
  }, [currentStep, onComplete])

  const currentAnimation = ANIMATION_STEPS[currentStep]
  const rootSwitch = switches.find((sw) => sw.isRoot)

  if (!currentAnimation) {
    return (
      <div className="text-center py-8">
        <Badge className="bg-green-500 text-white">STP Convergencia Completada</Badge>
        <p className="text-sm text-muted-foreground mt-2">
          La topología spanning tree ha sido calculada y los bucles eliminados
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Current Step Display */}
      <AnimatePresence>
        {showMessage && currentAnimation && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Badge className="bg-primary text-white">{currentStep + 1}</Badge>
                  <span className="font-medium text-foreground">{currentAnimation.title}</span>
                  {currentStep === 0 && <Crown className="w-4 h-4 text-primary ml-auto" />}
                  {currentStep === 1 && <Radio className="w-4 h-4 text-accent ml-auto" />}
                  {currentStep === 3 && <Shield className="w-4 h-4 text-red-400 ml-auto" />}
                </div>
                <p className="text-sm text-muted-foreground">{currentAnimation.description}</p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Visual Representation */}
      <div className="grid grid-cols-3 gap-4 p-6 bg-muted/20 rounded-lg">
        {switches.map((sw) => (
          <motion.div
            key={sw.id}
            className="flex flex-col items-center space-y-2"
            animate={
              currentStep === 0 && sw.isRoot
                ? { scale: [1, 1.2, 1], borderColor: ["#3b82f6", "#10b981", "#3b82f6"] }
                : {}
            }
            transition={{ repeat: currentStep === 0 && sw.isRoot ? Number.POSITIVE_INFINITY : 0, duration: 1 }}
          >
            <div
              className={`w-16 h-12 border-2 rounded-lg flex items-center justify-center transition-all ${
                sw.isRoot ? "border-primary bg-primary/10" : "border-border bg-card"
              }`}
            >
              <div className="text-xs font-medium text-center text-foreground">{sw.name}</div>
            </div>

            {sw.isRoot && (
              <Badge className="bg-primary text-white text-xs">
                <Crown className="w-3 h-3 mr-1" />
                Root
              </Badge>
            )}

            <div className="text-xs text-muted-foreground text-center">
              <div>ID: {sw.bridgeId}</div>
              <div>P: {sw.priority}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Step Details */}
      <Card className="bg-muted/20 border-border">
        <CardContent className="p-4">
          <div className="space-y-3">
            {currentStep === 0 && (
              <div className="space-y-2">
                <h4 className="font-medium text-foreground">Proceso de elección:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Cada switch anuncia su Bridge ID</li>
                  <li>• Se comparan prioridades y direcciones MAC</li>
                  <li>• El switch con menor Bridge ID se convierte en root</li>
                  {rootSwitch && <li className="text-primary">• {rootSwitch.name} elegido como Root Bridge</li>}
                </ul>
              </div>
            )}

            {currentStep === 1 && (
              <div className="space-y-2">
                <h4 className="font-medium text-foreground">Selección de Root Ports:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Cada switch no-root elige su mejor puerto hacia el root</li>
                  <li>• Se considera el costo del camino hacia el root bridge</li>
                  <li>• El puerto con menor costo se convierte en root port</li>
                </ul>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-2">
                <h4 className="font-medium text-foreground">Puertos Designados:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Para cada segmento, se elige un puerto designado</li>
                  <li>• El switch con menor costo hacia el root gana</li>
                  <li>• Los puertos designados reenvían tráfico</li>
                </ul>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-2">
                <h4 className="font-medium text-foreground">Bloqueo de Puertos:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Los puertos que no son root ni designados se bloquean</li>
                  <li>• Esto elimina todos los bucles de la topología</li>
                  <li>• Los puertos bloqueados siguen escuchando BPDUs</li>
                  <li className="text-red-400">• Enlaces redundantes ahora bloqueados</li>
                </ul>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Progress Indicator */}
      <div className="flex justify-center space-x-2">
        {ANIMATION_STEPS.map((_, index) => (
          <div
            key={index}
            className={`w-3 h-3 rounded-full transition-colors ${
              index < currentStep
                ? "bg-primary"
                : index === currentStep
                  ? "bg-primary animate\
