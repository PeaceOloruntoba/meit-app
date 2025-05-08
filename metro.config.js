const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");
const {
  wrapWithReanimatedMetroConfig,
} = require("react-native-reanimated/metro-config");

const config = getDefaultConfig(__dirname);

// defaultConfig.resolver.unstable_enablePackageExports = false;

config.resolver.unstable_enablePackageExports = false;

config.resolver.unstable_enableSymlinks = false;


module.exports = wrapWithReanimatedMetroConfig(
  withNativeWind(config, {
    input: "./src/global.css",
  })
);
