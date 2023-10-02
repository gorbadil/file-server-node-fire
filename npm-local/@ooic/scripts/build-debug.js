const config = require("./webpack.config.js");
const webpack = require("webpack");
const fs = require("fs-extra");

const env = { target: "development", watch: "false" };

const cfg = config(env);
const compiler = webpack(cfg);

fs.rmSync("build-debug", { recursive: true, force: true });
fs.rmSync("build", { recursive: true, force: true });

compiler.run((err, stats) => {
  console.log(stats);
  if (err) console.error(err);
});

fs.mkdirSync("build-debug");

const originalPackageJson = require("./../../../package.json");
const corePackageJson = require("../core/package.json");
originalPackageJson.dependencies["@ooic/core"] = undefined;
originalPackageJson.dependencies["@ooic/router"] = undefined;
originalPackageJson.dependencies["@ooic/scripts"] = undefined;
originalPackageJson.dependencies["@ooic/utils"] = undefined;

const newPackageJson = {
  name: originalPackageJson.name,
  version: originalPackageJson.version,
  scripts: {
    start: "node index.js",
  },
  dependencies: { ...originalPackageJson.dependencies, ...corePackageJson.dependencies },
};

fs.writeFile("build-debug/package.json", JSON.stringify(newPackageJson, undefined, 2), () => {});

fs.copy("ssl", "build-debug/ssl");
fs.copy("public", "build-debug/public");
fs.copy("uploads", "build-debug/uploads");
fs.copy("src", "build-debug/src");
