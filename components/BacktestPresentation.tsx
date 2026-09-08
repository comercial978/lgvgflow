'use client'

import { ChevronLeft, ChevronRight, Expand, X } from 'lucide-react'
import { useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

export type BacktestPresentationItem = {
  src: string
  width: number
  height: number
  title: string
  date: string
  alt: string
}

type PresentationLabels = {
  close: string
  previous: string
  next: string
  of: string
}

type OpenPresentationDetail = {
  galleryId: string
  index: number
  trigger: HTMLButtonElement | null
}

type BacktestImageButtonProps = {
  asset: Pick<BacktestPresentationItem, 'src' | 'width' | 'height'>
  galleryId: string
  index: number
  item: Pick<BacktestPresentationItem, 'title' | 'alt'>
  openLabel: string
}

type BacktestPresentationProps = {
  galleryId: string
  items: readonly BacktestPresentationItem[]
  labels: PresentationLabels
}

const openPresentationEvent = 'lgvg:open-backtest-presentation'

export function BacktestImageButton({
  asset,
  galleryId,
  index,
  item,
  openLabel,
}: BacktestImageButtonProps) {
  const triggerRef = useRef<HTMLButtonElement>(null)

  return (
    <button
      aria-label={`${openLabel}: ${item.title}`}
      className="backtest-shot-trigger"
      onClick={() => {
        window.dispatchEvent(new CustomEvent<OpenPresentationDetail>(openPresentationEvent, {
          detail: { galleryId, index, trigger: triggerRef.current },
        }))
      }}
      ref={triggerRef}
      type="button"
    >
      <img
        src={asset.src}
        alt={item.alt}
        width={asset.width}
        height={asset.height}
        loading="lazy"
        decoding="async"
      />
      <span>{openLabel}<Expand aria-hidden="true" size={15} /></span>
    </button>
  )
}

export function BacktestPresentation({ galleryId, items, labels }: BacktestPresentationProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const dialogRef = useRef<HTMLElement>(null)
  const triggerRef = useRef<HTMLButtonElement | null>(null)
  const titleId = useId()
  const isOpen = activeIndex !== null

  useEffect(() => {
    const handleOpen = (event: Event) => {
      const detail = (event as CustomEvent<OpenPresentationDetail>).detail
      if (!detail || detail.galleryId !== galleryId) return

      triggerRef.current = detail.trigger
      setActiveIndex(detail.index)
    }

    window.addEventListener(openPresentationEvent, handleOpen)
    return () => window.removeEventListener(openPresentationEvent, handleOpen)
  }, [galleryId])

  useEffect(() => {
    if (!isOpen) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeButtonRef.current?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveIndex(null)
        return
      }

      if (event.key === 'ArrowLeft' && items.length > 1) {
        setActiveIndex((current) => current === null ? null : (current - 1 + items.length) % items.length)
        return
      }

      if (event.key === 'ArrowRight' && items.length > 1) {
        setActiveIndex((current) => current === null ? null : (current + 1) % items.length)
        return
      }

      if (event.key === 'Tab' && dialogRef.current) {
        const controls = Array.from(dialogRef.current.querySelectorAll<HTMLButtonElement>('button:not(:disabled)'))
        if (controls.length === 0) return

        const first = controls[0]
        const last = controls[controls.length - 1]
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault()
          last.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first.focus()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
      triggerRef.current?.focus()
    }
  }, [isOpen, items.length])

  if (activeIndex === null || !items[activeIndex]) return null

  const item = items[activeIndex]
  const previousIndex = (activeIndex - 1 + items.length) % items.length
  const nextIndex = (activeIndex + 1) % items.length

  return createPortal(
    <div
      className="backtest-presentation-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) setActiveIndex(null)
      }}
    >
      <section
        aria-labelledby={titleId}
        aria-modal="true"
        className="backtest-presentation"
        ref={dialogRef}
        role="dialog"
      >
        <header className="backtest-presentation-header">
          <div>
            <span>{activeIndex + 1} {labels.of} {items.length}</span>
            <h2 id={titleId}>{item.title}</h2>
            <p>{item.date}</p>
          </div>
          <button
            aria-label={labels.close}
            className="backtest-presentation-close"
            onClick={() => setActiveIndex(null)}
            ref={closeButtonRef}
            title={labels.close}
            type="button"
          >
            <X aria-hidden="true" size={24} />
          </button>
        </header>

        <div className="backtest-presentation-stage">
          <img
            alt={item.alt}
            decoding="async"
            height={item.height}
            src={item.src}
            width={item.width}
          />
        </div>

        {items.length > 1 ? (
          <footer className="backtest-presentation-controls">
            <button onClick={() => setActiveIndex(previousIndex)} type="button">
              <ChevronLeft aria-hidden="true" size={19} />{labels.previous}
            </button>
            <span>{activeIndex + 1} / {items.length}</span>
            <button onClick={() => setActiveIndex(nextIndex)} type="button">
              {labels.next}<ChevronRight aria-hidden="true" size={19} />
            </button>
          </footer>
        ) : null}
      </section>
    </div>,
    document.body,
  )
}
