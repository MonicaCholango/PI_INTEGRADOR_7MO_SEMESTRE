import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { BehaviorSubject } from 'rxjs';
import { STORAGE_KEYS } from '../models/constants';
import { Usuario } from '../models/interfaces';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private storage: Storage | null = null;
  private initSubject = new BehaviorSubject<boolean>(false);
  public isReady$ = this.initSubject.asObservable();

  constructor(private storageService: Storage) {
    this.init();
  }

  async init(): Promise<void> {
    try {
      this.storage = await this.storageService.create();
      this.initSubject.next(true);
      console.log('Storage initialized successfully');
    } catch (error) {
      console.error('Error initializing storage:', error);
      this.initSubject.next(false);
    }
  }


  private async waitForStorage(): Promise<void> {
    if (!this.storage) {
      await new Promise<void>((resolve) => {
        const subscription = this.isReady$.subscribe((isReady) => {
          if (isReady && this.storage) {
            subscription.unsubscribe();
            resolve();
          }
        });
      });
    }
  }


  async set(key: string, value: any): Promise<any> {
    try {
      await this.waitForStorage();
      return await this.storage?.set(key, value);
    } catch (error) {
      console.error(`Error setting ${key}:`, error);
      throw error;
    }
  }

 
  async get(key: string): Promise<any> {
    try {
      await this.waitForStorage();
      return await this.storage?.get(key);
    } catch (error) {
      console.error(`Error getting ${key}:`, error);
      return null;
    }
  }

 
  async remove(key: string): Promise<any> {
    try {
      await this.waitForStorage();
      return await this.storage?.remove(key);
    } catch (error) {
      console.error(`Error removing ${key}:`, error);
      throw error;
    }
  }

 
  async clear(): Promise<void> {
    try {
      await this.waitForStorage();
      await this.storage?.clear();
    } catch (error) {
      console.error('Error clearing storage:', error);
      throw error;
    }
  }

  async keys(): Promise<string[]> {
    try {
      await this.waitForStorage();
      return await this.storage?.keys() || [];
    } catch (error) {
      console.error('Error getting keys:', error);
      return [];
    }
  }


  async has(key: string): Promise<boolean> {
    try {
      const value = await this.get(key);
      return value !== null && value !== undefined;
    } catch (error) {
      console.error(`Error checking if ${key} exists:`, error);
      return false;
    }
  }


  async setUser(user: Usuario): Promise<void> {
    await this.set(STORAGE_KEYS.USER, user);
  }

 
  async getUser(): Promise<Usuario | null> {
    return await this.get(STORAGE_KEYS.USER);
  }

 
  async removeUser(): Promise<void> {
    await this.remove(STORAGE_KEYS.USER);
  }

 
  async setTheme(theme: string): Promise<void> {
    await this.set(STORAGE_KEYS.THEME, theme);
  }

 
  async getTheme(): Promise<string | null> {
    return await this.get(STORAGE_KEYS.THEME);
  }


  async setLanguage(language: string): Promise<void> {
    await this.set(STORAGE_KEYS.LANGUAGE, language);
  }


  async getLanguage(): Promise<string | null> {
    return await this.get(STORAGE_KEYS.LANGUAGE);
  }


  async setLastSync(timestamp: number): Promise<void> {
    await this.set(STORAGE_KEYS.LAST_SYNC, timestamp);
  }

  async getLastSync(): Promise<number | null> {
    return await this.get(STORAGE_KEYS.LAST_SYNC);
  }

  async setOfflineData(key: string, data: any): Promise<void> {
    const offlineData = await this.get(STORAGE_KEYS.OFFLINE_DATA) || {};
    offlineData[key] = {
      data,
      timestamp: Date.now()
    };
    await this.set(STORAGE_KEYS.OFFLINE_DATA, offlineData);
  }

 
  async getOfflineData(key: string): Promise<any> {
    const offlineData = await this.get(STORAGE_KEYS.OFFLINE_DATA) || {};
    return offlineData[key]?.data || null;
  }

 
  async removeOfflineData(key: string): Promise<void> {
    const offlineData = await this.get(STORAGE_KEYS.OFFLINE_DATA) || {};
    delete offlineData[key];
    await this.set(STORAGE_KEYS.OFFLINE_DATA, offlineData);
  }


  async cleanOldOfflineData(maxDays: number = 7): Promise<void> {
    const offlineData = await this.get(STORAGE_KEYS.OFFLINE_DATA) || {};
    const maxAge = maxDays * 24 * 60 * 60 * 1000; // Convertir días a millisegundos
    const now = Date.now();

    Object.keys(offlineData).forEach(key => {
      const item = offlineData[key];
      if (item.timestamp && (now - item.timestamp) > maxAge) {
        delete offlineData[key];
      }
    });

    await this.set(STORAGE_KEYS.OFFLINE_DATA, offlineData);
  }


  async exportData(): Promise<any> {
    try {
      const keys = await this.keys();
      const data: any = {};
      
      for (const key of keys) {
        data[key] = await this.get(key);
      }
      
      return {
        data,
        exportDate: new Date().toISOString(),
        version: '1.0'
      };
    } catch (error) {
      console.error('Error exporting data:', error);
      throw error;
    }
  }


  async importData(exportedData: any): Promise<void> {
    try {
      if (!exportedData.data) {
        throw new Error('Invalid exported data format');
      }

      await this.clear();

      for (const [key, value] of Object.entries(exportedData.data)) {
        await this.set(key, value);
      }

      console.log('Data imported successfully');
    } catch (error) {
      console.error('Error importing data:', error);
      throw error;
    }
  }

 
  async getStorageInfo(): Promise<any> {
    try {
      const keys = await this.keys();
      const info = {
        totalKeys: keys.length,
        keys: keys,
        lastUpdate: new Date().toISOString()
      };

      return info;
    } catch (error) {
      console.error('Error getting storage info:', error);
      return null;
    }
  }
}