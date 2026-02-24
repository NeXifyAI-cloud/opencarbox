import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ErrorBoundary } from '../error-boundary'

describe('ErrorBoundary', () => {
  // Component that throws an error
  const ThrowError = () => {
    throw new Error('Test error')
  }

  // Component that renders normally
  const SafeComponent = () => <div>Safe content</div>

  it('should render children when no error occurs', () => {
    render(
      <ErrorBoundary>
        <SafeComponent />
      </ErrorBoundary>
    )

    expect(screen.getByText('Safe content')).toBeInTheDocument()
  })

  it('should catch and display error', () => {
    // Suppress console.error for this test
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    )

    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
    expect(screen.getByText(/We apologize for the inconvenience/)).toBeInTheDocument()

    consoleSpy.mockRestore()
  })

  it('should display error details in development', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    vi.stubEnv('NODE_ENV', 'development')

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    )

    expect(screen.getByText('Test error')).toBeInTheDocument()

    vi.unstubAllEnvs()
    consoleSpy.mockRestore()
  })

  it('should hide error details in production', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    vi.stubEnv('NODE_ENV', 'production')

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    )

    expect(screen.queryByText('Test error')).not.toBeInTheDocument()

    vi.unstubAllEnvs()
    consoleSpy.mockRestore()
  })

  it('should have retry button', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    )

    const retryButton = screen.getByRole('button', { name: /Try Again/i })
    expect(retryButton).toBeInTheDocument()

    consoleSpy.mockRestore()
  })

  it('should have go home button', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    )

    const homeButton = screen.getByRole('button', { name: /Go Home/i })
    expect(homeButton).toBeInTheDocument()

    consoleSpy.mockRestore()
  })

  it('should display error ID', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    )

    expect(screen.getByText(/Error ID:/)).toBeInTheDocument()

    consoleSpy.mockRestore()
  })

  it('should call onError callback', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const onError = vi.fn()

    render(
      <ErrorBoundary onError={onError}>
        <ThrowError />
      </ErrorBoundary>
    )

    expect(onError).toHaveBeenCalled()

    consoleSpy.mockRestore()
  })

  it('should use custom fallback if provided', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    render(
      <ErrorBoundary fallback={(error: Error) => <div>Custom error: {error.message}</div>}>
        <ThrowError />
      </ErrorBoundary>
    )

    expect(screen.getByText('Custom error: Test error')).toBeInTheDocument()

    consoleSpy.mockRestore()
  })
})
