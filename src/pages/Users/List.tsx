import { useEffect, useState } from "react";
import api from "@/lib/api";

type User = {
  id: number;
  email: string;
  fullName: string;
  role: string;
  createdAt?: string;
};

export default function UsersList() {
  const [rows, setRows] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  async function load() {
    setLoading(true);
    setErr("");
    try {
      // Backend'in "sayfalama" değil de düz liste döndürdüğünü varsaydık
      const res = await api.get<User[]>("/users");
      setRows(res.data);
    } catch {
      setErr("Kullanıcılar yüklenemedi.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  return (
    <div className="max-w-5xl">
      <h1 className="text-2xl font-semibold mb-4">Kullanıcılar</h1>
      {err && <div className="text-red-600 text-sm mb-2">{err}</div>}

      <div className="overflow-x-auto bg-white rounded border border-slate-200">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50">
            <tr className="text-left">
              <th className="px-3 py-2">Ad Soyad</th>
              <th className="px-3 py-2">E-posta</th>
              <th className="px-3 py-2">Rol</th>
              <th className="px-3 py-2">Oluşturma</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={4} className="px-3 py-6 text-center text-slate-500">Yükleniyor…</td></tr>
            )}
            {!loading && rows.length === 0 && (
              <tr><td colSpan={4} className="px-3 py-6 text-center text-slate-500">Kayıt yok.</td></tr>
            )}
            {!loading && rows.map((u) => (
              <tr key={u.id} className="border-t">
                <td className="px-3 py-2">{u.fullName}</td>
                <td className="px-3 py-2">{u.email}</td>
                <td className="px-3 py-2">{u.role}</td>
                <td className="px-3 py-2">{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
