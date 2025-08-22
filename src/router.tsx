import { createBrowserRouter, Navigate } from "react-router-dom";
import ProtectedRoute from "@/components/ProtectedRoute";
import Layout from "@/components/Layout";
import AppError from "@/components/AppError";

import Login from "@/pages/Login";
import Profile from "@/pages/Profile";
import Dashboard from "@/pages/Dashboard";
import EvaluationsList from "@/pages/Evaluations/List";
import Evaluate from "@/pages/Evaluations/Evaluate";
import NewEvaluation from "@/pages/Evaluations/New";
import UsersList from "@/pages/Users/List";

const router = createBrowserRouter([
  { path: "/login", element: <Login />, errorElement: <AppError /> },

  {
    path: "/profile",
    element: (
      <ProtectedRoute>
        <Layout><Profile /></Layout>
      </ProtectedRoute>
    ),
    errorElement: <AppError />,
  },

  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Layout><Dashboard /></Layout>
      </ProtectedRoute>
    ),
    errorElement: <AppError />,
  },

  {
    path: "/evaluations",
    element: (
      <ProtectedRoute roles={["EMPLOYEE","MANAGER","ADMIN"]}>
        <Layout><EvaluationsList /></Layout>
      </ProtectedRoute>
    ),
    errorElement: <AppError />,
  },

  {
    path: "/evaluate",
    element: (
      <ProtectedRoute roles={["EMPLOYEE","MANAGER","ADMIN"]}>
        <Layout><Evaluate /></Layout>
      </ProtectedRoute>
    ),
    errorElement: <AppError />,
  },

  {
    path: "/evaluations/new",
    element: (
      <ProtectedRoute roles={["EMPLOYEE","MANAGER","ADMIN"]}>
        <Layout><NewEvaluation /></Layout>
      </ProtectedRoute>
    ),
    errorElement: <AppError />,
  },

  {
    path: "/users",
    element: (
      <ProtectedRoute roles={["MANAGER","ADMIN"]}>
        <Layout><UsersList /></Layout>
      </ProtectedRoute>
    ),
    errorElement: <AppError />,
  },

  { path: "*", element: <Navigate to="/profile" replace /> },
]);

export default router;
