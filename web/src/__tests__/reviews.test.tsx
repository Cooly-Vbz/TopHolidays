import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { addReview, getReviews, getAverageRating } from '../lib/reviews'
import StarRating from '../components/StarRating'
import ReviewCard from '../components/ReviewCard'

// Mock localStorage
const localStorageMock = (() => {
    let store: Record<string, string> = {}
    return {
        getItem: (key: string) => store[key] || null,
        setItem: (key: string, value: string) => { store[key] = value.toString() },
        clear: () => { store = {} }
    }
})()
Object.defineProperty(window, 'localStorage', { value: localStorageMock })

describe('Review Logic', () => {
    beforeEach(() => {
        localStorage.clear()
    })

    it('adds a review and retrieves it', () => {
        const review = {
            productId: '123',
            author: 'Test User',
            rating: 5,
            comment: 'Great product!'
        }
        addReview(review)
        const reviews = getReviews('123')
        expect(reviews).toHaveLength(1)
        expect(reviews[0].author).toBe('Test User')
        expect(reviews[0].verified).toBe(true)
    })

    it('calculates average rating correctly', () => {
        addReview({ productId: '123', author: 'A', rating: 5, comment: 'Good' })
        addReview({ productId: '123', author: 'B', rating: 3, comment: 'Okay' })

        const { rating, count } = getAverageRating('123')
        expect(count).toBe(2)
        expect(rating).toBe(4.0)
    })
})

describe('StarRating Component', () => {
    it('renders correct number of stars', () => {
        render(<StarRating rating={3} />)
        const stars = screen.getAllByText('★')
        expect(stars).toHaveLength(5) // Total stars
        // We can't easily check color in jsdom without computed styles, but we check existence
    })

    it('calls onChange when interactive', () => {
        const handleChange = vi.fn()
        render(<StarRating rating={0} interactive onChange={handleChange} />)
        const stars = screen.getAllByText('★')
        fireEvent.click(stars[4]) // Click 5th star
        expect(handleChange).toHaveBeenCalledWith(5)
    })
})

describe('ReviewCard Component', () => {
    it('renders review details', () => {
        const review = {
            id: '1',
            productId: '123',
            author: 'Jane Doe',
            rating: 4,
            comment: 'Nice item',
            date: '2023-01-01',
            verified: true
        }

        // Mock theme context if needed, or wrap in provider. 
        // For unit test of simple component, we might get away without it if useTheme handles missing context gracefully 
        // or we mock the hook.

        // Mocking useTheme
        vi.mock('../components/ThemeProvider', () => ({
            useTheme: () => ({ theme: 'light' })
        }))

        render(<ReviewCard review={review} />)
        expect(screen.getByText('Jane Doe')).toBeDefined()
        expect(screen.getByText('Nice item')).toBeDefined()
        expect(screen.getByText('Verified Purchase')).toBeDefined()
    })
})
