const gulp = require('gulp');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const pump = require('pump');
const babel = require('gulp-babel');

gulp.task('script', function () {
    gulp.src([
        './public/js/alerts.js',
        './public/js/app.js',
        './public/js/item.js',
        './public/js/reports.js',
        './public/js/vehicle.js',
    ])
        .pipe(concat('min.js'))
        /* .pipe(babel({
            presets: ['env'],
        }))
        .pipe(uglify()) */
        .pipe(gulp.dest('./public/js/prod'));
});

gulp.task('default', ['script']);
