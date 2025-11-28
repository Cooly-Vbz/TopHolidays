import React from 'react'
import { ANIMATION } from '../lib/constants'

interface LoadingSpinnerProps {
  size?: number
  color?: string
  className?: string
  'aria-label'?: string
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 24,
  color = 'currentColor',
  className = '',
  'aria-label': ariaLabel = 'Loading'
}) => {
  return (
    <div
      role="status"
      aria-label={ariaLabel}
      style={{
        width: size,
        height: size,
        border: `${size / 8}px solid rgba(0, 0, 0, 0.1)`,
        borderTop: `${size / 8}px solid ${color}`,
        borderRadius: '50%',
        animation: `spin ${ANIMATION.slow}ms linear infinite`,
        color
      }}
      className={className}
    >
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      <span style={{ position: 'absolute', width: '1px', height: '1px', padding: '0', margin: '-1px', overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', whiteSpace: 'nowrap', border: '0' }}>
        Loading...
      </span>
    </div>
  )
}

export default LoadingSpinner
