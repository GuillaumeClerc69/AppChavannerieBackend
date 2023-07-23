const Mailjet = require('node-mailjet');
require('dotenv').config();
const mailjet = Mailjet.apiConnect(`${process.env.MJ_APIKEY_PUBLIC}`, `${process.env.MJ_APIKEY_PRIVATE}`);

const sendResetPasswordEmail = async (userFirstname, lastname, email, randomtoken) => {

  console.log(email, lastname, userFirstname, randomtoken)

  const frontendUrl = `${process.env.REACT_APP_FRONTEND_URL}/reset-password?randomtoken=${randomtoken}`;

  const request = mailjet
    .post('send', { version: 'v3.1' })
    .request({
      Messages: [
      {
                From: {
                  Email: "guillaume.clerc.gc@gmail.com",
                  Name: "La Chavannerie"
                },
                To: [
                  {
                    Email: email,
                    Name: `${userFirstname} ${lastname}`
                  }
                ],
                Subject: "Mot de passe oublié",
                HTMLPart: `
               <!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office">

<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <meta name="viewport" content="initial-scale=1.0">
  <meta name="format-detection" content="telephone=no">
  <title>MOSAICO Responsive Email Designer</title>

  <style type="text/css">
    body {
      margin: 0;
      padding: 0;
    }

    img {
      border: 0px;
      display: block;
    }

    .socialLinks {
      font-size: 6px;
    }

    .socialLinks a {
      display: inline-block;
    }

    .long-text p {
      margin: 1em 0px;
    }

    .long-text p:last-child {
      margin-bottom: 0px;
    }

    .long-text p:first-child {
      margin-top: 0px;
    }
  </style>
  <style type="text/css">
    /* yahoo, hotmail */
    .ExternalClass,
    .ExternalClass p,
    .ExternalClass span,
    .ExternalClass font,
    .ExternalClass td,
    .ExternalClass div {
      line-height: 100%;
    }

    .yshortcuts a {
      border-bottom: none !important;
    }

    .vb-outer {
      min-width: 0 !important;
    }

    .RMsgBdy,
    .ExternalClass {
      width: 100%;
      background-color: #3f3f3f;
      background-color: #3f3f3f
    }

    /* outlook/office365 add buttons outside not-linked images and safari have 2px margin */
    [o365] button {
      margin: 0 !important;
    }

    /* outlook */
    table {
      mso-table-rspace: 0pt;
      mso-table-lspace: 0pt;
    }

    #outlook a {
      padding: 0;
    }

    img {
      outline: none;
      text-decoration: none;
      border: none;
      -ms-interpolation-mode: bicubic;
    }

    a img {
      border: none;
    }

    @media screen and (max-width: 600px) {

      table.vb-container,
      table.vb-row {
        width: 95% !important;
      }

      .mobile-hide {
        display: none !important;
      }

      .mobile-textcenter {
        text-align: center !important;
      }

      .mobile-full {
        width: 100% !important;
        max-width: none !important;
      }
    }

    /* previously used also screen and (max-device-width: 600px) but Yahoo Mail doesn't support multiple queries */
  </style>
  <style type="text/css">
    #ko_singleArticleBlock_1 .links-color a,
    #ko_singleArticleBlock_1 .links-color a:link,
    #ko_singleArticleBlock_1 .links-color a:visited,
    #ko_singleArticleBlock_1 .links-color a:hover {
      color: #3f3f3f;
      color: #3f3f3f;
      text-decoration: underline
    }

    #ko_textBlock_1 .links-color a,
    #ko_textBlock_1 .links-color a:link,
    #ko_textBlock_1 .links-color a:visited,
    #ko_textBlock_1 .links-color a:hover {
      color: #3f3f3f;
      color: #3f3f3f;
      text-decoration: underline
    }

    # .links-color a,
    # .links-color a:link,
    # .links-color a:visited,
    # .links-color a:hover {
      color: #cccccc;
      color: #cccccc;
      text-decoration: underline
    }
  </style>

</head>
<!--[if !(gte mso 16)]-->

<body bgcolor="#3f3f3f" text="#919191" alink="#cccccc" vlink="#cccccc"
  style="margin: 0; padding: 0; background-color: #3f3f3f; color: #919191;">
  <!--<![endif]-->
  <center>



    <table role="presentation" class="vb-outer" width="100%" cellpadding="0" border="0" cellspacing="0"
      bgcolor="#ffffff" id="ko_singleArticleBlock_1" style="background-color: #ffffff">
      <tbody>
        <tr>
          <td class="vb-outer" align="center" valign="top" style="padding-left: 9px; padding-right: 9px; font-size: 0">
            <!--[if (gte mso 9)|(lte ie 8)]><table role="presentation" align="center" border="0" cellspacing="0" cellpadding="0" width="570"><tr><td align="center" valign="top"><![endif]-->
            <!--
      -->
            <div style="margin: 0 auto; max-width: 570px; -mru-width: 0px">
              <table role="presentation" border="0" cellpadding="0" cellspacing="9" bgcolor="#ffffff" width="570"
                class="vb-row"
                style="border-collapse: separate; width: 100%; background-color: #ffffff; mso-cellspacing: 9px; border-spacing: 9px; max-width: 570px; -mru-width: 0px">

                <tbody>
                  <tr>
                    <td align="center" valign="top" style="font-size: 0">
                      <div style="vertical-align: top; width: 100%; max-width: 552px; -mru-width: 0px">
                        <!--
        -->
                        <table role="presentation" class="vb-content" border="0" cellspacing="9" cellpadding="0"
                          style="border-collapse: separate; width: 100%; mso-cellspacing: 9px; border-spacing: 9px"
                          width="552">

                          <tbody>
                            <tr>
                              <td width="100%" valign="top" align="center" class="links-color"
                                style="padding-bottom: 9px">
                                <!--[if (lte ie 8)]><div style="display: inline-block; width: 534px; -mru-width: 0px"><![endif]--><a
                                  target="_new" href="https://www.clinea.fr/clinique-la-chavannerie-chaponost-69"
                                  style="color: #3f3f3f; color: #3f3f3f; text-decoration: underline; display: inline-block;"><img
                                    alt="Logo Clinéa" border="0" hspace="0" align="center" vspace="0" width="240"
                                    style="border: 0px; display: block; vertical-align: top; height: auto; margin-bottom: 15px; color: #3f3f3f; font-size: 13px; font-family: Poppins; width: 100%; max-width: 240px; height: auto;"
                                    src="https://mosaico.io/srv/f-6a48y0q/img?src=https%3A%2F%2Fmosaico.io%2Ffiles%2F6a48y0q%2Flogo-clinea.png&amp;method=resize&amp;params=258%2Cnull"></a>
                                <!--[if (lte ie 8)]></div><![endif]-->
                              </td>
                            </tr>
                            <tr>
                              <td width="100%" valign="top" align="center"
                                style="font-weight: normal; color: #3f3f3f; font-size: 18px; font-family: Monserrat">
                                <span style="font-weight: normal">Bonjour <strong>${userFirstname}
                                    ${lastname}</strong></span>
                              </td>
                            </tr>
                            <tr>
                              <td class="long-text links-color" width="100%" valign="top" align="center"
                                style="font-weight: normal; color: #3f3f3f; font-size: 13px; font-family: Poppins; text-align: center; line-height: normal">
                                <p style="margin: 1em 0px; margin-bottom: 0px; margin-top: 0px; text-align: center;">
                                  Veuillez cliquer sur le lien suivant pour réinitialiser votre mot de passe&nbsp;</p>
                              </td>
                            </tr>
                            <tr>
                              <td style="font-size:5px; color:#ffffff;">
                                <p>Test</p>
                              </td>
                            </tr>
                            <tr>
                              <td valign="top" align="center">
                                <table role="presentation" cellpadding="6" border="0" align="center" cellspacing="0"
                                  style="border-spacing: 0; mso-padding-alt: 6px 6px 6px 6px; padding-top: 4px">
                                  <tbody>
                                    <tr>
                                      <td width="auto" valign="middle" align="center" bgcolor="#153D7C"
                                        style="max-width: 220px; height: 23px; text-align: center; font-weight: normal; padding: 6px; padding-left: 18px; padding-right: 18px; background-color: #153D7C; color: #FFFFFF; font-size: 13px; font-family: Poppins; border-radius: 20px">
                                        <a style="text-decoration: none; font-weight: normal; color: #FFFFFF; font-size: 13px; font-family: Poppins"
                                          target="_new" href="${frontendUrl}">Réinitialiser mon mot de passe</a>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                            </tr>

                          </tbody>
                        </table>
                      </div>
                    </td>
                  </tr>

                </tbody>
              </table>
            </div>
            <!--
    -->
            <!--[if (gte mso 9)|(lte ie 8)]></td></tr></table><![endif]-->
          </td>
        </tr>
      </tbody>
    </table>
    <table role="presentation" class="vb-outer" width="100%" cellpadding="0" border="0" cellspacing="0"
      bgcolor="#ffffff" id="ko_textBlock_1" style="background-color: #ffffff">
      <tbody>
        <tr>
          <td class="vb-outer" align="center" valign="top" style="padding-left: 9px; padding-right: 9px; font-size: 0">
            <!--[if (gte mso 9)|(lte ie 8)]><table role="presentation" align="center" border="0" cellspacing="0" cellpadding="0" width="570"><tr><td align="center" valign="top"><![endif]-->
            <!--
      -->
            <div style="margin: 0 auto; max-width: 570px; -mru-width: 0px">
              <table role="presentation" border="0" cellpadding="0" cellspacing="18" bgcolor="#ffffff" width="570"
                class="vb-container"
                style="border-collapse: separate; width: 100%; background-color: #ffffff; mso-cellspacing: 18px; border-spacing: 18px; max-width: 570px; -mru-width: 0px">

                <tbody>
                  <tr>
                    <td class="long-text links-color" width="100%" valign="top" align="center"
                      style="margin-top:-10px; font-weight: normal; color: #3f3f3f; font-size: 13px; font-family: Poppins; text-align: center; line-height: normal">
                      <p style="margin: 1em 0px; margin-top: 0px;">Nous vous souhaitons une excellente journée.</p>
                      <p style="font-family: Poppins; margin: 1em 0px; margin-bottom: 0px;"><br>Bien
                        Cordialement,<br>L'équipe de la
                        Chavannerie</p>
                    </td>
                  </tr>

                </tbody>
              </table>
            </div>
            <!--
    -->
            <!--[if (gte mso 9)|(lte ie 8)]></td></tr></table><![endif]-->
          </td>
        </tr>
      </tbody>
    </table>

  </center>
  <!--[if !(gte mso 16)]-->
</body>
<!--<![endif]-->

</html>`
    }]
  });

  try {
    const result = await request;
    console.log(result.body);
  } catch (err) {
  console.log(err.statusCode);
  console.log(err.message);
}
};

module.exports = {
  sendResetPasswordEmail,
};
