const HEADING_FONT = "'Tenor Sans', Georgia, 'Times New Roman', serif";
const BODY_FONT = "'Montserrat', Arial, Helvetica, sans-serif";

export function renderContactConfirmationHtml(name: string): string {
  const firstName = name.split(" ")[0] || name;

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>We've received your message</title>
    <!--[if mso]>
    <style>
      * { font-family: Georgia, 'Times New Roman', serif !important; }
    </style>
    <![endif]-->
  </head>
  <body style="margin:0; padding:0; background-color:#F9F9F9;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#F9F9F9;">
      <tr>
        <td align="center" style="padding:40px 16px;">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%; max-width:600px; background-color:#ffffff; border:1px solid #E5E5E5; border-radius:20px; overflow:hidden;">
            <tr>
              <td align="center" style="background-color:#00D18F; padding:36px 24px;">
                <span style="font-family:${HEADING_FONT}; font-size:26px; letter-spacing:1px; color:#ffffff;">KinCollage</span>
              </td>
            </tr>
            <tr>
              <td style="padding:44px 48px 8px;">
                <h1 style="margin:0 0 20px; font-family:${HEADING_FONT}; font-weight:400; font-size:30px; line-height:1.2; color:#515151;">
                  We've received your message
                </h1>
                <p style="margin:0 0 18px; font-family:${BODY_FONT}; font-size:16px; line-height:1.6; color:#7B7B7B;">
                  Hi ${firstName},
                </p>
                <p style="margin:0 0 18px; font-family:${BODY_FONT}; font-size:16px; line-height:1.6; color:#7B7B7B;">
                  Thank you so much for reaching out about your KinCollage. I've received your message and will get back to you soon — usually within 1&ndash;2 business days.
                </p>
                <table role="presentation" cellpadding="0" cellspacing="0" style="margin:8px 0 28px; border-left:3px solid #97FF77; background-color:#F9F9F9; border-radius:0 10px 10px 0;">
                  <tr>
                    <td style="padding:16px 20px; font-family:${HEADING_FONT}; font-style:italic; font-size:16px; line-height:1.5; color:#515151;">
                      Every collage begins with a story — I can't wait to hear yours.
                    </td>
                  </tr>
                </table>
                <p style="margin:0 0 4px; font-family:${HEADING_FONT}; font-style:italic; font-size:20px; color:#515151;">
                  Warmly,
                </p>
                <p style="margin:0 0 32px; font-family:${HEADING_FONT}; font-style:italic; font-size:20px; color:#515151;">
                  Zsofia
                </p>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding:20px 24px 32px; border-top:1px solid #F0F0F0;">
                <p style="margin:0; font-family:${BODY_FONT}; font-size:12px; line-height:1.6; color:#B0B0B0;">
                  &copy; ${new Date().getFullYear()} KinCollage. All rights reserved.
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

export function renderContactConfirmationText(name: string): string {
  const firstName = name.split(" ")[0] || name;
  return `Hi ${firstName},

Thank you so much for reaching out about your KinCollage. I've received your message and will get back to you soon — usually within 1-2 business days.

Every collage begins with a story — I can't wait to hear yours.

Warmly,
Zsofia`;
}
