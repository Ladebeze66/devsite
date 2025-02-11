import { useState } from "react";
import { askAI } from "../utils/askAI";

export default function ChatBot() {
    const [question, setQuestion] = useState("");
    const [response, setResponse] = useState("");

    const handleAsk = async () => {
        if (!question) return;
        const aiResponse = await askAI(question);
        setResponse(aiResponse);
    };

    return (
        <div>
            <h2>Chat avec l'IA</h2>
            <input
                type="text"
                placeholder="Posez une question..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
            />
            <button onClick={handleAsk}>Envoyer</button>
            {response && <p>Réponse : {response}</p>}
        </div>
    );
}
