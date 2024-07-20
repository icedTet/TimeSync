import { createTransport, Transport } from "nodemailer";
import Mail from "nodemailer/lib/mailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

if (!process.env.NODEMAILER_EMAIL) {
  throw new Error('Invalid/Missing environment variable: "NODEMAILER_EMAIL"');
}
if (!process.env.NODEMAILER_PASSWORD) {
  throw new Error(
    'Invalid/Missing environment variable: "NODEMAILER_PASSWORD"'
  );
}

const email = process.env.NODEMAILER_EMAIL;
const password = process.env.NODEMAILER_PASSWORD;
const options = {};

let transporter: Mail<SMTPTransport.SentMessageInfo>;
let MailTransporter: Promise<Mail<any>>;

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  // @ts-ignore
  if (!globalThis._nodeMailPromise) {
    transporter = createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: email,
        pass: password,
      },
    });
    // @ts-ignore
    globalThis._nodeMailPromise = transporter;
  }
  // @ts-ignore
  MailTransporter = globalThis._nodeMailPromise;
} else {
  // In production mode, it's best to not use a global variable.
  transporter = createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: email,
      pass: password,
    },
  });
  MailTransporter = transporter as any;
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default MailTransporter;
