import { DataTypes } from "sequelize";
import { sequelize } from "../config/connection";

const ClienteModel = sequelize.define(
  "Client",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    cpf: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    responsible: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    cnpj: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    company_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type_plan: {
      type: DataTypes.ENUM("pre-pago", "pos-pago"),
      allowNull: false,
    },
    credits: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.0,
    },
    limit_used: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.0,
    },
    limit: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.0,
    },
  },
  {
    tableName: "Clients",
  },
);

// Exemplo de uso de sincronização automática (geralmente usado em desenvolvimento)
async function syncDB() {
  try {
    await ClienteModel.sync({ force: true }); // Força a sincronização, cuidado com dados existentes!
    console.log('Tabela sincronizada com sucesso.');
  } catch (error) {
    console.error('Erro ao sincronizar tabela:', error);
  }
}

// Chamada para sincronizar a tabela
syncDB();

export default ClienteModel;
