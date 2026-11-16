import { Component } from "react";
import { Link, useLocation } from "react-router-dom";
import { AlertTriangle } from "lucide-react";

/** Equivalent of app/error.js: catches render errors in any page. */
class Boundary extends Component {
  state = { error: null, path: this.props.path };

  static getDerivedStateFromError(error) {
    return { error };
  }

  static getDerivedStateFromProps(props, state) {
    // Leaving the broken page clears the error.
    if (props.path !== state.path) return { error: null, path: props.path };
    return null;
  }

  componentDidCatch(error) {
    console.error(error);
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div className="container-page py-24 text-center max-w-lg mx-auto">
        <div className="h-16 w-16 mx-auto rounded-2xl bg-red-500/10 flex items-center justify-center mb-6">
          <AlertTriangle size={30} className="text-red-600" />
        </div>
        <h1 className="text-3xl font-extrabold mb-2">Something went wrong</h1>
        <p className="text-charcoal/60 dark:text-white/60 mb-8">
          An unexpected error occurred. You can try again, or head back home.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <button onClick={() => this.setState({ error: null })} className="btn-primary">Try again</button>
          <Link to="/" className="btn-secondary">Back to home</Link>
        </div>
      </div>
    );
  }
}

export default function ErrorBoundary({ children }) {
  const { pathname } = useLocation();
  return <Boundary path={pathname}>{children}</Boundary>;
}
