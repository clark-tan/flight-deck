/*
 * @Autor: clark tan
 * @Date: 2021-08-17 15:38:31
 * @LastEditors: clark tan
 * @LastEditTime: 2021-09-26 13:48:05
 * @Description:
 */
const IS_PROD = ["production", "prod"].includes(process.env.NODE_ENV);

const plugins = [];
if (IS_PROD) {
  plugins.push("transform-remove-console");
}

// lazy load ant-design-vue
// if your use import on Demand, Use this code
plugins.push([
  "import",
  {
    libraryName: "ant-design-vue",
    libraryDirectory: "es",
    style: true, // `style: true` 会加载 less 文件
  },
]);

module.exports = {
  presets: [
    "@vue/cli-plugin-babel/preset",
    [
      "@babel/preset-env",
      {
        useBuiltIns: "entry",
        corejs: 3,
      },
    ],
  ],
  plugins,
};
