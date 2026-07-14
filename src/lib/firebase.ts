import { readFileSync } from "fs";
import { resolve } from "path";
import {
  cert,
  getApps,
  initializeApp,
  type App,
} from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

let cachedApp: App | null = null;

type ServiceAccountEnv = {
  projectId: string;
  clientEmail: string;
  privateKey: string;
  storageBucket?: string;
};

let cachedServiceAccountFile: ServiceAccountEnv | null | undefined;

// Local dev fallback: read the service account JSON pointed to by
// FIREBASE_SERVICE_ACCOUNT_PATH so contributors don't have to split it into
// three separate env vars by hand. Production should set the split vars.
function readServiceAccountFile(): ServiceAccountEnv | null {
  if (cachedServiceAccountFile !== undefined) return cachedServiceAccountFile;
  const path = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
  if (!path) {
    cachedServiceAccountFile = null;
    return null;
  }
  try {
    const raw = readFileSync(resolve(process.cwd(), path), "utf-8");
    const parsed = JSON.parse(raw);
    if (!parsed.project_id || !parsed.client_email || !parsed.private_key) {
      cachedServiceAccountFile = null;
      return null;
    }
    cachedServiceAccountFile = {
      projectId: parsed.project_id,
      clientEmail: parsed.client_email,
      privateKey: parsed.private_key,
      storageBucket:
        process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ||
        `${parsed.project_id}.appspot.com`,
    };
    return cachedServiceAccountFile;
  } catch {
    cachedServiceAccountFile = null;
    return null;
  }
}

function readEnv(): ServiceAccountEnv | null {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKeyRaw = process.env.FIREBASE_PRIVATE_KEY;
  const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;

  if (projectId && clientEmail && privateKeyRaw) {
    return {
      projectId,
      clientEmail,
      privateKey: privateKeyRaw.replace(/\\n/g, "\n"),
      storageBucket,
    };
  }

  return readServiceAccountFile();
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
