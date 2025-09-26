'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowDown, Server, Globe, Building, FileText } from 'lucide-react'

interface DNSHierarchyProps {
  domain: string
  isResolving: boolean
  isRecursive: boolean
  resolvedData: any
  currentStep?: number // loading secuencial
}

export function DNSHierarchy ({
  domain,
  isResolving,
  isRecursive,
  resolvedData,
  currentStep = 0
}: DNSHierarchyProps) {
  const getDomainParts = (domain: string) => {
    const parts = domain.split('.')
    return {
      subdomain: parts.length > 2 ? parts[0] : null,
      domain: parts.length > 2 ? parts[1] : parts[0],
      tld: parts[parts.length - 1]
    }
  }

  const domainParts = getDomainParts(domain)

  const servers = [
    {
      id: 'client',
      name: 'Cliente',
      description: 'Aplicación que necesita resolver el dominio',
      icon: Globe,
      color: 'bg-blue-500',
      level: 0
    },
    {
      id: 'resolver',
      name: 'Resolver Recursivo',
      description: 'Servidor DNS local (ISP o público)',
      icon: Server,
      color: 'bg-green-500',
      level: 1
    },
    {
      id: 'root',
      name: 'Servidor Raíz',
      description: 'Conoce los servidores TLD',
      icon: Building,
      color: 'bg-yellow-500',
      level: 2
    },
    {
      id: 'tld',
      name: `Servidor TLD (.${domainParts.tld})`,
      description: 'Conoce los servidores autoritativos del dominio',
      icon: FileText,
      color: 'bg-orange-500',
      level: 3
    },
    {
      id: 'authoritative',
      name: `Servidor Autoritativo`,
      description: `Tiene los registros de ${domainParts.domain}.${domainParts.tld}`,
      icon: Server,
      color: 'bg-purple-500',
      level: 4
    }
  ]

  const getServerStatus = (serverId: string, serverLevel: number) => {
    if (!isResolving && !resolvedData) return 'idle'
    if (isResolving) {
      if (currentStep > serverLevel) return 'complete'
      if (currentStep === serverLevel) return 'active'
      return 'idle'
    }
    if (resolvedData) return 'complete'
    return 'idle'
  }

  return (
    <div className='space-y-6'>
      {/* Hierarchy Visualization */}
      <div className='space-y-4'>
        {servers.map((server, index) => {
          const status = getServerStatus(server.id, server.level)
          const Icon = server.icon

          return (
            <motion.div
              key={server.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                delay: isResolving
                  ? currentStep >= server.level
                    ? 0
                    : 0.5
                  : index * 0.1
              }}
            >
              <Card
                className={`border-border transition-all duration-300 ${
                  status === 'active'
                    ? 'glow-accent border-primary/50'
                    : 'bg-card'
                }`}
              >
                <CardContent className='p-4'>
                  <div className='flex items-center gap-4'>
                    {/* Server Icon */}
                    <div
                      className={`w-12 h-12 ${server.color} rounded-lg flex items-center justify-center`}
                    >
                      <Icon className='w-6 h-6 text-white' />
                    </div>

                    {/* Server Info */}
                    <div className='flex-1'>
                      <div className='flex items-center gap-2 mb-1'>
                        <h3 className='font-medium text-foreground'>
                          {server.name}
                        </h3>
                        {status === 'active' && (
                          <Badge
                            variant='secondary'
                            className='bg-primary/20 text-primary animate-pulse'
                          >
                            Consultando...
                          </Badge>
                        )}
                        {status === 'complete' && (
                          <Badge
                            variant='secondary'
                            className='bg-green-400/20 text-green-400'
                          >
                            Completado
                          </Badge>
                        )}
                      </div>
                      <p className='text-sm text-muted-foreground'>
                        {server.description}
                      </p>
                    </div>

                    {/* Level Indicator */}
                    <div className='text-right'>
                      <div className='text-xs text-muted-foreground'>
                        Nivel {server.level}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Arrow */}
              {index < servers.length - 1 && (
                <div className='flex justify-center py-2'>
                  <motion.div
                    animate={status === 'active' ? { y: [0, 5, 0] } : {}}
                    transition={{
                      repeat: Number.POSITIVE_INFINITY,
                      duration: 1
                    }}
                  >
                    <ArrowDown className='w-5 h-5 text-primary' />
                  </motion.div>
                </div>
              )}
            </motion.div>
          )
        })}
      </div>

      {/* Domain Breakdown */}
      <Card className='bg-muted/20 border-border'>
        <CardContent className='p-4'>
          <h4 className='font-medium text-foreground mb-3'>
            Análisis del dominio: {domain}
          </h4>
          <div className='flex items-center gap-2 flex-wrap'>
            {domainParts.subdomain && (
              <>
                <Badge
                  variant='outline'
                  className='bg-blue-500/20 text-blue-400 border-blue-400/30'
                >
                  {domainParts.subdomain} (subdominio)
                </Badge>
                <span className='text-muted-foreground'>.</span>
              </>
            )}
            <Badge
              variant='outline'
              className='bg-green-500/20 text-green-400 border-green-400/30'
            >
              {domainParts.domain} (dominio)
            </Badge>
            <span className='text-muted-foreground'>.</span>
            <Badge
              variant='outline'
              className='bg-orange-500/20 text-orange-400 border-orange-400/30'
            >
              {domainParts.tld} (TLD)
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Resolution Mode Info */}
      <Card className='bg-card border-border'>
        <CardContent className='p-4'>
          <h4 className='font-medium text-foreground mb-2'>
            Modo: {isRecursive ? 'Recursivo' : 'Iterativo'}
          </h4>
          <p className='text-sm text-muted-foreground'>
            {isRecursive
              ? 'El resolver hace todas las consultas por el cliente y devuelve la respuesta final.'
              : 'El cliente recibe referencias y debe consultar cada servidor por sí mismo.'}
          </p>
        </CardContent>
      </Card>
    </div>
  )
  
}
