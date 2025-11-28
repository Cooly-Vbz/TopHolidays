import { useState } from 'react'

type StarRatingProps = {
    rating: number
    max?: number
    size?: number
    interactive?: boolean
    onChange?: (rating: number) => void
}

export default function StarRating({
    rating,
    max = 5,
    size = 20,
    interactive = false,
    onChange
}: StarRatingProps) {
    const [hover, setHover] = useState<number | null>(null)

    const current = interactive && hover !== null ? hover : rating

    return (
        <div
            style={{ display: 'flex', gap: 2 }}
            onMouseLeave={() => interactive && setHover(null)}
        >
            {Array.from({ length: max }).map((_, i) => {
                const value = i + 1
                const filled = value <= current

                return (
                    <button
                        key={i}
                        type="button"
                        disabled={!interactive}
                        onClick={() => interactive && onChange?.(value)}
                        onMouseEnter={() => interactive && setHover(value)}
                        style={{
                            background: 'none',
                            border: 'none',
                            padding: 0,
                            cursor: interactive ? 'pointer' : 'default',
                            color: filled ? '#F59E0B' : '#D1D5DB',
                            fontSize: size,
                            lineHeight: 1,
                            transition: 'color 0.1s, transform 0.1s',
                            transform: interactive && hover === value ? 'scale(1.1)' : 'scale(1)'
                        }}
                        aria-label={`${value} stars`}
                    >
                        ★
                    </button>
                )
            })}
        </div>
    )
}
