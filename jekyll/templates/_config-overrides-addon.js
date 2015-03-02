var jekyllFolder = '<%= jekyllFolder %>'; ///NATH: get this from yeoman config somehow

config.browsersync.development.config.server.baseDir = './_build';

config.browsersync.development.dependencies = config.browsersync.development.dependencies.push('jekyll');

config.watch.dependencies = config.watch.dependencies.push('jekyll-watch');

config.scss.src.unshift('!' + jekyllFolder + '/_sass/_base.scss');
config.scss.src.unshift('!' + jekyllFolder + '/_sass/_layout.scss');
config.scss.src.unshift('!' + jekyllFolder + '/_sass/_syntax-highlighting.scss');

config.browsersync.development.config.files = [
  jekyllFolder + '/_build/css/*.css',
  jekyllFolder + '/_build/js/*.js',
  jekyllFolder + '/_build/images/**',
  jekyllFolder + '/_build/fonts/*'
];

config.jekyll = {
  src: jekyllFolder,
  dest: './_build',
  config: jekyllFolder + '/_config.yml',
  watch: [
    jekyllFolder + '/_config.yml',
    jekyllFolder + '/_config.build.yml',
    jekyllFolder + '/_data/**/*.{json,yml,csv}',
    jekyllFolder + '/_includes/**/*.{html,xml}',
    jekyllFolder + '/_layouts/*.html',
    jekyllFolder + '/_locales/*.yml',
    jekyllFolder + '/_plugins/*.rb',
    jekyllFolder + '/_posts/*.{markdown,md}',
    jekyllFolder + '/**/*.{html,markdown,md,yml,json,txt,xml}',
    jekyllFolder + '/**/*.{scss,sass}',
    jekyllFolder + '/*'
  ]
};
