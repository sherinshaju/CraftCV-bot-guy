import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { resumeText, jobDescription } = await req.json();

    if (!resumeText || !jobDescription) {
      return NextResponse.json(
        { error: 'Both resumeText and jobDescription are required.' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'GEMINI_API_KEY is not configured on the server.' },
        { status: 500 }
      );
    }

    const systemInstruction = `You are an expert ATS (Applicant Tracking System) Resume Optimizer.
Analyze the user's resume against the provided job description.
Your analysis must be returned strictly in valid JSON format conforming to this structure:
{
  "score": number (0 to 100 representing job match compatibility based on keywords, skills, and structure),
  "matchedKeywords": ["string" (keywords found in the resume matching the job description)],
  "missingKeywords": ["string" (crucial keywords or skills present in the job description but missing/weak in the resume)],
  "atsFeedback": ["string" (structural feedback such as font readability, section ordering, formatting issues, density, etc.)],
  "suggestions": [
    {
      "before": "string (the sentence/bullet point in the resume to change)",
      "after": "string (the optimized, metric-driven statement incorporating missing skills/keywords)",
      "reason": "string (why this change helps the score)"
    }
  ]
}

Be realistic. Ensure matched and missing keywords lists are highly descriptive and target hard/soft skills, technologies, and certifications. Check structural standards (single-column parsing, no complex tables or graphics, standard date styles).
Output valid JSON, without any markdown formatting wrappers (like \`\`\`json).`;

    const fullPrompt = `${systemInstruction}\n\nResume Text:\n${resumeText}\n\nJob Description:\n${jobDescription}`;

    const body = JSON.stringify({
      contents: [{ parts: [{ text: fullPrompt }] }],
      generationConfig: {
        responseMimeType: 'application/json',
      },
    });

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
      }
    );

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      console.error('Gemini API Error:', errText);
      throw new Error(`Gemini API failed with status ${geminiRes.status}`);
    }

    const resJson = await geminiRes.json();
    const textOutput = resJson.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!textOutput) {
      throw new Error('Empty response from Gemini API.');
    }

    // Try parsing the text output as JSON
    const parsedAnalysis = JSON.parse(textOutput);

    return NextResponse.json(parsedAnalysis);
  } catch (error: any) {
    console.error('Error in ATS Score route:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred during ATS analysis.' },
      { status: 500 }
    );
  }
}
