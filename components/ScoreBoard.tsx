'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Trophy, Target, Clock } from 'lucide-react'
import { useQuizStore } from '@/store/useQuizStore'
import { useEffect, useState } from 'react'

export function ScoreBoard () {
  const { getTotalScore, getTotalProgress, getTotalTimeSpent } = useQuizStore()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const totalScore = isClient ? getTotalScore() : 0
  const totalProgress = isClient ? getTotalProgress() : 0
  const timeSpent = isClient ? getTotalTimeSpent() : 0

  return (
    <Card className='bg-card/50 border-border'>
      <CardContent className='p-3 sm:p-4'>
        <div className='flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 lg:gap-6 text-xs sm:text-sm'>
          <div className='flex items-center gap-1.5 sm:gap-2'>
            <Trophy className='w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary flex-shrink-0' />
            <span className='text-muted-foreground whitespace-nowrap'>
              Puntuación:
            </span>
            <span className='font-medium text-foreground'>{totalScore}%</span>
          </div>

          <div className='flex items-center gap-1.5 sm:gap-2'>
            <Target className='w-3.5 h-3.5 sm:w-4 sm:h-4 text-accent flex-shrink-0' />
            <span className='text-muted-foreground whitespace-nowrap'>
              Progreso:
            </span>
            <span className='font-medium text-foreground'>
              {totalProgress}%
            </span>
          </div>

          <div className='flex items-center gap-1.5 sm:gap-2'>
            <Clock className='w-3.5 h-3.5 sm:w-4 sm:h-4 text-secondary-foreground flex-shrink-0' />
            <span className='text-muted-foreground whitespace-nowrap'>
              Tiempo:
            </span>
            <span className='font-medium text-foreground'>{timeSpent}min</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
