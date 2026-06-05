import { useEffect, useRef, useState } from 'react';
import { cn } from '../../../utils/cn';

/**
 * Modal
 * 
 * Props:
 * - isOpen: bool
 * - onClose: fn
 * - children: ReactNode
 * - size: 'sm' | 'md' | 'lg' | 'xl'  (default: 'md')
 * - mobileSheet: bool  (default: true) — slides up from bottom on mobile
 * - closeOnOverlay: bool  (default: true)
 */

const sizeMap = {
  sm: 'md:max-w-sm',
  md: 'md:max-w-lg',
  lg: 'md:max-w-2xl',
  xl: 'md:max-w-4xl',
}

function BaseModal({
  isOpen,
  onClose,
  children,
  size = 'md',
  mobileSheet = true,
  closeOnOverlay = true,
}) {
  const [isDragging, setIsDragging] = useState(false)
  const [dragY, setDragY] = useState(0)
  const dragStartY = useRef(null)
  const sheetRef = useRef(null)

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
      setDragY(0)
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isOpen, onClose])

  // Drag handlers (mobile sheet only)
  const handleDragStart = (e) => {
    dragStartY.current = e.touches?.[0]?.clientY ?? e.clientY
    setIsDragging(true)
  }

  const handleDragMove = (e) => {
    if (!isDragging || dragStartY.current === null) return
    const currentY = e.touches?.[0]?.clientY ?? e.clientY
    const delta = Math.max(0, currentY - dragStartY.current)
    setDragY(delta)
  }

  const handleDragEnd = () => {
    setIsDragging(false)
    if (dragY > 100) {
      onClose()
    } else {
      setDragY(0)
    }
    dragStartY.current = null
  }

  if (!isOpen) return null

  return (
    <div
      className={`fixed inset-0 z-[60] flex ${mobileSheet ? 'items-end md:items-center' : 'items-center'} justify-center`}
      aria-modal="true"
      role="dialog"
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-gray-900/50 transition-opacity"
        onClick={closeOnOverlay ? onClose : undefined}
      />

      {/* Modal panel */}
      <div
        ref={sheetRef}
        style={mobileSheet ? { transform: `translateY(${dragY}px)`, transition: isDragging ? 'none' : 'transform 0.2s ease' } : {}}
        className={`
          relative bg-white w-full overflow-hidden flex flex-col
          ${mobileSheet ? 'rounded-t-2xl md:rounded-2xl max-h-[90vh] md:max-h-[85vh]' : 'rounded-2xl max-h-[85vh]'}
          ${sizeMap[size]}
          shadow-xl
        `}
        onClick={e => e.stopPropagation()}
      >
        {/* Mobile drag handle */}
        {mobileSheet && (
          <div
            className="md:hidden w-full flex justify-center py-4 shrink-0 cursor-grab active:cursor-grabbing touch-none"
            onTouchStart={handleDragStart}
            onTouchMove={handleDragMove}
            onTouchEnd={handleDragEnd}
            onMouseDown={handleDragStart}
            onMouseMove={handleDragMove}
            onMouseUp={handleDragEnd}
          >
            <div className="w-10 h-1.5 bg-gray-300 rounded-full" />
          </div>
        )}

        {/* Content */}
        <div className="flex flex-col overflow-hidden flex-1">
          {children}
        </div>
      </div>
    </div>
  )
}

/**
 * Convenience sub-components for consistent modal structure.
 * Usage:
 *   <Modal ...>
 *     <Modal.Header onClose={onClose}>Title</Modal.Header>
 *     <Modal.Body>...</Modal.Body>
 *     <Modal.Footer>...</Modal.Footer>
 *   </Modal>
 */

BaseModal.Header = function ModalHeader({ children, onClose }) {
  return (
    <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
      <div className="flex items-center gap-3 min-w-0">
        {children}
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors p-1.5 rounded-lg hover:bg-gray-100 shrink-0 ml-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  )
}

BaseModal.Body = function ModalBody({ children, className = '' }) {
  return (
    <div className={`flex-1 overflow-y-auto px-5 py-5 ${className}`}>
      {children}
    </div>
  )
}

BaseModal.Footer = function ModalFooter({ children, className = '' }) {
  return (
    <div className={cn(`shrink-0 px-5 py-4 border-t border-gray-100 bg-gray-50 flex items-center justify-end gap-2 ${className}`)}>
      {children}
    </div>
  )
}

export default BaseModal