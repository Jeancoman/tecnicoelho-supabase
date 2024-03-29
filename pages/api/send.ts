import sendgrid from "@sendgrid/mail";
import type { NextApiRequest, NextApiResponse } from 'next'

sendgrid.setApiKey(process.env.NEXT_PUBLIC_SENDGRID_API_KEY!);

async function sendEmail(req: NextApiRequest, res: NextApiResponse) {

  await sendgrid.send({
    to: "jeanbolivar@proton.me",
    from: "tecnicoelhocliente@gmail.com",
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

  return res.status(200).json({});
}

export default sendEmail;
