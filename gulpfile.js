var gulp = require('gulp');
var watch = require('gulp-watch');
var del = require('del');
var browserSync = require('browser-sync').create();
var fs = require("fs");
var umd = require('gulp-umd');
var named = require('vinyl-named');
var webpack = require('webpack-stream');
var babel = require('gulp-babel');
var deleteLines = require('gulp-delete-lines');
var concat = require('gulp-concat');

gulp.task('default', ['build', 'watch']);
gulp.task('build', ['transpile', 'umd']);

gulp.task('transpile', function () {
    return gulp.src([
        './js/src/utils.js',
        './js/src/elm.js',
        //'./js/src/modalstyles.js',
        //'./js/src/alertstyles.js',
        './js/src/modal.js',
        './js/src/alert.js'
    ])
        .pipe(deleteLines({
            'filters': [/^(export|import).*/gm]
        }))
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest('./js/dist/'));
});

gulp.task('umd', function () {
    return gulp.src('./js/dist/*.js')
        .pipe(umd())
        .pipe(gulp.dest('./dist/umd/'));
});

gulp.task('concat', function () {
    return gulp.src([
        './js/src/utils.js',
        './js/src/elm.js',
        //'./js/src/modalstyles.js',
        //'./js/src/alertstyles.js',
        './js/src/modal.js',
        './js/src/alert.js'
    ])
        .pipe(deleteLines({
            'filters': [/^(export|import).*/gm]
        }))
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(concat('ghostTools.js'))
        .pipe(gulp.dest('./dist/'))
});

gulp.task('clean', function () {
    del('static/js/**/*.js');
    del('static/css/**/*.css');
});


gulp.task('watch', ['browser-sync'], function () {
    gulp.watch('src/*.js', ['build']);
});

gulp.task('browser-sync', function () {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
});