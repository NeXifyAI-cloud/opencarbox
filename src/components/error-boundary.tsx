'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import { logger } from '@/lib/logger'

interface Props {
  children: ReactNode
  fallback?: (error: Error, retry: () => void) => ReactNode
  onError?: (error: Error, info: ErrorInfo) => void
}

interface State {
  hasError: boolean
  error: Error | null
  errorCount: number
  errorId: string
}

export class ErrorBoundary extends Component<Props, State> {
  public constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorCount: 0,
      errorId: '',
    }
  }

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
      errorId: Math.random().toString(36).slice(2, 9),
    }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const { errorId, errorCount } = this.state

    // Log to external service
    logger.error('Error Boundary Caught', {
      message: error.toString(),
      componentStack: errorInfo.componentStack,
      errorCount: errorCount + 1,
      errorId,
      timestamp: new Date().toISOString(),
    })

    // Call optional callback
    this.props.onError?.(error, errorInfo)
  }

  private handleRetry = () => {
    this.setState((state) => ({
      hasError: false,
      error: null,
      errorCount: state.errorCount + 1,
    }))
  }

  private handleHome = () => {
    window.location.href = '/'
  }

  public render(): ReactNode {
    if (this.state.hasError && this.state.error) {
      return (
        this.props.fallback?.(this.state.error, this.handleRetry) || (
          <div className="flex min-h-screen items-center justify-center bg-red-50 p-4">
            <div className="w-full max-w-md space-y-4 text-center">
              <div className="flex justify-center">
                <div className="rounded-full bg-red-100 p-4">
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                </div>
              </div>

              <div>
                <h1 className="text-2xl font-bold text-red-900">Something went wrong</h1>
                <p className="mt-2 text-sm text-red-700">
                  We apologize for the inconvenience. Please try again or contact support.
                </p>
              </div>

              {process.env.NODE_ENV === 'development' && (
                <div className="rounded bg-red-100 p-3 text-left">
                  <p className="mb-1 text-xs font-semibold text-red-800">Error Details:</p>
                  <p className="text-xs font-mono text-red-800">{this.state.error.message}</p>
                  {this.state.error.stack && (
                    <pre className="mt-2 max-h-40 overflow-auto text-xs font-mono text-red-800">
                      {this.state.error.stack}
                    </pre>
                  )}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={this.handleRetry}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2 font-medium text-white hover:bg-red-700 transition-colors"
                >
                  <RefreshCw className="h-4 w-4" />
                  Try Again
                </button>
                <button
                  onClick={this.handleHome}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-red-300 px-4 py-2 font-medium text-red-700 hover:bg-red-50 transition-colors"
                >
                  <Home className="h-4 w-4" />
                  Go Home
                </button>
              </div>

              <p className="text-xs text-gray-500">
                Error ID: <code className="font-mono">{this.state.errorId}</code>
              </p>
            </div>
          </div>
        )
      )
    }

    return this.props.children
  }
}
