// src/services/auth.js
// Auth 100% front : lit public/data/users.json (ou VITE_AUTH_URL) et gère la session via localStorage.
// Aucune dépendance à UsersService.

const USERS_URL =
  import.meta.env.VITE_AUTH_URL ||
  `${import.meta.env.BASE_URL || '/'}data/users.json`; // ex: /<repo>/data/users.json sur GH Pages

const LS_USER  = 'auth:user';
const LS_TOKEN = 'auth:token';

console.log('USERS_URL', USERS_URL);


let usersCache = null;

async function loadUsers() {
  if (usersCache) return usersCache;
  const res = await fetch(USERS_URL, { cache: 'no-cache' });
  if (!res.ok) throw new Error(`Auth users fetch failed: ${res.status}`);
  const data = await res.json();
  if (!Array.isArray(data)) throw new Error('users.json invalide (doit être un tableau)');
  usersCache = data;
  return usersCache;
}

function saveSession(user) {
  const token = `demo-${user.id}-${Date.now()}`;
  localStorage.setItem(LS_USER, JSON.stringify(user));
  localStorage.setItem(LS_TOKEN, token);
  return token;
}

export const AuthService = {
  async login(email, password) {
    const users = await loadUsers();
    const u = users.find(
      (x) =>
        String(x.email || '').toLowerCase() === String(email || '').toLowerCase() &&
        String(x.password || '') === String(password || '')
    );
    if (!u) throw new Error('Identifiants invalides');

    const { password: _omit, ...safeUser } = u; // ne pas garder le mdp
    const token = saveSession(safeUser);
    return { user: safeUser, token };
  },

  // Renvoie l'utilisateur courant (depuis localStorage) ou cherche par id dans users.json
  async me(userId) {
    const raw = localStorage.getItem(LS_USER);
    if (raw) return JSON.parse(raw);
    if (!userId) return null;

    try {
      const users = await loadUsers();
      const u = users.find((x) => String(x.id) === String(userId));
      if (!u) return null;
      const { password: _omit, ...safeUser } = u;
      return safeUser;
    } catch {
      return null;
    }
  },

  logout() {
    localStorage.removeItem(LS_USER);
    localStorage.removeItem(LS_TOKEN);
  },

  isAuthenticated() {
    return !!localStorage.getItem(LS_TOKEN);
  },

  currentUser() {
    const raw = localStorage.getItem(LS_USER);
    return raw ? JSON.parse(raw) : null;
  },

  getToken() {
    return localStorage.getItem(LS_TOKEN);
  },
};
