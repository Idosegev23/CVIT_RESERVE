import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export async function POST(request: Request) {
  try {
    const { imageUrl, firstName, lastName } = await request.json();

    // קבלת תוכן התמונה כ-base64
    const imageResponse = await fetch(imageUrl);
    const imageBuffer = await imageResponse.arrayBuffer();
    const base64Image = Buffer.from(imageBuffer).toString('base64');

    // שליחת התמונה ל-Claude Vision
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

    // מיצוי הטקסט מהתשובה של Claude
    const textContent = message.content.find(
      (block): block is { type: "text"; text: string } => 
      block.type === "text"
    );

    if (!textContent) {
      throw new Error('No text content in response');
    }

    const parsedResult = JSON.parse(textContent.text);

    // בדיקה האם עומד בקריטריונים
    if (parsedResult.militaryDays < 10) {
      return NextResponse.json({
        isValid: false,
        militaryDays: parsedResult.militaryDays,
        reason: 'מספר ימי המילואים נמוך מ-10'
      });
    }

    return NextResponse.json(parsedResult);
  } catch (error) {
    console.error('Error verifying certificate:', error);
    return NextResponse.json(
      { error: 'Failed to verify certificate' },
      { status: 500 }
    );
  }
} 