// src/services/http.js
// Client "HTTP" 100% front (statique) OU distant, avec une seule export.
// Corrige "Cannot access 'http' before initialization".

const USE_STATIC =
  import.meta.env.VITE_FORCE_STATIC === '1' ||
  !import.meta.env.VITE_API_URL;

/* -----------------------------
   Implémentation STATIQUE (front)
   ----------------------------- */
function createStaticHttp() {
  const DATA_URL =
    import.meta.env.VITE_DATA_URL ||
    `${import.meta.env.BASE_URL || '/'}public/db.json`; // ex: /<repo>/db.json sur GH Pages


    console.log('DATA_URL', DATA_URL);
    
  const LS_KEY = 'mockdb:v1';
  let mem = null;
  let readyPromise = null;

  function ensureArrays(d) {
    for (const k of Object.keys(d)) if (!Array.isArray(d[k])) d[k] = [];
  }
  function save() {
    if (mem) localStorage.setItem(LS_KEY, JSON.stringify(mem));
  }
  async function load() {
    if (mem) return mem;
    if (!readyPromise) {
      readyPromise = (async () => {
        const raw = localStorage.getItem(LS_KEY);
        if (raw) {
          mem = JSON.parse(raw);
          ensureArrays(mem);
          return;
        }
        const res = await fetch(DATA_URL, { cache: 'no-cache' });
        if (!res.ok) throw new Error(`Seed fetch failed: ${res.status}`);
        mem = await res.json();
        ensureArrays(mem);
        save();
      })();
    }
    await readyPromise;
    return mem;
  }

  function parsePath(path) {
    const clean = String(path).replace(/^\//, '');
    const p = clean.startsWith('api/') ? clean.slice(4) : clean;
    const [resource, id] = p.split('/');
    return { resource, id };
  }

  function toInt(v, def) {
    const n = parseInt(String(v), 10);
    return Number.isFinite(n) ? n : def;
  }
  function matches(item, query) {
    for (const [k, v] of Object.entries(query || {})) {
      if (['_page','_limit','_sort','_order','q'].includes(k)) continue;
      const iv = item?.[k];
      if (typeof v === 'string' && typeof iv === 'string') {
        if (iv.toLowerCase() !== v.toLowerCase()) return false;
      } else if (iv != v) {
        return false;
      }
    }
    return true;
  }
  function fullText(item, needle) {
    if (!needle) return true;
    return JSON.stringify(item).toLowerCase().includes(String(needle).toLowerCase());
  }
  function sortItems(items, sortKey, order) {
    if (!sortKey) return items;
    const dir = (order || 'asc').toLowerCase() === 'desc' ? -1 : 1;
    return [...items].sort((a, b) => {
      const va = a?.[sortKey], vb = b?.[sortKey];
      if (va === vb) return 0;
      return va > vb ? dir : -dir;
    });
  }
  function uuid() {
    return (crypto?.randomUUID?.() || Math.random().toString(36).slice(2));
  }

  async function GET(path, params) {
    const { resource, id } = parsePath(path);
    const db = await load();

    if (!resource) return { ok: true, resources: Object.keys(db) };
    if (resource === 'health') return { ok: true, resources: Object.keys(db) };

    const data = db[resource];
    if (!data) throw new Error(`[HTTP 404] ${path} – Resource not found`);

    if (id) {
      const found = data.find((x) => String(x?.id) === String(id));
      if (!found) throw new Error(`[HTTP 404] ${path} – Not found`);
      return found;
    }

    const { _page, _limit, _sort, _order, q, ...filters } = params || {};
    let items = data.filter((x) => matches(x, filters));
    if (q) items = items.filter((x) => fullText(x, q));
    items = sortItems(items, _sort, _order);

    const page = Math.max(1, toInt(_page, 1));
    const limit = Math.max(1, Math.min(1000, toInt(_limit, items.length)));
    const start = (page - 1) * limit;
    const end = start + limit;
    return items.slice(start, end);
  }

  async function POST(path, body) {
    const { resource } = parsePath(path);
    const db = await load();
    const data = db[resource];
    if (!data) throw new Error(`[HTTP 404] ${path} – Resource not found`);
    const item = { ...(body || {}) };
    if (!('id' in item)) item.id = uuid();
    data.push(item);
    save();
    return item;
  }

  async function PATCH(path, body) {
    const { resource, id } = parsePath(path);
    const db = await load();
    const data = db[resource];
    if (!data) throw new Error(`[HTTP 404] ${path} – Resource not found`);
    const idx = data.findIndex((x) => String(x?.id) === String(id));
    if (idx < 0) throw new Error(`[HTTP 404] ${path} – Not found`);
    data[idx] = { ...data[idx], ...(body || {}), id: data[idx].id };
    save();
    return data[idx];
  }

  async function PUT(path, body) {
    const { resource, id } = parsePath(path);
    const db = await load();
    const data = db[resource];
    if (!data) throw new Error(`[HTTP 404] ${path} – Resource not found`);
    const idx = data.findIndex((x) => String(x?.id) === String(id));
    if (idx < 0) throw new Error(`[HTTP 404] ${path} – Not found`);
    data[idx] = { ...(body || {}), id: data[idx].id };
    save();
    return data[idx];
  }

  async function DEL(path) {
    const { resource, id } = parsePath(path);
    const db = await load();
    const data = db[resource];
    if (!data) throw new Error(`[HTTP 404] ${path} – Resource not found`);
    const idx = data.findIndex((x) => String(x?.id) === String(id));
    if (idx < 0) throw new Error(`[HTTP 404] ${path} – Not found`);
    const [removed] = data.splice(idx, 1);
    save();
    return removed;
  }

  return {
    get:   (path, params) => GET(path, params),
    post:  (path, body)   => POST(path, body),
    patch: (path, body)   => PATCH(path, body),
    put:   (path, body)   => PUT(path, body),
    del:   (path)         => DEL(path),
  };
}

/* -----------------------------
   Implémentation DISTANTE (HTTP)
   ----------------------------- */
function createRemoteHttp() {
  const BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000';

  function buildUrl(path, params) {
    const url = new URL(String(path).replace(/^\//, ''), BASE + '/');
    if (params && typeof params === 'object') {
      Object.entries(params).forEach(([k, v]) => {
        if (v === undefined || v === null || v === '') return;
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
    if (res.status === 204) return null;
    return res.json();
  }

  return {
    get:   (path, params) => req(path, { method: 'GET', params }),
    post:  (path, body)   => req(path, { method: 'POST', body }),
    patch: (path, body)   => req(path, { method: 'PATCH', body }),
    put:   (path, body)   => req(path, { method: 'PUT', body }),
    del:   (path)         => req(path, { method: 'DELETE' }),
  };
}

/* -----------------------------
   Sélection et export unique
   ----------------------------- */
const http = USE_STATIC ? createStaticHttp() : createRemoteHttp();
export { http };
