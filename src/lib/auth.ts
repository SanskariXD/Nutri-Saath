const isLocalNetwork = (hostname: string): boolean => {
  // Check for localhost and loopback
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return true;
  }

  // Check for private IP ranges
  const ipMatch = hostname.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (ipMatch) {
    const [_, a, b, c, d] = ipMatch.map(Number);
    // 192.168.x.x
    if (a === 192 && b === 168) return true;
    // 10.x.x.x
    if (a === 10) return true;
    // 172.16.x.x to 172.31.x.x
    if (a === 172 && b >= 16 && b <= 31) return true;
  }

  return false;
};

const resolveApiBaseUrl = (): string => {
  const metaEnv = (import.meta as any)?.env;

  // 1. Check for manual override via environment variable (BEST for Vercel)
  if (metaEnv?.VITE_API_URL) {
    return metaEnv.VITE_API_URL;
  }

  // 2. Check for runtime override
  if (typeof window !== 'undefined' && typeof (window as any).__LABEL_API_URL__ === 'string') {
    return (window as any).__LABEL_API_URL__ as string;
  }

  // 3. Detect Development Environment
  const isLocal = typeof window !== 'undefined' && isLocalNetwork(window.location.hostname);
  const isDevelopment = metaEnv?.MODE === 'development' || metaEnv?.DEV === true || isLocal;

  if (isDevelopment) {
    // In local dev, we typically use the Vite proxy defined in vite.config.ts
    return '/api';
  }

  // 4. Production Fallback
  // Since we are deploying both to Vercel, we can use the relative path
  return '/api';
};

export const API_BASE_URL = resolveApiBaseUrl();

export interface AuthUser {
  id: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
}

export interface AuthResult {
  token: string;
  user: AuthUser;
}

class AuthService {
  private tokenKey = 'auth.token';
  private userKey = 'auth.user';

  async authenticateWithGoogle(idToken: string): Promise<AuthResult> {
    const response = await fetch(`${API_BASE_URL}/api/auth/google`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ idToken }),
    });

    if (!response.ok) {
      const text = await response.text().catch(() => '');
      throw new Error(`Authentication failed: ${text || response.statusText}`);
    }

    const result: AuthResult = await response.json();
    this.setToken(result.token);
    this.setUser(result.user);
    return result;
  }

  getToken(): string | null {
    try {
      return localStorage.getItem(this.tokenKey);
    } catch {
      return null;
    }
  }

  setToken(token: string): void {
    try {
      localStorage.setItem(this.tokenKey, token);
    } catch {
      // ignore
    }
  }

  getUser(): AuthUser | null {
    try {
      const json = localStorage.getItem(this.userKey);
      if (!json) return null;
      return JSON.parse(json) as AuthUser;
    } catch {
      return null;
    }
  }

  setUser(user: AuthUser): void {
    try {
      localStorage.setItem(this.userKey, JSON.stringify(user));
    } catch {
      // ignore
    }
  }

  logout(): void {
    try {
      localStorage.removeItem(this.tokenKey);
      localStorage.removeItem(this.userKey);
    } catch {
      // ignore
    }
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

export const authService = new AuthService();
