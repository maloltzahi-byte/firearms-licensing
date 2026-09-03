'use client'

import { useState } from 'react'

type Faq = readonly [question: string, answer: string]

export function HomeFaq({ items }: { items: readonly Faq[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return <div className="rc-faq-list">
    {items.map(([question, answer], index) => {
      const open = openIndex === index
      return <details className="rc-faq-item" key={question} open={open}>
        <summary onClick={(event) => {
          event.preventDefault()
          setOpenIndex(open ? null : index)
        }}>
          <span>{question}</span><b className="rc-faq-symbol" aria-hidden="true">{open ? '−' : '+'}</b>
        </summary>
        <div className="rc-faq-answer">{answer}</div>
      </details>
    })}
  </div>
}
