import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/lib/api";

type Evaluation = {
  id: number;
  evaluatedEmail: string;
  evaluatedName: string;
  evaluatorEmail: string;
  evaluatorName: string;
  score: number;
  comment?: string;
  type: string;
  periodYear: number;
  periodQuarter: string;
  date: string; // ISO
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
  const [data, setData] = useState<Evaluation[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  
  // Filter states
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [selectedQuarter, setSelectedQuarter] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("");

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoading(true);
      setErr("");
      try {
        const res = await api.get<Evaluation[]>("/evaluations/me/given");
        if (!cancelled) setData(res.data);
      } catch {
        if (!cancelled) setErr("Değerlendirmeler yüklenemedi.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, []); // No dependencies needed since we're not using pagination

  // Filter and search logic
  const filteredData = useMemo(() => {
    let filtered = data ?? [];
    
    // Apply search filter
    if (query.trim()) {
      const searchTerm = query.toLowerCase();
      filtered = filtered.filter(item => 
        item.evaluatedName?.toLowerCase().includes(searchTerm) ||
        item.evaluatedEmail?.toLowerCase().includes(searchTerm)
      );
    }
    
    // Apply year filter
    if (selectedYear) {
      filtered = filtered.filter(item => item.periodYear.toString() === selectedYear);
    }
    
    // Apply quarter filter
    if (selectedQuarter) {
      filtered = filtered.filter(item => item.periodQuarter === selectedQuarter);
    }
    
    // Apply type filter
    if (selectedType) {
      filtered = filtered.filter(item => item.type === selectedType);
    }
    
    return filtered;
  }, [data, query, selectedYear, selectedQuarter, selectedType]);
  
  // Statistics
  const stats = useMemo(() => {
    const totalCount = filteredData.length;
    const averageScore = totalCount > 0 
      ? filteredData.reduce((sum, item) => sum + item.score, 0) / totalCount 
      : 0;
    
    return { totalCount, averageScore };
  }, [filteredData]);
  
  // Get unique values for filters
  const uniqueYears = useMemo(() => 
    [...new Set(data.map(item => item.periodYear.toString()))].sort().reverse(), [data]
  );
  
  const uniqueQuarters = useMemo(() => 
    [...new Set(data.map(item => item.periodQuarter))].sort(), [data]
  );
  
  const uniqueTypes = useMemo(() => 
    [...new Set(data.map(item => item.type))].sort(), [data]
  );
  
  const rows = filteredData;

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

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <div className="text-2xl font-bold text-blue-600">{stats.totalCount}</div>
          <div className="text-sm text-slate-600">Toplam Değerlendirme</div>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <div className="text-2xl font-bold text-green-600">{stats.averageScore.toFixed(1)}</div>
          <div className="text-sm text-slate-600">Ortalama Puan</div>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <div className="text-2xl font-bold text-purple-600">{uniqueTypes.length}</div>
          <div className="text-sm text-slate-600">Farklı Tip</div>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <div className="text-2xl font-bold text-orange-600">{uniqueYears.length}</div>
          <div className="text-sm text-slate-600">Farklı Yıl</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-slate-200 p-4 mb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <input
              value={qInput}
              onChange={(ev) => setQInput(ev.target.value)}
              placeholder="Çalışan e-postası/isim ara…"
              className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
            >
              <option value="">Tüm Yıllar</option>
              {uniqueYears.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
          <div>
            <select
              value={selectedQuarter}
              onChange={(e) => setSelectedQuarter(e.target.value)}
              className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
            >
              <option value="">Tüm Çeyrekler</option>
              {uniqueQuarters.map(quarter => (
                <option key={quarter} value={quarter}>Q{quarter}</option>
              ))}
            </select>
          </div>
          <div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
            >
              <option value="">Tüm Tipler</option>
              {uniqueTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          <div>
            <button
              onClick={() => { setQuery(qInput.trim()); }}
              className="w-full rounded bg-slate-900 text-white text-sm px-3 py-2"
            >
              Ara
            </button>
          </div>
        </div>
        
        {/* Clear Filters */}
        {(selectedYear || selectedQuarter || selectedType || query) && (
          <div className="mt-3 pt-3 border-t border-slate-200">
            <button
              onClick={() => {
                setSelectedYear("");
                setSelectedQuarter("");
                setSelectedType("");
                setQuery("");
                setQInput("");
              }}
              className="text-sm text-slate-600 hover:text-slate-800"
            >
              Filtreleri Temizle
            </button>
          </div>
        )}
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
            {!loading && rows.map((r: Evaluation) => (
              <tr key={r.id} className="border-t">
                <td className="px-3 py-2">
                  <div className="font-medium">{r.evaluatedName || "-"}</div>
                  <div className="text-slate-500">{r.evaluatedEmail}</div>
                </td>
                <td className="px-3 py-2">
                  {r.periodYear} {r.periodQuarter}
                </td>
                <td className="px-3 py-2">{r.score}</td>
                <td className="px-3 py-2">{r.type}</td>
                <td className="px-3 py-2">{r.date ? fmt(r.date) : "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Chart Section */}
      {!loading && data.length > 0 && (
        <div className="bg-white rounded-lg border border-slate-200 p-4 mt-4">
          <h3 className="text-lg font-semibold mb-4">Değerlendirme Dağılımı</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Type Distribution */}
            <div>
              <h4 className="text-sm font-medium text-slate-700 mb-3">Tip Bazında Dağılım</h4>
              <div className="space-y-2">
                {uniqueTypes.map(type => {
                  const count = data.filter(item => item.type === type).length;
                  const percentage = (count / data.length) * 100;
                  return (
                    <div key={type} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-500 rounded"></div>
                        <span className="text-sm">{type}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-slate-200 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full" 
                            style={{width: `${percentage}%`}}
                          ></div>
                        </div>
                        <span className="text-sm text-slate-600 w-12 text-right">{count}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Year Distribution */}
            <div>
              <h4 className="text-sm font-medium text-slate-700 mb-3">Yıl Bazında Dağılım</h4>
              <div className="space-y-2">
                {uniqueYears.map(year => {
                  const count = data.filter(item => item.periodYear.toString() === year).length;
                  const avgScore = data.filter(item => item.periodYear.toString() === year)
                    .reduce((sum, item, _, arr) => sum + item.score / arr.length, 0);
                  const percentage = (count / data.length) * 100;
                  return (
                    <div key={year} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded"></div>
                        <span className="text-sm">{year}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-slate-200 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full" 
                            style={{width: `${percentage}%`}}
                          ></div>
                        </div>
                        <span className="text-sm text-slate-600 w-12 text-right">{count}</span>
                        <span className="text-xs text-slate-500">({avgScore.toFixed(1)})</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="flex items-center justify-between mt-3 text-sm">
        <div className="text-slate-600">
          Gösterilen: {rows.length} / Toplam: {data.length}
          {(selectedYear || selectedQuarter || selectedType || query) && (
            <span className="text-blue-600 ml-2">(Filtrelenmiş)</span>
          )}
        </div>
      </div>
    </div>
  );
}

function fmt(iso: string) {
  try { return new Date(iso).toLocaleDateString(); } catch { return iso; }
}
