// src/pages/Profile.tsx
import { useEffect, useState } from "react";
import { getUser, type AppUser } from "@/lib/auth";
import { resolveMe } from "@/lib/me";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const nav = useNavigate();
  const [user, setUser] = useState<AppUser | null>(() => getUser());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancel = false;
    (async () => {
      setLoading(true);
      try {
        const fresh = await resolveMe();
        if (!cancel && fresh) {
          localStorage.setItem("user", JSON.stringify(fresh));
          setUser(fresh);
        }
      } finally {
        if (!cancel) setLoading(false);
      }
    })();
    return () => { cancel = true; };
  }, []);

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-semibold mb-4">Profilim</h1>
      <div className="bg-white rounded border border-slate-200 p-4">
        {loading && <div className="text-slate-500 text-sm mb-2">Bilgiler güncelleniyor…</div>}

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-slate-500">E-posta</div>
            <div className="font-medium">{user?.email ?? "-"}</div>
          </div>
          <div>
            <div className="text-slate-500">Ad Soyad</div>
            <div className="font-medium">{user?.fullName ?? "-"}</div>
          </div>
          <div>
            <div className="text-slate-500">Rol</div>
            <div className="font-medium">{user?.role ?? "-"}</div>
          </div>
        </div>

        <div className="mt-4">
          <button onClick={() => nav("/evaluate?mode=self")}
                  className="rounded bg-slate-900 text-white text-sm px-3 py-2">
            Kendi Değerlendirmemi Yap
          </button>
        </div>
      </div>
    </div>
  );
}
