"use client"

import { useState } from "react"
import { ArrowLeft, RotateCcw, Play, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useRouter } from "next/navigation"
import { DnDSequencer } from "@/components/DnDSequencer"
import { DHCPLeasePanel } from "@/components/DHCPLeasePanel"
import { DHCPAnimation } from "@/components/DHCPAnimation"

const DHCP_STEPS = [
  {
    id: "discover",
    title: "DISCOVER",
    description: "Cliente busca servidores DHCP",
    color: "bg-blue-500",
    details: "El cliente envía un broadcast para encontrar servidores DHCP disponibles en la red.",
  },
  {
    id: "offer",
    title: "OFFER",
    description: "Servidor ofrece configuración",
    color: "bg-green-500",
    details: "El servidor responde con una oferta que incluye IP, máscara, gateway y DNS.",
  },
  {
    id: "request",
    title: "REQUEST",
    description: "Cliente solicita la IP ofrecida",
    color: "bg-yellow-500",
    details: "El cliente acepta la oferta y solicita formalmente la configuración.",
  },
  {
    id: "ack",
    title: "ACK",
    description: "Servidor confirma la asignación",
    color: "bg-purple-500",
    details: "El servidor confirma la asignación y establece el lease time.",
  },
]

export default function DHCPSandboxPage() {
  const router = useRouter()
  const [currentSequence, setCurrentSequence] = useState<string[]>([])
  const [isSequenceComplete, setIsSequenceComplete] = useState(false)
  const [showAnimation, setShowAnimation] = useState(false)
  const [leaseActive, setLeaseActive] = useState(false)

  const correctSequence = ["discover", "offer", "request", "ack"]

  const handleSequenceChange = (sequence: string[]) => {
    setCurrentSequence(sequence)
    const isComplete = sequence.length === 4 && sequence.every((step, index) => step === correctSequence[index])
    setIsSequenceComplete(isComplete)

    if (isComplete && !showAnimation) {
      setShowAnimation(true)
      setLeaseActive(true)
    }
  }

  const handleReset = () => {
    setCurrentSequence([])
    setIsSequenceComplete(false)
    setShowAnimation(false)
    setLeaseActive(false)
  }

  const handlePlayAnimation = () => {
    if (isSequenceComplete) {
      setShowAnimation(true)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/")}
                className="text-muted-foreground hover:text-primary"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver al inicio
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-primary glow-primary">DHCP Sandbox</h1>
                <p className="text-muted-foreground mt-1">Aprende el proceso DORA de forma interactiva</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleReset} className="bg-transparent">
                <RotateCcw className="w-4 h-4 mr-2" />
                Reiniciar
              </Button>
              {isSequenceComplete && (
                <Button size="sm" onClick={handlePlayAnimation} className="glow-primary">
                  <Play className="w-4 h-4 mr-2" />
                  Ver animación
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Instructions */}
          <div className="lg:col-span-1">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2">📚 Instrucciones</CardTitle>
                <CardDescription>
                  Arrastra los pasos en el orden correcto para completar el proceso DHCP
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <h4 className="font-medium text-foreground">Objetivo:</h4>
                  <p className="text-sm text-muted-foreground">
                    Organiza los 4 pasos del proceso DHCP en el orden correcto: DORA (Discover, Offer, Request, Ack)
                  </p>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium text-foreground">Progreso:</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Pasos colocados</span>
                      <span className="text-foreground">{currentSequence.length}/4</span>
                    </div>
                    <Progress value={(currentSequence.length / 4) * 100} className="h-2" />
                  </div>
                </div>

                {isSequenceComplete && (
                  <div className="p-3 bg-green-400/10 border border-green-400/20 rounded-lg">
                    <div className="flex items-center gap-2 text-green-400">
                      <CheckCircle className="w-4 h-4" />
                      <span className="font-medium">¡Secuencia correcta!</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Has completado correctamente el proceso DORA de DHCP.
                    </p>
                  </div>
                )}

                <div className="space-y-2">
                  <h4 className="font-medium text-foreground">Conceptos clave:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• DHCP automatiza la configuración de red</li>
                    <li>• El proceso DORA asegura la asignación correcta</li>
                    <li>• El lease time controla la duración de la asignación</li>
                    <li>• T1 y T2 manejan la renovación del lease</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Drag and Drop Sequencer */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Secuencia DHCP</CardTitle>
                <CardDescription>Arrastra los pasos para formar la secuencia DORA correcta</CardDescription>
              </CardHeader>
              <CardContent>
                <DnDSequencer
                  steps={DHCP_STEPS}
                  currentSequence={currentSequence}
                  onSequenceChange={handleSequenceChange}
                  correctSequence={correctSequence}
                />
              </CardContent>
            </Card>

            {/* Animation Panel */}
            {showAnimation && (
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">Simulación DHCP</CardTitle>
                  <CardDescription>Visualización del intercambio de mensajes DHCP</CardDescription>
                </CardHeader>
                <CardContent>
                  <DHCPAnimation isActive={showAnimation} onComplete={() => {}} />
                </CardContent>
              </Card>
            )}

            {/* Lease Management Panel */}
            {leaseActive && (
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">Gestión de Lease</CardTitle>
                  <CardDescription>Controla el tiempo de vida de la asignación DHCP</CardDescription>
                </CardHeader>
                <CardContent>
                  <DHCPLeasePanel isActive={leaseActive} onLeaseExpire={() => setLeaseActive(false)} />
                </CardContent>
              </Card>
            )}

            {/* Step Details */}
            {currentSequence.length > 0 && (
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">Detalles de los pasos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {currentSequence.map((stepId, index) => {
                      const step = DHCP_STEPS.find((s) => s.id === stepId)
                      if (!step) return null

                      const isCorrect = stepId === correctSequence[index]

                      return (
                        <div
                          key={`${stepId}-${index}`}
                          className={`p-4 rounded-lg border ${
                            isCorrect ? "border-green-400/30 bg-green-400/10" : "border-red-400/30 bg-red-400/10"
                          }`}
                        >
                          <div className="flex items-center gap-3 mb-2">
                            <Badge className={`${step.color} text-white`}>{index + 1}</Badge>
                            <h4 className="font-medium text-foreground">{step.title}</h4>
                            <span className="text-sm text-muted-foreground">- {step.description}</span>
                            {isCorrect ? (
                              <CheckCircle className="w-4 h-4 text-green-400 ml-auto" />
                            ) : (
                              <div className="w-4 h-4 rounded-full bg-red-400 ml-auto" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{step.details}</p>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
