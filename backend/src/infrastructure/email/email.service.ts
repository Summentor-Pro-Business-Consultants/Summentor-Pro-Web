import {
  SendEmailCommand,
  SendEmailCommandInput,
  SendTemplatedEmailCommand,
  SendTemplatedEmailCommandInput,
  SESClient,
} from "@aws-sdk/client-ses";
import crypto from "crypto";

import { sesCredentials } from "../../config.ts";
import logger from "../logger/logger.service.ts";

class SESMailClient {
  private static instance: SESMailClient;
  private sesClient!: SESClient;

  private constructor() {
    this.initialiseSes();
  }

  private initialiseSes() {
    try {
      this.sesClient = new SESClient({
        region: sesCredentials.awsRegion,
        credentials: {
          accessKeyId: sesCredentials.awsAccessKeyId!,
          secretAccessKey: sesCredentials.awsSecretAccessKey!,
        },
      });

      logger.info("SES Mail Client initialized");
    } catch (error) {
      logger.error("Failed to initialize SES Mail Client", { error });
      throw error;
    }
  }

  public static getInstance() {
    if (!this.instance) {
      this.instance = new SESMailClient();
    }
    return this.instance;
  }

  // -------------------------------
  // 🔹 BASIC EMAIL (HTML)
  // -------------------------------
  async sendEmail(fromEmail: string, subject: string, htmlTemplate: string, toEmails: string[]) {
    const params: SendEmailCommandInput = {
      Source: fromEmail,
      Destination: {
        ToAddresses: toEmails,
      },
      Message: {
        Subject: {
          Data: subject,
          Charset: "UTF-8",
        },
        Body: {
          Html: {
            Data: htmlTemplate,
            Charset: "UTF-8",
          },
        },
      },
    };

    try {
      const command = new SendEmailCommand(params);
      const response = await this.sesClient.send(command);

      logger.info("Email sent successfully", {
        messageId: response.MessageId,
        to: toEmails,
      });

      return response;
    } catch (error) {
      logger.error("Error sending email", { error });
      throw new Error("Failed to send email", { cause: error });
    }
  }

  // -------------------------------
  // 🔥 TEMPLATE EMAIL (SES TEMPLATE)
  // -------------------------------
  async sendTemplatedEmail(
    templateName: string,
    fromEmail: string,
    toEmails: string[],
    templateData: Record<string, unknown>,
  ) {
    const params: SendTemplatedEmailCommandInput = {
      Source: fromEmail,
      Destination: {
        ToAddresses: toEmails,
      },
      Template: templateName,
      TemplateData: JSON.stringify(templateData), // VERY IMPORTANT
    };

    try {
      const command = new SendTemplatedEmailCommand(params);
      const response = await this.sesClient.send(command);

      logger.info("Templated email sent", {
        messageId: response.MessageId,
        template: templateName,
        to: toEmails,
      });

      return response;
    } catch (error) {
      logger.error("Error sending templated email", {
        error: error instanceof Error ? error.message : String(error),
        template: templateName,
      });
      throw new Error("Failed to send templated email", { cause: error });
    }
  }

  // -------------------------------
  // 🔹 OTP GENERATOR
  // -------------------------------
  generateOTP() {
    return crypto.randomInt(100000, 999999).toString();
  }
}

export const mailClient = SESMailClient.getInstance();
