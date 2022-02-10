const terser = require('rollup-plugin-terser').terser;
const commonjs = require('@rollup/plugin-commonjs');

module.exports = createLibConfig;

function createLibConfig(config) {
  return {
    ...config,
    output: {
      ...config.output,
      globals: {}
    },
    plugins: [...config.plugins || [], commonjs(), terser()]
  }
}