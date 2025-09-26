"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Play, RotateCcw, Zap, Target, MapPin } from "lucide-react"

interface Router {
  id: string
  name: string
  x: number
  y: number
  isSelected: boolean
}

interface OSPFControlPanelProps {
  routers: Router[]
  sourceRouter: string
  targetRouter: string
  onSourceChange: (routerId: string) => void
  onTargetChange: (routerId: string) => void
  onCalculate: () => void
  onReset: () => void
  isCalculating: boolean
  shortestPath: string[]
  totalCost: number
}

export function OSPFControlPanel({
  routers,
  sourceRouter,
  targetRouter,
  onSourceChange,
  onTargetChange,
  onCalculate,
  onReset,
  isCalculating,
  shortestPath,
  totalCost,
}: OSPFControlPanelProps) {
  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-primary" />
          Control de Cálculo SPF
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Router Selection */}
        <div className="space-y-3">
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <MapPin className="h-4 w-4 text-green-400" />
              Router Origen
            </label>
            <Select value={sourceRouter} onValueChange={onSourceChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {routers.map((router) => (
                  <SelectItem key={router.id} value={router.id}>
                    {router.id} - {router.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Target className="h-4 w-4 text-red-400" />
              Router Destino
            </label>
            <Select value={targetRouter} onValueChange={onTargetChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {routers.map((router) => (
                  <SelectItem key={router.id} value={router.id}>
                    {router.id} - {router.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Separator />

        {/* Action Buttons */}
        <div className="space-y-2">
          <Button onClick={onCalculate} disabled={isCalculating || sourceRouter === targetRouter} className="w-full">
            {isCalculating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
                Calculando SPF...
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Calcular Ruta Más Corta
              </>
            )}
          </Button>

          <Button onClick={onReset} variant="outline" className="w-full bg-transparent" disabled={isCalculating}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Reiniciar Red
          </Button>
        </div>

        {/* Results */}
        {shortestPath.length > 0 && (
          <>
            <Separator />
            <div className="space-y-3">
              <h4 className="font-semibold text-sm">Resultado del Cálculo:</h4>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Saltos:</span>
                  <Badge variant="secondary">{shortestPath.length - 1}</Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Costo Total:</span>
                  <Badge variant="default">{totalCost}</Badge>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-sm font-medium">Secuencia de Routers:</span>
                <div className="flex flex-wrap gap-1">
                  {shortestPath.map((router, index) => (
                    <div key={router} className="flex items-center">
                      <Badge
                        variant={
                          index === 0 ? "default" : index === shortestPath.length - 1 ? "destructive" : "secondary"
                        }
                        className="text-xs"
                      >
                        {router}
                      </Badge>
                      {index < shortestPath.length - 1 && <span className="mx-1 text-muted-foreground text-xs">→</span>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {/* Algorithm Info */}
        <Separator />
        <div className="space-y-2">
          <h4 className="font-semibold text-sm">Información del Algoritmo:</h4>
          <div className="text-xs text-muted-foreground space-y-1">
            <p>• Complejidad: O((V + E) log V)</p>
            <p>• V = Número de routers</p>
            <p>• E = Número de enlaces</p>
            <p>• Garantiza la ruta óptima</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
