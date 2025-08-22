import api from "../lib/api";
import axios from "axios";

export type NormalizedUser = {
  id?: number | string;
  email?: string;
  fullName?: string;
  role?: string;
};

const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null;

const firstString = (v: unknown): string | undefined =>
  Array.isArray(v) ? (typeof v[0] === "string" ? v[0] : undefined) : (typeof v === "string" ? v : undefined);

// JWT payload güvenli çözüm
function parseJwt(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    return JSON.parse(atob(parts[1]));
  } catch {
    return null;
  }
}

function normalizeUser(raw: Record<string, unknown>): NormalizedUser {
  const get = (k: string): unknown => raw[k];

  let role =
    (get("role") as string | undefined) ??
    firstString(get("roles")) ??
    firstString(get("authorities")) ??
    firstString(get("permissions"));

  // role bir nesne ise ve name alanı varsa
  if (isRecord(role) && typeof role.name === "string") {
    role = role.name;
  }

  const fullName =
    (get("fullName") as string | undefined) ??
    (get("name") as string | undefined) ??
    (get("displayName") as string | undefined) ??
    (typeof get("firstName") === "string" && typeof get("lastName") === "string"
      ? `${get("firstName") as string} ${get("lastName") as string}`
      : undefined);

  const email =
    (get("email") as string | undefined) ??
    (get("mail") as string | undefined) ??
    (get("preferred_username") as string | undefined) ??
    (get("username") as string | undefined) ??
    (get("userName") as string | undefined) ??
    (get("login") as string | undefined) ??
    (get("sub") as string | undefined);

  return {
    id:
      (get("id") as number | string | undefined) ??
      (get("userId") as number | string | undefined) ??
      (get("uuid") as string | undefined),
    email,
    fullName,
    role,
  };
}

/** Me bilgisini birden çok yoldan dener, yoksa JWT'den üretir */
export async function resolveMe(): Promise<NormalizedUser | null> {
  const token = localStorage.getItem("token");

  const pathsFromEnv = (import.meta.env.VITE_ME_PATHS as string | undefined)
    ?.split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const candidates = pathsFromEnv ?? ["/auth/me", "/users/me", "/me", "/users/current"];

  for (const path of candidates) {
    try {
      const { data } = await api.get(path);
      if (isRecord(data)) return normalizeUser(data);
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        const status = e.response?.status;
        if (status === 401) break; // yetkisiz -> token geçersiz olabilir
      }
      // 404 vb. durumlarda diğer adayları dene
      continue;
    }
  }

  if (token) {
    const payload = parseJwt(token);
    if (payload) return normalizeUser(payload);
  }
  return null;
}
