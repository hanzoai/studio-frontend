import type { FirebaseOptions } from 'firebase/app'

import { isCloud } from '@/platform/distribution/types'
import { remoteConfig } from '@/platform/remoteConfig/remoteConfig'

const DEV_CONFIG: FirebaseOptions = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY ?? '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ?? '',
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL ?? '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ?? '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ?? '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID ?? '',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID ?? ''
}

const PROD_CONFIG: FirebaseOptions = {
  apiKey: import.meta.env.VITE_FIREBASE_PROD_API_KEY ?? '',
  authDomain: import.meta.env.VITE_FIREBASE_PROD_AUTH_DOMAIN ?? '',
  databaseURL: import.meta.env.VITE_FIREBASE_PROD_DATABASE_URL ?? '',
  projectId: import.meta.env.VITE_FIREBASE_PROD_PROJECT_ID ?? '',
  storageBucket: import.meta.env.VITE_FIREBASE_PROD_STORAGE_BUCKET ?? '',
  messagingSenderId:
    import.meta.env.VITE_FIREBASE_PROD_MESSAGING_SENDER_ID ?? '',
  appId: import.meta.env.VITE_FIREBASE_PROD_APP_ID ?? '',
  measurementId: import.meta.env.VITE_FIREBASE_PROD_MEASUREMENT_ID ?? ''
}

const BUILD_TIME_CONFIG = __USE_PROD_CONFIG__ ? PROD_CONFIG : DEV_CONFIG

/**
 * Returns the Firebase configuration for the current environment.
 * - Cloud builds use runtime configuration delivered via feature flags
 * - OSS / localhost builds fall back to the build-time config determined by __USE_PROD_CONFIG__
 */
export function getFirebaseConfig(): FirebaseOptions {
  if (!isCloud) {
    return BUILD_TIME_CONFIG
  }

  const runtimeConfig = remoteConfig.value.firebase_config
  return runtimeConfig ?? BUILD_TIME_CONFIG
}
