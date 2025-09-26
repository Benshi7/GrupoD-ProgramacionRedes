"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Zap } from "lucide-react"

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

interface STPNetworkBuilderProps {
  switches: STPSwitch[]
  links: STPLink[]
  isConverging: boolean
  showBroadcastStorm: boolean
  stpEnabled: boolean
}

export function STPNetworkBuilder({
  switches,
  links,
  isConverging,
  showBroadcastStorm,
  stpEnabled,
}: STPNetworkBuilderProps) {
  const getSwitchColor = (sw: STPSwitch) => {
    if (sw.isRoot) return "border-primary bg-primary/10"
    if (isConverging) return "border-yellow-400 bg-yellow-400/10"
    return "border-border bg-card"
  }

  const getLinkColor = (link: STPLink) => {
    if (!link.enabled) return "stroke-muted-foreground opacity-30"
    if (link.isBlocked && stpEnabled) return "stroke-red-400"
    if (!stpEnabled) return "stroke-yellow-400"
    return "stroke-green-400"
  }

  const getLinkStyle = (link: STPLink) => {
    if (!link.enabled) return "4 4"
    if (link.isBlocked && stpEnabled) return "8 4"
    return "none"
  }

  return (
    <div className="relative w-full h-96 bg-muted/10 rounded-lg border border-border overflow-hidden">
      {/* Broadcast Storm Effect */}
      <AnimatePresence>
        {showBroadcastStorm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-red-400/20 z-10"
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1 }}
                className="text-red-400"
              >
                <Zap className="w-12 h-12" />
              </motion.div>
            </div>
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-red-500 text-white">Tormenta de Broadcast</Badge>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Links */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {links.map((link) => {
          const fromSwitch = switches.find((sw) => sw.id === link.from)
          const toSwitch = switches.find((sw) => sw.id === link.to)

          if (!fromSwitch || !toSwitch) return null

          return (
            <g key={link.id}>
              <line
                x1={fromSwitch.position.x}
                y1={fromSwitch.position.y}
                x2={toSwitch.position.x}
                y2={toSwitch.position.y}
                strokeWidth="3"
                className={getLinkColor(link)}
                strokeDasharray={getLinkStyle(link)}
              />
              {/* Link Cost Label */}
              <text
                x={(fromSwitch.position.x + toSwitch.position.x) / 2}
                y={(fromSwitch.position.y + toSwitch.position.y) / 2 - 10}
                className="fill-muted-foreground text-xs"
                textAnchor="middle"
              >
                {link.cost}
              </text>
              {/* Blocked Indicator */}
              {link.isBlocked && stpEnabled && (
                <text
                  x={(fromSwitch.position.x + toSwitch.position.x) / 2}
                  y={(fromSwitch.position.y + toSwitch.position.y) / 2 + 15}
                  className="fill-red-400 text-xs font-bold"
                  textAnchor="middle"
                >
                  BLOCKED
                </text>
              )}
            </g>
          )
        })}
      </svg>

      {/* Switches */}
      {switches.map((sw) => (
        <motion.div
          key={sw.id}
          className="absolute transform -translate-x-1/2 -translate-y-1/2"
          style={{ left: sw.position.x, top: sw.position.y }}
          animate={isConverging ? { scale: [1, 1.1, 1] } : {}}
          transition={{ repeat: isConverging ? Number.POSITIVE_INFINITY : 0, duration: 1 }}
        >
          <div className={`w-20 h-16 rounded-lg border-2 flex items-center justify-center ${getSwitchColor(sw)}`}>
            <div className="text-center">
              <div className="text-xs font-bold text-foreground">{sw.name}</div>
              <div className="text-xs text-muted-foreground">SW</div>
            </div>
          </div>

          {/* Switch Labels */}
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-center">
            <div className="text-xs text-muted-foreground">ID: {sw.bridgeId}</div>
            {sw.isRoot && <Badge className="bg-primary text-white text-xs mt-1">Root Bridge</Badge>}
          </div>

          {/* Priority Badge */}
          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
            <Badge variant="outline" className="text-xs bg-background">
              P: {sw.priority}
            </Badge>
          </div>
        </motion.div>
      ))}

      {/* Legend */}
      <div className="absolute top-4 left-4 space-y-2">
        <div className="flex items-center gap-2 text-xs">
          <div className="w-4 h-1 bg-green-400 rounded" />
          <span className="text-muted-foreground">Forwarding</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <div
            className="w-4 h-1 bg-red-400 rounded"
            style={{
              background:
                "repeating-linear-gradient(to right, #f87171 0, #f87171 4px, transparent 4px, transparent 8px)",
            }}
          />
          <span className="text-muted-foreground">Blocked</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <div
            className="w-4 h-1 bg-muted-foreground rounded opacity-30"
            style={{
              background:
                "repeating-linear-gradient(to right, #6b7280 0, #6b7280 2px, transparent 2px, transparent 4px)",
            }}
          />
          <span className="text-muted-foreground">Disabled</span>
        </div>
      </div>

      {/* Status Indicators */}
      <div className="absolute top-4 right-4 space-y-2">
        {!stpEnabled && (
          <div className="flex items-center gap-2 p-2 bg-red-400/20 border border-red-400/30 rounded-lg">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <span className="text-xs text-red-400 font-medium">STP Deshabilitado</span>
          </div>
        )}
        {isConverging && (
          <div className="flex items-center gap-2 p-2 bg-yellow-400/20 border border-yellow-400/30 rounded-lg">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1 }}
              className="w-4 h-4 border-2 border-yellow-400 border-t-transparent rounded-full"
            />
            <span className="text-xs text-yellow-400 font-medium">Convergiendo...</span>
          </div>
        )}
      </div>

      {/* Network Info */}
      <div className="absolute bottom-4 left-4 p-3 bg-card/80 border border-border rounded-lg backdrop-blur-sm">
        <div className="text-xs text-muted-foreground">Switches: {switches.length}</div>
        <div className="text-xs text-muted-foreground">Enlaces: {links.filter((l) => l.enabled).length}</div>
        <div className="text-xs text-muted-foreground">
          Bloqueados: {links.filter((l) => l.isBlocked && stpEnabled).length}
        </div>
      </div>
    </div>
  )
}
