"use client";

import { useState } from "react";
import { sendMessage } from "../utils/sendMessage";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !message.trim()) {
      setStatus("❌ Tous les champs sont obligatoires.");
      setIsSuccess(false);
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus("❌ Email invalide.");
      setIsSuccess(false);
      return;
    }

    setStatus("⏳ Envoi en cours...");
    setIsSuccess(null);
    setIsLoading(true);

    try {
      await sendMessage(name, email, message);
      setStatus("✅ Message envoyé avec succès !");
      setIsSuccess(true);
      setName("");
      setEmail("");
      setMessage("");
    } catch (error) {
      setStatus("❌ Erreur lors de l'envoi du message.");
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg animate-fade-in"
    >
      <h2 className="text-2xl font-orbitron-16-bold mb-4 text-center">📩 Contactez-moi</h2>

      <input
        type="text"
        placeholder="Votre nom"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full p-3 border border-gray-300 font-orbitron-16-bold rounded mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
        required
      />

      <input
        type="email"
        placeholder="Votre email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded font-orbitron-16-bold mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
        required
      />

      <textarea
        placeholder="Votre message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded mb-3 font-orbitron-16-bold focus:outline-none focus:ring-2 focus:ring-blue-400"
        required
      />

      <button
        type="submit"
        disabled={isLoading}
        className={`w-full py-3 rounded transition ${
          isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600 text-white font-orbitron-16-bold"
        }`}
      >
        {isLoading ? "⏳ Envoi..." : "Envoyer"}
      </button>

      {status && (
        <p
          className={`mt-4 text-center ${isSuccess ? "text-green-600" : "text-red-600"}`}
          aria-live="polite"
        >
          {status}
        </p>
      )}
    </form>
  );
}
