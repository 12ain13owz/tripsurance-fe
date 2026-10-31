'use client'

import { X } from 'lucide-react'
import { useEffect, useId, useRef } from 'react'
import { cn } from '@/shared/utils'
import type { ReactNode } from 'react'

const dialogSizeClass = {
  sm: 'modal-dialog-sm',
  md: 'modal-dialog-md',
  lg: 'modal-dialog-lg',
  xl: 'modal-dialog-xl',
} as const

interface ModalProps {
  open: boolean
  title: string
  onClose: () => void
  children: ReactNode
  /** Actions row; a submit button here links to its form with the `form` attribute */
  footer?: ReactNode
  size?: keyof typeof dialogSizeClass
}

// Native <dialog> + FlyonUI modal classes, driven by React state instead of HSOverlay JS:
// showModal() gives the backdrop, Esc and focus trap; children mount fresh on every open
export function Modal({ open, title, onClose, children, footer, size = 'md' }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const titleId = useId()

  useEffect(() => {
    if (open) {
      dialogRef.current?.showModal()
    }
  }, [open])

  if (!open) {
    return null
  }

  return (
    <dialog
      ref={dialogRef}
      className="modal modal-middle open backdrop:bg-neutral/50 pointer-events-auto max-h-none max-w-none bg-transparent opacity-100"
      aria-labelledby={titleId}
      onCancel={(event) => {
        // Esc: let the parent's state decide, so React and the DOM never disagree on "open"
        event.preventDefault()
        onClose()
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose()
        }
      }}
    >
      <div className={cn('modal-dialog', dialogSizeClass[size])}>
        <div className="modal-content">
          <div className="modal-header">
            <h3 id={titleId} className="modal-title">
              {title}
            </h3>
            <button
              type="button"
              className="btn btn-primary btn-square btn-sm"
              aria-label="Close"
              onClick={onClose}
            >
              <X className="size-4" />
            </button>
          </div>
          <div className="modal-body">
            <div className="pt-2">{children}</div>
          </div>
          {footer && <div className="modal-footer">{footer}</div>}
        </div>
      </div>
    </dialog>
  )
}
