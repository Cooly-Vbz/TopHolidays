import { useTheme } from './ThemeProvider'
import StarRating from './StarRating'
import type { Review } from '../lib/reviews'

export default function ReviewCard({ review }: { review: Review }) {
    const { theme } = useTheme()
    const isDark = theme === 'dark'

    return (
        <div style={{
            padding: 16,
            borderRadius: 12,
            background: isDark ? 'rgba(255,255,255,0.05)' : '#F9FAFB',
            border: `1px solid ${isDark ? '#374151' : '#E5E7EB'}`,
            marginBottom: 12
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontWeight: 600, color: isDark ? '#F3F4F6' : '#111827' }}>
                            {review.author}
                        </span>
                        {review.verified && (
                            <span style={{
                                fontSize: 11,
                                background: isDark ? 'rgba(16, 185, 129, 0.2)' : '#D1FAE5',
                                color: isDark ? '#34D399' : '#059669',
                                padding: '2px 6px',
                                borderRadius: 9999
                            }}>
                                Verified Purchase
                            </span>
                        )}
                    </div>
                    <div style={{ fontSize: 12, color: isDark ? '#9CA3AF' : '#6B7280', marginTop: 2 }}>
                        {new Date(review.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                </div>
                <StarRating rating={review.rating} size={14} />
            </div>

            <p style={{
                margin: 0,
                fontSize: 14,
                lineHeight: 1.5,
                color: isDark ? '#D1D5DB' : '#374151'
            }}>
                {review.comment}
            </p>
        </div>
    )
}
