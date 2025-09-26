"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Trash2, Clock, Globe } from "lucide-react"

interface CacheEntry {
  domain: string
  ip: string
  ttl: number
  recordType: string
  timestamp: number
  expiresAt: number
}

interface DNSCachePanelProps {
  cacheEntries: CacheEntry[]
  onClearCache: () => void
}

export function DNSCachePanel({ cacheEntries, onClearCache }: DNSCachePanelProps) {
  const [currentTime, setCurrentTime] = useState(Date.now())

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const getTimeRemaining = (entry: CacheEntry) => {
    const remaining = Math.max(0, entry.expiresAt - currentTime)
    return Math.floor(remaining / 1000)
  }

  const getTTLPercentage = (entry: CacheEntry) => {
    const totalTTL = entry.ttl * 1000
    const elapsed = currentTime - entry.timestamp
    const remaining = Math.max(0, totalTTL - elapsed)
    return (remaining / totalTTL) * 100
  }

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${seconds % 60}s`
    return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`
  }

  const getStatusColor = (percentage: number) => {
    if (percentage > 50) return "text-green-400"
    if (percentage > 20) return "text-yellow-400"
    return "text-red-400"
  }

  if (cacheEntries.length === 0) {
    return (
      <div className="text-center py-8">
        <Globe className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">El caché DNS está vacío</p>
        <p className="text-sm text-muted-foreground mt-1">Resuelve algunos dominios para ver las entradas en caché</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Cache Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-accent" />
          <span className="text-sm text-muted-foreground">{cacheEntries.length} entradas en caché</span>
        </div>
        <Button variant="outline" size="sm" onClick={onClearCache} className="bg-transparent">
          <Trash2 className="w-4 h-4 mr-2" />
          Limpiar todo
        </Button>
      </div>

      {/* Cache Entries */}
      <div className="space-y-3">
        {cacheEntries.map((entry, index) => {
          const timeRemaining = getTimeRemaining(entry)
          const ttlPercentage = getTTLPercentage(entry)
          const isExpired = timeRemaining === 0

          return (
            <Card
              key={`${entry.domain}-${index}`}
              className={`border-border transition-all ${isExpired ? "opacity-50 bg-red-400/5" : "bg-card"}`}
            >
              <CardContent className="p-4">
                <div className="space-y-3">
                  {/* Entry Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-primary border-primary/30">
                        {entry.recordType}
                      </Badge>
                      <span className="font-medium text-foreground">{entry.domain}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-mono text-foreground">{entry.ip}</div>
                      {isExpired && <Badge className="bg-red-500 text-white text-xs">Expirado</Badge>}
                    </div>
                  </div>

                  {/* TTL Progress */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">TTL restante</span>
                      <span className={`font-medium ${getStatusColor(ttlPercentage)}`}>
                        {isExpired ? "Expirado" : formatTime(timeRemaining)}
                      </span>
                    </div>
                    <Progress
                      value={ttlPercentage}
                      className={`h-2 ${
                        isExpired
                          ? "bg-red-400/20"
                          : ttlPercentage > 50
                            ? "bg-green-400/20"
                            : ttlPercentage > 20
                              ? "bg-yellow-400/20"
                              : "bg-red-400/20"
                      }`}
                    />
                  </div>

                  {/* Entry Details */}
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>TTL original: {entry.ttl}s</span>
                    <span>Cacheado: {formatTime(Math.floor((currentTime - entry.timestamp) / 1000))} atrás</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Cache Info */}
      <Card className="bg-muted/20 border-border">
        <CardContent className="p-4">
          <h4 className="font-medium text-foreground mb-2">Información del caché</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Las entradas expiran según su TTL</li>
            <li>• TTL más bajo = consultas más frecuentes</li>
            <li>• TTL más alto = menos tráfico DNS</li>
            <li>• El caché acelera consultas repetidas</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
