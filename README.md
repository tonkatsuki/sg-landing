# sg-landing

Made with Hugo and Blowfish


## Building

Ensure hugo is installed (https://gohugo.io/installation/) on the machine you're going to build the files for static serving

Clone this repo

```
git clone https://github.com/tonkatsuki/sg-landing/
```

You may need to re-init the blowfish theme otherwise the site will not work:

```
rm -rf themes/
git rm --cached  themes/blowfish
git submodule add -b main https://github.com/nunocoracao/blowfish.git themes/blowfish
```

Finally build the site
```
hugo
```

Copy the public folder to the webserver /srv of your choice such as Caddy
