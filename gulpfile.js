var   appDir      = 'app/'
    , deploy      = 'deploy/'
    , gulp        = require('gulp')
    , Server      = require('karma').Server
    , ts          = require('gulp-typescript');


gulp.task('build', function () {
    return gulp.src(appDir + '*.ts')
        .pipe(ts({
            noImplicitAny: false,
            out:  'template.js'
        }))
        .pipe(gulp.dest(deploy));
});

gulp.task('test', function (done) {
  return new Server({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done).start();
});



