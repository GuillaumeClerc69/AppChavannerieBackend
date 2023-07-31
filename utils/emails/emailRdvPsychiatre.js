require('dotenv').config();
const Mailjet = require('node-mailjet');
const mailjet = Mailjet.apiConnect(`${process.env.MJ_APIKEY_PUBLIC}`, `${process.env.MJ_APIKEY_PRIVATE}`);
const moment = require('moment');
require('moment/locale/fr');
moment.locale('fr');
const ics = require('ics')
const dayjs = require('dayjs');
const fs = require('fs');
const path = require('path');

const sendAppointmentEmail = async (patientEmail, patientFisrtname, patientLastname, doctor, formattedDate, startHour, endHour, location, date, doctorEmail) => {
  
  const changeFormatDate = dayjs(date).format('YYYY-MM-DD');
  console.log(date)
  
const start = dayjs(`${changeFormatDate}T${startHour}:00.000Z`);
const end = dayjs(`${changeFormatDate}T${endHour}:00.000Z`);

console.log(start)
console.log(end)

  const duration = end.diff(start, 'minute'); // La durée en minutes

  console.log("Doctor email: ", doctorEmail);

  const event = {
    start: [start.year(), start.month() + 1, start.date(), start.hour(), start.minute()],
    duration: { minutes: duration },
    title: `Rendez-vous avec ${doctor}`,
    description: `Vous avez un rendez-vous avec ${doctor}`,
    location: location,
    status: 'CONFIRMED',
    organizer: { name: doctor, email: doctorEmail },
    attendees: [
      { name: `${patientFisrtname} ${patientLastname}`, email: patientEmail, rsvp: true, partstat: 'ACCEPTED', role: 'REQ-PARTICIPANT' }
    ]
  }

  const icsFile = await new Promise((resolve, reject) => {
    ics.createEvent(event, (error, value) => {
      if (error) {
        reject(error);
      }
      resolve(value);
    });
  });



// Générer un nom de sous-répertoire unique basé sur la date et l'heure actuelles
const dirName = `${dayjs().format('YYYYMMDDHHmmss')}`; // Utilisez le format de date/heure que vous préférez
const dirPath = path.join(__dirname, 'ICSfiles', dirName);
fs.mkdirSync(dirPath, { recursive: true });


// Créer le sous-répertoire
fs.mkdirSync(dirPath, { recursive: true });

// Créer le chemin du fichier ICS
const icsFilePath = path.join(dirPath, 'Cliquez.pour.ajouter.RDV.Agenda.ics');
fs.mkdirSync(dirPath, { recursive: true });

// Écrire le fichier ICS
fs.writeFileSync(icsFilePath, icsFile);

// Convert the ICS file to base64
  const icsFileBase64 = Buffer.from(icsFile).toString('base64');

const hrefUrl = `${process.env.REACT_APP_BACKEND_URL}/utils/ICSfiles/${dirName}/Cliquez.pour.ajouter.RDV.Agenda.ics`;
console.log(hrefUrl)

function deleteFolderAfterDelay(dirPath, delay) {
  // Supprime tous les fichiers du répertoire
  fs.readdir(dirPath, (err, files) => {
    if (err) throw err;

    for (const file of files) {
      fs.unlink(path.join(dirPath, file), err => {
        if (err) throw err;
      });
    }

    // Supprime le répertoire après le délai
    setTimeout(() => {
      fs.rmdir(dirPath, err => {
        if (err) throw err;
        console.log(`Directory ${dirPath} has been deleted after ${delay} ms`);
      });
    }, delay);
  });
}

// Utilisation de la fonction
const delay = 48 * 60 * 60 * 1000;  // 48 heures en millisecondes
deleteFolderAfterDelay(dirPath, delay);

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
                    Email: patientEmail,
                    Name: `${patientFisrtname} ${patientLastname}`
                  }
                ],
                Subject: "Nouveau rendez-vous",
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
      background-color: #ffffff;
      background-color: #ffffff
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
    #ko_textBlock_1 .links-color a,
    #ko_textBlock_1 .links-color a:link,
    #ko_textBlock_1 .links-color a:visited,
    #ko_textBlock_1 .links-color a:hover {
      color: #3f3f3f;
      color: #3f3f3f;
      text-decoration: underline
    }

    #ko_textBlock_2 .links-color a,
    #ko_textBlock_2 .links-color a:link,
    #ko_textBlock_2 .links-color a:visited,
    #ko_textBlock_2 .links-color a:hover {
      color: #3f3f3f;
      color: #3f3f3f;
      text-decoration: underline
    }

    .links-color a .links-color a:link .links-color a:visited .links-color a:hover {
      color: #cccccc;
      color: #cccccc;
      text-decoration: underline
    }
  </style>

</head>
<!--[if !(gte mso 16)]-->

