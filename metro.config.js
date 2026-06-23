const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const defaultConfig = getDefaultConfig(__dirname);
const {
  resolver: { sourceExts, assetExts },
} = defaultConfig;

const config = {
  transformer: {
    babelTransformerPath: require.resolve('react-native-svg-transformer'),
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
  resolver: {
    assetExts: assetExts.filter(ext => ext !== 'svg'),
    sourceExts: [...sourceExts, 'svg'],
    // Exclude build directories and native folders within node_modules to prevent watcher crashes
    blockList: [
      /node_modules\/.*\/android\/.*/,
      /node_modules\/.*\/ios\/.*/,
      /.*\/android\/build\/.*/,
      /.*\/android\/.cxx\/.*/,
      /.*\/ios\/build\/.*/,
    ],
  },
};

module.exports = mergeConfig(defaultConfig, config);
