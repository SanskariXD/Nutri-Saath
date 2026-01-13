import { AgeGroup, Language, Diet, Condition, Allergen } from './common';

export interface Profile {
  id: string;
  name: string;
  ageGroup: AgeGroup;
  language: Language;
  conditions: Condition[];
  allergies: Allergen[];
  diet: Diet;
  childMode: boolean;
  abhaConnected: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProfile {
  name: string;
  ageGroup: AgeGroup;
  language: Language;
  conditions: Condition[];
  allergies: Allergen[];
  diet: Diet;
  childMode?: boolean;
  abhaConnected?: boolean;
}

export interface UpdateProfile {
  name?: string;
  ageGroup?: AgeGroup;
  language?: Language;
  conditions?: Condition[];
  allergies?: Allergen[];
  diet?: Diet;
  childMode?: boolean;
  abhaConnected?: boolean;
}

export interface ProfileSummary {
  id: string;
  name: string;
  ageGroup: AgeGroup;
  isActive: boolean;
}
