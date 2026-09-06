import axios from "axios";

// Backend eka run wena URL eka. Deploy karaddi Render URL eka danna.
const API_BASE_URL = "http://localhost:5000";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Token thiyenawa nam, request ekatama automatic ekathu karanawa
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken");
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export type LoginResponse = {
  message: string;
  token: string;
  admin: { id: string; username: string };
};

export type AdminProfile = {
  id: string;
  username: string;
  name: string;
  email: string;
  phone: string;
  topBarName: string;
};

// try/catch eke error message eka gannna use karanna
export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || error.message;
  }
  if (error instanceof Error) return error.message;
  return "Something went wrong";
}

// ---------- Auth ----------

export async function loginAdmin(username: string, password: string) {
  const res = await api.post<LoginResponse>("/api/admin/login", {
    username,
    password,
  });
  return res.data;
}

export async function changePassword(oldPassword: string, newPassword: string) {
  const res = await api.put<{ message: string }>("/api/admin/change-password", {
    oldPassword,
    newPassword,
  });
  return res.data;
}

// ---------- Profile ----------

export async function getProfile() {
  const res = await api.get<{ admin: AdminProfile }>("/api/admin/profile");
  return res.data;
}

export async function updateProfile(
  profile: Pick<AdminProfile, "name" | "email" | "phone" | "topBarName">
) {
  const res = await api.put<{ message: string; admin: AdminProfile }>(
    "/api/admin/profile",
    profile
  );
  return res.data;
}