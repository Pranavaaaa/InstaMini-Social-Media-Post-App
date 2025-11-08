export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4001";

export async function apiRequest(path, { method = "GET", body, token } = {}) {
  const headers = {};
  const options = { method, headers };

  if (token) headers.Authorization = `Bearer ${token}`;

  if (body instanceof FormData) {
    options.body = body;
  } else if (body !== undefined) {
    headers["Content-Type"] = "application/json";
    options.body = JSON.stringify(body);
  }

  const res = await fetch(`${API_BASE_URL}${path}`, options);

  const contentType = res.headers.get("content-type") || "";
  const data = contentType.includes("application/json") ? await res.json() : await res.text();

  if (!res.ok) {
    const message = typeof data === "string" ? data : data?.message || "Request failed";
    throw new Error(message);
  }

  return data;
}


