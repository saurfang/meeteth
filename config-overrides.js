const { injectBabelPlugin } = require("react-app-rewired");

module.exports = function override(config, env) {
  return injectBabelPlugin(
    ["import", { libraryName: "antd", libraryDirectory: "es", style: "css" }],
    config
  );
};
