// Petit client fetch avec base URL .env (fallback json-server)
const BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000';

function buildUrl(path, params) {
  const url = new URL(path.replace(/^\//, ''), BASE + '/');
  if (params && typeof params === 'object') {
    Object.entries(params).forEach(([k, v]) => {
      if (v === undefined || v === null || v === '') return;
      // json-server: valeurs multiples => plusieurs params
      if (Array.isArray(v)) v.forEach(val => url.searchParams.append(k, val));
      else url.searchParams.set(k, v);
    });
  }
  return url.toString();
}

async function req(path, { method = 'GET', params, body, headers } = {}) {
  const url = buildUrl(path, params);
  const res = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(headers || {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`[HTTP ${res.status}] ${url} – ${text}`);
  }
  // 204 no-content
  if (res.status === 204) return null;
  return res.json();
}

export const http = {
  get: (path, params) => req(path, { method: 'GET', params }),
  post: (path, body)    => req(path, { method: 'POST', body }),
  patch:(path, body)    => req(path, { method: 'PATCH', body }),
  put:  (path, body)    => req(path, { method: 'PUT', body }),
  del:  (path)          => req(path, { method: 'DELETE' }),
};
