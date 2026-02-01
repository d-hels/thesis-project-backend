import nodemailer from "nodemailer";

export const sendContractEmail = async (
  to: string,
  pdfBuffer: Buffer,
  fullName: string
) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Employvia" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Your Employment Contract",
    html: `
        <p>Hello ${fullName},</p>
        <p>Please find attached your employment contract.</p>

        <p>
            Kindly review the contract carefully. Once signed, please send it back to us at your earliest convenience.
        </p>

        <p>
          If you have any questions or need clarification on any part of the contract, feel free to reach out.
        </p>
        <p>
            Kind regards,<br/>
            Employvia
        </p>
    `,
    attachments: [
      {
        filename: `contract-${fullName.replace(/\s+/g, "-")}.pdf`,
        content: pdfBuffer,
      },
    ],
  });
};
