const config = require("./webpack.config.js");
const webpack = require("webpack");
const fs = require("fs");

const env = { target: "production", watch: "false" };

const cfg = config(env);
const compiler = webpack(cfg);

fs.rmSync("build", { recursive: true, force: true });

compiler.run((err, stats) => {
  if (err) console.error(err);
  else {
    require("../../../build/index.js")
  }
});
