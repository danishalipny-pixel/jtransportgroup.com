import nodemailer from "nodemailer";

function createTransporter() {
  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER || process.env.COMPANY_EMAIL || "jtransportgroup.ltd@gmail.com";
  const pass = process.env.SMTP_PASS || "";

  if (!pass) {
    console.log("[SMTP CONFIG WARNING] SMTP_PASS is missing in backend/.env!");
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
}

export async function sendBookingEmails(booking, paymentTypeOverride = null) {
  if (!booking) {
    console.error("[EMAIL ERROR] No booking data provided to sendBookingEmails");
    return { ok: false, sent: false, passengerSent: false, companySent: false, error: "No booking data provided" };
  }

  const reference = booking.reference || "JTG-" + Date.now();
  const status = (booking.status || "").toLowerCase();
  const isPayInCar = paymentTypeOverride === "cash" || paymentTypeOverride === "pay_in_car" || status === "cash_on_arrival";
  const isPayByCard = paymentTypeOverride === "card" || paymentTypeOverride === "pay_by_card" || status === "paid";

  if (!isPayInCar && !isPayByCard) {
    console.log(`[EMAIL NOTICE] Booking ${reference} is in status '${status}' - skipping confirmation email until payment method chosen or card payment completes.`);
    return { ok: true, sent: false, passengerSent: false, companySent: false, note: "Waiting for payment completion or cash selection." };
  }

  const companyEmail = process.env.COMPANY_EMAIL || "jtransportgroup.ltd@gmail.com";
  const amountPence = Number(booking.amount_pence || booking.amountPence || 0);
  const pounds = "£" + (amountPence / 100).toFixed(2);
  const currency = (booking.currency || "GBP").toUpperCase();
  const customerName = booking.customer_name || booking.name || "Valued Customer";
  const customerEmail = booking.email || "";
  const customerPhone = booking.phone || "Not provided";
  const pickup = booking.pickup || "";
  const dropoff = booking.dropoff || "";
  const pickupAt = booking.pickup_at || booking.pickupAt || "";
  const pickupAtFormatted = pickupAt ? pickupAt.replace("T", " ").slice(0, 16) : "N/A";
  const returnAt = booking.return_at || booking.returnAt || "";
  const returnAtFormatted = returnAt ? returnAt.replace("T", " ").slice(0, 16) : "";
  const vehicleName = booking.vehicle_name || booking.vehicle || "Chauffeur Vehicle";
  const passengers = booking.passengers || 1;
  const flightNumber = booking.flight_number || booking.flightNumber || "Not provided";
  const notes = booking.notes || "None";
  const transactionId = booking.stripe_payment_intent || booking.stripe_session_id || "N/A";

  let passengerSubject = "";
  let companySubject = "";
  let paymentMethodLabel = "";
  let paymentStatusBadge = "";

  if (isPayInCar) {
    passengerSubject = "J Transport Group Ltd – Payment Pending – Booking Request Received";
    companySubject = `New Booking Request – Payment Pending – ${reference}`;
    paymentMethodLabel = "Pay in Car (Request)";
    paymentStatusBadge = `<span style="background:#fff3cd;color:#856404;padding:4px 12px;border-radius:12px;font-weight:600;font-size:12px;">PAYMENT PENDING (NOT CONFIRMED)</span>`;
  } else {
    passengerSubject = "J Transport Group Ltd – Booking Confirmation – Paid";
    companySubject = `New Paid Booking – Pay by Card – ${reference}`;
    paymentMethodLabel = "Pay by Card / Wallet";
    paymentStatusBadge = `<span style="background:#eef9ec;color:#2e6b22;padding:4px 12px;border-radius:12px;font-weight:600;font-size:12px;">PAID / CONFIRMED</span>`;
  }

  const returnRow = returnAtFormatted
    ? `<tr><td style="color:#777;padding:8px 0;">Return Date &amp; Time:</td><td style="font-weight:600;color:#111;">${returnAtFormatted}</td></tr>`
    : "";

  const transactionRow = isPayByCard
    ? `<tr><td style="color:#777;padding:8px 0;">Transaction ID:</td><td style="font-weight:600;color:#111;font-family:monospace;">${transactionId}</td></tr>`
    : "";

  const passengerHtml = `
    <div style="font-family:'Poppins',Arial,sans-serif;max-width:620px;margin:auto;background:#ffffff;border:1px solid #e2d287;border-radius:12px;overflow:hidden;box-shadow:0 8px 30px rgba(0,0,0,0.08);">
      <div style="background:#1a1a18;padding:25px;text-align:center;border-bottom:3px solid #d0ab00;">
        <h1 style="color:#f6c400;margin:0;font-size:24px;letter-spacing:1px;font-weight:700;">J TRANSPORT GROUP LTD</h1>
        <p style="color:#d5d4cb;margin:5px 0 0;font-size:12px;letter-spacing:2px;font-weight:500;">YOUR JOURNEY • OUR PRIORITY</p>
      </div>
      <div style="padding:30px;color:#2c2c28;">
        <h2 style="color:#1a1a18;margin-top:0;font-size:20px;">${isPayInCar ? 'Booking Request Received – Payment Pending' : 'Booking Confirmation &amp; Payment Receipt'}</h2>
        
        ${isPayInCar ? `
        <div style="background:#fff8e6;border:1.5px solid #ffe58f;border-radius:8px;padding:16px;margin:16px 0;color:#856404;font-size:13px;line-height:1.6;">
          <strong>⚠️ Payment Required for Booking Confirmation:</strong><br>
          This request is <strong>NOT CONFIRMED YET</strong>. Payment must be completed before the booking can be confirmed. Our dispatch team will contact you regarding payment.
        </div>
        ` : ''}

        <p style="font-size:14px;line-height:1.6;">Dear <strong>${customerName}</strong>,</p>
        <p style="font-size:14px;line-height:1.6;color:#555;">
          ${isPayInCar 
            ? 'Thank you for submitting your transfer request with <strong>J Transport Group Ltd</strong>. Please note that payment is required before your booking can be confirmed.' 
            : 'Thank you for booking with <strong>J Transport Group Ltd</strong>. Your transfer reservation and card payment have been successfully confirmed.'}
        </p>

        <div style="background:#fffdf2;border:1px solid #f0e2a8;border-radius:8px;padding:20px;margin:20px 0;">
          <table style="width:100%;font-size:13.5px;border-collapse:collapse;" cellpadding="4">
            <tr><td style="color:#777;width:42%;padding:8px 0;">Booking Reference:</td><td style="font-weight:700;color:#111;font-size:15px;">${reference}</td></tr>
            <tr><td style="color:#777;padding:8px 0;">Payment Method:</td><td style="font-weight:600;color:#111;">${paymentMethodLabel}</td></tr>
            <tr><td style="color:#777;padding:8px 0;">Status:</td><td>${paymentStatusBadge}</td></tr>
            ${transactionRow}
            <tr><td style="color:#777;padding:8px 0;">Pick Up Location:</td><td style="font-weight:600;color:#111;">${pickup}</td></tr>
            <tr><td style="color:#777;padding:8px 0;">Drop Off Location:</td><td style="font-weight:600;color:#111;">${dropoff}</td></tr>
            <tr><td style="color:#777;padding:8px 0;">Pickup Date &amp; Time:</td><td style="font-weight:600;color:#111;">${pickupAtFormatted}</td></tr>
            ${returnRow}
            <tr><td style="color:#777;padding:8px 0;">Vehicle Type:</td><td style="font-weight:600;color:#111;">${vehicleName}</td></tr>
            <tr><td style="color:#777;padding:8px 0;">Passengers:</td><td style="font-weight:600;color:#111;">${passengers} passenger(s)</td></tr>
            <tr><td style="color:#777;padding:8px 0;">Flight Number:</td><td style="font-weight:600;color:#111;">${flightNumber}</td></tr>
            <tr><td style="color:#777;padding:8px 0;">Child Seat / Notes:</td><td style="font-weight:600;color:#111;">${notes}</td></tr>
            <tr style="border-top:1px dashed #e2d287;">
              <td style="color:#111;font-weight:700;font-size:15px;padding-top:12px;">Total Fare:</td>
              <td style="color:#b08d00;font-weight:800;font-size:18px;padding-top:12px;">${pounds} ${currency}</td>
            </tr>
          </table>
        </div>

                <!-- Booking Guidelines Notice -->
        <div style="background:#fffdf6;border:1.5px solid #ebd46d;border-radius:10px;padding:18px 20px;margin:22px 0;font-size:13px;line-height:1.6;color:#3f3f38;">
          <p style="margin:0 0 10px;font-weight:500;">Please ensure that all booking details are correct and keep your mobile phone available at the time of pickup. For airport transfers, please provide accurate flight details. Any changes, additional stops, or extra waiting time may incur additional charges where applicable.</p>
          <p style="margin:0 0 10px;font-weight:500;">Thank you for choosing our service. We are committed to providing you with a safe, reliable, and comfortable journey.</p>
          <p style="margin:0;font-weight:700;color:#111;letter-spacing:0.5px;">Your Journey, Our Priority.</p>
        </div>

        <p style="font-size:13px;line-height:1.6;color:#666;">If you have any questions or need immediate assistance, our dispatch team is available 24/7 at <strong>+44 20 3996 2897</strong> or by replying directly to this email.</p>
        <div style="text-align:center;margin-top:20px;">
          <a href="https://wa.me/442039962897" style="display:inline-block;background:#25d366;color:#ffffff;text-decoration:none;padding:12px 24px;border-radius:24px;font-weight:600;font-size:14px;box-shadow:0 4px 12px rgba(37,211,102,0.3);">Chat with Us on WhatsApp (+44 20 3996 2897)</a>
        </div>
      </div>
      <div style="background:#22221f;color:#aaa;padding:20px;font-size:11px;line-height:1.6;text-align:center;border-top:1px solid #444;">
        <strong style="color:#f6c400;">Transport for London (TfL) Licensed Operator</strong><br>
        Licence Holder: J TRANSPORT GROUP LTD · Licence Number: 01103601<br>
        Office 3.40, 6-9 The Square, Stockley Park, UB11 1FW · 24 Sept 2024 – 23 Sept 2029
      </div>
    </div>
  `;

  const companyHtml = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;background:#fff;border:2px solid #d0ab00;padding:25px;border-radius:10px;box-shadow:0 4px 15px rgba(0,0,0,0.1);">
      <h2 style="color:#111;margin-top:0;">${isPayInCar ? '⚠️ New Booking Request Received – Payment Pending' : '✅ New Paid Booking – Pay by Card'}</h2>
      <p style="font-size:14px;color:#444;">A transfer reservation ${isPayInCar ? 'request' : 'booking'} has been placed on <strong>J Transport Group Ltd</strong> (Ref: <strong>${reference}</strong>):</p>
      
      <table style="width:100%;font-size:13.5px;border-collapse:collapse;" cellpadding="6">
        <tr style="background:#f9f9f9;"><td style="font-weight:bold;width:40%;">Booking Reference:</td><td><strong>${reference}</strong></td></tr>
        <tr><td style="font-weight:bold;">Customer Name:</td><td>${customerName}</td></tr>
        <tr style="background:#f9f9f9;"><td style="font-weight:bold;">Customer Email:</td><td><a href="mailto:${customerEmail}">${customerEmail}</a></td></tr>
        <tr><td style="font-weight:bold;">Customer Phone:</td><td><a href="tel:${customerPhone}">${customerPhone}</a></td></tr>
        <tr style="background:#f9f9f9;"><td style="font-weight:bold;">Pick Up Location:</td><td>${pickup}</td></tr>
        <tr><td style="font-weight:bold;">Drop Off Location:</td><td>${dropoff}</td></tr>
        <tr style="background:#f9f9f9;"><td style="font-weight:bold;">Pickup Date &amp; Time:</td><td>${pickupAtFormatted}</td></tr>
        ${returnAtFormatted ? `<tr><td style="font-weight:bold;">Return Date &amp; Time:</td><td>${returnAtFormatted}</td></tr>` : ''}
        <tr style="background:#f9f9f9;"><td style="font-weight:bold;">Vehicle Type:</td><td>${vehicleName}</td></tr>
        <tr><td style="font-weight:bold;">Passengers:</td><td>${passengers}</td></tr>
        <tr style="background:#f9f9f9;"><td style="font-weight:bold;">Flight Number:</td><td>${flightNumber}</td></tr>
        <tr><td style="font-weight:bold;">Child Seat / Special Notes:</td><td>${notes}</td></tr>
        <tr style="background:#f9f9f9;"><td style="font-weight:bold;">Payment Method:</td><td><strong>${paymentMethodLabel}</strong></td></tr>
        <tr><td style="font-weight:bold;">Payment Status:</td><td><strong>${isPayInCar ? 'Payment Pending (Not Confirmed)' : 'PAID'}</strong></td></tr>
        ${isPayByCard ? `<tr style="background:#f9f9f9;"><td style="font-weight:bold;">Transaction ID:</td><td><code>${transactionId}</code></td></tr>` : ''}
        <tr style="border-top:2px solid #d0ab00;"><td style="font-weight:bold;font-size:15px;padding-top:10px;">Total Fare:</td><td style="font-weight:bold;font-size:16px;color:#b08d00;padding-top:10px;">${pounds} ${currency}</td></tr>
      </table>
    </div>
  `;

  console.log(`[EMAIL DISPATCH START] Ref: ${reference} | Method: ${paymentMethodLabel}`);
  console.log(`[EMAIL RECIPIENT PASSENGER] ${customerEmail || 'None'}`);
  console.log(`[EMAIL RECIPIENT COMPANY] ${companyEmail}`);

  const transporter = createTransporter();
  if (!transporter) {
    const errorMsg = "SMTP_PASS is not set in backend/.env. Email cannot be delivered to SMTP server.";
    console.error(`[SMTP CONFIG FAIL] ${errorMsg}`);
    console.error(`[EMAIL FAILURE PASSENGER] Failed to send passenger email to ${customerEmail}: ${errorMsg}`);
    console.error(`[EMAIL FAILURE COMPANY] Failed to send company email to ${companyEmail}: ${errorMsg}`);
    return {
      ok: false,
      sent: false,
      passengerSent: false,
      companySent: false,
      error: errorMsg,
    };
  }

  let passengerSent = false;
  let companySent = false;
  let passRes = null;
  let compRes = null;
  const errors = [];

  // 1. Send Passenger Confirmation Email
  if (customerEmail) {
    try {
      console.log(`[EMAIL DISPATCH] Attempting to send passenger email to: ${customerEmail}`);
      passRes = await transporter.sendMail({
        from: `"J Transport Group Ltd" <${companyEmail}>`,
        to: customerEmail,
        subject: passengerSubject,
        html: passengerHtml,
      });
      passengerSent = true;
      console.log(`[SMTP CONNECTION RESULT] Successfully authenticated with SMTP server`);
      console.log(`[SMTP RESPONSE PASSENGER] ${passRes.response}`);
      console.log(`[MESSAGE ID PASSENGER] ${passRes.messageId}`);
      console.log(`[EMAIL SUCCESS PASSENGER] Accepted by SMTP server for ${customerEmail}`);
    } catch (err) {
      console.error(`[EMAIL FAILURE PASSENGER] Failed to send email to ${customerEmail}: ${err.message}`);
      errors.push(`Passenger email error: ${err.message}`);
    }
  }

  // 2. Send Company Notification Email
  try {
    console.log(`[EMAIL DISPATCH] Attempting to send company notification email to: ${companyEmail}`);
    compRes = await transporter.sendMail({
      from: `"J Transport Group Website" <${companyEmail}>`,
      to: companyEmail,
      subject: companySubject,
      html: companyHtml,
    });
    companySent = true;
    console.log(`[SMTP RESPONSE COMPANY] ${compRes.response}`);
    console.log(`[MESSAGE ID COMPANY] ${compRes.messageId}`);
    console.log(`[EMAIL SUCCESS COMPANY] Accepted by SMTP server for ${companyEmail}`);
  } catch (err) {
    console.error(`[EMAIL FAILURE COMPANY] Failed to send email to ${companyEmail}: ${err.message}`);
    errors.push(`Company email error: ${err.message}`);
  }

  const overallSuccess = passengerSent && companySent;

  return {
    ok: overallSuccess,
    sent: passengerSent || companySent,
    passengerSent,
    companySent,
    messageId: passRes?.messageId || compRes?.messageId || null,
    smtpResponse: passRes?.response || compRes?.response || null,
    error: errors.length > 0 ? errors.join("; ") : null,
  };
}
