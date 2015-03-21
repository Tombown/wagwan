wagwan
======

Wagwan web application

### Installation
```bash
npm install
bower install
gulp install
```

### Development


To automatically recompile sources during development run:
```bash
gulp watch
```

Gulp tasks available:

 name | description
 --- | ---
js | Compile JS
js-app | Concat and minify all wagman's scripts
js-vendor | Concat and minify 3rd parties scripts
js-ie8 | Concat ie8 polyfills
less | Compile LESS
less-bootstrap | Compile bootstrap
less-bootstrap-prepare | Archive bootstrap's original `variables.less`
less-bootstrap-concat | Concat bootstrap's `variables.less` with custom variables
less-bootstrap-compile | Compile customized bootstrap
less-app | Compile wagman's less
copy-fonts | Copy fonts into `/public`
install | Run all tasks above

Bootstrap configuration variables: `/assets/stylesheets/bootstrap.less`
