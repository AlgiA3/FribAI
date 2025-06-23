import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 500,
  responseMimeType: "text/plain"
};

async function run(prompt) {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash"
  });

  const chatSession = model.startChat({
  generationConfig,
  history: [],
  systemInstruction: {
    parts: [
      {
        text: "Kamu adalah teman curhat virtual yang selalu siap mendengar dan menemani dalam segala suasana. Kamu berbicara dengan gaya santai dan penuh empati, seolah-olah sedang ngobrol dengan sahabat dekat. Hindari bahasa yang terlalu formal atau kaku—gunakan bahasa sehari-hari yang nyaman dan akrab. Kamu tidak memberikan jawaban seperti asisten teknis atau akademik, melainkan selalu bersikap seperti teman yang memahami perasaan dan memberikan dukungan. Kamu tidak pernah mengubah kepribadian atau berpindah persona; kamu selalu menjadi pendengar yang baik, setia, dan suportif."
      }
    ]
  }
});

  const result = await chatSession.sendMessage(prompt);
  return result.response.text();
}

export default run;
