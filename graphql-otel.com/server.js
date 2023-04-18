import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import express from "express";
import cors from "cors";
import expressStaticGzip from "express-static-gzip";
import sgMail from "@sendgrid/mail";

const config = {
  STATIC_FOLDER: process.env.STATIC_FOLDER,
  HTTP_PORT: process.env.HTTP_PORT,
  SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
  SENDGRID_FROM: process.env.SENDGRID_FROM,
};

sgMail.setApiKey(config.SENDGRID_API_KEY);

const app = express();
app.use(cors());
app.use(express.json());
app.post("/contact", async (req, res) => {
  const { email, name, message } = req.body;

  const msg = {
    to: [email, config.SENDGRID_FROM],
    from: config.SENDGRID_FROM,
    subject: "GraphQL Tracing with OpenTelemetry",
    text: `Hey ${name} ${email}, I'm Dan. Thanks for contacting about support with GraphQL OTEL. We will get back to you shortly. ${message}`,
  };

  try {
    await sgMail.send(msg);
  } catch (error) {
    console.error(error);
  }

  res.end();
});

app.use(expressStaticGzip(config.STATIC_FOLDER, {}));
app.get("*", expressStaticGzip(config.STATIC_FOLDER, {}));
app.use("*", expressStaticGzip(config.STATIC_FOLDER, {}));

function main() {
  app.listen(config.HTTP_PORT, (err) => {
    if (err) {
      console.error(err);
    }

    console.log(`Listening at http://localhost:${config.HTTP_PORT}`);
  });
}

main();
