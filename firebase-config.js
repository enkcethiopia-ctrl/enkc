// ── FIREBASE CONFIG ──────────────────────────────────────────
// These values are safe to expose publicly — Firestore security
// is enforced by Firestore Rules, not by hiding this config.

const firebaseConfig = {
  apiKey: "AIzaSyBT5AbmT8K6VP7uPBxpNMtXohcOBmreOQU",
  authDomain: "enkc-2026.firebaseapp.com",
  projectId: "enkc-2026",
  storageBucket: "enkc-2026.firebasestorage.app",
  messagingSenderId: "416072907528",
  appId: "1:416072907528:web:7057191c4b16100bb94abd"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
// storage removed — grade proof photos are stored as Base64 in Firestore
