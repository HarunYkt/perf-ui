import { Navigate, useLocation } from "react-router-dom";
import type { ReactElement } from "react";
import { getToken, getUser } from "@/lib/auth";

type Props = { children: ReactElement; roles?: string[] };

export default function ProtectedRoute({ children, roles }: Props) {
  const loc = useLocation();
  const token = getToken();
  const user = getUser();

  if (!token) return <Navigate to="/login" state={{ from: loc.pathname }} replace />;

  if (roles && user?.role && !roles.includes(user.role)) {
    // rolden yetkisizse ana sayfaya
    return <Navigate to="/" replace />;
  }
  return children;
}
