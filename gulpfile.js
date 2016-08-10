var gulp = require('gulp');
var ts = require('gulp-typescript');
var fs = require('fs-extra');

gulp.task('default', ['ts'], function () {
    console.log('complete build');
});

gulp.task('ts', ['clean'], function () {
    // gulp.src('src/**/*.ts')
    //     .pipe(ts())
    //     .js.pipe(gulp.dest('build'));
    var tsProj = ts.createProject('tsconfig.json');
    gulp.src(['src/**/*.ts'])
        .pipe(ts(tsProj))
        .js.pipe(gulp.dest('dist'));
});

gulp.task('clean', function () {
    // fs.emptyDir('./build');
    // fs.mkdirs('./build/client');
    // fs.mkdirs('./build/server');
});