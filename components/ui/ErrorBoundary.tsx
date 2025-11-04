'use client';

import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div 
          className="rounded-xl p-6 border border-red-500"
          style={{ backgroundColor: 'var(--bg-card)' }}
        >
          <h2 className="text-red-500 font-bold mb-2">Something went wrong</h2>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            {this.state.error?.message || 'An unexpected error occurred'}
          </p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="mt-4 px-4 py-2 rounded-lg text-white"
            style={{ background: 'linear-gradient(135deg, #F94C9B 0%, #00B8D4 100%)' }}
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}