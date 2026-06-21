import { Navigate } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";

function ProtectedRoute({ children }) {
  const { user, isAuthLoading } = useAuth();

  if (isAuthLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6 text-slate-950">
        <div className="text-center">
          <p className="text-sm font-medium text-slate-500">Checking session...</p>
          <h1 className="mt-2 text-2xl font-bold">Loading InterviewPilot</h1>
        </div>
      </main>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;