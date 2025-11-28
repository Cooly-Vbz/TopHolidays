export type Review = {
    id: string
    productId: string
    author: string
    rating: number
    comment: string
    date: string
    verified: boolean
}

const STORAGE_KEY = 'reviews'

const MOCK_REVIEWS: Review[] = [
    {
        id: 'r1',
        productId: '1',
        author: 'Alice M.',
        rating: 5,
        comment: 'Absolutely love this! The quality is amazing and it arrived so fast.',
        date: '2023-11-15',
        verified: true
    },
    {
        id: 'r2',
        productId: '1',
        author: 'John D.',
        rating: 4,
        comment: 'Great product, but the sizing runs a bit small.',
        date: '2023-11-10',
        verified: true
    },
    {
        id: 'r3',
        productId: '2',
        author: 'Sarah K.',
        rating: 5,
        comment: 'Perfect for the holidays! Highly recommend.',
        date: '2023-12-01',
        verified: true
    }
]

export function getReviews(productId: string): Review[] {
    try {
        const raw = localStorage.getItem(STORAGE_KEY)
        const stored = raw ? JSON.parse(raw) : []
        const all = [...MOCK_REVIEWS, ...stored]
        return all.filter(r => r.productId === productId).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    } catch {
        return MOCK_REVIEWS.filter(r => r.productId === productId)
    }
}

export function addReview(review: Omit<Review, 'id' | 'date' | 'verified'>) {
    try {
        const newReview: Review = {
            ...review,
            id: crypto.randomUUID(),
            date: new Date().toISOString().split('T')[0],
            verified: true // In a real app, check purchase history
        }

        const raw = localStorage.getItem(STORAGE_KEY)
        const stored = raw ? JSON.parse(raw) : []
        localStorage.setItem(STORAGE_KEY, JSON.stringify([...stored, newReview]))
        return newReview
    } catch (e) {
        console.error('Failed to add review', e)
        throw e
    }
}

export function getAverageRating(productId: string): { rating: number; count: number } {
    const reviews = getReviews(productId)
    if (reviews.length === 0) return { rating: 0, count: 0 }

    const sum = reviews.reduce((acc, r) => acc + r.rating, 0)
    return {
        rating: Number((sum / reviews.length).toFixed(1)),
        count: reviews.length
    }
}
