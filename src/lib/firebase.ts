import {
  cert,
  getApps,
  initializeApp,
  type App,
} from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

let cachedApp: App | null = null;

function readEnv() {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKeyRaw = process.env.FIREBASE_PRIVATE_KEY;
  const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;

  if (!projectId || !clientEmail || !privateKeyRaw) return null;

  return {
    projectId,
    clientEmail,
    privateKey: privateKeyRaw.replace(/\\n/g, "\n"),
    storageBucket,
  };
}

/**
 * Lazy admin app. Returns null when env vars are missing so build-time imports
 * don't crash; callers get a controlled error only when they actually try to use
 * Firestore or Storage.
 */
function getApp(): App | null {
  if (cachedApp) return cachedApp;
  const existing = getApps()[0];
  if (existing) {
    cachedApp = existing;
    return cachedApp;
  }
  const env = readEnv();
  if (!env) return null;
  cachedApp = initializeApp({
    credential: cert({
      projectId: env.projectId,
      clientEmail: env.clientEmail,
      privateKey: env.privateKey,
    }),
    storageBucket: env.storageBucket,
  });
  return cachedApp;
}

export function isFirebaseConfigured(): boolean {
  return readEnv() !== null;
}

export function getDb(): Firestore {
  const app = getApp();
  if (!app) {
    throw new Error(
      "Firebase not configured. Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY in env."
    );
  }
  return getFirestore(app);
}

export function getBucket() {
  const app = getApp();
  if (!app) {
    throw new Error("Firebase not configured.");
  }
  return getStorage(app).bucket();
}
