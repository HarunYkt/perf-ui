import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "@/lib/api";
import { getUser, getToken } from "@/lib/auth";

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

export default function Evaluate() {
  const nav = useNavigate();
  const me = getUser();
  const q = useQuery();
  const mode = q.get("mode");
  const isSelf = mode === "self";

  const [employeeEmail, setEmployeeEmail] = useState(isSelf ? (me?.email ?? "") : "");
  const [periodStart, setPeriodStart] = useState("");
  const [periodEnd, setPeriodEnd] = useState("");
  const [score, setScore] = useState<number | "">("");
  const [comments, setComments] = useState("");
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    if (isSelf) setEmployeeEmail(me?.email ?? "");
    
    // Check if user is authenticated
    const token = getToken();
    if (!token || !me) {
      nav("/login");
      return;
    }
  }, [isSelf, me?.email, me, nav]);

  async function submit(ev: React.FormEvent) {
    ev.preventDefault();
    setErr(""); setSaving(true);
    
    // Double check authentication before submitting
    const token = getToken();
    if (!token) {
      setErr("Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.");
      nav("/login");
      return;
    }
    
    try {
      await api.post("/evaluations", {
        employeeEmail: employeeEmail || null,
        periodStart: periodStart || null,
        periodEnd: periodEnd || null,
        score: typeof score === "number" ? score : null,
        comments: comments || null,
      });
      nav("/evaluations");
    } catch (error: any) {
      if (error.response?.status === 401) {
        setErr("Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.");
        nav("/login");
      } else {
        setErr("Kayıt sırasında hata oluştu: " + (error.response?.data?.message || error.message));
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-semibold mb-4">Değerlendirme Yap</h1>
      {err && <div className="mb-3 text-red-600 text-sm">{err}</div>}

      <form onSubmit={submit} className="space-y-3 bg-white p-4 rounded border border-slate-200">
        <div>
          <label className="block text-sm mb-1">Çalışan E-postası</label>
          <input
            required
            value={employeeEmail}
            onChange={(ev) => setEmployeeEmail(ev.target.value)}
            className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
            type="email"
            placeholder="ornek@firma.com"
            disabled={false}
          />
          <div className="text-xs text-slate-500 mt-1">Kendinizi veya başkalarını değerlendirebilirsiniz.</div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm mb-1">Dönem Başlangıç</label>
            <input value={periodStart} onChange={(ev) => setPeriodStart(ev.target.value)} className="w-full rounded border border-slate-300 px-3 py-2 text-sm" type="date" />
          </div>
          <div>
            <label className="block text-sm mb-1">Dönem Bitiş</label>
            <input value={periodEnd} onChange={(ev) => setPeriodEnd(ev.target.value)} className="w-full rounded border border-slate-300 px-3 py-2 text-sm" type="date" />
          </div>
        </div>

        <div>
          <label className="block text-sm mb-1">Puan (0–100)</label>
          <input
            value={score}
            onChange={(ev) => {
              const v = ev.target.value;
              setScore(v === "" ? "" : Math.max(0, Math.min(100, Number(v))));
            }}
            className="w-40 rounded border border-slate-300 px-3 py-2 text-sm"
            type="number" min={0} max={100}
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Yorum</label>
          <textarea value={comments} onChange={(ev) => setComments(ev.target.value)} className="w-full rounded border border-slate-300 px-3 py-2 text-sm" rows={3} placeholder="Kısa bir açıklama girin…" />
        </div>

        <div className="flex gap-2">
          <button disabled={saving} className="rounded bg-slate-900 text-white text-sm px-3 py-2">
            {saving ? "Kaydediliyor…" : "Kaydet"}
          </button>
          <button type="button" onClick={() => nav("/evaluations")} className="rounded border px-3 py-2 text-sm">
            İptal
          </button>
        </div>
      </form>
    </div>
  );
}
