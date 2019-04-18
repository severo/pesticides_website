# INSTALL

## Get the code

Get the code downloading a ZIP archive of this project at
https://github.com/severo/pesticides_website/archive/master.zip and unzip in the
`/tmp/pesticides_website` directory (for example).

Alternatively, you may get the code using git
([install `git`](https://git-scm.com/downloads) first if necessary):

```bash
git clone https://github.com/severo/pesticides_website.git /tmp/pesticides_website/
```

## Copy the files

The files of the website are located in the `docs` directory. Copy them to the
appropriate location. For example, if you use an Apache2 web server:

```bash
cp -r /tmp/pesticides_website/docs /var/www/html/pesticides_website
```

## Configure your web server

Finally, configure your web server (Apache2 or nginx for example) to point to
the `/var/www/html/pesticides_website` directory.
