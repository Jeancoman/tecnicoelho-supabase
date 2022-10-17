import sendgrid from "@sendgrid/mail";
import type { NextApiRequest, NextApiResponse } from 'next'

sendgrid.setApiKey(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);

async function sendEmail(req: NextApiRequest, res: NextApiResponse) {
  try {
    await sendgrid.send({
      to: "jeanfranbg@gmail.com", // Your email where you'll receive emails
      from: "tecnicoelhocliente@gmail.com", // your website email address here
      subject: `${req.body.asunto}`,
      text: `${req.body.mensaje}`,
      html: ` </div>
      <div class="container" style="margin-left: 20px;margin-right: 20px;">
      <h3>Tienes un mensaje de ${req.body.nombre}, su correo electronico es : ✉️${req.body.email} </h3>
      <h3>Y su número telefonico es : 📱${req.body.telefono} </h3>
      <div style="font-size: 16px;">
      <p>Mensaje:</p>
      <p>${req.body.mensaje}</p>
      <br>
      </div>`,
    });
    console.log("Enviado")
  } catch (error: any) {
    return res.status(error.statusCode || 500).json({ error: error.message });
  }

  return res.status(200).json({ error: "" });
}

export default sendEmail;
