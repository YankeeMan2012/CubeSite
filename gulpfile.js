var gulp         = require('gulp');
var concatCss    = require('gulp-concat-css');
var notify       = require("gulp-notify");
var autoprefixer = require('gulp-autoprefixer');
var minifyCss    = require('gulp-minify-css');
var sass         = require('gulp-sass');
var sourcemaps   = require('gulp-sourcemaps');
var uglifyJs     = require('gulp-uglify');
var concatJs     = require('gulp-concat');

var paths = {
    src: {
        styles: {
            app: 'src/scss/style.scss',
            appAll: 'src/scss/**/*.scss',
            libs: [
                './node_modules/malihu-custom-scrollbar-plugin/jquery.mCustomScrollbar.css',
                './node_modules/swiper/dist/css/swiper.min.css'
            ]
        },
        scripts: {
            appAll: [
                './src/js/main.js'
            ],
            libs: [
                // './node_modules/element-closest/element-closest.js',
                './node_modules/jquery/dist/jquery.min.js',
                // './node_modules/jquery.maskedinput/src/jquery.maskedinput.js',
                './node_modules/malihu-custom-scrollbar-plugin/jquery.mCustomScrollbar.js',
                './node_modules/swiper/dist/js/swiper.jquery.js',
                './src/js/detect.js'
            ]
        }
    },
    dist: {
        styles: {
            app: {
                file: 'style.css',
                dir: 'web/css'
            },
            libs: {
                file: 'libs.css',
                dir: './web/css'
            }
        },
        scripts: {
            app: {
                file: 'main.js',
                dir: './web/js'
            },
            libs: {
                file: 'libs.js',
                dir: './web/js/libs'
            }
        }
    }
};

gulp.task('scss', function () {
    return gulp.src(paths.src.styles.app)
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer('last 5 versions', '> 1%', 'ie 9'))
        .pipe(minifyCss())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(paths.dist.styles.app.dir))
        .pipe(notify('Done!'));
});

gulp.task('libsCss', function () {
    return gulp.src(paths.src.styles.libs)
        .pipe(concatCss(paths.dist.styles.libs.file))
        .pipe(minifyCss())
        .pipe(gulp.dest(paths.dist.styles.libs.dir));
        // .pipe(notify('Done!'));
});

gulp.task('libsJs', function() {
    return gulp.src(paths.src.scripts.libs)
        .pipe(concatJs(paths.dist.scripts.libs.file))
        .pipe(uglifyJs())
        .pipe(gulp.dest(paths.dist.scripts.libs.dir));
        // .pipe(notify('Done!'))
});

gulp.task('js', function() {
    return gulp.src(paths.src.scripts.appAll)
        .pipe(concatJs(paths.dist.scripts.app.file))
        .pipe(uglifyJs())
        .pipe(gulp.dest(paths.dist.scripts.app.dir));
    // .pipe(notify('Done!'))
});

gulp.task('watch',function(){
    gulp.watch([paths.src.styles.libs],  ['libsCss'] );
    gulp.watch([paths.src.styles.appAll],  ['scss'] );
    // gulp.watch([paths.src.scripts.libs], ['libsJs']  );
    gulp.watch([paths.src.scripts.appAll], ['js']  );
});

gulp.task('default', [
    'scss',
    'libsCss',
    'libsJs',
    'js',
    'watch'
]);