import https from "https";

function postJson(urlString, payload) {
  return new Promise((resolve, reject) => {
    const url = new URL(urlString);

    const req = https.request(
      {
        method: "POST",
        hostname: url.hostname,
        path: `${url.pathname}${url.search}`,
        headers: {
          "Content-Type": "application/json",
        },
      },
      (res) => {
        let body = "";
        res.on("data", (chunk) => {
          body += chunk;
        });
        res.on("end", () => {
          resolve({
            ok: res.statusCode >= 200 && res.statusCode < 300,
            status: res.statusCode,
            body,
          });
        });
      }
    );

    req.on("error", reject);
    req.write(JSON.stringify(payload));
    req.end();
  });
}

// Helper to send email via EmailJS
async function sendEmail({ templateParams, emailType = "general" }) {
  const serviceId = process.env.EMAILJS_SERVICE_ID;
  const templateIdByType = {
    registration: process.env.EMAILJS_TEMPLATE_ID_REGISTRATION,
    transaction: process.env.EMAILJS_TEMPLATE_ID_TRANSACTION,
    failed_transaction: process.env.EMAILJS_TEMPLATE_ID_FAILED_TRANSACTION,
  };
  const templateId = templateIdByType[emailType] || process.env.EMAILJS_TEMPLATE_ID;
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

  const resolvedRecipient =
    templateParams?.to_email ||
    templateParams?.to ||
    templateParams?.email ||
    templateParams?.user_email ||
    "";

  const payload = {
    service_id: serviceId,
    template_id: templateId,
    user_id: publicKey,
    template_params: {
      ...templateParams,
      to_email: resolvedRecipient,
      to: resolvedRecipient,
      email: resolvedRecipient,
      user_email: resolvedRecipient,
      sent_at: new Date().toISOString(),
    },
  };

  if (privateKey) {
    payload.accessToken = privateKey;
  }

  try {
    const response = await postJson("https://api.emailjs.com/api/v1.0/email/send", payload);

    if (!response.ok) {
      if (
        response.status === 403 &&
        typeof response.body === "string" &&
        response.body.toLowerCase().includes("non-browser applications")
      ) {
        console.warn(
          `Skipping ${emailType} email: EmailJS account currently blocks server-side API calls.`
        );
        return {
          delivered: false,
          skipped: true,
          reason: "EmailJS blocks server-side API calls for this account",
        };
      }

      const responseBody = typeof response.body === "string" ? response.body.trim() : "";
      const compactDetails = responseBody.length > 400 ? `${responseBody.slice(0, 400)}...` : responseBody;

      console.warn(`Skipping ${emailType} email: EmailJS send failed (${response.status})`, {
        templateId,
        serviceId,
        to: templateParams?.to_email,
        details: compactDetails || "No response body",
      });
      return {
        delivered: false,
        skipped: true,
        reason: `EmailJS send failed (${response.status})`,
        details: responseBody,
      };
    }

    console.log(`${emailType} email sent successfully`, {
      to: templateParams.to_email,
    });

    return {
      delivered: true,
    };
  } catch (error) {
    console.warn(`Skipping ${emailType} email due to provider/network error: ${error.message}`);
    return {
      delivered: false,
      skipped: true,
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
    transactionId: String(transactionId),
    transaction_id: String(transactionId),
    amountValue: Number(amount).toFixed(2),
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
    transactionId: String(transactionId || "N/A"),
    transaction_id: String(transactionId || "N/A"),
    amountValue: Number(amount).toFixed(2),
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
