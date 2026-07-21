'use client'

import { useEffect } from 'react'

export function FadeObserver() {
  useEffect(() => {
    document.documentElement.classList.add('fade-ready')
    const elements = document.querySelectorAll<HTMLElement>('.fade-up')
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')
          observer.unobserve(entry.target)
        }
      }
    }, { threshold: 0.1 })

    elements.forEach((element) => observer.observe(element))
    return () => {
      observer.disconnect()
      document.documentElement.classList.remove('fade-ready')
    }
  }, [])

  return null
}
