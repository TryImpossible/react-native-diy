module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.jsx', 'js'],
        alias: {
          '@': './src',
          '@utilities': './src/utilities',
          '@utilities/': './src/utilities',
        },
      },
    ],
  ],
};
