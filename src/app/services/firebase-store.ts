import { Injectable } from '@angular/core';
import type { FirebaseApp, FirebaseOptions } from 'firebase/app';
import type { User } from 'firebase/auth';

const webAppId = '1:302989464846:web:4c2f3c07256145284c735f';

export interface FirebaseOrder {
  folio: string;
  createdAt: Date;
  quantity: number;
}

@Injectable({ providedIn: 'root' })
export class FirebaseStore {
  private appPromise?: Promise<FirebaseApp>;

  async watchUser(listener: (user: User | null) => void): Promise<void> {
    const { sdk, auth } = await this.auth();
    sdk.onAuthStateChanged(auth, listener);
  }

  async login(email: string, password: string): Promise<User> {
    const { sdk, auth } = await this.auth();
    const result = await sdk.signInWithEmailAndPassword(auth, email.trim(), password);
    return result.user;
  }

  async register(name: string, email: string, password: string): Promise<User> {
    const { sdk, auth } = await this.auth();
    const result = await sdk.createUserWithEmailAndPassword(auth, email.trim(), password);
    await sdk.updateProfile(result.user, { displayName: name.trim() });
    return result.user;
  }

  async logout(): Promise<void> {
    const { sdk, auth } = await this.auth();
    await sdk.signOut(auth);
  }

  async getOrders(): Promise<FirebaseOrder[]> {
    const { sdk, db, uid } = await this.ordersDatabase();
    const orders = sdk.collection(db, 'aevonUsers', uid, 'orders');
    const result = await sdk.getDocs(sdk.query(orders, sdk.orderBy('createdAt', 'desc'), sdk.limit(25)));
    return result.docs.map(order => {
      const data = order.data() as { createdAt: { toDate(): Date }; items: Record<string, number> };
      return {
        folio: order.id,
        createdAt: data.createdAt.toDate(),
        quantity: Object.values(data.items).reduce((total, quantity) => total + quantity, 0)
      };
    });
  }

  async placeOrder(folio: string, items: Record<string, number>): Promise<void> {
    const { sdk, db, uid } = await this.ordersDatabase();
    const order = sdk.doc(db, 'aevonUsers', uid, 'orders', folio);
    await sdk.runTransaction(db, async transaction => {
      const existing = await transaction.get(order);
      if (!existing.exists()) {
        transaction.set(order, { items, createdAt: sdk.serverTimestamp() });
      }
    });
  }

  private async auth() {
    const [app, sdk] = await Promise.all([this.app(), import('firebase/auth')]);
    return { sdk, auth: sdk.getAuth(app) };
  }

  private async ordersDatabase() {
    const [{ auth }, app, sdk] = await Promise.all([this.auth(), this.app(), import('firebase/firestore')]);
    const uid = auth.currentUser?.uid;
    if (!uid) throw new Error('Inicia sesión para consultar o registrar pedidos.');
    return { sdk, db: sdk.getFirestore(app), uid };
  }

  private app(): Promise<FirebaseApp> {
    return this.appPromise ??= this.initialize().catch(error => {
      this.appPromise = undefined;
      throw error;
    });
  }

  private async initialize(): Promise<FirebaseApp> {
    const response = await fetch('/__/firebase/init.json');
    if (!response.ok) throw new Error('No se pudo obtener la configuración de Firebase.');
    const config = await response.json() as FirebaseOptions;
    if (config.projectId !== 'aevon-b8917' || !config.apiKey) {
      throw new Error('La configuración de Firebase no corresponde a AEVON.');
    }
    const { initializeApp } = await import('firebase/app');
    return initializeApp({ ...config, appId: webAppId }, 'aevon-web');
  }
}
