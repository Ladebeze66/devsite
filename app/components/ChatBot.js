import { useState } from "react";
import { askAI } from "../utils/askAI";

export default function ChatBot({ onClose }) {
    const [question, setQuestion] = useState("");
    const [messages, setMessages] = useState([]);
    const [isWaiting, setIsWaiting] = useState(false);

    const handleAsk = async () => {
        if (!question.trim()) return;

        const userMessage = { sender: "user", text: question };
        setMessages([...messages, userMessage]);

        setQuestion("");
        setIsWaiting(true);

        try {
            const botResponse = await askAI(question);
            const botMessage = { sender: "bot", text: botResponse };
            setMessages((prevMessages) => [...prevMessages, botMessage]);
        } catch (error) {
            setMessages([...messages, { sender: "bot", text: "❌ Erreur de réponse. Réessayez plus tard." }]);
        } finally {
            setIsWaiting(false);
        }
    };

    return (
        <div className="flex flex-col w-96 bg-white/70 shadow-lg rounded-lg border border-gray-300">
            <div className="bg-blue-600 text-white p-3 rounded-t-lg flex justify-between items-center">
                <span className="font-headline font-bold">💬 GrasBot</span>
                <button className="text-white hover:text-red-400 text-xl" onClick={onClose}>❌</button>
            </div>

            <div className="h-64 overflow-y-auto p-4 space-y-2">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`p-2 rounded-lg text-white font-headline text-xs ${msg.sender === "user" ? "bg-blue-500 ml-auto" : "bg-gray-500 mr-auto"}`}
                        style={{ maxWidth: "80%" }}
                    >
                        {msg.text}
                    </div>
                ))}
                {isWaiting && (
                    <div className="p-2 rounded-lg text-white bg-gray-500 mr-auto wait-animation" style={{ maxWidth: "80%" }}>
                        wait<span className="dot-1">.</span><span className="dot-2">.</span><span className="dot-3">.</span>
                    </div>
                )}
            </div>

            <div className="flex p-3 border-t border-gray-300">
                <input
                    type="text"
                    className="flex-1 p-2 border border-gray-300 font-headline text-xs rounded-l-lg focus:outline-none"
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