const copy = require('rollup-plugin-copy');

module.exports = function createLibConfig(config) {
  return {
    ...config,
    plugins: [
      ...config.plugins || [],
      copy({
        targets: [
          { src: `packages/reducer-registry/README.md`, dest: `dist/packages/reducer-registry` }
        ]
      })
    ]
  }
}