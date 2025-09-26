"use client"

import { useState } from "react"
import { ArrowLeft, RotateCcw, Play, Globe, Server, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { useRouter } from "next/navigation"
import { DNSHierarchy } from "@/components/DNSHierarchy"
import { DNSCachePanel } from "@/components/DNSCachePanel"
import { DNSQueryAnimation } from "@/components/DNSQueryAnimation"

const DEMO_DOMAINS = ["google.com", "github.com", "stackoverflow.com", "wikipedia.org", "cloudflare.com", "vercel.com"]

const REAL_DNS_DATA = {
  "google.com": { ip: "142.250.191.14", ttl: 300 },
  "github.com": { ip: "140.82.114.4", ttl: 300 },
  "stackoverflow.com": { ip: "151.101.1.69", ttl: 300 },
  "wikipedia.org": { ip: "208.80.154.224", ttl: 300 },
  "cloudflare.com": { ip: "104.16.132.229", ttl: 300 },
  "vercel.com": { ip: "76.76.19.61", ttl: 300 },
  "example.com": { ip: "93.184.216.34", ttl: 300 },
}

export default function DNSSandboxPage() {
  const router = useRouter()
  const [queryDomain, setQueryDomain] = useState("google.com")
  const [isResolving, setIsResolving] = useState(false)
  const [resolvedData, setResolvedData] = useState<any>(null)
  const [isRecursive, setIsRecursive] = useState(true)
  const [cacheEntries, setCacheEntries] = useState<any[]>([])
  const [showAnimation, setShowAnimation] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)

  const handleResolve = async () => {
    if (!queryDomain.trim()) return

    setIsResolving(true)
    setShowAnimation(true)
    setCurrentStep(0)

    const steps = [
      { name: "Cliente", delay: 500 },
      { name: "Resolver", delay: 800 },
      { name: "Raíz", delay: 600 },
      { name: "TLD", delay: 700 },
      { name: "Autoritativo", delay: 900 },
    ]

    for (let i = 0; i < steps.length; i++) {
      setTimeout(
        () => {
          setCurrentStep(i + 1)
        },
        steps.slice(0, i + 1).reduce((acc, step) => acc + step.delay, 0),
      )
    }

    setTimeout(() => {
      const realData = REAL_DNS_DATA[queryDomain.toLowerCase()]
      const mockResult = {
        domain: queryDomain,
        ip:
          realData?.ip ||
          `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        ttl: realData?.ttl || Math.floor(Math.random() * 3600) + 300,
        recordType: "A",
        timestamp: Date.now(),
      }

      setResolvedData(mockResult)

      const newCacheEntry = {
        ...mockResult,
        expiresAt: Date.now() + mockResult.ttl * 1000,
      }

      setCacheEntries((prev) => {
        const filtered = prev.filter((entry) => entry.domain !== queryDomain)
        return [newCacheEntry, ...filtered].slice(0, 10)
      })

      setIsResolving(false)
      setShowAnimation(false)
      setCurrentStep(0)
    }, 3500)
  }

  const handleClearCache = () => {
    setCacheEntries([])
  }

  const handleReset = () => {
    setResolvedData(null)
    setIsResolving(false)
    setShowAnimation(false)
    setCurrentStep(0)
  }

  const handleDomainSelect = (domain: string) => {
    setQueryDomain(domain)
  }

  return (
    <div className="min-h-screen bg-background">
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
                <h1 className="text-3xl font-bold text-primary glow-primary">DNS Sandbox</h1>
                <p className="text-muted-foreground mt-1">Explora la resolución de nombres de dominio</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleReset} className="bg-transparent">
                <RotateCcw className="w-4 h-4 mr-2" />
                Reiniciar
              </Button>
              <Button variant="outline" size="sm" onClick={handleClearCache} className="bg-transparent">
                <Server className="w-4 h-4 mr-2" />
                Limpiar caché
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2">
                  <Globe className="w-5 h-5 text-primary" />
                  Consulta DNS
                </CardTitle>
                <CardDescription>Ingresa un dominio para resolver</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Input
                    value={queryDomain}
                    onChange={(e) => setQueryDomain(e.target.value)}
                    placeholder="ejemplo.com"
                    className="bg-background border-border"
                    disabled={isResolving}
                  />
                  <Button
                    onClick={handleResolve}
                    disabled={isResolving || !queryDomain.trim()}
                    className="w-full glow-primary"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    {isResolving ? "Resolviendo..." : "Resolver dominio"}
                  </Button>
                </div>

                <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                  <div>
                    <div className="font-medium text-foreground">Modo recursivo</div>
                    <div className="text-sm text-muted-foreground">
                      {isRecursive ? "El resolver hace todo el trabajo" : "Consultas iterativas paso a paso"}
                    </div>
                  </div>
                  <Switch checked={isRecursive} onCheckedChange={setIsRecursive} disabled={isResolving} />
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-foreground">Dominios de ejemplo:</h4>
                  <div className="flex flex-wrap gap-2">
                    {DEMO_DOMAINS.map((domain) => (
                      <Button
                        key={domain}
                        variant="outline"
                        size="sm"
                        onClick={() => handleDomainSelect(domain)}
                        className="text-xs bg-transparent"
                        disabled={isResolving}
                      >
                        {domain}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">📚 Cómo funciona</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <h4 className="font-medium text-foreground">Proceso de resolución:</h4>
                  <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                    <li>Cliente consulta al resolver local</li>
                    <li>Resolver consulta servidor raíz</li>
                    <li>Raíz redirige al servidor TLD</li>
                    <li>TLD redirige al servidor autoritativo</li>
                    <li>Autoritativo devuelve la IP</li>
                  </ol>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-foreground">Conceptos clave:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• TTL controla el tiempo de caché</li>
                    <li>• Jerarquía: raíz → TLD → autoritativo</li>
                    <li>• Caché acelera consultas repetidas</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Jerarquía DNS</CardTitle>
                <CardDescription>Visualización del proceso de resolución de nombres</CardDescription>
              </CardHeader>
              <CardContent>
                <DNSHierarchy
                  domain={queryDomain}
                  isResolving={isResolving}
                  isRecursive={isRecursive}
                  resolvedData={resolvedData}
                  currentStep={currentStep}
                />
              </CardContent>
            </Card>

            {showAnimation && (
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">Animación de consulta</CardTitle>
                  <CardDescription>Seguimiento en tiempo real del proceso de resolución</CardDescription>
                </CardHeader>
                <CardContent>
                  <DNSQueryAnimation
                    domain={queryDomain}
                    isRecursive={isRecursive}
                    onComplete={() => setShowAnimation(false)}
                  />
                </CardContent>
              </Card>
            )}

            {resolvedData && (
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">Resultado de la consulta</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-green-400/10 border border-green-400/30 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className="bg-green-500 text-white">Resuelto</Badge>
                        <span className="font-medium text-foreground">{resolvedData.domain}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Dirección IP:</span>
                          <a
                            href={`http://${resolvedData.domain}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-2 text-primary font-mono hover:underline cursor-pointer"
                          >
                            {resolvedData.ip}
                          </a>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Tipo de registro:</span>
                          <span className="ml-2 text-foreground font-mono">{resolvedData.recordType}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">TTL:</span>
                          <span className="ml-2 text-foreground font-mono">{resolvedData.ttl}s</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Tiempo de consulta:</span>
                          <span className="ml-2 text-foreground font-mono">
                            {Math.round((Date.now() - resolvedData.timestamp) / 1000)}s
                          </span>
                        </div>
                      </div>
                      <div className="mt-3 pt-3 border-t border-border">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(`https://${resolvedData.domain}`, "_blank")}
                          className="bg-transparent"
                        >
                          <Globe className="w-4 h-4 mr-2" />
                          Visitar {resolvedData.domain}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2">
                  <Clock className="w-5 h-5 text-accent" />
                  Caché DNS
                </CardTitle>
                <CardDescription>Registros almacenados en caché con sus TTL</CardDescription>
              </CardHeader>
              <CardContent>
                <DNSCachePanel cacheEntries={cacheEntries} onClearCache={handleClearCache} />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
