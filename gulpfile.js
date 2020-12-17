const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const browserSync = require('browser-sync').create();
const preprocess = require("gulp-preprocess");
const ghPages = require('gulp-gh-pages');
const del = require('del');
const vendor = require('./vendor.json');

const Paths = {
    baseDir: './',
    materialCssDestination: './material-assets/css/',
    materialScssToolkitSources: './material-assets/scss/material-kit.scss',
    materialScss: './material-assets/scss/**/**',
    cssDestination: './styles/css/',
    scssToolkitSources: './styles/scss/styles.scss',
    scss: './styles/scss/**/**',
    htmlPartials: './partials/**/*.html',
    htmlBaseIndex: './partials/index.html',
    js: './js/**.js'
};

gulp.task('html', function () {
    return gulp
        .src(Paths.htmlBaseIndex)
        .pipe(preprocess({ context: {} }))
        .pipe(gulp.dest(Paths.baseDir));
});

gulp.task('reload', function () {
    browserSync.reload();
});

function scssCompile(scssToolkitSources, cssDestination) {
    return gulp.src(scssToolkitSources)
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(sourcemaps.write(Paths.HERE))
        .pipe(gulp.dest(cssDestination))
        .pipe(browserSync.stream());
}

gulp.task('compile-material-scss', function () {
    return scssCompile(Paths.materialScssToolkitSources, Paths.materialCssDestination);
});

gulp.task('compile-scss', function () {
    return scssCompile(Paths.scssToolkitSources, Paths.cssDestination);
});

gulp.task('watch', function () {
    gulp.watch(Paths.materialScss).on('change', gulp.series('compile-material-scss'));
    gulp.watch(Paths.scss).on('change', gulp.series('compile-scss'));
    gulp.watch(Paths.htmlPartials).on('change', gulp.series('html', 'reload'));
    gulp.watch(Paths.js).on('change', gulp.series('reload'));
});

gulp.task('browser-sync', function () {
    browserSync.init({
        server: {
            baseDir: Paths.baseDir
        }
    });
});

gulp.task('gh-pages-clean', function () {
    return del('.publish', { force: true });
});

gulp.task('gh-pages', function () {
    return gulp.src(['./**/*', '.nojekyll', '!partials/**', '!**.scss', '!node_modules/**'])
        .pipe(ghPages());
});

gulp.task('copy-vendor', gulp.series(function () {
    return gulp.src(vendor.css, { cwd: './node_modules/' }).pipe(gulp.dest('./public/css/'));
}, function () {
    return gulp.src(vendor.js, { cwd: './node_modules/' }).pipe(gulp.dest('./public/js/'));
}));

gulp.task('build', gulp.series('copy-vendor', 'compile-material-scss', 'compile-scss', 'html'));

gulp.task('deploy', gulp.series('build', 'gh-pages-clean', 'gh-pages'));

gulp.task('open-app', gulp.parallel(gulp.series('build', 'browser-sync'), 'watch'));