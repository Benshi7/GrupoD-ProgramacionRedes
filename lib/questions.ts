export type Choice = {
  id: string
  label: string
  correct?: boolean
  explain?: string
}

export type Question = {
  id: string
  module: "dns" | "dhcp" | "subnetting"
  prompt: string
  choices: Choice[]
  explanation: {
    tldr: string
    details: string[]
    sandboxLink?: string
  }
  difficulty: "easy" | "med" | "hard"
}

export const QUESTIONS: Question[] = [
  // DNS & ARP Questions (Combined Module)
  {
    id: "dns-1",
    module: "dns",
    prompt: "¿Qué función cumple el DNS en Internet?",
    choices: [
      { id: "a", label: "Asigna direcciones IP automáticamente" },
      { id: "b", label: "Traduce nombres de dominio en direcciones IP", correct: true },
      { id: "c", label: "Evita bucles en redes conmutadas" },
      { id: "d", label: "Cifra las comunicaciones web" },
    ],
    explanation: {
      tldr: "DNS es como la agenda telefónica de Internet: traduce nombres de dominio en direcciones IP.",
      details: [
        "Evita que los usuarios tengan que recordar direcciones IP numéricas.",
        "Es distribuido y jerárquico (servidores raíz, TLD, autoritativos, cachés).",
        "Ejemplo: al entrar a chat.openai.com, tu PC pregunta al DNS cuál es la IP de ese dominio y luego se conecta allí.",
      ],
      sandboxLink: "/sandbox/dns",
    },
    difficulty: "easy",
  },
  {
    id: "dns-2",
    module: "dns",
    prompt: "¿Qué tipos de servidores intervienen en la resolución de nombres DNS?",
    choices: [
      { id: "a", label: "Solo servidores locales" },
      { id: "b", label: "Servidores raíz, TLD, autoritativos y cachés", correct: true },
      { id: "c", label: "Únicamente servidores autoritativos" },
      { id: "d", label: "Solo servidores de caché" },
    ],
    explanation: {
      tldr: "La resolución DNS involucra una jerarquía de servidores especializados.",
      details: [
        "Servidores raíz: conocen los servidores TLD (.com, .org, etc.).",
        "Servidores TLD: conocen los servidores autoritativos de cada dominio.",
        "Servidores autoritativos: contienen los registros finales del dominio.",
        "Servidores de caché: almacenan respuestas temporalmente para acelerar consultas.",
      ],
      sandboxLink: "/sandbox/dns",
    },
    difficulty: "med",
  },
  {
    id: "arp-1",
    module: "dns",
    prompt: "¿Para qué sirve el protocolo ARP?",
    choices: [
      { id: "a", label: "Para asignar direcciones IP automáticamente" },
      { id: "b", label: "Para traducir direcciones IP en direcciones MAC", correct: true },
      { id: "c", label: "Para evitar bucles en redes de switches" },
      { id: "d", label: "Para calcular rutas entre redes" },
    ],
    explanation: {
      tldr: "ARP traduce direcciones IP en direcciones MAC dentro de una red local.",
      details: [
        "La IP identifica al dispositivo en la red.",
        "La MAC identifica al dispositivo físicamente en la LAN.",
        "Ejemplo: si tu PC quiere enviar un paquete a 192.168.1.5, pregunta por la red: '¿Quién tiene esta IP?'. El dispositivo responde con su MAC y la comunicación se establece.",
      ],
      sandboxLink: "/sandbox/dns",
    },
    difficulty: "easy",
  },
  {
    id: "arp-2",
    module: "dns",
    prompt: "¿Qué riesgo de seguridad tiene ARP?",
    choices: [
      { id: "a", label: "Consume demasiado ancho de banda" },
      { id: "b", label: "Ataques de ARP spoofing/poisoning", correct: true },
      { id: "c", label: "No tiene riesgos de seguridad" },
      { id: "d", label: "Solo funciona en redes pequeñas" },
    ],
    explanation: {
      tldr: "ARP es vulnerable a ataques de spoofing donde un atacante responde con una MAC falsa.",
      details: [
        "ARP spoofing/poisoning: un atacante responde con una MAC falsa para interceptar tráfico.",
        "Permite ataques man-in-the-middle al redirigir el tráfico.",
        "Prevención: ARP estático, detección de cambios en tabla ARP, segmentación de red.",
      ],
      sandboxLink: "/sandbox/dns",
    },
    difficulty: "med",
  },

  // DHCP & STP Questions (Combined Module)
  {
    id: "dhcp-1",
    module: "dhcp",
    prompt: "¿Cuál es la función principal de DHCP?",
    choices: [
      { id: "a", label: "Traduce nombres de dominio a direcciones IP" },
      { id: "b", label: "Asigna automáticamente direcciones IP y otros parámetros de red", correct: true },
      { id: "c", label: "Evita bucles en redes de switches" },
      { id: "d", label: "Calcula rutas óptimas entre routers" },
    ],
    explanation: {
      tldr: "DHCP automatiza la configuración de red asignando IP, máscara, gateway y DNS.",
      details: [
        "Sin DHCP: cada IP se asigna manualmente → engorroso y propenso a errores.",
        "Con DHCP: el servidor entrega automáticamente IP, máscara de subred, gateway y DNS.",
        "Beneficio: simplifica administración y evita conflictos de IP.",
      ],
      sandboxLink: "/sandbox/dhcp",
    },
    difficulty: "easy",
  },
  {
    id: "dhcp-2",
    module: "dhcp",
    prompt: "¿Cuál es el orden correcto del proceso DORA en DHCP?",
    choices: [
      { id: "a", label: "Offer → Discover → Ack → Request" },
      { id: "b", label: "Discover → Offer → Request → Ack", correct: true },
      { id: "c", label: "Request → Offer → Discover → Ack" },
      { id: "d", label: "Discover → Request → Offer → Ack" },
    ],
    explanation: {
      tldr: "Secuencia DORA: Discover, Offer, Request, Ack.",
      details: [
        "Discover: cliente busca servidores DHCP (broadcast).",
        "Offer: servidor propone IP, máscara, gateway, DNS.",
        "Request: cliente solicita la IP ofrecida.",
        "Ack: servidor confirma la asignación.",
      ],
      sandboxLink: "/sandbox/dhcp",
    },
    difficulty: "easy",
  },
  {
    id: "stp-1",
    module: "dhcp",
    prompt: "¿Qué problema resuelve STP en una red de switches?",
    choices: [
      { id: "a", label: "Asigna direcciones IP automáticamente" },
      { id: "b", label: "Evita bucles que generan tormentas de broadcast", correct: true },
      { id: "c", label: "Traduce nombres de dominio a IP" },
      { id: "d", label: "Calcula rutas óptimas entre routers" },
    ],
    explanation: {
      tldr: "STP evita bucles en redes con switches interconectados.",
      details: [
        "Problema: si hay enlaces redundantes entre switches, los bucles generan tormentas de broadcast.",
        "Solución: STP detecta enlaces redundantes y los bloquea automáticamente, manteniendo solo una ruta activa.",
        "Si la ruta principal falla, reconfigura la red y activa un enlace alternativo.",
        "Esencial en redes empresariales con switches interconectados.",
      ],
      sandboxLink: "/sandbox/dhcp",
    },
    difficulty: "easy",
  },
  {
    id: "stp-2",
    module: "dhcp",
    prompt: "¿Cómo evita STP los bucles?",
    choices: [
      { id: "a", label: "Eliminando físicamente los cables redundantes" },
      { id: "b", label: "Bloqueando automáticamente enlaces redundantes", correct: true },
      { id: "c", label: "Asignando diferentes VLANs a cada enlace" },
      { id: "d", label: "Limitando la velocidad de los puertos" },
    ],
    explanation: {
      tldr: "STP bloquea automáticamente puertos redundantes para mantener una topología libre de bucles.",
      details: [
        "Detecta enlaces redundantes mediante el intercambio de BPDUs.",
        "Calcula un árbol de expansión que conecta todos los switches sin bucles.",
        "Bloquea puertos específicos para eliminar rutas alternativas.",
        "Mantiene conectividad completa mientras previene bucles infinitos.",
      ],
      sandboxLink: "/sandbox/dhcp",
    },
    difficulty: "med",
  },

  // Subnetting Questions
  {
    id: "subnetting-1",
    module: "subnetting",
    prompt: "¿Cuántas subredes podés crear con una máscara /26 en una red /24?",
    choices: [
      { id: "a", label: "2 subredes" },
      { id: "b", label: "4 subredes", correct: true },
      { id: "c", label: "6 subredes" },
      { id: "d", label: "8 subredes" },
    ],
    explanation: {
      tldr: "Con /26 tomás 2 bits adicionales de host, creando 2² = 4 subredes.",
      details: [
        "Red original /24: 24 bits de red, 8 bits de host.",
        "Con /26: 26 bits de red, 6 bits de host.",
        "Bits adicionales para subredes: 26 - 24 = 2 bits.",
        "Número de subredes: 2² = 4 subredes posibles.",
      ],
      sandboxLink: "/sandbox/subnetting",
    },
    difficulty: "easy",
  },
  {
    id: "subnetting-2",
    module: "subnetting",
    prompt: "¿Cuántos hosts podés tener en una subred /27?",
    choices: [
      { id: "a", label: "30 hosts", correct: true },
      { id: "b", label: "32 hosts" },
      { id: "c", label: "62 hosts" },
      { id: "d", label: "64 hosts" },
    ],
    explanation: {
      tldr: "Con /27 tenés 5 bits de host: 2⁵ - 2 = 30 hosts utilizables.",
      details: [
        "Máscara /27 = 255.255.255.224 (27 bits de red, 5 bits de host).",
        "Total de direcciones: 2⁵ = 32 direcciones.",
        "Direcciones utilizables: 32 - 2 = 30 (restás red y broadcast).",
        "Primera IP: dirección de red, última IP: dirección de broadcast.",
      ],
      sandboxLink: "/sandbox/subnetting",
    },
    difficulty: "easy",
  },
  {
    id: "subnetting-3",
    module: "subnetting",
    prompt: "¿Qué representa la notación CIDR /28?",
    choices: [
      { id: "a", label: "28 bits de host" },
      { id: "b", label: "28 bits de red", correct: true },
      { id: "c", label: "28 subredes" },
      { id: "d", label: "28 hosts" },
    ],
    explanation: {
      tldr: "CIDR /28 significa 28 bits de red y 4 bits de host.",
      details: [
        "Notación CIDR indica cuántos bits están dedicados a la red.",
        "/28 = 255.255.255.240 (28 unos seguidos).",
        "Bits de host: 32 - 28 = 4 bits.",
        "Hosts por subred: 2⁴ - 2 = 14 hosts utilizables.",
      ],
      sandboxLink: "/sandbox/subnetting",
    },
    difficulty: "med",
  },
  {
    id: "ipv4-ipv6-1",
    module: "subnetting",
    prompt: "¿Cuál es la principal diferencia en el tamaño de direcciones entre IPv4 e IPv6?",
    choices: [
      { id: "a", label: "IPv4: 32 bits, IPv6: 128 bits", correct: true },
      { id: "b", label: "IPv4: 64 bits, IPv6: 32 bits" },
      { id: "c", label: "IPv4: 128 bits, IPv6: 256 bits" },
      { id: "d", label: "No hay diferencia en el tamaño" },
    ],
    explanation: {
      tldr: "IPv4 usa direcciones de 32 bits, IPv6 usa direcciones de 128 bits.",
      details: [
        "IPv4: 32 bits = ~4.3 mil millones de direcciones (2³²).",
        "IPv6: 128 bits = ~340 sextillones de direcciones (2¹²⁸).",
        "IPv4: formato decimal (192.168.1.1).",
        "IPv6: formato hexadecimal (2001:0db8:85a3::8a2e:0370:7334).",
      ],
      sandboxLink: "/sandbox/subnetting",
    },
    difficulty: "easy",
  },
  {
    id: "ipv4-ipv6-2",
    module: "subnetting",
    prompt: "¿Por qué se creó IPv6?",
    choices: [
      { id: "a", label: "Para mejorar la velocidad de Internet" },
      { id: "b", label: "Para solucionar el agotamiento de direcciones IPv4", correct: true },
      { id: "c", label: "Para reducir el costo de los routers" },
      { id: "d", label: "Para eliminar la necesidad de DNS" },
    ],
    explanation: {
      tldr: "IPv6 se creó principalmente para solucionar el agotamiento de direcciones IPv4.",
      details: [
        "IPv4 tiene solo ~4.3 mil millones de direcciones, insuficientes para todos los dispositivos actuales.",
        "IPv6 proporciona un espacio de direcciones prácticamente ilimitado.",
        "Beneficios adicionales: mejor seguridad, autoconfiguración, eliminación de NAT.",
        "Transición gradual: ambos protocolos coexisten actualmente (dual stack).",
      ],
      sandboxLink: "/sandbox/subnetting",
    },
    difficulty: "easy",
  },
  {
    id: "ipv4-ipv6-3",
    module: "subnetting",
    prompt: "¿Qué ventaja adicional ofrece IPv6 además del mayor espacio de direcciones?",
    choices: [
      { id: "a", label: "Menor consumo de energía" },
      { id: "b", label: "Seguridad mejorada y autoconfiguración", correct: true },
      { id: "c", label: "Compatibilidad con redes más lentas" },
      { id: "d", label: "Menor costo de implementación" },
    ],
    explanation: {
      tldr: "IPv6 incluye seguridad IPSec nativa y capacidades de autoconfiguración.",
      details: [
        "IPSec integrado: autenticación y cifrado nativos en el protocolo.",
        "Autoconfiguración: dispositivos pueden configurarse automáticamente sin DHCP.",
        "Eliminación de NAT: comunicación directa end-to-end.",
        "Mejor calidad de servicio (QoS) y soporte para aplicaciones en tiempo real.",
      ],
      sandboxLink: "/sandbox/subnetting",
    },
    difficulty: "med",
  },
]

export const getQuestionsByModule = (moduleId: string): Question[] => {
  return QUESTIONS.filter((q) => q.module === moduleId)
}

export const getQuestionById = (questionId: string): Question | undefined => {
  return QUESTIONS.find((q) => q.id === questionId)
}
