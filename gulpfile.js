var gulp = require('gulp');
var ts = require('gulp-typescript');
var fs = require('fs-extra');
var watch = require('gulp-watch');
var merge = require('merge-stream');
var async = require('async');

gulp.task('default', function () {
    build();
    watch([
        'src'
    ], function () {
        build();
    });
});

function build() {

    fs.emptyDirSync('./build');
    fs.mkdirsSync('./build/client');
    fs.mkdirsSync('./build/server');

    // server
    var stream1 = gulp.src(
        [
            'src/index.d.ts',
            'src/server/*.ts'
        ]
    ).pipe(ts({ module: "commonjs" }))
        .js.pipe(gulp.dest("build/server"));

    // client
    var stream2 = gulp.src([
        'src/client/**/'
    ]).pipe(gulp.dest('build/client'));

    // var stream3 = gulp.src([
    //     'src/client/**/*.ts'
    // ]).pipe(ts({ module: "amd" }))
    //     .js.pipe(gulp.dest('build/client'));
    return merge(stream1, stream2);
}