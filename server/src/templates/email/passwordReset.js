function getPasswordResetEmailHTML(name, url) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password - PizzaCraft</title>
</head>
<body style="margin:0;padding:0;background-color:#0B0F14;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0B0F14;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#141518;border-radius:16px;border:1px solid rgba(255,255,255,0.06);overflow:hidden;">
          <tr>
            <td style="padding:40px 40px 20px;text-align:center;">
              <div style="display:inline-block;width:56px;height:56px;background:linear-gradient(135deg,#E63946,#d4202e);border-radius:14px;text-align:center;line-height:56px;font-size:24px;color:#fff;font-weight:bold;">P</div>
            </td>
          </tr>
          <tr>
            <td style="padding:0 40px;text-align:center;">
              <h1 style="color:#ffffff;font-size:24px;font-weight:700;margin:0 0 8px;">Reset Your Password</h1>
              <p style="color:rgba(255,255,255,0.5);font-size:14px;margin:0 0 32px;">Hi ${name}, we received a password reset request.</p>
            </td>
          </tr>
          <tr>
            <td style="padding:0 40px;text-align:center;">
              <p style="color:rgba(255,255,255,0.6);font-size:14px;line-height:1.6;margin:0 0 32px;">
                Click the button below to reset your password. This link will expire in 1 hour.
              </p>
              <a href="${url}" style="display:inline-block;padding:14px 32px;background:linear-gradient(135deg,#E63946,#d4202e);color:#ffffff;font-size:14px;font-weight:600;text-decoration:none;border-radius:12px;box-shadow:0 4px 14px rgba(230,57,70,0.35);">
                Reset Password
              </a>
            </td>
          </tr>
          <tr>
            <td style="padding:32px 40px;text-align:center;">
              <p style="color:rgba(255,255,255,0.3);font-size:12px;line-height:1.5;margin:0;">
                If you didn't request a password reset, you can safely ignore this email. Your password will not be changed.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 40px 30px;text-align:center;border-top:1px solid rgba(255,255,255,0.06);">
              <p style="color:rgba(255,255,255,0.3);font-size:11px;margin:0;">
                &copy; ${new Date().getFullYear()} PizzaCraft. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function getPasswordResetEmailText(name, url) {
  return `Hi ${name},\n\nWe received a password reset request. Please reset your password by visiting:\n\n${url}\n\nThis link will expire in 1 hour.\n\nIf you didn't request a password reset, you can safely ignore this email.\n\n© ${new Date().getFullYear()} PizzaCraft`;
}

export { getPasswordResetEmailHTML, getPasswordResetEmailText };
