import nodemailer from "nodemailer";

function createTransporter() {
  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER || process.env.COMPANY_EMAIL || "jtransportgroup.ltd@gmail.com";
  const pass = process.env.SMTP_PASS || "";

  if (!pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
}

export async function sendBookingEmails(booking) {
  const companyEmail = process.env.COMPANY_EMAIL || "jtransportgroup.ltd@gmail.com";
  const pounds = "£" + (Number(booking.amount_pence || booking.amountPence || 0) / 100).toFixed(2);
  const reference = booking.reference || "JTG-" + Date.now();
  const customerName = booking.customer_name || booking.name || "Valued Customer";
  const customerEmail = booking.email || "";
  const customerPhone = booking.phone || "Not provided";
  const pickup = booking.pickup || "";
  const dropoff = booking.dropoff || "";
  const pickupAt = booking.pickup_at || booking.pickupAt || "";
  const vehicleName = booking.vehicle_name || booking.vehicle || "Chauffeur Vehicle";
  const passengers = booking.passengers || 1;
  const status = (booking.status || "pending_payment").toUpperCase().replace("_", " ");

  const passengerHtml = `
    <div style="font-family:'Poppins',Arial,sans-serif;max-width:620px;margin:auto;background:#ffffff;border:1px solid #e2d287;border-radius:12px;overflow:hidden;box-shadow:0 8px 30px rgba(0,0,0,0.08);">
      <div style="background:#1a1a18;padding:25px;text-align:center;border-bottom:3px solid #d0ab00;">
        <h1 style="color:#f6c400;margin:0;font-size:24px;letter-spacing:1px;">J TRANSPORT GROUP LTD</h1>
        <p style="color:#d5d4cb;margin:5px 0 0;font-size:12px;letter-spacing:2px;">YOUR JOURNEY • OUR PRIORITY</p>
      </div>
      <div style="padding:30px;color:#2c2c28;">
        <h2 style="color:#1a1a18;margin-top:0;font-size:20px;">Booking Confirmation</h2>
        <p style="font-size:14px;line-height:1.6;">Dear <strong>${customerName}</strong>,</p>
        <p style="font-size:14px;line-height:1.6;color:#555;">Thank you for choosing <strong>J Transport Group LTD</strong>. Your transfer reservation details are confirmed below:</p>

        <div style="background:#fffdf2;border:1px solid #f0e2a8;border-radius:8px;padding:20px;margin:20px 0;">
          <table style="width:100%;font-size:13.5px;border-collapse:collapse;" cellpadding="6">
            <tr><td style="color:#777;width:40%;">Booking Ref:</td><td style="font-weight:700;color:#111;">${reference}</td></tr>
            <tr><td style="color:#777;">Status:</td><td><span style="background:#eef9ec;color:#2e6b22;padding:3px 10px;border-radius:12px;font-weight:600;font-size:12px;">${status}</span></td></tr>
            <tr><td style="color:#777;">Pick Up:</td><td style="font-weight:600;">${pickup}</td></tr>
            <tr><td style="color:#777;">Drop Off:</td><td style="font-weight:600;">${dropoff}</td></tr>
            <tr><td style="color:#777;">Date &amp; Time:</td><td style="font-weight:600;">${pickupAt.replace("T", " ").slice(0, 16)}</td></tr>
            <tr><td style="color:#777;">Vehicle:</td><td style="font-weight:600;">${vehicleName}</td></tr>
            <tr><td style="color:#777;">Passengers:</td><td>${passengers} passenger(s)</td></tr>
            <tr style="border-top:1px dashed #e2d287;"><td style="color:#111;font-weight:700;font-size:15px;padding-top:10px;">Total Fare:</td><td style="color:#b08d00;font-weight:800;font-size:18px;padding-top:10px;">${pounds}</td></tr>
          </table>
        </div>

        <p style="font-size:13px;line-height:1.6;color:#666;">If you have flight details or special instructions, our dispatch team is available 24/7 at <strong>+44 20 3996 2897</strong> or reply directly to this email.</p>
        <a href="https://wa.me/442039962897" style="display:inline-block;background:#25d366;color:#ffffff;text-decoration:none;padding:10px 20px;border-radius:24px;font-weight:600;font-size:13px;margin-top:10px;">Chat on WhatsApp (+44 20 3996 2897)</a>
      </div>
      <div style="background:#22221f;color:#aaa;padding:20px;font-size:11px;line-height:1.6;text-align:center;border-top:1px solid #444;">
        <strong style="color:#f6c400;">Transport for London (TfL) Licensed Operator</strong><br>
        Licence Holder: J TRANSPORT GROUP LTD · Licence Number: 01103601<br>
        Office 3.40, 6-9 The Square, Stockley Park, UB11 1FW · 24 Sept 2024 – 23 Sept 2029
      </div>
    </div>
  `;

  const companyHtml = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;background:#fff;border:2px solid #d0ab00;padding:25px;border-radius:10px;">
      <h2 style="color:#111;margin-top:0;">🚨 New Booking Alert: Ref ${reference}</h2>
      <p style="font-size:14px;">A new booking has been placed on <strong>J Transport Group LTD</strong>:</p>
      <ul style="font-size:13.5px;line-height:1.8;color:#333;">
        <li><strong>Customer Name:</strong> ${customerName}</li>
        <li><strong>Customer Email:</strong> ${customerEmail}</li>
        <li><strong>Customer Phone:</strong> ${customerPhone}</li>
        <li><strong>Pick Up:</strong> ${pickup}</li>
        <li><strong>Drop Off:</strong> ${dropoff}</li>
        <li><strong>Pickup Date/Time:</strong> ${pickupAt.replace("T", " ").slice(0, 16)}</li>
        <li><strong>Vehicle:</strong> ${vehicleName}</li>
        <li><strong>Passengers:</strong> ${passengers}</li>
        <li><strong>Total Fare:</strong> ${pounds}</li>
        <li><strong>Payment Status:</strong> ${status}</li>
      </ul>
    </div>
  `;

  console.log(`[EMAIL DISPATCH] Booking ${reference} notification created for ${customerEmail} & ${companyEmail}`);

  const transporter = createTransporter();
  if (!transporter) {
    console.log(`[EMAIL NOTICE] SMTP_PASS not set in .env. Email details logged cleanly. Configure SMTP_PASS in backend/.env for live SMTP delivery.`);
    return { ok: true, sent: false, note: "Logged cleanly. Add SMTP_PASS to .env to send live emails." };
  }

  try {
    if (customerEmail) {
      await transporter.sendMail({
        from: `"J Transport Group LTD" <${companyEmail}>`,
        to: customerEmail,
        subject: `Booking Confirmation - J Transport Group LTD (${reference})`,
        html: passengerHtml,
      });
    }

    await transporter.sendMail({
      from: `"J Transport Group Website" <${companyEmail}>`,
      to: companyEmail,
      subject: `🚨 New Ride Booking Ref: ${reference} (${customerName})`,
      html: companyHtml,
    });

    console.log(`[EMAIL SUCCESS] Sent confirmation emails to passenger ${customerEmail} and company ${companyEmail}`);
    return { ok: true, sent: true };
  } catch (err) {
    console.error("[EMAIL ERROR]", err.message);
    return { ok: false, error: err.message };
  }
}
