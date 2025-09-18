// IndexedDB helper utilities for Arena Breakout Tracker

export class ArenaBreakoutDB {
  private static instance: ArenaBreakoutDB;
  private db: IDBDatabase | null = null;
  private dbName = "arenareportDB";
  private version = 1;

  private constructor() {}

  static getInstance(): ArenaBreakoutDB {
    if (!ArenaBreakoutDB.instance) {
      ArenaBreakoutDB.instance = new ArenaBreakoutDB();
    }
    return ArenaBreakoutDB.instance;
  }

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => {
        reject(new Error(`Failed to open IndexedDB: ${request.error?.message}`));
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // Create profiles store
        if (!db.objectStoreNames.contains("profiles")) {
          const profileStore = db.createObjectStore("profiles", { keyPath: "id" });
          profileStore.createIndex("name", "name", { unique: false });
        }
        
        // Create current profile store (stores just the current profile ID)
        if (!db.objectStoreNames.contains("currentProfile")) {
          const currentProfileStore = db.createObjectStore("currentProfile", { keyPath: "id" });
        }
      };
    });
  }

  async getProfiles(): Promise<any[]> {
    if (!this.db) {
      throw new Error("Database not initialized");
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["profiles"], "readonly");
      const store = transaction.objectStore("profiles");
      const request = store.getAll();

      request.onsuccess = () => {
        resolve(request.result || []);
      };

      request.onerror = () => {
        reject(new Error(`Failed to get profiles: ${request.error?.message}`));
      };
    });
  }

  async saveProfiles(profiles: any[]): Promise<void> {
    if (!this.db) {
      throw new Error("Database not initialized");
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["profiles"], "readwrite");
      const store = transaction.objectStore("profiles");
      
      // Clear existing profiles
      store.clear();
      
      // Add all profiles
      profiles.forEach(profile => {
        store.put(profile);
      });

      transaction.oncomplete = () => {
        resolve();
      };

      transaction.onerror = () => {
        reject(new Error(`Failed to save profiles: ${transaction.error?.message}`));
      };
    });
  }

  async getCurrentProfileId(): Promise<string | null> {
    if (!this.db) {
      throw new Error("Database not initialized");
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["currentProfile"], "readonly");
      const store = transaction.objectStore("currentProfile");
      const request = store.get("current");

      request.onsuccess = () => {
        resolve(request.result?.profileId || null);
      };

      request.onerror = () => {
        reject(new Error(`Failed to get current profile ID: ${request.error?.message}`));
      };
    });
  }

  async saveCurrentProfileId(profileId: string): Promise<void> {
    if (!this.db) {
      throw new Error("Database not initialized");
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["currentProfile"], "readwrite");
      const store = transaction.objectStore("currentProfile");
      store.put({ id: "current", profileId });

      transaction.oncomplete = () => {
        resolve();
      };

      transaction.onerror = () => {
        reject(new Error(`Failed to save current profile ID: ${transaction.error?.message}`));
      };
    });
  }

  async clearAllData(): Promise<void> {
    if (!this.db) {
      throw new Error("Database not initialized");
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["profiles", "currentProfile"], "readwrite");
      const profileStore = transaction.objectStore("profiles");
      const currentProfileStore = transaction.objectStore("currentProfile");
      
      profileStore.clear();
      currentProfileStore.clear();

      transaction.oncomplete = () => {
        resolve();
      };

      transaction.onerror = () => {
        reject(new Error(`Failed to clear data: ${transaction.error?.message}`));
      };
    });
  }
}