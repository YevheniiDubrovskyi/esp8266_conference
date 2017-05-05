const gulp = require('gulp');
const sass = require('gulp-sass');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');

gulp.task('default', ['js',
                      'sass',
                      'watch']);

gulp.task('watch', () => {
  gulp.watch('./src/sass/*.sass', ['sass']);
  gulp.watch('./src/js/*.js', ['js']);
});

gulp.task('sass', () => {
  gulp.src('./src/sass/*.sass')
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['last 10 versions']
    }))
    .pipe(cleanCSS({
      processImport: false
    }))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('./public/css'))
});

gulp.task('js', () => {
  gulp.src('./src/js/*.js')
    .pipe(uglify())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('./public/js'))
});
