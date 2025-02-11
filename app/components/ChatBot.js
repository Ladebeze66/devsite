import { useState, useEffect } from "react";
import { askAI } from "../utils/askAI";

export default function ChatBot() {
    const [question, setQuestion] = useState("");
    const [messages, setMessages] = useState([]);

    // Afficher le message d'introduction une seule fois au chargement du chatbot
    useEffect(() => {
        const introMessage = {
            sender: "bot",
            text: "Bonjour ! Je suis GrasBot, une intelligence artificielle locale basée sur Mistral 7B et hébergée sur un serveur Windows. Je suis là pour répondre à vos questions. Posez-moi votre question ! 😊"
        };
        setMessages([introMessage]);
    }, []);

    const handleAsk = async () => {
        if (!question.trim()) return; // Évite d'envoyer un message vide

        const userMessage = { sender: "user", text: question };
        setMessages((prevMessages) => [...prevMessages, userMessage]); // Ajoute le message utilisateur

        setQuestion(""); // Réinitialise le champ après l'envoi

        try {
            const botResponse = await askAI(question);
            const botMessage = { sender: "bot", text: botResponse };
            setMessages((prevMessages) => [...prevMessages, botMessage]); // Ajoute la réponse du bot
        } catch (error) {
            setMessages((prevMessages) => [
                ...prevMessages,
                { sender: "bot", text: "❌ Erreur de réponse. Réessayez plus tard." }
            ]);
        }
    };

    return (
        <div className="flex flex-col w-96 bg-white shadow-lg rounded-lg border border-gray-300">
            {/* En-tête du chatbot */}
            <div className="bg-blue-600 text-white p-3 rounded-t-lg flex justify-between items-center">
                <span className="font-bold">💬 GrasBot</span>
                <button className="text-white hover:text-red-400 text-xl" onClick={() => setMessages([])}>❌</button>
            </div>

            {/* Zone d'affichage des messages */}
            <div className="h-64 overflow-y-auto p-4 space-y-2">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`p-2 rounded-lg text-white ${msg.sender === "user" ? "bg-blue-500 ml-auto" : "bg-gray-500 mr-auto"}`}
                        style={{ maxWidth: "80%" }}
                    >
                        {msg.text}
                    </div>
                ))}
            </div>

            {/* Zone d'entrée utilisateur */}
            <div className="flex p-3 border-t border-gray-300">
                <input
                    type="text"
                    className="flex-1 p-2 border border-gray-300 rounded-l-lg focus:outline-none"
                    placeholder="Posez votre question..."
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                />
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700"
                    onClick={handleAsk}
                >
                    ➤
                </button>
            </div>
        </div>
    );
}
