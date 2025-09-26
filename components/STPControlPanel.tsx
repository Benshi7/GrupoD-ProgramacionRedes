"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Settings, Link, Crown } from "lucide-react"

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

interface STPControlPanelProps {
  switches: STPSwitch[]
  links: STPLink[]
  onLinkToggle: (linkId: string) => void
  onCostChange: (linkId: string, newCost: number) => void
  onPriorityChange: (switchId: string, newPriority: number) => void
}

export function STPControlPanel({
  switches,
  links,
  onLinkToggle,
  onCostChange,
  onPriorityChange,
}: STPControlPanelProps) {
  const getSwitchByLink = (linkId: string, position: "from" | "to") => {
    const link = links.find((l) => l.id === linkId)
    if (!link) return null
    return switches.find((sw) => sw.id === link[position])
  }

  return (
    <div className="space-y-6">
      {/* Switch Priority Controls */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Crown className="w-4 h-4 text-primary" />
          <h3 className="font-medium text-foreground">Prioridades de Switch</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {switches.map((sw) => (
            <Card key={sw.id} className="bg-muted/20 border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-foreground flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${sw.isRoot ? "bg-primary" : "bg-muted-foreground"}`} />
                  {sw.name}
                  {sw.isRoot && <Badge className="bg-primary text-white text-xs">Root</Badge>}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Prioridad</span>
                    <span className="text-foreground font-mono">{sw.priority}</span>
                  </div>
                  <Slider
                    value={[sw.priority]}
                    onValueChange={([value]) => onPriorityChange(sw.id, value)}
                    min={0}
                    max={65535}
                    step={4096}
                    className="w-full"
                  />
                </div>

                <div className="text-xs text-muted-foreground">
                  <div>Bridge ID: {sw.bridgeId}</div>
                  <div>MAC: {sw.mac}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Link Controls */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Link className="w-4 h-4 text-accent" />
          <h3 className="font-medium text-foreground">Control de Enlaces</h3>
        </div>

        <div className="space-y-3">
          {links.map((link) => {
            const fromSwitch = getSwitchByLink(link.id, "from")
            const toSwitch = getSwitchByLink(link.id, "to")

            if (!fromSwitch || !toSwitch) return null

            return (
              <Card key={link.id} className="bg-muted/20 border-border">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground">
                        {fromSwitch.name} ↔ {toSwitch.name}
                      </span>
                      <Badge
                        variant="outline"
                        className={`text-xs ${
                          link.isBlocked
                            ? "text-red-400 border-red-400/30"
                            : link.enabled
                              ? "text-green-400 border-green-400/30"
                              : "text-muted-foreground border-muted-foreground/30"
                        }`}
                      >
                        {link.isBlocked ? "Blocked" : link.enabled ? "Active" : "Disabled"}
                      </Badge>
                    </div>

                    <Switch checked={link.enabled} onCheckedChange={() => onLinkToggle(link.id)} />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Costo del puerto</span>
                      <span className="text-foreground font-mono">{link.cost}</span>
                    </div>
                    <Slider
                      value={[link.cost]}
                      onValueChange={([value]) => onCostChange(link.id, value)}
                      min={1}
                      max={200}
                      step={1}
                      className="w-full"
                      disabled={!link.enabled}
                    />
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* STP Information */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-2">
            <Settings className="w-4 h-4 text-primary" />
            Información STP
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Root Bridge:</span>
              <span className="ml-2 text-foreground font-medium">
                {switches.find((sw) => sw.isRoot)?.name || "No definido"}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Enlaces activos:</span>
              <span className="ml-2 text-foreground font-medium">{links.filter((l) => l.enabled).length}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Enlaces bloqueados:</span>
              <span className="ml-2 text-foreground font-medium">{links.filter((l) => l.isBlocked).length}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Topología:</span>
              <span className="ml-2 text-foreground font-medium">
                {links.filter((l) => l.enabled && !l.isBlocked).length >= switches.length ? "Con bucles" : "Sin bucles"}
              </span>
            </div>
          </div>

          <div className="pt-3 border-t border-border">
            <h4 className="font-medium text-foreground mb-2">Conceptos clave:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Menor Bridge ID = Root Bridge</li>
              <li>• Costo más bajo = ruta preferida</li>
              <li>• Puertos redundantes se bloquean</li>
              <li>• Convergencia toma 30-50 segundos</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
