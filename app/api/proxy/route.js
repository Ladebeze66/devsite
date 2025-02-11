export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const question = searchParams.get("q");

    if (!question) {
        return new Response(JSON.stringify({ error: "Question manquante" }), { status: 400 });
    }

    const apiUrl = `https://llmapi.fernandgrascalvet.com/ask?q=${encodeURIComponent(question)}`;

    try {
        const response = await fetch(apiUrl, {
            headers: {
                "Content-Type": "application/json",
            },
        });

        const data = await response.json();
        return new Response(JSON.stringify(data), {
            status: response.status,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "application/json",
            },
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: "Erreur de communication avec l'API" }), {
            status: 500,
        });
    }
}
