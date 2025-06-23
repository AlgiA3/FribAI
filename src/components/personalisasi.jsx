import React, { useState } from "react";
import "./Personalisasi.css";

const Personalization = ({ onComplete }) => {
  const [selectedGender, setSelectedGender] = useState("male");
  const [selectedBackground, setSelectedBackground] =
    useState("textures/room1.jpg");

  const handleSubmit = () => {
    if (typeof onComplete === "function") {
      onComplete({
        gender: selectedGender,
        background: selectedBackground,
      });
    } else {
      console.error("onComplete is not a function");
    }
  };

  return (
    <div className="personalization-screen">
      <h2>🧍 Pilih Karakter</h2>
      <div className="character-preview-group">
        {[
          { name: "Jaka", value: "male", image: "image/image2.png" },
          { name: "Sopia", value: "female", image: "image/image.png" },
        ].map((char) => (
          <div
            key={char.value}
            className={`character-card ${
              selectedGender === char.value ? "selected" : ""
            }`}
            onClick={() => setSelectedGender(char.value)}
          >
            <img src={char.image} alt={char.name} className="character-image" />
            <p className="character-name">{char.name}</p>
          </div>
        ))}
      </div>

      <h2>🎨 Pilih Background</h2>
      <div className="background-preview-group">
        {["room1", "room2", "room3"].map((room) => {
          const path = `textures/${room}.jpg`;
          return (
            <img
              key={room}
              src={path}
              alt={room}
              className={`background-thumbnail ${
                selectedBackground === path ? "selected" : ""
              }`}
              onClick={() => setSelectedBackground(path)}
            />
          );
        })}
      </div>

      <button className="submit-button" onClick={handleSubmit}>
        Simpan dan Lanjutkan
      </button>
    </div>
  );
};

export default Personalization;
