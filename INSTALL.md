# INSTALL

## Get the code

Get the code using git ([install `git`](https://git-scm.com/downloads) first if necessary):

```bash
git clone https://github.com/severo/pesticides_website.git
```

Then enter the cloned directory and install the npm dependencies ([install `npm`](https://www.npmjs.com/get-npm) first if necessary):

```bash
cd pesticides_website
npm install
```

## Build

The website files are located in the [`docs/`](https://github.com/severo/pesticides_website/tree/master/docs) directory.

They must not be edited directly. Instead, modify the sources in the [`src/`](https://github.com/severo/pesticides_website/tree/master/src) directory, and then build the website files with:

```bash
npm run deploy
```

The files will be updated in the [`docs/`](https://github.com/severo/pesticides_website/tree/master/docs) directory.

TODO: describe the different npm scripts.

## Deployment

The [GitHub repository](https://github.com/severo/pesticides_website/) is configured to automatically deploy the website to https://severo.github.io/pesticides_website/ on every new commit on the [master branch](https://github.com/severo/pesticides_website/tree/master).

The website files are copied from the [`/docs`](https://github.com/severo/pesticides_website/tree/master/docs) directory (destination of the build).

## Structure of the code

TODO Describe the structure of the code
