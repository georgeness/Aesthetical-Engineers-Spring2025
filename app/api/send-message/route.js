import nodemailer from "nodemailer";

export async function POST(request) {
  try {
    // Parse the incoming JSON request
    const { name, email, message } = await request.json();
    
    // Validate required fields
    if (!name || !email || !message) {
      console.error("Missing required fields:", { name, email, message });
      return new Response(
        JSON.stringify({ error: "Please provide name, email, and message" }), 
        { 
          status: 400,
          headers: { "Content-Type": "application/json" }
        }
      );
    }
    
    // Check for environment variables
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error("Missing email configuration in environment variables");
      return new Response(
        JSON.stringify({ error: "Server email configuration error" }), 
        { 
          status: 500,
          headers: { "Content-Type": "application/json" }
        }
      );
    }
    
    // Configure email transporter
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,         
      secure: true,     
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Set up email content
    const mailOptions = {
      from: `"George Lupo Artist Website" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // Send to the same email address
      replyTo: email, // Allow for direct reply to the sender
      subject: `New message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage: ${message}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <h2 style="color: #4a6ee0;">New Message from Website</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          <p><strong>Message:</strong></p>
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin-top: 10px;">
            ${message.replace(/\n/g, '<br>')}
          </div>
          <p style="margin-top: 20px; font-size: 12px; color: #666;">This message was sent from the George Lupo Artist website contact form.</p>
        </div>
      `
    };

    // Send the email
    console.log(`Attempting to send email from ${email} (${name})`);
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");

    // Return success response
    return new Response(
      JSON.stringify({ message: "Your message has been sent successfully!" }), 
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    // Log the error details
    console.error("Error sending email:", error.message);
    
    // Return error response
    return new Response(
      JSON.stringify({ 
        error: "Failed to send message. Please try again later.",
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      }), 
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
