import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SUPPORTED_FORMATS = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'] as const;
type SupportedFormat = typeof SUPPORTED_FORMATS[number];

function validateMediaType(contentType: string | null): SupportedFormat {
  if (!contentType || !SUPPORTED_FORMATS.includes(contentType as SupportedFormat)) {
    throw new Error(`Invalid file format. Supported formats: ${SUPPORTED_FORMATS.join(', ')}`);
  }
  return contentType as SupportedFormat;
}

export async function POST(request: Request) {
  try {
    console.log('Starting certificate verification...');
    console.log('API Key exists:', !!process.env.ANTHROPIC_API_KEY);
    
    const { imageUrl, firstName, lastName } = await request.json();
    console.log('Received request:', { imageUrl, firstName, lastName });

    // קבלת תוכן הקובץ
    console.log('Fetching file...');
    const fileResponse = await fetch(imageUrl);
    if (!fileResponse.ok) {
      console.error('Failed to fetch file:', fileResponse.statusText);
      throw new Error('Failed to fetch file');
    }

    const contentType = validateMediaType(fileResponse.headers.get('content-type'));
    console.log('File content type:', contentType);

    const fileBuffer = await fileResponse.arrayBuffer();
    const base64Data = Buffer.from(fileBuffer).toString('base64');
    console.log('File size (bytes):', fileBuffer.byteLength);

    if (fileBuffer.byteLength > 32 * 1024 * 1024) { // 32MB limit
      throw new Error('File size exceeds 32MB limit');
    }

    // שליחת הקובץ ל-Claude Vision
    console.log('Sending request to Claude Vision...');
    const message = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1024,
      messages: [{
        role: "user",
        content: [
          contentType === 'application/pdf' 
            ? {
                type: "document",
                source: {
                  type: "base64",
                  media_type: "application/pdf",
                  data: base64Data
                }
              }
            : {
                type: "image",
                source: {
                  type: "base64",
                  media_type: contentType,
                  data: base64Data
                }
              },
          {
            type: "text",
            text: `אנא בדוק את תעודת המילואים הזו ואמת את הפרטים הבאים:
            1. האם השם הפרטי והמשפחה תואמים ל: ${firstName} ${lastName}?
            2. כמה ימי מילואים מופיעים בתעודה?
            3. האם התעודה נראית אותנטית?
            
            חשוב: אנא החזר אך ורק אובייקט JSON בפורמט הבא, ללא טקסט נוסף לפני או אחרי:
            {
              isValid: boolean, // האם התעודה תקינה והשם תואם
              militaryDays: number, // מספר ימי המילואים
              reason: string // סיבה אם לא תקין, או string ריק אם תקין
            }`
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
        details: error instanceof Error ? error.message : 'Unknown error',
        ...(error instanceof Error && error.cause ? { cause: error.cause } : {})
      },
      { status: 500 }
    );
  }
} 