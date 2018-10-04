const path = require("path")
// const glob = require("glob")
const entry = require("webpack-glob-entry")

module.exports = {
  entry: entry("./src/html/index.ts"),

  output: {
    path: path.join(__dirname, "dist/html"),
    filename: "[name].bundle.js",
    chunkFilename: "[id].chunk.js"
  },

  // Enable sourcemaps for debugging webpack output.
  devtool: "source-map",

  resolve: {
      // Add ".ts" and ".tsx" as resolvable extensions.
      extensions: [".ts", ".tsx", ".js", ".json"]
  },

  module: {
      rules: [
          // All files with a ".ts" or ".tsx" extension will be handled by "awesome-typescript-loader".
          { test: /\.tsx?$/, loader: "awesome-typescript-loader" },

          // All output ".js" files will have any sourcemaps re-processed by "source-map-loader".
          { enforce: "pre", test: /\.js$/, loader: "source-map-loader" }
      ]
  }
};