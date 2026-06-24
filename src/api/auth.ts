import { apiFetch, setToken } from "./client";

interface LoginResponse {
  access_token: string;
  token_type: string;
}

export async function login(
  email: string,
  password: string,
): Promise<LoginResponse> {
  const response = await apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error("Credenciales inválidas");
  }

  const data: LoginResponse = await response.json();
  setToken(data.access_token);
  return data;
}
