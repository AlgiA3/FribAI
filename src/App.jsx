import React, { useContext, useState, useEffect } from "react";
import "./App.css";
import { Canvas } from "@react-three/fiber";
import Sidebar from "./components/sidebar";
import { Experience } from "./components/Experience";
import { CiMicrophoneOn } from "react-icons/ci";
import { dataContext } from "./Context/user_context.jsx";
import Personalization from "./components/personalisasi.jsx";
import SplashScreen from "./components/splashScreen.jsx";
import { IoArrowBackOutline } from "react-icons/io5";

function App() {
  const {
    user,
    setSpeaking,
    setResponse,
    setPrompt,
    setConversation,
    conversation,
    isListening,
    setIsListening,
    startRecording,
    stopRecording,
    setSelectedGender,
    setSelectedBackground,
    selectedGender,
    selectedBackground,
  } = useContext(dataContext);

  const [showSplash, setShowSplash] = useState(true);
  const [showPersonalization, setShowPersonalization] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleStartApp = () => {
    setShowSplash(false);
    setShowPersonalization(true);
  };

  const handlePersonalizationComplete = ({ gender, background }) => {
    setSelectedGender(gender);
    setSelectedBackground(background);
    setShowPersonalization(false);
  };

  const handleStartRecording = () => {
    setSpeaking(true);
    setResponse(false);
    setIsListening(true);
    startRecording();
  };

  const handleStopRecording = () => {
    stopRecording();
    setIsListening(false);
    setSpeaking(false);
    window.speechSynthesis.cancel();
  };

  const handleRepeatRecording = () => {
    window.speechSynthesis.cancel();
    stopRecording();
    setIsListening(false);
    setSpeaking(false);
    setResponse(false);
    setPrompt("");
    setConversation((prev) => (prev.length >= 2 ? prev.slice(0, -2) : []));
    handleStartRecording();
  };

  const handleSessionSelect = (session) => {
    setConversation(session.messages || []);
    setIsSidebarOpen(false);
  };

  useEffect(() => {
    if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
      alert("Browser tidak mendukung Speech Recognition.");
    }
  }, []);

  if (showSplash) return <SplashScreen onStart={handleStartApp} />;
  if (showPersonalization || !selectedGender || !selectedBackground)
    return <Personalization onComplete={handlePersonalizationComplete} />;

  return (
    <div className={`app-wrapper ${isSidebarOpen ? "sidebar-open" : ""}`}>
      {!isSidebarOpen && (
        <>
          <button
            className="sidebar-toggle-button"
            onClick={() => setIsSidebarOpen(true)}
          >
            ☰
          </button>

          <button
            className="back-button-icon"
            onClick={() => setShowPersonalization(true)}
          >
            <IoArrowBackOutline size={24} />
          </button>
        </>
      )}

      {isSidebarOpen && (
        <div className="sidebar-overlay">
          <Sidebar
            onSelectSession={handleSessionSelect}
            user={user}
            onClose={() => setIsSidebarOpen(false)}
          />
        </div>
      )}

      <div className="canvas-container">
        <Canvas shadows camera={{ position: [0, 0, 8], fov: 42 }}>
          <color attach="background" args={["#ececec"]} />
          <Experience />
        </Canvas>
      </div>

      <div className="chat-controls-side">
        <h1 className="chat-title">
          Ngobrol dengan <span>FribAI</span>
        </h1>

        <div className="mic-controls">
          {isListening ? (
            <div className="recording-indicator">
              <p>Mendengarkan...</p>
              <button
                onClick={handleStopRecording}
                className="mic-button stop-button"
              >
                Stop
              </button>
              <button
                onClick={handleRepeatRecording}
                className="mic-button repeat-button"
              >
                Ulangi
              </button>
            </div>
          ) : (
            <button
              onClick={handleStartRecording}
              className="mic-button start-button floating-mic"
            >
              <CiMicrophoneOn size={32} className="mic-icon" />
            </button>
          )}
        </div>
      </div>

      <div className="conversation-history-side">
        <h2>Riwayat Percakapan</h2>
        <div className="conversation-history">
          {conversation.length > 0 ? (
            conversation.map((msg, index) => (
              <div key={index} className={`message ${msg.type}`}>
                {msg.content}
              </div>
            ))
          ) : (
            <p className="empty-history">
              Mulai ngobrol untuk melihat riwayat percakapanmu di sini 📜
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
