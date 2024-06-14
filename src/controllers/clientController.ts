import { Request, Response, NextFunction } from "express";
import Client from "../models/clientModel";
import validateClienteData from "../utils/validateClientData";

const ClientModel = Client;

class ClientController {
  // method to get info of a client
  async getClient(req: Request, res: Response, next: NextFunction) {
    // #swagger.tags = ['Client']
    // #swagger.description = 'Endpoint to get info of a client'

    try {
      const id = req.params.id;

      const client = await ClientModel.findOne({
        where: {
          id,
        },
      });

      if (!client) {
        const response: object = {
          error: true,
          message: "Client not found",
        };

        return res.status(404).json(response);
      }

      const response: object = {
        error: false,
        massage: "Client found with successfully",
        client,
      };

      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  // method to create a client
  async createClient(req: Request, res: Response, next: NextFunction) {
    // #swagger.tags = ['Client']
    // #swagger.description = 'Endpoint to create a client'
    try {

      // Verify Client data
      const validateDataError = await validateClienteData(req.body);

      if (validateDataError !== null) {
        const response: object = {
          error: true,
          message: validateDataError,
        };

        return res.status(400).json(response);
      } else {
        const { name, email, phone, cpf, responsible, cnpj, company_name, type_plan } = req.body;
        let { credits, limit } = req.body;

        // if client has pos-pago plan set the value of credits to 0 
        if (type_plan === "pos-pago") {
          credits = 0;
        } else {
        // else client has pre-pago plan set the value of limit to 0 
          limit = 0;
        }

        const newClient = await ClientModel.create({
          name,
          email,
          phone,
          cpf,
          responsible,
          cnpj,
          company_name,
          type_plan,
          credits,
          limit,
        });

        if (!newClient) {
          const response: object = {
            error: true,
            message: "Has an error while create Client",
          };

          return res.status(400).json(response);
        }

        const response: object = {
          error: true,
          message: "Client created with successfully",
          client: newClient,
        };
        return res.status(201).json(response);
      }
    } catch (error) {
      next(error);
    }
  }

  // method to add credit to a client with plan "pre-pago"
  async addCredit(req: Request, res: Response, next: NextFunction) {
    // #swagger.tags = ['Client']
    // #swagger.description = 'to add credit to a client with plan pre-pago'
    try {
      const { id, amount } = req.body;

      const client = await ClientModel.findOne({
        where: {
          id,
        },
      });

      console.log(client);

      if (!client) {
        const response: object = {
          error: true,
          message: "Client not found",
        };

        return res.status(404).json(response);
      }

      // If client has pos-pago plan return an error
      if (client.dataValues.type_plan === "pos-pago") {
        const response: object = {
          error: true,
          message: "Client with plan pos-pago",
        };

        return res.status(400).json(response);
      }

      // when client has pre-pago plan, add the current credits with the new value
      const clientCredits: number = parseFloat(client.dataValues.credits);
      const newValue: number = clientCredits + parseFloat(amount);

      await client.update({ credits: newValue });

      const response: object = {
        error: false,
        message: "Credits inseted with successfully",
        old_credits: clientCredits,
        new_credits: newValue,
      };

      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  // method to check balance a client
  async checkBalance(req: Request, res: Response, next: NextFunction) {
    // #swagger.tags = ['Client']
    // #swagger.description = 'Endpoint to check balance of a client'
    try {
      const id = req.params.id;

      const client = await ClientModel.findOne({
        where: {
          id,
        },
      });

      if (!client) {
        const response: object = {
          error: true,
          message: "Client not found",
        };

        return res.status(404).json(response);
      }

      // If client has a pre-pago plan return the credits
      if (client.dataValues.type_plan === "pre-pago") {
        const credits: number = parseFloat(client.dataValues.credits);

        const response: object = {
          error: false,
          credits,
        };

        return res.status(200).json(response);
      }

      // when client has a pos-pago plan, get the balance and return the limit, limit_used and balance
      const limit: number = parseFloat(client.dataValues.limit);
      const limit_used: number = parseFloat(client.dataValues.limit_used);
      const balance: number = limit - limit_used;

      const response: object = {
        error: false,
        limit,
        limit_used,
        balance,
      };

      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  // method to alter plan of a client
  async alterPlan(req: Request, res: Response, next: NextFunction) {
    // #swagger.tags = ['Client']
    // #swagger.description = 'Endpoint to alter plan of a client'
    try {
      const resetValue = 0.00

      const id = req.body;
      const client = await ClientModel.findOne({
        where: id,
      });

      if (!client) {
        const response: object = {
          error: true,
          message: "Client not found",
        };

        return res.status(404).json(response);
      }

      // When client is pos-pago, get the balance transform in credits and reset the value of limit and limit used, then alter plan
      if (client.dataValues.type_plan === "pos-pago") {
        const limit: number = parseFloat(client.dataValues.limit);
        const limit_used: number = parseFloat(client.dataValues.limit_used);

        const new_credit: number = limit - limit_used;

        const clientUpdate = await client.update({ type_plan: "pre-pago", credits: new_credit, limit: resetValue, limit_used: resetValue });

        const response: object = {
          error: false,
          message: "Plan update with successfully",
          clientUpdate,
        };

        return res.status(200).json(response);
      }

      // When client is pre-pago, insert "balance" on limit used, usually this is put a negative value on limit used
      const clientCredits: number = parseFloat(client.dataValues.credits);
      const clientUpdate = await client.update({ type_plan: "pos-pago", limit_used: -clientCredits, credits: resetValue });

      console.log(clientUpdate);

      const response: object = {
        error: false,
        message: "Plan update with successfully",
        clientUpdate,
      };

      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  // method to alter limit of a client with pos-pago plan
  async alterLimitOfClient(req: Request, res: Response, next: NextFunction) {
    // #swagger.tags = ['Client']
    // #swagger.description = 'Endpoint to alter limit of a client'
    try {
      const { id, new_limit }: { id: number; new_limit: number } = req.body;
      const client = await ClientModel.findOne({ where: { id } });

      if (!client) {
        const response: object = {
          error: true,
          message: "Client not found",
        };

        return res.status(404).json(response);
      }


      // when client has a pre-pago plan return an error
      if (client.dataValues.type_plan === "pre-pago") {
        const response: object = {
          error: true,
          message: "Client with plan pre-pago",
        };

        return res.status(400).json(response);
      }

      // if client has a pos-pago plan, alter de limit, considering the new limit as a total and not an increment
      const clientLimit: number = parseFloat(client.dataValues.limit);
      await client.update({ limit: new_limit });

      const response: object = {
        error: false,
        old_limit: clientLimit,
        new_limit,
      };

      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}

export default ClientController;
