import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { formData } = await req.json();

    if (!formData) {
      return NextResponse.json(
        { error: 'Form data is required.' },
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

    const systemInstruction = `You are a professional Resume Builder. Your task is to draft a clean, ATS-friendly resume JSON based on the user's details.
Polish each experience bullet point to start with a strong action verb and follow the achievement pattern (Action Verb + Task + Quantifiable Result).
Weave in relevant industry terms and keywords related to the target job title.

Return strictly valid JSON matching this exact structure:
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
    "jobTitle": "string (target job title)",
    "summary": "string (professional summary points drafted professionally)"
  },
  "experience": [
    {
      "company": "string",
      "role": "string",
      "location": "string",
      "startDate": "string",
      "endDate": "string",
      "current": boolean,
      "description": "string (achievement-focused bullet points, separated by newlines \\n)",
      "employmentType": "Full-time" | "Part-time" | "Contract" | "Internship" | "Freelance",
      "workMode": "On-site" | "Remote" | "Hybrid"
    }
  ],
  "education": [
    {
      "school": "string",
      "degree": "string",
      "location": "string",
      "gradDate": "string",
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
  "skills": ["string" (array of skills parsed from user input and expanded with relevant industry standard terms)],
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

Output valid JSON, without any markdown formatting wrappers (like \`\`\`json).`;

    const fullPrompt = `${systemInstruction}\n\nUser Input Form Data:\n${JSON.stringify(formData)}`;

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

    const compiledResume = JSON.parse(textOutput);
    return NextResponse.json(compiledResume);
  } catch (error: any) {
    console.error('Error in generate-resume-prompt route:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred during resume generation.' },
      { status: 500 }
    );
  }
}
