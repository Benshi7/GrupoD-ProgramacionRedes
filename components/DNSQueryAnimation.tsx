'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, ArrowLeft } from 'lucide-react'

interface DNSQueryAnimationProps {
  domain: string
  isRecursive: boolean
  onComplete: () => void
}

const QUERY_STEPS = [
  {
    id: 'client-resolver',
    from: 'Cliente',
    to: 'Resolver',
    query: '¿Cuál es la IP de example.com?',
    response: null,
    delay: 500
  },
  {
    id: 'resolver-root',
    from: 'Resolver',
    to: 'Servidor Raíz',
    query: '¿Dónde está el servidor .com?',
    response: 'Consulta al servidor TLD .com',
    delay: 800
  },
  {
    id: 'resolver-tld',
    from: 'Resolver',
    to: 'Servidor TLD',
    query: '¿Dónde está example.com?',
    response: 'Consulta al servidor autoritativo',
    delay: 800
  },
  {
    id: 'resolver-auth',
    from: 'Resolver',
    to: 'Servidor Autoritativo',
    query: '¿Cuál es la IP de example.com?',
    response: '192.168.1.100 (TTL: 3600s)',
    delay: 800
  },
  {
    id: 'resolver-client',
    from: 'Resolver',
    to: 'Cliente',
    query: null,
    response: '192.168.1.100',
    delay: 500
  }
]

export function DNSQueryAnimation ({
  domain,
  isRecursive,
  onComplete
}: DNSQueryAnimationProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [showQuery, setShowQuery] = useState(false)
  const [showResponse, setShowResponse] = useState(false)

  useEffect(() => {
    if (currentStep >= QUERY_STEPS.length) {
      setTimeout(onComplete, 1000)
      return
    }

    console.log(isRecursive)

    const step = QUERY_STEPS[currentStep]

    // Show query
    if (step.query) {
      setShowQuery(true)
      setTimeout(() => {
        setShowQuery(false)
        if (step.response) {
          setTimeout(() => {
            setShowResponse(true)
            setTimeout(() => {
              setShowResponse(false)
              setCurrentStep(prev => prev + 1)
            }, step.delay)
          }, 200)
        } else {
          setCurrentStep(prev => prev + 1)
        }
      }, step.delay)
    } else if (step.response) {
      setShowResponse(true)
      setTimeout(() => {
        setShowResponse(false)
        setCurrentStep(prev => prev + 1)
      }, step.delay)
    }
  }, [currentStep, onComplete])

  const currentAnimation = QUERY_STEPS[currentStep]

  if (!currentAnimation) {
    return (
      <div className='text-center py-8'>
        <Badge className='bg-green-500 text-white'>Resolución completada</Badge>
        <p className='text-sm text-muted-foreground mt-2'>
          El dominio {domain} ha sido resuelto exitosamente
        </p>
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      {/* Animation Area */}
      <div className='flex items-center justify-between p-6 bg-muted/20 rounded-lg min-h-[120px]'>
        {/* From */}
        <div className='flex flex-col items-center space-y-2'>
          <div className='w-16 h-16 bg-card border-2 border-border rounded-lg flex items-center justify-center'>
            <div className='text-xs font-medium text-center text-foreground'>
              {currentAnimation.from}
            </div>
          </div>
        </div>

        {/* Animation */}
        <div className='flex-1 flex items-center justify-center relative'>
          <AnimatePresence>
            {showQuery && currentAnimation.query && (
              <motion.div
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 100, opacity: 0 }}
                transition={{ duration: 0.6 }}
                className='absolute'
              >
                <div className='flex items-center gap-2'>
                  <ArrowRight className='w-6 h-6 text-blue-400' />
                  <Badge className='bg-blue-500 text-white'>Query</Badge>
                </div>
              </motion.div>
            )}

            {showResponse && currentAnimation.response && (
              <motion.div
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -100, opacity: 0 }}
                transition={{ duration: 0.6 }}
                className='absolute'
              >
                <div className='flex items-center gap-2'>
                  <ArrowLeft className='w-6 h-6 text-green-400' />
                  <Badge className='bg-green-500 text-white'>Response</Badge>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* To */}
        <div className='flex flex-col items-center space-y-2'>
          <div className='w-16 h-16 bg-card border-2 border-border rounded-lg flex items-center justify-center'>
            <div className='text-xs font-medium text-center text-foreground'>
              {currentAnimation.to}
            </div>
          </div>
        </div>
      </div>

      {/* Message Display */}
      <AnimatePresence>
        {(showQuery || showResponse) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className='bg-card border-border'>
              <CardContent className='p-4'>
                <div className='text-center'>
                  {showQuery && currentAnimation.query && (
                    <div>
                      <Badge className='bg-blue-500 text-white mb-2'>
                        Consulta
                      </Badge>
                      <p className='text-sm text-foreground italic'>
                        "{currentAnimation.query}"
                      </p>
                    </div>
                  )}
                  {showResponse && currentAnimation.response && (
                    <div>
                      <Badge className='bg-green-500 text-white mb-2'>
                        Respuesta
                      </Badge>
                      <p className='text-sm text-foreground italic'>
                        "{currentAnimation.response}"
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress */}
      <div className='flex justify-center space-x-2'>
        {QUERY_STEPS.map((_, index) => (
          <div
            key={index}
            className={`w-3 h-3 rounded-full transition-colors ${
              index < currentStep
                ? 'bg-primary'
                : index === currentStep
                ? 'bg-primary animate-pulse'
                : 'bg-muted-foreground'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
