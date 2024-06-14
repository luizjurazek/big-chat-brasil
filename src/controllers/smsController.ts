import { Request, Response, NextFunction } from "express";
import Model from "../models/smsModel";
import ClientModel from "../models/clientModel";

const SMSModel = Model;

class SMSController {
  // method to send sms
  async sendMessage(req: Request, res: Response, next: NextFunction) {
    // #swagger.tags = ['SMS']
    // #swagger.description = 'Endpoint to send a massage'
    try {
      const costOfMessage: number = 0.25;
      const { phone, isWhatsApp, message, id_client } = req.body;

      const client = await ClientModel.findOne({
        where: {
          id: id_client,
        },
      });

      // Verify if client already exist
      if (!client) {
        const response: object = {
          error: true,
          message: "Client not found",
        };

        return res.status(404).json(response);
      }

      const clientData = client.dataValues;

      // Verify if client have balance
      const verifyPrePagoClientBalance: boolean = clientData.type_plan === "pre-pago" && clientData.credits < costOfMessage;
      const verifyPosPagoClientBalance: boolean = clientData.type_plan === "pos-pago" && (clientData.limit - clientData.limit_used) < costOfMessage;

      if (verifyPrePagoClientBalance || verifyPosPagoClientBalance) {
        const response: object = {
          error: true,
          message: "Client dont have balance",
          client,
        };

        return res.status(400).json(response);
      }

      const messageSended = await SMSModel.create({
        phone,
        isWhatsApp,
        message,
        id_client,
      });

      if (!messageSended) {
        const response: object = {
          error: true,
          message: "Has an error while sending the message",
        };

        return res.status(400).json(response);
      }

      const messageSendedData = messageSended.dataValues;

      // verify type of plan and send message
      let updateClient;
      let balance;

      if (clientData.type_plan === "pre-pago") {
        updateClient = await client.update({ credits: clientData.credits - costOfMessage });
        balance = updateClient.dataValues.credits;
      } else if(clientData.type_plan === "pos-pago") {
        updateClient = await client.update({ limit_used: parseFloat(clientData.limit_used) + costOfMessage });
        balance = parseFloat(updateClient.dataValues.limit) - parseFloat(updateClient.dataValues.limit_used);
      }

      if (!updateClient) {
        const response: object = {
          error: true,
          message: "Has an error while update the client",
        };

        // Destroy the message sendend
        await SMSModel.destroy({
          where: {
            id: messageSendedData.id,
          },
        });
        return res.status(400).json(response);
      }

      const response: object = {
        error: false,
        message: "Message send with successfully",
        clientInfo: {
          name: updateClient.dataValues.name,
          email: updateClient.dataValues.email,
          balance: balance,
        },
        messageSended,
      };

      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}

export default SMSController;
