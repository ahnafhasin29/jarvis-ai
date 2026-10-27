// Netlify server-side function. The API key stays in Netlify environment variables.
export default async (request, context) => {
  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Use POST for chat requests." }), {
      status: 405,
      headers: { "Content-Type": "application/json" }
    });
  }

  const apiKey = Netlify.env.get("GEMINI_API_KEY");
  if (!apiKey) {
    return new Response(JSON.stringify({ error: "GEMINI_API_KEY is not configured in Netlify yet." }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }

  try {
    const body = await request.json();
    const message = typeof body.message === "string" ? body.message.trim() : "";
    if (!message) {
      return new Response(JSON.stringify({ error: "Please send a message." }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    if (message.length > 4000) {
      return new Response(JSON.stringify({ error: "Please keep messages under 4,000 characters." }), {
        status: 413,
        headers: { "Content-Type": "application/json" }
      });
    }

    const upstream = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey
        },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: "You are JARVIS, a helpful, calm, concise personal AI assistant. Answer in clear English unless the user asks for another language. Do not claim to control devices or access information you do not have." }]
          },
          contents: [{ role: "user", parts: [{ text: message }] }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 700 }
        })
      }
    );

    const result = await upstream.json();
    if (!upstream.ok) {
      const message = result?.error?.message || "The AI provider returned an error.";
      return new Response(JSON.stringify({ error: message }), {
        status: upstream.status,
        headers: { "Content-Type": "application/json" }
      });
    }
    const reply = result?.candidates?.[0]?.content?.parts
      ?.map(part => part.text || "")
      .join("")
      .trim();

    return new Response(JSON.stringify({ reply: reply || "I couldn't form a reply. Please try again." }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Something went wrong while contacting the AI service." }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
