"use strict";

var gulp = require('gulp'),
    nodemon = require('gulp-nodemon'),
    mocha = require('gulp-mocha'),
    jshint = require('gulp-jshint'),
    stylish = require('jshint-stylish');

//
// fail builds if jshint reports an error
gulp.task('jshint', function () {
    gulp.src(['**/*.js', '!node_modules/**/*.js'])
        .pipe(jshint())
        .pipe(jshint.reporter(stylish))
        .pipe(jshint.reporter('fail'));
});

//
// fail mocha builds for test failures
// the .on event handler is to overcome an unknown bug with gulp/supertest/mocha
gulp.task('test', function () {
    return gulp.src(['test/**/test-*.js'], { read: false })
        .pipe(mocha({
            reporter: 'spec',
            timeout: 2000
        }))
        .on('end', function () {
            process.exit(0);
        })
        .on('error', function (err) {
            console.log(err.toString());
            process.exit(1);
        });
});

gulp.task('develop', function () {
    nodemon({ script: 'app.js', ext: 'html js', ignore: ['ignored.js'] })
        .on('restart', function () {
            console.log('restarted!');
        });
});

//The default task (called when you run `gulp`)
gulp.task('default', ['test', 'jshint']);
