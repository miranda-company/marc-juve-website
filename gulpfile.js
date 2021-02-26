const { series, parallel, src, dest, watch } = require('gulp');
const sass = require("gulp-sass");
const browserSync = require("browser-sync").create();
const autoprefixer = require("gulp-autoprefixer");
const csso = require("gulp-csso");
const nunjucksRender = require("gulp-nunjucks-render");
const beautify = require("gulp-beautify");
const uglify = require("gulp-uglify");
const concat = require("gulp-concat");

const path = {
    src: "./src/**/*",
    srcHTMLfiles: "./src/**/*.html",
    srcNJKpages: "./src/_pages/**/*.+(html|njk)",
    srcNJKtemplates: "./src/_templates/",
    srcCSSdir: "./src/css/",
    srcCSSfiles: "./src/css/**/*.css",
    srcSCSSdir: "./src/scss",
    srcSCSSfiles: "./src/scss/**/*.scss",
    srcJSdir: "./src/js",
    srcJSfiles: "./src/js/**/*.js",
    srcIMGfiles: "./src/img/**/*",
    srcFONTfiles: "./src/fonts/**/*",

    dist: "./dist",
    distCSSdir: "./dist/css",
    distJSdir: "./dist/js",
    distIMGdir: "./dist/img",
    distFONTSdir: "./dist/fonts"
}

/* 
-------- 
    DEVELOPMENT tasks
    Run: gulp
-------- 
*/

// Converting njk files to html (html partials/templeting)
function nunjucks() {
    // Gets .html and .nunjucks files in pages
    return src(path.srcNJKpages)
        // Renders template with nunjucks
        .pipe(nunjucksRender({
            path: [path.srcNJKtemplates]
        }))
        // beautify htmls
        .pipe(beautify.html({ indent_size: 2 }))
        // output files in app folder
        .pipe(dest("./src"))
        .pipe(browserSync.stream());
}

// Transpile SASS into CSS
function transpileCSS() {
    return src([path.srcSCSSfiles])
        //1. pass the files through sass compiler
        .pipe(sass().on("error", sass.logError))
        //2. pass files to autoprefixer to add vendor prefixes
        .pipe(autoprefixer())
        //3. where do i want to save my compiled css file
        .pipe(dest(path.srcCSSdir))
        //4. stream changes to all browsers
        .pipe(browserSync.stream());
}

function addJSlibs() {
    return src([
        "node_modules/gsap/dist/gsap.min.js",
        "node_modules/jquery/dist/jquery.min.js"])
        .pipe(dest(path.srcJSdir))
        .pipe(browserSync.stream());
}

// Static Server + watching scss, js and html files
function serve() {

    browserSync.init({
        server: "./src"
    });

    watch(path.srcNJKpages, nunjucks);
    watch(path.srcSCSSfiles, transpileCSS);
    watch(path.srcJSfiles).on("change", browserSync.reload);
    watch(path.srcHTMLfiles).on("change", browserSync.reload);
};

/* 
-------- 
    DISTRIBUTE tasks
    Run: gulp dist
-------- 
*/

// Move HTML files from src to dist
function moveHTML() {
    return src(path.srcHTMLfiles)
        .pipe(dest(path.dist));
}

// Move CSS files from src to dist
function moveCSS() {
    return src(path.srcCSSfiles)
        .pipe(csso())
        .pipe(dest(path.distCSSdir));
}

// Move JS files from src to dist
function moveJS() {
    return src(path.srcJSfiles)
        .pipe(dest(path.distJSdir));
}

// Move imgs and media
function moveIMGS() {
    return src(path.srcIMGfiles)
        .pipe(dest(path.distIMGdir));
}

// Move fonts
function moveFONTS() {
    return src(path.srcFONTfiles)
        .pipe(dest(path.distFONTSdir));
}

exports.default = series(parallel(transpileCSS, addJSlibs, nunjucks), serve);
exports.dist = parallel(moveHTML, moveCSS, moveJS, moveIMGS, moveFONTS);