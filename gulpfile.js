var gulp = require('gulp');
var ts = require('gulp-typescript');
var fs = require('fs-extra');

gulp.task('default', ['clean'], function () {
    var tsProj = ts.createProject('tsconfig.json', {"module":"commonjs"});

    // server
    var tsResult = gulp.src(
        [
            'src/server/*.ts',
            "app.ts"
        ]
    ).pipe(ts(tsProj));

    return tsResult.js.pipe(gulp.dest("build"));
});


gulp.task('clean', function () {
    fs.emptyDir('./build');
    fs.mkdirs('./build/client');
    fs.mkdirs('./build/server');
});