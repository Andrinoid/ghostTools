var gulp = require('gulp');
var watch = require('gulp-watch');
var del = require('del');
var browserSync = require('browser-sync').create();
var fs = require("fs");

var named = require('vinyl-named');
var webpack = require('webpack-stream');


gulp.task('default', ['clean', 'build', 'watch']);

gulp.task('build', ['transpile']);

gulp.task('transpile', function () {
    return gulp.src('./src/*.js')
        .pipe(named())
        .pipe(webpack({
            devtool: 'source-map',
            module: {
                loaders: [
                    {test: /\.jsx?$/, exclude: /node_modules/, loader: 'babel-loader'}
                ]
            }
        }))
        .pipe(gulp.dest('./dist/'));
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