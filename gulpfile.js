var gulp = require('gulp');
var ts = require('gulp-typescript');
var fs = require('fs-extra');
var watch = require('gulp-watch');

gulp.task('default', function () {
    watch([
        'src/index.d.ts',
        'src/server/*.ts'
    ], function () {
        build();
    });
});

function build() {
    fs.emptyDir('./build');
    fs.mkdirs('./build/client');
    fs.mkdirs('./build/server');

    var tsProj = ts.createProject('tsconfig.json', { "module": "commonjs" });

    // server
    var tsResult = gulp.src(
        [
            'src/index.d.ts',
            'src/server/*.ts'
        ]
    ).pipe(ts(tsProj));

    return tsResult.js.pipe(gulp.dest("build/server"));
}