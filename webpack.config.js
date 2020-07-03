const path = require('path');
const CKEditorWebpackPlugin = require('@ckeditor/ckeditor5-dev-webpack-plugin');
const { styles } = require('@ckeditor/ckeditor5-dev-utils');

module.exports = {
  devtool: 'source-map',
  entry: path.resolve(__dirname, 'src', 'ckeditor.js'),

  output: {
    library: 'ClassicEditor',
    path: path.resolve(__dirname, 'build'),
    filename: 'ckeditor.js',
    libraryTarget: 'umd',
    libraryExport: 'default'
  },
  plugins: [
    new CKEditorWebpackPlugin({
      // See https://ckeditor.com/docs/ckeditor5/latest/features/ui-language.html
      language: 'en',
      additionalLanguages: ['de', 'es', 'fr', 'pt', 'it'],
    })
  ],

  module: {
    rules: [
      {
        test: /ckeditor5-[^/\\]+[/\\]theme[/\\]icons[/\\][^/\\]+\.svg$/,
        use: ['raw-loader']
      },
      {
        test: /ckeditor5-[^/\\]+[/\\]theme[/\\].+\.css$/,
        use: [
          {
            loader: 'style-loader',
            options: {
              injectType: 'singletonStyleTag',
              attributes: {
                'data-cke': true
              }
            }
          },
          {
            loader: 'postcss-loader',
            options: styles.getPostCssConfig({
              themeImporter: {
                themePath: require.resolve('@ckeditor/ckeditor5-theme-lark')
              },
              minify: true
            })
          },
        ]
      }
    ]
  }
};
