import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/lib/api";

type Evaluation = {
  id: number;
  employeeEmail: string;
  employeeName?: string;
  periodStart: string; // ISO
  periodEnd: string;   // ISO
  score: number;
  status?: string;
  createdAt?: string;  // ISO
};

type Page<T> = {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number; // current page (0-based)
};

export default function EvaluationsList() {
  const nav = useNavigate();
  const [qInput, setQInput] = useState("");   // input alanı
  const [query, setQuery] = useState("");     // aramada kullanılan değer
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [data, setData] = useState<Page<Evaluation> | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoading(true);
      setErr("");
      try {
        const res = await api.get<Page<Evaluation>>("/evaluations", {
          params: { page, size, q: query || undefined },
        });
        if (!cancelled) setData(res.data);
      } catch {
        if (!cancelled) setErr("Değerlendirmeler yüklenemedi.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [page, size, query]); // ✅ linter mutlu

  const rows = useMemo(() => data?.content ?? [], [data]);

  return (
    <div className="max-w-6xl">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Değerlendirmeler</h1>
        <button
          onClick={() => nav("/evaluations/new")}
          className="rounded bg-slate-900 text-white text-sm px-3 py-2"
        >
          Yeni Değerlendirme
        </button>
      </div>

      <div className="flex gap-2 mb-3">
        <input
          value={qInput}
          onChange={(ev) => setQInput(ev.target.value)}
          placeholder="Çalışan e-postası/isim ara…"
          className="w-72 rounded border border-slate-300 px-3 py-2 text-sm"
        />
        <button
          onClick={() => { setPage(0); setQuery(qInput.trim()); }}
          className="rounded bg-slate-900 text-white text-sm px-3 py-2"
        >
          Ara
        </button>
      </div>

      {err && <div className="text-red-600 text-sm mb-2">{err}</div>}

      <div className="overflow-x-auto bg-white rounded border border-slate-200">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50">
            <tr className="text-left">
              <th className="px-3 py-2">Çalışan</th>
              <th className="px-3 py-2">Dönem</th>
              <th className="px-3 py-2">Puan</th>
              <th className="px-3 py-2">Durum</th>
              <th className="px-3 py-2">Oluşturma</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={5} className="px-3 py-6 text-center text-slate-500">
                  Yükleniyor…
                </td>
              </tr>
            )}
            {!loading && rows.length === 0 && (
              <tr>
                <td colSpan={5} className="px-3 py-6 text-center text-slate-500">
                  Kayıt yok.
                </td>
              </tr>
            )}
            {!loading && rows.map((r) => (
              <tr key={r.id} className="border-t">
                <td className="px-3 py-2">
                  <div className="font-medium">{r.employeeName || "-"}</div>
                  <div className="text-slate-500">{r.employeeEmail}</div>
                </td>
                <td className="px-3 py-2">
                  {fmt(r.periodStart)} – {fmt(r.periodEnd)}
                </td>
                <td className="px-3 py-2">{r.score}</td>
                <td className="px-3 py-2">{r.status || "-"}</td>
                <td className="px-3 py-2">{r.createdAt ? fmt(r.createdAt) : "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-3 text-sm">
        <div className="text-slate-600">Toplam: {data?.totalElements ?? 0}</div>
        <div className="flex items-center gap-2">
          <button
            disabled={page <= 0}
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            className="rounded border px-2 py-1 disabled:opacity-40"
          >
            ‹ Önceki
          </button>
          <div>Sayfa {page + 1} / {data ? data.totalPages : 1}</div>
          <button
            disabled={!!data && page >= data.totalPages - 1}
            onClick={() => setPage((p) => p + 1)}
            className="rounded border px-2 py-1 disabled:opacity-40"
          >
            Sonraki ›
          </button>

          <select
            value={size}
            onChange={(ev) => { setSize(parseInt(ev.target.value, 10)); setPage(0); }}
            className="ml-2 rounded border px-2 py-1"
          >
            {[10, 20, 50].map((n) => <option key={n} value={n}>{n}/s</option>)}
          </select>
        </div>
      </div>
    </div>
  );
}

function fmt(iso: string) {
  try { return new Date(iso).toLocaleDateString(); } catch { return iso; }
}
