import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req) {
  const { name, email, platform, meetingLink, description, date, time, sendingEmail } = await req.json();

  if (!name || !email || !meetingLink || !date || !time || !sendingEmail) {
    return new NextResponse(JSON.stringify({ message: "Missing required fields" }), { status: 400 });
  }

  try {
    // Create Nodemailer transporter
    const transporter = nodemailer.createTransport({ 
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        ciphers: 'SSLv3',
      },
    });

    // Prepare email data
    const mailOptions = {
      from: `"DevQuerys" <${process.env.EMAIL_USER}>`,
      to: sendingEmail,
      subject: "Meeting Invitation From DevQuerys.inc",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="background-color: #f7f7f7; padding: 20px; border-radius: 8px; max-width: 600px; margin: auto;">
            <div style="text-align: center; margin-bottom: 20px;">
              <h2 style="color: #4a90e2; font-size: 24px; margin-bottom: 5px;">📅 Meeting Invitation</h2>
              <p style="font-size: 16px; color: #777;">You have a new meeting scheduled!</p>
            </div>
            <div style="background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);">
              <p style="font-size: 18px; font-weight: bold; margin-bottom: 10px;">Meeting Details:</p>
              <p style="margin: 10px 0;">
                <strong style="color: #4a90e2;">Organizer:</strong> DevQuerys.inc
              </p>
              <hr style="border: none; border-bottom: 1px solid #f0f0f0; margin: 15px 0;">
              <p style="margin: 10px 0;">
                <strong style="color: #4a90e2;">Meeting With:</strong> ${escapeHtml(name)}
              </p>
              <p style="margin: 10px 0;">
                <strong style="color: #4a90e2;">Date:</strong> ${escapeHtml(date)}
              </p>
              <p style="margin: 10px 0;">
                <strong style="color: #4a90e2;">Time:</strong> ${escapeHtml(time)}
              </p>
              <p style="margin: 10px 0;">
                <strong style="color: #4a90e2;">Platform:</strong> ${escapeHtml(platform)}
              </p>
              <p style="margin: 10px 0;">
                <strong style="color: #4a90e2;">Purpose:</strong> ${escapeHtml(description)}
              </p>
              <p style="margin: 10px 0;">
                <strong style="color: #4a90e2;">Meeting Link:</strong> 
                <a href="${escapeHtml(meetingLink)}" style="color: #4a90e2; text-decoration: underline;">
                  Join the Meeting
                </a>
              </p>
            </div>
            <div style="text-align: center; margin-top: 20px;">
              <p style="font-size: 14px; color: #777;">Looking forward to your participation!</p>
            </div>
          </div>
        </div>
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    // If successful, return a success message
    return new NextResponse(JSON.stringify({ message: "Invitation sent successfully!" }), { status: 200 });
  } catch (error) {
    console.error("Error sending email:", error);
    return new NextResponse(JSON.stringify({ message: "Failed to send email. Please try again later." }), { status: 500 });
  }
}

// Helper function to escape HTML to prevent potential injection
function escapeHtml(text) {
  return text.replace(/[&<>"']/g, function (match) {
    const escape = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;',
    };
    return escape[match];
  });
}
