import { Component, ReactNode, ErrorInfo } from "react";

type Props = { children: ReactNode };
type State = { hasError: boolean; error?: Error };

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };
  static getDerivedStateFromError(error: Error): State { return { hasError: true, error }; }
  componentDidCatch(error: Error, info: ErrorInfo) { console.error("ErrorBoundary caught:", error, info); }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-dvh grid place-items-center p-6">
          <div className="max-w-xl w-full bg-white rounded-lg shadow p-4 text-sm">
            <h2 className="font-semibold mb-2">Bir hata oluştu</h2>
            <pre className="overflow-auto text-red-600 whitespace-pre-wrap">
              {this.state.error?.message ?? String(this.state.error)}
            </pre>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
