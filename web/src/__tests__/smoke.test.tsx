import { test, expect } from 'vitest'
import '@testing-library/jest-dom'
import React from 'react'
import { render, screen } from '@testing-library/react'

function Hello() {
  return <div>Hello</div>
}

test('renders a simple component', () => {
  render(<Hello />)
  expect(screen.getByText('Hello')).toBeInTheDocument()
})
