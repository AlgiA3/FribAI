import React, { useEffect, useState } from "react";
import { getDocs, collection, deleteDoc, doc } from "firebase/firestore";
import { db, auth } from "../firebase_config";
import { signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";

const Sidebar = ({ onSelectSession, user, onClose }) => {
  const [sessions, setSessions] = useState([]);

  const fetchSessions = async () => {
    const snapshot = await getDocs(collection(db, "conversations"));
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setSessions(data.reverse());
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "conversations", id));
    fetchSessions();
  };

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  useEffect(() => {
    fetchSessions();
  }, [user]);

  return (
    <div className="sidebar-overlay" onClick={onClose}>
      <div className="sidebar-container" onClick={(e) => e.stopPropagation()}>
        <div className="sidebar-header">
          <h2>Sesi <span>Percakapan</span></h2>
          <button className="sidebar-close" onClick={onClose}>✕</button>
        </div>

        <div className="sidebar-auth">
          {user ? (
            <button className="sidebar-button logout" onClick={handleLogout}>
              Logout ({user.displayName})
            </button>
          ) : (
            <button className="sidebar-button login" onClick={handleLogin}>
              Login dengan Google
            </button>
          )}
        </div>

        <div className="sidebar-sessions">
          {sessions.length === 0 ? (
            <p className="empty-history">Belum ada sesi</p>
          ) : (
            sessions.map((s) => (
              <div key={s.id} className="session-item">
                <p onClick={() => onSelectSession(s)}>{s.prompt}</p>
                <button onClick={() => handleDelete(s.id)} className="delete-btn">🗑</button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
