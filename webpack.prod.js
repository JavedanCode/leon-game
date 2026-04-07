const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");

module.exports = merge(common, {
  mode: "production",
  output: {
    publicPath: "/leon-game/",
    clean: true,
  },
});
