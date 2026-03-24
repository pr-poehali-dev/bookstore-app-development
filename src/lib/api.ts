const AUTH_URL = "https://functions.poehali.dev/e71a1538-5a82-40f3-8d66-6bd766140d39";
const DATA_URL = "https://functions.poehali.dev/2f9b50ff-f9b4-444b-94f5-c19df7152c20";

function getToken(): string {
  return localStorage.getItem("session_token") || "";
}

function authHeaders() {
  return { "Content-Type": "application/json", "X-Session-Token": getToken() };
}

async function post(url: string, path: string, body: object) {
  const r = await fetch(url + path, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(body),
  });
  return r.json();
}

async function get(url: string, path: string) {
  const r = await fetch(url + path, { method: "GET", headers: authHeaders() });
  return r.json();
}

export const api = {
  auth: {
    register: (email: string, password: string, name: string) =>
      post(AUTH_URL, "/register", { email, password, name }),
    login: (email: string, password: string) =>
      post(AUTH_URL, "/login", { email, password }),
    me: () => get(AUTH_URL, "/me"),
    logout: () => post(AUTH_URL, "/logout", {}),
  },
  cart: {
    get: () => get(DATA_URL, "/cart"),
    add: (bookId: number, qty = 1) => post(DATA_URL, "/cart/add", { bookId, qty }),
    update: (bookId: number, qty: number) => post(DATA_URL, "/cart/update", { bookId, qty }),
    remove: (bookId: number) => post(DATA_URL, "/cart/remove", { bookId }),
    clear: () => post(DATA_URL, "/cart/clear", {}),
  },
  favorites: {
    get: () => get(DATA_URL, "/favorites"),
    toggle: (bookId: number) => post(DATA_URL, "/favorites/toggle", { bookId }),
  },
};
