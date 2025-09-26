export type ModuleId = "dns" | "dhcp" | "subnetting"

export type Module = {
  id: ModuleId
  title: string
  description: string
  difficulty: "easy" | "med" | "hard"
  icon: string
  color: string
  topics: string[]
  estimatedTime: string
}

export const modules: Module[] = [
  {
    id: "dns",
    title: "DNS & ARP (Resolución de Direcciones)",
    description: "Aprende cómo funciona la resolución de nombres de dominio y direcciones MAC en redes locales.",
    difficulty: "easy",
    icon: "🌐",
    color: "from-blue-500 to-cyan-500",
    topics: [
      "Resolución recursiva",
      "Servidores autoritativos",
      "TTL y caché",
      "Jerarquía DNS",
      "Resolución IP→MAC",
      "Broadcast ARP",
      "Tabla ARP",
    ],
    estimatedTime: "20 min",
  },
  {
    id: "dhcp",
    title: "DHCP & STP (Configuración y Topología)",
    description: "Domina el proceso DORA, asignación automática de red y prevención de bucles en switches.",
    difficulty: "med",
    icon: "⚡",
    color: "from-green-500 to-emerald-500",
    topics: [
      "Proceso DORA",
      "Lease y renovación",
      "Configuración automática",
      "Prevención de bucles",
      "Root bridge",
      "Estados de puerto",
      "Convergencia STP",
    ],
    estimatedTime: "25 min",
  },
  {
    id: "subnetting",
    title: "Subnetting y VLSM",
    description: "Aprende a dividir redes, calcular subredes y optimizar el direccionamiento IP.",
    difficulty: "med",
    icon: "🔢",
    color: "from-indigo-500 to-purple-500",
    topics: ["División de redes", "CIDR", "VLSM", "Cálculo de subredes"],
    estimatedTime: "20 min",
  },
]

export const getDifficultyColor = (difficulty: Module["difficulty"]) => {
  switch (difficulty) {
    case "easy":
      return "text-green-400"
    case "med":
      return "text-yellow-400"
    case "hard":
      return "text-red-400"
    default:
      return "text-muted-foreground"
  }
}

export const getDifficultyLabel = (difficulty: Module["difficulty"]) => {
  switch (difficulty) {
    case "easy":
      return "Fácil"
    case "med":
      return "Medio"
    case "hard":
      return "Difícil"
    default:
      return "Desconocido"
  }
}
