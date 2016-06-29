var gulp = require('gulp');
var watch = require('gulp-watch');
var del = require('del');
var browserSync = require('browser-sync').create();
var umd = require('gulp-umd');
var babel = require('gulp-babel');
var deleteLines = require('gulp-delete-lines');
var concat = require('gulp-concat');

var files = [
    './js/src/utils.js',
    './js/src/elm.js',
    './js/src/modal.js',
    './js/src/alert.js',
    './js/src/formgenerator.js'
];

gulp.task('default', ['build', 'watch']);
gulp.task('build', ['transpile', 'concat', 'umd']);

gulp.task('transpile', function () {
    return gulp.src(files)
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
    return gulp.src(files)
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
    del('./js/dist/**/*');
    del('/dist/umd/**/*')
});


gulp.task('watch', ['browser-sync'], function () {
    gulp.watch('js/src/*.js', ['build']);
});

gulp.task('browser-sync', function () {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
});