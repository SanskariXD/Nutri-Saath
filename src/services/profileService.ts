import { Profile, CreateProfile, UpdateProfile } from '@/types/profile';
import { authService, API_BASE_URL } from '@/lib/auth';

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = authService.getToken();
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    ...options,
  });
  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(`HTTP ${response.status}: ${text || response.statusText}`);
  }
  return response.json();
}

export class ProfileService {
  static async getProfiles(): Promise<Profile[]> {
    const data = await request<{ profiles: Profile[] }>(`/api/profile`);
    return data.profiles;
  }

  static async getProfile(id: string): Promise<Profile> {
    const data = await request<{ profile: Profile }>(`/api/profile/${id}`);
    return data.profile;
  }

  static async createProfile(profile: CreateProfile): Promise<Profile> {
    const data = await request<{ profile: Profile }>(`/api/profile`, {
      method: 'POST',
      body: JSON.stringify(profile),
    });
    return data.profile;
  }

  static async updateProfile(id: string, profile: UpdateProfile): Promise<Profile> {
    const data = await request<{ profile: Profile }>(`/api/profile/${id}`, {
      method: 'PUT',
      body: JSON.stringify(profile),
    });
    return data.profile;
  }

  static async deleteProfile(id: string): Promise<void> {
    await request<void>(`/api/profile/${id}`, {
      method: 'DELETE',
    });
  }
}
