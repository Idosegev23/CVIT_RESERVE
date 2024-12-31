import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const { email, couponCode } = await request.json();

    const transporter = nodemailer.createTransport({
      host: 'smtp.zoho.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.ZOHO_MAIL_USER,
        pass: process.env.ZOHO_MAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.ZOHO_MAIL_USER,
      to: email,
      subject: 'הקוד שלך ל-CVIT Advanced',
      html: `
        <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <img src="https://res.cloudinary.com/dsoh3yteb/image/upload/v1735156794/MailLogo_jrcesy.png" alt="CVIT Logo" style="display: block; margin: 0 auto; max-width: 200px;">
          
          <h1 style="color: #2E2953; text-align: center; margin-top: 30px;">תודה שבחרת ב-CVIT!</h1>
          
          <p style="color: #2E2953; text-align: center; font-size: 16px; line-height: 1.6;">
            אנו מודים לך על שירותך ומוקירים את תרומתך למדינת ישראל.
            כהוקרה על שירותך במילואים, הנה הקוד שלך למסלול ה-Advanced:
          </p>
          
          <div style="background-color: #F6F5F0; border-radius: 8px; padding: 20px; margin: 30px 0; text-align: center;">
            <code style="font-size: 24px; color: #4754D6;">${couponCode}</code>
          </div>
          
          <p style="color: #2E2953; text-align: center; font-size: 16px;">
            כדי לממש את ההטבה, פשוט הזן את הקוד באתר שלנו.
          </p>
          
          <div style="text-align: center; margin-top: 30px;">
            <a href="https://www.cvit.co.il" style="background-color: #4754D6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              בקר באתר
            </a>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
} 