import Mailjet from "node-mailjet";
import { renderEmailTemplate } from "./templateRenderer";

const mailjet = Mailjet.apiConnect(
  process.env.MAILJET_API_KEY as string,
  process.env.MAILJET_API_SECRET as string
);

interface EmailData {
  subject: string;
  body?: string;
  text?: string;
  [key: string]: any;
}

export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const sendEmail = async (
  email: string,
  templateName: string,
  data: EmailData
): Promise<void> => {
  const htmlTemplate = renderEmailTemplate(templateName, data);

  const request = mailjet.post("send", { version: "v3.1" }).request({
    Messages: [
      {
        From: {
          Email:  "owambe.erp@gmail.com",
          Name: "Flowva",
        },
        To: [
          {
            Email: email,
            Name: "User",
          },
        ],
        Subject: data.subject,
        TextPart: data.text || data.body,
        HTMLPart: htmlTemplate,
      },
    ],
  });

  try {
    const response = await request;
    console.log("Email sent successfully:", response.body);
  } catch (error: any) {
    console.error("Error sending email:", error.statusCode, error.message);
    throw new Error("Failed to send email");
  }
};
