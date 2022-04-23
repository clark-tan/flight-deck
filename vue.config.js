/*
 * @Autor: clark tan
 * @Date: 2021-07-15 10:44:08
 * @LastEditors: clark tan
 * @LastEditTime: 2021-11-19 14:01:51
 * @Description:
 */
const CompressionWebpackPlugin = require("compression-webpack-plugin");
const productionGzipExtensions = ["js", "css"];
/**
 * 映射配置文件中的api地址为反射代理配置
 */
function mapApis() {
  const apis = process.env.APIS.split(",");
  return apis.reduce((x, y) => {
    x[y] = {
      target: process.env.API_BASE_URL,
      changeOrigin: true,
      ws: true,
      secure: false,
    };
    return x;
  }, {});
}
module.exports = {
  publicPath: "/",
  devServer: {
    port: process.env.DEV_SERVER_PORT,
    proxy: {
      ...mapApis(),
    },
  },
  configureWebpack: () => {
    if (process.env.NODE_ENV === "production") {
      return {
        plugins: [
          // 配置compression-webpack-plugin压缩
          new CompressionWebpackPlugin({
            algorithm: "gzip",
            test: new RegExp(
              "\\.(" + productionGzipExtensions.join("|") + ")$"
            ),
            threshold: 10240,
            minRatio: 0.8,
          }),
        ],
        optimization: {
          splitChunks: {
            chunks: "all",
            cacheGroups: {
              vue: {
                name: "vue",
                test: /[\\/]node_modules[\\/]vue[\\/]/,
                priority: -10,
              },
              vuex: {
                name: "vuex",
                test: /[\\/]node_modules[\\/]vuex[\\/]/,
                priority: -10,
              },
              "vue-router": {
                name: "vue-router",
                test: /[\\/]node_modules[\\/]vue-router[\\/]/,
                priority: -10,
              },
              "element-ui": {
                name: "element-ui",
                test: /[\\/]node_modules[\\/]element-ui[\\/]/,
                priority: -10,
              },
              "ant-design-vue": {
                name: "ant-design-vue",
                test: /[\\/]node_modules[\\/]ant-design-vue[\\/]/,
                priority: -10,
              },
              "common-ui": {
                name: "common-ui",
                test: /[\\/]node_modules[\\/]@pahm\/common-ui[\\/]/,
                priority: -10,
              },
              vendors: {
                name: "vendors",
                test: /[\\/]node_modules[\\/]/,
                priority: -20,
              },
            },
          },
        },
      };
    }
  },
  css: {
    loaderOptions: {
      less: {
        modifyVars: {
          // less vars，customize ant design theme
          "primary-color": "#0066CC",
          "border-radius-base": "2px",
          "text-color": "#222222",
          "text-color-secondary": "#999999",
          "border-color-base": "#ebebeb",
          "label-color": "#222222",
          "btn-default-color": "@text-color",
          "btn-default-border": "#d8d8d8",
          "primary-5": "#2b81d6",
          // 'shadow-color-1': 'rgba(0,0,0,14%)',
          // 'shadow-3': '0 1px 4px 0 @shadow-color-1',
        },
        // DO NOT REMOVE THIS LINE
        javascriptEnabled: true,
      },
    },
  },
  productionSourceMap: false,
};
