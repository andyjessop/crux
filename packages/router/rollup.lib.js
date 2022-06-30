const copy = require('rollup-plugin-copy');

module.exports = function createLibConfig(config) {
  return {
    ...config,
    plugins: [
      ...config.plugins || [],
      copy({
        targets: [
          { src: `packages/router/README.md`, dest: `dist/packages/router` }
        ]
      })
    ]
  }
}