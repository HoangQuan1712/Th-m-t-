/* ============================================================
   THÁM TỬ KINH TẾ — Firebase Configuration
   Sử dụng Firebase CDN (không cần bundler)
   ============================================================ */

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyA2fegeTA0fDFRlL346yyHuBvbDDOu5HL0",
  authDomain: "thamtukinhte12.firebaseapp.com",
  projectId: "thamtukinhte12",
  storageBucket: "thamtukinhte12.firebasestorage.app",
  messagingSenderId: "920202175883",
  appId: "1:920202175883:web:da2dc6b4664c728f133b8e",
  measurementId: "G-P3WPPM1238"
};

// Khởi tạo Firebase
const app = firebase.initializeApp(firebaseConfig);

// Các services
const db        = firebase.firestore();
const auth      = firebase.auth();
const storage   = firebase.storage();
const analytics = firebase.analytics();

// Cấu hình Firestore để hoạt động offline
db.enablePersistence().catch(err => {
  if (err.code === 'failed-precondition') {
    console.warn('Firestore persistence: multiple tabs open');
  } else if (err.code === 'unimplemented') {
    console.warn('Firestore persistence: not supported in this browser');
  }
});

console.log('🔥 Firebase initialized successfully');
