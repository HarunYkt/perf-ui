import { useState } from "react";
import api from "../lib/api";
import { resolveMe } from "../lib/me";
import axios from "axios";
import { useNavigate  } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();


  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(""); setLoading(true);
    try {
      // 🔑 ARTIK /auth/token çağırıyoruz
      const res = await api.post("/auth/token", { email, password });

      // Beklenen şema: { access_token: "...", token_type: "Bearer" }
      const data = res.data as Record<string, unknown>;
      const token =
        (typeof data?.access_token === "string" && data.access_token) ||
        (typeof data?.token === "string" && data.token) ||
        null;

      if (!token) throw new Error("Token gelmedi.");

      localStorage.setItem("token", token);

      // Token header'a eklendiği için me uçları artık 200 dönmeli
      const me = await resolveMe();
      if (me) localStorage.setItem("user", JSON.stringify(me));

      nav("/profile", {replace: true});
    } catch (e: unknown) {
      const msg = axios.isAxiosError(e)
        ? (typeof e.response?.data === "string" ? e.response.data : e.message)
        : (e instanceof Error ? e.message : "Giriş başarısız.");
      setErr(msg ?? "Giriş başarısız.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{minHeight:"100dvh",display:"grid",placeItems:"center",background:"#f8fafc"}}>
      <form onSubmit={submit} style={{background:"#fff",padding:24,borderRadius:12,boxShadow:"0 10px 25px rgba(0,0,0,.08)",width:360}}>
        <h1 style={{margin:"0 0 12px",fontSize:22}}>Giriş Yap</h1>
        {err && <div style={{color:"#b91c1c",fontSize:14,marginBottom:8}}>{err}</div>}
        <div style={{display:"grid",gap:8}}>
          <input placeholder="E-posta" value={email} onChange={(e)=>setEmail(e.target.value)}
                 style={{padding:"10px 12px",border:"1px solid #e5e7eb",borderRadius:8,color:"#111"}} type="email" required />
          <input placeholder="Şifre" value={password} onChange={(e)=>setPassword(e.target.value)}
                 style={{padding:"10px 12px",border:"1px solid #e5e7eb",borderRadius:8,color:"#111"}} type="password" required />
          <button disabled={loading}
                  style={{padding:"10px 12px",borderRadius:8,background:"#111",color:"#fff",cursor:"pointer",opacity:loading?0.6:1}}>
            {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
          </button>
        </div>
      </form>
    </div>
  );
}
