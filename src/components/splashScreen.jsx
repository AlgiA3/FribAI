import React, { useState } from "react";
import "./SplashScreen.css";

const SplashScreen = ({ onStart }) => {
  const [exit, setExit] = useState(false);

  const handleStart = () => {
    setExit(true);
    setTimeout(() => {
      onStart(); // trigger masuk ke halaman personalisasi
    }, 1000); // delay agar animasi sempat terlihat
  };

  return (
    <div className={`splash-container ${exit ? "fade-out" : ""}`}>
      <video
        autoPlay
        muted
        loop
        className="background-video"
        src="/video/video_intro.mp4"
      />
      <div className="overlay">
        <img src="/logo2.png" alt="FribAI Logo" className="logo animate-fade" />
        <h1 className="splash-title animate-slide-up delay-1">
          Selamat Datang di <span className="brand">FribAI</span>
        </h1>
        <p className="splash-subtitle animate-slide-up delay-2">
          AI Curhat yang Mengerti Kamu
        </p>
        <button className="start-button animate-bounce delay-3" onClick={handleStart}>
          Mulai
        </button>
      </div>
    </div>
  );
};

export default SplashScreen;
