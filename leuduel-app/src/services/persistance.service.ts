import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root',
})
export class PersistanceService {
  async save<T>(key: string, value: T): Promise<void> {
    await Preferences.set({ key, value: JSON.stringify(value) });
  }

  async load<T>(key: string): Promise<T | null> {
    const { value } = await Preferences.get({ key });
    if (value === null) return null;
    try {
      return JSON.parse(value) as T;
    } catch {
      return null;
    }
  }
}
