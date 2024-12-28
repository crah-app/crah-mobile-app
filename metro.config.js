const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.transformer = {
  ...config.transformer,
};

config.resolver = {
  ...config.resolver,
};

module.exports = config;
