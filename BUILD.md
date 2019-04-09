# Build

This file is intended to explain the process of building the project, based on
npm scripts. If you want to install or deploy the website, see
[INSTALL.md](./INSTALL.md) instead. If you want to contribute to the code, see
[CONTRIBUTE.md](./CONTRIBUTE.md).

## Technologies

Technologies used for the project management and building:

- Project management:
  - Manage dependendies: [npm](https://www.npmjs.com/)
  - Manage git hooks: [husky](https://github.com/typicode/husky)
  - Run multiple npm-scripts in parallel or sequentially:
    [npm-run-all](https://www.npmjs.com/package/npm-run-all)
  - Watch changes: [onchange](https://www.npmjs.com/package/onchange)
  - Release:
    [standard-version](https://github.com/conventional-changelog/standard-version/)
- CSS:
  - Ensure correct formatting: [Prettier](https://prettier.io/)
  - Sass: [Sass](http://sass-lang.com/) /
    [node-sass](https://www.npmjs.com/package/node-sass)
  - Support old browsers: [PostCSS](https://postcss.org/) /
    [Autoprefixer](https://github.com/postcss/autoprefixer)
- JavaScript:
  - Ensure correct formatting: [ESLint](https://eslint.org/)
  - Ensure retrocompatibility: [babel](https://babeljs.io/)
  - Bundle ES modules: [rollup](https://rollupjs.org)
- i18n:
  - Replace placeholders with language strings:
    [mustache](https://mustache.github.io/) /
    [mustache.js](https://github.com/janl/mustache.js)
- Markdown, JSON, YAML, YML:
  - Ensure correct formatting: [Prettier](https://prettier.io/)

## Get the code

Get the code using git ([install `git`](https://git-scm.com/downloads) first if
necessary):

```bash
git clone https://github.com/severo/pesticides_website.git
```

## Install the dependencies

Then enter the cloned directory and install the npm dependencies
([install `npm`](https://www.npmjs.com/get-npm) first if necessary):

```bash
cd pesticides_website
npm install
```

Note that most of the dependencies are for development only.

## Structure of the code

The repository is composed of three main parts:

- [`src/`](./src): the source code of the website, in HTML (with mustache
  placeholders), JS and SASS.

  Development takes place there.

- [`docs/`](./docs): the compiled code, ready to be deployed. Note that
  generally `dist/` or `build/` are used, but using `docs/` allows to
  automatically deploy the website on GitHub Pages without any hassle.

  This directory is completely created at build time, and is versionned to make
  it easier to deploy on GitHub Pages. It should never be modified by hand.

- files at the root of the repository: doc files, npm dependencies,
  configuration files.

  Only modify if you want to improve the software project management.

## Workflow

The workflow to compile the [`src/`](./src) source code directory into the
[`docs/`](./docs) output directory realize a series of processings. There are
detailed in that section.

To build them all, launch

    ```bash
    npm run build
    ```

### Linters

- Test the format of JavaScript files with [ESLint](https://eslint.org/), and
  exit with error if a file is not formatted according to eslint rules.

  ```bash
  npm run lint:test:js
  ```

- Test the format of JSON, Markdown, SCSS, YAML and YML files with
  [Prettier](https://prettier.io/), and exit with error if a file is not
  formatted accorded to prettier rules, showing a list of the files to fix.

  ```bash
  npm run lint:test:other
  ```

- Test both in one command

  ```bash
  npm run lint:test
  ```

Note that the configuration for Prettier is defined in the
[`.prettierrc.json`](.prettierrc.json) file, and that
[`.prettierignore`](.prettierignore) lists the files to ignore when linting with
prettier. Similarly, the configuration file for ESLint is
[`.eslintrc.json`](.eslintrc.json).

These configuration files should be taken into account by your editor and allow
it to fix the files. Otherwise, you can fix the files with the following
scripts. Note that they modify the files, and must be launched manually:

- Fix the format of JavaScript files inline with [ESLint](https://eslint.org/)

  ```bash
  npm run lint:fix:js
  ```

- Fix the format of JSON, Markdown, SCSS, YAML and YML files inline with
  [Prettier](https://prettier.io/)

  ```bash
  npm run lint:fix:other
  ```

- Fix all files inline in one command

  ```bash
  npm run lint:fix
  ```

### CSS

- Generate the CSS file in the build directory
  ([`main.css`](./docs/css/main.css)) from the Sass file
  ([`main.scss`](./src/_sass/main.scss)):


    ```bash
    npm run build:css:sass
    ```

- Add vendor CSS prefixes (`-webkit-`, `-moz-`, `-ms-`) to improve the support
  for old browsers (inline modification of the [`main.css`](./docs/css/main.css)
  file):

  ```bash
  npm run build:css:postcss
  ```

- Do both in one call (first SASS, then PostCSS):

  ```bash
  npm run build:css
  ```

### JavaScript

- Bundle the ECMAScript modules (ESM) in only one file:
  `docs/lib/main.mustache.js`. Note that it also calls Babel to add
  retrocompatibility for old browsers

  ```bash
  npm run build:js:rollup
  ```

  The [`.babelrc`](./src/.babelrc) configuration file for
  [Babel](https://babeljs.io) currently points to the
  [`@babel/preset-env` preset](https://babeljs.io/docs/en/babel-preset-env).

  The [Rollup](https://rollupjs.org) configuration file (for bundling ES
  modules, and calling Babel) is [`rollup.config.js`](./rollup.config.js).

- Replace [mustache](https://mustache.github.io/) placeholders in
  `docs/lib/main.mustache.js` with the corresponding strings from English
  [`src/lang/en.json`](./src/lang/en.json) i18n JSON file, and place the
  generated `main.en.js` file in [`src/lib/`](./src/lib):

  ```bash
  npm run build:js:mustache:en
  ```

- Replace [mustache](https://mustache.github.io/) placeholders in
  `docs/lib/main.mustache.js` with the corresponding strings from Portuguese
  [`src/lang/pt.json`](./src/lang/pt.json) i18n JSON file, and place the
  generated `main.pt.js` file in [`src/lib/`](./src/lib):

  ```bash
  npm run build:js:mustache:pt
  ```

- Replace [mustache](https://mustache.github.io/) placeholders in
  `docs/lib/main.mustache.js` with the corresponding strings from Spanish
  [`src/lang/es.json`](./src/lang/es.json) i18n JSON file, and place the
  generated `main.es.js` file in [`src/lib/`](./src/lib):

  ```bash
  npm run build:js:mustache:es
  ```

- Generate the files for all the languages

  ```bash
  npm run build:js:mustache
  ```

- Do both in one call (first Rollup, then Mustache):

  ```bash
  npm run build:js
  ```

### HTML

- Replace [mustache](https://mustache.github.io/) placeholders in
  [`src/index.mustache.html`](./src/index.mustache.html) with the corresponding
  strings from English [`src/lang/en.json`](./src/lang/en.json) i18n JSON file,
  and place the generated `index.html` file in [`src/`](./src):

  ```bash
  npm run build:html:mustache:en
  ```

- Replace [mustache](https://mustache.github.io/) placeholders in
  [`src/index.mustache.html`](./src/index.mustache.html) with the corresponding
  strings from Portuguese [`src/lang/pt.json`](./src/lang/pt.json) i18n JSON
  file, and place the generated `index.pt.html` file (note the `.pt` part) in
  [`src/`](./src):

  ```bash
  npm run build:html:mustache:pt
  ```

- Replace [mustache](https://mustache.github.io/) placeholders in
  [`src/index.mustache.html`](./src/index.mustache.html) with the corresponding
  strings from Spanish [`src/lang/es.json`](./src/lang/es.json) i18n JSON file,
  and place the generated `index.es.html` file (note the `.es` part) in
  [`src/`](./src):

  ```bash
  npm run build:html:mustache:es
  ```

- Generate the files for all the languages

  ```bash
  npm run build:html:mustache
  ```

  or

  ```bash
  npm run build:html
  ```

## Deployment

The [GitHub repository](https://github.com/severo/pesticides_website/) is
configured to automatically deploy the website to
https://severo.github.io/pesticides_website/ on every new commit on the
[master branch](https://github.com/severo/pesticides_website/tree/master).

The website files are copied from the
[`/docs`](https://github.com/severo/pesticides_website/tree/master/docs)
directory (destination of the build). This means that the docs directory must be
built before every commit, in order the changes to be deployed.

Note that before allowing to commit, a `pre-commit` hook is launched with
[husky](https://github.com/typicode/husky) that triggers `npm run test` and so
cancel the commit if any error appears.

## Scripts for development

Some other scripts are only a help for the developer.

### Watch

To automatically build the website, and then rebuild it when a source file
changes, launch:

```bash
npm run build-and-watch
```

More in details:

- watch, without building the project before:

  ```bash
  npm run watch
  ```

- watch for changes in JavaScript files and rebuild on change:

  ```bash
  npm run watch:js
  ```

- watch for changes in SASS files and rebuild on change:

  ```bash
  npm run watch:css
  ```

- watch for changes in HTML files and rebuild on change:

  ```bash
  npm run watch:html
  ```

- watch for changes in i18n strings files and rebuild on change:

  ```bash
  npm run watch:lang
  ```

### Serve

To launch a web server on the [`docs/`](./docs/) directory:

```bash
npm run serve
```

The configuration for Browsersync is defined in the
[`bc-config.js`](bc-config.js) file.

Note that you certainly want to run both `npm run serve` and `npm run watch` at
the same time (in two terminals).

### Release

The development MUST be done in the `develop` branch, and the commits must
follow the
[Conventional Commits Specification](https://conventionalcommits.org/).

To release a new version:

```
git checkout master; git pull origin master
npm run release
git push --follow-tags origin master && npm publish
```

## TODO

- Read
  https://github.com/damonbauer/npm-build-boilerplate/blob/master/package.json
  and add more processing if useful. See also
  https://buzut.fr/npm-for-everything/ and
  https://buzut.fr/configurer-rollup-bundles-esm-cjs/
- give hints to configure editors (add an `.editorconfig` file?)
- ESLint: add support for async/await:
  https://babeljs.io/docs/en/babel-plugin-transform-async-to-generator? (maybe
  it's already supported)
- minify (terser?)
- uglify?
- tree shaking (already done by rollup?)
- version generated CSS and JS files and automatically replace the links in
  index.html
- automatically deploy the files in `docs` before a commit, and add to git
  staged files (see https://docs.npmjs.com/misc/scripts)
- add a "clean" script, with rimraf?
- add unit tests
- add integration tests
- if we minify: add a header banner (see
  [how it's done in D3.js](https://github.com/d3/d3-voronoi/blob/master/rollup.config.js))
- add CI tools: Codacy, Travis?
- only one script (`npm run serve`) to replace the need for both `watch` and
  `serve`. But simply launching `run-p server watch` fails to capture all the
  changes.
- when the build fails in `watch`, the script needs to be restarted. Find how to
  avoid this and simply handle the errors.
- maybe compute automatically the data hashes (see src/data/ files). Currently
  it's done manually with:

  ```bash
  cat estados.topojson | openssl dgst -sha384 -binary | openssl base64 -A
  ```
