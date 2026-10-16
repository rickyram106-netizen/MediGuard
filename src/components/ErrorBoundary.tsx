import React, { ReactNode, ErrorInfo } from 'react';
import { AlertCircle } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error boundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex-1 flex flex-col bg-[color:var(--bg)] items-center justify-center p-6 text-center">
          <AlertCircle size={48} className="text-danger mb-4" />
          <h2 className="text-xl font-bold text-[color:var(--text)] mb-2">Something went wrong</h2>
          <p className="text-[color:var(--muted)] mb-6">
            {this.state.error?.message || 'An unexpected error occurred. Please try again.'}
          </p>
          <button
            onClick={this.handleReset}
            className="bg-teal text-white px-6 py-3 rounded-lg font-bold hover:opacity-90 transition-opacity"
          >
            Refresh App
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
