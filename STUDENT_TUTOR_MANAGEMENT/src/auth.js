// src/auth.js
export const auth = {
  isLoggedIn() {
    return !!localStorage.getItem("token");
  },
  login({ email, password }) {
    // demo: accept anything non-empty
    if (email?.trim() && password?.trim()) {
      localStorage.setItem("token", "demo-token");
      localStorage.setItem("user", email);
      return true;
    }
    return false;
  },
  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },
  user() {
    return localStorage.getItem("user") || "guest";
  }
};
