const {src, dest, series, watch} = require('gulp')
const sass = require('gulp-sass')(require('sass'))
const csso = require('gulp-csso')
const include = require('gulp-file-include')
const htmlmin = require('gulp-htmlmin')
const del = require('del')
const concat = require('gulp-concat')
const autoprefixer = require('gulp-autoprefixer')
const sync = require('browser-sync').create()
const jsmin = require('gulp-uglify-es').default
const compress_images = require('compress-images')

// html
function html() {
	return src('src/**.html')
		.pipe(include({
			prefix: '@@'
		}))
		.pipe(dest('dist'))
}

function htmlMin() {
	return src('dist/**.html')
		.pipe(htmlmin({
			collapseWhitespace: true
		}))
		.pipe(dest('dist-min'))
}


// scss css
function scss() {
	return src('src/scss/**.scss')
	.pipe(sass())
	.pipe(autoprefixer())
	.pipe(dest('dist/css'))
}

function cssMin() {
	return src('dist/css/**.css')
	.pipe(csso())
	.pipe(dest('dist-min/css'))
}


// js
function scripts() {
	return src([
		'src/js/main.js'
	])
	.pipe(dest('dist/js'))
}

function scriptsMin() {
	return src([
		'dist/js/main.js'
	])
	.pipe(jsmin())
	.pipe(dest('dist-min/js'))
}


// fonts
function fonts() {
	return src([
		'scr/fonts/*'
	])
	.pipe(dest('dist/fonts'))
}

function fontsMin() {
	return src([
		'dist/fonts/*'
	])
	.pipe(dest('dist-min/fonts'))
}


// plugins
function normalizecss() {
	return src([
		'node_modules/normalize.css/normalize.css'
	])
	.pipe(dest('dist/plugins/normalize.css/'))
}

function normalizecssMin() {
	return src([
		'node_modules/normalize.css/normalize.css'
	])
	.pipe(csso())
	.pipe(dest('dist-min/plugins/normalize.css/'))
}

function swiper() {
	return src([
		'node_modules/swiper/swiper-bundle.min.css',
		'node_modules/swiper/swiper-bundle.min.js'
	])
	.pipe(dest('dist/plugins/swiper'))
}

function swiperMin() {
	return src([
		'node_modules/swiper/swiper-bundle.min.css',
		'node_modules/swiper/swiper-bundle.min.js'
	])
	.pipe(dest('dist-min/plugins/swiper'))
}

function bootstrap() {
	return src([
		'src/plugins/bootstrap/bootstrap-grid.scss',
	])
	.pipe(sass())
	.pipe(dest('dist/plugins/bootstrap/'))
}

function bootstrapMin() {
	return src('dist/plugins/bootstrap/**.css')
	.pipe(csso())
	.pipe(dest('dist-min/plugins/bootstrap/'))
}


// images
function images() {
  return src([
		'src/img/*'
	])
	.pipe(dest('dist/img'))
}

function imagesMin() {
  compress_images(
    "dist/img/**/*.{jpg,JPG,jpeg,JPEG,png,svg,gif}",
    "dist-min/img/",
		{ compress_force: false, statistic: true, autoupdate: true }, false, 
		{ jpg: { engine: "mozjpeg", command: ["-quality", "75"] } }, 
		{ png: { engine: "pngquant", command: ["--quality=75-100", "-o"] } },
		{ svg: { engine: "svgo", command: "--multipass" } },
		{ gif: { engine: "gifsicle", command: ["--colors", "64", "--use-col=web"] } },
    function (err, completed) {
      if (completed === true) {
        // Doing something.
      }
    }
  );
}

// favicon
//


// clear
function clear() {
	return del('dist')
}
function clearMin() {
	return del('dist-min')
}



function serve() {
	sync.init({
		server: {baseDir: './dist'}
	})

	watch('src/**.html', series(html)).on('change', sync.reload)
	watch('src/scss/**.scss', series(scss)).on('change', sync.reload)
	watch('src/js/**.js', series(scripts)).on('change', sync.reload)
}

exports.buildmin = series(fontsMin, normalizecssMin, swiperMin, bootstrapMin, htmlMin, cssMin, scriptsMin, imagesMin)
exports.build = series(clear, fonts, normalizecss, swiper, bootstrap, scss, html, scripts, images)
exports.dev = series(clear, fonts, normalizecss, swiper, bootstrap, scss, html, scripts, images, serve)
exports.clear = series(clear, clearMin)
// exports.images = images