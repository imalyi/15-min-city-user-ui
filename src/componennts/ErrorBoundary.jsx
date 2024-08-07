import React from 'react';
import '../styles/ErrorBoundary.css';


class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Aktualizuje stan, aby następny render pokazał zapasowy UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Możesz także zalogować błąd do zewnętrznego serwisu logowania błędów.
    console.error("Caught by ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Możesz renderować dowolny zapasowy UI.
      return (
        <div className="error-boundary">
          <h1>Ups! Coś poszło nie tak.</h1>
          <button onClick={() => window.location.reload()}>Odśwież stronę</button>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
