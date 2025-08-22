import { useEffect, useState } from "react";
import api from "../lib/api";
import { useNavigate } from "react-router-dom";

type Me = { id?: number; email?: string; fullName?: string; role?: string };

export default function Home() {
  const nav = useNavigate();
  const [me, setMe] = useState<Me | null>(null);

  useEffect(() => {
    const t = localStorage.getItem("token");
    if (!t) return;

    // 1) Tercihen backend'ten profil
    api.get("/users/me")
      .then(r => setMe(r.data as Me))
      .catch(() => {
        // 2) Fallback: JWT payload'ını çöz
        try {
          const [, payload] = t.split(".");
          const json = JSON.parse(atob(payload));
          setMe({
            email: json.email ?? json.sub ?? json.username ?? json.preferred_username,
            fullName: json.fullName ?? json.name,
            role: json.role ?? json.roles?.[0] ?? json.authorities?.[0],
          });
        } catch { /* yoksay */ }
      });
  }, []);

  function logout() {
    localStorage.clear();
    nav("/login", { replace: true });
  }

  const tokenExists = !!localStorage.getItem("token");

  return (
    <div style={{minHeight:"100dvh",display:"grid",placeItems:"center",background:"#eef2f7"}}>
      <div style={{background:"#fff",padding:24,borderRadius:12,boxShadow:"0 10px 25px rgba(0,0,0,.08)",color:"#111"}}>
        <div style={{fontSize:22,fontWeight:700,marginBottom:8}}>HOME</div>
        <div>Token var mı? <b>{tokenExists ? "Evet" : "Hayır"}</b></div>
        <div>E-posta: <b>{me?.email ?? "-"}</b></div>
        <div>Ad Soyad: <b>{me?.fullName ?? "-"}</b></div>
        <div>Rol: <b>{me?.role ?? "-"}</b></div>

        <div style={{marginTop:12,display:"flex",gap:8}}>
          <button onClick={()=>nav("/login")} style={{padding:"8px 12px",borderRadius:8,border:"1px solid #e5e7eb"}}>Login'e git</button>
          <button onClick={logout} style={{padding:"8px 12px",borderRadius:8,background:"#111",color:"#fff"}}>Çıkış</button>
        </div>
      </div>
    </div>
  );
}
