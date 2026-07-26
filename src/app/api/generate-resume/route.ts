import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { error: "Prompt description is required." },
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

    const systemInstruction = `You are an expert resume writer. Generate a comprehensive, professional resume JSON structure based on the user's career description.
You MUST output valid JSON conforming strictly to the following TypeScript structure:

{
  "personalInfo": {
    "fullName": "string",
    "email": "string",
    "phone": "string",
    "location": "string",
    "website": "string",
    "linkedIn": "string",
    "github": "string",
    "twitter": "string",
    "jobTitle": "string",
    "summary": "string"
  },
  "experience": [
    {
      "company": "string",
      "role": "string",
      "location": "string",
      "startDate": "string (e.g., Jan 2022)",
      "endDate": "string (e.g., Present or Dec 2023)",
      "current": boolean,
      "description": "string (bullet points with dynamic impact metrics)",
      "employmentType": "Full-time" | "Part-time" | "Contract" | "Internship" | "Freelance",
      "workMode": "On-site" | "Remote" | "Hybrid"
    }
  ],
  "education": [
    {
      "school": "string",
      "degree": "string",
      "location": "string",
      "gradDate": "string (e.g., 2021)",
      "gpa": "string"
    }
  ],
  "projects": [
    {
      "name": "string",
      "role": "string",
      "link": "string",
      "description": "string"
    }
  ],
  "skills": ["string"],
  "certifications": [
    {
      "name": "string",
      "issuer": "string",
      "date": "string"
    }
  ],
  "languages": [
    {
      "name": "string",
      "level": "Native" | "Fluent" | "Professional" | "Intermediate" | "Basic"
    }
  ]
}

Ensure all arrays have at least 1-3 relevant entries based on the prompt. Fill in missing details realistically if not specified in prompt.`;

    const fullPrompt = `${systemInstruction}\n\nUser Profile & Career Details:\n${prompt}`;

    const body = JSON.stringify({
      contents: [{ parts: [{ text: fullPrompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
      },
    });

    let geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
      }
    );

    if (!geminiRes.ok) {
      geminiRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body,
        }
      );
    }

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      console.error("Gemini API error:", errText);
      return NextResponse.json(
        { error: "Failed to generate resume with AI." },
        { status: 500 }
      );
    }

    const data = await geminiRes.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";

    let content;
    try {
      const cleanJsonStr = rawText
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/\s*```$/, "");
      content = JSON.parse(cleanJsonStr);
    } catch (parseErr) {
      console.error("Failed to parse Gemini response as JSON:", rawText);
      return NextResponse.json(
        { error: "AI generated an invalid response format." },
        { status: 500 }
      );
    }

    return NextResponse.json({ content });
  } catch (error: any) {
    console.error("Generate resume API error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error." },
      { status: 500 }
    );
  }
}
