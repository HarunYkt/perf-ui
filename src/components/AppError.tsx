import { isRouteErrorResponse, useRouteError, Link } from "react-router-dom";

export default function AppError() {
  const err = useRouteError();
  const title = isRouteErrorResponse(err) ? `${err.status} ${err.statusText}` : "Beklenmeyen Hata";
  const msg = (isRouteErrorResponse(err) && err.data) ? String(err.data) : (err as Error)?.message;

  return (
    <div style={{minHeight:"100dvh",display:"grid",placeItems:"center",background:"#f8fafc"}}>
      <div style={{background:"#fff",padding:24,borderRadius:12,boxShadow:"0 10px 25px rgba(0,0,0,.08)",width:420}}>
        <h1 style={{margin:"0 0 12px"}}>😵‍💫 {title}</h1>
        {msg && <div style={{color:"#475569",fontSize:14,marginBottom:12}}>{msg}</div>}
        <div style={{display:"flex",gap:8}}>
          <Link to="/profile" replace className="rounded bg-slate-900 text-white text-sm px-3 py-2">Profile git</Link>
          <Link to="/" replace className="rounded border text-sm px-3 py-2">Ana sayfa</Link>
          <Link to="/login" replace className="rounded border text-sm px-3 py-2">Giriş</Link>
        </div>
      </div>
    </div>
  );
}
