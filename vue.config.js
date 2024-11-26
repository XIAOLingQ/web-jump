module.exports = {
    chainWebpack: config => {
      // 修改入口文件路径为 index.js
      config.entry('app').clear().add('./src/index.js')
    }
  };
  