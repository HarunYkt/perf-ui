export type AppUser = {
  id?: string | number;
  email?: string;
  fullName?: string;
  role?: string; // "EMPLOYEE" | "MANAGER" | "ADMIN"
};

export function getToken(): string | null {
  return localStorage.getItem("token");
}
export function getUser(): AppUser | null {
  try { return JSON.parse(localStorage.getItem("user") || "null"); } catch { return null; }
}
export function hasRole(roles?: string[] | string): boolean {
  const u = getUser();
  if (!roles) return true;
  const r = Array.isArray(roles) ? roles : [roles];
  return !!u?.role && r.includes(u.role);
}
export function logout() {
  localStorage.clear();
  window.location.assign("/login");
}
