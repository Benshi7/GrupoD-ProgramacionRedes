"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Clock, RefreshCw, Wifi, AlertTriangle } from "lucide-react"

interface DHCPLeasePanelProps {
  isActive: boolean
  onLeaseExpire: () => void
}

export function DHCPLeasePanel({ isActive, onLeaseExpire }: DHCPLeasePanelProps) {
  const [leaseTime, setLeaseTime] = useState(100) // Percentage
  const [leaseStatus, setLeaseStatus] = useState<"active" | "t1" | "t2" | "expired">("active")
  const [isRenewing, setIsRenewing] = useState(false)

  useEffect(() => {
    if (!isActive) return

    const interval = setInterval(() => {
      setLeaseTime((prev) => {
        const newTime = prev - 2 // Decrease by 2% every second for demo

        if (newTime <= 0) {
          setLeaseStatus("expired")
          onLeaseExpire()
          return 0
        } else if (newTime <= 12.5) {
          setLeaseStatus("t2")
        } else if (newTime <= 50) {
          setLeaseStatus("t1")
        }

        return newTime
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isActive, onLeaseExpire])

  const handleRenew = () => {
    setIsRenewing(true)
    setTimeout(() => {
      setLeaseTime(100)
      setLeaseStatus("active")
      setIsRenewing(false)
    }, 1500)
  }

  const handleRelease = () => {
    setLeaseTime(0)
    setLeaseStatus("expired")
    onLeaseExpire()
  }

  const getStatusColor = () => {
    switch (leaseStatus) {
      case "active":
        return "text-green-400"
      case "t1":
        return "text-yellow-400"
      case "t2":
        return "text-orange-400"
      case "expired":
        return "text-red-400"
      default:
        return "text-muted-foreground"
    }
  }

  const getStatusMessage = () => {
    switch (leaseStatus) {
      case "active":
        return "Lease activo - funcionamiento normal"
      case "t1":
        return "T1 alcanzado - intentando renovar con servidor original"
      case "t2":
        return "T2 alcanzado - buscando cualquier servidor DHCP"
      case "expired":
        return "Lease expirado - se requiere nuevo proceso DORA"
      default:
        return ""
    }
  }

  return (
    <div className="space-y-4">
      {/* Lease Status */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-foreground flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            Estado del Lease DHCP
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Tiempo restante</span>
              <span className={`font-medium ${getStatusColor()}`}>{Math.round(leaseTime)}%</span>
            </div>
            <Progress
              value={leaseTime}
              className={`h-3 ${
                leaseStatus === "expired"
                  ? "bg-red-400/20"
                  : leaseStatus === "t2"
                    ? "bg-orange-400/20"
                    : leaseStatus === "t1"
                      ? "bg-yellow-400/20"
                      : "bg-green-400/20"
              }`}
            />
          </div>

          {/* Status Badge */}
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className={`${getStatusColor()} bg-secondary/50`}>
              {leaseStatus.toUpperCase()}
            </Badge>
            {leaseStatus !== "active" && <AlertTriangle className="w-4 h-4 text-yellow-400" />}
          </div>

          {/* Status Message */}
          <p className="text-sm text-muted-foreground">{getStatusMessage()}</p>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button
              onClick={handleRenew}
              disabled={leaseStatus === "expired" || isRenewing}
              size="sm"
              className="glow-primary"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isRenewing ? "animate-spin" : ""}`} />
              {isRenewing ? "Renovando..." : "Renovar"}
            </Button>
            <Button onClick={handleRelease} variant="outline" size="sm" className="bg-transparent">
              <Wifi className="w-4 h-4 mr-2" />
              Liberar IP
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lease Timeline */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-foreground text-sm">Timeline de Renovación</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${leaseTime > 50 ? "bg-green-400" : "bg-muted-foreground"}`} />
              <div className="flex-1">
                <div className="text-sm font-medium text-foreground">Lease Activo (100% - 50%)</div>
                <div className="text-xs text-muted-foreground">Funcionamiento normal</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div
                className={`w-3 h-3 rounded-full ${
                  leaseTime <= 50 && leaseTime > 12.5 ? "bg-yellow-400" : "bg-muted-foreground"
                }`}
              />
              <div className="flex-1">
                <div className="text-sm font-medium text-foreground">T1 - Renovación (50% - 12.5%)</div>
                <div className="text-xs text-muted-foreground">Intenta renovar con servidor original</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div
                className={`w-3 h-3 rounded-full ${
                  leaseTime <= 12.5 && leaseTime > 0 ? "bg-orange-400" : "bg-muted-foreground"
                }`}
              />
              <div className="flex-1">
                <div className="text-sm font-medium text-foreground">T2 - Rebinding (12.5% - 0%)</div>
                <div className="text-xs text-muted-foreground">Busca cualquier servidor DHCP</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${leaseTime === 0 ? "bg-red-400" : "bg-muted-foreground"}`} />
              <div className="flex-1">
                <div className="text-sm font-medium text-foreground">Expirado (0%)</div>
                <div className="text-xs text-muted-foreground">Debe reiniciar proceso DORA</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
