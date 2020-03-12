const gulp = require('gulp');
const pug = require('gulp-pug');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
const cleancss = require('gulp-cleancss');
const autoprefixer = require('gulp-autoprefixer');
const webpack = require('webpack-stream');

sass.compiler = require('node-sass');

const paths = {
  "root": "./dist",
  "html": {
    "watch" : "./source/views/**/*.pug",
    "source": "./source/views/pages/*.pug",
    "dest": "./dist"
  },
  "assets" : {
    "images" : {
      "watch" : "./source/assets/images/*",
      "source": "./source/assets/images/*",
      "dest": "./dist/images"
    }
  },
  "css" : {
    "watch": "./source/assets/styles/*.sass",
    "source": "./source/assets/styles/*.sass",
    "dest": "./dist/css"
  },
  "js" : {
    "watch": "./source/assets/js/main.js",
    "source": "./source/assets/js/main.js",
    "dest": "./dist/js"
  }
}
let isDev = false
let isProd = !isDev
var webpackConfig = {
  "output": {
    "filename": "main.js"
  },
  "module": {
    "rules": [
      {
        "test": /\.js$/,
        "loader": "babel-loader",
        "exclude": "/node_modules/"
      }
    ]
  },
  mode: isDev ? 'development' : 'production'
}

async function  jsBuild () {
  return gulp.src(paths.js.source)
    .pipe(webpack( webpackConfig ))
    .pipe(gulp.dest(paths.js.dest))
    .pipe(browserSync.stream())
}

function assets () {
  return gulp.src(paths.assets.images.source)
    .pipe(gulp.dest(paths.assets.images.dest))
}
function cssBuild () {
  return gulp.src(paths.css.source)
    .pipe(sass().on('error', sass.logError))
    .pipe(cleancss({keepBreaks: false}))
    .pipe(autoprefixer({
        cascade: false
    }))
    .pipe(gulp.dest(paths.css.dest))
    .pipe(browserSync.stream())
}
async function htmlBuild () {
   return gulp.src(paths.html.source)
    .pipe(
      pug(
        {
          "pretty" : true
        }
      )
    )
    .pipe(gulp.dest(paths.html.dest))
    .pipe(browserSync.stream())
}
function watch () {
  browserSync.init({
    "server": {
      "baseDir" : paths.root
    }
  })
  gulp.watch(paths.html.watch, htmlBuild)
  gulp.watch(paths.css.watch, cssBuild)
  gulp.watch(paths.js.watch, jsBuild)
}

async function build () {
  jsBuild()
  cssBuild()
  assets()
  htmlBuild()
}

exports.js = jsBuild;
exports.css = cssBuild;
exports.assets = assets;
exports.pages = htmlBuild;
exports.build = build;
exports.watch = watch;
