var gulp = require('gulp');
var ts = require('gulp-typescript');
var fs = require('fs-extra');
var watchify = require('watchify');

var watchChange = watchify();
gulp.task('default', ['clean'], function () {

    var tsProj = ts.createProject('tsconfig.json', {"module":"commonjs"});

    // server
    var tsResult = gulp.src(
        [
            'src/index.d.ts',
            'src/server/*.ts'
        ]
    ).pipe(ts(tsProj));

    return tsResult.js.pipe(gulp.dest("build/server"));
});


gulp.task('clean', function () {
    fs.emptyDir('./build');
    fs.mkdirs('./build/client');
    fs.mkdirs('./build/server');
});

function build(){
    fs.emptyDir('./build');
    fs.mkdirs('./build/client');
    fs.mkdirs('./build/server');

    var tsProj = ts.createProject('tsconfig.json', {"module":"commonjs"});

    // server
    var tsResult = gulp.src(
        [
            'src/index.d.ts',
            'src/server/*.ts'
        ]
    ).pipe(ts(tsProj));

    return tsResult.js.pipe(gulp.dest("build/server"));
}