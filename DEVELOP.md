# Development

The documentation in this file is only necessary if you will contribute to the
code. If you only want to install or deploy the website, see
[INSTALL.md](./INSTALL.md) instead.

## Technologies

- Project management:
  - Manage dependendies: [npm](https://www.npmjs.com/)
  - Manage git hooks: [husky](https://github.com/typicode/husky)
- CSS:
  - Ensure correct formatting: [Prettier](https://prettier.io/)
  - Sass: [Sass](http://sass-lang.com/) /
    [node-sass](https://www.npmjs.com/package/node-sass)
  - Support old browsers: [PostCSS](https://postcss.org/) /
    [Autoprefixer](https://github.com/postcss/autoprefixer)
  - Components: [Bulma](https://bulma.io/) /
    [bulma-start](https://www.npmjs.com/package/bulma-start)
- JavaScript:
  - Ensure correct formatting: [ESLint](https://eslint.org/)
  - Ensure retorcompatibility: [babel](https://babeljs.io/)
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

  Development takes place here.

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
    npm run deploy
    ```

- TODO add a bundler (rollup?) to bundle all the JS modules in one file (+
  minify, + tree shaking to remove unused parts of code, + version generated
  files and replace in the index.html file)

### Linters

- Test the format of JSON, Markdown, SCSS, YAML and YML files with
  [Prettier](https://prettier.io/), and exit with error if a file is not
  formatted accorded to prettier rules, showing a list of the files to fix.

  ```bash
  npm run test:other
  ```

- Test the format of JavaScript files with [ESLint](https://eslint.org/), and
  exit with error if a file is not formatted accorded to eslint rules.

  ```bash
  npm run test:js
  ```

- Test both in one command

  ```bash
  npm run test
  ```

  or

  ```bash
  npm test
  ```

Note that the configuration for Prettier is defined in the
[`.prettierrc.json`](.prettierrc.json) file, and that
[`.prettierignore`](.prettierignore) lists the files to ignore when linting with
prettier. Similarly, the configuration file for ESLint is
[`.eslintrc.json`](.eslintrc.json).

These configuration files should be taken into account by your editor and allow
it to fix the files. Otherwise, you can fix the files with the following
scripts. Note that they modify the files, and must be launched manually:

- Fix the format of JSON, Markdown, SCSS, YAML and YML files inline with
  [Prettier](https://prettier.io/)

  ```bash
  npm run fix:other
  ```

- Fix the format of JavaScript files inline with [ESLint](https://eslint.org/)

  ```bash
  npm run fix:js
  ```

- Fix all files inline in one command

  ```bash
  npm run fix
  ```

- TODO: give hints to configure editors
- TODO: give hints on the expected coding style

### CSS

- Generate the CSS file in the build directory
  ([`main.css`](./docs/css/main.css)) from the Sass file
  ([`main.scss`](./src/_sass/main.scss)):


    ```bash
    npm run css-build
    ```

- Add vendor CSS prefixes (`-webkit-`, `-moz-`, `-ms-`) to improve the support
  for old browsers (inline modification of the [`main.css`](./docs/css/main.css)
  file):

  ```bash
  npm run css-postcss
  ```

- Do both in one call:

  ```bash
  npm run css-deploy
  ```

### JavaScript

- Add retrocompatibility for old browsers for files in
  [`src/_javascript/`](./src/_javascript/), writing the output files in
  [`docs/lib/`](./docs/lib).

  ```bash
  npm run js-build
  ```

  The [`.babelrc`](.babelrc) configuration file for [Babel](https://babeljs.io)
  currently points to the `es2015-ie` preset, that ensures retrocompatibility
  with IE ≥ 9.

- TODO try to be compatible to previous browsers
- TODO see if we should add things, like support for async/await:
  https://babeljs.io/docs/en/babel-plugin-transform-async-to-generator

### HTML

- Replace [mustache](https://mustache.github.io/) placeholders in
  [`src/index.mustache.html`](./src/index.mustache.html) with the corresponding
  strings from English [`src/lang/en.json`](./src/lang/en.json) i18n JSON file,
  and place the generated `index.html` file in [`src/`](./src):

  ```bash
  npm run mustache-build-en
  ```

- Replace [mustache](https://mustache.github.io/) placeholders in
  [`src/index.mustache.html`](./src/index.mustache.html) with the corresponding
  strings from Portuguese [`src/lang/pt.json`](./src/lang/pt.json) i18n JSON
  file, and place the generated `index.pt.html` file (note the `.pt` part) in
  [`src/`](./src):

  ```bash
  npm run mustache-build-pt
  ```

- Generate the files for all the languages

  ```bash
  npm run mustache-build
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

- TODO automatically deploy the files in `docs` and add to git staged files

## Scripts for development

Some other scripts are only a help for the developer

- TODO describe the "watch" scripts
- TODO describe the web server scripts
