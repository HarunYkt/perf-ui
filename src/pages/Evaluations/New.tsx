import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/lib/api";

export default function NewEvaluation() {
  const nav = useNavigate();
  const [employeeEmail, setEmployeeEmail] = useState("");
  const [periodStart, setPeriodStart] = useState("");
  const [periodEnd, setPeriodEnd] = useState("");
  const [score, setScore] = useState<number | "">("");
  const [comments, setComments] = useState("");
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(""); setSaving(true);
    try {
      await api.post("/evaluations", {
        employeeEmail,
        periodStart: periodStart || null,
        periodEnd: periodEnd || null,
        score: typeof score === "number" ? score : null,
        comments: comments || null,
      });
      nav("/evaluations");
    } catch {
      setErr("Kayıt sırasında hata oluştu.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-semibold mb-4">Yeni Değerlendirme</h1>
      {err && <div className="mb-3 text-red-600 text-sm">{err}</div>}

      <form onSubmit={submit} className="space-y-3 bg-white p-4 rounded border border-slate-200">
        <div>
          <label className="block text-sm mb-1">Çalışan E-postası</label>
          <input
            required
            value={employeeEmail}
            onChange={(e) => setEmployeeEmail(e.target.value)}
            className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
            placeholder="ornek@firma.com"
            type="email"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm mb-1">Dönem Başlangıç</label>
            <input
              value={periodStart}
              onChange={(e) => setPeriodStart(e.target.value)}
              className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
              type="date"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Dönem Bitiş</label>
            <input
              value={periodEnd}
              onChange={(e) => setPeriodEnd(e.target.value)}
              className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
              type="date"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm mb-1">Puan (0–100)</label>
          <input
            value={score}
            onChange={(e) => {
              const v = e.target.value;
              setScore(v === "" ? "" : Math.max(0, Math.min(100, Number(v))));
            }}
            className="w-40 rounded border border-slate-300 px-3 py-2 text-sm"
            type="number" min={0} max={100}
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Yorum</label>
          <textarea
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
            rows={3}
          />
        </div>

        <div className="flex gap-2">
          <button
            disabled={saving}
            className="rounded bg-slate-900 text-white text-sm px-3 py-2"
          >
            {saving ? "Kaydediliyor…" : "Kaydet"}
          </button>
          <button
            type="button"
            onClick={() => nav("/evaluations")}
            className="rounded border px-3 py-2 text-sm"
          >
            İptal
          </button>
        </div>
      </form>
    </div>
  );
}
