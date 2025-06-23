const XI_API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY;
const VOICE_ID = import.meta.env.VITE_ELEVENLABS_VOICE_ID;

export const speakElevenLabs = (text) => {
  const socket = new WebSocket(`wss://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}/stream-input`);

  socket.onopen = () => {
    socket.send(JSON.stringify({
      text,
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.8
      },
      xi_api_key: XI_API_KEY
    }));
  };

  socket.onmessage = async (event) => {
    try {
      let arrayBuffer;

      if (event.data instanceof ArrayBuffer) {
        arrayBuffer = event.data;
      } else if (event.data instanceof Blob) {
        arrayBuffer = await event.data.arrayBuffer();
      } else if (typeof event.data === "string") {
        console.log("String data (mungkin kontrol):", event.data);
        return;
      } else {
        console.warn("Tipe data tidak dikenal:", event.data);
        return;
      }

      const blob = new Blob([arrayBuffer], { type: "audio/mpeg" });
      const audioUrl = URL.createObjectURL(blob);
      const audio = new Audio(audioUrl);
      audio.play();
    } catch (err) {
      console.error("Error saat memutar audio:", err);
    }
  };

  socket.onerror = (e) => console.error("TTS WebSocket Error:", e);
};
