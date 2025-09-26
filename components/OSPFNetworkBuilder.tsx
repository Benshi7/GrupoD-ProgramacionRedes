"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Edit3 } from "lucide-react"
import { RouterIcon } from "lucide-react"

interface Router {
  id: string
  name: string
  x: number
  y: number
  isSelected: boolean
}

interface Link {
  id: string
  from: string
  to: string
  cost: number
  isHighlighted: boolean
}

interface OSPFNetworkBuilderProps {
  routers: Router[]
  links: Link[]
  onRouterSelect: (routerId: string) => void
  onLinkCostChange: (linkId: string, newCost: number) => void
}

export function OSPFNetworkBuilder({ routers, links, onRouterSelect, onLinkCostChange }: OSPFNetworkBuilderProps) {
  const [editingLink, setEditingLink] = useState<string | null>(null)
  const [tempCost, setTempCost] = useState<string>("")

  const handleLinkEdit = (linkId: string, currentCost: number) => {
    setEditingLink(linkId)
    setTempCost(currentCost.toString())
  }

  const handleCostSave = (linkId: string) => {
    const newCost = Number.parseInt(tempCost)
    if (!isNaN(newCost) && newCost > 0) {
      onLinkCostChange(linkId, newCost)
    }
    setEditingLink(null)
    setTempCost("")
  }

  return (
    <div className="relative">
      {/* Network Canvas */}
      <div className="relative w-full h-96 bg-card/50 border border-primary/20 rounded-lg overflow-hidden">
        {/* Grid Background */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(to right, hsl(var(--primary)) 1px, transparent 1px),
              linear-gradient(to bottom, hsl(var(--primary)) 1px, transparent 1px)
            `,
            backgroundSize: "20px 20px",
          }}
        />

        {/* Links */}
        <svg className="absolute inset-0 w-full h-full">
          {links.map((link) => {
            const fromRouter = routers.find((r) => r.id === link.from)
            const toRouter = routers.find((r) => r.id === link.to)

            if (!fromRouter || !toRouter) return null

            const midX = (fromRouter.x + toRouter.x) / 2
            const midY = (fromRouter.y + toRouter.y) / 2

            return (
              <g key={link.id}>
                {/* Link Line */}
                <line
                  x1={fromRouter.x}
                  y1={fromRouter.y}
                  x2={toRouter.x}
                  y2={toRouter.y}
                  stroke={link.isHighlighted ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))"}
                  strokeWidth={link.isHighlighted ? 3 : 2}
                  strokeDasharray={link.isHighlighted ? "0" : "5,5"}
                  className="transition-all duration-300"
                />

                {/* Cost Label */}
                <foreignObject x={midX - 20} y={midY - 15} width="40" height="30">
                  <div className="flex items-center justify-center">
                    {editingLink === link.id ? (
                      <Input
                        value={tempCost}
                        onChange={(e) => setTempCost(e.target.value)}
                        onBlur={() => handleCostSave(link.id)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleCostSave(link.id)
                          if (e.key === "Escape") setEditingLink(null)
                        }}
                        className="w-12 h-6 text-xs text-center"
                        autoFocus
                      />
                    ) : (
                      <Badge
                        variant={link.isHighlighted ? "default" : "secondary"}
                        className="text-xs cursor-pointer hover:bg-primary/20"
                        onClick={() => handleLinkEdit(link.id, link.cost)}
                      >
                        {link.cost}
                        <Edit3 className="h-3 w-3 ml-1" />
                      </Badge>
                    )}
                  </div>
                </foreignObject>
              </g>
            )
          })}
        </svg>

        {/* Routers */}
        {routers.map((router) => (
          <div
            key={router.id}
            className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 ${
              router.isSelected ? "scale-110" : "hover:scale-105"
            }`}
            style={{ left: router.x, top: router.y }}
            onClick={() => onRouterSelect(router.id)}
          >
            <div
              className={`flex flex-col items-center space-y-1 p-2 rounded-lg border-2 transition-colors ${
                router.isSelected ? "bg-primary/20 border-primary" : "bg-card border-primary/40 hover:border-primary/60"
              }`}
            >
              <RouterIcon className={`h-6 w-6 ${router.isSelected ? "text-primary" : "text-muted-foreground"}`} />
              <span className={`text-xs font-medium ${router.isSelected ? "text-primary" : "text-muted-foreground"}`}>
                {router.id}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="w-4 h-0.5 bg-primary"></div>
          <span>Ruta Más Corta</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-0.5 bg-muted-foreground" style={{ strokeDasharray: "2,2" }}></div>
          <span>Enlaces Disponibles</span>
        </div>
        <div className="flex items-center gap-2">
          <RouterIcon className="h-4 w-4 text-primary" />
          <span>Router Seleccionado</span>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">
            10
          </Badge>
          <span>Costo del Enlace (click para editar)</span>
        </div>
      </div>
    </div>
  )
}
