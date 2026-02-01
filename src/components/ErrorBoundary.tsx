import React, { ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  // Fixed: Made optional to resolve "children is missing" errors during usage
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Refactored ErrorBoundary to use React.Component explicitly and include a constructor.
 * This ensures that TypeScript correctly identifies 'props' and 'state' as members
 * inherited from the React Component class, resolving the error where 'props' was 
 * not recognized on the class instance.
 */
export class ErrorBoundary extends React.Component<Props, State> {
  // Fixed: Explicitly declared state and props properties to help TS compiler recognize inherited members
  public state: State;
  public props: Props;

  constructor(props: Props) {
    super(props);
    this.props = props;
    this.state = {
      hasError: false,
      error: null,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-6">
          <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-xl shadow-2xl p-8 text-center border border-red-100 dark:border-red-900/30">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="text-red-600 dark:text-red-400" size={32} />
            </div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white mb-2">System Error</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 font-mono bg-slate-100 dark:bg-slate-950 p-2 rounded break-all">
              {this.state.error?.message || 'Unknown render error'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-bold flex items-center justify-center gap-2 mx-auto transition-all"
            >
              <RefreshCw size={18} />
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}