<body bgcolor="#FFFFFF" text="#919191" alink="#cccccc" vlink="#cccccc"
  style="margin: 0; padding: 0; background-color: #ffffff; color: #919191;">
  <!--<![endif]-->
  <center>



    <table role="presentation" class="vb-outer" width="100%" cellpadding="0" border="0" cellspacing="0"
      bgcolor="#ffffff" id="ko_logoBlock_1" style="background-color: #ffffff">
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
                      <div style="vertical-align: top; width: 100%; max-width: 276px; -mru-width: 0px">
                        <!--
        -->
                        <table role="presentation" class="vb-content" border="0" cellspacing="9" cellpadding="0"
                          width="276"
                          style="border-collapse: separate; width: 100%; mso-cellspacing: 9px; border-spacing: 9px">

                          <tbody>
                            <tr>
                              <td width="100%" valign="top" align="center" class="links-color">
                                <!--[if (lte ie 8)]><div style="display: inline-block; width: 258px; -mru-width: 0px"><![endif]--><a
                                  target="_new" href="https://www.clinea.fr/clinique-la-chavannerie-chaponost-69"
                                  style="display: inline-block"><img alt="Logo Clinea" border="0" hspace="0"
                                    align="center" vspace="0" style="width: 200px; height: auto;"
                                    style="border: 0px; display: block; vertical-align: top; height: auto; margin: 0 auto; color: #3f3f3f; font-size: 13px; font-family: Poppins; width: 100%; max-width: 258px; height: auto;"
                                    src="https://mosaico.io/srv/f-6a48y0q/img?src=https%3A%2F%2Fmosaico.io%2Ffiles%2F6a48y0q%2Flogo-clinea.png&amp;method=resize&amp;params=258%2Cnull"></a>
                                <!--[if (lte ie 8)]></div><![endif]-->
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
      bgcolor="#ffffff" id="ko_titleBlock_1" style="background-color: #ffffff">
      <tbody>
        <tr>
          <td class="vb-outer" align="center" valign="top" style="padding-left: 9px; padding-right: 9px; font-size: 0">
            <!--[if (gte mso 9)|(lte ie 8)]><table role="presentation" align="center" border="0" cellspacing="0" cellpadding="0" width="570"><tr><td align="center" valign="top"><![endif]-->
            <!--
      -->
            <div style="margin: 0 auto; max-width: 570px; -mru-width: 0px">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" bgcolor="#ffffff" width="570"
                class="vb-row"
                style="border-collapse: separate; width: 100%; background-color: #ffffff; mso-cellspacing: 0px; border-spacing: 0px; max-width: 570px; -mru-width: 0px">

                <tbody>
                  <tr>
                    <td align="center" valign="top" style="font-size: 0; padding: 0 9px">
                      <div style="vertical-align: top; width: 100%; max-width: 552px; -mru-width: 0px">
                        <!--
        -->
                        <table role="presentation" class="vb-content" border="0" cellspacing="9" cellpadding="0"
                          style="border-collapse: separate; width: 100%; mso-cellspacing: 9px; border-spacing: 9px"
                          width="552">

                          <tbody>
                            <tr>
                              <td width="100%" valign="top" align="center"
                                style="font-weight: normal; color: #3f3f3f; font-size: 31px; font-family: Montserrat; text-align: center">
                                <span style="font-weight: normal"><strong>Cher.e Patient.e</strong></span>
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
                    <td class="long-text links-color" width="100%" valign="top" align="left"
                      style="font-weight: normal; color: #3f3f3f; font-size: 16px; font-family: Poppins, sans-serif; text-align: left; line-height: normal">
                      <p style="margin: 1em 0px; margin-bottom: 0px; margin-top: 0px; text-align: center;">Vous recevez
                        cet e-mail car vous avez un nouveau rendez-vous avec <strong>${doctor}</strong> le
                        <strong>${formattedDate}</strong> à <strong>${startHour}</strong> à l’endroit suivant :
                        <strong>${location}</strong>
                      </p>
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
      bgcolor="#ffffff" id="ko_buttonBlock_1" style="background-color: #ffffff">
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
                    <td valign="top" align="center">
                      <table role="presentation" cellpadding="12" border="0" align="center" cellspacing="0"
                        style="border-spacing: 0; mso-padding-alt: 12px 12px 12px 12px">
                        <tbody>
                          <tr>
                            <td width="auto" valign="middle" align="center" bgcolor="153D7C"
                              style="text-align: center; font-weight: normal; padding: 12px; padding-left: 24px; padding-right: 24px; background-color: 153D7C; color: #FFFFFF; font-size: 22px; font-family: Arial, Helvetica, sans-serif; border-radius: 50px">
                              <a style="text-decoration: none; font-weight: bold; color: #FFFFFF; font-size: 18px; font-family: Montserrat"
                                target="_new" href=${hrefUrl} <strong>Ajouter à mon agenda</strong></a>
                            </td>
                          </tr>
                        </tbody>
                      </table>
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
      bgcolor="#ffffff" id="ko_textBlock_2" style="background-color: #ffffff">
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
                    <td class="long-text links-color" width="100%" valign="top" align="left"
                      style="font-weight: normal; color: #3f3f3f; font-size: 16px; font-family: Poppins, sans-serif; text-align: left; line-height: normal">
                      <p style="margin: 1em 0px; margin-top: 0px; text-align: center;">Dans cette attente nous vous
                        souhaitons une excellente journée.</p>
                      <p style="margin: 1em 0px; margin-bottom: 0px; text-align: center;">Bien Cordialement,<br>L’équipe
                        de la Chavannerie</p>
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

</html>
              `,
"Attachments": [
          {
            "ContentType": "text/calendar",
            "Filename": "Cliquez.pour.ajouter.RDV.Agenda.ics",
            "Base64Content": icsFileBase64
          }
        ]
      }
    ]
  });

  try {
    const result = await request;
    console.log(result.body);
  } catch (err) {
    console.log(err.statusCode);
  }
};

module.exports = {
  sendAppointmentEmail,
};
