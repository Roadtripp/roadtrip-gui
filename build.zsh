echo 'Step 0: Kill ALL THE THINGS... in `dist/`'

rm -rf dist/*

echo 'Step 1: Copy all the HTML'
cp src/index.html dist/
cp src/login.html dist/
cp src/admin.html dist/
cp src/interests.html dist/
cp src/signup.html dist/
cp src/selection.html dist/
cp src/start.html dist/
cp src/timeline.html dist/
cp src/welcome.html dist/
cp src/favicon.ico dist/
cp src/404.html dist/


# mkdir dist/partials/
# cp -r src/partials dist/

echo 'Step 2a: Build all the Sass into CSS!'
npm run sass

echo 'Step 2b: Copy CSS into `dist/`?'
mkdir dist/css/
cp src/css/main.css dist/css/

mkdir dist/img/
cp src/img/*.jpg dist/img
cp src/img/*.png dist/img


echo 'Step 3: Copy all the JS'
mkdir -p dist/js && cp -r src/js dist/

echo 'Step 4: Copy all the `bower_components/`!'

echo 'Step 4a: Normalize the CSS...'
mkdir -p dist/bower_components/normalize-css/
cp bower_components/normalize-css/normalize.css dist/bower_components/normalize-css/normalize.css

echo 'Step 4b: ????'
mkdir -p dist/bower_components/jquery/dist/
cp bower_components/jquery/dist/jquery.js dist/bower_components/jquery/dist/jquery.js

mkdir -p dist/bower_components/angular/
cp bower_components/angular/angular.js dist/bower_components/angular/angular.js

mkdir -p dist/bower_components/angular-route/
cp bower_components/angular-route/angular-route.js dist/bower_components/angular-route/angular-route.js

mkdir -p dist/bower_components/font-awesome/css/
cp bower_components/font-awesome/css/font-awesome.css dist/bower_components/font-awesome/css/font-awesome.css

mkdir -p dist/bower_components/font-awesome/fonts/
cp bower_components/font-awesome/fonts/fontawesome-webfont.ttf dist/bower_components/font-awesome/fonts/fontawesome-webfont.ttf
cp bower_components/font-awesome/fonts/fontawesome-webfont.woff dist/bower_components/font-awesome/fonts/fontawesome-webfont.woff
cp bower_components/font-awesome/fonts/fontawesome-webfont.woff2 dist/bower_components/font-awesome/fonts/fontawesome-webfont.woff2

mkdir -p dist/bower_components/angular-cookies/
cp bower_components/angular-cookies/angular-cookies.js dist/bower_components/angular-cookies/angular-cookies.js


npm run start:dist
