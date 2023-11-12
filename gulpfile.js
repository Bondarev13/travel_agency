const { src, dest, watch, parallel, series } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const uglify = require('gulp-uglify-es').default;
const browserSync = require('browser-sync').create();
const clean = require('gulp-clean');
const include = require('gulp-include');




function pages() {
  return src('app/pages/*.html')
    .pipe(include({
      includePaths: 'app/components'
    }))
    .pipe(dest('app'))
    .pipe(browserSync.stream());
}



function styles() {
  return src('app/scss/*.scss')
    .pipe(sass({ outputStyle: 'expanded' }))
    .pipe(concat('main.min.css'))
    .pipe(dest('app/css'))
    .pipe(browserSync.stream());
}


function scripts() {
  return src('app/js/main.js')
    .pipe(concat('main.min.js'))
    .pipe(uglify())
    .pipe(dest('app/js'))
    .pipe(browserSync.stream());
}


function watching() {
  browserSync.init({
    server: {
      baseDir: "app/"
    }
  });
  watch(['app/scss/**/*.scss'], styles);
  watch(['app/pages/*', 'app/components/*'], pages);
  watch(['app/js/main.js'], scripts);
  watch(["app/*.html"]).on('change', browserSync.reload);
}

function cleanDsit() {
  return src('dist')
    .pipe(clean())
}

function building() {
  return src([
    'app/css/main.min.css',
    'app/js/main.min.js',
    'app/*.html'
  ],
    { base: 'app' })
    .pipe(dest('dist'))
}


exports.styles = styles;
exports.scripts = scripts;
exports.pages = pages;
exports.watching = watching;
exports.building = building;

exports.build = series(cleanDsit, building);
exports.default = parallel(styles, scripts, pages, watching);



