import axios from "axios";

// URL where the backend runs. Set the Render URL when deploying.
const API_BASE_URL = "http://localhost:5000";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Automatically attach the token to every request, if one exists
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

export type ClassType = {
  _id: string;
  name: string;
  teacher: string;
  studentCount: number;
  class: string;
  type: "Theory" | "Revision" | "Practical";
  status: "Active" | "Inactive";
};

export type ClassFormInput = {
  name: string;
  teacher: string;
  studentCount: number | string;
  class: string;
  type: ClassType["type"];
  status: ClassType["status"];
};

// Use this in a try/catch block to get a readable error message
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

export const getGoogleDriveStatus = async () => {
  const res = await api.get("/api/admin/google/status");
  return res.data; // { connected: boolean }
};

export const connectGoogleDrive = async () => {
  const res = await api.get("/api/admin/google/connect");
  return res.data; // { url: string }
};

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

// ---------- Classes ----------

export async function getClasses() {
  const res = await api.get<{ classes: ClassType[] }>("/api/classes");
  return res.data;
}

export async function createClass(form: ClassFormInput) {
  const res = await api.post<{ message: string; class: ClassType }>(
    "/api/classes",
    form
  );
  return res.data;
}

export async function updateClass(id: string, form: ClassFormInput) {
  const res = await api.put<{ message: string; class: ClassType }>(
    `/api/classes/${id}`,
    form
  );
  return res.data;
}

export async function deleteClass(id: string) {
  const res = await api.delete<{ message: string }>(`/api/classes/${id}`);
  return res.data;
}

// ---------- Assignments ----------

export type AssignmentType = {
  _id: string;
  title: string;
  class: ClassType; // populated class object
  dueDate: string;
  duration: string;
  instructions: string;
  fileUrl: string;
  fileName: string;
  createdAt: string;
};

export type AssignmentFormInput = {
  title: string;
  classId: string;
  dueDate: string;
  duration: string;
  instructions: string;
  file: File;
};

export async function getAssignments() {
  const res = await api.get<{ assignments: AssignmentType[] }>("/api/assignments");
  return res.data;
}

export async function createAssignment(form: AssignmentFormInput) {
  const fd = new FormData();
  fd.append("title", form.title);
  fd.append("class", form.classId);
  fd.append("dueDate", form.dueDate);
  fd.append("duration", form.duration);
  fd.append("instructions", form.instructions);
  fd.append("file", form.file);

  const res = await api.post<{ message: string; assignment: AssignmentType }>(
    "/api/assignments",
    fd,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return res.data;
}

export async function deleteAssignment(id: string) {
  const res = await api.delete<{ message: string }>(`/api/assignments/${id}`);
  return res.data;
}

// ---------- Time table period ----------
export type PeriodType = {
  _id: string;
  class: ClassType;
  recurring: boolean;
  dayOfWeek?: number; // 0=Mon...6=Sun
  date?: string;
  start: number;
  end: number;
};

export type PeriodFormInput = {
  classId: string;
  start: number;
  end: number;
  recurring: boolean;
  dayOfWeek?: number;
  date?: string;
};

export async function getPeriods(from?: string, to?: string) {
  const res = await api.get<{ periods: PeriodType[] }>("/api/periods", {
    params: { from, to },
  });
  return res.data;
}

export async function createPeriod(form: PeriodFormInput) {
  const res = await api.post<{ message: string; period: PeriodType }>("/api/periods", form);
  return res.data;
}

export async function deletePeriod(id: string) {
  const res = await api.delete<{ message: string }>(`/api/periods/${id}`);
  return res.data;
}