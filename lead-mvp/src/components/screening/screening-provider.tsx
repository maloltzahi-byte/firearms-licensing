'use client'

import { createContext, useContext, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { ScreeningConfig } from '@/lib/screening-data'
import { computeScreeningResult, initialAnswers, type ScreeningAnswers } from '@/lib/screening'

type ScreeningContextValue = {
  answers: ScreeningAnswers
  setAnswers: React.Dispatch<React.SetStateAction<ScreeningAnswers>>
  reset: () => void
  config: ScreeningConfig
  result: ReturnType<typeof computeScreeningResult>
}

const ScreeningContext = createContext<ScreeningContextValue | null>(null)

export function ScreeningProvider({ config, children }: { config: ScreeningConfig; children: ReactNode }) {
  const [answers, setAnswers] = useState<ScreeningAnswers>(initialAnswers)
  const result = useMemo(() => computeScreeningResult(answers, config), [answers, config])
  const value = useMemo(
    () => ({ answers, setAnswers, reset: () => setAnswers(initialAnswers), config, result }),
    [answers, config, result],
  )

  return <ScreeningContext.Provider value={value}>{children}</ScreeningContext.Provider>
}

export function useScreening() {
  const value = useContext(ScreeningContext)
  if (!value) throw new Error('useScreening must be used inside ScreeningProvider')
  return value
}
