import { Component, type ErrorInfo, type ReactNode } from 'react';
import { GlassCard } from './GlassCard';
import { withTranslation, type WithTranslation } from 'react-i18next';

interface Props extends WithTranslation {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

/**
 * Error boundary component to catch and display errors gracefully
 */
class ErrorBoundaryBase extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        console.error('Error caught by boundary:', error, errorInfo);
    }

    handleReset = (): void => {
        this.setState({ hasError: false, error: null });
        window.location.href = '/';
    };

    render(): ReactNode {
        const { t } = this.props;

        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
                    <GlassCard className="max-w-md w-full">
                        <div className="text-center space-y-4">
                            <div className="text-6xl">⚠️</div>
                            <h1 className="text-2xl font-bold text-white">
                                {t('error.title')}
                            </h1>
                            <p className="text-white/70">
                                {t('error.message')}
                            </p>
                            {this.state.error && (
                                <details className="text-left">
                                    <summary className="cursor-pointer text-white/50 text-sm">
                                        {t('error.details')}
                                    </summary>
                                    <pre className="mt-2 text-xs text-white/40 overflow-auto p-2 bg-black/20 rounded">
                                        {this.state.error.message}
                                    </pre>
                                </details>
                            )}
                            <button
                                onClick={this.handleReset}
                                className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 px-6 rounded-xl font-semibold hover:opacity-90 transition-opacity"
                            >
                                {t('error.returnHome')}
                            </button>
                        </div>
                    </GlassCard>
                </div>
            );
        }

        return this.props.children;
    }
}

export const ErrorBoundary = withTranslation()(ErrorBoundaryBase);
