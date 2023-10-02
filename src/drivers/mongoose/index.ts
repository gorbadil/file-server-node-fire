/**
 * Manages a Mongoose connection to a MongoDB database.
 * Provides a reusable connection instance and a function for connecting to the database.
 */
import { ConnectOptions, Connection, createConnection } from "mongoose";

/**
 * The Mongoose connection instance.
 * It will be initialized when the `connect` function is called and reused on subsequent calls.
 */
export let mongoose: Connection;

/**
 * Establishes a connection to the MongoDB database using Mongoose.
 * If a connection already exists, it will be reused.
 *
 * @returns A Promise that resolves to the Mongoose connection object.
 * @throws {Error} An error is thrown if unable to connect to the database.
 *
 * @remarks
 * This function establishes a connection to a MongoDB database using the Mongoose library. It follows
 * the singleton pattern to ensure that only one connection is created and reused if it already exists.
 * If the connection is successful, it returns the Mongoose connection object. If an error occurs during
 * connection, it logs the error and throws an exception.
 */
export const connect = async () => {
  mongoose =
    mongoose ||
    (await createConnection(process.env.MONGODB_CONN, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as ConnectOptions)
      .asPromise()
      .then((db) => {
        console.log("\x1B[33mMongoose connection has been established successfully.\x1B[0m", db.name);
        return db;
      })
      .catch((error) => {
        throw { message: "Unable to connect to the database", error };
      }));
  return mongoose;
};
