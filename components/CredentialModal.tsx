'use client'

import { Eye, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

type Props = {
  buttonLabel: string
  closeLabel: string
  imageAlt: string
  modalTitle: string
  privacyNote: string
}

export function CredentialModal({
  buttonLabel,
  closeLabel,
  imageAlt,
  modalTitle,
  privacyNote,
}: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!isOpen) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeButtonRef.current?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }

      if (event.key === 'Tab') {
        event.preventDefault()
        closeButtonRef.current?.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
      triggerRef.current?.focus()
    }
  }, [isOpen])

  return (
    <>
      <button
        className="button button-secondary authority-credential-button"
        onClick={() => setIsOpen(true)}
        ref={triggerRef}
        type="button"
      >
        <Eye aria-hidden="true" size={18} />
        {buttonLabel}
      </button>

      {isOpen ? createPortal(
        <div
          className="credential-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setIsOpen(false)
          }}
        >
          <section
            aria-labelledby="credential-modal-title"
            aria-modal="true"
            className="credential-modal"
            role="dialog"
          >
            <header className="credential-modal-header">
              <h2 id="credential-modal-title">{modalTitle}</h2>
              <button
                aria-label={closeLabel}
                className="icon-button credential-modal-close"
                onClick={() => setIsOpen(false)}
                ref={closeButtonRef}
                title={closeLabel}
                type="button"
              >
                <X aria-hidden="true" size={22} />
              </button>
            </header>
            <figure className="credential-public-figure">
              <img
                alt={imageAlt}
                decoding="async"
                height="1357"
                loading="lazy"
                src="/assets/credentials/web3-credential-public.webp"
                width="1920"
              />
              <figcaption>{privacyNote}</figcaption>
            </figure>
          </section>
        </div>,
        document.body,
      ) : null}
    </>
  )
}
