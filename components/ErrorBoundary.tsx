import React, { ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  // Fix: Explicitly declare state and props to help the TypeScript compiler recognize inherited members from React.Component
  public state: State;
  public props: Props;

  constructor(props: Props) {
    super(props);
    // Fix: Explicitly initialize state and assign props to the instance to resolve "Property does not exist on type" errors on line 16
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
    // Fix: Accessing state which is now explicitly declared in the class to resolve error on line 31
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-6">
          <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-xl shadow-2xl p-8 text-center border border-red-100 dark:border-red-900/30">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="text-red-600 dark:text-red-400" size={32} />
            </div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white mb-2">System Error</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 font-mono bg-slate-100 dark:bg-slate-950 p-2 rounded break-all">
              {/* Fix: Accessing the error object from the explicitly declared state to resolve error on line 40 */}
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

    // Fix: Accessing children through the explicitly declared props property to resolve error on line 54
    return this.props.children;
  }
}