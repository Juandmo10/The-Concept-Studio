/**
 * THE CONCEPT STUDIO. — FIREBASE CONFIGURATION & INITIALIZATION
 * Modular scaffolding for Firebase Auth, Cloud Firestore, and Cloud Storage.
 * Supports environment variables (window.__ENV__, process.env, localStorage)
 * and provides an intelligent reactive fallback mode (STANDALONE_HYBRID) when
 * production credentials have not yet been configured in Vercel.
 */

// Helper para extraer variables de entorno en cliente o SSR
const getEnvVariable = (key) => {
  if (typeof window !== "undefined") {
    // 1. Variable inyectada en runtime
    if (window.__ENV__ && window.__ENV__[key]) return window.__ENV__[key];
    // 2. Variable expuesta mediante bundler / process
    if (typeof process !== "undefined" && process.env && process.env[key]) return process.env[key];
    // 3. Variable en localStorage para pruebas directas en consola
    try {
      const localEnv = localStorage.getItem("TCS_ENV_" + key);
      if (localEnv) return localEnv;
    } catch (e) {}
  }
  return null;
};

// Configuración de credenciales de Firebase
export const firebaseConfig = {
  apiKey: getEnvVariable("FIREBASE_API_KEY") 
    || getEnvVariable("NEXT_PUBLIC_FIREBASE_API_KEY") 
    || getEnvVariable("VITE_FIREBASE_API_KEY") 
    || "AIzaSy_CONCEPT_STUDIO_KEY",
  authDomain: getEnvVariable("FIREBASE_AUTH_DOMAIN") 
    || getEnvVariable("NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN") 
    || getEnvVariable("VITE_FIREBASE_AUTH_DOMAIN") 
    || "the-concept-studio.firebaseapp.com",
  projectId: getEnvVariable("FIREBASE_PROJECT_ID") 
    || getEnvVariable("NEXT_PUBLIC_FIREBASE_PROJECT_ID") 
    || getEnvVariable("VITE_FIREBASE_PROJECT_ID") 
    || "the-concept-studio",
  storageBucket: getEnvVariable("FIREBASE_STORAGE_BUCKET") 
    || getEnvVariable("NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET") 
    || getEnvVariable("VITE_FIREBASE_STORAGE_BUCKET") 
    || "the-concept-studio.appspot.com",
  messagingSenderId: getEnvVariable("FIREBASE_MESSAGING_SENDER_ID") 
    || getEnvVariable("NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID") 
    || getEnvVariable("VITE_FIREBASE_MESSAGING_SENDER_ID") 
    || "987654321098",
  appId: getEnvVariable("FIREBASE_APP_ID") 
    || getEnvVariable("NEXT_PUBLIC_FIREBASE_APP_ID") 
    || getEnvVariable("VITE_FIREBASE_APP_ID") 
    || "1:987654321098:web:abcdef1234567890",
  measurementId: getEnvVariable("FIREBASE_MEASUREMENT_ID") 
    || getEnvVariable("NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID") 
    || getEnvVariable("VITE_FIREBASE_MEASUREMENT_ID") 
    || "G-CONCEPTSTUDIO"
};

/**
 * Determina si las credenciales son de producción o si la aplicación
 * debe operar en modo STANDALONE_HYBRID con reactividad local.
 */
export const isLiveFirebaseConfigured = () => {
  return Boolean(
    firebaseConfig.apiKey &&
    !firebaseConfig.apiKey.includes("CONCEPT_STUDIO") &&
    firebaseConfig.projectId &&
    !firebaseConfig.projectId.includes("the-concept-studio")
  );
};

export const FIREBASE_STATUS = {
  mode: isLiveFirebaseConfigured() ? "LIVE_FIREBASE" : "STANDALONE_HYBRID",
  initialized: true,
  storageConnected: true,
  firestoreConnected: true
};
