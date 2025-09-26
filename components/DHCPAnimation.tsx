"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Wifi, Server, ArrowRight } from "lucide-react"

interface DHCPAnimationProps {
  isActive: boolean
  onComplete: () => void
}

const ANIMATION_STEPS = [
  {
    id: "discover",
    title: "DISCOVER",
    description: "Cliente busca servidores DHCP",
    color: "bg-blue-500",
    from: "client",
    to: "broadcast",
    message: "¿Hay algún servidor DHCP disponible?",
  },
  {
    id: "offer",
    title: "OFFER",
    description: "Servidor ofrece configuración",
    color: "bg-green-500",
    from: "server",
    to: "client",
    message: "Te ofrezco IP: 192.168.1.100",
  },
  {
    id: "request",
    title: "REQUEST",
    description: "Cliente solicita la IP",
    color: "bg-yellow-500",
    from: "client",
    to: "server",
    message: "Acepto la IP 192.168.1.100",
  },
  {
    id: "ack",
    title: "ACK",
    description: "Servidor confirma asignación",
    color: "bg-purple-500",
    from: "server",
    to: "client",
    message: "IP asignada. Lease: 24 horas",
  },
]

export function DHCPAnimation({ isActive, onComplete }: DHCPAnimationProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [showMessage, setShowMessage] = useState(false)

  useEffect(() => {
    if (!isActive) return

    const animateStep = () => {
      if (currentStep >= ANIMATION_STEPS.length) {
        onComplete()
        return
      }

      setIsAnimating(true)
      setShowMessage(true)

      setTimeout(() => {
        setShowMessage(false)
        setIsAnimating(false)
        setCurrentStep((prev) => prev + 1)
      }, 2000)
    }

    const timer = setTimeout(animateStep, 500)
    return () => clearTimeout(timer)
  }, [currentStep, isActive, onComplete])

  const currentAnimation = ANIMATION_STEPS[currentStep]

  return (
    <div className="space-y-6">
      {/* Network Diagram */}
      <div className="flex items-center justify-between p-6 bg-muted/20 rounded-lg">
        {/* Client */}
        <div className="flex flex-col items-center space-y-2">
          <div className="w-16 h-16 bg-card border-2 border-border rounded-lg flex items-center justify-center">
            <Wifi className="w-8 h-8 text-primary" />
          </div>
          <div className="text-sm font-medium text-foreground">Cliente</div>
          <div className="text-xs text-muted-foreground">Sin IP</div>
        </div>

        {/* Animation Arrow */}
        <div className="flex-1 flex items-center justify-center relative">
          <AnimatePresence>
            {isAnimating && currentAnimation && (
              <motion.div
                initial={{ x: currentAnimation.from === "client" ? -100 : 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: currentAnimation.to === "client" ? -100 : 100, opacity: 0 }}
                transition={{ duration: 0.8 }}
                className="absolute"
              >
                <div className="flex items-center gap-2">
                  <ArrowRight
                    className={`w-6 h-6 ${currentAnimation.from === "server" ? "rotate-180" : ""} text-primary`}
                  />
                  <Badge className={`${currentAnimation.color} text-white`}>{currentAnimation.title}</Badge>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Server */}
        <div className="flex flex-col items-center space-y-2">
          <div className="w-16 h-16 bg-card border-2 border-border rounded-lg flex items-center justify-center">
            <Server className="w-8 h-8 text-accent" />
          </div>
          <div className="text-sm font-medium text-foreground">Servidor DHCP</div>
          <div className="text-xs text-muted-foreground">192.168.1.1</div>
        </div>
      </div>

      {/* Message Display */}
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
                  <Badge className={`${currentAnimation.color} text-white`}>{currentAnimation.title}</Badge>
                  <span className="font-medium text-foreground">{currentAnimation.description}</span>
                </div>
                <p className="text-sm text-muted-foreground italic">"{currentAnimation.message}"</p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress */}
      <div className="flex justify-center space-x-2">
        {ANIMATION_STEPS.map((step, index) => (
          <div
            key={step.id}
            className={`w-3 h-3 rounded-full transition-colors ${
              index < currentStep
                ? "bg-primary"
                : index === currentStep
                  ? "bg-primary animate-pulse"
                  : "bg-muted-foreground"
            }`}
          />
        ))}
      </div>

      {/* Configuration Display */}
      {currentStep >= ANIMATION_STEPS.length && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="bg-green-400/10 border-green-400/30">
            <CardContent className="p-4">
              <h4 className="font-medium text-green-400 mb-3">Configuración asignada:</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">IP Address:</span>
                  <span className="ml-2 text-foreground font-mono">192.168.1.100</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Subnet Mask:</span>
                  <span className="ml-2 text-foreground font-mono">255.255.255.0</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Gateway:</span>
                  <span className="ml-2 text-foreground font-mono">192.168.1.1</span>
                </div>
                <div>
                  <span className="text-muted-foreground">DNS:</span>
                  <span className="ml-2 text-foreground font-mono">8.8.8.8</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Lease Time:</span>
                  <span className="ml-2 text-foreground font-mono">24 horas</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
}
