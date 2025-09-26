import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ExternalLink, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const sources = [
  {
    protocol: "DNS",
    title: "Cloudflare Learning - ¿Qué es DNS?",
    url: "https://www.cloudflare.com/es-es/learning/dns/what-is-dns/",
    description: "Explicación completa del sistema de nombres de dominio y su funcionamiento.",
  },
  {
    protocol: "DHCP",
    title: "IBM Docs - Conceptos de DHCP",
    url: "https://www.ibm.com/docs/es/aix/7.2?topic=protocol-dynamic-host-configuration-dhcp-concepts",
    description: "Documentación técnica sobre el protocolo de configuración dinámica de hosts.",
  },
  {
    protocol: "ARP",
    title: "Kinsta - ¿Qué es ARP?",
    url: "https://kinsta.com/es/base-de-conocimiento/que-es-arp/",
    description: "Guía detallada sobre el protocolo de resolución de direcciones.",
  },
  {
    protocol: "STP",
    title: "Cisco - Protocolo de árbol de expansión (STP)",
    url: "https://www.cisco.com/c/es_mx/support/docs/lan-switching/spanning-tree-protocol/5234-5.html",
    description: "Documentación oficial de Cisco sobre STP y prevención de bucles.",
  },
  {
    protocol: "OSPF",
    title: "IBM - Open Shortest Path First (OSPF)",
    url: "https://www.ibm.com/docs/es/aix/7.2?topic=protocols-open-shortest-path-first-ospf",
    description: "Explicación del protocolo de enrutamiento de estado de enlace OSPF.",
  },
]

export default function FuentesPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver al inicio
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-primary">Fuentes y Referencias</h1>
              <p className="text-muted-foreground mt-1">
                Documentación y recursos utilizados para crear este contenido educativo
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card className="mb-8 bg-card/50 border-primary/20">
          <CardHeader>
            <CardTitle className="text-xl text-primary">Información Académica</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-foreground">Institución</h3>
                  <p className="text-muted-foreground">IFTS 18</p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Materia</h3>
                  <p className="text-muted-foreground">Programación de Redes</p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Período</h3>
                  <p className="text-muted-foreground">2do Cuatrimestre 2025</p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Profesor</h3>
                  <p className="text-muted-foreground">RUSSATTI, Lucas</p>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-foreground">Integrantes del Grupo</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex flex-col">
                    <span className="font-medium">CELIA, Bruno</span>
                    <span className="text-muted-foreground font-mono">brunocelia98@gmail.com</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium">DE LUCA, Leila Giselle</span>
                    <span className="text-muted-foreground font-mono">leila.giselle.de.luca@gmail.com</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium">DE SOUZA GOMES, Anna Clara</span>
                    <span className="text-muted-foreground font-mono">annaclarag06@gmail.com</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium">MARTINI, Fernando Pablo</span>
                    <span className="text-muted-foreground font-mono">fer.martini878@gmail.com</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mb-8">
          <p className="text-muted-foreground">
            Todo el contenido educativo de Grupo D - IFTS 18 está basado en fuentes oficiales y documentación técnica
            reconocida. A continuación se listan las principales referencias utilizadas:
          </p>
        </div>

        <div className="grid gap-6">
          {sources.map((source, index) => (
            <Card key={index} className="bg-card border-border hover:glow-accent transition-all duration-300">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg text-foreground">{source.title}</CardTitle>
                    <CardDescription className="text-primary font-medium">Protocolo: {source.protocol}</CardDescription>
                  </div>
                  <ExternalLink className="w-5 h-5 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{source.description}</p>
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:text-primary transition-colors text-sm font-mono break-all"
                >
                  {source.url}
                </a>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 p-6 bg-card/50 rounded-lg border border-border">
          <h2 className="text-xl font-semibold text-foreground mb-4">Nota Académica</h2>
          <p className="text-muted-foreground leading-relaxed">
            Este material educativo ha sido desarrollado con fines pedagógicos como parte del trabajo práctico de la
            materia Programación de Redes del IFTS 18. Está basado en estándares de la industria y documentación
            oficial. Se recomienda consultar las fuentes originales para obtener información más detallada y actualizada
            sobre cada protocolo.
          </p>
        </div>
      </main>
    </div>
  )
}
