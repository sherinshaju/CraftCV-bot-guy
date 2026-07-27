import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { resumeContent, jobDescription } = await req.json();

    if (!resumeContent || !jobDescription) {
      return NextResponse.json(
        { error: 'Both resumeContent and jobDescription are required.' },
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

    const systemInstruction = `You are an expert ATS Resume Optimizer. Your task is to take the provided resume content in JSON format and optimize it strictly for the target job description.
Modify the summary and experience bullet points to be highly metric-driven, achievement-focused, and weave in keywords from the job description naturally.
Ensure the layout structures remain ATS-safe and professional.

Return ONLY valid JSON matching this exact structure:
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
    "summary": "string (optimized summary containing target keywords)"
  },
  "experience": [
    {
      "company": "string",
      "role": "string",
      "location": "string",
      "startDate": "string",
      "endDate": "string",
      "current": boolean,
      "description": "string (bullet points with enhanced action verbs and metrics, separated by newlines \\n)",
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
  "skills": ["string" (updated skills incorporating missing technical and soft skills from the job description)],
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

Make sure that for each work experience, the bullet points in the "description" field are written as strong accomplishment statements (Action Verb + Task + Quantified Result/Impact) and are formatted separated by newlines (\\n).
Output valid JSON, without any markdown formatting wrappers (like \`\`\`json).`;

    const fullPrompt = `${systemInstruction}\n\nResume JSON Content:\n${JSON.stringify(resumeContent)}\n\nJob Description:\n${jobDescription}`;

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

    const optimizedContent = JSON.parse(textOutput);
    return NextResponse.json(optimizedContent);
  } catch (error: any) {
    console.error('Error in optimize-resume route:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred during resume optimization.' },
      { status: 500 }
    );
  }
}
