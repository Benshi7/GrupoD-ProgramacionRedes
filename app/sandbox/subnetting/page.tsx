"use client"

import { useState, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Network, Calculator, CheckCircle, XCircle } from "lucide-react"
import LinkComponent from "next/link"

interface SubnetResult {
  networkAddress: string
  broadcastAddress: string
  firstHost: string
  lastHost: string
  totalHosts: number
  usableHosts: number
  subnetMask: string
  wildcardMask: string
}

export default function SubnettingSandbox() {
  const [ipAddress, setIpAddress] = useState("192.168.1.0")
  const [cidr, setCidr] = useState("24")
  const [result, setResult] = useState<SubnetResult | null>(null)
  const [error, setError] = useState("")
  const [practiceMode, setPracticeMode] = useState(false)
  const [practiceQuestion, setPracticeQuestion] = useState<any>(null)
  const [userAnswer, setUserAnswer] = useState("")
  const [showAnswer, setShowAnswer] = useState(false)

  const practiceQuestions = [
    {
      question: "¿Cuál es la dirección de red para 192.168.10.50/26?",
      answer: "192.168.10.0",
      type: "network",
    },
    {
      question: "¿Cuántos hosts utilizables hay en una red /28?",
      answer: "14",
      type: "hosts",
    },
    {
      question: "¿Cuál es la máscara de subred para /25?",
      answer: "255.255.255.128",
      type: "mask",
    },
    {
      question: "¿Cuál es la dirección de broadcast para 10.0.0.100/22?",
      answer: "10.0.3.255",
      type: "broadcast",
    },
  ]

  const calculateSubnet = useCallback(() => {
    try {
      setError("")

      // Validate IP address
      const ipParts = ipAddress.split(".").map(Number)
      if (ipParts.length !== 4 || ipParts.some((part) => part < 0 || part > 255)) {
        throw new Error("Dirección IP inválida")
      }

      // Validate CIDR
      const cidrNum = Number.parseInt(cidr)
      if (cidrNum < 0 || cidrNum > 32) {
        throw new Error("CIDR debe estar entre 0 y 32")
      }

      // Calculate subnet mask
      const mask = (0xffffffff << (32 - cidrNum)) >>> 0
      const subnetMask = [(mask >>> 24) & 0xff, (mask >>> 16) & 0xff, (mask >>> 8) & 0xff, mask & 0xff].join(".")

      // Calculate wildcard mask
      const wildcardMask = [
        255 - ((mask >>> 24) & 0xff),
        255 - ((mask >>> 16) & 0xff),
        255 - ((mask >>> 8) & 0xff),
        255 - (mask & 0xff),
      ].join(".")

      // Convert IP to number
      const ipNum = (ipParts[0] << 24) + (ipParts[1] << 16) + (ipParts[2] << 8) + ipParts[3]

      // Calculate network address
      const networkNum = (ipNum & mask) >>> 0
      const networkAddress = [
        (networkNum >>> 24) & 0xff,
        (networkNum >>> 16) & 0xff,
        (networkNum >>> 8) & 0xff,
        networkNum & 0xff,
      ].join(".")

      // Calculate broadcast address
      const broadcastNum = (networkNum | (0xffffffff >>> cidrNum)) >>> 0
      const broadcastAddress = [
        (broadcastNum >>> 24) & 0xff,
        (broadcastNum >>> 16) & 0xff,
        (broadcastNum >>> 8) & 0xff,
        broadcastNum & 0xff,
      ].join(".")

      // Calculate first and last host
      const firstHostNum = networkNum + 1
      const lastHostNum = broadcastNum - 1

      const firstHost = [
        (firstHostNum >>> 24) & 0xff,
        (firstHostNum >>> 16) & 0xff,
        (firstHostNum >>> 8) & 0xff,
        firstHostNum & 0xff,
      ].join(".")

      const lastHost = [
        (lastHostNum >>> 24) & 0xff,
        (lastHostNum >>> 16) & 0xff,
        (lastHostNum >>> 8) & 0xff,
        lastHostNum & 0xff,
      ].join(".")

      const totalHosts = Math.pow(2, 32 - cidrNum)
      const usableHosts = totalHosts - 2

      setResult({
        networkAddress,
        broadcastAddress,
        firstHost,
        lastHost,
        totalHosts,
        usableHosts,
        subnetMask,
        wildcardMask,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error en el cálculo")
      setResult(null)
    }
  }, [ipAddress, cidr])

  const startPractice = () => {
    const randomQuestion = practiceQuestions[Math.floor(Math.random() * practiceQuestions.length)]
    setPracticeQuestion(randomQuestion)
    setUserAnswer("")
    setShowAnswer(false)
    setPracticeMode(true)
  }

  const checkAnswer = () => {
    setShowAnswer(true)
  }

  const nextQuestion = () => {
    startPractice()
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <LinkComponent href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver al Inicio
              </Button>
            </LinkComponent>
            <div>
              <h1 className="text-3xl font-bold text-primary">Calculadora de Subnetting</h1>
              <p className="text-muted-foreground">Practicá cálculos de subredes y VLSM</p>
            </div>
          </div>
          <Badge variant="outline" className="text-cyan-400 border-cyan-400">
            <Network className="h-4 w-4 mr-2" />
            Direccionamiento IP
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Calculator */}
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-primary" />
                Calculadora de Subredes
              </CardTitle>
              <CardDescription>Ingresá una dirección IP y notación CIDR</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ip">Dirección IP</Label>
                  <Input
                    id="ip"
                    value={ipAddress}
                    onChange={(e) => setIpAddress(e.target.value)}
                    placeholder="192.168.1.0"
                    className="font-mono"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cidr">CIDR (/)</Label>
                  <Input
                    id="cidr"
                    value={cidr}
                    onChange={(e) => setCidr(e.target.value)}
                    placeholder="24"
                    type="number"
                    min="0"
                    max="32"
                  />
                </div>
              </div>

              <Button onClick={calculateSubnet} className="w-full">
                Calcular Subred
              </Button>

              {error && (
                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}

              {result && (
                <div className="space-y-3 p-4 bg-muted/50 rounded-md">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-medium text-primary">Dirección de Red:</p>
                      <p className="font-mono">{result.networkAddress}</p>
                    </div>
                    <div>
                      <p className="font-medium text-primary">Dirección de Broadcast:</p>
                      <p className="font-mono">{result.broadcastAddress}</p>
                    </div>
                    <div>
                      <p className="font-medium text-primary">Primer Host:</p>
                      <p className="font-mono">{result.firstHost}</p>
                    </div>
                    <div>
                      <p className="font-medium text-primary">Último Host:</p>
                      <p className="font-mono">{result.lastHost}</p>
                    </div>
                    <div>
                      <p className="font-medium text-primary">Máscara de Subred:</p>
                      <p className="font-mono">{result.subnetMask}</p>
                    </div>
                    <div>
                      <p className="font-medium text-primary">Máscara Wildcard:</p>
                      <p className="font-mono">{result.wildcardMask}</p>
                    </div>
                    <div>
                      <p className="font-medium text-primary">Total de Hosts:</p>
                      <p className="font-mono">{result.totalHosts.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="font-medium text-primary">Hosts Utilizables:</p>
                      <p className="font-mono">{result.usableHosts.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Practice Mode */}
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle>Modo Práctica</CardTitle>
              <CardDescription>Practicá con ejercicios de subnetting</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!practiceMode ? (
                <div className="text-center space-y-4">
                  <p className="text-muted-foreground">Poné a prueba tus conocimientos con ejercicios prácticos</p>
                  <Button onClick={startPractice} className="w-full">
                    Comenzar Práctica
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 bg-muted/50 rounded-md">
                    <p className="font-medium mb-3">{practiceQuestion.question}</p>
                    <Input
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      placeholder="Tu respuesta..."
                      className="font-mono"
                      disabled={showAnswer}
                    />
                  </div>

                  {!showAnswer ? (
                    <Button onClick={checkAnswer} disabled={!userAnswer.trim()}>
                      Verificar Respuesta
                    </Button>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        {userAnswer.trim() === practiceQuestion.answer ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500" />
                        )}
                        <span
                          className={userAnswer.trim() === practiceQuestion.answer ? "text-green-500" : "text-red-500"}
                        >
                          {userAnswer.trim() === practiceQuestion.answer ? "¡Correcto!" : "Incorrecto"}
                        </span>
                      </div>
                      <p className="text-sm">
                        <strong>Respuesta correcta:</strong>{" "}
                        <span className="font-mono">{practiceQuestion.answer}</span>
                      </p>
                      <div className="flex gap-2">
                        <Button onClick={nextQuestion} variant="outline">
                          Siguiente Pregunta
                        </Button>
                        <Button onClick={() => setPracticeMode(false)} variant="ghost">
                          Salir de Práctica
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Educational Content */}
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle>Conceptos Clave de Subnetting</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <h4 className="font-semibold text-primary">CIDR (Classless Inter-Domain Routing)</h4>
              <p className="text-sm text-muted-foreground">
                Notación que indica cuántos bits se usan para la red (/24 = 24 bits de red)
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-primary">Máscara de Subred</h4>
              <p className="text-sm text-muted-foreground">Define qué parte de la IP es red y qué parte es host</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-primary">Dirección de Red</h4>
              <p className="text-sm text-muted-foreground">
                Primera dirección de la subred, identifica la red completa
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-primary">Dirección de Broadcast</h4>
              <p className="text-sm text-muted-foreground">
                Última dirección de la subred, para enviar a todos los hosts
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-primary">VLSM</h4>
              <p className="text-sm text-muted-foreground">
                Variable Length Subnet Mask - diferentes tamaños de subred
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-primary">Hosts Utilizables</h4>
              <p className="text-sm text-muted-foreground">Total de hosts menos 2 (red y broadcast no se asignan)</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
