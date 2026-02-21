// frontend/metro.config.js
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Configuración del transformer
config.transformer = {
  ...config.transformer,
  assetPlugins: ['expo-asset/tools/hashAssetFiles'],
  getTransformOptions: async () => ({
    transform: {
      experimentalImportSupport: false,
      inlineRequires: true,
    },
  }),
};

// Configuración del resolver
config.resolver = {
  ...config.resolver,
  sourceExts: ['web.js', 'web.jsx', 'web.ts', 'web.tsx', 'js', 'jsx', 'ts', 'tsx', 'json'],
  platforms: ['web', 'native'],
  assetExts: config.resolver.assetExts.filter(ext => ext !== 'svg'),
  projectRoot: path.resolve(__dirname),
};

// Watchman config - Soluciona problema de watcher en Windows
config.watchman = {
  enabled: true,
};

// Ignorar carpetas problemáticas
config.resolver.blacklistRE = /node_modules\/.*\/node_modules/;

module.exports = config;