var gulp = require('gulp');
var ts = require('gulp-typescript');
var fs = require('fs-extra');
var watch = require('gulp-watch');
var merge = require('merge-stream');
var async = require('async');
var browserify = require('browserify');
var tsify = require('tsify');
var source = require('vinyl-source-stream');

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
        'src/client/html/*.*',
        '!src/client/html/*.ts'
    ]).pipe(gulp.dest('build/client/html'));

    var stream3 = browserify({
        basedir: '.',
        entries: ['src/client/html/index.ts'],
        debug: true
    })
        .plugin(tsify)
        .bundle()
        .pipe(source('main.js'))
        .pipe(gulp.dest('build/client/html'));
    // var stream3 = gulp.src([
    //     'src/client/**/*.ts'
    // ]).pipe(ts({ module: "amd" }))
    //     .js.pipe(gulp.dest('build/client'));
    return merge(stream1, stream2, stream3);
}