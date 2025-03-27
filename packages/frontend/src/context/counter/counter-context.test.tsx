import { describe, it, expect } from 'vitest'
import { CounterContext } from './counter-context'
import { useContext } from 'react'
import { render } from '@testing-library/react'

function TestComponent() {
  const context = useContext(CounterContext)
  return <div>{context === null ? 'No context' : 'Has context'}</div>
}

describe('CounterContext', () => {
  it('should default to null', () => {
    const { getByText } = render(<TestComponent />)
    expect(getByText('No context')).toBeTruthy()
  })
})
