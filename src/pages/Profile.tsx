// src/pages/Profile.tsx
import { useEffect, useState } from "react";
import { getUser, type AppUser } from "@/lib/auth";
import { resolveMe } from "@/lib/me";
import { useNavigate } from "react-router-dom";
import { evaluationService } from "@/services";

type ReceivedEvaluation = {
  id: number;
  evaluatorName: string;
  evaluatorEmail: string;
  score: number;
  comment?: string;
  type: string;
  periodYear: number;
  periodQuarter: string;
  date: string;
};

export default function Profile() {
  const nav = useNavigate();
  const [user, setUser] = useState<AppUser | null>(() => getUser());
  const [loading, setLoading] = useState(false);
  const [receivedEvaluations, setReceivedEvaluations] = useState<ReceivedEvaluation[]>([]);
  const [evaluationsLoading, setEvaluationsLoading] = useState(false);
  const [evaluationStats, setEvaluationStats] = useState({
    averageScore: 0,
    totalCount: 0,
    typeBreakdown: {} as Record<string, number>,
    yearBreakdown: {} as Record<string, number>
  });
  
  // Filter states
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [selectedQuarter, setSelectedQuarter] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("");

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

  // Load received evaluations with filters
  const loadReceivedEvaluations = async () => {
    if (!user) return;
    
    setEvaluationsLoading(true);
    try {
      const filters: any = {};
      if (selectedYear) filters.year = parseInt(selectedYear);
      if (selectedQuarter) filters.quarter = selectedQuarter;
      if (selectedType) filters.type = selectedType;
      
      console.log('Loading received evaluations with filters:', filters);
      console.log('User info:', user);
      const response = await evaluationService.getMyReceivedEvaluations(filters);
      console.log('Received evaluations response:', response);
      console.log('Response type:', typeof response);
      console.log('Response keys:', Object.keys(response || {}));
      
      if (response && response.evaluations) {
        setReceivedEvaluations(response.evaluations);
        setEvaluationStats(response.statistics || {
          averageScore: 0,
          totalCount: 0,
          typeBreakdown: {},
          yearBreakdown: {}
        });
      } else {
        // Fallback if response format is different
        console.log('Unexpected response format, trying direct array access');
        if (Array.isArray(response)) {
          setReceivedEvaluations(response);
          setEvaluationStats({
            averageScore: response.length > 0 ? response.reduce((sum, e) => sum + e.score, 0) / response.length : 0,
            totalCount: response.length,
            typeBreakdown: {},
            yearBreakdown: {}
          });
        }
      }
    } catch (error) {
      console.error('Failed to load received evaluations:', error);
    } finally {
      setEvaluationsLoading(false);
    }
  };

  useEffect(() => {
    loadReceivedEvaluations();
  }, [user, selectedYear, selectedQuarter, selectedType]);

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

      {/* Received Evaluations Section */}
      <div className="bg-white rounded border border-slate-200 p-4 mt-6">
        <h2 className="text-lg font-semibold mb-4">Aldığım Değerlendirmeler</h2>
        
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
            <div className="text-2xl font-bold text-blue-600">{evaluationStats.totalCount || 0}</div>
            <div className="text-sm text-blue-700">Toplam Değerlendirme</div>
          </div>
          <div className="bg-green-50 rounded-lg border border-green-200 p-4">
            <div className="text-2xl font-bold text-green-600">{(evaluationStats.averageScore || 0).toFixed(1)}</div>
            <div className="text-sm text-green-700">Ortalama Puan</div>
          </div>
          <div className="bg-purple-50 rounded-lg border border-purple-200 p-4">
            <div className="text-2xl font-bold text-purple-600">{Object.keys(evaluationStats.typeBreakdown || {}).length}</div>
            <div className="text-sm text-purple-700">Farklı Tip</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-slate-50 rounded-lg p-4 mb-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Yıl</label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
              >
                <option value="">Tüm Yıllar</option>
                {Object.keys(evaluationStats.yearBreakdown).sort().reverse().map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Çeyrek</label>
              <select
                value={selectedQuarter}
                onChange={(e) => setSelectedQuarter(e.target.value)}
                className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
              >
                <option value="">Tüm Çeyrekler</option>
                <option value="Q1">Q1</option>
                <option value="Q2">Q2</option>
                <option value="Q3">Q3</option>
                <option value="Q4">Q4</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Tip</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
              >
                <option value="">Tüm Tipler</option>
                {Object.keys(evaluationStats.typeBreakdown).map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              {(selectedYear || selectedQuarter || selectedType) && (
                <button
                  onClick={() => {
                    setSelectedYear("");
                    setSelectedQuarter("");
                    setSelectedType("");
                  }}
                  className="w-full rounded bg-slate-600 text-white text-sm px-3 py-2 hover:bg-slate-700"
                >
                  Filtreleri Temizle
                </button>
              )}
            </div>
          </div>
        </div>
        
        {evaluationsLoading && (
          <div className="text-slate-500 text-sm">Değerlendirmeler yükleniyor...</div>
        )}
        
        {!evaluationsLoading && receivedEvaluations.length === 0 && (
          <div className="text-slate-500 text-sm">
            {(selectedYear || selectedQuarter || selectedType) 
              ? "Seçilen filtrelere uygun değerlendirme bulunamadı." 
              : "Henüz değerlendirme almadınız."}
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
              <div className="text-sm text-yellow-800 mb-2">
                <strong>Dinamik Değerlendirme Sistemi Test:</strong>
              </div>
              <div className="flex flex-wrap gap-2 text-xs">
                <button 
                  onClick={() => nav("/evaluations/new")}
                  className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                >
                  Değerlendirme Yap
                </button>
                <button 
                  onClick={loadReceivedEvaluations}
                  className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                >
                  Yenile
                </button>
                <button 
                  onClick={async () => {
                    try {
                      // Önce bir değerlendirme oluştur
                      const createResponse = await fetch('/api/evaluations', {
                        method: 'POST',
                        headers: {
                          'Authorization': `Bearer ${localStorage.getItem('token')}`,
                          'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                          employeeEmail: user?.email,
                          score: 8,
                          comments: "Test değerlendirmesi - dinamik sistem çalışıyor!",
                          type: "PEER_TO_PEER",
                          periodYear: 2025,
                          periodQuarter: "Q1"
                        })
                      });
                      
                      if (createResponse.ok) {
                        console.log('Test evaluation created successfully');
                        // Değerlendirmeleri yeniden yükle
                        await loadReceivedEvaluations();
                      } else {
                        console.error('Failed to create test evaluation');
                      }
                    } catch (error) {
                      console.error('Error creating test evaluation:', error);
                    }
                  }}
                  className="bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700"
                >
                  Test Değerlendirme Oluştur
                </button>
                <button 
                  onClick={async () => {
                    try {
                      const response = await fetch('/api/evaluations/me/received', {
                        headers: {
                          'Authorization': `Bearer ${localStorage.getItem('token')}`,
                          'Content-Type': 'application/json'
                        }
                      });
                      const data = await response.json();
                      console.log('API Response:', data);
                      
                      if (data && typeof data === 'object') {
                        if (data.evaluations) {
                          setReceivedEvaluations(data.evaluations);
                          setEvaluationStats(data.statistics || {
                            averageScore: 0,
                            totalCount: 0,
                            typeBreakdown: {},
                            yearBreakdown: {}
                          });
                        } else if (Array.isArray(data)) {
                          setReceivedEvaluations(data);
                        }
                      }
                    } catch (error) {
                      console.error('API test failed:', error);
                    }
                  }}
                  className="bg-orange-600 text-white px-3 py-1 rounded hover:bg-orange-700"
                >
                  API Debug
                </button>
              </div>
            </div>
          </div>
        )}
        
        {!evaluationsLoading && receivedEvaluations.length > 0 && (
          <div className="space-y-4">
            {receivedEvaluations.map((evaluation) => (
              <div key={evaluation.id} className="border border-slate-200 rounded p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-medium text-sm">{evaluation.evaluatorName}</div>
                    <div className="text-slate-500 text-xs">{evaluation.evaluatorEmail}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-lg text-blue-600">{evaluation.score}/10</div>
                    <div className="text-slate-500 text-xs">
                      {evaluation.periodYear} Q{evaluation.periodQuarter}
                    </div>
                  </div>
                </div>
                
                <div className="text-xs text-slate-500 mb-2">
                  Tip: {evaluation.type} • Tarih: {new Date(evaluation.date).toLocaleDateString('tr-TR')}
                </div>
                
                {evaluation.comment && (
                  <div className="text-sm text-slate-700 bg-slate-50 p-3 rounded">
                    "{evaluation.comment}"
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
