import { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-900">
          <section className="mx-auto max-w-2xl rounded-md border border-rose-200 bg-white p-5 shadow-sm">
            <h1 className="text-xl font-bold text-rose-700">Frontend render error</h1>
            <p className="mt-2 text-sm text-slate-600">
              The app hit a runtime error instead of rendering the page.
            </p>
            <pre className="mt-4 overflow-auto rounded-md bg-slate-950 p-4 text-sm text-slate-100">
              {this.state.error.message}
            </pre>
            <button
              className="mt-4 rounded-md bg-teal-600 px-4 py-2 text-sm font-semibold text-white"
              onClick={() => {
                localStorage.clear();
                window.location.assign("/");
              }}
            >
              Clear browser data and reload
            </button>
          </section>
        </main>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
