# Contribute

The documentation in this file is only necessary if you will contribute to the
code.

If you want to install or deploy the website, see [INSTALL.md](./INSTALL.md)
instead. If you're interested in the build process, see [BUILD.md](./BUILD.md).

## Technologies

Technologies used in the application:

- Components: [Bulma](https://bulma.io/) /
  [bulma-start](https://www.npmjs.com/package/bulma-start)
- Data loading: [topojson](https://github.com/topojson/topojson),
  [d3-fetch](https://github.com/d3/d3-fetch)
- State management: [d3-dispatch](https://github.com/d3/d3-dispatch)
- Data visualization:
  - projections: [d3-geo](https://github.com/d3/d3-geo/)
  - labels: [polylabel](https://github.com/mapbox/polylabel) (copied here to
    have ESM), [tinyqueue](https://github.com/mourner/tinyqueue)

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

  This directory is completely created at build time, and is versioned to make
  it easier to deploy on GitHub Pages. It should never be modified by hand.

- files at the root of the repository: doc files, npm dependencies,
  configuration files.

  Only modify if you want to improve the software project management.

## TODO

- Define if D3.js and Bulma are dev dependencies or not
- give information on the expected coding style
- explain what to test with unit tests
- explain what to test with integration tests
- pass configuration values to the index.html file using mustache placeholders
  (for example {{config.svg.height}})
