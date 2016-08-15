var gulp = require('gulp');
var ts = require('gulp-typescript');
var fs = require('fs-extra');
var watch = require('gulp-watch');
var merge = require('merge-stream');

gulp.task('default', function () {
    watch([
        'src'
    ], function () {
        build();
    });
});

function build() {
    // fs.emptyDir('./build');
    // fs.mkdirs('./build/client');
    // fs.mkdirs('./build/server');

    var tsProj = ts.createProject('tsconfig.json', { "module": "commonjs" });

    // server
    var stream1 = gulp.src(
        [
            'src/index.d.ts',
            'src/server/*.ts'
        ]
    ).pipe(ts(tsProj))
        .js.pipe(gulp.dest("build/server"));

    var stream2 = gulp.src([
        'src/client/**/'
    ]).pipe(gulp.dest('build/client'));

    return merge(stream1, stream2);
}