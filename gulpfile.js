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


function html() {
	return src('src/**.html')
		.pipe(include({
			prefix: '@@'
		}))
		.pipe(htmlmin({
			collapseWhitespace: true
		}))
		.pipe(dest('dist'))
}

function scss() {
	return src('src/scss/**.scss')
	.pipe(sass())
	.pipe(autoprefixer())
	.pipe(csso())
	.pipe(concat('main.css'))
	.pipe(dest('dist'))
}

function clear() {
	return del('dist')
}

function scripts() {
	return src([
		'src/js/example.js',
		'src/js/main.js'
	])
	.pipe(concat('main.min.js'))
	.pipe(jsmin())
	.pipe(dest('dist'))
}

//Compress images
function images() {
  compress_images(
    "src/img/**/*.{jpg,JPG,jpeg,JPEG,png,svg,gif}",
    "dist/img/",
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

function serve() {
	sync.init({
		server: {baseDir: './dist'}
	})

	watch('src/**.html', series(html)).on('change', sync.reload)
	watch('src/scss/**.scss', series(scss)).on('change', sync.reload)
	watch('src/js/**.js', series(scripts)).on('change', sync.reload)
}

exports.build = series(clear, scss, html, scripts)
exports.serve = series(clear, scss, html, scripts, serve)
exports.clear = clear
exports.images = images