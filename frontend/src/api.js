const API_BASE = "http://localhost:8000";

export async function apiGet(path) {
  const res = await fetch(`${API_BASE}${path}`);

  if (!res.ok) {
    throw new Error(`GET ${path} failed with status ${res.status}`);
  }

  return res.json();
}

export async function apiPost(path, body) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error(`POST ${path} failed with status ${res.status}`);
  }

  return res.json();
}