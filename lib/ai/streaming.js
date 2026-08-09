export async function streamFromGPT4o(prompt, onToken, signal) {
    const res = await fetch("/api/interview/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
        signal,
    });
    if (!res.body)
        throw new Error("No response body");
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    while (true) {
        const { done, value } = await reader.read();
        if (done)
            break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n\n");
        buffer = lines.pop() || "";
        for (const line of lines) {
            if (line.startsWith("data: ")) {
                const data = line.replace("data: ", "");
                if (data === "[DONE]")
                    return;
                try {
                    const { content } = JSON.parse(data);
                    if (content)
                        onToken(content);
                }
                catch { }
            }
        }
    }
}
//# sourceMappingURL=streaming.js.map