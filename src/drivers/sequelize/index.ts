import { Sequelize, Dialect } from "@sequelize/core";
import fs from "fs";

export const sequelize = new Sequelize({
  dialect: process.env.DB_DRIVER as Dialect,
  port: Number(process.env.DB_PORT) || 3306,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  define: {
    underscored: false,
    charset: "utf8",
    collate: "utf8_general_ci",
    timestamps: true,
  },
  logQueryParameters: process.env.NODE_ENV === "development",
  logging: false,
});

export const connect = async () => {
  try {
    await sequelize.authenticate();
    console.log("\x1B[33mConnection has been established successfully.\x1B[0m");
  } catch (error) {
    console.error("\x1B[31mUnable to connect to the database:\x1B[0m", error);
  }
};
export const sync = async () => {
  try {
    await sequelize.sync({
      alter: process.env.NODE_ENV === "development",
      logging: false,
    });
    console.log(`\x1B[32mModels synchronized successfully.\x1B[0m`);
  } catch (error) {
    console.error("\x1B[31mUnable to sync:\x1B[0m", error);
  }
};

export const load = async () => {
  try {
    if (
      fs.existsSync("src/drivers/sequelize/model-relation-map.ts") ||
      fs.existsSync("src/drivers/sequelize/model-relation-map.keep")
    ) {
      await import("./model-relation-map");
    } else {
      console.warn(
        "Missing model relation mapper. Please put 'model-relation-map.ts' in src/models directory."
      );
    }
  } catch (err) {}
};

export const seed = async () => {
  if (
    fs.existsSync("src/drivers/sequelize/seeder.ts") ||
    fs.existsSync("src/drivers/sequelize/seeder.keep")
  ) {
    await (await import("./seeder")).default();
  }
};
