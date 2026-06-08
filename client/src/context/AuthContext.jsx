import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { authApi } from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Hydrate the session from a stored token on first load.
  useEffect(() => {
    const token = localStorage.getItem('helfy_token');
    if (!token) {
      setLoading(false);
      return;
    }
    authApi
      .me()
      .then((d) => setUser(d.user))
      .catch(() => localStorage.removeItem('helfy_token'))
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email, password) => {
    const d = await authApi.login({ email, password });
    localStorage.setItem('helfy_token', d.token);
    setUser(d.user);
    return d.user;
  }, []);

  const register = useCallback(async (payload) => {
    const d = await authApi.register(payload);
    localStorage.setItem('helfy_token', d.token);
    setUser(d.user);
    return d.user;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('helfy_token');
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
