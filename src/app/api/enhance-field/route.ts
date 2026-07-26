import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { text, type } = await req.json();

    if (!text || typeof text !== "string") {
      return NextResponse.json(
        { error: "Text is required for enhancement." },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is not configured on the server." },
        { status: 500 }
      );
    }

    const prompt = `You are a professional resume writer and career coach.
Enhance and rewrite the following ${type || "resume section"} text to be impact-driven, concise, professional, and engaging.
Use active verbs and quantifiable achievements where applicable.
Return ONLY the enhanced text without surrounding quotes, explanation, or markdown formatting.

Draft Text:
"${text}"`;

    let geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    if (!geminiRes.ok) {
      geminiRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
          }),
        }
      );
    }

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      console.error("Gemini API error:", errText);
      return NextResponse.json(
        { error: "Failed to communicate with AI model." },
        { status: 500 }
      );
    }

    const data = await geminiRes.json();
    const enhancedText =
      data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || text;

    return NextResponse.json({ enhancedText });
  } catch (error: any) {
    console.error("Enhance field API error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error." },
      { status: 500 }
    );
  }
}
