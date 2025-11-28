import React from 'react'
import type { ReactNode } from 'react'
import { ANIMATION } from '../lib/constants'

interface PageTransitionProps {
  children: ReactNode
  className?: string
}

const PageTransition: React.FC<PageTransitionProps> = ({ children, className = '' }) => {
  return (
    <div
      style={{
        animation: `pageFadeIn ${ANIMATION.normal}ms ease-out`,
        width: '100%',
        minHeight: 'calc(100vh - 128px)' // Account for navbar and bottom padding
      }}
      className={className}
    >
      <style>{`
        @keyframes pageFadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
      {children}
    </div>
  )
}

export default PageTransition
