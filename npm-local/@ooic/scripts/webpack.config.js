const path = require("path")
const nodeExternals = require("webpack-node-externals")
const Dotenv = require("dotenv-webpack")
const webpack = require("webpack")
const NodemonPlugin = require("nodemon-webpack-plugin")
const ProgressPlugin = require("progress-bar-webpack-plugin")
const fs = require("fs")
module.exports = (env) => ({
  cache: false,
  entry: "./src/app.ts",
  mode: env.target,
  target: "node",
  node: {
    __dirname: true,
  },
  ...(env.target === "production" ? { devtool: "eval-cheap-source-map" } : {}),
  output: {
    path: path.resolve(__dirname, "../../../" + (env.target === "production" ? "build" : "build-debug")),
    filename: "index.js",
    devtoolModuleFilenameTemplate: "[absolute-resource-path]",
  },
  resolve: {
    extensions: [".ts", ".js"],
    alias: {
      "~": path.resolve(__dirname, "../../../src"),
      "~core": path.resolve(__dirname, "../../../../core"),
      "~shared": path.resolve(__dirname, "../../../../shared"),
    },
  },
  externals: [
    nodeExternals({
      allowlist: ["@ooic/core", "@ooic/scripts", "@ooic/router", "@ooic/utils"],
      // modulesFromFile:true,
      //modules:[]
    }),
  ],
  watch: env.target === "development" && env.watch === "true",
  plugins: [
    new Dotenv({
      path: env.target && fs.existsSync(`./.env.${env.target}`) ? `./.env.${env.target}` : ".env",
      safe: true,
      allowEmptyValues: true,
      systemvars: true,
      silent: true,
      defaults: false,
    }),
    new webpack.HotModuleReplacementPlugin({
      multiStep: true,
    }),
    new NodemonPlugin({ watch: "*", verbose: false }),
    new ProgressPlugin(),
  ],

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
        options: { allowTsInNodeModules: true },
      },
    ],
  },
})
