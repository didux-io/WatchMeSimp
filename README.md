# WATCH ME SIMP

### Install npm dependencies
```
$ npm run install
```

### Run local over https
Make sure the dependencies are installed before continuing.
```
$ npm run start:ssl
```
Development environment is now available at https://localhost:4230 in a browser.

### Make a production build
Make sure the dependencies are installed before continuing.
```
$ npm run build
```
Production build is available in directory `dist`

### Build & run docker container
Make sure the dependencies are installed and the production build has run before continuing.
```
$ docker build -t watch-me-simp .
$ docker run -dp 3000:80 watch-me-simp
```
Production build is now available at https://localhost:3000 in a browser.
