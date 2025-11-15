import React from 'react';
import styles from './ErrorBoundary.module.scss';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so next render shows fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error to console (or error reporting service)
    console.error('Error Boundary caught an error:', error, errorInfo);

    this.setState({
      error,
      errorInfo,
    });

    // TODO: Send to error tracking service (Sentry, LogRocket, etc.)
    // logErrorToService(error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className={styles.errorBackdrop}>
          <div className={styles.errorContainer}>
            <div className={styles.errorHeader}>
              <h1 className={styles.errorTitle}>⚠️ SYSTEM ERROR</h1>
              <div className={styles.errorIcon}>!</div>
            </div>

            <div className={styles.errorContent}>
              <p className={styles.errorMessage}>
                The quantum state collapsed unexpectedly.
              </p>
              <p className={styles.errorSubMessage}>
                Don't worry - your data is safe. Try reloading or return home.
              </p>

              <div className={styles.errorActions}>
                <button onClick={this.handleReset} className={styles.primaryButton}>
                  Try Again
                </button>
                <button
                  onClick={() => (window.location.href = '/')}
                  className={styles.secondaryButton}
                >
                  Go Home
                </button>
              </div>

              {import.meta.env.DEV && this.state.error && (
                <details className={styles.errorDetails}>
                  <summary className={styles.detailsSummary}>
                    Error Details (Development Only)
                  </summary>
                  <pre className={styles.errorStack}>
                    {this.state.error.toString()}
                    {this.state.errorInfo?.componentStack}
                  </pre>
                </details>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
