# Build

This file is intended to explain the process of building the project, based on
npm scripts. If you only want to install or deploy the website, see
[INSTALL.md](./INSTALL.md) instead. If you want to contribute to the code, see
[CONTRIBUTE.md](./CONTRIBUTE.md).

## Technologies

Technologies used for the project management and building:

- Project management:
  - Manage dependendies: [npm](https://www.npmjs.com/)
  - Manage git hooks: [husky](https://github.com/typicode/husky)
  - Run multiple npm-scripts in parallel or sequential:
    [npm-run-all](https://www.npmjs.com/package/npm-run-all)
  - Watch changes: [onchange](https://www.npmjs.com/package/onchange)
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

To build all, just launch

    ```bash
    npm run build
    ```

### Linters

- Test the format of JavaScript files with [ESLint](https://eslint.org/), and
  exit with error if a file is not formatted accorded to eslint rules.

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

- Do both in one call:

  ```bash
  npm run build:css
  ```

### JavaScript

- Bundle the ECMAScript modules (ESM) in only one file:
  [`docs/lib/main.js`](./docs/lib/main.js). Note that it also calls Babel to add
  retrocompatibility for old browsers

  ```bash
  npm run build:js
  ```

  The [`.babelrc`](./src/.babelrc) configuration file for
  [Babel](https://babeljs.io) currently points to the
  [`@babel/preset-env` preset](https://babeljs.io/docs/en/babel-preset-env).

  The [Rollup](https://rollupjs.org) configuration file (for bundlin ES modules,
  and calling Babel) is [`rollup.config.js`](./rollup.config.js).

### HTML

- Replace [mustache](https://mustache.github.io/) placeholders in
  [`src/index.mustache.html`](./src/index.mustache.html) with the corresponding
  strings from English [`src/lang/en.json`](./src/lang/en.json) i18n JSON file,
  and place the generated `index.html` file in [`src/`](./src):

  ```bash
  npm run build:mustache:en
  ```

- Replace [mustache](https://mustache.github.io/) placeholders in
  [`src/index.mustache.html`](./src/index.mustache.html) with the corresponding
  strings from Portuguese [`src/lang/pt.json`](./src/lang/pt.json) i18n JSON
  file, and place the generated `index.pt.html` file (note the `.pt` part) in
  [`src/`](./src):

  ```bash
  npm run build:mustache:pt
  ```

- Generate the files for all the languages

  ```bash
  npm run build:mustache
  ```

## Deployment

The [GitHub repository](https://github.com/severo/pesticides_website/) is
configured to automatically deploy the website to
https://severo.github.io/pesticides_website/ on every new commit on the
[master branch](https://github.com/severo/pesticides_website/tree/master).

The website files are copied from the
[`/docs`](https://github.com/severo/pesticides_website/tree/master/docs)
directory (destination of the build). This means that every commit should come
with a build process.

Note that before allowing to commit, a `pre-commit` hook is launched with
[husky](https://github.com/typicode/husky) that triggers `npm run test` and so
cancel the commit if an error appears.

## Scripts for development

Some other scripts are only a help for the developer

### Watch

To automatically rebuild the corresponding parts of the website when a source
file changes (note that the project is also build before watching), launch:

```bash
npm run watch
```

More in details:

- watch, without bulding the project before:

  ```bash
  npm run watch-only
  ```

- watch for changes in JavaScript files and rebuild:

  ```bash
  npm run watch-only:js
  ```

- watch for changes in SASS files and rebuild:

  ```bash
  npm run watch-only:css
  ```

- watch for changes in mustache templates files and rebuild:

  ```bash
  npm run watch-only:mustache
  ```

### Serve

To launch a web server on the [`docs/`](./docs/) directory:

```bash
npm run serve
```

Note that the configuration for Browsersync is defined in the
[`bc-config.js`](bc-config.js) file.

Note that you certainly want to run both `npm run serve` and `npm run watch` at
the same time (in two terminals).

## TODO

- Read
  https://github.com/damonbauer/npm-build-boilerplate/blob/master/package.json
  and add more processing if useful
- give hints to configure editors (add an `.editorconfig` file?)
- ESLint: add support for async/await:
  https://babeljs.io/docs/en/babel-plugin-transform-async-to-generator? (maybe
  it's already supported)
- minify (terser?)
- uglify?
- tree shaking
- version generated files and replace in index.html
- automatically deploy the files in `docs` and add to git staged files
- add a "clean" script, with rimraf?
- add unit tests
- add integration tests
- if we minify: add a header banner (see
  [how d3.js does](https://github.com/d3/d3-voronoi/blob/master/rollup.config.js))
- add CI tools: Codacy, Travis?
- only one script (`npm run serve`) to replace the need for both `watch` and
  `serve`. But simply launching `run-p server watch` fails to capture all the
  changes.
- when the build fails in `watch`, the script needs to be restarted. Find how to
  avoid this and simply handle the errors
