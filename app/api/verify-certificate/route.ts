import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

if (!process.env.ANTHROPIC_API_KEY) {
  throw new Error('ANTHROPIC_API_KEY is not defined in environment variables');
}

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: Request) {
  try {
    console.log('Starting certificate verification...');
    console.log('API Key exists:', !!process.env.ANTHROPIC_API_KEY);
    
    const { imageUrl, firstName, lastName } = await request.json();
    console.log('Received request:', { imageUrl, firstName, lastName });

    // קבלת תוכן התמונה כ-base64
    console.log('Fetching image from URL...');
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      console.error('Failed to fetch image:', imageResponse.statusText);
      throw new Error('Failed to fetch image');
    }

    const imageBuffer = await imageResponse.arrayBuffer();
    const base64Image = Buffer.from(imageBuffer).toString('base64');
    console.log('Image converted to base64');

    // שליחת התמונה ל-Claude Vision
    console.log('Sending request to Claude Vision...');
    const message = await anthropic.messages.create({
      model: "claude-3-sonnet-20240229",
      max_tokens: 1024,
      messages: [{
        role: "user",
        content: [
          {
            type: "text",
            text: `אנא בדוק את תעודת המילואים הזו ואמת את הפרטים הבאים:
            1. האם השם הפרטי והמשפחה תואמים ל: ${firstName} ${lastName}?
            2. כמה ימי מילואים מופיעים בתעודה?
            3. האם התעודה נראית אותנטית?
            
            אנא החזר תשובה בפורמט JSON עם השדות הבאים:
            {
              isValid: boolean, // האם התעודה תקינה והשם תואם
              militaryDays: number, // מספר ימי המילואים
              reason: string // סיבה אם לא תקין
            }`
          },
          {
            type: "image",
            source: {
              type: "base64",
              media_type: "image/jpeg",
              data: base64Image
            }
          }
        ]
      }]
    });

    console.log('Received response from Claude');

    // מיצוי הטקסט מהתשובה של Claude
    const textContent = message.content.find(
      (block): block is { type: "text"; text: string } => 
      block.type === "text"
    );

    if (!textContent) {
      console.error('No text content in Claude response');
      throw new Error('Invalid response from Claude');
    }

    console.log('Claude response text:', textContent.text);
    const parsedResult = JSON.parse(textContent.text);
    console.log('Parsed result:', parsedResult);

    // בדיקה האם עומד בקריטריונים
    if (parsedResult.militaryDays < 10) {
      console.log('Certificate rejected: insufficient military days');
      return NextResponse.json({
        isValid: false,
        militaryDays: parsedResult.militaryDays,
        reason: 'מספר ימי המילואים נמוך מ-10'
      });
    }

    console.log('Certificate verification successful');
    return NextResponse.json(parsedResult);
  } catch (error) {
    console.error('Detailed error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to verify certificate',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 