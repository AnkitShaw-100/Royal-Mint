// Helper to send email via EmailJS
async function sendEmail({ templateParams, emailType = "general" }) {
  const serviceId = process.env.EMAILJS_SERVICE_ID;
  const templateId = process.env.EMAILJS_TEMPLATE_ID;
  const publicKey = process.env.EMAILJS_PUBLIC_KEY;
  const privateKey = process.env.EMAILJS_PRIVATE_KEY;

  if (!serviceId || !templateId || !publicKey) {
    console.warn(`EmailJS config missing. Skipping ${emailType} email send.`, {
      hasServiceId: Boolean(serviceId),
      hasTemplateId: Boolean(templateId),
      hasPublicKey: Boolean(publicKey),
      hasPrivateKey: Boolean(privateKey),
    });

    return {
      delivered: false,
      skipped: true,
      reason: "EmailJS config missing",
    };
  }

  const payload = {
    service_id: serviceId,
    template_id: templateId,
    user_id: publicKey,
    template_params: {
      ...templateParams,
      sent_at: new Date().toISOString(),
    },
  };

  if (privateKey) {
    payload.accessToken = privateKey;
  }

  try {
    const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`EmailJS send failed (${response.status}): ${errorBody}`);
    }

    console.log(`${emailType} email sent successfully`, {
      to: templateParams.to_email,
    });

    return {
      delivered: true,
    };
  } catch (error) {
    console.error(`Failed to send ${emailType} email:`, error);
    return {
      delivered: false,
      error: error.message,
    };
  }
}

// Send registration welcome email
async function sendRegistrationEmail({ to, firstName, lastName }) {
  const fromName = process.env.EMAILJS_FROM_NAME || "Royal Mint";
  const replyTo = process.env.EMAILJS_REPLY_TO || "support@royalmint.com";

  const templateParams = {
    to_email: to,
    to_name: firstName ? `${firstName} ${lastName || ""}`.trim() : to,
    from_name: fromName,
    reply_to: replyTo,
    app_name: "Royal Mint",
    email_type: "registration",
    subject: "Welcome to Royal Mint - Registration Successful",
  };

  return await sendEmail({
    templateParams,
    emailType: "registration",
  });
}

// Send successful transaction notification
async function sendTransactionNotification({
  to,
  transactionId,
  amount,
  currency,
  status,
}) {
  const fromName = process.env.EMAILJS_FROM_NAME || "Royal Mint";
  const replyTo = process.env.EMAILJS_REPLY_TO || "support@royalmint.com";

  const templateParams = {
    to_email: to,
    to_name: to,
    from_name: fromName,
    reply_to: replyTo,
    transaction_id: String(transactionId),
    amount: Number(amount).toFixed(2),
    currency,
    status,
    app_name: "Royal Mint",
    email_type: "transaction_success",
    subject: "Transaction Completed Successfully",
  };

  return await sendEmail({
    templateParams,
    emailType: "transaction",
  });
}

// Send failed transaction notification
async function sendFailedTransactionNotification({
  to,
  transactionId,
  amount,
  currency,
  reason,
}) {
  const fromName = process.env.EMAILJS_FROM_NAME || "Royal Mint";
  const replyTo = process.env.EMAILJS_REPLY_TO || "support@royalmint.com";

  const templateParams = {
    to_email: to,
    to_name: to,
    from_name: fromName,
    reply_to: replyTo,
    transaction_id: String(transactionId || "N/A"),
    amount: Number(amount).toFixed(2),
    currency,
    status: "FAILED",
    reason: reason || "Transaction processing failed",
    app_name: "Royal Mint",
    email_type: "transaction_failed",
    subject: "Transaction Failed - Action Required",
  };

  return await sendEmail({
    templateParams,
    emailType: "failed_transaction",
  });
}

export {
  sendRegistrationEmail,
  sendTransactionNotification,
  sendFailedTransactionNotification,
};
