import { OoicConfig, ooic } from "@ooic/core";
//import * as db from "./drivers/sequelize";

const config: OoicConfig = {
  allowedVersions:["v1.0.0"],
  
  cors: {
    enabled: true,
    options: {
      credentials: true,
      origin: function (_origin, callback) {
        callback(null, true);
      },
    },
  },
  morgan: {
    enabled: false,
    format: "combined",
  },
  ssl: {
    enabled: false,
  },
  cookieParser: {
    enabled: true,
  },
};

/* Connect with your drivers here */
/* await db.load();
await db.sync();
await db.seed(); */

/* Spin-up the http/https listeners.*/
await ooic(config);

