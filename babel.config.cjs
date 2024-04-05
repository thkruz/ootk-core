module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          esmodules: true,
        },
      },
    ],
    [
      '@babel/preset-typescript', {
        'rewriteImportExtensions': true,
      },
    ],
  ],
  compact: 'auto',

};
