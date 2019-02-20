/*
 |--------------------------------------------------------------------------
 | Browser-sync config file
 |--------------------------------------------------------------------------
 |
 | For up-to-date information about the options:
 |   http://www.browsersync.io/docs/options/
 |
 | There are more options than you see here, these are just the ones that are
 | set internally. See the website for more info.
 |
 |
 */
module.exports = {
  cwd: 'docs',
  port: 3000,
  server: {
    baseDir: 'docs/',
    index: 'index.html',
  },
  watch: true,
  watchEvents: ['change'],
};
