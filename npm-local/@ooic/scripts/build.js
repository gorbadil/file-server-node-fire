const config = require("./webpack.config.js");
const webpack = require("webpack");
const fs = require("fs-extra");
const path = require("path");

const env = { target: "production", watch: "false" };

const cfg = config(env);
const compiler = webpack(cfg);

fs.rmSync("build-debug", { recursive: true, force: true });
fs.rmSync("build", { recursive: true, force: true });

compiler.run((err, stats) => {
  if (err) console.error(err);
});
fs.mkdirSync("build");

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

fs.writeFile("build/package.json", JSON.stringify(newPackageJson, undefined, 2), () => {});

fs.copySync("ssl", "build/ssl");
fs.copySync("public", "build/public");
fs.copySync("uploads", "build/uploads");
fs.copySync("src", "build/src");

const findAndRemoveContent = (folder) => {
  const items = fs.readdirSync(folder, {
    withFileTypes: true,
  });
  items.forEach((item) => {
    if (item.isFile()) {
      const itemPath = folder + "/" + item.name;
      const itemPathPure = itemPath.replace(/\.[^.]*$/, "");
      if (ext === "ts" || ext === "js") {
        fs.truncateSync(itemPath);
        fs.renameSync(itemPath, itemPathPure + ".keep");
      }
    } else {
      findAndRemoveContent(folder + "/" + item.name);
    }
  });
};
const p = path.resolve(__dirname, "../../../build/src");

findAndRemoveContent(p);
