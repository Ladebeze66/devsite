export async function askAI(question) {
    const response = await fetch(`/api/proxy?q=${encodeURIComponent(question)}`);
    const data = await response.json();
    return data.response;
}
