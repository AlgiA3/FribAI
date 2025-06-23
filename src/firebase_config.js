import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  getFirestore, collection, addDoc, getDocs, deleteDoc,
  doc, query, where, orderBy
} from "firebase/firestore";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDqJDIMsDn2M9fuUcByogXEVnKSLgjk6fI",
  authDomain: "aitalk-22d2d.firebaseapp.com",
  databaseURL: "https://aitalk-22d2d-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "aitalk-22d2d",
  storageBucket: "aitalk-22d2d.firebasestorage.app",
  messagingSenderId: "992295814297",
  appId: "1:992295814297:web:51d0de3e8a1a1ea3fd2408",
  measurementId: "G-NFEC9VJJHM"
};

const app = initializeApp(firebaseConfig);
getAnalytics(app);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();

// Simpan pesan dengan sessionId atau userId
export const saveConversation = async (prompt, response, userId, sessionId) => {
  try {
    await addDoc(collection(db, "conversations"), {
      prompt, response, userId: userId || null,
      sessionId: sessionId || null,
      timestamp: new Date()
    });
  } catch (e) { console.error(e); }
};

// Ambil riwayat
export const getConversations = async (userId, sessionId) => {
  const field = userId ? "userId" : "sessionId";
  const val = userId || sessionId;
  const q = query(
    collection(db, "conversations"),
    where(field, "==", val),
    orderBy("timestamp", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

// Hapus
export const deleteConversation = async (id) => {
  try { await deleteDoc(doc(db, "conversations", id)); }
  catch(e){ console.error(e); }
};

// Google Auth
export const signInWithGoogle = () => signInWithPopup(auth, provider);
export const signOutUser = () => signOut(auth);