import { createBrowserRouter, RouterProvider } from "react-router-dom";

import ProtectedRoute from "../features/auth/components/ProtectedRoute";
import Dashboard from "../pages/Dashboard";
import InterviewReport from "../pages/InterviewReport";
import Login from "../pages/Login";
import Register from "../pages/Register";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    )
  },
  {
    path: "/interview/:reportId",
    element: (
      <ProtectedRoute>
        <InterviewReport />
      </ProtectedRoute>
    )
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/register",
    element: <Register />
  }
]);

function AppRoutes() {
  return <RouterProvider router={router} />;
}

export default AppRoutes;  