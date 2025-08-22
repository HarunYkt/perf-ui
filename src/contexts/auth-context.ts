import { createContext } from "react";
import type { User } from "@/types";

export type AuthValue = {
  user: User | null;
  token: string | null;
  ready: boolean;                      // ← eklendi
  login: (token: string, user: User) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthValue | null>(null);
