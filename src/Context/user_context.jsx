import React, { createContext, useState, useEffect } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import run from "../gemini_api";
import {
  saveConversation,
  getConversations,
  deleteConversation,
  signInWithGoogle,
  signOutUser,
  auth
} from "../firebase_config";
import { speakElevenLabs } from "../tts";
import { onAuthStateChanged } from "firebase/auth";

export const dataContext = createContext();

function UserContext({ children }) {
  const [speaking, setSpeaking] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [conversation, setConversation] = useState([]);
  const [lastPrompt, setLastPrompt] = useState("");
  const [lastResponse, setLastResponse] = useState("");
  const [animation, setAnimation] = useState("Idle");
  const [isListening, setIsListening] = useState(false);
  const [selectedGender, setSelectedGender] = useState(null);
  const [selectedBackground, setSelectedBackground] = useState(null);

  // 🆔 Auth & session
  const [user, setUser] = useState(null);
  const [sessionId] = useState(Date.now().toString());
  const [history, setHistory] = useState([]);

  const { transcript, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      await refreshHistory(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const refreshHistory = async (authUser = user) => {
    const data = await getConversations(authUser?.uid, sessionId);
    setHistory(data);
  };

  function detectEmotion(text) {
    const emotions = {
      Laugh: ["senang", "bahagia", "tertawa", "lucu"],
      Angry: ["marah", "kesal", "geram"],
      Greeting: ["halo", "hai", "hallo", "selamat pagi", "selamat siang", "selamat sore"],
    };
    text = text.toLowerCase();
    for (const [emotion, keywords] of Object.entries(emotions)) {
      if (keywords.some((k) => text.includes(k))) {
        return emotion;
      }
    }
    return "Idle";
  }

  function speak(text) {
    setSpeaking(true);
    setAnimation("Talking");
    speakElevenLabs(text);
    const emotion = detectEmotion(text);
    setAnimation(emotion);

    const durationEstimate = Math.max(text.split(" ").length * 200, 2000);
    setTimeout(() => {
      setSpeaking(false);
      setAnimation("Idle");
    }, durationEstimate);
  }

  async function aiResponse(inputPrompt) {
    const lowerPrompt = inputPrompt.toLowerCase();

    if (
      lowerPrompt.includes("jam berapa") ||
      lowerPrompt.includes("pukul berapa") ||
      lowerPrompt.includes("sekarang jam") ||
      lowerPrompt.includes("tanggal berapa") ||
      lowerPrompt.includes("hari ini hari apa") ||
      lowerPrompt.includes("hari apa sekarang")
    ) {
      const now = new Date();
      const waktu = now.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      });
      const tanggal = now.toLocaleDateString("id-ID", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      const jawaban = `Sekarang hari ${tanggal}, pukul ${waktu}.`;

      setConversation((prev) => [
        ...prev,
        { type: "user", content: inputPrompt },
        { type: "ai", content: jawaban },
      ]);

      setLastPrompt(inputPrompt);
      setLastResponse(jawaban);
      setPrompt(inputPrompt);
      setResponse(jawaban);
      speak(jawaban);
      await saveConversation(inputPrompt, jawaban, user?.uid, sessionId);
      refreshHistory();
      return;
    }

    const text = await run(inputPrompt);
    const cleanedText = text
      .replace("Algi", "FribAi")
      .split("**")
      .map((part) => part.split("*"))
      .flat()
      .join(" ");

    setConversation((prev) => [
      ...prev,
      { type: "user", content: inputPrompt },
      { type: "ai", content: cleanedText },
    ]);

    setLastPrompt(inputPrompt);
    setLastResponse(cleanedText);
    setPrompt(inputPrompt);
    setResponse(cleanedText);
    speak(cleanedText);

    await saveConversation(inputPrompt, cleanedText, user?.uid, sessionId);
    refreshHistory();
  }

  function startRecording() {
    if (!browserSupportsSpeechRecognition) {
      alert("Browser tidak mendukung Speech Recognition.");
      return;
    }
    resetTranscript();
    setIsListening(true);
    SpeechRecognition.startListening({ continuous: false, language: "id-ID" });
  }

  function stopRecording() {
    SpeechRecognition.stopListening();
    setIsListening(false);

    if (transcript.trim() !== "") {
      setPrompt(transcript);
      aiResponse(transcript);
    }
  }

  const value = {
    speaking,
    setSpeaking,
    prompt,
    setPrompt,
    response,
    setResponse,
    conversation,
    setConversation,
    lastPrompt,
    lastResponse,
    animation,
    setAnimation,
    isListening,
    setIsListening,
    startRecording,
    stopRecording,
    selectedGender,
    setSelectedGender,
    selectedBackground,
    setSelectedBackground,
    // auth & session
    user,
    sessionId,
    history,
    refreshHistory,
    signInWithGoogle,
    signOutUser,
  };

  return <dataContext.Provider value={value}>{children}</dataContext.Provider>;
}

export default UserContext;
