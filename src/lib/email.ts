type EmailInput = {
  to: string;
  subject: string;
  html: string;
  text: string;
};

const fromEmail = process.env.EMAIL_FROM ?? "Marketplace-ks <noreply@marketplace-ks.local>";

export async function sendEmail(input: EmailInput) {
  const resendApiKey = process.env.RESEND_API_KEY;

  if (!resendApiKey) {
    console.info("[dev-email]", {
      from: fromEmail,
      to: input.to,
      subject: input.subject,
      text: input.text,
    });
    return { sent: false, provider: "dev-console" };
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: fromEmail,
      to: input.to,
      subject: input.subject,
      html: input.html,
      text: input.text,
    }),
  });

  if (!response.ok) {
    const message = await response.text();
    console.error("[email-error]", message);
    return { sent: false, provider: "resend", error: message };
  }

  return { sent: true, provider: "resend" };
}

export async function sendWelcomeEmail(input: { to: string; name: string }) {
  const firstName = input.name.split(" ")[0] || input.name;

  return sendEmail({
    to: input.to,
    subject: "Urime, llogaria juaj ne Marketplace-ks u hap me sukses",
    text: `Pershendetje ${firstName}, urime! Sapo keni hapur llogari te re ne platformen Marketplace-ks. Tani mund te ruani shpallje, te krijoni shpallje dhe te nisni transaksione te sigurta.`,
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#17202a">
        <h2 style="margin:0 0 12px;color:#0f766e">Urime, ${firstName}!</h2>
        <p>Sapo keni hapur llogari te re ne platformen <strong>Marketplace-ks</strong>.</p>
        <p>Tani mund te ruani shpallje, te krijoni shpallje dhe te nisni transaksione te sigurta.</p>
        <p style="margin-top:24px;color:#667085">Faleminderit qe u bashkuat me Marketplace-ks.</p>
      </div>
    `,
  });
}

export async function sendPasswordResetEmail(input: { to: string; name: string; resetUrl: string }) {
  const firstName = input.name.split(" ")[0] || input.name;

  return sendEmail({
    to: input.to,
    subject: "Rikthe fjalekalimin ne Marketplace-ks",
    text: `Pershendetje ${firstName}, hape kete link per te ndryshuar fjalekalimin: ${input.resetUrl}. Linku eshte valid vetem 10 minuta.`,
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#17202a">
        <h2 style="margin:0 0 12px;color:#0f766e">Rikthe fjalekalimin</h2>
        <p>Pershendetje ${firstName}, kemi pranuar kerkese per ndryshim te fjalekalimit ne <strong>Marketplace-ks</strong>.</p>
        <p>Ky link eshte valid vetem <strong>10 minuta</strong>.</p>
        <p style="margin:24px 0">
          <a href="${input.resetUrl}" style="background:#0f766e;color:#fff;padding:12px 18px;border-radius:8px;text-decoration:none;font-weight:700">
            Ndrysho fjalekalimin
          </a>
        </p>
        <p style="color:#667085">Nese nuk e keni kerkuar kete ndryshim, mund ta injoroni kete email.</p>
      </div>
    `,
  });
}

export async function sendEmailVerificationEmail(input: { to: string; name: string; verifyUrl: string }) {
  const firstName = input.name.split(" ")[0] || input.name;

  return sendEmail({
    to: input.to,
    subject: "Verifiko email-in ne Marketplace-ks",
    text: `Pershendetje ${firstName}, verifiko email-in tend ne Marketplace-ks duke hapur kete link: ${input.verifyUrl}. Linku eshte valid 24 ore.`,
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#17202a">
        <h2 style="margin:0 0 12px;color:#0f766e">Verifiko email-in</h2>
        <p>Pershendetje ${firstName}, per te konfirmuar qe ky email ju takon juve, klikoni butonin me poshte.</p>
        <p>Ky link eshte valid <strong>24 ore</strong>.</p>
        <p style="margin:24px 0">
          <a href="${input.verifyUrl}" style="background:#0f766e;color:#fff;padding:12px 18px;border-radius:8px;text-decoration:none;font-weight:700">
            Verifiko email-in
          </a>
        </p>
        <p style="color:#667085">Nese nuk e keni hapur kete llogari, mund ta injoroni kete email.</p>
      </div>
    `,
  });
}
