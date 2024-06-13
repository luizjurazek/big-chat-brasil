import { DataTypes } from "sequelize";
import { sequelize } from "../config/connection";
import ClienteModel from "./clientModel";

const SMSModel = sequelize.define(
  "SMS",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    isWhatsApp: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    id_client: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Clients",
        key: "id",
      },
    },
  },
  {
    tableName: "sms",
  },
);

SMSModel.belongsTo(ClienteModel, {
  foreignKey: "id_client",
});

export default SMSModel;
