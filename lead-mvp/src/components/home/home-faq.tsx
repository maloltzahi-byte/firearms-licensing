'use client'

import { useState } from 'react'

type Faq = readonly [question: string, answer: string]

export function HomeFaq({ items }: { items: readonly Faq[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return <div className="faq-stack-final">
    {items.map(([question, answer], index) => {
      const open = openIndex === index
      return <details className="faq-item-final" key={question} open={open}>
        <summary onClick={(event) => {
          event.preventDefault()
          setOpenIndex(open ? null : index)
        }}>
          <img className="faq-chev" src="/figma/chevron-down-14.svg" width={14} height={14} alt="" aria-hidden="true" />
          <span>{question}</span>
        </summary>
        <div className="faq-answer-final">{answer}</div>
      </details>
    })}
  </div>
}
