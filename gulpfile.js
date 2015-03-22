'use strict';

//   Libraries

var fs = require('fs'),
    gulp = require('gulp'),
    gulpif = require('gulp-if'),
    rename = require('gulp-rename'),
    addsrc = require('gulp-add-src'),
    less = require('gulp-less'),
    minifyCSS = require('gulp-minify-css'),
    sourcemaps = require('gulp-sourcemaps'),
    babel = require('gulp-babel'),
    concat = require('gulp-concat');

var argv = require('yargs').argv;

//
//   Paths and configuration
//
var paths = {
    app : [
        'assets/javascript/utils.js',
        'assets/javascript/classes/location.js',
        'assets/javascript/classes/cookie.js',
        'assets/javascript/app.js'
    ],
    libs : [
        'bower_components/jquery/dist/jquery.min.js',
        'bower_components/bootstrap/dist/bootstrap.min.js',
        'bower_components/gmaps/gmaps.js'
    ],
    ie8 : [
        'bower_components/html5shiv/dist/html5shiv.min.js',
        'bower_components/respond-minmax/dest/respond.min.js'
    ],
    moment : [
        'node_modules/moment/moment.js'
    ]
};

//
//   CSS related tasks
//
gulp.task('less-app', function() {
    return gulp
        .src('assets/stylesheets/layout.less')
        .pipe(less())
        .pipe(gulpif(argv.minify, minifyCSS()))
        .pipe(gulp.dest('public/css'))
});

gulp.task('less-bootstrap-prepare', function(cb) {
    if (!fs.existsSync('bower_components/bootstrap/less/variables.original.less')) {
        return gulp
            .src('bower_components/bootstrap/less/variables.less')
            .pipe(rename('variables.original.less'))
            .pipe(gulp.dest('bower_components/bootstrap/less'));
    } else {
        cb();
    }
});

gulp.task('less-bootstrap-concat', ['less-bootstrap-prepare'], function(){
    return gulp
        .src('bower_components/bootstrap/less/variables.original.less')
        .pipe(addsrc.append('assets/stylesheets/bootstrap.less'))
        .pipe(concat('variables.less'))
        .pipe(gulp.dest('bower_components/bootstrap/less'))
});

gulp.task('less-bootstrap-compile', ['less-bootstrap-concat'], function(){
    return gulp
        .src('bower_components/bootstrap/less/bootstrap.less')
        .pipe(less())
        .pipe(gulpif(argv.minify, minifyCSS()))
        .pipe(gulp.dest('public/css'))
});

gulp.task('less-bootstrap', ['less-bootstrap-prepare', 'less-bootstrap-concat', 'less-bootstrap-compile']);

gulp.task('less', ['less-app', 'less-bootstrap']);

//
//   JS related tasks
//
gulp.task('js-app', function() {
    return gulp
        .src(paths.app)
        .pipe(sourcemaps.init())
        .pipe(concat('all.js'))
        .pipe(babel())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('public/js'));
});

gulp.task('js-libs', function() {
    return gulp
        .src(paths.libs)
        .pipe(sourcemaps.init())
        .pipe(concat('vendor.js'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('public/js'));
});

gulp.task('js-ie8', function() {
    return gulp
        .src(paths.ie8)
        .pipe(sourcemaps.init())
        .pipe(concat('ie8.js'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('public/js'))
});

gulp.task('js-moment', function() {
    return gulp
        .src(paths.moment)
        .pipe(sourcemaps.init())
        .pipe(concat('moment.js'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('public/js'))
});

gulp.task('js', ['js-app', 'js-libs', 'js-ie8', 'js-moment']);

//
//   Common tasks
//
gulp.task('copy-fonts', function() {
    return gulp
        .src([
            'bower_components/bootstrap/fonts/*.*',
            'bower_components/font-awesome/fonts/*.*'
        ])
        .pipe(gulp.dest('public/fonts/'))
});

//
//   Entry points
//
gulp.task('watch', function () {
    gulp.watch(['stylesheets/layout.less'], { cwd : "assets" }, ['less-app']);
    gulp.watch(['stylesheets/bootstrap.less'], { cwd : "assets" }, ['less-bootstrap']);

    gulp.watch(['javascript/**/*.js'], { cwd : "assets" }, ['js']);
});


gulp.task('install', ['copy-fonts', 'js', 'less']);