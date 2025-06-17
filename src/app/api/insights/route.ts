import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { query, tone } = await req.json();

    const prompt = `For the topic "${query}", in "${tone}" tone, suggest JSON with:
    {
      "keywords": [5 keywords],
      "tags": [7 tags],
      "title_variants": [3 title strings],
      "thumbnail_prompt": "string"
    }`;

    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4", // or "gpt-3.5-turbo"
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant that returns strictly formatted JSON for content generation.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
      }),
    });

    const data = await openaiRes.json();

    if (!openaiRes.ok) {
      console.error("OpenAI Error:", data);
      return NextResponse.json({ error: data }, { status: 500 });
    }

    const message = data.choices?.[0]?.message?.content || "No response generated.";

    return NextResponse.json({ insight: message });
  } catch (err) {
    console.error("Internal Server Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
