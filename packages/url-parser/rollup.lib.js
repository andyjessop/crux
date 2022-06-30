const copy = require('rollup-plugin-copy');

module.exports = function createLibConfig(config) {
  return {
    ...config,
    plugins: [
      ...config.plugins || [],
      copy({
        targets: [
          { src: `packages/url-parser/README.md`, dest: `dist/packages/url-parser` }
        ]
      })
    ]
  }
}