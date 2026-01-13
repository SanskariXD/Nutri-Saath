export const getOnboardingComplete = (): boolean => {
  try {
    const value = localStorage.getItem('onboardingComplete');
    return value === 'true';
  } catch {
    return false;
  }
};

export const setOnboardingComplete = (value: boolean): void => {
  try {
    localStorage.setItem('onboardingComplete', value ? 'true' : 'false');
  } catch {
    // ignore
  }
};

export interface AuthUser {
  userId: string;
  name: string;
}

export const getAuthUser = (): AuthUser | null => {
  try {
    const json = localStorage.getItem('auth.user');
    if (!json) return null;
    return JSON.parse(json) as AuthUser;
  } catch {
    return null;
  }
};

export const setAuthUser = (user: AuthUser | null): void => {
  try {
    if (user) {
      localStorage.setItem('auth.user', JSON.stringify(user));
    } else {
      localStorage.removeItem('auth.user');
    }
  } catch {
    // ignore
  }
};
