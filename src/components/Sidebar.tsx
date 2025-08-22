import { NavLink } from "react-router-dom";
import { getUser, hasRole, logout } from "@/lib/auth";

type Item = { label: string; to: string; roles?: string[] };
const ITEMS: Item[] = [
  { label: "Profilim", to: "/profile" },                               // ← yeni
  { label: "Dashboard", to: "/" },
  { label: "Değerlendirmeler", to: "/evaluations", roles: ["EMPLOYEE","MANAGER","ADMIN"] },
  { label: "Değerlendirme Yap", to: "/evaluate", roles: ["EMPLOYEE","MANAGER","ADMIN"] }, // ← yeni
  { label: "Kullanıcılar", to: "/users", roles: ["MANAGER","ADMIN"] },
];

export default function Sidebar() {
  const user = getUser();
  const visible = ITEMS.filter(i => hasRole(i.roles));

  return (
    <aside className="w-60 bg-white border-r border-slate-200 min-h-screen p-4">
      <div className="font-semibold mb-4">Perf Review</div>
      <nav className="space-y-1">
        {visible.map(i => (
          <NavLink
            key={i.to}
            to={i.to}
            className={({ isActive }) =>
              `block rounded px-3 py-2 text-sm ${isActive ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-100"}`
            }
          >
            {i.label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-6 text-xs text-slate-500">
        <div>{user?.fullName || user?.email}</div>
        <div>{user?.role}</div>
      </div>

      <button onClick={logout} className="mt-4 w-full rounded bg-slate-900 text-white text-sm py-2">
        Çıkış
      </button>
    </aside>
  );
}
